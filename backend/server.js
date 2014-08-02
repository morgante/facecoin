var express = require('express');
var bodyParser = require('body-parser');

var MongoClient = require('mongodb').MongoClient;

var mongo_url = process.env.MONGOLAB_URI || 'mongodb://127.0.0.1:27017/facecoin';

var app = express();

app.use(bodyParser.json());
app.set('views', __dirname + '/../views');
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs-locals'));
app.use(express.static(__dirname + '/../public'));

MongoClient.connect(mongo_url, function(err, db) {

	function saveOrder(order, cb) {
		if(err) throw err;

		var collection = db.collection('orders');
		collection.insert(order, function(err, docs) {
			if (err) {
				throw err;
			}

			cb(err, docs[0]);
		});
	}

	app.post('/orders', function(req, res) {
		var order = req.body;

		saveOrder(order, function(err, doc) {
			res.send({
				"id": doc._id
			});
		});
	});
});

app.get('/', function(req, res) {
	res.render("index", {
	});
});

var port = process.env.PORT || 3000;

app.listen(port);

console.log('listening on %s', port);

