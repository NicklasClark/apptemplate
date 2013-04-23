var application = require('application');

module.exports = Backbone.Router.extend({

	routes: {
		//Setting routes
		
		// If you want to save login state, send them to a prelogin function which checks for login state
		//'':'preLogin',		
		'home':'home'

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
