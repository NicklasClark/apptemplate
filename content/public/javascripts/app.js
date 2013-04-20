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
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
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

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.brunch = true;
})();

window.require.register("application", function(exports, require, module) {
  // Application bootstrapper.
  Application = {
  	
  	useProductionEnv: true,

  	initialize: function() {

  		if ( window.localStorage.getItem("launchCount") == null){
  			window.localStorage.setItem("launchCount","1");
  		}
  		

  		this.serverURL = this.useProductionEnv ? 'http://knowitall-server.herokuapp.com/' : 'http://knowitall-dev.herokuapp.com/';
  		
  		$.mobile.defaultHomeScroll = 0;

  		var LoginView = require('views/login_view');
  		var LoginTeacherView = require('views/loginTeacher_view');
  		var LoginStudentView = require('views/loginStudent_view');
  		var LoginRegisterView = require('views/loginRegister_view');
  		var HomeView = require('views/home_view');
  		var SettingsView = require('views/settings_view');
  		var SubjectView = require('views/subject_view');
  		var UnitView = require('views/unit_view');
  		var AnnouncementsView = require('views/announcements_view');
  		var AssignmentsView = require('views/assignments_view');
  		var AssignmentGroupView = require('views/assignmentGroup_view');
  		var BookmarksView = require('views/bookmarks_view');
  		var LessonView = require('views/lesson_view');
  		var ElementView = require('views/element_view');
  		var ElementViewPhoto = require('views/element_view_photo');
  		var ElementViewVideo = require('views/element_view_video');
  		var ElementOverlayPdf = require('views/element_overlay_pdf');
  		var ElementOverlayAssignment = require('views/element_overlay_assignment');
  		var ElementOverlaySocrative = require('views/element_overlay_socrative');
  		var ElementOverlayLink = require('views/element_overlay_link');
  		var GroupsView = require('views/groups_view');
  		var GroupView = require('views/group_view');
  		var StudentView = require('views/student_view');
  		var FormNewUnitView = require('views/formNewUnit_view');
  		var FormNewLessonView = require('views/formNewLesson_view');
  		var FormNewElementView = require('views/formNewElement_view');
  		var FormNewAssignmentView = require('views/formNewAssignment_view');
  		var FormNewLinkView = require('views/formNewLink_view');
  		var FormNewSocrativeView = require('views/formNewSocrative_view');
  		var FormNewPdfView = require('views/formNewPdf_view');
  		var FormNewPhotoView = require('views/formNewPhoto_view');
  		var FormNewTestView = require('views/formNewTest_view');
  		var FormNewVideoView = require('views/formNewVideo_view');
  		var FormNewWorksheetView = require('views/formNewWorksheet_view');
  		var FormNewGroupView = require('views/formNewGroup_view');
  		var FormAnnouncementView = require('views/formAnnouncement_view');
  		var FormAddStudentView = require('views/formAddStudent_view');
  		var FormInputStudentView = require('views/formInputStudent_view');
  		var FormAddGroupView = require('views/formAddGroup_view');
  		var StudentHomeView = require('views/studentHome_view');
  		var StudentSubjectView = require('views/studentSubject_view');
  		var StudentUnitView = require('views/studentUnit_view');
  		var StudentLessonView = require('views/studentLesson_view');
  		var StudentElementView = require('views/studentElement_view');
  		var StudentBookmarksView = require('views/studentBookmarks');
  		var StudentAnnouncementsView = require('views/studentAnnouncements_view');		
  		var StudentAssignmentsView = require('views/studentAssignments');
  		var StudentSupplementalView = require('views/studentSupplemental');
  		var StudentSettingsView = require('views/studentSettings_view');
  		var Router = require('lib/router');  

  		this.loginView = new LoginView();
  		this.loginTeacherView = new LoginTeacherView();
  		this.loginStudentView = new LoginStudentView();
  		this.loginRegisterView = new LoginRegisterView();
  		this.homeView = new HomeView();
  		this.settingsView = new SettingsView();
  		this.subjectView = new SubjectView();
  		this.unitView = new UnitView();
  		this.announcementsView = new AnnouncementsView();
  		this.assignmentsView = new AssignmentsView();
  		this.assignmentGroupView = new AssignmentGroupView();
  		this.bookmarksView = new BookmarksView();
  		this.lessonView = new LessonView();
  		this.elementView = new ElementView();
  		this.groupsView = new GroupsView();
  		this.groupView = new GroupView();
  		this.studentView = new StudentView();
  		this.formNewUnitView = new FormNewUnitView();
  		this.formNewLinkView = new FormNewLinkView();
  		this.formNewLessonView = new FormNewLessonView();
  		this.formNewElementView = new FormNewElementView();
  		this.elementViewPhoto = new ElementViewPhoto();
  		this.elementViewVideo = new ElementViewVideo();
  		this.elementOverlayAssignment = new ElementOverlayAssignment();
  		this.elementOverlayPdf = new ElementOverlayPdf();
  		this.elementOverlaySocrative = new ElementOverlaySocrative();
  		this.elementOverlayLink = new ElementOverlayLink();
  		this.formNewAssignmentView = new FormNewAssignmentView()
  		this.formNewSocrativeView = new FormNewSocrativeView();
  		this.formNewPdfView = new FormNewPdfView();
  		this.formNewPhotoView = new FormNewPhotoView();
  		this.formNewTestView = new FormNewTestView();
  		this.formNewVideoView = new FormNewVideoView();
  		this.formNewWorksheetView = new FormNewWorksheetView();
  		this.formNewGroupView = new FormNewGroupView();
  		this.formAnnouncementView = new FormAnnouncementView();
  		this.formAddStudentView = new FormAddStudentView();
  		this.formInputStudentView = new FormInputStudentView();
  		this.formAddGroupView = new FormAddGroupView();
  		this.studentHomeView = new StudentHomeView();
  		this.studentSubjectView = new StudentSubjectView();
  		this.studentUnitView = new StudentUnitView();
  		this.studentLessonView = new StudentLessonView();
  		this.studentElementView = new StudentElementView();
  		this.studentAnnouncementsView = new StudentAnnouncementsView();		
  		this.studentBookmarksView = new StudentBookmarksView();
  		this.studentAssignmentsView = new StudentAssignmentsView();
  		this.studentSupplementalView = new StudentSupplementalView();
  		this.studentSettingsView = new StudentSettingsView();
  		this.router = new Router();

  		if (typeof Object.freeze === 'function') Object.freeze(this);  
  		// Initializing BackStack.StackNavigator for the #container div
  	},
  	
  }

  module.exports = Application;
});
window.require.register("initialize", function(exports, require, module) {
  var application = require('application');
  window.tapReady = true; 
                                 
  $(function() {
      $.mobile.ajaxEnabled = false;
      $.mobile.linkBindingEnabled = false;
      $.mobile.hashListeningEnabled = false;
      $.mobile.pushStateEnabled = false;

      // Remove page from DOM when it's being replaced
      $('div[data-role="page"]').live('pagehide', function (event, ui) {
          $(event.currentTarget).remove();
      });                                            
   
  	
    application.initialize();
    Backbone.history.start();
  });
  
});
window.require.register("lib/router", function(exports, require, module) {
  var application = require('application');

  module.exports = Backbone.Router.extend({

  	routes: {
  		'':'preLogin',
  		'loginTeacher':'loginTeacher',
  		'loginStudent':'loginStudent',
  		'loginRegister':'loginRegister',		
  		'home':'home',
  		'settings':'settings',
  		'subject':'subject',
  		'unit':'unit',
  		'assignments':'assignments',
  		'announcements':'announcements',
  		'assignmentGroup':'assignmentGroup',
  		'bookmarks':'bookmarks',
  		'lesson':'lesson',
  		'element':'element',
  		'element':'element',
  		'groups':'groups',
  		'group':'group',
  		'student':'student',
  		'elementOverlayAssignment':'elementOverlayAssignment',
  		'elementOverlayLink':'elementOverlayLink',
  		'elementOverlayPdf':'elementOverlayPdf',
  		'elementOverlaySocrative':'elementOverlaySocrative',
  		'elementPhoto':'elementPhoto',
  		'formNewUnit':'formNewUnit',
  		'formNewLesson':'formNewLesson',
  		'formNewElement':'formNewElement',
  		'formNewAssignment':'formNewAssignment',
  		'formNewLink':'formNewLink',
  		'formNewPdf':'formNewPdf',
  		'formNewPhoto':'formNewPhoto',
  		'formNewSocrative':'formNewSocrative',
  		'formNewTest':'formNewTest',
  		'formNewVideo':'formNewVideo',
  		'formNewWorksheet':'formNewWorksheet',
  		'formNewGroup':'formNewGroup',
  		'formAnnouncement':'formAnnouncement',
  		'formAddStudent':'formAddStudent',
  		'formInputStudent':'formInputStudent',		
  		'formAddGroup':'formAddGroup',
  		'studentHome':'studentHome',
  		'studentSubject':'studentSubject',
  		'studentUnit':'studentUnit',
  		'studentLesson':'studentLesson',
  		'studentElement':'studentElement',
  		'studentAssignments':'studentAssignments',
  		'studentAnnouncements':'studentAnnouncements',
  		'studentSupplemental':'studentSupplemental',
  		'studentBookmarks':'studentBookmarks',
  		'studentSettings':'studentSettings'
  	},

  	initialize:function () {
  		// Handle back button throughout the application
  		$('#work-button').live('vclick', function(e) {
  			e.preventDefault();
  			$.mobile.activePage.back = true;
  			window.history.back();
  		});
  		
  		$('#back-button').live('vclick', function(e) {
  			e.preventDefault();
  			$.mobile.activePage.back = true;
  			window.history.back();
  		});

  		$('.overlay_close').live('vclick', function(e) {
  			e.preventDefault();
  			$.mobile.activePage.back = true;
  			window.history.back();
  		});
  		
  		$('.navbar-close').live('vclick', function(e) {
  			e.preventDefault();
  			$.mobile.activePage.back = true;
  			window.history.back();
  		});
  		

  		// Menu
  		
  		var display_name = window.localStorage.getItem("display_name");
  		var image_url = window.localStorage.getItem("image_url");
  		
  		
  		this.teacher_menu_contents = '<div id="menu-rainbow"><div class="tb0 hcolors">&nbsp;</div><div class="tb1 hcolors">&nbsp;</div><div class="tb2 hcolors">&nbsp;</div><div class="tb3 hcolors">&nbsp;</div><div class="tb4 hcolors">&nbsp;</div><div class="tb5 hcolors">&nbsp;</div><div class="tb6 hcolors">&nbsp;</div><div class="tb7 hcolors">&nbsp;</div></div><div id="menu-profile" class="menu_item teacher_item menu_item_inactive"><div class="menu-thumb" style="background-image:url('+image_url+');"></div><div class="menu-profile-name">' + display_name +'</div></div><div id="menu_home" class="menu_item teacher_item">Home</div><div id="menu_units" class="menu_item teacher_item menu_item_inactive">Material</div><div id="menu_assignments" class="menu_item teacher_item menu_item_inactive">Assignments</div><div id="menu_groups" class="menu_item teacher_item menu_item_inactive">Groups</div><div id="menu_announcements" class="menu_item teacher_item menu_item_inactive">Announcements</div><div id="menu_bookmarks" class="menu_item teacher_item menu_item_inactive">Bookmarks</div><!--<div id="menu_library" class="menu_item teacher_item menu_item_inactive">Library</div>--><div id="menu_settings" class="menu_item teacher_item menu_item_inactive">Settings</div><div class="menu-border"></div>';
  		
  		this.student_menu_contents = '<div id="menu-rainbow"><div class="tb0 hcolors">&nbsp;</div><div class="tb1 hcolors">&nbsp;</div><div class="tb2 hcolors">&nbsp;</div><div class="tb3 hcolors">&nbsp;</div><div class="tb4 hcolors">&nbsp;</div><div class="tb7 hcolors">&nbsp;</div></div><div id="student-menu-profile" class="menu_item teacher_item menu_item_inactive"><div class="menu-thumb" style="background-image:url('+image_url+');"></div><div class="menu-profile-name">' + display_name +'</div></div><div id="student_menu_home" class="menu_item student_item">Home</div><div id="student_menu_units" class="menu_item  student_item menu_item_inactive">Material</div><div id="student_menu_assignments" class="menu_item  student_item menu_item_inactive">Assignments</div><div id="student_menu_announcements" class="menu_item student_item menu_item_inactive">Announcements</div><div id="student_menu_settings" class="menu_item  student_item menu_item_inactive">Settings</div><div class="menu-border"></div>';

  		$('body').append('<div id="menu" style="display:none"><div class="menu_contents"></div></div>');
  		$('#menu_button').live('click', this.toggleMenu);

  		// Spinner
  		$('body').append('<div id="theSpinner" class="spinnerModal" style="display:none"><div class="spinnerContainer"><div class="spinnerWrapper"><div class="spinner"><div class="bar1"></div><div class="bar2"></div><div class="bar3"></div><div class="bar4"></div><div class="bar5"></div><div class="bar6"></div><div class="bar7"></div><div class="bar8"></div><div class="bar9"></div><div class="bar10"></div><div class="bar11"></div><div class="bar12"></div></div></div><div class="description">Pencils Ready!</div></div></div>');

  		// First page logic
  		this.firstPage = true;

  	},

  	toggleMenu: function() {
  		$('#menu').show();
  		if ($('div[data-role="page"]').hasClass('menu_open') == false) {
  			Application.router.menuOpen();
  		}
  		else {
  			Application.router.menuClose();
  		}
  	},

  	menuClose: function() {
  		// Remove overlay from page's content
  		$('#menu_open_overlay').remove();

  		// Set page element to slide animate close
  		$page = $('div[data-role="page"]');
  		$page.removeClass('menu_open');
  		$page.css('left', 0);
  	},

  	menuOpen: function() {
  		// Add overlay to the page's content
  		$content = $('.content_wrapper, .home-wrapper');
  		if ($content.length > 0) {
  			$content.prepend('<div id="menu_open_overlay"></div>');
  			$('#menu_open_overlay').bind('click touchmove', function() {
  				$('#menu_open_overlay').unbind();
  				Application.router.toggleMenu();
  			});
  		}

  		// Set page element to slide animate open
  		$page = $('div[data-role="page"]');
  		$page.addClass('menu_open');
  		$page.css('left', $('.menu_contents').width());
  	},

  	preLogin:function() {
  		var session_id = window.localStorage.getItem("session_id");
  		var user_name = window.localStorage.getItem("user_name");

  		// Auto-login user if valid credentials are found
  		if (session_id && user_name && user_name.indexOf("@") != -1){
  			$.ajax({
  				data: {user_name:user_name, session_id: session_id},
  				xhrFields: {withCredentials: true},
  				url: Application.serverURL + 'user_session/login_valid.json',
  				success: function(data, textStatus, jqXHR) {
  					console.log(data);
  					if (data = "has_session:true")
  					{
  						Application.router.home();
  					}
  					else
  					{
  						Application.router.login();
  					}
  					
  				},
  				error: function(jqXHR, textStatus, errorThrown) {
  					Application.router.login();
  				}
  			});
  		}
  		else {
  			Application.router.login();
  		}
  	},

  	login:function() {
  		this.changePage(Application.loginView);
  	},
  	
  	loginTeacher:function() {
  		this.changePage(Application.loginTeacherView);
  	},
  	
  	loginStudent:function() {
  		this.changePage(Application.loginStudentView);
  	},
  	
  	loginRegister:function() {
  		this.changePage(Application.loginRegisterView);
  	},

  	home:function() {
  		$('#menu .menu_contents').html(this.teacher_menu_contents);
  		this.setupMenu('teacher');
  		this.changePage(Application.homeView);
  	},

  	settings:function() {
  		this.changePage(Application.settingsView);
  	},

  	subject:function() {
  		this.changePage(Application.subjectView);
  	},

  	unit:function() {
  		this.changePage(Application.unitView);
  	},
  	
  	assignments:function() {
  		this.changePage(Application.assignmentsView);
  	},
  	
  	assignmentGroup:function() {
  		this.changePage(Application.assignmentGroupView);
  	},
  	
  	assignmentRead:function() {
  		this.changePage(Application.assignmentReadView);
  	},
  	
  	announcements:function() {
  		this.changePage(Application.announcementsView);
  	},
  	
  	announcementRead:function() {
  		this.changePage(Application.announcementReadView);
  	},

  	bookmarks:function() {
  		this.changePage(Application.bookmarksView);
  	},

  	lesson:function() {
  		this.changePage(Application.lessonView);
  	},

  	element:function() {
  		this.changePage(Application.elementView);
  	},

  	groups:function() {
  		this.changePage(Application.groupsView);
  	},

  	group:function() {
  		this.changePage(Application.groupView);
  	},

  	student:function() {
  		this.changePage(Application.studentView);
  	},

  	formNewUnit:function() {
  		this.changePage(Application.formNewUnitView);
  	},

  	formNewLesson:function() {
  		this.changePage(Application.formNewLessonView);
  	},

  	formNewLink:function() {
  		this.changePage(Application.formNewLinkView);
  	},

  	formNewSocrative:function() {
  		this.changePage(Application.formNewSocrativeView);
  	},
  	
  	formNewAssignment:function() {
  		this.changePage(Application.formNewAssignmentView);
  	},

  	formNewPdf:function() {
  		this.changePage(Application.formNewPdfView);
  	},

  	formNewPhoto:function() {
  		this.changePage(Application.formNewPhotoView);
  	},

  	formNewElement:function() {
  		this.changeOverlayPage(Application.formNewElementView);
  	},
  	elementOverlayAssignment:function() {
  		this.changePage(Application.elementOverlayAssignment);
  	},
  	elementOverlayLink:function() {
  		this.changePage(Application.elementOverlayLink);
  	},
  	elementOverlayPdf:function() {
  		this.changePage(Application.elementOverlayPdf);
  	},
  	elementOverlaySocrative:function() {
  		this.changePage(Application.elementOverlaySocrative);
  	},
  	elementPhoto:function() {
  		this.changePage(Application.elementViewPhoto);
  	},
  	formNewSocrative:function() {
  		this.changePage(Application.formNewSocrativeView);
  	},
  	formNewTest:function() {
  		this.changePage(Application.formNewTestView);
  	},
  	formNewVideo:function() {
  		this.changePage(Application.formNewVideoView);
  	},
  	formNewWorksheet:function() {
  		this.changePage(Application.formNewWorksheetView);
  	},
  	formNewGroup:function() {
  		this.changePage(Application.formNewGroupView);
  	},

  	formAnnouncement:function() {
  		this.changePage(Application.formAnnouncementView);
  	},

  	formAddStudent:function() {
  		this.changePage(Application.formAddStudentView);
  	},
  	
  	formInputStudent:function() {
  		this.changePage(Application.formInputStudentView);
  	},

  	formAddGroup:function() {
  		this.changePage(Application.formAddGroupView);
  	},

  	studentHome:function() {
  		$('#menu .menu_contents').html(this.student_menu_contents);
  		this.setupMenu('student');
  		this.changePage(Application.studentHomeView);
  	},

  	studentSubject:function() {
  		this.changePage(Application.studentSubjectView);
  	},

  	studentUnit:function() {
  		this.changePage(Application.studentUnitView);
  	},

  	studentLesson:function() {
  		this.changePage(Application.studentLessonView);
  	},

  	studentElement:function() {
  		this.changePage(Application.studentElementView);
  	},

  	studentAssignments:function() {
  		this.changePage(Application.studentAssignmentsView);
  	},
  	
  	studentAnnouncements:function() {
  		this.changePage(Application.studentAnnouncementsView);
  	},

  	studentBookmarks:function() {
  		this.changePage(Application.studentBookmarksView);
  	},

  	studentSupplemental:function() {
  		this.changePage(Application.studentSupplementalView);
  	},
  	
  	studentSettings:function() {
  		$('#menu .menu_contents').html(this.student_menu_contents);
  		this.setupMenu('student');
  		this.changePage(Application.studentSettingsView);
  	},

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
  	
  	changeOverlayPage:function (page) {
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

  	setupMenu: function(menuType) {

  		var logout = function(){
  			
  			window.localStorage.removeItem("user_name");
  			window.localStorage.removeItem("teacher_customer_id");
  			window.localStorage.removeItem("session_id");
  			window.localStorage.removeItem("display_name", data.display_name);
  			window.localStorage.removeItem("image_url", data.display_name);
  			
  			$('#menu').hide();
  			Application.router.menuClose();
  			Application.router.navigate("/", {trigger: true});
  		};

  		if (menuType == 'teacher') {
  			var menuHome = function() {
  				if (Backbone.history.fragment != 'home') {
  					$('.menu_item').addClass('menu_item_inactive');
  					$('#menu_home').removeClass('menu_item_inactive');
  					$('#menu').hide();
  					Application.router.navigate("#home", {trigger: true});
  				}

  				Application.router.menuClose();
  			};
  			
  			var menuGroups = function() {
  				if (Backbone.history.fragment != 'groups') {
  					$('.menu_item').addClass('menu_item_inactive');
  					$('#menu_groups').removeClass('menu_item_inactive');
  					$('#menu').hide();
  					Application.router.navigate("#groups", {trigger: true});
  				}

  				Application.router.menuClose();
  			};
  			
  			var menuUnits = function() {
  				if (Backbone.history.fragment != 'subject') {
  					$('.menu_item').addClass('menu_item_inactive');
  					$('#menu_units').removeClass('menu_item_inactive');
  					$('#menu').hide();
  					Application.router.navigate("#subject", {trigger: true});
  				}

  				Application.router.menuClose();
  			};
  			
  			var menuAnnouncements = function() {
  				if (Backbone.history.fragment != 'announcements') {
  					$('.menu_item').addClass('menu_item_inactive');
  					$('#menu_announcements').removeClass('menu_item_inactive');
  					$('#menu').hide();
  					Application.router.navigate("#announcements", {trigger: true});
  				}

  				Application.router.menuClose();
  			};
  			
  			var menuAssignments = function() {
  				if (Backbone.history.fragment != 'assignments') {
  					$('.menu_item').addClass('menu_item_inactive');
  					$('#menu_assignments').removeClass('menu_item_inactive');
  					$('#menu').hide();
  					Application.router.navigate("#assignments", {trigger: true});
  				}

  				Application.router.menuClose();
  			};
  			
  			var menuBookmarks = function() {
  				if (Backbone.history.fragment != 'bookmarks') {
  					$('.menu_item').addClass('menu_item_inactive');
  					$('#menu_bookmarks').removeClass('menu_item_inactive');
  					$('#menu').hide();
  					Application.router.navigate("#bookmarks", {trigger: true});
  				}

  				Application.router.menuClose();
  			};
  					
  			var menuSettings = function() {
  				if (Backbone.history.fragment != 'settings') {
  					$('.menu_item').addClass('menu_item_inactive');
  					$('#menu_settings').removeClass('menu_item_inactive');
  					$('#menu').hide();
  					Application.router.navigate("#settings", {trigger: true});
  				}

  				Application.router.menuClose();
  			};
  			
  			var menuProfile = function() {
  				if (Backbone.history.fragment != 'settings') {
  					$('.menu_item').addClass('menu_item_inactive');
  					$('#menu-profile').removeClass('menu_item_inactive');
  					$('#menu').hide();
  					Application.router.navigate("#settings", {trigger: true});
  				}

  				Application.router.menuClose();
  			};

  			
  			$('#menu_home').bind('click', menuHome);
  			$('#menu_groups').bind('click', menuGroups);
  			$('#menu_units').bind('click', menuUnits);
  			$('#menu_announcements').bind('click', menuAnnouncements);
  			$('#menu_assignments').bind('click', menuAssignments);
  			$('#menu_bookmarks').bind('click', menuBookmarks);
  			$('#menu_settings').bind('click', menuSettings);
  			$('#menu_logout').bind('click', logout);
  			$('#menu-profile').bind('click', menuProfile);

  			
  		}
  		else if (menuType == 'student') {
  			var studentMenuHome = function() {
  				if (Backbone.history.fragment != 'studentHome') {
  					$('.menu_item').addClass('menu_item_inactive');
  					$('#student_menu_home').removeClass('menu_item_inactive');
  					$('#menu').hide();
  					Application.router.navigate("#studentHome", {trigger: true});
  				}

  				Application.router.menuClose();
  			};
  			
  			var studentMenuAnnouncements = function() {
  				if (Backbone.history.fragment != 'announcements') {
  					$('.menu_item').addClass('menu_item_inactive');
  					$('#student_menu_announcements').removeClass('menu_item_inactive');
  					$('#menu').hide();
  					Application.router.navigate("#studentAnnouncements", {trigger: true});
  				}

  				Application.router.menuClose();
  			};
  			
  			var studentMenuUnits = function() {
  				if (Backbone.history.fragment != 'studentSubject') {
  					$('.menu_item').addClass('menu_item_inactive');
  					$('#student_menu_units').removeClass('menu_item_inactive');
  					$('#menu').hide();
  					Application.router.navigate("#studentSubject", {trigger: true});
  				}

  				Application.router.menuClose();
  			};
  			
  			var studentMenuBookmarks = function() {
  				if (Backbone.history.fragment != 'studentBookmarks') {
  					$('.menu_item').addClass('menu_item_inactive');
  					$('#student_menu_units').removeClass('menu_item_inactive');
  					$('#menu').hide();
  					Application.router.navigate("#studentBookmarks", {trigger: true});
  				}

  				Application.router.menuClose();
  			};
  			
  			var studentMenuAssignments = function() {
  				if (Backbone.history.fragment != 'studentAssignments') {
  					$('.menu_item').addClass('menu_item_inactive');
  					$('#student_menu_assignments').removeClass('menu_item_inactive');
  					$('#menu').hide();
  					Application.router.navigate("#studentAssignments", {trigger: true});
  				}

  				Application.router.menuClose();
  			};
  			
  			var studentMenuSupplemental = function() {
  				if (Backbone.history.fragment != 'studentSupplemental') {
  					$('.menu_item').addClass('menu_item_inactive');
  					$('#student_menu_units').removeClass('menu_item_inactive');
  					$('#menu').hide();
  					Application.router.navigate("#studentSupplemental", {trigger: true});
  				}

  				Application.router.menuClose();
  			};
  			
  			var studentMenuSettings = function() {
  				if (Backbone.history.fragment != 'studentSettings') {
  					$('.menu_item').addClass('menu_item_inactive');
  					$('#student_menu_settings').removeClass('menu_item_inactive');
  					$('#menu').hide();
  					Application.router.navigate("#studentSettings", {trigger: true});
  				}

  				Application.router.menuClose();
  			};
  			
  			var studentMenuProfile = function() {
  				if (Backbone.history.fragment != 'studentSettings') {
  					$('.menu_item').addClass('menu_item_inactive');
  					$('#student-menu-profile').removeClass('menu_item_inactive');
  					$('#menu').hide();
  					Application.router.navigate("#studentSettings", {trigger: true});
  				}

  				Application.router.menuClose();
  			};

  			$('#student_menu_home').bind('click', studentMenuHome);
  			$('#student_menu_units').bind('click', studentMenuUnits);
  			$('#student_menu_announcements').bind('click', studentMenuAnnouncements);		
  			$('#student_menu_assignments').bind('click', studentMenuAssignments);
  			$('#student_menu_bookmarks').bind('click', studentMenuBookmarks);
  			$('#student_menu_supplemental').bind('click', studentMenuSupplemental);
  			$('#student_menu_settings').bind('click', studentMenuSettings);
  			$('#student_menu_logout').bind('click', logout);
  			$('#student-menu-profile').bind('click', studentMenuProfile);

  		}
  		else {
  			console.log('Warning: Setting up menu for invalid type: ' + menuType);
  		}
  	},

  });
  
});
window.require.register("lib/view_helper", function(exports, require, module) {
  // Put your handlebars.js helpers here.
  
});
window.require.register("models/announcement", function(exports, require, module) {
  // Model of a group but not a collection of students - see teacher_groups.

  module.exports = Backbone.Model.extend({

  });
  
});
window.require.register("models/assignment", function(exports, require, module) {
  // Model of a group but not a collection of students - see teacher_groups.

  module.exports = Backbone.Model.extend({

  });
  
});
window.require.register("models/bookmark", function(exports, require, module) {
  
  module.exports = Backbone.Model.extend({

  });
  
});
window.require.register("models/collection", function(exports, require, module) {
  // Base class for all collections.
  module.exports = Backbone.Collection.extend({
    
  });
  
});
window.require.register("models/element", function(exports, require, module) {
  // Base class for all models.
  module.exports = Backbone.Model.extend({
    
  });
  
});
window.require.register("models/element_assignment", function(exports, require, module) {
  module.exports = Backbone.Model.extend({
  	url: function() {
  		return Application.serverURL+'student/elements/assignments.json';
  	},
  	handle: function(){

  		return {"assignment": this.toJSON()};

  	}

  });
});
window.require.register("models/element_link", function(exports, require, module) {
  module.exports = Backbone.Model.extend({
  	url: function() {
  		return Application.serverURL+'shared/elements/link.json';
  	},
  	handle: function(){

  		return {"share_link": this.toJSON()};

  	}

  });
  
});
window.require.register("models/element_pdf", function(exports, require, module) {
  module.exports = Backbone.Model.extend({
  	url: function() {
  		return Application.serverURL+'shared/elements/pdf_notes.json';
  	},
  	handle: function(){

  		return {"pdf": this.toJSON()};

  	}

  });
});
window.require.register("models/element_photo", function(exports, require, module) {
  module.exports = Backbone.Model.extend({
  	url: function() {
  		return Application.serverURL+'shared/elements/photo.json';
  	},
  	handle: function(){

  		return {"photo": this.toJSON()};

  	}

  });
});
window.require.register("models/element_socrative", function(exports, require, module) {
  module.exports = Backbone.Model.extend({
  	url: function() {
  		return Application.serverURL+'shared/elements/socrative.json';
  	},
  	handle: function(){

  		return {"socrative": this.toJSON()};

  	}

  });
});
window.require.register("models/element_video", function(exports, require, module) {
  module.exports = Backbone.Model.extend({
  	url: function() {
  		return Application.serverURL+'shared/video.json';
  	},
  	handle: function(){

  		return {"video": this.toJSON()};

  	}

  });
});
window.require.register("models/group", function(exports, require, module) {
  // Model of a group but not a collection of students - see teacher_groups.

  module.exports = Backbone.Model.extend({
    idAttribute:"group_id"

  });
  
});
window.require.register("models/groups", function(exports, require, module) {
  // Groups are a collection of students

  var Groups = require('./student');

  module.exports = Backbone.Collection.extend({
  	model: Groups,
  	url: function() {
  		return Application.serverURL+'teacher/groups/student_list.json';
  	},
  	handle: function(){

  		return {"groups": this.toJSON()};

  	},
  	storage_name: knowitall_offline.createStorageName('groups'),
  	sync: knowitall_offline.sync,

  });
});
window.require.register("models/groups_students", function(exports, require, module) {
  // Groups students tells us which students are in a group with a total list of students

  var Groups = require('./student');

  module.exports = Backbone.Collection.extend({
  	model: Groups,
  	url: function() {
  		return Application.serverURL+'teacher/groups/grouped_students_list.json';
  	},
  	handle: function(){

  		return {"groups": this.toJSON()};

  	},
  	storage_name: knowitall_offline.createStorageName('groups_students'),
  	sync: knowitall_offline.sync,

  });
});
window.require.register("models/lesson", function(exports, require, module) {
  // Base class for all models.
  module.exports = Backbone.Model.extend({
    	user_name:window.localStorage.getItem("user_name")
  });
  
});
window.require.register("models/lessons_groups", function(exports, require, module) {
  // Groups students tells us which students are in a group with a total list of students

  var Groups = require('./group');

  module.exports = Backbone.Collection.extend({
  	model: Groups,
  	url: function() {
  		return Application.serverURL+'teacher/lesson_groups.json';
  	},
  	handle: function(){

  		return {"groups": this.toJSON()};

  	},
  	storage_name: knowitall_offline.createStorageName('lessons_groups'),
  	sync: knowitall_offline.sync,

  });
});
window.require.register("models/model", function(exports, require, module) {
  // Base class for all models.
  module.exports = Backbone.Model.extend({
    
  });
  
});
window.require.register("models/single_announcement", function(exports, require, module) {
  // Model of a group but not a collection of students - see teacher_groups.

  module.exports = Backbone.Model.extend({
  	url: function() {
  		return Application.serverURL+'shared/announcement.json';
  	},
  	handle: function(){

  		return {"announcement": this.toJSON()};

  	},
  	storage_name: knowitall_offline.createStorageName('single_announcement'),
  	sync: knowitall_offline.sync,

  });
  
});
window.require.register("models/student", function(exports, require, module) {
  module.exports = Backbone.Model.extend({
  	url: function() {
  		return Application.serverURL+'student/student.json';
  	},
  	handle: function(){

  		return {"student": this.toJSON()};

  	}

  });


  //data - user_name - student id
});
window.require.register("models/student_activity", function(exports, require, module) {
  // Base class for all models.
  var Assignment = require('./assignment');

  module.exports = Backbone.Collection.extend({
  	model: Assignment,
  	url: function() {
  		return Application.serverURL+'student/recent_activity.json';
  	},
  	handle: function(){

  		return {"student_activity": this.toJSON()};

  	},
  	storage_name: knowitall_offline.createStorageName('student_activity'),
  	sync: knowitall_offline.sync,

  });

  
});
window.require.register("models/student_announcements", function(exports, require, module) {
  // Base class for all models.
  var Announcement = require('./announcement');

  module.exports = Backbone.Collection.extend({
  	model: Announcement,
  	url: function() {
  		return Application.serverURL+'student/announcement_list.json';
  	},
  	handle: function(){

  		return {"student_announce": this.toJSON()};

  	},
  	storage_name: knowitall_offline.createStorageName('student_announcements'),
  	sync: knowitall_offline.sync,

  });



  //data - user_name - student id
});
window.require.register("models/student_assignments", function(exports, require, module) {
  // Base class for all models.
  var Assignment = require('./assignment');

  module.exports = Backbone.Collection.extend({
  	model: Assignment,
  	url: function() {
  		return Application.serverURL+'student/elements/assignment_list.json';
  	},
  	handle: function(){

  		return {"student_assignments": this.toJSON()};

  	},
  	storage_name: knowitall_offline.createStorageName('student_assignments'),
  	sync: knowitall_offline.sync,

  });
  
});
window.require.register("models/student_bookmark", function(exports, require, module) {
  // Base class for all models.
  module.exports = Backbone.Model.extend({
    
  });
  
});
window.require.register("models/student_bookmarks", function(exports, require, module) {
  // Student bookmarks model

  var Bookmark = require('./student_bookmark');

  module.exports = Backbone.Collection.extend({
  	model: Bookmark,
  	url: function() {
  		return Application.serverURL+'student/bookmarks.json';
  	},
  	handle: function(){

  		return {"student_bookmarks": this.toJSON()};

  	},
  	storage_name: knowitall_offline.createStorageName('student_bookmarks'),
  	sync: knowitall_offline.sync,
  	
  });
  
});
window.require.register("models/student_elements", function(exports, require, module) {
  //TBD based on what the elements look like  some elements may need this
  
});
window.require.register("models/student_lesson", function(exports, require, module) {
  // Student lesson is a collection of all learning objects (elements) within a lesson

  var student_lesson = require('./element');

  module.exports = Backbone.Collection.extend({
  	url: function() {
  		return Application.serverURL+'student/lessons.json';
  	},
  	handle: function(){

  		return {"student_lesson": this.toJSON()};

  	},
  	storage_name: knowitall_offline.createStorageName('student_lesson'),
  	sync: knowitall_offline.sync,

  });


  	


  
});
window.require.register("models/student_supplemental", function(exports, require, module) {
  // Student bookmarks model

  var Bookmark = require('./student_bookmark');

  module.exports = Backbone.Collection.extend({
  	model: Bookmark,
  	url: function() {
  		return Application.serverURL+'student/bookmarks.json';
  	},
  	handle: function(){

  		return {"student_bookmarks": this.toJSON()};

  	},
  	storage_name: knowitall_offline.createStorageName('student_supplemental'),
  	sync: knowitall_offline.sync,
  	
  });
  
});
window.require.register("models/student_unit", function(exports, require, module) {
  // Student unit is a collection of all lessons within a unit

  var student_unit = require('./lesson');

  module.exports = Backbone.Collection.extend({
  	url: function() {
  		return Application.serverURL+'student/units.json';
  	},
  	handle: function(){

  		return {"student_unit": this.toJSON()};

  	},
  	storage_name: knowitall_offline.createStorageName('student_unit'),
  	sync: knowitall_offline.sync,

  });

  
});
window.require.register("models/student_unitlist", function(exports, require, module) {
  // Unit is a collection of all lessons within a unit

  var unit_list = require('./unit');

  module.exports = Backbone.Collection.extend({
  	url: function() {
  		return Application.serverURL+'student/unit_list.json';
  	},
  	handle: function(){

  		return {"unit_list": this.toJSON()};

  	},
  	storage_name: knowitall_offline.createStorageName('student_unitlist'),
  	sync: knowitall_offline.sync,
  });

  
});
window.require.register("models/students", function(exports, require, module) {
  // Base class for all collections.
  module.exports = Backbone.Collection.extend({
    
  });
  
});
window.require.register("models/students_login", function(exports, require, module) {
  // Groups are a collection of students

  var Groups = require('./student');

  module.exports = Backbone.Collection.extend({
  	model: Groups,
  	url: Application.serverURL+"student/student_search.json",
  	handle: function(){

  		return {"students": this.toJSON()};
  	}
  });
});
window.require.register("models/teacher", function(exports, require, module) {
  module.exports = Backbone.Model.extend({
  	url: function() {
  		return Application.serverURL+'teacher/teacher.json';
  	},
  	handle: function(){
  		
  		return {"teacher": this.toJSON()};
  	}

  });


  //data - user_name - student id
});
window.require.register("models/teacher_announcements", function(exports, require, module) {
  // Teacher groups are a collection of groups created by the teacher
  var Announcement = require('./announcement');

  module.exports = Backbone.Collection.extend({
  	model: Announcement,
  	url: function() {
  		return Application.serverURL+'teacher/announcement_list.json';
  	},
  	handle: function(){
  		
  		return {"announcements": this.toJSON()};
  	
  	},
  	storage_name: knowitall_offline.createStorageName('teacher_announcements'),
  	sync: knowitall_offline.sync,

  });
});
window.require.register("models/teacher_assignment", function(exports, require, module) {
  module.exports = Backbone.Model.extend({
  	url: function() {
  		return Application.serverURL+'teacher/elements/assignments.json';
  	},
  	handle: function(){

  		return {"assignment": this.toJSON()};
  	}

  });
});
window.require.register("models/teacher_assignments", function(exports, require, module) {
  // Teacher groups are a collection of groups created by the teacher

  var Assignment = require('./assignment');

  module.exports = Backbone.Collection.extend({
  	model: Assignment,
  	url: function() {
  		return Application.serverURL+'teacher/elements/assignment_list.json';
  	},
  	handle: function(){
  				
  		return {"assignments": this.toJSON()};
  	
  	},
  	storage_name: knowitall_offline.createStorageName('teacher_assignments'),
  	sync: knowitall_offline.sync,

  });
});
window.require.register("models/teacher_bookmarks", function(exports, require, module) {
  // Teacher groups are a collection of groups created by the teacher

  var Bookmark = require('./bookmark');

  module.exports = Backbone.Collection.extend({
  	model: Bookmark,
  	url: function() {
  		return Application.serverURL+'teacher/bookmark_list.json';
  	},
  	handle: function(){
  				
  		return {"bookmarks": this.toJSON()};
  	
  	},
  	storage_name: knowitall_offline.createStorageName('teacher_bookmarks'),
  	sync: knowitall_offline.sync,

  });
});
window.require.register("models/teacher_elements", function(exports, require, module) {
  //TBD based on what the elements look like  some elements may need this
  
});
window.require.register("models/teacher_groups", function(exports, require, module) {
  // Teacher groups are a collection of groups created by the teacher

  var Groups = require('./group');

  module.exports = Backbone.Collection.extend({
  	model: Groups,
  	url: function() {
  		return Application.serverURL+'teacher/group_list.json';
  	},
  	handle: function(){
  		
  		return {"teacher_groups": this.toJSON()};
  	
  	},
  	storage_name: knowitall_offline.createStorageName('teacher_groups'),
  	sync: knowitall_offline.sync,

  });
});
window.require.register("models/teacher_lesson", function(exports, require, module) {
  // Teacher lesson is a collection of all learning objects (elements) within a lesson

  var teacher_lesson = require('./element');

  module.exports = Backbone.Collection.extend({
  	model: teacher_lesson,
  	url: function() {
  		return Application.serverURL+'teacher/lessons.json';
  	},
  	handle: function(){
  		
  		return {"teacher_lesson": this.toJSON()};
  		
  	},
  	storage_name: knowitall_offline.createStorageName('teacher_lesson'),
  	sync: knowitall_offline.sync,
  });


  	


  
});
window.require.register("models/teacher_posts", function(exports, require, module) {
  // Base class for all models.
  //returns a list of lessons
  var Post = require('./lesson');

  module.exports = Backbone.Collection.extend({
  	model: Post,
  	url: function() {
  		return Application.serverURL+'teacher/recent_posts.json';
  	},
  	handle: function(){

  		return {"teacher_posts": this.toJSON()};

  	},
  	storage_name: knowitall_offline.createStorageName('teacher_posts'),
  	sync: knowitall_offline.sync,

  });



  //data - user_name - student id
});
window.require.register("models/teacher_student", function(exports, require, module) {
  module.exports = Backbone.Model.extend({
  	url: function() {
  		return Application.serverURL+'teacher/student.json';
  	},
  	handle: function(){

  		return {"student": this.toJSON()};

  	}

  });


  //data - user_name - student id
});
window.require.register("models/teacher_unit", function(exports, require, module) {
  // Unit is a collection of all lessons within a unit

  var teacher_unit = require('./lesson');

  module.exports = Backbone.Collection.extend({
  	model: teacher_unit,
  	url: function() {
  		return Application.serverURL+'teacher/units.json';
  	},
  	handle: function(){
  		return {"teacher_unit": this.toJSON()};
  	},
  	storage_name: knowitall_offline.createStorageName('teacher_unit'),
  	sync: knowitall_offline.sync,

  });

  //data
  //user_name - teacher id
  //object_id - unit id
  
});
window.require.register("models/unit", function(exports, require, module) {
  // Base class for all models.
  module.exports = Backbone.Model.extend({
    
  });
  
});
window.require.register("models/unit_list", function(exports, require, module) {
  // Unit is a collection of all lessons within a unit

  var unit_list = require('./unit');

  module.exports = Backbone.Collection.extend({
  	url: function() {
  		return Application.serverURL+'teacher/unit_list.json';
  	},
  	handle: function(){

  		return {"unit_list": this.toJSON()};

  	},
  	storage_name: knowitall_offline.createStorageName('unit_list'),
  	sync: knowitall_offline.sync,
  });

  
});
window.require.register("views/announcements_view", function(exports, require, module) {
  var View = require('./view');
  var templateSingle = require('./templates/announcements');
  var templateList = require('./templates/announcementsList');
  var AnnouncementList = require('../models/teacher_announcements');
  var Announcement = require('../models/single_announcement');

  var skip = 0;
  var max = 20;
  var sortby = 'date';

  module.exports = View.extend({
  	id: 'announcements-view',
  	templateSingle: templateSingle,
  	templateList: templateList,
  	events: {
  		"dataLoadedList":"appendList",
  		"dataLoadedSingle":"appendSingle",
  		"loadAnnouncement":"loadAnnouncement",
  		'click .discussion-sidebar-item':'viewDiscussion',
  		'click .add_button':'addScreen',
  		'click .comment-send-btn':'submitComment',
  		'click .new-announce':'navigateAnnouncements',
  		'click .help':'helpMe'

  	},

  	render: function() {
  		this.announcementList = new AnnouncementList();
  		this.announcementList.listJSON = {};
  		this.announcementSingle = new Announcement();
  		this.announcementSingle.announcementJSON = {};
  		this.$el.html(this.templateList(this.announcementList.listJSON));
  		this.session_id = window.localStorage.getItem("session_id");

  		this.announcementList.fetch({
  			data: {session_id:this.session_id, skip:skip, max:max, sortby:sortby},
  			xhrFields: {withCredentials: true},
  			processData:true,
  			add:true,
  			success:function(data){
  				Application.announcementsView.$el.trigger("dataLoadedList");
  			},
  			error: function (jqXHR, textStatus, errorThrown) {
  				var error_message = (textStatus.responseText);
  				
  				if (error_message == "no_session")
  				{
  					Application.router.navigate("/", {
  						trigger: true
  					});
  				}
  			}
  		});

  		return this;
  	},

  	appendList: function(){
  		this.announcementList.listJSON = this.announcementList.handle();
  		this.$el.html(this.templateList(this.announcementList.listJSON));
  		if (this.announcement_id == undefined)
  		{
  			var currentView = Application.announcementsView;
  			currentView.announcement_id = currentView.announcementList.listJSON.announcements[0].announcement_list[0].announcement_id;
  		}
  		//$('#scrollDiscusionSidebar').data("id").addClass('active-sidebar-item');
  		Application.announcementsView.$el.trigger("loadAnnouncement");
  	},

  	appendSingle: function(){	
  		this.announcementSingle.announcementJSON = this.announcementSingle.handle();
  		$('#announcements-body').html(this.templateSingle(this.announcementSingle.announcementJSON));
  		this.enableScrollAnnouncements();		
  		this.enableScrollAnnouncement();
  	},

  	loadAnnouncement: function() {
  		this.announcementSingle.fetch({
  			data:{session_id:this.session_id, announcement_id:this.announcement_id},
  			xhrFields: {withCredentials: true},
  			processData:true,
  			update: true,
  			success:function(data){
  				Application.announcementsView.$el.trigger("dataLoadedSingle");
  			},
  			error: function (jqXHR, textStatus, errorThrown) {
  				var error_message = (textStatus.responseText);
  				
  				if (error_message == "no_session")
  				{
  					Application.router.navigate("/", {
  						trigger: true
  					});
  				}
  			}
  		});
  	},

  	submitComment: function(){
  		$('#theSpinner').show();
  		var comment = $('#commentMessage').val();
  		var session_id = window.localStorage.getItem("session_id");

  		if (comment) {
  			var user_name = window.localStorage.getItem("user_name");
  			$.ajax({			
  				data: {session_id:session_id, announcement_id:this.announcement_id, contributor_id:user_name, body: comment},
  				xhrFields: {withCredentials: true},
  				url: Application.serverURL+'/teacher/announcement.json',
  				type: "POST",
  				dataType:"json",
  				success: function(data) {
  					Application.announcementsView.announcementSingle = new Announcement();
  					Application.announcementsView.announcementJSON = {};
  					Application.announcementsView.announcementSingle.fetch({
  						data:{session_id:session_id, announcement_id:Application.announcementsView.announcement_id},
  						xhrFields: {withCredentials: true},
  						processData:true,
  						update: true,
  						success:function(data){
  							$('#theSpinner').hide();
  							Application.announcementsView.$el.trigger("dataLoadedSingle");
  						},
  						failure:function(){
  							$('#theSpinner').hide();
  							navigator.notification.alert(
  								'Unable to load announcements',  // message
  								function alertDismissed() {}, // callback
  								'Error',            // title
  								'OK'                  // buttonName
  							);
  						}
  					}); 
  				},
  				failure:function(){
  					$('#theSpinner').hide();
  					navigator.notification.alert(
  						'Unable to submit post, please try again',  // message
  						function alertDismissed() {}, // callback
  						'Error',            // title
  						'OK'                  // buttonName
  					);
  				}
  			});
  		}
  		else{
  			$('#theSpinner').hide();
  			navigator.notification.alert(
  				'Please enter message',  // message
  				function alertDismissed() {}, // callback
  				'Error',            // title
  				'OK'                  // buttonName
  			);
  		}

  	},

  	viewDiscussion: function(e) {
  		
  	//	this.announcementSingle = new Announcement();
  	//	this.announcementSingle.announcementJSON = {};
  		Application.announcementsView.announcement_id = $(e.currentTarget).data('id');
  		var currentAnnouncementId = $(e.currentTarget).data('id');
  		
  		$('.active-sidebar-item').removeClass('active-sidebar-item');
  		$(e.currentTarget).addClass('active-sidebar-item');

  		this.announcementSingle.fetch({
  			data: {session_id:this.session_id, announcement_id:currentAnnouncementId},
  			xhrFields: {withCredentials: true},
  			processData:true,
  			update: true,
  			success:function(data){
  				Application.announcementsView.$el.trigger("dataLoadedSingle");
  			},
  			failure:function(){
  			}
  		});
  		
  	},

  	enableScrollAnnouncements: function() {
  		scrollDiscussionSidebar = new iScroll('scrollDiscussionSidebar', {useTransition:true,hScroll:false});
  	},

  	enableScrollAnnouncement: function() {
  		scrollDiscussion = new iScroll('scrollDiscussion', {useTransition:true,hScroll:false});
  	},

  	addScreen: function() {
  		Application.router.navigate("#formNewElement", {trigger: true});
  	},
  	
  	navigateAnnouncements: function() {
  		Application.router.navigate("#formAnnouncement", {trigger: true});

  	},
  	
  	helpMe: function() {
  		$("body").chardinJs('toggle');
  	}
  	
  	

  });
  
});
window.require.register("views/assignmentGroup_view", function(exports, require, module) {
  var View = require('./view');
  var template = require('./templates/assignmentGroup');
  var Assignment = require('../models/teacher_assignment');

  module.exports = View.extend({
  	id: 'assignmentGroup-view',
  	template: template,
  	events: {
  		"dataLoaded":"append",
  		'click .has-submitted':'readAssignment',
  		'click .add_button':'addScreen',
  		'click .help':'helpMe'
  	},

  	render: function() {
  		this.assignmentList = new Assignment();
  		this.assignmentList.listJSON = {};
  		this.$el.html(this.template(this.assignmentList.listJSON));
  		var assignmentId = this.assignmentId;
  		this.session_id = window.localStorage.getItem("session_id");

  		this.assignmentList.fetch({
  			data: {session_id:this.session_id, assignment_id:assignmentId},
  			xhrFields: {withCredentials: true},
  			processData:true,
  			add:true,
  			success:function(){
  				Application.assignmentGroupView.$el.trigger("dataLoaded");
  			},
  			error: function (jqXHR, textStatus, errorThrown) {
  				var error_message = (textStatus.responseText);
  				
  				if (error_message == "no_session")
  				{
  					Application.router.navigate("/", {
  						trigger: true
  					});
  				}
  			}
  		});

  		return this;
  	}, 

  	append: function(){
  		this.assignmentList.listJSON = this.assignmentList.handle();
  		this.$el.html(this.template(this.assignmentList.listJSON));
  		this.enableScroll();
  	},

  	enableScroll: function() {
  		scrollAssignmentGroup = new iScroll('scrollAssignmentGroup', {useTransition:true,hScroll:false});
  	},

  	readAssignment: function(e) { 
  		Application.assignmentGroupView.readId = $(e.currentTarget).data('id');
  		window.plugins.knowitallbrowser.open($(e.currentTarget).data('id'));
  		
  	},

  	addScreen: function() {
  		Application.router.navigate("#formNewElement", {trigger: true});
  	},
  	
  	helpMe: function() {
  		$("body").chardinJs('toggle');
  	}

  });
  
});
window.require.register("views/assignments_view", function(exports, require, module) {
  var View = require('./view');
  var template = require('./templates/assignments');
  var Assignment = require('../models/teacher_assignments');
  var skip = 0;
  var max = 20;
  var sortby = 'date';

  module.exports = View.extend({
  	id: 'assignments-view',
  	template: template,
  	events: {
  		"dataLoaded":"append",
  		'click .assignments-thumb':'viewAssignment',
  		'click .add_button':'addScreen',
  		'click .new':'assignment'
  	},

  	render: function() {
  		this.assignmentList = new Assignment();
  		this.assignmentList.listJSON = {};
  		this.$el.html(this.template(this.assignmentList.listJSON));
  		this.session_id = window.localStorage.getItem("session_id");

  		this.assignmentList.fetch({
  			data: {session_id:this.session_id, skip:skip, max:max, sortby:sortby},
  			xhrFields: {withCredentials: true},
  			processData:true,
  			add:true,
  			success:function(){
  				Application.assignmentsView.$el.trigger("dataLoaded");
  			},
  			error: function (jqXHR, textStatus, errorThrown) {
  				var error_message = (textStatus.responseText);
  				
  				if (error_message == "no_session")
  				{
  					Application.router.navigate("/", {
  						trigger: true
  					});
  				}
  			}
  		});
  		
  		return this;
  	}, 

  	append: function(){
  		this.assignmentList.listJSON = this.assignmentList.handle();
  		this.$el.html(this.template(this.assignmentList.listJSON));
  		this.enableScroll();
  	},

  	enableScroll: function() {
  		scrollElement = new iScroll('scrollElement', {useTransition:true,hScroll:false});
  	},

  	viewAssignment: function(e) {   
  		e.preventDefault();
  		Application.assignmentGroupView.assignmentId = $(e.currentTarget).data('id');
  		Application.router.navigate("#assignmentGroup", {trigger: true});
  	},
  	
  	addScreen: function() {
  		Application.router.navigate("#formNewElement", {trigger: true});
  	},
  	
  	assignment: function() {
    		Application.router.navigate("#formNewAssignment", {trigger: true});
  	}

  });
  
});
window.require.register("views/bookmarks_view", function(exports, require, module) {
  var View = require('./view');
  var template = require('./templates/bookmarks');
  var Bookmark = require('../models/teacher_bookmarks');


  module.exports = View.extend({
    id: 'bookmarks-view',
    template: template,
  	events: {
  		"dataLoaded":"append",
  		'click .bookmarks-thumb':'viewBookmark',
  		'click .add_button':'addScreen',
  		'click .edit-bookmark' : "modifyPage",
  		'click .new-bookmark' : "newBookmark",
  		'click .done' :'completeAdding',
  		'click .bookmark-delete':'deleteBookmark',
  		'click .help':'helpMe'
  	},

  	render: function() {
  		this.bookmarkList = new Bookmark();
  		this.bookmarkList.listJSON = {};
  		this.$el.html(this.template(this.bookmarkList.listJSON));
  		this.session_id = window.localStorage.getItem("session_id");

  		this.bookmarkList.fetch({
  			data: {session_id:this.session_id},
  			xhrFields: {withCredentials: true},
  			processData:true,
  			add:true,
  			success:function(){
  				Application.bookmarksView.$el.trigger("dataLoaded");
  			},
  			error: function (jqXHR, textStatus, errorThrown) {
  				var error_message = (textStatus.responseText);
  				
  				if (error_message == "no_session")
  				{
  					Application.router.navigate("/", {
  						trigger: true
  					});
  				}
  			}
  		});
  		return this;
  	}, 

  	append: function(){
  		this.bookmarkList.listJSON = this.bookmarkList.handle();
  		this.$el.html(this.template(this.bookmarkList.listJSON));
  		this.enableScroll();
  	},
  	
  	viewBookmark: function(e) {   
  		e.preventDefault();
  		var bookurl = $(e.currentTarget).data('urls');
  		window.plugins.childBrowser.showWebPage(bookurl);
  	},
  	
  	newBookmark: function (e) {
  		var defaulturl = "http://google.com/"; //default URL
  		
  		e.preventDefault();
  		cb = window.plugins.childBrowser;
  		if(cb!=null){
  			cb.onOpenExternal = function(loc){
  				if (loc != "about:blank")
  				{
  					var bookmark_url = loc;
  					if (bookmark_url == null || bookmark_url == "")
  					{
  						
  					}
  					else{
  					var session_id = window.localStorage.getItem("session_id");
  					$.ajax({
  						data: {session_id: session_id, bookmark_url: bookmark_url},
  						url: Application.serverURL+"teacher/bookmarks/create.json",
  						type: "POST",
  						xhrFields: {withCredentials: true},
  						dataType:"json",
  						success: function(data) {
  							navigator.notification.alert(
  								'The element has been added to bookmarks',  // message
  								function alertDismissed() {
  									Application.bookmarksView.bookmarkList = new Bookmark();
  									Application.bookmarksView.bookmarkList.listJSON = {};
  									Application.bookmarksView.bookmarkList.fetch({
  										data: {session_id:session_id},
  										processData:true,
  										xhrFields: {withCredentials: true},
  										update: true,
  										success:function(data){
  											Application.bookmarksView.$el.trigger("dataLoaded");
  										}
  									});
  								}, // callback
  								'Bookmarks',            // title
  								'OK'                  // buttonName
  							);
  										
  						},
  						error: function(textStatus, errorThrown) {
  								navigator.notification.alert(
  									'Unable to add bookmarks, please try again',  // message
  									function alertDismissed() {}, // callback
  									'Bookmarks',            // title
  									'OK'                  // buttonName
  								);
  							console.log(JSON.stringify(errorThrown));
  						}
  					});
  				}
  				}
  			};
  			cb.showWebPage(defaulturl);
  		}
  	},
  	
  	enableScroll: function() {
  		scrollElement = new iScroll('scrollElement', {useTransition:true,hScroll:false});
  	},
  	
  	addScreen: function() {
  		Application.router.navigate("#formNewElement", {trigger: true});
  	},
  	
  	modifyPage: function() {
  		$('.edit-bookmark').empty().addClass("done").append("Done");
  		$('.bookmark-delete').fadeIn();
  	},

  	completeAdding: function() {
  		$('.done').empty().removeClass("done");
  		$('.edit-bookmark').append("Edit");
  		$('.bookmark-delete').fadeOut();
  	},
  	
  	deleteBookmark: function(e){
  			var bookmark_id = $(e.currentTarget).data('id');
  			var session_id = window.localStorage.getItem("session_id");
  			
  			navigator.notification.confirm(
  				'Are you sure you want to delete this bookmark?',  // message
  				function(buttonIndex){
  					if (buttonIndex == 2)
  					{
  					$.ajax({
  						data: {session_id: session_id, bookmark_id: bookmark_id},
  						url: Application.serverURL+"teacher/bookmarks/delete.json",
  						type: "POST",
  						xhrFields: {withCredentials: true},
  						success: function(data) {
  							Application.bookmarksView.bookmarkList = new Bookmark();
  							Application.bookmarksView.bookmarkList.listJSON = {};
  							Application.bookmarksView.bookmarkList.fetch({
  								data: {session_id:session_id},
  								processData:true,
  								xhrFields: {withCredentials: true},
  								update: true,
  								success:function(data){
  									Application.bookmarksView.$el.trigger("dataLoaded");
  								}
  							});
  						},
  						error: function(textStatus, errorThrown) {
  							navigator.notification.alert(
  								'Please try again',  // message
  								function alertDismissed() {}, // callback
  								'Error',            // title
  								'OK'                  // buttonName
  							);
  							console.log(JSON.stringify(errorThrown));
  						}
  					});
  				}
  				},         // callback
  				'Delete',            // title
  				'Cancel, OK'                  // buttonName
  				);
  	},
  	
  	helpMe: function() {
  		$("body").chardinJs('toggle');
  	}

  });
  
});
window.require.register("views/element_overlay_assignment", function(exports, require, module) {
  var View = require('./view');
  var template = require('./templates/element_overlay_assignment');
  var Assignment = require('../models/element_assignment');

  module.exports = View.extend({
  	id: 'element-view',
  	template: template,
  	events: {
  		'dataLoaded':'append',
  		'click #uploadAssignment':'uploadAssignment',
  		'click #reviewAssignment':'reviewAssignment',
  		'click #submitAssignment':'submitAssignment'
  	},

  	initialize: function() {

  	},

  	render: function() {	
  		this.assignmentInfo = new Assignment();
  		this.assignmentInfo.assignmentJSON = {};
  		this.$el.html(this.template(this.assignmentInfo.assignmentJSON));
  		var assignmentToOpen = this.assignmentId;
  		this.session_id = window.localStorage.getItem("session_id");


  		this.assignmentInfo.fetch({
  			data:{session_id:this.session_id, assignment_id: assignmentToOpen},
  			processData:true,
  			xhrFields: {withCredentials: true},
  			add:true,
  			success:function(data){
  				console.log(data);
  				Application.elementOverlayAssignment.$el.trigger("dataLoaded");
  			},
  			error: function (jqXHR, textStatus, errorThrown) {
  				var error_message = (textStatus.responseText);

  				if (error_message == "no_session")
  				{
  					Application.router.navigate("/", {
  						trigger: true
  					});
  				}
  			}
  		});

  		return this;
  	},

  	append: function(){
  		this.assignmentInfo.assignmentJSON = this.assignmentInfo.handle();
  		this.$el.html(this.template(this.assignmentInfo.assignmentJSON));
  		Application.elementOverlayAssignment.teacherId = Application.elementOverlayAssignment.assignmentInfo.assignmentJSON.assignment.teacher_id;
  	},

  	reviewAssignment: function(){

  		window.plugins.knowitallbrowser.open(this.submission_url);		
  	},

  	submitAssignment: function(){
  		$('#theSpinner').show();

  		var submission_url = this.submission_url;

  		$.ajax({
  			data: {session_id: Application.elementOverlayAssignment.session_id, assignment_id: Application.elementOverlayAssignment.assignmentId, teacher_id: Application.elementOverlayAssignment.teacherId, assignment_url: submission_url},
  			url: Application.serverURL+"student/elements/submit_assignment.json",
  			type: "POST",
  			xhrFields: {withCredentials: true},
  			dataType:"json",
  			success: function(data) {
  				$('#theSpinner').hide();
  				navigator.notification.alert(
  					'Your assignment has been submitted.',  // message
  					function alertDismissed() {}, // callback
  					'Success',            // title
  					'OK'                  // buttonName
  				);

  			},
  			error: function(textStatus, errorThrown) {

  				$('#theSpinner').hide();
  				navigator.notification.alert(
  					'Unable to save changes, please try again',  // message
  					function alertDismissed() {}, // callback
  					'Try Again',            // title
  					'OK'                  // buttonName
  				);
  				console.log(JSON.stringify(errorThrown));
  			}
  		});

  	},

  	uploadAssignment: function() {
  		if (!window.plugins.filepicker) {
  			return;
  		}

  		var uploadSuccess = function(args) {
  			if (args.result == 'didFinishPickingMediaWithInfo') {
  				var submission_url = args.FPPickerControllerRemoteURL;
  				Application.elementOverlayAssignment.submission_url = submission_url;
  				$('#uploadAssignment').fadeOut(100);
  				setTimeout(function () {
  					$('#success-btn-group').fadeIn(100);
  					}, 200);

  				}
  			};

  			var uploadError = function(args) {
  				navigator.notification.alert(
  					'Unable to upload assignment, please try again',  // message
  					function alertDismissed() {}, // callback
  					'Error',            // title
  					'OK'                  // buttonName
  				);
  			};

  			window.plugins.filepicker.pick(
  				{
  					sourceNames: ['FPSourceCamera', 'FPSourceCameraRoll', 'FPSourceDropbox', 'FPSourceGoogleDrive', 'FPSourceGmail']
  				},
  				uploadSuccess,
  				uploadError
  			);
  		}

  	});
  
});
window.require.register("views/element_overlay_link", function(exports, require, module) {
  var View = require('./view');
  var template = require('./templates/element_overlay_link');
  var Share_Link = require('../models/element_link');

  module.exports = View.extend({
  	id: 'element-view',
  	template: template,
  	events: {
  		'dataLoaded':'append',
  		'click #openLink':'openLink'
  	},
  	render: function() {	
  		this.linkInfo = new Share_Link();
  		this.linkInfo.linkJSON = {};
  		this.$el.html(this.template(this.linkInfo.linkJSON));
  		var linkToOpen = this.linkId;
  		this.session_id = window.localStorage.getItem("session_id");
  		

  		this.linkInfo.fetch({
  			data:{session_id:this.session_id, element_id: linkToOpen},
  			processData:true,
  			xhrFields: {withCredentials: true},
  			add:true,
  			success:function(data){
  				console.log(data);
  				Application.elementOverlayLink.$el.trigger("dataLoaded");
  			},
  			error: function (jqXHR, textStatus, errorThrown) {
  				var error_message = (textStatus.responseText);
  				
  				if (error_message == "no_session")
  				{
  					Application.router.navigate("/", {
  						trigger: true
  					});
  				}
  			}
  		});

  		link_id = this.linkId;

  		return this;

  	},

  	append: function(){
  		this.linkInfo.linkJSON = this.linkInfo.handle();
  		this.$el.html(this.template(this.linkInfo.linkJSON));
  	},

  	openLink: function(){
  		window.plugins.knowitallbrowser.open(this.linkInfo.linkJSON.share_link.link_url);
  	}

  });
});
window.require.register("views/element_overlay_pdf", function(exports, require, module) {
  var View = require('./view');
  var template = require('./templates/element_overlay_pdf');
  var Pdf = require('../models/element_pdf');

  module.exports = View.extend({
  	id: 'element-view',
  	template: template,
  	events: {
  		'dataLoaded':'append',
  		'click #openPdf':'openPdf'
  	},
  	
  	initialize: function() {

  	},

  	render: function() {	
  		this.pdfInfo = new Pdf();
  		this.pdfInfo.pdfJSON = {};
  		this.$el.html(this.template(this.pdfInfo.pdfJSON));
  		var pdfToOpen = this.pdfId;
  		this.session_id = window.localStorage.getItem("session_id");

  		this.pdfInfo.fetch({
  			data:{session_id:this.session_id, element_id: pdfToOpen},
  			processData:true,
  			xhrFields: {withCredentials: true},
  			add:true,
  			success:function(data){
  				console.log(data);
  				Application.elementOverlayPdf.$el.trigger("dataLoaded");
  			},
  			error: function (jqXHR, textStatus, errorThrown) {
  				var error_message = (textStatus.responseText);
  				
  				if (error_message == "no_session")
  				{
  					Application.router.navigate("/", {
  						trigger: true
  					});
  				}
  			}
  		});

  		pdf_id = this.pdfId;

  		return this;

  	},

  	append: function(){
  		this.pdfInfo.pdfJSON = this.pdfInfo.handle();
  		this.$el.html(this.template(this.pdfInfo.pdfJSON));
  	},
  	
  	openPdf: function(){
  		
  		window.plugins.knowitallbrowser.open(this.pdfInfo.pdfJSON.pdf.pdf_url);
  	},


  });
  
});
window.require.register("views/element_overlay_socrative", function(exports, require, module) {
  var View = require('./view');
  var template = require('./templates/element_overlay_socrative');
  var Socrative = require('../models/element_socrative');

  module.exports = View.extend({
  	id: 'element-view',
  	template: template,
  	events: {
  		'dataLoaded':'append',
  		'click #openSocrative':'openSocrative'
  	},

  	initialize: function() {

  	},

  	render: function() {	
  		this.socrativeInfo = new Socrative();
  		this.socrativeInfo.socrativeJSON = {};
  		this.$el.html(this.template(this.socrativeInfo.socrativeJSON));
  		var socrativeToOpen = this.socrativeId;
  		this.session_id = window.localStorage.getItem("session_id");

  		this.socrativeInfo.fetch({
  			data:{session_id: this.session_id, element_id: socrativeToOpen},
  			processData:true,
  			xhrFields: {withCredentials: true},
  			add:true,
  			success:function(data){
  				console.log(data);
  				Application.elementOverlaySocrative.$el.trigger("dataLoaded");
  			},
  			error: function (jqXHR, textStatus, errorThrown) {
  				var error_message = (textStatus.responseText);
  				
  				if (error_message == "no_session")
  				{
  					Application.router.navigate("/", {
  						trigger: true
  					});
  				}
  			}
  		});

  		return this;

  	},

  	append: function(){
  		this.socrativeInfo.socrativeJSON = this.socrativeInfo.handle();
  		this.$el.html(this.template(this.socrativeInfo.socrativeJSON));
  	},
  	openSocrative: function(){
  		var user_name = window.localStorage.getItem("user_name");
  		if (user_name.indexOf("@") >= 0) {
  			window.plugins.childBrowser.open("http://m.socrative.com/lecturer/#lecturerLogin");
  		}
  		else {
  			window.plugins.childBrowser.open("http://m.socrative.com/student/#joinRoom");
  		}
  	}


  });
  
});
window.require.register("views/element_view", function(exports, require, module) {
  var View = require('./view');
  var template = require('./templates/element');

  module.exports = View.extend({
    id: 'element-view',
    template: template,
  	events: {
  		'click #editElement':'editElement'
  	},
  	
  	enableScroll: function() {
  		scrollElement = new iScroll('scrollElement', {useTransition:true,hScroll:false});
  	},

  	editElement: function() {
  		//Application.router.navigate("#newUnit", {trigger: true});
  	}

  });
  
});
window.require.register("views/element_view_photo", function(exports, require, module) {
  var View = require('./view');
  var template = require('./templates/element_photo');
  var Photo = require('../models/element_photo');

  module.exports = View.extend({
  	id: 'element-view',
  	template: template,
  	events: {
  		'dataLoaded':'append',
  		},

  	initialize: function() {

  	},

  	render: function() {	
  		this.photoInfo = new Photo();
  		this.photoInfo.photoJSON = {};
  		this.$el.html(this.template(this.photoInfo.photoJSON));
  		var photoToOpen = this.photoId;
  		var session_id = window.localStorage.getItem("session_id");
  		

  		this.photoInfo.fetch({
  			data:{session_id: session_id, element_id: photoToOpen},
  			processData:true,
  			xhrFields: {withCredentials: true},
  			add:true,
  			success:function(data){
  				console.log(data);
  				Application.elementViewPhoto.$el.trigger("dataLoaded");
  			},
  			error: function (jqXHR, textStatus, errorThrown) {
  				var error_message = (textStatus.responseText);
  				
  				if (error_message == "no_session")
  				{
  					Application.router.navigate("/", {
  						trigger: true
  					});
  				}
  			}
  		});

  		photo_id = this.photoId;

  		return this;

  	},

  	append: function(){
  		this.photoInfo.photoJSON = this.photoInfo.handle();
  		this.$el.html(this.template(this.photoInfo.photoJSON));
  		this.enableScroll();
  	},

  	enableScroll: function() {
  		scrollPhoto = new iScroll('scrollPhoto', {useTransition:true,hScroll:false});
  	}

  });
  
});
window.require.register("views/element_view_video", function(exports, require, module) {
  var View = require('./view');
  var template = require('./templates/element_video');
  var Video = require('../models/element_video');

  module.exports = View.extend({
  	id: 'element-view',
  	template: template,
  	events: {
  		'dataLoaded':'append',
  		'click #openVideo':'openVideo'

  	},

  	initialize: function() {

  	},

  	render: function() {	
  		this.videoInfo = new Video();
  		this.videoInfo.videoJSON = {};
  		this.$el.html(this.template(this.videoInfo.videoJSON));
  		var videoToOpen = this.videoId;

  		this.videoInfo.fetch({
  			data:{element_id: videoToOpen},
  			processData:true,
  			xhrFields: {withCredentials: true},
  			add:true,
  			success:function(data){
  				console.log(data);
  				Application.elementViewVideo.$el.trigger("dataLoaded");
  			},
  			error: function (jqXHR, textStatus, errorThrown) {
  				var error_message = (textStatus.responseText);
  				
  				if (error_message == "no_session")
  				{
  					Application.router.navigate("/", {
  						trigger: true
  					});
  				}
  			}
  		});

  		video_id = this.videoId;

  		return this;

  	},

  	append: function(){
  		this.videoInfo.videoJSON = this.videoInfo.handle();
  		this.$el.html(this.template(this.videoInfo.videoJSON));
  	},
  	enableScroll: function() {
  		scrollElement = new iScroll('scrollElement', {useTransition:true,hScroll:false});
  	},

  	openVideo: function(){
  		window.plugins.knowitallbrowser.open(this.videoInfo.videoJSON.video.video_url);
  		//window.plugins.childBrowser.showWebPage(this.videoInfo.videoJSON.video.video_url);
  	}

  });

  
});
window.require.register("views/formAddGroup_view", function(exports, require, module) {
  var View = require('./view');
  var template = require('./templates/formAddGroup');
  var GroupList = require('../models/lessons_groups');
  var skip = 0;
  var max = 20;


  module.exports = View.extend({
  	id: 'formAddGroup-view',
  	template: template,
  	events: {
  		'dataLoaded':'append',
  		'click .overlay_submit':'submitForm',
  		'click .add-group-thumb':'chooseOptionGroup'
  	},	

  	render: function() {
  		this.groupList = new GroupList();
  		this.groupList.groupsJSON = {};
  		this.$el.html(this.template(this.groupList.groupsJSON));
  		this.session_id = window.localStorage.getItem("session_id");
  		this.groupedList = new Array();		

  		this.groupList.fetch({
  			processData:true,
  			add:true,
  			xhrFields: {withCredentials: true},
  			data: {session_id:this.session_id, lesson_id:this.lesson_id},
  			success: function(){
  				Application.formAddGroupView.$el.trigger("dataLoaded");
  			}
  		});

  		return this;
  	}, 

  	append: function(){
  		this.groupList.groupsJSON = this.groupList.handle();
  		this.$el.html(this.template(this.groupList.groupsJSON));
  		this.enableScroll();
  	},

  	enableScroll: function() {
  		overlayScroller3 = new iScroll('overlayScroller3', {useTransition:true,hScroll:false});
  	},

  	// Group Check
  	chooseOptionGroup: function(e) {
  		var element = $(e.currentTarget);
  		var selected = element.hasClass('checked');
  		if (!selected)
  		{
  			element.addClass('checked').append('<div class="group-check"></div>');
  		}
  		else
  		{
  			element.removeClass('checked').children('div.group-check').remove();
  		}
  	},

  	submitForm: function() {
  		$('#theSpinner').show();
  		var listFull = false;
  		chooseGroup = function() {
  			var elements = document.getElementsByClassName("checked");
  			$(elements).each(function(index) {
  				listFull = true;
  				var idIneed = elements[index].id;
  				Application.formAddGroupView.groupedList.push(idIneed);
  			})	
  		};	
  		chooseGroup();
  		var group_name = $('#group_name').val();
  		var session_id = window.localStorage.getItem("session_id");
  		if (listFull) {
  		
  		$.ajax({			
  			data: {session_id: this.session_id, lesson_id: this.lesson_id, group_id:this.groupedList},
  			xhrFields: {withCredentials: true},
  			url: Application.serverURL+'teacher/lessons/update.json',
  			type: "POST",
  			success: function(data) {
  				Application.formAddGroupView.groupedList = new Array();		
  				Application.lessonView.backbutton = false;
  				Application.lessonView.lessonId = data.lesson_id;
  				$('#theSpinner').hide();
  				Application.router.navigate("#lesson", {trigger: true});
  			},
  			error: function(textStatus, errorThrown) {
  				$('#theSpinner').hide();
  				Application.formAddGroupView.groupedList = new Array();		
  				navigator.notification.alert(
  					'Unable to save group, please try again',  // message
  					function alertDismissed() {}, // callback
  					'Error',            // title
  					'OK'                  // buttonName
  				);
  				console.log(JSON.stringify(errorThrown));
  			}
  		});
  	}
  	else{
  		$('#theSpinner').hide();
  		$.ajax({			
  			data: {session_id: this.session_id, lesson_id: this.lesson_id, group_id:null},
  			xhrFields: {withCredentials: true},
  			url: Application.serverURL+'teacher/lessons/update.json',
  			type: "POST",
  			success: function(data) {
  				Application.formAddGroupView.groupedList = new Array();		
  				Application.lessonView.backbutton = false;
  				Application.lessonView.lessonId = data.lesson_id;
  				$('#theSpinner').hide();
  				Application.router.navigate("#lesson", {trigger: true});
  			},
  			error: function(textStatus, errorThrown) {
  				Application.formAddGroupView.groupedList = new Array();		
  				navigator.notification.alert(
  					'Unable to save group, please try again',  // message
  					function alertDismissed() {}, // callback
  					'Error',            // title
  					'OK'                  // buttonName
  				);
  				console.log(JSON.stringify(errorThrown));
  			}
  		});
  		
  	}
  }

  });
  
});
window.require.register("views/formAddStudent_view", function(exports, require, module) {
  var View = require('./view');
  var template = require('./templates/formAddStudent');
  var GroupModel = require('../models/groups_students');
  var grouptosearch = 0;

  module.exports = View.extend({
  	id: 'formAddStudent-view',
  	template: template,
  	events: {
  		'dataLoaded':'append',
  		'click .overlay_submit':'submitForm',
  		'click .student_thumb':'chooseOptionStudent'
  	},	

  	render: function() {
  		
  		this.singleGroup = new GroupModel();
  		this.singleGroup.groupJSON = {};
  		this.$el.html(this.template(this.singleGroup.groupJSON));
  		this.session_id = window.localStorage.getItem("session_id");

  		this.singleGroup.fetch({
  			data: {session_id: this.session_id, group_id: this.groupId},
  			xhrFields: {withCredentials: true},
  			processData:true,
  			add:true,
  			success:function(){
  				Application.formAddStudentView.$el.trigger("dataLoaded");
  			},
  			error: function (jqXHR, textStatus, errorThrown) {
  				var error_message = (textStatus.responseText);
  				
  				if (error_message == "no_session")
  				{
  					Application.router.navigate("/", {
  						trigger: true
  					});
  				}
  			}
  		});

  		return this;
  	}, 

  	append: function(){
  		this.singleGroup.groupJSON = this.singleGroup.handle();
  		this.$el.html(this.template(this.singleGroup.groupJSON));
  		this.enableScroll();
  	},	

  	enableScroll: function() {
  		overlayScroller5 = new iScroll('overlayScroller5', {useTransition:true,hScroll:false});
  	},

  	// Student Check
  	chooseOptionStudent: function(e) {
  		var element = $(e.currentTarget);
  		var selected = element.hasClass('checked');
  		if (!selected)
  		{
  			element.addClass('checked').append('<div class="student-check"></div>');
  		}
  		else
  		{
  			element.removeClass('checked').children('div.student-check').remove();
  		}
  	},

  	submitForm: function() {
  		$('#theSpinner').show();
  		var studentList = new Array();
  		chooseStudent = function() {
  			var elements = document.getElementsByClassName("checked");
  			$(elements).each(function(index) {
  				var idIneed = elements[index].id;
  				studentList.push(idIneed);
  			})	
  		};	
  		chooseStudent();
  		var group_name = $('#group_name').val();
  		var session_id = window.localStorage.getItem("session_id");
  		$.ajax({			
  			data: {session_id: session_id, group_id: this.groupId, student_id:studentList},
  			xhrFields: {withCredentials: true},
  			url: Application.serverURL+'teacher/groups/update.json',
  			type: "POST",
  			success: function(data) {
  				Application.groupView.backbutton = false;
  				Application.groupView.groupId = data.group_id;
  				$('#theSpinner').hide();
  				Application.router.navigate("#group", {trigger: true});
  			},
  			error: function(textStatus, errorThrown) {
  				$('#theSpinner').hide();
  				navigator.notification.alert(
  					'Unable to edit group, please try again',  // message
  					function alertDismissed() {}, // callback
  					'Error',            // title
  					'OK'                  // buttonName
  				);
  				console.log(JSON.stringify(errorThrown));
  			}
  		});
  	}

  });
  
});
window.require.register("views/formAnnouncement_view", function(exports, require, module) {
  var View = require('./view');
  var template = require('./templates/formAnnouncement');
  var MyGroups = require('../models/teacher_groups');
  var skip = 0;
  var max = 20;

  module.exports = View.extend({
  	id: 'formAnnouncement-view',
  	template: template,
  	events: {
  		'dataLoaded':'append',
  		'click .overlay_submit':'submitForm',
  		'click .group-option': 'chooseOptionGroup'
  	},

  	render: function() {	

  		this.teacherGroups = new MyGroups();
  		this.teacherGroups.groupsJSON ={};
  		this.$el.html(this.template(this.teacherGroups.groupsJSON));
  		this.session_id = window.localStorage.getItem("session_id");

  		this.teacherGroups.fetch({
  			data: {session_id:this.session_id, skip:skip, max:max },
  			processData:true,
  			add:true,
  			xhrFields: {withCredentials: true},
  			success:function(data){
  				Application.formAnnouncementView.$el.trigger("dataLoaded");
  			},
  			error: function (jqXHR, textStatus, errorThrown) {
  				var error_message = (textStatus.responseText);
  				if (error_message == "no_session")
  				{
  					Application.router.navigate("/", {
  						trigger: true
  					});
  				}
  			}		
  		});

  		return this;
  	},

  	append: function(){	
  		this.teacherGroups.groupsJSON = this.teacherGroups.handle();
  		this.$el.html(this.template(this.teacherGroups.groupsJSON));
  		this.enableScroll();
  	},

  	enableScroll: function() {
  		overlayScroller4 = new iScroll('overlayScroller4', {useTransition:true,hScroll:false});
  	},

  	chooseOptionGroup: function(e) {
  		$('.active_option').removeClass('active_option');
  		$(e.currentTarget).addClass('active_option');		
  	},

  	submitForm: function() {
  		var group_announce = new Array();
  		$('#theSpinner').show();
  		var title = $('#announcement_title').val();
  		var body = $('#announcement_body').val();
  		var session_id = window.localStorage.getItem("session_id");

  		group_announce.push(this.groupId);

  		if(this.groupId == 'ALL'){
  			if (title && body) {
  				$.ajax({			
  					data: {session_id: session_id, title: title, body: body, send_to_all:true},
  					xhrFields: {withCredentials: true},
  					url: Application.serverURL+'teacher/announcement/create.json',
  					type: "POST",
  					success: function(data) {
  						Application.groupView.backbutton = false;
  						Application.groupView.groupId = Application.formAnnouncementView.groupId;
  						$('#theSpinner').hide();
  						Application.router.navigate("#announcements", {trigger: true});
  					},
  					error: function(textStatus, errorThrown) {
  						$('#theSpinner').hide();
  						$('#theSpinner').hide();
  						navigator.notification.alert(
  							'Unable to make announcement, please try again',  // message
  							function alertDismissed() {}, // callback
  							'Error',            // title
  							'OK'                  // buttonName
  						);
  						console.log(JSON.stringify(errorThrown));
  					}
  				});
  			}
  			else{
  				$('#theSpinner').hide();
  				navigator.notification.alert(
  					'Please enter title and announcement',  // message
  					function alertDismissed() {}, // callback
  					'Error',            // title
  					'OK'                  // buttonName
  				);
  			}

  		}
  		else{

  			if (title && body && group_announce) {
  				var session_id = window.localStorage.getItem("session_id");
  				$.ajax({			
  					data: {session_id: session_id, title: title, body: body, group_id:group_announce},
  					xhrFields: {withCredentials: true},
  					url: Application.serverURL+'teacher/announcement/create.json',
  					type: "POST",
  					success: function(data) {
  						Application.groupView.backbutton = false;
  						Application.groupView.groupId = Application.formAnnouncementView.groupId;
  						$('#theSpinner').hide();
  						Application.router.navigate("#announcements", {trigger: true});
  					},
  					error: function(textStatus, errorThrown) {
  						$('#theSpinner').hide();
  						$('#theSpinner').hide();
  						navigator.notification.alert(
  							'Unable to make announcement, please try again',  // message
  							function alertDismissed() {}, // callback
  							'Error',            // title
  							'OK'                  // buttonName
  						);
  						console.log(JSON.stringify(errorThrown));
  					}
  				});
  			}
  			else{
  				$('#theSpinner').hide();
  				navigator.notification.alert(
  					'Please enter title and announcement',  // message
  					function alertDismissed() {}, // callback
  					'Error',            // title
  					'OK'                  // buttonName
  				);
  			}
  		}
  	}

  });
  
});
window.require.register("views/formInputStudent_view", function(exports, require, module) {
  var View = require('./view');
  var template = require('./templates/formInputStudent');
  var studentList = new Array();
  var grouptosearch = 0;

  module.exports = View.extend({
  	id: 'formInputStudent-view',
  	template: template,
  	events: {
  		'click #addStudent' : 'addStudenttoList'

  	},	

  	render: function() {
  		this.$el.html(this.template());

  		return this;
  	}, 


  	addStudenttoList: function() {
  				$('#theSpinner').show();
  				var student_first = $('#addFirst').val();
  				var student_last = $('#addLast').val();
  				var session_id = window.localStorage.getItem("session_id");
  				var customer_id = window.localStorage.getItem("teacher_customer_id");

  				if (student_last && student_first)
  				{
  					$.ajax({
  						data: {session_id: session_id, customer_id: customer_id, first_name: student_first, last_name: student_last},
  						url: Application.serverURL+"teacher/create_student.json",
  						type: "POST",
  						xhrFields: {withCredentials: true},
  						dataType:"json",
  						success: function(data) {
  							$('#theSpinner').hide();
  								$('#addFirst').val('');
  								$('#addLast').val('');
  								document.activeElement.blur();
  								$("addLast").blur();
  								$("addFirst").blur();
  							navigator.notification.alert(
  								'Student successfully added',  // message
  								function alertDismissed() {}, // callback
  								'Success',            // title
  								'OK'                  // buttonName
  								);	

  						},
  						error: function(textStatus, errorThrown) {
  							$('#theSpinner').hide();
  							navigator.notification.alert(
  								'Unable to save changes, please try again',  // message
  								function alertDismissed() {}, // callback
  								'Try Again',            // title
  								'OK'                  // buttonName
  							);
  							$('#addFirst').val('');
  							$('#addLast').val('');
  							document.activeElement.blur();
  							$("addLast").blur();
  							$("addFirst").blur();
  							console.log(JSON.stringify(errorThrown));
  						}
  					});
  				}
  				else{
  					$('#theSpinner').hide();
  					navigator.notification.alert(
  						'Please enter a first and last name',  // message
  						function alertDismissed() {}, // callback
  						'Error',            // title
  						'OK'                  // buttonName
  					);

  				}
  			}
  });
  
});
window.require.register("views/formNewAssignment_view", function(exports, require, module) {
  var View = require('./view');
  var template = require('./templates/formNewAssignment');
  var List = require('../models/unit_list');
  var skip = 0;
  var max = 20;

  module.exports = View.extend({
  	id: 'formNewAssignment-view',
  	template: template,
  	events: {
  		"dataLoaded":"append",
  		'click #submit':'submitForm',
  		'change #unitSelect':'populateLessons'
  	},

  	initialize: function() {  

  	},

  	render: function() {	
  		this.unitList = new List();
  		this.unitList.listJSON = {};
  		this.$el.html(this.template(this.unitList.listJSON));
  		this.session_id = window.localStorage.getItem("session_id");	

  		this.unitList.fetch({
  			data:{session_id: this.session_id, skip:skip, max:max, group_id:"ALL"},
  			xhrFields: {withCredentials: true},
  			processData:true,
  			add:true,
  			success:function(data){
  				Application.formNewAssignmentView.$el.trigger("dataLoaded");
  			},
  			error: function (jqXHR, textStatus, errorThrown) {
  				var error_message = (textStatus.responseText);
  				
  				if (error_message == "no_session")
  				{
  					Application.router.navigate("/", {
  						trigger: true
  					});
  				}
  			}
  		});

  		return this;
  		
  	},

  	append: function(){		
  		this.unitList.listJSON = this.unitList.handle();
  		this.$el.html(this.template(this.unitList.listJSON));
  		setTimeout(function(){
  			$('#element-view-cover').fadeOut();
  		},100);
  	},

  	populateLessons: function()
  	{

  		var unitId = $('#unitSelect').val(); //get unit id from select when triggered from change event
  		//ajax request to get lessons with unit id
  		$.ajax({
  			data: {session_id: this.session_id, unit_id:unitId},
  			xhrFields: {withCredentials: true},
  			url: Application.serverURL+'teacher/units.json',
  			type: 'GET',
  			success: function(data) {
  				$('#lessonField').removeClass('disabled-select').addClass('active-select'); // add active style
  				$('#lessonSelect').empty(); //empty all options from select
  				for(index in data.lesson_list) // for each lesson return append a option
  				{
  					$('#lessonSelect').append('<option value="'+data.lesson_list[index].lesson_id+'">'+data.lesson_list[index].lesson_name+'</option>');
  				}
  			},
  			error: function(){
  				navigator.notification.alert(
  					'Unable to load lessons',  // message
  					function alertDismissed() {}, // callback
  					'Error',            // title
  					'OK'                  // buttonName
  				);
  				console.log('populateLessons error');
  			}
  		});
  	},

  	submitForm: function() {
  		$('#theSpinner').show();
  		var assignment_date = $('#assignment_date').val();
  		var assignment_title = $('#assignment_title').val();
  		var assignment_notes = $('#assignment_notes').val();
  		var selected_unit_id = $('.active_option').data('id');
  		var unit_id = $('#unitSelect').val();
  		var lesson_id = $('#lessonSelect').val();
  		if (assignment_title && assignment_notes && assignment_date) {

  		var user_name = window.localStorage.getItem("user_name");
  		$.ajax({			
  			data: {session_id: this.session_id, title: assignment_title, notes: assignment_notes, unit_id:unit_id, lesson_id:lesson_id, due_date:assignment_date},
  			xhrFields: {withCredentials: true},
  			url: Application.serverURL+'teacher/elements/create_assignment.json',
  			type: "POST",
  			dataType:"json",
  			success: function(data) {
  				Application.lessonView.backbutton = false;
  				Application.lessonView.lessonId = lesson_id;
  				$('#theSpinner').hide();
  				Application.router.navigate("#assignments", {trigger: true});
  			},
  			error: function(textStatus, errorThrown) {
  				console.log(errorThrown);
  				$('#theSpinner').hide();
  				navigator.notification.alert(
  				    'Unable to create an assignment. Please try again.',  // message
  				    function alertDismissed() {}, // callback
  				    'Error',            // title
  				    'OK'                  // buttonName
  				);
  			}
  		});	
  		}
  		else{
  			$('#theSpinner').hide();
  			navigator.notification.alert(
  			    'Please fill out all fields.',  // message
  			    function alertDismissed() {}, // callback
  			    'Error',            // title
  			    'OK'                  // buttonName
  			);
  		}	
  	}

  });
  
});
window.require.register("views/formNewElement_view", function(exports, require, module) {
  var View = require('./view');
  var template = require('./templates/formNewElement');

  module.exports = View.extend({
  	id: 'formNewElement-view',
  	template: template,
  	events: {
  		'click .elementOption':'chooseOption',
  		'click #unit': 'unit',
  		'click #lesson': 'lesson',
  		'click #pdf': 'pdf',
  		'click #photo': 'photo',
  		'click #video': 'video',
  		'click #worksheet': 'worksheet',
  		'click #link': 'link',
  		'click #test': 'test',
  		'click #socrative':'socrative',
  		'click #assignment':'assignment',
  		'click #group': 'group',
  		'click .help':'helpMe'
  	},	

  	enableScroll: function() {
  		scrollNewElements = new iScroll('scrollNewElements', {useTransition: true, hScroll: false, vScroll: true, vScrollbar: false});
  	},

  	chooseOption: function(e) {
  		var elementType = $(e.currentTarget).attr('id');
  	  	$('.elementOption').removeClass('active_grid_option');
  	  	$(e.currentTarget).addClass('active_grid_option');
  	},
  	
  	unit: function() {
    		Application.router.navigate("#formNewUnit", {trigger: true});
  	},
  	
  	lesson: function() {
    		Application.router.navigate("#formNewLesson", {trigger: true});
  	},
  	
  	pdf: function() {
    		Application.router.navigate("#formNewPdf", {trigger: true});
  	},
  	
  	photo: function() {
    		Application.router.navigate("#formNewPhoto", {trigger: true});
  	},
  	
  	video: function() {
    		Application.router.navigate("#formNewVideo", {trigger: true});
  	},
  	
  	worksheet: function() {
    		Application.router.navigate("#formNewWorksheet", {trigger: true});
  	},
  	
  	link: function() {
    		Application.router.navigate("#formNewLink", {trigger: true});
  	},
  	
  	test: function() {
    		Application.router.navigate("#formNewTest", {trigger: true});
  	},
  	
  	socrative: function() {
    		Application.router.navigate("#formNewSocrative", {trigger: true});
  	},
  	
  	assignment: function() {
    		Application.router.navigate("#formNewAssignment", {trigger: true});
  	},
  	
  	group: function() {
    		Application.router.navigate("#formNewGroup", {trigger: true});
  	},
  	
  	helpMe: function() {
  		$("body").chardinJs('toggle');
  	}
  	

  });
  
});
window.require.register("views/formNewGroup_view", function(exports, require, module) {
  var View = require('./view');
  var template = require('./templates/formNewGroup');
  var GroupModel = require('../models/groups');
  var skip = 0;
  var max = 20;

  module.exports = View.extend({
  	id: 'formNewGroup-view',
  	template: template,
  	events: {
  		'dataLoaded':'append',
  		'click .overlay_submit':'submitForm',
  		'click .student_thumb':'chooseOptionStudent',
  		'click #upload':'uploadPhoto'
  	},	

  	render: function() {
  		this.singleGroup = new GroupModel();
  		this.singleGroup.groupJSON = {};
  		this.$el.html(this.template(this.singleGroup.groupJSON));
  		this.session_id = window.localStorage.getItem("session_id");
  		this.photo_url = {};
  		this.photo_logic = false;

  		this.singleGroup.fetch({
  			data: {skip:skip, max:max, session_id: this.session_id, group_id:'ALL'},
  			xhrFields: {withCredentials: true},
  			processData:true,
  			add:true,
  			success:function(){
  				Application.formNewGroupView.$el.trigger("dataLoaded");
  			},
  			error: function (jqXHR, textStatus, errorThrown) {
  				var error_message = (textStatus.responseText);

  				if (error_message == "no_session")
  				{
  					Application.router.navigate("/", {
  						trigger: true
  					});
  				}
  			}
  		});

  		return this;
  	}, 

  	append: function(){
  		this.singleGroup.groupJSON = this.singleGroup.handle();
  		this.$el.html(this.template(this.singleGroup.groupJSON));
  		this.enableScroll();
  	},
  	
  	enableScroll: function() {
  		overlayScroller2 = new iScroll('overlayScroller2', {useTransition:true,hScroll:false});
  	},


  	chooseOptionStudent: function(e) {
  		var element = $(e.currentTarget);
  		var selected = element.hasClass('checked');
  		if (!selected)
  		{
  			element.addClass('checked').append('<div class="student-check"></div>');
  		}
  		else
  		{
  			element.removeClass('checked').children('div.student-check').remove();
  		}
  	},

  closeForm: function() {
  	Application.router.navigate("#groups", {trigger: true});
  },

  uploadPhoto: function() {
  	if (!window.plugins.filepicker) {
  		return;
  	}

  	var uploadSuccess = function(args) {
  		if (args.result == 'didFinishPickingMediaWithInfo') {
  			Application.formNewGroupView.photo_url = args.FPPickerControllerRemoteURL;
  			thumbnail_url = Application.formNewGroupView.photo_url + '/convert?w=150&h=150';
  			$('#picker').removeClass('background-image');
  			$('#picker').css('background-image', 'url(' + thumbnail_url + ')');
  			Application.formNewGroupView.photo_logic = true;
  			
  		}
  	};

  	var uploadError = function(args) {
  		console.log('Error during Filepicker upload');
  	};

  	window.plugins.filepicker.pick(
  		{
  			dataTypes: ['image/*'],
  			sourceNames: ['FPSourceCamera', 'FPSourceCameraRoll', 'FPSourceDropbox', 'FPSourceGoogleDrive', 'FPSourceGmail', 'FPSourceFacebook', 'FPSourceInstagram', 'FPSourceImagesearch']
  		},
  		uploadSuccess,
  		uploadError
  	);
  },

  submitForm: function() {
  	$('#theSpinner').show();
  	var listFull = false;
  	var studentList = new Array();
  	chooseStudent = function() {
  		var elements = document.getElementsByClassName("checked");
  		$(elements).each(function(index) {
  			listFull = true;
  			var idIneed = elements[index].id;
  			studentList.push(idIneed);
  		})	
  	};	
  	chooseStudent();
  	//	studentList = JSON.stringify(studentList);
  	console.log(studentList);
  	var group_name = $('#group_name').val();
  	var session_id = window.localStorage.getItem("session_id");
  	var photo_url = Application.formNewGroupView.photo_url;
  	
  	if (group_name && this.photo_logic==true && listFull){
  		console.log(photo_url);
  		$.ajax({			
  			data: {session_id: session_id, title: group_name, photo: photo_url, student_id:studentList},
  			xhrFields: {withCredentials: true},
  			url: Application.serverURL+'teacher/groups/create.json',
  			type: "POST",
  			success: function(data) {
  				$('#theSpinner').hide();
  				Application.groupView.backbutton = false;
  				Application.groupView.groupId = data.group_id;
  				Application.router.navigate("#group", {trigger: true});
  			},
  			error: function(textStatus, errorThrown) {
  				$('#theSpinner').hide();
  				navigator.notification.alert(
  					'Unable to make new group, please try again',  // message
  					function alertDismissed() {}, // callback
  					'Error',            // title
  					'OK'                  // buttonName
  				);
  				console.log(JSON.stringify(errorThrown));
  			}
  		});
  	}
  	else{
  		$('#theSpinner').hide();
  		navigator.notification.alert(
  			'Please enter title, and select photo and students',  // message
  			function alertDismissed() {}, // callback
  			'Error',            // title
  			'OK'                  // buttonName
  		);
  	}
  }

  });
  
});
window.require.register("views/formNewLesson_view", function(exports, require, module) {
  var View = require('./view');
  var template = require('./templates/formNewLesson');
  var List = require('../models/unit_list');
  var MyGroups = require('../models/teacher_groups');
  var skip = 0;
  var max = 20;


  module.exports = View.extend({
  	id: 'formNewLesson-view',
  	template: template,
  	events: {
  		"dataLoaded":"append",
  		'click #upload':'uploadPhoto',
  		'click .overlay_submit':'submitForm',
  		'click .group-option': 'chooseOptionGroup'
  	},

  	initialize: function() {  

  	},

  	render: function() {	

  		this.allTheJSON = {};
  		this.$el.html(this.template(this.allTheJSON));
  		this.unitList = new List();
  		this.unitList.listJSON = {};
  		this.teacherGroups = new MyGroups();
  		this.teacherGroups.groupsJSON ={};
  		this.groupList = new Array();
  		this.photo_url = {};
  		this.photo_logic = false;
  		
  		this.session_id = window.localStorage.getItem("session_id");

  		this.unitList.fetch({
  			data:{session_id: this.session_id, skip:skip, max:max, group_id:"ALL"},
  			processData:true,
  			add:true,
  			xhrFields: {withCredentials: true},
  			success:function(data){
  				
  				Application.formNewLessonView.teacherGroups.fetch({
  					processData:true,
  					xhrFields: {withCredentials: true},
  					add:true,
  					data: {session_id:Application.formNewLessonView.session_id, skip:skip, max:max },
  					success: function(data){
  						Application.formNewLessonView.$el.trigger("dataLoaded");
  					},
  					failure: function(data){
  						Application.formNewLessonView.$el.trigger("dataLoaded");
  					}
  				});
  				
  			},
  			error: function (jqXHR, textStatus, errorThrown) {
  				var error_message = (textStatus.responseText);
  				
  				if (error_message == "no_session")
  				{
  					Application.router.navigate("/", {
  						trigger: true
  					});
  				}
  			}
  		});

  		return this;
  	},

  	append: function(){	
  		
  		this.unitList.listJSON = this.unitList.handle();
  		this.teacherGroups.groupsJSON = this.teacherGroups.handle();
  		this.allTheJSON = {"groups":this.teacherGroups.groupsJSON, "units":this.unitList.listJSON };
  		
  		this.$el.html(this.template(this.allTheJSON));
  		this.enableScroll();

  	},

  	enableScroll: function() {
  		overlayScroller4 = new iScroll('overlayScroller4', {useTransition:true,hScroll:false});
  		
  	},
  	
  	uploadPhoto: function() {
  		if (!window.plugins.filepicker) {
  			return;
  		}

  		var uploadSuccess = function(args) {
  			if (args.result == 'didFinishPickingMediaWithInfo') {
  				Application.formNewLessonView.photo_url = args.FPPickerControllerRemoteURL;
  				thumbnail_url = Application.formNewLessonView.photo_url + '/convert?w=150&h=150';
  				$('#picker').removeClass('background-image');
  				$('#picker').css('background-image', 'url(' + thumbnail_url + ')');
  				Application.formNewLessonView.photo_logic = true;
  			}
  		};

  		var uploadError = function(args) {
  			console.log('Error during Filepicker upload');
  		};

  		window.plugins.filepicker.pick(
  			{
  				dataTypes: ['image/*'],
  				sourceNames: ['FPSourceCamera', 'FPSourceCameraRoll', 'FPSourceDropbox', 'FPSourceGoogleDrive', 'FPSourceGmail', 'FPSourceFacebook', 'FPSourceInstagram', 'FPSourceImagesearch']
  			},
  			uploadSuccess,
  			uploadError
  		);
  	},
  	
  	chooseOptionGroup: function(e) {
  		var element = $(e.currentTarget);
  		var selected = element.hasClass('active_option');
  		if (!selected)
  		{
  			element.addClass('active_option');
  		}
  		else
  		{
  			element.removeClass('active_option');
  		}
  	},

  	submitForm: function() {
  		$('#theSpinner').show();
  		
  		chooseGroup = function() {
  			var elements = document.getElementsByClassName('active_option');
  			$(elements).each(function(index) {
  				var idIneed = elements[index].id;
  				Application.formNewLessonView.groupList.push(idIneed);
  			})	
  		};
  		chooseGroup();
  		var lesson_title = $('#lesson_title').val();
  		var lesson_description = $('#lesson_description').val();
  		var selected_unit_id = $('#unitSelect').val();		
  		//console.log(this.photo_url);
  		
  		if (lesson_title && lesson_description && this.photo_logic==true) {
  			var session_id = window.localStorage.getItem("session_id");
  			$.ajax({			
  				data: {session_id: session_id, group_id: this.groupList, image_url:this.photo_url, title: lesson_title, description: lesson_description, unit_id: selected_unit_id},
  				xhrFields: {withCredentials: true},
  				url: Application.serverURL+'teacher/lessons/create.json',
  				type: "POST",
  				success: function(data) {					
  					Application.lessonView.backbutton = false;
  					Application.lessonView.lessonId = data.lesson_id;
  					$('#theSpinner').hide();
  					Application.router.navigate("#lesson", {trigger: true});
  				},
  				error: function(textStatus, errorThrown) {
  					$('#theSpinner').hide();
  					navigator.notification.alert(
  						'Unable to publish lesson, please try again',  // message
  						function alertDismissed() {}, // callback
  						'Error',            // title
  						'OK'                  // buttonName
  					);
  					console.log(JSON.stringify(errorThrown));
  				}
  			});
  		}
  		else{
  			$('#theSpinner').hide();
  			navigator.notification.alert(
  				'Please enter title, description, and image',  // message
  				function alertDismissed() {}, // callback
  				'Try Again',            // title
  				'OK'                  // buttonName
  			);
  		}	
  	}

  });
  
});
window.require.register("views/formNewLink_view", function(exports, require, module) {
  var View = require('./view');
  var template = require('./templates/formNewLink');
  var List = require('../models/unit_list');
  var Bookmark = require('../models/teacher_bookmarks');
  var skip = 0;
  var max = 20;

  module.exports = View.extend({
  	id: 'formNewElement-view',
  	template: template,
  	events: {
  		"dataLoaded":"append",
  		'click #submit':'submitForm',
  		'click #link_launch':'browse',
  		'change #unitSelect':'populateLessons',
  		'change #bookmarkSelect':'uploadBookmark',
  		'click .help':'helpMe'
  		
  	},

  	render: function() {	
  		this.unitList = new List();
  		this.unitList.listJSON = {};
  		this.bookmarkList = new Bookmark();
  		this.bookmarkList.listJSON = {};
  		this.session_id = window.localStorage.getItem("session_id");
  		this.newLocation = "http://www.google.com";
  		

  		this.allTheJSON = {};
  		this.$el.html(this.template(this.allTheJSON));

  		this.unitList.fetch({
  			data:{session_id: this.session_id, skip:skip, max:max, group_id:"ALL"},
  			processData:true,
  			add:true,
  			xhrFields: {withCredentials: true},
  			success:function(data){

  				Application.formNewLinkView.bookmarkList.fetch({
  					data: {session_id: Application.formNewLinkView.session_id},
  					xhrFields: {withCredentials: true},
  					processData:true,
  					update: true,
  					success:function(data){
  						Application.formNewLinkView.$el.trigger("dataLoaded");
  					},
  					failure:function(){
  						Application.formNewLinkView.$el.trigger("dataLoaded");
  					}
  				});
  			},
  			error: function (jqXHR, textStatus, errorThrown) {
  				var error_message = (textStatus.responseText);
  				
  				if (error_message == "no_session")
  				{
  					Application.router.navigate("/", {
  						trigger: true
  					});
  				}
  			}
  		});

  		//	this.subview.setElement(this.$('.subview')).render();
  		//	this.anotherSubview.setElement(this.$('.another-subview')).render();

  		return this;
  	},

  	append: function(){	
  		this.unitList.listJSON = this.unitList.handle();
  		this.bookmarkList.listJSON = this.bookmarkList.handle();
  		this.allTheJSON = {"bookmarks":this.bookmarkList.listJSON, "units":this.unitList.listJSON };
  		this.$el.html(this.template(this.allTheJSON));
  		setTimeout(function(){
  			$('#element-view-cover').fadeOut();
  		},100);
  	},
  	
  	uploadBookmark: function() {
  		this.newLocation = $('#bookmarkSelect').val();
  		$('.bookmark-select').css('background-image', 'url()');
  		$('#link_custom').val('');
  		$('#link_custom').val(this.newLocation);
  		$('#picker').removeClass('background-image');
  		$('#picker').css('background-image', 'url(https://s3.amazonaws.com/knowitall/create_link.png)');
  	},

  	browse: function() {

  		cb = window.plugins.childBrowser;
  		if(cb!=null){
  			cb.onLocationChange = function(loc){
  				if (loc != "about:blank")
  				{
  					Application.formNewLinkView.newLocation = loc;
  					$('#link_custom').val('');
  					$('#link_custom').val(loc);
  					$('#picker').removeClass('background-image');
  					$('#picker').css('background-image', 'url(https://s3.amazonaws.com/knowitall/create_link.png)');

  				}
  			};
  			
  			cb.onOpenExternal = function(loc){
  				if (loc != "about:blank")
  				{
  					var bookmark_url = loc;
  					if (bookmark_url == null || bookmark_url == "")
  					{
  						
  					}
  					else{
  					var session_id = window.localStorage.getItem("session_id");
  					$.ajax({
  						data: {session_id: session_id, bookmark_url: bookmark_url},
  						url: Application.serverURL+"teacher/bookmarks/create.json",
  						type: "POST",
  						xhrFields: {withCredentials: true},
  						dataType:"json",
  						success: function(data) {
  							navigator.notification.alert(
  								'The element has been added to bookmarks',  // message
  								function alertDismissed() {}, // callback
  								'Bookmarks',            // title
  								'OK'                  // buttonName
  							);			
  						},
  						error: function(textStatus, errorThrown) {
  								navigator.notification.alert(
  									'Unable to add bookmarks, please try again',  // message
  									function alertDismissed() {}, // callback
  									'Bookmarks',            // title
  									'OK'                  // buttonName
  								);
  							console.log(JSON.stringify(errorThrown));
  						}
  					});
  				}
  				}
  			};
  			
  			var enteredurl = $('#link_custom').val();
  			var lengthstring = enteredurl.length;
  			if (lengthstring == 0){
  				cb.showWebPage("http://www.google.com");
  			}
  			else if(enteredurl.indexOf("http") == -1 && enteredurl.indexOf("Http") == -1){
  				cb.showWebPage("http://"+enteredurl);
  			}
  			else{
  				cb.showWebPage(enteredurl);
  			}
  		}
  	},

  	populateLessons: function()
  	{

  		var unitId = $('#unitSelect').val(); //get unit id from select when triggered from change event
  		
  		//ajax request to get lessons with unit id
  		$.ajax({
  			data: {session_id: this.session_id, unit_id:unitId},
  			xhrFields: {withCredentials: true},
  			url: Application.serverURL+'teacher/units.json',
  			type: 'GET',
  			success: function(data) {
  				$('#lessonField').removeClass('disabled-select').addClass('active-select'); // add active style
  				$('#lessonSelect').empty(); //empty all options from select
  				for(index in data.lesson_list) // for each lesson return append a option
  				{
  					$('#lessonSelect').append('<option value="'+data.lesson_list[index].lesson_id+'">'+data.lesson_list[index].lesson_name+'</option>');
  				}

  			},
  			error: function(){
  				navigator.notification.alert(
  					'Unable to load lessons',  // message
  					function alertDismissed() {}, // callback
  					'Error',            // title
  					'OK'                  // buttonName
  				);
  				console.log('populateLessons error');
  			}

  		});


  	},


  	submitForm: function() {
  		$('#theSpinner').show();
  		var link_title = $('#link_title').val();
  		var link_notes = $('#link_notes').val();
  		var selected_unit_id = $('.active_option').data('id');
  		var unit_id = $('#unitSelect').val();
  		var lesson_id = $('#lessonSelect').val();
  		var newLocation = this.newLocation;
  		if (link_title && link_notes && newLocation) {
  			var session_id = window.localStorage.getItem("session_id");
  			$.ajax({			
  				data: {session_id: session_id, title: link_title, notes: link_notes, link_url:newLocation, unit_id:unit_id, lesson_id:lesson_id},
  				xhrFields: {withCredentials: true},
  				url: Application.serverURL+'teacher/elements/link.json',
  				type: "POST",
  				dataType:"json",
  				success: function(data) {
  					Application.lessonView.backbutton = false;
  					Application.lessonView.lessonId = lesson_id;
  					$('#theSpinner').hide();
  					Application.router.navigate("#lesson", {trigger: true});
  				},
  				error: function(textStatus, errorThrown) {
  					$('#theSpinner').hide();
  					navigator.notification.alert(
  						'Unable to create link, please try again',  // message
  						function alertDismissed() {}, // callback
  						'Error',            // title
  						'OK'                  // buttonName
  					);
  					console.log(JSON.stringify(errorThrown));
  				}
  			});		
  		}
  		else{
  			$('#theSpinner').hide();
  			navigator.notification.alert(
  				'Please enter title, description, and link',  // message
  				function alertDismissed() {}, // callback
  				'Error',            // title
  				'OK'                  // buttonName
  			);
  		}
  	},
  	
  	helpMe: function() {
  		$("body").chardinJs('toggle');
  	}

  });
  
});
window.require.register("views/formNewPdf_view", function(exports, require, module) {
  var View = require('./view');
  var template = require('./templates/formNewPdf');
  var List = require('../models/unit_list');
  var skip = 0;
  var max = 20;
  var pdf_url = {};

  module.exports = View.extend({
  	id: 'formNewPdf-view',
  	template: template,
  	events: {
  		"dataLoaded":"append",
  		'click #submit':'submitForm',
  		'click #upload':'pick',
  		'change #unitSelect':'populateLessons'
  	},

  	initialize: function() {  

  	},

  	render: function() {	
  		this.unitList = new List();
  		this.unitList.listJSON = {};
  		this.$el.html(this.template(this.unitList.listJSON));
  		this.session_id = window.localStorage.getItem("session_id");

  		this.unitList.fetch({
  			data:{session_id:this.session_id, skip:skip, max:max, group_id:"ALL"},
  			processData:true,
  			add:true,
  			xhrFields: {withCredentials: true},
  			success:function(data){
  				Application.formNewPdfView.$el.trigger("dataLoaded");
  			},
  			error: function (jqXHR, textStatus, errorThrown) {
  				var error_message = (textStatus.responseText);
  				
  				if (error_message == "no_session")
  				{
  					Application.router.navigate("/", {
  						trigger: true
  					});
  				}
  			}
  		});

  		//	this.subview.setElement(this.$('.subview')).render();
  		//	this.anotherSubview.setElement(this.$('.another-subview')).render();

  		return this;
  	},

  	append: function(){		
  		this.unitList.listJSON = this.unitList.handle();
  		this.$el.html(this.template(this.unitList.listJSON));
  	},

  	pick: function() {
  		if (!window.plugins.filepicker) {
  			return;
  		}
  		var uploadSuccess = function(args) {
  			if (args.result == 'didFinishPickingMediaWithInfo') {
  				pdf_url = args.FPPickerControllerRemoteURL;
  				$('#picker').removeClass('background-image').css('background-image', 'url(https://s3.amazonaws.com/knowitall/create_pdf.png)');
  				$('#upload').empty().append("Change");
  			}
  		};

  		var uploadError = function(args) {
  			console.log('Error during Filepicker upload');
  		};

  		window.plugins.filepicker.pick(
  			{
  				dataTypes: ['*/*'], // TODO: find out what data type should be for PDF files
  				sourceNames: ['FPSourceDropbox', 'FPSourceGoogleDrive', 'FPSourceGmail']
  			},
  			uploadSuccess,
  			uploadError
  		);
  	},


  	populateLessons: function()
  	{

  		var unitId = $('#unitSelect').val(); //get unit id from select when triggered from change event
  		//ajax request to get lessons with unit id
  		$.ajax({
  			data: {session_id: this.session_id, unit_id:unitId},
  			xhrFields: {withCredentials: true},
  			url: Application.serverURL+'teacher/units.json',
  			type: 'GET',
  			success: function(data) {
  				$('#lessonField').removeClass('disabled-select').addClass('active-select'); // add active style
  				$('#lessonSelect').empty(); //empty all options from select
  				for(index in data.lesson_list) // for each lesson return append a option
  				{
  					$('#lessonSelect').append('<option value="'+data.lesson_list[index].lesson_id+'">'+data.lesson_list[index].lesson_name+'</option>');
  				}

  			},
  			error: function(){
  				navigator.notification.alert(
  					'Please try again',  // message
  					function alertDismissed() {}, // callback
  					'Error',            // title
  					'OK'                  // buttonName
  				);
  			}


  		});


  	},

  	submitForm: function() {
  		$('#theSpinner').show();
  		var pdf_title = $('#pdf_title').val();
  		var pdf_notes = $('#pdf_notes').val();
  		var selected_unit_id = $('.active_option').data('id');
  		var unit_id = $('#unitSelect').val();
  		var lesson_id = $('#lessonSelect').val();
  		var session_id = window.localStorage.getItem("session_id");
  		
  		if (pdf_title && pdf_notes && pdf_url) {
  			$.ajax({			
  				data: {session_id: session_id, title: pdf_title, notes: pdf_notes, pdf_url:pdf_url, unit_id:unit_id, lesson_id:lesson_id},
  				xhrFields: {withCredentials: true},
  				url: Application.serverURL+'teacher/elements/pdf_notes.json',
  				type: "POST",
  				dataType:"json",
  				success: function(data) {
  					Application.lessonView.backbutton = false;
  					Application.lessonView.lessonId = lesson_id;
  					pdf_url = {};
  					$('#theSpinner').hide();
  					Application.router.navigate("#lesson", {trigger: true});
  				},
  				error: function(textStatus, errorThrown) {
  					$('#theSpinner').hide();
  					navigator.notification.alert(
  						'Unable to publish, please try again',  // message
  						function alertDismissed() {}, // callback
  						'Error',            // title
  						'OK'                  // buttonName
  					);
  					console.log(JSON.stringify(errorThrown));
  				}
  			});		
  		}
  		else{
  			$('#theSpinner').hide();
  			navigator.notification.alert(
  			    'Please enter title, description, and pdf',  // message
  			    function alertDismissed() {}, // callback
  			    'Try Again',            // title
  			    'OK'                  // buttonName
  			);
  		}

  	}

  });
  
});
window.require.register("views/formNewPhoto_view", function(exports, require, module) {
  var View = require('./view');
  var template = require('./templates/formNewPhoto');
  var List = require('../models/unit_list');
  var skip = 0;
  var max = 20;
  var photo_url = {};

  module.exports = View.extend({
  	id: 'formNewPhoto-view',
  	template: template,
  	events: {
  		"dataLoaded":"append",
  		'click #submit':'submitForm',
  		'click #upload':'pick',
  		'change #unitSelect':'populateLessons'
  	},

  	render: function() {	
  		this.unitList = new List();
  		this.unitList.listJSON = {};
  		this.$el.html(this.template(this.unitList.listJSON));
  		this.session_id = window.localStorage.getItem("session_id");
  		this.photo_url = {};
  		

  		this.unitList.fetch({
  			data:{session_id: this.session_id, skip:skip, max:max, group_id:"ALL"},
  			processData:true,
  			add:true,
  			xhrFields: {withCredentials: true},
  			success:function(data){
  				Application.formNewPhotoView.$el.trigger("dataLoaded");
  			},
  			error: function (jqXHR, textStatus, errorThrown) {
  				var error_message = (textStatus.responseText);
  				
  				if (error_message == "no_session")
  				{
  					Application.router.navigate("/", {
  						trigger: true
  					});
  				}
  			}
  		});
  		
  		return this;
  	},

  	append: function(){		
  		this.unitList.listJSON = this.unitList.handle();
  		this.$el.html(this.template(this.unitList.listJSON));
  	},

  	enableScroll: function() {
  		scrollUnits2 = new iScroll('scrollUnits2', {useTransition:true,hScroll:false});
  	},

  	pick: function() {
  		if (!window.plugins.filepicker) {
  			return;
  		}
  		
  		var uploadSuccess = function(args) {
  			if (args.result == 'didFinishPickingMediaWithInfo') {
  				Application.formNewPhotoView.photo_url = args.FPPickerControllerRemoteURL;
  				thumbnail_url = Application.formNewPhotoView.photo_url + '/convert?w=150&h=150';
  				$('#picker').removeClass('background-image');
  				$('#picker').css('background-image', 'url(' + thumbnail_url + ')');
  			}
  		};

  		var uploadError = function(args) {
  			console.log('Error during Filepicker upload');
  		};

  		window.plugins.filepicker.pick(
  			{
  				dataTypes: ['image/*'],
  				sourceNames: ['FPSourceCamera', 'FPSourceCameraRoll', 'FPSourceDropbox', 'FPSourceGoogleDrive', 'FPSourceGmail', 'FPSourceFacebook', 'FPSourceInstagram', 'FPSourceImagesearch']
  			},
  			uploadSuccess,
  			uploadError
  		);
  	},

  	populateLessons: function()
  	{

  		var unitId = $('#unitSelect').val(); //get unit id from select when triggered from change event
  		//ajax request to get lessons with unit id
  		$.ajax({
  			data: {session_id:this.session_id, unit_id:unitId},
  			xhrFields: {withCredentials: true},
  			url: Application.serverURL+'teacher/units.json',
  			type: 'GET',
  			success: function(data) {
  				$('#lessonField').removeClass('disabled-select').addClass('active-select'); // add active style
  				$('#lessonSelect').empty(); //empty all options from select
  				for(index in data.lesson_list) // for each lesson return append a option
  				{
  					$('#lessonSelect').append('<option value="'+data.lesson_list[index].lesson_id+'">'+data.lesson_list[index].lesson_name+'</option>');
  				}

  			},
  			error: function(){
  				navigator.notification.alert(
  					'Please try again',  // message
  					function alertDismissed() {}, // callback
  					'Error',            // title
  					'OK'                  // buttonName
  				);
  				console.log('populateLessons error');
  			}


  		});


  	},

  	submitForm: function() {
  		$('#theSpinner').show();
  		var photo_title = $('#photo_title').val();
  		var photo_notes = $('#photo_notes').val();
  		var selected_unit_id = $('.active_option').data('id');
  		var unit_id = $('#unitSelect').val();
  		var lesson_id = $('#lessonSelect').val();
  		var session_id = window.localStorage.getItem("session_id");
  		var photo_url = Application.formNewPhotoView.photo_url;

  		if (photo_title && photo_notes && photo_url) {
  			$.ajax({			
  				data: {session_id: session_id, title: photo_title, notes: photo_notes, photo_url:photo_url, unit_id:unit_id, lesson_id:lesson_id},
  				xhrFields: {withCredentials: true},
  				url: Application.serverURL+'teacher/elements/photo.json',
  				type: "POST",
  				dataType:"json",
  				success: function(data) {
  					Application.lessonView.backbutton = false;
  					Application.lessonView.lessonId = lesson_id;
  					photo_url = {};
  					$('#theSpinner').hide();
  					Application.router.navigate("#lesson", {trigger: true});
  				},
  				error: function(textStatus, errorThrown) {
  					$('#theSpinner').hide();
  					navigator.notification.alert(
  						'Unable to publish, please try again',  // message
  						function alertDismissed() {}, // callback
  						'Error',            // title
  						'OK'                  // buttonName
  					);
  					console.log(JSON.stringify(errorThrown));
  				}
  			});	
  		}
  		else{
  			$('#theSpinner').hide();
  			navigator.notification.alert(
  				'Please enter title, description, and select photo',  // message
  				function alertDismissed() {}, // callback
  				'Error',            // title
  				'OK'                  // buttonName
  			);
  		}
  	}

  });
  
});
window.require.register("views/formNewSocrative_view", function(exports, require, module) {
  var View = require('./view');
  var template = require('./templates/formNewSocrative');
  var List = require('../models/unit_list');
  var skip = 0;
  var max = 20;

  module.exports = View.extend({
  	id: 'formNewSocrative-view',
  	template: template,
  	events: {
  		"dataLoaded":"append",
  		'click #submit':'submitForm',
  		'change #unitSelect':'populateLessons'
  	},

  	initialize: function() {  

  	},

  	render: function() {	
  		this.unitList = new List();
  		this.unitList.listJSON = {};
  		this.$el.html(this.template(this.unitList.listJSON));
  		this.session_id = window.localStorage.getItem("session_id");

  		this.unitList.fetch({
  			data:{session_id: this.session_id, skip:skip, max:max, group_id:"ALL"},
  			xhrFields: {withCredentials: true},
  			processData:true,
  			add:true,
  			success:function(data){
  				Application.formNewSocrativeView.$el.trigger("dataLoaded");
  			},
  			error: function (jqXHR, textStatus, errorThrown) {
  				var error_message = (textStatus.responseText);
  				
  				if (error_message == "no_session")
  				{
  					Application.router.navigate("/", {
  						trigger: true
  					});
  				}
  			}
  		});

  		return this;
  	},

  	append: function(){		
  		this.unitList.listJSON = this.unitList.handle();
  		this.$el.html(this.template(this.unitList.listJSON));
  		setTimeout(function(){
  			$('#element-view-cover').fadeOut();
  		},100);
  	},

  	populateLessons: function()
  	{

  		var unitId = $('#unitSelect').val(); //get unit id from select when triggered from change event

  		$.ajax({
  			data: {session_id:this.session_id, unit_id:unitId},
  			xhrFields: {withCredentials: true},
  			url: Application.serverURL+'teacher/units.json',
  			type: 'GET',
  			success: function(data) {
  				$('#lessonField').removeClass('disabled-select').addClass('active-select'); // add active style
  				$('#lessonSelect').empty(); //empty all options from select
  				for(index in data.lesson_list) // for each lesson return append a option
  				{
  					$('#lessonSelect').append('<option value="'+data.lesson_list[index].lesson_id+'">'+data.lesson_list[index].lesson_name+'</option>');
  				}

  			},
  			error: function(){
  				$('#theSpinner').hide();
  				navigator.notification.alert(
  					'Please try again',  // message
  					function alertDismissed() {}, // callback
  					'Error',            // title
  					'OK'                  // buttonName
  				);
  				console.log('populateLessons error');
  			}


  		});


  	},

  	submitForm: function() {
  		$('#theSpinner').show();
  		var socrative_title = $('#socrative_title').val();
  		var socrative_notes = $('#socrative_notes').val();
  		var selected_unit_id = $('.active_option').data('id');
  		var unit_id = $('#unitSelect').val();
  		var lesson_id = $('#lessonSelect').val();
  		var session_id = window.localStorage.getItem("session_id");
  		
  		if (socrative_title && socrative_notes) {

  		$.ajax({			
  			data: {session_id:session_id, title: socrative_title, notes: socrative_notes, unit_id:unit_id, lesson_id:lesson_id},
  			xhrFields: {withCredentials: true},
  			url: Application.serverURL+'teacher/elements/socrative.json',
  			type: "POST",
  			dataType:"json",
  			success: function(data) {
  				Application.lessonView.backbutton = false;
  				Application.lessonView.lessonId = lesson_id;
  				$('#theSpinner').hide();
  				Application.router.navigate("#lesson", {trigger: true});
  			},
  			error: function(textStatus, errorThrown) {
  				$('#theSpinner').hide();
  				navigator.notification.alert(
  					'Please try again',  // message
  					function alertDismissed() {}, // callback
  					'Error',            // title
  					'OK'                  // buttonName
  				);
  				console.log(JSON.stringify(errorThrown));
  			}
  		});	
  		}
  		else{
  			$('#theSpinner').hide();
  			navigator.notification.alert(
  				'Please enter a titl and description',  // message
  				function alertDismissed() {}, // callback
  				'Try Again',            // title
  				'OK'                  // buttonName
  			);
  		}	
  	}

  });
  
});
window.require.register("views/formNewTest_view", function(exports, require, module) {
  var View = require('./view');
  var template = require('./templates/formNewUnit');

  module.exports = View.extend({
  	id: 'formNewUnit-view',
  	template: template,
  	events: {
  		'click .overlay_close':'closeForm',
  		'click .overlay_submit':'submitForm'
  	},

  	closeForm: function() {
  		Application.router.navigate("#subject", {trigger: true});
  	},

  	submitForm: function() {
  		var unit_title = $('#unit_title').val();
  		var unit_description = $('#unit_description').val();
  		if (unit_title && unit_description)
  		{
  			var user_name = window.localStorage.getItem("user_name");
  			$.ajax({			
  				data: {title: unit_title, description: unit_description},
  				xhrFields: {withCredentials: true},
  				url: Application.serverURL+'teacher/units/create.json',
  				type: "POST",
  				dataType:"json",
  				success: function(data) {
  					//send new unit id to unitView
  					//Application.unitView.unitId = the new unit's id
  					Application.unitView.unitId = data.unit_id;
  					Application.router.navigate("#unit", {trigger: true});
  				},
  				error: function(textStatus, errorThrown) {
  					$('#theSpinner').hide();
  					navigator.notification.alert(
  						'Please enter a title, description, and photo',  // message
  						function alertDismissed() {}, // callback
  						'Error',            // title
  						'OK'                  // buttonName
  					);
  					console.log(JSON.stringify(errorThrown));
  				}
  			});
  		}
  		else{
  		}		
  	}

  });
  
});
window.require.register("views/formNewUnit_view", function(exports, require, module) {
  var View = require('./view');
  var template = require('./templates/formNewUnit');

  module.exports = View.extend({
  	id: 'formNewUnit-view',
  	template: template,
  	events: {
  		'click .overlay_submit':'submitForm',
  		'click #upload':'uploadPhoto'
  	},
  	render: function() {
  		this.allTheJSON = {};
  		this.$el.html(this.template(this.allTheJSON));
  		this.photo_url = {};
  		this.photo_logic = false
  	},

  	uploadPhoto: function() {
  		if (!window.plugins.filepicker) {
  			return;
  		}
  		
  		var uploadSuccess = function(args) {
  			if (args.result == 'didFinishPickingMediaWithInfo') {
  				Application.formNewUnitView.photo_url = args.FPPickerControllerRemoteURL;
  				thumbnail_url = Application.formNewUnitView.photo_url + '/convert?w=150&h=150';
  				$('#picker').removeClass('background-image');
  				$('#picker').css('background-image', 'url(' + thumbnail_url + ')');
  				Application.formNewUnitView.photo_logic = true;
  			}
  		};

  		var uploadError = function(args) {
  			console.log('Error during Filepicker upload');
  		};

  		window.plugins.filepicker.pick(
  			{
  				dataTypes: ['image/*'],
  				sourceNames: ['FPSourceCamera', 'FPSourceCameraRoll', 'FPSourceDropbox', 'FPSourceGoogleDrive', 'FPSourceGmail', 'FPSourceFacebook', 'FPSourceInstagram', 'FPSourceImagesearch']
  			},
  			uploadSuccess,
  			uploadError
  		);
  	},

  	submitForm: function() {
  		$('#theSpinner').show();
  		var unit_title = $('#unit_title').val();
  		var unit_description = $('#unit_description').val();
  		var session_id = window.localStorage.getItem("session_id");
  		
  		if (unit_title && unit_description && this.photo_logic==true)
  		{
  			$.ajax({			
  				data: {session_id: session_id, image_url:this.photo_url, title: unit_title, description: unit_description},
  				xhrFields: {withCredentials: true},
  				url: Application.serverURL+'teacher/units/create.json',
  				type: "POST",
  				dataType:"json",
  				success: function(data) {
  					Application.unitView.backbutton = false;
  					Application.unitView.unitId = data.unit_id;
  					photo_url = {};
  					photo_logic = false;
  					$('#theSpinner').hide();
  					Application.router.navigate("#unit", {trigger: true});
  				},
  				error: function(textStatus, errorThrown) {
  					$('#theSpinner').hide();
  					navigator.notification.alert(
  						'Unable to publish unit, please try again',  // message
  						function alertDismissed() {}, // callback
  						'Error',            // title
  						'OK'                  // buttonName
  					);
  					console.log(JSON.stringify(errorThrown));
  				}
  			});	
  		}
  		else{
  			$('#theSpinner').hide();
  			navigator.notification.alert(
  				'Please enter a title, description, and photo',  // message
  				function alertDismissed() {}, // callback
  				'Error',            // title
  				'OK'                  // buttonName
  			);
  		}	
  	}

  });
  
});
window.require.register("views/formNewVideo_view", function(exports, require, module) {
  var View = require('./view');
  var template = require('./templates/formNewVideo');
  var List = require('../models/unit_list');
  var skip = 0;
  var max = 20;

  module.exports = View.extend({
  	id: 'formNewVideo-view',
  	template: template,
  	events: {
  		"dataLoaded":"append",
  		'click #submit':'submitForm',
  		'click #upload':'browse',
  		'change #unitSelect':'populateLessons',
  		'click .help':'helpMe'
  	},

  	render: function() {	
  		this.unitList = new List();
  		this.unitList.listJSON = {};
  		this.$el.html(this.template(this.unitList.listJSON));
  		this.session_id = window.localStorage.getItem("session_id");
  		this.newLocation = "http://www.google.com";
  		

  		this.unitList.fetch({
  			data:{session_id: this.session_id, skip:skip, max:max, group_id:"ALL"},
  			processData:true,
  			add:true,
  			xhrFields: {withCredentials: true},
  			success:function(data){
  				Application.formNewVideoView.$el.trigger("dataLoaded");
  			},
  			error: function (jqXHR, textStatus, errorThrown) {
  				var error_message = (textStatus.responseText);
  				
  				if (error_message == "no_session")
  				{
  					Application.router.navigate("/", {
  						trigger: true
  					});
  				}
  			}
  		});

  		//	this.subview.setElement(this.$('.subview')).render();
  		//	this.anotherSubview.setElement(this.$('.another-subview')).render();

  		return this;
  	},

  	append: function(){	
  		this.unitList.listJSON = this.unitList.handle();
  		this.$el.html(this.template(this.unitList.listJSON));
  	},

  	browse: function() {
  		cb = window.plugins.childBrowser;
  		if(cb!=null){
  			cb.onLocationChange = function(loc){
  				if (loc != "about:blank")
  				{
  					Application.formNewVideoView.newLocation = loc;
  					$('#vid_url').empty();
  					$('#vid_url').append(loc);
  					$('#picker').removeClass('background-image');
  					$('#picker').css('background-image', 'url(https://s3.amazonaws.com/knowitall/create_movie.png)');
  				}
  			};
  			cb.showWebPage("http://m.youtube.com/home", { showLocationBar: true });
  		}
  	},

  	populateLessons: function()
  	{

  		var unit_id = $('#unitSelect').val(); //get unit id from select when triggered from change event

  		$.ajax({
  			data: {session_id:this.session_id, unit_id:unit_id},
  			xhrFields: {withCredentials: true},
  			url: Application.serverURL+'teacher/units.json',
  			type: 'GET',
  			success: function(data) {
  				$('#lessonField').removeClass('disabled-select').addClass('active-select'); // add active style
  				$('#lessonSelect').empty(); //empty all options from select
  				for(index in data.lesson_list) // for each lesson return append a option
  				{
  					$('#lessonSelect').append('<option value="'+data.lesson_list[index].lesson_id+'">'+data.lesson_list[index].lesson_name+'</option>');
  				}

  			},
  			error: function(){
  				$('#theSpinner').hide();
  				navigator.notification.alert(
  					'Please try again',  // message
  					function alertDismissed() {}, // callback
  					'Error',            // title
  					'OK'                  // buttonName
  				);
  				console.log('populateLessons error');
  			}

  		});

  	},

  	submitForm: function() {
  		$('#theSpinner').show();
  		var video_title = $('#video_title').val();
  		var video_notes = $('#video_notes').val();
  		var selected_unit_id = $('.active_option').data('id');
  		var unit_id = $('#unitSelect').val();
  		var lesson_id = $('#lessonSelect').val();
  		var session_id = window.localStorage.getItem("session_id");
  		var newLocation = this.newLocation;
  		
  		if (video_title && video_notes && newLocation) {
  			$.ajax({			
  				data: {session_id:session_id, title: video_title, notes: video_notes, video_url:newLocation, unit_id:unit_id, lesson_id:lesson_id},
  				xhrFields: {withCredentials: true},
  				url: Application.serverURL+'teacher/elements/videolink.json',
  				type: "POST",
  				dataType:"json",
  				success: function(data) {
  					Application.lessonView.backbutton = false;
  					Application.lessonView.lessonId = lesson_id;
  					$('#theSpinner').hide();
  					Application.router.navigate("#lesson", {trigger: true});
  				},
  				error: function(textStatus, errorThrown) {
  					$('#theSpinner').hide();
  					navigator.notification.alert(
  						'Please try again',  // message
  						function alertDismissed() {}, // callback
  						'Error',            // title
  						'OK'                  // buttonName
  					);
  					console.log(JSON.stringify(errorThrown));
  				}
  			});	
  		}
  		else{
  			$('#theSpinner').hide();
  			navigator.notification.alert(
  				'Please enter a title, description, and select a video',  // message
  				function alertDismissed() {}, // callback
  				'Error',            // title
  				'OK'                  // buttonName
  			);
  		}	
  	},
  	
  	helpMe: function() {
  		$("body").chardinJs('toggle');
  	}

  });
});
window.require.register("views/formNewWorksheet_view", function(exports, require, module) {
  var View = require('./view');
  var template = require('./templates/formNewLesson');
  var List = require('../models/unit_list');
  var skip = 0;
  var max = 20;

  module.exports = View.extend({
  	id: 'formNewLesson-view',
  	template: template,
  	events: {
  		"dataLoaded":"append",
  		'click .overlay_close':'closeForm',
  		'click .overlay_submit':'submitForm',
  		'click #opens_options':'showOptions',
  		'click .unit_option':'chooseOption'
  	},
  	
  	initialize: function() {  

  	},

  	render: function() {	
  		this.unitList = new List();
  		this.unitList.listJSON = {};
  		this.$el.html(this.template(this.unitList.listJSON));

  		this.unitList.fetch({
  			data:{skip:skip, max:max, group_id:"ALL"},
  			processData:true,
  			xhrFields: {withCredentials: true},
  			add:true,
  			success:function(data){
  				Application.formNewLessonView.$el.trigger("dataLoaded");
  			},
  			error: function (jqXHR, textStatus, errorThrown) {
  				var error_message = (textStatus.responseText);
  				
  				if (error_message == "no_session")
  				{
  					Application.router.navigate("/", {
  						trigger: true
  					});
  				}
  			}
  		});
  		
  		return this;
  	},
  	
  	append: function(){		
  		this.unitList.listJSON = this.unitList.handle();
  		this.$el.html(this.template(this.unitList.listJSON));
  	},
  	
  	enableScroll: function() {
  		scrollUnits2 = new iScroll('scrollUnits2', {useTransition:true,hScroll:false});
  	},

  	showOptions: function() {
  		$('.overlay_right2').show();
  		this.enableScroll();
  	},

  	chooseOption: function(e) {
  		$('.unit_option').removeClass('active_option');
  		$(e.currentTarget).addClass('active_option');
  		$('.overlay_submit').show();
  	},

  	closeForm: function() {
  		Application.router.navigate("#unit", {trigger: true});
  	},

  	submitForm: function() {
  		var lesson_title = $('#lesson_title').val();
  		var lesson_description = $('#lesson_description').val();
  		var selected_unit_id = $('.active_option').data('id');
  		
  		var user_name = window.localStorage.getItem("user_name");
  		$.ajax({			
  			data: {title: lesson_title, description: lesson_description, unit_id: selected_unit_id},
  			url: Application.serverURL+'teacher/lessons/create.json',
  			type: "POST",
  			success: function(data) {
  				//send new lesson id to lessonView				
  				Application.lessonView.lessonId = data.lesson_id;
  				Application.router.navigate("#lesson", {trigger: true});
  			},
  			error: function(textStatus, errorThrown) {
  				alert("Unable to publish lesson, please try to publish again");
  				console.log(JSON.stringify(errorThrown));
  			}
  		});		
  	}

  });
  
});
window.require.register("views/group_view", function(exports, require, module) {
  var View = require('./view');
  var template = require('./templates/group');
  var GroupView = require('../models/groups');
  var UnitView = require('../models/unit_list');
  var groupToOpen = {};
  var skip = 0;
  var max = 20;

  module.exports = View.extend({
  	id: 'group-view',
  	template: template,
  	scroller: 0,
  	events: {
  		"dataLoaded":"append",
  		'click #student_thumb':'viewStudent',
  		'click .add_button':'addScreen',
  		'click .unit_thumb':'viewUnit',
  		'click #announce':'formAnnouncement',
  		'click .edit-group':'showAddStudent',
  		'click #add-student':'formAddStudenttoGroup',
  		'click #add-new-student':'formAddStudent',
  		'click .done' :'completeAdding',
  		'click #delete' :'deleteGroup',
  		'click #group-subheader-units' : 'showUnits',
  		'click #group-subheader-members' : 'showMembers',
  		'click .help':'helpMe'
  	},

  	render: function() {
  		
  		this.allTheJSON = {};
  		this.$el.html(this.template(this.allTheJSON));
  		this.singleGroup = new GroupView();
  		this.singleGroup.groupJSON = {};
  		var skip = 0;
  		var max = 12;
  		groupToOpen = this.groupId;
  		this.session_id = window.localStorage.getItem("session_id");
  		var session_id = this.session_id;

  		this.singleGroup.fetch({
  			data: {session_id: session_id, group_id:this.groupId, skip:skip, max:max},
  			xhrFields: {withCredentials: true},
  			processData:true,
  			add:true,
  			success:function(){
  				Application.groupView.singleUnit = new UnitView();
  				Application.groupView.singleUnit.unitJSON = {};

  				Application.groupView.singleUnit.fetch({
  					data:{session_id: session_id, skip:skip, max:max, group_id:groupToOpen},
  					xhrFields: {withCredentials: true},
  					processData:true,
  					update: true,
  					success:function(data){
  						
  						Application.groupView.$el.trigger("dataLoaded");
  					},
  					failure:function(){
  						Application.groupView.$el.trigger("dataLoaded");
  					}
  				});
  			},
  			error: function (jqXHR, textStatus, errorThrown) {
  				var error_message = (textStatus.responseText);
  				
  				if (error_message == "no_session")
  				{
  					Application.router.navigate("/", {
  						trigger: true
  					});
  				}
  			}
  		});		

  		return this;
  	}, 

  	append: function(){
  		this.singleGroup.groupJSON = this.singleGroup.handle();
  		this.singleUnit.unitJSON = this.singleUnit.handle();
  		if (this.groupId == 'ALL'){
  			Application.groupView.allTheJSON = { "all":true, "students":Application.groupView.singleGroup.groupJSON, "units":Application.groupView.singleUnit.unitJSON };
  		}
  		else{
  		Application.groupView.allTheJSON = { "all":false, "students":Application.groupView.singleGroup.groupJSON, "units":Application.groupView.singleUnit.unitJSON };
  		}
  		this.$el.html(this.template(this.allTheJSON));
  		this.enableScroll();

  		if (this.backbutton == false)
  		{
  			$('#work-button').addClass('hide');
  			$('#menu_button').removeClass('hide');
  			this.backbutton = true;						
  		}
  	},

  	showUnits: function() {
  		$('#show-groups').fadeOut(200,function(){
  			$('#show-units').fadeIn(200); 
  			$('#empty').fadeIn(200);
  		});
  		
  		setTimeout(function(){ 
  			// Not sure why, but using fadeIn callbacks for refresh wasn't working, so we'll use timeout instead
  			Application.groupView.scroller.refresh();
  		},500); // 200 + 200 + 100extra
  		
  		$('#group-subheader-members').removeClass('active-group-sub');
  		$('#group-subheader-units').addClass('active-group-sub');
  	},

  	showMembers: function() {
  		$('#empty').fadeOut(200,function(){
  			$('#show-groups').fadeIn(200);
  		});
  		
  		$('#show-units').fadeOut(200,function(){
  			$('#show-groups').fadeIn(200);
  		});
  		
  		setTimeout(function(){ 
  			// Not sure why, but using fadeIn callbacks for refresh wasn't working, so we'll use timeout instead
  			Application.groupView.scroller.refresh();
  		},500); // 200 + 200 + 100extra
  		
  		$('#group-subheader-units').removeClass('active-group-sub');
  		$('#group-subheader-members').addClass('active-group-sub');
  	},

  	showAddStudent: function() {
  		$('#add-new-student').fadeOut();
  		$('#add-student').delay(500).fadeIn();
  		
  		if (this.groupId != 'ALL'){
  			$('.trash').fadeIn();
  		}
  		
  		$('.edit-group').empty().addClass("done").append("Done");	
  	},

  	completeAdding: function() {
  		$('#add-student').fadeOut();
  		$('#add-new-student').delay(1000).fadeIn();	
  		$('.trash').fadeOut();
  		$('.done').empty().removeClass("done").append("Edit Groups");		
  	},

  	enableScroll: function() {
  		var thumb_width = $('#group_page .student_thumb').width();
  		$('#group_page .student_thumb').css('height',thumb_width);
  		var sectionHeight = $('#group-view .section').height();
  		$('#scrollStudents').css('top',sectionHeight+'px');
  		this.scroller = new iScroll('scrollStudents', {useTransition:true,hScroll:false});

  	},

  	viewStudent: function(e) {	
  		e.preventDefault();
  		Application.studentView.studentId = $(e.currentTarget).data('id');
  		Application.router.navigate("#student", {trigger: true});
  	},
  	
  	viewUnit: function(e) {
  		e.preventDefault();
  		Application.unitView.unitId = $(e.currentTarget).data('id');
  		Application.router.navigate("#unit", {trigger: true});
  	},
  	
  	formAnnouncement: function() {
  		Application.formAnnouncementView.groupId = groupToOpen;
  		Application.router.navigate("#formAnnouncement", {trigger: true});
  	},

  	deleteGroup: function() {

  		navigator.notification.confirm(
  			'Are you sure you want to delete this group?',  // message
  			function(buttonIndex){
  				if (buttonIndex == 2)
  				{
  					var session_id = window.localStorage.getItem("session_id");
  					$.ajax({
  						data: {session_id:session_id, group_id: groupToOpen},
  						url: Application.serverURL+"teacher/groups/delete.json",
  						type: "POST",
  						xhrFields: {withCredentials: true},
  						success: function(data) {
  							Application.router.navigate("#subject", {trigger: true});
  						},
  						error: function(textStatus, errorThrown) {
  							navigator.notification.alert(
  								'Unable to delete group, please try again',  // message
  								function alertDismissed() {}, // callback
  								'Error',            // title
  								'OK'                  // buttonName
  							);
  							console.log(JSON.stringify(errorThrown));
  						}
  					});
  				}
  			},         // callback
  			'Delete',            // title
  			'Cancel, OK'                  // buttonName
  		);
  	},

  	addScreen: function() {
  		Application.router.navigate("#formNewElement", {trigger: true});
  	},

  	formAddStudenttoGroup: function() {
  		Application.formAddStudentView.groupId = groupToOpen;
  		Application.router.navigate("#formAddStudent", {trigger: true});
  	},
  	
  	formAddStudent: function() {
  		Application.router.navigate("#formInputStudent", {trigger: true});
  	},
  	
  	helpMe: function() {
  		$("body").chardinJs('toggle');
  	}

  });
  
});
window.require.register("views/groups_view", function(exports, require, module) {
  var View = require('./view');
  var template = require('./templates/groups');
  var MyGroups = require('../models/teacher_groups');

  module.exports = View.extend({
  	id: 'groups-view',
  	template: template,
  	events: {
  		"dataLoaded":"append",
  		'click .group_thumb':'viewGroup',
  		'click .add_button':'addScreen',
  		'click .new-group' : "newGroup",
  		'click .new-student' : "addStudent"

  	},

  	render: function() {
  		this.teacherGroups = new MyGroups();
  		this.teacherGroups.groupsJSON ={};
  		this.$el.html(this.template(this.teacherGroups.groupsJSON));
  		this.session_id = window.localStorage.getItem("session_id");

  		var max = 10;
  		var skip = 0;

  		this.teacherGroups.fetch({
  			processData:true,
  			add:true,
  			xhrFields: {withCredentials: true},
  			data: {session_id:this.session_id, skip:skip, max:max },
  			success: function(data){
  				Application.groupsView.$el.trigger("dataLoaded");
  			},
  			error: function (jqXHR, textStatus, errorThrown) {
  				var error_message = (textStatus.responseText);
  				
  				if (error_message == "no_session")
  				{
  					Application.router.navigate("/", {
  						trigger: true
  					});
  				}
  			}
  		});
  		
  		return this;
  	},

  	enableScroll: function() {
  		scrollGroups = new iScroll('scrollGroups', {useTransition:true,hScroll:false});
  	},

  	append: function(){
  		this.teacherGroups.groupsJSON = this.teacherGroups.handle();
  		this.$el.html(this.template(this.teacherGroups.groupsJSON));
  		this.enableScroll();
  	},

  	viewGroup: function(e) {   
  		e.preventDefault();
  		Application.groupView.groupId = $(e.currentTarget).data('id');
  		Application.router.navigate("#group", {trigger: true});
  	},

  	addScreen: function() {
  		Application.router.navigate("#formNewElement", {trigger: true});
  	},
  	
  	newGroup: function() {
  		Application.router.navigate("#formNewGroup", {trigger: true});
  	},
  	
  	addStudent: function() {
  		Application.router.navigate("#formInputStudent", {trigger: true});
  	}

  });
  
});
window.require.register("views/home_view", function(exports, require, module) {
  var View = require('./view');
  var templateHome = require('./templates/home');
  var templateHomeAnnouncements = require('./templates/homeAnnouncements')
  var Posts = require('../models/teacher_posts');
  var AnnouncementList = require('../models/teacher_announcements');

  var skip = 0;
  var max = 20;
  var sortby = 'date';

  module.exports = View.extend({
  	id: 'home-view',
  	templateHome: templateHome,
  	templateHomeAnnouncements: templateHomeAnnouncements,
  	events: {
  		'dataLoaded':'append',
  		'click .student_thumb':'viewStudent',
  		'click .announcement-item':'viewAnnouncement',
  		'click #lesson':'viewLesson',
  		'click .add_button':'addScreen',
  		'click .library-item':'viewLibrary',
  		'announcementsLoaded':'loadAnnouncements',
  		'dataLoadedList':'appendList',
  		'click .help':'helpMe'
  	},

  	initialize: function() {
  	},	  

  	render: function() {
  		$('#theSpinner').show();
  		
  		var display_name = window.localStorage.getItem("display_name");
  		var image_url = window.localStorage.getItem("image_url");

  		$(".menu-thumb").css('background-image', 'url('+image_url+')');
  		$(".menu-profile-name").html(display_name);
  			
  		
  		this.recentAnnouncements = new AnnouncementList();
  		this.recentAnnouncements.announcementsJSON = {};
  			
  		this.recentPosts = new Posts();
  		this.recentPosts.postsJSON = {};
  		this.$el.html(this.templateHome(this.recentPosts.postsJSON));
  		
  		this.session_id = window.localStorage.getItem("session_id");

  		this.recentPosts.fetch({
  			data:{skip:skip, max:8, session_id:this.session_id},
  			processData:true,
  			add:true,
  			xhrFields: {withCredentials: true},
  			success:function(data, textStatus, jqXHR){
  				if (jqXHR.fromOfflineSync && !this.offlineNotified) {
  					knowitall_offline.alert();
  					this.offlineNotified = true;
  				}

  				Application.homeView.$el.trigger("dataLoaded");
  			},
  			error: function (jqXHR, textStatus, errorThrown) {
  				$('#theSpinner').hide();
  				$('#home-view-cover').fadeOut();
  				window.localStorage.removeItem("session_id");
  				window.localStorage.removeItem("user_name");
  				
  				
  				var error_message = (textStatus.responseText);
  				
  				if (error_message == "no_session")
  				{
  					Application.router.navigate("/", {
  						trigger: true
  					});
  				}
  			}
  		});

  		return this;
  	},

  	append: function(){
  		this.recentPosts.postsJSON = this.recentPosts.handle();
  		this.$el.html(this.templateHome(this.recentPosts.postsJSON));
  		setTimeout(function(){
  			$('#theSpinner').hide();
  			$('#home-view-cover').fadeOut();
  			},1000);
  		Application.homeView.$el.trigger("announcementsLoaded");
  		},
  	
  	loadAnnouncements: function() {
  		this.recentAnnouncements.fetch({
  			data: {session_id:this.session_id, skip:skip, max:max, sortby:sortby},
  			xhrFields: {withCredentials: true},
  			processData:true,
  			add:true,
  			success:function(data, textStatus, jqXHR){
  				if (jqXHR.fromOfflineSync && !this.offlineNotified) {
  					knowitall_offline.alert();
  					this.offlineNotified = true;
  				}

  				Application.homeView.$el.trigger("dataLoadedList");
  			},
  			error:function(jqXHR, textStatus, errorThrown) {
  			}
  		});	
  	},
  	
  	appendList: function() {
  		
  		this.recentAnnouncements.announcementsJSON = this.recentAnnouncements.handle();		
  		$('#scrollAnnouncements').html(this.templateHomeAnnouncements(this.recentAnnouncements.announcementsJSON));		
  		this.enableScroll();
  		this.enableScrollAnnouncements();
  	},
  	
  	
  		enableScroll: function() {
  			scrollStore = new iScroll('scrollStore', {useTransition: true, vScroll: false, hScroll: true, hScrollbar: false});
  			scrollPosts = new iScroll('scrollPosts', {useTransition: true, vScroll: false, hScroll: true, hScrollbar: false});
  		},
  		
  		enableScrollAnnouncements: function() {
  			scrollHome  = new iScroll('scrollHome',  {useTransition: true, vScroll: true, hScroll: false, vScrollbar: false, hScrollbar: false});
  			scrollAnnouncements = new iScroll('scrollAnnouncements', {useTransition: true, vScroll: false, hScroll: true, hScrollbar: false});
  		},
  		

  		viewStudent: function(e) {
  			e.preventDefault();
  			Application.studentView.studentId = $(e.currentTarget).data('id');
  			Application.router.navigate("#student", {trigger: true});
  		},

  		viewLibrary: function(e){
  			var Liburl = $(e.currentTarget).data('url');
  			e.preventDefault();
  			cb = window.plugins.childBrowser;
  			if(cb!=null){
  				cb.onOpenExternal = function(loc){
  					if (loc != "about:blank")
  					{
  						var bookmark_url = loc;
  						if (bookmark_url == null || bookmark_url == "")
  						{
  							
  						}
  						else{
  						var session_id = window.localStorage.getItem("session_id");
  						$.ajax({
  							data: {session_id: session_id, bookmark_url: bookmark_url},
  							url: Application.serverURL+"teacher/bookmarks/create.json",
  							type: "POST",
  							xhrFields: {withCredentials: true},
  							dataType:"json",
  							success: function(data) {
  								navigator.notification.alert(
  									'The element has been added to bookmarks',  // message
  									function alertDismissed() {}, // callback
  									'Bookmarks',            // title
  									'OK'                  // buttonName
  								);			
  							},
  							error: function(textStatus, errorThrown) {
  									navigator.notification.alert(
  										'Unable to add bookmarks, please try again',  // message
  										function alertDismissed() {}, // callback
  										'Bookmarks',            // title
  										'OK'                  // buttonName
  									);
  								console.log(JSON.stringify(errorThrown));
  							}
  						});
  					}
  					}
  				};
  				cb.showWebPage(Liburl);
  			}
  		},

  		viewLesson: function(e) {
  			e.preventDefault();
  			if (this.lessonButton == true)
  			{
  				Application.lessonView.backbutton = true;			
  			}
  			Application.lessonView.lessonId = $(e.currentTarget).data('id');
  			Application.router.navigate("#lesson", {trigger: true});
  		},
  		
  		viewAnnouncement: function(e) {
  			e.preventDefault();
  			Application.announcementsView.announcement_id = $(e.currentTarget).data('id');
  			Application.router.navigate("#announcements", {trigger: true});
  		},

  		addScreen: function() {
  			Application.router.navigate("#formNewElement", {trigger: true});
  		},
  		
  		helpMe: function() {
  			$("body").chardinJs('toggle');
  		}

  	});
});
window.require.register("views/lesson_view", function(exports, require, module) {
  var View = require('./view');
  var template = require('./templates/lesson');
  var Lesson = require('../models/teacher_lesson');
  var message = ("Are you sure you want to delete this lesson?");
  var lesson_id = 0;

  module.exports = View.extend({
  	id: 'lesson-view',
  	template: template,
  	events: {
  		"dataLoaded":"append",
  		"dataLoadedmore":"appendmore",
  		'click .FILE_VIDEO':'viewVideo',
  		'click .PDF_CONTENT':'viewPdf',
  		'click .PHOTO':'viewPhoto',
  		'click .SOCRATIVE':'viewSocrative',
  		'click .PDF_NOTE':'viewPdf',
  		'click .VIDEO_LINK':'viewVideo',
  		'click .WEBLINK':'viewLink',
  		'click .KIA_ASSIGNMENT':'viewAssignment',
  		'click .item-delete':'deleteElement',
  		'click .add_button':'addElement',
  		'click #group_thumb':'viewGroup',
  		'click #student_thumb':'viewStudent',
  		'click #publishButton' :'publishLesson',
  		'click #delete' : 'deleteLesson',
  		'click #addElement':'addElement',
  		'click .edit-unit' : "modifyPage",
  		'click .done' :'completeAdding',
  		'click .nav-add-group':'formAddGroup',
  		'blur #lessontitle' : 'changeTitle',
  		'blur #lessondescription' : 'changeDescription',
  		'click .help':'helpMe'

  	},

  	initialize: function() {
  	},

  	render: function() {	

  		this.lessonInfo = new Lesson();
  		this.lessonInfo.lessonJSON = {};

  		this.$el.html(this.template(this.lessonInfo.lessonJSON));
  		this.session_id = window.localStorage.getItem("session_id")
  	  	

  		this.lessonInfo.fetch({
  			data:{session_id: this.session_id, lesson_id: this.lessonId},
  			processData:true,
  			xhrFields: {withCredentials: true},
  			add:true,
  			success:function(){
  				Application.lessonView.$el.trigger("dataLoaded");
  			},
  			error: function (jqXHR, textStatus, errorThrown) {
  				var error_message = (textStatus.responseText);
  				
  				if (error_message == "no_session")
  				{
  					Application.router.navigate("/", {
  						trigger: true
  					});
  				}
  			}
  		});

  		lesson_id = this.lessonId;

  		return this;

  	},

  	append: function(){
  		this.lessonInfo.lessonJSON = this.lessonInfo.handle();
  		this.$el.html(this.template(this.lessonInfo.lessonJSON));
  		if (this.backbutton == false)
  		{	
  			$('#work-button').addClass('hide');
  			$('#menu_button').removeClass('hide');
  			Application.unitView.lessonButton = true;
  			Application.homeView.lessonButton = true;		
  		}
  		this.enableScroll();
  	},

  	appendmore: function(){
  		this.lessonInfo.lessonJSON = Application.lessonView.lessonInfo.handle();
  		this.$el.html(this.template(this.lessonInfo.lessonJSON));
  		if (this.backbutton == false)
  		{
  			$('#work-button').addClass('hide');
  			$('#menu_button').removeClass('hide');
  			Application.unitView.lessonButton = true;
  			Application.homeView.lessonButton = true;			
  		}
  		this.enableScroll();
  	},

  	afterRender: function() {
  	},

  	enableScroll: function() {
  		var sectionHeight = $('#lesson-view .section').height() + 1;
  		$('#scrollElements').css('top',sectionHeight+'px');
  		scrollElements = new iScroll('scrollElements', {useTransition:true,hScroll:false});
  		//scrollStudentActivity = new iScroll('scrollStudentActivity', {useTransition:true,hScroll:false});
  		//scrollGroupAccess = new iScroll('scrollGroupAccess', {useTransition:true,hScroll:false});
  	},

  	viewVideo: function(e) {
  		var vidUrl = $(e.currentTarget).data('urls');
  		window.plugins.knowitallbrowser.open(vidUrl);
  		
  	//	window.plugins.childBrowser.showWebPage(vidUrl);
  	},

  	viewSocrative: function(e) {
  		Application.elementOverlaySocrative.socrativeId = $(e.currentTarget).data('id');
  		Application.router.navigate("#elementOverlaySocrative", {trigger: true});
  	},

  	viewAssignment: function(e) {
  			Application.assignmentGroupView.assignmentId = $(e.currentTarget).data('id');
  			Application.router.navigate("#assignmentGroup", {trigger: true});
  	},

  	viewPdf: function(e) {
  		Application.elementOverlayPdf.pdfId = $(e.currentTarget).data('id');
  		Application.router.navigate("#elementOverlayPdf", {trigger: true});
  	},

  	viewLink: function(e) {
  		Application.elementOverlayLink.linkId = $(e.currentTarget).data('id');
  		Application.router.navigate("#elementOverlayLink", {trigger: true});
  	},

  	viewPhoto: function(e) {
  		e.preventDefault();
  		Application.elementViewPhoto.photoId = $(e.currentTarget).data('id');
  		Application.router.navigate("#elementPhoto", {trigger: true});
  	},

  	publishLesson: function(e) {
  		var session_id = window.localStorage.getItem("session_id");
  		var selected = $(e.currentTarget).hasClass('published');
  		if (selected == false)
  		{
  			$.ajax({
  				data: {session_id: session_id, is_published: true, lesson_id: lesson_id},
  				url: Application.serverURL+"teacher/lessons/update.json",
  				type: "POST",
  				xhrFields: {withCredentials: true},
  				dataType:"json",
  				success: function(data) {
  					$('.element_thumb').addClass('published-item');
  					$('.publish').addClass('published');
  					$('.publish').empty();
  					$('.publish').append('Published');
  					navigator.notification.alert(
  						'Your lesson has been published',  // message
  						function alertDismissed() {}, // callback
  						'Publish',            // title
  						'OK'                  // buttonName
  					);			
  					$(e.currentTarget).addClass('published');
  				},
  				error: function(textStatus, errorThrown) {
  					navigator.notification.alert(
  						'Unable to publish unit, please try to publish again',  // message
  						function alertDismissed() {}, // callback
  						'Publish',            // title
  						'OK'                  // buttonName
  					);
  					console.log(JSON.stringify(errorThrown));
  				}
  			});

  		}
  		else
  		{
  		
  			$.ajax({
  				data: {session_id: session_id, is_published: false, lesson_id: lesson_id},
  				url: Application.serverURL+"teacher/lessons/update.json",
  				type: "POST",
  				xhrFields: {withCredentials: true},
  				dataType:"json",
  				success: function(data) {
  					$('.element_thumb').removeClass('published-item');
  					$('.publish').removeClass('published');
  					$('.publish').empty();
  					$('.publish').append('Publish');
  					navigator.notification.alert(
  						'Your lesson has been un-published',  // message
  						function alertDismissed() {}, // callback
  						'Publish',            // title
  						'OK'                  // buttonName
  					);
  					$(e.currentTarget).removeClass('published');
  				},
  				error: function(textStatus, errorThrown) {
  					navigator.notification.alert(
  						'Unable to un-publish unit, please try again',  // message
  						function alertDismissed() {}, // callback
  						'Error',            // title
  						'OK'                  // buttonName
  					);
  					console.log(JSON.stringify(errorThrown));
  				}
  			});
  		}	
  	},

  	deleteLesson: function() {
  		var session_id = window.localStorage.getItem("session_id");
  		navigator.notification.confirm(
  			'Are you sure you want to delete this lesson?',  // message
  			function(buttonIndex){
  				if (buttonIndex == 2)
  				{
  					$.ajax({
  						data: {session_id: session_id, lesson_id: lesson_id},
  						url: Application.serverURL+"teacher/lessons/delete.json",
  						type: "POST",
  						xhrFields: {withCredentials: true},
  						success: function(data) {
  							window.history.back();
  						},
  						error: function(textStatus, errorThrown) {
  							alert("Unable to delete lesson, please try to delete lesson again");
  							console.log(JSON.stringify(errorThrown));
  						}
  					});
  				}
  				},         // callback
  				'Delete',            // title
  				'Cancel, OK'                  // buttonName
  			);
  		},

  		deleteElement: function(e){
  			var session_id = window.localStorage.getItem("session_id");
  			var element_id = $(e.currentTarget).data('id');
  			navigator.notification.confirm(
  				'Are you sure you want to delete this element?',  // message
  				function(buttonIndex){
  					if (buttonIndex == 2)
  					{
  						$.ajax({
  							data: {session_id:session_id, element_id: element_id},
  							url: Application.serverURL+"teacher/elements/delete.json",
  							type: "POST",
  							xhrFields: {withCredentials: true},
  							success: function(data) {
  								Application.lessonView.lessonInfo = new Lesson();
  								Application.lessonView.lessonInfo.lessonJSON = {};
  								Application.lessonView.lessonInfo.fetch({
  									data:{session_id:session_id, lesson_id: lesson_id},
  									processData:true,
  									xhrFields: {withCredentials: true},
  									update: true,
  									success:function(data){
  										Application.lessonView.$el.trigger("dataLoadedmore");
  									}
  								});
  							},
  							error: function(textStatus, errorThrown) {
  								navigator.notification.alert(
  									'Unable to delete element, please try again',  // message
  									function alertDismissed() {}, // callback
  									'Error',            // title
  									'OK'                  // buttonName
  									);								console.log(JSON.stringify(errorThrown));
  								}
  							});
  						}
  						},         // callback
  						'Delete',            // title
  						'Cancel, OK'                  // buttonName
  					);
  				},

  				changeTitle: function() {
  					var lesson_title = $('#lessontitle').val();
  					$.ajax({
  						data: {session_id:this.session_id, title: lesson_title, lesson_id: this.lessonId},
  						url: Application.serverURL+"teacher/lessons/update.json",
  						type: "POST",
  						xhrFields: {withCredentials: true},
  						dataType:"json",
  						success: function(data) {
  						},
  						error: function(textStatus, errorThrown) {
  							navigator.notification.alert(
  								'Unable to save changes, please try again',  // message
  								function alertDismissed() {}, // callback
  								'Try Again',            // title
  								'OK'                  // buttonName
  							);
  							console.log(JSON.stringify(errorThrown));
  						}
  					});
  				},

  				changeDescription: function() {
  					var lesson_description = $('#lessontitle').val();
  					$.ajax({
  						data: {session_id:this.session_id, description: lesson_description, lesson_id: this.lessonId},
  						url: Application.serverURL+"teacher/lessons/update.json",
  						type: "POST",
  						xhrFields: {withCredentials: true},
  						dataType:"json",
  						success: function(data) {
  						},
  						error: function(textStatus, errorThrown) {
  							navigator.notification.alert(
  								'Unable to save changes, please try again',  // message
  								function alertDismissed() {}, // callback
  								'Try Again',            // title
  								'OK'                  // buttonName
  							);
  							console.log(JSON.stringify(errorThrown));
  						}
  					});
  				},

  				modifyPage: function() {
  					$('.trash').fadeIn();
  					$('.edit-unit').empty();
  					$('.edit-unit').addClass("done");
  					$('.edit-unit').append("Done");
  					$('.item-delete').fadeIn();
  				},

  				completeAdding: function() {
  					$('.trash').fadeOut();
  					$('.done').empty();
  					$('.done').removeClass("done");
  					$('.edit-unit').append("Edit");
  					$('.item-delete').fadeOut();
  				},

  				viewGroup: function(e) {
  					e.preventDefault();
  					Application.groupView.groupId = $(e.currentTarget).data('id');
  					Application.router.navigate("#group", {trigger: true});
  				},

  				viewStudent: function(e) {
  					e.preventDefault();
  					Application.studentView.studentId = $(e.currentTarget).data('id');
  					Application.router.navigate("#student", {trigger: true});
  				},

  				addElement: function() {
  					Application.router.navigate("#formNewElement", {trigger: true});
  				},

  				formAddGroup: function() {
  					if (this.backbutton == false)
  					{
  						Application.formAddGroupView.backbutton = false;
  					}
  					Application.formAddGroupView.lesson_id = lesson_id;
  					Application.router.navigate("#formAddGroup", {trigger: true});
  				},
  				
  				helpMe: function() {
  					$("body").chardinJs('toggle');
  				}
  			});
});
window.require.register("views/loginRegister_view", function(exports, require, module) {
  var View = require('./view');
  var template = require('./templates/loginRegister');

  module.exports = View.extend({
  	id: 'loginRegister-view',
  	template: template,
  	studentPassword: '',
  	events: {
  		'click .back-icon' : 'loginBack',
  		'click .back-register' : 'registerBack',
  		'click .register-button' : 'submitRegister',
  		'click #next' : 'registerNext',
  		'click #toc' : 'viewTOC',
  		'click #privacy' : 'viewPrivacy'
  	},

  	loginBack: function () {
  		Application.router.navigate("#loginTeacher", {
  			trigger: true
  		});
  	},

  	viewTOC: function () {
  		window.plugins.childBrowser.showWebPage('http://www.hmsteach.com/tos.html');
  	},

  	viewPrivacy: function () {
  		window.plugins.childBrowser.showWebPage('http://www.hmsteach.com/privacy.html');
  	},

  	registerNext: function () {
  		var password = $('#password').val(); 
  		var confirmpassword = $('#confirm-password').val();
  		if (password == confirmpassword)
  		{
  			$('#register-1').fadeOut(200);
  			setTimeout(function () {
  				$('#register-2').fadeIn(200);
  				}, 200);
  			}
  			else{
  				navigator.notification.alert(
  					'Passwords do not match',  // message
  					function alertDismissed() {}, // callback
  					'Error',            // title
  					'OK'                  // buttonName
  				);			
  				}
  		},

  		registerBack: function () {
  			$('#register-2').fadeOut(200);
  			setTimeout(function () {
  				$('#register-1').fadeIn(200);
  				}, 200);
  			},

  			submitRegister: function(){
  				var firstname = $('#first-name').val();
  				var lastname = $('#last-name').val();
  				var displayname = $('#display-name').val();
  				var email = $('#email').val();
  				var shaObj = new jsSHA($('#password').val(), "TEXT");
  				var teacher_password_hash = shaObj.getHash("SHA-512", "HEX");
  				var city = $('#city-input').val();
  				var state = $('#state-input').val();
  				var country = $('#country').val();
  				var school = $('#school').val();
  				var district = $('#district').val();

  				if( displayname && firstname && lastname && email && teacher_password_hash && city && state && country && school && district)
  				{
  					$.ajax({
  						data: {
  							display_name:displayname,
  							firstname:firstname,
  							lastname:lastname,
  							login:email,
  							password:teacher_password_hash,
  							city:city,
  							state:state,
  							country:country,
  							school:school,
  							district:district
  						},
  						url: Application.serverURL+"register",
  						type: "POST",
  						xhrFields: {
  							withCredentials: true
  						},
  						success: function (data) {
  							
  							window.localStorage.setItem("user_name", email);
  							window.localStorage.setItem("customer_id", data.account_id);
  							window.localStorage.setItem("teacher_customer_id", data.account_id);
  							window.localStorage.setItem("session_id", data.session_id);
  							window.localStorage.setItem("display_name", data.display_name);
  							
  							Application.router.navigate("#home", {
  								trigger: true
  							});
  						},
  						error: function (jqXHR, textStatus, errorThrown) {
  							if (obj.status == "username_in_use")
  							{
  								navigator.notification.alert(
  									'This user has already been registered',  // message
  									function alertDismissed() {}, // callback
  									'Error',            // title
  									'OK'                  // buttonName
  								);
  							}
  							else
  							{
  								navigator.notification.alert(
  									'Unable to register at this time.',  // message
  									function alertDismissed() {}, // callback
  									'Error',            // title
  									'OK'                  // buttonName
  								);
  							}
  						}
  					});
  				}
  				else{
  					navigator.notification.alert(
  						'Please enter all fields',  // message
  						function alertDismissed() {}, // callback
  						'All Fields Required',            // title
  						'OK'                  // buttonName
  					);
  				}
  			}
  		});
});
window.require.register("views/loginStudent_view", function(exports, require, module) {
  var View = require('./view');
  var template = require('./templates/loginStudent');
  var template2 = require('./templates/loginStudentList');
  var myStudents = require('../models/students_login');
  var max = 10;

  module.exports = View.extend({
  	id: 'loginStudent-view',
  	template: template,
  	template2: template2,
  	events: {
  		"dataLoaded": "append",
  		'click #submitID': 'submitID',
  		'keyup #studentName': 'partialsearch',
  		'click .studentLoginThumb': 'studentSelected',
  		'click .enter-password': 'studentLogin',
  		'click .create-password': 'createPassword',
  		'click .back-icon': 'studentLoginBack',
  		'click #takePhoto': 'takePhoto',
  		'click #submitPhoto': 'submitPhoto',
  		'click #change-schools': 'changeSchool'  
  	},

  	render: function () {
  		window.localStorage.removeItem("user_name");
  		window.localStorage.removeItem("session_id");
  		window.localStorage.removeItem("teacher_customer_id");
  		this.studentPassword = new Array();
  		this.entered_keys = new Array();
  		this.photo_url = new String();
  		this.customer_id = window.localStorage.getItem("customer_id");
  		if (this.customer_id == null || this.customer_id == undefined){
  			this.$el.html(this.template({"customer_id":null}));
  		}
  		else{
  			this.$el.html(this.template({"customer_id":this.customer_id}));
  		}
  		return this;
  	},

  	append: function () {
  		this.studentList.listJSON = this.studentList.handle();
  		$('#studentList').html(this.template2(this.studentList.listJSON));
  		this.enableScroll();
  	},

  	enableScroll: function(){
  		var scrollStudentList = new iScroll('studentList', {
  			useTransition: true,
  			hScroll: false
  		});
  	},

  	studentLoginBack: function () {
  		window.localStorage.removeItem("user_name");
  		window.localStorage.removeItem("session_id");
  		Application.router.navigate("/", {
  			trigger: true
  		});
  	},

  	submitID: function () {
  		$('#login-school-code').fadeOut(200);
  		this.customer_id = $('#schoolCode').val();
  		window.localStorage.setItem("customer_id", this.customer_id);
  		location.reload();
  	},

  	changeSchool: function () {
  		$('#login_step2').fadeOut(200);
  		window.localStorage.removeItem("customer_id", this.customer_id);
  		location.reload();
  	},	

  	partialsearch: function () {
  		this.entered_keys = $('#studentName').val();
  		this.studentList = new myStudents();
  		this.studentList.listJSON = {};
  		this.studentList.fetch({
  			xhrFields: {
  				withCredentials: true
  			},
  			data: {
  				customer_id: Application.loginStudentView.customer_id,
  				student_name_partial: this.entered_keys,
  				max: max
  			},
  			update: true,
  			success: function (data) {
  				Application.loginStudentView.$el.trigger("dataLoaded");
  			},
  			error: function (jqXHR, textStatus, errorThrown) {
  				navigator.notification.alert(
  					'Unable to search for students. Make sure your device is connected to the internet and try again.',  // message
  					function alertDismissed() {}, // callback
  					'Error',            // title
  					'OK'                  // buttonName
  				);
  				console.log(JSON.stringify(errorThrown));
  			}
  		});
  	},

  	studentSelected: function (e) {
  		$(e.currentTarget).addClass('studentLoginThumb_active');
  		document.activeElement.blur();
  		$("studentName").blur();
  		$('#login_step2').fadeOut(200);
  		this.user_name = $(e.currentTarget).data('id');
  		$.ajax({
  			data: {user_name:this.user_name},
  			url: Application.serverURL+"student/check_passcode.json",
  			type: "POST",
  			xhrFields: {
  				withCredentials: true
  			},
  			success: function (data) {
  				var user_name = data.student_user_id;
  				if (data.has_passcode == false)
  				{
  					$('#create-passcode-container').delay(200).fadeIn(100);
  					window.localStorage.setItem("user_name", user_name);
  				}
  				else{
  					$('#login_step3').delay(200).fadeIn(100);
  					window.localStorage.setItem("user_name", user_name);
  				}

  			},
  			error: function (textStatus, errorThrown) {
  				//need error screen
  				navigator.notification.alert(
  					'Please try again',  // message
  					function alertDismissed() {}, // callback
  					'Error',            // title
  					'OK'                  // buttonName
  				);
  				console.log(JSON.stringify(errorThrown));
  				// Application.router.navigate("#home", {trigger: true});
  			}
  		});
  	},

  	createPassword: function (e) {
  		this.studentPassword.push($(e.currentTarget).attr('id'));
  		var passwordlength = this.studentPassword.length;
  		$('#create-passbox'+ passwordlength).append('<div class="pass-circle"></div>');

  		if (this.studentPassword.length == 4) {
  			var student_id = this.user_name;
  			var student_password = this.studentPassword.toString();
  			$.ajax({
  				data: {student_uuid: student_id, student_passcode: student_password},
  				url: Application.serverURL+"student/setPasscode",
  				type: "POST",
  				xhrFields: {
  					withCredentials: true
  				},
  				success: function (data) {
  					console.log(data);
  					window.localStorage.setItem("student_user_name", student_id);
  					window.localStorage.setItem("session_id", data.session_id);
  					window.localStorage.setItem("display_name", data.display_name);
  					window.localStorage.setItem("image_url", data.image_url);

  					$('#create-passcode-container').fadeOut(200);

  					$('#create-passbox1').removeClass('pass-circle');
  					$('#create-passbox2').removeClass('pass-circle');
  					$('#create-passbox3').removeClass('pass-circle');
  					$('#create-passbox4').removeClass('pass-circle');

  					$('#take-photo').delay(200).fadeIn(200);

  				},
  				error: function (textStatus, errorThrown) {
  					//need a try again screen 
  					console.log(JSON.stringify(errorThrown));
  				}
  			});
  		}
  	},

  	takePhoto: function() {
  		if (!window.plugins.filepicker) {
  			return;
  		}

  		var uploadSuccess = function(args) {
  			if (args.result == 'didFinishPickingMediaWithInfo') {
  				Application.loginStudentView.photo_url = args.FPPickerControllerRemoteURL;
  				thumbnail_url = Application.loginStudentView.photo_url + '/convert?w=150&h=150';
  				$('#loginPicker').removeClass('take-photo-bg');
  				$('#loginPicker').css('background-image', 'url(' + thumbnail_url + ')');
  				$('#submitPhoto').addClass('show-inline');
  			}
  		};

  		var uploadError = function(args) {
  			console.log('Error during Filepicker upload');
  		};

  		window.plugins.filepicker.pick(
  			{
  				dataTypes: ['image/*'],
  				sourceNames: ['FPSourceCamera', 'FPSourceCameraRoll', 'FPSourceFacebook', 'FPSourceInstagram']
  			},
  			uploadSuccess,
  			uploadError
  		);
  	},

  	submitPhoto: function() {
  		var student_id = window.localStorage.getItem("student_user_name");
  		var session_id = window.localStorage.getItem("session_id");

  		$.ajax({
  			data: {session_id:session_id, student_uuid:student_id, image_url:this.photo_url},
  			url: Application.serverURL+"shared/update_student.json",
  			type: "POST",
  			xhrFields: {
  				withCredentials: true
  			},
  			success: function (data) {
  				Application.router.navigate("#studentSettings", {trigger: true});
  			},
  			error: function (textStatus, errorThrown) {
  				//need a try again screen 
  				console.log(JSON.stringify(errorThrown));
  			}
  		});
  	},

  	studentLogin: function (e) {
  		this.studentPassword.push($(e.currentTarget).attr('id'));
  		var passwordlength = this.studentPassword.length;
  		$('#passbox'+ passwordlength).append('<div class="pass-circle"></div>');
  		if (this.studentPassword.length == 4) {
  			$('#theSpinner').show();
  			var student_id = this.user_name;
  			var student_password = this.studentPassword.toString();
  			$('#passbox1').children('div.pass-circle').remove();
  			$('#passbox2').children('div.pass-circle').remove();
  			$('#passbox3').children('div.pass-circle').remove();
  			$('#passbox4').children('div.pass-circle').remove();
  			$.ajax({
  				data: {user_name: student_id, student_code: student_password},
  				url: Application.serverURL+"student/user_session.json",
  				type: "POST",
  				xhrFields: {
  					withCredentials: true
  				},
  				success: function (data) {
  					$('#theSpinner').hide();
  					window.localStorage.setItem("student_user_name", student_id);
  					window.localStorage.setItem("session_id", data.session_id);
  					window.localStorage.setItem("display_name", data.display_name);
  					window.localStorage.setItem("image_url", data.image_url);
  					Application.router.navigate("#studentHome", {
  						trigger: true
  					});
  				},
  				error: function (jqXHR, textStatus, errorThrown) {
  					$('#theSpinner').hide();
  					Application.loginStudentView.studentPassword = new Array();
  					response = jqXHR.responseText;
  					var obj = jQuery.parseJSON(response);
  					if (obj.status == "bad_password")
  					{
  						navigator.notification.alert(
  							'Passcode is incorrect',  // message
  							function alertDismissed() {}, // callback
  							'Error',            // title
  							'OK'                  // buttonName
  						);
  					}
  				}
  			});
  		}
  	}
  });
});
window.require.register("views/loginTeacher_view", function(exports, require, module) {
  var View = require('./view');
  var template = require('./templates/loginTeacher');

  module.exports = View.extend({
  	id: 'login-view',
  	template: template,
  	studentPassword: '',
  	events: {
  		'click #submit_teacher': 'submitTeacher',
  		'click .back-icon-forgot' : 'forgotBack',
  		'click .back-icon' : 'loginBack',
  		'click #register-now': 'loginRegister',        
  		'click .pass-forgot' : 'forgotPassword',
  		'click #submit-pass-reset': 'resetPassword',
  		'click #resetBack': 'resetBack'
  	},

  	initialize: function () {
  	},

  	render: function () {
  		
  		window.localStorage.removeItem("user_name");
  		window.localStorage.removeItem("session_id");
  		window.localStorage.removeItem("teacher_customer_id");

  		this.$el.html(this.template(this.getRenderData()));
  		this.afterRender();
  		return this;
  	},

  	forgotPassword: function () {
  		$('#login_teacher').fadeOut(200);
  		setTimeout(function () {
  			$('#login_forgot').fadeIn(200);
  			}, 200);
  		},

  		resetPassword: function() {
  			var login = $('#reset-password').val();
  			// alert(login);
  			$.ajax({
  				data: {
  					login: login,
  				},
  				url: Application.serverURL+"password/request_reset",
  				type: "POST",
  				xhrFields: {
  					withCredentials: true
  				},
  				success: function (data) {
  					//check your email
  					$('#forgot-wrapper').fadeOut(200);
  					setTimeout(function () {
  						$('#forgot-success').fadeIn(200);
  						}, 200);

  						setTimeout(function () {
  							$('#login_forgot').fadeOut(200);
  							setTimeout(function () {
  								$('#login_teacher').fadeIn(200);
  								}, 200);
  								}, 5000);	
  							},
  							error: function (textStatus, errorThrown) {
  								// error screen
  								$('#forgot-error').fadeIn(10);
  								console.log(JSON.stringify(errorThrown));
  							},
  						});

  					},

  					resetBack: function () {
  						$('#login_forgot').fadeOut(200);
  						setTimeout(function () {
  							$('#login_teacher').fadeIn(200);
  							}, 200);

  						},

  						loginRegister: function () {
  							Application.router.navigate("#loginRegister", {
  								trigger: true
  							});
  						},

  						loginBack : function () {
  							Application.router.navigate("/", {
  								trigger: true
  							});
  						},

  						forgotBack : function () {
  							$('#login_forgot').fadeOut(200);
  							setTimeout(function () {
  								$('#login_teacher').fadeIn(200);
  								}, 200);
  							},

  							submitTeacher: function () {
  								$('#theSpinner').show();
  								var teacher_username = $('#username').val();
  								var shaObj = new jsSHA($('#password').val(), "TEXT");
  								var teacher_password_hash = shaObj.getHash("SHA-512", "HEX");

  								if (teacher_username && teacher_password_hash) {


  									$.ajax({
  										data: {
  											login: teacher_username,
  											password: teacher_password_hash
  										},
  										url: Application.serverURL+"teacher/user_session.json",
  										type: "POST",
  										xhrFields: {
  											withCredentials: true
  										},
  										success: function (data) {
  											window.localStorage.setItem("user_name", teacher_username);
  											window.localStorage.setItem("teacher_customer_id", data.account_id);
  											window.localStorage.setItem("customer_id", data.account_id);
  											window.localStorage.setItem("session_id", data.session_id);
  											window.localStorage.setItem("display_name", data.display_name);
  											window.localStorage.setItem("image_url", data.image_url);
  																					
  											console.log(data);
  											Application.router.navigate("#home", {
  												trigger: true
  											});
  										},
  										error: function (jqXHR, textStatus, errorThrown) {
  											$('#theSpinner').hide();
  											response = jqXHR.responseText;
  											var obj = jQuery.parseJSON(response);
  											if (obj == null) {
  												navigator.notification.alert(
  													'Unable to login. Make sure your device is connected to the internet.',
  													function alertDismissed() {},
  													'Error',
  													'OK'
  												);
  											}
  											else if (obj.status == "user_not_found")
  											{
  												navigator.notification.alert(
  													'This user has not been registered',  // message
  													function alertDismissed() {}, // callback
  													'Error',            // title
  													'OK'                  // buttonName
  												);
  											}
  											else if (obj.status == "bad_password")
  											{
  												navigator.notification.alert(
  													'The password is incorrect',  // message
  													function alertDismissed() {}, // callback
  													'Error',            // title
  													'OK'                  // buttonName
  												);
  											}	
  										}
  									});
  								}
  								else{
  									$('#theSpinner').hide();
  									navigator.notification.alert(
  										'Please enter username and password',  // message
  										function alertDismissed() {}, // callback
  										'Error',            // title
  										'OK'                  // buttonName
  									);
  								}
  							}
  						});
});
window.require.register("views/login_view", function(exports, require, module) {
  var View = require('./view');
  var template = require('./templates/login');

  module.exports = View.extend({
  	id: 'loginWalk-view',
  	template: template,
  	studentPassword: '',
  	events: {
  		'click #teacher': 'loginTeacher',
  		'click #student': 'loginStudent1',
  		'click #what': 'knowitInfo'
  	},

  	initialize: function () {
  		
  	},

  	render: function () {
  		
  		setTimeout(function () {
  				Application.loginView.$el.html(Application.loginView.template({"first_login":true}));
  			}, 10);	

  		return this;
  		
  		},

  			loginTeacher: function () {
  				Application.router.navigate("#loginTeacher", {
  					trigger: true
  				});

  			},

  			loginStudent1: function () {
  				Application.router.navigate("#loginStudent", {
  					trigger: true
  				});
  			},

  			knowitInfo: function() {
  				window.plugins.childBrowser.showWebPage("http://www.hmsteach.com/video.html");

  			}
  			

  		});
});
window.require.register("views/settings_view", function(exports, require, module) {
  var View = require('./view');
  var template = require('./templates/settings');
  var TeacherView = require('../models/teacher');

  module.exports = View.extend({
  	id: 'settings-view',
  	template: template,
  	events: {
  		'dataLoaded':'append',
  		'click .change-photo-btn':'changePhoto',
  		'click .settings-add-btn': 'addStudent',
  		'click .change-pass-btn': 'changePass',
  		'click .settings-cancel-btn': 'settingsCancel',
  		'click #settings-overlay': 'removeOverlay',
  		'click .logout-btn' : 'logout',
  		'click #changePass': 'changePassword',
  		'click #addStudent' : 'addStudenttoList',
  		'blur #schoolname' : 'changeSchool',
  		'blur #districtname' : 'changeDistrict',
  		'blur #city' : 'changeCity',
  		'blur #displayname' : 'changeDisplay',
  		'blur #state' : 'changeState',
  		'blur #country' : 'changeCountry',
  		'blur #username': 'changeUsername',
  		'click .help':'helpMe'
  	},

  	render: function(){ 
  		this.singleTeacher = new TeacherView();
  		this.singleTeacher.teacherJSON ={};
  		this.$el.html(this.template(this.singleTeacher.teacherJSON));
  		this.session_id = window.localStorage.getItem("session_id");
  		this.customer_id = window.localStorage.getItem("teacher_customer_id");
  		this.user_name = window.localStorage.getItem("user_name");

  		this.singleTeacher.fetch({
  			data: {session_id: this.session_id},
  			xhrFields: {withCredentials: true},
  			processData:true,
  			add:true,
  			success:function(data){
  				Application.settingsView.$el.trigger("dataLoaded");
  			},
  			error: function (jqXHR, textStatus, errorThrown) {
  				var error_message = (textStatus.responseText);

  				if (error_message == "no_session")
  				{
  					Application.router.navigate("/", {
  						trigger: true
  					});
  				}
  			}
  		});

  		return this;
  	},

  	append: function() {
  		this.singleTeacher.teacherJSON = this.singleTeacher.handle();
  		this.$el.html(this.template(this.singleTeacher.teacherJSON));
  		this.enableScroll();
  	},	

  	enableScroll: function() { 		
  	},


  	settingsCancel: function () {
  		$('.settings-right').fadeOut(200);
  		$('#settings-overlay').fadeOut(200);
  	},
  	
  	removeOverlay: function () {
  		$('.settings-right').fadeOut(200);
  		$('#settings-overlay').fadeOut(200);
  	},
  	
  	addStudent: function () {
  		$('#settings-overlay').fadeIn(200);
  		$('#settings-add-student').fadeIn(200);
  	},

  		changePass: function () {
  			$('#settings-overlay').fadeIn(200);
  			$('#settings-change-pass').fadeIn(200);
  		
  		},
  			
  			changeDisplay: function() {
  				var teacher_display_name = $('#displayname').val();
  				$.ajax({
  					data: {session_id: this.session_id, login: this.user_name, teacher_display_name: teacher_display_name},
  					url: Application.serverURL+"teacher/update.json",
  					type: "POST",
  					xhrFields: {withCredentials: true},
  					dataType:"json",
  					success: function(data) {
  						window.localStorage.setItem("display_name", teacher_display_name);
  						$(".menu-profile-name").html(display_name);
  					},
  					error: function(textStatus, errorThrown) {
  						if (obj.status == "username_in_use")
  						{
  							navigator.notification.alert(
  								'This user has already been registered',  // message
  								function alertDismissed() {}, // callback
  								'Error',            // title
  								'OK'                  // buttonName
  							);
  						}
  						console.log(JSON.stringify(errorThrown));
  					}
  				});
  			},
  			
  			changeUsername:function() {
  					var new_user_name = $('#username').val();
  					$.ajax({
  						data: {session_id: this.session_id, updated_login: new_user_name},
  						url: Application.serverURL+"teacher/update.json",
  						type: "POST",
  						xhrFields: {withCredentials: true},
  						dataType:"json",
  						success: function(data) {
  							window.localStorage.setItem("user_name", new_user_name);
  							window.localStorage.setItem("session_id", data.session_id);
  							
  						},
  						error: function(textStatus, errorThrown) {
  							navigator.notification.alert(
  								'Unable to save changes, please try again',  // message
  								function alertDismissed() {}, // callback
  								'Try Again',            // title
  								'OK'                  // buttonName
  							);
  							console.log(JSON.stringify(errorThrown));
  						}
  					});
  				},

  			changeSchool: function() {
  				var school_name = $('#schoolname').val();
  				$.ajax({
  					data: {session_id: this.session_id, login: this.user_name, school: school_name},
  					url: Application.serverURL+"teacher/update.json",
  					type: "POST",
  					xhrFields: {withCredentials: true},
  					dataType:"json",
  					success: function(data) {
  					},
  					error: function(textStatus, errorThrown) {
  						navigator.notification.alert(
  							'Unable to save changes, please try again',  // message
  							function alertDismissed() {}, // callback
  							'Try Again',            // title
  							'OK'                  // buttonName
  						);
  						console.log(JSON.stringify(errorThrown));
  					}
  				});
  			},

  			logout: function(){
  				knowitall_offline.clearOfflineStorage();

  				window.localStorage.removeItem("user_name");
  				window.localStorage.removeItem("teacher_customer_id");
  				window.localStorage.removeItem("session_id");
  				window.localStorage.removeItem("display_name");
  				window.localStorage.removeItem("image_url");
  				window.localStorage.removeItem("session_id");
  				
  				$('#menu').hide();
  				Application.router.navigate("/", {trigger: true});
  			},

  			changeDistrict: function() {
  				var district_name = $('#districtname').val();
  				$.ajax({
  					data: {session_id: this.session_id, login: this.user_name, district: district_name},
  					url: Application.serverURL+"teacher/update.json",
  					type: "POST",
  					xhrFields: {withCredentials: true},
  					dataType:"json",
  					success: function(data) {
  					},
  					error: function(textStatus, errorThrown) {
  						navigator.notification.alert(
  							'Unable to save changes, please try again',  // message
  							function alertDismissed() {}, // callback
  							'Try Again',            // title
  							'OK'                  // buttonName
  						);
  						console.log(JSON.stringify(errorThrown));
  					}
  				});
  			},

  			changeCity: function() {
  				var city_name = $('#city').val();
  				$.ajax({
  					data: {session_id: this.session_id, login: this.user_name, city: city_name},
  					url: Application.serverURL+"teacher/update.json",
  					type: "POST",
  					xhrFields: {withCredentials: true},
  					dataType:"json",
  					success: function(data) {
  					},
  					error: function(textStatus, errorThrown) {
  						navigator.notification.alert(
  							'Unable to save changes, please try again',  // message
  							function alertDismissed() {}, // callback
  							'Try Again',            // title
  							'OK'                  // buttonName
  						);
  						console.log(JSON.stringify(errorThrown));
  					}
  				});
  			},

  			changeState: function() {
  				var state_name = $('#state').val();
  				$.ajax({
  					data: {session_id: this.session_id, login: this.user_name, state: state_name},
  					url: Application.serverURL+"teacher/update.json",
  					type: "POST",
  					xhrFields: {withCredentials: true},
  					dataType:"json",
  					success: function(data) {
  					},
  					error: function(textStatus, errorThrown) {
  						navigator.notification.alert(
  							'Unable to save changes, please try again',  // message
  							function alertDismissed() {}, // callback
  							'Try Again',            // title
  							'OK'                  // buttonName
  						);
  						console.log(JSON.stringify(errorThrown));
  					}
  				});
  			},

  			changeCountry: function() {
  				var country_name = $('#country').val();
  				$.ajax({
  					data: {session_id: this.session_id, login: this.user_name, country: country_name},
  					url: Application.serverURL+"teacher/update.json",
  					type: "POST",
  					xhrFields: {withCredentials: true},
  					dataType:"json",
  					success: function(data) {
  					},
  					error: function(textStatus, errorThrown) {
  						navigator.notification.alert(
  							'Unable to save changes, please try again',  // message
  							function alertDismissed() {}, // callback
  							'Try Again',            // title
  							'OK'                  // buttonName
  						);
  						console.log(JSON.stringify(errorThrown));
  					}
  				});
  			},

  			changePassword: function() {
  				var new_password = $('#newPass').val();
  				var confirm_password = $('#confirmPass').val();
  				var old_password = $('#oldPass').val();
  				var session_id = window.localStorage.getItem("session_id");

  				if (new_password == confirm_password){
  					var shaObj2 = new jsSHA(old_password, "TEXT");
  					var teacher_password_hash2 = shaObj2.getHash("SHA-512", "HEX");
  					var shaObj = new jsSHA(new_password, "TEXT");
  					var teacher_password_hash = shaObj.getHash("SHA-512", "HEX");
  					$.ajax({
  						data: {session_id: session_id, login: this.user_name, new_password: teacher_password_hash, old_password: teacher_password_hash2},
  						url: Application.serverURL+"teacher/update.json",
  						type: "POST",
  						xhrFields: {withCredentials: true},
  						dataType:"json",
  						success: function(data) {
  							navigator.notification.alert(
  								'Password changed',  // message
  								function alertDismissed() {}, // callback
  								'Success',            // title
  								'OK'                  // buttonName
  							);
  							$('#settings-change-pass').delay(300).fadeOut(200);
  							$('#settings-overlay').delay(300).fadeOut(200);
  						},
  						error: function(textStatus, errorThrown) {
  							navigator.notification.alert(
  								'Unable to update password, please try again',  // message
  								function alertDismissed() {}, // callback
  								'Try Again',            // title
  								'OK'                  // buttonName
  							);
  							console.log(JSON.stringify(errorThrown));
  						}
  					});

  				}
  				else{
  					navigator.notification.alert(
  						'Passwords do not match',  // message
  						function alertDismissed() {}, // callback
  						'Try Again',            // title
  						'OK'                  // buttonName
  					);
  				}

  			},

  			addStudenttoList: function() {
  				$('#theSpinner').show();
  				var student_first = $('#addFirst').val();
  				var student_last = $('#addLast').val();
  				var session_id = window.localStorage.getItem("session_id");
  				var customer_id = window.localStorage.getItem("teacher_customer_id");

  				if (student_last && student_first)
  				{
  					$.ajax({
  						data: {session_id: session_id, customer_id: customer_id, first_name: student_first, last_name: student_last},
  						url: Application.serverURL+"teacher/create_student.json",
  						type: "POST",
  						xhrFields: {withCredentials: true},
  						dataType:"json",
  						success: function(data) {
  							$('#theSpinner').hide();
  							$('#addFirst').val('');
  							$('#addLast').val('');
  							document.activeElement.blur();
  							$("addLast").blur();
  							$("addFirst").blur();
  							$('#settings-add-student').delay(300).fadeOut(200);
  							$('#settings-overlay').delay(300).fadeOut(200);
  								navigator.notification.alert(
  									'Student successfully added',  // message
  									function alertDismissed() {}, // callback
  									'Success',            // title
  									'OK'                  // buttonName
  							);

  						},
  						error: function(textStatus, errorThrown) {
  							$('#theSpinner').hide();
  							navigator.notification.alert(
  								'Unable to save changes, please try again',  // message
  								function alertDismissed() {}, // callback
  								'Try Again',            // title
  								'OK'                  // buttonName
  							);
  							$('#addFirst').val('');
  							$('#addLast').val('');
  							document.activeElement.blur();
  							$("addLast").blur();
  							$("addFirst").blur();
  							console.log(JSON.stringify(errorThrown));
  						}
  					});
  				}
  				else{
  					$('#theSpinner').hide();
  					navigator.notification.alert(
  						'Please enter a first and last name',  // message
  						function alertDismissed() {}, // callback
  						'Error',            // title
  						'OK'                  // buttonName
  					);

  				}
  			},

  			changePhoto: function() {
  				if (!window.plugins.filepicker) {
  					return;
  				}

  				var uploadSuccess = function(args) {
  					//call to update server with new info
  					if (args.result == 'didFinishPickingMediaWithInfo') {
  						var photo_url = args.FPPickerControllerRemoteURL;
  						var user_name = window.localStorage.getItem("user_name");
  						var session_id = window.localStorage.getItem("session_id");

  						$.ajax({
  							data: {session_id: session_id, login: user_name, image_url: photo_url},
  							url: Application.serverURL+"teacher/update.json",
  							type: "POST",
  							xhrFields: {withCredentials: true},
  							dataType:"json",
  							success: function(data) {
  								window.localStorage.setItem("image_url", photo_url + '/convert?w=150&h=150');
  								$(".menu-thumb").css('background-image', 'url('+photo_url+'/convert?w=150&h=150)');
  														
  							},
  							error: function(textStatus, errorThrown) {
  								navigator.notification.alert(
  									'Unable to save changes, please try again',  // message
  									function alertDismissed() {}, // callback
  									'Try Again',            // title
  									'OK'                  // buttonName
  								);
  								console.log(JSON.stringify(errorThrown));
  							}
  						});
  						thumbnail_url = photo_url + '/convert?w=150&h=150';
  						$('#settingsPicker').removeClass('background-image');
  						$('#settingsPicker').css('background-image', 'url(' + thumbnail_url + ')');
  					}
  				};

  				var uploadError = function(args) {
  					console.log('Error during Filepicker upload');
  				};

  				window.plugins.filepicker.pick(
  					{
  						dataTypes: ['image/*'],
  						sourceNames: ['FPSourceCamera', 'FPSourceCameraRoll', 'FPSourceDropbox', 'FPSourceGoogleDrive', 'FPSourceGmail', 'FPSourceFacebook', 'FPSourceInstagram', 'FPSourceImagesearch']
  					},
  					uploadSuccess,
  					uploadError
  				);
  			},
  			
  			helpMe: function() {
  				$("body").chardinJs('toggle');
  			}

  		});
});
window.require.register("views/studentAnnouncements_view", function(exports, require, module) {
  var View = require('./view');
  var templateSingle = require('./templates/studentAnnouncements');
  var templateList = require('./templates/studentAnnouncementsList');
  var AnnouncementList = require('../models/student_announcements');
  var Announcement = require('../models/single_announcement');

  var skip = 0;
  var max = 20;
  var sortby = 'date';

  module.exports = View.extend({
  	id: 'announcements-view',
  	templateSingle: templateSingle,
  	templateList: templateList,
  	events: {
  		"dataLoadedList":"appendList",
  		"dataLoadedSingle":"appendSingle",
  		"loadAnnouncement":"loadAnnouncement",
  		'click .discussion-sidebar-item':'viewDiscussion',
  		'click .comment-send-btn':'submitComment'
  	},

  	render: function() {
  		this.announcementList = new AnnouncementList();
  		this.announcementList.listJSON = {};
  		this.announcementSingle = new Announcement();
  		this.announcementSingle.announcementJSON = {};
  		this.$el.html(this.templateList(this.announcementList.listJSON));
  		this.session_id = window.localStorage.getItem("session_id");

  		this.announcementList.fetch({
  			data: {session_id:this.session_id, skip:skip, max:max, sortby:sortby},
  			xhrFields: {withCredentials: true},
  			processData:true,
  			add:true,
  			success:function(data){
  				Application.studentAnnouncementsView.$el.trigger("dataLoadedList");
  			},
  			error: function (jqXHR, textStatus, errorThrown) {
  				var error_message = (textStatus.responseText);
  				
  				if (error_message == "no_session")
  				{
  					Application.router.navigate("/", {
  						trigger: true
  					});
  				}
  			}
  		});

  		return this;
  	},

  	appendList: function(){
  		this.announcementList.listJSON = this.announcementList.handle();
  		this.$el.html(this.templateList(this.announcementList.listJSON));
  		
  		if (this.announcement_id == undefined)
  		{			
  			var currentView = Application.studentAnnouncementsView;
  			currentView.announcement_id = currentView.announcementList.listJSON.student_announce[0].announcement_id;
  		}
  		Application.studentAnnouncementsView.$el.trigger("loadAnnouncement");
  	},

  	appendSingle: function(){	
  		this.announcementSingle.announcementJSON = this.announcementSingle.handle();
  		$('#announcements-body').html(this.templateSingle(this.announcementSingle.announcementJSON));
  		this.enableScrollAnnouncements();		
  		this.enableScrollAnnouncement();
  	},
  	
  	submitComment: function(){
  		$('#theSpinner').show();
  		var comment = $('#commentMessage').val();
  		var session_id = window.localStorage.getItem("session_id");

  		if (comment) {
  			var user_name = window.localStorage.getItem("user_name");
  			$.ajax({			
  				data: {session_id:session_id, announcement_id:this.announcement_id, contributor_id:user_name, body: comment},
  				xhrFields: {withCredentials: true},
  				url: Application.serverURL+'student/announcement.json',
  				type: "POST",
  				dataType:"json",
  				success: function(data) {
  					Application.studentAnnouncementsView.announcementSingle = new Announcement();
  					Application.studentAnnouncementsView.announcementJSON = {};
  					Application.studentAnnouncementsView.announcementSingle.fetch({
  						data:{session_id:session_id, announcement_id:Application.studentAnnouncementsView.announcement_id},
  						xhrFields: {withCredentials: true},
  						processData:true,
  						update: true,
  						success:function(data){
  							$('#theSpinner').hide();
  							Application.studentAnnouncementsView.$el.trigger("dataLoadedSingle");
  						},
  						failure:function(){
  							$('#theSpinner').hide();
  							navigator.notification.alert(
  								'Unable to load announcements',  // message
  								function alertDismissed() {}, // callback
  								'Error',            // title
  								'OK'                  // buttonName
  							);
  						}
  					}); 
  				},
  				failure:function(){
  					$('#theSpinner').hide();
  					navigator.notification.alert(
  						'Unable to submit post, please try again',  // message
  						function alertDismissed() {}, // callback
  						'Error',            // title
  						'OK'                  // buttonName
  					);
  				}
  			});
  		}
  		else{
  			$('#theSpinner').hide();
  			navigator.notification.alert(
  				'Please enter message',  // message
  				function alertDismissed() {}, // callback
  				'Error',            // title
  				'OK'                  // buttonName
  			);
  		}

  	},

  	loadAnnouncement: function() {
  		
  		this.announcementSingle.fetch({
  			data:{session_id:this.session_id, announcement_id:this.announcement_id},
  			xhrFields: {withCredentials: true},
  			processData:true,
  			update: true,
  			success:function(data){
  				Application.studentAnnouncementsView.$el.trigger("dataLoadedSingle");
  			},
  			failure:function(){
  			}
  		});
  	},
  	viewDiscussion: function(e) {
  		
  			Application.studentAnnouncementsView.announcement_id = $(e.currentTarget).data('id');
  			var currentAnnouncementId = $(e.currentTarget).data('id');

  			$('.active-sidebar-item').removeClass('active-sidebar-item');
  			$(e.currentTarget).addClass('active-sidebar-item');
  			

  			this.announcementSingle.fetch({
  				data: {session_id:this.session_id, announcement_id:currentAnnouncementId},
  				xhrFields: {withCredentials: true},
  				processData:true,
  				update: true,
  				success:function(data){
  					Application.studentAnnouncementsView.$el.trigger("dataLoadedSingle");
  				},
  				failure:function(){
  				}
  			});	
  	},

  	enableScrollAnnouncements: function() {
  		scrollDiscussionSidebar = new iScroll('scrollDiscussionSidebar', {useTransition:true,hScroll:false});
  	},

  	enableScrollAnnouncement: function() {
  		scrollDiscussion = new iScroll('scrollDiscussion', {useTransition:true,hScroll:false});
  	}


  });
  
});
window.require.register("views/studentAssignments", function(exports, require, module) {
  var View = require('./view');
  var template = require('./templates/studentAssignments');
  var Assignment = require('../models/student_assignments');
  var skip = 0;
  var max = 20;
  var sortby = 'date';

  module.exports = View.extend({
    id: 'studentAssignments-view',
    template: template,
  	events: {
  		"dataLoaded":"append",
  		'click .assignments-thumb':'viewAssignment'
  	},
  	
  	render: function() {
  		this.assignmentList = new Assignment();
  		this.assignmentList.listJSON = {};
  		this.$el.html(this.template(this.assignmentList.listJSON));
  		this.session_id = window.localStorage.getItem("session_id");

  		this.assignmentList.fetch({
  			data: {session_id:this.session_id, skip:skip, max:max, sortby:sortby},
  			xhrFields: {withCredentials: true},
  			processData:true,
  			add:true,
  			success:function(){
  				Application.studentAssignmentsView.$el.trigger("dataLoaded");
  			},
  			error: function (jqXHR, textStatus, errorThrown) {
  				var error_message = (textStatus.responseText);
  				
  				if (error_message == "no_session")
  				{
  					Application.router.navigate("/", {
  						trigger: true
  					});
  				}
  			}
  		});
  		
  		return this;
  	}, 

  	append: function(){
  		this.assignmentList.listJSON = this.assignmentList.handle();
  		this.$el.html(this.template(this.assignmentList.listJSON));
  		this.enableScroll();
  	},
  	
  	enableScroll: function() {
  		scrollElement = new iScroll('scrollElement', {useTransition:true,hScroll:false});
  	},
  	
  	viewAssignment: function(e) {   
  		e.preventDefault();
  		Application.elementOverlayAssignment.assignmentId = $(e.currentTarget).data('id');
  		Application.router.navigate("#elementOverlayAssignment", {trigger: true});
  	}

  });
  
});
window.require.register("views/studentBookmarks", function(exports, require, module) {
  var View = require('./view');
  var template = require('./templates/studentBookmarks');

  module.exports = View.extend({
    id: 'studentBookmarks-view',
    template: template,
  	events: {
  		'click #editElement':'editElement'
  	},
  	
  	enableScroll: function() {
  		scrollElement = new iScroll('scrollElement', {useTransition:true,hScroll:false});
  	},

  	editElement: function() {
  		//Application.router.navigate("#", {trigger: true});
  	}

  });
  
});
window.require.register("views/studentElement_view", function(exports, require, module) {
  var View = require('./view');
  var template = require('./templates/studentElement');

  module.exports = View.extend({
    id: 'studentElement-view',
    template: template,
  	events: {
  		'click #editElement':'editElement'
  	},
  	
  	enableScroll: function() {
  		scrollElement = new iScroll('scrollElement', {useTransition:true,hScroll:false});
  	},

  	editElement: function() {
  		//Application.router.navigate("#", {trigger: true});
  	}

  });
  
});
window.require.register("views/studentHome_view", function(exports, require, module) {
  var View = require('./view');
  var template_announce = require('./templates/studentHomeAnnounce');
  var template_recent = require('./templates/studentHomeRecent');
  var Activity = require('../models/student_activity');
  var Announcements = require('../models/student_announcements');
  var Assignment = require('../models/student_assignments');
  var skip = 0;
  var max = 15;
  var sortby = 'date';

  module.exports = View.extend({
  	id: 'studentHome-view',
  	template_announce: template_announce,
  	template_recent: template_recent,
  	events: {
  		"dataLoadedAnnounce":"appendAnnounce",
  		"dataLoadedActivity":"appendActivity",
  		"appendActivity":"dataActivity",
  		'click #lesson':'viewLesson',
  		'click .student-header' : 'showAnnouncements',
  		'click .student-header-assign' : 'showAssignments',
  		'click .home-assign-item' : 'viewAssignment',
  		'click .announcement-item' : 'viewAnnouncement'


  	},

  	render: function() {
  		$('#theSpinner').show();

  		var display_name = window.localStorage.getItem("display_name");
  		var image_url = window.localStorage.getItem("image_url");

  		$(".menu-thumb").css('background-image', 'url('+image_url+')');
  		$(".menu-profile-name").html(display_name);

  		var local_student = window.localStorage.getItem("student_user_name", student_id);
  		var student_id = window.localStorage.setItem("user_name", local_student);
  		this.session_id = window.localStorage.getItem("session_id");

  		this.recentAnnounce = new Announcements();
  		this.recentActivity = new Activity();
  		this.recentAssignment = new Assignment();
  		this.recentAnnounce.announceJSON = {};
  		this.recentActivity.activityJSON = {};
  		this.recentAssignment.assignmentJSON = {};
  		this.allTheJSON = {};

  		this.$el.html(this.template_announce(this.recentAnnounce.announceJSON));
  		$('#scrollPosts').html(this.template_recent(this.recentActivity.activityJSON));

  		this.recentAnnounce.fetch({
  			processData:true,
  			add:true,
  			data:{session_id:this.session_id, skip:skip, max:max},
  			xhrFields: {withCredentials: true},
  			success:function(data, textStatus, jqXHR){
  				if (jqXHR.fromOfflineSync && !this.offlineNotified) {
  					knowitall_offline.alert();
  					this.offlineNotified = true;
  				}

  				Application.studentHomeView.recentAssignment.fetch({
  					data: {session_id:Application.studentHomeView.session_id, skip:skip, max:8, sortby:sortby},
  					xhrFields: {withCredentials: true},
  					processData:true,
  					add:true,
  					success:function(data, textStatus, jqXHR){
  						if (jqXHR.fromOfflineSync && !this.offlineNotified) {
  							knowitall_offline.alert();
  							this.offlineNotified = true;
  						}

  						Application.studentHomeView.$el.trigger("dataLoadedAnnounce");
  					},
  					error:function(jqXHR, textStatus, errorThrown){
  						Application.studentHomeView.$el.trigger("dataLoadedAnnounce");
  					}
  				});
  			},
  			error: function (jqXHR, textStatus, errorThrown) {
  				var error_message = (textStatus.responseText);

  				if (error_message == "no_session")
  				{
  					Application.router.navigate("/", {
  						trigger: true
  					});
  				}
  			}
  		});

  		return this;
  	},

  	appendAnnounce: function(){
  		this.recentAnnounce.announceJSON = this.recentAnnounce.handle();
  		this.recentAssignment.assignmentJSON = this.recentAssignment.handle();
  		
  		if(this.recentAnnounce.announceJSON.student_announce[0].announcement_id == null) {
  			Application.studentHomeView.allTheJSON = { "blank":true, "announcements":this.recentAnnounce.announceJSON, "assignments":this.recentAssignment.assignmentJSON };
  		}
  		else {
  			Application.studentHomeView.allTheJSON = { "announcements":this.recentAnnounce.announceJSON, "assignments":this.recentAssignment.assignmentJSON };
  			
  		}


  		this.$el.html(this.template_announce(this.allTheJSON));
  		Application.studentHomeView.enableScrollHome();		
  		Application.studentHomeView.$el.trigger("appendActivity");

  		setTimeout(function(){
  			$('#theSpinner').hide();
  			$('#home-view-cover').fadeOut();
  			},700);
  	},

  	viewAssignment: function(e) {
  		e.preventDefault();
  		Application.elementOverlayAssignment.assignmentId = $(e.currentTarget).data('id');
  		Application.router.navigate("#elementOverlayAssignment", {trigger: true});
  	},

  	viewAnnouncement: function(e) {
  		e.preventDefault();
  		Application.studentAnnouncementsView.announcement_id = $(e.currentTarget).data('id');
  		Application.router.navigate("#studentAnnouncements", {trigger: true});
  	},

  	appendActivity: function(){

  		this.recentActivity.activityJSON = this.recentActivity.handle();
  		$('#scrollPosts').html(this.template_recent(this.recentActivity.activityJSON));
  		Application.studentHomeView.enableScrollPosts();
  		setTimeout(function(){
  			$('#theSpinner').hide();
  			$('#home-view-cover').fadeOut();
  			},1000);
  	},

  	dataActivity:function(){
  		this.recentActivity.fetch({
  			processData:true,
  			add:true,
  			data:{session_id:this.session_id, skip:skip, max:max},
  			xhrFields: {withCredentials: true},
  			success:function(data, textStatus, jqXHR){
  				if (jqXHR.fromOfflineSync && !this.offlineNotified) {
  					knowitall_offline.alert();
  					this.offlineNotified = true;
  				}

  				Application.studentHomeView.$el.trigger("dataLoadedActivity");
  			},
  		});
  	},

  	enableScrollHome: function() {
  		scrollHome = new iScroll('scrollHome', {useTransition: true, vScroll: false, hScroll: true, hScrollbar: false});
  	},

  	enableScrollPosts: function() {
  		scrollPosts = new iScroll('scrollPosts', {useTransition: true, vScroll: false, hScroll: true, hScrollbar: false});
  	},

  	viewLesson: function(e) {
  		e.preventDefault();
  		Application.studentLessonView.lessonId = $(e.currentTarget).data('id');
  		Application.router.navigate("#studentLesson", {trigger: true});
  	},

  	showAnnouncements: function() {
  		$('#student-home-assign').fadeOut(200,function(){
  			$('#student-home-announce').fadeIn(200); 
  			$('#scroller-home-student').height(235);	
  		});

  		setTimeout(function(){ 
  			//	Application.scrollHome.scroller.refresh();
  			},500);

  			$('.student-header-assign').removeClass('student-nav-active');
  			$('.student-header').addClass('student-nav-active');
  	},

  	showAssignments: function() {
  		$('#student-home-announce').fadeOut(200,function(){
  			$('#student-home-assign').fadeIn(200);
  			$('#scroller-home-student').height(175);		
  		});

  		setTimeout(function(){ 
  			//		Application.scrollHome.scroller.refresh();
  			},500);

  			$('.student-header').removeClass('student-nav-active');
  			$('.student-header-assign').addClass('student-nav-active');
  	}

  });
  
});
window.require.register("views/studentLesson_view", function(exports, require, module) {
  var View = require('./view');
  var template = require('./templates/studentLesson');
  var Lesson = require('../models/student_lesson');
  var lesson_id = 0;

  module.exports = View.extend({
  	id: 'studentLesson-view',
  	template: template,
  	events: {
  		"dataLoaded":"append",
  		'click .FILE_VIDEO':'viewVideo',
  		'click .PDF_CONTENT':'viewPdf',
  		'click .PHOTO':'viewPhoto',
  		'click .SOCRATIVE':'viewSocrative',
  		'click .PDF_NOTE':'viewPdf',
  		'click .VIDEO_LINK':'viewVideo',
  		'click .KIA_ASSIGNMENT':'viewAssignment',
  		'click .WEBLINK':'viewLink',

  	},
  	initialize: function() {

  	},

  	render: function() {	
  		this.lessonInfo = new Lesson();
  		this.lessonInfo.lessonJSON = {};
  		this.$el.html(this.template(this.lessonInfo.lessonJSON));
  		this.session_id = window.localStorage.getItem("session_id");
  		lesson_id = this.lessonId;
  		
  		this.lessonInfo.fetch({
  			data:{session_id:this.session_id, lesson_id: lesson_id},
  			processData:true,
  			xhrFields: {withCredentials: true},
  			add:true,
  			success:function(){
  				Application.studentLessonView.$el.trigger("dataLoaded");
  			},
  			error: function (jqXHR, textStatus, errorThrown) {
  				var error_message = (textStatus.responseText);
  				
  				if (error_message == "no_session")
  				{
  					Application.router.navigate("/", {
  						trigger: true
  					});
  				}
  			}
  		});
  		
  		lesson_id = this.lessonId;
  		return this;
  	},

  	append: function(){
  		this.lessonInfo.lessonJSON = this.lessonInfo.handle();
  		this.$el.html(this.template(this.lessonInfo.lessonJSON));
  		this.enableScroll();
  	},

  	enableScroll: function() {
  		var sectionHeight = $('#studentLesson-view .section').height() + 1;
  		$('#scrollElements').css('top',sectionHeight+'px');
  		scrollElements = new iScroll('scrollElements', {useTransition:true,hScroll:false});
  	},

  	viewVideo: function(e) {
  		Application.elementViewVideo.videoId = $(e.currentTarget).data('pid');
  		var vidUrl = $(e.currentTarget).data('urls');
  		window.plugins.knowitallbrowser.open(vidUrl);
  	},

  	viewAssignment: function(e) {
  		Application.elementOverlayAssignment.assignmentId = $(e.currentTarget).data('id');
  		Application.router.navigate("#elementOverlayAssignment", {trigger: true});
  	},

  	viewSocrative: function(e) {
  		Application.elementOverlaySocrative.socrativeId = $(e.currentTarget).data('id');
  		Application.router.navigate("#elementOverlaySocrative", {trigger: true});
  	},


  	viewPdf: function(e) {
  		Application.elementOverlayPdf.pdfId = $(e.currentTarget).data('id');
  		Application.router.navigate("#elementOverlayPdf", {trigger: true});
  	},

  	viewLink: function(e) {
  		Application.elementOverlayLink.linkId = $(e.currentTarget).data('id');
  		Application.router.navigate("#elementOverlayLink", {trigger: true});
  	},

  	viewPhoto: function(e) {
  		e.preventDefault();
  		Application.elementViewPhoto.photoId = $(e.currentTarget).data('id');
  		Application.router.navigate("#elementPhoto", {trigger: true});
  	}

  });
  
});
window.require.register("views/studentSettings_view", function(exports, require, module) {
  var View = require('./view');
  var template = require('./templates/studentSettings');
  var StudentView = require('../models/student');

  module.exports = View.extend({
  	id: 'studentSettings-view',
  	template: template,
  	events: {
  		'dataLoaded':'append',
  		'click .change-photo-btn':'changePhoto',
  		'click .change-pass-btn': 'changePass',
  		'click .settings-cancel-btn': 'settingsCancel',
  		'click .logout-btn' : 'logout',
  		'click .enter-password' : 'enterPassword',		
  		'click #changePass': 'changePass',
  		'click #settings-overlay': 'removeOverlay',
  		'blur #parent' : 'changeParent',
  		'blur #email' : 'changeEmail',
  		'blur #phone' : 'changePhone',
  		'blur #street1' : 'changeStreet1',
  		'blur #street2' : 'changeStreet2',
  		'blur #city' : 'changeCity',
  		'blur #state' : 'changeState',
  		'blur #zip' : 'changeZip',
  		'blur #country' : 'changeCountry',
  		'blur #aboutme' : 'changeAbout'
  	},

  	render: function(){ 
  		this.singleStudent = new StudentView();
  		this.singleStudent.studentJSON ={};
  		this.$el.html(this.template(this.singleStudent.studentJSON));
  		this.session_id = window.localStorage.getItem("session_id");
  		this.user_name = window.localStorage.getItem("user_name");
  		
  		var display_name = window.localStorage.getItem("display_name");
  		var image_url = window.localStorage.getItem("image_url");

  		$(".menu-thumb").css('background-image', 'url('+image_url+')');
  		$(".menu-profile-name").html(display_name);

  		this.singleStudent.fetch({
  			data: {session_id: this.session_id, user_name:this.user_name},
  			xhrFields: {withCredentials: true},
  			processData:true,
  			add:true,
  			success:function(data){
  				Application.studentSettingsView.$el.trigger("dataLoaded");
  			},
  			error: function (jqXHR, textStatus, errorThrown) {
  				var error_message = (textStatus.responseText);

  				if (error_message == "no_session")
  				{
  					Application.router.navigate("/", {
  						trigger: true
  					});
  				}
  			}
  		});

  		return this;
  	},

  	append: function() {
  		this.singleStudent.studentJSON = this.singleStudent.handle();
  		this.$el.html(this.template(this.singleStudent.studentJSON));
  	},

  	removeOverlay: function () {
  		$('.settings-right').fadeOut(200);
  		$('#settings-overlay').fadeOut(200);
  	},

  	settingsCancel: function () {
  		$('.settings-right').fadeOut(200);
  		$('#settings-overlay').fadeOut(200);
  	},

  	changeParent: function() {
  		var parent_name = $('#parent').val();
  		$.ajax({
  			data: {session_id: this.session_id, login: this.user_name, student_contacts: parent_name},
  			url: Application.serverURL+"shared/update_student.json",
  			type: "POST",
  			xhrFields: {withCredentials: true},
  			dataType:"json",
  			success: function(data) {
  			},
  			error: function(textStatus, errorThrown) {
  				navigator.notification.alert(
  					'Unable to save changes, please try again',  // message
  					function alertDismissed() {}, // callback
  					'Try Again',            // title
  					'OK'                  // buttonName
  				);
  				console.log(JSON.stringify(errorThrown));
  			}
  		});
  	},

  	changeEmail: function() {
  		var email = $('#email').val();
  		$.ajax({
  			data: {session_id: this.session_id, login: this.user_name, email: email},
  			url: Application.serverURL+"shared/update_student.json",
  			type: "POST",
  			xhrFields: {withCredentials: true},
  			dataType:"json",
  			success: function(data) {
  			},
  			error: function(textStatus, errorThrown) {
  				$('#theSpinner').hide();
  				navigator.notification.alert(
  					'Unable to save changes, please try again',  // message
  					function alertDismissed() {}, // callback
  					'Try Again',            // title
  					'OK'                  // buttonName
  				);
  				console.log(JSON.stringify(errorThrown));
  			}
  		});
  	},

  	changePhone: function() {
  		var phone = $('#phone').val();
  		$.ajax({
  			data: {session_id: this.session_id, login: this.user_name,  phone_number: phone},
  			url: Application.serverURL+"shared/update_student.json",
  			type: "POST",
  			xhrFields: {withCredentials: true},
  			dataType:"json",
  			success: function(data) {
  			},
  			error: function(textStatus, errorThrown) {
  				$('#theSpinner').hide();
  				navigator.notification.alert(
  					'Unable to save changes, please try again',  // message
  					function alertDismissed() {}, // callback
  					'Try Again',            // title
  					'OK'                  // buttonName
  				);
  				console.log(JSON.stringify(errorThrown));
  			}
  		});
  	},

  	changeStreet1: function() {
  		var street1 = $('#street1').val();
  		$.ajax({
  			data: {session_id: this.session_id, login: this.user_name, street1: street1},
  			url: Application.serverURL+"shared/update_student.json",
  			type: "POST",
  			xhrFields: {withCredentials: true},
  			dataType:"json",
  			success: function(data) {
  			},
  			error: function(textStatus, errorThrown) {
  				$('#theSpinner').hide();
  				navigator.notification.alert(
  					'Unable to save changes, please try again',  // message
  					function alertDismissed() {}, // callback
  					'Try Again',            // title
  					'OK'                  // buttonName
  				);
  				console.log(JSON.stringify(errorThrown));
  			}
  		});
  	},

  	changeStreet2: function() {
  		var street2 = $('#street2').val();
  		$.ajax({
  			data: {session_id: this.session_id, login: this.user_name, street2: street2},
  			url: Application.serverURL+"shared/update_student.json",
  			type: "POST",
  			xhrFields: {withCredentials: true},
  			dataType:"json",
  			success: function(data) {
  			},
  			error: function(textStatus, errorThrown) {
  				$('#theSpinner').hide();
  				navigator.notification.alert(
  					'Unable to save changes, please try again',  // message
  					function alertDismissed() {}, // callback
  					'Try Again',            // title
  					'OK'                  // buttonName
  				);
  				console.log(JSON.stringify(errorThrown));
  			}
  		});
  	},

  	changeCity: function() {
  		var city = $('#city').val();
  		$.ajax({
  			data: {session_id: this.session_id, login: this.user_name, city: city},
  			url: Application.serverURL+"shared/update_student.json",
  			type: "POST",
  			xhrFields: {withCredentials: true},
  			dataType:"json",
  			success: function(data) {
  			},
  			error: function(textStatus, errorThrown) {
  				$('#theSpinner').hide();
  				navigator.notification.alert(
  					'Unable to save changes, please try again',  // message
  					function alertDismissed() {}, // callback
  					'Try Again',            // title
  					'OK'                  // buttonName
  				);
  				console.log(JSON.stringify(errorThrown));
  			}
  		});
  	},

  	changeState: function() {
  		var state = $('#state').val();
  		$.ajax({
  			data: {session_id: this.session_id, login: this.user_name, state: state},
  			url: Application.serverURL+"shared/update_student.json",
  			type: "POST",
  			xhrFields: {withCredentials: true},
  			dataType:"json",
  			success: function(data) {
  			},
  			error: function(textStatus, errorThrown) {
  				$('#theSpinner').hide();
  				navigator.notification.alert(
  					'Unable to save changes, please try again',  // message
  					function alertDismissed() {}, // callback
  					'Try Again',            // title
  					'OK'                  // buttonName
  				);
  				console.log(JSON.stringify(errorThrown));
  			}
  		});
  	},
  	changeZip: function() {
  		var zip = $('#zip').val();
  		$.ajax({
  			data: {session_id: this.session_id, login: this.user_name, zip: zip},
  			url: Application.serverURL+"shared/update_student.json",
  			type: "POST",
  			xhrFields: {withCredentials: true},
  			dataType:"json",
  			success: function(data) {
  			},
  			error: function(textStatus, errorThrown) {
  				$('#theSpinner').hide();
  				navigator.notification.alert(
  					'Unable to save changes, please try again',  // message
  					function alertDismissed() {}, // callback
  					'Try Again',            // title
  					'OK'                  // buttonName
  				);
  				console.log(JSON.stringify(errorThrown));
  			}
  		});
  	},
  	changeCountry: function() {
  		var country = $('#country').val();
  		$.ajax({
  			data: {session_id: this.session_id, login: this.user_name, country: country},
  			url: Application.serverURL+"shared/update_student.json",
  			type: "POST",
  			xhrFields: {withCredentials: true},
  			dataType:"json",
  			success: function(data) {
  			},
  			error: function(textStatus, errorThrown) {
  				$('#theSpinner').hide();
  				navigator.notification.alert(
  					'Unable to save changes, please try again',  // message
  					function alertDismissed() {}, // callback
  					'Try Again',            // title
  					'OK'                  // buttonName
  				);
  				console.log(JSON.stringify(errorThrown));
  			}
  		});
  	},
  	changeAbout: function() {
  		var about = $('#aboutme').val();
  		$.ajax({
  			data: {session_id: this.session_id, login: this.user_name, description: about},
  			url: Application.serverURL+"shared/update_student.json",
  			type: "POST",
  			xhrFields: {withCredentials: true},
  			dataType:"json",
  			success: function(data) {
  			},
  			error: function(textStatus, errorThrown) {
  				$('#theSpinner').hide();
  				navigator.notification.alert(
  					'Unable to save changes, please try again',  // message
  					function alertDismissed() {}, // callback
  					'Try Again',            // title
  					'OK'                  // buttonName
  				);
  				console.log(JSON.stringify(errorThrown));
  			}
  		});
  	},

  	logout: function(){
  		knowitall_offline.clearOfflineStorage();

  		window.localStorage.removeItem("user_name");
  		window.localStorage.removeItem("session_id");

  		Application.router.navigate("/", {trigger: true});
  	},

  	changePhoto: function() {
  		if (!window.plugins.filepicker) {
  			return;
  		}

  		var uploadSuccess = function(args) {
  			//call to update server with new info
  			if (args.result == 'didFinishPickingMediaWithInfo') {
  				var photo_url = args.FPPickerControllerRemoteURL;
  				var user_name = window.localStorage.getItem("user_name");
  				var session_id = window.localStorage.getItem("session_id");

  				$.ajax({
  					data: {session_id: session_id, login: user_name, image_url: photo_url},
  					url: Application.serverURL+"shared/update_student.json",
  					type: "POST",
  					xhrFields: {withCredentials: true},
  					dataType:"json",
  					success: function(data) {
  						window.localStorage.setItem("image_url", photo_url + '/convert?w=150&h=150');
  						$(".menu-thumb").css('background-image', 'url('+photo_url+'/convert?w=150&h=150)');
  					},
  					error: function(textStatus, errorThrown) {
  						navigator.notification.alert(
  							'Unable to save changes, please try again',  // message
  							function alertDismissed() {}, // callback
  							'Try Again',            // title
  							'OK'                  // buttonName
  						);
  						console.log(JSON.stringify(errorThrown));
  					}
  				});
  				thumbnail_url = photo_url + '/convert?w=150&h=150';
  				$('#settingsPicker').removeClass('background-image');
  				$('#settingsPicker').css('background-image', 'url(' + thumbnail_url + ')');
  			}
  		};

  		var uploadError = function(args) {
  			console.log('Error during Filepicker upload');
  		};

  		window.plugins.filepicker.pick(
  			{
  				dataTypes: ['image/*'],
  				sourceNames: ['FPSourceCamera', 'FPSourceCameraRoll', 'FPSourceDropbox', 'FPSourceGoogleDrive', 'FPSourceGmail', 'FPSourceFacebook', 'FPSourceInstagram', 'FPSourceImagesearch']
  			},
  			uploadSuccess,
  			uploadError
  		);
  	},

  	changePass: function(e){
  		this.studentPassword = new Array();
  		setTimeout(function () {
  			$('#settings-overlay').fadeIn(200);
  			$('#settings-student-passcode').fadeIn(200);
  			}, 200);
  		},

  		enterPassword: function (e) {

  			this.studentPassword.push($(e.currentTarget).attr('id'));
  			var passwordlength = this.studentPassword.length;
  			$('#create-passbox'+ passwordlength).append('<div class="pass-circle"></div>');

  			if (this.studentPassword.length == 4) {
  								
  				var student_id = window.localStorage.getItem("user_name");
  				var session_id = window.localStorage.getItem("session_id");
  				var student_password = Application.studentSettingsView.studentPassword.toString();
  				$.ajax({
  					data: {session_id:session_id, login: student_id, student_passcode: student_password},
  					url: Application.serverURL+"shared/update_student.json",
  					type: "POST",
  					xhrFields: {
  						withCredentials: true
  					},
  					success: function (data) {
  						window.localStorage.setItem("user_name", student_id);
  						$('#settings-student-passcode').fadeOut(200);
  						$('#settings-overlay').fadeOut(200);
  						$('.pass-box').children('div.pass-circle').remove();
  					},
  					error: function (textStatus, errorThrown) {
  						$('.pass-box').children('div.pass-circle').remove();

  						navigator.notification.alert(
  							'Passcode unable to be changed, please try again',  // message
  							function alertDismissed() {}, // callback
  							'Try Again',            // title
  							'OK'                  // buttonName
  						);
  						console.log(JSON.stringify(errorThrown));
  					}
  				});
  			}
  		}

  	});
});
window.require.register("views/studentSubject_view", function(exports, require, module) {
  var View = require('./view');
  var template = require('./templates/studentSubject');
  var List = require('../models/student_unitlist');
  var skip = 0;
  var max = 20;


  module.exports = View.extend({
  	id: 'studentSubject-view',
  	template: template,
  	events: {
  		"dataLoaded":"append",
  		'click .unit_thumb':'viewUnit'
  	},

  	initialize: function() {  

  	},

  	render: function() {	
  		this.unitList = new List();
  		this.unitList.listJSON = {};
  		this.$el.html(this.template(this.unitList.listJSON));
  		this.session_id = window.localStorage.getItem("session_id");
  		
  		this.unitList.fetch({
  			data:{session_id:this.session_id, skip:skip, max:max},
  			xhrFields: {withCredentials: true},
  			processData:true,
  			add:true,
  			success:function(){
  				Application.studentSubjectView.$el.trigger("dataLoaded");
  			},
  			error: function (jqXHR, textStatus, errorThrown) {
  				var error_message = (textStatus.responseText);
  				
  				if (error_message == "no_session")
  				{
  					Application.router.navigate("/", {
  						trigger: true
  					});
  				}
  			}
  		});
  		
  		return this;
  	},

  	append: function(){
  		
  		this.unitList.listJSON = this.unitList.handle();
  		this.$el.html(this.template(this.unitList.listJSON));
  		this.enableScroll();
  	},

  	enableScroll: function() {
  		scrollUnits = new iScroll('scrollStudentUnits', {useTransition:true,hScroll:false});
  	},

  	viewUnit: function(e) {
  		e.preventDefault();
  		Application.studentUnitView.unitId = $(e.currentTarget).data('id');
  		Application.router.navigate("#studentUnit", {trigger: true});
  	}

  });
  
});
window.require.register("views/studentSupplemental", function(exports, require, module) {
  var View = require('./view');
  var template = require('./templates/studentSupplemental');

  module.exports = View.extend({
    id: 'studentSupplemental-view',
    template: template,
  	events: {
  		'click #editElement':'editElement'
  	},
  	
  	enableScroll: function() {
  		scrollElement = new iScroll('scrollElement', {useTransition:true,hScroll:false});
  	},

  	editElement: function() {
  		//Application.router.navigate("#", {trigger: true});
  	}

  });
  
});
window.require.register("views/studentUnit_view", function(exports, require, module) {
  var View = require('./view');
  var template = require('./templates/studentUnit');
  var Unit = require('../models/student_unit');

  module.exports = View.extend({
  	id: 'studentUnit-view',
  	template: template,
  	events: {
  		"dataLoaded":"append",
  		'click .lesson_thumb':'viewLesson'
  	},

  	initialize: function() {  

  	},

  	render: function() {	

  		this.unitInfo = new Unit();
  		this.unitInfo.unitJSON = {};
  		this.$el.html(this.template(this.unitInfo.unitJSON));
  		this.session_id = window.localStorage.getItem("session_id");
  		
  		this.unitInfo.fetch({
  			data:{session_id:this.session_id, unit_id: this.unitId},
  			processData:true,
  			xhrFields: {withCredentials: true},
  			add:true,
  			success:function(){
  				Application.studentUnitView.$el.trigger("dataLoaded");
  			},
  			error: function (jqXHR, textStatus, errorThrown) {
  				var error_message = (textStatus.responseText);
  				
  				if (error_message == "no_session")
  				{
  					Application.router.navigate("/", {
  						trigger: true
  					});
  				}
  			}
  		});

  		return this;
  	},

  	append: function(){
  		this.unitInfo.unitJSON = this.unitInfo.handle();
  		this.$el.html(this.template(this.unitInfo.unitJSON));
  		this.enableScroll();
  	},

  	enableScroll: function() {
  		var sectionHeight = $('#studentUnit-view .section').height() + 1;
  		$('#scrollLessons').css('top',sectionHeight+'px');
  		scrollLessons = new iScroll('scrollLessons', {useTransition:true,hScroll:false});
  	},

  	viewLesson: function(e) {
  		e.preventDefault();
  		Application.studentLessonView.lessonId = $(e.currentTarget).data('id');
  		Application.router.navigate("#studentLesson", {trigger: true});
  	}

  });
  
});
window.require.register("views/student_view", function(exports, require, module) {
  var View = require('./view');
  var template = require('./templates/student');
  var StudentView = require('../models/teacher_student');

  module.exports = View.extend({
  	id: 'student-view',
  	template: template,
  	events: {
  		'dataLoaded':'append',
  		'click #announce':'openOverlay'
  	},

  	render: function(){ 
  		this.singleStudent = new StudentView();
  		this.singleStudent.studentJSON ={};
  		this.$el.html(this.template(this.singleStudent.studentJSON));
  		this.session_id = window.localStorage.getItem("session_id");

  		this.singleStudent.fetch({
  			data: {session_id:this.session_id, student_id:this.studentId },
  			xhrFields: {withCredentials: true},
  			processData:true,
  			add:true,
  			success:function(data){
  				Application.studentView.$el.trigger("dataLoaded");
  			},
  			error: function (jqXHR, textStatus, errorThrown) {
  				var error_message = (textStatus.responseText);
  				
  				if (error_message == "no_session")
  				{
  					Application.router.navigate("/", {
  						trigger: true
  					});
  				}
  			}
  		});

  		return this;
  	},

  	append: function() {
  		this.singleStudent.studentJSON = this.singleStudent.handle();
  		this.$el.html(this.template(this.singleStudent.studentJSON));
  		this.enableScroll();
  	},	

  	enableScroll: function() { 
  		studentImage = $('.student_image').width();
  		$('.student_image').css('height',studentImage);
  		//scrollStudentInfo = new iScroll('scrollStudentInfo', {useTransition:true,hScroll:false});
  	},

  	openOverlay: function() {
  		$('#studentAnnouncement').show();
  	},

  	closeOverlay: function() {
  		$('.overlay_modal').hide();
  		$('.overlay_modal textarea').val('');
  	},

  	submitOverlay: function() {
  		this.closeOverlay();
  	}

  });
});
window.require.register("views/subject_view", function(exports, require, module) {
  var View = require('./view');
  var templateUnits = require('./templates/subjectUnits');
  var templateGroups = require('./templates/subject');
  var List = require('../models/unit_list');
  var MyGroups = require('../models/teacher_groups');
  var skip = 0;
  var max = 20;
  var currentGroupId = 'all';
  var currentGroupName = 'All';

  module.exports = View.extend({
  	id: 'subject-view',
  	templateUnits: templateUnits,
  	templateGroups: templateGroups,
  	events: {
  		"dataLoadedGroups":"appendGroups",
  		"dataLoadedUnits":"appendUnits",
  		"allUnitsStart":"allUnitsStart",
  		'click .unit_thumb':'viewUnit',
  		'click #addUnit':'addScreen',
  		'click .add_button':'addScreen',
  		'click .group_item':'unitsByGroup',
  		'click .allunits':'allUnits',
  		'click .group_banner':'viewGroup',
  		'click .help':'helpMe'

  	},

  	initialize: function() {  

  	},

  	render: function() {	
  		
  	//	$('#theSpinner').show();
  		
  		this.teacherGroups = new MyGroups();
  		this.teacherGroups.groupsJSON ={};
  		this.unitList = new List();
  		this.unitList.listJSON = {};
  		this.$el.html(this.templateGroups(this.teacherGroups.groupsJSON));
  		this.session_id = window.localStorage.getItem("session_id");

  		this.teacherGroups.fetch({
  			processData:true,
  			xhrFields: {withCredentials: true},
  			add:true,
  			data: {session_id:this.session_id, skip:skip, max:max },
  			success: function(data){
  				Application.subjectView.$el.trigger("dataLoadedGroups");
  			}
  		});
  		
  		return this;
  	},

  	appendGroups: function(){
  		this.teacherGroups.groupsJSON = this.teacherGroups.handle();
  		this.$el.html(this.templateGroups(this.teacherGroups.groupsJSON));
  		this.enableScrollGroups();
  		Application.subjectView.$el.trigger("allUnitsStart");
  		
  	},
  	appendUnits: function(){	
  		this.unitList.listJSON = this.unitList.handle();
  		$('#scrollUnits').html(this.templateUnits(this.unitList.listJSON));
  		this.enableScrollUnits();
  	},


  	enableScrollGroups: function() {
  		// var currentGroupId = $(e.currentTarget).data('id');
  		if (currentGroupName!='All') {
  			$('.group_banner').data('id',currentGroupId);
  			$('.group_banner').html('<p>'+currentGroupName+'</p>');
  			console.log(currentGroupName);
  			$('.group_banner').show();
  		} else {
  			$('.group_banner').hide();
  		}		
  		scrollGroups1 = new iScroll('scrollGroups1', {useTransition:true,hScroll:false});
  	},
  	
  	enableScrollUnits: function() {		
  		scrollUnits = new iScroll('scrollUnits', {useTransition:true,hScroll:false});
  	},

  	viewUnit: function(e) {
  		e.preventDefault();
  		Application.unitView.unitId = $(e.currentTarget).data('id');
  		Application.router.navigate("#unit", {trigger: true});
  	},

  	viewGroup: function(e) {
  		e.preventDefault();
  		Application.groupView.groupId = $(e.currentTarget).data('id');
  		Application.router.navigate("#group", {trigger: true});
  	},

  	unitsByGroup: function(e) {
  		currentGroupId = $(e.currentTarget).data('id');
  		currentGroupName = $(e.currentTarget).html();
  		$('.active_sidebarItem').removeClass('active_sidebarItem');
  		$(e.currentTarget).addClass('active_sidebarItem');

  		this.unitList.fetch({
  			data:{session_id: this.session_id, skip:skip, max:max, group_id:currentGroupId},
  			xhrFields: {withCredentials: true},
  			processData:true,
  			update: true,
  			success:function(data){
  				Application.subjectView.$el.trigger("dataLoadedUnits");
  			},
  			failure:function(){
  			}
  		});
  	},

  	allUnits: function(e) {	
  		currentGroupId = 'all';
  		currentGroupName = 'All';
  		$('.active_sidebarItem').removeClass('active_sidebarItem');
  		$(e.currentTarget).addClass('active_sidebarItem');
  		this.unitList.fetch({
  			data:{session_id:this.session_id, skip:skip, max:max, group_id:"ALL"},
  			xhrFields: {withCredentials: true},
  			processData:true,
  			update: true,
  			success:function(data){
  				Application.subjectView.$el.trigger("dataLoadedUnits");
  			},
  			failure:function(){
  			}
  		});
  	},
  	
  	allUnitsStart: function(e) {	
  		currentGroupId = 'all';
  		currentGroupName = 'All';
  		$('groupall').addClass('active_sidebarItem');
  		this.unitList.fetch({
  			data:{session_id:this.session_id, skip:skip, max:max, group_id:"ALL"},
  			xhrFields: {withCredentials: true},
  			processData:true,
  			update: true,
  			success:function(data){
  				Application.subjectView.$el.trigger("dataLoadedUnits");
  			},
  			failure:function(){
  			}
  		});
  	},

  	addScreen: function() {
  		Application.router.navigate("#formNewElement", {trigger: true});
  	},
  	
  	helpMe: function() {
  		$("body").chardinJs('toggle');
  	}

  });
  
});
window.require.register("views/templates/announcements", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n	";
    foundHelper = helpers.announcement;
    stack1 = foundHelper || depth0.announcement;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.response_list);
    stack2 = helpers.each;
    tmp1 = self.program(2, program2, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n	";
    return buffer;}
  function program2(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n	<div class=\"discussion student-chat\">\n		<div class=\"message-meta\">\n			<h3>";
    foundHelper = helpers.contributor_name;
    stack1 = foundHelper || depth0.contributor_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "contributor_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h3>\n			<p>";
    foundHelper = helpers.timestamp;
    stack1 = foundHelper || depth0.timestamp;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "timestamp", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n		</div>			\n		<div class=\"message-thumb\" style=\"background-image:url(";
    foundHelper = helpers.contributor_image;
    stack1 = foundHelper || depth0.contributor_image;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "contributor_image", { hash: {} }); }
    buffer += escapeExpression(stack1) + ");\"><div class=\"portrait-shadow\"></div></div>\n		<div class=\"message\"><p>";
    foundHelper = helpers.body;
    stack1 = foundHelper || depth0.body;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "body", { hash: {} }); }
    buffer += escapeExpression(stack1) + " </p></div>\n	</div>\n	";
    return buffer;}

  function program4(depth0,data) {
    
    
    return "\n	<div id=\"empty\" class=\"empty-message\">\n		<div class=\"empty-set set-announcement\"></div>\n			<h4>We are missing your voice.</h4>\n			<p>Type your message in the comment box.</p>\n	</div>\n	";}

    buffer += "	<div class=\"section section-shadow discussion-header\">\n		<div id=\"discussion-teacher-hero\" style=\"background-image:url(";
    foundHelper = helpers.announcement;
    stack1 = foundHelper || depth0.announcement;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.moderator_image);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "announcement.moderator_image", { hash: {} }); }
    buffer += escapeExpression(stack1) + ");\"><div class=\"portrait-shadow\"></div></div>	\n		<div class=\"discussion-item-header\">\n			<span>";
    foundHelper = helpers.announcement;
    stack1 = foundHelper || depth0.announcement;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.timestamp);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "announcement.timestamp", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</span>\n			<h1>";
    foundHelper = helpers.announcement;
    stack1 = foundHelper || depth0.announcement;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.header);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "announcement.header", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h1>\n			<p>";
    foundHelper = helpers.announcement;
    stack1 = foundHelper || depth0.announcement;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.body);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "announcement.body", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n		</div>\n	</div>\n	\n	<div id=\"scrollDiscussion\" class=\"scroll_wrapper\">\n		\n<div id=\"scroller\">\n\n	";
    foundHelper = helpers.announcement;
    stack1 = foundHelper || depth0.announcement;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.response_list);
    stack2 = helpers['if'];
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(4, program4, data);
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		</div><!--end #scroller-->	\n	</div><!--end #scrollDiscussion-->\n\n	<div id=\"comment-form\">\n		<input id=\"commentMessage\" placeholder=\"Your Messsage\" type=\"text\">\n		<div id=\"iosbutton\" class=\"comment-send-btn\">Send</div>\n	</div>\n	";
    return buffer;});
});
window.require.register("views/templates/announcementsList", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n		";
    foundHelper = helpers.announcement_list;
    stack1 = foundHelper || depth0.announcement_list;
    stack2 = helpers.each;
    tmp1 = self.program(2, program2, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			";
    return buffer;}
  function program2(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n			<div data-id=\"";
    foundHelper = helpers.announcement_id;
    stack1 = foundHelper || depth0.announcement_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "announcement_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"discussion-sidebar-item\">\n				<h2>";
    foundHelper = helpers.header;
    stack1 = foundHelper || depth0.header;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "header", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h2>\n				<p>";
    foundHelper = helpers.body;
    stack1 = foundHelper || depth0.body;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "body", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n				<div class=\"discussion-count\">";
    foundHelper = helpers.response_count;
    stack1 = foundHelper || depth0.response_count;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "response_count", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</div>\n			</div>\n			";
    return buffer;}

  function program4(depth0,data) {
    
    
    return "\n	\n	";}

  function program6(depth0,data) {
    
    
    return "\n		<div id=\"empty\" class=\"empty-message\">\n		<div class=\"empty-set set-announcement\"></div>\n			<h4>No Announcements Yet</h4>\n			<p>To send an Announcement, <strong class=\"goToGroups\">Select a Group</strong> and tap the announcement button.</p>\n	</div>\n	";}

    buffer += "<div class=\"header drop_shadow\">\n	<div id=\"menu_button\"></div>\n	Announcements\n	<div id=\"iosbutton\" class=\"button-right new-announce\">New Announcement</div>\n</div>\n\n<div class=\"content_wrapper\">\n\n	<div class=\"add_button\">\n		<div class=\"add_button_innards\"></div>\n	</div>\n	\n\n	<div id=\"scrollDiscussionSidebar\" class=\"scroll_wrapper\">\n		<div id=\"scroller\">\n		";
    foundHelper = helpers.announcements;
    stack1 = foundHelper || depth0.announcements;
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n\n		</div><!--end #scroller-->	\n	</div><!--end #scrollDiscussionSidebar-->\n	\n	<div id=\"announcements-body\">\n	";
    foundHelper = helpers.announcement_list;
    stack1 = foundHelper || depth0.announcement_list;
    stack2 = helpers['if'];
    tmp1 = self.program(4, program4, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(6, program6, data);
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n	</div>\n\n\n</div><!--end #content_wrapper-->	";
    return buffer;});
});
window.require.register("views/templates/assignmentGroup", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n		";
    foundHelper = helpers.has_submission;
    stack1 = foundHelper || depth0.has_submission;
    stack2 = helpers['if'];
    tmp1 = self.program(2, program2, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(4, program4, data);
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		";
    return buffer;}
  function program2(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n			<div id=\"student_thumb\" data-id=\"";
    foundHelper = helpers.assignment_url;
    stack1 = foundHelper || depth0.assignment_url;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "assignment_url", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"assignment-student-thumb has-submitted\" style=\"background-image:url('";
    foundHelper = helpers.student_image_small;
    stack1 = foundHelper || depth0.student_image_small;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student_image_small", { hash: {} }); }
    buffer += escapeExpression(stack1) + "')\">\n				<div class=\"assignment-check\"></div>\n				<p>";
    foundHelper = helpers.student_name_first;
    stack1 = foundHelper || depth0.student_name_first;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student_name_first", { hash: {} }); }
    buffer += escapeExpression(stack1) + "<br>";
    foundHelper = helpers.student_name_last;
    stack1 = foundHelper || depth0.student_name_last;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student_name_last", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n			</div>\n		";
    return buffer;}

  function program4(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n			<div id=\"student_thumb\" data-id=\"\" class=\"assignment-student-thumb\" style=\"background-image:url('";
    foundHelper = helpers.student_image_small;
    stack1 = foundHelper || depth0.student_image_small;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student_image_small", { hash: {} }); }
    buffer += escapeExpression(stack1) + "')\">\n				<p>";
    foundHelper = helpers.student_name_first;
    stack1 = foundHelper || depth0.student_name_first;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student_name_first", { hash: {} }); }
    buffer += escapeExpression(stack1) + "<br>";
    foundHelper = helpers.student_name_last;
    stack1 = foundHelper || depth0.student_name_last;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student_name_last", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n			</div>		\n		";
    return buffer;}

    buffer += "<div class=\"header drop_shadow\">\n	<div id=\"back-button\"></div>\n	Assignment\n	<div id=\"iosbutton\" class=\"button-right help\">?</div>\n</div>\n\n<div class=\"content_wrapper\">\n	<div class=\"add_button\" data-intro=\"Create units, lessons and assignments; add media, documents and more.\" data-position=\"left\">\n		<div class=\"add_button_innards\"></div>\n	</div>\n	\n	<div class=\"section group-shadow\">\n		<div id=\"assignment-header\">\n			<h1>";
    foundHelper = helpers.assignment;
    stack1 = foundHelper || depth0.assignment;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.title);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "assignment.title", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h1>\n			<p class=\"subheader\">";
    foundHelper = helpers.assignment;
    stack1 = foundHelper || depth0.assignment;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.notes);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "assignment.notes", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n		</div>\n	</div>\n	\n	<div class=\"absolute under help-assignment\" data-intro=\"Students assigned. A pencil symbol will be seen here on assignment submission.\" data-position=\"right\"></div> \n	\n	<div id=\"scrollAssignmentGroup\" class=\"scroll_wrapper\">\n		<div id=\"scroller\">\n		";
    foundHelper = helpers.assignment;
    stack1 = foundHelper || depth0.assignment;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.student_list);
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n\n		</div>\n	</div>\n</div>";
    return buffer;});
});
window.require.register("views/templates/assignmentRead", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<div class=\"item-header drop_shadow\">\n	<div class=\"item-header-close navbar-close\"></div>\n	Phoebe Caulfield\n</div>\n\n<div class=\"content_wrapper\">\n\n	<div id=\"scrollElement\" class=\"scroll_wrapper\">\n		<div id=\"scroller\">\n\n		</div>\n	</div>\n</div>";});
});
window.require.register("views/templates/assignments", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n			";
    foundHelper = helpers.assignments;
    stack1 = foundHelper || depth0.assignments;
    stack2 = helpers.each;
    tmp1 = self.program(2, program2, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			";
    return buffer;}
  function program2(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "	\n			<div data-id=";
    foundHelper = helpers.element_id;
    stack1 = foundHelper || depth0.element_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + " class=\"assignments-thumb item\">\n				<div class=\"assignments-thumb-title\">";
    foundHelper = helpers.element_name;
    stack1 = foundHelper || depth0.element_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</div>\n				<div class=\"assignments-thumb-date\">";
    foundHelper = helpers.date_due;
    stack1 = foundHelper || depth0.date_due;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "date_due", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</div>\n			</div>	\n			";
    return buffer;}

  function program4(depth0,data) {
    
    
    return "\n			<div id=\"empty\">\n				<div class=\"empty-set set-assignment\"></div>\n				<h4>No Current Assignments</h4>\n				<p>Use the Add button to create a new one.</p>\n			</div>\n		";}

    buffer += "<div class=\"header drop_shadow\">\n	<div id=\"menu_button\"></div>\n	Assignments\n	<div id=\"iosbutton\" class=\"button-right new\">New Assignment</div>\n\n</div>\n\n<div class=\"content_wrapper\">\n	<div class=\"add_button\">\n		<div class=\"add_button_innards\"></div>\n	</div>\n	\n	<div id=\"scrollElement\" class=\"scroll_wrapper\">\n		<div id=\"scroller\">	\n		";
    foundHelper = helpers.assignments;
    stack1 = foundHelper || depth0.assignments;
    stack2 = helpers['if'];
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(4, program4, data);
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "						\n		</div>\n	</div>\n	\n</div>";
    return buffer;});
});
window.require.register("views/templates/bookmarks", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n		\n		";
    foundHelper = helpers.bookmarks;
    stack1 = foundHelper || depth0.bookmarks;
    stack2 = helpers.each;
    tmp1 = self.program(2, program2, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		\n		";
    return buffer;}
  function program2(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "	\n		<div class=\"bookmark-container\">\n			<div data-id=\"";
    foundHelper = helpers.bookmark_id;
    stack1 = foundHelper || depth0.bookmark_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "bookmark_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"bookmark-delete hide\"></div>\n			<div data-id=\"";
    foundHelper = helpers.bookmark_id;
    stack1 = foundHelper || depth0.bookmark_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "bookmark_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" data-urls=\"";
    foundHelper = helpers.bookmark_url;
    stack1 = foundHelper || depth0.bookmark_url;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "bookmark_url", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"bookmarks-thumb\">		\n				<div class=\"bookmarks-thumb-icon\"></div>\n				<div class=\"bookmarks-thumb-title\">Bookmark</div>\n				<div class=\"bookmarks-thumb-url\">";
    foundHelper = helpers.bookmark_url;
    stack1 = foundHelper || depth0.bookmark_url;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "bookmark_url", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</div>\n			</div>\n		</div>\n		";
    return buffer;}

  function program4(depth0,data) {
    
    
    return "\n		<div id=\"empty\">\n			<div class=\"empty-set set-bookmarks\"></div>\n			<h4>Add New Bookmarks</h4>\n			<p>Tap the button in the top right to create new bookmarks.</p>\n		</div>\n		";}

    buffer += "<div class=\"header drop_shadow\">\n	<div id=\"menu_button\"></div>\n	<div id=\"iosbutton\" class=\"button-right edit-bookmark\">Edit</div>\n	<div id=\"iosbutton\" class=\"button-right new-bookmark\" data-intro=\"Tap to navigate to a website, then press the book icon to bookmark.\" data-position=\"bottom\">New Bookmark</div>\n	<div id=\"iosbutton\" class=\"button-right help\">?</div>\n	Bookmarks\n</div>\n\n<div class=\"content_wrapper\">\n\n	<div class=\"add_button\" data-intro=\"Create units, lessons and assignments; add media, documents and more.\" data-position=\"left\">\n		<div class=\"add_button_innards\"></div>\n	</div>\n	\n	<div class=\"absolute under help-bookmarks\" data-intro=\"Bookmarks you save will appear here.\" data-position=\"bottom\"></div>\n	\n	<div id=\"scrollElement\" class=\"scroll_wrapper\">\n		<div id=\"scroller\">\n		\n		";
    foundHelper = helpers.bookmarks;
    stack1 = foundHelper || depth0.bookmarks;
    stack2 = helpers['if'];
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(4, program4, data);
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n							\n		</div>\n	</div>\n	\n</div><!--end .content_wrapper-->\n\n\n";
    return buffer;});
});
window.require.register("views/templates/element", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<div class=\"header drop_shadow\">\n	<div id=\"menu_button\"></div>\n	Learning Object\n	<div class=\"header_buttons\">\n		<div id=\"delete\" class=\"header_button\"></div>\n		<div id=\"duplicate\" class=\"header_button\"></div>\n	</div>\n</div>\n\n<div id=\"element_page\" class=\"content_wrapper\">\n	<div id=\"scrollElement\" class=\"scroll_wrapper\">\n		<div id=\"scroller\">\n			\n		</div>\n	</div>\n</div>";});
});
window.require.register("views/templates/element_overlay_assignment", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, foundHelper, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


    buffer += "<div class=\"item-header drop_shadow\">\n	<div id=\"back-button\" class=\"dark-back\"></div>\n	";
    foundHelper = helpers.assignment;
    stack1 = foundHelper || depth0.assignment;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.title);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "assignment.title", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\n</div>\n\n<div class=\"item-container\">\n	\n	<div class=\"pdf-element\">	\n			<div class=\"element-thumb assignment-icon\"></div>\n			<div class=\"assignment-element-details\">		\n				<h3>";
    foundHelper = helpers.assignment;
    stack1 = foundHelper || depth0.assignment;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.title);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "assignment.title", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</a></h3>\n				<div class=\"pdf-element-description\">\n					<p>";
    foundHelper = helpers.assignment;
    stack1 = foundHelper || depth0.assignment;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.notes);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "assignment.notes", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n				</div>\n				<div id=\"uploadAssignment\" class=\"chunky upload\">Upload</div>\n				<div id=\"success-btn-group\" class=\"hide\">\n					<div id=\"uploadAssignment\" class=\"chunky upload-sm\">&nbsp;</div>\n					<div id=\"reviewAssignment\" class=\"chunky assignment-review\">Review</div>\n					<div id=\"submitAssignment\" class=\"chunky assignment-submit\">Submit</div>\n				</div>	\n			</div>	\n	</div><!--end .pdf-element-->\n</div><!--end .item-container-->";
    return buffer;});
});
window.require.register("views/templates/element_overlay_link", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, foundHelper, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


    buffer += "<div class=\"item-header drop_shadow\">\n	<div id=\"back-button\" class=\"dark-back\"></div>\n</div>\n\n<div id=\"elementLink\" class=\"item-container\">\n	\n	<div class=\"pdf-element\">	\n			<div class=\"element-thumb link-icon\"></div>\n			<div class=\"pdf-element-details\">		\n				<h3><a href=\"";
    foundHelper = helpers.share_link;
    stack1 = foundHelper || depth0.share_link;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.url);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "share_link.url", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\">";
    foundHelper = helpers.share_link;
    stack1 = foundHelper || depth0.share_link;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.title);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "share_link.title", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</a></h3>\n				<div class=\"pdf-element-description\">\n					<p>";
    foundHelper = helpers.share_link;
    stack1 = foundHelper || depth0.share_link;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.notes);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "share_link.notes", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n				</div>\n				<div id=\"openLink\" class=\"chunky outgoing\">Open</div>	\n				<span><a href=\"\">";
    foundHelper = helpers.share_link;
    stack1 = foundHelper || depth0.share_link;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.link_url);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "share_link.link_url", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</a></span>	\n			</div>	\n	</div><!--end .pdf-element-->\n</div><!--end #elementLink-->";
    return buffer;});
});
window.require.register("views/templates/element_overlay_pdf", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, foundHelper, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


    buffer += "<div class=\"item-header drop_shadow\">\n	<div id=\"back-button\" class=\"dark-back\"></div>\n</div>\n	\n<div id=\"elementPDF\" class=\"item-container\">\n	<div class=\"pdf-element\">\n		<div class=\"element-thumb pdf-icon\"></div>\n		<div class=\"pdf-element-details\">		\n			<h3>";
    foundHelper = helpers.pdf;
    stack1 = foundHelper || depth0.pdf;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.title);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "pdf.title", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h3>\n			<div class=\"pdf-element-description\">\n				<p>";
    foundHelper = helpers.pdf;
    stack1 = foundHelper || depth0.pdf;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.notes);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "pdf.notes", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n			</div>\n			<div id=\"openPdf\" class=\"chunky outgoing\">Open</div>		\n		</div>\n	</div><!--end .pdf-element-->\n\n</div><!--end #elementPDF-->";
    return buffer;});
});
window.require.register("views/templates/element_overlay_socrative", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, foundHelper, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


    buffer += "<div class=\"item-header drop_shadow\">\n	<div id=\"back-button\" class=\"dark-back\"></div>\n</div>\n\n<div id=\"socrativeLink\" class=\"item-container\">\n	\n	<div class=\"pdf-element\">	\n			<div class=\"element-thumb socrative-icon\"></div>\n			<div class=\"pdf-element-details\">		\n				<h3>";
    foundHelper = helpers.socrative;
    stack1 = foundHelper || depth0.socrative;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.title);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "socrative.title", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</a></h3>\n				<div class=\"pdf-element-description\">\n					<p>";
    foundHelper = helpers.socrative;
    stack1 = foundHelper || depth0.socrative;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.notes);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "socrative.notes", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n				</div>\n				<div id=\"openSocrative\" class=\"chunky outgoing\">Open</div>	\n			</div>	\n	</div><!--end .pdf-element-->\n</div><!--end #elementLink-->";
    return buffer;});
});
window.require.register("views/templates/element_photo", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, foundHelper, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


    buffer += "<div class=\"item-header drop_shadow\">\n	<div id=\"back-button\" class=\"dark-back\"></div>\n</div>\n\n<div id=\"elementPhoto\" class=\"overlay_modal content_wrapper\">\n	\n	<div id=\"scrollPhoto\" class=\"scroll_wrapper\">\n		<div id=\"scroller\">\n\n			<div class=\"photo-element\">	\n				<div class=\"photo-element-container\"><!--element icon-->\n				\n					<div class=\"photo-element-details\">		\n						<div class=\"element-thumb photo-icon\"></div>\n						<h3>";
    foundHelper = helpers.photo;
    stack1 = foundHelper || depth0.photo;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.title);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "photo.title", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h3>\n						<div class=\"photo-element-description\">\n							<p>";
    foundHelper = helpers.photo;
    stack1 = foundHelper || depth0.photo;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.notes);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "photo.notes", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n						</div>		\n					</div>\n					\n					<div class=\"photo-element-image\">\n						<img src=\"";
    foundHelper = helpers.photo;
    stack1 = foundHelper || depth0.photo;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.photo_url);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "photo.photo_url", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\">\n					</div>\n					\n				</div><!--end .photo-element-container-->	\n			</div><!--end .photo-element-->\n	\n		</div>\n	</div>\n	\n</div><!--end #elementPhoto-->\n";
    return buffer;});
});
window.require.register("views/templates/element_video", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<div class=\"item-header drop_shadow\">\n	<div id=\"back-button\" class=\"dark-back\"></div>\n</div>\n\n<div id=\"elementVideo\" class=\"overlay_modal content_wrapper\">\n	\n	<div class=\"video-element\">	\n		<div class=\"element-thumb video-icon\"></div><!--element icon-->\n		\n		<div class=\"video-element-container\">\n			<div class=\"video-element-movie\"></div>\n			<div class=\"video-element-details\">		\n				<h3>Scientist Films First Footage Of A Giant Squid</h3>\n				<div class=\"video-element-description\">\n					<p>The Kraken is real. For thousands of years, sailors have told stories of giant squids. In myth and cinema, the kraken was the most terrible of sea monsters. Now, it’s been captured on video for the first time ever.</p>\n				</div>		\n			</div>	\n		</div><!--end .video-element-container-->	\n		\n	</div><!--end .video-element-->\n</div><!--end #elementVideo-->";});
});
window.require.register("views/templates/formAddGroup", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "	\n		";
    foundHelper = helpers.group_list;
    stack1 = foundHelper || depth0.group_list;
    stack2 = helpers.each;
    tmp1 = self.program(2, program2, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			";
    return buffer;}
  function program2(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n			<div id=\"";
    foundHelper = helpers.group_id;
    stack1 = foundHelper || depth0.group_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "group_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"add-group-thumb item unchecked ";
    foundHelper = helpers.is_member;
    stack1 = foundHelper || depth0.is_member;
    stack2 = helpers['if'];
    tmp1 = self.program(3, program3, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\">\n			";
    foundHelper = helpers.is_member;
    stack1 = foundHelper || depth0.is_member;
    stack2 = helpers['if'];
    tmp1 = self.program(5, program5, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n				<div class=\"group_thumb_image\" style=\"background-image:url(";
    foundHelper = helpers.group_image;
    stack1 = foundHelper || depth0.group_image;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "group_image", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\"></div>\n				<div class=\"add-group-thumb-name\">";
    foundHelper = helpers.group_name;
    stack1 = foundHelper || depth0.group_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "group_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</div>\n				<div class=\"add-group-thumb-count\">";
    foundHelper = helpers.student_count;
    stack1 = foundHelper || depth0.student_count;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student_count", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</div>\n			</div>\n			";
    return buffer;}
  function program3(depth0,data) {
    
    
    return " checked ";}

  function program5(depth0,data) {
    
    
    return "<div class=\"group-check\"></div>";}

    buffer += "<div class=\"item-header drop_shadow\">\n	<div id=\"back-button\" class=\"dark-back\"></div>\n</div>\n\n<div id=\"addGroup_page\" class=\"item-wrapper\">\n	<h1 class=\"unit-header\">Change Lesson Visibility</h1>\n	<h3>Groups</h3>\n	\n	<div id=\"overlayScroller3\" class=\"scroll_wrapper\">\n		<div id=\"scroller\">\n		";
    foundHelper = helpers.groups;
    stack1 = foundHelper || depth0.groups;
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		</div>\n	</div>\n		\n	<div class=\"overlay_submit element-button lesson-group\">Done</div>\n\n</div>\n";
    return buffer;});
});
window.require.register("views/templates/formAddStudent", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n				";
    foundHelper = helpers.student_list;
    stack1 = foundHelper || depth0.student_list;
    stack2 = helpers.each;
    tmp1 = self.program(2, program2, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n				";
    return buffer;}
  function program2(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n				<div id=\"";
    foundHelper = helpers.student_id;
    stack1 = foundHelper || depth0.student_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"student_thumb unchecked ";
    foundHelper = helpers.student_grouped;
    stack1 = foundHelper || depth0.student_grouped;
    stack2 = helpers['if'];
    tmp1 = self.program(3, program3, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\" style=\"background-image:url(";
    foundHelper = helpers.student_image_small;
    stack1 = foundHelper || depth0.student_image_small;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student_image_small", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\">\n					";
    foundHelper = helpers.student_grouped;
    stack1 = foundHelper || depth0.student_grouped;
    stack2 = helpers['if'];
    tmp1 = self.program(5, program5, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n					<p>";
    foundHelper = helpers.student_name_first;
    stack1 = foundHelper || depth0.student_name_first;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student_name_first", { hash: {} }); }
    buffer += escapeExpression(stack1) + "<br>";
    foundHelper = helpers.student_name_last;
    stack1 = foundHelper || depth0.student_name_last;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student_name_last", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n				</div>\n				";
    return buffer;}
  function program3(depth0,data) {
    
    
    return " checked ";}

  function program5(depth0,data) {
    
    
    return "<div class=\"student-check\"></div>";}

    buffer += "<div class=\"item-header drop_shadow\">\n	<div class=\"item-header-close navbar-close\"></div>\n</div>\n\n<div id=\"addStudent_page\" class=\"item-wrapper content_wrapper\">\n	<div id=\"item-container\">\n		<h1 class=\"unit-header\">Add Students to Group</h1>\n		<div class=\"overlay_left\">\n		</div>	\n		<div id=\"overlayScroller5\" class=\"scroll_wrapper\">\n			<div id=\"scroller\">\n				\n				";
    foundHelper = helpers.groups;
    stack1 = foundHelper || depth0.groups;
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n				\n			</div>\n		</div>\n		<div class=\"overlay_submit element-button add-student-group\">Submit</div>\n	</div>>\n</div>";
    return buffer;});
});
window.require.register("views/templates/formAnnouncement", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n			";
    foundHelper = helpers.group_list;
    stack1 = foundHelper || depth0.group_list;
    stack2 = helpers['if'];
    tmp1 = self.program(2, program2, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(5, program5, data);
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			";
    return buffer;}
  function program2(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "	\n			";
    foundHelper = helpers.group_list;
    stack1 = foundHelper || depth0.group_list;
    stack2 = helpers.each;
    tmp1 = self.program(3, program3, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			\n			";
    return buffer;}
  function program3(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n				<div id=\"";
    foundHelper = helpers.group_id;
    stack1 = foundHelper || depth0.group_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "group_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" data-id=\"";
    foundHelper = helpers.group_id;
    stack1 = foundHelper || depth0.group_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "group_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"group-option\">";
    foundHelper = helpers.group_name;
    stack1 = foundHelper || depth0.group_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "group_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</div>\n			";
    return buffer;}

  function program5(depth0,data) {
    
    
    return "\n				<p>You currently don't have any groups created.</p>\n			";}

    buffer += "<div class=\"item-header drop_shadow\">\n	<div id=\"back-button\" class=\"dark-back\"></div>\n</div>\n\n<div id=\"announcement_page\" class=\"item-wrapper\">\n	<h1 class=\"unit-header\">Make an Announcement</h1>\n\n	<h3>Title</h3>\n	<input id=\"announcement_title\" maxlength=\"30\"></input>\n		\n	<h3>Announcement</h3>\n	<textarea id=\"announcement_body\" maxlength=\"140\"></textarea>	\n	\n	<div id=\"lesson-scroller-title\">\n		<h3>Select Group</h3>\n	</div>\n	\n	<div id=\"overlayScroller4\" class=\"scroll_wrapper\">\n		<div id=\"scroller\">	\n		<div id=\"ALL\" data-id=\"ALL\" class=\"group-option\">All Students</div>\n			";
    foundHelper = helpers.teacher_groups;
    stack1 = foundHelper || depth0.teacher_groups;
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		</div>\n	</div>\n	<div class=\"overlay_submit element-button submit-right\">Create</div>\n</div>\n\n";
    return buffer;});
});
window.require.register("views/templates/formInputStudent", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<div class=\"item-header drop_shadow\">\n	<div id=\"back-button\" class=\"dark-back\"></div>\n</div>\n\n<div id=\"inputStudent_page\" class=\"item-wrapper content_wrapper\">\n	<div id=\"item-container\">\n		<h1 class=\"unit-header\">Add Students</h1>\n		\n		<h3>First Name</h3>\n		<input id=\"addFirst\" maxlength=\"30\" spellcheck=\"false\" autocorrect=\"off\"></input>\n		\n		<h3>Last Name</h3>\n		<input id=\"addLast\" maxlength=\"30\" spellcheck=\"false\" autocorrect=\"off\"></input>\n		\n		<p>Have more than a few students to add? <br>\n			<a href=\"mailto:albert@hmsteach.com?subject=Add more students for me!\">Send us an email</a> and we'll be happy to add them for you.\n		</p>	\n\n		<div id=\"addStudent\" class=\"overlay_submit element-button input-student\">Add Student</div>\n	</div>\n</div>";});
});
window.require.register("views/templates/formNewAssignment", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n					<div data-id=\"";
    foundHelper = helpers.unit_id;
    stack1 = foundHelper || depth0.unit_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\"> <option value=";
    foundHelper = helpers.unit_id;
    stack1 = foundHelper || depth0.unit_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + ">";
    foundHelper = helpers.unit_name;
    stack1 = foundHelper || depth0.unit_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</option> </div>\n				";
    return buffer;}

    buffer += "<div id=\"element-view-cover\"></div>\n\n<div class=\"item-header drop_shadow\">\n	<div id=\"back-button\" class=\"dark-back\"></div>\n</div>\n\n<div id=\"newElement_page\" class=\"overlay_modal content_wrapper\">\n	\n	<div class=\"element-container\">\n\n		<h2>Add Assignment</h2>\n		\n		<div id=\"element-wrapper\">\n		\n			<div class=\"element-details\">\n				<div class=\"inline-label\">Due Date</div>	\n				 <label class=\"detail-form\">\n				   <input id=\"assignment_date\" type=\"date\">\n				</label>\n			\n			    <label class=\"detail-form\">\n				    <input id=\"assignment_title\" placeholder=\"Title\" type=\"text\">\n				</label>\n				\n				<label class=\"detail-form\">\n					<textarea class=\"tall-textarea\" placeholder=\"Description\" id=\"assignment_notes\"></textarea>\n				</label>	\n			</div>\n		</div>\n		\n		<div id=\"dropdown-wrapper\">\n			<span>Select Unit</span>\n			<div class=\"active-select\">\n				<select id=\"unitSelect\">\n				<option>Please Select a Unit</option>\n				\n				";
    foundHelper = helpers.unit_list;
    stack1 = foundHelper || depth0.unit_list;
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n				</select>\n			</div>\n			\n			<span>Select Lesson</span>\n			<div id=\"lessonField\" class=\"disabled-select\">\n				<select id=\"lessonSelect\">\n					<option>Please Select a Lesson</option>\n				</select>\n			</div>		\n		</div>\n		\n		<div id=\"submit\" class=\"chunky add\">Add</div>\n		\n	</div><!--end container-->\n</div>";
    return buffer;});
});
window.require.register("views/templates/formNewElement", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<div class=\"item-header drop_shadow\">\n	<div id=\"back-button\" class=\"dark-back\"></div>\n	<div id=\"iosbutton\" class=\"iosdark button-right help\">?</div>\n</div>\n\n<div id=\"newElement_page\" class=\"item-wrapper content_wrapper\">\n	<div id=\"item-container\">\n		<div id=\"element-blocks\">\n			<h1>Add an Item</h1>\n			\n			<div id=\"item-top-row\">\n				<div id=\"unit\" class=\"add-item item-unit\" data-intro=\"Start by creating a unit. Units will contain your new lessons.\" data-position=\"top\"><span>Unit</span></div>	\n				<div id=\"lesson\" class=\"add-item item-lesson\"><span>Lesson</span></div>	\n				<div class=\"add-item item-element\"><span>Element</span></div>\n				<div id=\"group\" class=\"add-item item-group\" data-intro=\"Group students to individualize lessons and specify who sees your material.\" data-position=\"top\"><span>Group</span></div>\n			</div>\n			\n			<div id=\"item-bottom-row\" data-intro=\"Elements are the building blocks for your lessons. Pull digital content into the app for students to view and interact with.\" data-position=\"top\">\n				<div class=\"caret\"><img src=\"images/caret.png\" width=\"42\" height=\"21\"></div>\n				\n				<div id=\"scrollNewElements\">\n					<div id=\"add-element-sm-wrapper\">\n						<div class=\"add-element-container\">\n							<div id=\"photo\" class=\"add-element-sm\"></div>\n							<span>Photo</span>\n						</div>\n						<div class=\"add-element-container\">\n							<div id=\"video\" class=\"add-element-sm\"></div>\n							<span>Video</span>\n						</div>\n						<div class=\"add-element-container\">\n							<div id=\"link\" class=\"add-element-sm\"></div>\n							<span>Link</span>\n						</div>\n						<div class=\"add-element-container\">\n							<div id=\"pdf\" class=\"add-element-sm\"></div>\n							<span>Document</span>\n						</div>\n						<div class=\"add-element-container\">\n							<div id=\"assignment\" class=\"add-element-sm\"></div>\n							<span>Assignment</span>\n						</div>\n						<div class=\"add-element-container\">\n							<div id=\"socrative\" class=\"add-element-sm\"></div>\n							<span>Poll</span>\n						</div>\n					</div>\n				</div>		\n			</div>	\n			\n		</div>\n	</div>\n</div>";});
});
window.require.register("views/templates/formNewGroup", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n			";
    foundHelper = helpers.student_list;
    stack1 = foundHelper || depth0.student_list;
    stack2 = helpers.each;
    tmp1 = self.program(2, program2, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			";
    return buffer;}
  function program2(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n			<div id= \"";
    foundHelper = helpers.student_id;
    stack1 = foundHelper || depth0.student_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"student_thumb\" style=\"background-image:url(";
    foundHelper = helpers.student_image_small;
    stack1 = foundHelper || depth0.student_image_small;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student_image_small", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\">\n				<p>";
    foundHelper = helpers.student_name_first;
    stack1 = foundHelper || depth0.student_name_first;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student_name_first", { hash: {} }); }
    buffer += escapeExpression(stack1) + "<br>";
    foundHelper = helpers.student_name_last;
    stack1 = foundHelper || depth0.student_name_last;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student_name_last", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n			</div>\n			";
    return buffer;}

    buffer += "<div class=\"item-header drop_shadow\">\n	<div id=\"back-button\" class=\"dark-back\"></div>\n</div>\n\n<div id=\"newElement_page\" class=\"item-wrapper content_wrapper\">\n	<div id=\"item-container\">\n		<h1 class=\"unit-header\">Create a New Group</h1>\n			<h3>Upload Photo</h3>\n			<div id=\"picker\" style=\"background:url('');\"></div>\n			<div class=\"upload-floater\">\n				<div id=\"upload\" class=\"select-button\">Select Image</div>\n			</div>\n			<div class=\"clear\"></div>\n		\n			<h3>Group Name</h3>\n			<input id=\"group_name\" spellcheck=\"false\" maxlength=\"44\"></textarea>\n		</div>	\n		\n		<div id=\"groups-scroller-title\">\n			<h3>Add Students</h3>\n		</div>\n		<div id=\"overlayScroller2\" class=\"scroll_wrapper\">\n			<div id=\"scroller\">\n			";
    foundHelper = helpers.groups;
    stack1 = foundHelper || depth0.groups;
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			</div>\n		</div>\n		<div class=\"overlay_submit element-button\">Create</div>\n	</div>\n</div>";
    return buffer;});
});
window.require.register("views/templates/formNewLesson", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n				<div data-id=\"";
    foundHelper = helpers.unit_id;
    stack1 = foundHelper || depth0.unit_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\">\n					<option value=";
    foundHelper = helpers.unit_id;
    stack1 = foundHelper || depth0.unit_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + ">";
    foundHelper = helpers.unit_name;
    stack1 = foundHelper || depth0.unit_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</option>\n				</div>\n				";
    return buffer;}

  function program3(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n			";
    foundHelper = helpers.group_list;
    stack1 = foundHelper || depth0.group_list;
    stack2 = helpers['if'];
    tmp1 = self.program(4, program4, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(7, program7, data);
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			";
    return buffer;}
  function program4(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "	\n			";
    foundHelper = helpers.group_list;
    stack1 = foundHelper || depth0.group_list;
    stack2 = helpers.each;
    tmp1 = self.program(5, program5, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			\n			";
    return buffer;}
  function program5(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n				<div id=\"";
    foundHelper = helpers.group_id;
    stack1 = foundHelper || depth0.group_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "group_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" data-id=\"";
    foundHelper = helpers.group_id;
    stack1 = foundHelper || depth0.group_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "group_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"group-option\">";
    foundHelper = helpers.group_name;
    stack1 = foundHelper || depth0.group_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "group_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</div>\n			";
    return buffer;}

  function program7(depth0,data) {
    
    
    return "\n				<p>You currently don't have any groups created.</p>\n			";}

    buffer += "<div class=\"item-header drop_shadow\">\n	<div id=\"back-button\" class=\"dark-back\"></div>\n</div>\n\n<div id=\"newElement_page\" class=\"item-wrapper\">\n	<h1 class=\"unit-header\">Create a New Lesson</h1>	\n	\n	<h3>Upload Photo</h3>\n	<div id=\"picker\" style=\"background:url('');\"></div>\n	<div class=\"upload-floater\">\n		<div id=\"upload\" class=\"select-button\">Select Image</div>\n	</div>\n	\n	<div class=\"clear\"></div>\n	\n	<h3>Title</h3>\n	<input id=\"lesson_title\" maxlength=\"30\"></input>\n\n	<div class=\"unit-select\">\n		<div class=\"arrow\"></div>\n		<!--<div class=\"text\">Please Select a Unit</div>-->\n		<select id=\"unitSelect\">\n			<option>Please Select a Unit</option>		\n				";
    foundHelper = helpers.units;
    stack1 = foundHelper || depth0.units;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.unit_list);
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "				\n		</select>\n	</div>\n	\n	<h3>Description</h3>\n	<textarea id=\"lesson_description\" maxlength=\"140\"></textarea>	\n	\n	<div id=\"lesson-scroller-title\">\n		<h3>Assign Group to Lesson</h3>\n	</div>\n	\n	<div id=\"overlayScroller4\" class=\"scroll_wrapper\">\n		<div id=\"scroller\">	\n			";
    foundHelper = helpers.groups;
    stack1 = foundHelper || depth0.groups;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.teacher_groups);
    stack2 = helpers.each;
    tmp1 = self.program(3, program3, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		</div>\n	</div>\n	<div class=\"overlay_submit element-button submit-right\">Create</div>\n</div>";
    return buffer;});
});
window.require.register("views/templates/formNewLink", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n					<div data-url=\"";
    foundHelper = helpers.bookmark_url;
    stack1 = foundHelper || depth0.bookmark_url;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "bookmark_url", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" data-id=\"";
    foundHelper = helpers.bookmark_id;
    stack1 = foundHelper || depth0.bookmark_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "bookmark_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\"> <option>";
    foundHelper = helpers.bookmark_url;
    stack1 = foundHelper || depth0.bookmark_url;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "bookmark_url", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</option> </div>\n				";
    return buffer;}

  function program3(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n					<div data-id=\"";
    foundHelper = helpers.unit_id;
    stack1 = foundHelper || depth0.unit_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\"> <option value=";
    foundHelper = helpers.unit_id;
    stack1 = foundHelper || depth0.unit_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + ">";
    foundHelper = helpers.unit_name;
    stack1 = foundHelper || depth0.unit_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</option> </div>\n				";
    return buffer;}

    buffer += "<div id=\"element-view-cover\"></div>\n\n<div class=\"item-header drop_shadow\">\n	<div id=\"back-button\" class=\"dark-back\"></div>\n	<div id=\"iosbutton\" class=\"iosdark button-right help\">?</div>\n</div>\n\n<div id=\"newElement_page\" class=\"overlay_modal content_wrapper\">\n\n	<div class=\"element-container\">\n\n		<h2 style=\"margin-bottom: -10px;\">Add Link</h2>\n\n		<div id=\"element-wrapper\">\n			<div id=\"picker\" style=\"background:url('');\"></div>\n\n			<div class=\"element-details\">\n			    <label class=\"detail-form\">\n				    <input id=\"link_title\" placeholder=\"Title\" type=\"text\">\n				</label>\n\n				<label class=\"detail-form\">\n					<textarea placeholder=\"Description\" id=\"link_notes\"></textarea>\n				</label>	\n			</div>\n		</div>\n\n		<div class=\"clear\"></div>\n		\n		\n		<div class=\"element-details\">	\n			<span>Website URL</span>		\n			<label class=\"detail-form\" data-intro=\"Type the website's address and tap Launch. Pressing Done will link to the page on your screen.\" data-position=\"top\">\n				<input id=\"link_custom\" autocapitalize=\"off\" placeholder=\"http://www.google.com\"  type=\"text\">\n			</label>\n		</div>\n		\n		<div id=\"link_launch\" class=\"slim launch\">Launch</div>\n		<!--<div id=\"link_bookmark\" class=\"slim bookmark\">&nbsp;</div>-->\n		<div class=\"clear\"></div>\n		\n		<div class=\"bookmark-select\">\n			<select id=\"bookmarkSelect\" data-intro=\"For faster access you can link to already bookmarked websites.\" data-position=\"right\">\n				<option>Select from Bookmarks</option>\n				";
    foundHelper = helpers.bookmarks;
    stack1 = foundHelper || depth0.bookmarks;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.bookmarks);
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			</select>\n		</div>\n	\n		<div id=\"dropdown-wrapper\">\n					\n			<span>Select Unit</span>\n			<div class=\"active-select\">\n				<select id=\"unitSelect\">\n				<option>Please Select a Unit</option>\n\n				";
    foundHelper = helpers.units;
    stack1 = foundHelper || depth0.units;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.unit_list);
    stack2 = helpers.each;
    tmp1 = self.program(3, program3, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n				</select>\n			</div>\n\n			<span>Select Lesson</span>\n			<div id=\"lessonField\" class=\"disabled-select\">\n				<select id=\"lessonSelect\">\n					<option>Please Select a Lesson</option>\n				</select>\n			</div>		\n		</div>\n\n		<div id=\"submit\" class=\"chunky add\">Add</div>\n\n	</div><!--end container-->\n</div>";
    return buffer;});
});
window.require.register("views/templates/formNewPdf", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n						<div data-id=\"";
    foundHelper = helpers.unit_id;
    stack1 = foundHelper || depth0.unit_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\"> <option value=";
    foundHelper = helpers.unit_id;
    stack1 = foundHelper || depth0.unit_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + ">";
    foundHelper = helpers.unit_name;
    stack1 = foundHelper || depth0.unit_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</option> </div>\n					";
    return buffer;}

    buffer += "<div class=\"item-header drop_shadow\">\n	<div id=\"back-button\" class=\"dark-back\"></div>\n</div>\n\n<div id=\"newElement_page\" class=\"overlay_modal content_wrapper\">\n	\n	<div class=\"element-container\">\n		<h2>Add Document</h2>\n		<div class=\"document-types\">PDF, Word, PowerPoint, Excel, Pages, Keynote, Numbers</div>\n		<div id=\"element-wrapper\">\n			<div id=\"picker\" style=\"background:url('');\"></div>\n		\n			<div class=\"element-details\">\n			    <label class=\"detail-form\">\n				    <input id=\"pdf_title\" placeholder=\"Title\" type=\"text\">\n				</label>\n				\n				<label class=\"detail-form\">\n					<textarea placeholder=\"Description\" id=\"pdf_notes\"></textarea>\n				</label>	\n			</div>\n		</div>\n		\n		<div class=\"static\">\n			<div id=\"upload\" class=\"chunky select\">Select</div>\n		</div>\n		\n		<div id=\"dropdown-wrapper\">\n		\n			<span>Select Unit</span>\n				<div class=\"active-select\">\n					<select id=\"unitSelect\">\n					<option>Please Select a Unit</option>\n\n					";
    foundHelper = helpers.unit_list;
    stack1 = foundHelper || depth0.unit_list;
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n					</select>\n				</div>\n			\n				<span>Select Lesson</span>\n				<div id=\"lessonField\" class=\"disabled-select\">\n					<select id=\"lessonSelect\">\n						<option>Please Select a Lesson</option>\n					</select>\n				</div>		\n			</div>\n		\n		<div class=\"add-button-group\">\n			<div id=\"submit\" class=\"chunky add\">Add</div>\n		</div>\n		\n	</div><!--end container-->\n\n</div>";
    return buffer;});
});
window.require.register("views/templates/formNewPhoto", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n					<div data-id=\"";
    foundHelper = helpers.unit_id;
    stack1 = foundHelper || depth0.unit_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\"> <option value=";
    foundHelper = helpers.unit_id;
    stack1 = foundHelper || depth0.unit_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + ">";
    foundHelper = helpers.unit_name;
    stack1 = foundHelper || depth0.unit_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</option> </div>\n				";
    return buffer;}

    buffer += "<div class=\"item-header drop_shadow\">\n	<div id=\"back-button\" class=\"dark-back\"></div>\n</div>\n\n<div id=\"newElement_page\" class=\"overlay_modal content_wrapper\">\n	<div class=\"element-container\">\n		\n		<h2>Add Photo</h2>\n		\n		<div id=\"element-wrapper\">\n			<div id=\"picker\" style=\"background:url('');\"></div>\n			\n			<div class=\"element-details\">\n			    <label class=\"detail-form\">\n				    <input id=\"photo_title\" placeholder=\"Title\" type=\"text\">\n				</label>\n				\n				<label class=\"detail-form\">\n					<textarea placeholder=\"Description\" id=\"photo_notes\"></textarea>\n				</label>	\n			</div>\n		</div>\n		\n		<div class=\"static\">\n			<div id=\"upload\" class=\"chunky select\">Select</div>\n		</div>\n		\n		<div id=\"dropdown-wrapper\">\n			<span>Select Unit</span>\n			<div class=\"active-select\">\n				<select id=\"unitSelect\">\n				<option>Please Select a Unit</option>\n				\n				";
    foundHelper = helpers.unit_list;
    stack1 = foundHelper || depth0.unit_list;
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n				</select>\n			</div>\n			\n			<span>Select Lesson</span>\n			<div id=\"lessonField\" class=\"disabled-select\">\n				<select id=\"lessonSelect\">\n					<option>Please Select a Lesson</option>\n				</select>\n			</div>		\n		</div>\n		\n		<div id=\"submit\" class=\"chunky add\">Add</div>\n		\n	</div><!--end container-->\n	\n</div>";
    return buffer;});
});
window.require.register("views/templates/formNewSocrative", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n					<div data-id=\"";
    foundHelper = helpers.unit_id;
    stack1 = foundHelper || depth0.unit_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\"> <option value=";
    foundHelper = helpers.unit_id;
    stack1 = foundHelper || depth0.unit_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + ">";
    foundHelper = helpers.unit_name;
    stack1 = foundHelper || depth0.unit_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</option> </div>\n				";
    return buffer;}

    buffer += "<div id=\"element-view-cover\"></div>\n\n<div class=\"item-header drop_shadow\">\n	<div id=\"back-button\" class=\"dark-back\"></div>\n</div>\n\n<div id=\"newElement_page\" class=\"overlay_modal content_wrapper\">\n	\n	<div class=\"element-container\">\n\n		<h2>Add Socrative Poll</h2>\n		\n		<div id=\"element-wrapper\">\n		\n			<div class=\"element-details\">\n			    <label class=\"detail-form\">\n				    <input id=\"socrative_title\" placeholder=\"Title\" type=\"text\">\n				</label>\n				\n				<label class=\"detail-form\">\n					<textarea placeholder=\"Description\" id=\"socrative_notes\"></textarea>\n				</label>	\n			</div>\n		</div>\n		\n		<div id=\"dropdown-wrapper\">\n			<span>Select Unit</span>\n			<div class=\"active-select\">\n				<select id=\"unitSelect\">\n				<option>Please Select a Unit</option>\n				\n				";
    foundHelper = helpers.unit_list;
    stack1 = foundHelper || depth0.unit_list;
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n				</select>\n			</div>\n			\n			<span>Select Lesson</span>\n			<div id=\"lessonField\" class=\"disabled-select\">\n				<select id=\"lessonSelect\">\n					<option>Please Select a Lesson</option>\n				</select>\n			</div>		\n		</div>\n		\n		<div id=\"submit\" class=\"chunky add\">Add</div>\n		\n	</div><!--end container-->\n</div>";
    return buffer;});
});
window.require.register("views/templates/formNewTest", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<div id=\"newElement_page\" class=\"overlay_modal content_wrapper\">\n	<h1>Create a New Unit</h1>\n	<div class=\"overlay_close\"></div>\n	<div class=\"overlay_left\">\n		<h3>Title</h3>\n		<textarea id=\"unit_title\" rows=\"3\" spellcheck=\"false\" maxlength=\"144\"></textarea>\n		<h3>Description</h3>\n		<textarea id=\"unit_description\" rows=\"3\" spellcheck=\"false\" maxlength=\"144\"></textarea>\n	</div>\n	<div class=\"overlay_submit\" style=\"right:52%\">Create</div>\n</div>";});
});
window.require.register("views/templates/formNewUnit", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<div class=\"item-header drop_shadow\">\n	<div id=\"back-button\" class=\"dark-back\"></div>\n</div>\n\n<div class=\"item-wrapper\">\n	\n	<h1 class=\"unit-header\">Create a New Unit</h1>	\n	\n	<h3>Upload Photo</h3>\n	<div id=\"picker\" style=\"background:url('');\"></div>\n	<div class=\"upload-floater\">\n		<div id=\"upload\" class=\"select-button\">Select Image</div>\n	</div>\n	<div class=\"clear\"></div>\n	\n	<h3>Title</h3>\n	<input id=\"unit_title\" maxlength=\"30\"></input>\n	\n	<h3>Description</h3>\n	<textarea id=\"unit_description\" maxlength=\"140\"></textarea>	\n				\n	<div class=\"overlay_submit element-button submit-left\">Create</div>\n\n</div>		";});
});
window.require.register("views/templates/formNewVideo", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n						<div data-id=\"";
    foundHelper = helpers.unit_id;
    stack1 = foundHelper || depth0.unit_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\"> <option value=";
    foundHelper = helpers.unit_id;
    stack1 = foundHelper || depth0.unit_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + ">";
    foundHelper = helpers.unit_name;
    stack1 = foundHelper || depth0.unit_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</option> </div>\n					";
    return buffer;}

    buffer += "<div class=\"item-header drop_shadow\">\n	<div id=\"back-button\" class=\"dark-back\"></div>\n	<div id=\"iosbutton\" class=\"iosdark button-right help\">?</div>\n\n</div>\n<div id=\"newElement_page\" class=\"overlay_modal content_wrapper\">\n	\n	<div class=\"element-container\">\n	\n		<h2>Add Video</h2>\n		\n		<div id=\"element-wrapper\">\n			<div id=\"picker\" style=\"background:url('');\"></div>\n			\n			<div class=\"element-details\">\n			    <label class=\"detail-form\">\n				    <input id=\"video_title\" placeholder=\"Title\" type=\"text\">\n				</label>\n				\n				<label class=\"detail-form\">\n					<textarea id=\"video_notes\" placeholder=\"Description\"></textarea>\n				</label>	\n			</div>\n			\n		</div>\n		\n		<div class=\"static url-select\">\n			<div id=\"upload\" class=\"chunky select\" data-intro=\"Once you pick your video, tap the circular Reload button to get the YouTube link, then press Done.\" data-position=\"right\">Select</div>\n		</div>\n		\n		<div id=\"vid_url\" class=\"element-details url-text\">\n			Press select to browse for a Youtube video!\n		</div>\n			\n		<div class=\"clear\"></div>\n			\n		<div id=\"dropdown-wrapper\">\n			<span>Select Unit</span>\n				<div class=\"active-select\">\n					<select id=\"unitSelect\">\n					<option>Please Select a Unit</option>\n					\n					";
    foundHelper = helpers.unit_list;
    stack1 = foundHelper || depth0.unit_list;
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "	\n					\n					</select>\n				</div>\n			\n			<span>Select Lesson</span>\n			<div id=\"lessonField\" class=\"disabled-select\">\n				<select id=\"lessonSelect\">\n					<option>Please Select a Lesson</option>\n				</select>\n			</div>		\n		</div>\n		\n		<div id=\"submit\" class=\"chunky add\">Add</div>\n		\n	</div><!--end container-->\n	\n</div>";
    return buffer;});
});
window.require.register("views/templates/formNewWorksheet", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<div id=\"newElement_page\" class=\"overlay_modal content_wrapper\">\n	<h1>Create a New Unit</h1>\n	<div class=\"overlay_close\"></div>\n	<div class=\"overlay_left\">\n		<h3>Title</h3>\n		<textarea id=\"unit_title\" rows=\"3\" spellcheck=\"false\" maxlength=\"144\"></textarea>\n		<h3>Description</h3>\n		<textarea id=\"unit_description\" rows=\"3\" spellcheck=\"false\" maxlength=\"144\"></textarea>\n	</div>\n	<div class=\"overlay_submit\" style=\"right:52%\">Create</div>\n</div>";});
});
window.require.register("views/templates/group", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    
    return "\n<div id=\"iosbutton\" class=\"button-right edit-group\">Edit Group</div>\n<div id=\"iosbutton\" class=\"button-right help\">?</div>\n";}

  function program3(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n					style=\"background-image:url(";
    foundHelper = helpers.group_image_small;
    stack1 = foundHelper || depth0.group_image_small;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "group_image_small", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\"></div>	\n			<h1 class=\"group-header-text\">";
    foundHelper = helpers.group_name;
    stack1 = foundHelper || depth0.group_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "group_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h1>\n			";
    return buffer;}

  function program5(depth0,data) {
    
    var stack1;
    foundHelper = helpers.student_count;
    stack1 = foundHelper || depth0.student_count;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student_count", { hash: {} }); }
    return escapeExpression(stack1);}

  function program7(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n		<div id=\"show-units\" class=\"hide\">\n		";
    foundHelper = helpers.units;
    stack1 = foundHelper || depth0.units;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.unit_list);
    stack2 = helpers.each;
    tmp1 = self.program(8, program8, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		</div>\n		";
    return buffer;}
  function program8(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "		\n			<div data-id=\"";
    foundHelper = helpers.unit_id;
    stack1 = foundHelper || depth0.unit_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"unit_thumb item\">\n				<h1>";
    foundHelper = helpers.unit_name;
    stack1 = foundHelper || depth0.unit_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h1>\n				<div class=\"unit-thumb-student-img\" style=\"background-image:url(";
    foundHelper = helpers.unit_image;
    stack1 = foundHelper || depth0.unit_image;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_image", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\"></div>\n				<p>\n					<span style=\"background-image:url(images/hexagon.png)\">\n						<b>";
    foundHelper = helpers.lesson_count;
    stack1 = foundHelper || depth0.lesson_count;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "lesson_count", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</b> Lessons\n					</span>\n					<span style=\"background-image:url(images/triangle.png)\">\n						<b>";
    foundHelper = helpers.element_count;
    stack1 = foundHelper || depth0.element_count;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_count", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</b> Elements\n					</span>\n				</p> \n			</div>	\n			";
    return buffer;}

  function program10(depth0,data) {
    
    
    return "\n		<div id=\"empty\" class=\"hide\">\n			<div class=\"empty-set set-unit\"></div>\n			<h4>No Units Assigned</h4>\n			<p>Go to the Lesson page to assign Groups</p>\n		</div>\n		";}

  function program12(depth0,data) {
    
    
    return "\n			<div id=\"add-new-student\">\n				<p>Add <br>Students</p>\n			</div>\n			";}

  function program14(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n			\n			";
    foundHelper = helpers.student_list;
    stack1 = foundHelper || depth0.student_list;
    stack2 = helpers['if'];
    tmp1 = self.program(15, program15, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			";
    return buffer;}
  function program15(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n			\n				";
    foundHelper = helpers.student_list;
    stack1 = foundHelper || depth0.student_list;
    stack2 = helpers.each;
    tmp1 = self.program(16, program16, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n				\n			";
    return buffer;}
  function program16(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n				<div id=\"student_thumb\" data-id=\"";
    foundHelper = helpers.student_id;
    stack1 = foundHelper || depth0.student_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"groups-student-thumb\" style=\"background-image:url(";
    foundHelper = helpers.student_image_small;
    stack1 = foundHelper || depth0.student_image_small;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student_image_small", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\">\n					<p>";
    foundHelper = helpers.student_name_first;
    stack1 = foundHelper || depth0.student_name_first;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student_name_first", { hash: {} }); }
    buffer += escapeExpression(stack1) + "<br>";
    foundHelper = helpers.student_name_last;
    stack1 = foundHelper || depth0.student_name_last;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student_name_last", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n				</div>\n				";
    return buffer;}

    buffer += "<div class=\"header drop_shadow\">\n<div id=\"menu_button\" class=\"hide\"></div>\n<div id=\"work-button\"></div>\n<div id=\"iosbutton\" class=\"button-right help\">?</div>\n";
    foundHelper = helpers.all;
    stack1 = foundHelper || depth0.all;
    stack2 = helpers.unless;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n	Group\n</div>\n\n<div id=\"group_page\" class=\"content_wrapper\">\n	\n	<div class=\"section group-shadow shim\">\n		<div class=\"section-button-group\">\n			<div id=\"delete\" class=\"trash hide\"></div>\n			<div id=\"announce\" class=\"groups-announce\" data-intro=\"Send announcement to this group.\" data-position=\"bottom\">\n				<img src=\"images/announce.png\" width=\"25\" height=\"24\"><span>Announcement</span>\n			</div>\n		</div>\n		\n			<div class=\"group_header_image\"\n				";
    foundHelper = helpers.students;
    stack1 = foundHelper || depth0.students;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.groups);
    stack2 = helpers.each;
    tmp1 = self.program(3, program3, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			\n			<div class=\"clear\"></div>\n			\n			<div id=\"group-subheader\">\n				<div data-id=\"";
    foundHelper = helpers.group_id;
    stack1 = foundHelper || depth0.group_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "group_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" id=\"group-subheader-members\" class=\"active-group-sub\" data-intro=\"Number of students.\" data-position=\"top\">\n					<div class=\"member-subheader-icon left\"></div>\n					<b>";
    foundHelper = helpers.students;
    stack1 = foundHelper || depth0.students;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.groups);
    stack2 = helpers.each;
    tmp1 = self.program(5, program5, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "</b> Members\n				</div>\n				\n				<div id=\"group-subheader-units\" data-intro=\"Units visible to this group.\" data-position=\"bottom\">\n					<div class=\"unit-subheader-icon right\"></div>\n					Units\n				</div>\n			</div>\n	</div>\n		\n	<div id=\"scrollStudents\" class=\"scroll_wrapper\">\n		<div id=\"scroller\">\n		\n		";
    foundHelper = helpers.units;
    stack1 = foundHelper || depth0.units;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.unit_list);
    stack2 = helpers['if'];
    tmp1 = self.program(7, program7, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(10, program10, data);
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		\n		<div id=\"show-groups\">\n		\n			<div id=\"add-student\" class=\"hide\">\n				<p>Edit <br>Students</p>\n			</div>\n			";
    foundHelper = helpers.all;
    stack1 = foundHelper || depth0.all;
    stack2 = helpers['if'];
    tmp1 = self.program(12, program12, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			\n			";
    foundHelper = helpers.students;
    stack1 = foundHelper || depth0.students;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.groups);
    stack2 = helpers.each;
    tmp1 = self.program(14, program14, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			\n			\n			</div>\n		</div>\n		\n		</div>\n	</div>\n	\n</div>";
    return buffer;});
});
window.require.register("views/templates/groups", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n			<div data-id=\"ALL\" class=\"group_thumb item\">\n				<div class=\"group_thumb_name\" style=\"padding-left:10%;width:75%\">All Students</div>\n				<div class=\"group_thumb_count\">";
    foundHelper = helpers.teacher_groups;
    stack1 = foundHelper || depth0.teacher_groups;
    stack2 = helpers.each;
    tmp1 = self.program(2, program2, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "</div>\n			</div>\n			\n			";
    foundHelper = helpers.teacher_groups;
    stack1 = foundHelper || depth0.teacher_groups;
    stack2 = helpers.each;
    tmp1 = self.program(4, program4, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			\n			";
    return buffer;}
  function program2(depth0,data) {
    
    var stack1;
    foundHelper = helpers.student_count;
    stack1 = foundHelper || depth0.student_count;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student_count", { hash: {} }); }
    return escapeExpression(stack1);}

  function program4(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n			";
    foundHelper = helpers.group_list;
    stack1 = foundHelper || depth0.group_list;
    stack2 = helpers.each;
    tmp1 = self.program(5, program5, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			";
    return buffer;}
  function program5(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n			\n			<div data-id=\"";
    foundHelper = helpers.group_id;
    stack1 = foundHelper || depth0.group_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "group_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"group_thumb item\">\n				<div class=\"group_thumb_image\" style=\"background-image:url(";
    foundHelper = helpers.group_image;
    stack1 = foundHelper || depth0.group_image;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "group_image", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\"></div>\n				<div class=\"group_thumb_name\">";
    foundHelper = helpers.group_name;
    stack1 = foundHelper || depth0.group_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "group_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</div>\n				<div class=\"group_thumb_count\">";
    foundHelper = helpers.student_count;
    stack1 = foundHelper || depth0.student_count;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student_count", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</div>\n			</div>\n			\n			";
    return buffer;}

  function program7(depth0,data) {
    
    
    return "\n			";}

    buffer += "<div class=\"header drop_shadow\">\n	<div id=\"menu_button\"></div>\n	<div id=\"iosbutton\" class=\"button-right new-group\">New Group</div>\n	<div id=\"iosbutton\" class=\"button-right new-student\">Add Students</div>		\n	Groups\n</div>\n\n<div id=\"groups_page\" class=\"content_wrapper\">\n	<div id=\"addGroup\" class=\"add_button\">\n		<div class=\"add_button_innards\"></div>\n	</div>\n	<div id=\"scrollGroups\" class=\"scroll_wrapper\">\n		<div id=\"scroller\">\n			";
    foundHelper = helpers.teacher_groups;
    stack1 = foundHelper || depth0.teacher_groups;
    stack2 = helpers['if'];
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(7, program7, data);
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n\n		</div>\n	</div>\n</div>";
    return buffer;});
});
window.require.register("views/templates/home", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n			";
    foundHelper = helpers.teacher_posts;
    stack1 = foundHelper || depth0.teacher_posts;
    stack2 = helpers.each;
    tmp1 = self.program(2, program2, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "			\n			</div>\n			";
    return buffer;}
  function program2(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n				<div id=\"lesson\" data-id= ";
    foundHelper = helpers.object_id;
    stack1 = foundHelper || depth0.object_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "object_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + " class=\"recent-item\" style=\"background: url(";
    foundHelper = helpers.lesson_image_small;
    stack1 = foundHelper || depth0.lesson_image_small;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "lesson_image_small", { hash: {} }); }
    buffer += escapeExpression(stack1) + "); background-repeat: no-repeat; background-size:cover;\">\n					<span> ";
    foundHelper = helpers.lesson_name;
    stack1 = foundHelper || depth0.lesson_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "lesson_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + " </span>\n				</div>\n			";
    return buffer;}

  function program4(depth0,data) {
    
    
    return "\n			<div class=\"empty-text\">\n				<h3>Create your first Unit and Lesson!</h3>\n				<p>Use the <strong>PLUS</strong> button on the right to create new material!</p>\n			</div>\n			";}

    buffer += "<div id=\"home-view-cover\"></div>\n\n<div class=\"header drop_shadow\">\n	<div id=\"menu_button\" data-intro=\"Menu\" data-position=\"bottom\"></div>\n	Home\n	<div id=\"iosbutton\" class=\"button-right help\">?</div>\n</div>\n\n<div id=\"home_page\" class=\"home-wrapper\">\n<div class=\"add_button\" data-intro=\"Create units, lessons and assignments; add media, documents and more.\" data-position=\"left\">\n	<div class=\"add_button_innards\"></div>\n</div>\n<div id=\"scrollHome\" class=\"scroll_wrapper\">\n	<div id=\"scroller\">		\n	<div class=\"secondary-nav\">\n		<div class=\"teacher-header\">\n			<div class=\"teacher-nav-icon\"></div>\n			<div class=\"student-nav-text\">From the Library</div>\n		</div>		\n	</div><!--end #secondary-nav-->\n       \n\n	<div id=\"scrollStore\">\n		<div id=\"scroller-home\">	\n			<div data-url=\"http://www.ted.com/\" class=\"library-item\"><img src=\"images/tile-ted.png\" data-intro=\"Bookmark websites and videos to use in your classroom.\" data-position=\"right\"></div>\n			<!--<div data-url=\"http://www.khanacademy.org/\" class=\"library-item\"><img src=\"images/tile-khan.png\"></div>-->\n			<div data-url=\"http://photography.nationalgeographic.com/\" class=\"library-item\"><img src=\"images/tile-natgeo.png\"></div>		\n			<div data-url=\"http://www.goorulearning.org/\" class=\"library-item\"><img src=\"images/tile-gooru.jpg\"></div>\n			<div data-url=\"http://www.discoveryeducation.com/teachers/free-9-12-teacher-resources/\" class=\"library-item\"><img src=\"images/tile-disc.png\"></div>		\n			<div data-url=\"http://www.discoverystudentadventures.com/\" class=\"library-item\"><img src=\"images/tile-disc-adv.png\"></div>			\n			<div data-url=\"http://torch.sunburst.com/\" class=\"library-item\"><img src=\"images/tile-ignite.png\"></div>			\n			<div data-url=\"http://digitalpromise.sunburst.com/\" class=\"library-item\"><img src=\"images/tile-sunburst.png\"></div>			\n			<div data-url=\"http://www.billnye.com/for-kids-teachers/home-demos/\" class=\"library-item\"><img src=\"images/tile-bill.png\"></div>\n									\n		</div>\n	</div><!--end #scrollStore-->\n	\n	<div id=\"recent-items-container\">	\n\n		<div id=\"recent-items-inner\">\n			<h3 class=\"items-header\">Recent Lessons</h3>\n			<div class=\"corner\"></div>\n		</div>\n		\n		<div class=\"absolute help-recent\" data-intro=\"Access the most recent lessons you have created.\" data-position=\"right\"></div>\n\n		\n		<div id=\"scrollPosts\">\n			<div id=\"scroller-recent-items\">\n			";
    foundHelper = helpers.teacher_posts;
    stack1 = foundHelper || depth0.teacher_posts;
    stack2 = helpers['if'];
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(4, program4, data);
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		</div>				\n	</div><!--end #recent-items-container-->\n	\n	<div id=\"teacher-home-container\">\n	\n		<div id=\"recent-items-inner\">\n			<h3 class=\"items-header\">Announcements</h3>\n			<div class=\"corner\"></div>\n		</div>\n\n		<div id=\"scrollAnnouncements\">\n\n		</div><!--end #scrollAnnouncements-->\n	</div><!--end #teacher-home-announce-->\n	\n</div>	<!--end #scrollHome-->\n</div>";
    return buffer;});
});
window.require.register("views/templates/homeAnnouncements", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n	";
    foundHelper = helpers.announcement_list;
    stack1 = foundHelper || depth0.announcement_list;
    stack2 = helpers['if'];
    tmp1 = self.program(2, program2, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(5, program5, data);
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n	";
    return buffer;}
  function program2(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n	";
    foundHelper = helpers.announcement_list;
    stack1 = foundHelper || depth0.announcement_list;
    stack2 = helpers.each;
    tmp1 = self.program(3, program3, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n	";
    return buffer;}
  function program3(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "		\n	<div data-id=\"";
    foundHelper = helpers.announcement_id;
    stack1 = foundHelper || depth0.announcement_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "announcement_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"announcement-item\">\n\n		<div class=\"announcement-header\">\n			<div class=\"announce-thumb\" style=\"background: url(";
    foundHelper = helpers.moderator_image;
    stack1 = foundHelper || depth0.moderator_image;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "moderator_image", { hash: {} }); }
    buffer += escapeExpression(stack1) + ");\"><div class=\"portrait-shadow\"></div></div>			\n			<div class=\"announcement-date\">";
    foundHelper = helpers.timestamp;
    stack1 = foundHelper || depth0.timestamp;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "timestamp", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</div>\n			<h3>";
    foundHelper = helpers.moderator_name;
    stack1 = foundHelper || depth0.moderator_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "moderator_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h3>\n		</div>\n		\n		<div class=\"announcement-border\">&nbsp;</div>\n		<p class=\"announcement\">";
    foundHelper = helpers.body;
    stack1 = foundHelper || depth0.body;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "body", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n		<div data-id=\"";
    foundHelper = helpers.announcement_id;
    stack1 = foundHelper || depth0.announcement_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "announcement_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"announcement-footer\">\n			<div class=\"announcement-comment-icon\"></div>\n			<p><strong>";
    foundHelper = helpers.response_count;
    stack1 = foundHelper || depth0.response_count;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "response_count", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</strong> Comments</p>	\n		</div>\n	</div>\n	";
    return buffer;}

  function program5(depth0,data) {
    
    
    return "\n	<div class=\"empty-text\">\n				<h3>Send an announcement to your students!</h3>\n				<p>Pick a Group and tap the announcements button.</p>\n			</div>\n	";}

    buffer += "<div id=\"scroller-announcements\">\n	\n	";
    foundHelper = helpers.announcements;
    stack1 = foundHelper || depth0.announcements;
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n</div><!--end #scroller-announcements-->";
    return buffer;});
});
window.require.register("views/templates/lesson", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n			<div class=\"publish-border unit-header-image\" style=\"background: url('";
    foundHelper = helpers.lesson_image;
    stack1 = foundHelper || depth0.lesson_image;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "lesson_image", { hash: {} }); }
    buffer += escapeExpression(stack1) + "')\"></div>\n			<div class=\"section-header\">\n					<div class=\"absolute under help-unit\" data-intro=\"Tap to edit the Title and Description for this unit.\" data-position=\"bottom\"></div>\n					<!--<h1>";
    foundHelper = helpers.lesson_name;
    stack1 = foundHelper || depth0.lesson_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "lesson_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h1>-->\n				<div class=\"ghost-field ghost-material-header\">\n					<input id=\"lessontitle\" type=\"text\" value=\"";
    foundHelper = helpers.lesson_name;
    stack1 = foundHelper || depth0.lesson_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "lesson_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" placeholder=\"Lesson Title\"><br>\n				</div>\n					<!--<p class=\"subheader\">";
    foundHelper = helpers.lesson_description;
    stack1 = foundHelper || depth0.lesson_description;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "lesson_description", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>-->\n				<div class=\"ghost-field ghost-material-subheader\">\n					<textarea id=\"lessondescription\" placeholder=\"Lesson Description\">";
    foundHelper = helpers.lesson_description;
    stack1 = foundHelper || depth0.lesson_description;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "lesson_description", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</textarea>\n				</div>\n				";
    return buffer;}

  function program3(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n				";
    foundHelper = helpers.is_published;
    stack1 = foundHelper || depth0.is_published;
    stack2 = helpers['if'];
    tmp1 = self.program(4, program4, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(6, program6, data);
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n				";
    return buffer;}
  function program4(depth0,data) {
    
    
    return "\n			  		<div id=\"publishButton\" class=\"publish published\">Published</div>\n				";}

  function program6(depth0,data) {
    
    
    return "\n					<div id=\"publishButton\" class=\"publish\">Publish</div>\n				";}

  function program8(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n					<p><strong>";
    foundHelper = helpers.student_count;
    stack1 = foundHelper || depth0.student_count;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student_count", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</strong> Student Views</p>\n					";
    foundHelper = helpers.student_list;
    stack1 = foundHelper || depth0.student_list;
    stack2 = helpers.each;
    tmp1 = self.program(9, program9, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n					";
    return buffer;}
  function program9(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n						<div id=\"student_thumb\" data-id=\"";
    foundHelper = helpers.student_id;
    stack1 = foundHelper || depth0.student_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"section_item\" style=\"background-image:url(";
    foundHelper = helpers.student_image_small;
    stack1 = foundHelper || depth0.student_image_small;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student_image_small", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\"></div>\n					";
    return buffer;}

  function program11(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n				<p><strong>";
    foundHelper = helpers.group_count;
    stack1 = foundHelper || depth0.group_count;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "group_count", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</strong> Groups</p>\n				<div class=\"clear\"></div>\n				<div id=\"meta-groups-container\">	\n					";
    foundHelper = helpers.group_list;
    stack1 = foundHelper || depth0.group_list;
    stack2 = helpers.each;
    tmp1 = self.program(12, program12, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n					";
    return buffer;}
  function program12(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n					<div id=\"group_thumb\" data-id=\"";
    foundHelper = helpers.group_id;
    stack1 = foundHelper || depth0.group_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "group_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"section_item\" style=\"background-image:url(";
    foundHelper = helpers.group_image;
    stack1 = foundHelper || depth0.group_image;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "group_image", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\"></div>\n					";
    return buffer;}

  function program14(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n		\n		";
    foundHelper = helpers.is_published;
    stack1 = foundHelper || depth0.is_published;
    stack2 = helpers['if'];
    tmp1 = self.program(15, program15, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(23, program23, data);
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		";
    return buffer;}
  function program15(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n			";
    foundHelper = helpers.element_list;
    stack1 = foundHelper || depth0.element_list;
    stack2 = helpers.each;
    tmp1 = self.program(16, program16, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			\n		";
    return buffer;}
  function program16(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n			<div data-id=\"";
    foundHelper = helpers.element_id;
    stack1 = foundHelper || depth0.element_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" ";
    foundHelper = helpers.video_url;
    stack1 = foundHelper || depth0.video_url;
    stack2 = helpers['if'];
    tmp1 = self.program(17, program17, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += " class=\"element_thumb item published-item\">\n				<div data-id=\"";
    foundHelper = helpers.element_id;
    stack1 = foundHelper || depth0.element_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" ";
    foundHelper = helpers.video_url;
    stack1 = foundHelper || depth0.video_url;
    stack2 = helpers['if'];
    tmp1 = self.program(19, program19, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += " class=\"item-delete hide\"></div>\n				<div data-id=\"";
    foundHelper = helpers.element_id;
    stack1 = foundHelper || depth0.element_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" ";
    foundHelper = helpers.video_url;
    stack1 = foundHelper || depth0.video_url;
    stack2 = helpers['if'];
    tmp1 = self.program(21, program21, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += " class=\"item_image ";
    foundHelper = helpers.element_type;
    stack1 = foundHelper || depth0.element_type;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_type", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" style=\"background-image:url(";
    foundHelper = helpers.element_image;
    stack1 = foundHelper || depth0.element_image;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_image", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\"></div>\n				<h4>";
    foundHelper = helpers.element_type;
    stack1 = foundHelper || depth0.element_type;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_type", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h4>\n				<h3>";
    foundHelper = helpers.element_name;
    stack1 = foundHelper || depth0.element_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h3>\n			</div>\n			";
    return buffer;}
  function program17(depth0,data) {
    
    var buffer = "", stack1;
    buffer += " data-urls=\"";
    foundHelper = helpers.video_url;
    stack1 = foundHelper || depth0.video_url;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "video_url", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" ";
    return buffer;}

  function program19(depth0,data) {
    
    var buffer = "", stack1;
    buffer += " data-urls=\"";
    foundHelper = helpers.video_url;
    stack1 = foundHelper || depth0.video_url;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "video_url", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" ";
    return buffer;}

  function program21(depth0,data) {
    
    var buffer = "", stack1;
    buffer += " data-urls=\"";
    foundHelper = helpers.video_url;
    stack1 = foundHelper || depth0.video_url;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "video_url", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" ";
    return buffer;}

  function program23(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n			\n			";
    foundHelper = helpers.element_list;
    stack1 = foundHelper || depth0.element_list;
    stack2 = helpers.each;
    tmp1 = self.program(24, program24, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			\n		";
    return buffer;}
  function program24(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n			<div data-id=\"";
    foundHelper = helpers.element_id;
    stack1 = foundHelper || depth0.element_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" ";
    foundHelper = helpers.video_url;
    stack1 = foundHelper || depth0.video_url;
    stack2 = helpers['if'];
    tmp1 = self.program(25, program25, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += " class=\"element_thumb item\">\n			<div data-id=\"";
    foundHelper = helpers.element_id;
    stack1 = foundHelper || depth0.element_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\"";
    foundHelper = helpers.video_url;
    stack1 = foundHelper || depth0.video_url;
    stack2 = helpers['if'];
    tmp1 = self.program(27, program27, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += " class=\"item-delete hide\"></div>\n			<div data-id=\"";
    foundHelper = helpers.element_id;
    stack1 = foundHelper || depth0.element_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" ";
    foundHelper = helpers.video_url;
    stack1 = foundHelper || depth0.video_url;
    stack2 = helpers['if'];
    tmp1 = self.program(29, program29, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += " class=\"item_image ";
    foundHelper = helpers.element_type;
    stack1 = foundHelper || depth0.element_type;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_type", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" style=\"background-image:url(";
    foundHelper = helpers.element_image;
    stack1 = foundHelper || depth0.element_image;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_image", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\"></div>\n				<h4>";
    foundHelper = helpers.element_type;
    stack1 = foundHelper || depth0.element_type;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_type", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h4>\n				<h3>";
    foundHelper = helpers.element_name;
    stack1 = foundHelper || depth0.element_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h3>\n			</div>\n			";
    return buffer;}
  function program25(depth0,data) {
    
    var buffer = "", stack1;
    buffer += " data-urls=\"";
    foundHelper = helpers.video_url;
    stack1 = foundHelper || depth0.video_url;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "video_url", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" ";
    return buffer;}

  function program27(depth0,data) {
    
    var buffer = "", stack1;
    buffer += " data-urls=\"";
    foundHelper = helpers.video_url;
    stack1 = foundHelper || depth0.video_url;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "video_url", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" ";
    return buffer;}

  function program29(depth0,data) {
    
    var buffer = "", stack1;
    buffer += " data-urls=\"";
    foundHelper = helpers.video_url;
    stack1 = foundHelper || depth0.video_url;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "video_url", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" ";
    return buffer;}

    buffer += "<div class=\"header drop_shadow\">\n	<div id=\"menu_button\" class=\"hide\"></div>\n	<div id=\"work-button\"></div>\n	<div id=\"iosbutton\" class=\"button-right edit-unit\">Edit</div>\n	<div id=\"iosbutton\" class=\"button-right nav-add-group\">Assign Group</div>\n	<div id=\"iosbutton\" class=\"button-right help\">?</div>\n	Lesson\n</div>\n\n<div id=\"lesson_page\" class=\"content_wrapper\">\n\n	<div class=\"add_button\" data-intro=\"Create units, lessons and assignments; add media, documents and more.\" data-position=\"left\">\n		<div class=\"add_button_innards\"></div>\n	</div>	\n	\n	<div class=\"section section-shadow\">\n		<div id=\"section-header-wrap\">\n				";
    foundHelper = helpers.teacher_lesson;
    stack1 = foundHelper || depth0.teacher_lesson;
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			</div>\n					\n			<div class=\"section-button-group\" data-intro=\"Once published, the unit becomes visible to students.\" data-position=\"left\">\n				<div id=\"delete\" class=\"trash hide\"></div>\n	\n				";
    foundHelper = helpers.teacher_lesson;
    stack1 = foundHelper || depth0.teacher_lesson;
    stack2 = helpers.each;
    tmp1 = self.program(3, program3, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			</div>\n		</div>\n		\n		<div class=\"meta\">\n		\n			<div class=\"meta-students meta-section\">\n				<div id=\"meta-students-container\">\n				";
    foundHelper = helpers.teacher_lesson;
    stack1 = foundHelper || depth0.teacher_lesson;
    stack2 = helpers.each;
    tmp1 = self.program(8, program8, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n				</div>\n			</div>	\n				\n			<div class=\"meta-groups meta-section\">\n			<div class=\"absolute under help-lesson\" data-intro=\"Groups who can see this lesson.\" data-position=\"bottom\"></div>\n				";
    foundHelper = helpers.teacher_lesson;
    stack1 = foundHelper || depth0.teacher_lesson;
    stack2 = helpers.each;
    tmp1 = self.program(11, program11, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n				</div>			\n			</div>		\n			<!--<div id=\"meta-expand\">\n				<img src=\"images/downarrow.png\" width=\"25\" height=\"11\">\n			</div>-->\n		</div>\n\n	</div>\n	\n	<div class=\"absolute under help-lesson-elements\" data-intro=\"Elements (videos, photos, links, etc.) assigned to this lesson will appear here.\" data-position=\"bottom\"></div>\n	\n	<div id=\"scrollElements\" class=\"scroll_wrapper\">\n		<div id=\"scroller\">\n		";
    foundHelper = helpers.teacher_lesson;
    stack1 = foundHelper || depth0.teacher_lesson;
    stack2 = helpers.each;
    tmp1 = self.program(14, program14, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		</div>\n</div>\n";
    return buffer;});
});
window.require.register("views/templates/login", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "	<div id=\"walk-cover\"></div>\n	<div id=\"walk-bg\"></div>\n	\n	<div class=\"top-border\"> <!--Taste the Rainbow-->\n		<div class=\"tb1 colors\">&nbsp;</div>\n		<div class=\"tb2 colors\">&nbsp;</div>\n		<div class=\"tb3 colors\">&nbsp;</div>\n		<div class=\"tb4 colors\">&nbsp;</div>\n		<div class=\"tb5 colors\">&nbsp;</div>\n		<div class=\"tb6 colors\">&nbsp;</div>\n	</div>\n	<div id=\"mark\">\n			<img src=\"images/mark.png\"><br>\n		</div>\n	\n\n		  \n	<div id=\"walkthrough\" class=\"royalSlider rsDefaultInv hide\">\n		<!-- slide 1 -->\n		<div class=\"walk-slide wslide1\">\n			<h1>Welcome!</h1>\n			<p>You have found the best platform for instruction, learning and collaboration between teachers and students.  Teachers can create digital lessons, send assignments, have group discussions, and review student work.  Students can work together, get individualized instruction, and get ahead. <br>\n			<strong>It only takes a minute to get started and its free. Seriously.</strong>\n		</div>\n		\n		<!-- slide 2 -->\n		<div class=\"walk-slide wslide2\" >\n			<img src=\"images/coach-plus-sm.png\">\n			<h2>Add Content</h2>\n			<p>Create your first Unit and Lessons by clicking the <strong>PLUS</strong> button in the bottom right corner. From here you can also add Photos, Videos, Links, Assignments, Word documents, Powerpoints, Pdf files and more from wherever you have them stored. Students will see your lessons, but not be able to modify them.</p>\n		</div>\n		\n		<!-- slide 3 -->\n		<div class=\"walk-slide wslide3\">\n			<img src=\"images/coach-menu-sm.png\">\n			<h2>Navigating</h2>\n			<p>To navigate through different sections, just tap the menu button in the top left corner.<br>\n	<em>TIP: Log Out from the <strong>Settings tab.</strong></em></p>\n		</div>\n		\n		<!-- slide 4 -->\n		<div class=\"walk-slide wslide4\">\n			<img src=\"images/coach-linking-sm@2x.png\" width=\"145px\" height=\"145px\">\n			<h2>Bookmarks &amp; Links</h2>\n			<p>In the Library you'll find links to useful websites and content. You can bookmark any website by tapping on the <img class=\"coach-icon\" src=\"images/coach-bookmark@2x.png\">icon. When adding Links to Lessons, navigate to the website and tap <strong>Done</strong> to add the URL.</p>\n		</div>\n		\n		<!-- slide 5 -->\n		<div class=\"walk-slide wslide5\">\n			<h2>Need More Assistance?</h2>\n			<p>Email <a href=\"mailto:albert@hmsteach.com\">albert@hmsteach.com</a> for a walkthrough of features, to import student lists, and any other help you need to get started. \n			<strong>Now create your first Unit!</strong></p>\n		</div>\n	\n	</div>\n	<script>\n		jQuery(document).ready(function($) {\n		\n			setTimeout(initSlider, 300);\n			var $wt = $(\"#walkthrough\");\n			\n			function initSlider(){\n				console.log('init');\n				$wt.royalSlider({\n		           	autoHeight: true,\n				    arrowsNav: false,\n				    fadeinLoadedSlide: true,\n				    controlNavigationSpacing: 0,\n				    controlNavigation: 'bullets',\n				    imageScaleMode: 'fit',\n				    imageAlignCenter: true,\n				    loop: false,\n				    loopRewind: false,\n				    numImagesToPreload: 5,\n				    autoScaleSlider: false,\n		            keyboardNavEnabled: true,\n		            navigateByClick: false,\n		            \n		        });\n		        $wt.fadeIn(400);\n			}\n			\n	    });\n    </script>\n    <script>\n    jQuery(document).ready(function($) {\n    	$('#login_page_buttons').delay(400).fadeIn(500);\n    });\n    </script>\n<div id=\"login_page_buttons\" class=\"hide\">\n\n	<div id=\"login_step1\">\n		<h3>Sign in to your classroom!</h3>\n		<div id=\"teacher\" class=\"login_button teacher-login\">Teacher</div>\n		<div id=\"student\" class=\"login_button student-login\">Student</div>\n	</div>\n\n</div><!-- end page -->	\n\n\n";});
});
window.require.register("views/templates/loginRegister", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<div id=\"register-page\">\n	<div class=\"top-border\"> <!--Taste the Rainbow-->\n		<div class=\"tb1 colors\">&nbsp;</div>\n		<div class=\"tb2 colors\">&nbsp;</div>\n		<div class=\"tb3 colors\">&nbsp;</div>\n		<div class=\"tb4 colors\">&nbsp;</div>\n		<div class=\"tb5 colors\">&nbsp;</div>\n		<div class=\"tb6 colors\">&nbsp;</div>\n	</div>\n\n	<div class=\"login_wrapper\">\n\n		<div id=\"register-1\" class=\"login_step\">\n			<div class=\"back-icon\">\n				<img src=\"images/icon-back.png\" width=\"48px\" height=\"48px\">\n			</div>			\n			<h2>Register</h2>\n			<div class=\"register-container register-input tall-register\">\n				<div class=\"register-wrapper\">\n					<input type=\"text\" id=\"display-name\" placeholder=\"Display Name (ex: Mrs. Robinson)\" spellcheck=\"false\" autocorrect=\"off\">\n					<input type=\"text\" id=\"first-name\" placeholder=\"First Name\" spellcheck=\"false\" autocorrect=\"off\">\n					<input type=\"text\" id=\"last-name\" placeholder=\"Last Name\" spellcheck=\"false\" autocorrect=\"off\">\n					<input type=\"email\" id=\"email\" placeholder=\"Email Address\" spellcheck=\"false\" autocorrect=\"off\">\n					<input type=\"password\" id=\"password\" placeholder=\"Password\">\n					<input type=\"password\" id=\"confirm-password\" placeholder=\"Confirm Password\">\n					<div id=\"next\" class=\"hulk register-next-button\">Next</div>\n				</div>\n			</div>\n		</div><!--register1-->\n		\n		<div id=\"register-2\" div class=\"login_step hide\">\n			<div class=\"back-register\">\n				<img src=\"images/icon-back.png\" width=\"48px\" height=\"48px\">\n			</div>\n			<h2>Details</h2>\n				<div class=\"register-container register-input\" >\n				<div class=\"register-wrapper\">\n					<input id=\"city-input\" type=\"text\" placeholder=\"City\">\n					<input id=\"state-input\" type=\"text\" maxlength=\"2\" placeholder=\"State\">\n					<input type=\"text\" id=\"country\" placeholder=\"Country\">\n					<input type=\"text\" id=\"school\" placeholder=\"School\">\n					<input type=\"text\" id=\"district\" placeholder=\"District\">\n					<div id=\"register-label\">By registering an account, I accept the KnowItAll&trade;\n<strong id=\"privacy\">Privacy Policy</strong> and <strong id=\"toc\">Terms of Service</strong>.</div>\n					\n					<div id=\"next\" class=\"hulk register-button\">Register</div>\n				</div>\n			</div>\n		</div><!--register2-->\n\n\n	</div><!--wrapper-->\n</div><!--page-->";});
});
window.require.register("views/templates/loginStudent", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this;

  function program1(depth0,data) {
    
    
    return "\n	<!--Student Search-->\n	<div id=\"login_step2\" class=\"login_step student-input\">\n		<div id=\"aint-ma-school\">\n			<p>Not your class? <strong id=\"change-schools\">Change schools &raquo;</strong></p>\n		</div>\n		<h2>My name is ...</h2>	\n		<div class=\"student-input-wrap\">\n			<input id=\"studentName\" placeholder=\"Your Name\" type=\"text\" spellcheck=\"false\" autocorrect=\"off\"> </input>\n		</div>	\n		<div id=\"studentList\" class=\"scroll_wrapper\">\n			<div id=\"scroller\"></div>\n		</div>\n	</div>\n\n	";}

  function program3(depth0,data) {
    
    
    return "\n	<!--School ID-->\n	<div id=\"login-school-code\" class=\"login_step\">\n	<h2>School ID Code</h2>\n		<div id=\"school-code-container\">\n			<input type=\"number\" id=\"schoolCode\" placeholder=\"School ID\">\n			<div class=\"clear\"></div>\n			<div id=\"submitID\" class=\"barney school-code-button\">Next</div>\n		</div>\n	<div id=\"login-footer\">\n		<p style=\"color:#999;\">Your teacher will have your school's ID Code.</p>\n	</div>\n	</div>\n	";}

    buffer += "<div id=\"login_page\" class=\"\">\n	<div class=\"top-border\"> <!--Taste the Rainbow-->\n	<div class=\"tb1 colors\">&nbsp;</div>\n	<div class=\"tb2 colors\">&nbsp;</div>\n	<div class=\"tb3 colors\">&nbsp;</div>\n	<div class=\"tb4 colors\">&nbsp;</div>\n	<div class=\"tb5 colors\">&nbsp;</div>\n	<div class=\"tb6 colors\">&nbsp;</div>\n</div>\n\n<div class=\"login_wrapper\">\n	<div class=\"back-icon\"><img src=\"images/icon-back.png\" width=\"48px\" height=\"48px\"></div>\n	\n	";
    foundHelper = helpers.customer_id;
    stack1 = foundHelper || depth0.customer_id;
    stack2 = helpers['if'];
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(3, program3, data);
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n	\n		\n	<!--Create Passcode-->\n	<div id=\"create-passcode-container\" class=\"login_step hide\">\n	<h2>Create Your Passcode</h2>\n	\n		<div id=\"hold-up\">\n			<p><strong>Remember what you enter.</strong> You will need the passcode each time you login. Ask your teacher if you forget it.</p>\n		</div>\n	\n	\n		<div id=\"create-passcode\">\n			<div id=\"create-passbox1\" class=\"pass-box\"></div>\n			<div id=\"create-passbox2\" class=\"pass-box\"></div>\n			<div id=\"create-passbox3\" class=\"pass-box\"></div>\n			<div id=\"create-passbox4\" class=\"pass-box last\"></div>	\n		</div>\n		\n		<div id=\"passcode-container\">\n			<div id=\"1\" class=\"password-block create-password\">1</div>\n			<div id=\"2\" class=\"password-block create-password\">2</div>\n			<div id=\"3\" class=\"password-block create-password password-block-last\">3</div>\n			<div id=\"4\" class=\"password-block create-password \">4</div>\n			<div id=\"5\" class=\"password-block create-password\">5</div>\n			<div id=\"6\" class=\"password-block create-password password-block-last\">6</div>\n			<div id=\"7\" class=\"password-block create-password\">7</div>\n			<div id=\"8\" class=\"password-block create-password\">8</div>\n			<div id=\"9\" class=\"password-block create-password password-block-last\">9</div>\n		</div>\n	</div>\n	\n	<!--Profile Photo-->\n	<div id=\"take-photo\" class=\"hide\">\n		<h2>Profile Photo</h2>\n		<div id= \"loginPicker\" class=\"take-photo-thumb take-photo-bg\" style=\"background-image:url();\"><div class=\"portrait-shadow\"></div></div>\n		<div id=\"takePhoto\" class=\"garfield take-photo-button\">Take Photo</div>\n		<div class=\"clear\"></div>\n		<div id=\"submitPhoto\" class=\"barney photo-next-button\">Next</div>\n	</div>\n		\n	<!--Student Passcode-->	\n	<div id=\"login_step3\" class=\"login_step hide\">\n		<h2>What's the Passcode?</h2>\n		\n		<div id=\"passcode\">\n			<div id=\"passbox1\" class=\"pass-box\"></div>\n			<div id=\"passbox2\" class=\"pass-box\"></div>\n			<div id=\"passbox3\" class=\"pass-box\"></div>\n			<div id=\"passbox4\" class=\"pass-box last\"></div>	\n		</div>\n		\n		<div id=\"passcode-container\">\n			<div id=\"1\" class=\"password-block enter-password\">1</div>\n			<div id=\"2\" class=\"password-block enter-password\">2</div>\n			<div id=\"3\" class=\"password-block enter-password password-block-last\">3</div>\n			<div id=\"4\" class=\"password-block enter-password \">4</div>\n			<div id=\"5\" class=\"password-block enter-password\">5</div>\n			<div id=\"6\" class=\"password-block enter-password password-block-last\">6</div>\n			<div id=\"7\" class=\"password-block enter-password\">7</div>\n			<div id=\"8\" class=\"password-block enter-password\">8</div>\n			<div id=\"9\" class=\"password-block enter-password password-block-last\">9</div>\n		</div>\n	</div>\n</div>";
    return buffer;});
});
window.require.register("views/templates/loginStudentList", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n		<div data-id=\"";
    foundHelper = helpers.user_name;
    stack1 = foundHelper || depth0.user_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "user_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"studentLoginThumb\">\n			<div class=\"slt_image\"></div>\n			<p class=\"slt_name\">";
    foundHelper = helpers.student_name;
    stack1 = foundHelper || depth0.student_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n		</div>\n		";
    return buffer;}

    buffer += "<div id=\"loginStudentList\" class=\"login_step student-input\">\n	<div id=\"studentSubList\" class=\"scroll_wrapper\">\n		<div id=\"scroller\" style=\"padding-top:10px;\">\n		";
    foundHelper = helpers.students;
    stack1 = foundHelper || depth0.students;
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		</div>\n	</div>\n	\n	<div id=\"student-missing\" class=\"hide\">\n		<img src=\"images/login-missing.png\" width=\"116\" height=\"113\">\n		<h3>Don't see your name?</h3>\n		<p>Raise your hand, your teacher will add you!</p>\n	</div>\n	\n</div>";
    return buffer;});
});
window.require.register("views/templates/loginTeacher", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<div id=\"login_page\" class=\"\">\n	<div class=\"top-border\"> <!--Taste the Rainbow-->\n		<div class=\"tb1 colors\">&nbsp;</div>\n		<div class=\"tb2 colors\">&nbsp;</div>\n		<div class=\"tb3 colors\">&nbsp;</div>\n		<div class=\"tb4 colors\">&nbsp;</div>\n		<div class=\"tb5 colors\">&nbsp;</div>\n		<div class=\"tb6 colors\">&nbsp;</div>\n	</div>\n	\n	<div class=\"login_wrapper\">\n	\n	<div id=\"login_teacher\" class=\"login_step\">\n		<div class=\"back-icon\">\n			<img src=\"images/icon-back.png\" width=\"48px\" height=\"48px\">\n		</div>\n			<!--start login box-->\n			<h2>Teacher Account</h2>\n			<div id=\"step2-container\">\n				<div class=\"login-label\">Email</div>\n				<input type=\"email\" spellcheck=\"false\" autocorrect=\"off\" autocapitalize=\"off\" id=\"username\">\n				\n				<div class=\"login-label\">Password</div>\n				<input type=\"password\" id=\"password\" class=\"teacher-login-password\">\n					\n				<div id=\"submit_teacher\" class=\"login_button teacher-step2-login\">Sign In</div>\n			</div>\n			<!--end login box-->\n			\n			<div id=\"login-footer\">\n				<p>Don’t have an account yet? <strong id=\"register-now\">Register Now &raquo;</strong></p>\n				<span class=\"pass-forgot\">Forgot Password?</span>\n			</div>	\n			\n		</div><!--end login_step-->	\n		\n	<div id=\"login_forgot\" class=\"login_step hide\">\n		<div class=\"back-icon-forgot\">\n			<img src=\"images/icon-back.png\" width=\"48px\" height=\"48px\">\n		</div>\n		\n		<h2>Reset Password</h2>\n			<div id=\"forgot-container\">\n				<div id=\"forgot-wrapper\">\n					<h3>Forgot your password?</h3>\n					<p>Don’t worry! It happens to everyone. Enter your email and you can reset it.</p>\n					<input type=\"email\" id=\"reset-password\" placeholder=\"Enter your email\" spellcheck=\"false\" autocorrect=\"off\">\n					<div id=\"submit-pass-reset\" class=\"login_button reset-button\">Reset</div>\n				</div>\n				\n				<div id=\"forgot-error\" class=\"hide\"><span>Error.</span> Please try again!</div>\n				\n				<div id=\"forgot-success\" class=\"hide\">\n					<h3 style=\"padding-top:40px\"><span>Success!</span> Check your email.</h3>\n					<p>We have sent you instructions on how to reset it.</p>\n					<div id=\"resetBack\" class=\"login_button reset-button-back\">Login</div>\n				</div>\n				\n				\n			</div>\n				\n	</div>\n			\n	</div><!-- end wrapper -->	\n</div><!-- end page -->";});
});
window.require.register("views/templates/settings", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, foundHelper, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


    buffer += "<div class=\"header drop_shadow\">\n	<div id=\"menu_button\"></div>\n	Settings\n	<div id=\"iosbutton\" class=\"button-right help\">?</div>\n</div>\n\n<div id=\"profile-page\" class=\"content_wrapper\">\n	<div id=\"settings-overlay\" class=\"hide\"></div>\n	<div id=\"profile-left\">\n		<div id=\"settingsPicker\" class=\"profile-thumb\" style=\"background-image:url(";
    foundHelper = helpers.teacher;
    stack1 = foundHelper || depth0.teacher;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.teacher_image);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "teacher.teacher_image", { hash: {} }); }
    buffer += escapeExpression(stack1) + ");\">\n			<div class=\"portrait-shadow\"></div>\n		</div>\n		\n		<div id=\"profile-buttons\">\n			<div class=\"button change-photo-btn\">Change Photo</div>\n			<div class=\"button settings-add-btn\">Add Students</div>			\n			<div class=\"button change-pass-btn\">Change Password</div>\n			<div class=\"button logout-btn\">LOG OUT</div>\n		</div>\n	</div>\n	\n	<div id=\"profile-info\" class=\"ghost-field\" >\n		<input id=\"displayname\" type=\"text\" value=\"";
    foundHelper = helpers.teacher;
    stack1 = foundHelper || depth0.teacher;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.teacher_display_name);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "teacher.teacher_display_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" placeholder=\"Display Name\" data-intro=\"The name you and your students will see. Tap to edit in place.\" data-position=\"right\">\n		\n		<div class=\"absolute under help-settings\" data-intro=\"Tap to edit your school's information\" data-position=\"right\"></div> \n		\n		<h3>Name: ";
    foundHelper = helpers.teacher;
    stack1 = foundHelper || depth0.teacher;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.teacher_first_name);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "teacher.teacher_first_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + " ";
    foundHelper = helpers.teacher;
    stack1 = foundHelper || depth0.teacher;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.teacher_last_name);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "teacher.teacher_last_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h3>\n		<h3 style=\"width: 150px;\" data-intro=\"The School ID Code will help you pull the correct list of students.\" data-position=\"right\">School ID: ";
    foundHelper = helpers.teacher;
    stack1 = foundHelper || depth0.teacher;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.customer_id);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "teacher.customer_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h3>\n		<input id=username type=\"email\" value=\"";
    foundHelper = helpers.teacher;
    stack1 = foundHelper || depth0.teacher;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.teacher_username);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "teacher.teacher_username", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" placeholder=\"Your Username\">\n		\n		<h3>School Details</h3>\n		\n		<input id=\"schoolname\" type=\"text\" value=\"";
    foundHelper = helpers.teacher;
    stack1 = foundHelper || depth0.teacher;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.customer_school);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "teacher.customer_school", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" placeholder=\"School\"><br>\n		<input id=\"districtname\" type=\"text\" value=\"";
    foundHelper = helpers.teacher;
    stack1 = foundHelper || depth0.teacher;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.customer_district);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "teacher.customer_district", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" placeholder=\"District\"><br>\n		<input id=\"city\" type=\"text\" value=\"";
    foundHelper = helpers.teacher;
    stack1 = foundHelper || depth0.teacher;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.customer_city);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "teacher.customer_city", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" placeholder=\"City\"><br>\n		<input id=\"state\" maxlength=\"2\" type=\"text\" value=\"";
    foundHelper = helpers.teacher;
    stack1 = foundHelper || depth0.teacher;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.customer_state);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "teacher.customer_state", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" placeholder=\"State\"><br>\n		<input id=\"country\" type=\"text\" value=\"";
    foundHelper = helpers.teacher;
    stack1 = foundHelper || depth0.teacher;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.customer_country);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "teacher.customer_country", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" placeholder=\"Country\">\n		\n	</div>\n	\n	<div id=\"settings-add-student\" class=\"hide settings-right\">\n		<h2>Add Students</h2>\n			<label class=\"element-details add-students-form\">\n				<input id=\"addFirst\" placeholder=\"First Name\" type=\"text\" spellcheck=\"false\" autocorrect=\"off\">\n			</label>\n			\n			<label class=\"element-details add-students-form\">\n				<input id=\"addLast\" placeholder=\"Last Name\" type=\"text\" spellcheck=\"false\" autocorrect=\"off\">\n			</label>\n\n			<div class=\"clear\"></div>\n			\n		<div id=\"addStudent\" class=\"button list-add-btn\">Add Student</div>	\n		<div id=\"cancelStudent\" class=\"button settings-cancel-btn\">Close</div>\n		\n		<div class=\"clear\"></div>\n		\n		<p>Have more than a few students to add? <br>\n			<a href=\"mailto:albert@hmsteach.com?subject=Add more students for me!\">Send us an email</a> and we'll be happy to add them for you.\n		</p>			\n	</div>\n	\n	<div id=\"settings-change-pass\" class=\"hide settings-right\">\n		<h2>Change Password</h2>\n		\n			<label class=\"element-details add-students-form\">\n				<input id=\"oldPass\" placeholder=\"Old Password\" type=\"password\">\n			</label>\n		\n			<label class=\"element-details add-students-form\">\n				<input id=\"newPass\" placeholder=\"New Password\" type=\"password\">\n			</label>\n			\n			<label class=\"element-details add-students-form\">\n				<input id=\"confirmPass\" placeholder=\"Confirm New Password\" type=\"password\">\n			</label>\n\n			<div class=\"clear\"></div>\n			\n			<div id=\"changePass\" class=\"button list-add-btn\">Change Password</div>\n			<div class=\"button settings-cancel-btn\">Cancel</div>\n		\n			<div class=\"clear\"></div>				\n	</div>\n</div>";
    return buffer;});
});
window.require.register("views/templates/spinner", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<div class=\"spinnerModal\">\n  <div class=\"spinnerContainer\">\n		<div class=\"description\">Loading</div>\n		<div class=\"spinnerWrapper\">	\n			<div class=\"spinner\">\n		    <div class=\"bar1\"></div>\n		    <div class=\"bar2\"></div>\n		    <div class=\"bar3\"></div>\n		    <div class=\"bar4\"></div>\n		    <div class=\"bar5\"></div>\n		    <div class=\"bar6\"></div>\n		    <div class=\"bar7\"></div>\n		    <div class=\"bar8\"></div>\n		    <div class=\"bar9\"></div>\n		    <div class=\"bar10\"></div>\n		    <div class=\"bar11\"></div>\n		    <div class=\"bar12\"></div>\n		  </div>\n		</div>	\n  </div>\n</div>";});
});
window.require.register("views/templates/student", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, foundHelper, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


    buffer += "<div class=\"header drop_shadow\">\n	<div id=\"back-button\"></div>\n	";
    foundHelper = helpers.student;
    stack1 = foundHelper || depth0.student;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.student_name);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student.student_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + " \n</div>\n\n<div id=\"profile-page\" class=\"content_wrapper\">\n	<div id=\"profile-left\">\n		<div class=\"profile-thumb\" style=\"background-image:url(";
    foundHelper = helpers.student;
    stack1 = foundHelper || depth0.student;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.student_image);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student.student_image", { hash: {} }); }
    buffer += escapeExpression(stack1) + ");\">\n			<div class=\"portrait-shadow\"></div>\n		</div>\n		\n	</div>\n		\n	<div id=\"profile-info\">\n		<h1>";
    foundHelper = helpers.student;
    stack1 = foundHelper || depth0.student;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.student_name);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student.student_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h1>\n		<h3>Passcode: ";
    foundHelper = helpers.student;
    stack1 = foundHelper || depth0.student;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.student_code);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student.student_code", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h3>\n	\n		<h3>Contact Information</h3>\n		<p> Phone: ";
    foundHelper = helpers.student;
    stack1 = foundHelper || depth0.student;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.phone_number);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student.phone_number", { hash: {} }); }
    buffer += escapeExpression(stack1) + "<br>\n			Email: ";
    foundHelper = helpers.student;
    stack1 = foundHelper || depth0.student;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.email);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student.email", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n		\n		<h3>Address</h3>\n		<p> ";
    foundHelper = helpers.student;
    stack1 = foundHelper || depth0.student;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.street1);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student.street1", { hash: {} }); }
    buffer += escapeExpression(stack1) + "<br>\n			";
    foundHelper = helpers.student;
    stack1 = foundHelper || depth0.student;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.street2);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student.street2", { hash: {} }); }
    buffer += escapeExpression(stack1) + "<br>\n			";
    foundHelper = helpers.student;
    stack1 = foundHelper || depth0.student;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.city);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student.city", { hash: {} }); }
    buffer += escapeExpression(stack1) + ", ";
    foundHelper = helpers.student;
    stack1 = foundHelper || depth0.student;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.state);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student.state", { hash: {} }); }
    buffer += escapeExpression(stack1) + " ";
    foundHelper = helpers.student;
    stack1 = foundHelper || depth0.student;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.zip);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student.zip", { hash: {} }); }
    buffer += escapeExpression(stack1) + "<br>\n			";
    foundHelper = helpers.student;
    stack1 = foundHelper || depth0.student;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.country);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student.country", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>	\n			\n		<h3>About Me</h3>\n		<p class=\"student-description\">";
    foundHelper = helpers.student;
    stack1 = foundHelper || depth0.student;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.student_description);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student.student_description", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n	</div>\n	\n	<div id=\"settings-student-passcode\" class=\"hide settings-right\">\n		<h2>Change Passcode</h2>\n			\n		<!--Create Passcode-->\n			<div id=\"create-passcode\">\n				<div id=\"create-passbox1\" class=\"pass-box\"></div>\n				<div id=\"create-passbox2\" class=\"pass-box\"></div>\n				<div id=\"create-passbox3\" class=\"pass-box\"></div>\n				<div id=\"create-passbox4\" class=\"pass-box last\"></div>	\n			</div>\n			\n			<div id=\"passcode-container\">\n				<div id=\"1\" class=\"password-block enter-password\">1</div>\n				<div id=\"2\" class=\"password-block enter-password\">2</div>\n				<div id=\"3\" class=\"password-block enter-password password-block-last\">3</div>\n				<div id=\"4\" class=\"password-block enter-password \">4</div>\n				<div id=\"5\" class=\"password-block enter-password\">5</div>\n				<div id=\"6\" class=\"password-block enter-password password-block-last\">6</div>\n				<div id=\"7\" class=\"password-block enter-password\">7</div>\n				<div id=\"8\" class=\"password-block enter-password\">8</div>\n				<div id=\"9\" class=\"password-block enter-password password-block-last\">9</div>\n				\n			<div class=\"button settings-cancel-btn\" style=\"margin-top:30px\">Close</div>\n			\n			</div>\n					\n	</div>\n	\n</div>\n\n</div>";
    return buffer;});
});
window.require.register("views/templates/studentAnnouncements", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n";
    foundHelper = helpers.announcement;
    stack1 = foundHelper || depth0.announcement;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.response_list);
    stack2 = helpers.each;
    tmp1 = self.program(2, program2, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		";
    return buffer;}
  function program2(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n<div class=\"discussion student-chat\">\n	<div class=\"message-meta\">\n		<h3>";
    foundHelper = helpers.contributor_name;
    stack1 = foundHelper || depth0.contributor_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "contributor_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h3>\n		<p>";
    foundHelper = helpers.timestamp;
    stack1 = foundHelper || depth0.timestamp;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "timestamp", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n	</div>			\n	<div class=\"message-thumb\" style=\"background-image:url(";
    foundHelper = helpers.contributor_image;
    stack1 = foundHelper || depth0.contributor_image;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "contributor_image", { hash: {} }); }
    buffer += escapeExpression(stack1) + ");\"><div class=\"portrait-shadow\"></div></div>\n	<div class=\"message\"><p>";
    foundHelper = helpers.body;
    stack1 = foundHelper || depth0.body;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "body", { hash: {} }); }
    buffer += escapeExpression(stack1) + " </p></div>\n</div>\n		";
    return buffer;}

  function program4(depth0,data) {
    
    
    return "\n	<div id=\"empty\" class=\"empty-message\">\n		<div class=\"empty-set set-announcement\"></div>\n			<h4>Have something to say?</h4>\n			<p>Type your message in the comment box.</p>\n	</div>\n	";}

    buffer += "<div class=\"section section-shadow discussion-header\">\n	<div id=\"discussion-teacher-hero\" style=\"background-image:url(";
    foundHelper = helpers.announcement;
    stack1 = foundHelper || depth0.announcement;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.moderator_image);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "announcement.moderator_image", { hash: {} }); }
    buffer += escapeExpression(stack1) + ");\"><div class=\"portrait-shadow\"></div></div>	\n	<div class=\"discussion-item-header\">\n		<span>";
    foundHelper = helpers.announcement;
    stack1 = foundHelper || depth0.announcement;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.timestamp);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "announcement.timestamp", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</span>\n		<h1>";
    foundHelper = helpers.announcement;
    stack1 = foundHelper || depth0.announcement;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.header);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "announcement.header", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h1>\n		<p>";
    foundHelper = helpers.announcement;
    stack1 = foundHelper || depth0.announcement;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.body);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "announcement.body", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n	</div>\n</div>\n\n<div id=\"scrollDiscussion\" class=\"scroll_wrapper\">\n	\n<div id=\"scroller\">\n";
    foundHelper = helpers.announcement;
    stack1 = foundHelper || depth0.announcement;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.response_list);
    stack2 = helpers['if'];
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(4, program4, data);
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n	</div><!--end #scroller-->	\n</div><!--end #scrollDiscussion-->\n\n<div id=\"comment-form\">\n	<input id=\"commentMessage\" placeholder=\"Your Messsage\" type=\"text\">\n	<div id=\"iosbutton\" class=\"comment-send-btn\">Send</div>\n</div>\n";
    return buffer;});
});
window.require.register("views/templates/studentAnnouncementsList", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n			<div data-id=\"";
    foundHelper = helpers.announcement_id;
    stack1 = foundHelper || depth0.announcement_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "announcement_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"discussion-sidebar-item\">\n				<h2>";
    foundHelper = helpers.header;
    stack1 = foundHelper || depth0.header;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "header", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h2>\n				<p>";
    foundHelper = helpers.body;
    stack1 = foundHelper || depth0.body;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "body", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n				<div class=\"discussion-count\">";
    foundHelper = helpers.response_count;
    stack1 = foundHelper || depth0.response_count;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "response_count", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</div>\n			</div>\n			";
    return buffer;}

  function program3(depth0,data) {
    
    
    return "\n	\n	";}

  function program5(depth0,data) {
    
    
    return "\n		<div id=\"empty\" class=\"empty-message\">\n		<div class=\"empty-set set-announcement\"></div>\n			<h4>No Announcements yet...</h4>\n			<p>Anyone there?</p>\n	</div>\n	";}

    buffer += "<div class=\"header drop_shadow\">\n	<div id=\"menu_button\"></div>\n	Announcements\n</div>\n\n<div class=\"content_wrapper\">\n	\n	<div id=\"scrollDiscussionSidebar\" class=\"scroll_wrapper\">\n		<div id=\"scroller\">\n		\n		";
    foundHelper = helpers.student_announce;
    stack1 = foundHelper || depth0.student_announce;
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			\n		</div><!--end #scroller-->	\n	</div><!--end #scrollDiscussionSidebar-->\n	\n	<div id=\"announcements-body\">\n	\n		";
    foundHelper = helpers.announcement_list;
    stack1 = foundHelper || depth0.announcement_list;
    stack2 = helpers['if'];
    tmp1 = self.program(3, program3, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(5, program5, data);
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n	\n	</div>\n\n\n</div><!--end #content_wrapper-->	";
    return buffer;});
});
window.require.register("views/templates/studentAssignments", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n			";
    foundHelper = helpers.assignment_list;
    stack1 = foundHelper || depth0.assignment_list;
    stack2 = helpers['if'];
    tmp1 = self.program(2, program2, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(5, program5, data);
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		";
    return buffer;}
  function program2(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n			";
    foundHelper = helpers.assignment_list;
    stack1 = foundHelper || depth0.assignment_list;
    stack2 = helpers.each;
    tmp1 = self.program(3, program3, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			";
    return buffer;}
  function program3(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n			<div data-id= ";
    foundHelper = helpers.element_id;
    stack1 = foundHelper || depth0.element_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + " class=\"assignments-thumb item\">\n				<div class=\"assignments-thumb-title\">";
    foundHelper = helpers.title;
    stack1 = foundHelper || depth0.title;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "title", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</div>\n				<div class=\"assignments-thumb-date\">";
    foundHelper = helpers.date_due;
    stack1 = foundHelper || depth0.date_due;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "date_due", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</div>\n			</div>\n			";
    return buffer;}

  function program5(depth0,data) {
    
    
    return "\n			<div id=\"empty\">\n				<div class=\"empty-set set-assignment\"></div>\n				<h4>Take a break!</h4>\n				<p>You don't have any assignments!</p>\n			</div>\n			";}

    buffer += "<div class=\"header drop_shadow\">\n	<div id=\"menu_button\"></div>\n\n	Assignments\n</div>\n\n<div class=\"content_wrapper\">\n	<div id=\"scrollElement\" class=\"scroll_wrapper\">\n		<div id=\"scroller\">\n		\n		";
    foundHelper = helpers.student_assignments;
    stack1 = foundHelper || depth0.student_assignments;
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		\n		\n		</div>\n	</div>\n</div>\n";
    return buffer;});
});
window.require.register("views/templates/studentBookmarks", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<div class=\"header drop_shadow\">\n	<div id=\"menu_button\"></div>\n	Bookmarks\n</div>\n\n<div id=\"studentBookmark_page\" class=\"content_wrapper\">\n	<div id=\"scrollElement\" class=\"scroll_wrapper\">\n		<div id=\"scroller\">\n			\n		</div>\n	</div>\n</div>";});
});
window.require.register("views/templates/studentElement", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<div class=\"header drop_shadow\">\n	<div id=\"menu_button\"></div>\n	Learning Object\n</div>\n\n<div id=\"studentElement_page\" class=\"content_wrapper\">\n	<div id=\"scrollElement\" class=\"scroll_wrapper\">\n		<div id=\"scroller\">\n			\n		</div>\n	</div>\n</div>";});
});
window.require.register("views/templates/studentHomeAnnounce", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n		<div id=\"student-home-announce\">\n		\n		";
    foundHelper = helpers.announcements;
    stack1 = foundHelper || depth0.announcements;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.student_announce);
    stack2 = helpers.each;
    tmp1 = self.program(2, program2, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		</div>\n		";
    return buffer;}
  function program2(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n			<div data-id=\"";
    foundHelper = helpers.announcement_id;
    stack1 = foundHelper || depth0.announcement_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "announcement_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"announcement-item\">\n				<div class=\"announcement-header\">\n					<div class=\"announce-thumb\" style=\"background: url(";
    foundHelper = helpers.moderator_image;
    stack1 = foundHelper || depth0.moderator_image;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "moderator_image", { hash: {} }); }
    buffer += escapeExpression(stack1) + ");\"><div class=\"portrait-shadow\"></div></div>			\n					<div class=\"announcement-date\">";
    foundHelper = helpers.timestamp;
    stack1 = foundHelper || depth0.timestamp;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "timestamp", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</div>\n					<h3>";
    foundHelper = helpers.moderator_name;
    stack1 = foundHelper || depth0.moderator_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "moderator_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h3>\n				</div>\n				<div class=\"announcement-border\">&nbsp;</div>\n				<p class=\"announcement\"><strong>";
    foundHelper = helpers.header;
    stack1 = foundHelper || depth0.header;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "header", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</strong><br>\n				 ";
    foundHelper = helpers.body;
    stack1 = foundHelper || depth0.body;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "body", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n				 </p>\n				<div class=\"announcement-footer\">\n					<div class=\"announcement-comment-icon\"></div>\n					<p><strong>";
    foundHelper = helpers.response_count;
    stack1 = foundHelper || depth0.response_count;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "response_count", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</strong> Comments</p>	\n				</div>\n			</div>	\n			";
    return buffer;}

  function program4(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n		";
    foundHelper = helpers.assignment_list;
    stack1 = foundHelper || depth0.assignment_list;
    stack2 = helpers['if'];
    tmp1 = self.program(5, program5, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(8, program8, data);
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			\n			";
    return buffer;}
  function program5(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n		";
    foundHelper = helpers.assignment_list;
    stack1 = foundHelper || depth0.assignment_list;
    stack2 = helpers.each;
    tmp1 = self.program(6, program6, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			";
    return buffer;}
  function program6(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "						\n		\n			<div data-id=\"";
    foundHelper = helpers.element_id;
    stack1 = foundHelper || depth0.element_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"home-assign-item\">\n				<h3>";
    foundHelper = helpers.title;
    stack1 = foundHelper || depth0.title;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "title", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h3>\n				<p>";
    foundHelper = helpers.notes;
    stack1 = foundHelper || depth0.notes;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "notes", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n				<div class=\"assignment-footer\">\n					<p><strong>Due</strong> ";
    foundHelper = helpers.date_due;
    stack1 = foundHelper || depth0.date_due;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "date_due", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n				</div>\n			</div>\n			\n			";
    return buffer;}

  function program8(depth0,data) {
    
    
    return "\n			<div class=\"empty-text\">\n				<h3>Lucky you!</h3>\n				<p>You have no assignments!</p>\n			</div>\n			";}

    buffer += "<div id=\"home-view-cover\"></div>\n\n<div class=\"header drop_shadow\">\n	<div id=\"menu_button\"></div>\n	Home\n</div>\n\n<div id=\"home_page\" class=\"home-wrapper\">\n\n	<div class=\"secondary-nav\">\n			<div class=\"secondary-nav-header student-header student-nav-active\">\n				<div class=\"student-nav-icon\"></div>\n				<div class=\"student-nav-text\">Announcements</div>\n			</div>		\n			<div class=\"secondary-nav-header student-header-assign\">\n				<div class=\"student-nav-icon-assign\"></div>\n				<div class=\"student-nav-text\">Assignments</div>\n			</div>\n	</div><!--end #secondary-nav-->\n	\n	<div id=\"scrollHome\">\n		<div id=\"scroller-home-student\">\n		";
    foundHelper = helpers.blank;
    stack1 = foundHelper || depth0.blank;
    stack2 = helpers.unless;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "	\n\n		<div id=\"student-home-assign\" class=\"hide\">\n		\n		";
    foundHelper = helpers.assignments;
    stack1 = foundHelper || depth0.assignments;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.student_assignments);
    stack2 = helpers.each;
    tmp1 = self.program(4, program4, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		\n		</div>\n		\n				\n		</div><!--end #scroller-home-student-->\n	</div><!--end #scrollHome-->\n	\n	<div id=\"recent-items-container\">	\n	\n		<div id=\"recent-items-inner\">\n			<h3 class=\"items-header\">Recent Items</h3>\n			<div class=\"corner\"></div>\n		</div><!--end #recent-items-container-->\n		\n		<div id=\"scrollPosts\">\n						\n		</div><!--end #scrollPosts -->\n\n</div><!--end #home_page -->";
    return buffer;});
});
window.require.register("views/templates/studentHomeRecent", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n	";
    foundHelper = helpers.student_activity;
    stack1 = foundHelper || depth0.student_activity;
    stack2 = helpers.each;
    tmp1 = self.program(2, program2, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n	";
    return buffer;}
  function program2(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n		<div id=\"lesson\" data-id= ";
    foundHelper = helpers.object_id;
    stack1 = foundHelper || depth0.object_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "object_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + " class=\"student-recent-item\" style=\"background: url(";
    foundHelper = helpers.lesson_image_small;
    stack1 = foundHelper || depth0.lesson_image_small;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "lesson_image_small", { hash: {} }); }
    buffer += escapeExpression(stack1) + "); background-repeat: no-repeat; background-size:cover;\">\n			<span>";
    foundHelper = helpers.lesson_name;
    stack1 = foundHelper || depth0.lesson_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "lesson_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</span>\n		</div>\n	";
    return buffer;}

  function program4(depth0,data) {
    
    
    return "\n		<div class=\"empty-text\">\n			<h3>Nothing to show yet &hellip;</h3>\n			<p>Time to get to work!</p>\n		</div>\n	";}

    buffer += "<div id=\"scroller-recent-items\">\n	";
    foundHelper = helpers.student_activity;
    stack1 = foundHelper || depth0.student_activity;
    stack2 = helpers['if'];
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(4, program4, data);
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n\n</div><!--end #scroller-recent-items -->";
    return buffer;});
});
window.require.register("views/templates/studentLesson", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n		<div class=\"publish-border unit-header-image\" style=\"background: url('";
    foundHelper = helpers.lesson_image;
    stack1 = foundHelper || depth0.lesson_image;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "lesson_image", { hash: {} }); }
    buffer += escapeExpression(stack1) + "')\"></div>\n			<div class=\"section-header student-section\">\n				<h1>";
    foundHelper = helpers.lesson_name;
    stack1 = foundHelper || depth0.lesson_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "lesson_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h1>\n				<p class=\"subheader\">";
    foundHelper = helpers.lesson_description;
    stack1 = foundHelper || depth0.lesson_description;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "lesson_description", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n				";
    return buffer;}

  function program3(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n			";
    foundHelper = helpers.element_list;
    stack1 = foundHelper || depth0.element_list;
    stack2 = helpers.each;
    tmp1 = self.program(4, program4, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "				\n			";
    return buffer;}
  function program4(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n			<div data-id=\"";
    foundHelper = helpers.element_id;
    stack1 = foundHelper || depth0.element_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" ";
    foundHelper = helpers.video_url;
    stack1 = foundHelper || depth0.video_url;
    stack2 = helpers['if'];
    tmp1 = self.program(5, program5, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += " class=\"element_thumb item\">\n				<div data-id=\"";
    foundHelper = helpers.element_id;
    stack1 = foundHelper || depth0.element_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" ";
    foundHelper = helpers.video_url;
    stack1 = foundHelper || depth0.video_url;
    stack2 = helpers['if'];
    tmp1 = self.program(7, program7, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += " class=\"item_image ";
    foundHelper = helpers.element_type;
    stack1 = foundHelper || depth0.element_type;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_type", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" style=\"background-image:url(";
    foundHelper = helpers.element_image;
    stack1 = foundHelper || depth0.element_image;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_image", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\"></div>\n				<!--<h4><h4>";
    foundHelper = helpers.element_type;
    stack1 = foundHelper || depth0.element_type;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_type", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h4>-->\n				<h3>";
    foundHelper = helpers.element_name;
    stack1 = foundHelper || depth0.element_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h3>\n			</div>\n			";
    return buffer;}
  function program5(depth0,data) {
    
    var buffer = "", stack1;
    buffer += " data-urls=\"";
    foundHelper = helpers.video_url;
    stack1 = foundHelper || depth0.video_url;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "video_url", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" ";
    return buffer;}

  function program7(depth0,data) {
    
    var buffer = "", stack1;
    buffer += " data-urls=\"";
    foundHelper = helpers.video_url;
    stack1 = foundHelper || depth0.video_url;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "video_url", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" ";
    return buffer;}

    buffer += "<div class=\"header drop_shadow\">\n	<div id=\"back-button\"></div>\n	Lesson\n</div>\n\n<div id=\"lesson_page\" class=\"content_wrapper\">\n\n	<div class=\"section section-shadow\">\n		<div id=\"section-header-wrap\">\n		";
    foundHelper = helpers.student_lesson;
    stack1 = foundHelper || depth0.student_lesson;
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			</div>\n		</div>\n	</div>\n	\n	<div id=\"scrollElements\" class=\"scroll_wrapper\">\n		<div id=\"scroller\">\n		";
    foundHelper = helpers.student_lesson;
    stack1 = foundHelper || depth0.student_lesson;
    stack2 = helpers.each;
    tmp1 = self.program(3, program3, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		</div>\n</div>";
    return buffer;});
});
window.require.register("views/templates/studentSettings", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, foundHelper, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


    buffer += "<div class=\"header drop_shadow\">\n	<div id=\"menu_button\"></div>\n	Settings\n</div>\n\n<div id=\"profile-page\" class=\"content_wrapper\">\n	<div id=\"settings-overlay\" class=\"hide\"></div>\n	<div id=\"profile-left\">\n		<div class=\"profile-thumb\" style=\"background-image:url(";
    foundHelper = helpers.student;
    stack1 = foundHelper || depth0.student;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.image_url);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student.image_url", { hash: {} }); }
    buffer += escapeExpression(stack1) + ");\">\n			<div class=\"portrait-shadow\"></div>\n		</div>\n		\n		<div id=\"profile-buttons\">\n			<div class=\"button change-photo-btn\">Change Photo</div>\n			<div class=\"button change-pass-btn\">Change Passcode</div>\n			<div class=\"button logout-btn\">LOG OUT</div>\n		</div>\n	</div>\n	\n	<div id=\"profile-info\" class=\"ghost-field\">\n		<h1>";
    foundHelper = helpers.student;
    stack1 = foundHelper || depth0.student;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.student_name);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student.student_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h1>\n		<h3>Passcode: ";
    foundHelper = helpers.student;
    stack1 = foundHelper || depth0.student;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.passcode);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student.passcode", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h3>\n	\n		<h3>Contact Information</h3>\n			<input id=\"parent\" type=\"text\" value=\"";
    foundHelper = helpers.student;
    stack1 = foundHelper || depth0.student;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.guardian);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student.guardian", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" placeholder=\"Parent or Guardian\"><br>\n			<input id=\"email\" type=\"email\" value=\"";
    foundHelper = helpers.student;
    stack1 = foundHelper || depth0.student;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.email);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student.email", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" placeholder=\"Email Address\"><br>\n			<input id=\"phone\" type=\"number\" value=\"";
    foundHelper = helpers.student;
    stack1 = foundHelper || depth0.student;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.phone_number);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student.phone_number", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" placeholder=\"Phone Number\">\n		\n		<h3>Address</h3>\n			<input id=\"street1\" type=\"text\" value=\"";
    foundHelper = helpers.student;
    stack1 = foundHelper || depth0.student;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.street1);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student.street1", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" placeholder=\"Street Address 1\"><br>\n			<input id=\"street2\" type=\"text\" value=\"";
    foundHelper = helpers.student;
    stack1 = foundHelper || depth0.student;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.street2);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student.street2", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" placeholder=\"Street Address 2\"><br>\n			<input id=\"city\" type=\"text\" value=\"";
    foundHelper = helpers.student;
    stack1 = foundHelper || depth0.student;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.city);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student.city", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" placeholder=\"City\"><br>\n			<input id=\"state\" type=\"text\" maxlength=\"2\" value=\"";
    foundHelper = helpers.student;
    stack1 = foundHelper || depth0.student;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.state);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student.state", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" placeholder=\"State\"><br>\n			<input id=\"zip\" type=\"text\" value=\"";
    foundHelper = helpers.student;
    stack1 = foundHelper || depth0.student;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.zip);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student.zip", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" placeholder=\"ZIP Code\"><br>\n			<input id=\"country\" type=\"text\" value=\"";
    foundHelper = helpers.student;
    stack1 = foundHelper || depth0.student;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.country);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student.country", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" placeholder=\"Country\">				\n		\n		<h3>About Me</h3>\n			<textarea id=\"aboutme\" maxlength=\"140\" placeholder=\"About Me in 140 characters!\">";
    foundHelper = helpers.student;
    stack1 = foundHelper || depth0.student;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.student_description);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student.student_description", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</textarea>	\n	</div>\n	\n	\n	<div id=\"settings-student-passcode\" class=\"hide settings-right\">\n		<h2>Change Passcode</h2>\n			\n		<!--Create Passcode-->\n			<div id=\"create-passcode\">\n				<div id=\"create-passbox1\" class=\"pass-box\"></div>\n				<div id=\"create-passbox2\" class=\"pass-box\"></div>\n				<div id=\"create-passbox3\" class=\"pass-box\"></div>\n				<div id=\"create-passbox4\" class=\"pass-box last\"></div>	\n			</div>\n			\n			<div id=\"passcode-container\">\n				<div id=\"1\" class=\"password-block enter-password\">1</div>\n				<div id=\"2\" class=\"password-block enter-password\">2</div>\n				<div id=\"3\" class=\"password-block enter-password password-block-last\">3</div>\n				<div id=\"4\" class=\"password-block enter-password \">4</div>\n				<div id=\"5\" class=\"password-block enter-password\">5</div>\n				<div id=\"6\" class=\"password-block enter-password password-block-last\">6</div>\n				<div id=\"7\" class=\"password-block enter-password\">7</div>\n				<div id=\"8\" class=\"password-block enter-password\">8</div>\n				<div id=\"9\" class=\"password-block enter-password password-block-last\">9</div>\n				\n			<div class=\"button settings-cancel-btn\" style=\"margin-top:30px\">Cancel</div>\n			\n			</div>\n					\n	</div>\n	\n</div>";
    return buffer;});
});
window.require.register("views/templates/studentSubject", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n		";
    foundHelper = helpers.unit_id;
    stack1 = foundHelper || depth0.unit_id;
    stack2 = helpers['if'];
    tmp1 = self.program(2, program2, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(4, program4, data);
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		";
    return buffer;}
  function program2(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n			<div data-id=\"";
    foundHelper = helpers.unit_id;
    stack1 = foundHelper || depth0.unit_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"unit_thumb item\">\n				<h1>";
    foundHelper = helpers.unit_name;
    stack1 = foundHelper || depth0.unit_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h1>\n				<div class=\"unit-thumb-student-img\" style=\"background-image:url(";
    foundHelper = helpers.unit_image;
    stack1 = foundHelper || depth0.unit_image;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_image", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\"></div>\n				<p>\n					<span style=\"background-image:url(images/hexagon.png)\">\n						<b>";
    foundHelper = helpers.lesson_count;
    stack1 = foundHelper || depth0.lesson_count;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "lesson_count", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</b> Lessons\n					</span>\n					<span style=\"background-image:url(images/triangle.png)\">\n						<b>";
    foundHelper = helpers.element_count;
    stack1 = foundHelper || depth0.element_count;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_count", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</b> Elements\n					</span>\n				</p> \n			</div>	\n		";
    return buffer;}

  function program4(depth0,data) {
    
    
    return "\n			<div id=\"empty\">\n				<div class=\"empty-set set-unit\"></div>\n				<h4>Phew!</h4>\n				<p>Your teacher hasn't created any lessons yet.</p>\n			</div>\n		";}

    buffer += "<div class=\"header drop_shadow\">\n	<div id=\"menu_button\"></div>\n	Units\n</div>\n\n<div id=\"studentSubject_page\" class=\"content_wrapper\">\n	<div id=\"scrollStudentUnits\" class=\"scroll_wrapper\">\n		<div id=\"scroller\">\n				\n		";
    foundHelper = helpers.unit_list;
    stack1 = foundHelper || depth0.unit_list;
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n\n		</div>\n	</div>\n</div>\n";
    return buffer;});
});
window.require.register("views/templates/studentSupplemental", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<div class=\"header drop_shadow\">\n	<div id=\"menu_button\"></div>\n	Supplemental Lessons\n</div>\n\n<div id=\"studentSupplemental_page\" class=\"content_wrapper\">\n	<div id=\"scrollElement\" class=\"scroll_wrapper\">\n		<div id=\"scroller\">\n			\n		</div>\n	</div>\n</div>";});
});
window.require.register("views/templates/studentUnit", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1;
    foundHelper = helpers.unit_image;
    stack1 = foundHelper || depth0.unit_image;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_image", { hash: {} }); }
    buffer += escapeExpression(stack1) + "')\"></div>	\n			<div class=\"section-header student-section\">\n				<h1>";
    foundHelper = helpers.unit_name;
    stack1 = foundHelper || depth0.unit_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h1>\n				<p class=\"subheader\">";
    foundHelper = helpers.unit_description;
    stack1 = foundHelper || depth0.unit_description;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_description", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n			</div>\n			";
    return buffer;}

  function program3(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n			";
    foundHelper = helpers.lesson_list;
    stack1 = foundHelper || depth0.lesson_list;
    stack2 = helpers.each;
    tmp1 = self.program(4, program4, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		";
    return buffer;}
  function program4(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n			<div data-id=\"";
    foundHelper = helpers.lesson_id;
    stack1 = foundHelper || depth0.lesson_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "lesson_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"lesson_thumb item\">\n				<h1 class=\"published-header\">";
    foundHelper = helpers.lesson_name;
    stack1 = foundHelper || depth0.lesson_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "lesson_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h1>\n				<div data-id=\"";
    foundHelper = helpers.lesson_id;
    stack1 = foundHelper || depth0.lesson_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "lesson_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"item_image\" style=\"background-image:url(";
    foundHelper = helpers.lesson_image;
    stack1 = foundHelper || depth0.lesson_image;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "lesson_image", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\"></div>\n				<div data-id=\"";
    foundHelper = helpers.lesson_id;
    stack1 = foundHelper || depth0.lesson_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "lesson_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"lesson-thumb-info\">\n					<div class=\"thumb-info-icon\"></div>\n					<span><strong>";
    foundHelper = helpers.element_count;
    stack1 = foundHelper || depth0.element_count;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_count", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</strong> Elements</span>\n				</div>\n			</div>\n			";
    return buffer;}

    buffer += "<div class=\"header drop_shadow\">\n	<div id=\"back-button\"></div>\n	Unit\n</div>\n\n<div id=\"unit_page\" class=\"content_wrapper\">\n	\n	<div class=\"section section-shadow\">\n		<div id=\"section-header-wrap\">\n			<div class=\"unit-header-image\" style=\"background: url('";
    foundHelper = helpers.student_unit;
    stack1 = foundHelper || depth0.student_unit;
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		</div>\n	</div>\n	\n	<div id=\"scrollLessons\" class=\"scroll_wrapper\">\n		<div id=\"scroller\">\n		";
    foundHelper = helpers.student_unit;
    stack1 = foundHelper || depth0.student_unit;
    stack2 = helpers.each;
    tmp1 = self.program(3, program3, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		</div>\n		\n	</div>\n	\n</div>";
    return buffer;});
});
window.require.register("views/templates/subject", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "	\n				";
    foundHelper = helpers.group_list;
    stack1 = foundHelper || depth0.group_list;
    stack2 = helpers.each;
    tmp1 = self.program(2, program2, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n				";
    return buffer;}
  function program2(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "	\n				<div id=\"";
    foundHelper = helpers.group_id;
    stack1 = foundHelper || depth0.group_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "group_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"sidebar_item group_item\" data-id=\"";
    foundHelper = helpers.group_id;
    stack1 = foundHelper || depth0.group_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "group_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" style=\"background-image:url(";
    foundHelper = helpers.group_image;
    stack1 = foundHelper || depth0.group_image;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "group_image", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\">\n					";
    foundHelper = helpers.group_name;
    stack1 = foundHelper || depth0.group_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "group_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\n				</div>\n				";
    return buffer;}

    buffer += "<div class=\"header drop_shadow\">\n	<div id=\"menu_button\"></div>\n	Units\n	<div id=\"iosbutton\" class=\"button-right help\">?</div>\n</div>\n\n<div id=\"subject_page\" class=\"content_wrapper unit-wrapper\">\n<div class=\"add_button\" data-intro=\"Create units, lessons and assignments; add media, documents and more.\" data-position=\"left\">\n		<div class=\"add_button_innards\"></div>\n	</div>\n\n	<div class=\"sidebar\">\n		<div id=\"groupall\" class=\"allunits active_sidebarItem\">\n			<h2>All Units</h2>\n		</div>\n		<div class=\"sidebar_title\" data-intro=\"Filter units by specific group.\" data-position=\"right\">By Group</div>\n		<div id=\"scrollGroups1\" class=\"scroll_wrapper\" style=\"top:130px\">\n			<div id=\"scroller\" class=\"scroller-unit\">\n				";
    foundHelper = helpers.teacher_groups;
    stack1 = foundHelper || depth0.teacher_groups;
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			</div>\n		</div>\n	</div>\n	\n	<div id=\"scrollUnits\" class=\"scroll_wrapper\">\n\n	</div>\n	\n</div>";
    return buffer;});
});
window.require.register("views/templates/subjectUnits", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n		";
    foundHelper = helpers.unit_list;
    stack1 = foundHelper || depth0.unit_list;
    stack2 = helpers.each;
    tmp1 = self.program(2, program2, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n	</div>\n	";
    return buffer;}
  function program2(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n		<div class=\"unit_thumb item\" data-id=\"";
    foundHelper = helpers.unit_id;
    stack1 = foundHelper || depth0.unit_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\">\n			<h1>";
    foundHelper = helpers.unit_name;
    stack1 = foundHelper || depth0.unit_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h1>\n			<div class=\"unit-thumb-img\" style=\"background-image:url(";
    foundHelper = helpers.unit_image;
    stack1 = foundHelper || depth0.unit_image;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_image", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\"></div>			\n			<p>\n				<span style=\"background-image:url(images/hexagon.png)\">\n					<b>";
    foundHelper = helpers.lesson_count;
    stack1 = foundHelper || depth0.lesson_count;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "lesson_count", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</b> Lessons\n				</span>\n				<span style=\"background-image:url(images/triangle.png)\">\n					<b>";
    foundHelper = helpers.element_count;
    stack1 = foundHelper || depth0.element_count;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_count", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</b> Elements\n				</span>\n			</p> \n		</div>\n		";
    return buffer;}

  function program4(depth0,data) {
    
    
    return "\n	<div id=\"empty\">\n		<div class=\"empty-set set-unit\"></div>\n		<h4>Just Getting Started?</h4>\n		<p>Create a new Unit by using the Add button</p>\n	</div>\n	";}

    buffer += "<div id=\"scroller\">	\n";
    foundHelper = helpers.unit_list;
    stack1 = foundHelper || depth0.unit_list;
    stack2 = helpers['if'];
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(4, program4, data);
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n</div>";
    return buffer;});
});
window.require.register("views/templates/unit", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1, stack2;
    foundHelper = helpers.unit_image;
    stack1 = foundHelper || depth0.unit_image;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_image", { hash: {} }); }
    buffer += escapeExpression(stack1) + "')\"></div>	\n		\n			<div class=\"section-header\">\n			<div class=\"absolute under help-unit\" data-intro=\"Tap to edit the Title and Description for this unit.\" data-position=\"bottom\"></div>\n				<div class=\"ghost-field ghost-material-header\">\n					<input id=\"unittitle\" type=\"text\" value=\"";
    foundHelper = helpers.unit_name;
    stack1 = foundHelper || depth0.unit_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" placeholder=\"Unit Title\"><br>\n				</div>\n				<div class=\"ghost-field ghost-material-subheader\">\n					<textarea id=\"unitdescription\" placeholder=\"Unit Description\">";
    foundHelper = helpers.unit_description;
    stack1 = foundHelper || depth0.unit_description;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_description", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</textarea>\n				</div>\n			</div>\n			\n			<div class=\"section-button-group\" data-intro=\"Once published, the unit becomes visible to students.\" data-position=\"left\">\n			<div class=\"trash hide\"></div>\n				";
    foundHelper = helpers.is_published;
    stack1 = foundHelper || depth0.is_published;
    stack2 = helpers['if'];
    tmp1 = self.program(2, program2, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(4, program4, data);
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n				";
    return buffer;}
  function program2(depth0,data) {
    
    
    return "\n		  			<div class=\"publish published\">Published</div>\n				";}

  function program4(depth0,data) {
    
    
    return "\n					<div class=\"publish\">Publish</div>\n				";}

  function program6(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n\n		";
    foundHelper = helpers.is_published;
    stack1 = foundHelper || depth0.is_published;
    stack2 = helpers['if'];
    tmp1 = self.program(7, program7, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(10, program10, data);
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		";
    return buffer;}
  function program7(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n			";
    foundHelper = helpers.lesson_list;
    stack1 = foundHelper || depth0.lesson_list;
    stack2 = helpers.each;
    tmp1 = self.program(8, program8, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			\n			";
    return buffer;}
  function program8(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n			<div data-id=\"";
    foundHelper = helpers.lesson_id;
    stack1 = foundHelper || depth0.lesson_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "lesson_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"lesson_thumb item\">\n				<h1 class=\"published-header\">";
    foundHelper = helpers.lesson_name;
    stack1 = foundHelper || depth0.lesson_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "lesson_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h1>\n				<div class=\"item_image\" style=\"background-image:url(";
    foundHelper = helpers.lesson_image;
    stack1 = foundHelper || depth0.lesson_image;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "lesson_image", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\"></div>\n				<div class=\"lesson-thumb-info\">\n					<div class=\"thumb-info-icon\"></div>\n					<span><strong>";
    foundHelper = helpers.element_count;
    stack1 = foundHelper || depth0.element_count;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_count", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</strong> Elements</span>\n				</div>\n			</div>\n			";
    return buffer;}

  function program10(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n			\n			";
    foundHelper = helpers.lesson_list;
    stack1 = foundHelper || depth0.lesson_list;
    stack2 = helpers.each;
    tmp1 = self.program(11, program11, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			\n		";
    return buffer;}
  function program11(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n			<div data-id=\"";
    foundHelper = helpers.lesson_id;
    stack1 = foundHelper || depth0.lesson_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "lesson_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"lesson_thumb item\">\n				<h1>";
    foundHelper = helpers.lesson_name;
    stack1 = foundHelper || depth0.lesson_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "lesson_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h1>\n				<div class=\"item_image\" style=\"background-image:url(";
    foundHelper = helpers.lesson_image;
    stack1 = foundHelper || depth0.lesson_image;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "lesson_image", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\"></div>\n				<div class=\"lesson-thumb-info\">\n					<div class=\"thumb-info-icon\"></div>\n					<span><strong>";
    foundHelper = helpers.element_count;
    stack1 = foundHelper || depth0.element_count;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_count", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</strong> Elements</span>\n				</div>\n			</div>\n			";
    return buffer;}

    buffer += "<div class=\"header drop_shadow\">\n<div id=\"menu_button\" class=\"hide\"></div>\n<div id=\"work-button\"></div>\n<div id=\"iosbutton\" class=\"button-right edit-unit\">Edit</div>\n<div id=\"iosbutton\" class=\"button-right help\">?</div>\n	Unit\n</div>\n\n<div id=\"unit_page\" class=\"content_wrapper\">\n	<div class=\"add_button\" data-intro=\"Create units, lessons and assignments; add media, documents and more.\" data-position=\"left\">\n		<div class=\"add_button_innards\"></div>\n	</div>\n	\n	<div class=\"section section-shadow\">\n		<div id=\"section-header-wrap\">\n		<div class=\"unit-header-image\" style=\"background: url('";
    foundHelper = helpers.teacher_unit;
    stack1 = foundHelper || depth0.teacher_unit;
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			</div>\n		</div>\n		\n	</div>\n	\n	<div id=\"scrollLessons\" class=\"scroll_wrapper\">\n		<div id=\"scroller\">\n		\n		";
    foundHelper = helpers.teacher_unit;
    stack1 = foundHelper || depth0.teacher_unit;
    stack2 = helpers.each;
    tmp1 = self.program(6, program6, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		</div>\n	</div>\n</div>";
    return buffer;});
});
window.require.register("views/templates_web/announcements", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n	";
    foundHelper = helpers.announcement;
    stack1 = foundHelper || depth0.announcement;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.response_list);
    stack2 = helpers.each;
    tmp1 = self.program(2, program2, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n	";
    return buffer;}
  function program2(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n	<div class=\"discussion student-chat\">\n		<div class=\"message-meta\">\n			<h3>";
    foundHelper = helpers.contributor_name;
    stack1 = foundHelper || depth0.contributor_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "contributor_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h3>\n			<p>";
    foundHelper = helpers.timestamp;
    stack1 = foundHelper || depth0.timestamp;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "timestamp", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n		</div>			\n		<div class=\"message-thumb\" style=\"background-image:url(";
    foundHelper = helpers.contributor_image;
    stack1 = foundHelper || depth0.contributor_image;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "contributor_image", { hash: {} }); }
    buffer += escapeExpression(stack1) + ");\"><div class=\"portrait-shadow\"></div></div>\n		<div class=\"message\"><p>";
    foundHelper = helpers.body;
    stack1 = foundHelper || depth0.body;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "body", { hash: {} }); }
    buffer += escapeExpression(stack1) + " </p></div>\n	</div>\n	";
    return buffer;}

  function program4(depth0,data) {
    
    
    return "\n	<div id=\"empty\" class=\"empty-message\">\n		<div class=\"empty-set set-announcement\"></div>\n			<h4>We are missing your voice.</h4>\n			<p>Type your message in the comment box.</p>\n	</div>\n	";}

    buffer += "	<div class=\"section section-shadow discussion-header\">\n		<div id=\"discussion-teacher-hero\" style=\"background-image:url(";
    foundHelper = helpers.announcement;
    stack1 = foundHelper || depth0.announcement;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.moderator_image);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "announcement.moderator_image", { hash: {} }); }
    buffer += escapeExpression(stack1) + ");\"><div class=\"portrait-shadow\"></div></div>	\n		<div class=\"discussion-item-header\">\n			<span>";
    foundHelper = helpers.announcement;
    stack1 = foundHelper || depth0.announcement;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.timestamp);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "announcement.timestamp", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</span>\n			<h1>";
    foundHelper = helpers.announcement;
    stack1 = foundHelper || depth0.announcement;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.header);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "announcement.header", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h1>\n			<p>";
    foundHelper = helpers.announcement;
    stack1 = foundHelper || depth0.announcement;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.body);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "announcement.body", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n		</div>\n	</div>\n	\n	<div id=\"scrollDiscussion\" class=\"scroll_wrapper\">\n		\n<div id=\"scroller\">\n\n	";
    foundHelper = helpers.announcement;
    stack1 = foundHelper || depth0.announcement;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.response_list);
    stack2 = helpers['if'];
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(4, program4, data);
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		</div><!--end #scroller-->	\n	</div><!--end #scrollDiscussion-->\n\n	<div id=\"comment-form\">\n		<input id=\"commentMessage\" placeholder=\"Your Messsage\" type=\"text\">\n		<div id=\"iosbutton\" class=\"comment-send-btn\">Send</div>\n	</div>\n	";
    return buffer;});
});
window.require.register("views/templates_web/announcementsList", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n		";
    foundHelper = helpers.announcement_list;
    stack1 = foundHelper || depth0.announcement_list;
    stack2 = helpers.each;
    tmp1 = self.program(2, program2, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			";
    return buffer;}
  function program2(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n			<div data-id=\"";
    foundHelper = helpers.announcement_id;
    stack1 = foundHelper || depth0.announcement_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "announcement_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"discussion-sidebar-item\">\n				<h2>";
    foundHelper = helpers.header;
    stack1 = foundHelper || depth0.header;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "header", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h2>\n				<p>";
    foundHelper = helpers.body;
    stack1 = foundHelper || depth0.body;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "body", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n				<div class=\"discussion-count\">";
    foundHelper = helpers.response_count;
    stack1 = foundHelper || depth0.response_count;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "response_count", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</div>\n			</div>\n			";
    return buffer;}

  function program4(depth0,data) {
    
    
    return "\n	\n	";}

  function program6(depth0,data) {
    
    
    return "\n		<div id=\"empty\" class=\"empty-message\">\n		<div class=\"empty-set set-announcement\"></div>\n			<h4>No Announcements Yet</h4>\n			<p>To send an Announcement, <strong class=\"goToGroups\">Select a Group</strong> and tap the announcement button.</p>\n	</div>\n	";}

    buffer += "<div class=\"header drop_shadow\">\n	<div id=\"menu_button\"></div>\n	Announcements\n</div>\n\n<div class=\"content_wrapper\">\n\n	<div class=\"add_button\">\n		<div class=\"add_button_innards\"></div>\n	</div>\n	\n\n	<div id=\"scrollDiscussionSidebar\" class=\"scroll_wrapper\">\n		<div id=\"scroller\">\n		";
    foundHelper = helpers.announcements;
    stack1 = foundHelper || depth0.announcements;
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n\n		</div><!--end #scroller-->	\n	</div><!--end #scrollDiscussionSidebar-->\n	\n	<div id=\"announcements-body\">\n	";
    foundHelper = helpers.announcement_list;
    stack1 = foundHelper || depth0.announcement_list;
    stack2 = helpers['if'];
    tmp1 = self.program(4, program4, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(6, program6, data);
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n	</div>\n\n\n</div><!--end #content_wrapper-->	";
    return buffer;});
});
window.require.register("views/templates_web/assignmentGroup", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n		";
    foundHelper = helpers.has_submission;
    stack1 = foundHelper || depth0.has_submission;
    stack2 = helpers['if'];
    tmp1 = self.program(2, program2, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(4, program4, data);
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		";
    return buffer;}
  function program2(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n			<div id=\"student_thumb\" data-id=\"";
    foundHelper = helpers.assignment_url;
    stack1 = foundHelper || depth0.assignment_url;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "assignment_url", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"assignment-student-thumb has-submitted\" style=\"background-image:url('";
    foundHelper = helpers.student_image_small;
    stack1 = foundHelper || depth0.student_image_small;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student_image_small", { hash: {} }); }
    buffer += escapeExpression(stack1) + "')\">\n				<div class=\"assignment-check\"></div>\n				<p>";
    foundHelper = helpers.student_name_first;
    stack1 = foundHelper || depth0.student_name_first;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student_name_first", { hash: {} }); }
    buffer += escapeExpression(stack1) + "<br>";
    foundHelper = helpers.student_name_last;
    stack1 = foundHelper || depth0.student_name_last;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student_name_last", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n			</div>\n		";
    return buffer;}

  function program4(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n			<div id=\"student_thumb\" data-id=\"\" class=\"assignment-student-thumb\" style=\"background-image:url('";
    foundHelper = helpers.student_image_small;
    stack1 = foundHelper || depth0.student_image_small;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student_image_small", { hash: {} }); }
    buffer += escapeExpression(stack1) + "')\">\n				<p>";
    foundHelper = helpers.student_name_first;
    stack1 = foundHelper || depth0.student_name_first;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student_name_first", { hash: {} }); }
    buffer += escapeExpression(stack1) + "<br>";
    foundHelper = helpers.student_name_last;
    stack1 = foundHelper || depth0.student_name_last;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student_name_last", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n			</div>		\n		";
    return buffer;}

    buffer += "<div class=\"header drop_shadow\">\n	<div id=\"back-button\"></div>\n	Assignment\n</div>\n\n<div class=\"content_wrapper\">\n	<div class=\"add_button\">\n		<div class=\"add_button_innards\"></div>\n	</div>\n	\n	<div class=\"section group-shadow\">\n		<div id=\"assignment-header\">\n			<h1>";
    foundHelper = helpers.assignment;
    stack1 = foundHelper || depth0.assignment;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.title);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "assignment.title", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h1>\n			<p class=\"subheader\">";
    foundHelper = helpers.assignment;
    stack1 = foundHelper || depth0.assignment;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.notes);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "assignment.notes", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n		</div>\n	</div>\n\n	<div id=\"scrollAssignmentGroup\" class=\"scroll_wrapper\">\n		<div id=\"scroller\">\n		";
    foundHelper = helpers.assignment;
    stack1 = foundHelper || depth0.assignment;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.student_list);
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n\n		</div>\n	</div>\n</div>";
    return buffer;});
});
window.require.register("views/templates_web/assignmentRead", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<div class=\"item-header drop_shadow\">\n	<div class=\"item-header-close navbar-close\"></div>\n	Phoebe Caulfield\n</div>\n\n<div class=\"content_wrapper\">\n\n	<div id=\"scrollElement\" class=\"scroll_wrapper\">\n		<div id=\"scroller\">\n\n		</div>\n	</div>\n</div>";});
});
window.require.register("views/templates_web/assignments", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n			";
    foundHelper = helpers.assignments;
    stack1 = foundHelper || depth0.assignments;
    stack2 = helpers.each;
    tmp1 = self.program(2, program2, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			";
    return buffer;}
  function program2(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "	\n			<div data-id=";
    foundHelper = helpers.element_id;
    stack1 = foundHelper || depth0.element_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + " class=\"assignments-thumb item\">\n				<div class=\"assignments-thumb-title\">";
    foundHelper = helpers.element_name;
    stack1 = foundHelper || depth0.element_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</div>\n				<div class=\"assignments-thumb-date\">";
    foundHelper = helpers.date_due;
    stack1 = foundHelper || depth0.date_due;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "date_due", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</div>\n			</div>	\n			";
    return buffer;}

  function program4(depth0,data) {
    
    
    return "\n			<div id=\"empty\">\n				<div class=\"empty-set set-assignment\"></div>\n				<h4>No Current Assignments</h4>\n				<p>Use the Add button to create a new one.</p>\n			</div>\n		";}

    buffer += "<div class=\"header drop_shadow\">\n	<div id=\"menu_button\"></div>\n	Assignments\n	<div id=\"iosbutton\" class=\"button-right new\">New Assignment</div>\n\n</div>\n\n<div class=\"content_wrapper\">\n	<div class=\"add_button\">\n		<div class=\"add_button_innards\"></div>\n	</div>\n	\n	<div id=\"scrollElement\" class=\"scroll_wrapper\">\n		<div id=\"scroller\">	\n		";
    foundHelper = helpers.assignments;
    stack1 = foundHelper || depth0.assignments;
    stack2 = helpers['if'];
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(4, program4, data);
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "						\n		</div>\n	</div>\n	\n</div>";
    return buffer;});
});
window.require.register("views/templates_web/bookmarks", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n		\n		";
    foundHelper = helpers.bookmarks;
    stack1 = foundHelper || depth0.bookmarks;
    stack2 = helpers.each;
    tmp1 = self.program(2, program2, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		\n		";
    return buffer;}
  function program2(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "	\n		<div class=\"bookmark-container\">\n			<div data-id=\"";
    foundHelper = helpers.bookmark_id;
    stack1 = foundHelper || depth0.bookmark_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "bookmark_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"bookmark-delete hide\"></div>\n			<div data-id=\"";
    foundHelper = helpers.bookmark_id;
    stack1 = foundHelper || depth0.bookmark_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "bookmark_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" data-urls=\"";
    foundHelper = helpers.bookmark_url;
    stack1 = foundHelper || depth0.bookmark_url;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "bookmark_url", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"bookmarks-thumb\">		\n				<div class=\"bookmarks-thumb-icon\"></div>\n				<div class=\"bookmarks-thumb-title\">Bookmark</div>\n				<div class=\"bookmarks-thumb-url\">";
    foundHelper = helpers.bookmark_url;
    stack1 = foundHelper || depth0.bookmark_url;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "bookmark_url", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</div>\n			</div>\n		</div>\n		";
    return buffer;}

  function program4(depth0,data) {
    
    
    return "\n		<div id=\"empty\">\n			<div class=\"empty-set set-bookmarks\"></div>\n			<h4>Add New Bookmarks</h4>\n			<p>Tap the button in the top right to create new bookmarks.</p>\n		</div>\n		";}

    buffer += "<div class=\"header drop_shadow\">\n	<div id=\"menu_button\"></div>\n	<div id=\"iosbutton\" class=\"button-right new-bookmark\">New Bookmark</div>\n	<div id=\"iosbutton\" class=\"button-right edit-bookmark\">Edit</div>\n	Bookmarks\n</div>\n\n<div class=\"content_wrapper\">\n\n	<div class=\"add_button\">\n		<div class=\"add_button_innards\"></div>\n	</div>\n	\n	<div id=\"scrollElement\" class=\"scroll_wrapper\">\n		<div id=\"scroller\">\n		\n		";
    foundHelper = helpers.bookmarks;
    stack1 = foundHelper || depth0.bookmarks;
    stack2 = helpers['if'];
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(4, program4, data);
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n							\n		</div>\n	</div>\n	\n</div><!--end .content_wrapper-->\n\n\n";
    return buffer;});
});
window.require.register("views/templates_web/element", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<div class=\"header drop_shadow\">\n	<div id=\"menu_button\"></div>\n	Learning Object\n	<div class=\"header_buttons\">\n		<div id=\"delete\" class=\"header_button\"></div>\n		<div id=\"duplicate\" class=\"header_button\"></div>\n	</div>\n</div>\n\n<div id=\"element_page\" class=\"content_wrapper\">\n	<div id=\"scrollElement\" class=\"scroll_wrapper\">\n		<div id=\"scroller\">\n			\n		</div>\n	</div>\n</div>";});
});
window.require.register("views/templates_web/element_overlay_assignment", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, foundHelper, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


    buffer += "<div class=\"item-header drop_shadow\">\n	<div id=\"back-button\" class=\"dark-back\"></div>\n	";
    foundHelper = helpers.assignment;
    stack1 = foundHelper || depth0.assignment;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.title);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "assignment.title", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\n</div>\n\n<div class=\"item-container\">\n	\n	<div class=\"pdf-element\">	\n			<div class=\"element-thumb assignment-icon\"></div>\n			<div class=\"assignment-element-details\">		\n				<h3>";
    foundHelper = helpers.assignment;
    stack1 = foundHelper || depth0.assignment;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.title);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "assignment.title", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</a></h3>\n				<div class=\"pdf-element-description\">\n					<p>";
    foundHelper = helpers.assignment;
    stack1 = foundHelper || depth0.assignment;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.notes);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "assignment.notes", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n				</div>\n				<div id=\"uploadAssignment\" class=\"chunky upload\">Upload</div>\n				<div id=\"success-btn-group\" class=\"hide\">\n					<div id=\"uploadAssignment\" class=\"chunky upload-sm\">&nbsp;</div>\n					<div id=\"reviewAssignment\" class=\"chunky assignment-review\">Review</div>\n					<div id=\"submitAssignment\" class=\"chunky assignment-submit\">Submit</div>\n				</div>	\n			</div>	\n	</div><!--end .pdf-element-->\n</div><!--end .item-container-->";
    return buffer;});
});
window.require.register("views/templates_web/element_overlay_link", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, foundHelper, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


    buffer += "<div class=\"item-header drop_shadow\">\n	<div id=\"back-button\" class=\"dark-back\"></div>\n</div>\n\n<div id=\"elementLink\" class=\"item-container\">\n	\n	<div class=\"pdf-element\">	\n			<div class=\"element-thumb link-icon\"></div>\n			<div class=\"pdf-element-details\">		\n				<h3><a href=\"";
    foundHelper = helpers.share_link;
    stack1 = foundHelper || depth0.share_link;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.url);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "share_link.url", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\">";
    foundHelper = helpers.share_link;
    stack1 = foundHelper || depth0.share_link;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.title);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "share_link.title", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</a></h3>\n				<div class=\"pdf-element-description\">\n					<p>";
    foundHelper = helpers.share_link;
    stack1 = foundHelper || depth0.share_link;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.notes);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "share_link.notes", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n				</div>\n				<div id=\"openLink\" class=\"chunky outgoing\">Open</div>	\n				<span><a href=\"\">";
    foundHelper = helpers.share_link;
    stack1 = foundHelper || depth0.share_link;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.link_url);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "share_link.link_url", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</a></span>	\n			</div>	\n	</div><!--end .pdf-element-->\n</div><!--end #elementLink-->";
    return buffer;});
});
window.require.register("views/templates_web/element_overlay_pdf", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, foundHelper, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


    buffer += "<div class=\"item-header drop_shadow\">\n	<div id=\"back-button\" class=\"dark-back\"></div>\n</div>\n	\n<div id=\"elementPDF\" class=\"item-container\">\n	<div class=\"pdf-element\">\n		<div class=\"element-thumb pdf-icon\"></div>\n		<div class=\"pdf-element-details\">		\n			<h3>";
    foundHelper = helpers.pdf;
    stack1 = foundHelper || depth0.pdf;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.title);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "pdf.title", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h3>\n			<div class=\"pdf-element-description\">\n				<p>";
    foundHelper = helpers.pdf;
    stack1 = foundHelper || depth0.pdf;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.notes);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "pdf.notes", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n			</div>\n			<div id=\"openPdf\" class=\"chunky outgoing\">Open</div>		\n		</div>\n	</div><!--end .pdf-element-->\n\n</div><!--end #elementPDF-->";
    return buffer;});
});
window.require.register("views/templates_web/element_overlay_socrative", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, foundHelper, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


    buffer += "<div class=\"item-header drop_shadow\">\n	<div id=\"back-button\" class=\"dark-back\"></div>\n</div>\n\n<div id=\"socrativeLink\" class=\"item-container\">\n	\n	<div class=\"pdf-element\">	\n			<div class=\"element-thumb socrative-icon\"></div>\n			<div class=\"pdf-element-details\">		\n				<h3>";
    foundHelper = helpers.socrative;
    stack1 = foundHelper || depth0.socrative;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.title);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "socrative.title", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</a></h3>\n				<div class=\"pdf-element-description\">\n					<p>";
    foundHelper = helpers.socrative;
    stack1 = foundHelper || depth0.socrative;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.notes);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "socrative.notes", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n				</div>\n				<div id=\"openSocrative\" class=\"chunky outgoing\">Open</div>	\n			</div>	\n	</div><!--end .pdf-element-->\n</div><!--end #elementLink-->";
    return buffer;});
});
window.require.register("views/templates_web/element_photo", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, foundHelper, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


    buffer += "<div class=\"item-header drop_shadow\">\n	<div id=\"back-button\" class=\"dark-back\"></div>\n</div>\n\n<div id=\"elementPhoto\" class=\"overlay_modal content_wrapper\">\n	\n	<div id=\"scrollPhoto\" class=\"scroll_wrapper\">\n		<div id=\"scroller\">\n\n			<div class=\"photo-element\">	\n				<div class=\"photo-element-container\"><!--element icon-->\n				\n					<div class=\"photo-element-details\">		\n						<div class=\"element-thumb photo-icon\"></div>\n						<h3>";
    foundHelper = helpers.photo;
    stack1 = foundHelper || depth0.photo;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.title);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "photo.title", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h3>\n						<div class=\"photo-element-description\">\n							<p>";
    foundHelper = helpers.photo;
    stack1 = foundHelper || depth0.photo;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.notes);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "photo.notes", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n						</div>		\n					</div>\n					\n					<div class=\"photo-element-image\">\n						<img src=\"";
    foundHelper = helpers.photo;
    stack1 = foundHelper || depth0.photo;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.photo_url);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "photo.photo_url", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\">\n					</div>\n					\n				</div><!--end .photo-element-container-->	\n			</div><!--end .photo-element-->\n	\n		</div>\n	</div>\n	\n</div><!--end #elementPhoto-->\n";
    return buffer;});
});
window.require.register("views/templates_web/element_video", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<div class=\"item-header drop_shadow\">\n	<div id=\"back-button\" class=\"dark-back\"></div>\n</div>\n\n<div id=\"elementVideo\" class=\"overlay_modal content_wrapper\">\n	\n	<div class=\"video-element\">	\n		<div class=\"element-thumb video-icon\"></div><!--element icon-->\n		\n		<div class=\"video-element-container\">\n			<div class=\"video-element-movie\"></div>\n			<div class=\"video-element-details\">		\n				<h3>Scientist Films First Footage Of A Giant Squid</h3>\n				<div class=\"video-element-description\">\n					<p>The Kraken is real. For thousands of years, sailors have told stories of giant squids. In myth and cinema, the kraken was the most terrible of sea monsters. Now, it’s been captured on video for the first time ever.</p>\n				</div>		\n			</div>	\n		</div><!--end .video-element-container-->	\n		\n	</div><!--end .video-element-->\n</div><!--end #elementVideo-->";});
});
window.require.register("views/templates_web/formAddGroup", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "	\n		";
    foundHelper = helpers.group_list;
    stack1 = foundHelper || depth0.group_list;
    stack2 = helpers.each;
    tmp1 = self.program(2, program2, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			";
    return buffer;}
  function program2(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n			<div id=\"";
    foundHelper = helpers.group_id;
    stack1 = foundHelper || depth0.group_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "group_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"add-group-thumb item unchecked ";
    foundHelper = helpers.is_member;
    stack1 = foundHelper || depth0.is_member;
    stack2 = helpers['if'];
    tmp1 = self.program(3, program3, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\">\n			";
    foundHelper = helpers.is_member;
    stack1 = foundHelper || depth0.is_member;
    stack2 = helpers['if'];
    tmp1 = self.program(5, program5, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n				<div class=\"group_thumb_image\" style=\"background-image:url(";
    foundHelper = helpers.group_image;
    stack1 = foundHelper || depth0.group_image;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "group_image", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\"></div>\n				<div class=\"add-group-thumb-name\">";
    foundHelper = helpers.group_name;
    stack1 = foundHelper || depth0.group_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "group_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</div>\n				<div class=\"add-group-thumb-count\">";
    foundHelper = helpers.student_count;
    stack1 = foundHelper || depth0.student_count;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student_count", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</div>\n			</div>\n			";
    return buffer;}
  function program3(depth0,data) {
    
    
    return " checked ";}

  function program5(depth0,data) {
    
    
    return "<div class=\"group-check\"></div>";}

    buffer += "<div class=\"item-header drop_shadow\">\n	<div id=\"back-button\" class=\"dark-back\"></div>\n</div>\n\n<div id=\"addGroup_page\" class=\"item-wrapper\">\n	<h1 class=\"unit-header\">Change Lesson Visibility</h1>\n	<h3>Groups</h3>\n	\n	<div id=\"overlayScroller3\" class=\"scroll_wrapper\">\n		<div id=\"scroller\">\n		";
    foundHelper = helpers.groups;
    stack1 = foundHelper || depth0.groups;
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		</div>\n	</div>\n		\n	<div class=\"overlay_submit element-button lesson-group\">Done</div>\n\n</div>\n";
    return buffer;});
});
window.require.register("views/templates_web/formAddStudent", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n				";
    foundHelper = helpers.student_list;
    stack1 = foundHelper || depth0.student_list;
    stack2 = helpers.each;
    tmp1 = self.program(2, program2, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n				";
    return buffer;}
  function program2(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n				<div id=\"";
    foundHelper = helpers.student_id;
    stack1 = foundHelper || depth0.student_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"student_thumb unchecked ";
    foundHelper = helpers.student_grouped;
    stack1 = foundHelper || depth0.student_grouped;
    stack2 = helpers['if'];
    tmp1 = self.program(3, program3, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\" style=\"background-image:url(";
    foundHelper = helpers.student_image_small;
    stack1 = foundHelper || depth0.student_image_small;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student_image_small", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\">\n					";
    foundHelper = helpers.student_grouped;
    stack1 = foundHelper || depth0.student_grouped;
    stack2 = helpers['if'];
    tmp1 = self.program(5, program5, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n					<p>";
    foundHelper = helpers.student_name_first;
    stack1 = foundHelper || depth0.student_name_first;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student_name_first", { hash: {} }); }
    buffer += escapeExpression(stack1) + "<br>";
    foundHelper = helpers.student_name_last;
    stack1 = foundHelper || depth0.student_name_last;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student_name_last", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n				</div>\n				";
    return buffer;}
  function program3(depth0,data) {
    
    
    return " checked ";}

  function program5(depth0,data) {
    
    
    return "<div class=\"student-check\"></div>";}

    buffer += "<div class=\"item-header drop_shadow\">\n	<div class=\"item-header-close navbar-close\"></div>\n</div>\n\n<div id=\"addStudent_page\" class=\"item-wrapper content_wrapper\">\n	<div id=\"item-container\">\n		<h1 class=\"unit-header\">Add Students to Group</h1>\n		<div class=\"overlay_left\">\n		</div>	\n		<div id=\"overlayScroller5\" class=\"scroll_wrapper\">\n			<div id=\"scroller\">\n				\n				";
    foundHelper = helpers.groups;
    stack1 = foundHelper || depth0.groups;
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n				\n			</div>\n		</div>\n		<div class=\"overlay_submit element-button add-student-group\">Submit</div>\n	</div>>\n</div>";
    return buffer;});
});
window.require.register("views/templates_web/formAnnouncement", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<div class=\"item-header drop_shadow\">\n	<div class=\"item-header-close navbar-close\"></div>\n</div>\n\n<div id=\"announcement_page\" class=\"item-wrapper\">\n	<h1 class=\"unit-header\">Make an Announcement</h1>\n\n	<h3>Title</h3>\n	<input id=\"announcement_title\" maxlength=\"30\"></input>\n		\n	<h3>Announcement</h3>\n	<textarea id=\"announcement_body\" maxlength=\"140\"></textarea>	\n	\n	<div class=\"overlay_submit element-button\">Create</div>\n</div>\n\n";});
});
window.require.register("views/templates_web/formInputStudent", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<div class=\"item-header drop_shadow\">\n	<div class=\"item-header-close navbar-close\"></div>\n</div>\n\n<div id=\"inputStudent_page\" class=\"item-wrapper content_wrapper\">\n	<div id=\"item-container\">\n		<h1 class=\"unit-header\">Add Students</h1>\n		\n		<h3>First Name</h3>\n		<input id=\"addFirst\" maxlength=\"30\"></input>\n		\n		<h3>Last Name</h3>\n		<input id=\"addLast\" maxlength=\"30\"></input>\n		\n		<p>Have more than a few students to add? <br>\n			<a href=\"mailto:albert@hmsteach.com?subject=Add more students for me!\">Send us an email</a> and we'll be happy to add them for you.\n		</p>	\n\n		<div id=\"addStudent\" class=\"overlay_submit element-button input-student\">Add Student</div>\n	</div>\n</div>";});
});
window.require.register("views/templates_web/formNewAssignment", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n					<div data-id=\"";
    foundHelper = helpers.unit_id;
    stack1 = foundHelper || depth0.unit_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\"> <option value=";
    foundHelper = helpers.unit_id;
    stack1 = foundHelper || depth0.unit_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + ">";
    foundHelper = helpers.unit_name;
    stack1 = foundHelper || depth0.unit_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</option> </div>\n				";
    return buffer;}

    buffer += "<div id=\"element-view-cover\"></div>\n\n<div class=\"item-header drop_shadow\">\n	<div id=\"back-button\" class=\"dark-back\"></div>\n</div>\n\n<div id=\"newElement_page\" class=\"overlay_modal content_wrapper\">\n	\n	<div class=\"element-container\">\n\n		<h2>Add Assignment</h2>\n		\n		<div id=\"element-wrapper\">\n		\n			<div class=\"element-details\">\n				<div class=\"inline-label\">Due Date</div>	\n				 <label class=\"detail-form\">\n				   <input id=\"assignment_date\" type=\"date\">\n				</label>\n			\n			    <label class=\"detail-form\">\n				    <input id=\"assignment_title\" placeholder=\"Title\" type=\"text\">\n				</label>\n				\n				<label class=\"detail-form\">\n					<textarea class=\"tall-textarea\" placeholder=\"Description\" id=\"assignment_notes\"></textarea>\n				</label>	\n			</div>\n		</div>\n		\n		<div id=\"dropdown-wrapper\">\n			<span>Select Unit</span>\n			<div class=\"active-select\">\n				<select id=\"unitSelect\">\n				<option>Please Select a Unit</option>\n				\n				";
    foundHelper = helpers.unit_list;
    stack1 = foundHelper || depth0.unit_list;
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n				</select>\n			</div>\n			\n			<span>Select Lesson</span>\n			<div id=\"lessonField\" class=\"disabled-select\">\n				<select id=\"lessonSelect\">\n					<option>Please Select a Lesson</option>\n				</select>\n			</div>		\n		</div>\n		\n		<div id=\"submit\" class=\"chunky add\">Add</div>\n		\n	</div><!--end container-->\n</div>";
    return buffer;});
});
window.require.register("views/templates_web/formNewElement", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<div class=\"item-header drop_shadow\">\n	<div id=\"back-button\" class=\"dark-back\"></div>\n</div>\n\n<div id=\"newElement_page\" class=\"item-wrapper content_wrapper\">\n	<div id=\"item-container\">\n		<div id=\"element-blocks\">\n			<h1>Add an Item</h1>\n			\n			<div id=\"item-top-row\">\n				<div id=\"unit\" class=\"add-item item-unit\"><span>Unit</span></div>	\n				<div id=\"lesson\" class=\"add-item item-lesson\"><span>Lesson</span></div>	\n				<div class=\"add-item item-element\"><span>Element</span></div>\n				<div id=\"group\" class=\"add-item item-group\"><span>Group</span></div>\n			</div>\n			\n			<div id=\"item-bottom-row\">\n				<div class=\"caret\"><img src=\"images/caret.png\" width=\"42\" height=\"21\"></div>\n				\n				<div id=\"scrollNewElements\">\n					<div id=\"add-element-sm-wrapper\">\n						<div class=\"add-element-container\">\n							<div id=\"photo\" class=\"add-element-sm\"></div>\n							<span>Photo</span>\n						</div>\n						<div class=\"add-element-container\">\n							<div id=\"video\" class=\"add-element-sm\"></div>\n							<span>Video</span>\n						</div>\n						<div class=\"add-element-container\">\n							<div id=\"link\" class=\"add-element-sm\"></div>\n							<span>Link</span>\n						</div>\n						<div class=\"add-element-container\">\n							<div id=\"pdf\" class=\"add-element-sm\"></div>\n							<span>Document</span>\n						</div>\n						<div class=\"add-element-container\">\n							<div id=\"assignment\" class=\"add-element-sm\"></div>\n							<span>Assignment</span>\n						</div>\n						<div class=\"add-element-container\">\n							<div id=\"socrative\" class=\"add-element-sm\"></div>\n							<span>Poll</span>\n						</div>\n					</div>\n				</div>		\n			</div>	\n			\n		</div>\n	</div>\n</div>";});
});
window.require.register("views/templates_web/formNewGroup", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n			";
    foundHelper = helpers.student_list;
    stack1 = foundHelper || depth0.student_list;
    stack2 = helpers.each;
    tmp1 = self.program(2, program2, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			";
    return buffer;}
  function program2(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n			<div id= \"";
    foundHelper = helpers.student_id;
    stack1 = foundHelper || depth0.student_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"student_thumb\" style=\"background-image:url(";
    foundHelper = helpers.student_image_small;
    stack1 = foundHelper || depth0.student_image_small;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student_image_small", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\">\n				<p>";
    foundHelper = helpers.student_name_first;
    stack1 = foundHelper || depth0.student_name_first;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student_name_first", { hash: {} }); }
    buffer += escapeExpression(stack1) + "<br>";
    foundHelper = helpers.student_name_last;
    stack1 = foundHelper || depth0.student_name_last;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student_name_last", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n			</div>\n			";
    return buffer;}

    buffer += "<div class=\"item-header drop_shadow\">\n	<div id=\"back-button\" class=\"dark-back\"></div>\n</div>\n\n<div id=\"newElement_page\" class=\"item-wrapper content_wrapper\">\n	<div id=\"item-container\">\n		<h1 class=\"unit-header\">Create a New Group</h1>\n			<h3>Upload Photo</h3>\n			<div id=\"picker\" style=\"background:url('');\"></div>\n			<div class=\"upload-floater\">\n				<div id=\"upload\" class=\"select-button\">Select Image</div>\n			</div>\n			<div class=\"clear\"></div>\n		\n			<h3>Group Name</h3>\n			<input id=\"group_name\" spellcheck=\"false\" maxlength=\"44\"></textarea>\n			<div id=\"opens_options\" class=\"overlay_button\">\n				Add Students\n				<div class=\"arrow\"></div>\n		</div>	\n		\n		<div id=\"overlayScroller2\" class=\"scroll_wrapper hide\">\n			<div id=\"scroller\">\n			";
    foundHelper = helpers.groups;
    stack1 = foundHelper || depth0.groups;
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			</div>\n		</div>\n		<div class=\"overlay_submit element-button\">Create</div>\n	</div>\n</div>";
    return buffer;});
});
window.require.register("views/templates_web/formNewLesson", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n				<div data-id=\"";
    foundHelper = helpers.unit_id;
    stack1 = foundHelper || depth0.unit_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\">\n					<option value=";
    foundHelper = helpers.unit_id;
    stack1 = foundHelper || depth0.unit_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + ">";
    foundHelper = helpers.unit_name;
    stack1 = foundHelper || depth0.unit_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</option>\n				</div>\n				";
    return buffer;}

  function program3(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n			";
    foundHelper = helpers.group_list;
    stack1 = foundHelper || depth0.group_list;
    stack2 = helpers['if'];
    tmp1 = self.program(4, program4, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(7, program7, data);
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			";
    return buffer;}
  function program4(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "	\n			";
    foundHelper = helpers.group_list;
    stack1 = foundHelper || depth0.group_list;
    stack2 = helpers.each;
    tmp1 = self.program(5, program5, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			\n			";
    return buffer;}
  function program5(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n				<div id=\"";
    foundHelper = helpers.group_id;
    stack1 = foundHelper || depth0.group_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "group_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" data-id=\"";
    foundHelper = helpers.group_id;
    stack1 = foundHelper || depth0.group_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "group_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"group-option\">";
    foundHelper = helpers.group_name;
    stack1 = foundHelper || depth0.group_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "group_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</div>\n			";
    return buffer;}

  function program7(depth0,data) {
    
    
    return "\n				<p>You currently don't have any groups created.</p>\n			";}

    buffer += "<div class=\"item-header drop_shadow\">\n	<div id=\"back-button\" class=\"dark-back\"></div>\n</div>\n\n<div id=\"newElement_page\" class=\"item-wrapper\">\n	<h1 class=\"unit-header\">Create a New Lesson</h1>	\n	\n	<h3>Upload Photo</h3>\n	<div id=\"picker\" style=\"background:url('');\"></div>\n	<div class=\"upload-floater\">\n		<div id=\"upload\" class=\"select-button\">Select Image</div>\n	</div>\n	\n	<div class=\"clear\"></div>\n	\n	<h3>Title</h3>\n	<input id=\"lesson_title\" maxlength=\"30\"></input>\n\n	<div class=\"unit-select\">\n		<div class=\"arrow\"></div>\n		<!--<div class=\"text\">Please Select a Unit</div>-->\n		<select id=\"unitSelect\">\n			<option>Please Select a Unit</option>		\n				";
    foundHelper = helpers.units;
    stack1 = foundHelper || depth0.units;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.unit_list);
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "				\n		</select>\n	</div>\n	\n	<h3>Description</h3>\n	<textarea id=\"lesson_description\" maxlength=\"140\"></textarea>	\n	\n	<div class=\"overlay-right-lesson\">		\n		<div id=\"options-student\" class=\"student-drop\" style=\"margin-bottom:30px\">\n			Assign Groups to Lesson\n			<div class=\"arrow\"></div>\n		</div>\n	</div>\n	\n	<div id=\"overlayScroller4\" class=\"scroll_wrapper hide\">\n		<div id=\"scroller\">	\n			";
    foundHelper = helpers.groups;
    stack1 = foundHelper || depth0.groups;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.teacher_groups);
    stack2 = helpers.each;
    tmp1 = self.program(3, program3, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		</div>\n	</div>\n	<div class=\"overlay_submit element-button submit-right\">Create</div>\n</div>";
    return buffer;});
});
window.require.register("views/templates_web/formNewLink", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n					<div data-url=\"";
    foundHelper = helpers.bookmark_url;
    stack1 = foundHelper || depth0.bookmark_url;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "bookmark_url", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" data-id=\"";
    foundHelper = helpers.bookmark_id;
    stack1 = foundHelper || depth0.bookmark_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "bookmark_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\"> <option>";
    foundHelper = helpers.bookmark_url;
    stack1 = foundHelper || depth0.bookmark_url;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "bookmark_url", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</option> </div>\n				";
    return buffer;}

  function program3(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n					<div data-id=\"";
    foundHelper = helpers.unit_id;
    stack1 = foundHelper || depth0.unit_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\"> <option value=";
    foundHelper = helpers.unit_id;
    stack1 = foundHelper || depth0.unit_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + ">";
    foundHelper = helpers.unit_name;
    stack1 = foundHelper || depth0.unit_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</option> </div>\n				";
    return buffer;}

    buffer += "<div id=\"element-view-cover\"></div>\n\n<div class=\"item-header drop_shadow\">\n	<div id=\"back-button\" class=\"dark-back\"></div>\n</div>\n\n<div id=\"newElement_page\" class=\"overlay_modal content_wrapper\">\n\n	<div class=\"element-container\">\n\n		<h2 style=\"margin-bottom: -10px;\">Add Link</h2>\n\n		<div id=\"element-wrapper\">\n			<div id=\"picker\" style=\"background:url('');\"></div>\n\n			<div class=\"element-details\">\n			    <label class=\"detail-form\">\n				    <input id=\"link_title\" placeholder=\"Title\" type=\"text\">\n				</label>\n\n				<label class=\"detail-form\">\n					<textarea placeholder=\"Description\" id=\"link_notes\"></textarea>\n				</label>	\n			</div>\n		</div>\n\n		<div class=\"clear\"></div>\n		\n		\n		<div class=\"element-details\">	\n			<span>Website URL</span>		\n			<label class=\"detail-form\">\n				<input id=\"link_custom\" autocapitalize=\"off\" placeholder=\"http://www.google.com\"  type=\"text\">\n			</label>\n		</div>\n		\n		<div id=\"link_launch\" class=\"slim launch\">Launch</div>\n		<!--<div id=\"link_bookmark\" class=\"slim bookmark\">&nbsp;</div>-->\n		<div class=\"clear\"></div>\n		\n		<div class=\"bookmark-select\">\n			<select id=\"bookmarkSelect\">\n				<option>Select from Bookmarks</option>\n				";
    foundHelper = helpers.bookmarks;
    stack1 = foundHelper || depth0.bookmarks;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.bookmarks);
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			</select>\n		</div>\n	\n		<div id=\"dropdown-wrapper\">\n					\n			<span>Select Unit</span>\n			<div class=\"active-select\">\n				<select id=\"unitSelect\">\n				<option>Please Select a Unit</option>\n\n				";
    foundHelper = helpers.units;
    stack1 = foundHelper || depth0.units;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.unit_list);
    stack2 = helpers.each;
    tmp1 = self.program(3, program3, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n				</select>\n			</div>\n\n			<span>Select Lesson</span>\n			<div id=\"lessonField\" class=\"disabled-select\">\n				<select id=\"lessonSelect\">\n					<option>Please Select a Lesson</option>\n				</select>\n			</div>		\n		</div>\n\n		<div id=\"submit\" class=\"chunky add\">Add</div>\n\n	</div><!--end container-->\n</div>";
    return buffer;});
});
window.require.register("views/templates_web/formNewPdf", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n						<div data-id=\"";
    foundHelper = helpers.unit_id;
    stack1 = foundHelper || depth0.unit_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\"> <option value=";
    foundHelper = helpers.unit_id;
    stack1 = foundHelper || depth0.unit_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + ">";
    foundHelper = helpers.unit_name;
    stack1 = foundHelper || depth0.unit_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</option> </div>\n					";
    return buffer;}

    buffer += "<div class=\"item-header drop_shadow\">\n	<div id=\"back-button\" class=\"dark-back\"></div>\n</div>\n\n<div id=\"newElement_page\" class=\"overlay_modal content_wrapper\">\n	\n	<div class=\"element-container\">\n		<h2>Add Document</h2>\n		<div class=\"document-types\">PDF, Word, PowerPoint, Excel, Pages, Keynote, Numbers</div>\n		<div id=\"element-wrapper\">\n			<div id=\"picker\" style=\"background:url('');\"></div>\n		\n			<div class=\"element-details\">\n			    <label class=\"detail-form\">\n				    <input id=\"pdf_title\" placeholder=\"Title\" type=\"text\">\n				</label>\n				\n				<label class=\"detail-form\">\n					<textarea placeholder=\"Description\" id=\"pdf_notes\"></textarea>\n				</label>	\n			</div>\n		</div>\n		\n		<div class=\"static\">\n			<div id=\"upload\" class=\"chunky select\">Select</div>\n		</div>\n		\n		<div id=\"dropdown-wrapper\">\n		\n			<span>Select Unit</span>\n				<div class=\"active-select\">\n					<select id=\"unitSelect\">\n					<option>Please Select a Unit</option>\n\n					";
    foundHelper = helpers.unit_list;
    stack1 = foundHelper || depth0.unit_list;
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n					</select>\n				</div>\n			\n				<span>Select Lesson</span>\n				<div id=\"lessonField\" class=\"disabled-select\">\n					<select id=\"lessonSelect\">\n						<option>Please Select a Lesson</option>\n					</select>\n				</div>		\n			</div>\n		\n		<div class=\"add-button-group\">\n			<div id=\"submit\" class=\"chunky add\">Add</div>\n		</div>\n		\n	</div><!--end container-->\n\n</div>";
    return buffer;});
});
window.require.register("views/templates_web/formNewPhoto", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n					<div data-id=\"";
    foundHelper = helpers.unit_id;
    stack1 = foundHelper || depth0.unit_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\"> <option value=";
    foundHelper = helpers.unit_id;
    stack1 = foundHelper || depth0.unit_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + ">";
    foundHelper = helpers.unit_name;
    stack1 = foundHelper || depth0.unit_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</option> </div>\n				";
    return buffer;}

    buffer += "<div class=\"item-header drop_shadow\">\n	<div id=\"back-button\" class=\"dark-back\"></div>\n</div>\n\n<div id=\"newElement_page\" class=\"overlay_modal content_wrapper\">\n	<div class=\"element-container\">\n		\n		<h2>Add Photo</h2>\n		\n		<div id=\"element-wrapper\">\n			<div id=\"picker\" style=\"background:url('');\"></div>\n			\n			<div class=\"element-details\">\n			    <label class=\"detail-form\">\n				    <input id=\"photo_title\" placeholder=\"Title\" type=\"text\">\n				</label>\n				\n				<label class=\"detail-form\">\n					<textarea placeholder=\"Description\" id=\"photo_notes\"></textarea>\n				</label>	\n			</div>\n		</div>\n		\n		<div class=\"static\">\n			<div id=\"upload\" class=\"chunky select\">Select</div>\n		</div>\n		\n		<div id=\"dropdown-wrapper\">\n			<span>Select Unit</span>\n			<div class=\"active-select\">\n				<select id=\"unitSelect\">\n				<option>Please Select a Unit</option>\n				\n				";
    foundHelper = helpers.unit_list;
    stack1 = foundHelper || depth0.unit_list;
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n				</select>\n			</div>\n			\n			<span>Select Lesson</span>\n			<div id=\"lessonField\" class=\"disabled-select\">\n				<select id=\"lessonSelect\">\n					<option>Please Select a Lesson</option>\n				</select>\n			</div>		\n		</div>\n		\n		<div id=\"submit\" class=\"chunky add\">Add</div>\n		\n	</div><!--end container-->\n	\n</div>";
    return buffer;});
});
window.require.register("views/templates_web/formNewSocrative", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n					<div data-id=\"";
    foundHelper = helpers.unit_id;
    stack1 = foundHelper || depth0.unit_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\"> <option value=";
    foundHelper = helpers.unit_id;
    stack1 = foundHelper || depth0.unit_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + ">";
    foundHelper = helpers.unit_name;
    stack1 = foundHelper || depth0.unit_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</option> </div>\n				";
    return buffer;}

    buffer += "<div id=\"element-view-cover\"></div>\n\n<div class=\"item-header drop_shadow\">\n	<div id=\"back-button\" class=\"dark-back\"></div>\n</div>\n\n<div id=\"newElement_page\" class=\"overlay_modal content_wrapper\">\n	\n	<div class=\"element-container\">\n\n		<h2>Add Socrative Poll</h2>\n		\n		<div id=\"element-wrapper\">\n		\n			<div class=\"element-details\">\n			    <label class=\"detail-form\">\n				    <input id=\"socrative_title\" placeholder=\"Title\" type=\"text\">\n				</label>\n				\n				<label class=\"detail-form\">\n					<textarea placeholder=\"Description\" id=\"socrative_notes\"></textarea>\n				</label>	\n			</div>\n		</div>\n		\n		<div id=\"dropdown-wrapper\">\n			<span>Select Unit</span>\n			<div class=\"active-select\">\n				<select id=\"unitSelect\">\n				<option>Please Select a Unit</option>\n				\n				";
    foundHelper = helpers.unit_list;
    stack1 = foundHelper || depth0.unit_list;
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n				</select>\n			</div>\n			\n			<span>Select Lesson</span>\n			<div id=\"lessonField\" class=\"disabled-select\">\n				<select id=\"lessonSelect\">\n					<option>Please Select a Lesson</option>\n				</select>\n			</div>		\n		</div>\n		\n		<div id=\"submit\" class=\"chunky add\">Add</div>\n		\n	</div><!--end container-->\n</div>";
    return buffer;});
});
window.require.register("views/templates_web/formNewTest", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<div id=\"newElement_page\" class=\"overlay_modal content_wrapper\">\n	<h1>Create a New Unit</h1>\n	<div class=\"overlay_close\"></div>\n	<div class=\"overlay_left\">\n		<h3>Title</h3>\n		<textarea id=\"unit_title\" rows=\"3\" spellcheck=\"false\" maxlength=\"144\"></textarea>\n		<h3>Description</h3>\n		<textarea id=\"unit_description\" rows=\"3\" spellcheck=\"false\" maxlength=\"144\"></textarea>\n	</div>\n	<div class=\"overlay_submit\" style=\"right:52%\">Create</div>\n</div>";});
});
window.require.register("views/templates_web/formNewUnit", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<div class=\"item-header drop_shadow\">\n	<div id=\"back-button\" class=\"dark-back\"></div>\n</div>\n\n<div class=\"item-wrapper\">\n	\n	<h1 class=\"unit-header\">Create a New Unit</h1>	\n	\n	<h3>Upload Photo</h3>\n	<div id=\"picker\" style=\"background:url('');\"></div>\n	<div class=\"upload-floater\">\n		<div id=\"upload\" class=\"select-button\">Select Image</div>\n	</div>\n	<div class=\"clear\"></div>\n	\n	<h3>Title</h3>\n	<input id=\"unit_title\" maxlength=\"30\"></input>\n	\n	<h3>Description</h3>\n	<textarea id=\"unit_description\" maxlength=\"140\"></textarea>	\n				\n	<div class=\"overlay_submit element-button submit-left\">Create</div>\n\n</div>		";});
});
window.require.register("views/templates_web/formNewVideo", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n						<div data-id=\"";
    foundHelper = helpers.unit_id;
    stack1 = foundHelper || depth0.unit_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\"> <option value=";
    foundHelper = helpers.unit_id;
    stack1 = foundHelper || depth0.unit_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + ">";
    foundHelper = helpers.unit_name;
    stack1 = foundHelper || depth0.unit_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</option> </div>\n					";
    return buffer;}

    buffer += "<div class=\"item-header drop_shadow\">\n	<div id=\"back-button\" class=\"dark-back\"></div>\n</div>\n<div id=\"newElement_page\" class=\"overlay_modal content_wrapper\">\n	\n	<div class=\"element-container\">\n	\n		<h2>Add Video</h2>\n		\n		<div id=\"element-wrapper\">\n			<div id=\"picker\" style=\"background:url('');\"></div>\n			\n			<div class=\"element-details\">\n			    <label class=\"detail-form\">\n				    <input id=\"video_title\" placeholder=\"Title\" type=\"text\">\n				</label>\n				\n				<label class=\"detail-form\">\n					<textarea id=\"video_notes\" placeholder=\"Description\"></textarea>\n				</label>	\n			</div>\n			\n		</div>\n		\n		<div class=\"static url-select\">\n			<div id=\"upload\" class=\"chunky select\">Select</div>\n		</div>\n		\n		<div id=\"vid_url\" class=\"element-details url-text\">\n			Press select to browse for a Youtube video!\n		</div>\n			\n		<div class=\"clear\"></div>\n			\n		<div id=\"dropdown-wrapper\">\n			<span>Select Unit</span>\n				<div class=\"active-select\">\n					<select id=\"unitSelect\">\n					<option>Please Select a Unit</option>\n					\n					";
    foundHelper = helpers.unit_list;
    stack1 = foundHelper || depth0.unit_list;
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "	\n					\n					</select>\n				</div>\n			\n			<span>Select Lesson</span>\n			<div id=\"lessonField\" class=\"disabled-select\">\n				<select id=\"lessonSelect\">\n					<option>Please Select a Lesson</option>\n				</select>\n			</div>		\n		</div>\n		\n		<div id=\"submit\" class=\"chunky add\">Add</div>\n		\n	</div><!--end container-->\n	\n</div>";
    return buffer;});
});
window.require.register("views/templates_web/formNewWorksheet", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<div id=\"newElement_page\" class=\"overlay_modal content_wrapper\">\n	<h1>Create a New Unit</h1>\n	<div class=\"overlay_close\"></div>\n	<div class=\"overlay_left\">\n		<h3>Title</h3>\n		<textarea id=\"unit_title\" rows=\"3\" spellcheck=\"false\" maxlength=\"144\"></textarea>\n		<h3>Description</h3>\n		<textarea id=\"unit_description\" rows=\"3\" spellcheck=\"false\" maxlength=\"144\"></textarea>\n	</div>\n	<div class=\"overlay_submit\" style=\"right:52%\">Create</div>\n</div>";});
});
window.require.register("views/templates_web/group", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    
    return "\n<div id=\"iosbutton\" class=\"button-right edit\">Edit Group</div>\n";}

  function program3(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n					style=\"background-image:url(";
    foundHelper = helpers.group_image_small;
    stack1 = foundHelper || depth0.group_image_small;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "group_image_small", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\"></div>	\n			<h1 class=\"group-header-text\">";
    foundHelper = helpers.group_name;
    stack1 = foundHelper || depth0.group_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "group_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h1>\n			";
    return buffer;}

  function program5(depth0,data) {
    
    var stack1;
    foundHelper = helpers.student_count;
    stack1 = foundHelper || depth0.student_count;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student_count", { hash: {} }); }
    return escapeExpression(stack1);}

  function program7(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n		<div id=\"show-units\" class=\"hide\">\n		";
    foundHelper = helpers.units;
    stack1 = foundHelper || depth0.units;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.unit_list);
    stack2 = helpers.each;
    tmp1 = self.program(8, program8, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		</div>\n		";
    return buffer;}
  function program8(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "		\n			<div data-id=\"";
    foundHelper = helpers.unit_id;
    stack1 = foundHelper || depth0.unit_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"unit_thumb item\">\n				<h1>";
    foundHelper = helpers.unit_name;
    stack1 = foundHelper || depth0.unit_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h1>\n				<div class=\"unit-thumb-student-img\" style=\"background-image:url(";
    foundHelper = helpers.unit_image;
    stack1 = foundHelper || depth0.unit_image;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_image", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\"></div>\n				<p>\n					<span style=\"background-image:url(images/hexagon.png)\">\n						<b>";
    foundHelper = helpers.lesson_count;
    stack1 = foundHelper || depth0.lesson_count;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "lesson_count", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</b> Lessons\n					</span>\n					<span style=\"background-image:url(images/triangle.png)\">\n						<b>";
    foundHelper = helpers.element_count;
    stack1 = foundHelper || depth0.element_count;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_count", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</b> Elements\n					</span>\n				</p> \n			</div>	\n			";
    return buffer;}

  function program10(depth0,data) {
    
    
    return "\n		<div id=\"empty\" class=\"hide\">\n			<div class=\"empty-set set-unit\"></div>\n			<h4>No Units Assigned</h4>\n			<p>Go to the Lesson page to assign Groups</p>\n		</div>\n		";}

  function program12(depth0,data) {
    
    
    return "\n			<div id=\"add-new-student\">\n				<p>Add <br>Students</p>\n			</div>\n			";}

  function program14(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n			\n			";
    foundHelper = helpers.student_list;
    stack1 = foundHelper || depth0.student_list;
    stack2 = helpers['if'];
    tmp1 = self.program(15, program15, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			";
    return buffer;}
  function program15(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n			\n				";
    foundHelper = helpers.student_list;
    stack1 = foundHelper || depth0.student_list;
    stack2 = helpers.each;
    tmp1 = self.program(16, program16, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n				\n			";
    return buffer;}
  function program16(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n				<div id=\"student_thumb\" data-id=\"";
    foundHelper = helpers.student_id;
    stack1 = foundHelper || depth0.student_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"groups-student-thumb\" style=\"background-image:url(";
    foundHelper = helpers.student_image_small;
    stack1 = foundHelper || depth0.student_image_small;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student_image_small", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\">\n					<p>";
    foundHelper = helpers.student_name_first;
    stack1 = foundHelper || depth0.student_name_first;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student_name_first", { hash: {} }); }
    buffer += escapeExpression(stack1) + "<br>";
    foundHelper = helpers.student_name_last;
    stack1 = foundHelper || depth0.student_name_last;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student_name_last", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n				</div>\n				";
    return buffer;}

    buffer += "<div class=\"header drop_shadow\">\n<div id=\"menu_button\" class=\"hide\"></div>\n<div id=\"work-button\"></div>\n";
    foundHelper = helpers.all;
    stack1 = foundHelper || depth0.all;
    stack2 = helpers.unless;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n	Group\n</div>\n\n<div id=\"group_page\" class=\"content_wrapper\">\n	\n	<div class=\"section group-shadow shim\">\n		<div class=\"section-button-group\">\n			<div id=\"delete\" class=\"trash hide\">\n				<img src=\"images/trash-icon.png\" width=\"19\" height=\"22\">\n			</div>\n			<div id=\"announce\" class=\"groups-announce\">\n				<img src=\"images/announce.png\" width=\"25\" height=\"24\"><span>Announcement</span>\n			</div>\n		</div>\n		\n			<div class=\"group_header_image\"\n				";
    foundHelper = helpers.students;
    stack1 = foundHelper || depth0.students;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.groups);
    stack2 = helpers.each;
    tmp1 = self.program(3, program3, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			\n			<div class=\"clear\"></div>\n			\n			<div id=\"group-subheader\">\n				<div data-id=\"";
    foundHelper = helpers.group_id;
    stack1 = foundHelper || depth0.group_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "group_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" id=\"group-subheader-members\" class=\"active-group-sub\">\n					<div class=\"member-subheader-icon left\"></div>\n					<b>";
    foundHelper = helpers.students;
    stack1 = foundHelper || depth0.students;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.groups);
    stack2 = helpers.each;
    tmp1 = self.program(5, program5, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "</b> Members\n				</div>\n				\n				<div id=\"group-subheader-units\">\n					<div class=\"unit-subheader-icon right\"></div>\n					Units\n				</div>\n			</div>\n	</div>\n		\n	<div id=\"scrollStudents\" class=\"scroll_wrapper\">\n		<div id=\"scroller\">\n		\n		";
    foundHelper = helpers.units;
    stack1 = foundHelper || depth0.units;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.unit_list);
    stack2 = helpers['if'];
    tmp1 = self.program(7, program7, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(10, program10, data);
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		\n		\n		\n		<div id=\"show-groups\">\n		\n			<div id=\"add-student\" class=\"hide\">\n				<p>Edit <br>Students</p>\n			</div>\n			";
    foundHelper = helpers.all;
    stack1 = foundHelper || depth0.all;
    stack2 = helpers['if'];
    tmp1 = self.program(12, program12, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			\n			";
    foundHelper = helpers.students;
    stack1 = foundHelper || depth0.students;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.groups);
    stack2 = helpers.each;
    tmp1 = self.program(14, program14, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			\n			\n			</div>\n		</div>\n		\n		</div>\n	</div>\n	\n</div>";
    return buffer;});
});
window.require.register("views/templates_web/groups", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n			<div data-id=\"ALL\" class=\"group_thumb item\">\n				<div class=\"group_thumb_name\" style=\"padding-left:10%;width:75%\">All Students</div>\n				<div class=\"group_thumb_count\">";
    foundHelper = helpers.teacher_groups;
    stack1 = foundHelper || depth0.teacher_groups;
    stack2 = helpers.each;
    tmp1 = self.program(2, program2, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "</div>\n			</div>\n			\n			";
    foundHelper = helpers.teacher_groups;
    stack1 = foundHelper || depth0.teacher_groups;
    stack2 = helpers.each;
    tmp1 = self.program(4, program4, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			\n			";
    return buffer;}
  function program2(depth0,data) {
    
    var stack1;
    foundHelper = helpers.student_count;
    stack1 = foundHelper || depth0.student_count;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student_count", { hash: {} }); }
    return escapeExpression(stack1);}

  function program4(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n			";
    foundHelper = helpers.group_list;
    stack1 = foundHelper || depth0.group_list;
    stack2 = helpers.each;
    tmp1 = self.program(5, program5, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			";
    return buffer;}
  function program5(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n			\n			<div data-id=\"";
    foundHelper = helpers.group_id;
    stack1 = foundHelper || depth0.group_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "group_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"group_thumb item\">\n				<div class=\"group_thumb_image\" style=\"background-image:url(";
    foundHelper = helpers.group_image;
    stack1 = foundHelper || depth0.group_image;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "group_image", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\"></div>\n				<div class=\"group_thumb_name\">";
    foundHelper = helpers.group_name;
    stack1 = foundHelper || depth0.group_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "group_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</div>\n				<div class=\"group_thumb_count\">";
    foundHelper = helpers.student_count;
    stack1 = foundHelper || depth0.student_count;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student_count", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</div>\n			</div>\n			\n			";
    return buffer;}

  function program7(depth0,data) {
    
    
    return "\n			";}

    buffer += "<div class=\"header drop_shadow\">\n	<div id=\"menu_button\"></div>\n	<div id=\"iosbutton\" class=\"button-right new-group\">New Group</div>	\n	Groups\n</div>\n\n<div id=\"groups_page\" class=\"content_wrapper\">\n	<div id=\"addGroup\" class=\"add_button\">\n		<div class=\"add_button_innards\"></div>\n	</div>\n	<div id=\"scrollGroups\" class=\"scroll_wrapper\">\n		<div id=\"scroller\">\n			";
    foundHelper = helpers.teacher_groups;
    stack1 = foundHelper || depth0.teacher_groups;
    stack2 = helpers['if'];
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(7, program7, data);
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n\n		</div>\n	</div>\n</div>";
    return buffer;});
});
window.require.register("views/templates_web/home", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n			";
    foundHelper = helpers.teacher_posts;
    stack1 = foundHelper || depth0.teacher_posts;
    stack2 = helpers.each;
    tmp1 = self.program(2, program2, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "			\n			</div>\n			";
    return buffer;}
  function program2(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n				<div id=\"lesson\" data-id= ";
    foundHelper = helpers.object_id;
    stack1 = foundHelper || depth0.object_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "object_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + " class=\"recent-item\" style=\"background: url(";
    foundHelper = helpers.lesson_image_small;
    stack1 = foundHelper || depth0.lesson_image_small;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "lesson_image_small", { hash: {} }); }
    buffer += escapeExpression(stack1) + "); background-repeat: no-repeat; background-size:cover;\">\n					<span> ";
    foundHelper = helpers.lesson_name;
    stack1 = foundHelper || depth0.lesson_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "lesson_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + " </span>\n				</div>\n			";
    return buffer;}

  function program4(depth0,data) {
    
    
    return "\n			<div class=\"empty-text\">\n				<h3>Create your first Unit and Lesson!</h3>\n				<p>Use the <strong>PLUS</strong> button on the right to create new material!</p>\n			</div>\n			";}

    buffer += "<div id=\"home-view-cover\"></div>\n\n<div class=\"header drop_shadow\">\n	<div id=\"menu_button\"></div>\n	Home\n</div>\n\n<div id=\"home_page\" class=\"home-wrapper\">\n<div class=\"add_button\">\n	<div class=\"add_button_innards\"></div>\n</div>\n<div id=\"scrollHome\" class=\"scroll_wrapper\">\n	<div id=\"scroller\">		\n	<div class=\"secondary-nav\">\n		<div class=\"teacher-header\">\n			<div class=\"teacher-nav-icon\"></div>\n			<div class=\"student-nav-text\">From the Library</div>\n		</div>		\n	</div><!--end #secondary-nav-->\n\n	<div id=\"scrollStore\">\n		<div id=\"scroller-home\">	\n			<div data-url=\"http://www.ted.com/\" class=\"library-item\"><img src=\"images/tile-ted.png\"></div>\n			<div data-url=\"http://www.khanacademy.org/\" class=\"library-item\"><img src=\"images/tile-khan.png\"></div>		\n			<div data-url=\"http://photography.nationalgeographic.com/\" class=\"library-item\"><img src=\"images/tile-natgeo.png\"></div>		\n			<div data-url=\"http://www.goorulearning.org/\" class=\"library-item\"><img src=\"images/tile-gooru.jpg\"></div>\n			<div data-url=\"http://www.discoveryeducation.com/teachers/free-9-12-teacher-resources/\" class=\"library-item\"><img src=\"images/tile-disc.png\"></div>		\n			<div data-url=\"http://www.discoverystudentadventures.com/\" class=\"library-item\"><img src=\"images/tile-disc-adv.png\"></div>			\n			<div data-url=\"http://torch.sunburst.com/\" class=\"library-item\"><img src=\"images/tile-ignite.png\"></div>			\n			<div data-url=\"http://digitalpromise.sunburst.com/\" class=\"library-item\"><img src=\"images/tile-sunburst.png\"></div>			\n			<div data-url=\"http://www.billnye.com/for-kids-teachers/home-demos/\" class=\"library-item\"><img src=\"images/tile-bill.png\"></div>\n									\n		</div>\n	</div><!--end #scrollStore-->\n	\n	<div id=\"recent-items-container\">	\n	\n		<div id=\"recent-items-inner\">\n			<h3 class=\"items-header\">Recent Lessons</h3>\n			<div class=\"corner\"></div>\n		</div>\n		\n		<div id=\"scrollPosts\">\n			<div id=\"scroller-recent-items\">\n			";
    foundHelper = helpers.teacher_posts;
    stack1 = foundHelper || depth0.teacher_posts;
    stack2 = helpers['if'];
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(4, program4, data);
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		</div>				\n	</div><!--end #recent-items-container-->\n	\n	<div id=\"teacher-home-container\">\n	\n		<div id=\"recent-items-inner\">\n			<h3 class=\"items-header\">Announcements</h3>\n			<div class=\"corner\"></div>\n		</div>\n\n		<div id=\"scrollAnnouncements\">\n\n		</div><!--end #scrollAnnouncements-->\n	</div><!--end #teacher-home-announce-->\n	\n</div>	<!--end #scrollHome-->\n</div>";
    return buffer;});
});
window.require.register("views/templates_web/homeAnnouncements", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n	";
    foundHelper = helpers.announcement_list;
    stack1 = foundHelper || depth0.announcement_list;
    stack2 = helpers['if'];
    tmp1 = self.program(2, program2, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(5, program5, data);
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n	";
    return buffer;}
  function program2(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n	";
    foundHelper = helpers.announcement_list;
    stack1 = foundHelper || depth0.announcement_list;
    stack2 = helpers.each;
    tmp1 = self.program(3, program3, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n	";
    return buffer;}
  function program3(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "		\n	<div data-id=\"";
    foundHelper = helpers.announcement_id;
    stack1 = foundHelper || depth0.announcement_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "announcement_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"announcement-item\">\n\n		<div class=\"announcement-header\">\n			<div class=\"announce-thumb\" style=\"background: url(";
    foundHelper = helpers.moderator_image;
    stack1 = foundHelper || depth0.moderator_image;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "moderator_image", { hash: {} }); }
    buffer += escapeExpression(stack1) + ");\"><div class=\"portrait-shadow\"></div></div>			\n			<div class=\"announcement-date\">";
    foundHelper = helpers.timestamp;
    stack1 = foundHelper || depth0.timestamp;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "timestamp", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</div>\n			<h3>";
    foundHelper = helpers.moderator_name;
    stack1 = foundHelper || depth0.moderator_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "moderator_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h3>\n		</div>\n		\n		<div class=\"announcement-border\">&nbsp;</div>\n		<p class=\"announcement\">";
    foundHelper = helpers.body;
    stack1 = foundHelper || depth0.body;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "body", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n		<div data-id=\"";
    foundHelper = helpers.announcement_id;
    stack1 = foundHelper || depth0.announcement_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "announcement_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"announcement-footer\">\n			<div class=\"announcement-comment-icon\"></div>\n			<p><strong>";
    foundHelper = helpers.response_count;
    stack1 = foundHelper || depth0.response_count;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "response_count", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</strong> Comments</p>	\n		</div>\n	</div>\n	";
    return buffer;}

  function program5(depth0,data) {
    
    
    return "\n	<div class=\"empty-text\">\n				<h3>Send an announcement to your students!</h3>\n				<p>Pick a Group and tap the announcements button.</p>\n			</div>\n	";}

    buffer += "<div id=\"scroller-announcements\">\n	\n	";
    foundHelper = helpers.announcements;
    stack1 = foundHelper || depth0.announcements;
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n</div><!--end #scroller-announcements-->";
    return buffer;});
});
window.require.register("views/templates_web/lesson", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n			<div class=\"publish-border unit-header-image\" style=\"background: url('";
    foundHelper = helpers.lesson_image;
    stack1 = foundHelper || depth0.lesson_image;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "lesson_image", { hash: {} }); }
    buffer += escapeExpression(stack1) + "')\"></div>\n			<div class=\"section-header\">\n					<!--<h1>";
    foundHelper = helpers.lesson_name;
    stack1 = foundHelper || depth0.lesson_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "lesson_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h1>-->\n				<div class=\"ghost-field ghost-material-header\">\n					<input id=\"lessontitle\" type=\"text\" value=\"";
    foundHelper = helpers.lesson_name;
    stack1 = foundHelper || depth0.lesson_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "lesson_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" placeholder=\"Lesson Title\"><br>\n				</div>\n					<!--<p class=\"subheader\">";
    foundHelper = helpers.lesson_description;
    stack1 = foundHelper || depth0.lesson_description;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "lesson_description", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>-->\n				<div class=\"ghost-field ghost-material-subheader\">\n					<textarea id=\"lessondescription\" placeholder=\"Lesson Description\">";
    foundHelper = helpers.lesson_description;
    stack1 = foundHelper || depth0.lesson_description;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "lesson_description", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</textarea>\n				</div>\n				";
    return buffer;}

  function program3(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n				";
    foundHelper = helpers.is_published;
    stack1 = foundHelper || depth0.is_published;
    stack2 = helpers['if'];
    tmp1 = self.program(4, program4, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(6, program6, data);
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n				";
    return buffer;}
  function program4(depth0,data) {
    
    
    return "\n			  		<div id=\"publishButton\" class=\"publish published\">Published</div>\n				";}

  function program6(depth0,data) {
    
    
    return "\n					<div id=\"publishButton\" class=\"publish\">Publish</div>\n				";}

  function program8(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n					<p><strong>";
    foundHelper = helpers.student_count;
    stack1 = foundHelper || depth0.student_count;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student_count", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</strong> Student Views</p>\n					";
    foundHelper = helpers.student_list;
    stack1 = foundHelper || depth0.student_list;
    stack2 = helpers.each;
    tmp1 = self.program(9, program9, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n					";
    return buffer;}
  function program9(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n						<div id=\"student_thumb\" data-id=\"";
    foundHelper = helpers.student_id;
    stack1 = foundHelper || depth0.student_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"section_item\" style=\"background-image:url(";
    foundHelper = helpers.student_image_small;
    stack1 = foundHelper || depth0.student_image_small;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student_image_small", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\"></div>\n					";
    return buffer;}

  function program11(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n				<p><strong>";
    foundHelper = helpers.group_count;
    stack1 = foundHelper || depth0.group_count;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "group_count", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</strong> Groups</p>\n				<div class=\"clear\"></div>\n				<div id=\"meta-groups-container\">\n					\n					";
    foundHelper = helpers.group_list;
    stack1 = foundHelper || depth0.group_list;
    stack2 = helpers.each;
    tmp1 = self.program(12, program12, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n					";
    return buffer;}
  function program12(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n					<div id=\"group_thumb\" data-id=\"";
    foundHelper = helpers.group_id;
    stack1 = foundHelper || depth0.group_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "group_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"section_item\" style=\"background-image:url(";
    foundHelper = helpers.group_image;
    stack1 = foundHelper || depth0.group_image;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "group_image", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\"></div>\n					";
    return buffer;}

  function program14(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n		\n		";
    foundHelper = helpers.is_published;
    stack1 = foundHelper || depth0.is_published;
    stack2 = helpers['if'];
    tmp1 = self.program(15, program15, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(23, program23, data);
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		";
    return buffer;}
  function program15(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n			";
    foundHelper = helpers.element_list;
    stack1 = foundHelper || depth0.element_list;
    stack2 = helpers.each;
    tmp1 = self.program(16, program16, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			\n		";
    return buffer;}
  function program16(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n			<div data-id=\"";
    foundHelper = helpers.element_id;
    stack1 = foundHelper || depth0.element_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" ";
    foundHelper = helpers.video_url;
    stack1 = foundHelper || depth0.video_url;
    stack2 = helpers['if'];
    tmp1 = self.program(17, program17, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += " class=\"element_thumb item published-item\">\n				<div data-id=\"";
    foundHelper = helpers.element_id;
    stack1 = foundHelper || depth0.element_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" ";
    foundHelper = helpers.video_url;
    stack1 = foundHelper || depth0.video_url;
    stack2 = helpers['if'];
    tmp1 = self.program(19, program19, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += " class=\"item-delete hide\"></div>\n				<div data-id=\"";
    foundHelper = helpers.element_id;
    stack1 = foundHelper || depth0.element_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" ";
    foundHelper = helpers.video_url;
    stack1 = foundHelper || depth0.video_url;
    stack2 = helpers['if'];
    tmp1 = self.program(21, program21, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += " class=\"item_image ";
    foundHelper = helpers.element_type;
    stack1 = foundHelper || depth0.element_type;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_type", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" style=\"background-image:url(";
    foundHelper = helpers.element_image;
    stack1 = foundHelper || depth0.element_image;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_image", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\"></div>\n				<h4>";
    foundHelper = helpers.element_type;
    stack1 = foundHelper || depth0.element_type;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_type", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h4>\n				<h3>";
    foundHelper = helpers.element_name;
    stack1 = foundHelper || depth0.element_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h3>\n			</div>\n			";
    return buffer;}
  function program17(depth0,data) {
    
    var buffer = "", stack1;
    buffer += " data-urls=\"";
    foundHelper = helpers.video_url;
    stack1 = foundHelper || depth0.video_url;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "video_url", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" ";
    return buffer;}

  function program19(depth0,data) {
    
    var buffer = "", stack1;
    buffer += " data-urls=\"";
    foundHelper = helpers.video_url;
    stack1 = foundHelper || depth0.video_url;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "video_url", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" ";
    return buffer;}

  function program21(depth0,data) {
    
    var buffer = "", stack1;
    buffer += " data-urls=\"";
    foundHelper = helpers.video_url;
    stack1 = foundHelper || depth0.video_url;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "video_url", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" ";
    return buffer;}

  function program23(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n			\n			";
    foundHelper = helpers.element_list;
    stack1 = foundHelper || depth0.element_list;
    stack2 = helpers.each;
    tmp1 = self.program(24, program24, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			\n		";
    return buffer;}
  function program24(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n			<div data-id=\"";
    foundHelper = helpers.element_id;
    stack1 = foundHelper || depth0.element_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" ";
    foundHelper = helpers.video_url;
    stack1 = foundHelper || depth0.video_url;
    stack2 = helpers['if'];
    tmp1 = self.program(25, program25, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += " class=\"element_thumb item\">\n			<div data-id=\"";
    foundHelper = helpers.element_id;
    stack1 = foundHelper || depth0.element_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\"";
    foundHelper = helpers.video_url;
    stack1 = foundHelper || depth0.video_url;
    stack2 = helpers['if'];
    tmp1 = self.program(27, program27, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += " class=\"item-delete hide\"></div>\n			<div data-id=\"";
    foundHelper = helpers.element_id;
    stack1 = foundHelper || depth0.element_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" ";
    foundHelper = helpers.video_url;
    stack1 = foundHelper || depth0.video_url;
    stack2 = helpers['if'];
    tmp1 = self.program(29, program29, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += " class=\"item_image ";
    foundHelper = helpers.element_type;
    stack1 = foundHelper || depth0.element_type;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_type", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" style=\"background-image:url(";
    foundHelper = helpers.element_image;
    stack1 = foundHelper || depth0.element_image;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_image", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\"></div>\n				<h4>";
    foundHelper = helpers.element_type;
    stack1 = foundHelper || depth0.element_type;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_type", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h4>\n				<h3>";
    foundHelper = helpers.element_name;
    stack1 = foundHelper || depth0.element_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h3>\n			</div>\n			";
    return buffer;}
  function program25(depth0,data) {
    
    var buffer = "", stack1;
    buffer += " data-urls=\"";
    foundHelper = helpers.video_url;
    stack1 = foundHelper || depth0.video_url;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "video_url", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" ";
    return buffer;}

  function program27(depth0,data) {
    
    var buffer = "", stack1;
    buffer += " data-urls=\"";
    foundHelper = helpers.video_url;
    stack1 = foundHelper || depth0.video_url;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "video_url", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" ";
    return buffer;}

  function program29(depth0,data) {
    
    var buffer = "", stack1;
    buffer += " data-urls=\"";
    foundHelper = helpers.video_url;
    stack1 = foundHelper || depth0.video_url;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "video_url", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" ";
    return buffer;}

    buffer += "<div class=\"header drop_shadow\">\n	<div id=\"menu_button\" class=\"hide\"></div>\n	<div id=\"work-button\"></div>\n	<div id=\"iosbutton\" class=\"button-right edit\">Edit</div>\n	<div id=\"iosbutton\" class=\"button-right nav-add-group\">Assign Group</div>\n	Lesson\n</div>\n\n<div id=\"lesson_page\" class=\"content_wrapper\">\n\n	<div id=\"addElement\" class=\"add_button\">\n		<div class=\"add_button_innards\"></div>\n	</div>	\n	\n	<div class=\"section section-shadow\">\n		<div id=\"section-header-wrap\">\n				";
    foundHelper = helpers.teacher_lesson;
    stack1 = foundHelper || depth0.teacher_lesson;
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			</div>\n					\n			<div class=\"section-button-group\">\n				<div id=\"delete\" class=\"trash hide\"><img src=\"images/trash-icon.png\" width=\"19\" height=\"22\"></div>\n	\n				";
    foundHelper = helpers.teacher_lesson;
    stack1 = foundHelper || depth0.teacher_lesson;
    stack2 = helpers.each;
    tmp1 = self.program(3, program3, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			</div>\n		</div>\n		\n		<div class=\"meta\">\n		\n			<div class=\"meta-students meta-section\">\n				<div id=\"meta-students-container\">\n				";
    foundHelper = helpers.teacher_lesson;
    stack1 = foundHelper || depth0.teacher_lesson;
    stack2 = helpers.each;
    tmp1 = self.program(8, program8, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n				</div>\n			</div>	\n				\n			<div class=\"meta-groups meta-section\">\n				";
    foundHelper = helpers.teacher_lesson;
    stack1 = foundHelper || depth0.teacher_lesson;
    stack2 = helpers.each;
    tmp1 = self.program(11, program11, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n					\n				</div>			\n			</div>		\n			<!--<div id=\"meta-expand\">\n				<img src=\"images/downarrow.png\" width=\"25\" height=\"11\">\n			</div>-->\n		</div>\n\n	</div>\n	\n	<div id=\"scrollElements\" class=\"scroll_wrapper\">\n		<div id=\"scroller\">\n		";
    foundHelper = helpers.teacher_lesson;
    stack1 = foundHelper || depth0.teacher_lesson;
    stack2 = helpers.each;
    tmp1 = self.program(14, program14, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		</div>\n</div>\n";
    return buffer;});
});
window.require.register("views/templates_web/login", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "	<div id=\"walk-cover\"></div>\n	<div id=\"walk-bg\"></div>\n	\n	<div class=\"top-border\"> <!--Taste the Rainbow-->\n		<div class=\"tb1 colors\">&nbsp;</div>\n		<div class=\"tb2 colors\">&nbsp;</div>\n		<div class=\"tb3 colors\">&nbsp;</div>\n		<div class=\"tb4 colors\">&nbsp;</div>\n		<div class=\"tb5 colors\">&nbsp;</div>\n		<div class=\"tb6 colors\">&nbsp;</div>\n	</div>\n	<div id=\"mark\">\n			<img src=\"images/mark.png\"><br>\n		</div>\n	\n\n		  \n	<div id=\"walkthrough\" class=\"royalSlider rsDefaultInv hide\">\n		<!-- slide 1 -->\n		<div class=\"walk-slide wslide1\">\n			<h1>Welcome!</h1>\n			<p>You have found the best platform for instruction, learning and collaboration between teachers and students.  Teachers can create digital lessons, send assignments, have group discussions, and review student work.  Students can work together, get individualized instruction, and get ahead. <br>\n			<strong>It only takes a minute to get started and its free. Seriously.</strong>\n		</div>\n		\n		<!-- slide 2 -->\n		<div class=\"walk-slide wslide2\" >\n			<img src=\"images/coach-plus-sm.png\">\n			<h2>Add Content</h2>\n			<p>Create your first Unit and Lessons by clicking the <strong>PLUS</strong> button in the bottom right corner. From here you can also add Photos, Videos, Links, Assignments, Word documents, Powerpoints, Pdf files and more from wherever you have them stored. Students will see your lessons, but not be able to modify them.</p>\n		</div>\n		\n		<!-- slide 3 -->\n		<div class=\"walk-slide wslide3\">\n			<img src=\"images/coach-menu-sm.png\">\n			<h2>Navigating</h2>\n			<p>To navigate through different sections, just tap the menu button in the top left corner.<br>\n	<em>TIP: Log Out from the <strong>Settings tab.</strong></em></p>\n		</div>\n		\n		<!-- slide 4 -->\n		<div class=\"walk-slide wslide4\">\n			<img src=\"images/coach-linking-sm@2x.png\" width=\"145px\" height=\"145px\">\n			<h2>Bookmarks &amp; Links</h2>\n			<p>In the Library you'll find links to useful websites and content. You can bookmark any website by tapping on the <img class=\"coach-icon\" src=\"images/coach-bookmark@2x.png\">icon. When adding Links to Lessons, navigate to the website and tap <strong>Done</strong> to add the URL.</p>\n		</div>\n		\n		<!-- slide 5 -->\n		<div class=\"walk-slide wslide5\">\n			<h2>Need More Assistance?</h2>\n			<p>Email <a href=\"mailto:albert@hmsteach.com\">albert@hmsteach.com</a> for a walkthrough of features, to import student lists, and any other help you need to get started. \n			<strong>Now create your first Unit!</strong></p>\n		</div>\n	\n	</div>\n	<script>\n		jQuery(document).ready(function($) {\n		\n			setTimeout(initSlider, 300);\n			var $wt = $(\"#walkthrough\");\n			\n			function initSlider(){\n				console.log('init');\n				$wt.royalSlider({\n		           	autoHeight: true,\n				    arrowsNav: false,\n				    fadeinLoadedSlide: true,\n				    controlNavigationSpacing: 0,\n				    controlNavigation: 'bullets',\n				    imageScaleMode: 'fit',\n				    imageAlignCenter: true,\n				    loop: false,\n				    loopRewind: false,\n				    numImagesToPreload: 5,\n				    autoScaleSlider: false,\n		            keyboardNavEnabled: true,\n		            navigateByClick: false,\n		            \n		        });\n		        $wt.fadeIn(400);\n			}\n			\n	    });\n    </script>\n    <script>\n    jQuery(document).ready(function($) {\n    	$('#login_page_buttons').delay(400).fadeIn(500);\n    });\n    </script>\n<div id=\"login_page_buttons\" class=\"hide\">\n\n	<div id=\"login_step1\">\n		<h3>Sign in to your classroom!</h3>\n		<div id=\"teacher\" class=\"login_button teacher-login\">Teacher</div>\n		<div id=\"student\" class=\"login_button student-login\">Student</div>\n	</div>\n\n</div><!-- end page -->	\n\n\n";});
});
window.require.register("views/templates_web/loginRegister", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<div id=\"register-page\">\n	<div class=\"top-border\"> <!--Taste the Rainbow-->\n		<div class=\"tb1 colors\">&nbsp;</div>\n		<div class=\"tb2 colors\">&nbsp;</div>\n		<div class=\"tb3 colors\">&nbsp;</div>\n		<div class=\"tb4 colors\">&nbsp;</div>\n		<div class=\"tb5 colors\">&nbsp;</div>\n		<div class=\"tb6 colors\">&nbsp;</div>\n	</div>\n\n	<div class=\"login_wrapper\">\n\n		<div id=\"register-1\" class=\"login_step\">\n			<div class=\"back-icon\">\n				<img src=\"images/icon-back.png\" width=\"48px\" height=\"48px\">\n			</div>			\n			<h2>Register</h2>\n			<div class=\"register-container register-input tall-register\">\n				<div class=\"register-wrapper\">\n					<input type=\"text\" id=\"display-name\" placeholder=\"Display Name (ex: Mrs. Robinson)\">\n					<input type=\"text\" id=\"first-name\" placeholder=\"First Name\">\n					<input type=\"text\" id=\"last-name\" placeholder=\"Last Name\">\n					<input type=\"email\" id=\"email\" placeholder=\"Email Address\">\n					<input type=\"password\" id=\"password\" placeholder=\"Password\">\n					<input type=\"password\" id=\"confirm-password\" placeholder=\"Confirm Password\">\n					<div id=\"next\" class=\"hulk register-next-button\">Next</div>\n				</div>\n			</div>\n		</div><!--register1-->\n		\n		<div id=\"register-2\" div class=\"login_step hide\">\n			<div class=\"back-register\">\n				<img src=\"images/icon-back.png\" width=\"48px\" height=\"48px\">\n			</div>\n			<h2>Details</h2>\n				<div class=\"register-container register-input\" >\n				<div class=\"register-wrapper\">\n					<input id=\"city-input\" type=\"text\" placeholder=\"City\">\n					<input id=\"state-input\" type=\"text\" maxlength=\"2\" placeholder=\"State\">\n					<input type=\"text\" id=\"country\" placeholder=\"Country\">\n					<input type=\"text\" id=\"school\" placeholder=\"School\">\n					<input type=\"text\" id=\"district\" placeholder=\"District\">\n					<div id=\"register-label\">By registering an account, I accept the KnowItAll&trade;\n<strong id=\"privacy\">Privacy Policy</strong> and <strong id=\"toc\">Terms of Service</strong>.</div>\n					\n					<div id=\"next\" class=\"hulk register-button\">Register</div>\n				</div>\n			</div>\n		</div><!--register2-->\n\n\n	</div><!--wrapper-->\n</div><!--page-->";});
});
window.require.register("views/templates_web/loginStudent", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this;

  function program1(depth0,data) {
    
    
    return "\n	<!--Student Search-->\n	<div id=\"login_step2\" class=\"login_step student-input\">\n		<div id=\"aint-ma-school\">\n			<p>Not your class? <strong id=\"change-schools\">Change schools &raquo;</strong></p>\n		</div>\n		<h2>My name is ...</h2>	\n		<div class=\"student-input-wrap\">\n			<input id=\"studentName\" placeholder=\"Your Name\" type=\"text\"> </input>\n		</div>	\n		<div id=\"studentList\" class=\"scroll_wrapper\">\n			<div id=\"scroller\"></div>\n		</div>\n	</div>\n\n	";}

  function program3(depth0,data) {
    
    
    return "\n	<!--School ID-->\n	<div id=\"login-school-code\" class=\"login_step\">\n	<h2>School ID Code</h2>\n		<div id=\"school-code-container\">\n			<input type=\"number\" id=\"schoolCode\" placeholder=\"School ID\">\n			<div class=\"clear\"></div>\n			<div id=\"submitID\" class=\"barney school-code-button\">Next</div>\n		</div>\n	<div id=\"login-footer\">\n		<p style=\"color:#999;\">Your teacher will have your school's ID Code.</p>\n	</div>\n	</div>\n	";}

    buffer += "<div id=\"login_page\" class=\"\">\n	<div class=\"top-border\"> <!--Taste the Rainbow-->\n	<div class=\"tb1 colors\">&nbsp;</div>\n	<div class=\"tb2 colors\">&nbsp;</div>\n	<div class=\"tb3 colors\">&nbsp;</div>\n	<div class=\"tb4 colors\">&nbsp;</div>\n	<div class=\"tb5 colors\">&nbsp;</div>\n	<div class=\"tb6 colors\">&nbsp;</div>\n</div>\n\n<div class=\"login_wrapper\">\n	<div class=\"back-icon\"><img src=\"images/icon-back.png\" width=\"48px\" height=\"48px\"></div>\n	\n	";
    foundHelper = helpers.customer_id;
    stack1 = foundHelper || depth0.customer_id;
    stack2 = helpers['if'];
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(3, program3, data);
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n	\n		\n	<!--Create Passcode-->\n	<div id=\"create-passcode-container\" class=\"login_step hide\">\n	<h2>Create Your Passcode</h2>\n	\n		<div id=\"hold-up\">\n			<p><strong>Remember what you enter.</strong> You will need the passcode each time you login. Ask your teacher if you forget it.</p>\n		</div>\n	\n	\n		<div id=\"create-passcode\">\n			<div id=\"create-passbox1\" class=\"pass-box\"></div>\n			<div id=\"create-passbox2\" class=\"pass-box\"></div>\n			<div id=\"create-passbox3\" class=\"pass-box\"></div>\n			<div id=\"create-passbox4\" class=\"pass-box last\"></div>	\n		</div>\n		\n		<div id=\"passcode-container\">\n			<div id=\"1\" class=\"password-block create-password\">1</div>\n			<div id=\"2\" class=\"password-block create-password\">2</div>\n			<div id=\"3\" class=\"password-block create-password password-block-last\">3</div>\n			<div id=\"4\" class=\"password-block create-password \">4</div>\n			<div id=\"5\" class=\"password-block create-password\">5</div>\n			<div id=\"6\" class=\"password-block create-password password-block-last\">6</div>\n			<div id=\"7\" class=\"password-block create-password\">7</div>\n			<div id=\"8\" class=\"password-block create-password\">8</div>\n			<div id=\"9\" class=\"password-block create-password password-block-last\">9</div>\n		</div>\n	</div>\n	\n	<!--Profile Photo-->\n	<div id=\"take-photo\" class=\"hide\">\n		<h2>Profile Photo</h2>\n		<div id= \"loginPicker\" class=\"take-photo-thumb take-photo-bg\" style=\"background-image:url();\"><div class=\"portrait-shadow\"></div></div>\n		<div id=\"takePhoto\" class=\"garfield take-photo-button\">Take Photo</div>\n		<div class=\"clear\"></div>\n		<div id=\"submitPhoto\" class=\"barney photo-next-button\">Next</div>\n	</div>\n		\n	<!--Student Passcode-->	\n	<div id=\"login_step3\" class=\"login_step hide\">\n		<h2>What's the Passcode?</h2>\n		\n		<div id=\"passcode\">\n			<div id=\"passbox1\" class=\"pass-box\"></div>\n			<div id=\"passbox2\" class=\"pass-box\"></div>\n			<div id=\"passbox3\" class=\"pass-box\"></div>\n			<div id=\"passbox4\" class=\"pass-box last\"></div>	\n		</div>\n		\n		<div id=\"passcode-container\">\n			<div id=\"1\" class=\"password-block enter-password\">1</div>\n			<div id=\"2\" class=\"password-block enter-password\">2</div>\n			<div id=\"3\" class=\"password-block enter-password password-block-last\">3</div>\n			<div id=\"4\" class=\"password-block enter-password \">4</div>\n			<div id=\"5\" class=\"password-block enter-password\">5</div>\n			<div id=\"6\" class=\"password-block enter-password password-block-last\">6</div>\n			<div id=\"7\" class=\"password-block enter-password\">7</div>\n			<div id=\"8\" class=\"password-block enter-password\">8</div>\n			<div id=\"9\" class=\"password-block enter-password password-block-last\">9</div>\n		</div>\n	</div>\n</div>";
    return buffer;});
});
window.require.register("views/templates_web/loginStudentList", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n		<div data-id=\"";
    foundHelper = helpers.user_name;
    stack1 = foundHelper || depth0.user_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "user_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"studentLoginThumb\">\n			<div class=\"slt_image\"></div>\n			<p class=\"slt_name\">";
    foundHelper = helpers.student_name;
    stack1 = foundHelper || depth0.student_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n		</div>\n		";
    return buffer;}

    buffer += "<div id=\"loginStudentList\" class=\"login_step student-input\">\n	<div id=\"studentSubList\" class=\"scroll_wrapper\">\n		<div id=\"scroller\" style=\"padding-top:10px;\">\n		";
    foundHelper = helpers.students;
    stack1 = foundHelper || depth0.students;
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		</div>\n	</div>\n	\n	<div id=\"student-missing\" class=\"hide\">\n		<img src=\"images/login-missing.png\" width=\"116\" height=\"113\">\n		<h3>Don't see your name?</h3>\n		<p>Raise your hand, your teacher will add you!</p>\n	</div>\n	\n</div>";
    return buffer;});
});
window.require.register("views/templates_web/loginTeacher", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<div id=\"login_page\" class=\"\">\n	<div class=\"top-border\"> <!--Taste the Rainbow-->\n		<div class=\"tb1 colors\">&nbsp;</div>\n		<div class=\"tb2 colors\">&nbsp;</div>\n		<div class=\"tb3 colors\">&nbsp;</div>\n		<div class=\"tb4 colors\">&nbsp;</div>\n		<div class=\"tb5 colors\">&nbsp;</div>\n		<div class=\"tb6 colors\">&nbsp;</div>\n	</div>\n	\n	<div class=\"login_wrapper\">\n	\n	<div id=\"login_teacher\" class=\"login_step\">\n		<div class=\"back-icon\">\n			<img src=\"images/icon-back.png\" width=\"48px\" height=\"48px\">\n		</div>\n			<!--start login box-->\n			<h2>Teacher Account</h2>\n			<div id=\"step2-container\">\n				<div class=\"login-label\">Email</div>\n				<input type=\"email\" autocorrect=\"off\" autocapitalize=\"off\" id=\"username\">\n				\n				<div class=\"login-label\">Password</div>\n				<input type=\"password\" id=\"password\" class=\"teacher-login-password\">\n					\n				<div id=\"submit_teacher\" class=\"login_button teacher-step2-login\">Sign In</div>\n			</div>\n			<!--end login box-->\n			\n			<div id=\"login-footer\">\n				<p>Don’t have an account yet? <strong id=\"register-now\">Register Now &raquo;</strong></p>\n				<span class=\"pass-forgot\">Forgot Password?</span>\n			</div>	\n			\n		</div><!--end login_step-->	\n		\n	<div id=\"login_forgot\" class=\"login_step hide\">\n		<div class=\"back-icon-forgot\">\n			<img src=\"images/icon-back.png\" width=\"48px\" height=\"48px\">\n		</div>\n		\n		<h2>Reset Password</h2>\n			<div id=\"forgot-container\">\n				<div id=\"forgot-wrapper\">\n					<h3>Forgot your password?</h3>\n					<p>Don’t worry! It happens to everyone. Enter your email and you can reset it.</p>\n					<input type=\"email\" id=\"reset-password\" placeholder=\"Enter your email\">\n					<div id=\"submit-pass-reset\" class=\"login_button reset-button\">Reset</div>\n				</div>\n				\n				<div id=\"forgot-error\" class=\"hide\"><span>Error.</span> Please try again!</div>\n				\n				<div id=\"forgot-success\" class=\"hide\">\n					<h3 style=\"padding-top:40px\"><span>Success!</span> Check your email.</h3>\n					<p>We have sent you instructions on how to reset it.</p>\n					<div id=\"resetBack\" class=\"login_button reset-button-back\">Login</div>\n				</div>\n				\n				\n			</div>\n				\n	</div>\n			\n	</div><!-- end wrapper -->	\n</div><!-- end page -->";});
});
window.require.register("views/templates_web/settings", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, foundHelper, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


    buffer += "<div class=\"header drop_shadow\">\n	<div id=\"menu_button\"></div>\n	Settings\n</div>\n\n<div id=\"profile-page\" class=\"content_wrapper\">\n	<div id=\"settings-overlay\" class=\"hide\"></div>\n	<div id=\"profile-left\">\n		<div id=\"settingsPicker\" class=\"profile-thumb\" style=\"background-image:url(";
    foundHelper = helpers.teacher;
    stack1 = foundHelper || depth0.teacher;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.teacher_image);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "teacher.teacher_image", { hash: {} }); }
    buffer += escapeExpression(stack1) + ");\">\n			<div class=\"portrait-shadow\"></div>\n		</div>\n		\n		<div id=\"profile-buttons\">\n			<div class=\"button change-photo-btn\">Change Photo</div>\n			<div class=\"button settings-add-btn\">Add Students</div>			\n			<div class=\"button change-pass-btn\">Change Password</div>\n			<div class=\"button logout-btn\">LOG OUT</div>\n		</div>\n	</div>\n	\n	<div id=\"profile-info\" class=\"ghost-field\">\n		<input id=\"displayname\" type=\"text\" value=\"";
    foundHelper = helpers.teacher;
    stack1 = foundHelper || depth0.teacher;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.teacher_display_name);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "teacher.teacher_display_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" placeholder=\"Display Name\">\n		\n		<h3>Name: ";
    foundHelper = helpers.teacher;
    stack1 = foundHelper || depth0.teacher;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.teacher_first_name);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "teacher.teacher_first_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + " ";
    foundHelper = helpers.teacher;
    stack1 = foundHelper || depth0.teacher;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.teacher_last_name);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "teacher.teacher_last_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h3>\n		<h3>Customer ID: ";
    foundHelper = helpers.teacher;
    stack1 = foundHelper || depth0.teacher;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.customer_id);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "teacher.customer_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h3>\n		<input id=username type=\"email\" value=\"";
    foundHelper = helpers.teacher;
    stack1 = foundHelper || depth0.teacher;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.teacher_username);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "teacher.teacher_username", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" placeholder=\"Your Username\">\n		\n		<h3>School Details</h3>\n		\n		<input id=\"schoolname\" type=\"text\" value=\"";
    foundHelper = helpers.teacher;
    stack1 = foundHelper || depth0.teacher;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.customer_school);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "teacher.customer_school", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" placeholder=\"School\"><br>\n		<input id=\"districtname\" type=\"text\" value=\"";
    foundHelper = helpers.teacher;
    stack1 = foundHelper || depth0.teacher;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.customer_district);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "teacher.customer_district", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" placeholder=\"District\"><br>\n		<input id=\"city\" type=\"text\" value=\"";
    foundHelper = helpers.teacher;
    stack1 = foundHelper || depth0.teacher;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.customer_city);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "teacher.customer_city", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" placeholder=\"City\"><br>\n		<input id=\"state\" maxlength=\"2\" type=\"text\" value=\"";
    foundHelper = helpers.teacher;
    stack1 = foundHelper || depth0.teacher;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.customer_state);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "teacher.customer_state", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" placeholder=\"State\"><br>\n		<input id=\"country\" type=\"text\" value=\"";
    foundHelper = helpers.teacher;
    stack1 = foundHelper || depth0.teacher;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.customer_country);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "teacher.customer_country", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" placeholder=\"Country\">\n		\n	</div>\n	\n	<div id=\"settings-add-student\" class=\"hide settings-right\">\n		<h2>Add Students</h2>\n			<label class=\"element-details add-students-form\">\n				<input id=\"addFirst\" placeholder=\"First Name\" type=\"text\">\n			</label>\n			\n			<label class=\"element-details add-students-form\">\n				<input id=\"addLast\" placeholder=\"Last Name\" type=\"text\">\n			</label>\n\n			<div class=\"clear\"></div>\n			\n		<div id=\"addStudent\" class=\"button list-add-btn\">Add Student</div>	\n		<div id=\"cancelStudent\" class=\"button settings-cancel-btn\">Close</div>\n		\n		<div class=\"clear\"></div>\n		\n		<p>Have more than a few students to add? <br>\n			<a href=\"mailto:albert@hmsteach.com?subject=Add more students for me!\">Send us an email</a> and we'll be happy to add them for you.\n		</p>			\n	</div>\n	\n	<div id=\"settings-change-pass\" class=\"hide settings-right\">\n		<h2>Change Password</h2>\n		\n			<label class=\"element-details add-students-form\">\n				<input id=\"oldPass\" placeholder=\"Old Password\" type=\"password\">\n			</label>\n		\n			<label class=\"element-details add-students-form\">\n				<input id=\"newPass\" placeholder=\"New Password\" type=\"password\">\n			</label>\n			\n			<label class=\"element-details add-students-form\">\n				<input id=\"confirmPass\" placeholder=\"Confirm New Password\" type=\"password\">\n			</label>\n\n			<div class=\"clear\"></div>\n			\n			<div id=\"changePass\" class=\"button list-add-btn\">Change Password</div>\n			<div class=\"button settings-cancel-btn\">Cancel</div>\n		\n			<div class=\"clear\"></div>				\n	</div>\n</div>";
    return buffer;});
});
window.require.register("views/templates_web/spinner", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<div class=\"spinnerModal\">\n  <div class=\"spinnerContainer\">\n		<div class=\"description\">Loading</div>\n		<div class=\"spinnerWrapper\">	\n			<div class=\"spinner\">\n		    <div class=\"bar1\"></div>\n		    <div class=\"bar2\"></div>\n		    <div class=\"bar3\"></div>\n		    <div class=\"bar4\"></div>\n		    <div class=\"bar5\"></div>\n		    <div class=\"bar6\"></div>\n		    <div class=\"bar7\"></div>\n		    <div class=\"bar8\"></div>\n		    <div class=\"bar9\"></div>\n		    <div class=\"bar10\"></div>\n		    <div class=\"bar11\"></div>\n		    <div class=\"bar12\"></div>\n		  </div>\n		</div>	\n  </div>\n</div>";});
});
window.require.register("views/templates_web/student", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, foundHelper, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


    buffer += "<div class=\"header drop_shadow\">\n	<div id=\"back-button\"></div>\n	";
    foundHelper = helpers.student;
    stack1 = foundHelper || depth0.student;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.student_name);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student.student_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + " \n</div>\n\n<div id=\"profile-page\" class=\"content_wrapper\">\n	<div id=\"profile-left\">\n		<div class=\"profile-thumb\" style=\"background-image:url(";
    foundHelper = helpers.student;
    stack1 = foundHelper || depth0.student;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.student_image);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student.student_image", { hash: {} }); }
    buffer += escapeExpression(stack1) + ");\">\n			<div class=\"portrait-shadow\"></div>\n		</div>\n		\n	</div>\n		\n	<div id=\"profile-info\">\n		<h1>";
    foundHelper = helpers.student;
    stack1 = foundHelper || depth0.student;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.student_name);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student.student_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h1>\n		<h3>Passcode: ";
    foundHelper = helpers.student;
    stack1 = foundHelper || depth0.student;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.student_code);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student.student_code", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h3>\n	\n		<h3>Contact Information</h3>\n		<p> Phone: ";
    foundHelper = helpers.student;
    stack1 = foundHelper || depth0.student;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.phone_number);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student.phone_number", { hash: {} }); }
    buffer += escapeExpression(stack1) + "<br>\n			Email: ";
    foundHelper = helpers.student;
    stack1 = foundHelper || depth0.student;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.email);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student.email", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n		\n		<h3>Address</h3>\n		<p> ";
    foundHelper = helpers.student;
    stack1 = foundHelper || depth0.student;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.street1);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student.street1", { hash: {} }); }
    buffer += escapeExpression(stack1) + "<br>\n			";
    foundHelper = helpers.student;
    stack1 = foundHelper || depth0.student;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.street2);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student.street2", { hash: {} }); }
    buffer += escapeExpression(stack1) + "<br>\n			";
    foundHelper = helpers.student;
    stack1 = foundHelper || depth0.student;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.city);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student.city", { hash: {} }); }
    buffer += escapeExpression(stack1) + ", ";
    foundHelper = helpers.student;
    stack1 = foundHelper || depth0.student;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.state);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student.state", { hash: {} }); }
    buffer += escapeExpression(stack1) + " ";
    foundHelper = helpers.student;
    stack1 = foundHelper || depth0.student;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.zip);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student.zip", { hash: {} }); }
    buffer += escapeExpression(stack1) + "<br>\n			";
    foundHelper = helpers.student;
    stack1 = foundHelper || depth0.student;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.country);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student.country", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>	\n			\n		<h3>About Me</h3>\n		<p class=\"student-description\">";
    foundHelper = helpers.student;
    stack1 = foundHelper || depth0.student;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.student_description);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student.student_description", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n	</div>\n	\n	<div id=\"settings-student-passcode\" class=\"hide settings-right\">\n		<h2>Change Passcode</h2>\n			\n		<!--Create Passcode-->\n			<div id=\"create-passcode\">\n				<div id=\"create-passbox1\" class=\"pass-box\"></div>\n				<div id=\"create-passbox2\" class=\"pass-box\"></div>\n				<div id=\"create-passbox3\" class=\"pass-box\"></div>\n				<div id=\"create-passbox4\" class=\"pass-box last\"></div>	\n			</div>\n			\n			<div id=\"passcode-container\">\n				<div id=\"1\" class=\"password-block enter-password\">1</div>\n				<div id=\"2\" class=\"password-block enter-password\">2</div>\n				<div id=\"3\" class=\"password-block enter-password password-block-last\">3</div>\n				<div id=\"4\" class=\"password-block enter-password \">4</div>\n				<div id=\"5\" class=\"password-block enter-password\">5</div>\n				<div id=\"6\" class=\"password-block enter-password password-block-last\">6</div>\n				<div id=\"7\" class=\"password-block enter-password\">7</div>\n				<div id=\"8\" class=\"password-block enter-password\">8</div>\n				<div id=\"9\" class=\"password-block enter-password password-block-last\">9</div>\n				\n			<div class=\"button settings-cancel-btn\" style=\"margin-top:30px\">Close</div>\n			\n			</div>\n					\n	</div>\n	\n</div>\n\n</div>";
    return buffer;});
});
window.require.register("views/templates_web/studentAnnouncements", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n";
    foundHelper = helpers.announcement;
    stack1 = foundHelper || depth0.announcement;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.response_list);
    stack2 = helpers.each;
    tmp1 = self.program(2, program2, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		";
    return buffer;}
  function program2(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n<div class=\"discussion student-chat\">\n	<div class=\"message-meta\">\n		<h3>";
    foundHelper = helpers.contributor_name;
    stack1 = foundHelper || depth0.contributor_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "contributor_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h3>\n		<p>";
    foundHelper = helpers.timestamp;
    stack1 = foundHelper || depth0.timestamp;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "timestamp", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n	</div>			\n	<div class=\"message-thumb\" style=\"background-image:url(";
    foundHelper = helpers.contributor_image;
    stack1 = foundHelper || depth0.contributor_image;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "contributor_image", { hash: {} }); }
    buffer += escapeExpression(stack1) + ");\"><div class=\"portrait-shadow\"></div></div>\n	<div class=\"message\"><p>";
    foundHelper = helpers.body;
    stack1 = foundHelper || depth0.body;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "body", { hash: {} }); }
    buffer += escapeExpression(stack1) + " </p></div>\n</div>\n		";
    return buffer;}

  function program4(depth0,data) {
    
    
    return "\n	<div id=\"empty\" class=\"empty-message\">\n		<div class=\"empty-set set-announcement\"></div>\n			<h4>Have something to say?</h4>\n			<p>Type your message in the comment box.</p>\n	</div>\n	";}

    buffer += "<div class=\"section section-shadow discussion-header\">\n	<div id=\"discussion-teacher-hero\" style=\"background-image:url(";
    foundHelper = helpers.announcement;
    stack1 = foundHelper || depth0.announcement;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.moderator_image);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "announcement.moderator_image", { hash: {} }); }
    buffer += escapeExpression(stack1) + ");\"><div class=\"portrait-shadow\"></div></div>	\n	<div class=\"discussion-item-header\">\n		<span>";
    foundHelper = helpers.announcement;
    stack1 = foundHelper || depth0.announcement;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.timestamp);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "announcement.timestamp", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</span>\n		<h1>";
    foundHelper = helpers.announcement;
    stack1 = foundHelper || depth0.announcement;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.header);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "announcement.header", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h1>\n		<p>";
    foundHelper = helpers.announcement;
    stack1 = foundHelper || depth0.announcement;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.body);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "announcement.body", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n	</div>\n</div>\n\n<div id=\"scrollDiscussion\" class=\"scroll_wrapper\">\n	\n<div id=\"scroller\">\n";
    foundHelper = helpers.announcement;
    stack1 = foundHelper || depth0.announcement;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.response_list);
    stack2 = helpers['if'];
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(4, program4, data);
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n	</div><!--end #scroller-->	\n</div><!--end #scrollDiscussion-->\n\n<div id=\"comment-form\">\n	<input id=\"commentMessage\" placeholder=\"Your Messsage\" type=\"text\">\n	<div id=\"iosbutton\" class=\"comment-send-btn\">Send</div>\n</div>\n";
    return buffer;});
});
window.require.register("views/templates_web/studentAnnouncementsList", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n			<div data-id=\"";
    foundHelper = helpers.announcement_id;
    stack1 = foundHelper || depth0.announcement_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "announcement_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"discussion-sidebar-item\">\n				<h2>";
    foundHelper = helpers.header;
    stack1 = foundHelper || depth0.header;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "header", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h2>\n				<p>";
    foundHelper = helpers.body;
    stack1 = foundHelper || depth0.body;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "body", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n				<div class=\"discussion-count\">";
    foundHelper = helpers.response_count;
    stack1 = foundHelper || depth0.response_count;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "response_count", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</div>\n			</div>\n			";
    return buffer;}

  function program3(depth0,data) {
    
    
    return "\n	\n	";}

  function program5(depth0,data) {
    
    
    return "\n		<div id=\"empty\" class=\"empty-message\">\n		<div class=\"empty-set set-announcement\"></div>\n			<h4>No Announcements yet...</h4>\n			<p>Anyone there?</p>\n	</div>\n	";}

    buffer += "<div class=\"header drop_shadow\">\n	<div id=\"menu_button\"></div>\n	Announcements\n</div>\n\n<div class=\"content_wrapper\">\n	\n	<div id=\"scrollDiscussionSidebar\" class=\"scroll_wrapper\">\n		<div id=\"scroller\">\n		\n		";
    foundHelper = helpers.student_announce;
    stack1 = foundHelper || depth0.student_announce;
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			\n		</div><!--end #scroller-->	\n	</div><!--end #scrollDiscussionSidebar-->\n	\n	<div id=\"announcements-body\">\n	\n		";
    foundHelper = helpers.announcement_list;
    stack1 = foundHelper || depth0.announcement_list;
    stack2 = helpers['if'];
    tmp1 = self.program(3, program3, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(5, program5, data);
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n	\n	</div>\n\n\n</div><!--end #content_wrapper-->	";
    return buffer;});
});
window.require.register("views/templates_web/studentAssignments", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n			";
    foundHelper = helpers.assignment_list;
    stack1 = foundHelper || depth0.assignment_list;
    stack2 = helpers['if'];
    tmp1 = self.program(2, program2, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(5, program5, data);
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		";
    return buffer;}
  function program2(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n			";
    foundHelper = helpers.assignment_list;
    stack1 = foundHelper || depth0.assignment_list;
    stack2 = helpers.each;
    tmp1 = self.program(3, program3, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			";
    return buffer;}
  function program3(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n			<div data-id= ";
    foundHelper = helpers.element_id;
    stack1 = foundHelper || depth0.element_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + " class=\"assignments-thumb item\">\n				<div class=\"assignments-thumb-title\">";
    foundHelper = helpers.title;
    stack1 = foundHelper || depth0.title;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "title", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</div>\n				<div class=\"assignments-thumb-date\">";
    foundHelper = helpers.date_due;
    stack1 = foundHelper || depth0.date_due;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "date_due", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</div>\n			</div>\n			";
    return buffer;}

  function program5(depth0,data) {
    
    
    return "\n			<div id=\"empty\">\n				<div class=\"empty-set set-assignment\"></div>\n				<h4>Take a break!</h4>\n				<p>You don't have any assignments!</p>\n			</div>\n			";}

    buffer += "<div class=\"header drop_shadow\">\n	<div id=\"menu_button\"></div>\n\n	Assignments\n</div>\n\n<div class=\"content_wrapper\">\n	<div id=\"scrollElement\" class=\"scroll_wrapper\">\n		<div id=\"scroller\">\n		\n		";
    foundHelper = helpers.student_assignments;
    stack1 = foundHelper || depth0.student_assignments;
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		\n		\n		</div>\n	</div>\n</div>\n";
    return buffer;});
});
window.require.register("views/templates_web/studentBookmarks", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<div class=\"header drop_shadow\">\n	<div id=\"menu_button\"></div>\n	Bookmarks\n</div>\n\n<div id=\"studentBookmark_page\" class=\"content_wrapper\">\n	<div id=\"scrollElement\" class=\"scroll_wrapper\">\n		<div id=\"scroller\">\n			\n		</div>\n	</div>\n</div>";});
});
window.require.register("views/templates_web/studentElement", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<div class=\"header drop_shadow\">\n	<div id=\"menu_button\"></div>\n	Learning Object\n</div>\n\n<div id=\"studentElement_page\" class=\"content_wrapper\">\n	<div id=\"scrollElement\" class=\"scroll_wrapper\">\n		<div id=\"scroller\">\n			\n		</div>\n	</div>\n</div>";});
});
window.require.register("views/templates_web/studentHomeAnnounce", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n		<div id=\"student-home-announce\">\n		\n		";
    foundHelper = helpers.announcements;
    stack1 = foundHelper || depth0.announcements;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.student_announce);
    stack2 = helpers.each;
    tmp1 = self.program(2, program2, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		</div>\n		";
    return buffer;}
  function program2(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n			<div data-id=\"";
    foundHelper = helpers.announcement_id;
    stack1 = foundHelper || depth0.announcement_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "announcement_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"announcement-item\">\n				<div class=\"announcement-header\">\n					<div class=\"announce-thumb\" style=\"background: url(";
    foundHelper = helpers.moderator_image;
    stack1 = foundHelper || depth0.moderator_image;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "moderator_image", { hash: {} }); }
    buffer += escapeExpression(stack1) + ");\"><div class=\"portrait-shadow\"></div></div>			\n					<div class=\"announcement-date\">";
    foundHelper = helpers.timestamp;
    stack1 = foundHelper || depth0.timestamp;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "timestamp", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</div>\n					<h3>";
    foundHelper = helpers.moderator_name;
    stack1 = foundHelper || depth0.moderator_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "moderator_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h3>\n				</div>\n				<div class=\"announcement-border\">&nbsp;</div>\n				<p class=\"announcement\"><strong>";
    foundHelper = helpers.header;
    stack1 = foundHelper || depth0.header;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "header", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</strong><br>\n				 ";
    foundHelper = helpers.body;
    stack1 = foundHelper || depth0.body;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "body", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n				 </p>\n				<div class=\"announcement-footer\">\n					<div class=\"announcement-comment-icon\"></div>\n					<p><strong>";
    foundHelper = helpers.response_count;
    stack1 = foundHelper || depth0.response_count;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "response_count", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</strong> Comments</p>	\n				</div>\n			</div>	\n			";
    return buffer;}

  function program4(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n		";
    foundHelper = helpers.assignment_list;
    stack1 = foundHelper || depth0.assignment_list;
    stack2 = helpers['if'];
    tmp1 = self.program(5, program5, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(8, program8, data);
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			\n			";
    return buffer;}
  function program5(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n		";
    foundHelper = helpers.assignment_list;
    stack1 = foundHelper || depth0.assignment_list;
    stack2 = helpers.each;
    tmp1 = self.program(6, program6, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			";
    return buffer;}
  function program6(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "						\n		\n			<div data-id=\"";
    foundHelper = helpers.element_id;
    stack1 = foundHelper || depth0.element_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"home-assign-item\">\n				<h3>";
    foundHelper = helpers.title;
    stack1 = foundHelper || depth0.title;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "title", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h3>\n				<p>";
    foundHelper = helpers.notes;
    stack1 = foundHelper || depth0.notes;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "notes", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n				<div class=\"assignment-footer\">\n					<p><strong>Due</strong> ";
    foundHelper = helpers.date_due;
    stack1 = foundHelper || depth0.date_due;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "date_due", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n				</div>\n			</div>\n			\n			";
    return buffer;}

  function program8(depth0,data) {
    
    
    return "\n			<div class=\"empty-text\">\n				<h3>Lucky you!</h3>\n				<p>You have no assignments!</p>\n			</div>\n			";}

    buffer += "<div id=\"home-view-cover\"></div>\n\n<div class=\"header drop_shadow\">\n	<div id=\"menu_button\"></div>\n	Home\n</div>\n\n<div id=\"home_page\" class=\"home-wrapper\">\n\n	<div class=\"secondary-nav\">\n			<div class=\"secondary-nav-header student-header student-nav-active\">\n				<div class=\"student-nav-icon\"></div>\n				<div class=\"student-nav-text\">Announcements</div>\n			</div>		\n			<div class=\"secondary-nav-header student-header-assign\">\n				<div class=\"student-nav-icon-assign\"></div>\n				<div class=\"student-nav-text\">Assignments</div>\n			</div>\n	</div><!--end #secondary-nav-->\n	\n	<div id=\"scrollHome\">\n		<div id=\"scroller-home-student\">\n		";
    foundHelper = helpers.blank;
    stack1 = foundHelper || depth0.blank;
    stack2 = helpers.unless;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "	\n\n		<div id=\"student-home-assign\" class=\"hide\">\n		\n		";
    foundHelper = helpers.assignments;
    stack1 = foundHelper || depth0.assignments;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.student_assignments);
    stack2 = helpers.each;
    tmp1 = self.program(4, program4, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		\n		</div>\n		\n				\n		</div><!--end #scroller-home-student-->\n	</div><!--end #scrollHome-->\n	\n	<div id=\"recent-items-container\">	\n	\n		<div id=\"recent-items-inner\">\n			<h3 class=\"items-header\">Recent Items</h3>\n			<div class=\"corner\"></div>\n		</div><!--end #recent-items-container-->\n		\n		<div id=\"scrollPosts\">\n						\n		</div><!--end #scrollPosts -->\n\n</div><!--end #home_page -->";
    return buffer;});
});
window.require.register("views/templates_web/studentHomeRecent", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n	";
    foundHelper = helpers.student_activity;
    stack1 = foundHelper || depth0.student_activity;
    stack2 = helpers.each;
    tmp1 = self.program(2, program2, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n	";
    return buffer;}
  function program2(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n		<div id=\"lesson\" data-id= ";
    foundHelper = helpers.object_id;
    stack1 = foundHelper || depth0.object_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "object_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + " class=\"student-recent-item\" style=\"background: url(";
    foundHelper = helpers.lesson_image_small;
    stack1 = foundHelper || depth0.lesson_image_small;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "lesson_image_small", { hash: {} }); }
    buffer += escapeExpression(stack1) + "); background-repeat: no-repeat; background-size:cover;\">\n			<span>";
    foundHelper = helpers.lesson_name;
    stack1 = foundHelper || depth0.lesson_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "lesson_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</span>\n		</div>\n	";
    return buffer;}

  function program4(depth0,data) {
    
    
    return "\n		<div class=\"empty-text\">\n			<h3>Nothing to show yet &hellip;</h3>\n			<p>Time to get to work!</p>\n		</div>\n	";}

    buffer += "<div id=\"scroller-recent-items\">\n	";
    foundHelper = helpers.student_activity;
    stack1 = foundHelper || depth0.student_activity;
    stack2 = helpers['if'];
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(4, program4, data);
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n\n</div><!--end #scroller-recent-items -->";
    return buffer;});
});
window.require.register("views/templates_web/studentLesson", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n		<div class=\"publish-border unit-header-image\" style=\"background: url('";
    foundHelper = helpers.lesson_image;
    stack1 = foundHelper || depth0.lesson_image;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "lesson_image", { hash: {} }); }
    buffer += escapeExpression(stack1) + "')\"></div>\n			<div class=\"section-header student-section\">\n				<h1>";
    foundHelper = helpers.lesson_name;
    stack1 = foundHelper || depth0.lesson_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "lesson_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h1>\n				<p class=\"subheader\">";
    foundHelper = helpers.lesson_description;
    stack1 = foundHelper || depth0.lesson_description;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "lesson_description", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n				";
    return buffer;}

  function program3(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n			";
    foundHelper = helpers.element_list;
    stack1 = foundHelper || depth0.element_list;
    stack2 = helpers.each;
    tmp1 = self.program(4, program4, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "				\n			";
    return buffer;}
  function program4(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n			<div data-id=\"";
    foundHelper = helpers.element_id;
    stack1 = foundHelper || depth0.element_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" ";
    foundHelper = helpers.video_url;
    stack1 = foundHelper || depth0.video_url;
    stack2 = helpers['if'];
    tmp1 = self.program(5, program5, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += " class=\"element_thumb item\">\n				<div data-id=\"";
    foundHelper = helpers.element_id;
    stack1 = foundHelper || depth0.element_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" ";
    foundHelper = helpers.video_url;
    stack1 = foundHelper || depth0.video_url;
    stack2 = helpers['if'];
    tmp1 = self.program(7, program7, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += " class=\"item_image ";
    foundHelper = helpers.element_type;
    stack1 = foundHelper || depth0.element_type;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_type", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" style=\"background-image:url(";
    foundHelper = helpers.element_image;
    stack1 = foundHelper || depth0.element_image;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_image", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\"></div>\n				<!--<h4><h4>";
    foundHelper = helpers.element_type;
    stack1 = foundHelper || depth0.element_type;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_type", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h4>-->\n				<h3>";
    foundHelper = helpers.element_name;
    stack1 = foundHelper || depth0.element_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h3>\n			</div>\n			";
    return buffer;}
  function program5(depth0,data) {
    
    var buffer = "", stack1;
    buffer += " data-urls=\"";
    foundHelper = helpers.video_url;
    stack1 = foundHelper || depth0.video_url;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "video_url", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" ";
    return buffer;}

  function program7(depth0,data) {
    
    var buffer = "", stack1;
    buffer += " data-urls=\"";
    foundHelper = helpers.video_url;
    stack1 = foundHelper || depth0.video_url;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "video_url", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" ";
    return buffer;}

    buffer += "<div class=\"header drop_shadow\">\n	<div id=\"back-button\"></div>\n	Lesson\n</div>\n\n<div id=\"lesson_page\" class=\"content_wrapper\">\n\n	<div class=\"section section-shadow\">\n		<div id=\"section-header-wrap\">\n		";
    foundHelper = helpers.student_lesson;
    stack1 = foundHelper || depth0.student_lesson;
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			</div>\n		</div>\n	</div>\n	\n	<div id=\"scrollElements\" class=\"scroll_wrapper\">\n		<div id=\"scroller\">\n		";
    foundHelper = helpers.student_lesson;
    stack1 = foundHelper || depth0.student_lesson;
    stack2 = helpers.each;
    tmp1 = self.program(3, program3, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		</div>\n</div>";
    return buffer;});
});
window.require.register("views/templates_web/studentSettings", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, foundHelper, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


    buffer += "<div class=\"header drop_shadow\">\n	<div id=\"menu_button\"></div>\n	Settings\n</div>\n\n<div id=\"profile-page\" class=\"content_wrapper\">\n	<div id=\"settings-overlay\" class=\"hide\"></div>\n	<div id=\"profile-left\">\n		<div class=\"profile-thumb\" style=\"background-image:url(";
    foundHelper = helpers.student;
    stack1 = foundHelper || depth0.student;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.image_url);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student.image_url", { hash: {} }); }
    buffer += escapeExpression(stack1) + ");\">\n			<div class=\"portrait-shadow\"></div>\n		</div>\n		\n		<div id=\"profile-buttons\">\n			<div class=\"button change-photo-btn\">Change Photo</div>\n			<div class=\"button change-pass-btn\">Change Passcode</div>\n			<div class=\"button logout-btn\">LOG OUT</div>\n		</div>\n	</div>\n	\n	<div id=\"profile-info\" class=\"ghost-field\">\n		<h1>";
    foundHelper = helpers.student;
    stack1 = foundHelper || depth0.student;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.student_name);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student.student_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h1>\n		<h3>Passcode: ";
    foundHelper = helpers.student;
    stack1 = foundHelper || depth0.student;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.passcode);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student.passcode", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h3>\n	\n		<h3>Contact Information</h3>\n			<input id=\"parent\" type=\"text\" value=\"";
    foundHelper = helpers.student;
    stack1 = foundHelper || depth0.student;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.guardian);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student.guardian", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" placeholder=\"Parent or Guardian\"><br>\n			<input id=\"email\" type=\"email\" value=\"";
    foundHelper = helpers.student;
    stack1 = foundHelper || depth0.student;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.email);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student.email", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" placeholder=\"Email Address\"><br>\n			<input id=\"phone\" type=\"number\" value=\"";
    foundHelper = helpers.student;
    stack1 = foundHelper || depth0.student;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.phone_number);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student.phone_number", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" placeholder=\"Phone Number\">\n		\n		<h3>Address</h3>\n			<input id=\"street1\" type=\"text\" value=\"";
    foundHelper = helpers.student;
    stack1 = foundHelper || depth0.student;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.street1);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student.street1", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" placeholder=\"Street Address 1\"><br>\n			<input id=\"street2\" type=\"text\" value=\"";
    foundHelper = helpers.student;
    stack1 = foundHelper || depth0.student;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.street2);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student.street2", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" placeholder=\"Street Address 2\"><br>\n			<input id=\"city\" type=\"text\" value=\"";
    foundHelper = helpers.student;
    stack1 = foundHelper || depth0.student;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.city);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student.city", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" placeholder=\"City\"><br>\n			<input id=\"state\" type=\"text\" maxlength=\"2\" value=\"";
    foundHelper = helpers.student;
    stack1 = foundHelper || depth0.student;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.state);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student.state", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" placeholder=\"State\"><br>\n			<input id=\"zip\" type=\"text\" value=\"";
    foundHelper = helpers.student;
    stack1 = foundHelper || depth0.student;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.zip);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student.zip", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" placeholder=\"ZIP Code\"><br>\n			<input id=\"country\" type=\"text\" value=\"";
    foundHelper = helpers.student;
    stack1 = foundHelper || depth0.student;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.country);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student.country", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" placeholder=\"Country\">				\n		\n		<h3>About Me</h3>\n			<textarea id=\"aboutme\" value=\"";
    foundHelper = helpers.student;
    stack1 = foundHelper || depth0.student;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.student_description);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "student.student_description", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" maxlength=\"140\" placeholder=\"About Me in 140 characters!\"></textarea>	\n	</div>\n	\n	\n	<div id=\"settings-student-passcode\" class=\"hide settings-right\">\n		<h2>Change Passcode</h2>\n			\n		<!--Create Passcode-->\n			<div id=\"create-passcode\">\n				<div id=\"create-passbox1\" class=\"pass-box\"></div>\n				<div id=\"create-passbox2\" class=\"pass-box\"></div>\n				<div id=\"create-passbox3\" class=\"pass-box\"></div>\n				<div id=\"create-passbox4\" class=\"pass-box last\"></div>	\n			</div>\n			\n			<div id=\"passcode-container\">\n				<div id=\"1\" class=\"password-block enter-password\">1</div>\n				<div id=\"2\" class=\"password-block enter-password\">2</div>\n				<div id=\"3\" class=\"password-block enter-password password-block-last\">3</div>\n				<div id=\"4\" class=\"password-block enter-password \">4</div>\n				<div id=\"5\" class=\"password-block enter-password\">5</div>\n				<div id=\"6\" class=\"password-block enter-password password-block-last\">6</div>\n				<div id=\"7\" class=\"password-block enter-password\">7</div>\n				<div id=\"8\" class=\"password-block enter-password\">8</div>\n				<div id=\"9\" class=\"password-block enter-password password-block-last\">9</div>\n				\n			<div class=\"button settings-cancel-btn\" style=\"margin-top:30px\">Cancel</div>\n			\n			</div>\n					\n	</div>\n	\n</div>";
    return buffer;});
});
window.require.register("views/templates_web/studentSubject", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n		";
    foundHelper = helpers.unit_id;
    stack1 = foundHelper || depth0.unit_id;
    stack2 = helpers['if'];
    tmp1 = self.program(2, program2, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(4, program4, data);
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		";
    return buffer;}
  function program2(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n			<div data-id=\"";
    foundHelper = helpers.unit_id;
    stack1 = foundHelper || depth0.unit_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"unit_thumb item\">\n				<h1>";
    foundHelper = helpers.unit_name;
    stack1 = foundHelper || depth0.unit_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h1>\n				<div class=\"unit-thumb-student-img\" style=\"background-image:url(";
    foundHelper = helpers.unit_image;
    stack1 = foundHelper || depth0.unit_image;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_image", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\"></div>\n				<p>\n					<span style=\"background-image:url(images/hexagon.png)\">\n						<b>";
    foundHelper = helpers.lesson_count;
    stack1 = foundHelper || depth0.lesson_count;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "lesson_count", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</b> Lessons\n					</span>\n					<span style=\"background-image:url(images/triangle.png)\">\n						<b>";
    foundHelper = helpers.element_count;
    stack1 = foundHelper || depth0.element_count;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_count", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</b> Elements\n					</span>\n				</p> \n			</div>	\n		";
    return buffer;}

  function program4(depth0,data) {
    
    
    return "\n			<div id=\"empty\">\n				<div class=\"empty-set set-unit\"></div>\n				<h4>Phew!</h4>\n				<p>Your teacher hasn't created any lessons yet.</p>\n			</div>\n		";}

    buffer += "<div class=\"header drop_shadow\">\n	<div id=\"menu_button\"></div>\n	Units\n</div>\n\n<div id=\"studentSubject_page\" class=\"content_wrapper\">\n	<div id=\"scrollStudentUnits\" class=\"scroll_wrapper\">\n		<div id=\"scroller\">\n				\n		";
    foundHelper = helpers.unit_list;
    stack1 = foundHelper || depth0.unit_list;
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n\n		</div>\n	</div>\n</div>\n";
    return buffer;});
});
window.require.register("views/templates_web/studentSupplemental", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<div class=\"header drop_shadow\">\n	<div id=\"menu_button\"></div>\n	Supplemental Lessons\n</div>\n\n<div id=\"studentSupplemental_page\" class=\"content_wrapper\">\n	<div id=\"scrollElement\" class=\"scroll_wrapper\">\n		<div id=\"scroller\">\n			\n		</div>\n	</div>\n</div>";});
});
window.require.register("views/templates_web/studentUnit", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1;
    foundHelper = helpers.unit_image;
    stack1 = foundHelper || depth0.unit_image;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_image", { hash: {} }); }
    buffer += escapeExpression(stack1) + "')\"></div>	\n			<div class=\"section-header student-section\">\n				<h1>";
    foundHelper = helpers.unit_name;
    stack1 = foundHelper || depth0.unit_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h1>\n				<p class=\"subheader\">";
    foundHelper = helpers.unit_description;
    stack1 = foundHelper || depth0.unit_description;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_description", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n			</div>\n			";
    return buffer;}

  function program3(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n			";
    foundHelper = helpers.lesson_list;
    stack1 = foundHelper || depth0.lesson_list;
    stack2 = helpers.each;
    tmp1 = self.program(4, program4, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		";
    return buffer;}
  function program4(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n			<div data-id=\"";
    foundHelper = helpers.lesson_id;
    stack1 = foundHelper || depth0.lesson_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "lesson_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"lesson_thumb item\">\n				<h1 class=\"published-header\">";
    foundHelper = helpers.lesson_name;
    stack1 = foundHelper || depth0.lesson_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "lesson_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h1>\n				<div data-id=\"";
    foundHelper = helpers.lesson_id;
    stack1 = foundHelper || depth0.lesson_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "lesson_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"item_image\" style=\"background-image:url(";
    foundHelper = helpers.lesson_image;
    stack1 = foundHelper || depth0.lesson_image;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "lesson_image", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\"></div>\n				<div data-id=\"";
    foundHelper = helpers.lesson_id;
    stack1 = foundHelper || depth0.lesson_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "lesson_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"lesson-thumb-info\">\n					<div class=\"thumb-info-icon\"></div>\n					<span><strong>";
    foundHelper = helpers.element_count;
    stack1 = foundHelper || depth0.element_count;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_count", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</strong> Elements</span>\n				</div>\n			</div>\n			";
    return buffer;}

    buffer += "<div class=\"header drop_shadow\">\n	<div id=\"back-button\"></div>\n	Unit\n</div>\n\n<div id=\"unit_page\" class=\"content_wrapper\">\n	\n	<div class=\"section section-shadow\">\n		<div id=\"section-header-wrap\">\n			<div class=\"unit-header-image\" style=\"background: url('";
    foundHelper = helpers.student_unit;
    stack1 = foundHelper || depth0.student_unit;
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		</div>\n	</div>\n	\n	<div id=\"scrollLessons\" class=\"scroll_wrapper\">\n		<div id=\"scroller\">\n		";
    foundHelper = helpers.student_unit;
    stack1 = foundHelper || depth0.student_unit;
    stack2 = helpers.each;
    tmp1 = self.program(3, program3, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		</div>\n		\n	</div>\n	\n</div>";
    return buffer;});
});
window.require.register("views/templates_web/subject", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "	\n				";
    foundHelper = helpers.group_list;
    stack1 = foundHelper || depth0.group_list;
    stack2 = helpers.each;
    tmp1 = self.program(2, program2, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n				";
    return buffer;}
  function program2(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "	\n				<div id=\"";
    foundHelper = helpers.group_id;
    stack1 = foundHelper || depth0.group_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "group_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"sidebar_item group_item\" data-id=\"";
    foundHelper = helpers.group_id;
    stack1 = foundHelper || depth0.group_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "group_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" style=\"background-image:url(";
    foundHelper = helpers.group_image;
    stack1 = foundHelper || depth0.group_image;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "group_image", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\">\n					";
    foundHelper = helpers.group_name;
    stack1 = foundHelper || depth0.group_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "group_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\n				</div>\n				";
    return buffer;}

    buffer += "<div class=\"header drop_shadow\">\n	<div id=\"menu_button\"></div>\n	Units\n</div>\n\n<div id=\"subject_page\" class=\"content_wrapper unit-wrapper\">\n	<div id=\"addUnit\" class=\"add_button\">\n		<div class=\"add_button_innards\"></div>\n	</div>\n\n	<div class=\"sidebar\">\n		<div id=\"groupall\" class=\"allunits active_sidebarItem\">\n			<h2>All Units</h2>\n		</div>\n		<div class=\"sidebar_title\">By Group</div>\n		<div id=\"scrollGroups1\" class=\"scroll_wrapper\" style=\"top:130px\">\n			<div id=\"scroller\" class=\"scroller-unit\">\n			\n				";
    foundHelper = helpers.teacher_groups;
    stack1 = foundHelper || depth0.teacher_groups;
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			</div>\n		</div>\n	</div>\n	\n	<div id=\"scrollUnits\" class=\"scroll_wrapper\">\n\n	</div>\n	\n</div>";
    return buffer;});
});
window.require.register("views/templates_web/subjectUnits", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n		";
    foundHelper = helpers.unit_list;
    stack1 = foundHelper || depth0.unit_list;
    stack2 = helpers.each;
    tmp1 = self.program(2, program2, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n	</div>\n	";
    return buffer;}
  function program2(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n		<div class=\"unit_thumb item\" data-id=\"";
    foundHelper = helpers.unit_id;
    stack1 = foundHelper || depth0.unit_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\">\n			<h1>";
    foundHelper = helpers.unit_name;
    stack1 = foundHelper || depth0.unit_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h1>\n			<div class=\"unit-thumb-img\" style=\"background-image:url(";
    foundHelper = helpers.unit_image;
    stack1 = foundHelper || depth0.unit_image;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_image", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\"></div>			\n			<p>\n				<span style=\"background-image:url(images/hexagon.png)\">\n					<b>";
    foundHelper = helpers.lesson_count;
    stack1 = foundHelper || depth0.lesson_count;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "lesson_count", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</b> Lessons\n				</span>\n				<span style=\"background-image:url(images/triangle.png)\">\n					<b>";
    foundHelper = helpers.element_count;
    stack1 = foundHelper || depth0.element_count;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_count", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</b> Elements\n				</span>\n			</p> \n		</div>\n		";
    return buffer;}

  function program4(depth0,data) {
    
    
    return "\n	<div id=\"empty\">\n		<div class=\"empty-set set-unit\"></div>\n		<h4>Just Getting Started?</h4>\n		<p>Create a new Unit by using the Add button</p>\n	</div>\n	";}

    buffer += "<div id=\"scroller\">	\n";
    foundHelper = helpers.unit_list;
    stack1 = foundHelper || depth0.unit_list;
    stack2 = helpers['if'];
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(4, program4, data);
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n</div>";
    return buffer;});
});
window.require.register("views/templates_web/unit", function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1, stack2;
    foundHelper = helpers.unit_image;
    stack1 = foundHelper || depth0.unit_image;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_image", { hash: {} }); }
    buffer += escapeExpression(stack1) + "')\"></div>	\n		\n			<div class=\"section-header\">\n				<div class=\"ghost-field ghost-material-header\">\n					<input id=\"unittitle\" type=\"text\" value=\"";
    foundHelper = helpers.unit_name;
    stack1 = foundHelper || depth0.unit_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" placeholder=\"Unit Title\"><br>\n				</div>\n				<!--<h1>";
    foundHelper = helpers.unit_name;
    stack1 = foundHelper || depth0.unit_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h1>-->\n				<!--<p class=\"subheader\">";
    foundHelper = helpers.unit_description;
    stack1 = foundHelper || depth0.unit_description;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_description", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>-->\n				<div class=\"ghost-field ghost-material-subheader\">\n					<textarea id=\"unitdescription\" placeholder=\"Unit Description\">";
    foundHelper = helpers.unit_description;
    stack1 = foundHelper || depth0.unit_description;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "unit_description", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</textarea>\n				</div>\n			</div>\n			\n			<div class=\"section-button-group\">\n			<div class=\"trash hide\"><img src=\"images/trash-icon.png\" width=\"19\" height=\"22\"></div>\n				";
    foundHelper = helpers.is_published;
    stack1 = foundHelper || depth0.is_published;
    stack2 = helpers['if'];
    tmp1 = self.program(2, program2, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(4, program4, data);
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n				";
    return buffer;}
  function program2(depth0,data) {
    
    
    return "\n		  			<div class=\"publish published\">Published</div>\n				";}

  function program4(depth0,data) {
    
    
    return "\n					<div class=\"publish\">Publish</div>\n				";}

  function program6(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n\n		";
    foundHelper = helpers.is_published;
    stack1 = foundHelper || depth0.is_published;
    stack2 = helpers['if'];
    tmp1 = self.program(7, program7, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(10, program10, data);
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		";
    return buffer;}
  function program7(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n			";
    foundHelper = helpers.lesson_list;
    stack1 = foundHelper || depth0.lesson_list;
    stack2 = helpers.each;
    tmp1 = self.program(8, program8, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			\n			";
    return buffer;}
  function program8(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n			<div data-id=\"";
    foundHelper = helpers.lesson_id;
    stack1 = foundHelper || depth0.lesson_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "lesson_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"lesson_thumb item\">\n				<h1 class=\"published-header\">";
    foundHelper = helpers.lesson_name;
    stack1 = foundHelper || depth0.lesson_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "lesson_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h1>\n				<div class=\"item_image\" style=\"background-image:url(";
    foundHelper = helpers.lesson_image;
    stack1 = foundHelper || depth0.lesson_image;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "lesson_image", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\"></div>\n				<div class=\"lesson-thumb-info\">\n					<div class=\"thumb-info-icon\"></div>\n					<span><strong>";
    foundHelper = helpers.element_count;
    stack1 = foundHelper || depth0.element_count;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_count", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</strong> Elements</span>\n				</div>\n			</div>\n			";
    return buffer;}

  function program10(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n			\n			";
    foundHelper = helpers.lesson_list;
    stack1 = foundHelper || depth0.lesson_list;
    stack2 = helpers.each;
    tmp1 = self.program(11, program11, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			\n		";
    return buffer;}
  function program11(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n			<div data-id=\"";
    foundHelper = helpers.lesson_id;
    stack1 = foundHelper || depth0.lesson_id;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "lesson_id", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"lesson_thumb item\">\n				<h1>";
    foundHelper = helpers.lesson_name;
    stack1 = foundHelper || depth0.lesson_name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "lesson_name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h1>\n				<div class=\"item_image\" style=\"background-image:url(";
    foundHelper = helpers.lesson_image;
    stack1 = foundHelper || depth0.lesson_image;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "lesson_image", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\"></div>\n				<div class=\"lesson-thumb-info\">\n					<div class=\"thumb-info-icon\"></div>\n					<span><strong>";
    foundHelper = helpers.element_count;
    stack1 = foundHelper || depth0.element_count;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "element_count", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</strong> Elements</span>\n				</div>\n			</div>\n			";
    return buffer;}

    buffer += "<div class=\"header drop_shadow\">\n<div id=\"menu_button\" class=\"hide\"></div>\n<div id=\"work-button\"></div>\n<div id=\"iosbutton\" class=\"button-right edit\">Edit</div>\n	Unit\n</div>\n\n<div id=\"unit_page\" class=\"content_wrapper\">\n	<div id=\"addLesson\" class=\"add_button\">\n		<div class=\"add_button_innards\"></div>\n	</div>\n	\n	<div class=\"section section-shadow\">\n		<div id=\"section-header-wrap\">\n		<div class=\"unit-header-image\" style=\"background: url('";
    foundHelper = helpers.teacher_unit;
    stack1 = foundHelper || depth0.teacher_unit;
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			</div>\n		</div>\n		\n	</div>\n	\n	<div id=\"scrollLessons\" class=\"scroll_wrapper\">\n		<div id=\"scroller\">\n		\n		";
    foundHelper = helpers.teacher_unit;
    stack1 = foundHelper || depth0.teacher_unit;
    stack2 = helpers.each;
    tmp1 = self.program(6, program6, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		</div>\n	</div>\n</div>";
    return buffer;});
});
window.require.register("views/unit_view", function(exports, require, module) {
  var View = require('./view');
  var template = require('./templates/unit');
  var Unit = require('../models/teacher_unit');
  var message = ("Are you sure you want to delete this unit?");
  var unit_id = 0;



  module.exports = View.extend({
  	id: 'unit-view',
  	template: template,
  	events: {
  		"dataLoaded":"append",
  		'click .lesson_thumb':'viewLesson',
  		'click .add_button':'formNewLesson',
  		'click .publish' : "publishUnit",
  		'click .trash' : "deleteUnit",
  		'click .edit-unit' : "showTrash",
  		'click .done' :'completeAdding',
  		'blur #unittitle' : 'changeTitle',
  		'blur #unitdescription' : 'changeDescription',
  		'click .help':'helpMe'

  	},

  	initialize: function() {  

  	},

  	render: function() {	

  		this.unitInfo = new Unit();
  		this.unitInfo.unitJSON = {};
  		this.$el.html(this.template(this.unitInfo.unitJSON));
  		this.session_id = window.localStorage.getItem("session_id");

  		this.unitInfo.fetch({
  			data:{session_id:this.session_id, unit_id: this.unitId},
  			processData:true,
  			xhrFields: {withCredentials: true},
  			add:true,
  			success:function(){
  				Application.unitView.$el.trigger("dataLoaded");
  			},
  			error: function (jqXHR, textStatus, errorThrown) {
  				var error_message = (textStatus.responseText);
  				
  				if (error_message == "no_session")
  				{
  					Application.router.navigate("/", {
  						trigger: true
  					});
  				}
  			}
  		});

  		unit_id = this.unitId;
  		return this;
  	},

  	append: function(){
  		this.unitInfo.unitJSON = this.unitInfo.handle();
  		this.$el.html(this.template(this.unitInfo.unitJSON));
  		if (this.backbutton == false)
  		{
  			$('#work-button').addClass('hide');
  			$('#menu_button').removeClass('hide');
  			this.backbutton = true;			
  		}

  		this.enableScroll();
  	},

  	enableScroll: function() {
  		var sectionHeight = $('#unit-view .section').height() + 1;
  		$('#scrollLessons').css('top',sectionHeight+'px');
  		scrollLessons = new iScroll('scrollLessons', {useTransition:true,hScroll:false});
  	},

  	publishUnit: function(e) {
  		var session_id = window.localStorage.getItem("session_id");
  		var selected = $(e.currentTarget).hasClass('published');
  		if (selected == false)
  		{
  			$.ajax({
  				data: {session_id: session_id, is_published: true, unit_id: unit_id},
  				url: Application.serverURL+"teacher/units/update.json",
  				type: "POST",
  				xhrFields: {withCredentials: true},
  				dataType:"json",
  				success: function(data) {
  					$('.lesson_thumb h1').addClass('published-header');
  					$('.publish').addClass('published');
  					$('.unit-header-image').addClass('published-border');
  					$('.publish').empty();
  					$('.publish').append('Published');
  					navigator.notification.alert(
  						'Your unit has been published',  // message
  						function alertDismissed() {}, // callback
  						'Publish',            // title
  						'OK'                  // buttonName
  					);
  					$(e.currentTarget).addClass('published');
  				},
  				error: function(textStatus, errorThrown) {
  					$('#theSpinner').hide();
  					navigator.notification.alert(
  						'Unable to publish unit, please try to publish again',  // message
  						function alertDismissed() {}, // callback
  						'Try Again',            // title
  						'OK'                  // buttonName
  					);
  					console.log(JSON.stringify(errorThrown));
  				}
  			});

  		}
  		else
  		{
  			
  			$.ajax({
  				data: {session_id: session_id, is_published: false, unit_id: unit_id},
  				url: Application.serverURL+"teacher/units/update.json",
  				type: "POST",
  				xhrFields: {withCredentials: true},
  				dataType:"json",
  				success: function(data) {
  					$('.lesson_thumb h1').removeClass('published-header');
  					$('.unit-header-image').removeClass('published-border');
  					$('.publish').removeClass('published');
  					$('.publish').empty();
  					$('.publish').append('Publish');
  					navigator.notification.alert(
  						'Your unit has been un-published',  // message
  						function alertDismissed() {}, // callback
  						'Publish',            // title
  						'OK'                  // buttonName
  					);
  					$(e.currentTarget).removeClass('published');
  				},
  				error: function(textStatus, errorThrown) {
  					navigator.notification.alert(
  						'Please try again',  // message
  						function alertDismissed() {}, // callback
  						'Error',            // title
  						'OK'                  // buttonName
  					);
  					console.log(JSON.stringify(errorThrown));
  				}
  			});
  		}
  	},

  	deleteUnit: function() {
  		var session_id = window.localStorage.getItem("session_id");
  		navigator.notification.confirm(
  			'Are you sure you want to delete this unit?',  // message
  			function(buttonIndex){
  				if (buttonIndex == 2)
  				{
  					$.ajax({
  						data: {session_id: session_id, unit_id: unit_id},
  						url: Application.serverURL+"teacher/units/delete.json",
  						type: "POST",
  						xhrFields: {withCredentials: true},
  						success: function(data) {
  							Application.router.navigate("#subject", {trigger: true});
  						},
  						error: function(textStatus, errorThrown) {
  							navigator.notification.alert(
  								'Unable to delete lesson, please try again',  // message
  								function alertDismissed() {}, // callback
  								'Error',            // title
  								'OK'                  // buttonName
  							);
  							console.log(JSON.stringify(errorThrown));
  						}
  					});
  				}
  				},         // callback
  				'Delete',            // title
  				'Cancel, OK'                  // buttonName
  			);
  		},

  		changeTitle: function() {
  			var unit_title = $('#unittitle').val();
  			$.ajax({
  				data: {session_id: this.session_id, title: unit_title, unit_id: this.unitId},
  				url: Application.serverURL+"teacher/units/update.json",
  				type: "POST",
  				xhrFields: {withCredentials: true},
  				dataType:"json",
  				success: function(data) {
  				},
  				error: function(textStatus, errorThrown) {
  					navigator.notification.alert(
  						'Unable to save changes, please try again',  // message
  						function alertDismissed() {}, // callback
  						'Try Again',            // title
  						'OK'                  // buttonName
  					);
  					console.log(JSON.stringify(errorThrown));
  				}
  			});
  		},

  		changeDescription: function() {
  			var unit_description = $('#unitdescription').val();
  			$.ajax({
  				data: {session_id: this.session_id, description: unit_description, unit_id: this.unitId},
  				url: Application.serverURL+"teacher/units/update.json",
  				type: "POST",
  				xhrFields: {withCredentials: true},
  				dataType:"json",
  				success: function(data) {
  				},
  				error: function(textStatus, errorThrown) {
  					navigator.notification.alert(
  						'Unable to save changes, please try again',  // message
  						function alertDismissed() {}, // callback
  						'Try Again',            // title
  						'OK'                  // buttonName
  					);
  					console.log(JSON.stringify(errorThrown));
  				}
  			});
  		},

  		showTrash: function() {
  			$('.trash').fadeIn();
  			$('.edit-unit').empty();
  			$('.edit-unit').addClass("done");
  			$('.edit-unit').append("Done");	
  		},

  		completeAdding: function() {
  			$('.trash').fadeOut();
  			$('.done').empty();
  			$('.done').removeClass("done");
  			$('.edit-unit').append("Edit");
  		},

  		viewLesson: function(e) {
  			e.preventDefault();
  			if (this.lessonButton == false)
  			{
  				Application.lessonView.backbutton = true;			
  			}
  			Application.lessonView.lessonId = $(e.currentTarget).data('id');
  			Application.router.navigate("#lesson", {trigger: true});
  		},

  		formNewLesson: function() {
  			Application.router.navigate("#formNewElement", {trigger: true});
  		},
  		
  		helpMe: function() {
  			$("body").chardinJs('toggle');
  		}

  	});
  
});
window.require.register("views/view", function(exports, require, module) {
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
