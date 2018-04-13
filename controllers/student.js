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
router.post('/register/withdraw', function(req, res, next){
  var course_id = req.body.course_id;
  var section_id = req.body.section_id;
  var year = req.body.year;
  var semester = req.body.semester;
  var student_id = req.session.userID;
  var query = `UPDATE register SET grade = 'W' WHERE course_id=${course_id} AND section_id=${section_id}\
  AND year=${year} AND semester=${semester} AND student_id=${student_id}`;
  mysql.query(query, function(err, result){
    if(err) return res.send('FAIL');
    else{
      return res.send('OK')
    }
  });
});

router.post('/register/remove', function(req, res, next){
  var course_id = req.body.course_id;
  var section_id = req.body.section_id;
  var year = req.body.year;
  var semester = req.body.semester;
  var student_id = req.session.userID;
  console.log(student_id);
  var query1 = `SELECT * FROM undergrad_students WHERE student_id = ${student_id}`;
  mysql.query(query1, function(err, result1){
    if(err){
      console.log('NOT IN UNDERGRAD STUDENTS');
      return res.send('FAIL');
    }
    else{
      var query2 = `DELETE FROM database_project.register WHERE course_id=${course_id} \
      AND section_id=${section_id} AND year=${year} AND semester=${semester} AND student_id=${student_id};`;
      mysql.query(query2, function(err, result2){
        if(err){
          console.log('UNABLE TO REMOVE REGISTERED COURSE');
          return res.send('FAIL');
        }
        else return res.send('OK');
      });
    }
  });
});

module.exports = router;
