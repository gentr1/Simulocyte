
module.exports.express = {
    express: {
		bodyParser: function () {
		  return require('express').bodyParser({
			limit: 8248242
		  })
		}
	  }
};


