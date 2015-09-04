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
			User.find(function(err, usrs) {
				if (err) {return res.serverError(err);}
				Lab.find(function(err1, labs) {
					if (err1) {return res.serverError(err1);}
					var stringData=req.param('graphdata0')+req.param('graphdata1')+req.param('graphdata2')+req.param('graphdata3')+req.param('graphdata4')+req.param('graphdata5')+req.param('graphdata6')+req.param('graphdata7')+req.param('graphdata8')+req.param('graphdata9');
					var gdata = JSON.parse(stringData);
					return res.view({usrs: usrs, labs: labs, graphdata: gdata});
				});
			});
		}
	},
	// create: function(req, res, next) {
		// if (req.session.authenticated){
			
			// var musers = (typeof req.param('users')=== 'string')?[req.param('users')] : req.param('users');
			// var owner = req.param('owner');
			// if (musers.indexOf(owner)==-1){
				// musers.unshift(owner);
			// }
			// var LabObj = {
			  // name: req.param('name'),
			  // comment: req.param('comment'),
			  // owner: req.param('owner'),
			  // users: musers
			// }
			// Lab.create(LabObj, function lbCreated(err, lb) {
			  // if (err) {
				// console.log(err);
				// req.session.flash = {
				  // err: err
				// }
				// return res.redirect('/lab/new');
			  // }
			  // lb.save(function(err, lb) {
				// if (err) return next(err);
			  // lb.action = " lab created."
			 // // Let other subscribed sockets know that the user was created.
			 // Lab.publishCreate(lb);
			// // After successfully creating the user
				// // redirect to the show action
				// // From ep1-6: //res.json(user); 
				
				// res.redirect('/lab/show/' + lb.id);
			  // });
			// });
		// }
	// },
	// index: function(req, res, next) {
		// if (req.session.authenticated){
			// // Get an array of all users in the User collection(e.g. table)
			// Lab.find(function foundMtns(err, lbs) {
				// if (err) return next(err);
				// // filter labs index view by authorized users
				// //var listLbs=[];
				// //for (var i=0;i<lbs.length;i++){
				// //	if (lbs[i].users.indexOf(req.session.User.name)!=-1){
				// //		listLbs.push(lbs[i]);
				// //	}
				// //}
				// res.view({
					// lbs: lbs//listLbs
				// });
			// });
		// }
	// },
	// // render the profile view (e.g. /views/show.ejs)
	// show: function(req, res, next) {
		// if (req.session.authenticated){
			// Lab.findOne(req.param('id'), function foundLb(err, lb) {
				// if (err) return next(err);
				// if (!lb) return next();
				// if (lb.users.indexOf(req.session.User.name)!=-1){
					// res.view({
						// lb: lb
					// });
				// }
				// else return next();
			// });
		// };
	// },
	// edit: function(req, res, next) {
		// if (req.session.authenticated){
			// Lab.findOne(req.param('id'), function foundLb(err, lb) {
				// if (err) return next(err);
				// if (!lb) return next();
				// User.find(function(err2, usrs) {
					// if (err2) {return res.serverError(err2);}
						// if (lb.owner==req.session.User.name){
							// res.view({
								// lb: lb,
								// usrs: usrs
							// });
						// }
						// else return next();
				// });
			// });
		// }
	// },
	
	// update: function(req, res, next) {
		// if (req.session.authenticated){
			// Lab.findOne(req.param('id'), function foundLb(err, lb) {
				// if (err) return next(err);
				// if (!lb) return next();
				// var musers = (typeof req.param('users')=== 'string')?[req.param('users')] : req.param('users');
				// var owner = lb.owner;
				// if (musers.indexOf(owner)==-1){
					// musers.unshift(owner);
				// }
				// var LabObj = {
				  // name: lb.name,
				  // comment: req.param('comment'),
				  // owner: lb.owner,
				  // users: musers
				// }
				// if (lb.owner==req.session.User.name){
					// Lab.update(req.param('id'), LabObj, function lbUpdated(err) {
						// res.redirect('/lab/show/' + lb.id);
					// });
				// }
				// else return next();
			// });
		// }
	// },
					
	subscribe: function(req, res) {
		// Find all current users in the user model
		FbaPathway.find(function foundExp(err, lbs) {
		  if (err) return next(err);
	 
		  // subscribe this socket to the User model classroom
		  FbaPathway.subscribe(req.socket);
	 
		  // subscribe this socket to the user instance rooms
		  FbaPathway.subscribe(req.socket, lbs);
	 
		  // This will avoid a warning from the socket for trying to render
		  // html over the socket.
		  res.send(200);
		});
	  },
	_config: {}

  
};
