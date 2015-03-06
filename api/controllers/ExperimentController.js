/**
 * ExperimentController
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
var os = require('os');
var sys = require('sys');
var exec = require('child_process').exec;
var execf = require('child_process').execFile;
//var csv = require('rfc-csv');
//var LineInputStream = require('line-input-stream');
//var byline = require('byline');
var Fgets = require('qfgets');
//var csv = require("fast-csv");
//var csv = require('csv-parser')


//var hound = require('hound');
module.exports = {
   'new': function(req,res){
		if (req.session.authenticated){
			var username = req.session.User.name;
			User.find(function(err, usrs) {
				if (err) {return res.serverError(err);}
				Lab.find(function(err1, labs) {
					Qsspn_model.find(function(err2, qms) {
						if (err2) {return res.serverError(err);}
						
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
										if (listQms[j1].id==qms[i].id){
											isin=true;
										}
									}
									if (isin==false){
										listQms.push(qms[i]);
									}
								}
								
							}
						}					
						res.view({usrs: listUsers, labs: labs, qms: listQms});						
						//return res.view({qms: qms});
					});
				});
			});
		}
	},
	create: function(req, res, next) {
		//socks.socket.emit('welcome', {message: "Hi i'm Laurent and i write shitty articles on my blog"});
		var parameters_data=[];
		try {
			parameters_data=JSON.parse(req.param('parameters'));	//{'default_p':[] , 'simulations_p':[]}				
		}
		catch(errorParse){
			console.log("error parsing spreadsheet for parameters");
		}
		var qsspn_model_instance_data={};
		try {
			//stringOutput=req.param('mySpreadsheet');
			stringOutput=req.param('mySpreadsheet0')+req.param('mySpreadsheet1')+req.param('mySpreadsheet2')+req.param('mySpreadsheet3')+req.param('mySpreadsheet4')+req.param('mySpreadsheet5')+req.param('mySpreadsheet6')+req.param('mySpreadsheet7')+req.param('mySpreadsheet8')+req.param('mySpreadsheet9');
			qsspn_model_instance_data=JSON.parse(stringOutput);
			//qsspn_model_instance_data["qssf"]["externality_tag"]="_xt";
			fs.writeFile('assets/qsspn-model-files/'+req.param('qsspn_model_name')+'__'+req.param('name')+'.json', stringOutput, function(werr) {if (werr) throw werr;});
		}
		catch(errorParse){
			console.log("error parsing qsspn model spreadsheet");
		}	
		var sfba_model_instance_data=[];
		try {
			//console.log(sails.config.express.bodyParser)
			stringOutput2=req.param('mySfbaSpreadsheet0')+req.param('mySfbaSpreadsheet1')+req.param('mySfbaSpreadsheet2')+req.param('mySfbaSpreadsheet3')+req.param('mySfbaSpreadsheet4')+req.param('mySfbaSpreadsheet5')+req.param('mySfbaSpreadsheet6')+req.param('mySfbaSpreadsheet7')+req.param('mySfbaSpreadsheet8')+req.param('mySfbaSpreadsheet9');
			//console.log(req.param('mySfbaSpreadsheet'))
			
			sfba_model_instance_data=JSON.parse(stringOutput2);
			//fs.writeFile('assets/sfba-model-files/'+req.param('qsspn_model_name')+'_'+req.param('name')+'.json', stringOutput, function(werr) {if (werr) throw werr;});
			
		}
		catch(errorParse){
			console.log("error parsing sfba model spreadsheet");
		}	
		try{
			var wstream = fs.createWriteStream('assets/sfba-model-files/'+req.param('qsspn_model_name')+'__'+req.param('name')+'.sfba',{ encoding: 'utf8' });
						//wstream2.write(JSON.stringify(data3));
			
			for (var i=0, j= sfba_model_instance_data.length;i<j;i++){
				wstream.write(sfba_model_instance_data[i][0]+'\t'+sfba_model_instance_data[i][1]+'\t'+sfba_model_instance_data[i][2]+'\t'+sfba_model_instance_data[i][3]+'\t'+sfba_model_instance_data[i][4]+'\t'+sfba_model_instance_data[i][5]+'\n');
			}
			wstream.end();
		}
		catch(errorwrite){
			console.log("error writing sfba model spreadsheet");
		}
		
		try{
			
			//console.log(os.type())
			var myos = os.type();
			var typos=0;
			if (myos.substring(0,3)=="Win"){
				typos=0;
			}
			else if (myos.substring(0,3)=="Dar"){
				typos=1;
			}
			else if (myos.substring(0,3)=="Lin"){
				typos=2;
			}
			else{
				typos=3;
			}
			var wstream = fs.createWriteStream('assets/control-model-files/'+req.param('qsspn_model_name')+'__'+req.param('name')+'.ctrl.txt',{ encoding: 'utf8' });
			//wstream.write('MODEL assets/sfba-model-files/'+req.param('qsspn_model_name')+'__'+req.param('name')+'.sfba\n')
			if (typos==0){
			wstream.write('MODEL assets\\\\sfba-model-files\\\\'+req.param('qsspn_model_name')+'__'+req.param('name')+'.sfba\n')
			}
			else{
			wstream.write('MODEL assets/sfba-model-files/'+req.param('qsspn_model_name')+'__'+req.param('name')+'.sfba\n')
			}
			wstream.write('NUMBER_OF_SAMPLES '+parameters_data['default_p'][0][1]+'\n');
			wstream.write('SEED '+parameters_data['default_p'][0][2]+'\n');
			wstream.write('TIME_MAX '+parameters_data['default_p'][0][3]+'\n');
			wstream.write('MAXIMAL_TIMESTEP '+parameters_data['default_p'][0][4]+'\n');
			//
			if (parameters_data['default_p'][0][5]===null || parameters_data['default_p'][0][5]=="" || parameters_data['default_p'][0][5]==" "){
				wstream.write('\n');
			}
			else{
				wstream.write('MAX_CHANGE '+parameters_data['default_p'][0][5]+'\n\n');
				//console.log("max_change? "+ parameters_data[0][5])
				
			}
			//if (parameters_data[0][5]!=null || parameters_data[0][5]!="" || parameters_data[0][5]!=" "){
			//	wstream.write('MAX_CHANGE '+parameters_data[0][5]+'\n\n');
			//	console.log("max_change? "+ parameters_data[0][5])
			//}
			//else{
			//	wstream.write('\n');
			//}
			//wstream.write('OUTPUT assets/output-model-files/'+req.param('qsspn_model_name')+'__'+req.param('name')+'.output.xls\n');
			//wstream.write('LOG assets/output-model-files/'+req.param('qsspn_model_name')+'__'+req.param('name')+'.log.txt\n');
			if (typos==0){
			wstream.write('OUTPUT assets\\\\output-model-files\\\\'+req.param('qsspn_model_name')+'__'+req.param('name')+'.output.xls\n');
			wstream.write('LOG assets\\\\output-log-files\\\\'+req.param('qsspn_model_name')+'__'+req.param('name')+'.log.txt\n\n');
			}
			else{
			wstream.write('OUTPUT assets/output-model-files/'+req.param('qsspn_model_name')+'__'+req.param('name')+'.output.xls\n');
			wstream.write('LOG assets/output-log-files/'+req.param('qsspn_model_name')+'__'+req.param('name')+'.log.txt\n\n');
			}
			wstream.write('MONITOR '+parameters_data['default_p'][0][8]+'\n');
			if (parameters_data['default_p'][0][9]!==null){
				wstream.write('PROGRESS '+parameters_data['default_p'][0][9]+'\n\n');
			}
			if (parameters_data['default_p'][0][10]!==null && parameters_data['default_p'][0][11]!==null){
				wstream.write('TARGET '+parameters_data['default_p'][0][10]+' '+parameters_data['default_p'][0][11]+'\n\n');
			}
			if (parameters_data['default_p'][2].length>0){
				wstream.write('INITIAL_STATE\n');
				for (var i=0, j= parameters_data['default_p'][2].length;i<j;i++){
					wstream.write(parameters_data['default_p'][2][i][0]+" "+parameters_data['default_p'][2][i][1]+'\n');
				}
				wstream.write('END\n\n');
			}
			if (parameters_data['default_p'][3].length>0){
				for (var i=0, j= parameters_data['default_p'][3].length;i<j;i++){
					wstream.write('RESET_FUNCTION '+parameters_data['default_p'][3][i][0]+' \n'+parameters_data['default_p'][3][i][1]+' \nEND\n\n');
				}
				wstream.write('\n');
			}
			wstream.write('PETRI_NET_MONITORS\n');
			for (var i=0, j= parameters_data['default_p'][1].length;i<j;i++){
				wstream.write(parameters_data['default_p'][1][i]+'\n');
			}
			wstream.write('END\n\n');
			wstream.write('SIMULATION\n\n\n');
			wstream.end();
		}
		catch(errorwrite){
			console.log("error writing sfba model spreadsheet");
		}
		
		var ExpObj = {
		  name: req.param('name'),
		  owner: req.param('owner'),
		  comment: req.param('comment'),
		  users: JSON.parse(req.param('users')),
		  parameters: parameters_data,
		  qsspn_model_name: req.param('qsspn_model_name'),
		  metabolic_net_name: req.param('metabolic_net_name'),
		  qsspn_model_instance: qsspn_model_instance_data,
		  sfba_model_instance: sfba_model_instance_data,
		  results: []
		  //qsspn_model_instance:,
		  //qsspn_model_instance
		}

		// Create a User with the params sent from 
		// the sign-up form --> new.ejs
		Experiment.create(ExpObj, function expCreated(err, exp) {

		  // // If there's an error
		  // if (err) return next(err);

		  if (err) {
			console.log(err);
			req.session.flash = {
			  err: err
			}

			// If error redirect back to sign-up page
			return res.redirect('/experiment/new');
		  }

		  // Log user in
		  //req.session.authenticated = true;
		  //req.session.User = mtn;

		  // Change status to online
		  //user.online = true;
		  exp.save(function(err, exp) {
			if (err) return next(err);

		  // add the action attribute to the user object for the flash message.
		  exp.action = " experiment created."

		  // Let other subscribed sockets know that the user was created.
		 Experiment.publishCreate(exp);

			// After successfully creating the user
			// redirect to the show action
			// From ep1-6: //res.json(user); 
			
			res.redirect('/experiment/show/' + exp.id);
		  });
		});
	},
	show: function(req, res, next) {
		if (req.session.authenticated){
			var username = req.session.User.name;
			Experiment.findOne(req.param('id'), function foundExp(err, exp) {
			    if (err) return next(err);
			    if (!exp) return next();
			    Lab.find(function(err3, labs) {
					if (err3) return next(err3);
					var inLabs=[];
					for (var j=0;j<labs.length;j++){
						if (labs[j]["users"].indexOf(username)!=-1){
							inLabs.push(labs[j].name)
						}
					}
					var goNext =false;
					var users = exp.users;
					for (var j=0;j<users.length;j++){
						if ((users[j][0]==username || inLabs.indexOf(users[j][0])!=-1) && users[j][1]!=true){
							goNext=true;
						}
					}
					if (goNext==true ){
						res.view({
							exp: exp
						});
					}
					else return next();
				});
			});
		}
	},
	
	
	// render the profile view (e.g. /views/show.ejs)
	editusers: function(req, res, next) {
		if (req.session.authenticated){
			var username = req.session.User.name;
			Experiment.findOne(req.param('id'), function foundMtn(err, exp) {
				User.find(function(err2, usrs) {
					if (err2) {return res.serverError(err2);}
					Lab.find(function(err3, labs) {
						var listUsers=[];
						for (var i=0;i<usrs.length;i++){
							listUsers.push(usrs[i].name);
						}
						if (exp.owner==req.session.User.name){
							res.view({
								labs: labs,
								usrs: listUsers,
								expid: exp.id,
								expname: exp.name,
								expusers: exp.users
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
			Experiment.findOne(req.param('id'), function foundLb(err, exp) {
				if (err) return next(err);
				if (!exp) return next();
				var ExpObj = {
				  name: exp.name,
				  owner: exp.owner,
				  comment: exp.comment,
				  users: JSON.parse(req.param('users')),
				  parameters: exp.parameters,
				  qsspn_model_name: exp.qsspn_model_name,
				  metabolic_net_name: exp.metabolic_net_name,
				  qsspn_model_instance: exp.qsspn_model_instance,
				  sfba_model_instance: exp.sfba_model_instance,
				  results: exp.results,
				}
				if (exp.owner==req.session.User.name){
					Experiment.update(req.param('id'), ExpObj, function mtnUpdated(err2) {
						res.redirect('/experiment/show/' + exp.id);
					});
				}
				else return next();
			});
		}
	},
	
	index: function(req, res, next) {
		if (req.session.authenticated){
			var username = req.session.User.name;
			Experiment.find(function foundExps(err, experims) {
				if (err) return next(err);
				
				Lab.find(function(err2, labs) {
					if (err2) return next(err2);
					var inLabs=[];
					for (var j=0;j<labs.length;j++){
						if (labs[j]["users"].indexOf(username)!=-1){
							inLabs.push(labs[j].name)
						}
					}
					var listExps=[];
					for (var i=0;i<experims.length;i++){
						var users = experims[i].users;
						var userIndex = users.indexOf(username);
						
						for (var j=0;j<users.length;j++){
							if ((users[j][0]==username || inLabs.indexOf(users[j][0])!=-1) && users[j][1]!=true){
								var isin=false;
								for (var j1=0;j1<listExps.length;j1++){
									if (listExps[j1][0]==experims[i].id){
										isin=true;
									}
								}
								if (isin==false){
									listExps.push([experims[i].id, experims[i].name, experims[i].comment]);
								}
							}
							
						}
					}
					// // pass the array down to the /views/index.ejs page
					// var listExps=[];
					// for (var i=0;i<experims.length;i++){
						// listExps.push([experims[i].id, experims[i].name, experims[i].comment]);
					// }
					res.view({
						experims: listExps
					});
				});
			});
		}
	},
	
	showresult: function(req, res, next) {
		if (req.session.authenticated){
			var username = req.session.User.name;
			Experiment.findOne(req.param('id'), function foundExp(err, exp) {
				Metabolic_net.findOne({ name: exp.metabolic_net_name}, function foundMtb(err2, mtb) {
					if (err2) return next(err2);
					if (!mtb) return next();
					
					Metabolic_net_layout.find({ metabolic_net: mtb.name}, function foundMtnls(errl1, mtnls) {
						if (errl1) return next(errl1);
						if (!mtnls) return next();
						
					
						Qsspn_model.findOne({ name: exp.qsspn_model_name}, function foundQm(err3, qmm) {
							if (err3) return next(err3);
							if (!qmm) return next();
							
							Qsspn_model_layout.find({ qsspn_model: qmm.name}, function foundQmls(err4, qmls) {				
								if (err4) return next(err4);
								if (!qmls) return next();
								
								Lab.find(function(errl, labs) {
								
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
									
								
									//console.log(qmls)
									var qmlID="";
									if (req.param('qml-id')){	
										qmlID=req.param('qml-id');
									}
									
									
									// var mtnl={};
									// var listLayouts=[];
									// for (var i=0;i<mtnls.length;i++){
										// listLayouts.push([mtnls[i].id, mtnls[i].name, mtnls[i].comment]);
										// if (mtnlID!="" && mtnlID==mtnls[i].id){
											// mtnl =mtnls[i];
										// }
									// }
									
									
									// var myqml={};
									// var listQmLayouts=[];
									// for (var i=0;i<qmls.length;i++){
										// listQmLayouts.push([qmls[i].id, qmls[i].name, qmls[i].comment]);
										// if (qmlID!="" && qmlID==qmls[i].id){
											// myqml =qmls[i];
										// }
									// }
								
									var myqml={};
									var listQmLayouts=[];
									// for (var i=0;i<qmls.length;i++){
										// listQmLayouts.push([qmls[i].id, qmls[i].name, qmls[i].comment]);
										// if (qmlID!="" && qmlID==qmls[i].id){
											// myqml =qmls[i];
										// }
									// }
									for (var i=0;i<qmls.length;i++){
										var users = qmls[i].users;
										var userIndex = users.indexOf(username);
										
										for (var j=0;j<users.length;j++){
											if ((users[j][0]==username || inLabs.indexOf(users[j][0])!=-1) && users[j][1]!=true){
												var isin=false;
												for (var j1=0;j1<listQmLayouts.length;j1++){
													if (listQmLayouts[j1][0]==qmls[i].id){
														isin=true;
													}
												}
												if (isin==false){
													listQmLayouts.push([qmls[i].id, qmls[i].name, qmls[i].comment]);
													if (qmlID!="" && qmlID==qmls[i].id){
														myqml =qmls[i];
													}
												}
											}
											
										}
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
									var goNext =false;
									var users = qmm.users;
									for (var j=0;j<users.length;j++){
										if ((users[j][0]==username || inLabs.indexOf(users[j][0])!=-1) && users[j][1]!=true){
											goNext=true;
										}
									}
									if (goNext==true ){
								
								
								
								
										var parRes=-1;
										for (var i=0;i<200;i++){
											if (req.param('r'+i)){
												
												if (req.param('r'+i)!=-1){
												//console.log(req.param('r'+i))
													parRes=req.param('r'+i);
												}
												
											}
										}
										var tRes=-1;
										for (var i=0;i<200;i++){
											if (req.param('t'+i)){
												if (req.param('t'+i)!=-1){
												//console.log(req.param('t'+i))
													tRes=req.param('t'+i);
												}
												
											}
										}
										var lRes=-1;
										for (var i=0;i<200;i++){
											if (req.param('l'+i)){
												if (req.param('l'+i)!=-1){
												//console.log(req.param('l'+i))
													lRes=parseInt(req.param('l'+i));
												}
												
											}
										}
										//console.log(tRes)
										//console.log(parRes)
										//console.log(lRes)
										if (err) return next(err);
										if (!exp) return next();
										var file = 'assets/output-model-files/'+exp.qsspn_model_name+'__'+exp.name+'__'+parRes+'.output.xls';
										
										try{
											// read file content in an asynchronous way
											//var textm = fs.readFile(path,'utf8')
											myres=[];
											var mcountToken={};
											var headtitles;
											var countline=0;
											var totalNbTrajectories=lRes;
											//console.log(lRes)
											var cntTrajectories=-1;
											var simTrajectory=0;
											if (tRes!=-1)
												simTrajectory=tRes;
											var mdataSim="";
											var cntStartSim=-1;
											var cntLine=0;
											var inSim=false;
											
											var fp = new Fgets(file);        // use buit-in FileReader
											var contents = "";
											var line="";
											(function readfile() {
												line= fp.fgets();
												
												
												
												
												if (line.substring(0, 4)=="Traj"){
													
													cntTrajectories++;
													if (cntTrajectories==0){
														headtitles = line.split('\t');
														headtitles[headtitles.length-1]=headtitles[headtitles.length-1].replace('\r','');
														
													}
													console.log("processing trajectory : "+cntTrajectories);
													if (cntTrajectories==simTrajectory	){
														inSim=true;
													}
													if (cntTrajectories>simTrajectory	){
														inSim=false;
													}
												}
												else{
													var melement = line.split('\t');
													if (melement[2] && melement[2]!='none'){
														if (!mcountToken.hasOwnProperty(melement[2])){
															mcountToken[melement[2]]=[];
														}
														else if (mcountToken[melement[2]].length==0){
															for (var i1=0;i1<totalNbTrajectories;i1++){
																mcountToken[melement[2]].push(0);
															}	
															mcountToken[melement[2]][cntTrajectories]+=1;
														}
														else{
															if(mcountToken[melement[2]].length>cntTrajectories){
																mcountToken[melement[2]][cntTrajectories]+=1;
															}
														}
													}
													if (line!="" && inSim==true){
														mdataSim+=line;
													}
													
												}
												countline++;
												if (!fp.feof()) {setImmediate(readfile);}
												else{
													//console.log(headtitles.length)
													//console.log(mdataSim[0].length)
													res.view({
														exp: exp,
														mtb:mtb,
														mtnls: listLayouts,
														mtnl: mtnl,
														qmls: listQmLayouts,
														mqml: myqml,
														nbRes: parRes,
														tRes: tRes,
														lRes: lRes,
														dataR: mdataSim,
														headtitles: headtitles,
														stats: mcountToken
													});
												}							
											})();
											
											
										}
										catch(erf){}
									}
									else return next();
								});
							
							});
						});
					
					});
				});
			});
		}
	},
	
	
	edit: function(req, res, next) {
		if (req.session.authenticated){
			var username = req.session.User.name;
			
			Experiment.findOne(req.param('id'), function foundExp(err, exp) {
				if (err) return next(err);
				if (!exp) return next('Experiment doesn\'t exist.');
			  
				Lab.find(function(errl, labs) {
					var inLabs=[];
					for (var j=0;j<labs.length;j++){
						if (labs[j]["users"].indexOf(username)!=-1){
							inLabs.push(labs[j].name)
						}
					}
					var goNext =false;
					var users = exp.users;
					for (var j=0;j<users.length;j++){
						if ((users[j][0]==username || inLabs.indexOf(users[j][0])!=-1) && users[j][3]==true){
							goNext=true;
						}
					}
					if (goNext==true ){
						res.view({
							exp: exp
						});
					}
					else return next();
				});
			});
		}
	},
	
	// process the info from edit view
	update: function(req, res, next) {
		if (req.session.authenticated){
			var username = req.session.User.name;
			Experiment.findOne(req.param('expid'), function foundExp(err, exp) {
				if (err) return next(err);
				var myres=[];
				if (!exp) return next('Experiment doesn\'t exist.');
				
				try{
					myres=JSON.parse(req.param('newresults'));
					
				}
				catch(ee){
					console.log("error parsing list of new results from edit form")
					myres=exp.results;
				}
				
				var myParams={};
				try{
					myParams=JSON.parse(req.param('newParameters'));
					
				}
				catch(ee){
					console.log("error parsing list of new parameters from edit form")
					myParams=exp.parameters;
				}
				
				var myos = os.type();
				var typos=0;
				if (myos.substring(0,3)=="Win"){
					typos=0;
				}
				else if (myos.substring(0,3)=="Dar"){
					typos=1;
				}
				else if (myos.substring(0,3)=="Lin"){
					typos=2;
				}
				else{
					typos=3;
				}
				
				
				Lab.find(function(errl, labs) {
					var inLabs=[];
					for (var j=0;j<labs.length;j++){
						if (labs[j]["users"].indexOf(username)!=-1){
							inLabs.push(labs[j].name)
						}
					}
					var goNext =false;
					var users = exp.users;
					for (var j=0;j<users.length;j++){
						if ((users[j][0]==username || inLabs.indexOf(users[j][0])!=-1) && users[j][3]==true){
							goNext=true;
						}
					}
					if (goNext==true ){
				
				
						fileList = 'assets/control-model-files/'+exp.qsspn_model_name+'__'+exp.name+'.ctrl.txt'
						
						fs.readFile(fileList, 'utf8',function(err, data) {
							if(err) throw err;
							//data = data.toString();
							var mnb=0;
							for (var i=0;i<myres.length;i++){
								if (myres[i]['status']=='Not started yet'){
									mnb=i;
								}
							}
							
							var data3 ='';
							if (typos==0){
							data3+='MODEL assets\\\\sfba-model-files\\\\'+exp.qsspn_model_name+'__'+exp.name+'.sfba\n';
							}
							else{
							data3+='MODEL assets/sfba-model-files/'+exp.qsspn_model_name+'__'+exp.name+'.sfba\n';
							}
							data3+='NUMBER_OF_SAMPLES '+myParams['simulations_p'][mnb][0][1]+'\n';
							data3+='SEED '+myParams['simulations_p'][mnb][0][2]+'\n';
							data3+='TIME_MAX '+myParams['simulations_p'][mnb][0][3]+'\n';
							data3+='MAXIMAL_TIMESTEP '+myParams['simulations_p'][mnb][0][4]+'\n';
							//
							if (myParams['simulations_p'][mnb][0][5]===null || myParams['simulations_p'][mnb][0][5]=="" || myParams['simulations_p'][mnb][0][5]==" "){
								data3+='\n';
							}
							else{
								data3+='MAX_CHANGE '+myParams['simulations_p'][mnb][0][5]+'\n\n';
								//console.log("max_change? "+ parameters_data[0][5])
								
							}
							if (typos==0){
							data3+='OUTPUT assets\\\\output-model-files\\\\'+exp.qsspn_model_name+'__'+exp.name+'__'+mnb+'.output.xls\n';
							data3+='LOG assets\\\\output-log-files\\\\'+exp.qsspn_model_name+'__'+exp.name+'.log.txt\n\n';
							}
							else{
							data3+='OUTPUT assets/output-model-files/'+exp.qsspn_model_name+'__'+exp.name+'__'+mnb+'.output.xls\n';
							data3+='LOG assets/output-log-files/'+exp.qsspn_model_name+'__'+exp.name+'.log.txt\n\n';
							}
							data3+='MONITOR '+myParams['simulations_p'][mnb][0][8]+'\n';
							if (myParams['simulations_p'][mnb][0][9]!==null){
								data3+='PROGRESS '+myParams['simulations_p'][mnb][0][9]+'\n\n';
							}
							if (myParams['simulations_p'][mnb][0][10]!==null && myParams['simulations_p'][mnb][0][11]!==null){
								data3+='TARGET '+myParams['simulations_p'][mnb][0][10]+' '+myParams['simulations_p'][mnb][0][11]+'\n\n';
							}
							if (myParams['simulations_p'][mnb][2].length>0){
								data3+='INITIAL_STATE\n';
								for (var i=0, j= myParams['simulations_p'][mnb][2].length;i<j;i++){
									data3+=myParams['simulations_p'][mnb][2][i][0]+" "+myParams['simulations_p'][mnb][2][i][1]+'\n';
								}
								data3+='END\n\n';
							}
							if (myParams['simulations_p'][mnb][3].length>0){
								for (var i=0, j= myParams['simulations_p'][mnb][3].length;i<j;i++){
									data3+='RESET_FUNCTION '+myParams['simulations_p'][mnb][3][i][0]+' \n'+myParams['simulations_p'][mnb][3][i][1]+' \nEND\n\n';
								}
								data3+='\n';
							}
							data3+='PETRI_NET_MONITORS\n';
							for (var i=0, j= myParams['simulations_p'][mnb][1].length;i<j;i++){
								data3+=myParams['simulations_p'][mnb][1][i]+'\n';
							}
							data3+='END\n\n';
							data3+='SIMULATION\n\n\n';
							

							fs.writeFile(fileList, data3, function(err) {
								if(err) {
									console.log(err);
								} else {
									if (typos==0){
										execf('assets\\windows-qsspn\\qsspn.exe',['assets\\qsspn-model-files\\'+exp.qsspn_model_name+'__'+exp.name+'.json','assets\\control-model-files\\'+exp.qsspn_model_name+'__'+exp.name+'.ctrl.txt'] , function(err, stdout, stderr) {
											console.log('output:', stdout);
										});
									}
									else{
										execf('assets/linux-osx-qsspn/qsspn.exe',['assets/qsspn-model-files/'+exp.qsspn_model_name+'__'+exp.name+'.json','assets/control-model-files/'+exp.qsspn_model_name+'__'+exp.name+'.ctrl.txt'] , function(err, stdout, stderr) {
											console.log('output:', stdout);
										});
									}
									
									var ExpObj = {
									name: exp.name,
									owner: exp.owner,
									comment: exp.comment,
									parameters: myParams,
									users: exp.users,
									qsspn_model_name: exp.qsspn_model_name,
									metabolic_net_name: exp.metabolic_net_name,
									qsspn_model_instance: exp.qsspn_model_instance,
									sfba_model_instance: exp.sfba_model_instance,
									results: myres//exp.results.concat(myres)
								}
								var proc=false;
								for (var i=0;i<myres.length;i++){
										if (myres[i]['status']=='Not started yet' && proc==false){
											// execute command line process 
											myres[i]['status']="In progress"
											proc=true;
										}
								}
								ExpObj.results=myres;
								
									Experiment.update(req.param('id'), ExpObj, function expUpdated(err) {
										//console.log(req.param('newresults'))
										if (err) {
											return res.redirect('/experiment/edit/' + req.param('id'));
										}
										var light_myres= [];
										var processing=false;
										for (var i=0;i<myres.length;i++){
											light_myres.push({'nb': myres[i]['nb'],'status': myres[i]['status']})
											
											if (myres[i]['status']=='Not started yet' && processing==false){
												// execute command line process 
												myres[i]['status']="In progress"
												processing=true;
											}
										}
										Experiment.publishUpdate(req.param('id'), {
											name: exp.name,
											results: JSON.stringify(light_myres),
											action: ' has been updated.'
										});
										res.redirect('/experiment/show/' + req.param('id'));
									});
									
								}
								
							});
							
						});
					} 
					else return next();
				
				});
				
			});
		}
		
		
	},
	subscribe: function(req, res) {
		// Find all current users in the user model
		Experiment.find(function foundExp(err, exps) {
		  if (err) return next(err);
	 
		  // subscribe this socket to the User model classroom
		  Experiment.subscribe(req.socket);
	 
		  // subscribe this socket to the user instance rooms
		  Experiment.subscribe(req.socket, exps);
	 
		  // This will avoid a warning from the socket for trying to render
		  // html over the socket.
		  res.send(200);
		});
	  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to ExperimentController)
   */
  _config: {}

  
};
