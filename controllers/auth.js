let express = require('express');
let router = express.Router();
let mysql = require('../config/mysql');

router.get('/', function (req, res, next) {
	mysql.query("SELECT * FROM students", function (err, result) {
		if (err) console.error(err);
		else res.send(result);
	});
});

router.post('/student', function(req,res){
	let student_id = req.body.student_id;
	let password = req.body.password;
	let is_found = false;
	let is_grad = false;
	const query = `SELECT * FROM students\
	WHERE student_id = ${student_id} AND password = ${password};`;
	mysql.query(query, function(err, result, fields){
	  if(err){
		throw err;
	  }
	  else{
		req.session.userID = student_id;
		is_found = true;
		// return res.send('FOUND');
		let query2 = `SELECT * FROM students A RIGHT JOIN grad_students B\
		  ON A.student_id = B.student_id  WHERE B.student_id = ${student_id}`;
		mysql.query(query2, function(err,result,fields){
		  if(err) throw err;
		  else{
			if(result.length != 0){
			  is_grad = true;
			  return res.send(result);
			}
			if(!is_grad){
			  let query3 = `SELECT * FROM students A RIGHT JOIN undergrad_students B\
			  ON A.student_id = B.student_id  WHERE B.student_id = ${student_id}`;
			  mysql.query(query3,function(err,result,fields){
				if(err) throw err;
				else{
				  return res.send(result);
				}
			  })
			}
		  }
		});
  
	  }
	});
});

router.post('/instructor', function (req, res) {
	let sql = "SELECT * FROM instructors WHERE instructor_id = ? and password = ?";
	mysql.query(sql, [req.body.instructor_id, req.body.password], function (err, result) {
		if (err) res.send({});
		else {
			if (result.length === 0) res.send({});
			else {
				req.session.isLogin = true;
				req.session.userID = req.body.instructor_id;
				req.session.userType = 'instructor';
				delete result[0].password;
				res.send({ user: result[0] });
			}
		}
	});
});

router.get('/check', function (req, res) {
	console.log(req.session.isLogin);
	console.log(req.session.userID);
	console.log(req.session.userType);
	if (req.session.isLogin) {
		if (req.session.userType == 'student') {
			let sql = "SELECT * FROM students WHERE student_id = ?";
		}
		else if (req.session.userType == 'instructor') {
			console.log("OK")
			let sql = "SELECT * FROM instructors WHERE instructor_id = ?";
		}
		mysql.query(sql, [req.session.userID], function (err, result) {
			if (err) res.send({});
			else {
				if (result.length === 0) res.send({});
				else {
					delete result[0].password;
					res.send({ user: result[0] });
				}
			}
		});
	}
	else res.send({});
});

router.post('/logout', function (req, res) {
	req.session.isLogin = false;
	req.session.userID = false;
	req.session.userType = false;
	res.send({ result: 'OK' });

});

module.exports = router;
