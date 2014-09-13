var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
//    console.log("Hi");
  res.render('index', { title: 'Treehouse' });
});

module.exports = router;

