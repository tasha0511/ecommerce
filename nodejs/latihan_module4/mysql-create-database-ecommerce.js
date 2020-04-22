
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: ""
});

connection.connect(function (err) {
    if (err) {
        throw err;
    }

    console.log("Terkoneksi dengan sukses!");
    connection.query("CREATE DATABASE ecommerce", function (err, result) {
        if (err) {
            throw err;
        }

        console.log("Database telah dibuat!");
        connection.destroy();

    });
});