var ModelName = require('./example_model');

module.exports = Backbone.Collection.extend({
	model: ModelName,
	url: function() {
		return 'ServerCallurl.json';
	},
	handle: function(){

		return {"DescriptiveName": this.toJSON()};

	}

});