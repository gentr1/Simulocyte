/**
 * Metabolic_net
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
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
		file: {
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
