/**
 * FbaPathwayController
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
    'new': function(req,res, next){
		if (req.session.authenticated){
			var username = req.session.User.name;
			User.find(function(err, usrs) {
				if (err) {return res.serverError(err);}
				Lab.find(function(err1, labs) {
					if (err1) {return res.serverError(err1);}
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
					var stringData=req.param('graphdata0')+req.param('graphdata1')+req.param('graphdata2')+req.param('graphdata3')+req.param('graphdata4')+req.param('graphdata5')+req.param('graphdata6')+req.param('graphdata7')+req.param('graphdata8')+req.param('graphdata9');
					var gdata = JSON.parse(stringData);
					return res.view({usrs: listUsers, labs: labs, graphdata: gdata});
				});
			});
		}
	},
	create: function(req, res, next) {
			var openp= true;
			if (!req.param('defaultread')){
				openp= false;
			}
			var stringData=req.param('graphdata0')+req.param('graphdata1')+req.param('graphdata2')+req.param('graphdata3')+req.param('graphdata4')+req.param('graphdata5')+req.param('graphdata6')+req.param('graphdata7')+req.param('graphdata8')+req.param('graphdata9');
			
			//console.log(req.param('name'))
			//console.log(req.param('owner'))
			//console.log(req.param('comment'))
			//console.log(req.param('users'))
			var lusers = req.param('users');
			//console.log(lusers);
			//console.log(lusers.replace(/'/g,""))
			//console.log(JSON.parse(lusers[0]));
			//console.log(luser.replace(/'/g,""));
			//console.log(openp)
			//console.log(JSON.parse(stringData))
			
			
			var fbapathwayObj = {
				name: req.param('name'),
				owner: req.param('owner'),
				comment: req.param('comment'),
				users: JSON.parse(lusers[0]),
				openpolicy: openp,
				graphdata: JSON.parse(stringData)
			}
			FbaPathway.create(fbapathwayObj, function mtnlCreated(err, mtnl) {
				if (err) {
					console.log(err);
					req.session.flash = {
					  err: err
					}

					// If error redirect back to sign-up page
					return res.redirect('/fbapathway/new');
				}
				mtnl.save(function(err, mtnl) {
					if (err) return next(err);
					// add the action attribute to the user object for the flash message.
					mtnl.action = " fba pathway created."
					// Let other subscribed sockets know that the user was created.
					FbaPathway.publishCreate(mtnl);
					// After successfully creating the user
					// redirect to the show action
					// From ep1-6: //res.json(user); 
					res.redirect('/fbapathway/show/' + mtnl.id);
				});
			});
	},
	show: function(req, res, next) {
		if (req.session.authenticated){
			FbaPathway.findOne(req.param('id'), function foundLb(err, ptw) {
				if (err) return next(err);
				if (!ptw) return next();
				//console.log(ptw.users)
				//console.log(ptw.users.indexOf(req.session.User.name))
				var isIn=false;
				for (var elem in ptw.users){
					if (ptw.users[elem][0]==req.session.User.name){
						//console.log(ptw.users[elem][0][1])
						if(ptw.users[elem][1]==false){
							
							isIn=true;
						}
						
					}
				}
				if(isIn){
					res.view({
						graphdata: ptw
					});
				}
				else return next();
			});
		};
	},
	
	index: function(req, res, next) {
		if (req.session.authenticated){
			var username = req.session.User.name;
			// Get an array of all users in the User collection(e.g. table)
			FbaPathway.find(function foundMtns(err, ptws) {
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
					for (var i=0;i<ptws.length;i++){
						var users = ptws[i].users;
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
									if ((listLayouts[j1][0]==ptws[i].id) &&  (listLayouts[j1][1]==users[j][0])){
										isin=true;
									}
								}
								if (isin==false){
									
									if (users[j][3]==true){
										listLayouts.push([ptws[i].id, ptws[i].name, ptws[i].comment, true]);
									}
									else{
										listLayouts.push([ptws[i].id, ptws[i].name, ptws[i].comment, false]);
									}
								}
							}
							
						}
						if (isNotIn && ptws[i].openpolicy && ptws[i].openpolicy==true){
							listLayouts.push([ptws[i].id, ptws[i].name, ptws[i].comment, false]);
						}
					}
					//console.log(listLayouts)
					var uniqueList=[]
					for (var x =0; x< listLayouts.length;x++){
						var isUnique=true; 
						for (elem2 in uniqueList){
							if (listLayouts[x][0]== uniqueList[elem2][0] ){
								isUnique=false;
								if (uniqueList[elem2][3]==false && listLayouts[x][3]==true){
									uniqueList[elem2][3]=true;
								}
							}
						}
						if (isUnique== true){
							uniqueList.push(listLayouts[x]);
						}
					}
					//console.log(uniqueList)
					res.view({
						ptws: uniqueList//listLbs
					});
				});
			});
		}
	},
	edit: function(req, res, next) {
		if (req.session.authenticated){
			var username = req.session.User.name;
			FbaPathway.findOne(req.param('id'), function foundLb(err, ptw) {
				if (err) return next(err);
				if (!ptw) return next();
				Lab.find(function(err2, labs) {
					if (err2) return next(err2);
					var inLabs=[];
					for (var j=0;j<labs.length;j++){
						if (labs[j]["users"].indexOf(username)!=-1){
							inLabs.push(labs[j].name)
						}
					}
					//console.log(ptw.owner)
					var isEditable = false;
					for (elem in ptw.users){
						if ((ptw.users[elem][0]==username || inLabs.indexOf(ptw.users[elem][0])!=-1) && ptw.users[elem][3]==true){
							isEditable = true;
						}
					}
					if(isEditable){
						res.view({
								graphdata: ptw
							});
					}
					else return next();
				});
			});
		}
	},
	
	update: function(req, res, next) {
		if (req.session.authenticated){
			var username = req.session.User.name;
			FbaPathway.findOne(req.param('id'), function foundPtw(err, ptw) {
				if (err) return next(err);
				if (!ptw) return next();
				// // var musers = (typeof req.param('users')=== 'string')?[req.param('users')] : req.param('users');
				// // var owner = ptw.owner;
				// // if (musers.indexOf(owner)==-1){
					// // musers.unshift(owner);
				// // }
				var stringData=req.param('graphdata0')+req.param('graphdata1')+req.param('graphdata2')+req.param('graphdata3')+req.param('graphdata4')+req.param('graphdata5')+req.param('graphdata6')+req.param('graphdata7')+req.param('graphdata8')+req.param('graphdata9');
			
				var fbapathwayObj = {
					name: ptw.name ,
					owner: ptw.owner ,
					comment: req.param('comment'),
					users: ptw.users ,
					openpolicy: ptw.openpolicy ,
					graphdata: JSON.parse(stringData)
				}
				//console.log(fbapathwayObj)
				Lab.find(function(err2, labs) {
					if (err2) return next(err2);
					var inLabs=[];
					for (var j=0;j<labs.length;j++){
						if (labs[j]["users"].indexOf(username)!=-1){
							inLabs.push(labs[j].name)
						}
					}
				
					var isEditable = false;
					for (elem in ptw.users){
						if ((ptw.users[elem][0]==username || inLabs.indexOf(ptw.users[elem][0])!=-1) && ptw.users[elem][3]==true){
							isEditable = true;
						}
					}
					if(isEditable){
						FbaPathway.update(req.param('id'), fbapathwayObj, function ptwUpdated(err) {
							res.redirect('/fbapathway/show/' + ptw.id);
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
			FbaPathway.findOne(req.param('id'), function foundPtw(err, ptw) {
				if (err) return next(err);
				if (!ptw) return next();
				User.find(function(err2, usrs) {
					if (err2) {return res.serverError(err2);}
					Lab.find(function(err3, labs) {
						var listUsers=[];
						for (var i=0;i<usrs.length;i++){
							listUsers.push(usrs[i].name);
						}
						
						if ((ptw.owner==req.session.User.name) || (ptw.owner.split(",")[0]==req.session.User.name)){
							res.view({
								labs: labs,
								usrs: listUsers,
								openpolicy: ptw.openpolicy,
								ptwid: ptw.id,
								ptwname: ptw.name,
								ptwusers: ptw.users
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
			FbaPathway.findOne(req.param('id'), function foundPtw(err, ptw) {
				if (err) return next(err);
				if (!ptw) return next();
				var openp= true;
				if (!req.param('defaultread')){
					openp= false;
				}
				var fbapathwayObj = {
					name: ptw.name ,
					owner: ptw.owner ,
					comment: ptw.comment ,
					users: JSON.parse(req.param('users')) ,
					openpolicy: openp ,
					graphdata: ptw.graphdata
				}
				if ((ptw.owner==req.session.User.name) || (ptw.owner.split(",")[0]==req.session.User.name)){
					FbaPathway.update(req.param('id'), fbapathwayObj, function ptwUpdated(err) {
						res.redirect('/fbapathway/show/' + ptw.id);
					});
				}
				else return next();
			});
		}
	},
					
	subscribe: function(req, res) {
		// Find all current users in the user model
		FbaPathway.find(function foundPath(err, ps) {
		  if (err) return next(err);
	 
		  // subscribe this socket to the User model classroom
		  FbaPathway.subscribe(req.socket);
	 
		  // subscribe this socket to the user instance rooms
		  FbaPathway.subscribe(req.socket, ps);
	 
		  // This will avoid a warning from the socket for trying to render
		  // html over the socket.
		  res.send(200);
		});
	  },
	_config: {}

  
};
