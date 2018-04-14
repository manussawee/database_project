var express = require('express');
var router = express.Router();
var mysql = require('../config/mysql');

router.get('/all', function (req, res, next) {
	const mapRegisterStudent = (section, registers) => new Promise((resolve, reject) => {
		const promises = registers.map(register => {
			return new Promise((resolve, reject) => {
				let queryStudent = 'SELECT * FROM students WHERE student_id = ?';
				mysql.query(queryStudent, [register.student_id], (err, students) => {
					if (err) return reject(err);
					delete students[0].password;
					section.students.push(students[0]);
					students[0].grade = register.grade;
					resolve();
				});
			});
		});

		Promise.all(promises).then(() => {
			resolve();
		}).catch((err) => {
			reject(err);
		});
	});

	const mapSectionRegister = (sections) => new Promise((resolve, reject) => {
		const promises = sections.map(section => {
			return new Promise((resolve, reject) => {
				section.students = [];
				let queryRegisters = 'SELECT * FROM register WHERE course_id = ? AND section_id = ? AND year = ? AND semester = ?';
				mysql.query(queryRegisters, [
					section.course_id,
					section.section_id,
					section.year,
					section.semester,
				], (err, registers) => {
					if (err) return reject(err);
					mapRegisterStudent(section, registers).then(() => {
						resolve();
					}).catch((err) => {
						reject(err)
					});
				});
			});
		});

		Promise.all(promises).then(() => {
			resolve();
		}).catch((err) => {
			reject(err);
		});
	});

	const mapCourseSection = (courses) => new Promise((resolve, reject) => {
		const promises = courses.map((course) => {
			return new Promise((resolve, reject) => {
				let querySection = 'SELECT * FROM sections WHERE course_id = ?';
				mysql.query(querySection, [course.course_id], (err, sections) => {
					if (err) return reject(err);
					course.sections = sections;
					mapSectionRegister(sections).then(() => {
						resolve();
					}).catch((err) => {
						reject(err);
					});
				});
			});
		});

		Promise.all(promises).then(() => {
			resolve();
		}).catch((err) => {
			reject(err);
		});
	});

	const query = 'SELECT * FROM courses';
	mysql.query(query, function (err, courses) {
		if (err) console.error(err);
		else mapCourseSection(courses).then(() => {
			res.send({ courses: courses });
		}).catch((err) => {
			res.send({});
		});
	});

});

router.get('/section',function(req,res){
	let courseID = req.query.course_id;
	let sql = `SELECT * FROM sections WHERE course_id = ${courseID};`
    let result = [];
    mysql.query(sql,function(err,sections){
      console.log(sections);
      if (err) res.send({});
	  else  res.send({'sections' : sections});
    });
});
router.get('/section/student', function(req, res, next){
	if(!req.session.isLogin) res.send('FAIL');
	else{
		let student_info = [];
		let query = `SELECT student_id FROM register WHERE course_id=${req.query.course_id} \
		AND section_id=${req.query.section_id} AND year=${req.query.year} AND semester=${req.query.semester}`
		mysql.query(query, function(err, result1){
			if(err) return err;
			else{
				const promises = result1.map(result => {
					return new Promise((resolve, reject) => {
						query = `SELECT * FROM students A RIGHT JOIN grad_students B\
						ON A.student_id = B.student_id  WHERE B.student_id = ${result.student_id}`;
						mysql.query(query, function(err,grad_student,fields){
							if(err) reject(err);
							else{
								if(grad_student.length != 0){
									delete grad_student[0].password;
									student_info.push(grad_student[0]);
									resolve(grad_student)
								}
								else{
									console.log('part3')
									query = `SELECT * FROM students A RIGHT JOIN undergrad_students B\
									ON A.student_id = B.student_id  WHERE B.student_id = ${result.student_id}`;
									mysql.query(query,function(err,ungrad_student,fields){
									if(err) reject(err);
									else{
										delete ungrad_student[0].password;
										student_info.push(ungrad_student[0]);
										resolve(ungrad_student);
									}
									})
								}
							}
						});
					});
				});
				Promise.all(promises).then(()=>res.send(student_info));
			}
		});
	}
});

module.exports = router;
