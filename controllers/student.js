let express = require('express');
let router = express.Router();
let mysql = require('../config/mysql');

router.get('/', function (req, res, next) {
  mysql.query("SELECT * FROM students", function (err, result) {
    if (err) console.error(err);
    else res.send(result);
  });
});

router.post('/request', function(req, res, next){
  if(!req.session.isLogin) res.send('FAIL');
  else{
    let query = `INSERT INTO requests (student_id, type) VALUES (${req.session.userID.toString()}, '${req.body.type}')`
    mysql.query(query, function(err, result){
      if(err) return res.send(err);
      else return res.send('OK');
    });
  }
});

router.get('/payment', function(req, res, next){
  if(!req.session.isLogin) res.send('FAIL');
  else{
    let student_id = req.session.userID.toString();
    let query = `SELECT * FROM undergrad_students WHERE student_id=${req.session.userID }`;
    mysql.query(query, function (err, result1){
      if(err || result1.length == 0) return res.send('ERROR');
      else{
        query = `SELECT * FROM students WHERE student_id=${req.session.userID }`;
        mysql.query(query, function (err, result2){
          if(err) return res.send('ERROR');
          else{
            let date  = new Date().getFullYear();
            query = `SELECT * FROM fees WHERE year=${date} AND department_id=${result2[0].department_id}\
            AND faculty_id=${result2[0].faculty_id}`;
            mysql.query(query, function(err, result3){
              if(err) return res.send('ERROR');
              else return res.send(result3);
            });
          }
        });
      }
    });
  }
});

router.post('/register/withdraw', function(req, res, next){
  if(!req.session.isLogin) res.send('FAIL');
  else{
    let course_id = req.body.course_id;
    let section_id = req.body.section_id;
    let year = req.body.year;
    let semester = req.body.semester;
    let student_id = req.session.userID;
    let query = `UPDATE register SET grade = 'W' WHERE course_id=${course_id} AND section_id=${section_id}\
    AND year=${year} AND semester=${semester} AND student_id=${student_id}`;
    mysql.query(query, function(err, result){
      if(err) return res.send('FAIL');
      else{
        return res.send('OK')
      }
    });
  }
});

router.post('/register/remove', function(req, res, next){
  if(!req.session.isLogin) res.send('FAIL');
  else{
    let course_id = req.body.course_id;
    let section_id = req.body.section_id;
    let year = req.body.year;
    let semester = req.body.semester;
    let student_id = req.session.userID;
    console.log(student_id);
    let query1 = `SELECT * FROM undergrad_students WHERE student_id = ${student_id}`;
    mysql.query(query1, function(err, result1){
      if(err){
        console.log('NOT IN UNDERGRAD STUDENTS');
        return res.send('FAIL');
      }
      else{
        let query2 = `DELETE FROM database_project.register WHERE course_id=${course_id} \
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
  }
});

module.exports = router;
