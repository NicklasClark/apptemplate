//Standard View initialization
var View = require('./view');
var template = require('./templates/pull-refresh');

module.exports = View.extend({
	id: 'pull-refresh',
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

	//Example JSON call

		//Set local model
		this.descriptiveName = new Model();

		//Set empty json
		this.descriptiveName.nameJSON ={};

		//render template at beginning to have quicker loads
		this.$el.html(this.template(this.descriptiveName.nameJSON));

		//Call to model to fetch data
		this.descriptiveName.fetch({
			processData:true,
			xhrFields: {withCredentials: true},
			//or update:true
			add:true,
			data: {parameters:parameters},
			success: function(data){
				Application.thisView.$el.trigger("dataLoaded");
			}
		});

		return this;
	},

	append: function(){
		this.descriptiveName.nameJSON = this.descriptiveName.handle();
		this.$el.html(this.template(this.descriptiveName.nameJSON));
		this.enableScroll();
	},

//sample filepicker call
//sample childbrowser
//sample in app browser call
//what else?

	enableScroll: function() {
		scrollItems = new iScroll('scrollItems', {useTransition:true,hScroll:false});
	}

});
