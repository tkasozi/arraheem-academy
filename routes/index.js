/*
 * 
 * Talik A. Kasozi Nov, 16, 2016
 */
/*
 * 
 * @type Module express|Module express
 */
var express = require('express');
var router = express.Router();

var indexJSON = require('../index.json');
var _doc = require('../dataJSON');

var elastic = require('../elasticsearch');

var DEBUG = _doc.save_flag; //Flag set in '../dataJSON'

function daysBetween(date1, date2) {
    //Get 1 day in milliseconds
    var one_day = 1000 * 60 * 60 * 24;

    // Convert both dates to milliseconds
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();

    // Calculate the difference in milliseconds
    var difference_ms = date2_ms - date1_ms;

    console.log(difference_ms);

    // Convert back to days and return
    return Math.round(difference_ms / one_day); 
}

function monthRep(month) {
    var rep = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var count = 0;

    while (rep[count]) {
        if (month === rep[count]) {
            return count;
        }
        count++;
    }
    return -1;
}

function posted(dates) {
    var index, y2k, today = new Date();

    index = monthRep(dates[1]); //Array, from 1 event to last

    y2k = new Date(parseInt(dates[0]), index, parseInt(dates[2]),12,0,0);

    return daysBetween(y2k, today);
}

//get json
router.get('/api/info/:query', function (req, res, next) {
    var _posted = [];

    switch (req.query.category) {
        case "news":

            for (var i = 0; i < indexJSON.news.length; i++) {
                _posted[i] = posted(indexJSON.news[i].editDate);
            }

            res.json({results: indexJSON.news, posted: _posted});
            break;
        case "events":

            for (var i = 0; i < indexJSON.events.length; i++) {
                _posted[i] = posted(indexJSON.events[i].editDate);
            }

            console.log(_posted);

            res.json({results: indexJSON.events, posted: _posted});

            break;
        default:
    }
});

/* GET home page. */
router.get('/', function (req, res, next) {

    if (DEBUG) {
        elastic.indexExists().then(function (exists) {
            if (exists) {
                elastic.deleteIndex();
            }

        }).then(function () {

            elastic.initIndex().then(elastic.initMapping());

            for (var i = 0; i < _doc.pages.length; i++) {
                elastic.addDocument(_doc.pages[i]);
            }
        });
    }

    res.redirect('/dashboard');
});

//dashboard
router.get('/test', function (req, res, next) {
    throw Error;
    //res.render('template/TEST', indexJSON);
});

//dashboard
router.get('/dashboard', function (req, res, next) {
    res.render('index', indexJSON);
});


/* aboutUs page */

router.get('/about', function (req, res, next) {
    res.render('about', _doc.pages[0]);
});

/* Our Academics page*/
router.get('/academics', function (req, res, next) {
    res.render('academics', _doc.pages[1]);
});

/* Our Vision Page*/
router.get('/vision', function (req, res, next) {
    res.render('vision', _doc.pages[2]);
});

/* Islamic Courses page*/
router.get('/courses', function (req, res, next) {
    res.render('courses', _doc.pages[3]);
});

/* Our Academic Studies page*/
router.get('/studies', function (req, res, next) {
    res.render('studies', _doc.pages[4]);

});

/* Our Directory page*/
router.get('/directory', function (req, res, next) {
    res.render('directory', _doc.pages[5]);

});

/* Our Contact page*/
router.get('/contact', function (req, res, next) {
    res.render('contact', _doc.pages[6]);

});

/* Our Mission page*/
router.get('/mission', function (req, res, next) {
    res.render('mission', _doc.pages[7]);

});

/* Our Academics page*/
router.get('/register', function (req, res, next) {
    res.render('register', _doc.pages[8]);

});

module.exports = router;
