var express = require('express');
var router = express.Router();
var path = require('path');

router
    .use(express.static('/projects'))
    .route('/:project')
    .get(function (req, res) {
        res.sendFile(path.resolve(path.dirname(require.main.filename) + '/public/static/projects/object-fly-simulator/src', 'main.html'));
    });

module.exports = router;
