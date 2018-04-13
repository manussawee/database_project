var express = require('express');
var router = express.Router();
var mysql = require('../config/mysql');

router.get('/', function (req, res, next) {
  mysql.query("SELECT * FROM students", function (err, result) {
    if (err) console.error(err);
    else res.send(result);
  });
});


// Parameter: 
// {course_id: "2112345", section_id: "1", year: "2015", semester: "1"}

// Result: 
// {result: "OK" / "FAIL"}
router.post('/register/add',function(err,result){
  var sql = "INSERT INTO register (\
    `course_id` varchar(32) not null,\
    `section_id` integer not null,\
    `year` integer not null,\
    `semester` integer not null,\
    `student_id` varchar(32) not null,\
    `grade` varchar(8),\
    primary key(`course_id`, `section_id`, `year`, `semester`, `student_id`)\
    ) VALUES (?, ?, ?, ?,?, 'R') ";
  mysql.query(sql,[req.body.course_id, req.body.section_id, req.body.year ,req.body.semester,req.session.userID],function(err,result){
    if(req.session.userType == 'students'){
      
    }
    if (err) console.error(err);
    else res.send(result);
  });
});
module.exports = router;
