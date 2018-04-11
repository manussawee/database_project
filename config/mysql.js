var mysql = require('mysql');

module.exports = mysql.createConnection({
    host: "localhost",
    user: "database_project",
    password: "12345678",
    database: "database_project",
});