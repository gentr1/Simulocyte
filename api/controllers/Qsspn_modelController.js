/**
 * Qsspn_modelController
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
		if (req.session.authenticated){
			var username = req.session.User.name;
			User.find(function(err, usrs) {
				if (err) {return res.serverError(err);}
				Lab.find(function(err1, labs) {				
					Metabolic_net.find(function(err2, mtbs) {
						if (err2) {return res.serverError(err2);}
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
										if (listMtns[j1][0]==mtbs[i].id){
											isin=true;
										}
									}
									if (isin==false){
										listMtns.push([mtbs[i].id, mtbs[i].name, mtbs[i].comment, mtbs[i].file[0].length, mtbs[i].file[1].length, mtbs[i].file[2].length]);
									}
								}
								
							}
							if (isNotIn && mtbs[i].openpolicy && mtbs[i].openpolicy==true){
								listMtns.push([mtbs[i].id, mtbs[i].name, mtbs[i].comment, mtbs[i].file[0].length, mtbs[i].file[1].length, mtbs[i].file[2].length]);
							}
						}
						
						return res.view({usrs: listUsers, mtbs: listMtns, labs: labs});
					});
				});
			});
		}
	},
	
	create: function(req, res, next) {
		if (req.session.authenticated){
			var username = req.session.User.name;
			//socks.socket.emit('welcome', {message: "Hi i'm Laurent and i write shitty articles on my blog"});
			if (req.method === 'POST') {           
				// read temporary file
				fs.readFile(req.files.myfile.path, function (err, data) {
					fs.readFile(req.files.sfbafile.path, "utf-8",function (errs, datasfba) {	
						// add or change "extra" attribute to the json data file
						Metabolic_net.findOne({ name: req.param('metabolic_net')}, function foundMtb(merr, mytb) {
							if (merr) return next(merr);
							// intial qsspn model json file
							var data2={};
							var stringOutput;
							//if (JSON.parse(data)=={}){
							try {
								
								stringOutput=data;
								data2=JSON.parse(stringOutput);	
								
								
								}
							catch(errorParse){
								console.log("empty qsspn .json file to parse, uploading spreadsheet data instead");
								if (req.param('mySpreadsheet')){
									stringOutput=req.param('mySpreadsheet');
									data2=JSON.parse(stringOutput);
								}
								else{
									data2={'places': [], 'qssf' : {}, 'transitions:': [], 'extra': []};
								}
								//console.log(data2);
								
								
							}
							//var wstream1 = fs.createWriteStream('assets/qsspn-model-files/'+req.param('name')+'.json',{ encoding: 'utf8' });
							//wstream1.write(JSON.stringify(data2));
							//wstream1.end();
							//fs.writeFile('assets/qsspn-model-files/'+req.param('name')+'.json', stringOutput, function(werr) {
							//			if (werr) throw werr;
							//});
							
							var stringOutput2;
							//console.log(datasfba);
							if(datasfba) {
								//fs.writeFile('/sfba-model-files/'+req.param('name')+'.sfba', datasfba, 'utf-8',ferr);
								//fs.writeFile('assets/sfba-model-files/'+req.param('name')+'.sfba', datasfba, function(werr) {
								//	if (werr) throw werr;
								//});
								//console.log(JSON.stringify(datasfba))
								var sfbastring=datasfba.split( "\n" );
								//console.log(sfbastring)
								var sfbaTemp=[]
								for( var i = 0; i < sfbastring.length; i++ ) {
									var tmpl=sfbastring[i].split( "\t" );
									if (tmpl.length<6){
										tmpl.push(tmpl[4]);
										tmpl[4]='';
									}
									//if (tmpl[4]==''){
									//	tmpl.splice(4, 1)
									//}
									sfbaTemp.push(tmpl);
								}
								//fs.writeFile('assets/sfba-model-files/'+req.param('name')+'.sfba', datasfba, function(werr) {
								//	if (werr) throw werr;
								//});
								//console.log(sfbaTemp)
								
								stringOutput2=JSON.stringify(sfbaTemp);
								data3=JSON.parse(stringOutput2);
							}
							else{
								console.log("empty sfba file to parse, uploading spreadsheet data instead");
								//console.log(req.param('mySfbaSpreadsheet'));
								
								//console.log(data3);
								//fs.writeFile('assets/sfba-model-files/'+req.param('name')+'.sfba', req.param('mySfbaSpreadsheet'), function(werr) {
								//	if (werr) throw werr;
								//});
								//stringOutput2=req.param('mySfbaSpreadsheet');
								stringOutput2=req.param('mySfbaSpreadsheet0')+req.param('mySfbaSpreadsheet1')+req.param('mySfbaSpreadsheet2')+req.param('mySfbaSpreadsheet3')+req.param('mySfbaSpreadsheet4')+req.param('mySfbaSpreadsheet5')+req.param('mySfbaSpreadsheet6')+req.param('mySfbaSpreadsheet7')+req.param('mySfbaSpreadsheet8')+req.param('mySfbaSpreadsheet9');
								data3=JSON.parse(stringOutput2);
								
							}
							//fs.writeFile('assets/sfba-model-files/'+req.param('name')+'.sfba', stringOutput2, function(werr) {
							//		if (werr) throw werr;
							//});
							//var wstream2 = fs.createWriteStream('assets/sfba-model-files/'+req.param('name')+'.sfba',{ encoding: 'utf8' });
							//wstream2.write(JSON.stringify(data3));
							//wstream2.end();
							
							//wstream1.on('finish', function () {
							//	wstream2.on('finish', function () {
							//	  console.log('file has been written');
							//	});
							//});
							
							//}
							//else{
							//	data2= JSON.parse(req.param('mySpreadsheet'));
							//	console.log(data2)
							//}
							
							var model_data=[[],[],[],[]];
							var modelName= req.param('name');
							// display list of compartments
							//console.log(mytb.file[0])
							for (var i=0, ii=mytb.file[0].length; i<ii;i++){
								model_data[1].push(mytb.file[0][i]);
							}
							var idMap_RPM={};
							var counter=0;
							//var data2 = mytb;
							
							if (data2['places']){
								for (var i=0, ii=data2['places'].length; i<ii;i++){
									// a place with type 1 is a common node, a place with type 2 is an objective node, type 3 would be a constraint for a reaction node
									// type qsspn =0 means a place and =1 means a reaction
									// id nb + name + compartment nb + info + [state,max] + snoopy type + qsspn type + type sim + type reconx + [rate, transition type, delay] + empty stuff (products, reactants, modifiers) + model name
									var subsys=[];
									if (data2['places'][i]['place']['subsystem'])
										subsys=[data2['places'][i]['place']['subsystem']];
									model_data[2].push([counter, data2['places'][i]['place']['name'], -1, [[],subsys], [data2['places'][i]['place']['state'],data2['places'][i]['place']['max']] , 2, data2['places'][i]['place']['type'],1,0,[1, []], [[], [], []], [modelName]]);
									idMap_RPM[data2['places'][i]['place']['name']]=counter;
									counter++;
									//console.log(data2['places'][i])
								}
							}
							if (data2['transitions']){
								for (var i=0, ii=data2['transitions'].length; i<ii;i++){
									var subsys=[];
									if (data2['transitions'][i]['transition']['subsystem'])
										subsys=[data2['transitions'][i]['transition']['subsystem']];
									var myreaction = [counter, data2['transitions'][i]['transition']['name'], -1, [[],subsys], [data2['transitions'][i]['transition']['c'],data2['transitions'][i]['transition']['type'],data2['transitions'][i]['transition']['delay']] , 4, -1,1,0,[[], []], [[], [], []], [modelName]];
									//console.log(data2['transitions'][i]['transition']['consumed'])
									
									// add reactants
									var cons =[]
									if (data2['transitions'][i]['transition']['consumed']){
										for (var j=0, jj=data2['transitions'][i]['transition']['consumed'].length; j<jj;j++){ 
											myreaction[10][0].push([idMap_RPM[data2['transitions'][i]['transition']['consumed'][j]['consumed_preplace']['name']],  data2['transitions'][i]['transition']['consumed'][j]['consumed_preplace']['name']]);
											model_data[3].push([counter, idMap_RPM[data2['transitions'][i]['transition']['consumed'][j]['consumed_preplace']['name']],0,1,modelName]);
											cons.push(data2['transitions'][i]['transition']['consumed'][j]['consumed_preplace']['name']);
										}
									}
									// add modifiers
									if (data2['transitions'][i]['transition']['preplaces']){
										for (var j=0, jj=data2['transitions'][i]['transition']['preplaces'].length; j<jj;j++){ 
											if (cons.indexOf(data2['transitions'][i]['transition']['preplaces'][j]['preplace']['name'])==-1){
												myreaction[10][2].push([ idMap_RPM[data2['transitions'][i]['transition']['preplaces'][j]['preplace']['name']], data2['transitions'][i]['transition']['preplaces'][j]['preplace']['name']]);
												model_data[3].push([counter, idMap_RPM[data2['transitions'][i]['transition']['preplaces'][j]['preplace']['name']],2,1,modelName]);
											//console.log(data2['transitions'][i]['transition']['preplaces'][j]['preplace']['name']);
											}
											//cons.push(data2['transitions'][i]['transition']['consumed'][j]['consumed_preplace']['name']);
										}
									}
									// add products
									if (data2['transitions'][i]['transition']['postplaces']){
										for (var j=0, jj=data2['transitions'][i]['transition']['postplaces'].length; j<jj;j++){ 
											// a product has a name and a stoichiometry
											
											myreaction[10][1].push([idMap_RPM[data2['transitions'][i]['transition']['postplaces'][j]['postplace']['name']], data2['transitions'][i]['transition']['postplaces'][j]['postplace']['name'],data2['transitions'][i]['transition']['postplaces'][j]['postplace']['stoichiometry'] ]);
											model_data[3].push([counter, idMap_RPM[data2['transitions'][i]['transition']['postplaces'][j]['postplace']['name']],1,1,modelName]);
											//console.log(myreaction[10][1]);
										}
									}
									model_data[2].push(myreaction);
									counter++;
								}
							}
							if (data2['qssf'] && data2['qssf']['objectives']){
								for (var i=0, ii=data2['qssf']['objectives'].length; i<ii;i++){
									//console.log("objective: "+data2['qssf']['objectives'][i]['objective']['name']+" activity: "+data2['qssf']['objectives'][i]['objective']['activity']+" objective: "+data2['qssf']['objectives'][i]['objective']['objective']);
									//model_data[2][idMap_RPM[data2['qssf']['objectives'][i]['objective']['name']]][7]=2;
									model_data[2][idMap_RPM[data2['qssf']['objectives'][i]['objective']['name']]][10]=[2, [data2['qssf']['objectives'][i]['objective']['activity'],data2['qssf']['objectives'][i]['objective']['objective']]]
									//console.log(data2['qssf']['objectives'][i]['objective']['objective'])
									var myTypeSim=2;
									var isInRecon=false;
									for (var j=0, jj=mytb.file[1].length; j<jj;j++){
										//console.log(data0.sbml)
										// check if the idname is the same as a metabolic network name, if so label that node as type sim 3 = interface between petrinet and metabolic
										//data2['qssf']['objectives'][i]['objective'].length
										var substring =mytb.file[1][j][1].substring(mytb.file[1][j][1].length-data2['qssf']['objectives'][i]['objective']['objective'].length,mytb.file[1][j][1].length)
										//console.log(data2['qssf']['objectives'][i]['objective']['objective'])
										//console.log(substring)
										if (substring==data2['qssf']['objectives'][i]['objective']['objective']){
											myTypeSim=3;
											model_data[3].push( [idMap_RPM[data2['qssf']['objectives'][i]['objective']['name']], mytb.file[1][j][0], -1, 2,modelName]);
											isInRecon=true;
										}
										//////////////////
										// what do do if name of objective is not in the model file nor in the sbml file? -> add a new node
										//else{
											//console.log("objective node : "+data2['qssf']['objectives'][i]['objective']['objective']+" has no link to existing recon node")
										//}
										/*else{
											myTypeSim=2;
											// create extra node
											//console.log(data0[1].length)
											model_data[2].push([counter, data2['qssf']['objectives'][i]['objective']['objective'], -1, [[],[]], [] , 2, -1,-1,-1,[1, []], [[], [], []], [modelName]]);
											model_data[3].push( [idMap_RPM[data2['qssf']['objectives'][i]['objective']['name']], counter, -1, 2,modelName]);
											counter++;
										}*/
										
									}
									if (isInRecon== false){
										// if not in recon do something
										//console.log("objective node : "+data2['qssf']['objectives'][i]['objective']['objective']+" has no link to existing recon node");
										
										//model_data[2].push([counter, data2['qssf']['objectives'][i]['objective']['objective'], -1, [[],[]], [] , 2, -1,-1,-1,[1, []], [[], [], []], [modelName]]);
										//model_data[3].push( [idMap_RPM[data2['qssf']['objectives'][i]['objective']['name']], counter, -1, 2,modelName]);
										//counter++;
									}
									model_data[2][idMap_RPM[data2['qssf']['objectives'][i]['objective']['name']]][7]=myTypeSim;
									//console.log(model_data[2][idMap_RPM[data2['qssf']['objectives'][i]['objective']['name']]][10][1]);
								}
							}
							if (data2['qssf'] && data2['qssf']['constraints']){
							
								for (var i=0, ii=data2['qssf']['constraints'].length; i<ii;i++){
									//console.log("constraint: "+data2['qssf']['constraints'][i]['constraint']['name']+" activity: "+data2['qssf']['constraints'][i]['constraint']['activity'] +" Flux list: "+data2['qssf']['constraints'][i]['constraint']['flux_list']);
									model_data[2][idMap_RPM[data2['qssf']['constraints'][i]['constraint']['name']]][10]=[3, [data2['qssf']['constraints'][i]['constraint']['activity'],data2['qssf']['constraints'][i]['constraint']['flux_list']]]
									//console.log(data2['qssf']['constraints'][i]['constraint']['flux_list'])
									var myTypeSim=2;
									for (var j=0, jj=mytb.file[1].length; j<jj;j++){
										//console.log(data2['qssf']['constraints'][i]['constraint']['flux_list'].length)
										
										for (var h=0, hh=data2['qssf']['constraints'][i]['constraint']['flux_list'].length; h<hh;h++){
											//console.log(data2['qssf']['constraints'][i]['constraint']['flux_list'][h]);
											//var substring =data0[1][j][1].substring(data0[1][j][1].length-1-data2['qssf']['constraints'][i]['constraint']['flux_list'][h].length,data0[1][j][1].length-1)
											var substring =mytb.file[1][j][1].substring(mytb.file[1][j][1].length - data2['qssf']['constraints'][i]['constraint']['flux_list'][h].length , mytb.file[1][j][1].length);
											//console.log(substring)
											if (substring==data2['qssf']['constraints'][i]['constraint']['flux_list'][h]){
												myTypeSim=3;
												model_data[3].push( [idMap_RPM[data2['qssf']['constraints'][i]['constraint']['name']], mytb.file[1][j][0], -1, 2,modelName]);
												//model_data[2][idMap_RPM[data2['qssf']['constraints'][i]['constraint']['name']]][7]=3;
												//console.log(idMap_RPM[data2['qssf']['constraints'][i]['constraint']['name']]);
											}
											//else{
											//	model_data[2][idMap_RPM[data2['qssf']['constraints'][i]['constraint']['name']]][7]=2;
											//}
										}
									}
									model_data[2][idMap_RPM[data2['qssf']['constraints'][i]['constraint']['name']]][7]=myTypeSim;
								}	
							}
							data2['extra']=model_data;
							
							//var data0=data2;
						
							var openp= true;
							if (!req.param('defaultread')){
								openp= false;
							}
							//console.log(req.param('owner'))
							var qsspn_modelObj = {
							  name: req.param('name'),
							  comment: req.param('comment'),
							  owner: req.param('owner'),
							  metabolic_net: req.param('metabolic_net'),
							  users: JSON.parse(req.param('users')),
							  openpolicy: openp,
							  file: data2,
							  sfba: data3,
							  layouts: {}
							  //file: req.param('file')
							  //var file = req.files.file,
							}
							
							// Create a User with the params sent from 
							// the sign-up form --> new.ejs
							Qsspn_model.create(qsspn_modelObj, function qmCreated(err, qm) {
								//console.log(qm)
							  // // If there's an error
							  // if (err) return next(err);
							
							  if (err) {
								console.log(err);
								req.session.flash = {
								  err: err
								}

								// If error redirect back to sign-up page
								return res.redirect('/qsspn_model/new');
							  }
							  
							  User.findOne({ name: username}, function foundUser(merr, user) {
								var models=user.models;
								if (models.indexOf(qm.name)==-1){
									models.push(qm.name);
								}
								
								var userObj = {
								  name: user.name,
								  title: user.title,
								  email: user.email,
								  encryptedPassword: user.encryptedPassword,
								  online: user.online,
								  admin: user.admin,
								  metabolic_nets: user.metabolic_nets,
								  models: models,
								  rooms: user.rooms
								}
								User.update(user.id, userObj, function usrUpdated(erru) {
							  
								
							  // Log user in
							  //req.session.authenticated = true;
							  //req.session.User = mtn;

							  // Change status to online
							  //user.online = true;
							  
							  
							  
							  qm.save(function(err, qm) {
								if (err) return next(err);

							  // add the action attribute to the user object for the flash message.
							  qm.action = " qsspn model all created."

							  // Let other subscribed sockets know that the user was created.
							 Qsspn_model.publishCreate(qm);

								// After successfully creating the user
								// redirect to the show action
								// From ep1-6: //res.json(user); 

								res.redirect('/qsspn_model/show/' + qm.id);
							  });
							});   
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
			Qsspn_model.findOne(req.param('id'), function foundQm(err, qm) {
				if (err) return next(err);
				if (!qm) return next();
				Metabolic_net.findOne({ name: qm.metabolic_net}, function foundMtb(err2, mtb) {
					if (err2) return next(err2);
					if (!mtb) return next();
					Metabolic_net_layout.find({ metabolic_net: mtb.name}, function foundMtnls(err3, mtnls) {
						if (err2) return next(err2);
						if (!mtnls) return next();
						var mtnlID="";
						if (req.param('mtnl-id')){	
							mtnlID=req.param('mtnl-id');
						}
						// var mtnl={};
						// var listLayouts=[];
						// for (var i=0;i<mtnls.length;i++){
							// listLayouts.push([mtnls[i].id, mtnls[i].name, mtnls[i].comment]);
							// if (mtnlID!="" && mtnlID==mtnls[i].id){
								// mtnl =mtnls[i];
							// }
						// }
						
						
						Lab.find(function(errl, labs) {
						
							Qsspn_model_layout.find({ qsspn_model: qm.name}, function foundQmls(err4, qmls) {				
								if (err4) return next(err4);
								if (!qmls) return next();
								
								var inLabs=[];
								for (var j=0;j<labs.length;j++){
									if (labs[j]["users"].indexOf(username)!=-1){
										inLabs.push(labs[j].name)
									}
								}
								
								//console.log(qmls)
								var qmlID="";
								if (req.param('qml-id')){	
									qmlID=req.param('qml-id');
								}
								
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
									var isNotIn=true;
									for (var j=0;j<users.length;j++){
										if (users[j][0]==username){
											isNotIn=false;
										}
									}
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
									if (isNotIn && qmls[i].openpolicy && qmls[i].openpolicy==true){
										listQmLayouts.push([qmls[i].id, qmls[i].name, qmls[i].comment]);
										if (qmlID!="" && qmlID==qmls[i].id){
											myqml =qmls[i];
										}
									}
								}
								
								
								
								var mtnl={};
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
												if (mtnlID!="" && mtnlID==mtnls[i].id){
													mtnl =mtnls[i];
												}
											}
										}
										
									}
									if (isNotIn && mtnls[i].openpolicy && mtnls[i].openpolicy==true){
										listLayouts.push([mtnls[i].id, mtnls[i].name, mtnls[i].comment, mtnls[i].metabolic_net]);
										if (mtnlID!="" && mtnlID==mtnls[i].id){
											mtnl =mtnls[i];
										}
									}
								}
								var goNext =false;
								var users = qm.users;
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
										qm: qm,
										mtb: mtb,
										mtnls: listLayouts,
										mtnl: mtnl,
										qmls: listQmLayouts,
										mqml: myqml
									});
								}
								else if (isNotIn && qm.openpolicy==true){
									res.view({
										qm: qm,
										mtb: mtb,
										mtnls: listLayouts,
										mtnl: mtnl,
										qmls: listQmLayouts,
										mqml: myqml
									});
								}
								else return next();
							});
						});
						
					});
				});
			  
			  
			});
		}
	},
	index: function(req, res, next) {
		if (req.session.authenticated){
			var username = req.session.User.name;
			Qsspn_model.find(function foundQms(err, qms) {
				if (err) return next(err);
				Metabolic_net.find(function foundMtns(err2, mtns) {
					Lab.find(function(err3, labs) {
						var mtns_nodes={};
						for (var i=0;i<mtns.length;i++){
							mtns_nodes[mtns[i]['name']]=mtns[i]['file'][1];
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
							var isNotIn=true;
							for (var j=0;j<users.length;j++){
								if (users[j][0]==username){
									isNotIn=false;
								}
							}
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
							if (isNotIn && qms[i].openpolicy && qms[i].openpolicy==true){
								listQms.push(qms[i]);
							}
						}
						
						res.view({
							qms: listQms,
							mtns: mtns_nodes
						});
				    });
				});
			});
		}
	},
	
	editusers: function(req, res, next) {
		if (req.session.authenticated){
			var username = req.session.User.name;
			Qsspn_model.findOne(req.param('id'), function foundQm(err, qm) {
				User.find(function(err2, usrs) {
					if (err2) {return res.serverError(err2);}
					Lab.find(function(err3, labs) {
						var listUsers=[];
						for (var i=0;i<usrs.length;i++){
							listUsers.push(usrs[i].name);
						}
						if (qm.owner==req.session.User.name){
							res.view({
								labs: labs,
								usrs: listUsers,
								openpolicy: qm.openpolicy,
								qmid: qm.id,
								qmname: qm.name,
								qmusers: qm.users
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
			Qsspn_model.findOne(req.param('id'), function foundQm(err, qm) {
				if (err) return next(err);
				if (!qm) return next();
				var openp= true;
				if (!req.param('defaultread')){
					openp= false;
				}
				var qsspn_modelObj = {
					name: qm.name,
					comment: qm.comment,
					owner: qm.owner,
					metabolic_net: qm.metabolic_net,
					users: JSON.parse(req.param('users')),
					openpolicy: openp,
					file: qm.file,
					sfba: qm.sfba,
					layouts: qm.layouts//JSON.parse(req.param('layouts')) // should rather concatenate data...
				}
				
				if (qm.owner==req.session.User.name){
					Qsspn_model.update(req.param('id'), qsspn_modelObj, function qmUpdated(err2) {
						User.findOne({ name: username}, function foundUser(merr, user) {
							var models=user.models;
							if (models.indexOf(qm.name)==-1){
								models.push(qm.name);
							}
							
							var userObj = {
							  name: user.name,
							  title: user.title,
							  email: user.email,
							  encryptedPassword: user.encryptedPassword,
							  online: user.online,
							  admin: user.admin,
							  metabolic_nets: user.metabolic_nets,
							  models: models,
							  rooms: user.rooms
							}
							User.update(user.id, userObj, function usrUpdated(erru) {
								res.redirect('/qsspn_model/show/' + qm.id);
							});
						});
					});
				}
				else return next();
			});
		}
	},
	
	edit: function(req, res, next) {
		if (req.session.authenticated){
			var username = req.session.User.name;
			Qsspn_model.findOne(req.param('id'), function foundQm(err, qm) {
				if (err) return next(err);
				if (!qm) return next();
				Metabolic_net.findOne({ name: qm.metabolic_net}, function foundMtb(err2, mtb) {
					if (err2) return next(err2);
					if (!mtb) return next();
					Lab.find(function(errl, labs) {
						var inLabs=[];
						for (var j=0;j<labs.length;j++){
							if (labs[j]["users"].indexOf(username)!=-1){
								inLabs.push(labs[j].name)
							}
						}
						var goNext =false;
						var users = qm.users;
						for (var j=0;j<users.length;j++){
							if ((users[j][0]==username || inLabs.indexOf(users[j][0])!=-1) && users[j][3]==true){
								goNext=true;
							}
						}
						if (goNext==true ){
							res.view({
								qm: qm,
								mtb: mtb
							});
						}
						else return next();
					});
			  
				});
			  
			  
			});
		}
	},
	
	update: function(req, res, next) {
		if (req.session.authenticated){
			var username = req.session.User.name;
			Qsspn_model.findOne(req.param('id'), function foundQm(err, qm) {
				if (err) return next(err);
				if (!qm) return next();
				
				Metabolic_net.findOne({ name: qm.metabolic_net}, function foundMtb(merr, mytb) {
					if (merr) return next(merr);
					if (!mytb) return next();
					// do whatever update here
					var result={};
					var stringLayouts=req.param('layouts0')+req.param('layouts1')+req.param('layouts2')+req.param('layouts3')+req.param('layouts4')+req.param('layouts5')+req.param('layouts6')+req.param('layouts7')+req.param('layouts8')+req.param('layouts9');
					if (req.param('layouts0') ){
						var tmp = JSON.parse(stringLayouts);
					}
					if (req.param('mjsondata') ){			
					
						var tmp2 = JSON.parse(req.param('mjsondata'));
						
						if (Object.getOwnPropertyNames(tmp2).length !== 0){
							console.log(tmp2['transitions'].length)
							qm.file['places']=tmp2['places'];
							qm.file['transitions']=tmp2['transitions'];
						}
					// rebuild 'extra' in json model
					}
					var stringOutput=req.param('mySpreadsheet0')+req.param('mySpreadsheet1')+req.param('mySpreadsheet2')+req.param('mySpreadsheet3')+req.param('mySpreadsheet4')+req.param('mySpreadsheet5')+req.param('mySpreadsheet6')+req.param('mySpreadsheet7')+req.param('mySpreadsheet8')+req.param('mySpreadsheet9');
					if (req.param('mySpreadsheet0')){
						var tmp3 = JSON.parse(stringOutput);
						qm.file['places']=tmp3['places'];
						qm.file['transitions']=tmp3['transitions'];
						qm.file['qssf']=tmp3['qssf'];
					}
					
					
					var model_data=qm.file['extra'];
					model_data[2]=[];
					model_data[3]=[];
					var data2=qm.file;
					var modelName= qm.name;
					// display list of compartments
					//console.log(mytb.file[0])
					//for (var i=0, ii=mytb.file[0].length; i<ii;i++){
					//	model_data[1].push(mytb.file[0][i]);
					//}
					var idMap_RPM={};
					var counter=0;
					//var data2 = mytb;
					
					for (var i=0, ii=data2['places'].length; i<ii;i++){
						// a place with type 1 is a common node, a place with type 2 is an objective node, type 3 would be a constraint for a reaction node
						// type qsspn =0 means a place and =1 means a reaction
						// id nb + name + compartment nb + info + [state,max] + snoopy type + qsspn type + type sim + type reconx + [rate, transition type, delay] + empty stuff (products, reactants, modifiers) + model name
						var subsys=[];
						if (data2['places'][i]['place']['subsystem'])
							subsys=[data2['places'][i]['place']['subsystem']];
						model_data[2].push([counter, data2['places'][i]['place']['name'], -1, [[],subsys], [data2['places'][i]['place']['state'],data2['places'][i]['place']['max']] , 2, data2['places'][i]['place']['type'],1,0,[1, []], [[], [], []], [modelName]]);
						idMap_RPM[data2['places'][i]['place']['name']]=counter;
						counter++;
						//console.log(data2['places'][i])
					}
					for (var i=0, ii=data2['transitions'].length; i<ii;i++){
						var subsys=[];
						if (data2['transitions'][i]['transition']['subsystem'])
							subsys=[data2['transitions'][i]['transition']['subsystem']];
						var myreaction = [counter, data2['transitions'][i]['transition']['name'], -1, [[],subsys], [data2['transitions'][i]['transition']['c'],data2['transitions'][i]['transition']['type'],data2['transitions'][i]['transition']['delay']] , 4, -1,1,0,[[], []], [[], [], []], [modelName]];
						//console.log(data2['transitions'][i]['transition']['consumed'])
						
						// add reactants
						var cons =[]
						if (data2['transitions'][i]['transition']['consumed']){
							for (var j=0, jj=data2['transitions'][i]['transition']['consumed'].length; j<jj;j++){ 
								myreaction[10][0].push([idMap_RPM[data2['transitions'][i]['transition']['consumed'][j]['consumed_preplace']['name']],  data2['transitions'][i]['transition']['consumed'][j]['consumed_preplace']['name']]);
								model_data[3].push([counter, idMap_RPM[data2['transitions'][i]['transition']['consumed'][j]['consumed_preplace']['name']],0,1,modelName]);
								cons.push(data2['transitions'][i]['transition']['consumed'][j]['consumed_preplace']['name']);
							}
						}
						// add modifiers
						if (data2['transitions'][i]['transition']['preplaces']){
							for (var j=0, jj=data2['transitions'][i]['transition']['preplaces'].length; j<jj;j++){ 
								if (cons.indexOf(data2['transitions'][i]['transition']['preplaces'][j]['preplace']['name'])==-1){
									myreaction[10][2].push([ idMap_RPM[data2['transitions'][i]['transition']['preplaces'][j]['preplace']['name']], data2['transitions'][i]['transition']['preplaces'][j]['preplace']['name']]);
									model_data[3].push([counter, idMap_RPM[data2['transitions'][i]['transition']['preplaces'][j]['preplace']['name']],2,1,modelName]);
								//console.log(data2['transitions'][i]['transition']['preplaces'][j]['preplace']['name']);
								}
								//cons.push(data2['transitions'][i]['transition']['consumed'][j]['consumed_preplace']['name']);
							}
						}
						// add products
						if (data2['transitions'][i]['transition']['postplaces']){
							for (var j=0, jj=data2['transitions'][i]['transition']['postplaces'].length; j<jj;j++){ 
								// a product has a name and a stoichiometry
								
								myreaction[10][1].push([idMap_RPM[data2['transitions'][i]['transition']['postplaces'][j]['postplace']['name']], data2['transitions'][i]['transition']['postplaces'][j]['postplace']['name'],data2['transitions'][i]['transition']['postplaces'][j]['postplace']['stoichiometry'] ]);
								model_data[3].push([counter, idMap_RPM[data2['transitions'][i]['transition']['postplaces'][j]['postplace']['name']],1,1,modelName]);
								//console.log(myreaction[10][1]);
							}
						}
						model_data[2].push(myreaction);
						counter++;
					}
					
					
					for (var i=0, ii=data2['qssf']['objectives'].length; i<ii;i++){
						//console.log("objective: "+data2['qssf']['objectives'][i]['objective']['name']+" activity: "+data2['qssf']['objectives'][i]['objective']['activity']+" objective: "+data2['qssf']['objectives'][i]['objective']['objective']);
						//model_data[2][idMap_RPM[data2['qssf']['objectives'][i]['objective']['name']]][7]=2;
						model_data[2][idMap_RPM[data2['qssf']['objectives'][i]['objective']['name']]][10]=[2, [data2['qssf']['objectives'][i]['objective']['activity'],data2['qssf']['objectives'][i]['objective']['objective']]]
						//console.log(data2['qssf']['objectives'][i]['objective']['objective'])
						var myTypeSim=2;
						var isInRecon=false;
						for (var j=0, jj=mytb.file[1].length; j<jj;j++){
							//console.log(data0.sbml)
							// check if the idname is the same as a metabolic network name, if so label that node as type sim 3 = interface between petrinet and metabolic
							//data2['qssf']['objectives'][i]['objective'].length
							var substring =mytb.file[1][j][1].substring(mytb.file[1][j][1].length-data2['qssf']['objectives'][i]['objective']['objective'].length,mytb.file[1][j][1].length)
							//console.log(data2['qssf']['objectives'][i]['objective']['objective'])
							//console.log(substring)
							if (substring==data2['qssf']['objectives'][i]['objective']['objective']){
								myTypeSim=3;
								model_data[3].push( [idMap_RPM[data2['qssf']['objectives'][i]['objective']['name']], mytb.file[1][j][0], -1, 2,modelName]);
								isInRecon=true;
							}
							//////////////////
							// what do do if name of objective is not in the model file nor in the sbml file? -> add a new node
							//else{
								//console.log("objective node : "+data2['qssf']['objectives'][i]['objective']['objective']+" has no link to existing recon node")
							//}
							
							
						}
						if (isInRecon== false){
							// if not in recon do something
							//console.log("objective node : "+data2['qssf']['objectives'][i]['objective']['objective']+" has no link to existing recon node");
							
							//model_data[2].push([counter, data2['qssf']['objectives'][i]['objective']['objective'], -1, [[],[]], [] , 2, -1,-1,-1,[1, []], [[], [], []], [modelName]]);
							//model_data[3].push( [idMap_RPM[data2['qssf']['objectives'][i]['objective']['name']], counter, -1, 2,modelName]);
							//counter++;
						}
						model_data[2][idMap_RPM[data2['qssf']['objectives'][i]['objective']['name']]][7]=myTypeSim;
						//console.log(model_data[2][idMap_RPM[data2['qssf']['objectives'][i]['objective']['name']]][10][1]);
					}
					
					for (var i=0, ii=data2['qssf']['constraints'].length; i<ii;i++){
						//console.log("constraint: "+data2['qssf']['constraints'][i]['constraint']['name']+" activity: "+data2['qssf']['constraints'][i]['constraint']['activity'] +" Flux list: "+data2['qssf']['constraints'][i]['constraint']['flux_list']);
						model_data[2][idMap_RPM[data2['qssf']['constraints'][i]['constraint']['name']]][10]=[3, [data2['qssf']['constraints'][i]['constraint']['activity'],data2['qssf']['constraints'][i]['constraint']['flux_list']]]
						//console.log(data2['qssf']['constraints'][i]['constraint']['flux_list'])
						var myTypeSim=2;
						for (var j=0, jj=mytb.file[1].length; j<jj;j++){
							//console.log(data2['qssf']['constraints'][i]['constraint']['flux_list'].length)
							
							for (var h=0, hh=data2['qssf']['constraints'][i]['constraint']['flux_list'].length; h<hh;h++){
								//console.log(data2['qssf']['constraints'][i]['constraint']['flux_list'][h]);
								//var substring =data0[1][j][1].substring(data0[1][j][1].length-1-data2['qssf']['constraints'][i]['constraint']['flux_list'][h].length,data0[1][j][1].length-1)
								var substring =mytb.file[1][j][1].substring(mytb.file[1][j][1].length - data2['qssf']['constraints'][i]['constraint']['flux_list'][h].length , mytb.file[1][j][1].length);
								//console.log(substring)
								if (substring==data2['qssf']['constraints'][i]['constraint']['flux_list'][h]){
									myTypeSim=3;
									model_data[3].push( [idMap_RPM[data2['qssf']['constraints'][i]['constraint']['name']], mytb.file[1][j][0], -1, 2,modelName]);
									//model_data[2][idMap_RPM[data2['qssf']['constraints'][i]['constraint']['name']]][7]=3;
									//console.log(idMap_RPM[data2['qssf']['constraints'][i]['constraint']['name']]);
								}
								//else{
								//	model_data[2][idMap_RPM[data2['qssf']['constraints'][i]['constraint']['name']]][7]=2;
								//}
							}
						}
						model_data[2][idMap_RPM[data2['qssf']['constraints'][i]['constraint']['name']]][7]=myTypeSim;
					}
					qm.file['extra']=model_data;
					
					
					
					
					
					
					
					
					
					for(var key in qm.layouts) result[key]=qm.layouts[key];
					for(var key in tmp) result[key]=tmp[key];
					var qsspn_modelObj = {
						name: qm.name,
						comment: qm.comment,
						owner: qm.owner,
						metabolic_net: qm.metabolic_net,
						users: qm.users,
						openpolicy: qm.openpolicy,
						file: qm.file,
						sfba: qm.sfba,
						layouts: result//JSON.parse(req.param('layouts')) // should rather concatenate data...
					}
					
					Lab.find(function(errl, labs) {
						var inLabs=[];
						for (var j=0;j<labs.length;j++){
							if (labs[j]["users"].indexOf(username)!=-1){
								inLabs.push(labs[j].name)
							}
						}
						var goNext =false;
						var users = qm.users;
						for (var j=0;j<users.length;j++){
							if ((users[j][0]==username || inLabs.indexOf(users[j][0])!=-1) && users[j][3]==true){
								goNext=true;
							}
						}
						if (goNext==true ){
						
							Qsspn_model.update(req.param('id'), qsspn_modelObj, function qmUpdated(err) {
								res.redirect('/qsspn_model/show/' + qm.id);
							});
						}
						else return next();
					});
				});	
			});
		}
	},
	
	subscribe: function(req, res) {
		// Find all current users in the user model
		Qsspn_model.find(function foundExp(err, qms) {
		  if (err) return next(err);
	 
		  // subscribe this socket to the User model classroom
		  Qsspn_model.subscribe(req.socket);
	 
		  // subscribe this socket to the user instance rooms
		  Qsspn_model.subscribe(req.socket, qms);
	 
		  // This will avoid a warning from the socket for trying to render
		  // html over the socket.
		  res.send(200);
		});
	},
	
  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to Qsspn_modelController)
   */
  _config: {}

  
};
