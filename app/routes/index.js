'use strict';

var UserHandler = require( process.cwd() + "/app/controllers/user.js");
var BookHandler = require( process.cwd() + "/app/controllers/book.js");


module.exports = function (app, db) {
	var userHandler = new UserHandler(db);
	var bookHandler = new BookHandler(db);

	app.route('/').get(function (req, res) {
		res.render('index.pug');
	});

	app.route('/saveUser').post(userHandler.saveUser);
	app.route('/loginUser').post(userHandler.loginUser);
	app.route('/myProfile').get(userHandler.myProfile);
	
	app.route('/newBook').get(bookHandler.newBook);
	app.route('/addBook').post(bookHandler.addBook);
	app.route('/listBooks').get(bookHandler.listBooks);
	app.route('/myBooks').get(bookHandler.myBooks);
	app.route('/pics/*').get(bookHandler.pics);

	app.route('/trade').post(bookHandler.trade);
	app.route('/getMyTrades').post(bookHandler.getMyTrades);
	app.route('/updateTrade').post(bookHandler.updateTrade);

	app.route('/favicon.ico').get (function(req, res) {
	    res.sendStatus(204);
	});

	app.route('*').get(function(req,res){ console.log(req.url);return;});

	// app.route('/api/:id/clicks')
	// 	.get(isLoggedIn, clickHandler.getClicks)
	// 	.post(isLoggedIn, clickHandler.addClick)
	// 	.delete(isLoggedIn, clickHandler.resetClicks);

};
