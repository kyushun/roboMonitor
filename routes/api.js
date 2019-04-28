var express = require('express');
var router = express.Router();
const screenshot = require('screenshot-desktop');
const Shell = require('node-powershell');
const iconv = require('iconv-lite');
const config = require('config');


/* API Router */
router.get('/ss', function (req, res, next) {
    screenshot().then((img) => {
        res.type('jpeg').send(img);
    }).catch((err) => {
        res.send('error: ' + err.message);
    });
});

router.get('/robo/status', async function (req, res, next) {
    var cmd = await ps('Get-Process -Name ' + config.get('processName') + ' | Select-Object MainWindowTitle, StartTime | ForEach-Object {Write-Host $_.MainWindowTitle "," $_.StartTime}');
    
    if (cmd.output == null || cmd.err != null) {
        res.json({
            running: false,
            processName: null,
            error: cmd.err
        });
    } else {
        var list = cmd.output.split(/\n|\r\n|\r/);
        res.json({
            running: true,
            processName: list.filter(v => v).map((v) => {
                const _p = v.split(',').map(v => v.trim());
                return {
                    windowTitle: _p[0],
                    startTime: _p[1]
                }
            })
        });
    }
});

router.get('/ping', function (req, res, next) {
    res.json({
        status: 'ok'
    });
});


async function ps(cmd) {
    const ps = new Shell({
        executionPolicy: 'Bypass',
        noProfile: true,
        outputEncoding: 'binary'
    });

    // SJIS     932
    // UTF8     65001
    ps.addCommand('chcp 65001 | Out-Null');
    if (typeof cmd === "string") {
        ps.addCommand(cmd);
    } else if (Array.isArray(cmd)) {
        cmd.forEach(_cmd => {
            ps.addCommand(_cmd);
        });
    }

    var res = {
        output: null,
        err: null
    };

    await ps.invoke()
        .then(output => {
            res.output = iconv.decode(output, "utf-8");
        })
        .catch(err => {
            res.err = iconv.decode(err.message, "utf-8");
        });
    return res;
}

module.exports = router;
