/**
 * LabController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
	'new': function(req,res){
		User.find(function(err, usrs) {
			if (err) {return res.serverError(err);}
			return res.view({usrs: usrs});
		});
	},
	create: function(req, res, next) {
		//socks.socket.emit('welcome', {message: "Hi i'm Laurent and i write shitty articles on my blog"});
		var LabObj = {
		  name: req.param('name'),
		  comment: req.param('comment'),
		  owner: req.param('owner'),
		  users: (typeof req.param('users')=== 'string')?[req.param('users')] : req.param('users')
		}

		// Create a User with the params sent from 
		// the sign-up form --> new.ejs
		Lab.create(LabObj, function lbCreated(err, lb) {

		  // // If there's an error
		  // if (err) return next(err);

		  if (err) {
			console.log(err);
			req.session.flash = {
			  err: err
			}

			// If error redirect back to sign-up page
			return res.redirect('/lab/new');
		  }

		  // Log user in
		  //req.session.authenticated = true;
		  //req.session.User = mtn;

		  // Change status to online
		  //user.online = true;
		  lb.save(function(err, lb) {
			if (err) return next(err);

		  // add the action attribute to the user object for the flash message.
		  lb.action = " lab created."

		  // Let other subscribed sockets know that the user was created.
		 Lab.publishCreate(lb);

			// After successfully creating the user
			// redirect to the show action
			// From ep1-6: //res.json(user); 
			
			res.redirect('/lab/show/' + lb.id);
		  });
		});
	},
	index: function(req, res, next) {
    // Get an array of all users in the User collection(e.g. table)
    Lab.find(function foundMtns(err, lbs) {
      if (err) return next(err);
      // pass the array down to the /views/index.ejs page
      res.view({
        lbs: lbs
      });
    });
	},
	// render the profile view (e.g. /views/show.ejs)
	show: function(req, res, next) {
		Lab.findOne(req.param('id'), function foundLb(err, lb) {
		  if (err) return next(err);
		  if (!lb) return next();
		  res.view({
			lb: lb
		  });
		});
	},
	subscribe: function(req, res) {
		// Find all current users in the user model
		Lab.find(function foundExp(err, lbs) {
		  if (err) return next(err);
	 
		  // subscribe this socket to the User model classroom
		  Lab.subscribe(req.socket);
	 
		  // subscribe this socket to the user instance rooms
		  Lab.subscribe(req.socket, lbs);
	 
		  // This will avoid a warning from the socket for trying to render
		  // html over the socket.
		  res.send(200);
		});
	  },
	_config: {}

  
};
