(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register("application", function(exports, require, module) {
// Application bootstrapper.
Application = {

	//## If using production and dev versions of server
	//useProductionEnv: true,

	initialize: function() {

	//## If setting something to happen on first launch of app
	//	if ( window.localStorage.getItem("launchCount") == null){
	//		window.localStorage.setItem("launchCount","1");
	//	}


	//	Set production and development servers
	//	this.serverURL = this.useProductionEnv ? 'http://productionurl.com' : 'http://devurl.com';

	//	Keeps app from jumping
		$.mobile.defaultHomeScroll = 0;

	// 	Setting view to location in views folder
		var Home = require('views/home-view');
		var Router = require('lib/router');

		this.homeView = new Home;
		this.router = new Router();



		if (typeof Object.freeze === 'function') Object.freeze(this);
		// Initializing BackStack.StackNavigator for the #container div
	},

}

module.exports = Application;
});

;require.register("initialize", function(exports, require, module) {
var application = require('application');
window.tapReady = true; 
                               
$(function() {
    $.mobile.ajaxEnabled = false;
    $.mobile.linkBindingEnabled = false;
    $.mobile.hashListeningEnabled = false;
    $.mobile.pushStateEnabled = false;

    // Remove page from DOM when it's being replaced
    $(document).delegate('div[data-role="page"]', 'pagehide', function (event, ui) {
	    $(event.currentTarget).remove();
	});                                           
	
  application.initialize();
  Backbone.history.start();
});

});

;require.register("lib/router", function(exports, require, module) {
var application = require('application');

module.exports = Backbone.Router.extend({

	routes: {
		//Setting routes

		// If you want to save login state, send them to a prelogin function which checks for login state
		//'':'preLogin',
		'':'home'
	},

	initialize:function () {
		// Handle back button throughout the application or menu buttons
		$('#back-button').on('vclick', function(e) {
			e.preventDefault();
			$.mobile.activePage.back = true;
			window.history.back();
		});

		$('.navbar-close').on('vclick', function(e) {
			e.preventDefault();
			$.mobile.activePage.back = true;
			window.history.back();
		});


		// Menu
		//Settings for side menu will go here if applicable
		//$('#menu_button').live('click', this.toggleMenu);

		// Loading spinner
		//$('body').append('<div id="theSpinner" class="spinnerModal" style="display:none"><div class="spinnerContainer"><div class="spinnerWrapper"><div class="spinner"><div class="bar1"></div><div class="bar2"></div><div class="bar3"></div><div class="bar4"></div><div class="bar5"></div><div class="bar6"></div><div class="bar7"></div><div class="bar8"></div><div class="bar9"></div><div class="bar10"></div><div class="bar11"></div><div class="bar12"></div></div></div><div class="description">Pencils Ready!</div></div></div>');

		// First page logic
		this.firstPage = true;

	},

	//If you have a side toggle menu

	//toggleMenu: function() {
	//	$('#menu').show();
	//	if ($('div[data-role="page"]').hasClass('menu_open') == false) {
	//		Application.router.menuOpen();
	//	}
	//	else {
	//		Application.router.menuClose();
	//	}
	//},

	//menuClose: function() {
		// Remove overlay from page's content
	//	$('#menu_open_overlay').remove();

		// Set page element to slide animate close
	//	$page = $('div[data-role="page"]');
	//	$page.removeClass('menu_open');
	//	$page.css('left', 0);
	//},

	//menuOpen: function() {
		// Add overlay to the page's content
	//	$content = $('.content_wrapper, .home-wrapper');
	//	if ($content.length > 0) {
	//		$content.prepend('<div id="menu_open_overlay"></div>');
	//		$('#menu_open_overlay').bind('click touchmove', function() {
	//			$('#menu_open_overlay').unbind();
	//			Application.router.toggleMenu();
	//		});
	//	}

		// Set page element to slide animate open
	//	$page = $('div[data-role="page"]');
	//	$page.addClass('menu_open');
	//	$page.css('left', $('.menu_contents').width());
	//},

	//If you have a prelogin function
	//preLogin:function() {

	//},

	//Functions for changing pages
	home:function() {
		this.changePage(Application.homeView);
	},


	//Functions for page transitions
	changePage:function (page) {
		window.tapReady = false;
		$(page.el).attr('data-role', 'page');
		page.render();
		page.delegateEvents();
		$('body').append($(page.el));
		var transition = 'slide';
		var bPage = $.mobile.activePage.back;

		if (page.afterAppend) {
			page.afterAppend();
		}
		// We don't want to slide the first page
		if (this.firstPage) {
			transition = 'fade';
			this.firstPage = false;
		}

		$.mobile.changePage($(page.el), {changeHash:false, transition: bPage ? 'slide' : transition, reverse: bPage});

		$(document).delegate(page.el, 'pageshow', function () {
			window.tapReady = true;
		});
	},

	//setupMenu: function(menuType) {

	//	var logout = function(){

	//		window.localStorage.removeItem("user_name");

	//		$('#menu').hide();
	//		Application.router.menuClose();
	//		Application.router.navigate("/", {trigger: true});
	//	};

	//		var menuHome = function() {
	//			if (Backbone.history.fragment != 'home') {
	//				$('.menu_item').addClass('menu_item_inactive');
	//				$('#menu_home').removeClass('menu_item_inactive');
	//				$('#menu').hide();
	//				Application.router.navigate("#home", {trigger: true});
	//			}

	//			Application.router.menuClose();
	//		};

	//		$('#menu_home').bind('click', menuHome);

	//	}
	//},

});

});

;require.register("lib/view_helper", function(exports, require, module) {
// Put your handlebars.js helpers here.

});

;require.register("models/collection", function(exports, require, module) {
// Base class for all collections.
module.exports = Backbone.Collection.extend({
  
});

});

;require.register("models/example_collection", function(exports, require, module) {
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
});

;require.register("models/example_model", function(exports, require, module) {
module.exports = Backbone.Model.extend({
	url: function() {
		//return 'appcallurl.json';
	},
	handle: function(){

		return {"descriptive_name": this.toJSON()};

	}

});
});

;require.register("models/model", function(exports, require, module) {
// Base class for all models.
module.exports = Backbone.Model.extend({
  
});

});

;require.register("views/example-view", function(exports, require, module) {
//Standard View initialization
var View = require('./view');

//Template declaration
var template = require('./templates/');
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

});

;require.register("views/home-view", function(exports, require, module) {
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

});

;require.register("views/templates/home", function(exports, require, module) {
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", foundHelper, self=this;


  buffer += "<div id=\"header\">\n  <div id=\"back-button\"><i class=\"icon-left-open\"></i></div>\n  <h1>Convo</h1>\n  <i class=\"icon-search\"></i>\n  <div id=\"info\">\n    <div class=\"nav-circle\"><i class=\"icon-info\"></i></div>\n    </div>\n</div>\n\n<div id=\"container\">\n<div class=\"notification\">\n  <div class=\"notification-icon\"><i class=\"icon-thisthat-circle rotate90\"></i></div>\n\n  <div class=\"notification-content\">\n    <p>Christina J. posted a <strong>this or that:</strong></p>\n    <p><strong>“Shoes for Saturday night?”</strong></p>\n  </div>\n\n  <div class=\"notification-arrow rotate180\">\n    <i class=\"icon-left-open\"></i>\n  </div>\n\n</div>\n\n\n</div> ";
  buffer += "\n\n<div id=\"footer\">\n  <div id=\"attach-circle\"><i class=\"icon-attach\"></i></div>\n  <input id=\"message\" placeholder=\"Do you know any funny jokes?\" type=\"text\">\n  <div id=\"send\">Send</div>\n</div>";
  return buffer;});
});

;require.register("views/view", function(exports, require, module) {
require('lib/view_helper');

// Base class for all views.
module.exports = Backbone.View.extend({
  initialize: function() {
    this.render = _.bind(this.render, this);
  },

  template: function() {},
  getRenderData: function() {},

  render: function() {
    this.$el.html(this.template(this.getRenderData()));
    this.afterRender();
    return this;
  },

  afterRender: function() {}
});

});

;
//@ sourceMappingURL=app.js.map