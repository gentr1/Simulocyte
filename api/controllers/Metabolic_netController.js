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
		User.find(function(err, usrs) {
			if (err) {return res.serverError(err);}
			Lab.find(function(err2, labs) {
			
				var listUsers=[];
				for (var i=0;i<usrs.length;i++){
					listUsers.push(usrs[i].name);
				}
				
				res.view({usrs: listUsers,labs: labs});
			
			});
		});
	},
	
	create: function(req, res, next) {
		if (req.session.authenticated){
			var username = req.session.User.name;
			//socks.socket.emit('welcome', {message: "Hi i'm Laurent and i write shitty articles on my blog"});
			if (req.method === 'POST') {           
				// read temporary file
				fs.readFile(req.files.myfile.path, function (err, data) {
					var metabolic_netObj = {
					  name: req.param('name'),
					  owner: req.param('owner'),
					  comment: req.param('comment'),
					  users: JSON.parse(req.param('users')),
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
						User.findOne({ name: username}, function foundUser(merr, user) {
							var list_metabolic_nets=user.metabolic_nets;
							if (list_metabolic_nets.indexOf(mtn.name)==-1){
								list_metabolic_nets.push(mtn.name);
							}
							
							var userObj = {
							  name: user.name,
							  title: user.title,
							  email: user.email,
							  encryptedPassword: user.encryptedPassword,
							  online: user.online,
							  admin: user.admin,
							  metabolic_nets: list_metabolic_nets,
							  models: user.models,
							  rooms: user.rooms
							}
							User.update(user.id, userObj, function usrUpdated(erru) {
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
					});
				});
			}
		}
    },
	
	// render the profile view (e.g. /views/show.ejs)
	show: function(req, res, next) {
		
		if (req.session.authenticated){
			var username = req.session.User.name;
			Metabolic_net.findOne(req.param('id'), function foundMtn(err, mtn) {
				if (err) return next(err);
				if (!mtn) return next();
				
				//req.session.User.name
				
				Metabolic_net_layout.find({ metabolic_net: mtn.name}, function foundMtnls(err2, mtnls) {
					//console.log(Object.keys(mtn))
					if (err2) return next(err2);
					if (!mtnls) return next();
					
					Lab.find(function(err3, labs) {
						if (err3) return next(err3);
						var inLabs=[];
						for (var j=0;j<labs.length;j++){
							if (labs[j]["users"].indexOf(username)!=-1){
								inLabs.push(labs[j].name)
							}
						}
					
						var mtnlID="";
						if (req.param('mtnl-id')){	
							mtnlID=req.param('mtnl-id');
						}
						var mtnl={};
						var listLayouts=[];
						
						for (var i=0;i<mtnls.length;i++){
							var users = mtnls[i].users;
							var userIndex = users.indexOf(username);
							
							for (var j=0;j<users.length;j++){
								if ((users[j][0]==username || inLabs.indexOf(users[j][0])!=-1) && users[j][1]!=true){
									var isin=false;
									for (var j1=0;j1<listLayouts.length;j1++){
										if (listLayouts[j1][0]==mtnls[i].id){
											isin=true;
										}
									}
									if (isin==false){
										listLayouts.push([mtnls[i].id, mtnls[i].name, mtnls[i].comment, mtnls[i].metabolic_net]);
										if (mtnlID!="" && mtnlID==mtnls[i].id){
											mtnl =mtnls[i];
										}
									}
								}
								
							}
						}
						
						
						// for (var i=0;i<mtnls.length;i++){
							// listLayouts.push([mtnls[i].id, mtnls[i].name, mtnls[i].comment]);
							// if (mtnlID!="" && mtnlID==mtnls[i].id){
								// mtnl =mtnls[i];
							// }
						// }
						var goNext =false;
						var users = mtn.users;
						for (var j=0;j<users.length;j++){
							if ((users[j][0]==username || inLabs.indexOf(users[j][0])!=-1) && users[j][1]!=true){
								goNext=true;
							}
						}
						if (goNext==true ){
							res.view({
								mtn: mtn,
								mtnls: listLayouts,
								mtnl: mtnl
							});
						}
						else return next();
					});
					
				});

				
			});
		}
	},
	
	// render the profile view (e.g. /views/show.ejs)
	editusers: function(req, res, next) {
		if (req.session.authenticated){
			var username = req.session.User.name;
			Metabolic_net.findOne(req.param('id'), function foundMtn(err, mtn) {
				User.find(function(err2, usrs) {
					if (err2) {return res.serverError(err2);}
					Lab.find(function(err3, labs) {
						var listUsers=[];
						for (var i=0;i<usrs.length;i++){
							listUsers.push(usrs[i].name);
						}
						if (mtn.owner==req.session.User.name){
							res.view({
								labs: labs,
								usrs: listUsers,
								mtnid: mtn.id,
								mtnname: mtn.name,
								mtnusers: mtn.users
							});
						}
						else return next();
					});
				});
			});
		}
	},
	
	updateusers: function(req, res, next) {
		if (req.session.authenticated){
			var username = req.session.User.name;
			Metabolic_net.findOne(req.param('id'), function foundLb(err, mtn) {
				if (err) return next(err);
				if (!mtn) return next();
				var metabolic_netObj = {
				  name: mtn.name,
				  owner: mtn.owner,
				  comment: mtn.comment,
				  users: JSON.parse(req.param('users')),
				  file: mtn.file
				}
				if (mtn.owner==req.session.User.name){
					Metabolic_net.update(req.param('id'), metabolic_netObj, function mtnUpdated(err2) {
						User.findOne({ name: username}, function foundUser(merr, user) {
							var list_metabolic_nets=user.metabolic_nets;
							if (list_metabolic_nets.indexOf(mtn.name)==-1){
								list_metabolic_nets.push(mtn.name);
							}
							var userObj = {
							  name: user.name,
							  title: user.title,
							  email: user.email,
							  encryptedPassword: user.encryptedPassword,
							  online: user.online,
							  admin: user.admin,
							  metabolic_nets: list_metabolic_nets,
							  models: user.models,
							  rooms: user.rooms
							}
							User.update(user.id, userObj, function usrUpdated(erru) {
								res.redirect('/metabolic_net/show/' + mtn.id);
							});
						});
					});
					
				}
				else return next();
			});
		}
	},
	
	index: function(req, res, next) {
		// Get an array of all users in the User collection(e.g. table)
		if (req.session.authenticated){
			var username = req.session.User.name;
			Metabolic_net.find(function foundMtns(err, mtns) {
			  if (err) return next(err);
			  Lab.find(function(err2, labs) {
				if (err2) return next(err2);
					var inLabs=[];
					for (var j=0;j<labs.length;j++){
						if (labs[j]["users"].indexOf(username)!=-1){
							inLabs.push(labs[j].name)
						}
					}
					var listMtns=[];
					for (var i=0;i<mtns.length;i++){
						var users = mtns[i].users;
						var userIndex = users.indexOf(username);
						
						for (var j=0;j<users.length;j++){
							if ((users[j][0]==username || inLabs.indexOf(users[j][0])!=-1) && users[j][1]!=true){
								var isin=false;
								for (var j1=0;j1<listMtns.length;j1++){
									if (listMtns[j1][0]==mtns[i].id){
										isin=true;
									}
								}
								if (isin==false){
									listMtns.push([mtns[i].id, mtns[i].name, mtns[i].comment, mtns[i].file[0].length, mtns[i].file[1].length, mtns[i].file[2].length]);
								}
							}
							
						}
					}
					
					
					
					// pass the array down to the /views/index.ejs page
					res.view({
					mtns: listMtns
					});
				});
			  
			});
		}
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
