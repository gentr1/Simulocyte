/**
* FbaExperiment.js
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
  	objective: 'string',
    externality_tag: {
      type: 'string',
      defaultsTo: '_xt'
    },
  	parameters: {
  	  type: 'json',
  	  defaultsTo: {}
  	},
  	metabolic_net_name: 'string',
  	sfba_model_instance:{
  	  type: 'json',
  	  defaultsTo: {}
  	},
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
