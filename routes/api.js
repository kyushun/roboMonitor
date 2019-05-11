var express = require('express');
var router = express.Router();
const screenshot = require('screenshot-desktop');
const config = require('config');
const exec = require('child_process').exec;
const Encoding = require('encoding-japanese');
const CsvParser = require('../lib/csv-parser');
const PROGRAMS_LIST = './config/programs.csv';

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
    const programs = CsvParser.parse();

    var id = null;
    for (let i = 0; i < programs.length; i++) {
        if (req.params.id == programs[i].id) {
            id = i;
        }
    }

    if (id != null) {
        await execEx(programs[id].command)
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


router.get('/ping', function (req, res, next) {
    res.json({
        status: 'ok'
    });
});

const execEx = (command) => {
    return new Promise((resolve, reject) => {
        exec(command, { encoding: 'Shift_JIS' }, (err, stdout, stderr) => {
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

const toString = (bytes) => {
    return Encoding.convert(bytes, {
        to: 'UNICODE',
        type: 'string',
    });
};

module.exports = router;
