const fs = require('fs');
var express = require('express');
var router = express.Router();
const screenshot = require('screenshot-desktop');
const config = require('config');
const exec = require('child_process').exec;
const Encoding = require('encoding-japanese');
const CsvParser = require('../lib/csv-parser');
const multer = require('multer');
const { promisify } = require('util');

/* ScreenShot API */
router.get('/ss', function (req, res, next) {
    screenshot().then((img) => {
        res.type('jpeg').send(img);
    }).catch((err) => {
        res.status(500).send('error: ' + err.message);
    });
});

/* Robopat Status API */
router.get('/robo/status', async function (req, res, next) {
    await execEx(`Powershell "Get-Process -Name ${config.get('processName')} | Select-Object MainWindowTitle, StartTime | ForEach-Object {Write-Host $_.MainWindowTitle ',' $_.StartTime}"`)
        .then((stdout) => {
            var procs = stdout.split(/\n|\r\n|\r/);
            res.json({
                running: true,
                processName: procs.filter(v => v).map((v) => {
                    const _p = v.split(',').map(v => v.trim());
                    return {
                        windowTitle: _p[0],
                        startTime: _p[1]
                    }
                })
            });
        }).catch((err, stderr) => {
            res.json({
                running: false,
                processName: null,
                error: err || stderr
            });
        });
});

/* Robopat Start API */
router.get('/robo/start/:id', async function (req, res, next) {
    const programs = await CsvParser.parse();

    const task = (() => {
        for (const genre of Object.values(programs)) {
            for (const task of genre) {
                if (req.params.id == task.name) return task;
            }
        }
        return null;
    })();

    if (task != null) {
        const baseLogDir = './cache/';
        fs.writeFile(baseLogDir + `${req.params.id}.last`, (() => {
            var dt = new Date();
            return dt.toString();
        })(), err => {
            if (err) console.log(err);
        });
        await execEx(task.command)
            .then((stdout) => {
                res.status(200).json({
                    status: 200
                });
            }).catch((err, stderr) => {
                res.status(500).json({
                    status: 500,
                    error: err.message || stderr
                });
            });
    } else {
        res.status(400).send("Wrong Params");
    }
});

router.post('/robo/command', async function (req, res, next) {
    var status = 200;
    var response = '';
    if (req.body.authKey != config.adminKey) {
        status = 401;
        response = 'ERROR: Unauthenticated Access.';
    } else if (!req.body.command) {
        status = 400;
        response = 'ERROR: Invalid Parameters.';
    } else {
        await execEx(req.body.command)
            .then((stdout) => {
                response = stdout;
            }).catch((err, stderr) => {
                status = 400;
                response = err || stderr;
            });
    }

    res.status(status).json({
        command: req.body.command,
        response: response
    });
});

router.post('/auth', function (req, res, next) {
    if (req.body.key == config.adminKey) {
        res.json({ authorized: true })
    } else {
        res.status(401).json({ authorized: false });
    }
});

router.get('/system/tasklist/lastupdate', async function (req, res, next) {
    const baseDir = './cache/';
    const filelist = (await promisify(fs.readdir)(baseDir)).filter(v => { return v.match(/.+?.last$/); });
    var list = {};
    for (const filename of filelist) {
        try {
            list[filename.split(/\.(?=[^.]+$)/)[0]] = await promisify(fs.readFile)(baseDir + filename, 'utf8')
        } catch (e) {}
    }
    res.json(list);
});

router.post('/system/tasklist', multer({ dest: './config' }).single('file'), (req, res) => {
    if (!req.file.originalname.endsWith('.csv')) {
        res.status(400).send('wrong file');
        return;
    }

    const filename = './config/programs.csv';
    fs.rename(filename, filename + '.bk', function (err) {
        if (err && err.code !== 'ENOENT') {
            console.log(err);
            res.status(500).send(err);
            return;
        }
        fs.rename(req.file.path, filename, function (err) {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            } else {
                res.send('ok');
            }
        });
    });
});

router.post('/system/tasklist/restore', function (req, res, next) {
    const filename = './config/programs.csv';

    fs.rename(filename + '.bk', filename, function (err) {
        if (err) {
            console.log(err);
            if (err.code === "ENOENT") {
                res.status(400).send(err);
            } else {
                res.status(500).send(err);
            }
        } else {
            res.send('ok');
        }
    });
});

router.get('/ping', function (req, res, next) {
    res.json({
        status: 'ok'
    });
});

const execEx = (command) => {
    return new Promise((resolve, reject) => {
        exec(commandNormalize(command), { encoding: 'Shift_JIS' }, (err, stdout, stderr) => {
            if (err) {
                reject(err.message);
            } else if (toString(stderr)) {
                reject(toString(stderr));
            } else {
                resolve(toString(stdout));
            }
        });
    });
}

const commandNormalize = (command) => {
    var trimedCmd = command.trim();
    var regex = new RegExp(/^"([^"]+?).exe"|^(\S+?).exe/);
    if (regex.test(trimedCmd)) {
        return 'START "" ' + trimedCmd;
    } else {
        return trimedCmd;
    }
}

const toString = (bytes) => {
    return Encoding.convert(bytes, {
        to: 'UNICODE',
        type: 'string',
    });
};

module.exports = router;
