var mysql = require('mysql');

module.exports = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "12345",
    database: "database_project",
});