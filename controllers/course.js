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

module.exports = router;
