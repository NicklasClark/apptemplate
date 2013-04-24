//Standard View initialization
var View = require('./view');

//Template declaration
var template = require('./templates/pullRefresh');
//For multiple template views
//var SecondTemplate = require('./templates/secondExample');

//Models required for objects
var Model = require('../models/example_model');

module.exports = View.extend({
	id: 'example-view',
	template: template,
	//templateGroups: templateGroups,
	events: {
		"dataLoaded":"append",
		'click .class_on_template':'functionName',
		'click #id_on_template':'functionName2',

	},

	initialize: function() {
		//called upon app initialization

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
