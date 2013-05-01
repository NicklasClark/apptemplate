var View = require('./view');
var template = require('./templates/home');

module.exports = View.extend({
	id: 'home',
	template: template,
	events: {
		"dataLoaded":"append"
	},

	initialize: function() {
	},

	render: function() {
		this.$el.html(this.template());
		return this;
	},

	append: function(){
	}

});
