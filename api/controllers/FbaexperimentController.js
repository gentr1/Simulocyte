/**
 * FbaExperimentController
 *
 * @description :: Server-side logic for managing fbaexperiments
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var fs = require('fs');
var os = require('os');
var sys = require('sys');
var exec = require('child_process').exec;
var execf = require('child_process').execFile;

module.exports = {
    
  'new': function(req, res, next) {
     User.find(function(err, usrs) {
     			if (err) {return res.serverError(err);}
     			Metabolic_net.find(function(err2, mtbs) {
     				if (err2) {return res.serverError(err2);}
     				return res.view({usrs: usrs, mtbs: _.pluck( mtbs, "name" )});
     			});
     			
     		});
  },

  create: function(req, res, next) {
    if (req.method === 'POST') {
        fs.readFile(req.files.sfbafile.path, "utf-8",function (errs, datasfba) {
          //fs.writeFile('assets/sfba-model-files/'+req.param('name')+'.sfba', datasfba, function(werr) {if (werr) throw werr;});
          if(datasfba) {
            var sfbastring=datasfba.split( "\n" );
            var sfbaTemp=[]
            for( var i = 0; i < sfbastring.length; i++ ) {
              var tmpl=sfbastring[i].split( "\t" );
              if (tmpl.length<6){
                tmpl.push(tmpl[4]);
                tmpl[4]='';
              }
              sfbaTemp.push(tmpl);
            }
            stringOutput2=JSON.stringify(sfbaTemp);
            data3=JSON.parse(stringOutput2);
          }
          else{
            console.log("empty sfba file to parse, uploading spreadsheet data instead");
            stringOutput2=req.param('mySfbaSpreadsheet0')+req.param('mySfbaSpreadsheet1')+req.param('mySfbaSpreadsheet2')+req.param('mySfbaSpreadsheet3')+req.param('mySfbaSpreadsheet4')+req.param('mySfbaSpreadsheet5')+req.param('mySfbaSpreadsheet6')+req.param('mySfbaSpreadsheet7')+req.param('mySfbaSpreadsheet8')+req.param('mySfbaSpreadsheet9');
            data3=JSON.parse(stringOutput2);
          }
          var expObj = {
            name: req.param('name'),
            comment: req.param('comment'),
            metabolic_net_name: req.param('metabolic_net'),
            objective: req.param('objective'),
            externality_tag: req.param('xt'),
            sfba_model_instance: data3,
            parameters: [],
            results: []
          }
          FbaExperiment.create(expObj, function expCreated(err, exp) {
              if (err) {
                console.log(err);
                req.session.flash = {
                  err: err
                }
                return res.redirect('/fbaexperiment/new');
              }
              exp.save(function(err, exp) {
                if (err) return next(err);
                exp.action = " FBA experiment created."
                FbaExperiment.publishCreate(exp); // This is to inform sockets that experiment has been created
                res.redirect('/fbaexperiment/index');
              });
          });
        });
    }
  },

  index: function(req, res, next) {
  	FbaExperiment.find(function foundExps(err, experims){
      if (err) return next(err);
      res.view({experims: experims});
    });
  },

  showresult: function(req, res, next) {
    FbaExperiment.findOne(req.param('id'), function foundExp(err, exp) {
		if (err) return next(err);
		if (!exp) return next();
		var method = exp.results[0]['method'];
		var status = exp.results[0]['status'];
		
		
		
      var file = 'assets/output-fba-files/'+exp.name+'__' + 0 + '.' + method + '.xls';
	  
      try {
        fs.readFile(file,"utf-8", function (err, data) {
          res.view(
            {
              result: data, 
              name: exp.name, 
              id: exp.id,
              comment: exp.comment,
              objective: exp.objective,
              method: method,
              status: status
            });
        });
      } catch(erf){}
    });
  },

  show: function(req, res, next) {
    FbaExperiment.findOne(req.param('id'), function foundExp(err, exp) {
      if (err) return next(err);
      if (!exp) return next();
      res.view({ exp: exp });
    });
  },

  edit: function(req, res, next) {
    FbaExperiment.findOne(req.param('id'), function foundExp(err, exp) {
      if (err) return next(err);
      if (!exp) return next('FBA Experiment doesn\'t exist.');
      res.view({ exp: exp });
    });
  },

  update: function(req, res, next) {
    FbaExperiment.findOne(req.param('expid'), function foundExp(err, exp) {
		if (err) return next(err);
		if (!exp) return next('Experiment doesn\'t exist.');
		var myres = [];
	  
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
	  
      try{
        myres=JSON.parse(req.param('newresults'));
        console.log("UPDATE: try myres succesful");
      }
      catch(ee){
        console.log("UPDATE: error parsing list of new results from edit form")
        myres=exp.results;
      }
      var obj = req.param('objective');
      var xt = req.param('xt');
      var method = req.param('method');
      var sfba_model_instance_data=exp.sfba_model_instance;
      stringOutput2=req.param('mySfbaSpreadsheet0')+req.param('mySfbaSpreadsheet1')+req.param('mySfbaSpreadsheet2')+req.param('mySfbaSpreadsheet3')+req.param('mySfbaSpreadsheet4')+req.param('mySfbaSpreadsheet5')+req.param('mySfbaSpreadsheet6')+req.param('mySfbaSpreadsheet7')+req.param('mySfbaSpreadsheet8')+req.param('mySfbaSpreadsheet9');
      var parameters=JSON.parse(stringOutput2);
      var mnb = 0;
      for(var i=0;i<myres.length;i++) {
        if (myres[i]['status']=='Not started yet') {
          mnb = i;
        }
      }
      var fname;
      var fname1;
      var fname2;
	  
	  if (typos==0){
		fname = 'assets\\sfba-model-files\\'+exp.name+'.sfba';
		fname1 = 'assets\\sfba-model-files\\'+exp.name+'.pfile';
		fname2 = 'assets\\output-fba-files\\' + exp.name+'__' + mnb + '.' + method + '.xls';
	  }
	  else{
		fname = 'assets/sfba-model-files/'+exp.name+'.sfba';
		fname1 = 'assets/sfba-model-files/'+exp.name+'.pfile';
		fname2 = 'assets/output-fba-files/' + exp.name+'__' + mnb + '.' + method + '.xls';
	  }
	  
	  
      var sfba_data = '';
      for (var i=0, j= sfba_model_instance_data.length;i<j;i++){
        if(sfba_model_instance_data[i][0].length<3) continue;
        sfba_data += sfba_model_instance_data[i][0]+'\t'+sfba_model_instance_data[i][1]+'\t'+sfba_model_instance_data[i][2]+'\t'+sfba_model_instance_data[i][3]+'\t'+sfba_model_instance_data[i][4]+'\t'+sfba_model_instance_data[i][5]+'\n';
      }
      var command;
	  if (typos==0){
		command = 'assets\\windows-qsspn\\sfba-glpk.exe -p ' + method + ' -i ' + fname + ' -b ' + fname1 + ' -f ' + fname2 + ' -X ' + xt + ' -comment';
      }
	  else{
		command = 'assets/linux-osx-qsspn/sfba.exe -p ' + method + ' -i ' + fname + ' -b ' + fname1 + ' -f ' + fname2 + ' -X ' + xt + ' -comment';
	  }
	  console.log(command);
      console.log("PARAMETERS:\n" + parameters);
	  
	var ExpObj = {
		name: exp.name,
		comment: exp.comment,
		metabolic_net_name: exp.metabolic_net_name,
		objective: exp.objective,
		sfba_model_instance: exp.sfba_model_instance,
		results: myres,
		externality_tag: exp.externality_tag,
		parameters: parameters
	  }
	var proc=false;
	for(var i=0;i<myres.length;i++) {
		if (myres[i]['status']=='Not started yet' && proc==false){
			myres[i]['status']="In progress"
			proc=true;
		}
	}
	ExpObj.results=myres;
	if(myres.length==0) {
		ExpObj.results = [{nb: 0, status: "In progress", method: method}];
		console.log("UPDATE: Experiment in progress created");
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
	FbaExperiment.update(req.param('id'), ExpObj, function expUpdated(err) {
            //console.log("New results:" + req.param('newresults'));
            if (err) {
              return res.redirect('/experiment/edit/' + req.param('id'));
            }
            
            FbaExperiment.publishUpdate(req.param('id'), {
              name: exp.name,
              results: JSON.stringify(light_myres),
              parameters: JSON.stringify(parameters),
              action: ' has been updated.'
            });
            res.redirect('/fbaexperiment/show/' + req.param('id'));
          });  
      fs.writeFile(fname,sfba_data,function(err){
        var pfile_data = "!max: " + obj + "\n";
        for(var i=0;i<parameters.length;i++) {
          pfile_data += parameters[i][0] + "\t" + parameters[i][1] + "\t" + parameters[i][2] + "\n";
        }
        pfile_data += ";";
        fs.writeFile(fname1,pfile_data,function(err) {
			exec(command, function(err, stdout, stderr) {
            //console.log('output:', stdout);
            //console.log('stderr:', stderr);
			  
			});
          
          
			
        });
      });
      
    });
  },
  
  subscribe: function(req, res) {
	// Find all current users in the user model
	FbaExperiment.find(function foundFbaExp(err, exps) {
	  if (err) return next(err);
 
	  // subscribe this socket to the User model classroom
	  FbaExperiment.subscribe(req.socket);
 
	  // subscribe this socket to the user instance rooms
	  FbaExperiment.subscribe(req.socket, exps);
 
	  // This will avoid a warning from the socket for trying to render
	  // html over the socket.
	  res.send(200);
	});
  },
  
  _config: {}

  
};