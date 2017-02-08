'use strict';

function UserHandler(db) {
	
	this.myProfile = function(req,res) {
		res.render('myProfile.pug');
	};


	this.loginUser = function(req,res) {
      db.collection('users', function (err, users) {
      	if (err) throw err;
      	// check if user exists
      	var user = req.body;
      	console.log('find user =',user);
      	users.find({email: req.body.email}).toArray(function (err, doc) {
      		if (err) throw err;
      		if (doc.length === 0) {
      			// found
      			user.error = true;
      			user.errorMsg = "User does not exist in database";
      			res.end(JSON.stringify(user));
      			return;
      		}
      		user=doc[0];
			user.logged = true;
	      	user.error = false;
	      	user.errorMsg = "123";
    	  	res.end(JSON.stringify(user));
      	})
      });
	};
	
	this.saveUser= function(req,res) {
      db.collection('users', function (err, users) {
      	if (err) throw err;
      	// check if user exists
      	var user = req.body.user;
      	var update = req.body.update;
      	users.find({email: user.email}).toArray(function (err, doc) {
      		if (err) throw err;
      		if (doc.length > 0) {
      			// found
      			if (update) {
      				users.update({email: user.email},user);
      				res.end(JSON.stringify(user));
      				console.log(user);
      				return;
      			}
      			user.error = true;
      			user.errorMsg = "User already exist in database";
      			console.log(user);
      			res.end(JSON.stringify(user));
      			return;
      		}
	      	users.insert(user);
			user.logged = true;
	      	user.error = false;
	      	user.errorMsg = "";
    	  	res.end(JSON.stringify(user));
      	})
      });
	};
};

module.exports = UserHandler;