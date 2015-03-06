/**
 * Qsspn_model
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
			comment: 'string',
			owner: 'string',
			metabolic_net: 'string',
			users: {
			  type: 'json',
			  defaultsTo: {}
			},
			file: {
				type: 'json'//,
				//required: true
			},
			sfba: {
				type: 'json'//,
				//required: true
			},
			layouts: {
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
