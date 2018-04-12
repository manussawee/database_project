var express = require('express');
var router = express.Router();
var mysql = require('../config/mysql');

router.get('/', function (req, res, next) {
  mysql.query("SELECT * FROM students", function (err, result) {
    if (err) console.error(err);
    else res.send(result);
  });
});

router.post('/logout', function(req, res) {
  req.session.isLogin = false;
  req.session.userID = false;
  req.session.userType = false;
  res.send({ result: 'OK' });
});

module.exports = router;
