//Standard View initialization
var View = require('./view');
var template = require('./templates/multipleChoice');

module.exports = View.extend({
	id: 'multiple-choice',
	template: template,
	events: {
		"dataLoaded":"append"
	},

	initialize: function() {

	},

	render: function() {
		//Called on page render

		//If you are using loading spinner, don't forget .hide
	//	$('#theSpinner').show();


		this.$el.html(this.template());


		return this;
	},

	append: function(){

	},

//sample filepicker call
//sample childbrowser
//sample in app browser call
//what else?

	// enableScroll: function() {
	// 	scrollItems = new iScroll('scrollItems', {useTransition:true,hScroll:false});
	// }

});
