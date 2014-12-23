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
		Qsspn_model.find(function(err, qms) {
			if (err) {return res.serverError(err);}
			
			return res.view({qms: qms});
		});
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
		  comment: req.param('comment'),
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
		Experiment.findOne(req.param('id'), function foundExp(err, exp) {
		
		  if (err) return next(err);
		  if (!exp) return next();
		  res.view({
			exp: exp
		  });
		});
	},
	
	index: function(req, res, next) {
		// Get an array of all users in the User collection(e.g. table)
		Experiment.find(function foundExps(err, experims) {
		  if (err) return next(err);
		  // pass the array down to the /views/index.ejs page
		  res.view({
			experims: experims
		  });
		});
	},
	
	showresult: function(req, res, next) {
		
		Experiment.findOne(req.param('id'), function foundExp(err, exp) {
			Metabolic_net.findOne({ name: exp.metabolic_net_name}, function foundMtb(err2, mtb) {
				if (err2) return next(err2);
				if (!mtb) return next();
				Qsspn_model.findOne({ name: exp.qsspn_model_name}, function foundQm(err3, qmm) {
					if (err3) return next(err3);
					if (!qmm) return next();
					var parRes=-1;
					for (var i=0;i<200;i++){
						if (req.param('r'+i)){
							if (req.param('r'+i)!=-1){
								parRes=req.param('r'+i);
							}
							
						}
					}
					var tRes=-1;
					for (var i=0;i<200;i++){
						if (req.param('t'+i)){
							if (req.param('t'+i)!=-1){
								tRes=req.param('t'+i);
							}
							
						}
					}
					var lRes=-1;
					for (var i=0;i<200;i++){
						if (req.param('l'+i)){
							if (req.param('l'+i)!=-1){
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
						
						
						/*
						var stream = fs.createReadStream(file);

						var csvStream = csv({delimiter: "\t"})
						.on("data", function(data){
						
							if (countline==0){
								headtitles = data
								headtitles[headtitles.length-1]=headtitles[headtitles.length-1].replace('\r','');
								
							}
							//var melement = line.split('\t');
							if (data[0] && data[0]=="Trajectory"){	
								
								cntTrajectories++;
								console.log(cntTrajectories);
								if (cntTrajectories==simTrajectory	){
									inSim=true;
								}
								if (cntTrajectories>simTrajectory	){
									inSim=false;
								}
							}
							else{
								if (data[2] && data[2]!='none'){
									if (!mcountToken.hasOwnProperty(data[2])){
										mcountToken[data[2]]=[];
									}
									else if (mcountToken[data[2]].length==0){
										for (var i1=0;i1<totalNbTrajectories;i1++){
											mcountToken[data[2]].push(0);
										}	
										mcountToken[data[2]][cntTrajectories]+=1;
									}
									else{
										if(mcountToken[data[2]].length>cntTrajectories){
											mcountToken[data[2]][cntTrajectories]+=1;
										}
									}
								}
								if (inSim==true){
									mdataSim+=data.toString();
								}
								
							}
							countline++;
						})
						.on("end", function(){
							console.log(mdataSim.length)
							console.log(mdataSim[0].length)
							res.view({
								exp: exp,
								mtb:mtb,
								nbRes: parRes,
								dataR: mdataSim,
								headtitles: headtitles,
								ly: qmm.layouts,
								stats: mcountToken
							});
						});
						stream.pipe(csvStream);
						*/
						
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
									nbRes: parRes,
									dataR: mdataSim,
									headtitles: headtitles,
									ly: qmm.layouts,
									stats: mcountToken
								});
							}							
						})();
						
						
						
						/*
						var stream = LineInputStream(fs.createReadStream(file, { flags: "r" }));
						stream.setEncoding("utf8");
						stream.setDelimiter("\n");    // optional string, defaults to "\n"

						stream.on("error", function(err) {
								console.log(err);
							});
							
						stream.on("line", function(line) {
								// Sends you lines from the stream delimited by delimiter
								if (countline==0){
									headtitles = line.split('\t');
									headtitles[headtitles.length-1]=headtitles[headtitles.length-1].replace('\r','');
									
								}
								
								
								var melement = line.split('\t');
								if (melement[0] && melement[0]=="Trajectory"){		
									cntTrajectories++;
									if (cntTrajectories==simTrajectory	){
										inSim=true;
									}
									if (cntTrajectories>simTrajectory	){
										inSim=false;
									}
								}
								else{
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
										mdataSim.push(melement)
									}
									
								}
								countline++;
								
			
								
								
							});

						stream.on("end", function() {
							console.log(mdataSim.length)
							console.log(mdataSim[0].length)
							res.view({
								exp: exp,
								mtb:mtb,
								nbRes: parRes,
								dataR: mdataSim,
								headtitles: headtitles,
								ly: qmm.layouts,
								stats: mcountToken
							});
						});

						if(stream.readable) {
							console.log("stream is readable");
						}
						*/
						
						/*var stream = fs.createReadStream(file, {encoding: 'utf8'});
						function read() {
						  var buf;
						  while (buf = stream.read()) {
							console.log('Read from the file:', buf.length);
						  }
						}
						stream.on('readable', read);
 
						stream.once('end', function() {
						  console.log('stream ended');
						});*/

						// fs.readFile(file,"utf-8", function (err, data) {
							// if (err) { console.log("error reading file")}
							// else{
								// myres=[];
								// var mcountToken={};
								// var arrayString = data.split('\n');
								// var headtitles = arrayString[0].split('\t');
								// headtitles[headtitles.length-1]=headtitles[headtitles.length-1].replace('\r','');
								// //console.log(headtitles)
								// var totalNbTrajectories=0;
								// for (var i=0, ii=arrayString.length; i<ii;i++){
									// var melement = arrayString[i].split('\t');
									// if (melement[0] && melement[0]=="Trajectory"){
										
										// totalNbTrajectories++;
									// }
									// else{
										// if (melement[2] && melement[2]!='none'){
											// if (!mcountToken.hasOwnProperty(melement[2])){
												// mcountToken[melement[2]]=[];
											// }
										// }
									// }
								// }
								// var cntTrajectories=-1;
								// for (var i=0, ii=arrayString.length; i<ii;i++){
									// var melement = arrayString[i].split('\t');
									// if (melement[0] && melement[0]=="Trajectory"){
										// if (cntTrajectories<totalNbTrajectories){
										// cntTrajectories++;
										// }
									// }
									// else{
										// if (melement[2] && melement[2]!='none'){
											// if(mcountToken[melement[2]].length==0){
												// for (var i1=0;i1<totalNbTrajectories;i1++){
													// mcountToken[melement[2]].push(0);
												// }
												
												// mcountToken[melement[2]][cntTrajectories]+=1;
												
											// }
											// else{
												// if(mcountToken[melement[2]].length>cntTrajectories){
												// mcountToken[melement[2]][cntTrajectories]+=1;
												// }
											// }
										
										
										// }
									// }
								// }
								// //console.log(mcountToken)
								// /*var totalNbTrajectories=0;
								// for (var i=0, ii=arrayString.length; i<ii;i++){
									// var melement = arrayString[i].split('\t');
									// if (melement[0] && melement[0]=="Trajectory"){
										
										// totalNbTrajectories++;
									// }
									// else{
										// if (melement[2]!='none'){
										// if (mcountToken.hasOwnProperty(melement[2])){
											
											// if (mcountToken[melement[2]].length<totalNbTrajectories){
												// mcountToken[melement[2]].push(0);
											// }
											// else{
												// mcountToken[melement[2]][totalNbTrajectories]+=1;
											// }
										// }
										// else{
											// mcountToken[headtitles[i]]=[0];
										// }
										// }
									// }
								// }*/
								// //console.log(mcountToken)
								// // index of the result to watch is the value of simTrajectory...
								// var simTrajectory=0;
								// if (tRes!=-1)
									// simTrajectory=tRes;
								 // //console.log(localStorage.getItem('myCurrentResult'));
								 
								// var mdataSim=[];
								// var cntStartSim=-1;
								// var cntLine=0;
								// var startSim=0;
								
								
								// for (var i=startSim, ii=arrayString.length; i<ii;i++){
									// var melement = arrayString[i].split('\t');
									// if (melement[0] && melement[0]=="Trajectory"){
											// cntStartSim++;
											// cntLine=i+1;	
									// }
									// if (cntStartSim==simTrajectory	){
										// startSim=cntLine;
									// }
									
								// }
								// var cntLine=startSim;
								// var endSim=startSim;
								// var first=true;
								
								// for (var i=startSim, ii=arrayString.length; i<ii;i++){
									// var melement = arrayString[i].split('\t');
									// if (melement[0] && melement[0]=="Trajectory" && first ==true){
											// cntLine=i;	
											
											
												// first=false;
											
									// }		
								// }
								// if (cntLine==startSim){
									// cntLine=arrayString.length-1;
								// }
								// endSim=cntLine;
								// //console.log("start sim: "+startSim);
								// // get end line of given trajectory 
								// //console.log("end sim: "+endSim);
								
								// for (var i=startSim, ii=endSim; i<ii;i++){
									// if (arrayString[i] && arrayString[i]!=""){
										// var melement = arrayString[i].split('\t');
										// mdataSim.push(melement)
									// }
								// }
									// //mdataSim is the result to visualise
								// //console.log(mdataSim.length)
								// //console.log(mdataSim)
								// //dataR=mdataSim;
								// res.view({
									// exp: exp,
									// mtb:mtb,
									// nbRes: parRes,
									// dataR: mdataSim,
									// headtitles: headtitles,
									// ly: qmm.layouts,
									// stats: mcountToken
								  // });
								
								
							// }
						// });
						//
					}
					catch(erf){}
				});
			});
		});
	},
	
	
	edit: function(req, res, next) {
		// Find the user from the id passed in via params
		Experiment.findOne(req.param('id'), function foundExp(err, exp) {
		  if (err) return next(err);
		  if (!exp) return next('Experiment doesn\'t exist.');
		  res.view({
			exp: exp
		  });
		});
	},
	
	// process the info from edit view
	update: function(req, res, next) {
		
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
			
			
			// use qsspn script on generated file
			
			//console.log(os.platform());
			//function puts(error, stdout, stderr) { sys.puts(stdout) }
			//var scriptLine='assets/windows-qsspn/qsspn.exe assets/qsspn-model-files/'+req.param('qsspn_model_name')+'__'+req.param('name')+'.json assets/control-model-files/'+req.param('qsspn_model_name')+'__'+req.param('name')+'.ctrl.txt';
			//var scriptLine='assets/windows-qsspn/qsspn.exe assets/qsspn-model-files/'+req.param('qsspn_model_name')+'__'+req.param('name')+'.json assets/control-model-files/'+req.param('qsspn_model_name')+'__'+req.param('name')+'.ctrl.txt';
			//console.log("here");
			//exec("cd assets/windows-qsspn/", puts);
			//var scriptLine='mkdir hope';
			//exec(scriptLine, puts);
			//execf('assets/windows-qsspn/test.bat');//,['assets/qsspn-model-files/'+req.param('qsspn_model_name')+'__'+req.param('name')+'.json', 'assets/control-model-files/'+req.param('qsspn_model_name')+'__'+req.param('name')+'.ctrl.txt']);
			//exec('echo %PATH%', function(err, stdout, stderr) {
			//	console.log('PATH:', stdout);
			//});
			//exec('assets\\windows-qsspn\\qsspn.exe', function(err, stdout, stderr) {
			//	console.log('output:', stdout);
			//});
			//var scriptLine=['assets\\qsspn-model-files\\'+req.param('qsspn_model_name')+'__'+req.param('name')+'.json assets\\control-model-files\\'+req.param('qsspn_model_name')+'__'+req.param('name')+'.ctrl.txt';
			//execf('assets\\windows-qsspn\\qsspn.exe',['assets\\windows-qsspn\\hepatocyte-m1_mx4.json','assets\\windows-qsspn\\hepatocyte-m1_mx4.ctrl.txt'] , function(err, stdout, stderr) {
			//	console.log('output:', stdout);
			//});
			//console.log('args:', 'assets\\qsspn-model-files\\'+exp.qsspn_model_name+'__'+exp.name+'.json' + "   "+ 'assets\\control-model-files\\'+exp.qsspn_model_name+'__'+exp.name+'.ctrl.txt');
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
				//console.log(mnb)
				//var startindex = 0;
				//startindex = data.indexOf("OUTPUT");
				//var endindex = data.indexOf("\n",startindex);
				//console.log(startindex+ " "+ endindex);
				//data = data.replace(/^\.(.+)/gm, 'myString$1');
				/*var data2="";
				if (typos==0){
				
				data2= 	data.replace(/^.*OUTPUT.*$/mg, 'OUTPUT assets\\\\output-model-files\\\\'+exp.qsspn_model_name+'__'+exp.name+'__'+mnb+'.output.xls\n');
				}
				else{
				data2 =	data.replace(/^.*OUTPUT.*$/mg, 'OUTPUT assets/output-model-files/'+exp.qsspn_model_name+'__'+exp.name+'__'+mnb+'.output.xls\n');
				}
				var data3 = data2.replace(/^.*SEED.*$/mg, 'SEED '+exp.parameters['default_p'][0][2]+'\n');
				*/
				
				
				
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
				
				
				
				/*var aname='OUTPUT assets\\\\output-model-files\\\\'+exp.qsspn_model_name+'__'+exp.name+'__'+mnb+'.output.xls\n'
				var fname= aname.split('\\').pop().split('/').pop();
				var prefix=fname.split('.output.xls').reverse().pop()
				var nme=prefix.split('__')[1];
				var m_nme=prefix.split('__')[0];//[0];
				console.log(prefix)
				console.log(nme)
				console.log(m_nme)*/
				
				//console.log(data)

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
						comment: exp.comment,
						parameters: myParams,
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
						console.log(req.param('newresults'))
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
						//var watcher = hound.watch('assets/output-model-files');
						//watcher.on('create', function(file, stats) {
						//  console.log(file + ' was created')
						//})
						//watcher.on('change', function(file, stats) {
						//  console.log(file + ' was changed')
						//})
						//watcher.on('delete', function(file) {
						//  console.log(file + ' was deleted')
						//})
						// check if the output result file has been updated
						/*var watcher = chokidar.watch('assets/output-model-files', {ignored: /[\/\\]\./, persistent: true});
						watcher.on('change', function(path) {
							console.log('File', path, 'has been changed'); 
							try{
								// read file content in an asynchronous way
								//var textm = fs.readFile(path,'utf8')
								fs.readFile(path,"utf-8", function (err, data) {
									if (err) { console.log("error reading file")}
									else{
									//
										var arrayString = data.split('\n');
										//var headtitles = arrayString[0].split('\t');
										var totalNbTrajectories=0;
										for (var i=0, ii=arrayString.length; i<ii;i++){
											var melement = arrayString[i].split('\t');
											if (melement[0] && melement[0]=="Trajectory"){
												totalNbTrajectories++;
											}
										}
										for (var simTrajectory=0;simTrajectory<totalNbTrajectories;simTrajectory++){
											var mdataSim=[];
											var cntStartSim=-1;
											var cntLine=0;
											var startSim=0;
											for (var i=startSim, ii=arrayString.length; i<ii;i++){
												var melement = arrayString[i].split('\t');
												if (melement[0] && melement[0]=="Trajectory"){
														cntStartSim++;
														cntLine=i+1;	
												}
												if (cntStartSim==simTrajectory	){
													startSim=cntLine;
												}			
											}
											var cntLine=startSim;
											var endSim=startSim;
											for (var i=startSim, ii=arrayString.length; i<ii;i++){
												var melement = arrayString[i].split('\t');
												if (melement[0] && melement[0]=="Trajectory"){
														cntLine=i;	
												}		
											}
											if (cntLine==startSim){
												cntLine=arrayString.length-1;
											}
											endSim=cntLine;
											console.log("start sim: "+startSim);
											// get end line of given trajectory 
											console.log("end sim: "+endSim);
											for (var i=startSim, ii=endSim; i<ii;i++){
												if (arrayString[i] && arrayString[i]!=""){
													var melement = arrayString[i].split('\t');
													mdataSim.push(melement)
												}
											}
											if (myres[simTrajectory]){
												myres[simTrajectory]["data"]=mdataSim;
												myres[simTrajectory]["status"]="processed";
											
											}
											else{
											
												myres.push({'nb': simTrajectory, 'data': mdataSim, 'status': "processed"})
											}
										}
										
										
										ExpObj.results=myres;
										Experiment.update(req.param('id'), ExpObj, function expUpdated(err) {});
										
										//{'nb': newnb, 'data': [], 'status': "Not started yet"}
										
									
										//console.log(data)
										Experiment.publishUpdate(req.param('id'), {
											name: exp.name,
											results: JSON.stringify(myres),
											action: ('file has just been updated. nb of trajectories: '+totalNbTrajectories)
										});
										
									}
								});
								//
							}
							catch(erf){}
							
						});	
						*/	
							
						res.redirect('/experiment/show/' + req.param('id'));
						});
						
					}
					//err || console.log('Data replaced');
				});
				
			});
			
			
			
			
			//execf('assets\\windows-qsspn\\qsspn.exe',['assets\\qsspn-model-files\\hepatocyte-m1__file1.json','assets\\control-model-files\\hepatocyte-m1__file1.ctrl.txt'] , function(err, stdout, stderr) {
			//	console.log('output:', stdout);
			//});
			//
			//console.log(os.platform());
			
		  
		});
		//if (req.session.User.admin) {
		//  var userObj = {
		//	name: req.param('name'),
		//	title: req.param('title'),
		//	email: req.param('email'),
		//	admin: req.param('admin')
		//  }
		//} else {
		//  var userObj = {
		//	name: req.param('name'),
		//	title: req.param('title'),
		//	email: req.param('email')
		//  }
		//}
		
		
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
