/**
 * Bootstrap
 *
 * An asynchronous boostrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#documentation
 */
var hound = require('hound');
var fs = require('fs');
var os = require('os');
var sys = require('sys');
module.exports.bootstrap = function(cb) {

	// It's very important to trigger this callack method when you are finished 
	// with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)

	User.update({}, {
			online: false
		},
		function userUpdated(err, users) {
			if (err) {
				console.log(err);
			} else {
				
				var watcher = hound.watch('assets/output-model-files');
				watcher.on('create', function(file, stats) {
					try{
						console.log(file + ' was created')
						var fname= file.split('\\').pop().split('/').pop();
						var prefix=fname.split('.output.xls').reverse().pop()
						//console.log(prefix);
						var nme=prefix.split('__')[1];
						var m_nme=prefix.split('__')[0];
						var nb_sim=parseInt(prefix.split('__')[2]);
						console.log(nme)
						console.log(m_nme)
						Experiment.findOne({ name: nme , qsspn_model_name: m_nme}, function(err, exp) {
							if (err) return next(err);
							//console.log("exp should exist... It should be: "+exp)
							var ExpObj = {
								name: exp.name,
								comment: exp.comment,
								parameters: exp.parameters,
								qsspn_model_name: exp.qsspn_model_name,
								qsspn_model_instance: exp.qsspn_model_instance,
								sfba_model_instance: exp.sfba_model_instance,
								results: exp.results
							}
							
							ExpObj.results[nb_sim]['status']="Processed";
							//console.log(ExpObj.results)
							Experiment.update(exp.id, ExpObj, function expUpdated(err) {
								//ExpObj.save(function (errx) {
								//	if (errx) return res.send(err,500);

									
								//});
							});
							
							//{'nb': newnb, 'data': [], 'status': "Not started yet"}
							
							//var light_myres= [];
							//for (var i=0;i<ExpObj.results.length;i++){
							//	light_myres.push({'nb': ExpObj.results[i]['nb'],'status': ExpObj.results[i]['status']})
							//}
							Experiment.publishUpdate(exp.id, {
								name: exp.name,
								results: JSON.stringify(ExpObj.results),
								action: ' has been updated.'
							});
							//console.log(data)
							
						  // Do stuff here
						});
					}
					catch(erf){}
					
				  /*try{
						// read file content in an asynchronous way
						//var textm = fs.readFile(path,'utf8')
						fs.readFile(file,"utf-8", function (err, data) {
							if (err) { console.log("error reading file")}
							else{
								myres=[];
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
									//console.log("start sim: "+startSim);
									// get end line of given trajectory 
									//console.log("end sim: "+endSim);
									for (var i=startSim, ii=endSim; i<ii;i++){
										if (arrayString[i] && arrayString[i]!=""){
											var melement = arrayString[i].split('\t');
											mdataSim.push(melement)
										}
									}
									if (myres[simTrajectory]){
										//myres[simTrajectory]["data"]=mdataSim;
										myres[simTrajectory]["status"]="processed";
									
									}
									else{
									
										myres.push({'nb': simTrajectory, 'status': "Processed"})
									}
								}
								//console.log(myres)
								var fname= file.split('\\').pop().split('/').pop();
								var prefix=fname.split('.output.xls').reverse().pop()
								//console.log(prefix);
								var nme=prefix.split('__')[1];
								var m_nme=prefix.split('__')[0];
								var nb_sim=parseInt(prefix.split('__')[2]);
								console.log(nme)
								console.log(m_nme)
								Experiment.findOne({ name: nme , qsspn_model_name: m_nme}, function(err, exp) {
									if (err) return next(err);
									//console.log("exp should exist... It should be: "+exp)
									var ExpObj = {
										name: exp.name,
										comment: exp.comment,
										parameters: exp.parameters,
										qsspn_model_name: exp.qsspn_model_name,
										qsspn_model_instance: exp.qsspn_model_instance,
										sfba_model_instance: exp.sfba_model_instance,
										results: exp.results
									}
									var light_myres= [];
									for (var i=0;i<myres.length;i++){
										light_myres.push({'nb': myres[i]['nb'],'status': myres[i]['status']})
									}
									
									
									ExpObj.results=light_myres;
									//console.log(ExpObj.results)
									Experiment.update(exp.id, ExpObj, function expUpdated(err) {
										//ExpObj.save(function (errx) {
										//	if (errx) return res.send(err,500);

											
										//});
									});
									
									//{'nb': newnb, 'data': [], 'status': "Not started yet"}
									
									var light_myres= [];
									for (var i=0;i<ExpObj.results.length;i++){
										light_myres.push({'nb': ExpObj.results[i]['nb'],'status': ExpObj.results[i]['status']})
									}
									Experiment.publishUpdate(exp.id, {
										name: exp.name,
										results: JSON.stringify(light_myres),
										action: ' has been updated.'
									});
									//console.log(data)
									
								  // Do stuff here
								});
								
								
							}
						});
						//
					}
					catch(erf){}*/
				})
				watcher.on('change', function(file, stats) {
					console.log(file + ' was changed');
					try{					
						var fname= file.split('\\').pop().split('/').pop();
						var prefix=fname.split('.output.xls').reverse().pop()
						//console.log(prefix);
						var nme=prefix.split('__')[1];
						var m_nme=prefix.split('__')[0];
						var nb_sim=parseInt(prefix.split('__')[2]);
						console.log(nme)
						console.log(m_nme)
						Experiment.findOne({ name: nme , qsspn_model_name: m_nme}, function(err, exp) {
							if (err) return next(err);
							var ExpObj = {
								name: exp.name,
								comment: exp.comment,
								parameters: exp.parameters,
								qsspn_model_name: exp.qsspn_model_name,
								qsspn_model_instance: exp.qsspn_model_instance,
								sfba_model_instance: exp.sfba_model_instance,
								results: exp.results
							}
							//console.log(exp.name)
							
							ExpObj.results[nb_sim]['status']="Processed";
							//console.log(ExpObj.results)
							Experiment.update(exp.id, ExpObj, function expUpdated(err) {});
							
							//{'nb': newnb, 'data': [], 'status': "Not started yet"}
							
							
							Experiment.publishUpdate(exp.id, {
								name: exp.name,
								results: JSON.stringify(ExpObj.results),
								action: ' has been updated.'
							});
							//console.log(data)
							
						  // Do stuff here
						});
					}
					catch(erf){}
				  /*try{
						// read file content in an asynchronous way
						//var textm = fs.readFile(path,'utf8')
						fs.readFile(file,"utf-8", function (err, data) {
							if (err) { console.log("error reading file")}
							else{
								myres=[];
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
									//console.log("start sim: "+startSim);
									// get end line of given trajectory 
									//console.log("end sim: "+endSim);
									for (var i=startSim, ii=endSim; i<ii;i++){
										if (arrayString[i] && arrayString[i]!=""){
											var melement = arrayString[i].split('\t');
											mdataSim.push(melement)
										}
									}
									if (myres[simTrajectory]){
										//myres[simTrajectory]["data"]=mdataSim;
										myres[simTrajectory]["status"]="processed";
									
									}
									else{
									
										myres.push({'nb': simTrajectory, 'status': "Processed"})
									}
								}
								//console.log(myres)
								var fname= file.split('\\').pop().split('/').pop();
								var prefix=fname.split('.output.xls').reverse().pop()
								//console.log(prefix);
								var nme=prefix.split('__')[1];
								var m_nme=prefix.split('__')[0];
								//console.log(nme)
								//console.log(m_nme)
								Experiment.findOne({ name: nme , qsspn_model_name: m_nme}, function(err, exp) {
									if (err) return next(err);
									var ExpObj = {
										name: exp.name,
										comment: exp.comment,
										parameters: exp.parameters,
										qsspn_model_name: exp.qsspn_model_name,
										qsspn_model_instance: exp.qsspn_model_instance,
										sfba_model_instance: exp.sfba_model_instance,
										results: exp.results
									}
									//console.log(exp.name)
									var light_myres= [];
									for (var i=0;i<myres.length;i++){
										light_myres.push({'nb': myres[i]['nb'],'status': myres[i]['status']})
									}
									ExpObj.results=light_myres;
									//console.log(ExpObj.results)
									Experiment.update(exp.id, ExpObj, function expUpdated(err) {});
									
									//{'nb': newnb, 'data': [], 'status': "Not started yet"}
									
									
									Experiment.publishUpdate(exp.id, {
										name: exp.name,
										results: JSON.stringify(light_myres),
										action: ' has been updated.'
									});
									//console.log(data)
									
								  // Do stuff here
								});
								
								
							}
						});
						//
					}
					catch(erf){}*/
				  
				  
				})
				watcher.on('delete', function(file) {
				  console.log(file + ' was deleted')
				  
				  try{
								var fname= file.split('\\').pop().split('/').pop();
								var prefix=fname.split('.output.xls').reverse().pop()
								//console.log(prefix);
								var nme=prefix.split('__')[1];
								var m_nme=prefix.split('__')[0];//[0];
								//console.log(nme)
								//console.log(m_nme)
								Experiment.findOne({ name: nme , qsspn_model_name: m_nme}, function(err, exp) {
									if (err) return next(err);
									var ExpObj = {
										name: exp.name,
										comment: exp.comment,
										parameters: exp.parameters,
										qsspn_model_name: exp.qsspn_model_name,
										qsspn_model_instance: exp.qsspn_model_instance,
										sfba_model_instance: exp.sfba_model_instance,
										results: []
									}
									//console.log(exp.name)
									//ExpObj.results=[];
									Experiment.update(exp.id, ExpObj, function expUpdated(err) {});
									
									//{'nb': newnb, 'data': [], 'status': "Not started yet"}
									
									
									Experiment.publishUpdate(exp.id, {
										name: exp.name,
										results: JSON.stringify([]),
										action: ' has been deleted.'
									});
									//console.log(data)
									
								  // Do stuff here
								});
								
								
							
						
						//
					}
					catch(erf){}
				})
				//var watcher = chokidar.watch('assets/output-model-files', { ignored: /[\/\\]\./ , persistent: true});
				//watcher.on('all', function(path) {console.log('File', path, 'has been changed ');})
				//watcher
				//.on('add', function(path) {console.log('File', path, 'has been added to watch ');})
				//.on('unlink', function(path) {console.log('File', path, 'has been removed');})
				//.on('change', function(path) {
				//	console.log('File', path, 'has been changed'); 
				//});
				
			}
			
			cb();
		}
	)
	
	
	//sails.io.sockets.emit("message",{id:o.id,model:"order",verb:"update",data:{id:o.id, status: o.status }})
	
};