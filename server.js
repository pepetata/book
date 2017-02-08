'use strict';

var express = require('express')
	, app = express()
	, routes = require('./app/routes/index.js')
	, bodyParser = require('body-parser')
	, MongoClient = require('mongodb').MongoClient
	, stylus = require('stylus')
	;

app.set('views', process.cwd() + '/public/views' );
app.set('view engine', 'stylus');
app.use(express.static("public"));
app.use(stylus.middleware( process.cwd() + '/public'));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static(process.cwd() + '/public'));

MongoClient.connect("mongodb://localhost:27017/bookdb", function (err, database) {
	if (err) 
   		console.log('------>>>> Error: Not connected to database');
   	else
		  console.log("MongoDB connected to port 27017");
 
 	routes(app, database);

	var port = process.env.PORT || 8080;
	app.listen(port,  function () {
		console.log('Node.js listening on port ' + port + '...');
	});
});
