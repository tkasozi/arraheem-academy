var express = require('express');
var router = express.Router();

var elastic = require('../elasticsearch');

router.get('/:path/:input', function (req, res, next) {
    elastic.performance(req.params.path, req.params.input).then(function (result) {
        if (result.hits.total <= 0) {
            res.json();
        } else {
            res.json(result.hits);
        }
    });
});


module.exports = router;