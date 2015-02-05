/**
 * Metabolic_net_layoutControllerController
 *
 * @description :: Server-side logic for managing metabolic_net_layoutcontrollers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    'new': function(req,res){
		Metabolic_net.find(function(err, mtbs) {
			if (err) {return res.serverError(err);}
			return res.view({mtbs: _.pluck( mtbs, "name" )});
		});
	},
	create: function(req, res, next) {
		//Metabolic_net.findOne({ name: req.param('metabolic_net')}, function foundMtb(merr, mytb) {
		//	if (merr) return next(merr);
			
			var metabolic_net_layoutObj = {
				name: req.param('name'),
				comment: req.param('comment'),
				metabolic_net: req.param('metabolic_net'),
				layout: JSON.parse('{"list_compartments":[],"compartments_layout":{}, "nodes_layout":{},"nodes_compartments":{}}')
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
		Metabolic_net_layout.findOne(req.param('id'), function foundQm(err, mtnl) {
			if (err) return next(err);
			if (!mtnl) return next();
			Metabolic_net.findOne({ name: mtnl.metabolic_net}, function foundMtb(err2, mtb) {
				if (err2) return next(err2);
				if (!mtb) return next();
		  
				res.view({
					mtnl: mtnl,
					mtb: mtb
				});
		  
			});
		  
		  
		});
	},
	index: function(req, res, next) {
		// Get an array of all users in the User collection(e.g. table)
		Metabolic_net_layout.find(function foundQms(err, mtnls) {
			if (err) return next(err);	
			var listLayouts=[];
			for (var i=0;i<mtnls.length;i++){
				listLayouts.push([mtnls[i].id, mtnls[i].name, mtnls[i].comment, mtnls[i].metabolic_net]);
			}
			// pass the array down to the /views/index.ejs page
			
			
			  res.view({
				mtnls: listLayouts
			  });
		
		});
	},
	update: function(req, res, next) {
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
				comment: mtnl.comment,
				metabolic_net: mtnl.metabolic_net,
				layout: tmp
			}
			Metabolic_net_layout.update(req.param('id'), metabolic_net_layoutObj, function mtnlUpdated(err) {
					res.redirect('/metabolic_net_layout/show/' + mtnl.id);
			});
			
		  
		  
		});
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

