'use strict';

var ObjectId = require('mongodb').ObjectId; 
var fs =  require('fs');
var formidable = require("formidable");
var form = new formidable.IncomingForm();
form.uploadDir = "./pics";


function BookHandler(db) {

	this.myBooks= function(req,res) {
		res.render(process.cwd() + "/public/views/myBooks.pug");
	};
	
	this.pics= function(req,res) {
		console.log('envinado ',req.path);
		// res.render(process.cwd() + req.path);
		var img = fs.readFileSync(process.cwd() + req.path);
    res.writeHead(200, {'Content-Type': 'image/gif' });
    res.end(img, 'binary');
	};
	
	this.newBook= function(req,res) {
		res.render(process.cwd() + "/public/views/newBook.pug");
	};
	
	this.updateTrade= function(req,res) {
      db.collection('trades', function (err, trades) {
      	if (err) throw err;
      	var trade = req.body;
      	console.log('read', new ObjectId(req.body._id), trade);
      	trades.update({_id: new ObjectId(req.body._id)}, { $set: { status: trade.status } });
      	res.end("");
      });
	};


	this.getMyTrades= function(req,res) {
	  var user = req.body;
	  console.log('procurando ', user);
      db.collection('trades', function (err, trades) {
      	if (err) throw err;
      	trades.find({ $or: [ { bemail: user.email }, { mybemail: user.email } ] }).toArray(function (err, doc) {
      		if (err) throw err;
    	  	res.end(JSON.stringify(doc));
      	})
      });
	};


	this.trade= function(req,res) {
	  var trade = req.body;
      db.collection('trades', function (err, trades) {
      	if (err) throw err;
      	trades.insert(trade);
      	res.end("");
      });
	};


	this.listBooks= function(req,res) {
      db.collection('books', function (err, books) {
      	if (err) throw err;
      	books.find().toArray(function (err, doc) {
      		if (err) throw err;
    	  	res.end(JSON.stringify(doc));
      	})
      });
	};


	this.addBook= function(req,res) {
		console.log('here2');
		form.parse(req, function(err, fields, files) {
			console.log('here1');
		 // console.log(fields,files);
		 var book = fields;
		 book.picFile = files.picFile;
		 db.collection('books', function (err, books) {
		 	if (err) throw err;
		 	// set the imagesource
		 	console.log('here3');
			book.imagesrc = book.image ? book.image : book.picFile.path;
			books.insert(book);
			console.log("inserted new book");
			res.end("");
		});
		});
	};
}

module.exports = BookHandler;