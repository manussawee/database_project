var express = require('express');
var router = express.Router();
var mysql = require('../config/mysql');

router.get('/all', function (req, res, next) {
	const query = 'SELECT * FROM (sections NATURAL JOIN time_slots) NATURAL JOIN courses';

	const promise = new Promise((resolve, reject) => {
		mysql.query(query, function (err, timeSlots) {
			if (err) reject(err);
			else resolve(timeSlots);
		});
	});

	let courses = [];

	promise.then(timeSlots => {

		timeSlots.map(timeSlot => {

			let course = courses.find((course) => course.course_id == timeSlot.course_id);
			if (course == undefined) {
				course = {
					course_id: timeSlot.course_id,
					name: timeSlot.name,
					credit: timeSlot.credit,
					faculty_id: timeSlot.faculty_id,
					sections: [],
				};
				courses.push(course);
			}

			let section = course.sections.find(section => section.section_id == timeSlot.section_id);
			if (section == undefined) {
				section = {
					section_id: timeSlot.section_id,
					year: timeSlot.year,
					semester: timeSlot.semester,
					capacity: timeSlot.capacity,
					building_id: timeSlot.building_id,
					room_id: timeSlot.room_id,
					time_slots: []
				};
				course.sections.push(section);
			}

			section.time_slots.push({
				slot_order: timeSlot.slot_order,
				day: timeSlot.day,
				start_time: timeSlot.start_time,
				end_time: timeSlot.end_time,
			});
		});
		
		res.send({ courses: courses });
	}).catch(err => {
		console.log(err);
		res.send({});
	});

});

router.get('/section',function(req,res){
	let courseID = req.query.course_id;
	let sql = `SELECT * FROM sections WHERE course_id = '${courseID}'`
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
		let query = `SELECT student_id FROM register WHERE course_id = '${req.query.course_id}' \
		AND section_id = '${req.query.section_id}' AND year = '${req.query.year}' AND semester = '${req.query.semester}'`
		mysql.query(query, function(err, result1){
			if(err) return err;
			else{
				const promises = result1.map(result => {
					return new Promise((resolve, reject) => {
						query = `SELECT * FROM students A RIGHT JOIN grad_students B\
						ON A.student_id = B.student_id  WHERE B.student_id = '${result.student_id}'`;
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
									ON A.student_id = B.student_id  WHERE B.student_id = '${result.student_id}'`;
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
