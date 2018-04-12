var express = require('express');
var router = express.Router();
var mysql = require('../config/mysql');

router.get('/', function (req, res, next) {
  mysql.query("SELECT * FROM students", function (err, result) {
    if (err) console.error(err);
    else res.send(result);
  });
});

router.post('/instructor', function (req, res) {
  var sql = "SELECT * FROM instructors WHERE instructor_id = ? and password = ?";
  mysql.query(sql,[req.body.instructor_id, req.body.password ], function (err, result) {
    if (err) res.send({});
    else {
      if(result.length === 0) res.send({});
      else {
				req.session.isLogin = true;
				req.session.userID = req.body.instructor_id;
				req.session.userType = 'instructor';
				res.send({user: result[0]});
			}
    }
  });
});

router.post('/logout', function(req, res) {
  req.session.isLogin = false;
  req.session.userID = false;
  req.session.userType = false;
  res.send({ result: 'OK' });

});

module.exports = router;
