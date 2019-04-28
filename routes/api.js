var express = require('express');
var router = express.Router();
const screenshot = require('screenshot-desktop');


/* API Router */
router.get('/ss', function (req, res, next) {
    screenshot().then((img) => {
        res.type('jpeg').send(img);
    }).catch((err) => {
        res.send('error: ' + err.message);
    })
});


router.get('/ping', function (req, res, next) {
    res.json({
        status: 'ok'
    });
});

module.exports = router;
