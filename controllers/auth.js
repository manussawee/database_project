var express = require('express');
var router = express.Router();
var mysql = require('../config/mysql');

router.get('/', function (req, res, next) {
  mysql.query("SELECT * FROM students", function (err, result) {
    if (err) console.error(err);
    else res.send(result);
  });
});

router.get('/status', function(req, res) {
	res.send(req.session.isLogin ? 'ONLINE' : 'OFFLINE');
});

router.get('/login', function(req, res) {
	req.session.isLogin = true;
	res.send('OK');
});

router.get('/logout', function(req, res) {
	res.send('OK');
});

module.exports = router;
