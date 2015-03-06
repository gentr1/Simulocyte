/**
 * UserController
 *
 * @module    :: Controller
 * @description :: Contains logic for handling requests.
 */

module.exports = {

  // This loads the sign-up page --> new.ejs
  'new': function(req, res) {
    res.view();
  },

  create: function(req, res, next) {
	
    var userObj = {
      name: req.param('name'),
      title: req.param('title'),
      email: req.param('email'),
      password: req.param('password'),
      confirmation: req.param('confirmation')
    }

    // Create a User with the params sent from 
    // the sign-up form --> new.ejs
    User.create(userObj, function userCreated(err, user) {

      // // If there's an error
      // if (err) return next(err);

      if (err) {
        console.log(err);
        req.session.flash = {
          err: err
        }

        // If error redirect back to sign-up page
        return res.redirect('/user/new');
      }

      // Log user in
      req.session.authenticated = true;
      req.session.User = user;

      // Change status to online
      user.online = true;
      user.save(function(err, user) {
        if (err) return next(err);

      // add the action attribute to the user object for the flash message.
      user.action = " signed-up and logged-in."

      // Let other subscribed sockets know that the user was created.
      User.publishCreate(user);

        // After successfully creating the user
        // redirect to the show action
        // From ep1-6: //res.json(user); 

        res.redirect('/user/show/' + user.id);
      });
    });
  },

	// render the profile view (e.g. /views/show.ejs)
	show: function(req, res, next) {
		if (req.session.authenticated){
			var username = req.session.User.name;
			User.findOne(req.param('id'), function foundUser(err, user) {
				if (err) return next(err);
				if (!user) return next();
				Lab.find(function(err2, labs) {
					// Metabolic_net.find(function foundMtns(errm, mtns) {
						// if (errm) return next(errm);
						// Metabolic_net_layout.find(function foundQms(errmtl, mtnls) {
							// if (errmtl) return next(errmtl);	
							// Qsspn_model.find(function foundQms(errq, qms) {
								// if (errq) return next(errq);
								// Qsspn_model_layout.find(function foundQms(errql, qmls) {
									// if (errql) return next(errql);
									
									var ownLabs=[];
									for (var j=0;j<labs.length;j++){
										if (labs[j]["owner"]==username){
											ownLabs.push([labs[j].name,labs[j].id])
										}
									}
									var inLabs=[];
									for (var j=0;j<labs.length;j++){
										if (labs[j]["users"].indexOf(username)!=-1 ){
											var isin=false;
											for (var j1=0;j1<ownLabs.length;j1++){
												if (ownLabs[j1][0]==labs[j].name){
													isin=true;
												}
											}
											if (isin==false){
												inLabs.push([labs[j].name,labs[j].id])
											}
										}
									}
									
									res.view({
										user: user,
										ownlabs: ownLabs,
										inlabs: inLabs
									});
								// });
							// });
						// });
					// });
				});
			});
		}
	},

	seeusers: function(req, res, next) {

    // Get an array of all users in the User collection(e.g. table)
    User.find(function foundUsers(err, users) {
		if (err) return next(err);
			Lab.find(function foundLabs(err2, labs) {
				if (err2) return next(err2);
		
				// pass the array down to the /views/index.ejs page
				res.view({
					users: users,
					labs: labs,
				});
			});
      // pass the array down to the /views/index.ejs page
      
      
    });
  },	
	
	
  index: function(req, res, next) {

    // Get an array of all users in the User collection(e.g. table)
    User.find(function foundUsers(err, users) {
		if (err) return next(err);
			Lab.find(function foundLabs(err2, labs) {
				if (err2) return next(err2);
		
				// pass the array down to the /views/index.ejs page
				res.view({
					users: users,
					labs: labs,
				});
			});
      // pass the array down to the /views/index.ejs page
      
      
    });
  },

  // render the edit view (e.g. /views/edit.ejs)
  edit: function(req, res, next) {

    // Find the user from the id passed in via params
    User.findOne(req.param('id'), function foundUser(err, user) {
      if (err) return next(err);
      if (!user) return next('User doesn\'t exist.');

      res.view({
        user: user
      });
    });
  },

  // process the info from edit view
  update: function(req, res, next) {

    if (req.session.User.admin) {
      var userObj = {
        name: req.param('name'),
        title: req.param('title'),
        email: req.param('email'),
        admin: req.param('admin')
      }
    } else {
      var userObj = {
        name: req.param('name'),
        title: req.param('title'),
        email: req.param('email')
      }
    }

    User.update(req.param('id'), userObj, function userUpdated(err) {
      if (err) {
        return res.redirect('/user/edit/' + req.param('id'));
      }

      res.redirect('/user/show/' + req.param('id'));
    });
  },

  destroy: function(req, res, next) {

    User.findOne(req.param('id'), function foundUser(err, user) {
      if (err) return next(err);

      if (!user) return next('User doesn\'t exist.');

      User.destroy(req.param('id'), function userDestroyed(err) {
        if (err) return next(err);

        // Inform other sockets (e.g. connected sockets that are subscribed) that this user is now logged in
        User.publishUpdate(user.id, {
          name: user.name,
          action: ' has been destroyed.'
        });

        // Let other sockets know that the user instance was destroyed.
        User.publishDestroy(user.id);

      });        

      res.redirect('/user');

    });
  },

  // This action works with app.js socket.get('/user/subscribe') to
  // subscribe to the User model classroom and instances of the user
  // model
  subscribe: function(req, res) {
 
    // Find all current users in the user model
    User.find(function foundUsers(err, users) {
      if (err) return next(err);
 
      // subscribe this socket to the User model classroom
      User.subscribe(req.socket);
 
      // subscribe this socket to the user instance rooms
      User.subscribe(req.socket, users);
 
      // This will avoid a warning from the socket for trying to render
      // html over the socket.
      res.send(200);
    });
  }

};