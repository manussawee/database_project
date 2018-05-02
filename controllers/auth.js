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
	WHERE student_id = '${student_id}' AND password = '${password}'`;
	mysql.query(query, function(err, result, fields){
	  if(err) throw err;
	  else{
			let token = session.generateToken(32);
			session.tokens[token] = {
				isLogin: true,
				userID: req.body.student_id,
				userType: 'student',
			}
		  is_found = true;
		  var query2 = `SELECT * FROM students A RIGHT JOIN grad_students B\
		    ON A.student_id = B.student_id  WHERE B.student_id = '${student_id}'`;
		  mysql.query(query2, function(err,result,fields){
        if(err) throw err;
		    else{
			    if(result.length != 0){
			      is_grad = true;
						delete result[0].password;
						res.send({
							user: result[0],
							type: 'student',
							token: token,
						});
			    }
			    if(!is_grad){
			      var query3 = `SELECT * FROM students A RIGHT JOIN undergrad_students B\
			        ON A.student_id = B.student_id  WHERE B.student_id = '${student_id}'`;
			      mysql.query(query3,function(err,result,fields){
				      if(err) throw err;
				      else{
								if(result.length) {
									delete result[0].password;
									res.send({
										user: result[0],
										type: 'student',
										token: token,
									});
								}
								else res.send({});
				      }
			      });
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
				let token = session.generateToken(32);
				session.tokens[token] = {
					isLogin: true,
					userID: req.body.instructor_id,
					userType: 'instructor',
				}
				delete result[0].password;
				res.send({
					user: result[0],
					type: 'instructor',
					token: token,
				});
			}
		}
	});
});

router.get('/check', function (req, res) {
  let sql;
	if (req.session.isLogin) {
		if (req.session.userType === 'student') {
			sql = "SELECT * FROM students WHERE student_id = ?";
		}
		else if (req.session.userType === 'instructor') {
			console.log("OK")
			sql = "SELECT * FROM instructors WHERE instructor_id = ?";
		}
		mysql.query(sql, [req.session.userID], function (err, result) {
      console.log("IN");
      if (err) res.send({});
			else {
				if (result.length === 0) res.send({});
				else {
					delete result[0].password;
					res.send({ 
						user: result[0],
						type: req.session.userType,
					});
				}
			}
		});
	}
	else res.send({});
});

router.post('/logout', function (req, res) {
	if (req.query.token && session.tokens[req.query.token]) {
		delete session.tokens[req.query.token];
		res.send({ result: 'OK' });
	}
	else res.send({ result: 'ERROR' });

});

module.exports = router;
