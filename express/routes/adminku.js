
var multer = require('multer');

exports.login = function (req, res) {
    var message = '';
    var sess = req.session;
    var md5 = require('md5');

    if (req.method == 'POST') {
        // Jika route method-nya adalah post, lakukan proses autentikasi login!

        // 1. tangkap nilai dari atribut pada body (index.ejs)
        var post = req.body;

        // 2. tangkap nilai atribut name dari form input username dan password
        var name = post.username;
        //var pass = post.password;

        var pass = md5(post.password);

        // 3. lakukan koneksi dan query data admin
        req.getConnection(function(err,connect) {
            var sql = "SELECT id_admin, username, name, admin_level from admin_tbl WHERE username='"+name+"' AND password='"+pass+"'";
            var query = connect.query(sql, function(err, results) {
                if (results.length) {
                    // jika hasil query ada, daftarkan session dan alihkan ke halaman home admin!
                    req.session.adminId = results[0].id_admin;
                    req.session.admin = results[0];
                    console.log(results[0].id_admin);
                    res.redirect('./home');
                } else {
                    // jika hasil query tidak ada, kirimkan error message dan tampilkan layout form login!
                    message = 'Username or password incorrect! please try again.';
                    res.render('./admin/index', {
                        message: message                      
                    });
                }
            });
        });
    } else {
        // Jika route method-nya bukan post, tampilkan layout form login!
        res.render('./admin/index', {
            message: message
        });
    }
}

/*
exports.home = function (req, res) {
    res.render('./admin/home');
}
*/

exports.home = function (req, res) {
    var admin = req.session.admin;
    var adminId = req.session.adminId;
    console.log('id_admin' + adminId);

    if (admin == null) {
        res.redirect('/express/admin/login');
        return;
    }

    req.getConnection(function(err,connect) {
        var sql = "SELECT * from news_tbl order by createdate desc";
        
        var query = connect.query(sql, function (err, results) {
            // jika koneksi dan query berhasil, tampilkan home admin!
            res.render('./admin/home', {
                pathname: 'home',
                data: results
            });
        });
    });
}

exports.add_news = function (req, res) {
    res.render('./admin/home', {
        pathname: 'add_news'
    });
}

exports.process_add_news = function (req, res) {
    var storage = multer.diskStorage({
        destination: './public/news_images',
        filename: function (req, file, callback) {
            callback(null, file.originalname);
        }
    });

    var upload = multer({ storage: storage }).single('image');
    var date = new Date(Date.now());

    upload(req, res, function (err) {
        if (err) {
            return res.end('Error uploading image!');
        }

        console.log(req.file);
        console.log(req.body);

        req.getConnection(function (err, connect) {
            // tangkap nilai atau value dari body (atribut name)
            var post = {
                title: req.body.title,
                description: req.body.description,
                images: req.file.filename,
                createdate: date
            }
            
            console.log(post); // untuk menampilkan data post di console

            var sql = "insert into news_tbl set ?";

            var query = connect.query(sql, post, function (err, results) {
                if (err) {
                    console.log('error input news: %s', err);
                }
                req.flash('info', 'Success add data! Data has been inserted.');
                res.redirect('/express/admin/home');
            });
        });
    });
}


exports.edit_news = function (req, res) {
    // tangkap id news dari link edit
    var id_news = req.params.id_news;

    req.getConnection(function (err, connect) {
        var sql = "select * from news_tbl where id_news=?";

        var query = connect.query(sql, id_news, function (err, results) {
            if (err) {
                console.log('error edit news: %s', err);
            }
            res.render('./admin/home', {
                id_news: id_news,
                pathname: 'edit_news',
                data: results
            });
        });
    });
}

exports.process_edit_news = function (req, res) {
    var id_news = req.params.id_news; //console.log(id_news);

    var storage = multer.diskStorage({
        destination: './public/news_images',
        filename: function (req, file, callback) {
            callback(null, file.originalname);
        }
    });

    var upload = multer({ storage: storage }).single('image');
    var date = new Date(Date.now());

    upload(req, res, function (err) {
        if (err) {
            var image = req.body.image_old;
            console.log("error uploading image!");
        } else if (req.file == undefined) {
            var image = req.body.image_old;
        } else {
            var image = req.file.filename;
        }

        console.log(req.file);
        console.log(req.body);

        req.getConnection(function (err, connect) {
            var post = {
                title: req.body.title,
                description: req.body.description,
                images: req.file.filename,
                createdate: date
            }

            // console.log(post);
            
            var sql = "update news_tbl set ? where id_news=?";

            //console.log(sql);

            var query = connect.query(sql, [post, id_news], function (err, results) {
                if (err) {
                    console.log('error edit news: %s', err);
                }
                // req.flash('info', 'Success edit data! Data has been updated.');
                res.redirect('/express/admin/home');
            });
        });
    });
}

