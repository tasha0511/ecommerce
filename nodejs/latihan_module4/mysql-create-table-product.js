
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "ecommerce"
});

connection.connect(function (err) {
    if (err) {
        throw err;
    }

    console.log("Terkoneksi dengan sukses!");

    var sql = "CREATE TABLE product(id_product INT(11), nama_product VARCHAR(60), gambar_product VARCHAR(200), harga_product INT(130), des_product TEXT, createdate DATE, PRIMARY KEY(id_product))";
    connection.query(sql, function (err, result) {
        if (err) {
            throw err;
        }

        console.log("Tabel berhasil dibuat!");
        connection.destroy();

    });
});