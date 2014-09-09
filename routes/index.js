var express = require('express');
var router = express.Router();

var message = require('../public/javascripts/Message');

var query = message.Message.where({name: "George"});
var msg = null;
query.findOne(function (err, kitten) {
    if (err) return handleError(err);
    if (kitten) {
        // doc may be null if no document matched
//        console.log(kitten);
        msg = kitten;
//        console.log(msg);
    }
});

//message1.save(function (err, msg) {
//    if (err) return console.error(err);
//    msg.speak();
//});
//message.Message.find(function (err, messages) {
//        if (err) return console.error(err);
//        console.log(messages);
//        message1 = message[0];
//    });
//
//console.log(message1);


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {name : msg.name, note: msg.message });
});

module.exports = router;

