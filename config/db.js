
var mysql = require('mysql2');
require('dotenv').config()


var conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

conn.connect(function (err) {
    if (err) throw err;
    console.log('fitsyncx connected')
})

module.exports = conn;