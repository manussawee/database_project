var express = require('express');
var router = express.Router();
var mysql = require('../config/mysql');

router.get('/', function (req, res, next) {
  mysql.query("SELECT * FROM users", function (err, result) {
    if (err) console.error(err);
    else res.send(result);
  });
});

router.post('/course/grade', function(req, res, next){
  let body = req.body;
  let query = `UPDATE register SET grade=${body.grade} WHERE course_id=${body.course_id}\
  AND year=${body.year} AND semester=${body.semester} AND student_id=${body.student_id}
  AND section_id=${body.section_id}`;
  mysql.query(query, function(err, result){
    if(err) return res.send('FAIL');
    else return res.send('OK');
  });
});

module.exports = router;
