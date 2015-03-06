/**
* Qsspn_model_layout.js
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
		owner: {
			type: 'string',
			required: true
		},
		comment: {
			type: 'string'
			
		},
		users: {
		  type: 'json',
		  defaultsTo: {}
		},
		qsspn_model: 'string',
		layout: {
			type: 'json'//,
			//required: true
		},
		toJSON: function() {
			var obj = this.toObject();
			delete obj._csrf;
			return obj;
		}
	}
};
