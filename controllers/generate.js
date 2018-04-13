var express = require('express');
var router = express.Router();
var mysql = require('../config/mysql');

router.get('/database', function (req, res, next) {
  const queries = [
    "create table `courses` (\
      `course_id` varchar(32) not null,\
      `name` varchar(128) null,\
      `credit` int null,\
      `faculty_id` varchar(32) null,\
      primary key(`course_id`)\
    )",
    "create table `sections` (\
      `course_id` varchar(32) not null,\
      `section_id` int not null,\
      `year` int not null,\
      `semester` int not null,\
      `capacity` int null,\
      `building_id` int null,\
      `room_id` int null,\
      primary key(`course_id`, `section_id`, `year`, `semester`) \
    )",
    "create table `time_slots` (\
      `course_id` varchar(32) not null,\
      `section_id` int not null,\
      `year` int not null,\
      `semester` int not null,\
      `slot_order` int not null,\
      `day` enum('sunday','monday','tuesday','wednesday','thursday','friday','saturday'),\
      `start_time` time null,\
      `end_time` time null,\
      primary key(`course_id`, `section_id`, `year`, `semester`, `slot_order`)\
    )",
    "create table `instructors` (\
      `instructor_id` varchar(32) not null,\
      `citizen_id` varchar(32) not null,\
      `name` varchar(128) not null,\
      `password` varchar(128) not null,\
      `faculty_id` varchar(32) not null,\
      `department_id` varchar(32) not null,\
      primary key(`instructor_id`)\
    )",
    "create table `students` (\
      `citizen_id` varchar(32) not null,\
      `name` varchar(128) not null,\
      `student_id` varchar(32) not null,\
      `password` varchar(32) not null,\
      `program` varchar(32) null,\
      `advisor_id` varchar(32) not null,\
      `faculty_id` varchar(32) not null,\
      `department_id` varchar(32) not null,\
      primary key(`student_id`)\
    )",
    "create table `grad_students` (\
      `student_id` varchar(32) not null,\
      `graduated_date` date null,\
      primary key(`student_id`)\
    )",
    "create table `undergrad_students` (\
      `student_id` varchar(32) not null,\
      `year` int null,\
      `started_date` date null,\
      primary key(`student_id`)\
    )",
    "create table `register` (\
      `course_id` varchar(32) not null,\
      `section_id` integer not null,\
      `year` integer not null,\
      `semester` integer not null,\
      `student_id` varchar(32) not null,\
      `grade` varchar(8),\
      primary key(`course_id`, `section_id`, `year`, `semester`, `student_id`)\
    )",
    "create table `teach` (\
      `course_id` varchar(32) not null,\
      `section_id` integer not null,\
      `year` integer not null,\
      `semester` integer not null,\
      `instructor_id` varchar(32) not null,\
      primary key(`course_id`, `section_id`, `year`, `semester`, `instructor_id`)\
    )",
    "create table `requests` (\
      `request_id` int not null auto_increment,\
      `student_id` varchar(32) not null,\
      `type` enum('transcript', 'graduate'),\
      primary key(`request_id`, `student_id`, `type`)\
    )",
    "create table `faculties` (\
      `faculty_id` varchar(32) not null,\
      `name` varchar(128) not null,\
      primary key(`faculty_id`)\
    )",
    "create table `departments` (\
      `faculty_id` varchar(32) not null,\
      `department_id` varchar(32) not null,\
      `name` varchar(128) not null,\
      primary key(`faculty_id`, `department_id`)\
    )",
    "create table `buildings` (\
      `faculty_id` varchar(32) not null,\
      `building_id` varchar(32) not null,\
      `name` varchar(128) not null,\
      `location` varchar(256) null,\
      primary key(`faculty_id`, `building_id`)\
    )",
    "create table `rooms` (\
      `building_id` varchar(32) not null,\
      `room_id` varchar(32) not null,\
      `floor` integer null,\
      `seat` integer null,\
      primary key(`building_id`, `room_id`)\
    )",
    "create table `fees` (\
      `fee_id` integer not null,\
      `type` varchar(64) not null,\
      `cost` float null,\
      `year` integer null,\
      `department_id` varchar(32) null,\
      `faculty_id` varchar(32) null,\
      primary key(`fee_id`)\
    )",
    "create table `pay` (\
      `fee_id` integer not null,\
      `student_id` varchar(32) not null,\
      primary key(`fee_id`, `student_id`)\
    )"
  ];

  const promises = queries.map((query, index) => {
    return new Promise((resolve, reject) => {
      mysql.query(query, function (err, result) {
        if (err) reject(err);
        else resolve();
      });
    });
  });

  Promise.all(promises)
    .then(() => res.send('SUCCESS'))
    .catch(err => res.send(err));

});

module.exports = router;
