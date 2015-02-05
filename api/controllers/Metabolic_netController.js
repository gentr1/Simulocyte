/**
 * Metabolic_netController
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
var fs = require('fs');
module.exports = {

    'new': function(req,res){
		res.view();
	},
	
	create: function(req, res, next) {
		//socks.socket.emit('welcome', {message: "Hi i'm Laurent and i write shitty articles on my blog"});
		if (req.method === 'POST') {           
            // read temporary file
            fs.readFile(req.files.myfile.path, function (err, data) {
				var metabolic_netObj = {
				  name: req.param('name'),
				  comment: req.param('comment'),
				  file: JSON.parse(data)
				  //file: req.param('file')
				  //var file = req.files.file,
				}
				//console.log(req.files.myfile);
				// Create a User with the params sent from 
				// the sign-up form --> new.ejs
				Metabolic_net.create(metabolic_netObj, function mtnCreated(err, mtn) {
				
				  // // If there's an error
				  // if (err) return next(err);

				  if (err) {
					console.log(err);
					req.session.flash = {
					  err: err
					}

					// If error redirect back to sign-up page
					return res.redirect('/metabolic_net/new');
				  }
					
				  // Log user in
				  //req.session.authenticated = true;
				  //req.session.User = mtn;

				  // Change status to online
				  //user.online = true;
				  mtn.save(function(err, mtn) {
					if (err) return next(err);

				  // add the action attribute to the user object for the flash message.
				  mtn.action = " metabolic network all created."

				  // Let other subscribed sockets know that the user was created.
				 Metabolic_net.publishCreate(mtn);

					// After successfully creating the user
					// redirect to the show action
					// From ep1-6: //res.json(user); 

					res.redirect('/metabolic_net/show/' + mtn.id);
				  });
				});
			});
		}
    },
	
	// render the profile view (e.g. /views/show.ejs)
	show: function(req, res, next) {
		Metabolic_net.findOne(req.param('id'), function foundMtn(err, mtn) {
			if (err) return next(err);
			if (!mtn) return next();
			Metabolic_net_layout.find({ metabolic_net: mtn.name}, function foundMtnls(err2, mtnls) {
				//console.log(Object.keys(mtn))
				if (err2) return next(err2);
				if (!mtnls) return next();
				var mtnlID="";
				if (req.param('mtnl-id')){	
					mtnlID=req.param('mtnl-id');
				}
				var mtnl={};
				var listLayouts=[];
				for (var i=0;i<mtnls.length;i++){
					listLayouts.push([mtnls[i].id, mtnls[i].name, mtnls[i].comment]);
					if (mtnlID!="" && mtnlID==mtnls[i].id){
						mtnl =mtnls[i];
					}
				}
				
				res.view({
					mtn: mtn,
					mtnls: listLayouts,
					mtnl: mtnl
				});
			});

			
		});
	},
	
	
	
	index: function(req, res, next) {
		// Get an array of all users in the User collection(e.g. table)
		Metabolic_net.find(function foundMtns(err, mtns) {
		  if (err) return next(err);
		  var listMtns=[];
		  for (var i=0;i<mtns.length;i++){
				listMtns.push([mtns[i].id, mtns[i].name, mtns[i].comment, mtns[i].file[0].length, mtns[i].file[1].length, mtns[i].file[2].length]);
		  }
		  // pass the array down to the /views/index.ejs page
		  res.view({
			mtns: listMtns
		  });
		});
	},
	subscribe: function(req, res) {
		// Find all current users in the user model
		Metabolic_net.find(function foundM(err, mtns) {
		  if (err) return next(err);
	 
		  // subscribe this socket to the User model classroom
		  Metabolic_net.subscribe(req.socket);
	 
		  // subscribe this socket to the user instance rooms
		  Metabolic_net.subscribe(req.socket, mtns);
	 
		  // This will avoid a warning from the socket for trying to render
		  // html over the socket.
		  res.send(200);
		});
	},
	
  _config: {}

  
};
