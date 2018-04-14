var express = require('express');
var router = express.Router();
var mysql = require('../config/mysql');

router.get('/', function (req, res, next) {
  mysql.query("SELECT * FROM users", function (err, result) {
    if (err) console.error(err);
    else res.send(result);
  });
});

router.get('/advisees',function(req,res){
  if(req.session.userType === 'instructor'){
    let userID = req.session.userID;
    let sql = `SELECT S.student_id, course_id, year,semester, grade \
              FROM students S INNER JOIN register R ON S.student_id = R.student_id
              WHERE advisor_id = ${userID};`
    let result = [];
    console.log(userID);
    mysql.query(sql,function(err,students){
      console.log(students);
      if (err) res.send({});
      else{
        students.map((student,index) =>{
          result.push(student);
          console.log(students.length-1);
          if(index === students.length-1) {
            console.log("OK3");
            res.send({'students' : result});
          }
        });
      }
    });
  }
  else res.send({});
});

// Result: 
// {students: students (array of object)}

module.exports = router;
