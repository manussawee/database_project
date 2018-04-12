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
  var sql = "SELECT * FROM instructors I WHERE I.instructor_id = ? and I.password = ?";
  mysql.query(sql,[req.body.instructor_id, req.body.password ], function (err, result) {
    if (err) console.log("ERROR");
    else {
      req.session.userID = req.body.instructor_id;
      req.session.isLogin = true;
      console.log(req.session.userID);
      console.log(req.session.isLogin);
      res.send(result);
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
