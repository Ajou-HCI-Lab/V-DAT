var mysql = require('mysql2/promise');

var pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_DATABASE,
    port: 3306,
    timezone: "+09:00",
    multipleStatements: true

});

exports.pool = pool;
