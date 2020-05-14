
var ecommerce = require('express');
var app = ecommerce();
var logger = require('morgan');


var ecommerceku = require('./routes/ecommerceku');

var conn = require('express-myconnection');
var mysql = require('mysql');

app.set('port', process.env.port || 3000);
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use('/public',ecommerce.static(__dirname + '/public'));

app.use(
    conn(mysql, {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'ecommerce_product'
    }, 'single')
);


app.get('/', function (req, res) {
    res.send('Server is running on port ' + app.get('port'));
});

app.get('/exercise6_ecommerce', ecommerceku.home);
app.get('/exercise6_ecommerce/index', ecommerceku.home);
app.get('/exercise6_ecommerce/products', ecommerceku.products);
app.get('/exercise6_ecommerce/single/:id_product', ecommerceku.products_details);

app.listen(app.get('port'), function () {
    console.log('Server is running on port ' + app.get('port'));
});
