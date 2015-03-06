/**
 * app.js
 *
 * This file contains some conventional defaults for working with Socket.io + Sails.
 * It is designed to get you up and running fast, but is by no means anything special.
 *
 * Feel free to change none, some, or ALL of this file to fit your needs!
 */


(function (io) {

  // as soon as this file is loaded, connect automatically, 
  var socket = io.connect();
  if (typeof console !== 'undefined') {
    log('Connecting to Sails.js...');
  }
  
  socket.on('connect', function socketConnected() {

    console.log("This is from the connect: ", this.socket.sessionid);

    // Listen for the socket 'message'
    socket.on('message', cometMessageReceivedFromServer);

    // Subscribe to the user model classroom and instance room
    socket.get('/user/subscribe');
	socket.get('/experiment/subscribe');
	socket.get('/metabolic_net/subscribe');
	socket.get('/metabolic_net_layout/subscribe');
	socket.get('/qsspn_model/subscribe');
	socket.get('/qsspn_model_layout/subscribe');
	socket.get('/lab/subscribe');
	socket.get('/fbaexperiment/subscribe');

    ///////////////////////////////////////////////////////////
    // Here's where you'll want to add any custom logic for
    // when the browser establishes its socket connection to 
    // the Sails.js server.
    ///////////////////////////////////////////////////////////
    log(
        'Socket is now connected and globally accessible as `socket`.\n' + 
        'e.g. to send a GET request to Sails, try \n' + 
        '`socket.get("/", function (response) ' +
        '{ console.log(response); })`'
    );
    ///////////////////////////////////////////////////////////

  });


  // Expose connected `socket` instance globally so that it's easy
  // to experiment with from the browser console while prototyping.
  window.socket = socket;


  // Simple log function to keep the example simple
  function log () {
    if (typeof console !== 'undefined') {
      console.log.apply(console, arguments);
    }
  }
  

})(

  // In case you're wrapping socket.io to prevent pollution of the global namespace,
  // you can replace `window.io` with your own `io` here:
  window.io

);

// This function routes the message based upon the model which issued it
function cometMessageReceivedFromServer(message) {

  console.log("Here's the message: ", message);

  // Okay, I need to route this message to the appropriate place.

  // This message has to do with the User Model
  if (message.model === 'user') {
    var userId = message.id
    updateUserInDom(userId, message);

    if(message.verb !== "destroy") {
      displayFlashActivity(message);  
    } 
  }  
  if (message.model === 'experiment') {
	//console.log("experiment update message id: "+message.id +" ... " +message.data.results)
	var page = document.location.pathname;
	page = page.replace(/(\/)$/, '');
	if (page==('/experiment/show/'+message.id)){
		if (message.verb === 'update') {
			console.log("message exp results: "+message.data.results);
			setTimeout(function() {
				location.reload();
			}, 2000);
			//process.nextTick(function(){
			//	location.reload();
			//});
			
			
		}
		//if (message.verb === 'update') {
			//res.redirect('/experiment/show/'+message.id);
			//console.log("updating a lot");
		//	var rs = JSON.parse(message.data.results);
		//	var tab= document.getElementById("tableResults");
		//	if (tab.rows.length>1){
		//		for (var i=1;i<tab.rows.length;i++){
		//			tab.deleteRow(i);
		//		}
		//	}
			//console.log(tab.rows.length)
			//location.reload();
		//	for (var i=0;i<rs.length;i++){
		//		var rw= tab.insertRow(-1);
		//		var cell1 = rw.insertCell(0);
		//		var cell2 = rw.insertCell(1);
		//		var cell3 = rw.insertCell(2);
		//		cell1.innerHTML = "Trajectory nb "+i;
		//		cell2.innerHTML = "processed";
				
			//	console.log(rs[i]["nb"]+" "+rs[i]["status"]);
				//var $resRow = $('tr[data-id="' + rs[i]["nb"] + '"]');
				//$resRow.children().eq(1).replaceWith('<td style="font-size:15px;">processed<td>');
				//$resRow.remove();
				//$resRow.children().eq(1).html("processed");
				//console.log($resRow.children());
				//console.log($resRow.children().eq(1));
				//$resRow.children().eq(2).replaceWith();
		//	}
			
		//}
	}
	
	
  }  
	if(message.model === 'fbaexperiment') {
		console.log("fba experiment recognised")
		var page = document.location.pathname;
		page = page.replace(/(\/)$/, '');
		if (page==('/fbaexperiment/show/'+message.id)){
			if (message.verb === 'update') {
				console.log("message exp results: "+message.data.results);
				setTimeout(function() {
					location.reload();
				}, 3000);
			}
		} 
	}
  if (message.model === 'lab') {
	console.log("lab update message id: "+message.id)
  } 
  if (message.model === 'metabolic_net') {
	console.log("metabolic net update message id: "+message.id)
  } 
  if (message.model === 'metabolic_net_layout') {
	console.log("metabolic net layout update message id: "+message.id)
  } 
  if (message.model === 'qsspn_model') {
	console.log("qsspn model update message id: "+message.id)
  } 
  if (message.model === 'qsspn_model_layout') {
	console.log("qsspn model layout update message id: "+message.id)
  }
}

function displayFlashActivity(message) {
  $('#chatAudio')[0].play();
  $(".navbar").after("<div class='alert alert-success'>" + message.data.name + message.data.action + "</div>");
  $(".alert").fadeOut(5000);
}

function updateUserInDom(userId, message) {

  // What page am I on?
  var page = document.location.pathname;

  // Strip trailing slash if we've got one
  page = page.replace(/(\/)$/, '');
  
  // Route to the appropriate user update handler based on which page you're on
  switch (page) {

    // If we're on the User Administration Page (a.k.a. user index)
    case '/user':

      // This is a message coming from publishUpdate
      if (message.verb === 'update') {
        UserIndexPage.updateUser(userId, message);
      }

      // This is a message coming from publishCreate
      if(message.verb === 'create') {
        UserIndexPage.addUser(message);
      }
      // This is a message coming publishDestroy
      if(message.verb === 'destroy') {
        UserIndexPage.destroyUser(userId);
      }
      break;
  }
}



/////////////////////////////////////////////////
// User index page DOM manipulation logic
// (i.e. backbone-style view)
/////////////////////////////////////////////////
var UserIndexPage = {

  // Update the User, in this case their login status
  updateUser: function(id, message) {
    if (message.data.loggedIn) {
      var $userRow = $('tr[data-id="' + id + '"] td img').first();
      $userRow.attr('src', "/images/icon-online.png");
    } else {
      var $userRow = $('tr[data-id="' + id + '"] td img').first();
      $userRow.attr('src', "/images/icon-offline.png");
    }
  },

  // Add a user to the list of users in the User Administration Page
  addUser: function(user) {

  // obj is going to encompass both the new user data as well as the _csrf info from 
  // the layout.ejs file
  var obj = {
    user: user.data,
    _csrf: window.overlord.csrf || ''
  };

  // Add the template to the bottom of the User Administration Page
    $( 'tr:last' ).after(
      
      // This is the path to the templates file
      JST['assets/linker/templates/addUser.ejs']( obj )
    );
  },

  // Remove the user from the User Administration Page
  destroyUser: function(id) {
    $('tr[data-id="' + id + '"]').remove();
  }
}