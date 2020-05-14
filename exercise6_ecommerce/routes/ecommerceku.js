
exports.home = function (req, res) {
    req.getConnection(function (err, connect) {
        var query = connect.query('select * from product', function (err, rows) {
            if (err) {
                console.log('Error Message: %', err);
            }

            res.render('index', {
                page_title: "Ecommerce Luxury Watch",
                data: rows
            });
        });
    });
}

exports.products = function (req, res) {
    req.getConnection(function (err, connect) {
        var query = connect.query('select * from product', function (err, rows) {
            if (err) {
                console.log('Error Message: %', err);
            }

            res.render('products', {
                page_title: "Ecommerce Luxury Watch - Products",
                data: rows
            });
        });
    });
}

exports.products_details = function (req, res) {
    var id_product = req.params.id_product;
    req.getConnection(function (err, connect) {
        var query = connect.query('select * from product where id_product=?', id_product, function (err, rows) {
            if (err) {
                console.log('Error Message: %', err);
            }

            res.render('single', {
                page_title: "Ecommerce Luxury Watch - Product Details",
                data: rows
            });
        });
    });
}