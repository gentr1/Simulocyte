/**
 * Metabolic_net_layoutControllerController
 *
 * @description :: Server-side logic for managing metabolic_net_layoutcontrollers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    'new': function(req,res){
		var username = req.session.User.name;
		User.find(function(err2, usrs) {
			if (err2) {return res.serverError(err2);}
			Lab.find(function(err3, labs) {
				var listUsers=[];
				for (var i=0;i<usrs.length;i++){
					listUsers.push(usrs[i].name);
				}
					
				Metabolic_net.find(function(err, mtbs) {
					if (err) {return res.serverError(err);}
					var inLabs=[];
					for (var j=0;j<labs.length;j++){
						if (labs[j]["users"].indexOf(username)!=-1){
							inLabs.push(labs[j].name)
						}
					}
					var listMtns=[];
					for (var i=0;i<mtbs.length;i++){
						var users = mtbs[i].users;
						var userIndex = users.indexOf(username);
						var isNotIn=true;
						for (var j=0;j<users.length;j++){
							if (users[j][0]==username){
								isNotIn=false;
							}
						}
						for (var j=0;j<users.length;j++){
							if ((users[j][0]==username || inLabs.indexOf(users[j][0])!=-1) && users[j][1]!=true){
								var isin=false;
								for (var j1=0;j1<listMtns.length;j1++){
									if (listMtns[j1]==mtbs[i].name){
										isin=true;
									}
								}
								if (isin==false){
									listMtns.push(mtbs[i].name);
								}
							}
							
						}
						if (isNotIn && mtbs[i].openpolicy && mtbs[i].openpolicy==true){
							listMtns.push(mtbs[i].name);
						}
					}
					
					//console.log(listMtns)
					
					res.view({usrs: listUsers, labs: labs, mtbs: listMtns});
				});
			});
		});
	},
	create: function(req, res, next) {
		//Metabolic_net.findOne({ name: req.param('metabolic_net')}, function foundMtb(merr, mytb) {
		//	if (merr) return next(merr);
			var openp= true;
			if (!req.param('defaultread')){
				openp= false;
			}
			var metabolic_net_layoutObj = {
				name: req.param('name'),
				owner: req.param('owner'),
				comment: req.param('comment'),
				users: JSON.parse(req.param('users')),
				openpolicy: openp,
				metabolic_net: req.param('metabolic_net'),
				layout: JSON.parse('{"list_compartments":[],"compartments_layout":{}, "nodes_layout":{},"nodes_compartments":{}, "currency_nodes":[]}')
			}
			Metabolic_net_layout.create(metabolic_net_layoutObj, function mtnlCreated(err, mtnl) {
				if (err) {
					console.log(err);
					req.session.flash = {
					  err: err
					}

					// If error redirect back to sign-up page
					return res.redirect('/metabolic_net_layout/new');
				}
				mtnl.save(function(err, mtnl) {
					if (err) return next(err);
					// add the action attribute to the user object for the flash message.
					mtnl.action = " metabolic network layout created."
					// Let other subscribed sockets know that the user was created.
					Metabolic_net_layout.publishCreate(mtnl);
					// After successfully creating the user
					// redirect to the show action
					// From ep1-6: //res.json(user); 
					res.redirect('/metabolic_net_layout/show/' + mtnl.id);
				});
			});
		//});	 
	},
	show: function(req, res, next) {
		if (req.session.authenticated){
			var username = req.session.User.name;
			Metabolic_net_layout.findOne(req.param('id'), function foundQm(err, mtnl) {
				if (err) return next(err);
				if (!mtnl) return next();
				Metabolic_net.findOne({ name: mtnl.metabolic_net}, function foundMtb(err2, mtb) {
					if (err2) return next(err2);
					if (!mtb) return next();
					
					Lab.find(function(err3, labs) {
						if (err3) return next(err3);
						var inLabs=[];
						for (var j=0;j<labs.length;j++){
							if (labs[j]["users"].indexOf(username)!=-1){
								inLabs.push(labs[j].name)
							}
						}
						var goNext =false;
						var users = mtnl.users;
						for (var j=0;j<users.length;j++){
							if ((users[j][0]==username || inLabs.indexOf(users[j][0])!=-1) && users[j][1]!=true){
								goNext=true;
							}
						}
						var isNotIn=true;
						for (var j=0;j<users.length;j++){
							if (users[j][0]==username){
								isNotIn=false;
							}
						}
						if (goNext==true ){
							res.view({
								mtnl: mtnl,
								mtb: mtb
							});
						}
						else if (isNotIn && mtnl.openpolicy==true){
							res.view({
								mtnl: mtnl,
								mtb: mtb
							});
						}
						else return next();
					});
				});
			  
			  
			});
		}
	},
	
	editusers: function(req, res, next) {
		if (req.session.authenticated){
			var username = req.session.User.name;
			Metabolic_net_layout.findOne(req.param('id'), function foundQm(err, mtnl) {
				if (err) return next(err);
				if (!mtnl) return next();
				User.find(function(err2, usrs) {
					if (err2) {return res.serverError(err2);}
					Lab.find(function(err3, labs) {
						var listUsers=[];
						for (var i=0;i<usrs.length;i++){
							listUsers.push(usrs[i].name);
						}
						if (mtnl.owner==req.session.User.name){
							res.view({
								labs: labs,
								usrs: listUsers,
								openpolicy: mtnl.openpolicy,
								mtnlid: mtnl.id,
								mtnlname: mtnl.name,
								mtnlusers: mtnl.users
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
			Metabolic_net_layout.findOne(req.param('id'), function foundQm(err, mtnl) {
				if (err) return next(err);
				if (!mtnl) return next();
				var openp= true;
				if (!req.param('defaultread')){
					openp= false;
				}
				var metabolic_net_layoutObj = {
					name: mtnl.name,
					owner: mtnl.owner,
					comment: mtnl.comment,
					users: JSON.parse(req.param('users')),
					openpolicy: openp,
					metabolic_net: mtnl.metabolic_net,
					layout: mtnl.layout
				}
				if (mtnl.owner==req.session.User.name){
					Metabolic_net_layout.update(req.param('id'), metabolic_net_layoutObj, function mtnlUpdated(err2) {
						res.redirect('/metabolic_net_layout/show/' + mtnl.id);
					});
				}
				else return next();
			});
		}
	},
	
	index: function(req, res, next) {
		if (req.session.authenticated){
			var username = req.session.User.name;
			// Get an array of all users in the User collection(e.g. table)
			Metabolic_net_layout.find(function foundQms(err, mtnls) {
				if (err) return next(err);	
				
				Lab.find(function(err2, labs) {
					if (err2) return next(err2);
					var inLabs=[];
					for (var j=0;j<labs.length;j++){
						if (labs[j]["users"].indexOf(username)!=-1){
							inLabs.push(labs[j].name)
						}
					}
					
					var listLayouts=[];
					for (var i=0;i<mtnls.length;i++){
						var users = mtnls[i].users;
						var userIndex = users.indexOf(username);
						var isNotIn=true;
						for (var j=0;j<users.length;j++){
							if (users[j][0]==username){
								isNotIn=false;
							}
						}
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
								}
							}
							
						}
						if (isNotIn && mtnls[i].openpolicy && mtnls[i].openpolicy==true){
							listLayouts.push([mtnls[i].id, mtnls[i].name, mtnls[i].comment, mtnls[i].metabolic_net]);
						}
					}
					//var listLayouts=[];
					//for (var i=0;i<mtnls.length;i++){
					//	listLayouts.push([mtnls[i].id, mtnls[i].name, mtnls[i].comment, mtnls[i].metabolic_net]);
					//}
					// pass the array down to the /views/index.ejs page
				
				
				    res.view({
						mtnls: listLayouts
				    });
				});
			});
		}
	},
	update: function(req, res, next) {
		if (req.session.authenticated){
			var username = req.session.User.name;
			Metabolic_net_layout.findOne(req.param('id'), function foundQm(err, mtnl) {
				if (err) return next(err);
				if (!mtnl) return next();
				var stringLayouts=req.param('layouts0')+req.param('layouts1')+req.param('layouts2')+req.param('layouts3')+req.param('layouts4')+req.param('layouts5')+req.param('layouts6')+req.param('layouts7')+req.param('layouts8')+req.param('layouts9');
				var tmp=mtnl.layout;
				if (req.param('layouts0') ){
					tmp = JSON.parse(stringLayouts);
					//console.log(tmp)
				}
				var metabolic_net_layoutObj = {
					name: mtnl.name,
					owner: mtnl.owner,
					comment: mtnl.comment,
					users: mtnl.users,
					openpolicy: mtnl.openpolicy,
					metabolic_net: mtnl.metabolic_net,
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
					var users = mtnl.users;
					for (var j=0;j<users.length;j++){
						if ((users[j][0]==username || inLabs.indexOf(users[j][0])!=-1) && users[j][3]==true){
							goNext=true;
						}
					}
					if (goNext==true ){
						Metabolic_net_layout.update(req.param('id'), metabolic_net_layoutObj, function mtnlUpdated(err) {
								res.redirect('/metabolic_net_layout/show/' + mtnl.id);
						});
					}
					else return next();
				});
			  
			});
		}
	},
	subscribe: function(req, res) {
		// Find all current users in the user model
		Metabolic_net_layout.find(function foundMtnl(err, mtnl) {
		  if (err) return next(err);
	 
		  // subscribe this socket to the User model classroom
		  Metabolic_net_layout.subscribe(req.socket);
	 
		  // subscribe this socket to the user instance rooms
		  Metabolic_net_layout.subscribe(req.socket, mtnl);
	 
		  // This will avoid a warning from the socket for trying to render
		  // html over the socket.
		  res.send(200);
		});
	},
	_config: {}
};

