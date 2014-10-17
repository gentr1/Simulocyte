/**
* Fbaexperiment.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  schema: true,
	
  	
	attributes: {
		name: {
			type: 'string',
			required: true,
			unique: true
		},
		comment: 'string',
		parameters: {
		  type: 'json',
		  defaultsTo: {}
		},
		//qsspn_model_name: 'string',
		metabolic_net_name: 'string',
		//qsspn_model_instance:{
		//  type: 'json',
		//  defaultsTo: {}
		//},
		sfba_model_instance:{
		  type: 'json',
		  defaultsTo: {}
		},
		//qsspn_model: 'string',
		//metabolic_net: 'string',
		//parameters: {
		//  type: 'json',
		//  defaultsTo: {}
		//},
		results: {
		  type: 'json',
		  defaultsTo: []
		},
		toJSON: function() {
			var obj = this.toObject();
			delete obj._csrf;
			return obj;
		}
	}
};

