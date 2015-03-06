/**
 * Qsspn_model_layoutController
 *
 * @description :: Server-side logic for managing Qsspn_model_layouts
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	'new': function(req,res){
		var username = req.session.User.name;
		Qsspn_model.find(function(err, qms) {		
			if (err) {return res.serverError(err);}		
			User.find(function(err2, usrs) {
				if (err2) {return res.serverError(err2);}
				Lab.find(function(err3, labs) {
					var listUsers=[];
					for (var i=0;i<usrs.length;i++){
						listUsers.push(usrs[i].name);
					}
					
					var inLabs=[];
					for (var j=0;j<labs.length;j++){
						if (labs[j]["users"].indexOf(username)!=-1){
							inLabs.push(labs[j].name)
						}
					}
					var listQms=[];
					for (var i=0;i<qms.length;i++){
						var users = qms[i].users;
						var userIndex = users.indexOf(username);
						
						for (var j=0;j<users.length;j++){
							if ((users[j][0]==username || inLabs.indexOf(users[j][0])!=-1) && users[j][1]!=true){
								var isin=false;
								for (var j1=0;j1<listQms.length;j1++){
									if (listQms[j1]==qms[i].name){
										isin=true;
									}
								}
								if (isin==false){
									listQms.push(qms[i].name);
								}
							}
							
						}
					}
					
					res.view({usrs: listUsers, labs: labs, qms: listQms});
					//return res.view({qms: listQms});
				});
			});
		});
	},
	create: function(req, res, next) {
		//Metabolic_net.findOne({ name: req.param('metabolic_net')}, function foundMtb(merr, mytb) {
		//	if (merr) return next(merr);
			
			var qsspn_model_layoutObj = {
				name: req.param('name'),
				owner: req.param('owner'),
				comment: req.param('comment'),
				users: JSON.parse(req.param('users')),
				qsspn_model: req.param('qsspn_model'),
				layout: JSON.parse('{}')
			}
			Qsspn_model_layout.create(qsspn_model_layoutObj, function mtnlCreated(err, qml) {
				if (err) {
					console.log(err);
					req.session.flash = {
					  err: err
					}

					// If error redirect back to sign-up page
					return res.redirect('/qsspn_model_layout/new');
				}
				qml.save(function(err, qml) {
					if (err) return next(err);
					// add the action attribute to the user object for the flash message.
					qml.action = " metabolic network layout created."
					// Let other subscribed sockets know that the user was created.
					Qsspn_model_layout.publishCreate(qml);
					// After successfully creating the user
					// redirect to the show action
					// From ep1-6: //res.json(user); 
					res.redirect('/qsspn_model_layout/show/' + qml.id);
				});
			});
		//});	 
	},
	show: function(req, res, next) {
		if (req.session.authenticated){
			var username = req.session.User.name;
			Qsspn_model_layout.findOne(req.param('id'), function foundQm(err, qml) {
				if (err) return next(err);
				if (!qml) return next();
				Qsspn_model.findOne({ name: qml.qsspn_model}, function foundQm(err2, qm) {
					if (err2) return next(err2);
					if (!qm) return next();
					Metabolic_net.findOne({ name: qm.metabolic_net}, function foundMtb(err3, mtb) {
						if (err3) return next(err3);
						if (!mtb) return next();
						
						Lab.find(function(err4, labs) {
							if (err4) return next(err4);
							var inLabs=[];
							for (var j=0;j<labs.length;j++){
								if (labs[j]["users"].indexOf(username)!=-1){
									inLabs.push(labs[j].name)
								}
							}
							var goNext =false;
							var users = qml.users;
							for (var j=0;j<users.length;j++){
								if ((users[j][0]==username || inLabs.indexOf(users[j][0])!=-1) && users[j][1]!=true){
									goNext=true;
								}
							}
							if (goNext==true ){
								res.view({
									qml: qml,
									qm: qm,
									mtb: mtb
								});
							}
							else return next();
						});
					});
				});
			});
		}
	},
	index: function(req, res, next) {
		if (req.session.authenticated){
			var username = req.session.User.name;
			// Get an array of all users in the User collection(e.g. table)
			Qsspn_model_layout.find(function foundQms(err, qmls) {
				if (err) return next(err);	
				
				Lab.find(function(err2, labs) {
					if (err2) return next(err2);
					
					// var listLayouts=[];
					// for (var i=0;i<qmls.length;i++){
						// listLayouts.push([qmls[i].id, qmls[i].name, qmls[i].comment, qmls[i].qsspn_model]);
					// }
					// pass the array down to the /views/index.ejs page
					
					var inLabs=[];
					for (var j=0;j<labs.length;j++){
						if (labs[j]["users"].indexOf(username)!=-1){
							inLabs.push(labs[j].name)
						}
					}
					
					var listLayouts=[];
					for (var i=0;i<qmls.length;i++){
						var users = qmls[i].users;
						var userIndex = users.indexOf(username);
						
						for (var j=0;j<users.length;j++){
							if ((users[j][0]==username || inLabs.indexOf(users[j][0])!=-1) && users[j][1]!=true){
								var isin=false;
								for (var j1=0;j1<listLayouts.length;j1++){
									if (listLayouts[j1][0]==qmls[i].id){
										isin=true;
									}
								}
								if (isin==false){
									listLayouts.push([qmls[i].id, qmls[i].name, qmls[i].comment, qmls[i].qsspn_model]);
								}
							}
							
						}
					}
					
					res.view({
						qmls: listLayouts
					});
					
				});
			
			});
		}
	},
	update: function(req, res, next) {
		if (req.session.authenticated){
			var username = req.session.User.name;
			Qsspn_model_layout.findOne(req.param('id'), function foundQm(err, qml) {
				if (err) return next(err);
				if (!qml) return next();
				var stringLayouts=req.param('layouts0')+req.param('layouts1')+req.param('layouts2')+req.param('layouts3')+req.param('layouts4')+req.param('layouts5')+req.param('layouts6')+req.param('layouts7')+req.param('layouts8')+req.param('layouts9');
				var tmp=qml.layout;
				if (req.param('layouts0') ){
					tmp = JSON.parse(stringLayouts);
					//console.log(tmp)
				}
				var QSSPN_net_layoutObj = {
					name: qml.name,
					owner: qml.owner,
					comment: qml.comment,
					users: qml.users,
					qsspn_model: qml.qsspn_model,
					layout: tmp
				}
				Lab.find(function(err3, labs) {
					if (err3) return next(err3);
					var inLabs=[];
					for (var j=0;j<labs.length;j++){
						if (labs[j]["users"].indexOf(username)!=-1){
							inLabs.push(labs[j].name)
						}
					}
					var goNext =false;
					var users = qml.users;
					for (var j=0;j<users.length;j++){
						if ((users[j][0]==username || inLabs.indexOf(users[j][0])!=-1) && users[j][3]==true){
							goNext=true;
						}
					}
					if (goNext==true ){
						Qsspn_model_layout.update(req.param('id'), QSSPN_net_layoutObj, function qmlUpdated(err4) {
							Qsspn_model.findOne({ name: qml.qsspn_model}, function foundMtb(merr, qm) {
								if (merr) return next(merr);
								if (!qm) return next();
								res.redirect('/qsspn_model/show/' + qm.id);
							});
						});
					}
					else return next();
				});
			  
			});
		}
	},
	
	editusers: function(req, res, next) {
		if (req.session.authenticated){
			var username = req.session.User.name;
			Qsspn_model_layout.findOne(req.param('id'), function foundQm(err, qml) {
				if (err) return next(err);
				if (!qml) return next();
				User.find(function(err2, usrs) {
					if (err2) {return res.serverError(err2);}
					Lab.find(function(err3, labs) {
						var listUsers=[];
						for (var i=0;i<usrs.length;i++){
							listUsers.push(usrs[i].name);
						}
						if (qml.owner==req.session.User.name){
							res.view({
								labs: labs,
								usrs: listUsers,
								qmlid: qml.id,
								qmlname: qml.name,
								qmlusers: qml.users
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
			Qsspn_model_layout.findOne(req.param('id'), function foundQm(err, qml) {
				if (err) return next(err);
				if (!qml) return next();
				var metabolic_net_layoutObj = {
					name: qml.name,
					owner: qml.owner,
					comment: qml.comment,
					users: JSON.parse(req.param('users')),
					qsspn_model: qml.qsspn_model,
					layout: qml.layout
				}
				if (qml.owner==req.session.User.name){
					Qsspn_model_layout.update(req.param('id'), metabolic_net_layoutObj, function qmlUpdated(err2) {
						res.redirect('/qsspn_model_layout/show/' + qml.id);
					});
				}
				else return next();
			});
		}
	},
	
	subscribe: function(req, res) {
		// Find all current users in the user model
		Qsspn_model_layout.find(function foundQml(err, qml) {
		  if (err) return next(err);
	 
		  // subscribe this socket to the User model classroom
		  Qsspn_model_layout.subscribe(req.socket);
	 
		  // subscribe this socket to the user instance rooms
		  Qsspn_model_layout.subscribe(req.socket, qml);
	 
		  // This will avoid a warning from the socket for trying to render
		  // html over the socket.
		  res.send(200);
		});
	},
	
	_config: {}
};

