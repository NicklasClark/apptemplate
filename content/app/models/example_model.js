module.exports = Backbone.Model.extend({
	url: function() {
		//return 'appcallurl.json';
	},
	handle: function(){

		return {"descriptive_name": this.toJSON()};

	}

});