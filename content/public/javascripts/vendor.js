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
// Platform: ios

// commit ac725f6ae0bd655789771e2a40b8d60cb4c8c221

// File generated at :: Tue Feb 05 2013 05:30:42 GMT+0100 (CET)

/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at
 
     http://www.apache.org/licenses/LICENSE-2.0
 
 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
*/

;(function() {

// file: lib/scripts/require.js

var require,
    define;

(function () {
    var modules = {};
    // Stack of moduleIds currently being built.
    var requireStack = [];
    // Map of module ID -> index into requireStack of modules currently being built.
    var inProgressModules = {};

    function build(module) {
        var factory = module.factory;
        module.exports = {};
        delete module.factory;
        factory(require, module.exports, module);
        return module.exports;
    }

    require = function (id) {
        if (!modules[id]) {
            throw "module " + id + " not found";
        } else if (id in inProgressModules) {
            var cycle = requireStack.slice(inProgressModules[id]).join('->') + '->' + id;
            throw "Cycle in require graph: " + cycle;
        }
        if (modules[id].factory) {
            try {
                inProgressModules[id] = requireStack.length;
                requireStack.push(id);
                return build(modules[id]);
            } finally {
                delete inProgressModules[id];
                requireStack.pop();
            }
        }
        return modules[id].exports;
    };

    define = function (id, factory) {
        if (modules[id]) {
            throw "module " + id + " already defined";
        }

        modules[id] = {
            id: id,
            factory: factory
        };
    };

    define.remove = function (id) {
        delete modules[id];
    };

    define.moduleMap = modules;
})();

//Export for use in node
if (typeof module === "object" && typeof require === "function") {
    module.exports.require = require;
    module.exports.define = define;
}

// file: lib/cordova.js
define("cordova", function(require, exports, module) {


var channel = require('cordova/channel');

/**
 * Listen for DOMContentLoaded and notify our channel subscribers.
 */
document.addEventListener('DOMContentLoaded', function() {
    channel.onDOMContentLoaded.fire();
}, false);
if (document.readyState == 'complete' || document.readyState == 'interactive') {
    channel.onDOMContentLoaded.fire();
}

/**
 * Intercept calls to addEventListener + removeEventListener and handle deviceready,
 * resume, and pause events.
 */
var m_document_addEventListener = document.addEventListener;
var m_document_removeEventListener = document.removeEventListener;
var m_window_addEventListener = window.addEventListener;
var m_window_removeEventListener = window.removeEventListener;

/**
 * Houses custom event handlers to intercept on document + window event listeners.
 */
var documentEventHandlers = {},
    windowEventHandlers = {};

document.addEventListener = function(evt, handler, capture) {
    var e = evt.toLowerCase();
    if (typeof documentEventHandlers[e] != 'undefined') {
        documentEventHandlers[e].subscribe(handler);
    } else {
        m_document_addEventListener.call(document, evt, handler, capture);
    }
};

window.addEventListener = function(evt, handler, capture) {
    var e = evt.toLowerCase();
    if (typeof windowEventHandlers[e] != 'undefined') {
        windowEventHandlers[e].subscribe(handler);
    } else {
        m_window_addEventListener.call(window, evt, handler, capture);
    }
};

document.removeEventListener = function(evt, handler, capture) {
    var e = evt.toLowerCase();
    // If unsubscribing from an event that is handled by a plugin
    if (typeof documentEventHandlers[e] != "undefined") {
        documentEventHandlers[e].unsubscribe(handler);
    } else {
        m_document_removeEventListener.call(document, evt, handler, capture);
    }
};

window.removeEventListener = function(evt, handler, capture) {
    var e = evt.toLowerCase();
    // If unsubscribing from an event that is handled by a plugin
    if (typeof windowEventHandlers[e] != "undefined") {
        windowEventHandlers[e].unsubscribe(handler);
    } else {
        m_window_removeEventListener.call(window, evt, handler, capture);
    }
};

function createEvent(type, data) {
    var event = document.createEvent('Events');
    event.initEvent(type, false, false);
    if (data) {
        for (var i in data) {
            if (data.hasOwnProperty(i)) {
                event[i] = data[i];
            }
        }
    }
    return event;
}

if(typeof window.console === "undefined") {
    window.console = {
        log:function(){}
    };
}

var cordova = {
    define:define,
    require:require,
    /**
     * Methods to add/remove your own addEventListener hijacking on document + window.
     */
    addWindowEventHandler:function(event) {
        return (windowEventHandlers[event] = channel.create(event));
    },
    addStickyDocumentEventHandler:function(event) {
        return (documentEventHandlers[event] = channel.createSticky(event));
    },
    addDocumentEventHandler:function(event) {
        return (documentEventHandlers[event] = channel.create(event));
    },
    removeWindowEventHandler:function(event) {
        delete windowEventHandlers[event];
    },
    removeDocumentEventHandler:function(event) {
        delete documentEventHandlers[event];
    },
    /**
     * Retrieve original event handlers that were replaced by Cordova
     *
     * @return object
     */
    getOriginalHandlers: function() {
        return {'document': {'addEventListener': m_document_addEventListener, 'removeEventListener': m_document_removeEventListener},
        'window': {'addEventListener': m_window_addEventListener, 'removeEventListener': m_window_removeEventListener}};
    },
    /**
     * Method to fire event from native code
     * bNoDetach is required for events which cause an exception which needs to be caught in native code
     */
    fireDocumentEvent: function(type, data, bNoDetach) {
        var evt = createEvent(type, data);
        if (typeof documentEventHandlers[type] != 'undefined') {
            if( bNoDetach ) {
              documentEventHandlers[type].fire(evt);
            }
            else {
              setTimeout(function() {
                  documentEventHandlers[type].fire(evt);
              }, 0);
            }
        } else {
            document.dispatchEvent(evt);
        }
    },
    fireWindowEvent: function(type, data) {
        var evt = createEvent(type,data);
        if (typeof windowEventHandlers[type] != 'undefined') {
            setTimeout(function() {
                windowEventHandlers[type].fire(evt);
            }, 0);
        } else {
            window.dispatchEvent(evt);
        }
    },

    /**
     * Plugin callback mechanism.
     */
    // Randomize the starting callbackId to avoid collisions after refreshing or navigating.
    // This way, it's very unlikely that any new callback would get the same callbackId as an old callback.
    callbackId: Math.floor(Math.random() * 2000000000),
    callbacks:  {},
    callbackStatus: {
        NO_RESULT: 0,
        OK: 1,
        CLASS_NOT_FOUND_EXCEPTION: 2,
        ILLEGAL_ACCESS_EXCEPTION: 3,
        INSTANTIATION_EXCEPTION: 4,
        MALFORMED_URL_EXCEPTION: 5,
        IO_EXCEPTION: 6,
        INVALID_ACTION: 7,
        JSON_EXCEPTION: 8,
        ERROR: 9
    },

    /**
     * Called by native code when returning successful result from an action.
     */
    callbackSuccess: function(callbackId, args) {
        try {
            cordova.callbackFromNative(callbackId, true, args.status, args.message, args.keepCallback);
        } catch (e) {
            console.log("Error in error callback: " + callbackId + " = "+e);
        }
    },

    /**
     * Called by native code when returning error result from an action.
     */
    callbackError: function(callbackId, args) {
        // TODO: Deprecate callbackSuccess and callbackError in favour of callbackFromNative.
        // Derive success from status.
        try {
            cordova.callbackFromNative(callbackId, false, args.status, args.message, args.keepCallback);
        } catch (e) {
            console.log("Error in error callback: " + callbackId + " = "+e);
        }
    },

    /**
     * Called by native code when returning the result from an action.
     */
    callbackFromNative: function(callbackId, success, status, message, keepCallback) {
        var callback = cordova.callbacks[callbackId];
        if (callback) {
            if (success && status == cordova.callbackStatus.OK) {
                callback.success && callback.success(message);
            } else if (!success) {
                callback.fail && callback.fail(message);
            }

            // Clear callback if not expecting any more results
            if (!keepCallback) {
                delete cordova.callbacks[callbackId];
            }
        }
    },
    addConstructor: function(func) {
        channel.onCordovaReady.subscribe(function() {
            try {
                func();
            } catch(e) {
                console.log("Failed to run constructor: " + e);
            }
        });
    }
};

// Register pause, resume and deviceready channels as events on document.
channel.onPause = cordova.addDocumentEventHandler('pause');
channel.onResume = cordova.addDocumentEventHandler('resume');
channel.onDeviceReady = cordova.addStickyDocumentEventHandler('deviceready');

module.exports = cordova;

});

// file: lib/common/argscheck.js
define("cordova/argscheck", function(require, exports, module) {

var exec = require('cordova/exec');
var utils = require('cordova/utils');

var moduleExports = module.exports;

var typeMap = {
    'A': 'Array',
    'D': 'Date',
    'N': 'Number',
    'S': 'String',
    'F': 'Function',
    'O': 'Object'
};

function extractParamName(callee, argIndex) {
  return (/.*?\((.*?)\)/).exec(callee)[1].split(', ')[argIndex];
}

function checkArgs(spec, functionName, args, opt_callee) {
    if (!moduleExports.enableChecks) {
        return;
    }
    var errMsg = null;
    var typeName;
    for (var i = 0; i < spec.length; ++i) {
        var c = spec.charAt(i),
            cUpper = c.toUpperCase(),
            arg = args[i];
        // Asterix means allow anything.
        if (c == '*') {
            continue;
        }
        typeName = utils.typeName(arg);
        if ((arg === null || arg === undefined) && c == cUpper) {
            continue;
        }
        if (typeName != typeMap[cUpper]) {
            errMsg = 'Expected ' + typeMap[cUpper];
            break;
        }
    }
    if (errMsg) {
        errMsg += ', but got ' + typeName + '.';
        errMsg = 'Wrong type for parameter "' + extractParamName(opt_callee || args.callee, i) + '" of ' + functionName + ': ' + errMsg;
        // Don't log when running jake test.
        if (typeof jasmine == 'undefined') {
            console.error(errMsg);
        }
        throw TypeError(errMsg);
    }
}

function getValue(value, defaultValue) {
    return value === undefined ? defaultValue : value;
}

moduleExports.checkArgs = checkArgs;
moduleExports.getValue = getValue;
moduleExports.enableChecks = true;


});

// file: lib/common/builder.js
define("cordova/builder", function(require, exports, module) {

var utils = require('cordova/utils');

function each(objects, func, context) {
    for (var prop in objects) {
        if (objects.hasOwnProperty(prop)) {
            func.apply(context, [objects[prop], prop]);
        }
    }
}

function clobber(obj, key, value) {
    obj[key] = value;
    // Getters can only be overridden by getters.
    if (obj[key] !== value) {
        utils.defineGetter(obj, key, function() {
            return value;
        });
    }
}

function assignOrWrapInDeprecateGetter(obj, key, value, message) {
    if (message) {
        utils.defineGetter(obj, key, function() {
            console.log(message);
            delete obj[key];
            clobber(obj, key, value);
            return value;
        });
    } else {
        clobber(obj, key, value);
    }
}

function include(parent, objects, clobber, merge) {
    each(objects, function (obj, key) {
        try {
          var result = obj.path ? require(obj.path) : {};

          if (clobber) {
              // Clobber if it doesn't exist.
              if (typeof parent[key] === 'undefined') {
                  assignOrWrapInDeprecateGetter(parent, key, result, obj.deprecated);
              } else if (typeof obj.path !== 'undefined') {
                  // If merging, merge properties onto parent, otherwise, clobber.
                  if (merge) {
                      recursiveMerge(parent[key], result);
                  } else {
                      assignOrWrapInDeprecateGetter(parent, key, result, obj.deprecated);
                  }
              }
              result = parent[key];
          } else {
            // Overwrite if not currently defined.
            if (typeof parent[key] == 'undefined') {
              assignOrWrapInDeprecateGetter(parent, key, result, obj.deprecated);
            } else {
              // Set result to what already exists, so we can build children into it if they exist.
              result = parent[key];
            }
          }

          if (obj.children) {
            include(result, obj.children, clobber, merge);
          }
        } catch(e) {
          utils.alert('Exception building cordova JS globals: ' + e + ' for key "' + key + '"');
        }
    });
}

/**
 * Merge properties from one object onto another recursively.  Properties from
 * the src object will overwrite existing target property.
 *
 * @param target Object to merge properties into.
 * @param src Object to merge properties from.
 */
function recursiveMerge(target, src) {
    for (var prop in src) {
        if (src.hasOwnProperty(prop)) {
            if (target.prototype && target.prototype.constructor === target) {
                // If the target object is a constructor override off prototype.
                clobber(target.prototype, prop, src[prop]);
            } else {
                if (typeof src[prop] === 'object' && typeof target[prop] === 'object') {
                    recursiveMerge(target[prop], src[prop]);
                } else {
                    clobber(target, prop, src[prop]);
                }
            }
        }
    }
}

module.exports = {
    buildIntoButDoNotClobber: function(objects, target) {
        include(target, objects, false, false);
    },
    buildIntoAndClobber: function(objects, target) {
        include(target, objects, true, false);
    },
    buildIntoAndMerge: function(objects, target) {
        include(target, objects, true, true);
    },
    recursiveMerge: recursiveMerge,
    assignOrWrapInDeprecateGetter: assignOrWrapInDeprecateGetter
};

});

// file: lib/common/channel.js
define("cordova/channel", function(require, exports, module) {

var utils = require('cordova/utils'),
    nextGuid = 1;

/**
 * Custom pub-sub "channel" that can have functions subscribed to it
 * This object is used to define and control firing of events for
 * cordova initialization, as well as for custom events thereafter.
 *
 * The order of events during page load and Cordova startup is as follows:
 *
 * onDOMContentLoaded*         Internal event that is received when the web page is loaded and parsed.
 * onNativeReady*              Internal event that indicates the Cordova native side is ready.
 * onCordovaReady*             Internal event fired when all Cordova JavaScript objects have been created.
 * onCordovaInfoReady*         Internal event fired when device properties are available.
 * onCordovaConnectionReady*   Internal event fired when the connection property has been set.
 * onDeviceReady*              User event fired to indicate that Cordova is ready
 * onResume                    User event fired to indicate a start/resume lifecycle event
 * onPause                     User event fired to indicate a pause lifecycle event
 * onDestroy*                  Internal event fired when app is being destroyed (User should use window.onunload event, not this one).
 *
 * The events marked with an * are sticky. Once they have fired, they will stay in the fired state.
 * All listeners that subscribe after the event is fired will be executed right away.
 *
 * The only Cordova events that user code should register for are:
 *      deviceready           Cordova native code is initialized and Cordova APIs can be called from JavaScript
 *      pause                 App has moved to background
 *      resume                App has returned to foreground
 *
 * Listeners can be registered as:
 *      document.addEventListener("deviceready", myDeviceReadyListener, false);
 *      document.addEventListener("resume", myResumeListener, false);
 *      document.addEventListener("pause", myPauseListener, false);
 *
 * The DOM lifecycle events should be used for saving and restoring state
 *      window.onload
 *      window.onunload
 *
 */

/**
 * Channel
 * @constructor
 * @param type  String the channel name
 */
var Channel = function(type, sticky) {
    this.type = type;
    // Map of guid -> function.
    this.handlers = {};
    // 0 = Non-sticky, 1 = Sticky non-fired, 2 = Sticky fired.
    this.state = sticky ? 1 : 0;
    // Used in sticky mode to remember args passed to fire().
    this.fireArgs = null;
    // Used by onHasSubscribersChange to know if there are any listeners.
    this.numHandlers = 0;
    // Function that is called when the first listener is subscribed, or when
    // the last listener is unsubscribed.
    this.onHasSubscribersChange = null;
},
    channel = {
        /**
         * Calls the provided function only after all of the channels specified
         * have been fired. All channels must be sticky channels.
         */
        join: function(h, c) {
            var len = c.length,
                i = len,
                f = function() {
                    if (!(--i)) h();
                };
            for (var j=0; j<len; j++) {
                if (c[j].state === 0) {
                    throw Error('Can only use join with sticky channels.');
                }
                c[j].subscribe(f);
            }
            if (!len) h();
        },
        create: function(type) {
            return channel[type] = new Channel(type, false);
        },
        createSticky: function(type) {
            return channel[type] = new Channel(type, true);
        },

        /**
         * cordova Channels that must fire before "deviceready" is fired.
         */
        deviceReadyChannelsArray: [],
        deviceReadyChannelsMap: {},

        /**
         * Indicate that a feature needs to be initialized before it is ready to be used.
         * This holds up Cordova's "deviceready" event until the feature has been initialized
         * and Cordova.initComplete(feature) is called.
         *
         * @param feature {String}     The unique feature name
         */
        waitForInitialization: function(feature) {
            if (feature) {
                var c = channel[feature] || this.createSticky(feature);
                this.deviceReadyChannelsMap[feature] = c;
                this.deviceReadyChannelsArray.push(c);
            }
        },

        /**
         * Indicate that initialization code has completed and the feature is ready to be used.
         *
         * @param feature {String}     The unique feature name
         */
        initializationComplete: function(feature) {
            var c = this.deviceReadyChannelsMap[feature];
            if (c) {
                c.fire();
            }
        }
    };

function forceFunction(f) {
    if (typeof f != 'function') throw "Function required as first argument!";
}

/**
 * Subscribes the given function to the channel. Any time that
 * Channel.fire is called so too will the function.
 * Optionally specify an execution context for the function
 * and a guid that can be used to stop subscribing to the channel.
 * Returns the guid.
 */
Channel.prototype.subscribe = function(f, c) {
    // need a function to call
    forceFunction(f);
    if (this.state == 2) {
        f.apply(c || this, this.fireArgs);
        return;
    }

    var func = f,
        guid = f.observer_guid;
    if (typeof c == "object") { func = utils.close(c, f); }

    if (!guid) {
        // first time any channel has seen this subscriber
        guid = '' + nextGuid++;
    }
    func.observer_guid = guid;
    f.observer_guid = guid;

    // Don't add the same handler more than once.
    if (!this.handlers[guid]) {
        this.handlers[guid] = func;
        this.numHandlers++;
        if (this.numHandlers == 1) {
            this.onHasSubscribersChange && this.onHasSubscribersChange();
        }
    }
};

/**
 * Unsubscribes the function with the given guid from the channel.
 */
Channel.prototype.unsubscribe = function(f) {
    // need a function to unsubscribe
    forceFunction(f);

    var guid = f.observer_guid,
        handler = this.handlers[guid];
    if (handler) {
        delete this.handlers[guid];
        this.numHandlers--;
        if (this.numHandlers === 0) {
            this.onHasSubscribersChange && this.onHasSubscribersChange();
        }
    }
};

/**
 * Calls all functions subscribed to this channel.
 */
Channel.prototype.fire = function(e) {
    var fail = false,
        fireArgs = Array.prototype.slice.call(arguments);
    // Apply stickiness.
    if (this.state == 1) {
        this.state = 2;
        this.fireArgs = fireArgs;
    }
    if (this.numHandlers) {
        // Copy the values first so that it is safe to modify it from within
        // callbacks.
        var toCall = [];
        for (var item in this.handlers) {
            toCall.push(this.handlers[item]);
        }
        for (var i = 0; i < toCall.length; ++i) {
            toCall[i].apply(this, fireArgs);
        }
        if (this.state == 2 && this.numHandlers) {
            this.numHandlers = 0;
            this.handlers = {};
            this.onHasSubscribersChange && this.onHasSubscribersChange();
        }
    }
};


// defining them here so they are ready super fast!
// DOM event that is received when the web page is loaded and parsed.
channel.createSticky('onDOMContentLoaded');

// Event to indicate the Cordova native side is ready.
channel.createSticky('onNativeReady');

// Event to indicate that all Cordova JavaScript objects have been created
// and it's time to run plugin constructors.
channel.createSticky('onCordovaReady');

// Event to indicate that device properties are available
channel.createSticky('onCordovaInfoReady');

// Event to indicate that the connection property has been set.
channel.createSticky('onCordovaConnectionReady');

// Event to indicate that Cordova is ready
channel.createSticky('onDeviceReady');

// Event to indicate a resume lifecycle event
channel.create('onResume');

// Event to indicate a pause lifecycle event
channel.create('onPause');

// Event to indicate a destroy lifecycle event
channel.createSticky('onDestroy');

// Channels that must fire before "deviceready" is fired.
channel.waitForInitialization('onCordovaReady');
channel.waitForInitialization('onCordovaConnectionReady');

module.exports = channel;

});

// file: lib/common/commandProxy.js
define("cordova/commandProxy", function(require, exports, module) {


// internal map of proxy function
var CommandProxyMap = {};

module.exports = {

    // example: cordova.commandProxy.add("Accelerometer",{getCurrentAcceleration: function(successCallback, errorCallback, options) {...},...);
    add:function(id,proxyObj) {
        console.log("adding proxy for " + id);
        CommandProxyMap[id] = proxyObj;
        return proxyObj;
    },

    // cordova.commandProxy.remove("Accelerometer");
    remove:function(id) {
        var proxy = CommandProxyMap[id];
        delete CommandProxyMap[id];
        CommandProxyMap[id] = null;
        return proxy;
    },

    get:function(service,action) {
        return ( CommandProxyMap[service] ? CommandProxyMap[service][action] : null );
    }
};
});

// file: lib/common/common.js
define("cordova/common", function(require, exports, module) {

module.exports = {
    defaults: {
        cordova: {
            path: 'cordova',
            children: {
                exec: {
                    path: 'cordova/exec'
                },
                logger: {
                    path: 'cordova/plugin/logger'
                }
            }
        },
        Cordova: {
            children: {
                exec: {
                    path: 'cordova/exec'
                }
            }
        },
        open : {
            path: 'cordova/plugin/InAppBrowser'
        },
        navigator: {
            children: {
                notification: {
                    path: 'cordova/plugin/notification'
                },
                accelerometer: {
                    path: 'cordova/plugin/accelerometer'
                },
                battery: {
                    path: 'cordova/plugin/battery'
                },
                camera:{
                    path: 'cordova/plugin/Camera'
                },
                compass:{
                    path: 'cordova/plugin/compass'
                },
                contacts: {
                    path: 'cordova/plugin/contacts'
                },
                device:{
                    children:{
                        capture: {
                            path: 'cordova/plugin/capture'
                        }
                    }
                },
                geolocation: {
                    path: 'cordova/plugin/geolocation'
                },
                globalization: {
                    path: 'cordova/plugin/globalization'
                },
                network: {
                    children: {
                        connection: {
                            path: 'cordova/plugin/network',
                            deprecated: 'navigator.network.connection is deprecated. Use navigator.connection instead.'
                        }
                    }
                },
                splashscreen: {
                    path: 'cordova/plugin/splashscreen'
                }
            }
        },
        Acceleration: {
            path: 'cordova/plugin/Acceleration'
        },
        Camera:{
            path: 'cordova/plugin/CameraConstants'
        },
        CameraPopoverOptions: {
            path: 'cordova/plugin/CameraPopoverOptions'
        },
        CaptureError: {
            path: 'cordova/plugin/CaptureError'
        },
        CaptureAudioOptions:{
            path: 'cordova/plugin/CaptureAudioOptions'
        },
        CaptureImageOptions: {
            path: 'cordova/plugin/CaptureImageOptions'
        },
        CaptureVideoOptions: {
            path: 'cordova/plugin/CaptureVideoOptions'
        },
        CompassHeading:{
            path: 'cordova/plugin/CompassHeading'
        },
        CompassError:{
            path: 'cordova/plugin/CompassError'
        },
        ConfigurationData: {
            path: 'cordova/plugin/ConfigurationData'
        },
        Connection: {
            path: 'cordova/plugin/Connection'
        },
        Contact: {
            path: 'cordova/plugin/Contact'
        },
        ContactAddress: {
            path: 'cordova/plugin/ContactAddress'
        },
        ContactError: {
            path: 'cordova/plugin/ContactError'
        },
        ContactField: {
            path: 'cordova/plugin/ContactField'
        },
        ContactFindOptions: {
            path: 'cordova/plugin/ContactFindOptions'
        },
        ContactName: {
            path: 'cordova/plugin/ContactName'
        },
        ContactOrganization: {
            path: 'cordova/plugin/ContactOrganization'
        },
        Coordinates: {
            path: 'cordova/plugin/Coordinates'
        },
        device: {
            path: 'cordova/plugin/device'
        },
        GlobalizationError: {
            path: 'cordova/plugin/GlobalizationError'
        },
        Media: {
            path: 'cordova/plugin/Media'
        },
        MediaError: {
            path: 'cordova/plugin/MediaError'
        },
        MediaFile: {
            path: 'cordova/plugin/MediaFile'
        },
        MediaFileData:{
            path: 'cordova/plugin/MediaFileData'
        },
        Position: {
            path: 'cordova/plugin/Position'
        },
        PositionError: {
            path: 'cordova/plugin/PositionError'
        },
        ProgressEvent: {
            path: 'cordova/plugin/ProgressEvent'
        }
    },
    clobbers: {
        navigator: {
            children: {
                connection: {
                    path: 'cordova/plugin/network'
                }
            }
        }
    }
};

});

// file: lib/ios/exec.js
define("cordova/exec", function(require, exports, module) {

/**
 * Creates a gap bridge iframe used to notify the native code about queued
 * commands.
 *
 * @private
 */
var cordova = require('cordova'),
    channel = require('cordova/channel'),
    utils = require('cordova/utils'),
    jsToNativeModes = {
        IFRAME_NAV: 0,
        XHR_NO_PAYLOAD: 1,
        XHR_WITH_PAYLOAD: 2,
        XHR_OPTIONAL_PAYLOAD: 3
    },
    bridgeMode,
    execIframe,
    execXhr,
    requestCount = 0,
    vcHeaderValue = null,
    commandQueue = [], // Contains pending JS->Native messages.
    isInContextOfEvalJs = 0;

function createExecIframe() {
    var iframe = document.createElement("iframe");
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    return iframe;
}

function shouldBundleCommandJson() {
    if (bridgeMode == jsToNativeModes.XHR_WITH_PAYLOAD) {
        return true;
    }
    if (bridgeMode == jsToNativeModes.XHR_OPTIONAL_PAYLOAD) {
        var payloadLength = 0;
        for (var i = 0; i < commandQueue.length; ++i) {
            payloadLength += commandQueue[i].length;
        }
        // The value here was determined using the benchmark within CordovaLibApp on an iPad 3.
        return payloadLength < 4500;
    }
    return false;
}

function massageArgsJsToNative(args) {
    var encodeArrayBufferAs8bitString = function(ab) {
        return String.fromCharCode.apply(null, new Uint8Array(ab));
    };
    var encodeArrayBufferAsBase64 = function(ab) {
        return window.btoa(encodeArrayBufferAs8bitString(ab));
    };
    args.forEach(function(arg, i) {
        if (utils.typeName(arg) == 'ArrayBuffer') {
            args[i] = {
                'CDVType': 'ArrayBuffer',
                'data': encodeArrayBufferAsBase64(arg)
            };
        }
    });
    return args;
}

function massagePayloadNativeToJs(payload) {
    if (payload && payload.hasOwnProperty('CDVType') && payload.CDVType == 'ArrayBuffer') {
        var stringToArrayBuffer = function(str) {
            var ret = new Uint8Array(str.length);
            for (var i = 0; i < str.length; i++) {
                ret[i] = str.charCodeAt(i);
            }
            return ret.buffer;
        };
        var base64ToArrayBuffer = function(b64) {
            return stringToArrayBuffer(atob(b64));
        };
        payload = base64ToArrayBuffer(payload.data);
    }
    return payload;
}

function iOSExec() {
    // XHR mode does not work on iOS 4.2, so default to IFRAME_NAV for such devices.
    // XHR mode's main advantage is working around a bug in -webkit-scroll, which
    // doesn't exist in 4.X devices anyways.
    if (bridgeMode === undefined) {
        bridgeMode = navigator.userAgent.indexOf(' 4_') == -1 ? jsToNativeModes.XHR_NO_PAYLOAD : jsToNativeModes.IFRAME_NAV;
    }

    var successCallback, failCallback, service, action, actionArgs, splitCommand;
    var callbackId = null;
    if (typeof arguments[0] !== "string") {
        // FORMAT ONE
        successCallback = arguments[0];
        failCallback = arguments[1];
        service = arguments[2];
        action = arguments[3];
        actionArgs = arguments[4];

        // Since we need to maintain backwards compatibility, we have to pass
        // an invalid callbackId even if no callback was provided since plugins
        // will be expecting it. The Cordova.exec() implementation allocates
        // an invalid callbackId and passes it even if no callbacks were given.
        callbackId = 'INVALID';
    } else {
        // FORMAT TWO
        splitCommand = arguments[0].split(".");
        action = splitCommand.pop();
        service = splitCommand.join(".");
        actionArgs = Array.prototype.splice.call(arguments, 1);
    }

    // Register the callbacks and add the callbackId to the positional
    // arguments if given.
    if (successCallback || failCallback) {
        callbackId = service + cordova.callbackId++;
        cordova.callbacks[callbackId] =
            {success:successCallback, fail:failCallback};
    }

    actionArgs = massageArgsJsToNative(actionArgs);

    var command = [callbackId, service, action, actionArgs];

    // Stringify and queue the command. We stringify to command now to
    // effectively clone the command arguments in case they are mutated before
    // the command is executed.
    commandQueue.push(JSON.stringify(command));

    // If we're in the context of a stringByEvaluatingJavaScriptFromString call,
    // then the queue will be flushed when it returns; no need for a poke.
    // Also, if there is already a command in the queue, then we've already
    // poked the native side, so there is no reason to do so again.
    if (!isInContextOfEvalJs && commandQueue.length == 1) {
        if (bridgeMode != jsToNativeModes.IFRAME_NAV) {
            // This prevents sending an XHR when there is already one being sent.
            // This should happen only in rare circumstances (refer to unit tests).
            if (execXhr && execXhr.readyState != 4) {
                execXhr = null;
            }
            // Re-using the XHR improves exec() performance by about 10%.
            execXhr = execXhr || new XMLHttpRequest();
            // Changing this to a GET will make the XHR reach the URIProtocol on 4.2.
            // For some reason it still doesn't work though...
            // Add a timestamp to the query param to prevent caching.
            execXhr.open('HEAD', "/!gap_exec?" + (+new Date()), true);
            if (!vcHeaderValue) {
                vcHeaderValue = /.*\((.*)\)/.exec(navigator.userAgent)[1];
            }
            execXhr.setRequestHeader('vc', vcHeaderValue);
            execXhr.setRequestHeader('rc', ++requestCount);
            if (shouldBundleCommandJson()) {
                execXhr.setRequestHeader('cmds', iOSExec.nativeFetchMessages());
            }
            execXhr.send(null);
        } else {
            execIframe = execIframe || createExecIframe();
            execIframe.src = "gap://ready";
        }
    }
}

iOSExec.jsToNativeModes = jsToNativeModes;

iOSExec.setJsToNativeBridgeMode = function(mode) {
    // Remove the iFrame since it may be no longer required, and its existence
    // can trigger browser bugs.
    // https://issues.apache.org/jira/browse/CB-593
    if (execIframe) {
        execIframe.parentNode.removeChild(execIframe);
        execIframe = null;
    }
    bridgeMode = mode;
};

iOSExec.nativeFetchMessages = function() {
    // Each entry in commandQueue is a JSON string already.
    if (!commandQueue.length) {
        return '';
    }
    var json = '[' + commandQueue.join(',') + ']';
    commandQueue.length = 0;
    return json;
};

iOSExec.nativeCallback = function(callbackId, status, payload, keepCallback) {
    return iOSExec.nativeEvalAndFetch(function() {
        var success = status === 0 || status === 1;
        payload = massagePayloadNativeToJs(payload);
        cordova.callbackFromNative(callbackId, success, status, payload, keepCallback);
    });
};

iOSExec.nativeEvalAndFetch = function(func) {
    // This shouldn't be nested, but better to be safe.
    isInContextOfEvalJs++;
    try {
        func();
        return iOSExec.nativeFetchMessages();
    } finally {
        isInContextOfEvalJs--;
    }
};

module.exports = iOSExec;

});

// file: lib/common/modulemapper.js
define("cordova/modulemapper", function(require, exports, module) {

var builder = require('cordova/builder'),
    moduleMap = define.moduleMap,
    symbolList,
    deprecationMap;

exports.reset = function() {
    symbolList = [];
    deprecationMap = {};
};

function addEntry(strategy, moduleName, symbolPath, opt_deprecationMessage) {
    if (!(moduleName in moduleMap)) {
        throw new Error('Module ' + moduleName + ' does not exist.');
    }
    symbolList.push(strategy, moduleName, symbolPath);
    if (opt_deprecationMessage) {
        deprecationMap[symbolPath] = opt_deprecationMessage;
    }
}

// Note: Android 2.3 does have Function.bind().
exports.clobbers = function(moduleName, symbolPath, opt_deprecationMessage) {
    addEntry('c', moduleName, symbolPath, opt_deprecationMessage);
};

exports.merges = function(moduleName, symbolPath, opt_deprecationMessage) {
    addEntry('m', moduleName, symbolPath, opt_deprecationMessage);
};

exports.defaults = function(moduleName, symbolPath, opt_deprecationMessage) {
    addEntry('d', moduleName, symbolPath, opt_deprecationMessage);
};

function prepareNamespace(symbolPath, context) {
    if (!symbolPath) {
        return context;
    }
    var parts = symbolPath.split('.');
    var cur = context;
    for (var i = 0, part; part = parts[i]; ++i) {
        cur[part] = cur[part] || {};
    }
    return cur[parts[i-1]];
}

exports.mapModules = function(context) {
    var origSymbols = {};
    context.CDV_origSymbols = origSymbols;
    for (var i = 0, len = symbolList.length; i < len; i += 3) {
        var strategy = symbolList[i];
        var moduleName = symbolList[i + 1];
        var symbolPath = symbolList[i + 2];
        var lastDot = symbolPath.lastIndexOf('.');
        var namespace = symbolPath.substr(0, lastDot);
        var lastName = symbolPath.substr(lastDot + 1);

        var module = require(moduleName);
        var deprecationMsg = symbolPath in deprecationMap ? 'Access made to deprecated symbol: ' + symbolPath + '. ' + deprecationMsg : null;
        var parentObj = prepareNamespace(namespace, context);
        var target = parentObj[lastName];

        if (strategy == 'm' && target) {
            builder.recursiveMerge(target, module);
        } else if ((strategy == 'd' && !target) || (strategy != 'd')) {
            if (target) {
                origSymbols[symbolPath] = target;
            }
            builder.assignOrWrapInDeprecateGetter(parentObj, lastName, module, deprecationMsg);
        }
    }
};

exports.getOriginalSymbol = function(context, symbolPath) {
    var origSymbols = context.CDV_origSymbols;
    if (origSymbols && (symbolPath in origSymbols)) {
        return origSymbols[symbolPath];
    }
    var parts = symbolPath.split('.');
    var obj = context;
    for (var i = 0; i < parts.length; ++i) {
        obj = obj && obj[parts[i]];
    }
    return obj;
};

exports.loadMatchingModules = function(matchingRegExp) {
    for (var k in moduleMap) {
        if (matchingRegExp.exec(k)) {
            require(k);
        }
    }
};

exports.reset();


});

// file: lib/ios/platform.js
define("cordova/platform", function(require, exports, module) {

module.exports = {
    id: "ios",
    initialize:function() {
        var modulemapper = require('cordova/modulemapper');

        modulemapper.loadMatchingModules(/cordova.*\/symbols$/);
        modulemapper.mapModules(window);
    },
    clobbers: {
        MediaError: { // exists natively, override
            path: "cordova/plugin/MediaError"
        },
        console: {
            path: 'cordova/plugin/ios/console'
        },
        open : {
            path: 'cordova/plugin/InAppBrowser'
        }
    },
    merges:{
        Contact:{
            path: "cordova/plugin/ios/Contact"
        },
        navigator:{
            children:{
                notification:{
                    path:"cordova/plugin/ios/notification"
                },
                contacts:{
                    path:"cordova/plugin/ios/contacts"
                },
                geolocation: {
                    path: 'cordova/plugin/geolocation'
                }
            }
        }
    }
};

// use the native logger
var logger = require("cordova/plugin/logger");
logger.useConsole(false);

});

// file: lib/common/plugin/Acceleration.js
define("cordova/plugin/Acceleration", function(require, exports, module) {

var Acceleration = function(x, y, z, timestamp) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.timestamp = timestamp || (new Date()).getTime();
};

module.exports = Acceleration;

});

// file: lib/common/plugin/Camera.js
define("cordova/plugin/Camera", function(require, exports, module) {

var argscheck = require('cordova/argscheck'),
    exec = require('cordova/exec'),
    Camera = require('cordova/plugin/CameraConstants');

var cameraExport = {};

// Tack on the Camera Constants to the base camera plugin.
for (var key in Camera) {
    cameraExport[key] = Camera[key];
}

/**
 * Gets a picture from source defined by "options.sourceType", and returns the
 * image as defined by the "options.destinationType" option.

 * The defaults are sourceType=CAMERA and destinationType=FILE_URI.
 *
 * @param {Function} successCallback
 * @param {Function} errorCallback
 * @param {Object} options
 */
cameraExport.getPicture = function(successCallback, errorCallback, options) {
    argscheck.checkArgs('fFO', 'Camera.getPicture', arguments);
    options = options || {};
    var getValue = argscheck.getValue;

    var quality = getValue(options.quality, 50);
    var destinationType = getValue(options.destinationType, Camera.DestinationType.FILE_URI);
    var sourceType = getValue(options.sourceType, Camera.PictureSourceType.CAMERA);
    var targetWidth = getValue(options.targetWidth, -1);
    var targetHeight = getValue(options.targetHeight, -1);
    var encodingType = getValue(options.encodingType, Camera.EncodingType.JPEG);
    var mediaType = getValue(options.mediaType, Camera.MediaType.PICTURE);
    var allowEdit = !!options.allowEdit;
    var correctOrientation = !!options.correctOrientation;
    var saveToPhotoAlbum = !!options.saveToPhotoAlbum;
    var popoverOptions = getValue(options.popoverOptions, null);

    var args = [quality, destinationType, sourceType, targetWidth, targetHeight, encodingType,
                mediaType, allowEdit, correctOrientation, saveToPhotoAlbum, popoverOptions];

    exec(successCallback, errorCallback, "Camera", "takePicture", args);
};

cameraExport.cleanup = function(successCallback, errorCallback) {
    exec(successCallback, errorCallback, "Camera", "cleanup", []);
};

module.exports = cameraExport;

});

// file: lib/common/plugin/CameraConstants.js
define("cordova/plugin/CameraConstants", function(require, exports, module) {

module.exports = {
  DestinationType:{
    DATA_URL: 0,         // Return base64 encoded string
    FILE_URI: 1,         // Return file uri (content://media/external/images/media/2 for Android)
    NATIVE_URI: 2        // Return native uri (eg. asset-library://... for iOS)
  },
  EncodingType:{
    JPEG: 0,             // Return JPEG encoded image
    PNG: 1               // Return PNG encoded image
  },
  MediaType:{
    PICTURE: 0,          // allow selection of still pictures only. DEFAULT. Will return format specified via DestinationType
    VIDEO: 1,            // allow selection of video only, ONLY RETURNS URL
    ALLMEDIA : 2         // allow selection from all media types
  },
  PictureSourceType:{
    PHOTOLIBRARY : 0,    // Choose image from picture library (same as SAVEDPHOTOALBUM for Android)
    CAMERA : 1,          // Take picture from camera
    SAVEDPHOTOALBUM : 2  // Choose image from picture library (same as PHOTOLIBRARY for Android)
  },
  PopoverArrowDirection:{
      ARROW_UP : 1,        // matches iOS UIPopoverArrowDirection constants to specify arrow location on popover
      ARROW_DOWN : 2,
      ARROW_LEFT : 4,
      ARROW_RIGHT : 8,
      ARROW_ANY : 15
  }
};

});

// file: lib/common/plugin/CameraPopoverOptions.js
define("cordova/plugin/CameraPopoverOptions", function(require, exports, module) {

var Camera = require('cordova/plugin/CameraConstants');

/**
 * Encapsulates options for iOS Popover image picker
 */
var CameraPopoverOptions = function(x,y,width,height,arrowDir){
    // information of rectangle that popover should be anchored to
    this.x = x || 0;
    this.y = y || 32;
    this.width = width || 320;
    this.height = height || 480;
    // The direction of the popover arrow
    this.arrowDir = arrowDir || Camera.PopoverArrowDirection.ARROW_ANY;
};

module.exports = CameraPopoverOptions;

});

// file: lib/common/plugin/CaptureAudioOptions.js
define("cordova/plugin/CaptureAudioOptions", function(require, exports, module) {

/**
 * Encapsulates all audio capture operation configuration options.
 */
var CaptureAudioOptions = function(){
    // Upper limit of sound clips user can record. Value must be equal or greater than 1.
    this.limit = 1;
    // Maximum duration of a single sound clip in seconds.
    this.duration = 0;
    // The selected audio mode. Must match with one of the elements in supportedAudioModes array.
    this.mode = null;
};

module.exports = CaptureAudioOptions;

});

// file: lib/common/plugin/CaptureError.js
define("cordova/plugin/CaptureError", function(require, exports, module) {

/**
 * The CaptureError interface encapsulates all errors in the Capture API.
 */
var CaptureError = function(c) {
   this.code = c || null;
};

// Camera or microphone failed to capture image or sound.
CaptureError.CAPTURE_INTERNAL_ERR = 0;
// Camera application or audio capture application is currently serving other capture request.
CaptureError.CAPTURE_APPLICATION_BUSY = 1;
// Invalid use of the API (e.g. limit parameter has value less than one).
CaptureError.CAPTURE_INVALID_ARGUMENT = 2;
// User exited camera application or audio capture application before capturing anything.
CaptureError.CAPTURE_NO_MEDIA_FILES = 3;
// The requested capture operation is not supported.
CaptureError.CAPTURE_NOT_SUPPORTED = 20;

module.exports = CaptureError;

});

// file: lib/common/plugin/CaptureImageOptions.js
define("cordova/plugin/CaptureImageOptions", function(require, exports, module) {

/**
 * Encapsulates all image capture operation configuration options.
 */
var CaptureImageOptions = function(){
    // Upper limit of images user can take. Value must be equal or greater than 1.
    this.limit = 1;
    // The selected image mode. Must match with one of the elements in supportedImageModes array.
    this.mode = null;
};

module.exports = CaptureImageOptions;

});

// file: lib/common/plugin/CaptureVideoOptions.js
define("cordova/plugin/CaptureVideoOptions", function(require, exports, module) {

/**
 * Encapsulates all video capture operation configuration options.
 */
var CaptureVideoOptions = function(){
    // Upper limit of videos user can record. Value must be equal or greater than 1.
    this.limit = 1;
    // Maximum duration of a single video clip in seconds.
    this.duration = 0;
    // The selected video mode. Must match with one of the elements in supportedVideoModes array.
    this.mode = null;
};

module.exports = CaptureVideoOptions;

});

// file: lib/common/plugin/CompassError.js
define("cordova/plugin/CompassError", function(require, exports, module) {

/**
 *  CompassError.
 *  An error code assigned by an implementation when an error has occurred
 * @constructor
 */
var CompassError = function(err) {
    this.code = (err !== undefined ? err : null);
};

CompassError.COMPASS_INTERNAL_ERR = 0;
CompassError.COMPASS_NOT_SUPPORTED = 20;

module.exports = CompassError;

});

// file: lib/common/plugin/CompassHeading.js
define("cordova/plugin/CompassHeading", function(require, exports, module) {

var CompassHeading = function(magneticHeading, trueHeading, headingAccuracy, timestamp) {
  this.magneticHeading = magneticHeading || null;
  this.trueHeading = trueHeading || null;
  this.headingAccuracy = headingAccuracy || null;
  this.timestamp = timestamp || new Date().getTime();
};

module.exports = CompassHeading;

});

// file: lib/common/plugin/ConfigurationData.js
define("cordova/plugin/ConfigurationData", function(require, exports, module) {

/**
 * Encapsulates a set of parameters that the capture device supports.
 */
function ConfigurationData() {
    // The ASCII-encoded string in lower case representing the media type.
    this.type = null;
    // The height attribute represents height of the image or video in pixels.
    // In the case of a sound clip this attribute has value 0.
    this.height = 0;
    // The width attribute represents width of the image or video in pixels.
    // In the case of a sound clip this attribute has value 0
    this.width = 0;
}

module.exports = ConfigurationData;

});

// file: lib/common/plugin/Connection.js
define("cordova/plugin/Connection", function(require, exports, module) {

/**
 * Network status
 */
module.exports = {
        UNKNOWN: "unknown",
        ETHERNET: "ethernet",
        WIFI: "wifi",
        CELL_2G: "2g",
        CELL_3G: "3g",
        CELL_4G: "4g",
        CELL:"cellular",
        NONE: "none"
};

});

// file: lib/common/plugin/Contact.js
define("cordova/plugin/Contact", function(require, exports, module) {

var argscheck = require('cordova/argscheck'),
    exec = require('cordova/exec'),
    ContactError = require('cordova/plugin/ContactError'),
    utils = require('cordova/utils');

/**
* Converts primitives into Complex Object
* Currently only used for Date fields
*/
function convertIn(contact) {
    var value = contact.birthday;
    try {
      contact.birthday = new Date(parseFloat(value));
    } catch (exception){
      console.log("Cordova Contact convertIn error: exception creating date.");
    }
    return contact;
}

/**
* Converts Complex objects into primitives
* Only conversion at present is for Dates.
**/

function convertOut(contact) {
    var value = contact.birthday;
    if (value !== null) {
        // try to make it a Date object if it is not already
        if (!utils.isDate(value)){
            try {
                value = new Date(value);
            } catch(exception){
                value = null;
            }
        }
        if (utils.isDate(value)){
            value = value.valueOf(); // convert to milliseconds
        }
        contact.birthday = value;
    }
    return contact;
}

/**
* Contains information about a single contact.
* @constructor
* @param {DOMString} id unique identifier
* @param {DOMString} displayName
* @param {ContactName} name
* @param {DOMString} nickname
* @param {Array.<ContactField>} phoneNumbers array of phone numbers
* @param {Array.<ContactField>} emails array of email addresses
* @param {Array.<ContactAddress>} addresses array of addresses
* @param {Array.<ContactField>} ims instant messaging user ids
* @param {Array.<ContactOrganization>} organizations
* @param {DOMString} birthday contact's birthday
* @param {DOMString} note user notes about contact
* @param {Array.<ContactField>} photos
* @param {Array.<ContactField>} categories
* @param {Array.<ContactField>} urls contact's web sites
*/
var Contact = function (id, displayName, name, nickname, phoneNumbers, emails, addresses,
    ims, organizations, birthday, note, photos, categories, urls) {
    this.id = id || null;
    this.rawId = null;
    this.displayName = displayName || null;
    this.name = name || null; // ContactName
    this.nickname = nickname || null;
    this.phoneNumbers = phoneNumbers || null; // ContactField[]
    this.emails = emails || null; // ContactField[]
    this.addresses = addresses || null; // ContactAddress[]
    this.ims = ims || null; // ContactField[]
    this.organizations = organizations || null; // ContactOrganization[]
    this.birthday = birthday || null;
    this.note = note || null;
    this.photos = photos || null; // ContactField[]
    this.categories = categories || null; // ContactField[]
    this.urls = urls || null; // ContactField[]
};

/**
* Removes contact from device storage.
* @param successCB success callback
* @param errorCB error callback
*/
Contact.prototype.remove = function(successCB, errorCB) {
    argscheck.checkArgs('FF', 'Contact.remove', arguments);
    var fail = errorCB && function(code) {
        errorCB(new ContactError(code));
    };
    if (this.id === null) {
        fail(ContactError.UNKNOWN_ERROR);
    }
    else {
        exec(successCB, fail, "Contacts", "remove", [this.id]);
    }
};

/**
* Creates a deep copy of this Contact.
* With the contact ID set to null.
* @return copy of this Contact
*/
Contact.prototype.clone = function() {
    var clonedContact = utils.clone(this);
    clonedContact.id = null;
    clonedContact.rawId = null;

    function nullIds(arr) {
        if (arr) {
            for (var i = 0; i < arr.length; ++i) {
                arr[i].id = null;
            }
        }
    }

    // Loop through and clear out any id's in phones, emails, etc.
    nullIds(clonedContact.phoneNumbers);
    nullIds(clonedContact.emails);
    nullIds(clonedContact.addresses);
    nullIds(clonedContact.ims);
    nullIds(clonedContact.organizations);
    nullIds(clonedContact.categories);
    nullIds(clonedContact.photos);
    nullIds(clonedContact.urls);
    return clonedContact;
};

/**
* Persists contact to device storage.
* @param successCB success callback
* @param errorCB error callback
*/
Contact.prototype.save = function(successCB, errorCB) {
    argscheck.checkArgs('FFO', 'Contact.save', arguments);
    var fail = errorCB && function(code) {
        errorCB(new ContactError(code));
    };
    var success = function(result) {
        if (result) {
            if (successCB) {
                var fullContact = require('cordova/plugin/contacts').create(result);
                successCB(convertIn(fullContact));
            }
        }
        else {
            // no Entry object returned
            fail(ContactError.UNKNOWN_ERROR);
        }
    };
    var dupContact = convertOut(utils.clone(this));
    exec(success, fail, "Contacts", "save", [dupContact]);
};


module.exports = Contact;

});

// file: lib/common/plugin/ContactAddress.js
define("cordova/plugin/ContactAddress", function(require, exports, module) {

/**
* Contact address.
* @constructor
* @param {DOMString} id unique identifier, should only be set by native code
* @param formatted // NOTE: not a W3C standard
* @param streetAddress
* @param locality
* @param region
* @param postalCode
* @param country
*/

var ContactAddress = function(pref, type, formatted, streetAddress, locality, region, postalCode, country) {
    this.id = null;
    this.pref = (typeof pref != 'undefined' ? pref : false);
    this.type = type || null;
    this.formatted = formatted || null;
    this.streetAddress = streetAddress || null;
    this.locality = locality || null;
    this.region = region || null;
    this.postalCode = postalCode || null;
    this.country = country || null;
};

module.exports = ContactAddress;

});

// file: lib/common/plugin/ContactError.js
define("cordova/plugin/ContactError", function(require, exports, module) {

/**
 *  ContactError.
 *  An error code assigned by an implementation when an error has occurred
 * @constructor
 */
var ContactError = function(err) {
    this.code = (typeof err != 'undefined' ? err : null);
};

/**
 * Error codes
 */
ContactError.UNKNOWN_ERROR = 0;
ContactError.INVALID_ARGUMENT_ERROR = 1;
ContactError.TIMEOUT_ERROR = 2;
ContactError.PENDING_OPERATION_ERROR = 3;
ContactError.IO_ERROR = 4;
ContactError.NOT_SUPPORTED_ERROR = 5;
ContactError.PERMISSION_DENIED_ERROR = 20;

module.exports = ContactError;

});

// file: lib/common/plugin/ContactField.js
define("cordova/plugin/ContactField", function(require, exports, module) {

/**
* Generic contact field.
* @constructor
* @param {DOMString} id unique identifier, should only be set by native code // NOTE: not a W3C standard
* @param type
* @param value
* @param pref
*/
var ContactField = function(type, value, pref) {
    this.id = null;
    this.type = (type && type.toString()) || null;
    this.value = (value && value.toString()) || null;
    this.pref = (typeof pref != 'undefined' ? pref : false);
};

module.exports = ContactField;

});

// file: lib/common/plugin/ContactFindOptions.js
define("cordova/plugin/ContactFindOptions", function(require, exports, module) {

/**
 * ContactFindOptions.
 * @constructor
 * @param filter used to match contacts against
 * @param multiple boolean used to determine if more than one contact should be returned
 */

var ContactFindOptions = function(filter, multiple) {
    this.filter = filter || '';
    this.multiple = (typeof multiple != 'undefined' ? multiple : false);
};

module.exports = ContactFindOptions;

});

// file: lib/common/plugin/ContactName.js
define("cordova/plugin/ContactName", function(require, exports, module) {

/**
* Contact name.
* @constructor
* @param formatted // NOTE: not part of W3C standard
* @param familyName
* @param givenName
* @param middle
* @param prefix
* @param suffix
*/
var ContactName = function(formatted, familyName, givenName, middle, prefix, suffix) {
    this.formatted = formatted || null;
    this.familyName = familyName || null;
    this.givenName = givenName || null;
    this.middleName = middle || null;
    this.honorificPrefix = prefix || null;
    this.honorificSuffix = suffix || null;
};

module.exports = ContactName;

});

// file: lib/common/plugin/ContactOrganization.js
define("cordova/plugin/ContactOrganization", function(require, exports, module) {

/**
* Contact organization.
* @constructor
* @param {DOMString} id unique identifier, should only be set by native code // NOTE: not a W3C standard
* @param name
* @param dept
* @param title
* @param startDate
* @param endDate
* @param location
* @param desc
*/

var ContactOrganization = function(pref, type, name, dept, title) {
    this.id = null;
    this.pref = (typeof pref != 'undefined' ? pref : false);
    this.type = type || null;
    this.name = name || null;
    this.department = dept || null;
    this.title = title || null;
};

module.exports = ContactOrganization;

});

// file: lib/common/plugin/Coordinates.js
define("cordova/plugin/Coordinates", function(require, exports, module) {

/**
 * This class contains position information.
 * @param {Object} lat
 * @param {Object} lng
 * @param {Object} alt
 * @param {Object} acc
 * @param {Object} head
 * @param {Object} vel
 * @param {Object} altacc
 * @constructor
 */
var Coordinates = function(lat, lng, alt, acc, head, vel, altacc) {
    /**
     * The latitude of the position.
     */
    this.latitude = lat;
    /**
     * The longitude of the position,
     */
    this.longitude = lng;
    /**
     * The accuracy of the position.
     */
    this.accuracy = acc;
    /**
     * The altitude of the position.
     */
    this.altitude = (alt !== undefined ? alt : null);
    /**
     * The direction the device is moving at the position.
     */
    this.heading = (head !== undefined ? head : null);
    /**
     * The velocity with which the device is moving at the position.
     */
    this.speed = (vel !== undefined ? vel : null);

    if (this.speed === 0 || this.speed === null) {
        this.heading = NaN;
    }

    /**
     * The altitude accuracy of the position.
     */
    this.altitudeAccuracy = (altacc !== undefined) ? altacc : null;
};

module.exports = Coordinates;

});

// file: lib/common/plugin/DirectoryEntry.js
define("cordova/plugin/DirectoryEntry", function(require, exports, module) {

var argscheck = require('cordova/argscheck'),
    utils = require('cordova/utils'),
    exec = require('cordova/exec'),
    Entry = require('cordova/plugin/Entry'),
    FileError = require('cordova/plugin/FileError'),
    DirectoryReader = require('cordova/plugin/DirectoryReader');

/**
 * An interface representing a directory on the file system.
 *
 * {boolean} isFile always false (readonly)
 * {boolean} isDirectory always true (readonly)
 * {DOMString} name of the directory, excluding the path leading to it (readonly)
 * {DOMString} fullPath the absolute full path to the directory (readonly)
 * TODO: implement this!!! {FileSystem} filesystem on which the directory resides (readonly)
 */
var DirectoryEntry = function(name, fullPath) {
     DirectoryEntry.__super__.constructor.call(this, false, true, name, fullPath);
};

utils.extend(DirectoryEntry, Entry);

/**
 * Creates a new DirectoryReader to read entries from this directory
 */
DirectoryEntry.prototype.createReader = function() {
    return new DirectoryReader(this.fullPath);
};

/**
 * Creates or looks up a directory
 *
 * @param {DOMString} path either a relative or absolute path from this directory in which to look up or create a directory
 * @param {Flags} options to create or exclusively create the directory
 * @param {Function} successCallback is called with the new entry
 * @param {Function} errorCallback is called with a FileError
 */
DirectoryEntry.prototype.getDirectory = function(path, options, successCallback, errorCallback) {
    argscheck.checkArgs('sOFF', 'DirectoryEntry.getDirectory', arguments);
    var win = successCallback && function(result) {
        var entry = new DirectoryEntry(result.name, result.fullPath);
        successCallback(entry);
    };
    var fail = errorCallback && function(code) {
        errorCallback(new FileError(code));
    };
    exec(win, fail, "File", "getDirectory", [this.fullPath, path, options]);
};

/**
 * Deletes a directory and all of it's contents
 *
 * @param {Function} successCallback is called with no parameters
 * @param {Function} errorCallback is called with a FileError
 */
DirectoryEntry.prototype.removeRecursively = function(successCallback, errorCallback) {
    argscheck.checkArgs('FF', 'DirectoryEntry.removeRecursively', arguments);
    var fail = errorCallback && function(code) {
        errorCallback(new FileError(code));
    };
    exec(successCallback, fail, "File", "removeRecursively", [this.fullPath]);
};

/**
 * Creates or looks up a file
 *
 * @param {DOMString} path either a relative or absolute path from this directory in which to look up or create a file
 * @param {Flags} options to create or exclusively create the file
 * @param {Function} successCallback is called with the new entry
 * @param {Function} errorCallback is called with a FileError
 */
DirectoryEntry.prototype.getFile = function(path, options, successCallback, errorCallback) {
    argscheck.checkArgs('sOFF', 'DirectoryEntry.getFile', arguments);
    var win = successCallback && function(result) {
        var FileEntry = require('cordova/plugin/FileEntry');
        var entry = new FileEntry(result.name, result.fullPath);
        successCallback(entry);
    };
    var fail = errorCallback && function(code) {
        errorCallback(new FileError(code));
    };
    exec(win, fail, "File", "getFile", [this.fullPath, path, options]);
};

module.exports = DirectoryEntry;

});

// file: lib/common/plugin/DirectoryReader.js
define("cordova/plugin/DirectoryReader", function(require, exports, module) {

var exec = require('cordova/exec'),
    FileError = require('cordova/plugin/FileError') ;

/**
 * An interface that lists the files and directories in a directory.
 */
function DirectoryReader(path) {
    this.path = path || null;
}

/**
 * Returns a list of entries from a directory.
 *
 * @param {Function} successCallback is called with a list of entries
 * @param {Function} errorCallback is called with a FileError
 */
DirectoryReader.prototype.readEntries = function(successCallback, errorCallback) {
    var win = typeof successCallback !== 'function' ? null : function(result) {
        var retVal = [];
        for (var i=0; i<result.length; i++) {
            var entry = null;
            if (result[i].isDirectory) {
                entry = new (require('cordova/plugin/DirectoryEntry'))();
            }
            else if (result[i].isFile) {
                entry = new (require('cordova/plugin/FileEntry'))();
            }
            entry.isDirectory = result[i].isDirectory;
            entry.isFile = result[i].isFile;
            entry.name = result[i].name;
            entry.fullPath = result[i].fullPath;
            retVal.push(entry);
        }
        successCallback(retVal);
    };
    var fail = typeof errorCallback !== 'function' ? null : function(code) {
        errorCallback(new FileError(code));
    };
    exec(win, fail, "File", "readEntries", [this.path]);
};

module.exports = DirectoryReader;

});

// file: lib/common/plugin/Entry.js
define("cordova/plugin/Entry", function(require, exports, module) {

var argscheck = require('cordova/argscheck'),
    exec = require('cordova/exec'),
    FileError = require('cordova/plugin/FileError'),
    Metadata = require('cordova/plugin/Metadata');

/**
 * Represents a file or directory on the local file system.
 *
 * @param isFile
 *            {boolean} true if Entry is a file (readonly)
 * @param isDirectory
 *            {boolean} true if Entry is a directory (readonly)
 * @param name
 *            {DOMString} name of the file or directory, excluding the path
 *            leading to it (readonly)
 * @param fullPath
 *            {DOMString} the absolute full path to the file or directory
 *            (readonly)
 */
function Entry(isFile, isDirectory, name, fullPath, fileSystem) {
    this.isFile = !!isFile;
    this.isDirectory = !!isDirectory;
    this.name = name || '';
    this.fullPath = fullPath || '';
    this.filesystem = fileSystem || null;
}

/**
 * Look up the metadata of the entry.
 *
 * @param successCallback
 *            {Function} is called with a Metadata object
 * @param errorCallback
 *            {Function} is called with a FileError
 */
Entry.prototype.getMetadata = function(successCallback, errorCallback) {
    argscheck.checkArgs('FF', 'Entry.getMetadata', arguments);
    var success = successCallback && function(lastModified) {
        var metadata = new Metadata(lastModified);
        successCallback(metadata);
    };
    var fail = errorCallback && function(code) {
        errorCallback(new FileError(code));
    };

    exec(success, fail, "File", "getMetadata", [this.fullPath]);
};

/**
 * Set the metadata of the entry.
 *
 * @param successCallback
 *            {Function} is called with a Metadata object
 * @param errorCallback
 *            {Function} is called with a FileError
 * @param metadataObject
 *            {Object} keys and values to set
 */
Entry.prototype.setMetadata = function(successCallback, errorCallback, metadataObject) {
    argscheck.checkArgs('FFO', 'Entry.setMetadata', arguments);
    exec(successCallback, errorCallback, "File", "setMetadata", [this.fullPath, metadataObject]);
};

/**
 * Move a file or directory to a new location.
 *
 * @param parent
 *            {DirectoryEntry} the directory to which to move this entry
 * @param newName
 *            {DOMString} new name of the entry, defaults to the current name
 * @param successCallback
 *            {Function} called with the new DirectoryEntry object
 * @param errorCallback
 *            {Function} called with a FileError
 */
Entry.prototype.moveTo = function(parent, newName, successCallback, errorCallback) {
    argscheck.checkArgs('oSFF', 'Entry.moveTo', arguments);
    var fail = errorCallback && function(code) {
        errorCallback(new FileError(code));
    };
    // source path
    var srcPath = this.fullPath,
        // entry name
        name = newName || this.name,
        success = function(entry) {
            if (entry) {
                if (successCallback) {
                    // create appropriate Entry object
                    var result = (entry.isDirectory) ? new (require('cordova/plugin/DirectoryEntry'))(entry.name, entry.fullPath) : new (require('cordova/plugin/FileEntry'))(entry.name, entry.fullPath);
                    successCallback(result);
                }
            }
            else {
                // no Entry object returned
                fail && fail(FileError.NOT_FOUND_ERR);
            }
        };

    // copy
    exec(success, fail, "File", "moveTo", [srcPath, parent.fullPath, name]);
};

/**
 * Copy a directory to a different location.
 *
 * @param parent
 *            {DirectoryEntry} the directory to which to copy the entry
 * @param newName
 *            {DOMString} new name of the entry, defaults to the current name
 * @param successCallback
 *            {Function} called with the new Entry object
 * @param errorCallback
 *            {Function} called with a FileError
 */
Entry.prototype.copyTo = function(parent, newName, successCallback, errorCallback) {
    argscheck.checkArgs('oSFF', 'Entry.copyTo', arguments);
    var fail = errorCallback && function(code) {
        errorCallback(new FileError(code));
    };

        // source path
    var srcPath = this.fullPath,
        // entry name
        name = newName || this.name,
        // success callback
        success = function(entry) {
            if (entry) {
                if (successCallback) {
                    // create appropriate Entry object
                    var result = (entry.isDirectory) ? new (require('cordova/plugin/DirectoryEntry'))(entry.name, entry.fullPath) : new (require('cordova/plugin/FileEntry'))(entry.name, entry.fullPath);
                    successCallback(result);
                }
            }
            else {
                // no Entry object returned
                fail && fail(FileError.NOT_FOUND_ERR);
            }
        };

    // copy
    exec(success, fail, "File", "copyTo", [srcPath, parent.fullPath, name]);
};

/**
 * Return a URL that can be used to identify this entry.
 */
Entry.prototype.toURL = function() {
    // fullPath attribute contains the full URL
    return this.fullPath;
};

/**
 * Returns a URI that can be used to identify this entry.
 *
 * @param {DOMString} mimeType for a FileEntry, the mime type to be used to interpret the file, when loaded through this URI.
 * @return uri
 */
Entry.prototype.toURI = function(mimeType) {
    console.log("DEPRECATED: Update your code to use 'toURL'");
    // fullPath attribute contains the full URI
    return this.toURL();
};

/**
 * Remove a file or directory. It is an error to attempt to delete a
 * directory that is not empty. It is an error to attempt to delete a
 * root directory of a file system.
 *
 * @param successCallback {Function} called with no parameters
 * @param errorCallback {Function} called with a FileError
 */
Entry.prototype.remove = function(successCallback, errorCallback) {
    argscheck.checkArgs('FF', 'Entry.remove', arguments);
    var fail = errorCallback && function(code) {
        errorCallback(new FileError(code));
    };
    exec(successCallback, fail, "File", "remove", [this.fullPath]);
};

/**
 * Look up the parent DirectoryEntry of this entry.
 *
 * @param successCallback {Function} called with the parent DirectoryEntry object
 * @param errorCallback {Function} called with a FileError
 */
Entry.prototype.getParent = function(successCallback, errorCallback) {
    argscheck.checkArgs('FF', 'Entry.getParent', arguments);
    var win = successCallback && function(result) {
        var DirectoryEntry = require('cordova/plugin/DirectoryEntry');
        var entry = new DirectoryEntry(result.name, result.fullPath);
        successCallback(entry);
    };
    var fail = errorCallback && function(code) {
        errorCallback(new FileError(code));
    };
    exec(win, fail, "File", "getParent", [this.fullPath]);
};

module.exports = Entry;

});

// file: lib/common/plugin/File.js
define("cordova/plugin/File", function(require, exports, module) {

/**
 * Constructor.
 * name {DOMString} name of the file, without path information
 * fullPath {DOMString} the full path of the file, including the name
 * type {DOMString} mime type
 * lastModifiedDate {Date} last modified date
 * size {Number} size of the file in bytes
 */

var File = function(name, fullPath, type, lastModifiedDate, size){
    this.name = name || '';
    this.fullPath = fullPath || null;
    this.type = type || null;
    this.lastModifiedDate = lastModifiedDate || null;
    this.size = size || 0;

    // These store the absolute start and end for slicing the file.
    this.start = 0;
    this.end = this.size;
};

/**
 * Returns a "slice" of the file. Since Cordova Files don't contain the actual
 * content, this really returns a File with adjusted start and end.
 * Slices of slices are supported.
 * start {Number} The index at which to start the slice (inclusive).
 * end {Number} The index at which to end the slice (exclusive).
 */
File.prototype.slice = function(start, end) {
    var size = this.end - this.start;
    var newStart = 0;
    var newEnd = size;
    if (arguments.length) {
        if (start < 0) {
            newStart = Math.max(size + start, 0);
        } else {
            newStart = Math.min(size, start);
        }
    }

    if (arguments.length >= 2) {
        if (end < 0) {
            newEnd = Math.max(size + end, 0);
        } else {
            newEnd = Math.min(end, size);
        }
    }

    var newFile = new File(this.name, this.fullPath, this.type, this.lastModifiedData, this.size);
    newFile.start = this.start + newStart;
    newFile.end = this.start + newEnd;
    return newFile;
};


module.exports = File;

});

// file: lib/common/plugin/FileEntry.js
define("cordova/plugin/FileEntry", function(require, exports, module) {

var utils = require('cordova/utils'),
    exec = require('cordova/exec'),
    Entry = require('cordova/plugin/Entry'),
    FileWriter = require('cordova/plugin/FileWriter'),
    File = require('cordova/plugin/File'),
    FileError = require('cordova/plugin/FileError');

/**
 * An interface representing a file on the file system.
 *
 * {boolean} isFile always true (readonly)
 * {boolean} isDirectory always false (readonly)
 * {DOMString} name of the file, excluding the path leading to it (readonly)
 * {DOMString} fullPath the absolute full path to the file (readonly)
 * {FileSystem} filesystem on which the file resides (readonly)
 */
var FileEntry = function(name, fullPath) {
     FileEntry.__super__.constructor.apply(this, [true, false, name, fullPath]);
};

utils.extend(FileEntry, Entry);

/**
 * Creates a new FileWriter associated with the file that this FileEntry represents.
 *
 * @param {Function} successCallback is called with the new FileWriter
 * @param {Function} errorCallback is called with a FileError
 */
FileEntry.prototype.createWriter = function(successCallback, errorCallback) {
    this.file(function(filePointer) {
        var writer = new FileWriter(filePointer);

        if (writer.fileName === null || writer.fileName === "") {
            errorCallback && errorCallback(new FileError(FileError.INVALID_STATE_ERR));
        } else {
            successCallback && successCallback(writer);
        }
    }, errorCallback);
};

/**
 * Returns a File that represents the current state of the file that this FileEntry represents.
 *
 * @param {Function} successCallback is called with the new File object
 * @param {Function} errorCallback is called with a FileError
 */
FileEntry.prototype.file = function(successCallback, errorCallback) {
    var win = successCallback && function(f) {
        var file = new File(f.name, f.fullPath, f.type, f.lastModifiedDate, f.size);
        successCallback(file);
    };
    var fail = errorCallback && function(code) {
        errorCallback(new FileError(code));
    };
    exec(win, fail, "File", "getFileMetadata", [this.fullPath]);
};


module.exports = FileEntry;

});

// file: lib/common/plugin/FileError.js
define("cordova/plugin/FileError", function(require, exports, module) {

/**
 * FileError
 */
function FileError(error) {
  this.code = error || null;
}

// File error codes
// Found in DOMException
FileError.NOT_FOUND_ERR = 1;
FileError.SECURITY_ERR = 2;
FileError.ABORT_ERR = 3;

// Added by File API specification
FileError.NOT_READABLE_ERR = 4;
FileError.ENCODING_ERR = 5;
FileError.NO_MODIFICATION_ALLOWED_ERR = 6;
FileError.INVALID_STATE_ERR = 7;
FileError.SYNTAX_ERR = 8;
FileError.INVALID_MODIFICATION_ERR = 9;
FileError.QUOTA_EXCEEDED_ERR = 10;
FileError.TYPE_MISMATCH_ERR = 11;
FileError.PATH_EXISTS_ERR = 12;

module.exports = FileError;

});

// file: lib/common/plugin/FileReader.js
define("cordova/plugin/FileReader", function(require, exports, module) {

var exec = require('cordova/exec'),
    modulemapper = require('cordova/modulemapper'),
    utils = require('cordova/utils'),
    File = require('cordova/plugin/File'),
    FileError = require('cordova/plugin/FileError'),
    ProgressEvent = require('cordova/plugin/ProgressEvent'),
    origFileReader = modulemapper.getOriginalSymbol(this, 'FileReader');

/**
 * This class reads the mobile device file system.
 *
 * For Android:
 *      The root directory is the root of the file system.
 *      To read from the SD card, the file name is "sdcard/my_file.txt"
 * @constructor
 */
var FileReader = function() {
    this._readyState = 0;
    this._error = null;
    this._result = null;
    this._fileName = '';
    this._realReader = origFileReader ? new origFileReader() : {};
};

// States
FileReader.EMPTY = 0;
FileReader.LOADING = 1;
FileReader.DONE = 2;

utils.defineGetter(FileReader.prototype, 'readyState', function() {
    return this._fileName ? this._readyState : this._realReader.readyState;
});

utils.defineGetter(FileReader.prototype, 'error', function() {
    return this._fileName ? this._error: this._realReader.error;
});

utils.defineGetter(FileReader.prototype, 'result', function() {
    return this._fileName ? this._result: this._realReader.result;
});

function defineEvent(eventName) {
    utils.defineGetterSetter(FileReader.prototype, eventName, function() {
        return this._realReader[eventName] || null;
    }, function(value) {
        this._realReader[eventName] = value;
    });
}
defineEvent('onloadstart');    // When the read starts.
defineEvent('onprogress');     // While reading (and decoding) file or fileBlob data, and reporting partial file data (progress.loaded/progress.total)
defineEvent('onload');         // When the read has successfully completed.
defineEvent('onerror');        // When the read has failed (see errors).
defineEvent('onloadend');      // When the request has completed (either in success or failure).
defineEvent('onabort');        // When the read has been aborted. For instance, by invoking the abort() method.

function initRead(reader, file) {
    // Already loading something
    if (reader.readyState == FileReader.LOADING) {
      throw new FileError(FileError.INVALID_STATE_ERR);
    }

    reader._result = null;
    reader._error = null;
    reader._readyState = FileReader.LOADING;

    if (typeof file == 'string') {
        // Deprecated in Cordova 2.4.
        console.warning('Using a string argument with FileReader.readAs functions is deprecated.');
        reader._fileName = file;
    } else if (typeof file.fullPath == 'string') {
        reader._fileName = file.fullPath;
    } else {
        reader._fileName = '';
        return true;
    }

    reader.onloadstart && reader.onloadstart(new ProgressEvent("loadstart", {target:reader}));
}

/**
 * Abort reading file.
 */
FileReader.prototype.abort = function() {
    if (origFileReader && !this._fileName) {
        return this._realReader.abort();
    }
    this._result = null;

    if (this._readyState == FileReader.DONE || this._readyState == FileReader.EMPTY) {
      return;
    }

    this._readyState = FileReader.DONE;

    // If abort callback
    if (typeof this.onabort === 'function') {
        this.onabort(new ProgressEvent('abort', {target:this}));
    }
    // If load end callback
    if (typeof this.onloadend === 'function') {
        this.onloadend(new ProgressEvent('loadend', {target:this}));
    }
};

/**
 * Read text file.
 *
 * @param file          {File} File object containing file properties
 * @param encoding      [Optional] (see http://www.iana.org/assignments/character-sets)
 */
FileReader.prototype.readAsText = function(file, encoding) {
    if (initRead(this, file)) {
        return this._realReader.readAsText(file, encoding);
    }

    // Default encoding is UTF-8
    var enc = encoding ? encoding : "UTF-8";
    var me = this;
    var execArgs = [this._fileName, enc];

    // Maybe add slice parameters.
    if (file.end < file.size) {
        execArgs.push(file.start, file.end);
    } else if (file.start > 0) {
        execArgs.push(file.start);
    }

    // Read file
    exec(
        // Success callback
        function(r) {
            // If DONE (cancelled), then don't do anything
            if (me._readyState === FileReader.DONE) {
                return;
            }

            // Save result
            me._result = r;

            // If onload callback
            if (typeof me.onload === "function") {
                me.onload(new ProgressEvent("load", {target:me}));
            }

            // DONE state
            me._readyState = FileReader.DONE;

            // If onloadend callback
            if (typeof me.onloadend === "function") {
                me.onloadend(new ProgressEvent("loadend", {target:me}));
            }
        },
        // Error callback
        function(e) {
            // If DONE (cancelled), then don't do anything
            if (me._readyState === FileReader.DONE) {
                return;
            }

            // DONE state
            me._readyState = FileReader.DONE;

            // null result
            me._result = null;

            // Save error
            me._error = new FileError(e);

            // If onerror callback
            if (typeof me.onerror === "function") {
                me.onerror(new ProgressEvent("error", {target:me}));
            }

            // If onloadend callback
            if (typeof me.onloadend === "function") {
                me.onloadend(new ProgressEvent("loadend", {target:me}));
            }
        }, "File", "readAsText", execArgs);
};


/**
 * Read file and return data as a base64 encoded data url.
 * A data url is of the form:
 *      data:[<mediatype>][;base64],<data>
 *
 * @param file          {File} File object containing file properties
 */
FileReader.prototype.readAsDataURL = function(file) {
    if (initRead(this, file)) {
        return this._realReader.readAsDataURL(file);
    }

    var me = this;
    var execArgs = [this._fileName];

    // Maybe add slice parameters.
    if (file.end < file.size) {
        execArgs.push(file.start, file.end);
    } else if (file.start > 0) {
        execArgs.push(file.start);
    }

    // Read file
    exec(
        // Success callback
        function(r) {
            // If DONE (cancelled), then don't do anything
            if (me._readyState === FileReader.DONE) {
                return;
            }

            // DONE state
            me._readyState = FileReader.DONE;

            // Save result
            me._result = r;

            // If onload callback
            if (typeof me.onload === "function") {
                me.onload(new ProgressEvent("load", {target:me}));
            }

            // If onloadend callback
            if (typeof me.onloadend === "function") {
                me.onloadend(new ProgressEvent("loadend", {target:me}));
            }
        },
        // Error callback
        function(e) {
            // If DONE (cancelled), then don't do anything
            if (me._readyState === FileReader.DONE) {
                return;
            }

            // DONE state
            me._readyState = FileReader.DONE;

            me._result = null;

            // Save error
            me._error = new FileError(e);

            // If onerror callback
            if (typeof me.onerror === "function") {
                me.onerror(new ProgressEvent("error", {target:me}));
            }

            // If onloadend callback
            if (typeof me.onloadend === "function") {
                me.onloadend(new ProgressEvent("loadend", {target:me}));
            }
        }, "File", "readAsDataURL", execArgs);
};

/**
 * Read file and return data as a binary data.
 *
 * @param file          {File} File object containing file properties
 */
FileReader.prototype.readAsBinaryString = function(file) {
    if (initRead(this, file)) {
        return this._realReader.readAsBinaryString(file);
    }
    // TODO - Can't return binary data to browser.
    console.log('method "readAsBinaryString" is not supported at this time.');
    this.abort();
};

/**
 * Read file and return data as a binary data.
 *
 * @param file          {File} File object containing file properties
 */
FileReader.prototype.readAsArrayBuffer = function(file) {
    if (initRead(this, file)) {
        return this._realReader.readAsArrayBuffer(file);
    }
    // TODO - Can't return binary data to browser.
    console.log('This method is not supported at this time.');
    this.abort();
};

module.exports = FileReader;

});

// file: lib/common/plugin/FileSystem.js
define("cordova/plugin/FileSystem", function(require, exports, module) {

var DirectoryEntry = require('cordova/plugin/DirectoryEntry');

/**
 * An interface representing a file system
 *
 * @constructor
 * {DOMString} name the unique name of the file system (readonly)
 * {DirectoryEntry} root directory of the file system (readonly)
 */
var FileSystem = function(name, root) {
    this.name = name || null;
    if (root) {
        this.root = new DirectoryEntry(root.name, root.fullPath);
    }
};

module.exports = FileSystem;

});

// file: lib/common/plugin/FileTransfer.js
define("cordova/plugin/FileTransfer", function(require, exports, module) {

var argscheck = require('cordova/argscheck'),
    exec = require('cordova/exec'),
    FileTransferError = require('cordova/plugin/FileTransferError'),
    ProgressEvent = require('cordova/plugin/ProgressEvent');

function newProgressEvent(result) {
    var pe = new ProgressEvent();
    pe.lengthComputable = result.lengthComputable;
    pe.loaded = result.loaded;
    pe.total = result.total;
    return pe;
}

var idCounter = 0;

/**
 * FileTransfer uploads a file to a remote server.
 * @constructor
 */
var FileTransfer = function() {
    this._id = ++idCounter;
    this.onprogress = null; // optional callback
};

/**
* Given an absolute file path, uploads a file on the device to a remote server
* using a multipart HTTP request.
* @param filePath {String}           Full path of the file on the device
* @param server {String}             URL of the server to receive the file
* @param successCallback (Function}  Callback to be invoked when upload has completed
* @param errorCallback {Function}    Callback to be invoked upon error
* @param options {FileUploadOptions} Optional parameters such as file name and mimetype
* @param trustAllHosts {Boolean} Optional trust all hosts (e.g. for self-signed certs), defaults to false
*/
FileTransfer.prototype.upload = function(filePath, server, successCallback, errorCallback, options, trustAllHosts) {
    argscheck.checkArgs('ssFFO*', 'FileTransfer.upload', arguments);
    // check for options
    var fileKey = null;
    var fileName = null;
    var mimeType = null;
    var params = null;
    var chunkedMode = true;
    var headers = null;
    if (options) {
        fileKey = options.fileKey;
        fileName = options.fileName;
        mimeType = options.mimeType;
        headers = options.headers;
        if (options.chunkedMode !== null || typeof options.chunkedMode != "undefined") {
            chunkedMode = options.chunkedMode;
        }
        if (options.params) {
            params = options.params;
        }
        else {
            params = {};
        }
    }

    var fail = errorCallback && function(e) {
        var error = new FileTransferError(e.code, e.source, e.target, e.http_status);
        errorCallback(error);
    };

    var self = this;
    var win = function(result) {
        if (typeof result.lengthComputable != "undefined") {
            if (self.onprogress) {
                self.onprogress(newProgressEvent(result));
            }
        } else {
            successCallback && successCallback(result);
        }
    };
    exec(win, fail, 'FileTransfer', 'upload', [filePath, server, fileKey, fileName, mimeType, params, trustAllHosts, chunkedMode, headers, this._id]);
};

/**
 * Downloads a file form a given URL and saves it to the specified directory.
 * @param source {String}          URL of the server to receive the file
 * @param target {String}         Full path of the file on the device
 * @param successCallback (Function}  Callback to be invoked when upload has completed
 * @param errorCallback {Function}    Callback to be invoked upon error
 * @param trustAllHosts {Boolean} Optional trust all hosts (e.g. for self-signed certs), defaults to false
 */
FileTransfer.prototype.download = function(source, target, successCallback, errorCallback, trustAllHosts) {
    argscheck.checkArgs('ssFF*', 'FileTransfer.download', arguments);
    var self = this;
    var win = function(result) {
        if (typeof result.lengthComputable != "undefined") {
            if (self.onprogress) {
                return self.onprogress(newProgressEvent(result));
            }
        } else if (successCallback) {
            var entry = null;
            if (result.isDirectory) {
                entry = new (require('cordova/plugin/DirectoryEntry'))();
            }
            else if (result.isFile) {
                entry = new (require('cordova/plugin/FileEntry'))();
            }
            entry.isDirectory = result.isDirectory;
            entry.isFile = result.isFile;
            entry.name = result.name;
            entry.fullPath = result.fullPath;
            successCallback(entry);
        }
    };

    var fail = errorCallback && function(e) {
        var error = new FileTransferError(e.code, e.source, e.target, e.http_status);
        errorCallback(error);
    };

    exec(win, fail, 'FileTransfer', 'download', [source, target, trustAllHosts, this._id]);
};

/**
 * Aborts the ongoing file transfer on this object
 * @param successCallback {Function}  Callback to be invoked upon success
 * @param errorCallback {Function}    Callback to be invoked upon error
 */
FileTransfer.prototype.abort = function(successCallback, errorCallback) {
    exec(successCallback, errorCallback, 'FileTransfer', 'abort', [this._id]);
};

module.exports = FileTransfer;

});

// file: lib/common/plugin/FileTransferError.js
define("cordova/plugin/FileTransferError", function(require, exports, module) {

/**
 * FileTransferError
 * @constructor
 */
var FileTransferError = function(code, source, target, status) {
    this.code = code || null;
    this.source = source || null;
    this.target = target || null;
    this.http_status = status || null;
};

FileTransferError.FILE_NOT_FOUND_ERR = 1;
FileTransferError.INVALID_URL_ERR = 2;
FileTransferError.CONNECTION_ERR = 3;
FileTransferError.ABORT_ERR = 4;

module.exports = FileTransferError;

});

// file: lib/common/plugin/FileUploadOptions.js
define("cordova/plugin/FileUploadOptions", function(require, exports, module) {

/**
 * Options to customize the HTTP request used to upload files.
 * @constructor
 * @param fileKey {String}   Name of file request parameter.
 * @param fileName {String}  Filename to be used by the server. Defaults to image.jpg.
 * @param mimeType {String}  Mimetype of the uploaded file. Defaults to image/jpeg.
 * @param params {Object}    Object with key: value params to send to the server.
 * @param headers {Object}   Keys are header names, values are header values. Multiple
 *                           headers of the same name are not supported.
 */
var FileUploadOptions = function(fileKey, fileName, mimeType, params, headers) {
    this.fileKey = fileKey || null;
    this.fileName = fileName || null;
    this.mimeType = mimeType || null;
    this.params = params || null;
    this.headers = headers || null;
};

module.exports = FileUploadOptions;

});

// file: lib/common/plugin/FileUploadResult.js
define("cordova/plugin/FileUploadResult", function(require, exports, module) {

/**
 * FileUploadResult
 * @constructor
 */
var FileUploadResult = function() {
    this.bytesSent = 0;
    this.responseCode = null;
    this.response = null;
};

module.exports = FileUploadResult;

});

// file: lib/common/plugin/FileWriter.js
define("cordova/plugin/FileWriter", function(require, exports, module) {

var exec = require('cordova/exec'),
    FileError = require('cordova/plugin/FileError'),
    ProgressEvent = require('cordova/plugin/ProgressEvent');

/**
 * This class writes to the mobile device file system.
 *
 * For Android:
 *      The root directory is the root of the file system.
 *      To write to the SD card, the file name is "sdcard/my_file.txt"
 *
 * @constructor
 * @param file {File} File object containing file properties
 * @param append if true write to the end of the file, otherwise overwrite the file
 */
var FileWriter = function(file) {
    this.fileName = "";
    this.length = 0;
    if (file) {
        this.fileName = file.fullPath || file;
        this.length = file.size || 0;
    }
    // default is to write at the beginning of the file
    this.position = 0;

    this.readyState = 0; // EMPTY

    this.result = null;

    // Error
    this.error = null;

    // Event handlers
    this.onwritestart = null;   // When writing starts
    this.onprogress = null;     // While writing the file, and reporting partial file data
    this.onwrite = null;        // When the write has successfully completed.
    this.onwriteend = null;     // When the request has completed (either in success or failure).
    this.onabort = null;        // When the write has been aborted. For instance, by invoking the abort() method.
    this.onerror = null;        // When the write has failed (see errors).
};

// States
FileWriter.INIT = 0;
FileWriter.WRITING = 1;
FileWriter.DONE = 2;

/**
 * Abort writing file.
 */
FileWriter.prototype.abort = function() {
    // check for invalid state
    if (this.readyState === FileWriter.DONE || this.readyState === FileWriter.INIT) {
        throw new FileError(FileError.INVALID_STATE_ERR);
    }

    // set error
    this.error = new FileError(FileError.ABORT_ERR);

    this.readyState = FileWriter.DONE;

    // If abort callback
    if (typeof this.onabort === "function") {
        this.onabort(new ProgressEvent("abort", {"target":this}));
    }

    // If write end callback
    if (typeof this.onwriteend === "function") {
        this.onwriteend(new ProgressEvent("writeend", {"target":this}));
    }
};

/**
 * Writes data to the file
 *
 * @param text to be written
 */
FileWriter.prototype.write = function(text) {
    // Throw an exception if we are already writing a file
    if (this.readyState === FileWriter.WRITING) {
        throw new FileError(FileError.INVALID_STATE_ERR);
    }

    // WRITING state
    this.readyState = FileWriter.WRITING;

    var me = this;

    // If onwritestart callback
    if (typeof me.onwritestart === "function") {
        me.onwritestart(new ProgressEvent("writestart", {"target":me}));
    }

    // Write file
    exec(
        // Success callback
        function(r) {
            // If DONE (cancelled), then don't do anything
            if (me.readyState === FileWriter.DONE) {
                return;
            }

            // position always increases by bytes written because file would be extended
            me.position += r;
            // The length of the file is now where we are done writing.

            me.length = me.position;

            // DONE state
            me.readyState = FileWriter.DONE;

            // If onwrite callback
            if (typeof me.onwrite === "function") {
                me.onwrite(new ProgressEvent("write", {"target":me}));
            }

            // If onwriteend callback
            if (typeof me.onwriteend === "function") {
                me.onwriteend(new ProgressEvent("writeend", {"target":me}));
            }
        },
        // Error callback
        function(e) {
            // If DONE (cancelled), then don't do anything
            if (me.readyState === FileWriter.DONE) {
                return;
            }

            // DONE state
            me.readyState = FileWriter.DONE;

            // Save error
            me.error = new FileError(e);

            // If onerror callback
            if (typeof me.onerror === "function") {
                me.onerror(new ProgressEvent("error", {"target":me}));
            }

            // If onwriteend callback
            if (typeof me.onwriteend === "function") {
                me.onwriteend(new ProgressEvent("writeend", {"target":me}));
            }
        }, "File", "write", [this.fileName, text, this.position]);
};

/**
 * Moves the file pointer to the location specified.
 *
 * If the offset is a negative number the position of the file
 * pointer is rewound.  If the offset is greater than the file
 * size the position is set to the end of the file.
 *
 * @param offset is the location to move the file pointer to.
 */
FileWriter.prototype.seek = function(offset) {
    // Throw an exception if we are already writing a file
    if (this.readyState === FileWriter.WRITING) {
        throw new FileError(FileError.INVALID_STATE_ERR);
    }

    if (!offset && offset !== 0) {
        return;
    }

    // See back from end of file.
    if (offset < 0) {
        this.position = Math.max(offset + this.length, 0);
    }
    // Offset is bigger than file size so set position
    // to the end of the file.
    else if (offset > this.length) {
        this.position = this.length;
    }
    // Offset is between 0 and file size so set the position
    // to start writing.
    else {
        this.position = offset;
    }
};

/**
 * Truncates the file to the size specified.
 *
 * @param size to chop the file at.
 */
FileWriter.prototype.truncate = function(size) {
    // Throw an exception if we are already writing a file
    if (this.readyState === FileWriter.WRITING) {
        throw new FileError(FileError.INVALID_STATE_ERR);
    }

    // WRITING state
    this.readyState = FileWriter.WRITING;

    var me = this;

    // If onwritestart callback
    if (typeof me.onwritestart === "function") {
        me.onwritestart(new ProgressEvent("writestart", {"target":this}));
    }

    // Write file
    exec(
        // Success callback
        function(r) {
            // If DONE (cancelled), then don't do anything
            if (me.readyState === FileWriter.DONE) {
                return;
            }

            // DONE state
            me.readyState = FileWriter.DONE;

            // Update the length of the file
            me.length = r;
            me.position = Math.min(me.position, r);

            // If onwrite callback
            if (typeof me.onwrite === "function") {
                me.onwrite(new ProgressEvent("write", {"target":me}));
            }

            // If onwriteend callback
            if (typeof me.onwriteend === "function") {
                me.onwriteend(new ProgressEvent("writeend", {"target":me}));
            }
        },
        // Error callback
        function(e) {
            // If DONE (cancelled), then don't do anything
            if (me.readyState === FileWriter.DONE) {
                return;
            }

            // DONE state
            me.readyState = FileWriter.DONE;

            // Save error
            me.error = new FileError(e);

            // If onerror callback
            if (typeof me.onerror === "function") {
                me.onerror(new ProgressEvent("error", {"target":me}));
            }

            // If onwriteend callback
            if (typeof me.onwriteend === "function") {
                me.onwriteend(new ProgressEvent("writeend", {"target":me}));
            }
        }, "File", "truncate", [this.fileName, size]);
};

module.exports = FileWriter;

});

// file: lib/common/plugin/Flags.js
define("cordova/plugin/Flags", function(require, exports, module) {

/**
 * Supplies arguments to methods that lookup or create files and directories.
 *
 * @param create
 *            {boolean} file or directory if it doesn't exist
 * @param exclusive
 *            {boolean} used with create; if true the command will fail if
 *            target path exists
 */
function Flags(create, exclusive) {
    this.create = create || false;
    this.exclusive = exclusive || false;
}

module.exports = Flags;

});

// file: lib/common/plugin/GlobalizationError.js
define("cordova/plugin/GlobalizationError", function(require, exports, module) {


/**
 * Globalization error object
 *
 * @constructor
 * @param code
 * @param message
 */
var GlobalizationError = function(code, message) {
    this.code = code || null;
    this.message = message || '';
};

// Globalization error codes
GlobalizationError.UNKNOWN_ERROR = 0;
GlobalizationError.FORMATTING_ERROR = 1;
GlobalizationError.PARSING_ERROR = 2;
GlobalizationError.PATTERN_ERROR = 3;

module.exports = GlobalizationError;

});

// file: lib/common/plugin/InAppBrowser.js
define("cordova/plugin/InAppBrowser", function(require, exports, module) {

var exec = require('cordova/exec');
var channel = require('cordova/channel');

function InAppBrowser() {
   this.channels = {
        'loadstart': channel.create('loadstart'),
        'loadstop' : channel.create('loadstop'),
        'exit' : channel.create('exit')
   };
}

InAppBrowser.prototype = {
    _eventHandler: function (event) {
        if (event.type in this.channels) {
            this.channels[event.type].fire(event);
        }
    },
    close: function (eventname) {
        exec(null, null, "InAppBrowser", "close", []);
    },
    addEventListener: function (eventname,f) {
        if (eventname in this.channels) {
            this.channels[eventname].subscribe(f);
        }
    },
    removeEventListener: function(eventname, f) {
        if (eventname in this.channels) {
            this.channels[eventname].unsubscribe(f);
        }
    }
};

module.exports = function(strUrl, strWindowName, strWindowFeatures) {
    var iab = new InAppBrowser();
    var cb = function(eventname) {
       iab._eventHandler(eventname);
    };
    exec(cb, null, "InAppBrowser", "open", [strUrl, strWindowName, strWindowFeatures]);
    return iab;
};

//Export the original open so it can be used if needed
module.exports._orig = window.open;

});

// file: lib/common/plugin/LocalFileSystem.js
define("cordova/plugin/LocalFileSystem", function(require, exports, module) {

var exec = require('cordova/exec');

/**
 * Represents a local file system.
 */
var LocalFileSystem = function() {

};

LocalFileSystem.TEMPORARY = 0; //temporary, with no guarantee of persistence
LocalFileSystem.PERSISTENT = 1; //persistent

module.exports = LocalFileSystem;

});

// file: lib/common/plugin/Media.js
define("cordova/plugin/Media", function(require, exports, module) {

var argscheck = require('cordova/argscheck'),
    utils = require('cordova/utils'),
    exec = require('cordova/exec');

var mediaObjects = {};

/**
 * This class provides access to the device media, interfaces to both sound and video
 *
 * @constructor
 * @param src                   The file name or url to play
 * @param successCallback       The callback to be called when the file is done playing or recording.
 *                                  successCallback()
 * @param errorCallback         The callback to be called if there is an error.
 *                                  errorCallback(int errorCode) - OPTIONAL
 * @param statusCallback        The callback to be called when media status has changed.
 *                                  statusCallback(int statusCode) - OPTIONAL
 */
var Media = function(src, successCallback, errorCallback, statusCallback) {
    argscheck.checkArgs('SFFF', 'Media', arguments);
    this.id = utils.createUUID();
    mediaObjects[this.id] = this;
    this.src = src;
    this.successCallback = successCallback;
    this.errorCallback = errorCallback;
    this.statusCallback = statusCallback;
    this._duration = -1;
    this._position = -1;
    exec(null, this.errorCallback, "Media", "create", [this.id, this.src]);
};

// Media messages
Media.MEDIA_STATE = 1;
Media.MEDIA_DURATION = 2;
Media.MEDIA_POSITION = 3;
Media.MEDIA_ERROR = 9;

// Media states
Media.MEDIA_NONE = 0;
Media.MEDIA_STARTING = 1;
Media.MEDIA_RUNNING = 2;
Media.MEDIA_PAUSED = 3;
Media.MEDIA_STOPPED = 4;
Media.MEDIA_MSG = ["None", "Starting", "Running", "Paused", "Stopped"];

// "static" function to return existing objs.
Media.get = function(id) {
    return mediaObjects[id];
};

/**
 * Start or resume playing audio file.
 */
Media.prototype.play = function(options) {
    exec(null, null, "Media", "startPlayingAudio", [this.id, this.src, options]);
};

/**
 * Stop playing audio file.
 */
Media.prototype.stop = function() {
    var me = this;
    exec(function() {
        me._position = 0;
    }, this.errorCallback, "Media", "stopPlayingAudio", [this.id]);
};

/**
 * Seek or jump to a new time in the track..
 */
Media.prototype.seekTo = function(milliseconds) {
    var me = this;
    exec(function(p) {
        me._position = p;
    }, this.errorCallback, "Media", "seekToAudio", [this.id, milliseconds]);
};

/**
 * Pause playing audio file.
 */
Media.prototype.pause = function() {
    exec(null, this.errorCallback, "Media", "pausePlayingAudio", [this.id]);
};

/**
 * Get duration of an audio file.
 * The duration is only set for audio that is playing, paused or stopped.
 *
 * @return      duration or -1 if not known.
 */
Media.prototype.getDuration = function() {
    return this._duration;
};

/**
 * Get position of audio.
 */
Media.prototype.getCurrentPosition = function(success, fail) {
    var me = this;
    exec(function(p) {
        me._position = p;
        success(p);
    }, fail, "Media", "getCurrentPositionAudio", [this.id]);
};

/**
 * Start recording audio file.
 */
Media.prototype.startRecord = function() {
    exec(null, this.errorCallback, "Media", "startRecordingAudio", [this.id, this.src]);
};

/**
 * Stop recording audio file.
 */
Media.prototype.stopRecord = function() {
    exec(null, this.errorCallback, "Media", "stopRecordingAudio", [this.id]);
};

/**
 * Release the resources.
 */
Media.prototype.release = function() {
    exec(null, this.errorCallback, "Media", "release", [this.id]);
};

/**
 * Adjust the volume.
 */
Media.prototype.setVolume = function(volume) {
    exec(null, null, "Media", "setVolume", [this.id, volume]);
};

/**
 * Audio has status update.
 * PRIVATE
 *
 * @param id            The media object id (string)
 * @param msgType       The 'type' of update this is
 * @param value         Use of value is determined by the msgType
 */
Media.onStatus = function(id, msgType, value) {

    var media = mediaObjects[id];

    if(media) {
        switch(msgType) {
            case Media.MEDIA_STATE :
                media.statusCallback && media.statusCallback(value);
                if(value == Media.MEDIA_STOPPED) {
                    media.successCallback && media.successCallback();
                }
                break;
            case Media.MEDIA_DURATION :
                media._duration = value;
                break;
            case Media.MEDIA_ERROR :
                media.errorCallback && media.errorCallback(value);
                break;
            case Media.MEDIA_POSITION :
                media._position = Number(value);
                break;
            default :
                console.error && console.error("Unhandled Media.onStatus :: " + msgType);
                break;
        }
    }
    else {
         console.error && console.error("Received Media.onStatus callback for unknown media :: " + id);
    }

};

module.exports = Media;

});

// file: lib/common/plugin/MediaError.js
define("cordova/plugin/MediaError", function(require, exports, module) {

/**
 * This class contains information about any Media errors.
*/
/*
 According to :: http://dev.w3.org/html5/spec-author-view/video.html#mediaerror
 We should never be creating these objects, we should just implement the interface
 which has 1 property for an instance, 'code'

 instead of doing :
    errorCallbackFunction( new MediaError(3,'msg') );
we should simply use a literal :
    errorCallbackFunction( {'code':3} );
 */

 var _MediaError = window.MediaError;


if(!_MediaError) {
    window.MediaError = _MediaError = function(code, msg) {
        this.code = (typeof code != 'undefined') ? code : null;
        this.message = msg || ""; // message is NON-standard! do not use!
    };
}

_MediaError.MEDIA_ERR_NONE_ACTIVE    = _MediaError.MEDIA_ERR_NONE_ACTIVE    || 0;
_MediaError.MEDIA_ERR_ABORTED        = _MediaError.MEDIA_ERR_ABORTED        || 1;
_MediaError.MEDIA_ERR_NETWORK        = _MediaError.MEDIA_ERR_NETWORK        || 2;
_MediaError.MEDIA_ERR_DECODE         = _MediaError.MEDIA_ERR_DECODE         || 3;
_MediaError.MEDIA_ERR_NONE_SUPPORTED = _MediaError.MEDIA_ERR_NONE_SUPPORTED || 4;
// TODO: MediaError.MEDIA_ERR_NONE_SUPPORTED is legacy, the W3 spec now defines it as below.
// as defined by http://dev.w3.org/html5/spec-author-view/video.html#error-codes
_MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED = _MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED || 4;

module.exports = _MediaError;

});

// file: lib/common/plugin/MediaFile.js
define("cordova/plugin/MediaFile", function(require, exports, module) {

var utils = require('cordova/utils'),
    exec = require('cordova/exec'),
    File = require('cordova/plugin/File'),
    CaptureError = require('cordova/plugin/CaptureError');
/**
 * Represents a single file.
 *
 * name {DOMString} name of the file, without path information
 * fullPath {DOMString} the full path of the file, including the name
 * type {DOMString} mime type
 * lastModifiedDate {Date} last modified date
 * size {Number} size of the file in bytes
 */
var MediaFile = function(name, fullPath, type, lastModifiedDate, size){
    MediaFile.__super__.constructor.apply(this, arguments);
};

utils.extend(MediaFile, File);

/**
 * Request capture format data for a specific file and type
 *
 * @param {Function} successCB
 * @param {Function} errorCB
 */
MediaFile.prototype.getFormatData = function(successCallback, errorCallback) {
    if (typeof this.fullPath === "undefined" || this.fullPath === null) {
        errorCallback(new CaptureError(CaptureError.CAPTURE_INVALID_ARGUMENT));
    } else {
        exec(successCallback, errorCallback, "Capture", "getFormatData", [this.fullPath, this.type]);
    }
};

module.exports = MediaFile;

});

// file: lib/common/plugin/MediaFileData.js
define("cordova/plugin/MediaFileData", function(require, exports, module) {

/**
 * MediaFileData encapsulates format information of a media file.
 *
 * @param {DOMString} codecs
 * @param {long} bitrate
 * @param {long} height
 * @param {long} width
 * @param {float} duration
 */
var MediaFileData = function(codecs, bitrate, height, width, duration){
    this.codecs = codecs || null;
    this.bitrate = bitrate || 0;
    this.height = height || 0;
    this.width = width || 0;
    this.duration = duration || 0;
};

module.exports = MediaFileData;

});

// file: lib/common/plugin/Metadata.js
define("cordova/plugin/Metadata", function(require, exports, module) {

/**
 * Information about the state of the file or directory
 *
 * {Date} modificationTime (readonly)
 */
var Metadata = function(time) {
    this.modificationTime = (typeof time != 'undefined'?new Date(time):null);
};

module.exports = Metadata;

});

// file: lib/common/plugin/Position.js
define("cordova/plugin/Position", function(require, exports, module) {

var Coordinates = require('cordova/plugin/Coordinates');

var Position = function(coords, timestamp) {
    if (coords) {
        this.coords = new Coordinates(coords.latitude, coords.longitude, coords.altitude, coords.accuracy, coords.heading, coords.velocity, coords.altitudeAccuracy);
    } else {
        this.coords = new Coordinates();
    }
    this.timestamp = (timestamp !== undefined) ? timestamp : new Date();
};

module.exports = Position;

});

// file: lib/common/plugin/PositionError.js
define("cordova/plugin/PositionError", function(require, exports, module) {

/**
 * Position error object
 *
 * @constructor
 * @param code
 * @param message
 */
var PositionError = function(code, message) {
    this.code = code || null;
    this.message = message || '';
};

PositionError.PERMISSION_DENIED = 1;
PositionError.POSITION_UNAVAILABLE = 2;
PositionError.TIMEOUT = 3;

module.exports = PositionError;

});

// file: lib/common/plugin/ProgressEvent.js
define("cordova/plugin/ProgressEvent", function(require, exports, module) {

// If ProgressEvent exists in global context, use it already, otherwise use our own polyfill
// Feature test: See if we can instantiate a native ProgressEvent;
// if so, use that approach,
// otherwise fill-in with our own implementation.
//
// NOTE: right now we always fill in with our own. Down the road would be nice if we can use whatever is native in the webview.
var ProgressEvent = (function() {
    /*
    var createEvent = function(data) {
        var event = document.createEvent('Events');
        event.initEvent('ProgressEvent', false, false);
        if (data) {
            for (var i in data) {
                if (data.hasOwnProperty(i)) {
                    event[i] = data[i];
                }
            }
            if (data.target) {
                // TODO: cannot call <some_custom_object>.dispatchEvent
                // need to first figure out how to implement EventTarget
            }
        }
        return event;
    };
    try {
        var ev = createEvent({type:"abort",target:document});
        return function ProgressEvent(type, data) {
            data.type = type;
            return createEvent(data);
        };
    } catch(e){
    */
        return function ProgressEvent(type, dict) {
            this.type = type;
            this.bubbles = false;
            this.cancelBubble = false;
            this.cancelable = false;
            this.lengthComputable = false;
            this.loaded = dict && dict.loaded ? dict.loaded : 0;
            this.total = dict && dict.total ? dict.total : 0;
            this.target = dict && dict.target ? dict.target : null;
        };
    //}
})();

module.exports = ProgressEvent;

});

// file: lib/common/plugin/accelerometer.js
define("cordova/plugin/accelerometer", function(require, exports, module) {

/**
 * This class provides access to device accelerometer data.
 * @constructor
 */
var argscheck = require('cordova/argscheck'),
    utils = require("cordova/utils"),
    exec = require("cordova/exec"),
    Acceleration = require('cordova/plugin/Acceleration');

// Is the accel sensor running?
var running = false;

// Keeps reference to watchAcceleration calls.
var timers = {};

// Array of listeners; used to keep track of when we should call start and stop.
var listeners = [];

// Last returned acceleration object from native
var accel = null;

// Tells native to start.
function start() {
    exec(function(a) {
        var tempListeners = listeners.slice(0);
        accel = new Acceleration(a.x, a.y, a.z, a.timestamp);
        for (var i = 0, l = tempListeners.length; i < l; i++) {
            tempListeners[i].win(accel);
        }
    }, function(e) {
        var tempListeners = listeners.slice(0);
        for (var i = 0, l = tempListeners.length; i < l; i++) {
            tempListeners[i].fail(e);
        }
    }, "Accelerometer", "start", []);
    running = true;
}

// Tells native to stop.
function stop() {
    exec(null, null, "Accelerometer", "stop", []);
    running = false;
}

// Adds a callback pair to the listeners array
function createCallbackPair(win, fail) {
    return {win:win, fail:fail};
}

// Removes a win/fail listener pair from the listeners array
function removeListeners(l) {
    var idx = listeners.indexOf(l);
    if (idx > -1) {
        listeners.splice(idx, 1);
        if (listeners.length === 0) {
            stop();
        }
    }
}

var accelerometer = {
    /**
     * Asynchronously acquires the current acceleration.
     *
     * @param {Function} successCallback    The function to call when the acceleration data is available
     * @param {Function} errorCallback      The function to call when there is an error getting the acceleration data. (OPTIONAL)
     * @param {AccelerationOptions} options The options for getting the accelerometer data such as timeout. (OPTIONAL)
     */
    getCurrentAcceleration: function(successCallback, errorCallback, options) {
        argscheck.checkArgs('fFO', 'accelerometer.getCurrentAcceleration', arguments);

        var p;
        var win = function(a) {
            removeListeners(p);
            successCallback(a);
        };
        var fail = function(e) {
            removeListeners(p);
            errorCallback && errorCallback(e);
        };

        p = createCallbackPair(win, fail);
        listeners.push(p);

        if (!running) {
            start();
        }
    },

    /**
     * Asynchronously acquires the acceleration repeatedly at a given interval.
     *
     * @param {Function} successCallback    The function to call each time the acceleration data is available
     * @param {Function} errorCallback      The function to call when there is an error getting the acceleration data. (OPTIONAL)
     * @param {AccelerationOptions} options The options for getting the accelerometer data such as timeout. (OPTIONAL)
     * @return String                       The watch id that must be passed to #clearWatch to stop watching.
     */
    watchAcceleration: function(successCallback, errorCallback, options) {
        argscheck.checkArgs('fFO', 'accelerometer.watchAcceleration', arguments);
        // Default interval (10 sec)
        var frequency = (options && options.frequency && typeof options.frequency == 'number') ? options.frequency : 10000;

        // Keep reference to watch id, and report accel readings as often as defined in frequency
        var id = utils.createUUID();

        var p = createCallbackPair(function(){}, function(e) {
            removeListeners(p);
            errorCallback && errorCallback(e);
        });
        listeners.push(p);

        timers[id] = {
            timer:window.setInterval(function() {
                if (accel) {
                    successCallback(accel);
                }
            }, frequency),
            listeners:p
        };

        if (running) {
            // If we're already running then immediately invoke the success callback
            // but only if we have retrieved a value, sample code does not check for null ...
            if (accel) {
                successCallback(accel);
            }
        } else {
            start();
        }

        return id;
    },

    /**
     * Clears the specified accelerometer watch.
     *
     * @param {String} id       The id of the watch returned from #watchAcceleration.
     */
    clearWatch: function(id) {
        // Stop javascript timer & remove from timer list
        if (id && timers[id]) {
            window.clearInterval(timers[id].timer);
            removeListeners(timers[id].listeners);
            delete timers[id];
        }
    }
};

module.exports = accelerometer;

});

// file: lib/common/plugin/battery.js
define("cordova/plugin/battery", function(require, exports, module) {

/**
 * This class contains information about the current battery status.
 * @constructor
 */
var cordova = require('cordova'),
    exec = require('cordova/exec');

function handlers() {
  return battery.channels.batterystatus.numHandlers +
         battery.channels.batterylow.numHandlers +
         battery.channels.batterycritical.numHandlers;
}

var Battery = function() {
    this._level = null;
    this._isPlugged = null;
    // Create new event handlers on the window (returns a channel instance)
    this.channels = {
      batterystatus:cordova.addWindowEventHandler("batterystatus"),
      batterylow:cordova.addWindowEventHandler("batterylow"),
      batterycritical:cordova.addWindowEventHandler("batterycritical")
    };
    for (var key in this.channels) {
        this.channels[key].onHasSubscribersChange = Battery.onHasSubscribersChange;
    }
};
/**
 * Event handlers for when callbacks get registered for the battery.
 * Keep track of how many handlers we have so we can start and stop the native battery listener
 * appropriately (and hopefully save on battery life!).
 */
Battery.onHasSubscribersChange = function() {
  // If we just registered the first handler, make sure native listener is started.
  if (this.numHandlers === 1 && handlers() === 1) {
      exec(battery._status, battery._error, "Battery", "start", []);
  } else if (handlers() === 0) {
      exec(null, null, "Battery", "stop", []);
  }
};

/**
 * Callback for battery status
 *
 * @param {Object} info            keys: level, isPlugged
 */
Battery.prototype._status = function(info) {
    if (info) {
        var me = battery;
    var level = info.level;
        if (me._level !== level || me._isPlugged !== info.isPlugged) {
            // Fire batterystatus event
            cordova.fireWindowEvent("batterystatus", info);

            // Fire low battery event
            if (level === 20 || level === 5) {
                if (level === 20) {
                    cordova.fireWindowEvent("batterylow", info);
                }
                else {
                    cordova.fireWindowEvent("batterycritical", info);
                }
            }
        }
        me._level = level;
        me._isPlugged = info.isPlugged;
    }
};

/**
 * Error callback for battery start
 */
Battery.prototype._error = function(e) {
    console.log("Error initializing Battery: " + e);
};

var battery = new Battery();

module.exports = battery;

});

// file: lib/common/plugin/capture.js
define("cordova/plugin/capture", function(require, exports, module) {

var exec = require('cordova/exec'),
    MediaFile = require('cordova/plugin/MediaFile');

/**
 * Launches a capture of different types.
 *
 * @param (DOMString} type
 * @param {Function} successCB
 * @param {Function} errorCB
 * @param {CaptureVideoOptions} options
 */
function _capture(type, successCallback, errorCallback, options) {
    var win = function(pluginResult) {
        var mediaFiles = [];
        var i;
        for (i = 0; i < pluginResult.length; i++) {
            var mediaFile = new MediaFile();
            mediaFile.name = pluginResult[i].name;
            mediaFile.fullPath = pluginResult[i].fullPath;
            mediaFile.type = pluginResult[i].type;
            mediaFile.lastModifiedDate = pluginResult[i].lastModifiedDate;
            mediaFile.size = pluginResult[i].size;
            mediaFiles.push(mediaFile);
        }
        successCallback(mediaFiles);
    };
    exec(win, errorCallback, "Capture", type, [options]);
}
/**
 * The Capture interface exposes an interface to the camera and microphone of the hosting device.
 */
function Capture() {
    this.supportedAudioModes = [];
    this.supportedImageModes = [];
    this.supportedVideoModes = [];
}

/**
 * Launch audio recorder application for recording audio clip(s).
 *
 * @param {Function} successCB
 * @param {Function} errorCB
 * @param {CaptureAudioOptions} options
 */
Capture.prototype.captureAudio = function(successCallback, errorCallback, options){
    _capture("captureAudio", successCallback, errorCallback, options);
};

/**
 * Launch camera application for taking image(s).
 *
 * @param {Function} successCB
 * @param {Function} errorCB
 * @param {CaptureImageOptions} options
 */
Capture.prototype.captureImage = function(successCallback, errorCallback, options){
    _capture("captureImage", successCallback, errorCallback, options);
};

/**
 * Launch device camera application for recording video(s).
 *
 * @param {Function} successCB
 * @param {Function} errorCB
 * @param {CaptureVideoOptions} options
 */
Capture.prototype.captureVideo = function(successCallback, errorCallback, options){
    _capture("captureVideo", successCallback, errorCallback, options);
};


module.exports = new Capture();

});

// file: lib/common/plugin/compass.js
define("cordova/plugin/compass", function(require, exports, module) {

var argscheck = require('cordova/argscheck'),
    exec = require('cordova/exec'),
    utils = require('cordova/utils'),
    CompassHeading = require('cordova/plugin/CompassHeading'),
    CompassError = require('cordova/plugin/CompassError'),
    timers = {},
    compass = {
        /**
         * Asynchronously acquires the current heading.
         * @param {Function} successCallback The function to call when the heading
         * data is available
         * @param {Function} errorCallback The function to call when there is an error
         * getting the heading data.
         * @param {CompassOptions} options The options for getting the heading data (not used).
         */
        getCurrentHeading:function(successCallback, errorCallback, options) {
            argscheck.checkArgs('fFO', 'compass.getCurrentHeading', arguments);

            var win = function(result) {
                var ch = new CompassHeading(result.magneticHeading, result.trueHeading, result.headingAccuracy, result.timestamp);
                successCallback(ch);
            };
            var fail = errorCallback && function(code) {
                var ce = new CompassError(code);
                errorCallback(ce);
            };

            // Get heading
            exec(win, fail, "Compass", "getHeading", [options]);
        },

        /**
         * Asynchronously acquires the heading repeatedly at a given interval.
         * @param {Function} successCallback The function to call each time the heading
         * data is available
         * @param {Function} errorCallback The function to call when there is an error
         * getting the heading data.
         * @param {HeadingOptions} options The options for getting the heading data
         * such as timeout and the frequency of the watch. For iOS, filter parameter
         * specifies to watch via a distance filter rather than time.
         */
        watchHeading:function(successCallback, errorCallback, options) {
            argscheck.checkArgs('fFO', 'compass.watchHeading', arguments);
            // Default interval (100 msec)
            var frequency = (options !== undefined && options.frequency !== undefined) ? options.frequency : 100;
            var filter = (options !== undefined && options.filter !== undefined) ? options.filter : 0;

            var id = utils.createUUID();
            if (filter > 0) {
                // is an iOS request for watch by filter, no timer needed
                timers[id] = "iOS";
                compass.getCurrentHeading(successCallback, errorCallback, options);
            } else {
                // Start watch timer to get headings
                timers[id] = window.setInterval(function() {
                    compass.getCurrentHeading(successCallback, errorCallback);
                }, frequency);
            }

            return id;
        },

        /**
         * Clears the specified heading watch.
         * @param {String} watchId The ID of the watch returned from #watchHeading.
         */
        clearWatch:function(id) {
            // Stop javascript timer & remove from timer list
            if (id && timers[id]) {
                if (timers[id] != "iOS") {
                    clearInterval(timers[id]);
                } else {
                    // is iOS watch by filter so call into device to stop
                    exec(null, null, "Compass", "stopHeading", []);
                }
                delete timers[id];
            }
        }
    };

module.exports = compass;

});

// file: lib/common/plugin/console-via-logger.js
define("cordova/plugin/console-via-logger", function(require, exports, module) {

//------------------------------------------------------------------------------

var logger = require("cordova/plugin/logger");
var utils  = require("cordova/utils");

//------------------------------------------------------------------------------
// object that we're exporting
//------------------------------------------------------------------------------
var console = module.exports;

//------------------------------------------------------------------------------
// copy of the original console object
//------------------------------------------------------------------------------
var WinConsole = window.console;

//------------------------------------------------------------------------------
// whether to use the logger
//------------------------------------------------------------------------------
var UseLogger = false;

//------------------------------------------------------------------------------
// Timers
//------------------------------------------------------------------------------
var Timers = {};

//------------------------------------------------------------------------------
// used for unimplemented methods
//------------------------------------------------------------------------------
function noop() {}

//------------------------------------------------------------------------------
// used for unimplemented methods
//------------------------------------------------------------------------------
console.useLogger = function (value) {
    if (arguments.length) UseLogger = !!value;

    if (UseLogger) {
        if (logger.useConsole()) {
            throw new Error("console and logger are too intertwingly");
        }
    }

    return UseLogger;
};

//------------------------------------------------------------------------------
console.log = function() {
    if (logger.useConsole()) return;
    logger.log.apply(logger, [].slice.call(arguments));
};

//------------------------------------------------------------------------------
console.error = function() {
    if (logger.useConsole()) return;
    logger.error.apply(logger, [].slice.call(arguments));
};

//------------------------------------------------------------------------------
console.warn = function() {
    if (logger.useConsole()) return;
    logger.warn.apply(logger, [].slice.call(arguments));
};

//------------------------------------------------------------------------------
console.info = function() {
    if (logger.useConsole()) return;
    logger.info.apply(logger, [].slice.call(arguments));
};

//------------------------------------------------------------------------------
console.debug = function() {
    if (logger.useConsole()) return;
    logger.debug.apply(logger, [].slice.call(arguments));
};

//------------------------------------------------------------------------------
console.assert = function(expression) {
    if (expression) return;

    var message = utils.vformat(arguments[1], [].slice.call(arguments, 2));
    console.log("ASSERT: " + message);
};

//------------------------------------------------------------------------------
console.clear = function() {};

//------------------------------------------------------------------------------
console.dir = function(object) {
    console.log("%o", object);
};

//------------------------------------------------------------------------------
console.dirxml = function(node) {
    console.log(node.innerHTML);
};

//------------------------------------------------------------------------------
console.trace = noop;

//------------------------------------------------------------------------------
console.group = console.log;

//------------------------------------------------------------------------------
console.groupCollapsed = console.log;

//------------------------------------------------------------------------------
console.groupEnd = noop;

//------------------------------------------------------------------------------
console.time = function(name) {
    Timers[name] = new Date().valueOf();
};

//------------------------------------------------------------------------------
console.timeEnd = function(name) {
    var timeStart = Timers[name];
    if (!timeStart) {
        console.warn("unknown timer: " + name);
        return;
    }

    var timeElapsed = new Date().valueOf() - timeStart;
    console.log(name + ": " + timeElapsed + "ms");
};

//------------------------------------------------------------------------------
console.timeStamp = noop;

//------------------------------------------------------------------------------
console.profile = noop;

//------------------------------------------------------------------------------
console.profileEnd = noop;

//------------------------------------------------------------------------------
console.count = noop;

//------------------------------------------------------------------------------
console.exception = console.log;

//------------------------------------------------------------------------------
console.table = function(data, columns) {
    console.log("%o", data);
};

//------------------------------------------------------------------------------
// return a new function that calls both functions passed as args
//------------------------------------------------------------------------------
function wrappedOrigCall(orgFunc, newFunc) {
    return function() {
        var args = [].slice.call(arguments);
        try { orgFunc.apply(WinConsole, args); } catch (e) {}
        try { newFunc.apply(console,    args); } catch (e) {}
    };
}

//------------------------------------------------------------------------------
// For every function that exists in the original console object, that
// also exists in the new console object, wrap the new console method
// with one that calls both
//------------------------------------------------------------------------------
for (var key in console) {
    if (typeof WinConsole[key] == "function") {
        console[key] = wrappedOrigCall(WinConsole[key], console[key]);
    }
}

});

// file: lib/common/plugin/contacts.js
define("cordova/plugin/contacts", function(require, exports, module) {

var argscheck = require('cordova/argscheck'),
    exec = require('cordova/exec'),
    ContactError = require('cordova/plugin/ContactError'),
    utils = require('cordova/utils'),
    Contact = require('cordova/plugin/Contact');

/**
* Represents a group of Contacts.
* @constructor
*/
var contacts = {
    /**
     * Returns an array of Contacts matching the search criteria.
     * @param fields that should be searched
     * @param successCB success callback
     * @param errorCB error callback
     * @param {ContactFindOptions} options that can be applied to contact searching
     * @return array of Contacts matching search criteria
     */
    find:function(fields, successCB, errorCB, options) {
        argscheck.checkArgs('afFO', 'contacts.find', arguments);
        if (!fields.length) {
            errorCB && errorCB(new ContactError(ContactError.INVALID_ARGUMENT_ERROR));
        } else {
            var win = function(result) {
                var cs = [];
                for (var i = 0, l = result.length; i < l; i++) {
                    cs.push(contacts.create(result[i]));
                }
                successCB(cs);
            };
            exec(win, errorCB, "Contacts", "search", [fields, options]);
        }
    },

    /**
     * This function creates a new contact, but it does not persist the contact
     * to device storage. To persist the contact to device storage, invoke
     * contact.save().
     * @param properties an object whose properties will be examined to create a new Contact
     * @returns new Contact object
     */
    create:function(properties) {
        argscheck.checkArgs('O', 'contacts.create', arguments);
        var contact = new Contact();
        for (var i in properties) {
            if (typeof contact[i] !== 'undefined' && properties.hasOwnProperty(i)) {
                contact[i] = properties[i];
            }
        }
        return contact;
    }
};

module.exports = contacts;

});

// file: lib/common/plugin/device.js
define("cordova/plugin/device", function(require, exports, module) {

var argscheck = require('cordova/argscheck'),
    channel = require('cordova/channel'),
    utils = require('cordova/utils'),
    exec = require('cordova/exec');

// Tell cordova channel to wait on the CordovaInfoReady event
channel.waitForInitialization('onCordovaInfoReady');

/**
 * This represents the mobile device, and provides properties for inspecting the model, version, UUID of the
 * phone, etc.
 * @constructor
 */
function Device() {
    this.available = false;
    this.platform = null;
    this.version = null;
    this.name = null;
    this.uuid = null;
    this.cordova = null;
    this.model = null;

    var me = this;

    channel.onCordovaReady.subscribe(function() {
        me.getInfo(function(info) {
            me.available = true;
            me.platform = info.platform;
            me.version = info.version;
            me.name = info.name;
            me.uuid = info.uuid;
            me.cordova = info.cordova;
            me.model = info.model;
            channel.onCordovaInfoReady.fire();
        },function(e) {
            me.available = false;
            utils.alert("[ERROR] Error initializing Cordova: " + e);
        });
    });
}

/**
 * Get device info
 *
 * @param {Function} successCallback The function to call when the heading data is available
 * @param {Function} errorCallback The function to call when there is an error getting the heading data. (OPTIONAL)
 */
Device.prototype.getInfo = function(successCallback, errorCallback) {
    argscheck.checkArgs('fF', 'Device.getInfo', arguments);
    exec(successCallback, errorCallback, "Device", "getDeviceInfo", []);
};

module.exports = new Device();

});

// file: lib/common/plugin/echo.js
define("cordova/plugin/echo", function(require, exports, module) {

var exec = require('cordova/exec');

/**
 * Sends the given message through exec() to the Echo plugin, which sends it back to the successCallback.
 * @param successCallback  invoked with a FileSystem object
 * @param errorCallback  invoked if error occurs retrieving file system
 * @param message  The string to be echoed.
 * @param forceAsync  Whether to force an async return value (for testing native->js bridge).
 */
module.exports = function(successCallback, errorCallback, message, forceAsync) {
    var action = forceAsync ? 'echoAsync' : 'echo';
    if (!forceAsync && message.constructor == ArrayBuffer) {
        action = 'echoArrayBuffer';
    }
    exec(successCallback, errorCallback, "Echo", action, [message]);
};


});

// file: lib/ios/plugin/file/symbols.js
define("cordova/plugin/file/symbols", function(require, exports, module) {


var modulemapper = require('cordova/modulemapper'),
    symbolshelper = require('cordova/plugin/file/symbolshelper');

symbolshelper(modulemapper.clobbers);
modulemapper.merges('cordova/plugin/ios/Entry', 'Entry');

});

// file: lib/common/plugin/file/symbolshelper.js
define("cordova/plugin/file/symbolshelper", function(require, exports, module) {

module.exports = function(exportFunc) {
    exportFunc('cordova/plugin/DirectoryEntry', 'DirectoryEntry');
    exportFunc('cordova/plugin/DirectoryReader', 'DirectoryReader');
    exportFunc('cordova/plugin/Entry', 'Entry');
    exportFunc('cordova/plugin/File', 'File');
    exportFunc('cordova/plugin/FileEntry', 'FileEntry');
    exportFunc('cordova/plugin/FileError', 'FileError');
    exportFunc('cordova/plugin/FileReader', 'FileReader');
    exportFunc('cordova/plugin/FileSystem', 'FileSystem');
    exportFunc('cordova/plugin/FileTransfer', 'FileTransfer');
    exportFunc('cordova/plugin/FileTransferError', 'FileTransferError');
    exportFunc('cordova/plugin/FileUploadOptions', 'FileUploadOptions');
    exportFunc('cordova/plugin/FileUploadResult', 'FileUploadResult');
    exportFunc('cordova/plugin/FileWriter', 'FileWriter');
    exportFunc('cordova/plugin/Flags', 'Flags');
    exportFunc('cordova/plugin/LocalFileSystem', 'LocalFileSystem');
    exportFunc('cordova/plugin/Metadata', 'Metadata');
    exportFunc('cordova/plugin/requestFileSystem', 'requestFileSystem');
    exportFunc('cordova/plugin/resolveLocalFileSystemURI', 'resolveLocalFileSystemURI');
};

});

// file: lib/common/plugin/geolocation.js
define("cordova/plugin/geolocation", function(require, exports, module) {

var argscheck = require('cordova/argscheck'),
    utils = require('cordova/utils'),
    exec = require('cordova/exec'),
    PositionError = require('cordova/plugin/PositionError'),
    Position = require('cordova/plugin/Position');

var timers = {};   // list of timers in use

// Returns default params, overrides if provided with values
function parseParameters(options) {
    var opt = {
        maximumAge: 0,
        enableHighAccuracy: false,
        timeout: Infinity
    };

    if (options) {
        if (options.maximumAge !== undefined && !isNaN(options.maximumAge) && options.maximumAge > 0) {
            opt.maximumAge = options.maximumAge;
        }
        if (options.enableHighAccuracy !== undefined) {
            opt.enableHighAccuracy = options.enableHighAccuracy;
        }
        if (options.timeout !== undefined && !isNaN(options.timeout)) {
            if (options.timeout < 0) {
                opt.timeout = 0;
            } else {
                opt.timeout = options.timeout;
            }
        }
    }

    return opt;
}

// Returns a timeout failure, closed over a specified timeout value and error callback.
function createTimeout(errorCallback, timeout) {
    var t = setTimeout(function() {
        clearTimeout(t);
        t = null;
        errorCallback({
            code:PositionError.TIMEOUT,
            message:"Position retrieval timed out."
        });
    }, timeout);
    return t;
}

var geolocation = {
    lastPosition:null, // reference to last known (cached) position returned
    /**
   * Asynchronously acquires the current position.
   *
   * @param {Function} successCallback    The function to call when the position data is available
   * @param {Function} errorCallback      The function to call when there is an error getting the heading position. (OPTIONAL)
   * @param {PositionOptions} options     The options for getting the position data. (OPTIONAL)
   */
    getCurrentPosition:function(successCallback, errorCallback, options) {
        argscheck.checkArgs('fFO', 'geolocation.getCurrentPosition', arguments);
        options = parseParameters(options);

        // Timer var that will fire an error callback if no position is retrieved from native
        // before the "timeout" param provided expires
        var timeoutTimer = {timer:null};

        var win = function(p) {
            clearTimeout(timeoutTimer.timer);
            if (!(timeoutTimer.timer)) {
                // Timeout already happened, or native fired error callback for
                // this geo request.
                // Don't continue with success callback.
                return;
            }
            var pos = new Position(
                {
                    latitude:p.latitude,
                    longitude:p.longitude,
                    altitude:p.altitude,
                    accuracy:p.accuracy,
                    heading:p.heading,
                    velocity:p.velocity,
                    altitudeAccuracy:p.altitudeAccuracy
                },
                (p.timestamp === undefined ? new Date() : ((p.timestamp instanceof Date) ? p.timestamp : new Date(p.timestamp)))
            );
            geolocation.lastPosition = pos;
            successCallback(pos);
        };
        var fail = function(e) {
            clearTimeout(timeoutTimer.timer);
            timeoutTimer.timer = null;
            var err = new PositionError(e.code, e.message);
            if (errorCallback) {
                errorCallback(err);
            }
        };

        // Check our cached position, if its timestamp difference with current time is less than the maximumAge, then just
        // fire the success callback with the cached position.
        if (geolocation.lastPosition && options.maximumAge && (((new Date()).getTime() - geolocation.lastPosition.timestamp.getTime()) <= options.maximumAge)) {
            successCallback(geolocation.lastPosition);
        // If the cached position check failed and the timeout was set to 0, error out with a TIMEOUT error object.
        } else if (options.timeout === 0) {
            fail({
                code:PositionError.TIMEOUT,
                message:"timeout value in PositionOptions set to 0 and no cached Position object available, or cached Position object's age exceeds provided PositionOptions' maximumAge parameter."
            });
        // Otherwise we have to call into native to retrieve a position.
        } else {
            if (options.timeout !== Infinity) {
                // If the timeout value was not set to Infinity (default), then
                // set up a timeout function that will fire the error callback
                // if no successful position was retrieved before timeout expired.
                timeoutTimer.timer = createTimeout(fail, options.timeout);
            } else {
                // This is here so the check in the win function doesn't mess stuff up
                // may seem weird but this guarantees timeoutTimer is
                // always truthy before we call into native
                timeoutTimer.timer = true;
            }
            exec(win, fail, "Geolocation", "getLocation", [options.enableHighAccuracy, options.maximumAge]);
        }
        return timeoutTimer;
    },
    /**
     * Asynchronously watches the geolocation for changes to geolocation.  When a change occurs,
     * the successCallback is called with the new location.
     *
     * @param {Function} successCallback    The function to call each time the location data is available
     * @param {Function} errorCallback      The function to call when there is an error getting the location data. (OPTIONAL)
     * @param {PositionOptions} options     The options for getting the location data such as frequency. (OPTIONAL)
     * @return String                       The watch id that must be passed to #clearWatch to stop watching.
     */
    watchPosition:function(successCallback, errorCallback, options) {
        argscheck.checkArgs('fFO', 'geolocation.getCurrentPosition', arguments);
        options = parseParameters(options);

        var id = utils.createUUID();

        // Tell device to get a position ASAP, and also retrieve a reference to the timeout timer generated in getCurrentPosition
        timers[id] = geolocation.getCurrentPosition(successCallback, errorCallback, options);

        var fail = function(e) {
            clearTimeout(timers[id].timer);
            var err = new PositionError(e.code, e.message);
            if (errorCallback) {
                errorCallback(err);
            }
        };

        var win = function(p) {
            clearTimeout(timers[id].timer);
            if (options.timeout !== Infinity) {
                timers[id].timer = createTimeout(fail, options.timeout);
            }
            var pos = new Position(
                {
                    latitude:p.latitude,
                    longitude:p.longitude,
                    altitude:p.altitude,
                    accuracy:p.accuracy,
                    heading:p.heading,
                    velocity:p.velocity,
                    altitudeAccuracy:p.altitudeAccuracy
                },
                (p.timestamp === undefined ? new Date() : ((p.timestamp instanceof Date) ? p.timestamp : new Date(p.timestamp)))
            );
            geolocation.lastPosition = pos;
            successCallback(pos);
        };

        exec(win, fail, "Geolocation", "addWatch", [id, options.enableHighAccuracy]);

        return id;
    },
    /**
     * Clears the specified heading watch.
     *
     * @param {String} id       The ID of the watch returned from #watchPosition
     */
    clearWatch:function(id) {
        if (id && timers[id] !== undefined) {
            clearTimeout(timers[id].timer);
            timers[id].timer = false;
            exec(null, null, "Geolocation", "clearWatch", [id]);
        }
    }
};

module.exports = geolocation;

});

// file: lib/common/plugin/globalization.js
define("cordova/plugin/globalization", function(require, exports, module) {

var argscheck = require('cordova/argscheck'),
    exec = require('cordova/exec'),
    GlobalizationError = require('cordova/plugin/GlobalizationError');

var globalization = {

/**
* Returns the string identifier for the client's current language.
* It returns the language identifier string to the successCB callback with a
* properties object as a parameter. If there is an error getting the language,
* then the errorCB callback is invoked.
*
* @param {Function} successCB
* @param {Function} errorCB
*
* @return Object.value {String}: The language identifier
*
* @error GlobalizationError.UNKNOWN_ERROR
*
* Example
*    globalization.getPreferredLanguage(function (language) {alert('language:' + language.value + '\n');},
*                                function () {});
*/
getPreferredLanguage:function(successCB, failureCB) {
    argscheck.checkArgs('fF', 'Globalization.getPreferredLanguage', arguments);
    exec(successCB, failureCB, "Globalization","getPreferredLanguage", []);
},

/**
* Returns the string identifier for the client's current locale setting.
* It returns the locale identifier string to the successCB callback with a
* properties object as a parameter. If there is an error getting the locale,
* then the errorCB callback is invoked.
*
* @param {Function} successCB
* @param {Function} errorCB
*
* @return Object.value {String}: The locale identifier
*
* @error GlobalizationError.UNKNOWN_ERROR
*
* Example
*    globalization.getLocaleName(function (locale) {alert('locale:' + locale.value + '\n');},
*                                function () {});
*/
getLocaleName:function(successCB, failureCB) {
    argscheck.checkArgs('fF', 'Globalization.getLocaleName', arguments);
    exec(successCB, failureCB, "Globalization","getLocaleName", []);
},


/**
* Returns a date formatted as a string according to the client's user preferences and
* calendar using the time zone of the client. It returns the formatted date string to the
* successCB callback with a properties object as a parameter. If there is an error
* formatting the date, then the errorCB callback is invoked.
*
* The defaults are: formatLenght="short" and selector="date and time"
*
* @param {Date} date
* @param {Function} successCB
* @param {Function} errorCB
* @param {Object} options {optional}
*            formatLength {String}: 'short', 'medium', 'long', or 'full'
*            selector {String}: 'date', 'time', or 'date and time'
*
* @return Object.value {String}: The localized date string
*
* @error GlobalizationError.FORMATTING_ERROR
*
* Example
*    globalization.dateToString(new Date(),
*                function (date) {alert('date:' + date.value + '\n');},
*                function (errorCode) {alert(errorCode);},
*                {formatLength:'short'});
*/
dateToString:function(date, successCB, failureCB, options) {
    argscheck.checkArgs('dfFO', 'Globalization.dateToString', arguments);
    var dateValue = date.valueOf();
    exec(successCB, failureCB, "Globalization", "dateToString", [{"date": dateValue, "options": options}]);
},


/**
* Parses a date formatted as a string according to the client's user
* preferences and calendar using the time zone of the client and returns
* the corresponding date object. It returns the date to the successCB
* callback with a properties object as a parameter. If there is an error
* parsing the date string, then the errorCB callback is invoked.
*
* The defaults are: formatLength="short" and selector="date and time"
*
* @param {String} dateString
* @param {Function} successCB
* @param {Function} errorCB
* @param {Object} options {optional}
*            formatLength {String}: 'short', 'medium', 'long', or 'full'
*            selector {String}: 'date', 'time', or 'date and time'
*
* @return    Object.year {Number}: The four digit year
*            Object.month {Number}: The month from (0 - 11)
*            Object.day {Number}: The day from (1 - 31)
*            Object.hour {Number}: The hour from (0 - 23)
*            Object.minute {Number}: The minute from (0 - 59)
*            Object.second {Number}: The second from (0 - 59)
*            Object.millisecond {Number}: The milliseconds (from 0 - 999),
*                                        not available on all platforms
*
* @error GlobalizationError.PARSING_ERROR
*
* Example
*    globalization.stringToDate('4/11/2011',
*                function (date) { alert('Month:' + date.month + '\n' +
*                    'Day:' + date.day + '\n' +
*                    'Year:' + date.year + '\n');},
*                function (errorCode) {alert(errorCode);},
*                {selector:'date'});
*/
stringToDate:function(dateString, successCB, failureCB, options) {
    argscheck.checkArgs('sfFO', 'Globalization.stringToDate', arguments);
    exec(successCB, failureCB, "Globalization", "stringToDate", [{"dateString": dateString, "options": options}]);
},


/**
* Returns a pattern string for formatting and parsing dates according to the client's
* user preferences. It returns the pattern to the successCB callback with a
* properties object as a parameter. If there is an error obtaining the pattern,
* then the errorCB callback is invoked.
*
* The defaults are: formatLength="short" and selector="date and time"
*
* @param {Function} successCB
* @param {Function} errorCB
* @param {Object} options {optional}
*            formatLength {String}: 'short', 'medium', 'long', or 'full'
*            selector {String}: 'date', 'time', or 'date and time'
*
* @return    Object.pattern {String}: The date and time pattern for formatting and parsing dates.
*                                    The patterns follow Unicode Technical Standard #35
*                                    http://unicode.org/reports/tr35/tr35-4.html
*            Object.timezone {String}: The abbreviated name of the time zone on the client
*            Object.utc_offset {Number}: The current difference in seconds between the client's
*                                        time zone and coordinated universal time.
*            Object.dst_offset {Number}: The current daylight saving time offset in seconds
*                                        between the client's non-daylight saving's time zone
*                                        and the client's daylight saving's time zone.
*
* @error GlobalizationError.PATTERN_ERROR
*
* Example
*    globalization.getDatePattern(
*                function (date) {alert('pattern:' + date.pattern + '\n');},
*                function () {},
*                {formatLength:'short'});
*/
getDatePattern:function(successCB, failureCB, options) {
    argscheck.checkArgs('fFO', 'Globalization.getDatePattern', arguments);
    exec(successCB, failureCB, "Globalization", "getDatePattern", [{"options": options}]);
},


/**
* Returns an array of either the names of the months or days of the week
* according to the client's user preferences and calendar. It returns the array of names to the
* successCB callback with a properties object as a parameter. If there is an error obtaining the
* names, then the errorCB callback is invoked.
*
* The defaults are: type="wide" and item="months"
*
* @param {Function} successCB
* @param {Function} errorCB
* @param {Object} options {optional}
*            type {String}: 'narrow' or 'wide'
*            item {String}: 'months', or 'days'
*
* @return Object.value {Array{String}}: The array of names starting from either
*                                        the first month in the year or the
*                                        first day of the week.
* @error GlobalizationError.UNKNOWN_ERROR
*
* Example
*    globalization.getDateNames(function (names) {
*        for(var i = 0; i < names.value.length; i++) {
*            alert('Month:' + names.value[i] + '\n');}},
*        function () {});
*/
getDateNames:function(successCB, failureCB, options) {
    argscheck.checkArgs('fFO', 'Globalization.getDateNames', arguments);
    exec(successCB, failureCB, "Globalization", "getDateNames", [{"options": options}]);
},

/**
* Returns whether daylight savings time is in effect for a given date using the client's
* time zone and calendar. It returns whether or not daylight savings time is in effect
* to the successCB callback with a properties object as a parameter. If there is an error
* reading the date, then the errorCB callback is invoked.
*
* @param {Date} date
* @param {Function} successCB
* @param {Function} errorCB
*
* @return Object.dst {Boolean}: The value "true" indicates that daylight savings time is
*                                in effect for the given date and "false" indicate that it is not.
*
* @error GlobalizationError.UNKNOWN_ERROR
*
* Example
*    globalization.isDayLightSavingsTime(new Date(),
*                function (date) {alert('dst:' + date.dst + '\n');}
*                function () {});
*/
isDayLightSavingsTime:function(date, successCB, failureCB) {
    argscheck.checkArgs('dfF', 'Globalization.isDayLightSavingsTime', arguments);
    var dateValue = date.valueOf();
    exec(successCB, failureCB, "Globalization", "isDayLightSavingsTime", [{"date": dateValue}]);
},

/**
* Returns the first day of the week according to the client's user preferences and calendar.
* The days of the week are numbered starting from 1 where 1 is considered to be Sunday.
* It returns the day to the successCB callback with a properties object as a parameter.
* If there is an error obtaining the pattern, then the errorCB callback is invoked.
*
* @param {Function} successCB
* @param {Function} errorCB
*
* @return Object.value {Number}: The number of the first day of the week.
*
* @error GlobalizationError.UNKNOWN_ERROR
*
* Example
*    globalization.getFirstDayOfWeek(function (day)
*                { alert('Day:' + day.value + '\n');},
*                function () {});
*/
getFirstDayOfWeek:function(successCB, failureCB) {
    argscheck.checkArgs('fF', 'Globalization.getFirstDayOfWeek', arguments);
    exec(successCB, failureCB, "Globalization", "getFirstDayOfWeek", []);
},


/**
* Returns a number formatted as a string according to the client's user preferences.
* It returns the formatted number string to the successCB callback with a properties object as a
* parameter. If there is an error formatting the number, then the errorCB callback is invoked.
*
* The defaults are: type="decimal"
*
* @param {Number} number
* @param {Function} successCB
* @param {Function} errorCB
* @param {Object} options {optional}
*            type {String}: 'decimal', "percent", or 'currency'
*
* @return Object.value {String}: The formatted number string.
*
* @error GlobalizationError.FORMATTING_ERROR
*
* Example
*    globalization.numberToString(3.25,
*                function (number) {alert('number:' + number.value + '\n');},
*                function () {},
*                {type:'decimal'});
*/
numberToString:function(number, successCB, failureCB, options) {
    argscheck.checkArgs('nfFO', 'Globalization.numberToString', arguments);
    exec(successCB, failureCB, "Globalization", "numberToString", [{"number": number, "options": options}]);
},

/**
* Parses a number formatted as a string according to the client's user preferences and
* returns the corresponding number. It returns the number to the successCB callback with a
* properties object as a parameter. If there is an error parsing the number string, then
* the errorCB callback is invoked.
*
* The defaults are: type="decimal"
*
* @param {String} numberString
* @param {Function} successCB
* @param {Function} errorCB
* @param {Object} options {optional}
*            type {String}: 'decimal', "percent", or 'currency'
*
* @return Object.value {Number}: The parsed number.
*
* @error GlobalizationError.PARSING_ERROR
*
* Example
*    globalization.stringToNumber('1234.56',
*                function (number) {alert('Number:' + number.value + '\n');},
*                function () { alert('Error parsing number');});
*/
stringToNumber:function(numberString, successCB, failureCB, options) {
    argscheck.checkArgs('sfFO', 'Globalization.stringToNumber', arguments);
    exec(successCB, failureCB, "Globalization", "stringToNumber", [{"numberString": numberString, "options": options}]);
},

/**
* Returns a pattern string for formatting and parsing numbers according to the client's user
* preferences. It returns the pattern to the successCB callback with a properties object as a
* parameter. If there is an error obtaining the pattern, then the errorCB callback is invoked.
*
* The defaults are: type="decimal"
*
* @param {Function} successCB
* @param {Function} errorCB
* @param {Object} options {optional}
*            type {String}: 'decimal', "percent", or 'currency'
*
* @return    Object.pattern {String}: The number pattern for formatting and parsing numbers.
*                                    The patterns follow Unicode Technical Standard #35.
*                                    http://unicode.org/reports/tr35/tr35-4.html
*            Object.symbol {String}: The symbol to be used when formatting and parsing
*                                    e.g., percent or currency symbol.
*            Object.fraction {Number}: The number of fractional digits to use when parsing and
*                                    formatting numbers.
*            Object.rounding {Number}: The rounding increment to use when parsing and formatting.
*            Object.positive {String}: The symbol to use for positive numbers when parsing and formatting.
*            Object.negative: {String}: The symbol to use for negative numbers when parsing and formatting.
*            Object.decimal: {String}: The decimal symbol to use for parsing and formatting.
*            Object.grouping: {String}: The grouping symbol to use for parsing and formatting.
*
* @error GlobalizationError.PATTERN_ERROR
*
* Example
*    globalization.getNumberPattern(
*                function (pattern) {alert('Pattern:' + pattern.pattern + '\n');},
*                function () {});
*/
getNumberPattern:function(successCB, failureCB, options) {
    argscheck.checkArgs('fFO', 'Globalization.getNumberPattern', arguments);
    exec(successCB, failureCB, "Globalization", "getNumberPattern", [{"options": options}]);
},

/**
* Returns a pattern string for formatting and parsing currency values according to the client's
* user preferences and ISO 4217 currency code. It returns the pattern to the successCB callback with a
* properties object as a parameter. If there is an error obtaining the pattern, then the errorCB
* callback is invoked.
*
* @param {String} currencyCode
* @param {Function} successCB
* @param {Function} errorCB
*
* @return    Object.pattern {String}: The currency pattern for formatting and parsing currency values.
*                                    The patterns follow Unicode Technical Standard #35
*                                    http://unicode.org/reports/tr35/tr35-4.html
*            Object.code {String}: The ISO 4217 currency code for the pattern.
*            Object.fraction {Number}: The number of fractional digits to use when parsing and
*                                    formatting currency.
*            Object.rounding {Number}: The rounding increment to use when parsing and formatting.
*            Object.decimal: {String}: The decimal symbol to use for parsing and formatting.
*            Object.grouping: {String}: The grouping symbol to use for parsing and formatting.
*
* @error GlobalizationError.FORMATTING_ERROR
*
* Example
*    globalization.getCurrencyPattern('EUR',
*                function (currency) {alert('Pattern:' + currency.pattern + '\n');}
*                function () {});
*/
getCurrencyPattern:function(currencyCode, successCB, failureCB) {
    argscheck.checkArgs('sfF', 'Globalization.getCurrencyPattern', arguments);
    exec(successCB, failureCB, "Globalization", "getCurrencyPattern", [{"currencyCode": currencyCode}]);
}

};

module.exports = globalization;

});

// file: lib/ios/plugin/ios/Contact.js
define("cordova/plugin/ios/Contact", function(require, exports, module) {

var exec = require('cordova/exec'),
    ContactError = require('cordova/plugin/ContactError');

/**
 * Provides iOS Contact.display API.
 */
module.exports = {
    display : function(errorCB, options) {
        /*
         *    Display a contact using the iOS Contact Picker UI
         *    NOT part of W3C spec so no official documentation
         *
         *    @param errorCB error callback
         *    @param options object
         *    allowsEditing: boolean AS STRING
         *        "true" to allow editing the contact
         *        "false" (default) display contact
         */

        if (this.id === null) {
            if (typeof errorCB === "function") {
                var errorObj = new ContactError(ContactError.UNKNOWN_ERROR);
                errorCB(errorObj);
            }
        }
        else {
            exec(null, errorCB, "Contacts","displayContact", [this.id, options]);
        }
    }
};

});

// file: lib/ios/plugin/ios/Entry.js
define("cordova/plugin/ios/Entry", function(require, exports, module) {

module.exports = {
    toURL:function() {
        // TODO: refactor path in a cross-platform way so we can eliminate
        // these kinds of platform-specific hacks.
        return "file://localhost" + this.fullPath;
    },
    toURI: function() {
        console.log("DEPRECATED: Update your code to use 'toURL'");
        return "file://localhost" + this.fullPath;
    }
};

});

// file: lib/ios/plugin/ios/console.js
define("cordova/plugin/ios/console", function(require, exports, module) {

var exec = require('cordova/exec');

/**
 * create a nice string for an object
 */
function stringify(message) {
    try {
        if (typeof message === "object" && JSON && JSON.stringify) {
            try {
                return JSON.stringify(message);
            }
            catch (e) {
                return "error JSON.stringify()ing argument: " + e;
            }
        } else {
            return message.toString();
        }
    } catch (e) {
        return e.toString();
    }
}

/**
 * Wrapper one of the console logging methods, so that
 * the Cordova logging native is called, then the original.
 */
function wrappedMethod(console, method) {
    var origMethod = console[method];

    return function(message) {
        exec(null, null,
            'Debug Console', 'log',
            [ stringify(message), { logLevel: method.toUpperCase() } ]
        );

        if (!origMethod) return;

        origMethod.apply(console, arguments);
    };
}

var console = window.console || {};

// 2012-10-06 pmuellr - marking setLevel() method and logLevel property
// on console as deprecated;
// it didn't do anything useful, since the level constants weren't accessible
// to anyone

console.setLevel = function() {};
console.logLevel = 0;

// wrapper the logging messages

var methods = ["log", "debug", "info", "warn", "error"];

for (var i=0; i<methods.length; i++) {
    var method = methods[i];

    console[method] = wrappedMethod(console, method);
}

module.exports = console;

});

// file: lib/ios/plugin/ios/contacts.js
define("cordova/plugin/ios/contacts", function(require, exports, module) {

var exec = require('cordova/exec');

/**
 * Provides iOS enhanced contacts API.
 */
module.exports = {
    newContactUI : function(successCallback) {
        /*
         *    Create a contact using the iOS Contact Picker UI
         *    NOT part of W3C spec so no official documentation
         *
         * returns:  the id of the created contact as param to successCallback
         */
        exec(successCallback, null, "Contacts","newContact", []);
    },
    chooseContact : function(successCallback, options) {
        /*
         *    Select a contact using the iOS Contact Picker UI
         *    NOT part of W3C spec so no official documentation
         *
         *    @param errorCB error callback
         *    @param options object
         *    allowsEditing: boolean AS STRING
         *        "true" to allow editing the contact
         *        "false" (default) display contact
         *      fields: array of fields to return in contact object (see ContactOptions.fields)
         *
         *    @returns
         *        id of contact selected
         *        ContactObject
         *            if no fields provided contact contains just id information
         *            if fields provided contact object contains information for the specified fields
         *
         */
         var win = function(result) {
             var fullContact = require('cordova/plugin/contacts').create(result);
            successCallback(fullContact.id, fullContact);
       };
        exec(win, null, "Contacts","chooseContact", [options]);
    }
};

});

// file: lib/ios/plugin/ios/notification.js
define("cordova/plugin/ios/notification", function(require, exports, module) {

var Media = require('cordova/plugin/Media');

module.exports = {
    beep:function(count) {
        (new Media('beep.wav')).play();
    }
};

});

// file: lib/common/plugin/logger.js
define("cordova/plugin/logger", function(require, exports, module) {

//------------------------------------------------------------------------------
// The logger module exports the following properties/functions:
//
// LOG                          - constant for the level LOG
// ERROR                        - constant for the level ERROR
// WARN                         - constant for the level WARN
// INFO                         - constant for the level INFO
// DEBUG                        - constant for the level DEBUG
// logLevel()                   - returns current log level
// logLevel(value)              - sets and returns a new log level
// useConsole()                 - returns whether logger is using console
// useConsole(value)            - sets and returns whether logger is using console
// log(message,...)             - logs a message at level LOG
// error(message,...)           - logs a message at level ERROR
// warn(message,...)            - logs a message at level WARN
// info(message,...)            - logs a message at level INFO
// debug(message,...)           - logs a message at level DEBUG
// logLevel(level,message,...)  - logs a message specified level
//
//------------------------------------------------------------------------------

var logger = exports;

var exec    = require('cordova/exec');
var utils   = require('cordova/utils');

var UseConsole   = true;
var Queued       = [];
var DeviceReady  = false;
var CurrentLevel;

/**
 * Logging levels
 */

var Levels = [
    "LOG",
    "ERROR",
    "WARN",
    "INFO",
    "DEBUG"
];

/*
 * add the logging levels to the logger object and
 * to a separate levelsMap object for testing
 */

var LevelsMap = {};
for (var i=0; i<Levels.length; i++) {
    var level = Levels[i];
    LevelsMap[level] = i;
    logger[level]    = level;
}

CurrentLevel = LevelsMap.WARN;

/**
 * Getter/Setter for the logging level
 *
 * Returns the current logging level.
 *
 * When a value is passed, sets the logging level to that value.
 * The values should be one of the following constants:
 *    logger.LOG
 *    logger.ERROR
 *    logger.WARN
 *    logger.INFO
 *    logger.DEBUG
 *
 * The value used determines which messages get printed.  The logging
 * values above are in order, and only messages logged at the logging
 * level or above will actually be displayed to the user.  E.g., the
 * default level is WARN, so only messages logged with LOG, ERROR, or
 * WARN will be displayed; INFO and DEBUG messages will be ignored.
 */
logger.level = function (value) {
    if (arguments.length) {
        if (LevelsMap[value] === null) {
            throw new Error("invalid logging level: " + value);
        }
        CurrentLevel = LevelsMap[value];
    }

    return Levels[CurrentLevel];
};

/**
 * Getter/Setter for the useConsole functionality
 *
 * When useConsole is true, the logger will log via the
 * browser 'console' object.  Otherwise, it will use the
 * native Logger plugin.
 */
logger.useConsole = function (value) {
    if (arguments.length) UseConsole = !!value;

    if (UseConsole) {
        if (typeof console == "undefined") {
            throw new Error("global console object is not defined");
        }

        if (typeof console.log != "function") {
            throw new Error("global console object does not have a log function");
        }

        if (typeof console.useLogger == "function") {
            if (console.useLogger()) {
                throw new Error("console and logger are too intertwingly");
            }
        }
    }

    return UseConsole;
};

/**
 * Logs a message at the LOG level.
 *
 * Parameters passed after message are used applied to
 * the message with utils.format()
 */
logger.log   = function(message) { logWithArgs("LOG",   arguments); };

/**
 * Logs a message at the ERROR level.
 *
 * Parameters passed after message are used applied to
 * the message with utils.format()
 */
logger.error = function(message) { logWithArgs("ERROR", arguments); };

/**
 * Logs a message at the WARN level.
 *
 * Parameters passed after message are used applied to
 * the message with utils.format()
 */
logger.warn  = function(message) { logWithArgs("WARN",  arguments); };

/**
 * Logs a message at the INFO level.
 *
 * Parameters passed after message are used applied to
 * the message with utils.format()
 */
logger.info  = function(message) { logWithArgs("INFO",  arguments); };

/**
 * Logs a message at the DEBUG level.
 *
 * Parameters passed after message are used applied to
 * the message with utils.format()
 */
logger.debug = function(message) { logWithArgs("DEBUG", arguments); };

// log at the specified level with args
function logWithArgs(level, args) {
    args = [level].concat([].slice.call(args));
    logger.logLevel.apply(logger, args);
}

/**
 * Logs a message at the specified level.
 *
 * Parameters passed after message are used applied to
 * the message with utils.format()
 */
logger.logLevel = function(level, message /* , ... */) {
    // format the message with the parameters
    var formatArgs = [].slice.call(arguments, 2);
    message    = utils.vformat(message, formatArgs);

    if (LevelsMap[level] === null) {
        throw new Error("invalid logging level: " + level);
    }

    if (LevelsMap[level] > CurrentLevel) return;

    // queue the message if not yet at deviceready
    if (!DeviceReady && !UseConsole) {
        Queued.push([level, message]);
        return;
    }

    // if not using the console, use the native logger
    if (!UseConsole) {
        exec(null, null, "Logger", "logLevel", [level, message]);
        return;
    }

    // make sure console is not using logger
    if (console.__usingCordovaLogger) {
        throw new Error("console and logger are too intertwingly");
    }

    // log to the console
    switch (level) {
        case logger.LOG:   console.log(message); break;
        case logger.ERROR: console.log("ERROR: " + message); break;
        case logger.WARN:  console.log("WARN: "  + message); break;
        case logger.INFO:  console.log("INFO: "  + message); break;
        case logger.DEBUG: console.log("DEBUG: " + message); break;
    }
};

// when deviceready fires, log queued messages
logger.__onDeviceReady = function() {
    if (DeviceReady) return;

    DeviceReady = true;

    for (var i=0; i<Queued.length; i++) {
        var messageArgs = Queued[i];
        logger.logLevel(messageArgs[0], messageArgs[1]);
    }

    Queued = null;
};

// add a deviceready event to log queued messages
document.addEventListener("deviceready", logger.__onDeviceReady, false);

});

// file: lib/common/plugin/network.js
define("cordova/plugin/network", function(require, exports, module) {

var exec = require('cordova/exec'),
    cordova = require('cordova'),
    channel = require('cordova/channel'),
    utils = require('cordova/utils');

// Link the onLine property with the Cordova-supplied network info.
// This works because we clobber the naviagtor object with our own
// object in bootstrap.js.
if (typeof navigator != 'undefined') {
    utils.defineGetter(navigator, 'onLine', function() {
        return this.connection.type != 'none';
    });
}

function NetworkConnection() {
    this.type = 'unknown';
}

/**
 * Get connection info
 *
 * @param {Function} successCallback The function to call when the Connection data is available
 * @param {Function} errorCallback The function to call when there is an error getting the Connection data. (OPTIONAL)
 */
NetworkConnection.prototype.getInfo = function(successCallback, errorCallback) {
    exec(successCallback, errorCallback, "NetworkStatus", "getConnectionInfo", []);
};

var me = new NetworkConnection();
var timerId = null;
var timeout = 500;

channel.onCordovaReady.subscribe(function() {
    me.getInfo(function(info) {
        me.type = info;
        if (info === "none") {
            // set a timer if still offline at the end of timer send the offline event
            timerId = setTimeout(function(){
                cordova.fireDocumentEvent("offline");
                timerId = null;
            }, timeout);
        } else {
            // If there is a current offline event pending clear it
            if (timerId !== null) {
                clearTimeout(timerId);
                timerId = null;
            }
            cordova.fireDocumentEvent("online");
        }

        // should only fire this once
        if (channel.onCordovaConnectionReady.state !== 2) {
            channel.onCordovaConnectionReady.fire();
        }
    },
    function (e) {
        // If we can't get the network info we should still tell Cordova
        // to fire the deviceready event.
        if (channel.onCordovaConnectionReady.state !== 2) {
            channel.onCordovaConnectionReady.fire();
        }
        console.log("Error initializing Network Connection: " + e);
    });
});

module.exports = me;

});

// file: lib/common/plugin/notification.js
define("cordova/plugin/notification", function(require, exports, module) {

var exec = require('cordova/exec');

/**
 * Provides access to notifications on the device.
 */

module.exports = {

    /**
     * Open a native alert dialog, with a customizable title and button text.
     *
     * @param {String} message              Message to print in the body of the alert
     * @param {Function} completeCallback   The callback that is called when user clicks on a button.
     * @param {String} title                Title of the alert dialog (default: Alert)
     * @param {String} buttonLabel          Label of the close button (default: OK)
     */
    alert: function(message, completeCallback, title, buttonLabel) {
        var _title = (title || "Alert");
        var _buttonLabel = (buttonLabel || "OK");
        exec(completeCallback, null, "Notification", "alert", [message, _title, _buttonLabel]);
    },

    /**
     * Open a native confirm dialog, with a customizable title and button text.
     * The result that the user selects is returned to the result callback.
     *
     * @param {String} message              Message to print in the body of the alert
     * @param {Function} resultCallback     The callback that is called when user clicks on a button.
     * @param {String} title                Title of the alert dialog (default: Confirm)
     * @param {String} buttonLabels         Comma separated list of the labels of the buttons (default: 'OK,Cancel')
     */
    confirm: function(message, resultCallback, title, buttonLabels) {
        var _title = (title || "Confirm");
        var _buttonLabels = (buttonLabels || "OK,Cancel");
        exec(resultCallback, null, "Notification", "confirm", [message, _title, _buttonLabels]);
    },

    /**
     * Causes the device to vibrate.
     *
     * @param {Integer} mills       The number of milliseconds to vibrate for.
     */
    vibrate: function(mills) {
        exec(null, null, "Notification", "vibrate", [mills]);
    },

    /**
     * Causes the device to beep.
     * On Android, the default notification ringtone is played "count" times.
     *
     * @param {Integer} count       The number of beeps.
     */
    beep: function(count) {
        exec(null, null, "Notification", "beep", [count]);
    }
};

});

// file: lib/common/plugin/requestFileSystem.js
define("cordova/plugin/requestFileSystem", function(require, exports, module) {

var argscheck = require('cordova/argscheck'),
    FileError = require('cordova/plugin/FileError'),
    FileSystem = require('cordova/plugin/FileSystem'),
    exec = require('cordova/exec');

/**
 * Request a file system in which to store application data.
 * @param type  local file system type
 * @param size  indicates how much storage space, in bytes, the application expects to need
 * @param successCallback  invoked with a FileSystem object
 * @param errorCallback  invoked if error occurs retrieving file system
 */
var requestFileSystem = function(type, size, successCallback, errorCallback) {
    argscheck.checkArgs('nnFF', 'requestFileSystem', arguments);
    var fail = function(code) {
        errorCallback && errorCallback(new FileError(code));
    };

    if (type < 0 || type > 3) {
        fail(FileError.SYNTAX_ERR);
    } else {
        // if successful, return a FileSystem object
        var success = function(file_system) {
            if (file_system) {
                if (successCallback) {
                    // grab the name and root from the file system object
                    var result = new FileSystem(file_system.name, file_system.root);
                    successCallback(result);
                }
            }
            else {
                // no FileSystem object returned
                fail(FileError.NOT_FOUND_ERR);
            }
        };
        exec(success, fail, "File", "requestFileSystem", [type, size]);
    }
};

module.exports = requestFileSystem;

});

// file: lib/common/plugin/resolveLocalFileSystemURI.js
define("cordova/plugin/resolveLocalFileSystemURI", function(require, exports, module) {

var argscheck = require('cordova/argscheck'),
    DirectoryEntry = require('cordova/plugin/DirectoryEntry'),
    FileEntry = require('cordova/plugin/FileEntry'),
    FileError = require('cordova/plugin/FileError'),
    exec = require('cordova/exec');

/**
 * Look up file system Entry referred to by local URI.
 * @param {DOMString} uri  URI referring to a local file or directory
 * @param successCallback  invoked with Entry object corresponding to URI
 * @param errorCallback    invoked if error occurs retrieving file system entry
 */
module.exports = function(uri, successCallback, errorCallback) {
    argscheck.checkArgs('sFF', 'resolveLocalFileSystemURI', arguments);
    // error callback
    var fail = function(error) {
        errorCallback && errorCallback(new FileError(error));
    };
    // sanity check for 'not:valid:filename'
    if(!uri || uri.split(":").length > 2) {
        setTimeout( function() {
            fail(FileError.ENCODING_ERR);
        },0);
        return;
    }
    // if successful, return either a file or directory entry
    var success = function(entry) {
        var result;
        if (entry) {
            if (successCallback) {
                // create appropriate Entry object
                result = (entry.isDirectory) ? new DirectoryEntry(entry.name, entry.fullPath) : new FileEntry(entry.name, entry.fullPath);
                successCallback(result);
            }
        }
        else {
            // no Entry object returned
            fail(FileError.NOT_FOUND_ERR);
        }
    };

    exec(success, fail, "File", "resolveLocalFileSystemURI", [uri]);
};

});

// file: lib/common/plugin/splashscreen.js
define("cordova/plugin/splashscreen", function(require, exports, module) {

var exec = require('cordova/exec');

var splashscreen = {
    show:function() {
        exec(null, null, "SplashScreen", "show", []);
    },
    hide:function() {
        exec(null, null, "SplashScreen", "hide", []);
    }
};

module.exports = splashscreen;

});

// file: lib/common/utils.js
define("cordova/utils", function(require, exports, module) {

var utils = exports;

/**
 * Defines a property getter / setter for obj[key].
 */
utils.defineGetterSetter = function(obj, key, getFunc, opt_setFunc) {
    if (Object.defineProperty) {
        var desc = {
            get: getFunc,
            configurable: true
        };
        if (opt_setFunc) {
            desc.set = opt_setFunc;
        }
        Object.defineProperty(obj, key, desc);
    } else {
        obj.__defineGetter__(key, getFunc);
        if (opt_setFunc) {
            obj.__defineSetter__(key, opt_setFunc);
        }
    }
};

/**
 * Defines a property getter for obj[key].
 */
utils.defineGetter = utils.defineGetterSetter;

utils.arrayIndexOf = function(a, item) {
    if (a.indexOf) {
        return a.indexOf(item);
    }
    var len = a.length;
    for (var i = 0; i < len; ++i) {
        if (a[i] == item) {
            return i;
        }
    }
    return -1;
};

/**
 * Returns whether the item was found in the array.
 */
utils.arrayRemove = function(a, item) {
    var index = utils.arrayIndexOf(a, item);
    if (index != -1) {
        a.splice(index, 1);
    }
    return index != -1;
};

utils.typeName = function(val) {
    return Object.prototype.toString.call(val).slice(8, -1);
};

/**
 * Returns an indication of whether the argument is an array or not
 */
utils.isArray = function(a) {
    return utils.typeName(a) == 'Array';
};

/**
 * Returns an indication of whether the argument is a Date or not
 */
utils.isDate = function(d) {
    return utils.typeName(d) == 'Date';
};

/**
 * Does a deep clone of the object.
 */
utils.clone = function(obj) {
    if(!obj || typeof obj == 'function' || utils.isDate(obj) || typeof obj != 'object') {
        return obj;
    }

    var retVal, i;

    if(utils.isArray(obj)){
        retVal = [];
        for(i = 0; i < obj.length; ++i){
            retVal.push(utils.clone(obj[i]));
        }
        return retVal;
    }

    retVal = {};
    for(i in obj){
        if(!(i in retVal) || retVal[i] != obj[i]) {
            retVal[i] = utils.clone(obj[i]);
        }
    }
    return retVal;
};

/**
 * Returns a wrapped version of the function
 */
utils.close = function(context, func, params) {
    if (typeof params == 'undefined') {
        return function() {
            return func.apply(context, arguments);
        };
    } else {
        return function() {
            return func.apply(context, params);
        };
    }
};

/**
 * Create a UUID
 */
utils.createUUID = function() {
    return UUIDcreatePart(4) + '-' +
        UUIDcreatePart(2) + '-' +
        UUIDcreatePart(2) + '-' +
        UUIDcreatePart(2) + '-' +
        UUIDcreatePart(6);
};

/**
 * Extends a child object from a parent object using classical inheritance
 * pattern.
 */
utils.extend = (function() {
    // proxy used to establish prototype chain
    var F = function() {};
    // extend Child from Parent
    return function(Child, Parent) {
        F.prototype = Parent.prototype;
        Child.prototype = new F();
        Child.__super__ = Parent.prototype;
        Child.prototype.constructor = Child;
    };
}());

/**
 * Alerts a message in any available way: alert or console.log.
 */
utils.alert = function(msg) {
    if (window.alert) {
        window.alert(msg);
    } else if (console && console.log) {
        console.log(msg);
    }
};

/**
 * Formats a string and arguments following it ala sprintf()
 *
 * see utils.vformat() for more information
 */
utils.format = function(formatString /* ,... */) {
    var args = [].slice.call(arguments, 1);
    return utils.vformat(formatString, args);
};

/**
 * Formats a string and arguments following it ala vsprintf()
 *
 * format chars:
 *   %j - format arg as JSON
 *   %o - format arg as JSON
 *   %c - format arg as ''
 *   %% - replace with '%'
 * any other char following % will format it's
 * arg via toString().
 *
 * for rationale, see FireBug's Console API:
 *    http://getfirebug.com/wiki/index.php/Console_API
 */
utils.vformat = function(formatString, args) {
    if (formatString === null || formatString === undefined) return "";
    if (arguments.length == 1) return formatString.toString();
    if (typeof formatString != "string") return formatString.toString();

    var pattern = /(.*?)%(.)(.*)/;
    var rest    = formatString;
    var result  = [];

    while (args.length) {
        var arg   = args.shift();
        var match = pattern.exec(rest);

        if (!match) break;

        rest = match[3];

        result.push(match[1]);

        if (match[2] == '%') {
            result.push('%');
            args.unshift(arg);
            continue;
        }

        result.push(formatted(arg, match[2]));
    }

    result.push(rest);

    return result.join('');
};

//------------------------------------------------------------------------------
function UUIDcreatePart(length) {
    var uuidpart = "";
    for (var i=0; i<length; i++) {
        var uuidchar = parseInt((Math.random() * 256), 10).toString(16);
        if (uuidchar.length == 1) {
            uuidchar = "0" + uuidchar;
        }
        uuidpart += uuidchar;
    }
    return uuidpart;
}

//------------------------------------------------------------------------------
function formatted(object, formatChar) {

    try {
        switch(formatChar) {
            case 'j':
            case 'o': return JSON.stringify(object);
            case 'c': return '';
        }
    }
    catch (e) {
        return "error JSON.stringify()ing argument: " + e;
    }

    if ((object === null) || (object === undefined)) {
        return Object.prototype.toString.call(object);
    }

    return object.toString();
}

});


window.cordova = require('cordova');

// file: lib/scripts/bootstrap.js

(function (context) {
    // Replace navigator before any modules are required(), to ensure it happens as soon as possible.
    // We replace it so that properties that can't be clobbered can instead be overridden.
    if (context.navigator) {
        var CordovaNavigator = function() {};
        CordovaNavigator.prototype = context.navigator;
        context.navigator = new CordovaNavigator();
    }

    var channel = require("cordova/channel"),
        _self = {
            boot: function () {
                /**
                 * Create all cordova objects once page has fully loaded and native side is ready.
                 */
                channel.join(function() {
                    var builder = require('cordova/builder'),
                        base = require('cordova/common'),
                        platform = require('cordova/platform');

                    // Drop the common globals into the window object, but be nice and don't overwrite anything.
                    builder.buildIntoButDoNotClobber(base.defaults, context);
                    builder.buildIntoAndClobber(base.clobbers, context);
                    builder.buildIntoAndMerge(base.merges, context);

                    builder.buildIntoButDoNotClobber(platform.defaults, context);
                    builder.buildIntoAndClobber(platform.clobbers, context);
                    builder.buildIntoAndMerge(platform.merges, context);

                    // Call the platform-specific initialization
                    platform.initialize();

                    // Fire event to notify that all objects are created
                    channel.onCordovaReady.fire();

                    // Fire onDeviceReady event once all constructors have run and
                    // cordova info has been received from native side.
                    channel.join(function() {
                        require('cordova').fireDocumentEvent('deviceready');
                    }, channel.deviceReadyChannelsArray);

                }, [ channel.onDOMContentLoaded, channel.onNativeReady ]);
            }
        };

    // boot up once native side is ready
    channel.onNativeReady.subscribe(_self.boot);

    // _nativeReady is global variable that the native side can set
    // to signify that the native code is ready. It is a global since
    // it may be called before any cordova JS is ready.
    if (window._nativeReady) {
        channel.onNativeReady.fire();
    }

}(window));


})();
;/* MIT licensed */
// (c) 2010 Jesse MacFadyen, Nitobi


(function() {

var cordovaRef = window.PhoneGap || window.Cordova || window.cordova; // old to new fallbacks

function ChildBrowser() {
    // Does nothing
}

// Callback when the location of the page changes
// called from native
ChildBrowser._onLocationChange = function(newLoc)
{
    window.plugins.childBrowser.onLocationChange(newLoc);
};

// Callback when the user chooses the 'Done' button
// called from native
ChildBrowser._onClose = function()
{
    window.plugins.childBrowser.onClose();
};

// Callback when the user chooses the 'open in Safari' button
// called from native
ChildBrowser._onOpenExternal = function()
{
    window.plugins.childBrowser.onOpenExternal();
};

// Pages loaded into the ChildBrowser can execute callback scripts, so be careful to
// check location, and make sure it is a location you trust.
// Warning ... don't exec arbitrary code, it's risky and could fuck up your app.
// called from native
ChildBrowser._onJSCallback = function(js,loc)
{
    // Not Implemented
    //window.plugins.childBrowser.onJSCallback(js,loc);
};

/* The interface that you will use to access functionality */

// Show a webpage, will result in a callback to onLocationChange
ChildBrowser.prototype.showWebPage = function(loc)
{
    cordovaRef.exec("ChildBrowserCommand.showWebPage", loc);
};

// close the browser, will NOT result in close callback
ChildBrowser.prototype.close = function()
{
    cordovaRef.exec("ChildBrowserCommand.close");
};

// Not Implemented
ChildBrowser.prototype.jsExec = function(jsString)
{
    // Not Implemented!!
    //PhoneGap.exec("ChildBrowserCommand.jsExec",jsString);
};

// Note: this plugin does NOT install itself, call this method some time after deviceready to install it
// it will be returned, and also available globally from window.plugins.childBrowser
ChildBrowser.install = function()
{
    if(!window.plugins) {
        window.plugins = {};
    }
        if ( ! window.plugins.childBrowser ) {
        window.plugins.childBrowser = new ChildBrowser();
    }

};


if (cordovaRef && cordovaRef.addConstructor) {
    cordovaRef.addConstructor(ChildBrowser.install);
} else {
    console.log("ChildBrowser Cordova Plugin could not be installed.");
    return null;
}


})();
;//
//  Filepicker.js
//
// Created by Albert Swantner and Jon Uy on .
//
// Copyright 2011-2012 Albert Swantner. All rights reserved.
// MIT Licensed

(function() {
	
	var cordovaRef = window.PhoneGap || window.Cordova || window.cordova; // old to new fallbacks

	function Filepicker() {
		//does nothing
	}

	Filepicker.prototype.pick = function(_options, _onSuccess, _onError) {
	
//	filepicker.pick({
//	    mimetypes: ['image/*', 'text/plain'],
//	    container: 'window',
//	    services:['COMPUTER', 'FACEBOOK', 'GMAIL'],
//	  },
//	  function(FPFile){
//	    console.log(JSON.stringify(FPFile));
//	  },
//	  function(FPError){
//	    console.log(FPError.toString());
//    }
//	);
		// Expected options:
		//  dataTypes: array - Specific data types. (Optional) Default is all files.
		//  sourceNames: array - Select and order the sources (Optional) Default is all sources.
		//  allowEditing: boolean - Set some of the in built Camera properties as you would with UIImagePicker.
		//  shouldUpload: boolean - When a user selects a local file, we'll upload it and return a remote url.
		//  shouldDownload: boolean - When a user selects a remote file, we'll download it and return the filedata to you.

		var successCallback = function(result) {
			if (typeof _onSuccess == 'function') {
				_onSuccess.apply(null, [result]);
			}
		};

		var errorCallback = function(result) {
			if (typeof _onError == 'function') {
				_onError.apply(null, [result]);
			}
		};
		
		return cordova.exec(successCallback, errorCallback, 'Filepicker', 'pick', [_options]);
	};

	Filepicker.prototype.save = function(_options, _onSuccess, _onError) {
		var successCallback = function(result) {
			if (typeof _onSuccess == 'function') {
				_onSuccess.apply(null, [result]);
			}
		};

		var errorCallback = function(result) {
			if (typeof _onError == 'function') {
				_onError.apply(null, [result]);
			}
		};

		return cordova.exec(successCallback, errorCallback, 'Filepicker', 'save', [_options]);
	};

	cordova.addConstructor(function() {
		if(!window.plugins) window.plugins = {};
		window.plugins.filepicker = new Filepicker();
	});

})(window.cordova || window.Cordova);
;/*! jQuery v1.10.2 | (c) 2005, 2013 jQuery Foundation, Inc. | jquery.org/license
//@ sourceMappingURL=jquery-1.10.2.min.map
*/
(function(e,t){var n,r,i=typeof t,o=e.location,a=e.document,s=a.documentElement,l=e.jQuery,u=e.$,c={},p=[],f="1.10.2",d=p.concat,h=p.push,g=p.slice,m=p.indexOf,y=c.toString,v=c.hasOwnProperty,b=f.trim,x=function(e,t){return new x.fn.init(e,t,r)},w=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,T=/\S+/g,C=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,N=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,k=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,E=/^[\],:{}\s]*$/,S=/(?:^|:|,)(?:\s*\[)+/g,A=/\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,j=/"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,D=/^-ms-/,L=/-([\da-z])/gi,H=function(e,t){return t.toUpperCase()},q=function(e){(a.addEventListener||"load"===e.type||"complete"===a.readyState)&&(_(),x.ready())},_=function(){a.addEventListener?(a.removeEventListener("DOMContentLoaded",q,!1),e.removeEventListener("load",q,!1)):(a.detachEvent("onreadystatechange",q),e.detachEvent("onload",q))};x.fn=x.prototype={jquery:f,constructor:x,init:function(e,n,r){var i,o;if(!e)return this;if("string"==typeof e){if(i="<"===e.charAt(0)&&">"===e.charAt(e.length-1)&&e.length>=3?[null,e,null]:N.exec(e),!i||!i[1]&&n)return!n||n.jquery?(n||r).find(e):this.constructor(n).find(e);if(i[1]){if(n=n instanceof x?n[0]:n,x.merge(this,x.parseHTML(i[1],n&&n.nodeType?n.ownerDocument||n:a,!0)),k.test(i[1])&&x.isPlainObject(n))for(i in n)x.isFunction(this[i])?this[i](n[i]):this.attr(i,n[i]);return this}if(o=a.getElementById(i[2]),o&&o.parentNode){if(o.id!==i[2])return r.find(e);this.length=1,this[0]=o}return this.context=a,this.selector=e,this}return e.nodeType?(this.context=this[0]=e,this.length=1,this):x.isFunction(e)?r.ready(e):(e.selector!==t&&(this.selector=e.selector,this.context=e.context),x.makeArray(e,this))},selector:"",length:0,toArray:function(){return g.call(this)},get:function(e){return null==e?this.toArray():0>e?this[this.length+e]:this[e]},pushStack:function(e){var t=x.merge(this.constructor(),e);return t.prevObject=this,t.context=this.context,t},each:function(e,t){return x.each(this,e,t)},ready:function(e){return x.ready.promise().done(e),this},slice:function(){return this.pushStack(g.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(e){var t=this.length,n=+e+(0>e?t:0);return this.pushStack(n>=0&&t>n?[this[n]]:[])},map:function(e){return this.pushStack(x.map(this,function(t,n){return e.call(t,n,t)}))},end:function(){return this.prevObject||this.constructor(null)},push:h,sort:[].sort,splice:[].splice},x.fn.init.prototype=x.fn,x.extend=x.fn.extend=function(){var e,n,r,i,o,a,s=arguments[0]||{},l=1,u=arguments.length,c=!1;for("boolean"==typeof s&&(c=s,s=arguments[1]||{},l=2),"object"==typeof s||x.isFunction(s)||(s={}),u===l&&(s=this,--l);u>l;l++)if(null!=(o=arguments[l]))for(i in o)e=s[i],r=o[i],s!==r&&(c&&r&&(x.isPlainObject(r)||(n=x.isArray(r)))?(n?(n=!1,a=e&&x.isArray(e)?e:[]):a=e&&x.isPlainObject(e)?e:{},s[i]=x.extend(c,a,r)):r!==t&&(s[i]=r));return s},x.extend({expando:"jQuery"+(f+Math.random()).replace(/\D/g,""),noConflict:function(t){return e.$===x&&(e.$=u),t&&e.jQuery===x&&(e.jQuery=l),x},isReady:!1,readyWait:1,holdReady:function(e){e?x.readyWait++:x.ready(!0)},ready:function(e){if(e===!0?!--x.readyWait:!x.isReady){if(!a.body)return setTimeout(x.ready);x.isReady=!0,e!==!0&&--x.readyWait>0||(n.resolveWith(a,[x]),x.fn.trigger&&x(a).trigger("ready").off("ready"))}},isFunction:function(e){return"function"===x.type(e)},isArray:Array.isArray||function(e){return"array"===x.type(e)},isWindow:function(e){return null!=e&&e==e.window},isNumeric:function(e){return!isNaN(parseFloat(e))&&isFinite(e)},type:function(e){return null==e?e+"":"object"==typeof e||"function"==typeof e?c[y.call(e)]||"object":typeof e},isPlainObject:function(e){var n;if(!e||"object"!==x.type(e)||e.nodeType||x.isWindow(e))return!1;try{if(e.constructor&&!v.call(e,"constructor")&&!v.call(e.constructor.prototype,"isPrototypeOf"))return!1}catch(r){return!1}if(x.support.ownLast)for(n in e)return v.call(e,n);for(n in e);return n===t||v.call(e,n)},isEmptyObject:function(e){var t;for(t in e)return!1;return!0},error:function(e){throw Error(e)},parseHTML:function(e,t,n){if(!e||"string"!=typeof e)return null;"boolean"==typeof t&&(n=t,t=!1),t=t||a;var r=k.exec(e),i=!n&&[];return r?[t.createElement(r[1])]:(r=x.buildFragment([e],t,i),i&&x(i).remove(),x.merge([],r.childNodes))},parseJSON:function(n){return e.JSON&&e.JSON.parse?e.JSON.parse(n):null===n?n:"string"==typeof n&&(n=x.trim(n),n&&E.test(n.replace(A,"@").replace(j,"]").replace(S,"")))?Function("return "+n)():(x.error("Invalid JSON: "+n),t)},parseXML:function(n){var r,i;if(!n||"string"!=typeof n)return null;try{e.DOMParser?(i=new DOMParser,r=i.parseFromString(n,"text/xml")):(r=new ActiveXObject("Microsoft.XMLDOM"),r.async="false",r.loadXML(n))}catch(o){r=t}return r&&r.documentElement&&!r.getElementsByTagName("parsererror").length||x.error("Invalid XML: "+n),r},noop:function(){},globalEval:function(t){t&&x.trim(t)&&(e.execScript||function(t){e.eval.call(e,t)})(t)},camelCase:function(e){return e.replace(D,"ms-").replace(L,H)},nodeName:function(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()},each:function(e,t,n){var r,i=0,o=e.length,a=M(e);if(n){if(a){for(;o>i;i++)if(r=t.apply(e[i],n),r===!1)break}else for(i in e)if(r=t.apply(e[i],n),r===!1)break}else if(a){for(;o>i;i++)if(r=t.call(e[i],i,e[i]),r===!1)break}else for(i in e)if(r=t.call(e[i],i,e[i]),r===!1)break;return e},trim:b&&!b.call("\ufeff\u00a0")?function(e){return null==e?"":b.call(e)}:function(e){return null==e?"":(e+"").replace(C,"")},makeArray:function(e,t){var n=t||[];return null!=e&&(M(Object(e))?x.merge(n,"string"==typeof e?[e]:e):h.call(n,e)),n},inArray:function(e,t,n){var r;if(t){if(m)return m.call(t,e,n);for(r=t.length,n=n?0>n?Math.max(0,r+n):n:0;r>n;n++)if(n in t&&t[n]===e)return n}return-1},merge:function(e,n){var r=n.length,i=e.length,o=0;if("number"==typeof r)for(;r>o;o++)e[i++]=n[o];else while(n[o]!==t)e[i++]=n[o++];return e.length=i,e},grep:function(e,t,n){var r,i=[],o=0,a=e.length;for(n=!!n;a>o;o++)r=!!t(e[o],o),n!==r&&i.push(e[o]);return i},map:function(e,t,n){var r,i=0,o=e.length,a=M(e),s=[];if(a)for(;o>i;i++)r=t(e[i],i,n),null!=r&&(s[s.length]=r);else for(i in e)r=t(e[i],i,n),null!=r&&(s[s.length]=r);return d.apply([],s)},guid:1,proxy:function(e,n){var r,i,o;return"string"==typeof n&&(o=e[n],n=e,e=o),x.isFunction(e)?(r=g.call(arguments,2),i=function(){return e.apply(n||this,r.concat(g.call(arguments)))},i.guid=e.guid=e.guid||x.guid++,i):t},access:function(e,n,r,i,o,a,s){var l=0,u=e.length,c=null==r;if("object"===x.type(r)){o=!0;for(l in r)x.access(e,n,l,r[l],!0,a,s)}else if(i!==t&&(o=!0,x.isFunction(i)||(s=!0),c&&(s?(n.call(e,i),n=null):(c=n,n=function(e,t,n){return c.call(x(e),n)})),n))for(;u>l;l++)n(e[l],r,s?i:i.call(e[l],l,n(e[l],r)));return o?e:c?n.call(e):u?n(e[0],r):a},now:function(){return(new Date).getTime()},swap:function(e,t,n,r){var i,o,a={};for(o in t)a[o]=e.style[o],e.style[o]=t[o];i=n.apply(e,r||[]);for(o in t)e.style[o]=a[o];return i}}),x.ready.promise=function(t){if(!n)if(n=x.Deferred(),"complete"===a.readyState)setTimeout(x.ready);else if(a.addEventListener)a.addEventListener("DOMContentLoaded",q,!1),e.addEventListener("load",q,!1);else{a.attachEvent("onreadystatechange",q),e.attachEvent("onload",q);var r=!1;try{r=null==e.frameElement&&a.documentElement}catch(i){}r&&r.doScroll&&function o(){if(!x.isReady){try{r.doScroll("left")}catch(e){return setTimeout(o,50)}_(),x.ready()}}()}return n.promise(t)},x.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(e,t){c["[object "+t+"]"]=t.toLowerCase()});function M(e){var t=e.length,n=x.type(e);return x.isWindow(e)?!1:1===e.nodeType&&t?!0:"array"===n||"function"!==n&&(0===t||"number"==typeof t&&t>0&&t-1 in e)}r=x(a),function(e,t){var n,r,i,o,a,s,l,u,c,p,f,d,h,g,m,y,v,b="sizzle"+-new Date,w=e.document,T=0,C=0,N=st(),k=st(),E=st(),S=!1,A=function(e,t){return e===t?(S=!0,0):0},j=typeof t,D=1<<31,L={}.hasOwnProperty,H=[],q=H.pop,_=H.push,M=H.push,O=H.slice,F=H.indexOf||function(e){var t=0,n=this.length;for(;n>t;t++)if(this[t]===e)return t;return-1},B="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",P="[\\x20\\t\\r\\n\\f]",R="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",W=R.replace("w","w#"),$="\\["+P+"*("+R+")"+P+"*(?:([*^$|!~]?=)"+P+"*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|("+W+")|)|)"+P+"*\\]",I=":("+R+")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|"+$.replace(3,8)+")*)|.*)\\)|)",z=RegExp("^"+P+"+|((?:^|[^\\\\])(?:\\\\.)*)"+P+"+$","g"),X=RegExp("^"+P+"*,"+P+"*"),U=RegExp("^"+P+"*([>+~]|"+P+")"+P+"*"),V=RegExp(P+"*[+~]"),Y=RegExp("="+P+"*([^\\]'\"]*)"+P+"*\\]","g"),J=RegExp(I),G=RegExp("^"+W+"$"),Q={ID:RegExp("^#("+R+")"),CLASS:RegExp("^\\.("+R+")"),TAG:RegExp("^("+R.replace("w","w*")+")"),ATTR:RegExp("^"+$),PSEUDO:RegExp("^"+I),CHILD:RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+P+"*(even|odd|(([+-]|)(\\d*)n|)"+P+"*(?:([+-]|)"+P+"*(\\d+)|))"+P+"*\\)|)","i"),bool:RegExp("^(?:"+B+")$","i"),needsContext:RegExp("^"+P+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+P+"*((?:-\\d)?\\d*)"+P+"*\\)|)(?=[^-]|$)","i")},K=/^[^{]+\{\s*\[native \w/,Z=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,et=/^(?:input|select|textarea|button)$/i,tt=/^h\d$/i,nt=/'|\\/g,rt=RegExp("\\\\([\\da-f]{1,6}"+P+"?|("+P+")|.)","ig"),it=function(e,t,n){var r="0x"+t-65536;return r!==r||n?t:0>r?String.fromCharCode(r+65536):String.fromCharCode(55296|r>>10,56320|1023&r)};try{M.apply(H=O.call(w.childNodes),w.childNodes),H[w.childNodes.length].nodeType}catch(ot){M={apply:H.length?function(e,t){_.apply(e,O.call(t))}:function(e,t){var n=e.length,r=0;while(e[n++]=t[r++]);e.length=n-1}}}function at(e,t,n,i){var o,a,s,l,u,c,d,m,y,x;if((t?t.ownerDocument||t:w)!==f&&p(t),t=t||f,n=n||[],!e||"string"!=typeof e)return n;if(1!==(l=t.nodeType)&&9!==l)return[];if(h&&!i){if(o=Z.exec(e))if(s=o[1]){if(9===l){if(a=t.getElementById(s),!a||!a.parentNode)return n;if(a.id===s)return n.push(a),n}else if(t.ownerDocument&&(a=t.ownerDocument.getElementById(s))&&v(t,a)&&a.id===s)return n.push(a),n}else{if(o[2])return M.apply(n,t.getElementsByTagName(e)),n;if((s=o[3])&&r.getElementsByClassName&&t.getElementsByClassName)return M.apply(n,t.getElementsByClassName(s)),n}if(r.qsa&&(!g||!g.test(e))){if(m=d=b,y=t,x=9===l&&e,1===l&&"object"!==t.nodeName.toLowerCase()){c=mt(e),(d=t.getAttribute("id"))?m=d.replace(nt,"\\$&"):t.setAttribute("id",m),m="[id='"+m+"'] ",u=c.length;while(u--)c[u]=m+yt(c[u]);y=V.test(e)&&t.parentNode||t,x=c.join(",")}if(x)try{return M.apply(n,y.querySelectorAll(x)),n}catch(T){}finally{d||t.removeAttribute("id")}}}return kt(e.replace(z,"$1"),t,n,i)}function st(){var e=[];function t(n,r){return e.push(n+=" ")>o.cacheLength&&delete t[e.shift()],t[n]=r}return t}function lt(e){return e[b]=!0,e}function ut(e){var t=f.createElement("div");try{return!!e(t)}catch(n){return!1}finally{t.parentNode&&t.parentNode.removeChild(t),t=null}}function ct(e,t){var n=e.split("|"),r=e.length;while(r--)o.attrHandle[n[r]]=t}function pt(e,t){var n=t&&e,r=n&&1===e.nodeType&&1===t.nodeType&&(~t.sourceIndex||D)-(~e.sourceIndex||D);if(r)return r;if(n)while(n=n.nextSibling)if(n===t)return-1;return e?1:-1}function ft(e){return function(t){var n=t.nodeName.toLowerCase();return"input"===n&&t.type===e}}function dt(e){return function(t){var n=t.nodeName.toLowerCase();return("input"===n||"button"===n)&&t.type===e}}function ht(e){return lt(function(t){return t=+t,lt(function(n,r){var i,o=e([],n.length,t),a=o.length;while(a--)n[i=o[a]]&&(n[i]=!(r[i]=n[i]))})})}s=at.isXML=function(e){var t=e&&(e.ownerDocument||e).documentElement;return t?"HTML"!==t.nodeName:!1},r=at.support={},p=at.setDocument=function(e){var n=e?e.ownerDocument||e:w,i=n.defaultView;return n!==f&&9===n.nodeType&&n.documentElement?(f=n,d=n.documentElement,h=!s(n),i&&i.attachEvent&&i!==i.top&&i.attachEvent("onbeforeunload",function(){p()}),r.attributes=ut(function(e){return e.className="i",!e.getAttribute("className")}),r.getElementsByTagName=ut(function(e){return e.appendChild(n.createComment("")),!e.getElementsByTagName("*").length}),r.getElementsByClassName=ut(function(e){return e.innerHTML="<div class='a'></div><div class='a i'></div>",e.firstChild.className="i",2===e.getElementsByClassName("i").length}),r.getById=ut(function(e){return d.appendChild(e).id=b,!n.getElementsByName||!n.getElementsByName(b).length}),r.getById?(o.find.ID=function(e,t){if(typeof t.getElementById!==j&&h){var n=t.getElementById(e);return n&&n.parentNode?[n]:[]}},o.filter.ID=function(e){var t=e.replace(rt,it);return function(e){return e.getAttribute("id")===t}}):(delete o.find.ID,o.filter.ID=function(e){var t=e.replace(rt,it);return function(e){var n=typeof e.getAttributeNode!==j&&e.getAttributeNode("id");return n&&n.value===t}}),o.find.TAG=r.getElementsByTagName?function(e,n){return typeof n.getElementsByTagName!==j?n.getElementsByTagName(e):t}:function(e,t){var n,r=[],i=0,o=t.getElementsByTagName(e);if("*"===e){while(n=o[i++])1===n.nodeType&&r.push(n);return r}return o},o.find.CLASS=r.getElementsByClassName&&function(e,n){return typeof n.getElementsByClassName!==j&&h?n.getElementsByClassName(e):t},m=[],g=[],(r.qsa=K.test(n.querySelectorAll))&&(ut(function(e){e.innerHTML="<select><option selected=''></option></select>",e.querySelectorAll("[selected]").length||g.push("\\["+P+"*(?:value|"+B+")"),e.querySelectorAll(":checked").length||g.push(":checked")}),ut(function(e){var t=n.createElement("input");t.setAttribute("type","hidden"),e.appendChild(t).setAttribute("t",""),e.querySelectorAll("[t^='']").length&&g.push("[*^$]="+P+"*(?:''|\"\")"),e.querySelectorAll(":enabled").length||g.push(":enabled",":disabled"),e.querySelectorAll("*,:x"),g.push(",.*:")})),(r.matchesSelector=K.test(y=d.webkitMatchesSelector||d.mozMatchesSelector||d.oMatchesSelector||d.msMatchesSelector))&&ut(function(e){r.disconnectedMatch=y.call(e,"div"),y.call(e,"[s!='']:x"),m.push("!=",I)}),g=g.length&&RegExp(g.join("|")),m=m.length&&RegExp(m.join("|")),v=K.test(d.contains)||d.compareDocumentPosition?function(e,t){var n=9===e.nodeType?e.documentElement:e,r=t&&t.parentNode;return e===r||!(!r||1!==r.nodeType||!(n.contains?n.contains(r):e.compareDocumentPosition&&16&e.compareDocumentPosition(r)))}:function(e,t){if(t)while(t=t.parentNode)if(t===e)return!0;return!1},A=d.compareDocumentPosition?function(e,t){if(e===t)return S=!0,0;var i=t.compareDocumentPosition&&e.compareDocumentPosition&&e.compareDocumentPosition(t);return i?1&i||!r.sortDetached&&t.compareDocumentPosition(e)===i?e===n||v(w,e)?-1:t===n||v(w,t)?1:c?F.call(c,e)-F.call(c,t):0:4&i?-1:1:e.compareDocumentPosition?-1:1}:function(e,t){var r,i=0,o=e.parentNode,a=t.parentNode,s=[e],l=[t];if(e===t)return S=!0,0;if(!o||!a)return e===n?-1:t===n?1:o?-1:a?1:c?F.call(c,e)-F.call(c,t):0;if(o===a)return pt(e,t);r=e;while(r=r.parentNode)s.unshift(r);r=t;while(r=r.parentNode)l.unshift(r);while(s[i]===l[i])i++;return i?pt(s[i],l[i]):s[i]===w?-1:l[i]===w?1:0},n):f},at.matches=function(e,t){return at(e,null,null,t)},at.matchesSelector=function(e,t){if((e.ownerDocument||e)!==f&&p(e),t=t.replace(Y,"='$1']"),!(!r.matchesSelector||!h||m&&m.test(t)||g&&g.test(t)))try{var n=y.call(e,t);if(n||r.disconnectedMatch||e.document&&11!==e.document.nodeType)return n}catch(i){}return at(t,f,null,[e]).length>0},at.contains=function(e,t){return(e.ownerDocument||e)!==f&&p(e),v(e,t)},at.attr=function(e,n){(e.ownerDocument||e)!==f&&p(e);var i=o.attrHandle[n.toLowerCase()],a=i&&L.call(o.attrHandle,n.toLowerCase())?i(e,n,!h):t;return a===t?r.attributes||!h?e.getAttribute(n):(a=e.getAttributeNode(n))&&a.specified?a.value:null:a},at.error=function(e){throw Error("Syntax error, unrecognized expression: "+e)},at.uniqueSort=function(e){var t,n=[],i=0,o=0;if(S=!r.detectDuplicates,c=!r.sortStable&&e.slice(0),e.sort(A),S){while(t=e[o++])t===e[o]&&(i=n.push(o));while(i--)e.splice(n[i],1)}return e},a=at.getText=function(e){var t,n="",r=0,i=e.nodeType;if(i){if(1===i||9===i||11===i){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=a(e)}else if(3===i||4===i)return e.nodeValue}else for(;t=e[r];r++)n+=a(t);return n},o=at.selectors={cacheLength:50,createPseudo:lt,match:Q,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(rt,it),e[3]=(e[4]||e[5]||"").replace(rt,it),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||at.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&at.error(e[0]),e},PSEUDO:function(e){var n,r=!e[5]&&e[2];return Q.CHILD.test(e[0])?null:(e[3]&&e[4]!==t?e[2]=e[4]:r&&J.test(r)&&(n=mt(r,!0))&&(n=r.indexOf(")",r.length-n)-r.length)&&(e[0]=e[0].slice(0,n),e[2]=r.slice(0,n)),e.slice(0,3))}},filter:{TAG:function(e){var t=e.replace(rt,it).toLowerCase();return"*"===e?function(){return!0}:function(e){return e.nodeName&&e.nodeName.toLowerCase()===t}},CLASS:function(e){var t=N[e+" "];return t||(t=RegExp("(^|"+P+")"+e+"("+P+"|$)"))&&N(e,function(e){return t.test("string"==typeof e.className&&e.className||typeof e.getAttribute!==j&&e.getAttribute("class")||"")})},ATTR:function(e,t,n){return function(r){var i=at.attr(r,e);return null==i?"!="===t:t?(i+="","="===t?i===n:"!="===t?i!==n:"^="===t?n&&0===i.indexOf(n):"*="===t?n&&i.indexOf(n)>-1:"$="===t?n&&i.slice(-n.length)===n:"~="===t?(" "+i+" ").indexOf(n)>-1:"|="===t?i===n||i.slice(0,n.length+1)===n+"-":!1):!0}},CHILD:function(e,t,n,r,i){var o="nth"!==e.slice(0,3),a="last"!==e.slice(-4),s="of-type"===t;return 1===r&&0===i?function(e){return!!e.parentNode}:function(t,n,l){var u,c,p,f,d,h,g=o!==a?"nextSibling":"previousSibling",m=t.parentNode,y=s&&t.nodeName.toLowerCase(),v=!l&&!s;if(m){if(o){while(g){p=t;while(p=p[g])if(s?p.nodeName.toLowerCase()===y:1===p.nodeType)return!1;h=g="only"===e&&!h&&"nextSibling"}return!0}if(h=[a?m.firstChild:m.lastChild],a&&v){c=m[b]||(m[b]={}),u=c[e]||[],d=u[0]===T&&u[1],f=u[0]===T&&u[2],p=d&&m.childNodes[d];while(p=++d&&p&&p[g]||(f=d=0)||h.pop())if(1===p.nodeType&&++f&&p===t){c[e]=[T,d,f];break}}else if(v&&(u=(t[b]||(t[b]={}))[e])&&u[0]===T)f=u[1];else while(p=++d&&p&&p[g]||(f=d=0)||h.pop())if((s?p.nodeName.toLowerCase()===y:1===p.nodeType)&&++f&&(v&&((p[b]||(p[b]={}))[e]=[T,f]),p===t))break;return f-=i,f===r||0===f%r&&f/r>=0}}},PSEUDO:function(e,t){var n,r=o.pseudos[e]||o.setFilters[e.toLowerCase()]||at.error("unsupported pseudo: "+e);return r[b]?r(t):r.length>1?(n=[e,e,"",t],o.setFilters.hasOwnProperty(e.toLowerCase())?lt(function(e,n){var i,o=r(e,t),a=o.length;while(a--)i=F.call(e,o[a]),e[i]=!(n[i]=o[a])}):function(e){return r(e,0,n)}):r}},pseudos:{not:lt(function(e){var t=[],n=[],r=l(e.replace(z,"$1"));return r[b]?lt(function(e,t,n,i){var o,a=r(e,null,i,[]),s=e.length;while(s--)(o=a[s])&&(e[s]=!(t[s]=o))}):function(e,i,o){return t[0]=e,r(t,null,o,n),!n.pop()}}),has:lt(function(e){return function(t){return at(e,t).length>0}}),contains:lt(function(e){return function(t){return(t.textContent||t.innerText||a(t)).indexOf(e)>-1}}),lang:lt(function(e){return G.test(e||"")||at.error("unsupported lang: "+e),e=e.replace(rt,it).toLowerCase(),function(t){var n;do if(n=h?t.lang:t.getAttribute("xml:lang")||t.getAttribute("lang"))return n=n.toLowerCase(),n===e||0===n.indexOf(e+"-");while((t=t.parentNode)&&1===t.nodeType);return!1}}),target:function(t){var n=e.location&&e.location.hash;return n&&n.slice(1)===t.id},root:function(e){return e===d},focus:function(e){return e===f.activeElement&&(!f.hasFocus||f.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},enabled:function(e){return e.disabled===!1},disabled:function(e){return e.disabled===!0},checked:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&!!e.checked||"option"===t&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,e.selected===!0},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeName>"@"||3===e.nodeType||4===e.nodeType)return!1;return!0},parent:function(e){return!o.pseudos.empty(e)},header:function(e){return tt.test(e.nodeName)},input:function(e){return et.test(e.nodeName)},button:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&"button"===e.type||"button"===t},text:function(e){var t;return"input"===e.nodeName.toLowerCase()&&"text"===e.type&&(null==(t=e.getAttribute("type"))||t.toLowerCase()===e.type)},first:ht(function(){return[0]}),last:ht(function(e,t){return[t-1]}),eq:ht(function(e,t,n){return[0>n?n+t:n]}),even:ht(function(e,t){var n=0;for(;t>n;n+=2)e.push(n);return e}),odd:ht(function(e,t){var n=1;for(;t>n;n+=2)e.push(n);return e}),lt:ht(function(e,t,n){var r=0>n?n+t:n;for(;--r>=0;)e.push(r);return e}),gt:ht(function(e,t,n){var r=0>n?n+t:n;for(;t>++r;)e.push(r);return e})}},o.pseudos.nth=o.pseudos.eq;for(n in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})o.pseudos[n]=ft(n);for(n in{submit:!0,reset:!0})o.pseudos[n]=dt(n);function gt(){}gt.prototype=o.filters=o.pseudos,o.setFilters=new gt;function mt(e,t){var n,r,i,a,s,l,u,c=k[e+" "];if(c)return t?0:c.slice(0);s=e,l=[],u=o.preFilter;while(s){(!n||(r=X.exec(s)))&&(r&&(s=s.slice(r[0].length)||s),l.push(i=[])),n=!1,(r=U.exec(s))&&(n=r.shift(),i.push({value:n,type:r[0].replace(z," ")}),s=s.slice(n.length));for(a in o.filter)!(r=Q[a].exec(s))||u[a]&&!(r=u[a](r))||(n=r.shift(),i.push({value:n,type:a,matches:r}),s=s.slice(n.length));if(!n)break}return t?s.length:s?at.error(e):k(e,l).slice(0)}function yt(e){var t=0,n=e.length,r="";for(;n>t;t++)r+=e[t].value;return r}function vt(e,t,n){var r=t.dir,o=n&&"parentNode"===r,a=C++;return t.first?function(t,n,i){while(t=t[r])if(1===t.nodeType||o)return e(t,n,i)}:function(t,n,s){var l,u,c,p=T+" "+a;if(s){while(t=t[r])if((1===t.nodeType||o)&&e(t,n,s))return!0}else while(t=t[r])if(1===t.nodeType||o)if(c=t[b]||(t[b]={}),(u=c[r])&&u[0]===p){if((l=u[1])===!0||l===i)return l===!0}else if(u=c[r]=[p],u[1]=e(t,n,s)||i,u[1]===!0)return!0}}function bt(e){return e.length>1?function(t,n,r){var i=e.length;while(i--)if(!e[i](t,n,r))return!1;return!0}:e[0]}function xt(e,t,n,r,i){var o,a=[],s=0,l=e.length,u=null!=t;for(;l>s;s++)(o=e[s])&&(!n||n(o,r,i))&&(a.push(o),u&&t.push(s));return a}function wt(e,t,n,r,i,o){return r&&!r[b]&&(r=wt(r)),i&&!i[b]&&(i=wt(i,o)),lt(function(o,a,s,l){var u,c,p,f=[],d=[],h=a.length,g=o||Nt(t||"*",s.nodeType?[s]:s,[]),m=!e||!o&&t?g:xt(g,f,e,s,l),y=n?i||(o?e:h||r)?[]:a:m;if(n&&n(m,y,s,l),r){u=xt(y,d),r(u,[],s,l),c=u.length;while(c--)(p=u[c])&&(y[d[c]]=!(m[d[c]]=p))}if(o){if(i||e){if(i){u=[],c=y.length;while(c--)(p=y[c])&&u.push(m[c]=p);i(null,y=[],u,l)}c=y.length;while(c--)(p=y[c])&&(u=i?F.call(o,p):f[c])>-1&&(o[u]=!(a[u]=p))}}else y=xt(y===a?y.splice(h,y.length):y),i?i(null,a,y,l):M.apply(a,y)})}function Tt(e){var t,n,r,i=e.length,a=o.relative[e[0].type],s=a||o.relative[" "],l=a?1:0,c=vt(function(e){return e===t},s,!0),p=vt(function(e){return F.call(t,e)>-1},s,!0),f=[function(e,n,r){return!a&&(r||n!==u)||((t=n).nodeType?c(e,n,r):p(e,n,r))}];for(;i>l;l++)if(n=o.relative[e[l].type])f=[vt(bt(f),n)];else{if(n=o.filter[e[l].type].apply(null,e[l].matches),n[b]){for(r=++l;i>r;r++)if(o.relative[e[r].type])break;return wt(l>1&&bt(f),l>1&&yt(e.slice(0,l-1).concat({value:" "===e[l-2].type?"*":""})).replace(z,"$1"),n,r>l&&Tt(e.slice(l,r)),i>r&&Tt(e=e.slice(r)),i>r&&yt(e))}f.push(n)}return bt(f)}function Ct(e,t){var n=0,r=t.length>0,a=e.length>0,s=function(s,l,c,p,d){var h,g,m,y=[],v=0,b="0",x=s&&[],w=null!=d,C=u,N=s||a&&o.find.TAG("*",d&&l.parentNode||l),k=T+=null==C?1:Math.random()||.1;for(w&&(u=l!==f&&l,i=n);null!=(h=N[b]);b++){if(a&&h){g=0;while(m=e[g++])if(m(h,l,c)){p.push(h);break}w&&(T=k,i=++n)}r&&((h=!m&&h)&&v--,s&&x.push(h))}if(v+=b,r&&b!==v){g=0;while(m=t[g++])m(x,y,l,c);if(s){if(v>0)while(b--)x[b]||y[b]||(y[b]=q.call(p));y=xt(y)}M.apply(p,y),w&&!s&&y.length>0&&v+t.length>1&&at.uniqueSort(p)}return w&&(T=k,u=C),x};return r?lt(s):s}l=at.compile=function(e,t){var n,r=[],i=[],o=E[e+" "];if(!o){t||(t=mt(e)),n=t.length;while(n--)o=Tt(t[n]),o[b]?r.push(o):i.push(o);o=E(e,Ct(i,r))}return o};function Nt(e,t,n){var r=0,i=t.length;for(;i>r;r++)at(e,t[r],n);return n}function kt(e,t,n,i){var a,s,u,c,p,f=mt(e);if(!i&&1===f.length){if(s=f[0]=f[0].slice(0),s.length>2&&"ID"===(u=s[0]).type&&r.getById&&9===t.nodeType&&h&&o.relative[s[1].type]){if(t=(o.find.ID(u.matches[0].replace(rt,it),t)||[])[0],!t)return n;e=e.slice(s.shift().value.length)}a=Q.needsContext.test(e)?0:s.length;while(a--){if(u=s[a],o.relative[c=u.type])break;if((p=o.find[c])&&(i=p(u.matches[0].replace(rt,it),V.test(s[0].type)&&t.parentNode||t))){if(s.splice(a,1),e=i.length&&yt(s),!e)return M.apply(n,i),n;break}}}return l(e,f)(i,t,!h,n,V.test(e)),n}r.sortStable=b.split("").sort(A).join("")===b,r.detectDuplicates=S,p(),r.sortDetached=ut(function(e){return 1&e.compareDocumentPosition(f.createElement("div"))}),ut(function(e){return e.innerHTML="<a href='#'></a>","#"===e.firstChild.getAttribute("href")})||ct("type|href|height|width",function(e,n,r){return r?t:e.getAttribute(n,"type"===n.toLowerCase()?1:2)}),r.attributes&&ut(function(e){return e.innerHTML="<input/>",e.firstChild.setAttribute("value",""),""===e.firstChild.getAttribute("value")})||ct("value",function(e,n,r){return r||"input"!==e.nodeName.toLowerCase()?t:e.defaultValue}),ut(function(e){return null==e.getAttribute("disabled")})||ct(B,function(e,n,r){var i;return r?t:(i=e.getAttributeNode(n))&&i.specified?i.value:e[n]===!0?n.toLowerCase():null}),x.find=at,x.expr=at.selectors,x.expr[":"]=x.expr.pseudos,x.unique=at.uniqueSort,x.text=at.getText,x.isXMLDoc=at.isXML,x.contains=at.contains}(e);var O={};function F(e){var t=O[e]={};return x.each(e.match(T)||[],function(e,n){t[n]=!0}),t}x.Callbacks=function(e){e="string"==typeof e?O[e]||F(e):x.extend({},e);var n,r,i,o,a,s,l=[],u=!e.once&&[],c=function(t){for(r=e.memory&&t,i=!0,a=s||0,s=0,o=l.length,n=!0;l&&o>a;a++)if(l[a].apply(t[0],t[1])===!1&&e.stopOnFalse){r=!1;break}n=!1,l&&(u?u.length&&c(u.shift()):r?l=[]:p.disable())},p={add:function(){if(l){var t=l.length;(function i(t){x.each(t,function(t,n){var r=x.type(n);"function"===r?e.unique&&p.has(n)||l.push(n):n&&n.length&&"string"!==r&&i(n)})})(arguments),n?o=l.length:r&&(s=t,c(r))}return this},remove:function(){return l&&x.each(arguments,function(e,t){var r;while((r=x.inArray(t,l,r))>-1)l.splice(r,1),n&&(o>=r&&o--,a>=r&&a--)}),this},has:function(e){return e?x.inArray(e,l)>-1:!(!l||!l.length)},empty:function(){return l=[],o=0,this},disable:function(){return l=u=r=t,this},disabled:function(){return!l},lock:function(){return u=t,r||p.disable(),this},locked:function(){return!u},fireWith:function(e,t){return!l||i&&!u||(t=t||[],t=[e,t.slice?t.slice():t],n?u.push(t):c(t)),this},fire:function(){return p.fireWith(this,arguments),this},fired:function(){return!!i}};return p},x.extend({Deferred:function(e){var t=[["resolve","done",x.Callbacks("once memory"),"resolved"],["reject","fail",x.Callbacks("once memory"),"rejected"],["notify","progress",x.Callbacks("memory")]],n="pending",r={state:function(){return n},always:function(){return i.done(arguments).fail(arguments),this},then:function(){var e=arguments;return x.Deferred(function(n){x.each(t,function(t,o){var a=o[0],s=x.isFunction(e[t])&&e[t];i[o[1]](function(){var e=s&&s.apply(this,arguments);e&&x.isFunction(e.promise)?e.promise().done(n.resolve).fail(n.reject).progress(n.notify):n[a+"With"](this===r?n.promise():this,s?[e]:arguments)})}),e=null}).promise()},promise:function(e){return null!=e?x.extend(e,r):r}},i={};return r.pipe=r.then,x.each(t,function(e,o){var a=o[2],s=o[3];r[o[1]]=a.add,s&&a.add(function(){n=s},t[1^e][2].disable,t[2][2].lock),i[o[0]]=function(){return i[o[0]+"With"](this===i?r:this,arguments),this},i[o[0]+"With"]=a.fireWith}),r.promise(i),e&&e.call(i,i),i},when:function(e){var t=0,n=g.call(arguments),r=n.length,i=1!==r||e&&x.isFunction(e.promise)?r:0,o=1===i?e:x.Deferred(),a=function(e,t,n){return function(r){t[e]=this,n[e]=arguments.length>1?g.call(arguments):r,n===s?o.notifyWith(t,n):--i||o.resolveWith(t,n)}},s,l,u;if(r>1)for(s=Array(r),l=Array(r),u=Array(r);r>t;t++)n[t]&&x.isFunction(n[t].promise)?n[t].promise().done(a(t,u,n)).fail(o.reject).progress(a(t,l,s)):--i;return i||o.resolveWith(u,n),o.promise()}}),x.support=function(t){var n,r,o,s,l,u,c,p,f,d=a.createElement("div");if(d.setAttribute("className","t"),d.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",n=d.getElementsByTagName("*")||[],r=d.getElementsByTagName("a")[0],!r||!r.style||!n.length)return t;s=a.createElement("select"),u=s.appendChild(a.createElement("option")),o=d.getElementsByTagName("input")[0],r.style.cssText="top:1px;float:left;opacity:.5",t.getSetAttribute="t"!==d.className,t.leadingWhitespace=3===d.firstChild.nodeType,t.tbody=!d.getElementsByTagName("tbody").length,t.htmlSerialize=!!d.getElementsByTagName("link").length,t.style=/top/.test(r.getAttribute("style")),t.hrefNormalized="/a"===r.getAttribute("href"),t.opacity=/^0.5/.test(r.style.opacity),t.cssFloat=!!r.style.cssFloat,t.checkOn=!!o.value,t.optSelected=u.selected,t.enctype=!!a.createElement("form").enctype,t.html5Clone="<:nav></:nav>"!==a.createElement("nav").cloneNode(!0).outerHTML,t.inlineBlockNeedsLayout=!1,t.shrinkWrapBlocks=!1,t.pixelPosition=!1,t.deleteExpando=!0,t.noCloneEvent=!0,t.reliableMarginRight=!0,t.boxSizingReliable=!0,o.checked=!0,t.noCloneChecked=o.cloneNode(!0).checked,s.disabled=!0,t.optDisabled=!u.disabled;try{delete d.test}catch(h){t.deleteExpando=!1}o=a.createElement("input"),o.setAttribute("value",""),t.input=""===o.getAttribute("value"),o.value="t",o.setAttribute("type","radio"),t.radioValue="t"===o.value,o.setAttribute("checked","t"),o.setAttribute("name","t"),l=a.createDocumentFragment(),l.appendChild(o),t.appendChecked=o.checked,t.checkClone=l.cloneNode(!0).cloneNode(!0).lastChild.checked,d.attachEvent&&(d.attachEvent("onclick",function(){t.noCloneEvent=!1}),d.cloneNode(!0).click());for(f in{submit:!0,change:!0,focusin:!0})d.setAttribute(c="on"+f,"t"),t[f+"Bubbles"]=c in e||d.attributes[c].expando===!1;d.style.backgroundClip="content-box",d.cloneNode(!0).style.backgroundClip="",t.clearCloneStyle="content-box"===d.style.backgroundClip;for(f in x(t))break;return t.ownLast="0"!==f,x(function(){var n,r,o,s="padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",l=a.getElementsByTagName("body")[0];l&&(n=a.createElement("div"),n.style.cssText="border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px",l.appendChild(n).appendChild(d),d.innerHTML="<table><tr><td></td><td>t</td></tr></table>",o=d.getElementsByTagName("td"),o[0].style.cssText="padding:0;margin:0;border:0;display:none",p=0===o[0].offsetHeight,o[0].style.display="",o[1].style.display="none",t.reliableHiddenOffsets=p&&0===o[0].offsetHeight,d.innerHTML="",d.style.cssText="box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;",x.swap(l,null!=l.style.zoom?{zoom:1}:{},function(){t.boxSizing=4===d.offsetWidth}),e.getComputedStyle&&(t.pixelPosition="1%"!==(e.getComputedStyle(d,null)||{}).top,t.boxSizingReliable="4px"===(e.getComputedStyle(d,null)||{width:"4px"}).width,r=d.appendChild(a.createElement("div")),r.style.cssText=d.style.cssText=s,r.style.marginRight=r.style.width="0",d.style.width="1px",t.reliableMarginRight=!parseFloat((e.getComputedStyle(r,null)||{}).marginRight)),typeof d.style.zoom!==i&&(d.innerHTML="",d.style.cssText=s+"width:1px;padding:1px;display:inline;zoom:1",t.inlineBlockNeedsLayout=3===d.offsetWidth,d.style.display="block",d.innerHTML="<div></div>",d.firstChild.style.width="5px",t.shrinkWrapBlocks=3!==d.offsetWidth,t.inlineBlockNeedsLayout&&(l.style.zoom=1)),l.removeChild(n),n=d=o=r=null)}),n=s=l=u=r=o=null,t
}({});var B=/(?:\{[\s\S]*\}|\[[\s\S]*\])$/,P=/([A-Z])/g;function R(e,n,r,i){if(x.acceptData(e)){var o,a,s=x.expando,l=e.nodeType,u=l?x.cache:e,c=l?e[s]:e[s]&&s;if(c&&u[c]&&(i||u[c].data)||r!==t||"string"!=typeof n)return c||(c=l?e[s]=p.pop()||x.guid++:s),u[c]||(u[c]=l?{}:{toJSON:x.noop}),("object"==typeof n||"function"==typeof n)&&(i?u[c]=x.extend(u[c],n):u[c].data=x.extend(u[c].data,n)),a=u[c],i||(a.data||(a.data={}),a=a.data),r!==t&&(a[x.camelCase(n)]=r),"string"==typeof n?(o=a[n],null==o&&(o=a[x.camelCase(n)])):o=a,o}}function W(e,t,n){if(x.acceptData(e)){var r,i,o=e.nodeType,a=o?x.cache:e,s=o?e[x.expando]:x.expando;if(a[s]){if(t&&(r=n?a[s]:a[s].data)){x.isArray(t)?t=t.concat(x.map(t,x.camelCase)):t in r?t=[t]:(t=x.camelCase(t),t=t in r?[t]:t.split(" ")),i=t.length;while(i--)delete r[t[i]];if(n?!I(r):!x.isEmptyObject(r))return}(n||(delete a[s].data,I(a[s])))&&(o?x.cleanData([e],!0):x.support.deleteExpando||a!=a.window?delete a[s]:a[s]=null)}}}x.extend({cache:{},noData:{applet:!0,embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"},hasData:function(e){return e=e.nodeType?x.cache[e[x.expando]]:e[x.expando],!!e&&!I(e)},data:function(e,t,n){return R(e,t,n)},removeData:function(e,t){return W(e,t)},_data:function(e,t,n){return R(e,t,n,!0)},_removeData:function(e,t){return W(e,t,!0)},acceptData:function(e){if(e.nodeType&&1!==e.nodeType&&9!==e.nodeType)return!1;var t=e.nodeName&&x.noData[e.nodeName.toLowerCase()];return!t||t!==!0&&e.getAttribute("classid")===t}}),x.fn.extend({data:function(e,n){var r,i,o=null,a=0,s=this[0];if(e===t){if(this.length&&(o=x.data(s),1===s.nodeType&&!x._data(s,"parsedAttrs"))){for(r=s.attributes;r.length>a;a++)i=r[a].name,0===i.indexOf("data-")&&(i=x.camelCase(i.slice(5)),$(s,i,o[i]));x._data(s,"parsedAttrs",!0)}return o}return"object"==typeof e?this.each(function(){x.data(this,e)}):arguments.length>1?this.each(function(){x.data(this,e,n)}):s?$(s,e,x.data(s,e)):null},removeData:function(e){return this.each(function(){x.removeData(this,e)})}});function $(e,n,r){if(r===t&&1===e.nodeType){var i="data-"+n.replace(P,"-$1").toLowerCase();if(r=e.getAttribute(i),"string"==typeof r){try{r="true"===r?!0:"false"===r?!1:"null"===r?null:+r+""===r?+r:B.test(r)?x.parseJSON(r):r}catch(o){}x.data(e,n,r)}else r=t}return r}function I(e){var t;for(t in e)if(("data"!==t||!x.isEmptyObject(e[t]))&&"toJSON"!==t)return!1;return!0}x.extend({queue:function(e,n,r){var i;return e?(n=(n||"fx")+"queue",i=x._data(e,n),r&&(!i||x.isArray(r)?i=x._data(e,n,x.makeArray(r)):i.push(r)),i||[]):t},dequeue:function(e,t){t=t||"fx";var n=x.queue(e,t),r=n.length,i=n.shift(),o=x._queueHooks(e,t),a=function(){x.dequeue(e,t)};"inprogress"===i&&(i=n.shift(),r--),i&&("fx"===t&&n.unshift("inprogress"),delete o.stop,i.call(e,a,o)),!r&&o&&o.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks";return x._data(e,n)||x._data(e,n,{empty:x.Callbacks("once memory").add(function(){x._removeData(e,t+"queue"),x._removeData(e,n)})})}}),x.fn.extend({queue:function(e,n){var r=2;return"string"!=typeof e&&(n=e,e="fx",r--),r>arguments.length?x.queue(this[0],e):n===t?this:this.each(function(){var t=x.queue(this,e,n);x._queueHooks(this,e),"fx"===e&&"inprogress"!==t[0]&&x.dequeue(this,e)})},dequeue:function(e){return this.each(function(){x.dequeue(this,e)})},delay:function(e,t){return e=x.fx?x.fx.speeds[e]||e:e,t=t||"fx",this.queue(t,function(t,n){var r=setTimeout(t,e);n.stop=function(){clearTimeout(r)}})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,n){var r,i=1,o=x.Deferred(),a=this,s=this.length,l=function(){--i||o.resolveWith(a,[a])};"string"!=typeof e&&(n=e,e=t),e=e||"fx";while(s--)r=x._data(a[s],e+"queueHooks"),r&&r.empty&&(i++,r.empty.add(l));return l(),o.promise(n)}});var z,X,U=/[\t\r\n\f]/g,V=/\r/g,Y=/^(?:input|select|textarea|button|object)$/i,J=/^(?:a|area)$/i,G=/^(?:checked|selected)$/i,Q=x.support.getSetAttribute,K=x.support.input;x.fn.extend({attr:function(e,t){return x.access(this,x.attr,e,t,arguments.length>1)},removeAttr:function(e){return this.each(function(){x.removeAttr(this,e)})},prop:function(e,t){return x.access(this,x.prop,e,t,arguments.length>1)},removeProp:function(e){return e=x.propFix[e]||e,this.each(function(){try{this[e]=t,delete this[e]}catch(n){}})},addClass:function(e){var t,n,r,i,o,a=0,s=this.length,l="string"==typeof e&&e;if(x.isFunction(e))return this.each(function(t){x(this).addClass(e.call(this,t,this.className))});if(l)for(t=(e||"").match(T)||[];s>a;a++)if(n=this[a],r=1===n.nodeType&&(n.className?(" "+n.className+" ").replace(U," "):" ")){o=0;while(i=t[o++])0>r.indexOf(" "+i+" ")&&(r+=i+" ");n.className=x.trim(r)}return this},removeClass:function(e){var t,n,r,i,o,a=0,s=this.length,l=0===arguments.length||"string"==typeof e&&e;if(x.isFunction(e))return this.each(function(t){x(this).removeClass(e.call(this,t,this.className))});if(l)for(t=(e||"").match(T)||[];s>a;a++)if(n=this[a],r=1===n.nodeType&&(n.className?(" "+n.className+" ").replace(U," "):"")){o=0;while(i=t[o++])while(r.indexOf(" "+i+" ")>=0)r=r.replace(" "+i+" "," ");n.className=e?x.trim(r):""}return this},toggleClass:function(e,t){var n=typeof e;return"boolean"==typeof t&&"string"===n?t?this.addClass(e):this.removeClass(e):x.isFunction(e)?this.each(function(n){x(this).toggleClass(e.call(this,n,this.className,t),t)}):this.each(function(){if("string"===n){var t,r=0,o=x(this),a=e.match(T)||[];while(t=a[r++])o.hasClass(t)?o.removeClass(t):o.addClass(t)}else(n===i||"boolean"===n)&&(this.className&&x._data(this,"__className__",this.className),this.className=this.className||e===!1?"":x._data(this,"__className__")||"")})},hasClass:function(e){var t=" "+e+" ",n=0,r=this.length;for(;r>n;n++)if(1===this[n].nodeType&&(" "+this[n].className+" ").replace(U," ").indexOf(t)>=0)return!0;return!1},val:function(e){var n,r,i,o=this[0];{if(arguments.length)return i=x.isFunction(e),this.each(function(n){var o;1===this.nodeType&&(o=i?e.call(this,n,x(this).val()):e,null==o?o="":"number"==typeof o?o+="":x.isArray(o)&&(o=x.map(o,function(e){return null==e?"":e+""})),r=x.valHooks[this.type]||x.valHooks[this.nodeName.toLowerCase()],r&&"set"in r&&r.set(this,o,"value")!==t||(this.value=o))});if(o)return r=x.valHooks[o.type]||x.valHooks[o.nodeName.toLowerCase()],r&&"get"in r&&(n=r.get(o,"value"))!==t?n:(n=o.value,"string"==typeof n?n.replace(V,""):null==n?"":n)}}}),x.extend({valHooks:{option:{get:function(e){var t=x.find.attr(e,"value");return null!=t?t:e.text}},select:{get:function(e){var t,n,r=e.options,i=e.selectedIndex,o="select-one"===e.type||0>i,a=o?null:[],s=o?i+1:r.length,l=0>i?s:o?i:0;for(;s>l;l++)if(n=r[l],!(!n.selected&&l!==i||(x.support.optDisabled?n.disabled:null!==n.getAttribute("disabled"))||n.parentNode.disabled&&x.nodeName(n.parentNode,"optgroup"))){if(t=x(n).val(),o)return t;a.push(t)}return a},set:function(e,t){var n,r,i=e.options,o=x.makeArray(t),a=i.length;while(a--)r=i[a],(r.selected=x.inArray(x(r).val(),o)>=0)&&(n=!0);return n||(e.selectedIndex=-1),o}}},attr:function(e,n,r){var o,a,s=e.nodeType;if(e&&3!==s&&8!==s&&2!==s)return typeof e.getAttribute===i?x.prop(e,n,r):(1===s&&x.isXMLDoc(e)||(n=n.toLowerCase(),o=x.attrHooks[n]||(x.expr.match.bool.test(n)?X:z)),r===t?o&&"get"in o&&null!==(a=o.get(e,n))?a:(a=x.find.attr(e,n),null==a?t:a):null!==r?o&&"set"in o&&(a=o.set(e,r,n))!==t?a:(e.setAttribute(n,r+""),r):(x.removeAttr(e,n),t))},removeAttr:function(e,t){var n,r,i=0,o=t&&t.match(T);if(o&&1===e.nodeType)while(n=o[i++])r=x.propFix[n]||n,x.expr.match.bool.test(n)?K&&Q||!G.test(n)?e[r]=!1:e[x.camelCase("default-"+n)]=e[r]=!1:x.attr(e,n,""),e.removeAttribute(Q?n:r)},attrHooks:{type:{set:function(e,t){if(!x.support.radioValue&&"radio"===t&&x.nodeName(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}}},propFix:{"for":"htmlFor","class":"className"},prop:function(e,n,r){var i,o,a,s=e.nodeType;if(e&&3!==s&&8!==s&&2!==s)return a=1!==s||!x.isXMLDoc(e),a&&(n=x.propFix[n]||n,o=x.propHooks[n]),r!==t?o&&"set"in o&&(i=o.set(e,r,n))!==t?i:e[n]=r:o&&"get"in o&&null!==(i=o.get(e,n))?i:e[n]},propHooks:{tabIndex:{get:function(e){var t=x.find.attr(e,"tabindex");return t?parseInt(t,10):Y.test(e.nodeName)||J.test(e.nodeName)&&e.href?0:-1}}}}),X={set:function(e,t,n){return t===!1?x.removeAttr(e,n):K&&Q||!G.test(n)?e.setAttribute(!Q&&x.propFix[n]||n,n):e[x.camelCase("default-"+n)]=e[n]=!0,n}},x.each(x.expr.match.bool.source.match(/\w+/g),function(e,n){var r=x.expr.attrHandle[n]||x.find.attr;x.expr.attrHandle[n]=K&&Q||!G.test(n)?function(e,n,i){var o=x.expr.attrHandle[n],a=i?t:(x.expr.attrHandle[n]=t)!=r(e,n,i)?n.toLowerCase():null;return x.expr.attrHandle[n]=o,a}:function(e,n,r){return r?t:e[x.camelCase("default-"+n)]?n.toLowerCase():null}}),K&&Q||(x.attrHooks.value={set:function(e,n,r){return x.nodeName(e,"input")?(e.defaultValue=n,t):z&&z.set(e,n,r)}}),Q||(z={set:function(e,n,r){var i=e.getAttributeNode(r);return i||e.setAttributeNode(i=e.ownerDocument.createAttribute(r)),i.value=n+="","value"===r||n===e.getAttribute(r)?n:t}},x.expr.attrHandle.id=x.expr.attrHandle.name=x.expr.attrHandle.coords=function(e,n,r){var i;return r?t:(i=e.getAttributeNode(n))&&""!==i.value?i.value:null},x.valHooks.button={get:function(e,n){var r=e.getAttributeNode(n);return r&&r.specified?r.value:t},set:z.set},x.attrHooks.contenteditable={set:function(e,t,n){z.set(e,""===t?!1:t,n)}},x.each(["width","height"],function(e,n){x.attrHooks[n]={set:function(e,r){return""===r?(e.setAttribute(n,"auto"),r):t}}})),x.support.hrefNormalized||x.each(["href","src"],function(e,t){x.propHooks[t]={get:function(e){return e.getAttribute(t,4)}}}),x.support.style||(x.attrHooks.style={get:function(e){return e.style.cssText||t},set:function(e,t){return e.style.cssText=t+""}}),x.support.optSelected||(x.propHooks.selected={get:function(e){var t=e.parentNode;return t&&(t.selectedIndex,t.parentNode&&t.parentNode.selectedIndex),null}}),x.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){x.propFix[this.toLowerCase()]=this}),x.support.enctype||(x.propFix.enctype="encoding"),x.each(["radio","checkbox"],function(){x.valHooks[this]={set:function(e,n){return x.isArray(n)?e.checked=x.inArray(x(e).val(),n)>=0:t}},x.support.checkOn||(x.valHooks[this].get=function(e){return null===e.getAttribute("value")?"on":e.value})});var Z=/^(?:input|select|textarea)$/i,et=/^key/,tt=/^(?:mouse|contextmenu)|click/,nt=/^(?:focusinfocus|focusoutblur)$/,rt=/^([^.]*)(?:\.(.+)|)$/;function it(){return!0}function ot(){return!1}function at(){try{return a.activeElement}catch(e){}}x.event={global:{},add:function(e,n,r,o,a){var s,l,u,c,p,f,d,h,g,m,y,v=x._data(e);if(v){r.handler&&(c=r,r=c.handler,a=c.selector),r.guid||(r.guid=x.guid++),(l=v.events)||(l=v.events={}),(f=v.handle)||(f=v.handle=function(e){return typeof x===i||e&&x.event.triggered===e.type?t:x.event.dispatch.apply(f.elem,arguments)},f.elem=e),n=(n||"").match(T)||[""],u=n.length;while(u--)s=rt.exec(n[u])||[],g=y=s[1],m=(s[2]||"").split(".").sort(),g&&(p=x.event.special[g]||{},g=(a?p.delegateType:p.bindType)||g,p=x.event.special[g]||{},d=x.extend({type:g,origType:y,data:o,handler:r,guid:r.guid,selector:a,needsContext:a&&x.expr.match.needsContext.test(a),namespace:m.join(".")},c),(h=l[g])||(h=l[g]=[],h.delegateCount=0,p.setup&&p.setup.call(e,o,m,f)!==!1||(e.addEventListener?e.addEventListener(g,f,!1):e.attachEvent&&e.attachEvent("on"+g,f))),p.add&&(p.add.call(e,d),d.handler.guid||(d.handler.guid=r.guid)),a?h.splice(h.delegateCount++,0,d):h.push(d),x.event.global[g]=!0);e=null}},remove:function(e,t,n,r,i){var o,a,s,l,u,c,p,f,d,h,g,m=x.hasData(e)&&x._data(e);if(m&&(c=m.events)){t=(t||"").match(T)||[""],u=t.length;while(u--)if(s=rt.exec(t[u])||[],d=g=s[1],h=(s[2]||"").split(".").sort(),d){p=x.event.special[d]||{},d=(r?p.delegateType:p.bindType)||d,f=c[d]||[],s=s[2]&&RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"),l=o=f.length;while(o--)a=f[o],!i&&g!==a.origType||n&&n.guid!==a.guid||s&&!s.test(a.namespace)||r&&r!==a.selector&&("**"!==r||!a.selector)||(f.splice(o,1),a.selector&&f.delegateCount--,p.remove&&p.remove.call(e,a));l&&!f.length&&(p.teardown&&p.teardown.call(e,h,m.handle)!==!1||x.removeEvent(e,d,m.handle),delete c[d])}else for(d in c)x.event.remove(e,d+t[u],n,r,!0);x.isEmptyObject(c)&&(delete m.handle,x._removeData(e,"events"))}},trigger:function(n,r,i,o){var s,l,u,c,p,f,d,h=[i||a],g=v.call(n,"type")?n.type:n,m=v.call(n,"namespace")?n.namespace.split("."):[];if(u=f=i=i||a,3!==i.nodeType&&8!==i.nodeType&&!nt.test(g+x.event.triggered)&&(g.indexOf(".")>=0&&(m=g.split("."),g=m.shift(),m.sort()),l=0>g.indexOf(":")&&"on"+g,n=n[x.expando]?n:new x.Event(g,"object"==typeof n&&n),n.isTrigger=o?2:3,n.namespace=m.join("."),n.namespace_re=n.namespace?RegExp("(^|\\.)"+m.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,n.result=t,n.target||(n.target=i),r=null==r?[n]:x.makeArray(r,[n]),p=x.event.special[g]||{},o||!p.trigger||p.trigger.apply(i,r)!==!1)){if(!o&&!p.noBubble&&!x.isWindow(i)){for(c=p.delegateType||g,nt.test(c+g)||(u=u.parentNode);u;u=u.parentNode)h.push(u),f=u;f===(i.ownerDocument||a)&&h.push(f.defaultView||f.parentWindow||e)}d=0;while((u=h[d++])&&!n.isPropagationStopped())n.type=d>1?c:p.bindType||g,s=(x._data(u,"events")||{})[n.type]&&x._data(u,"handle"),s&&s.apply(u,r),s=l&&u[l],s&&x.acceptData(u)&&s.apply&&s.apply(u,r)===!1&&n.preventDefault();if(n.type=g,!o&&!n.isDefaultPrevented()&&(!p._default||p._default.apply(h.pop(),r)===!1)&&x.acceptData(i)&&l&&i[g]&&!x.isWindow(i)){f=i[l],f&&(i[l]=null),x.event.triggered=g;try{i[g]()}catch(y){}x.event.triggered=t,f&&(i[l]=f)}return n.result}},dispatch:function(e){e=x.event.fix(e);var n,r,i,o,a,s=[],l=g.call(arguments),u=(x._data(this,"events")||{})[e.type]||[],c=x.event.special[e.type]||{};if(l[0]=e,e.delegateTarget=this,!c.preDispatch||c.preDispatch.call(this,e)!==!1){s=x.event.handlers.call(this,e,u),n=0;while((o=s[n++])&&!e.isPropagationStopped()){e.currentTarget=o.elem,a=0;while((i=o.handlers[a++])&&!e.isImmediatePropagationStopped())(!e.namespace_re||e.namespace_re.test(i.namespace))&&(e.handleObj=i,e.data=i.data,r=((x.event.special[i.origType]||{}).handle||i.handler).apply(o.elem,l),r!==t&&(e.result=r)===!1&&(e.preventDefault(),e.stopPropagation()))}return c.postDispatch&&c.postDispatch.call(this,e),e.result}},handlers:function(e,n){var r,i,o,a,s=[],l=n.delegateCount,u=e.target;if(l&&u.nodeType&&(!e.button||"click"!==e.type))for(;u!=this;u=u.parentNode||this)if(1===u.nodeType&&(u.disabled!==!0||"click"!==e.type)){for(o=[],a=0;l>a;a++)i=n[a],r=i.selector+" ",o[r]===t&&(o[r]=i.needsContext?x(r,this).index(u)>=0:x.find(r,this,null,[u]).length),o[r]&&o.push(i);o.length&&s.push({elem:u,handlers:o})}return n.length>l&&s.push({elem:this,handlers:n.slice(l)}),s},fix:function(e){if(e[x.expando])return e;var t,n,r,i=e.type,o=e,s=this.fixHooks[i];s||(this.fixHooks[i]=s=tt.test(i)?this.mouseHooks:et.test(i)?this.keyHooks:{}),r=s.props?this.props.concat(s.props):this.props,e=new x.Event(o),t=r.length;while(t--)n=r[t],e[n]=o[n];return e.target||(e.target=o.srcElement||a),3===e.target.nodeType&&(e.target=e.target.parentNode),e.metaKey=!!e.metaKey,s.filter?s.filter(e,o):e},props:"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(e,t){return null==e.which&&(e.which=null!=t.charCode?t.charCode:t.keyCode),e}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(e,n){var r,i,o,s=n.button,l=n.fromElement;return null==e.pageX&&null!=n.clientX&&(i=e.target.ownerDocument||a,o=i.documentElement,r=i.body,e.pageX=n.clientX+(o&&o.scrollLeft||r&&r.scrollLeft||0)-(o&&o.clientLeft||r&&r.clientLeft||0),e.pageY=n.clientY+(o&&o.scrollTop||r&&r.scrollTop||0)-(o&&o.clientTop||r&&r.clientTop||0)),!e.relatedTarget&&l&&(e.relatedTarget=l===e.target?n.toElement:l),e.which||s===t||(e.which=1&s?1:2&s?3:4&s?2:0),e}},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==at()&&this.focus)try{return this.focus(),!1}catch(e){}},delegateType:"focusin"},blur:{trigger:function(){return this===at()&&this.blur?(this.blur(),!1):t},delegateType:"focusout"},click:{trigger:function(){return x.nodeName(this,"input")&&"checkbox"===this.type&&this.click?(this.click(),!1):t},_default:function(e){return x.nodeName(e.target,"a")}},beforeunload:{postDispatch:function(e){e.result!==t&&(e.originalEvent.returnValue=e.result)}}},simulate:function(e,t,n,r){var i=x.extend(new x.Event,n,{type:e,isSimulated:!0,originalEvent:{}});r?x.event.trigger(i,null,t):x.event.dispatch.call(t,i),i.isDefaultPrevented()&&n.preventDefault()}},x.removeEvent=a.removeEventListener?function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n,!1)}:function(e,t,n){var r="on"+t;e.detachEvent&&(typeof e[r]===i&&(e[r]=null),e.detachEvent(r,n))},x.Event=function(e,n){return this instanceof x.Event?(e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||e.returnValue===!1||e.getPreventDefault&&e.getPreventDefault()?it:ot):this.type=e,n&&x.extend(this,n),this.timeStamp=e&&e.timeStamp||x.now(),this[x.expando]=!0,t):new x.Event(e,n)},x.Event.prototype={isDefaultPrevented:ot,isPropagationStopped:ot,isImmediatePropagationStopped:ot,preventDefault:function(){var e=this.originalEvent;this.isDefaultPrevented=it,e&&(e.preventDefault?e.preventDefault():e.returnValue=!1)},stopPropagation:function(){var e=this.originalEvent;this.isPropagationStopped=it,e&&(e.stopPropagation&&e.stopPropagation(),e.cancelBubble=!0)},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=it,this.stopPropagation()}},x.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(e,t){x.event.special[e]={delegateType:t,bindType:t,handle:function(e){var n,r=this,i=e.relatedTarget,o=e.handleObj;return(!i||i!==r&&!x.contains(r,i))&&(e.type=o.origType,n=o.handler.apply(this,arguments),e.type=t),n}}}),x.support.submitBubbles||(x.event.special.submit={setup:function(){return x.nodeName(this,"form")?!1:(x.event.add(this,"click._submit keypress._submit",function(e){var n=e.target,r=x.nodeName(n,"input")||x.nodeName(n,"button")?n.form:t;r&&!x._data(r,"submitBubbles")&&(x.event.add(r,"submit._submit",function(e){e._submit_bubble=!0}),x._data(r,"submitBubbles",!0))}),t)},postDispatch:function(e){e._submit_bubble&&(delete e._submit_bubble,this.parentNode&&!e.isTrigger&&x.event.simulate("submit",this.parentNode,e,!0))},teardown:function(){return x.nodeName(this,"form")?!1:(x.event.remove(this,"._submit"),t)}}),x.support.changeBubbles||(x.event.special.change={setup:function(){return Z.test(this.nodeName)?(("checkbox"===this.type||"radio"===this.type)&&(x.event.add(this,"propertychange._change",function(e){"checked"===e.originalEvent.propertyName&&(this._just_changed=!0)}),x.event.add(this,"click._change",function(e){this._just_changed&&!e.isTrigger&&(this._just_changed=!1),x.event.simulate("change",this,e,!0)})),!1):(x.event.add(this,"beforeactivate._change",function(e){var t=e.target;Z.test(t.nodeName)&&!x._data(t,"changeBubbles")&&(x.event.add(t,"change._change",function(e){!this.parentNode||e.isSimulated||e.isTrigger||x.event.simulate("change",this.parentNode,e,!0)}),x._data(t,"changeBubbles",!0))}),t)},handle:function(e){var n=e.target;return this!==n||e.isSimulated||e.isTrigger||"radio"!==n.type&&"checkbox"!==n.type?e.handleObj.handler.apply(this,arguments):t},teardown:function(){return x.event.remove(this,"._change"),!Z.test(this.nodeName)}}),x.support.focusinBubbles||x.each({focus:"focusin",blur:"focusout"},function(e,t){var n=0,r=function(e){x.event.simulate(t,e.target,x.event.fix(e),!0)};x.event.special[t]={setup:function(){0===n++&&a.addEventListener(e,r,!0)},teardown:function(){0===--n&&a.removeEventListener(e,r,!0)}}}),x.fn.extend({on:function(e,n,r,i,o){var a,s;if("object"==typeof e){"string"!=typeof n&&(r=r||n,n=t);for(a in e)this.on(a,n,r,e[a],o);return this}if(null==r&&null==i?(i=n,r=n=t):null==i&&("string"==typeof n?(i=r,r=t):(i=r,r=n,n=t)),i===!1)i=ot;else if(!i)return this;return 1===o&&(s=i,i=function(e){return x().off(e),s.apply(this,arguments)},i.guid=s.guid||(s.guid=x.guid++)),this.each(function(){x.event.add(this,e,i,r,n)})},one:function(e,t,n,r){return this.on(e,t,n,r,1)},off:function(e,n,r){var i,o;if(e&&e.preventDefault&&e.handleObj)return i=e.handleObj,x(e.delegateTarget).off(i.namespace?i.origType+"."+i.namespace:i.origType,i.selector,i.handler),this;if("object"==typeof e){for(o in e)this.off(o,n,e[o]);return this}return(n===!1||"function"==typeof n)&&(r=n,n=t),r===!1&&(r=ot),this.each(function(){x.event.remove(this,e,r,n)})},trigger:function(e,t){return this.each(function(){x.event.trigger(e,t,this)})},triggerHandler:function(e,n){var r=this[0];return r?x.event.trigger(e,n,r,!0):t}});var st=/^.[^:#\[\.,]*$/,lt=/^(?:parents|prev(?:Until|All))/,ut=x.expr.match.needsContext,ct={children:!0,contents:!0,next:!0,prev:!0};x.fn.extend({find:function(e){var t,n=[],r=this,i=r.length;if("string"!=typeof e)return this.pushStack(x(e).filter(function(){for(t=0;i>t;t++)if(x.contains(r[t],this))return!0}));for(t=0;i>t;t++)x.find(e,r[t],n);return n=this.pushStack(i>1?x.unique(n):n),n.selector=this.selector?this.selector+" "+e:e,n},has:function(e){var t,n=x(e,this),r=n.length;return this.filter(function(){for(t=0;r>t;t++)if(x.contains(this,n[t]))return!0})},not:function(e){return this.pushStack(ft(this,e||[],!0))},filter:function(e){return this.pushStack(ft(this,e||[],!1))},is:function(e){return!!ft(this,"string"==typeof e&&ut.test(e)?x(e):e||[],!1).length},closest:function(e,t){var n,r=0,i=this.length,o=[],a=ut.test(e)||"string"!=typeof e?x(e,t||this.context):0;for(;i>r;r++)for(n=this[r];n&&n!==t;n=n.parentNode)if(11>n.nodeType&&(a?a.index(n)>-1:1===n.nodeType&&x.find.matchesSelector(n,e))){n=o.push(n);break}return this.pushStack(o.length>1?x.unique(o):o)},index:function(e){return e?"string"==typeof e?x.inArray(this[0],x(e)):x.inArray(e.jquery?e[0]:e,this):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(e,t){var n="string"==typeof e?x(e,t):x.makeArray(e&&e.nodeType?[e]:e),r=x.merge(this.get(),n);return this.pushStack(x.unique(r))},addBack:function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}});function pt(e,t){do e=e[t];while(e&&1!==e.nodeType);return e}x.each({parent:function(e){var t=e.parentNode;return t&&11!==t.nodeType?t:null},parents:function(e){return x.dir(e,"parentNode")},parentsUntil:function(e,t,n){return x.dir(e,"parentNode",n)},next:function(e){return pt(e,"nextSibling")},prev:function(e){return pt(e,"previousSibling")},nextAll:function(e){return x.dir(e,"nextSibling")},prevAll:function(e){return x.dir(e,"previousSibling")},nextUntil:function(e,t,n){return x.dir(e,"nextSibling",n)},prevUntil:function(e,t,n){return x.dir(e,"previousSibling",n)},siblings:function(e){return x.sibling((e.parentNode||{}).firstChild,e)},children:function(e){return x.sibling(e.firstChild)},contents:function(e){return x.nodeName(e,"iframe")?e.contentDocument||e.contentWindow.document:x.merge([],e.childNodes)}},function(e,t){x.fn[e]=function(n,r){var i=x.map(this,t,n);return"Until"!==e.slice(-5)&&(r=n),r&&"string"==typeof r&&(i=x.filter(r,i)),this.length>1&&(ct[e]||(i=x.unique(i)),lt.test(e)&&(i=i.reverse())),this.pushStack(i)}}),x.extend({filter:function(e,t,n){var r=t[0];return n&&(e=":not("+e+")"),1===t.length&&1===r.nodeType?x.find.matchesSelector(r,e)?[r]:[]:x.find.matches(e,x.grep(t,function(e){return 1===e.nodeType}))},dir:function(e,n,r){var i=[],o=e[n];while(o&&9!==o.nodeType&&(r===t||1!==o.nodeType||!x(o).is(r)))1===o.nodeType&&i.push(o),o=o[n];return i},sibling:function(e,t){var n=[];for(;e;e=e.nextSibling)1===e.nodeType&&e!==t&&n.push(e);return n}});function ft(e,t,n){if(x.isFunction(t))return x.grep(e,function(e,r){return!!t.call(e,r,e)!==n});if(t.nodeType)return x.grep(e,function(e){return e===t!==n});if("string"==typeof t){if(st.test(t))return x.filter(t,e,n);t=x.filter(t,e)}return x.grep(e,function(e){return x.inArray(e,t)>=0!==n})}function dt(e){var t=ht.split("|"),n=e.createDocumentFragment();if(n.createElement)while(t.length)n.createElement(t.pop());return n}var ht="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",gt=/ jQuery\d+="(?:null|\d+)"/g,mt=RegExp("<(?:"+ht+")[\\s/>]","i"),yt=/^\s+/,vt=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,bt=/<([\w:]+)/,xt=/<tbody/i,wt=/<|&#?\w+;/,Tt=/<(?:script|style|link)/i,Ct=/^(?:checkbox|radio)$/i,Nt=/checked\s*(?:[^=]|=\s*.checked.)/i,kt=/^$|\/(?:java|ecma)script/i,Et=/^true\/(.*)/,St=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,At={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],area:[1,"<map>","</map>"],param:[1,"<object>","</object>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:x.support.htmlSerialize?[0,"",""]:[1,"X<div>","</div>"]},jt=dt(a),Dt=jt.appendChild(a.createElement("div"));At.optgroup=At.option,At.tbody=At.tfoot=At.colgroup=At.caption=At.thead,At.th=At.td,x.fn.extend({text:function(e){return x.access(this,function(e){return e===t?x.text(this):this.empty().append((this[0]&&this[0].ownerDocument||a).createTextNode(e))},null,e,arguments.length)},append:function(){return this.domManip(arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=Lt(this,e);t.appendChild(e)}})},prepend:function(){return this.domManip(arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=Lt(this,e);t.insertBefore(e,t.firstChild)}})},before:function(){return this.domManip(arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this)})},after:function(){return this.domManip(arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this.nextSibling)})},remove:function(e,t){var n,r=e?x.filter(e,this):this,i=0;for(;null!=(n=r[i]);i++)t||1!==n.nodeType||x.cleanData(Ft(n)),n.parentNode&&(t&&x.contains(n.ownerDocument,n)&&_t(Ft(n,"script")),n.parentNode.removeChild(n));return this},empty:function(){var e,t=0;for(;null!=(e=this[t]);t++){1===e.nodeType&&x.cleanData(Ft(e,!1));while(e.firstChild)e.removeChild(e.firstChild);e.options&&x.nodeName(e,"select")&&(e.options.length=0)}return this},clone:function(e,t){return e=null==e?!1:e,t=null==t?e:t,this.map(function(){return x.clone(this,e,t)})},html:function(e){return x.access(this,function(e){var n=this[0]||{},r=0,i=this.length;if(e===t)return 1===n.nodeType?n.innerHTML.replace(gt,""):t;if(!("string"!=typeof e||Tt.test(e)||!x.support.htmlSerialize&&mt.test(e)||!x.support.leadingWhitespace&&yt.test(e)||At[(bt.exec(e)||["",""])[1].toLowerCase()])){e=e.replace(vt,"<$1></$2>");try{for(;i>r;r++)n=this[r]||{},1===n.nodeType&&(x.cleanData(Ft(n,!1)),n.innerHTML=e);n=0}catch(o){}}n&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(){var e=x.map(this,function(e){return[e.nextSibling,e.parentNode]}),t=0;return this.domManip(arguments,function(n){var r=e[t++],i=e[t++];i&&(r&&r.parentNode!==i&&(r=this.nextSibling),x(this).remove(),i.insertBefore(n,r))},!0),t?this:this.remove()},detach:function(e){return this.remove(e,!0)},domManip:function(e,t,n){e=d.apply([],e);var r,i,o,a,s,l,u=0,c=this.length,p=this,f=c-1,h=e[0],g=x.isFunction(h);if(g||!(1>=c||"string"!=typeof h||x.support.checkClone)&&Nt.test(h))return this.each(function(r){var i=p.eq(r);g&&(e[0]=h.call(this,r,i.html())),i.domManip(e,t,n)});if(c&&(l=x.buildFragment(e,this[0].ownerDocument,!1,!n&&this),r=l.firstChild,1===l.childNodes.length&&(l=r),r)){for(a=x.map(Ft(l,"script"),Ht),o=a.length;c>u;u++)i=l,u!==f&&(i=x.clone(i,!0,!0),o&&x.merge(a,Ft(i,"script"))),t.call(this[u],i,u);if(o)for(s=a[a.length-1].ownerDocument,x.map(a,qt),u=0;o>u;u++)i=a[u],kt.test(i.type||"")&&!x._data(i,"globalEval")&&x.contains(s,i)&&(i.src?x._evalUrl(i.src):x.globalEval((i.text||i.textContent||i.innerHTML||"").replace(St,"")));l=r=null}return this}});function Lt(e,t){return x.nodeName(e,"table")&&x.nodeName(1===t.nodeType?t:t.firstChild,"tr")?e.getElementsByTagName("tbody")[0]||e.appendChild(e.ownerDocument.createElement("tbody")):e}function Ht(e){return e.type=(null!==x.find.attr(e,"type"))+"/"+e.type,e}function qt(e){var t=Et.exec(e.type);return t?e.type=t[1]:e.removeAttribute("type"),e}function _t(e,t){var n,r=0;for(;null!=(n=e[r]);r++)x._data(n,"globalEval",!t||x._data(t[r],"globalEval"))}function Mt(e,t){if(1===t.nodeType&&x.hasData(e)){var n,r,i,o=x._data(e),a=x._data(t,o),s=o.events;if(s){delete a.handle,a.events={};for(n in s)for(r=0,i=s[n].length;i>r;r++)x.event.add(t,n,s[n][r])}a.data&&(a.data=x.extend({},a.data))}}function Ot(e,t){var n,r,i;if(1===t.nodeType){if(n=t.nodeName.toLowerCase(),!x.support.noCloneEvent&&t[x.expando]){i=x._data(t);for(r in i.events)x.removeEvent(t,r,i.handle);t.removeAttribute(x.expando)}"script"===n&&t.text!==e.text?(Ht(t).text=e.text,qt(t)):"object"===n?(t.parentNode&&(t.outerHTML=e.outerHTML),x.support.html5Clone&&e.innerHTML&&!x.trim(t.innerHTML)&&(t.innerHTML=e.innerHTML)):"input"===n&&Ct.test(e.type)?(t.defaultChecked=t.checked=e.checked,t.value!==e.value&&(t.value=e.value)):"option"===n?t.defaultSelected=t.selected=e.defaultSelected:("input"===n||"textarea"===n)&&(t.defaultValue=e.defaultValue)}}x.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,t){x.fn[e]=function(e){var n,r=0,i=[],o=x(e),a=o.length-1;for(;a>=r;r++)n=r===a?this:this.clone(!0),x(o[r])[t](n),h.apply(i,n.get());return this.pushStack(i)}});function Ft(e,n){var r,o,a=0,s=typeof e.getElementsByTagName!==i?e.getElementsByTagName(n||"*"):typeof e.querySelectorAll!==i?e.querySelectorAll(n||"*"):t;if(!s)for(s=[],r=e.childNodes||e;null!=(o=r[a]);a++)!n||x.nodeName(o,n)?s.push(o):x.merge(s,Ft(o,n));return n===t||n&&x.nodeName(e,n)?x.merge([e],s):s}function Bt(e){Ct.test(e.type)&&(e.defaultChecked=e.checked)}x.extend({clone:function(e,t,n){var r,i,o,a,s,l=x.contains(e.ownerDocument,e);if(x.support.html5Clone||x.isXMLDoc(e)||!mt.test("<"+e.nodeName+">")?o=e.cloneNode(!0):(Dt.innerHTML=e.outerHTML,Dt.removeChild(o=Dt.firstChild)),!(x.support.noCloneEvent&&x.support.noCloneChecked||1!==e.nodeType&&11!==e.nodeType||x.isXMLDoc(e)))for(r=Ft(o),s=Ft(e),a=0;null!=(i=s[a]);++a)r[a]&&Ot(i,r[a]);if(t)if(n)for(s=s||Ft(e),r=r||Ft(o),a=0;null!=(i=s[a]);a++)Mt(i,r[a]);else Mt(e,o);return r=Ft(o,"script"),r.length>0&&_t(r,!l&&Ft(e,"script")),r=s=i=null,o},buildFragment:function(e,t,n,r){var i,o,a,s,l,u,c,p=e.length,f=dt(t),d=[],h=0;for(;p>h;h++)if(o=e[h],o||0===o)if("object"===x.type(o))x.merge(d,o.nodeType?[o]:o);else if(wt.test(o)){s=s||f.appendChild(t.createElement("div")),l=(bt.exec(o)||["",""])[1].toLowerCase(),c=At[l]||At._default,s.innerHTML=c[1]+o.replace(vt,"<$1></$2>")+c[2],i=c[0];while(i--)s=s.lastChild;if(!x.support.leadingWhitespace&&yt.test(o)&&d.push(t.createTextNode(yt.exec(o)[0])),!x.support.tbody){o="table"!==l||xt.test(o)?"<table>"!==c[1]||xt.test(o)?0:s:s.firstChild,i=o&&o.childNodes.length;while(i--)x.nodeName(u=o.childNodes[i],"tbody")&&!u.childNodes.length&&o.removeChild(u)}x.merge(d,s.childNodes),s.textContent="";while(s.firstChild)s.removeChild(s.firstChild);s=f.lastChild}else d.push(t.createTextNode(o));s&&f.removeChild(s),x.support.appendChecked||x.grep(Ft(d,"input"),Bt),h=0;while(o=d[h++])if((!r||-1===x.inArray(o,r))&&(a=x.contains(o.ownerDocument,o),s=Ft(f.appendChild(o),"script"),a&&_t(s),n)){i=0;while(o=s[i++])kt.test(o.type||"")&&n.push(o)}return s=null,f},cleanData:function(e,t){var n,r,o,a,s=0,l=x.expando,u=x.cache,c=x.support.deleteExpando,f=x.event.special;for(;null!=(n=e[s]);s++)if((t||x.acceptData(n))&&(o=n[l],a=o&&u[o])){if(a.events)for(r in a.events)f[r]?x.event.remove(n,r):x.removeEvent(n,r,a.handle);
u[o]&&(delete u[o],c?delete n[l]:typeof n.removeAttribute!==i?n.removeAttribute(l):n[l]=null,p.push(o))}},_evalUrl:function(e){return x.ajax({url:e,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0})}}),x.fn.extend({wrapAll:function(e){if(x.isFunction(e))return this.each(function(t){x(this).wrapAll(e.call(this,t))});if(this[0]){var t=x(e,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){var e=this;while(e.firstChild&&1===e.firstChild.nodeType)e=e.firstChild;return e}).append(this)}return this},wrapInner:function(e){return x.isFunction(e)?this.each(function(t){x(this).wrapInner(e.call(this,t))}):this.each(function(){var t=x(this),n=t.contents();n.length?n.wrapAll(e):t.append(e)})},wrap:function(e){var t=x.isFunction(e);return this.each(function(n){x(this).wrapAll(t?e.call(this,n):e)})},unwrap:function(){return this.parent().each(function(){x.nodeName(this,"body")||x(this).replaceWith(this.childNodes)}).end()}});var Pt,Rt,Wt,$t=/alpha\([^)]*\)/i,It=/opacity\s*=\s*([^)]*)/,zt=/^(top|right|bottom|left)$/,Xt=/^(none|table(?!-c[ea]).+)/,Ut=/^margin/,Vt=RegExp("^("+w+")(.*)$","i"),Yt=RegExp("^("+w+")(?!px)[a-z%]+$","i"),Jt=RegExp("^([+-])=("+w+")","i"),Gt={BODY:"block"},Qt={position:"absolute",visibility:"hidden",display:"block"},Kt={letterSpacing:0,fontWeight:400},Zt=["Top","Right","Bottom","Left"],en=["Webkit","O","Moz","ms"];function tn(e,t){if(t in e)return t;var n=t.charAt(0).toUpperCase()+t.slice(1),r=t,i=en.length;while(i--)if(t=en[i]+n,t in e)return t;return r}function nn(e,t){return e=t||e,"none"===x.css(e,"display")||!x.contains(e.ownerDocument,e)}function rn(e,t){var n,r,i,o=[],a=0,s=e.length;for(;s>a;a++)r=e[a],r.style&&(o[a]=x._data(r,"olddisplay"),n=r.style.display,t?(o[a]||"none"!==n||(r.style.display=""),""===r.style.display&&nn(r)&&(o[a]=x._data(r,"olddisplay",ln(r.nodeName)))):o[a]||(i=nn(r),(n&&"none"!==n||!i)&&x._data(r,"olddisplay",i?n:x.css(r,"display"))));for(a=0;s>a;a++)r=e[a],r.style&&(t&&"none"!==r.style.display&&""!==r.style.display||(r.style.display=t?o[a]||"":"none"));return e}x.fn.extend({css:function(e,n){return x.access(this,function(e,n,r){var i,o,a={},s=0;if(x.isArray(n)){for(o=Rt(e),i=n.length;i>s;s++)a[n[s]]=x.css(e,n[s],!1,o);return a}return r!==t?x.style(e,n,r):x.css(e,n)},e,n,arguments.length>1)},show:function(){return rn(this,!0)},hide:function(){return rn(this)},toggle:function(e){return"boolean"==typeof e?e?this.show():this.hide():this.each(function(){nn(this)?x(this).show():x(this).hide()})}}),x.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=Wt(e,"opacity");return""===n?"1":n}}}},cssNumber:{columnCount:!0,fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":x.support.cssFloat?"cssFloat":"styleFloat"},style:function(e,n,r,i){if(e&&3!==e.nodeType&&8!==e.nodeType&&e.style){var o,a,s,l=x.camelCase(n),u=e.style;if(n=x.cssProps[l]||(x.cssProps[l]=tn(u,l)),s=x.cssHooks[n]||x.cssHooks[l],r===t)return s&&"get"in s&&(o=s.get(e,!1,i))!==t?o:u[n];if(a=typeof r,"string"===a&&(o=Jt.exec(r))&&(r=(o[1]+1)*o[2]+parseFloat(x.css(e,n)),a="number"),!(null==r||"number"===a&&isNaN(r)||("number"!==a||x.cssNumber[l]||(r+="px"),x.support.clearCloneStyle||""!==r||0!==n.indexOf("background")||(u[n]="inherit"),s&&"set"in s&&(r=s.set(e,r,i))===t)))try{u[n]=r}catch(c){}}},css:function(e,n,r,i){var o,a,s,l=x.camelCase(n);return n=x.cssProps[l]||(x.cssProps[l]=tn(e.style,l)),s=x.cssHooks[n]||x.cssHooks[l],s&&"get"in s&&(a=s.get(e,!0,r)),a===t&&(a=Wt(e,n,i)),"normal"===a&&n in Kt&&(a=Kt[n]),""===r||r?(o=parseFloat(a),r===!0||x.isNumeric(o)?o||0:a):a}}),e.getComputedStyle?(Rt=function(t){return e.getComputedStyle(t,null)},Wt=function(e,n,r){var i,o,a,s=r||Rt(e),l=s?s.getPropertyValue(n)||s[n]:t,u=e.style;return s&&(""!==l||x.contains(e.ownerDocument,e)||(l=x.style(e,n)),Yt.test(l)&&Ut.test(n)&&(i=u.width,o=u.minWidth,a=u.maxWidth,u.minWidth=u.maxWidth=u.width=l,l=s.width,u.width=i,u.minWidth=o,u.maxWidth=a)),l}):a.documentElement.currentStyle&&(Rt=function(e){return e.currentStyle},Wt=function(e,n,r){var i,o,a,s=r||Rt(e),l=s?s[n]:t,u=e.style;return null==l&&u&&u[n]&&(l=u[n]),Yt.test(l)&&!zt.test(n)&&(i=u.left,o=e.runtimeStyle,a=o&&o.left,a&&(o.left=e.currentStyle.left),u.left="fontSize"===n?"1em":l,l=u.pixelLeft+"px",u.left=i,a&&(o.left=a)),""===l?"auto":l});function on(e,t,n){var r=Vt.exec(t);return r?Math.max(0,r[1]-(n||0))+(r[2]||"px"):t}function an(e,t,n,r,i){var o=n===(r?"border":"content")?4:"width"===t?1:0,a=0;for(;4>o;o+=2)"margin"===n&&(a+=x.css(e,n+Zt[o],!0,i)),r?("content"===n&&(a-=x.css(e,"padding"+Zt[o],!0,i)),"margin"!==n&&(a-=x.css(e,"border"+Zt[o]+"Width",!0,i))):(a+=x.css(e,"padding"+Zt[o],!0,i),"padding"!==n&&(a+=x.css(e,"border"+Zt[o]+"Width",!0,i)));return a}function sn(e,t,n){var r=!0,i="width"===t?e.offsetWidth:e.offsetHeight,o=Rt(e),a=x.support.boxSizing&&"border-box"===x.css(e,"boxSizing",!1,o);if(0>=i||null==i){if(i=Wt(e,t,o),(0>i||null==i)&&(i=e.style[t]),Yt.test(i))return i;r=a&&(x.support.boxSizingReliable||i===e.style[t]),i=parseFloat(i)||0}return i+an(e,t,n||(a?"border":"content"),r,o)+"px"}function ln(e){var t=a,n=Gt[e];return n||(n=un(e,t),"none"!==n&&n||(Pt=(Pt||x("<iframe frameborder='0' width='0' height='0'/>").css("cssText","display:block !important")).appendTo(t.documentElement),t=(Pt[0].contentWindow||Pt[0].contentDocument).document,t.write("<!doctype html><html><body>"),t.close(),n=un(e,t),Pt.detach()),Gt[e]=n),n}function un(e,t){var n=x(t.createElement(e)).appendTo(t.body),r=x.css(n[0],"display");return n.remove(),r}x.each(["height","width"],function(e,n){x.cssHooks[n]={get:function(e,r,i){return r?0===e.offsetWidth&&Xt.test(x.css(e,"display"))?x.swap(e,Qt,function(){return sn(e,n,i)}):sn(e,n,i):t},set:function(e,t,r){var i=r&&Rt(e);return on(e,t,r?an(e,n,r,x.support.boxSizing&&"border-box"===x.css(e,"boxSizing",!1,i),i):0)}}}),x.support.opacity||(x.cssHooks.opacity={get:function(e,t){return It.test((t&&e.currentStyle?e.currentStyle.filter:e.style.filter)||"")?.01*parseFloat(RegExp.$1)+"":t?"1":""},set:function(e,t){var n=e.style,r=e.currentStyle,i=x.isNumeric(t)?"alpha(opacity="+100*t+")":"",o=r&&r.filter||n.filter||"";n.zoom=1,(t>=1||""===t)&&""===x.trim(o.replace($t,""))&&n.removeAttribute&&(n.removeAttribute("filter"),""===t||r&&!r.filter)||(n.filter=$t.test(o)?o.replace($t,i):o+" "+i)}}),x(function(){x.support.reliableMarginRight||(x.cssHooks.marginRight={get:function(e,n){return n?x.swap(e,{display:"inline-block"},Wt,[e,"marginRight"]):t}}),!x.support.pixelPosition&&x.fn.position&&x.each(["top","left"],function(e,n){x.cssHooks[n]={get:function(e,r){return r?(r=Wt(e,n),Yt.test(r)?x(e).position()[n]+"px":r):t}}})}),x.expr&&x.expr.filters&&(x.expr.filters.hidden=function(e){return 0>=e.offsetWidth&&0>=e.offsetHeight||!x.support.reliableHiddenOffsets&&"none"===(e.style&&e.style.display||x.css(e,"display"))},x.expr.filters.visible=function(e){return!x.expr.filters.hidden(e)}),x.each({margin:"",padding:"",border:"Width"},function(e,t){x.cssHooks[e+t]={expand:function(n){var r=0,i={},o="string"==typeof n?n.split(" "):[n];for(;4>r;r++)i[e+Zt[r]+t]=o[r]||o[r-2]||o[0];return i}},Ut.test(e)||(x.cssHooks[e+t].set=on)});var cn=/%20/g,pn=/\[\]$/,fn=/\r?\n/g,dn=/^(?:submit|button|image|reset|file)$/i,hn=/^(?:input|select|textarea|keygen)/i;x.fn.extend({serialize:function(){return x.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var e=x.prop(this,"elements");return e?x.makeArray(e):this}).filter(function(){var e=this.type;return this.name&&!x(this).is(":disabled")&&hn.test(this.nodeName)&&!dn.test(e)&&(this.checked||!Ct.test(e))}).map(function(e,t){var n=x(this).val();return null==n?null:x.isArray(n)?x.map(n,function(e){return{name:t.name,value:e.replace(fn,"\r\n")}}):{name:t.name,value:n.replace(fn,"\r\n")}}).get()}}),x.param=function(e,n){var r,i=[],o=function(e,t){t=x.isFunction(t)?t():null==t?"":t,i[i.length]=encodeURIComponent(e)+"="+encodeURIComponent(t)};if(n===t&&(n=x.ajaxSettings&&x.ajaxSettings.traditional),x.isArray(e)||e.jquery&&!x.isPlainObject(e))x.each(e,function(){o(this.name,this.value)});else for(r in e)gn(r,e[r],n,o);return i.join("&").replace(cn,"+")};function gn(e,t,n,r){var i;if(x.isArray(t))x.each(t,function(t,i){n||pn.test(e)?r(e,i):gn(e+"["+("object"==typeof i?t:"")+"]",i,n,r)});else if(n||"object"!==x.type(t))r(e,t);else for(i in t)gn(e+"["+i+"]",t[i],n,r)}x.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(e,t){x.fn[t]=function(e,n){return arguments.length>0?this.on(t,null,e,n):this.trigger(t)}}),x.fn.extend({hover:function(e,t){return this.mouseenter(e).mouseleave(t||e)},bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},delegate:function(e,t,n,r){return this.on(t,e,n,r)},undelegate:function(e,t,n){return 1===arguments.length?this.off(e,"**"):this.off(t,e||"**",n)}});var mn,yn,vn=x.now(),bn=/\?/,xn=/#.*$/,wn=/([?&])_=[^&]*/,Tn=/^(.*?):[ \t]*([^\r\n]*)\r?$/gm,Cn=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Nn=/^(?:GET|HEAD)$/,kn=/^\/\//,En=/^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,Sn=x.fn.load,An={},jn={},Dn="*/".concat("*");try{yn=o.href}catch(Ln){yn=a.createElement("a"),yn.href="",yn=yn.href}mn=En.exec(yn.toLowerCase())||[];function Hn(e){return function(t,n){"string"!=typeof t&&(n=t,t="*");var r,i=0,o=t.toLowerCase().match(T)||[];if(x.isFunction(n))while(r=o[i++])"+"===r[0]?(r=r.slice(1)||"*",(e[r]=e[r]||[]).unshift(n)):(e[r]=e[r]||[]).push(n)}}function qn(e,n,r,i){var o={},a=e===jn;function s(l){var u;return o[l]=!0,x.each(e[l]||[],function(e,l){var c=l(n,r,i);return"string"!=typeof c||a||o[c]?a?!(u=c):t:(n.dataTypes.unshift(c),s(c),!1)}),u}return s(n.dataTypes[0])||!o["*"]&&s("*")}function _n(e,n){var r,i,o=x.ajaxSettings.flatOptions||{};for(i in n)n[i]!==t&&((o[i]?e:r||(r={}))[i]=n[i]);return r&&x.extend(!0,e,r),e}x.fn.load=function(e,n,r){if("string"!=typeof e&&Sn)return Sn.apply(this,arguments);var i,o,a,s=this,l=e.indexOf(" ");return l>=0&&(i=e.slice(l,e.length),e=e.slice(0,l)),x.isFunction(n)?(r=n,n=t):n&&"object"==typeof n&&(a="POST"),s.length>0&&x.ajax({url:e,type:a,dataType:"html",data:n}).done(function(e){o=arguments,s.html(i?x("<div>").append(x.parseHTML(e)).find(i):e)}).complete(r&&function(e,t){s.each(r,o||[e.responseText,t,e])}),this},x.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(e,t){x.fn[t]=function(e){return this.on(t,e)}}),x.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:yn,type:"GET",isLocal:Cn.test(mn[1]),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Dn,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":x.parseJSON,"text xml":x.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(e,t){return t?_n(_n(e,x.ajaxSettings),t):_n(x.ajaxSettings,e)},ajaxPrefilter:Hn(An),ajaxTransport:Hn(jn),ajax:function(e,n){"object"==typeof e&&(n=e,e=t),n=n||{};var r,i,o,a,s,l,u,c,p=x.ajaxSetup({},n),f=p.context||p,d=p.context&&(f.nodeType||f.jquery)?x(f):x.event,h=x.Deferred(),g=x.Callbacks("once memory"),m=p.statusCode||{},y={},v={},b=0,w="canceled",C={readyState:0,getResponseHeader:function(e){var t;if(2===b){if(!c){c={};while(t=Tn.exec(a))c[t[1].toLowerCase()]=t[2]}t=c[e.toLowerCase()]}return null==t?null:t},getAllResponseHeaders:function(){return 2===b?a:null},setRequestHeader:function(e,t){var n=e.toLowerCase();return b||(e=v[n]=v[n]||e,y[e]=t),this},overrideMimeType:function(e){return b||(p.mimeType=e),this},statusCode:function(e){var t;if(e)if(2>b)for(t in e)m[t]=[m[t],e[t]];else C.always(e[C.status]);return this},abort:function(e){var t=e||w;return u&&u.abort(t),k(0,t),this}};if(h.promise(C).complete=g.add,C.success=C.done,C.error=C.fail,p.url=((e||p.url||yn)+"").replace(xn,"").replace(kn,mn[1]+"//"),p.type=n.method||n.type||p.method||p.type,p.dataTypes=x.trim(p.dataType||"*").toLowerCase().match(T)||[""],null==p.crossDomain&&(r=En.exec(p.url.toLowerCase()),p.crossDomain=!(!r||r[1]===mn[1]&&r[2]===mn[2]&&(r[3]||("http:"===r[1]?"80":"443"))===(mn[3]||("http:"===mn[1]?"80":"443")))),p.data&&p.processData&&"string"!=typeof p.data&&(p.data=x.param(p.data,p.traditional)),qn(An,p,n,C),2===b)return C;l=p.global,l&&0===x.active++&&x.event.trigger("ajaxStart"),p.type=p.type.toUpperCase(),p.hasContent=!Nn.test(p.type),o=p.url,p.hasContent||(p.data&&(o=p.url+=(bn.test(o)?"&":"?")+p.data,delete p.data),p.cache===!1&&(p.url=wn.test(o)?o.replace(wn,"$1_="+vn++):o+(bn.test(o)?"&":"?")+"_="+vn++)),p.ifModified&&(x.lastModified[o]&&C.setRequestHeader("If-Modified-Since",x.lastModified[o]),x.etag[o]&&C.setRequestHeader("If-None-Match",x.etag[o])),(p.data&&p.hasContent&&p.contentType!==!1||n.contentType)&&C.setRequestHeader("Content-Type",p.contentType),C.setRequestHeader("Accept",p.dataTypes[0]&&p.accepts[p.dataTypes[0]]?p.accepts[p.dataTypes[0]]+("*"!==p.dataTypes[0]?", "+Dn+"; q=0.01":""):p.accepts["*"]);for(i in p.headers)C.setRequestHeader(i,p.headers[i]);if(p.beforeSend&&(p.beforeSend.call(f,C,p)===!1||2===b))return C.abort();w="abort";for(i in{success:1,error:1,complete:1})C[i](p[i]);if(u=qn(jn,p,n,C)){C.readyState=1,l&&d.trigger("ajaxSend",[C,p]),p.async&&p.timeout>0&&(s=setTimeout(function(){C.abort("timeout")},p.timeout));try{b=1,u.send(y,k)}catch(N){if(!(2>b))throw N;k(-1,N)}}else k(-1,"No Transport");function k(e,n,r,i){var c,y,v,w,T,N=n;2!==b&&(b=2,s&&clearTimeout(s),u=t,a=i||"",C.readyState=e>0?4:0,c=e>=200&&300>e||304===e,r&&(w=Mn(p,C,r)),w=On(p,w,C,c),c?(p.ifModified&&(T=C.getResponseHeader("Last-Modified"),T&&(x.lastModified[o]=T),T=C.getResponseHeader("etag"),T&&(x.etag[o]=T)),204===e||"HEAD"===p.type?N="nocontent":304===e?N="notmodified":(N=w.state,y=w.data,v=w.error,c=!v)):(v=N,(e||!N)&&(N="error",0>e&&(e=0))),C.status=e,C.statusText=(n||N)+"",c?h.resolveWith(f,[y,N,C]):h.rejectWith(f,[C,N,v]),C.statusCode(m),m=t,l&&d.trigger(c?"ajaxSuccess":"ajaxError",[C,p,c?y:v]),g.fireWith(f,[C,N]),l&&(d.trigger("ajaxComplete",[C,p]),--x.active||x.event.trigger("ajaxStop")))}return C},getJSON:function(e,t,n){return x.get(e,t,n,"json")},getScript:function(e,n){return x.get(e,t,n,"script")}}),x.each(["get","post"],function(e,n){x[n]=function(e,r,i,o){return x.isFunction(r)&&(o=o||i,i=r,r=t),x.ajax({url:e,type:n,dataType:o,data:r,success:i})}});function Mn(e,n,r){var i,o,a,s,l=e.contents,u=e.dataTypes;while("*"===u[0])u.shift(),o===t&&(o=e.mimeType||n.getResponseHeader("Content-Type"));if(o)for(s in l)if(l[s]&&l[s].test(o)){u.unshift(s);break}if(u[0]in r)a=u[0];else{for(s in r){if(!u[0]||e.converters[s+" "+u[0]]){a=s;break}i||(i=s)}a=a||i}return a?(a!==u[0]&&u.unshift(a),r[a]):t}function On(e,t,n,r){var i,o,a,s,l,u={},c=e.dataTypes.slice();if(c[1])for(a in e.converters)u[a.toLowerCase()]=e.converters[a];o=c.shift();while(o)if(e.responseFields[o]&&(n[e.responseFields[o]]=t),!l&&r&&e.dataFilter&&(t=e.dataFilter(t,e.dataType)),l=o,o=c.shift())if("*"===o)o=l;else if("*"!==l&&l!==o){if(a=u[l+" "+o]||u["* "+o],!a)for(i in u)if(s=i.split(" "),s[1]===o&&(a=u[l+" "+s[0]]||u["* "+s[0]])){a===!0?a=u[i]:u[i]!==!0&&(o=s[0],c.unshift(s[1]));break}if(a!==!0)if(a&&e["throws"])t=a(t);else try{t=a(t)}catch(p){return{state:"parsererror",error:a?p:"No conversion from "+l+" to "+o}}}return{state:"success",data:t}}x.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(e){return x.globalEval(e),e}}}),x.ajaxPrefilter("script",function(e){e.cache===t&&(e.cache=!1),e.crossDomain&&(e.type="GET",e.global=!1)}),x.ajaxTransport("script",function(e){if(e.crossDomain){var n,r=a.head||x("head")[0]||a.documentElement;return{send:function(t,i){n=a.createElement("script"),n.async=!0,e.scriptCharset&&(n.charset=e.scriptCharset),n.src=e.url,n.onload=n.onreadystatechange=function(e,t){(t||!n.readyState||/loaded|complete/.test(n.readyState))&&(n.onload=n.onreadystatechange=null,n.parentNode&&n.parentNode.removeChild(n),n=null,t||i(200,"success"))},r.insertBefore(n,r.firstChild)},abort:function(){n&&n.onload(t,!0)}}}});var Fn=[],Bn=/(=)\?(?=&|$)|\?\?/;x.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=Fn.pop()||x.expando+"_"+vn++;return this[e]=!0,e}}),x.ajaxPrefilter("json jsonp",function(n,r,i){var o,a,s,l=n.jsonp!==!1&&(Bn.test(n.url)?"url":"string"==typeof n.data&&!(n.contentType||"").indexOf("application/x-www-form-urlencoded")&&Bn.test(n.data)&&"data");return l||"jsonp"===n.dataTypes[0]?(o=n.jsonpCallback=x.isFunction(n.jsonpCallback)?n.jsonpCallback():n.jsonpCallback,l?n[l]=n[l].replace(Bn,"$1"+o):n.jsonp!==!1&&(n.url+=(bn.test(n.url)?"&":"?")+n.jsonp+"="+o),n.converters["script json"]=function(){return s||x.error(o+" was not called"),s[0]},n.dataTypes[0]="json",a=e[o],e[o]=function(){s=arguments},i.always(function(){e[o]=a,n[o]&&(n.jsonpCallback=r.jsonpCallback,Fn.push(o)),s&&x.isFunction(a)&&a(s[0]),s=a=t}),"script"):t});var Pn,Rn,Wn=0,$n=e.ActiveXObject&&function(){var e;for(e in Pn)Pn[e](t,!0)};function In(){try{return new e.XMLHttpRequest}catch(t){}}function zn(){try{return new e.ActiveXObject("Microsoft.XMLHTTP")}catch(t){}}x.ajaxSettings.xhr=e.ActiveXObject?function(){return!this.isLocal&&In()||zn()}:In,Rn=x.ajaxSettings.xhr(),x.support.cors=!!Rn&&"withCredentials"in Rn,Rn=x.support.ajax=!!Rn,Rn&&x.ajaxTransport(function(n){if(!n.crossDomain||x.support.cors){var r;return{send:function(i,o){var a,s,l=n.xhr();if(n.username?l.open(n.type,n.url,n.async,n.username,n.password):l.open(n.type,n.url,n.async),n.xhrFields)for(s in n.xhrFields)l[s]=n.xhrFields[s];n.mimeType&&l.overrideMimeType&&l.overrideMimeType(n.mimeType),n.crossDomain||i["X-Requested-With"]||(i["X-Requested-With"]="XMLHttpRequest");try{for(s in i)l.setRequestHeader(s,i[s])}catch(u){}l.send(n.hasContent&&n.data||null),r=function(e,i){var s,u,c,p;try{if(r&&(i||4===l.readyState))if(r=t,a&&(l.onreadystatechange=x.noop,$n&&delete Pn[a]),i)4!==l.readyState&&l.abort();else{p={},s=l.status,u=l.getAllResponseHeaders(),"string"==typeof l.responseText&&(p.text=l.responseText);try{c=l.statusText}catch(f){c=""}s||!n.isLocal||n.crossDomain?1223===s&&(s=204):s=p.text?200:404}}catch(d){i||o(-1,d)}p&&o(s,c,p,u)},n.async?4===l.readyState?setTimeout(r):(a=++Wn,$n&&(Pn||(Pn={},x(e).unload($n)),Pn[a]=r),l.onreadystatechange=r):r()},abort:function(){r&&r(t,!0)}}}});var Xn,Un,Vn=/^(?:toggle|show|hide)$/,Yn=RegExp("^(?:([+-])=|)("+w+")([a-z%]*)$","i"),Jn=/queueHooks$/,Gn=[nr],Qn={"*":[function(e,t){var n=this.createTween(e,t),r=n.cur(),i=Yn.exec(t),o=i&&i[3]||(x.cssNumber[e]?"":"px"),a=(x.cssNumber[e]||"px"!==o&&+r)&&Yn.exec(x.css(n.elem,e)),s=1,l=20;if(a&&a[3]!==o){o=o||a[3],i=i||[],a=+r||1;do s=s||".5",a/=s,x.style(n.elem,e,a+o);while(s!==(s=n.cur()/r)&&1!==s&&--l)}return i&&(a=n.start=+a||+r||0,n.unit=o,n.end=i[1]?a+(i[1]+1)*i[2]:+i[2]),n}]};function Kn(){return setTimeout(function(){Xn=t}),Xn=x.now()}function Zn(e,t,n){var r,i=(Qn[t]||[]).concat(Qn["*"]),o=0,a=i.length;for(;a>o;o++)if(r=i[o].call(n,t,e))return r}function er(e,t,n){var r,i,o=0,a=Gn.length,s=x.Deferred().always(function(){delete l.elem}),l=function(){if(i)return!1;var t=Xn||Kn(),n=Math.max(0,u.startTime+u.duration-t),r=n/u.duration||0,o=1-r,a=0,l=u.tweens.length;for(;l>a;a++)u.tweens[a].run(o);return s.notifyWith(e,[u,o,n]),1>o&&l?n:(s.resolveWith(e,[u]),!1)},u=s.promise({elem:e,props:x.extend({},t),opts:x.extend(!0,{specialEasing:{}},n),originalProperties:t,originalOptions:n,startTime:Xn||Kn(),duration:n.duration,tweens:[],createTween:function(t,n){var r=x.Tween(e,u.opts,t,n,u.opts.specialEasing[t]||u.opts.easing);return u.tweens.push(r),r},stop:function(t){var n=0,r=t?u.tweens.length:0;if(i)return this;for(i=!0;r>n;n++)u.tweens[n].run(1);return t?s.resolveWith(e,[u,t]):s.rejectWith(e,[u,t]),this}}),c=u.props;for(tr(c,u.opts.specialEasing);a>o;o++)if(r=Gn[o].call(u,e,c,u.opts))return r;return x.map(c,Zn,u),x.isFunction(u.opts.start)&&u.opts.start.call(e,u),x.fx.timer(x.extend(l,{elem:e,anim:u,queue:u.opts.queue})),u.progress(u.opts.progress).done(u.opts.done,u.opts.complete).fail(u.opts.fail).always(u.opts.always)}function tr(e,t){var n,r,i,o,a;for(n in e)if(r=x.camelCase(n),i=t[r],o=e[n],x.isArray(o)&&(i=o[1],o=e[n]=o[0]),n!==r&&(e[r]=o,delete e[n]),a=x.cssHooks[r],a&&"expand"in a){o=a.expand(o),delete e[r];for(n in o)n in e||(e[n]=o[n],t[n]=i)}else t[r]=i}x.Animation=x.extend(er,{tweener:function(e,t){x.isFunction(e)?(t=e,e=["*"]):e=e.split(" ");var n,r=0,i=e.length;for(;i>r;r++)n=e[r],Qn[n]=Qn[n]||[],Qn[n].unshift(t)},prefilter:function(e,t){t?Gn.unshift(e):Gn.push(e)}});function nr(e,t,n){var r,i,o,a,s,l,u=this,c={},p=e.style,f=e.nodeType&&nn(e),d=x._data(e,"fxshow");n.queue||(s=x._queueHooks(e,"fx"),null==s.unqueued&&(s.unqueued=0,l=s.empty.fire,s.empty.fire=function(){s.unqueued||l()}),s.unqueued++,u.always(function(){u.always(function(){s.unqueued--,x.queue(e,"fx").length||s.empty.fire()})})),1===e.nodeType&&("height"in t||"width"in t)&&(n.overflow=[p.overflow,p.overflowX,p.overflowY],"inline"===x.css(e,"display")&&"none"===x.css(e,"float")&&(x.support.inlineBlockNeedsLayout&&"inline"!==ln(e.nodeName)?p.zoom=1:p.display="inline-block")),n.overflow&&(p.overflow="hidden",x.support.shrinkWrapBlocks||u.always(function(){p.overflow=n.overflow[0],p.overflowX=n.overflow[1],p.overflowY=n.overflow[2]}));for(r in t)if(i=t[r],Vn.exec(i)){if(delete t[r],o=o||"toggle"===i,i===(f?"hide":"show"))continue;c[r]=d&&d[r]||x.style(e,r)}if(!x.isEmptyObject(c)){d?"hidden"in d&&(f=d.hidden):d=x._data(e,"fxshow",{}),o&&(d.hidden=!f),f?x(e).show():u.done(function(){x(e).hide()}),u.done(function(){var t;x._removeData(e,"fxshow");for(t in c)x.style(e,t,c[t])});for(r in c)a=Zn(f?d[r]:0,r,u),r in d||(d[r]=a.start,f&&(a.end=a.start,a.start="width"===r||"height"===r?1:0))}}function rr(e,t,n,r,i){return new rr.prototype.init(e,t,n,r,i)}x.Tween=rr,rr.prototype={constructor:rr,init:function(e,t,n,r,i,o){this.elem=e,this.prop=n,this.easing=i||"swing",this.options=t,this.start=this.now=this.cur(),this.end=r,this.unit=o||(x.cssNumber[n]?"":"px")},cur:function(){var e=rr.propHooks[this.prop];return e&&e.get?e.get(this):rr.propHooks._default.get(this)},run:function(e){var t,n=rr.propHooks[this.prop];return this.pos=t=this.options.duration?x.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):rr.propHooks._default.set(this),this}},rr.prototype.init.prototype=rr.prototype,rr.propHooks={_default:{get:function(e){var t;return null==e.elem[e.prop]||e.elem.style&&null!=e.elem.style[e.prop]?(t=x.css(e.elem,e.prop,""),t&&"auto"!==t?t:0):e.elem[e.prop]},set:function(e){x.fx.step[e.prop]?x.fx.step[e.prop](e):e.elem.style&&(null!=e.elem.style[x.cssProps[e.prop]]||x.cssHooks[e.prop])?x.style(e.elem,e.prop,e.now+e.unit):e.elem[e.prop]=e.now}}},rr.propHooks.scrollTop=rr.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},x.each(["toggle","show","hide"],function(e,t){var n=x.fn[t];x.fn[t]=function(e,r,i){return null==e||"boolean"==typeof e?n.apply(this,arguments):this.animate(ir(t,!0),e,r,i)}}),x.fn.extend({fadeTo:function(e,t,n,r){return this.filter(nn).css("opacity",0).show().end().animate({opacity:t},e,n,r)},animate:function(e,t,n,r){var i=x.isEmptyObject(e),o=x.speed(t,n,r),a=function(){var t=er(this,x.extend({},e),o);(i||x._data(this,"finish"))&&t.stop(!0)};return a.finish=a,i||o.queue===!1?this.each(a):this.queue(o.queue,a)},stop:function(e,n,r){var i=function(e){var t=e.stop;delete e.stop,t(r)};return"string"!=typeof e&&(r=n,n=e,e=t),n&&e!==!1&&this.queue(e||"fx",[]),this.each(function(){var t=!0,n=null!=e&&e+"queueHooks",o=x.timers,a=x._data(this);if(n)a[n]&&a[n].stop&&i(a[n]);else for(n in a)a[n]&&a[n].stop&&Jn.test(n)&&i(a[n]);for(n=o.length;n--;)o[n].elem!==this||null!=e&&o[n].queue!==e||(o[n].anim.stop(r),t=!1,o.splice(n,1));(t||!r)&&x.dequeue(this,e)})},finish:function(e){return e!==!1&&(e=e||"fx"),this.each(function(){var t,n=x._data(this),r=n[e+"queue"],i=n[e+"queueHooks"],o=x.timers,a=r?r.length:0;for(n.finish=!0,x.queue(this,e,[]),i&&i.stop&&i.stop.call(this,!0),t=o.length;t--;)o[t].elem===this&&o[t].queue===e&&(o[t].anim.stop(!0),o.splice(t,1));for(t=0;a>t;t++)r[t]&&r[t].finish&&r[t].finish.call(this);delete n.finish})}});function ir(e,t){var n,r={height:e},i=0;for(t=t?1:0;4>i;i+=2-t)n=Zt[i],r["margin"+n]=r["padding"+n]=e;return t&&(r.opacity=r.width=e),r}x.each({slideDown:ir("show"),slideUp:ir("hide"),slideToggle:ir("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,t){x.fn[e]=function(e,n,r){return this.animate(t,e,n,r)}}),x.speed=function(e,t,n){var r=e&&"object"==typeof e?x.extend({},e):{complete:n||!n&&t||x.isFunction(e)&&e,duration:e,easing:n&&t||t&&!x.isFunction(t)&&t};return r.duration=x.fx.off?0:"number"==typeof r.duration?r.duration:r.duration in x.fx.speeds?x.fx.speeds[r.duration]:x.fx.speeds._default,(null==r.queue||r.queue===!0)&&(r.queue="fx"),r.old=r.complete,r.complete=function(){x.isFunction(r.old)&&r.old.call(this),r.queue&&x.dequeue(this,r.queue)},r},x.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2}},x.timers=[],x.fx=rr.prototype.init,x.fx.tick=function(){var e,n=x.timers,r=0;for(Xn=x.now();n.length>r;r++)e=n[r],e()||n[r]!==e||n.splice(r--,1);n.length||x.fx.stop(),Xn=t},x.fx.timer=function(e){e()&&x.timers.push(e)&&x.fx.start()},x.fx.interval=13,x.fx.start=function(){Un||(Un=setInterval(x.fx.tick,x.fx.interval))},x.fx.stop=function(){clearInterval(Un),Un=null},x.fx.speeds={slow:600,fast:200,_default:400},x.fx.step={},x.expr&&x.expr.filters&&(x.expr.filters.animated=function(e){return x.grep(x.timers,function(t){return e===t.elem}).length}),x.fn.offset=function(e){if(arguments.length)return e===t?this:this.each(function(t){x.offset.setOffset(this,e,t)});var n,r,o={top:0,left:0},a=this[0],s=a&&a.ownerDocument;if(s)return n=s.documentElement,x.contains(n,a)?(typeof a.getBoundingClientRect!==i&&(o=a.getBoundingClientRect()),r=or(s),{top:o.top+(r.pageYOffset||n.scrollTop)-(n.clientTop||0),left:o.left+(r.pageXOffset||n.scrollLeft)-(n.clientLeft||0)}):o},x.offset={setOffset:function(e,t,n){var r=x.css(e,"position");"static"===r&&(e.style.position="relative");var i=x(e),o=i.offset(),a=x.css(e,"top"),s=x.css(e,"left"),l=("absolute"===r||"fixed"===r)&&x.inArray("auto",[a,s])>-1,u={},c={},p,f;l?(c=i.position(),p=c.top,f=c.left):(p=parseFloat(a)||0,f=parseFloat(s)||0),x.isFunction(t)&&(t=t.call(e,n,o)),null!=t.top&&(u.top=t.top-o.top+p),null!=t.left&&(u.left=t.left-o.left+f),"using"in t?t.using.call(e,u):i.css(u)}},x.fn.extend({position:function(){if(this[0]){var e,t,n={top:0,left:0},r=this[0];return"fixed"===x.css(r,"position")?t=r.getBoundingClientRect():(e=this.offsetParent(),t=this.offset(),x.nodeName(e[0],"html")||(n=e.offset()),n.top+=x.css(e[0],"borderTopWidth",!0),n.left+=x.css(e[0],"borderLeftWidth",!0)),{top:t.top-n.top-x.css(r,"marginTop",!0),left:t.left-n.left-x.css(r,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var e=this.offsetParent||s;while(e&&!x.nodeName(e,"html")&&"static"===x.css(e,"position"))e=e.offsetParent;return e||s})}}),x.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(e,n){var r=/Y/.test(n);x.fn[e]=function(i){return x.access(this,function(e,i,o){var a=or(e);return o===t?a?n in a?a[n]:a.document.documentElement[i]:e[i]:(a?a.scrollTo(r?x(a).scrollLeft():o,r?o:x(a).scrollTop()):e[i]=o,t)},e,i,arguments.length,null)}});function or(e){return x.isWindow(e)?e:9===e.nodeType?e.defaultView||e.parentWindow:!1}x.each({Height:"height",Width:"width"},function(e,n){x.each({padding:"inner"+e,content:n,"":"outer"+e},function(r,i){x.fn[i]=function(i,o){var a=arguments.length&&(r||"boolean"!=typeof i),s=r||(i===!0||o===!0?"margin":"border");return x.access(this,function(n,r,i){var o;return x.isWindow(n)?n.document.documentElement["client"+e]:9===n.nodeType?(o=n.documentElement,Math.max(n.body["scroll"+e],o["scroll"+e],n.body["offset"+e],o["offset"+e],o["client"+e])):i===t?x.css(n,r,s):x.style(n,r,i,s)},n,a?i:t,a,null)}})}),x.fn.size=function(){return this.length},x.fn.andSelf=x.fn.addBack,"object"==typeof module&&module&&"object"==typeof module.exports?module.exports=x:(e.jQuery=e.$=x,"function"==typeof define&&define.amd&&define("jquery",[],function(){return x}))})(window);
;/*! jQuery Mobile 1.3.1 | Git HEAD hash: 74b4bec <> 2013-04-08T19:41:28Z | (c) 2010, 2013 jQuery Foundation, Inc. | jquery.org/license */
(function(e,t,i){"function"==typeof define&&define.amd?define(["jquery"],function(n){return i(n,e,t),n.mobile}):i(e.jQuery,e,t)})(this,document,function(e,t,i,n){(function(e){e.mobile={}})(e),function(e,t,n){var a={};e.mobile=e.extend(e.mobile,{version:"1.3.1",ns:"",subPageUrlKey:"ui-page",activePageClass:"ui-page-active",activeBtnClass:"ui-btn-active",focusClass:"ui-focus",ajaxEnabled:!0,hashListeningEnabled:!0,linkBindingEnabled:!0,defaultPageTransition:"fade",maxTransitionWidth:!1,minScrollBack:250,touchOverflowEnabled:!1,defaultDialogTransition:"pop",pageLoadErrorMessage:"Error Loading Page",pageLoadErrorMessageTheme:"e",phonegapNavigationEnabled:!1,autoInitializePage:!0,pushStateEnabled:!0,ignoreContentEnabled:!1,orientationChangeEnabled:!0,buttonMarkup:{hoverDelay:200},window:e(t),document:e(i),keyCode:{ALT:18,BACKSPACE:8,CAPS_LOCK:20,COMMA:188,COMMAND:91,COMMAND_LEFT:91,COMMAND_RIGHT:93,CONTROL:17,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,INSERT:45,LEFT:37,MENU:93,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SHIFT:16,SPACE:32,TAB:9,UP:38,WINDOWS:91},behaviors:{},silentScroll:function(i){"number"!==e.type(i)&&(i=e.mobile.defaultHomeScroll),e.event.special.scrollstart.enabled=!1,setTimeout(function(){t.scrollTo(0,i),e.mobile.document.trigger("silentscroll",{x:0,y:i})},20),setTimeout(function(){e.event.special.scrollstart.enabled=!0},150)},nsNormalizeDict:a,nsNormalize:function(t){return t?a[t]||(a[t]=e.camelCase(e.mobile.ns+t)):n},getInheritedTheme:function(e,t){for(var i,n,a=e[0],o="",s=/ui-(bar|body|overlay)-([a-z])\b/;a&&(i=a.className||"",!(i&&(n=s.exec(i))&&(o=n[2])));)a=a.parentNode;return o||t||"a"},closestPageData:function(e){return e.closest(':jqmData(role="page"), :jqmData(role="dialog")').data("mobile-page")},enhanceable:function(e){return this.haveParents(e,"enhance")},hijackable:function(e){return this.haveParents(e,"ajax")},haveParents:function(t,i){if(!e.mobile.ignoreContentEnabled)return t;for(var n,a,o,s=t.length,r=e(),l=0;s>l;l++){for(a=t.eq(l),o=!1,n=t[l];n;){var d=n.getAttribute?n.getAttribute("data-"+e.mobile.ns+i):"";if("false"===d){o=!0;break}n=n.parentNode}o||(r=r.add(a))}return r},getScreenHeight:function(){return t.innerHeight||e.mobile.window.height()}},e.mobile),e.fn.jqmData=function(t,i){var a;return t!==n&&(t&&(t=e.mobile.nsNormalize(t)),a=2>arguments.length||i===n?this.data(t):this.data(t,i)),a},e.jqmData=function(t,i,a){var o;return i!==n&&(o=e.data(t,i?e.mobile.nsNormalize(i):i,a)),o},e.fn.jqmRemoveData=function(t){return this.removeData(e.mobile.nsNormalize(t))},e.jqmRemoveData=function(t,i){return e.removeData(t,e.mobile.nsNormalize(i))},e.fn.removeWithDependents=function(){e.removeWithDependents(this)},e.removeWithDependents=function(t){var i=e(t);(i.jqmData("dependents")||e()).remove(),i.remove()},e.fn.addDependents=function(t){e.addDependents(e(this),t)},e.addDependents=function(t,i){var n=e(t).jqmData("dependents")||e();e(t).jqmData("dependents",e.merge(n,i))},e.fn.getEncodedText=function(){return e("<div/>").text(e(this).text()).html()},e.fn.jqmEnhanceable=function(){return e.mobile.enhanceable(this)},e.fn.jqmHijackable=function(){return e.mobile.hijackable(this)};var o=e.find,s=/:jqmData\(([^)]*)\)/g;e.find=function(t,i,n,a){return t=t.replace(s,"[data-"+(e.mobile.ns||"")+"$1]"),o.call(this,t,i,n,a)},e.extend(e.find,o),e.find.matches=function(t,i){return e.find(t,null,null,i)},e.find.matchesSelector=function(t,i){return e.find(i,null,null,[t]).length>0}}(e,this),function(e,t){var i=0,n=Array.prototype.slice,a=e.cleanData;e.cleanData=function(t){for(var i,n=0;null!=(i=t[n]);n++)try{e(i).triggerHandler("remove")}catch(o){}a(t)},e.widget=function(i,n,a){var o,s,r,l,d=i.split(".")[0];i=i.split(".")[1],o=d+"-"+i,a||(a=n,n=e.Widget),e.expr[":"][o.toLowerCase()]=function(t){return!!e.data(t,o)},e[d]=e[d]||{},s=e[d][i],r=e[d][i]=function(e,i){return this._createWidget?(arguments.length&&this._createWidget(e,i),t):new r(e,i)},e.extend(r,s,{version:a.version,_proto:e.extend({},a),_childConstructors:[]}),l=new n,l.options=e.widget.extend({},l.options),e.each(a,function(t,i){e.isFunction(i)&&(a[t]=function(){var e=function(){return n.prototype[t].apply(this,arguments)},a=function(e){return n.prototype[t].apply(this,e)};return function(){var t,n=this._super,o=this._superApply;return this._super=e,this._superApply=a,t=i.apply(this,arguments),this._super=n,this._superApply=o,t}}())}),r.prototype=e.widget.extend(l,{widgetEventPrefix:s?l.widgetEventPrefix:i},a,{constructor:r,namespace:d,widgetName:i,widgetFullName:o}),s?(e.each(s._childConstructors,function(t,i){var n=i.prototype;e.widget(n.namespace+"."+n.widgetName,r,i._proto)}),delete s._childConstructors):n._childConstructors.push(r),e.widget.bridge(i,r)},e.widget.extend=function(i){for(var a,o,s=n.call(arguments,1),r=0,l=s.length;l>r;r++)for(a in s[r])o=s[r][a],s[r].hasOwnProperty(a)&&o!==t&&(i[a]=e.isPlainObject(o)?e.isPlainObject(i[a])?e.widget.extend({},i[a],o):e.widget.extend({},o):o);return i},e.widget.bridge=function(i,a){var o=a.prototype.widgetFullName||i;e.fn[i]=function(s){var r="string"==typeof s,l=n.call(arguments,1),d=this;return s=!r&&l.length?e.widget.extend.apply(null,[s].concat(l)):s,r?this.each(function(){var n,a=e.data(this,o);return a?e.isFunction(a[s])&&"_"!==s.charAt(0)?(n=a[s].apply(a,l),n!==a&&n!==t?(d=n&&n.jquery?d.pushStack(n.get()):n,!1):t):e.error("no such method '"+s+"' for "+i+" widget instance"):e.error("cannot call methods on "+i+" prior to initialization; "+"attempted to call method '"+s+"'")}):this.each(function(){var t=e.data(this,o);t?t.option(s||{})._init():e.data(this,o,new a(s,this))}),d}},e.Widget=function(){},e.Widget._childConstructors=[],e.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",defaultElement:"<div>",options:{disabled:!1,create:null},_createWidget:function(t,n){n=e(n||this.defaultElement||this)[0],this.element=e(n),this.uuid=i++,this.eventNamespace="."+this.widgetName+this.uuid,this.options=e.widget.extend({},this.options,this._getCreateOptions(),t),this.bindings=e(),this.hoverable=e(),this.focusable=e(),n!==this&&(e.data(n,this.widgetFullName,this),this._on(!0,this.element,{remove:function(e){e.target===n&&this.destroy()}}),this.document=e(n.style?n.ownerDocument:n.document||n),this.window=e(this.document[0].defaultView||this.document[0].parentWindow)),this._create(),this._trigger("create",null,this._getCreateEventData()),this._init()},_getCreateOptions:e.noop,_getCreateEventData:e.noop,_create:e.noop,_init:e.noop,destroy:function(){this._destroy(),this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData(e.camelCase(this.widgetFullName)),this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName+"-disabled "+"ui-state-disabled"),this.bindings.unbind(this.eventNamespace),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")},_destroy:e.noop,widget:function(){return this.element},option:function(i,n){var a,o,s,r=i;if(0===arguments.length)return e.widget.extend({},this.options);if("string"==typeof i)if(r={},a=i.split("."),i=a.shift(),a.length){for(o=r[i]=e.widget.extend({},this.options[i]),s=0;a.length-1>s;s++)o[a[s]]=o[a[s]]||{},o=o[a[s]];if(i=a.pop(),n===t)return o[i]===t?null:o[i];o[i]=n}else{if(n===t)return this.options[i]===t?null:this.options[i];r[i]=n}return this._setOptions(r),this},_setOptions:function(e){var t;for(t in e)this._setOption(t,e[t]);return this},_setOption:function(e,t){return this.options[e]=t,"disabled"===e&&(this.widget().toggleClass(this.widgetFullName+"-disabled ui-state-disabled",!!t).attr("aria-disabled",t),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")),this},enable:function(){return this._setOption("disabled",!1)},disable:function(){return this._setOption("disabled",!0)},_on:function(i,n,a){var o,s=this;"boolean"!=typeof i&&(a=n,n=i,i=!1),a?(n=o=e(n),this.bindings=this.bindings.add(n)):(a=n,n=this.element,o=this.widget()),e.each(a,function(a,r){function l(){return i||s.options.disabled!==!0&&!e(this).hasClass("ui-state-disabled")?("string"==typeof r?s[r]:r).apply(s,arguments):t}"string"!=typeof r&&(l.guid=r.guid=r.guid||l.guid||e.guid++);var d=a.match(/^(\w+)\s*(.*)$/),c=d[1]+s.eventNamespace,h=d[2];h?o.delegate(h,c,l):n.bind(c,l)})},_off:function(e,t){t=(t||"").split(" ").join(this.eventNamespace+" ")+this.eventNamespace,e.unbind(t).undelegate(t)},_delay:function(e,t){function i(){return("string"==typeof e?n[e]:e).apply(n,arguments)}var n=this;return setTimeout(i,t||0)},_hoverable:function(t){this.hoverable=this.hoverable.add(t),this._on(t,{mouseenter:function(t){e(t.currentTarget).addClass("ui-state-hover")},mouseleave:function(t){e(t.currentTarget).removeClass("ui-state-hover")}})},_focusable:function(t){this.focusable=this.focusable.add(t),this._on(t,{focusin:function(t){e(t.currentTarget).addClass("ui-state-focus")},focusout:function(t){e(t.currentTarget).removeClass("ui-state-focus")}})},_trigger:function(t,i,n){var a,o,s=this.options[t];if(n=n||{},i=e.Event(i),i.type=(t===this.widgetEventPrefix?t:this.widgetEventPrefix+t).toLowerCase(),i.target=this.element[0],o=i.originalEvent)for(a in o)a in i||(i[a]=o[a]);return this.element.trigger(i,n),!(e.isFunction(s)&&s.apply(this.element[0],[i].concat(n))===!1||i.isDefaultPrevented())}},e.each({show:"fadeIn",hide:"fadeOut"},function(t,i){e.Widget.prototype["_"+t]=function(n,a,o){"string"==typeof a&&(a={effect:a});var s,r=a?a===!0||"number"==typeof a?i:a.effect||i:t;a=a||{},"number"==typeof a&&(a={duration:a}),s=!e.isEmptyObject(a),a.complete=o,a.delay&&n.delay(a.delay),s&&e.effects&&e.effects.effect[r]?n[t](a):r!==t&&n[r]?n[r](a.duration,a.easing,o):n.queue(function(i){e(this)[t](),o&&o.call(n[0]),i()})}})}(e),function(e,t){e.widget("mobile.widget",{_createWidget:function(){e.Widget.prototype._createWidget.apply(this,arguments),this._trigger("init")},_getCreateOptions:function(){var i=this.element,n={};return e.each(this.options,function(e){var a=i.jqmData(e.replace(/[A-Z]/g,function(e){return"-"+e.toLowerCase()}));a!==t&&(n[e]=a)}),n},enhanceWithin:function(t,i){this.enhance(e(this.options.initSelector,e(t)),i)},enhance:function(t,i){var n,a,o=e(t);o=e.mobile.enhanceable(o),i&&o.length&&(n=e.mobile.closestPageData(o),a=n&&n.keepNativeSelector()||"",o=o.not(a)),o[this.widgetName]()},raise:function(e){throw"Widget ["+this.widgetName+"]: "+e}})}(e),function(e){e.extend(e.mobile,{loadingMessageTextVisible:n,loadingMessageTheme:n,loadingMessage:n,showPageLoadingMsg:function(t,i,n){e.mobile.loading("show",t,i,n)},hidePageLoadingMsg:function(){e.mobile.loading("hide")},loading:function(){this.loaderWidget.loader.apply(this.loaderWidget,arguments)}});var t="ui-loader",i=e("html"),a=e.mobile.window;e.widget("mobile.loader",{options:{theme:"a",textVisible:!1,html:"",text:"loading"},defaultHtml:"<div class='"+t+"'>"+"<span class='ui-icon ui-icon-loading'></span>"+"<h1></h1>"+"</div>",fakeFixLoader:function(){var t=e("."+e.mobile.activeBtnClass).first();this.element.css({top:e.support.scrollTop&&a.scrollTop()+a.height()/2||t.length&&t.offset().top||100})},checkLoaderPosition:function(){var t=this.element.offset(),i=a.scrollTop(),n=e.mobile.getScreenHeight();(i>t.top||t.top-i>n)&&(this.element.addClass("ui-loader-fakefix"),this.fakeFixLoader(),a.unbind("scroll",this.checkLoaderPosition).bind("scroll",e.proxy(this.fakeFixLoader,this)))},resetHtml:function(){this.element.html(e(this.defaultHtml).html())},show:function(o,s,r){var l,d,c;this.resetHtml(),"object"===e.type(o)?(c=e.extend({},this.options,o),o=c.theme||e.mobile.loadingMessageTheme):(c=this.options,o=o||e.mobile.loadingMessageTheme||c.theme),d=s||e.mobile.loadingMessage||c.text,i.addClass("ui-loading"),(e.mobile.loadingMessage!==!1||c.html)&&(l=e.mobile.loadingMessageTextVisible!==n?e.mobile.loadingMessageTextVisible:c.textVisible,this.element.attr("class",t+" ui-corner-all ui-body-"+o+" ui-loader-"+(l||s||o.text?"verbose":"default")+(c.textonly||r?" ui-loader-textonly":"")),c.html?this.element.html(c.html):this.element.find("h1").text(d),this.element.appendTo(e.mobile.pageContainer),this.checkLoaderPosition(),a.bind("scroll",e.proxy(this.checkLoaderPosition,this)))},hide:function(){i.removeClass("ui-loading"),e.mobile.loadingMessage&&this.element.removeClass("ui-loader-fakefix"),e.mobile.window.unbind("scroll",this.fakeFixLoader),e.mobile.window.unbind("scroll",this.checkLoaderPosition)}}),a.bind("pagecontainercreate",function(){e.mobile.loaderWidget=e.mobile.loaderWidget||e(e.mobile.loader.prototype.defaultHtml).loader()})}(e,this),function(e,t,n){function a(e){return e=e||location.href,"#"+e.replace(/^[^#]*#?(.*)$/,"$1")}var o,s="hashchange",r=i,l=e.event.special,d=r.documentMode,c="on"+s in t&&(d===n||d>7);e.fn[s]=function(e){return e?this.bind(s,e):this.trigger(s)},e.fn[s].delay=50,l[s]=e.extend(l[s],{setup:function(){return c?!1:(e(o.start),n)},teardown:function(){return c?!1:(e(o.stop),n)}}),o=function(){function i(){var n=a(),r=p(d);n!==d?(u(d=n,r),e(t).trigger(s)):r!==d&&(location.href=location.href.replace(/#.*/,"")+r),o=setTimeout(i,e.fn[s].delay)}var o,l={},d=a(),h=function(e){return e},u=h,p=h;return l.start=function(){o||i()},l.stop=function(){o&&clearTimeout(o),o=n},t.attachEvent&&!t.addEventListener&&!c&&function(){var t,n;l.start=function(){t||(n=e.fn[s].src,n=n&&n+a(),t=e('<iframe tabindex="-1" title="empty"/>').hide().one("load",function(){n||u(a()),i()}).attr("src",n||"javascript:0").insertAfter("body")[0].contentWindow,r.onpropertychange=function(){try{"title"===event.propertyName&&(t.document.title=r.title)}catch(e){}})},l.stop=h,p=function(){return a(t.location.href)},u=function(i,n){var a=t.document,o=e.fn[s].domain;i!==n&&(a.title=r.title,a.open(),o&&a.write('<script>document.domain="'+o+'"</script>'),a.close(),t.location.hash=i)}}(),l}()}(e,this),function(e){t.matchMedia=t.matchMedia||function(e){var t,i=e.documentElement,n=i.firstElementChild||i.firstChild,a=e.createElement("body"),o=e.createElement("div");return o.id="mq-test-1",o.style.cssText="position:absolute;top:-100em",a.style.background="none",a.appendChild(o),function(e){return o.innerHTML='&shy;<style media="'+e+'"> #mq-test-1 { width: 42px; }</style>',i.insertBefore(a,n),t=42===o.offsetWidth,i.removeChild(a),{matches:t,media:e}}}(i),e.mobile.media=function(e){return t.matchMedia(e).matches}}(e),function(e){var t={touch:"ontouchend"in i};e.mobile.support=e.mobile.support||{},e.extend(e.support,t),e.extend(e.mobile.support,t)}(e),function(e){e.extend(e.support,{orientation:"orientation"in t&&"onorientationchange"in t})}(e),function(e,n){function a(e){var t=e.charAt(0).toUpperCase()+e.substr(1),i=(e+" "+p.join(t+" ")+t).split(" ");for(var a in i)if(u[i[a]]!==n)return!0}function o(e,t,n){for(var a,o=i.createElement("div"),s=function(e){return e.charAt(0).toUpperCase()+e.substr(1)},r=function(e){return""===e?"":"-"+e.charAt(0).toLowerCase()+e.substr(1)+"-"},l=function(i){var n=r(i)+e+": "+t+";",l=s(i),d=l+(""===l?e:s(e));o.setAttribute("style",n),o.style[d]&&(a=!0)},d=n?n:p,c=0;d.length>c;c++)l(d[c]);return!!a}function s(){var a="transform-3d",o=e.mobile.media("(-"+p.join("-"+a+"),(-")+"-"+a+"),("+a+")");if(o)return!!o;var s=i.createElement("div"),r={MozTransform:"-moz-transform",transform:"transform"};h.append(s);for(var l in r)s.style[l]!==n&&(s.style[l]="translate3d( 100px, 1px, 1px )",o=t.getComputedStyle(s).getPropertyValue(r[l]));return!!o&&"none"!==o}function r(){var t,i,n=location.protocol+"//"+location.host+location.pathname+"ui-dir/",a=e("head base"),o=null,s="";return a.length?s=a.attr("href"):a=o=e("<base>",{href:n}).appendTo("head"),t=e("<a href='testurl' />").prependTo(h),i=t[0].href,a[0].href=s||location.pathname,o&&o.remove(),0===i.indexOf(n)}function l(){var e,n=i.createElement("x"),a=i.documentElement,o=t.getComputedStyle;return"pointerEvents"in n.style?(n.style.pointerEvents="auto",n.style.pointerEvents="x",a.appendChild(n),e=o&&"auto"===o(n,"").pointerEvents,a.removeChild(n),!!e):!1}function d(){var e=i.createElement("div");return e.getBoundingClientRect!==n}function c(){var e=t,i=navigator.userAgent,n=navigator.platform,a=i.match(/AppleWebKit\/([0-9]+)/),o=!!a&&a[1],s=i.match(/Fennec\/([0-9]+)/),r=!!s&&s[1],l=i.match(/Opera Mobi\/([0-9]+)/),d=!!l&&l[1];return(n.indexOf("iPhone")>-1||n.indexOf("iPad")>-1||n.indexOf("iPod")>-1)&&o&&534>o||e.operamini&&"[object OperaMini]"==={}.toString.call(e.operamini)||l&&7458>d||i.indexOf("Android")>-1&&o&&533>o||r&&6>r||"palmGetResource"in t&&o&&534>o||i.indexOf("MeeGo")>-1&&i.indexOf("NokiaBrowser/8.5.0")>-1?!1:!0}var h=e("<body>").prependTo("html"),u=h[0].style,p=["Webkit","Moz","O"],m="palmGetResource"in t,f=t.opera,g=t.operamini&&"[object OperaMini]"==={}.toString.call(t.operamini),b=t.blackberry&&!a("-webkit-transform");e.extend(e.mobile,{browser:{}}),e.mobile.browser.oldIE=function(){var e=3,t=i.createElement("div"),n=t.all||[];do t.innerHTML="<!--[if gt IE "+ ++e+"]><br><![endif]-->";while(n[0]);return e>4?e:!e}(),e.extend(e.support,{cssTransitions:"WebKitTransitionEvent"in t||o("transition","height 100ms linear",["Webkit","Moz",""])&&!e.mobile.browser.oldIE&&!f,pushState:"pushState"in history&&"replaceState"in history&&!(t.navigator.userAgent.indexOf("Firefox")>=0&&t.top!==t)&&-1===t.navigator.userAgent.search(/CriOS/),mediaquery:e.mobile.media("only all"),cssPseudoElement:!!a("content"),touchOverflow:!!a("overflowScrolling"),cssTransform3d:s(),boxShadow:!!a("boxShadow")&&!b,fixedPosition:c(),scrollTop:("pageXOffset"in t||"scrollTop"in i.documentElement||"scrollTop"in h[0])&&!m&&!g,dynamicBaseTag:r(),cssPointerEvents:l(),boundingRect:d()}),h.remove();var v=function(){var e=t.navigator.userAgent;return e.indexOf("Nokia")>-1&&(e.indexOf("Symbian/3")>-1||e.indexOf("Series60/5")>-1)&&e.indexOf("AppleWebKit")>-1&&e.match(/(BrowserNG|NokiaBrowser)\/7\.[0-3]/)}();e.mobile.gradeA=function(){return(e.support.mediaquery||e.mobile.browser.oldIE&&e.mobile.browser.oldIE>=7)&&(e.support.boundingRect||null!==e.fn.jquery.match(/1\.[0-7+]\.[0-9+]?/))},e.mobile.ajaxBlacklist=t.blackberry&&!t.WebKitPoint||g||v,v&&e(function(){e("head link[rel='stylesheet']").attr("rel","alternate stylesheet").attr("rel","stylesheet")}),e.support.boxShadow||e("html").addClass("ui-mobile-nosupport-boxshadow")}(e),function(e,t){var i,n=e.mobile.window;e.event.special.navigate=i={bound:!1,pushStateEnabled:!0,originalEventName:t,isPushStateEnabled:function(){return e.support.pushState&&e.mobile.pushStateEnabled===!0&&this.isHashChangeEnabled()},isHashChangeEnabled:function(){return e.mobile.hashListeningEnabled===!0},popstate:function(t){var i=new e.Event("navigate"),a=new e.Event("beforenavigate"),o=t.originalEvent.state||{};location.href,n.trigger(a),a.isDefaultPrevented()||(t.historyState&&e.extend(o,t.historyState),i.originalEvent=t,setTimeout(function(){n.trigger(i,{state:o})},0))},hashchange:function(t){var i=new e.Event("navigate"),a=new e.Event("beforenavigate");n.trigger(a),a.isDefaultPrevented()||(i.originalEvent=t,n.trigger(i,{state:t.hashchangeState||{}}))},setup:function(){i.bound||(i.bound=!0,i.isPushStateEnabled()?(i.originalEventName="popstate",n.bind("popstate.navigate",i.popstate)):i.isHashChangeEnabled()&&(i.originalEventName="hashchange",n.bind("hashchange.navigate",i.hashchange)))}}}(e),function(e,i){var n,a,o="&ui-state=dialog";e.mobile.path=n={uiStateKey:"&ui-state",urlParseRE:/^\s*(((([^:\/#\?]+:)?(?:(\/\/)((?:(([^:@\/#\?]+)(?:\:([^:@\/#\?]+))?)@)?(([^:\/#\?\]\[]+|\[[^\/\]@#?]+\])(?:\:([0-9]+))?))?)?)?((\/?(?:[^\/\?#]+\/+)*)([^\?#]*)))?(\?[^#]+)?)(#.*)?/,getLocation:function(e){var t=e?this.parseUrl(e):location,i=this.parseUrl(e||location.href).hash;return i="#"===i?"":i,t.protocol+"//"+t.host+t.pathname+t.search+i},parseLocation:function(){return this.parseUrl(this.getLocation())},parseUrl:function(t){if("object"===e.type(t))return t;var i=n.urlParseRE.exec(t||"")||[];return{href:i[0]||"",hrefNoHash:i[1]||"",hrefNoSearch:i[2]||"",domain:i[3]||"",protocol:i[4]||"",doubleSlash:i[5]||"",authority:i[6]||"",username:i[8]||"",password:i[9]||"",host:i[10]||"",hostname:i[11]||"",port:i[12]||"",pathname:i[13]||"",directory:i[14]||"",filename:i[15]||"",search:i[16]||"",hash:i[17]||""}},makePathAbsolute:function(e,t){if(e&&"/"===e.charAt(0))return e;e=e||"",t=t?t.replace(/^\/|(\/[^\/]*|[^\/]+)$/g,""):"";for(var i=t?t.split("/"):[],n=e.split("/"),a=0;n.length>a;a++){var o=n[a];switch(o){case".":break;case"..":i.length&&i.pop();break;default:i.push(o)}}return"/"+i.join("/")},isSameDomain:function(e,t){return n.parseUrl(e).domain===n.parseUrl(t).domain},isRelativeUrl:function(e){return""===n.parseUrl(e).protocol},isAbsoluteUrl:function(e){return""!==n.parseUrl(e).protocol},makeUrlAbsolute:function(e,t){if(!n.isRelativeUrl(e))return e;t===i&&(t=this.documentBase);var a=n.parseUrl(e),o=n.parseUrl(t),s=a.protocol||o.protocol,r=a.protocol?a.doubleSlash:a.doubleSlash||o.doubleSlash,l=a.authority||o.authority,d=""!==a.pathname,c=n.makePathAbsolute(a.pathname||o.filename,o.pathname),h=a.search||!d&&o.search||"",u=a.hash;return s+r+l+c+h+u},addSearchParams:function(t,i){var a=n.parseUrl(t),o="object"==typeof i?e.param(i):i,s=a.search||"?";return a.hrefNoSearch+s+("?"!==s.charAt(s.length-1)?"&":"")+o+(a.hash||"")},convertUrlToDataUrl:function(e){var i=n.parseUrl(e);return n.isEmbeddedPage(i)?i.hash.split(o)[0].replace(/^#/,"").replace(/\?.*$/,""):n.isSameDomain(i,this.documentBase)?i.hrefNoHash.replace(this.documentBase.domain,"").split(o)[0]:t.decodeURIComponent(e)},get:function(e){return e===i&&(e=n.parseLocation().hash),n.stripHash(e).replace(/[^\/]*\.[^\/*]+$/,"")},set:function(e){location.hash=e},isPath:function(e){return/\//.test(e)},clean:function(e){return e.replace(this.documentBase.domain,"")},stripHash:function(e){return e.replace(/^#/,"")},stripQueryParams:function(e){return e.replace(/\?.*$/,"")},cleanHash:function(e){return n.stripHash(e.replace(/\?.*$/,"").replace(o,""))},isHashValid:function(e){return/^#[^#]+$/.test(e)},isExternal:function(e){var t=n.parseUrl(e);return t.protocol&&t.domain!==this.documentUrl.domain?!0:!1},hasProtocol:function(e){return/^(:?\w+:)/.test(e)},isEmbeddedPage:function(e){var t=n.parseUrl(e);return""!==t.protocol?!this.isPath(t.hash)&&t.hash&&(t.hrefNoHash===this.documentUrl.hrefNoHash||this.documentBaseDiffers&&t.hrefNoHash===this.documentBase.hrefNoHash):/^#/.test(t.href)},squash:function(e,t){var i,a,o,s,r=this.isPath(e),l=this.parseUrl(e),d=l.hash,c="";return t=t||(n.isPath(e)?n.getLocation():n.getDocumentUrl()),a=r?n.stripHash(e):e,a=n.isPath(l.hash)?n.stripHash(l.hash):a,s=a.indexOf(this.uiStateKey),s>-1&&(c=a.slice(s),a=a.slice(0,s)),i=n.makeUrlAbsolute(a,t),o=this.parseUrl(i).search,r?((n.isPath(d)||0===d.replace("#","").indexOf(this.uiStateKey))&&(d=""),c&&-1===d.indexOf(this.uiStateKey)&&(d+=c),-1===d.indexOf("#")&&""!==d&&(d="#"+d),i=n.parseUrl(i),i=i.protocol+"//"+i.host+i.pathname+o+d):i+=i.indexOf("#")>-1?c:"#"+c,i},isPreservableHash:function(e){return 0===e.replace("#","").indexOf(this.uiStateKey)}},n.documentUrl=n.parseLocation(),a=e("head").find("base"),n.documentBase=a.length?n.parseUrl(n.makeUrlAbsolute(a.attr("href"),n.documentUrl.href)):n.documentUrl,n.documentBaseDiffers=n.documentUrl.hrefNoHash!==n.documentBase.hrefNoHash,n.getDocumentUrl=function(t){return t?e.extend({},n.documentUrl):n.documentUrl.href},n.getDocumentBase=function(t){return t?e.extend({},n.documentBase):n.documentBase.href}}(e),function(e,t){e.mobile.path,e.mobile.History=function(e,t){this.stack=e||[],this.activeIndex=t||0},e.extend(e.mobile.History.prototype,{getActive:function(){return this.stack[this.activeIndex]},getLast:function(){return this.stack[this.previousIndex]},getNext:function(){return this.stack[this.activeIndex+1]},getPrev:function(){return this.stack[this.activeIndex-1]},add:function(e,t){t=t||{},this.getNext()&&this.clearForward(),t.hash&&-1===t.hash.indexOf("#")&&(t.hash="#"+t.hash),t.url=e,this.stack.push(t),this.activeIndex=this.stack.length-1},clearForward:function(){this.stack=this.stack.slice(0,this.activeIndex+1)},find:function(e,t,i){t=t||this.stack;var n,a,o,s=t.length;for(a=0;s>a;a++)if(n=t[a],(decodeURIComponent(e)===decodeURIComponent(n.url)||decodeURIComponent(e)===decodeURIComponent(n.hash))&&(o=a,i))return o;return o},closest:function(e){var i,n=this.activeIndex;return i=this.find(e,this.stack.slice(0,n)),i===t&&(i=this.find(e,this.stack.slice(n),!0),i=i===t?i:i+n),i},direct:function(i){var n=this.closest(i.url),a=this.activeIndex;n!==t&&(this.activeIndex=n,this.previousIndex=a),a>n?(i.present||i.back||e.noop)(this.getActive(),"back"):n>a?(i.present||i.forward||e.noop)(this.getActive(),"forward"):n===t&&i.missing&&i.missing(this.getActive())}})}(e),function(e){var a=e.mobile.path,o=location.href;e.mobile.Navigator=function(t){this.history=t,this.ignoreInitialHashChange=!0,e.mobile.window.bind({"popstate.history":e.proxy(this.popstate,this),"hashchange.history":e.proxy(this.hashchange,this)})},e.extend(e.mobile.Navigator.prototype,{squash:function(n,o){var s,r,l=a.isPath(n)?a.stripHash(n):n;return r=a.squash(n),s=e.extend({hash:l,url:r},o),t.history.replaceState(s,s.title||i.title,r),s},hash:function(e,t){var i,n,o;if(i=a.parseUrl(e),n=a.parseLocation(),n.pathname+n.search===i.pathname+i.search)o=i.hash?i.hash:i.pathname+i.search;else if(a.isPath(e)){var s=a.parseUrl(t);o=s.pathname+s.search+(a.isPreservableHash(s.hash)?s.hash.replace("#",""):"")}else o=e;return o},go:function(n,o,s){var r,l,d,c,h=e.event.special.navigate.isPushStateEnabled();l=a.squash(n),d=this.hash(n,l),s&&d!==a.stripHash(a.parseLocation().hash)&&(this.preventNextHashChange=s),this.preventHashAssignPopState=!0,t.location.hash=d,this.preventHashAssignPopState=!1,r=e.extend({url:l,hash:d,title:i.title},o),h&&(c=new e.Event("popstate"),c.originalEvent={type:"popstate",state:null},this.squash(n,r),s||(this.ignorePopState=!0,e.mobile.window.trigger(c))),this.history.add(r.url,r)},popstate:function(t){var i,s;if(e.event.special.navigate.isPushStateEnabled())return this.preventHashAssignPopState?(this.preventHashAssignPopState=!1,t.stopImmediatePropagation(),n):this.ignorePopState?(this.ignorePopState=!1,n):!t.originalEvent.state&&1===this.history.stack.length&&this.ignoreInitialHashChange&&(this.ignoreInitialHashChange=!1,location.href===o)?(t.preventDefault(),n):(i=a.parseLocation().hash,!t.originalEvent.state&&i?(s=this.squash(i),this.history.add(s.url,s),t.historyState=s,n):(this.history.direct({url:(t.originalEvent.state||{}).url||i,present:function(i,n){t.historyState=e.extend({},i),t.historyState.direction=n}}),n))},hashchange:function(t){var o,s;if(e.event.special.navigate.isHashChangeEnabled()&&!e.event.special.navigate.isPushStateEnabled()){if(this.preventNextHashChange)return this.preventNextHashChange=!1,t.stopImmediatePropagation(),n;o=this.history,s=a.parseLocation().hash,this.history.direct({url:s,present:function(i,n){t.hashchangeState=e.extend({},i),t.hashchangeState.direction=n},missing:function(){o.add(s,{hash:s,title:i.title})}})}}})}(e),function(e){e.mobile.navigate=function(t,i,n){e.mobile.navigate.navigator.go(t,i,n)},e.mobile.navigate.history=new e.mobile.History,e.mobile.navigate.navigator=new e.mobile.Navigator(e.mobile.navigate.history);var t=e.mobile.path.parseLocation();e.mobile.navigate.history.add(t.href,{hash:t.hash})}(e),function(e,t,i,n){function a(e){for(;e&&e.originalEvent!==n;)e=e.originalEvent;return e}function o(t,i){var o,s,r,l,d,c,h,u,p,m=t.type;if(t=e.Event(t),t.type=i,o=t.originalEvent,s=e.event.props,m.search(/^(mouse|click)/)>-1&&(s=q),o)for(h=s.length,l;h;)l=s[--h],t[l]=o[l];if(m.search(/mouse(down|up)|click/)>-1&&!t.which&&(t.which=1),-1!==m.search(/^touch/)&&(r=a(o),m=r.touches,d=r.changedTouches,c=m&&m.length?m[0]:d&&d.length?d[0]:n))for(u=0,p=k.length;p>u;u++)l=k[u],t[l]=c[l];return t}function s(t){for(var i,n,a={};t;){i=e.data(t,T);for(n in i)i[n]&&(a[n]=a.hasVirtualBinding=!0);t=t.parentNode}return a}function r(t,i){for(var n;t;){if(n=e.data(t,T),n&&(!i||n[i]))return t;t=t.parentNode}return null}function l(){M=!1}function d(){M=!0}function c(){U=0,O.length=0,H=!1,d()}function h(){l()}function u(){p(),S=setTimeout(function(){S=0,c()},e.vmouse.resetTimerDuration)}function p(){S&&(clearTimeout(S),S=0)}function m(t,i,n){var a;return(n&&n[t]||!n&&r(i.target,t))&&(a=o(i,t),e(i.target).trigger(a)),a}function f(t){var i=e.data(t.target,D);if(!(H||U&&U===i)){var n=m("v"+t.type,t);n&&(n.isDefaultPrevented()&&t.preventDefault(),n.isPropagationStopped()&&t.stopPropagation(),n.isImmediatePropagationStopped()&&t.stopImmediatePropagation())}}function g(t){var i,n,o=a(t).touches;if(o&&1===o.length&&(i=t.target,n=s(i),n.hasVirtualBinding)){U=L++,e.data(i,D,U),p(),h(),I=!1;var r=a(t).touches[0];A=r.pageX,N=r.pageY,m("vmouseover",t,n),m("vmousedown",t,n)}}function b(e){M||(I||m("vmousecancel",e,s(e.target)),I=!0,u())}function v(t){if(!M){var i=a(t).touches[0],n=I,o=e.vmouse.moveDistanceThreshold,r=s(t.target);I=I||Math.abs(i.pageX-A)>o||Math.abs(i.pageY-N)>o,I&&!n&&m("vmousecancel",t,r),m("vmousemove",t,r),u()}}function _(e){if(!M){d();var t,i=s(e.target);if(m("vmouseup",e,i),!I){var n=m("vclick",e,i);n&&n.isDefaultPrevented()&&(t=a(e).changedTouches[0],O.push({touchID:U,x:t.clientX,y:t.clientY}),H=!0)}m("vmouseout",e,i),I=!1,u()}}function C(t){var i,n=e.data(t,T);if(n)for(i in n)if(n[i])return!0;return!1}function x(){}function y(t){var i=t.substr(1);return{setup:function(){C(this)||e.data(this,T,{});var n=e.data(this,T);n[t]=!0,j[t]=(j[t]||0)+1,1===j[t]&&B.bind(i,f),e(this).bind(i,x),F&&(j.touchstart=(j.touchstart||0)+1,1===j.touchstart&&B.bind("touchstart",g).bind("touchend",_).bind("touchmove",v).bind("scroll",b))},teardown:function(){--j[t],j[t]||B.unbind(i,f),F&&(--j.touchstart,j.touchstart||B.unbind("touchstart",g).unbind("touchmove",v).unbind("touchend",_).unbind("scroll",b));var n=e(this),a=e.data(this,T);a&&(a[t]=!1),n.unbind(i,x),C(this)||n.removeData(T)}}}var w,T="virtualMouseBindings",D="virtualTouchID",P="vmouseover vmousedown vmousemove vmouseup vclick vmouseout vmousecancel".split(" "),k="clientX clientY pageX pageY screenX screenY".split(" "),E=e.event.mouseHooks?e.event.mouseHooks.props:[],q=e.event.props.concat(E),j={},S=0,A=0,N=0,I=!1,O=[],H=!1,M=!1,F="addEventListener"in i,B=e(i),L=1,U=0;e.vmouse={moveDistanceThreshold:10,clickDistanceThreshold:10,resetTimerDuration:1500};for(var z=0;P.length>z;z++)e.event.special[P[z]]=y(P[z]);F&&i.addEventListener("click",function(t){var i,a,o,s,r,l,d=O.length,c=t.target;if(d)for(i=t.clientX,a=t.clientY,w=e.vmouse.clickDistanceThreshold,o=c;o;){for(s=0;d>s;s++)if(r=O[s],l=0,o===c&&w>Math.abs(r.x-i)&&w>Math.abs(r.y-a)||e.data(o,D)===r.touchID)return t.preventDefault(),t.stopPropagation(),n;o=o.parentNode}},!0)}(e,t,i),function(e,t,n){function a(t,i,n){var a=n.type;n.type=i,e.event.dispatch.call(t,n),n.type=a}var o=e(i);e.each("touchstart touchmove touchend tap taphold swipe swipeleft swiperight scrollstart scrollstop".split(" "),function(t,i){e.fn[i]=function(e){return e?this.bind(i,e):this.trigger(i)},e.attrFn&&(e.attrFn[i]=!0)});var s=e.mobile.support.touch,r="touchmove scroll",l=s?"touchstart":"mousedown",d=s?"touchend":"mouseup",c=s?"touchmove":"mousemove";e.event.special.scrollstart={enabled:!0,setup:function(){function t(e,t){i=t,a(o,i?"scrollstart":"scrollstop",e)}var i,n,o=this,s=e(o);s.bind(r,function(a){e.event.special.scrollstart.enabled&&(i||t(a,!0),clearTimeout(n),n=setTimeout(function(){t(a,!1)},50))})}},e.event.special.tap={tapholdThreshold:750,setup:function(){var t=this,i=e(t);i.bind("vmousedown",function(n){function s(){clearTimeout(d)}function r(){s(),i.unbind("vclick",l).unbind("vmouseup",s),o.unbind("vmousecancel",r)}function l(e){r(),c===e.target&&a(t,"tap",e)}if(n.which&&1!==n.which)return!1;var d,c=n.target;n.originalEvent,i.bind("vmouseup",s).bind("vclick",l),o.bind("vmousecancel",r),d=setTimeout(function(){a(t,"taphold",e.Event("taphold",{target:c}))
},e.event.special.tap.tapholdThreshold)})}},e.event.special.swipe={scrollSupressionThreshold:30,durationThreshold:1e3,horizontalDistanceThreshold:30,verticalDistanceThreshold:75,start:function(t){var i=t.originalEvent.touches?t.originalEvent.touches[0]:t;return{time:(new Date).getTime(),coords:[i.pageX,i.pageY],origin:e(t.target)}},stop:function(e){var t=e.originalEvent.touches?e.originalEvent.touches[0]:e;return{time:(new Date).getTime(),coords:[t.pageX,t.pageY]}},handleSwipe:function(t,i){i.time-t.time<e.event.special.swipe.durationThreshold&&Math.abs(t.coords[0]-i.coords[0])>e.event.special.swipe.horizontalDistanceThreshold&&Math.abs(t.coords[1]-i.coords[1])<e.event.special.swipe.verticalDistanceThreshold&&t.origin.trigger("swipe").trigger(t.coords[0]>i.coords[0]?"swipeleft":"swiperight")},setup:function(){var t=this,i=e(t);i.bind(l,function(t){function a(t){s&&(o=e.event.special.swipe.stop(t),Math.abs(s.coords[0]-o.coords[0])>e.event.special.swipe.scrollSupressionThreshold&&t.preventDefault())}var o,s=e.event.special.swipe.start(t);i.bind(c,a).one(d,function(){i.unbind(c,a),s&&o&&e.event.special.swipe.handleSwipe(s,o),s=o=n})})}},e.each({scrollstop:"scrollstart",taphold:"tap",swipeleft:"swipe",swiperight:"swipe"},function(t,i){e.event.special[t]={setup:function(){e(this).bind(i,e.noop)}}})}(e,this),function(e){e.event.special.throttledresize={setup:function(){e(this).bind("resize",o)},teardown:function(){e(this).unbind("resize",o)}};var t,i,n,a=250,o=function(){i=(new Date).getTime(),n=i-s,n>=a?(s=i,e(this).trigger("throttledresize")):(t&&clearTimeout(t),t=setTimeout(o,a-n))},s=0}(e),function(e,t){function a(){var e=o();e!==s&&(s=e,d.trigger(c))}var o,s,r,l,d=e(t),c="orientationchange",h={0:!0,180:!0};if(e.support.orientation){var u=t.innerWidth||d.width(),p=t.innerHeight||d.height(),m=50;r=u>p&&u-p>m,l=h[t.orientation],(r&&l||!r&&!l)&&(h={"-90":!0,90:!0})}e.event.special.orientationchange=e.extend({},e.event.special.orientationchange,{setup:function(){return e.support.orientation&&!e.event.special.orientationchange.disabled?!1:(s=o(),d.bind("throttledresize",a),n)},teardown:function(){return e.support.orientation&&!e.event.special.orientationchange.disabled?!1:(d.unbind("throttledresize",a),n)},add:function(e){var t=e.handler;e.handler=function(e){return e.orientation=o(),t.apply(this,arguments)}}}),e.event.special.orientationchange.orientation=o=function(){var n=!0,a=i.documentElement;return n=e.support.orientation?h[t.orientation]:a&&1.1>a.clientWidth/a.clientHeight,n?"portrait":"landscape"},e.fn[c]=function(e){return e?this.bind(c,e):this.trigger(c)},e.attrFn&&(e.attrFn[c]=!0)}(e,this),function(e){e.widget("mobile.page",e.mobile.widget,{options:{theme:"c",domCache:!1,keepNativeDefault:":jqmData(role='none'), :jqmData(role='nojs')"},_create:function(){return this._trigger("beforecreate")===!1?!1:(this.element.attr("tabindex","0").addClass("ui-page ui-body-"+this.options.theme),this._on(this.element,{pagebeforehide:"removeContainerBackground",pagebeforeshow:"_handlePageBeforeShow"}),n)},_handlePageBeforeShow:function(){this.setContainerBackground()},removeContainerBackground:function(){e.mobile.pageContainer.removeClass("ui-overlay-"+e.mobile.getInheritedTheme(this.element.parent()))},setContainerBackground:function(t){this.options.theme&&e.mobile.pageContainer.addClass("ui-overlay-"+(t||this.options.theme))},keepNativeSelector:function(){var t=this.options,i=t.keepNative&&e.trim(t.keepNative);return i&&t.keepNative!==t.keepNativeDefault?[t.keepNative,t.keepNativeDefault].join(", "):t.keepNativeDefault}})}(e),function(e,t,i){var n=function(n){return n===i&&(n=!0),function(i,a,o,s){var r=new e.Deferred,l=a?" reverse":"",d=e.mobile.urlHistory.getActive(),c=d.lastScroll||e.mobile.defaultHomeScroll,h=e.mobile.getScreenHeight(),u=e.mobile.maxTransitionWidth!==!1&&e.mobile.window.width()>e.mobile.maxTransitionWidth,p=!e.support.cssTransitions||u||!i||"none"===i||Math.max(e.mobile.window.scrollTop(),c)>e.mobile.getMaxScrollForTransition(),m=" ui-page-pre-in",f=function(){e.mobile.pageContainer.toggleClass("ui-mobile-viewport-transitioning viewport-"+i)},g=function(){e.event.special.scrollstart.enabled=!1,t.scrollTo(0,c),setTimeout(function(){e.event.special.scrollstart.enabled=!0},150)},b=function(){s.removeClass(e.mobile.activePageClass+" out in reverse "+i).height("")},v=function(){n?s.animationComplete(_):_(),s.height(h+e.mobile.window.scrollTop()).addClass(i+" out"+l)},_=function(){s&&n&&b(),C()},C=function(){o.css("z-index",-10),o.addClass(e.mobile.activePageClass+m),e.mobile.focusPage(o),o.height(h+c),g(),o.css("z-index",""),p||o.animationComplete(x),o.removeClass(m).addClass(i+" in"+l),p&&x()},x=function(){n||s&&b(),o.removeClass("out in reverse "+i).height(""),f(),e.mobile.window.scrollTop()!==c&&g(),r.resolve(i,a,o,s,!0)};return f(),s&&!p?v():_(),r.promise()}},a=n(),o=n(!1),s=function(){return 3*e.mobile.getScreenHeight()};e.mobile.defaultTransitionHandler=a,e.mobile.transitionHandlers={"default":e.mobile.defaultTransitionHandler,sequential:a,simultaneous:o},e.mobile.transitionFallbacks={},e.mobile._maybeDegradeTransition=function(t){return t&&!e.support.cssTransform3d&&e.mobile.transitionFallbacks[t]&&(t=e.mobile.transitionFallbacks[t]),t},e.mobile.getMaxScrollForTransition=e.mobile.getMaxScrollForTransition||s}(e,this),function(e,n){function a(t){!f||f.closest("."+e.mobile.activePageClass).length&&!t||f.removeClass(e.mobile.activeBtnClass),f=null}function o(){_=!1,v.length>0&&e.mobile.changePage.apply(null,v.pop())}function s(t,i,n,a){i&&i.data("mobile-page")._trigger("beforehide",null,{nextPage:t}),t.data("mobile-page")._trigger("beforeshow",null,{prevPage:i||e("")}),e.mobile.hidePageLoadingMsg(),n=e.mobile._maybeDegradeTransition(n);var o=e.mobile.transitionHandlers[n||"default"]||e.mobile.defaultTransitionHandler,s=o(n,a,t,i);return s.done(function(){i&&i.data("mobile-page")._trigger("hide",null,{nextPage:t}),t.data("mobile-page")._trigger("show",null,{prevPage:i||e("")})}),s}function r(t,i){i&&t.attr("data-"+e.mobile.ns+"role",i),t.page()}function l(){var t=e.mobile.activePage&&c(e.mobile.activePage);return t||w.hrefNoHash}function d(e){for(;e&&("string"!=typeof e.nodeName||"a"!==e.nodeName.toLowerCase());)e=e.parentNode;return e}function c(t){var i=e(t).closest(".ui-page").jqmData("url"),n=w.hrefNoHash;return i&&p.isPath(i)||(i=n),p.makeUrlAbsolute(i,n)}var h=e.mobile.window,u=(e("html"),e("head")),p=e.extend(e.mobile.path,{getFilePath:function(t){var i="&"+e.mobile.subPageUrlKey;return t&&t.split(i)[0].split(C)[0]},isFirstPageUrl:function(t){var i=p.parseUrl(p.makeUrlAbsolute(t,this.documentBase)),a=i.hrefNoHash===this.documentUrl.hrefNoHash||this.documentBaseDiffers&&i.hrefNoHash===this.documentBase.hrefNoHash,o=e.mobile.firstPage,s=o&&o[0]?o[0].id:n;return a&&(!i.hash||"#"===i.hash||s&&i.hash.replace(/^#/,"")===s)},isPermittedCrossDomainRequest:function(t,i){return e.mobile.allowCrossDomainPages&&"file:"===t.protocol&&-1!==i.search(/^https?:/)}}),m=null,f=null,g=e.Deferred(),b=e.mobile.navigate.history,v=[],_=!1,C="&ui-state=dialog",x=u.children("base"),y=p.documentUrl,w=p.documentBase,T=(p.documentBaseDiffers,e.mobile.getScreenHeight),D=e.support.dynamicBaseTag?{element:x.length?x:e("<base>",{href:w.hrefNoHash}).prependTo(u),set:function(e){e=p.parseUrl(e).hrefNoHash,D.element.attr("href",p.makeUrlAbsolute(e,w))},reset:function(){D.element.attr("href",w.hrefNoSearch)}}:n;e.mobile.getDocumentUrl=p.getDocumentUrl,e.mobile.getDocumentBase=p.getDocumentBase,e.mobile.back=function(){var e=t.navigator;this.phonegapNavigationEnabled&&e&&e.app&&e.app.backHistory?e.app.backHistory():t.history.back()},e.mobile.focusPage=function(e){var t=e.find("[autofocus]"),i=e.find(".ui-title:eq(0)");return t.length?(t.focus(),n):(i.length?i.focus():e.focus(),n)};var P,k,E=!0;P=function(){if(E){var t=e.mobile.urlHistory.getActive();if(t){var i=h.scrollTop();t.lastScroll=e.mobile.minScrollBack>i?e.mobile.defaultHomeScroll:i}}},k=function(){setTimeout(P,100)},h.bind(e.support.pushState?"popstate":"hashchange",function(){E=!1}),h.one(e.support.pushState?"popstate":"hashchange",function(){E=!0}),h.one("pagecontainercreate",function(){e.mobile.pageContainer.bind("pagechange",function(){E=!0,h.unbind("scrollstop",k),h.bind("scrollstop",k)})}),h.bind("scrollstop",k),e.mobile._maybeDegradeTransition=e.mobile._maybeDegradeTransition||function(e){return e},e.mobile.resetActivePageHeight=function(t){var i=e("."+e.mobile.activePageClass),n=parseFloat(i.css("padding-top")),a=parseFloat(i.css("padding-bottom")),o=parseFloat(i.css("border-top-width")),s=parseFloat(i.css("border-bottom-width"));t="number"==typeof t?t:T(),i.css("min-height",t-n-a-o-s)},e.fn.animationComplete=function(t){return e.support.cssTransitions?e(this).one("webkitAnimationEnd animationend",t):(setTimeout(t,0),e(this))},e.mobile.path=p,e.mobile.base=D,e.mobile.urlHistory=b,e.mobile.dialogHashKey=C,e.mobile.allowCrossDomainPages=!1,e.mobile._bindPageRemove=function(){var t=e(this);!t.data("mobile-page").options.domCache&&t.is(":jqmData(external-page='true')")&&t.bind("pagehide.remove",function(){var t=e(this),i=new e.Event("pageremove");t.trigger(i),i.isDefaultPrevented()||t.removeWithDependents()})},e.mobile.loadPage=function(t,i){var a=e.Deferred(),o=e.extend({},e.mobile.loadPage.defaults,i),s=null,d=null,c=p.makeUrlAbsolute(t,l());o.data&&"get"===o.type&&(c=p.addSearchParams(c,o.data),o.data=n),o.data&&"post"===o.type&&(o.reloadPage=!0);var h=p.getFilePath(c),u=p.convertUrlToDataUrl(c);if(o.pageContainer=o.pageContainer||e.mobile.pageContainer,s=o.pageContainer.children("[data-"+e.mobile.ns+"url='"+u+"']"),0===s.length&&u&&!p.isPath(u)&&(s=o.pageContainer.children("#"+u).attr("data-"+e.mobile.ns+"url",u).jqmData("url",u)),0===s.length)if(e.mobile.firstPage&&p.isFirstPageUrl(h))e.mobile.firstPage.parent().length&&(s=e(e.mobile.firstPage));else if(p.isEmbeddedPage(h))return a.reject(c,i),a.promise();if(s.length){if(!o.reloadPage)return r(s,o.role),a.resolve(c,i,s),D&&!i.prefetch&&D.set(t),a.promise();d=s}var m=o.pageContainer,f=new e.Event("pagebeforeload"),g={url:t,absUrl:c,dataUrl:u,deferred:a,options:o};if(m.trigger(f,g),f.isDefaultPrevented())return a.promise();if(o.showLoadMsg)var b=setTimeout(function(){e.mobile.showPageLoadingMsg()},o.loadMsgDelay),v=function(){clearTimeout(b),e.mobile.hidePageLoadingMsg()};return D&&i.prefetch===n&&D.reset(),e.mobile.allowCrossDomainPages||p.isSameDomain(y,c)?e.ajax({url:h,type:o.type,data:o.data,contentType:o.contentType,dataType:"html",success:function(l,m,f){var b=e("<div></div>"),_=l.match(/<title[^>]*>([^<]*)/)&&RegExp.$1,C=RegExp("(<[^>]+\\bdata-"+e.mobile.ns+"role=[\"']?page[\"']?[^>]*>)"),x=RegExp("\\bdata-"+e.mobile.ns+"url=[\"']?([^\"'>]*)[\"']?");if(C.test(l)&&RegExp.$1&&x.test(RegExp.$1)&&RegExp.$1&&(t=h=p.getFilePath(e("<div>"+RegExp.$1+"</div>").text())),D&&i.prefetch===n&&D.set(h),b.get(0).innerHTML=l,s=b.find(":jqmData(role='page'), :jqmData(role='dialog')").first(),s.length||(s=e("<div data-"+e.mobile.ns+"role='page'>"+(l.split(/<\/?body[^>]*>/gim)[1]||"")+"</div>")),_&&!s.jqmData("title")&&(~_.indexOf("&")&&(_=e("<div>"+_+"</div>").text()),s.jqmData("title",_)),!e.support.dynamicBaseTag){var y=p.get(h);s.find("[src], link[href], a[rel='external'], :jqmData(ajax='false'), a[target]").each(function(){var t=e(this).is("[href]")?"href":e(this).is("[src]")?"src":"action",i=e(this).attr(t);i=i.replace(location.protocol+"//"+location.host+location.pathname,""),/^(\w+:|#|\/)/.test(i)||e(this).attr(t,y+i)})}s.attr("data-"+e.mobile.ns+"url",p.convertUrlToDataUrl(h)).attr("data-"+e.mobile.ns+"external-page",!0).appendTo(o.pageContainer),s.one("pagecreate",e.mobile._bindPageRemove),r(s,o.role),c.indexOf("&"+e.mobile.subPageUrlKey)>-1&&(s=o.pageContainer.children("[data-"+e.mobile.ns+"url='"+u+"']")),o.showLoadMsg&&v(),g.xhr=f,g.textStatus=m,g.page=s,o.pageContainer.trigger("pageload",g),a.resolve(c,i,s,d)},error:function(t,n,s){D&&D.set(p.get()),g.xhr=t,g.textStatus=n,g.errorThrown=s;var r=new e.Event("pageloadfailed");o.pageContainer.trigger(r,g),r.isDefaultPrevented()||(o.showLoadMsg&&(v(),e.mobile.showPageLoadingMsg(e.mobile.pageLoadErrorMessageTheme,e.mobile.pageLoadErrorMessage,!0),setTimeout(e.mobile.hidePageLoadingMsg,1500)),a.reject(c,i))}}):a.reject(c,i),a.promise()},e.mobile.loadPage.defaults={type:"get",data:n,reloadPage:!1,role:n,showLoadMsg:!1,pageContainer:n,loadMsgDelay:50},e.mobile.changePage=function(t,d){if(_)return v.unshift(arguments),n;var c,h=e.extend({},e.mobile.changePage.defaults,d);h.pageContainer=h.pageContainer||e.mobile.pageContainer,h.fromPage=h.fromPage||e.mobile.activePage,c="string"==typeof t;var u=h.pageContainer,m=new e.Event("pagebeforechange"),f={toPage:t,options:h};if(f.absUrl=c?p.makeUrlAbsolute(t,l()):t.data("absUrl"),u.trigger(m,f),!m.isDefaultPrevented()){if(t=f.toPage,c="string"==typeof t,_=!0,c)return h.target=t,e.mobile.loadPage(t,h).done(function(t,i,n,a){_=!1,i.duplicateCachedPage=a,n.data("absUrl",f.absUrl),e.mobile.changePage(n,i)}).fail(function(){a(!0),o(),h.pageContainer.trigger("pagechangefailed",f)}),n;t[0]!==e.mobile.firstPage[0]||h.dataUrl||(h.dataUrl=y.hrefNoHash);var g=h.fromPage,x=h.dataUrl&&p.convertUrlToDataUrl(h.dataUrl)||t.jqmData("url"),w=x,T=(p.getFilePath(x),b.getActive()),D=0===b.activeIndex,P=0,k=i.title,E="dialog"===h.role||"dialog"===t.jqmData("role");if(g&&g[0]===t[0]&&!h.allowSamePageTransition)return _=!1,u.trigger("pagechange",f),h.fromHashChange&&b.direct({url:x}),n;r(t,h.role),h.fromHashChange&&(P="back"===d.direction?-1:1);try{i.activeElement&&"body"!==i.activeElement.nodeName.toLowerCase()?e(i.activeElement).blur():e("input:focus, textarea:focus, select:focus").blur()}catch(q){}var j=!1;E&&T&&(T.url&&T.url.indexOf(C)>-1&&e.mobile.activePage&&!e.mobile.activePage.is(".ui-dialog")&&b.activeIndex>0&&(h.changeHash=!1,j=!0),x=T.url||"",x+=!j&&x.indexOf("#")>-1?C:"#"+C,0===b.activeIndex&&x===b.initialDst&&(x+=C));var S=T?t.jqmData("title")||t.children(":jqmData(role='header')").find(".ui-title").text():k;if(S&&k===i.title&&(k=S),t.jqmData("title")||t.jqmData("title",k),h.transition=h.transition||(P&&!D?T.transition:n)||(E?e.mobile.defaultDialogTransition:e.mobile.defaultPageTransition),!P&&j&&(b.getActive().pageUrl=w),x&&!h.fromHashChange){var A;!p.isPath(x)&&0>x.indexOf("#")&&(x="#"+x),A={transition:h.transition,title:k,pageUrl:w,role:h.role},h.changeHash!==!1&&e.mobile.hashListeningEnabled?e.mobile.navigate(x,A,!0):t[0]!==e.mobile.firstPage[0]&&e.mobile.navigate.history.add(x,A)}i.title=k,e.mobile.activePage=t,h.reverse=h.reverse||0>P,s(t,g,h.transition,h.reverse).done(function(i,n,s,r,l){a(),h.duplicateCachedPage&&h.duplicateCachedPage.remove(),l||e.mobile.focusPage(t),o(),u.trigger("pagechange",f)})}},e.mobile.changePage.defaults={transition:n,reverse:!1,changeHash:!0,fromHashChange:!1,role:n,duplicateCachedPage:n,pageContainer:n,showLoadMsg:!0,dataUrl:n,fromPage:n,allowSamePageTransition:!1},e.mobile.navreadyDeferred=e.Deferred(),e.mobile._registerInternalEvents=function(){var i=function(t,i){var a,o,s,r,l=!0;return!e.mobile.ajaxEnabled||t.is(":jqmData(ajax='false')")||!t.jqmHijackable().length||t.attr("target")?!1:(a=t.attr("action"),r=(t.attr("method")||"get").toLowerCase(),a||(a=c(t),"get"===r&&(a=p.parseUrl(a).hrefNoSearch),a===w.hrefNoHash&&(a=y.hrefNoSearch)),a=p.makeUrlAbsolute(a,c(t)),p.isExternal(a)&&!p.isPermittedCrossDomainRequest(y,a)?!1:(i||(o=t.serializeArray(),m&&m[0].form===t[0]&&(s=m.attr("name"),s&&(e.each(o,function(e,t){return t.name===s?(s="",!1):n}),s&&o.push({name:s,value:m.attr("value")}))),l={url:a,options:{type:r,data:e.param(o),transition:t.jqmData("transition"),reverse:"reverse"===t.jqmData("direction"),reloadPage:!0}}),l))};e.mobile.document.delegate("form","submit",function(t){var n=i(e(this));n&&(e.mobile.changePage(n.url,n.options),t.preventDefault())}),e.mobile.document.bind("vclick",function(t){var n,o,s=t.target,r=!1;if(!(t.which>1)&&e.mobile.linkBindingEnabled){if(m=e(s),e.data(s,"mobile-button")){if(!i(e(s).closest("form"),!0))return;s.parentNode&&(s=s.parentNode)}else{if(s=d(s),!s||"#"===p.parseUrl(s.getAttribute("href")||"#").hash)return;if(!e(s).jqmHijackable().length)return}~s.className.indexOf("ui-link-inherit")?s.parentNode&&(o=e.data(s.parentNode,"buttonElements")):o=e.data(s,"buttonElements"),o?s=o.outer:r=!0,n=e(s),r&&(n=n.closest(".ui-btn")),n.length>0&&!n.hasClass("ui-disabled")&&(a(!0),f=n,f.addClass(e.mobile.activeBtnClass))}}),e.mobile.document.bind("click",function(i){if(e.mobile.linkBindingEnabled&&!i.isDefaultPrevented()){var o,s=d(i.target),r=e(s);if(s&&!(i.which>1)&&r.jqmHijackable().length){if(o=function(){t.setTimeout(function(){a(!0)},200)},r.is(":jqmData(rel='back')"))return e.mobile.back(),!1;var l=c(r),h=p.makeUrlAbsolute(r.attr("href")||"#",l);if(!e.mobile.ajaxEnabled&&!p.isEmbeddedPage(h))return o(),n;if(-1!==h.search("#")){if(h=h.replace(/[^#]*#/,""),!h)return i.preventDefault(),n;h=p.isPath(h)?p.makeUrlAbsolute(h,l):p.makeUrlAbsolute("#"+h,y.hrefNoHash)}var u=r.is("[rel='external']")||r.is(":jqmData(ajax='false')")||r.is("[target]"),m=u||p.isExternal(h)&&!p.isPermittedCrossDomainRequest(y,h);if(m)return o(),n;var f=r.jqmData("transition"),g="reverse"===r.jqmData("direction")||r.jqmData("back"),b=r.attr("data-"+e.mobile.ns+"rel")||n;e.mobile.changePage(h,{transition:f,reverse:g,role:b,link:r}),i.preventDefault()}}}),e.mobile.document.delegate(".ui-page","pageshow.prefetch",function(){var t=[];e(this).find("a:jqmData(prefetch)").each(function(){var i=e(this),n=i.attr("href");n&&-1===e.inArray(n,t)&&(t.push(n),e.mobile.loadPage(n,{role:i.attr("data-"+e.mobile.ns+"rel"),prefetch:!0}))})}),e.mobile._handleHashChange=function(i,a){var o=p.stripHash(i),s=0===e.mobile.urlHistory.stack.length?"none":n,r={changeHash:!1,fromHashChange:!0,reverse:"back"===a.direction};if(e.extend(r,a,{transition:(b.getLast()||{}).transition||s}),b.activeIndex>0&&o.indexOf(C)>-1&&b.initialDst!==o){if(e.mobile.activePage&&!e.mobile.activePage.is(".ui-dialog"))return"back"===a.direction?e.mobile.back():t.history.forward(),n;o=a.pageUrl;var l=e.mobile.urlHistory.getActive();e.extend(r,{role:l.role,transition:l.transition,reverse:"back"===a.direction})}o?(o=p.isPath(o)?o:p.makeUrlAbsolute("#"+o,w),o===p.makeUrlAbsolute("#"+b.initialDst,w)&&b.stack.length&&b.stack[0].url!==b.initialDst.replace(C,"")&&(o=e.mobile.firstPage),e.mobile.changePage(o,r)):e.mobile.changePage(e.mobile.firstPage,r)},h.bind("navigate",function(t,i){var n;t.originalEvent&&t.originalEvent.isDefaultPrevented()||(n=e.event.special.navigate.originalEventName.indexOf("hashchange")>-1?i.state.hash:i.state.url,n||(n=e.mobile.path.parseLocation().hash),n&&"#"!==n&&0!==n.indexOf("#"+e.mobile.path.uiStateKey)||(n=location.href),e.mobile._handleHashChange(n,i.state))}),e.mobile.document.bind("pageshow",e.mobile.resetActivePageHeight),e.mobile.window.bind("throttledresize",e.mobile.resetActivePageHeight)},e(function(){g.resolve()}),e.when(g,e.mobile.navreadyDeferred).done(function(){e.mobile._registerInternalEvents()})}(e),function(e){e.mobile.transitionFallbacks.flip="fade"}(e,this),function(e){e.mobile.transitionFallbacks.flow="fade"}(e,this),function(e){e.mobile.transitionFallbacks.pop="fade"}(e,this),function(e){e.mobile.transitionHandlers.slide=e.mobile.transitionHandlers.simultaneous,e.mobile.transitionFallbacks.slide="fade"}(e,this),function(e){e.mobile.transitionFallbacks.slidedown="fade"}(e,this),function(e){e.mobile.transitionFallbacks.slidefade="fade"}(e,this),function(e){e.mobile.transitionFallbacks.slideup="fade"}(e,this),function(e){e.mobile.transitionFallbacks.turn="fade"}(e,this),function(e){e.mobile.page.prototype.options.degradeInputs={color:!1,date:!1,datetime:!1,"datetime-local":!1,email:!1,month:!1,number:!1,range:"number",search:"text",tel:!1,time:!1,url:!1,week:!1},e.mobile.document.bind("pagecreate create",function(t){var i,n=e.mobile.closestPageData(e(t.target));n&&(i=n.options,e(t.target).find("input").not(n.keepNativeSelector()).each(function(){var t=e(this),n=this.getAttribute("type"),a=i.degradeInputs[n]||"text";if(i.degradeInputs[n]){var o=e("<div>").html(t.clone()).html(),s=o.indexOf(" type=")>-1,r=s?/\s+type=["']?\w+['"]?/:/\/?>/,l=' type="'+a+'" data-'+e.mobile.ns+'type="'+n+'"'+(s?"":">");t.replaceWith(o.replace(r,l))}}))})}(e),function(e){e.widget("mobile.dialog",e.mobile.widget,{options:{closeBtn:"left",closeBtnText:"Close",overlayTheme:"a",corners:!0,initSelector:":jqmData(role='dialog')"},_handlePageBeforeShow:function(){this._isCloseable=!0,this.options.overlayTheme&&this.element.page("removeContainerBackground").page("setContainerBackground",this.options.overlayTheme)},_create:function(){var t=this.element,i=this.options.corners?" ui-corner-all":"",n=e("<div/>",{role:"dialog","class":"ui-dialog-contain ui-overlay-shadow"+i});t.addClass("ui-dialog ui-overlay-"+this.options.overlayTheme),t.wrapInner(n),t.bind("vclick submit",function(t){var i,n=e(t.target).closest("vclick"===t.type?"a":"form");n.length&&!n.jqmData("transition")&&(i=e.mobile.urlHistory.getActive()||{},n.attr("data-"+e.mobile.ns+"transition",i.transition||e.mobile.defaultDialogTransition).attr("data-"+e.mobile.ns+"direction","reverse"))}),this._on(t,{pagebeforeshow:"_handlePageBeforeShow"}),e.extend(this,{_createComplete:!1}),this._setCloseBtn(this.options.closeBtn)},_setCloseBtn:function(t){var i,n,a=this;this._headerCloseButton&&(this._headerCloseButton.remove(),this._headerCloseButton=null),"none"!==t&&(n="left"===t?"left":"right",i=e("<a href='#' class='ui-btn-"+n+"' data-"+e.mobile.ns+"icon='delete' data-"+e.mobile.ns+"iconpos='notext'>"+this.options.closeBtnText+"</a>"),this.element.children().find(":jqmData(role='header')").first().prepend(i),this._createComplete&&e.fn.buttonMarkup&&i.buttonMarkup(),this._createComplete=!0,i.bind("click",function(){a.close()}),this._headerCloseButton=i)},_setOption:function(e,t){"closeBtn"===e&&this._setCloseBtn(t),this._super(e,t)},close:function(){var t,i,n=e.mobile.navigate.history;this._isCloseable&&(this._isCloseable=!1,e.mobile.hashListeningEnabled&&n.activeIndex>0?e.mobile.back():(t=Math.max(0,n.activeIndex-1),i=n.stack[t].pageUrl||n.stack[t].url,n.previousIndex=n.activeIndex,n.activeIndex=t,e.mobile.path.isPath(i)||(i=e.mobile.path.makeUrlAbsolute("#"+i)),e.mobile.changePage(i,{direction:"back",changeHash:!1,fromHashChange:!0})))}}),e.mobile.document.delegate(e.mobile.dialog.prototype.options.initSelector,"pagecreate",function(){e.mobile.dialog.prototype.enhance(this)})}(e,this),function(e){e.mobile.page.prototype.options.backBtnText="Back",e.mobile.page.prototype.options.addBackBtn=!1,e.mobile.page.prototype.options.backBtnTheme=null,e.mobile.page.prototype.options.headerTheme="a",e.mobile.page.prototype.options.footerTheme="a",e.mobile.page.prototype.options.contentTheme=null,e.mobile.document.bind("pagecreate",function(t){var i=e(t.target),n=i.data("mobile-page").options,a=i.jqmData("role"),o=n.theme;e(":jqmData(role='header'), :jqmData(role='footer'), :jqmData(role='content')",i).jqmEnhanceable().each(function(){var t,s,r,l,d=e(this),c=d.jqmData("role"),h=d.jqmData("theme"),u=h||n.contentTheme||"dialog"===a&&o;if(d.addClass("ui-"+c),"header"===c||"footer"===c){var p=h||("header"===c?n.headerTheme:n.footerTheme)||o;d.addClass("ui-bar-"+p).attr("role","header"===c?"banner":"contentinfo"),"header"===c&&(t=d.children("a, button"),s=t.hasClass("ui-btn-left"),r=t.hasClass("ui-btn-right"),s=s||t.eq(0).not(".ui-btn-right").addClass("ui-btn-left").length,r=r||t.eq(1).addClass("ui-btn-right").length),n.addBackBtn&&"header"===c&&e(".ui-page").length>1&&i.jqmData("url")!==e.mobile.path.stripHash(location.hash)&&!s&&(l=e("<a href='javascript:void(0);' class='ui-btn-left' data-"+e.mobile.ns+"rel='back' data-"+e.mobile.ns+"icon='arrow-l'>"+n.backBtnText+"</a>").attr("data-"+e.mobile.ns+"theme",n.backBtnTheme||p).prependTo(d)),d.children("h1, h2, h3, h4, h5, h6").addClass("ui-title").attr({role:"heading","aria-level":"1"})}else"content"===c&&(u&&d.addClass("ui-body-"+u),d.attr("role","main"))})})}(e),function(e,t){function n(e){for(var t;e&&(t="string"==typeof e.className&&e.className+" ",!(t&&t.indexOf("ui-btn ")>-1&&0>t.indexOf("ui-disabled ")));)e=e.parentNode;return e}function a(n,a,o,s,r){var l=e.data(n[0],"buttonElements");n.removeClass(a).addClass(o),l&&(l.bcls=e(i.createElement("div")).addClass(l.bcls+" "+o).removeClass(a).attr("class"),s!==t&&(l.hover=s),l.state=r)}var o=function(e,i){var n=e.getAttribute(i);return"true"===n?!0:"false"===n?!1:null===n?t:n};e.fn.buttonMarkup=function(n){var a,r=this,l="data-"+e.mobile.ns;n=n&&"object"===e.type(n)?n:{};for(var d=0;r.length>d;d++){var c,h,u,p,m,f,g=r.eq(d),b=g[0],v=e.extend({},e.fn.buttonMarkup.defaults,{icon:n.icon!==t?n.icon:o(b,l+"icon"),iconpos:n.iconpos!==t?n.iconpos:o(b,l+"iconpos"),theme:n.theme!==t?n.theme:o(b,l+"theme")||e.mobile.getInheritedTheme(g,"c"),inline:n.inline!==t?n.inline:o(b,l+"inline"),shadow:n.shadow!==t?n.shadow:o(b,l+"shadow"),corners:n.corners!==t?n.corners:o(b,l+"corners"),iconshadow:n.iconshadow!==t?n.iconshadow:o(b,l+"iconshadow"),mini:n.mini!==t?n.mini:o(b,l+"mini")},n),_="ui-btn-inner",C="ui-btn-text",x=!1,y="up";for(a in v)v[a]===t||null===v[a]?g.removeAttr(l+a):b.setAttribute(l+a,v[a]);for("popup"===o(b,l+"rel")&&g.attr("href")&&(b.setAttribute("aria-haspopup",!0),b.setAttribute("aria-owns",g.attr("href"))),f=e.data("INPUT"===b.tagName||"BUTTON"===b.tagName?b.parentNode:b,"buttonElements"),f?(b=f.outer,g=e(b),u=f.inner,p=f.text,e(f.icon).remove(),f.icon=null,x=f.hover,y=f.state):(u=i.createElement(v.wrapperEls),p=i.createElement(v.wrapperEls)),m=v.icon?i.createElement("span"):null,s&&!f&&s(),v.theme||(v.theme=e.mobile.getInheritedTheme(g,"c")),c="ui-btn ",c+=x?"ui-btn-hover-"+v.theme:"",c+=y?" ui-btn-"+y+"-"+v.theme:"",c+=v.shadow?" ui-shadow":"",c+=v.corners?" ui-btn-corner-all":"",v.mini!==t&&(c+=v.mini===!0?" ui-mini":" ui-fullsize"),v.inline!==t&&(c+=v.inline===!0?" ui-btn-inline":" ui-btn-block"),v.icon&&(v.icon="ui-icon-"+v.icon,v.iconpos=v.iconpos||"left",h="ui-icon "+v.icon,v.iconshadow&&(h+=" ui-icon-shadow")),v.iconpos&&(c+=" ui-btn-icon-"+v.iconpos,"notext"!==v.iconpos||g.attr("title")||g.attr("title",g.getEncodedText())),f&&g.removeClass(f.bcls||""),g.removeClass("ui-link").addClass(c),u.className=_,p.className=C,f||u.appendChild(p),m&&(m.className=h,f&&f.icon||(m.innerHTML="&#160;",u.appendChild(m)));b.firstChild&&!f;)p.appendChild(b.firstChild);f||b.appendChild(u),f={hover:x,state:y,bcls:c,outer:b,inner:u,text:p,icon:m},e.data(b,"buttonElements",f),e.data(u,"buttonElements",f),e.data(p,"buttonElements",f),m&&e.data(m,"buttonElements",f)}return this},e.fn.buttonMarkup.defaults={corners:!0,shadow:!0,iconshadow:!0,wrapperEls:"span"};var s=function(){var i,o,r=e.mobile.buttonMarkup.hoverDelay;e.mobile.document.bind({"vmousedown vmousecancel vmouseup vmouseover vmouseout focus blur scrollstart":function(s){var l,d=e(n(s.target)),c=s.originalEvent&&/^touch/.test(s.originalEvent.type),h=s.type;d.length&&(l=d.attr("data-"+e.mobile.ns+"theme"),"vmousedown"===h?c?i=setTimeout(function(){a(d,"ui-btn-up-"+l,"ui-btn-down-"+l,t,"down")},r):a(d,"ui-btn-up-"+l,"ui-btn-down-"+l,t,"down"):"vmousecancel"===h||"vmouseup"===h?a(d,"ui-btn-down-"+l,"ui-btn-up-"+l,t,"up"):"vmouseover"===h||"focus"===h?c?o=setTimeout(function(){a(d,"ui-btn-up-"+l,"ui-btn-hover-"+l,!0,"")},r):a(d,"ui-btn-up-"+l,"ui-btn-hover-"+l,!0,""):("vmouseout"===h||"blur"===h||"scrollstart"===h)&&(a(d,"ui-btn-hover-"+l+" ui-btn-down-"+l,"ui-btn-up-"+l,!1,"up"),i&&clearTimeout(i),o&&clearTimeout(o)))},"focusin focus":function(t){e(n(t.target)).addClass(e.mobile.focusClass)},"focusout blur":function(t){e(n(t.target)).removeClass(e.mobile.focusClass)}}),s=null};e.mobile.document.bind("pagecreate create",function(t){e(":jqmData(role='button'), .ui-bar > a, .ui-header > a, .ui-footer > a, .ui-bar > :jqmData(role='controlgroup') > a",t.target).jqmEnhanceable().not("button, input, .ui-btn, :jqmData(role='none'), :jqmData(role='nojs')").buttonMarkup()})}(e),function(e,t){e.widget("mobile.collapsible",e.mobile.widget,{options:{expandCueText:" click to expand contents",collapseCueText:" click to collapse contents",collapsed:!0,heading:"h1,h2,h3,h4,h5,h6,legend",collapsedIcon:"plus",expandedIcon:"minus",iconpos:"left",theme:null,contentTheme:null,inset:!0,corners:!0,mini:!1,initSelector:":jqmData(role='collapsible')"},_create:function(){var i=this.element,n=this.options,a=i.addClass("ui-collapsible"),o=i.children(n.heading).first(),s=a.wrapInner("<div class='ui-collapsible-content'></div>").children(".ui-collapsible-content"),r=i.closest(":jqmData(role='collapsible-set')").addClass("ui-collapsible-set"),l="";o.is("legend")&&(o=e("<div role='heading'>"+o.html()+"</div>").insertBefore(o),o.next().remove()),r.length?(n.theme||(n.theme=r.jqmData("theme")||e.mobile.getInheritedTheme(r,"c")),n.contentTheme||(n.contentTheme=r.jqmData("content-theme")),n.collapsedIcon=i.jqmData("collapsed-icon")||r.jqmData("collapsed-icon")||n.collapsedIcon,n.expandedIcon=i.jqmData("expanded-icon")||r.jqmData("expanded-icon")||n.expandedIcon,n.iconpos=i.jqmData("iconpos")||r.jqmData("iconpos")||n.iconpos,n.inset=r.jqmData("inset")!==t?r.jqmData("inset"):!0,n.corners=!1,n.mini||(n.mini=r.jqmData("mini"))):n.theme||(n.theme=e.mobile.getInheritedTheme(i,"c")),n.inset&&(l+=" ui-collapsible-inset",n.corners&&(l+=" ui-corner-all")),n.contentTheme&&(l+=" ui-collapsible-themed-content",s.addClass("ui-body-"+n.contentTheme)),""!==l&&a.addClass(l),o.insertBefore(s).addClass("ui-collapsible-heading").append("<span class='ui-collapsible-heading-status'></span>").wrapInner("<a href='#' class='ui-collapsible-heading-toggle'></a>").find("a").first().buttonMarkup({shadow:!1,corners:!1,iconpos:n.iconpos,icon:n.collapsedIcon,mini:n.mini,theme:n.theme}),a.bind("expand collapse",function(t){if(!t.isDefaultPrevented()){var i=e(this),a="collapse"===t.type;t.preventDefault(),o.toggleClass("ui-collapsible-heading-collapsed",a).find(".ui-collapsible-heading-status").text(a?n.expandCueText:n.collapseCueText).end().find(".ui-icon").toggleClass("ui-icon-"+n.expandedIcon,!a).toggleClass("ui-icon-"+n.collapsedIcon,a||n.expandedIcon===n.collapsedIcon).end().find("a").first().removeClass(e.mobile.activeBtnClass),i.toggleClass("ui-collapsible-collapsed",a),s.toggleClass("ui-collapsible-content-collapsed",a).attr("aria-hidden",a),s.trigger("updatelayout")}}).trigger(n.collapsed?"collapse":"expand"),o.bind("tap",function(){o.find("a").first().addClass(e.mobile.activeBtnClass)}).bind("click",function(e){var t=o.is(".ui-collapsible-heading-collapsed")?"expand":"collapse";a.trigger(t),e.preventDefault(),e.stopPropagation()})}}),e.mobile.document.bind("pagecreate create",function(t){e.mobile.collapsible.prototype.enhanceWithin(t.target)})}(e),function(e){e.mobile.behaviors.addFirstLastClasses={_getVisibles:function(e,t){var i;return t?i=e.not(".ui-screen-hidden"):(i=e.filter(":visible"),0===i.length&&(i=e.not(".ui-screen-hidden"))),i},_addFirstLastClasses:function(e,t,i){e.removeClass("ui-first-child ui-last-child"),t.eq(0).addClass("ui-first-child").end().last().addClass("ui-last-child"),i||this.element.trigger("updatelayout")}}}(e),function(e,t){e.widget("mobile.collapsibleset",e.mobile.widget,e.extend({options:{initSelector:":jqmData(role='collapsible-set')"},_create:function(){var i=this.element.addClass("ui-collapsible-set"),n=this.options;n.theme||(n.theme=e.mobile.getInheritedTheme(i,"c")),n.contentTheme||(n.contentTheme=i.jqmData("content-theme")),n.corners||(n.corners=i.jqmData("corners")),i.jqmData("inset")!==t&&(n.inset=i.jqmData("inset")),n.inset=n.inset!==t?n.inset:!0,n.corners=n.corners!==t?n.corners:!0,n.corners&&n.inset&&i.addClass("ui-corner-all"),i.jqmData("collapsiblebound")||i.jqmData("collapsiblebound",!0).bind("expand",function(t){var i=e(t.target).closest(".ui-collapsible");i.parent().is(":jqmData(role='collapsible-set')")&&i.siblings(".ui-collapsible").trigger("collapse")})},_init:function(){var e=this.element,t=e.children(":jqmData(role='collapsible')"),i=t.filter(":jqmData(collapsed='false')");
this._refresh("true"),i.trigger("expand")},_refresh:function(t){var i=this.element.children(":jqmData(role='collapsible')");e.mobile.collapsible.prototype.enhance(i.not(".ui-collapsible")),this._addFirstLastClasses(i,this._getVisibles(i,t),t)},refresh:function(){this._refresh(!1)}},e.mobile.behaviors.addFirstLastClasses)),e.mobile.document.bind("pagecreate create",function(t){e.mobile.collapsibleset.prototype.enhanceWithin(t.target)})}(e),function(e){e.fn.fieldcontain=function(){return this.addClass("ui-field-contain ui-body ui-br").contents().filter(function(){return 3===this.nodeType&&!/\S/.test(this.nodeValue)}).remove()},e(i).bind("pagecreate create",function(t){e(":jqmData(role='fieldcontain')",t.target).jqmEnhanceable().fieldcontain()})}(e),function(e){e.fn.grid=function(t){return this.each(function(){var i,n=e(this),a=e.extend({grid:null},t),o=n.children(),s={solo:1,a:2,b:3,c:4,d:5},r=a.grid;if(!r)if(5>=o.length)for(var l in s)s[l]===o.length&&(r=l);else r="a",n.addClass("ui-grid-duo");i=s[r],n.addClass("ui-grid-"+r),o.filter(":nth-child("+i+"n+1)").addClass("ui-block-a"),i>1&&o.filter(":nth-child("+i+"n+2)").addClass("ui-block-b"),i>2&&o.filter(":nth-child("+i+"n+3)").addClass("ui-block-c"),i>3&&o.filter(":nth-child("+i+"n+4)").addClass("ui-block-d"),i>4&&o.filter(":nth-child("+i+"n+5)").addClass("ui-block-e")})}}(e),function(e,t){e.widget("mobile.navbar",e.mobile.widget,{options:{iconpos:"top",grid:null,initSelector:":jqmData(role='navbar')"},_create:function(){var n=this.element,a=n.find("a"),o=a.filter(":jqmData(icon)").length?this.options.iconpos:t;n.addClass("ui-navbar ui-mini").attr("role","navigation").find("ul").jqmEnhanceable().grid({grid:this.options.grid}),a.buttonMarkup({corners:!1,shadow:!1,inline:!0,iconpos:o}),n.delegate("a","vclick",function(t){var n=e(t.target).is("a")?e(this):e(this).parent("a");if(!n.is(".ui-disabled, .ui-btn-active")){a.removeClass(e.mobile.activeBtnClass),e(this).addClass(e.mobile.activeBtnClass);var o=e(this);e(i).one("pagehide",function(){o.removeClass(e.mobile.activeBtnClass)})}}),n.closest(".ui-page").bind("pagebeforeshow",function(){a.filter(".ui-state-persist").addClass(e.mobile.activeBtnClass)})}}),e.mobile.document.bind("pagecreate create",function(t){e.mobile.navbar.prototype.enhanceWithin(t.target)})}(e),function(e){var t={};e.widget("mobile.listview",e.mobile.widget,e.extend({options:{theme:null,countTheme:"c",headerTheme:"b",dividerTheme:"b",icon:"arrow-r",splitIcon:"arrow-r",splitTheme:"b",corners:!0,shadow:!0,inset:!1,initSelector:":jqmData(role='listview')"},_create:function(){var e=this,t="";t+=e.options.inset?" ui-listview-inset":"",e.options.inset&&(t+=e.options.corners?" ui-corner-all":"",t+=e.options.shadow?" ui-shadow":""),e.element.addClass(function(e,i){return i+" ui-listview"+t}),e.refresh(!0)},_findFirstElementByTagName:function(e,t,i,n){var a={};for(a[i]=a[n]=!0;e;){if(a[e.nodeName])return e;e=e[t]}return null},_getChildrenByTagName:function(t,i,n){var a=[],o={};for(o[i]=o[n]=!0,t=t.firstChild;t;)o[t.nodeName]&&a.push(t),t=t.nextSibling;return e(a)},_addThumbClasses:function(t){var i,n,a=t.length;for(i=0;a>i;i++)n=e(this._findFirstElementByTagName(t[i].firstChild,"nextSibling","img","IMG")),n.length&&(n.addClass("ui-li-thumb"),e(this._findFirstElementByTagName(n[0].parentNode,"parentNode","li","LI")).addClass(n.is(".ui-li-icon")?"ui-li-has-icon":"ui-li-has-thumb"))},refresh:function(t){this.parentPage=this.element.closest(".ui-page"),this._createSubPages();var n,a,o,s,r,l,d,c,h,u,p,m,f=this.options,g=this.element,b=g.jqmData("dividertheme")||f.dividerTheme,v=g.jqmData("splittheme"),_=g.jqmData("spliticon"),C=g.jqmData("icon"),x=this._getChildrenByTagName(g[0],"li","LI"),y=!!e.nodeName(g[0],"ol"),w=!e.support.cssPseudoElement,T=g.attr("start"),D={};y&&w&&g.find(".ui-li-dec").remove(),y&&(T||0===T?w?d=parseInt(T,10):(c=parseInt(T,10)-1,g.css("counter-reset","listnumbering "+c)):w&&(d=1)),f.theme||(f.theme=e.mobile.getInheritedTheme(this.element,"c"));for(var P=0,k=x.length;k>P;P++){if(n=x.eq(P),a="ui-li",t||!n.hasClass("ui-li")){o=n.jqmData("theme")||f.theme,s=this._getChildrenByTagName(n[0],"a","A");var E="list-divider"===n.jqmData("role");s.length&&!E?(p=n.jqmData("icon"),n.buttonMarkup({wrapperEls:"div",shadow:!1,corners:!1,iconpos:"right",icon:s.length>1||p===!1?!1:p||C||f.icon,theme:o}),p!==!1&&1===s.length&&n.addClass("ui-li-has-arrow"),s.first().removeClass("ui-link").addClass("ui-link-inherit"),s.length>1&&(a+=" ui-li-has-alt",r=s.last(),l=v||r.jqmData("theme")||f.splitTheme,m=r.jqmData("icon"),r.appendTo(n).attr("title",e.trim(r.getEncodedText())).addClass("ui-li-link-alt").empty().buttonMarkup({shadow:!1,corners:!1,theme:o,icon:!1,iconpos:"notext"}).find(".ui-btn-inner").append(e(i.createElement("span")).buttonMarkup({shadow:!0,corners:!0,theme:l,iconpos:"notext",icon:m||p||_||f.splitIcon})))):E?(a+=" ui-li-divider ui-bar-"+(n.jqmData("theme")||b),n.attr("role","heading"),y&&(T||0===T?w?d=parseInt(T,10):(h=parseInt(T,10)-1,n.css("counter-reset","listnumbering "+h)):w&&(d=1))):a+=" ui-li-static ui-btn-up-"+o}y&&w&&0>a.indexOf("ui-li-divider")&&(u=a.indexOf("ui-li-static")>0?n:n.find(".ui-link-inherit"),u.addClass("ui-li-jsnumbering").prepend("<span class='ui-li-dec'>"+d++ +". </span>")),D[a]||(D[a]=[]),D[a].push(n[0])}for(a in D)e(D[a]).addClass(a).children(".ui-btn-inner").addClass(a);g.find("h1, h2, h3, h4, h5, h6").addClass("ui-li-heading").end().find("p, dl").addClass("ui-li-desc").end().find(".ui-li-aside").each(function(){var t=e(this);t.prependTo(t.parent())}).end().find(".ui-li-count").each(function(){e(this).closest("li").addClass("ui-li-has-count")}).addClass("ui-btn-up-"+(g.jqmData("counttheme")||this.options.countTheme)+" ui-btn-corner-all"),this._addThumbClasses(x),this._addThumbClasses(g.find(".ui-link-inherit")),this._addFirstLastClasses(x,this._getVisibles(x,t),t),this._trigger("afterrefresh")},_idStringEscape:function(e){return e.replace(/[^a-zA-Z0-9]/g,"-")},_createSubPages:function(){var i,a=this.element,o=a.closest(".ui-page"),s=o.jqmData("url"),r=s||o[0][e.expando],l=a.attr("id"),d=this.options,c="data-"+e.mobile.ns,h=this,u=o.find(":jqmData(role='footer')").jqmData("id");if(t[r]===n&&(t[r]=-1),l=l||++t[r],e(a.find("li>ul, li>ol").toArray().reverse()).each(function(t){var n,o,r=e(this),h=r.attr("id")||l+"-"+t,p=r.parent(),m=e(r.prevAll().toArray().reverse()),f=m.length?m:e("<span>"+e.trim(p.contents()[0].nodeValue)+"</span>"),g=f.first().getEncodedText(),b=(s||"")+"&"+e.mobile.subPageUrlKey+"="+h,v=r.jqmData("theme")||d.theme,_=r.jqmData("counttheme")||a.jqmData("counttheme")||d.countTheme;i=!0,n=r.detach().wrap("<div "+c+"role='page' "+c+"url='"+b+"' "+c+"theme='"+v+"' "+c+"count-theme='"+_+"'><div "+c+"role='content'></div></div>").parent().before("<div "+c+"role='header' "+c+"theme='"+d.headerTheme+"'><div class='ui-title'>"+g+"</div></div>").after(u?e("<div "+c+"role='footer' "+c+"id='"+u+"'>"):"").parent().appendTo(e.mobile.pageContainer),n.page(),o=p.find("a:first"),o.length||(o=e("<a/>").html(f||g).prependTo(p.empty())),o.attr("href","#"+b)}).listview(),i&&o.is(":jqmData(external-page='true')")&&o.data("mobile-page").options.domCache===!1){var p=function(t,i){var n,a=i.nextPage,r=new e.Event("pageremove");i.nextPage&&(n=a.jqmData("url"),0!==n.indexOf(s+"&"+e.mobile.subPageUrlKey)&&(h.childPages().remove(),o.trigger(r),r.isDefaultPrevented()||o.removeWithDependents()))};o.unbind("pagehide.remove").bind("pagehide.remove",p)}},childPages:function(){var t=this.parentPage.jqmData("url");return e(":jqmData(url^='"+t+"&"+e.mobile.subPageUrlKey+"')")}},e.mobile.behaviors.addFirstLastClasses)),e.mobile.document.bind("pagecreate create",function(t){e.mobile.listview.prototype.enhanceWithin(t.target)})}(e),function(e){var t=e("meta[name=viewport]"),i=t.attr("content"),n=i+",maximum-scale=1, user-scalable=no",a=i+",maximum-scale=10, user-scalable=yes",o=/(user-scalable[\s]*=[\s]*no)|(maximum-scale[\s]*=[\s]*1)[$,\s]/.test(i);e.mobile.zoom=e.extend({},{enabled:!o,locked:!1,disable:function(i){o||e.mobile.zoom.locked||(t.attr("content",n),e.mobile.zoom.enabled=!1,e.mobile.zoom.locked=i||!1)},enable:function(i){o||e.mobile.zoom.locked&&i!==!0||(t.attr("content",a),e.mobile.zoom.enabled=!0,e.mobile.zoom.locked=!1)},restore:function(){o||(t.attr("content",i),e.mobile.zoom.enabled=!0)}})}(e),function(e){e.widget("mobile.textinput",e.mobile.widget,{options:{theme:null,mini:!1,preventFocusZoom:/iPhone|iPad|iPod/.test(navigator.platform)&&navigator.userAgent.indexOf("AppleWebKit")>-1,initSelector:"input[type='text'], input[type='search'], :jqmData(type='search'), input[type='number'], :jqmData(type='number'), input[type='password'], input[type='email'], input[type='url'], input[type='tel'], textarea, input[type='time'], input[type='date'], input[type='month'], input[type='week'], input[type='datetime'], input[type='datetime-local'], input[type='color'], input:not([type]), input[type='file']",clearBtn:!1,clearSearchButtonText:null,clearBtnText:"clear text",disabled:!1},_create:function(){function t(){setTimeout(function(){a.toggleClass("ui-input-clear-hidden",!s.val())},0)}var i,a,o=this,s=this.element,r=this.options,l=r.theme||e.mobile.getInheritedTheme(this.element,"c"),d=" ui-body-"+l,c=r.mini?" ui-mini":"",h=s.is("[type='search'], :jqmData(type='search')"),u=r.clearSearchButtonText||r.clearBtnText,p=s.is("textarea, :jqmData(type='range')"),m=!!r.clearBtn&&!p,f=s.is("input")&&!s.is(":jqmData(type='range')");if(e("label[for='"+s.attr("id")+"']").addClass("ui-input-text"),i=s.addClass("ui-input-text ui-body-"+l),s[0].autocorrect===n||e.support.touchOverflow||(s[0].setAttribute("autocorrect","off"),s[0].setAttribute("autocomplete","off")),h?i=s.wrap("<div class='ui-input-search ui-shadow-inset ui-btn-corner-all ui-btn-shadow ui-icon-searchfield"+d+c+"'></div>").parent():f&&(i=s.wrap("<div class='ui-input-text ui-shadow-inset ui-corner-all ui-btn-shadow"+d+c+"'></div>").parent()),m||h?(a=e("<a href='#' class='ui-input-clear' title='"+u+"'>"+u+"</a>").bind("click",function(e){s.val("").focus().trigger("change"),a.addClass("ui-input-clear-hidden"),e.preventDefault()}).appendTo(i).buttonMarkup({icon:"delete",iconpos:"notext",corners:!0,shadow:!0,mini:r.mini}),h||i.addClass("ui-input-has-clear"),t(),s.bind("paste cut keyup input focus change blur",t)):f||h||s.addClass("ui-corner-all ui-shadow-inset"+d+c),s.focus(function(){r.preventFocusZoom&&e.mobile.zoom.disable(!0),i.addClass(e.mobile.focusClass)}).blur(function(){i.removeClass(e.mobile.focusClass),r.preventFocusZoom&&e.mobile.zoom.enable(!0)}),s.is("textarea")){var g,b=15,v=100;this._keyup=function(){var e=s[0].scrollHeight,t=s[0].clientHeight;if(e>t){var i=parseFloat(s.css("padding-top")),n=parseFloat(s.css("padding-bottom")),a=i+n;s.height(e-a+b)}},s.on("keyup change input paste",function(){clearTimeout(g),g=setTimeout(o._keyup,v)}),this._on(!0,e.mobile.document,{pagechange:"_keyup"}),e.trim(s.val())&&this._on(!0,e.mobile.window,{load:"_keyup"})}s.attr("disabled")&&this.disable()},disable:function(){var e,t=this.element.is("[type='search'], :jqmData(type='search')"),i=this.element.is("input")&&!this.element.is(":jqmData(type='range')"),n=this.element.attr("disabled",!0)&&(i||t);return e=n?this.element.parent():this.element,e.addClass("ui-disabled"),this._setOption("disabled",!0)},enable:function(){var e,t=this.element.is("[type='search'], :jqmData(type='search')"),i=this.element.is("input")&&!this.element.is(":jqmData(type='range')"),n=this.element.attr("disabled",!1)&&(i||t);return e=n?this.element.parent():this.element,e.removeClass("ui-disabled"),this._setOption("disabled",!1)}}),e.mobile.document.bind("pagecreate create",function(t){e.mobile.textinput.prototype.enhanceWithin(t.target,!0)})}(e),function(e){e.mobile.listview.prototype.options.filter=!1,e.mobile.listview.prototype.options.filterPlaceholder="Filter items...",e.mobile.listview.prototype.options.filterTheme="c",e.mobile.listview.prototype.options.filterReveal=!1;var t=function(e,t){return-1===(""+e).toLowerCase().indexOf(t)};e.mobile.listview.prototype.options.filterCallback=t,e.mobile.document.delegate("ul, ol","listviewcreate",function(){var i=e(this),n=i.data("mobile-listview");if(n&&n.options.filter){n.options.filterReveal&&i.children().addClass("ui-screen-hidden");var a=e("<form>",{"class":"ui-listview-filter ui-bar-"+n.options.filterTheme,role:"search"}).submit(function(e){e.preventDefault(),s.blur()}),o=function(){var a,o=e(this),s=this.value.toLowerCase(),r=null,l=i.children(),d=o.jqmData("lastval")+"",c=!1,h="",u=n.options.filterCallback!==t;if(!d||d!==s){if(n._trigger("beforefilter","beforefilter",{input:this}),o.jqmData("lastval",s),u||s.length<d.length||0!==s.indexOf(d)?r=i.children():(r=i.children(":not(.ui-screen-hidden)"),!r.length&&n.options.filterReveal&&(r=i.children(".ui-screen-hidden"))),s){for(var p=r.length-1;p>=0;p--)a=e(r[p]),h=a.jqmData("filtertext")||a.text(),a.is("li:jqmData(role=list-divider)")?(a.toggleClass("ui-filter-hidequeue",!c),c=!1):n.options.filterCallback(h,s,a)?a.toggleClass("ui-filter-hidequeue",!0):c=!0;r.filter(":not(.ui-filter-hidequeue)").toggleClass("ui-screen-hidden",!1),r.filter(".ui-filter-hidequeue").toggleClass("ui-screen-hidden",!0).toggleClass("ui-filter-hidequeue",!1)}else r.toggleClass("ui-screen-hidden",!!n.options.filterReveal);n._addFirstLastClasses(l,n._getVisibles(l,!1),!1)}},s=e("<input>",{placeholder:n.options.filterPlaceholder}).attr("data-"+e.mobile.ns+"type","search").jqmData("lastval","").bind("keyup change input",o).appendTo(a).textinput();n.options.inset&&a.addClass("ui-listview-filter-inset"),a.bind("submit",function(){return!1}).insertBefore(i)}})}(e),function(e){e.mobile.listview.prototype.options.autodividers=!1,e.mobile.listview.prototype.options.autodividersSelector=function(t){var i=e.trim(t.text())||null;return i?i=i.slice(0,1).toUpperCase():null},e.mobile.document.delegate("ul,ol","listviewcreate",function(){var t=e(this),n=t.data("mobile-listview");if(n&&n.options.autodividers){var a=function(){t.find("li:jqmData(role='list-divider')").remove();for(var a,o,s=t.find("li"),r=null,l=0;s.length>l;l++){if(a=s[l],o=n.options.autodividersSelector(e(a)),o&&r!==o){var d=i.createElement("li");d.appendChild(i.createTextNode(o)),d.setAttribute("data-"+e.mobile.ns+"role","list-divider"),a.parentNode.insertBefore(d,a)}r=o}},o=function(){t.unbind("listviewafterrefresh",o),a(),n.refresh(),t.bind("listviewafterrefresh",o)};o()}})}(e),function(e){e(i).bind("pagecreate create",function(t){e(":jqmData(role='nojs')",t.target).addClass("ui-nojs")})}(e),function(e){e.mobile.behaviors.formReset={_handleFormReset:function(){this._on(this.element.closest("form"),{reset:function(){this._delay("_reset")}})}}}(e),function(e){e.widget("mobile.checkboxradio",e.mobile.widget,e.extend({options:{theme:null,mini:!1,initSelector:"input[type='checkbox'],input[type='radio']"},_create:function(){var t=this,a=this.element,o=this.options,s=function(e,t){return e.jqmData(t)||e.closest("form, fieldset").jqmData(t)},r=e(a).closest("label"),l=r.length?r:e(a).closest("form, fieldset, :jqmData(role='page'), :jqmData(role='dialog')").find("label").filter("[for='"+a[0].id+"']").first(),d=a[0].type,c=s(a,"mini")||o.mini,h=d+"-on",u=d+"-off",p=s(a,"iconpos"),m="ui-"+h,f="ui-"+u;if("checkbox"===d||"radio"===d){e.extend(this,{label:l,inputtype:d,checkedClass:m,uncheckedClass:f,checkedicon:h,uncheckedicon:u}),o.theme||(o.theme=e.mobile.getInheritedTheme(this.element,"c")),l.buttonMarkup({theme:o.theme,icon:u,shadow:!1,mini:c,iconpos:p});var g=i.createElement("div");g.className="ui-"+d,a.add(l).wrapAll(g),l.bind({vmouseover:function(t){e(this).parent().is(".ui-disabled")&&t.stopPropagation()},vclick:function(e){return a.is(":disabled")?(e.preventDefault(),n):(t._cacheVals(),a.prop("checked","radio"===d&&!0||!a.prop("checked")),a.triggerHandler("click"),t._getInputSet().not(a).prop("checked",!1),t._updateAll(),!1)}}),a.bind({vmousedown:function(){t._cacheVals()},vclick:function(){var i=e(this);i.is(":checked")?(i.prop("checked",!0),t._getInputSet().not(i).prop("checked",!1)):i.prop("checked",!1),t._updateAll()},focus:function(){l.addClass(e.mobile.focusClass)},blur:function(){l.removeClass(e.mobile.focusClass)}}),this._handleFormReset(),this.refresh()}},_cacheVals:function(){this._getInputSet().each(function(){e(this).jqmData("cacheVal",this.checked)})},_getInputSet:function(){return"checkbox"===this.inputtype?this.element:this.element.closest("form, :jqmData(role='page'), :jqmData(role='dialog')").find("input[name='"+this.element[0].name+"'][type='"+this.inputtype+"']")},_updateAll:function(){var t=this;this._getInputSet().each(function(){var i=e(this);(this.checked||"checkbox"===t.inputtype)&&i.trigger("change")}).checkboxradio("refresh")},_reset:function(){this.refresh()},refresh:function(){var t=this.element[0],i=" "+e.mobile.activeBtnClass,n=this.checkedClass+(this.element.parents(".ui-controlgroup-horizontal").length?i:""),a=this.label;t.checked?a.removeClass(this.uncheckedClass+i).addClass(n).buttonMarkup({icon:this.checkedicon}):a.removeClass(n).addClass(this.uncheckedClass).buttonMarkup({icon:this.uncheckedicon}),t.disabled?this.disable():this.enable()},disable:function(){this.element.prop("disabled",!0).parent().addClass("ui-disabled")},enable:function(){this.element.prop("disabled",!1).parent().removeClass("ui-disabled")}},e.mobile.behaviors.formReset)),e.mobile.document.bind("pagecreate create",function(t){e.mobile.checkboxradio.prototype.enhanceWithin(t.target,!0)})}(e),function(e){e.widget("mobile.button",e.mobile.widget,{options:{theme:null,icon:null,iconpos:null,corners:!0,shadow:!0,iconshadow:!0,inline:null,mini:null,initSelector:"button, [type='button'], [type='submit'], [type='reset']"},_create:function(){var t,i=this.element,a=function(e){var t,i={};for(t in e)null!==e[t]&&"initSelector"!==t&&(i[t]=e[t]);return i}(this.options),o="";return"A"===i[0].tagName?(i.hasClass("ui-btn")||i.buttonMarkup(),n):(this.options.theme||(this.options.theme=e.mobile.getInheritedTheme(this.element,"c")),~i[0].className.indexOf("ui-btn-left")&&(o="ui-btn-left"),~i[0].className.indexOf("ui-btn-right")&&(o="ui-btn-right"),("submit"===i.attr("type")||"reset"===i.attr("type"))&&(o?o+=" ui-submit":o="ui-submit"),e("label[for='"+i.attr("id")+"']").addClass("ui-submit"),this.button=e("<div></div>")[i.html()?"html":"text"](i.html()||i.val()).insertBefore(i).buttonMarkup(a).addClass(o).append(i.addClass("ui-btn-hidden")),t=this.button,i.bind({focus:function(){t.addClass(e.mobile.focusClass)},blur:function(){t.removeClass(e.mobile.focusClass)}}),this.refresh(),n)},_setOption:function(t,i){var n={};n[t]=i,"initSelector"!==t&&(this.button.buttonMarkup(n),this.element.attr("data-"+(e.mobile.ns||"")+t.replace(/([A-Z])/,"-$1").toLowerCase(),i)),this._super("_setOption",t,i)},enable:function(){return this.element.attr("disabled",!1),this.button.removeClass("ui-disabled").attr("aria-disabled",!1),this._setOption("disabled",!1)},disable:function(){return this.element.attr("disabled",!0),this.button.addClass("ui-disabled").attr("aria-disabled",!0),this._setOption("disabled",!0)},refresh:function(){var t=this.element;t.prop("disabled")?this.disable():this.enable(),e(this.button.data("buttonElements").text)[t.html()?"html":"text"](t.html()||t.val())}}),e.mobile.document.bind("pagecreate create",function(t){e.mobile.button.prototype.enhanceWithin(t.target,!0)})}(e),function(e,n){e.widget("mobile.slider",e.mobile.widget,e.extend({widgetEventPrefix:"slide",options:{theme:null,trackTheme:null,disabled:!1,initSelector:"input[type='range'], :jqmData(type='range'), :jqmData(role='slider')",mini:!1,highlight:!1},_create:function(){var a,o,s=this,r=this.element,l=e.mobile.getInheritedTheme(r,"c"),d=this.options.theme||l,c=this.options.trackTheme||l,h=r[0].nodeName.toLowerCase(),u=(this.isToggleSwitch="select"===h,r.parent().is(":jqmData(role='rangeslider')")),p=this.isToggleSwitch?"ui-slider-switch":"",m=r.attr("id"),f=e("[for='"+m+"']"),g=f.attr("id")||m+"-label",b=f.attr("id",g),v=this.isToggleSwitch?0:parseFloat(r.attr("min")),_=this.isToggleSwitch?r.find("option").length-1:parseFloat(r.attr("max")),C=t.parseFloat(r.attr("step")||1),x=this.options.mini||r.jqmData("mini")?" ui-mini":"",y=i.createElement("a"),w=e(y),T=i.createElement("div"),D=e(T),P=this.options.highlight&&!this.isToggleSwitch?function(){var t=i.createElement("div");return t.className="ui-slider-bg "+e.mobile.activeBtnClass+" ui-btn-corner-all",e(t).prependTo(D)}():!1;if(y.setAttribute("href","#"),T.setAttribute("role","application"),T.className=[this.isToggleSwitch?"ui-slider ":"ui-slider-track ",p," ui-btn-down-",c," ui-btn-corner-all",x].join(""),y.className="ui-slider-handle",T.appendChild(y),w.buttonMarkup({corners:!0,theme:d,shadow:!0}).attr({role:"slider","aria-valuemin":v,"aria-valuemax":_,"aria-valuenow":this._value(),"aria-valuetext":this._value(),title:this._value(),"aria-labelledby":g}),e.extend(this,{slider:D,handle:w,type:h,step:C,max:_,min:v,valuebg:P,isRangeslider:u,dragging:!1,beforeStart:null,userModified:!1,mouseMoved:!1}),this.isToggleSwitch){o=i.createElement("div"),o.className="ui-slider-inneroffset";for(var k=0,E=T.childNodes.length;E>k;k++)o.appendChild(T.childNodes[k]);T.appendChild(o),w.addClass("ui-slider-handle-snapping"),a=r.find("option");for(var q=0,j=a.length;j>q;q++){var S=q?"a":"b",A=q?" "+e.mobile.activeBtnClass:" ui-btn-down-"+c,N=(i.createElement("div"),i.createElement("span"));N.className=["ui-slider-label ui-slider-label-",S,A," ui-btn-corner-all"].join(""),N.setAttribute("role","img"),N.appendChild(i.createTextNode(a[q].innerHTML)),e(N).prependTo(D)}s._labels=e(".ui-slider-label",D)}b.addClass("ui-slider"),r.addClass(this.isToggleSwitch?"ui-slider-switch":"ui-slider-input"),this._on(r,{change:"_controlChange",keyup:"_controlKeyup",blur:"_controlBlur",vmouseup:"_controlVMouseUp"}),D.bind("vmousedown",e.proxy(this._sliderVMouseDown,this)).bind("vclick",!1),this._on(i,{vmousemove:"_preventDocumentDrag"}),this._on(D.add(i),{vmouseup:"_sliderVMouseUp"}),D.insertAfter(r),this.isToggleSwitch||u||(o=this.options.mini?"<div class='ui-slider ui-mini'>":"<div class='ui-slider'>",r.add(D).wrapAll(o)),this.isToggleSwitch&&this.handle.bind({focus:function(){D.addClass(e.mobile.focusClass)},blur:function(){D.removeClass(e.mobile.focusClass)}}),this._on(this.handle,{vmousedown:"_handleVMouseDown",keydown:"_handleKeydown",keyup:"_handleKeyup"}),this.handle.bind("vclick",!1),this._handleFormReset(),this.refresh(n,n,!0)},_controlChange:function(e){return this._trigger("controlchange",e)===!1?!1:(this.mouseMoved||this.refresh(this._value(),!0),n)},_controlKeyup:function(){this.refresh(this._value(),!0,!0)},_controlBlur:function(){this.refresh(this._value(),!0)},_controlVMouseUp:function(){this._checkedRefresh()},_handleVMouseDown:function(){this.handle.focus()},_handleKeydown:function(t){var i=this._value();if(!this.options.disabled){switch(t.keyCode){case e.mobile.keyCode.HOME:case e.mobile.keyCode.END:case e.mobile.keyCode.PAGE_UP:case e.mobile.keyCode.PAGE_DOWN:case e.mobile.keyCode.UP:case e.mobile.keyCode.RIGHT:case e.mobile.keyCode.DOWN:case e.mobile.keyCode.LEFT:t.preventDefault(),this._keySliding||(this._keySliding=!0,this.handle.addClass("ui-state-active"))}switch(t.keyCode){case e.mobile.keyCode.HOME:this.refresh(this.min);break;case e.mobile.keyCode.END:this.refresh(this.max);break;case e.mobile.keyCode.PAGE_UP:case e.mobile.keyCode.UP:case e.mobile.keyCode.RIGHT:this.refresh(i+this.step);break;case e.mobile.keyCode.PAGE_DOWN:case e.mobile.keyCode.DOWN:case e.mobile.keyCode.LEFT:this.refresh(i-this.step)}}},_handleKeyup:function(){this._keySliding&&(this._keySliding=!1,this.handle.removeClass("ui-state-active"))},_sliderVMouseDown:function(e){return this.options.disabled||1!==e.which&&0!==e.which?!1:this._trigger("beforestart",e)===!1?!1:(this.dragging=!0,this.userModified=!1,this.mouseMoved=!1,this.isToggleSwitch&&(this.beforeStart=this.element[0].selectedIndex),this.refresh(e),this._trigger("start"),!1)},_sliderVMouseUp:function(){return this.dragging?(this.dragging=!1,this.isToggleSwitch&&(this.handle.addClass("ui-slider-handle-snapping"),this.mouseMoved?this.userModified?this.refresh(0===this.beforeStart?1:0):this.refresh(this.beforeStart):this.refresh(0===this.beforeStart?1:0)),this.mouseMoved=!1,this._trigger("stop"),!1):n},_preventDocumentDrag:function(e){return this._trigger("drag",e)===!1?!1:this.dragging&&!this.options.disabled?(this.mouseMoved=!0,this.isToggleSwitch&&this.handle.removeClass("ui-slider-handle-snapping"),this.refresh(e),this.userModified=this.beforeStart!==this.element[0].selectedIndex,!1):n},_checkedRefresh:function(){this.value!==this._value()&&this.refresh(this._value())},_value:function(){return this.isToggleSwitch?this.element[0].selectedIndex:parseFloat(this.element.val())},_reset:function(){this.refresh(n,!1,!0)},refresh:function(t,a,o){var s,r,l,d,c=this,h=e.mobile.getInheritedTheme(this.element,"c"),u=this.options.theme||h,p=this.options.trackTheme||h;c.slider[0].className=[this.isToggleSwitch?"ui-slider ui-slider-switch":"ui-slider-track"," ui-btn-down-"+p," ui-btn-corner-all",this.options.mini?" ui-mini":""].join(""),(this.options.disabled||this.element.attr("disabled"))&&this.disable(),this.value=this._value(),this.options.highlight&&!this.isToggleSwitch&&0===this.slider.find(".ui-slider-bg").length&&(this.valuebg=function(){var t=i.createElement("div");return t.className="ui-slider-bg "+e.mobile.activeBtnClass+" ui-btn-corner-all",e(t).prependTo(c.slider)}()),this.handle.buttonMarkup({corners:!0,theme:u,shadow:!0});var m,f,g=this.element,b=!this.isToggleSwitch,v=b?[]:g.find("option"),_=b?parseFloat(g.attr("min")):0,C=b?parseFloat(g.attr("max")):v.length-1,x=b&&parseFloat(g.attr("step"))>0?parseFloat(g.attr("step")):1;if("object"==typeof t){if(l=t,d=8,s=this.slider.offset().left,r=this.slider.width(),m=r/((C-_)/x),!this.dragging||s-d>l.pageX||l.pageX>s+r+d)return;f=m>1?100*((l.pageX-s)/r):Math.round(100*((l.pageX-s)/r))}else null==t&&(t=b?parseFloat(g.val()||0):g[0].selectedIndex),f=100*((parseFloat(t)-_)/(C-_));if(!isNaN(f)){var y=f/100*(C-_)+_,w=(y-_)%x,T=y-w;2*Math.abs(w)>=x&&(T+=w>0?x:-x);var D=100/((C-_)/x);if(y=parseFloat(T.toFixed(5)),m===n&&(m=r/((C-_)/x)),m>1&&b&&(f=(y-_)*D*(1/x)),0>f&&(f=0),f>100&&(f=100),_>y&&(y=_),y>C&&(y=C),this.handle.css("left",f+"%"),this.handle[0].setAttribute("aria-valuenow",b?y:v.eq(y).attr("value")),this.handle[0].setAttribute("aria-valuetext",b?y:v.eq(y).getEncodedText()),this.handle[0].setAttribute("title",b?y:v.eq(y).getEncodedText()),this.valuebg&&this.valuebg.css("width",f+"%"),this._labels){var P=100*(this.handle.width()/this.slider.width()),k=f&&P+(100-P)*f/100,E=100===f?0:Math.min(P+100-k,100);this._labels.each(function(){var t=e(this).is(".ui-slider-label-a");e(this).width((t?k:E)+"%")})}if(!o){var q=!1;if(b?(q=g.val()!==y,g.val(y)):(q=g[0].selectedIndex!==y,g[0].selectedIndex=y),this._trigger("beforechange",t)===!1)return!1;!a&&q&&g.trigger("change")}}},enable:function(){return this.element.attr("disabled",!1),this.slider.removeClass("ui-disabled").attr("aria-disabled",!1),this._setOption("disabled",!1)},disable:function(){return this.element.attr("disabled",!0),this.slider.addClass("ui-disabled").attr("aria-disabled",!0),this._setOption("disabled",!0)}},e.mobile.behaviors.formReset)),e.mobile.document.bind("pagecreate create",function(t){e.mobile.slider.prototype.enhanceWithin(t.target,!0)})}(e),function(e){e.widget("mobile.rangeslider",e.mobile.widget,{options:{theme:null,trackTheme:null,disabled:!1,initSelector:":jqmData(role='rangeslider')",mini:!1,highlight:!0},_create:function(){var t,i=this.element,n=this.options.mini?"ui-rangeslider ui-mini":"ui-rangeslider",a=i.find("input").first(),o=i.find("input").last(),s=i.find("label").first(),r=e.data(a.get(0),"mobileSlider").slider,l=e.data(o.get(0),"mobileSlider").slider,d=e.data(a.get(0),"mobileSlider").handle,c=e('<div class="ui-rangeslider-sliders" />').appendTo(i);i.find("label").length>1&&(t=i.find("label").last().hide()),a.addClass("ui-rangeslider-first"),o.addClass("ui-rangeslider-last"),i.addClass(n),r.appendTo(c),l.appendTo(c),s.prependTo(i),d.prependTo(l),e.extend(this,{_inputFirst:a,_inputLast:o,_sliderFirst:r,_sliderLast:l,_targetVal:null,_sliderTarget:!1,_sliders:c,_proxy:!1}),this.refresh(),this._on(this.element.find("input.ui-slider-input"),{slidebeforestart:"_slidebeforestart",slidestop:"_slidestop",slidedrag:"_slidedrag",slidebeforechange:"_change",blur:"_change",keyup:"_change"}),this._on({mousedown:"_change"}),this._on(this.element.closest("form"),{reset:"_handleReset"}),this._on(d,{vmousedown:"_dragFirstHandle"})},_handleReset:function(){var e=this;setTimeout(function(){e._updateHighlight()},0)},_dragFirstHandle:function(t){return e.data(this._inputFirst.get(0),"mobileSlider").dragging=!0,e.data(this._inputFirst.get(0),"mobileSlider").refresh(t),!1},_slidedrag:function(t){var i=e(t.target).is(this._inputFirst),a=i?this._inputLast:this._inputFirst;return this._sliderTarget=!1,"first"===this._proxy&&i||"last"===this._proxy&&!i?(e.data(a.get(0),"mobileSlider").dragging=!0,e.data(a.get(0),"mobileSlider").refresh(t),!1):n},_slidestop:function(t){var i=e(t.target).is(this._inputFirst);this._proxy=!1,this.element.find("input").trigger("vmouseup"),this._sliderFirst.css("z-index",i?1:"")},_slidebeforestart:function(t){this._sliderTarget=!1,e(t.originalEvent.target).hasClass("ui-slider-track")&&(this._sliderTarget=!0,this._targetVal=e(t.target).val())},_setOption:function(e){this._superApply(e),this.refresh()},refresh:function(){var e=this.element,t=this.options;e.find("input").slider({theme:t.theme,trackTheme:t.trackTheme,disabled:t.disabled,mini:t.mini,highlight:t.highlight}).slider("refresh"),this._updateHighlight()},_change:function(t){if("keyup"===t.type)return this._updateHighlight(),!1;var i=this,a=parseFloat(this._inputFirst.val(),10),o=parseFloat(this._inputLast.val(),10),s=e(t.target).hasClass("ui-rangeslider-first"),r=s?this._inputFirst:this._inputLast,l=s?this._inputLast:this._inputFirst;if(this._inputFirst.val()>this._inputLast.val()&&"mousedown"===t.type&&!e(t.target).hasClass("ui-slider-handle"))r.blur();else if("mousedown"===t.type)return;return a>o&&!this._sliderTarget?(r.val(s?o:a).slider("refresh"),this._trigger("normalize")):a>o&&(r.val(this._targetVal).slider("refresh"),setTimeout(function(){l.val(s?a:o).slider("refresh"),e.data(l.get(0),"mobileSlider").handle.focus(),i._sliderFirst.css("z-index",s?"":1),i._trigger("normalize")},0),this._proxy=s?"first":"last"),a===o?(e.data(r.get(0),"mobileSlider").handle.css("z-index",1),e.data(l.get(0),"mobileSlider").handle.css("z-index",0)):(e.data(l.get(0),"mobileSlider").handle.css("z-index",""),e.data(r.get(0),"mobileSlider").handle.css("z-index","")),this._updateHighlight(),a>=o?!1:n},_updateHighlight:function(){var t=parseInt(e.data(this._inputFirst.get(0),"mobileSlider").handle.get(0).style.left,10),i=parseInt(e.data(this._inputLast.get(0),"mobileSlider").handle.get(0).style.left,10),n=i-t;this.element.find(".ui-slider-bg").css({"margin-left":t+"%",width:n+"%"})},_destroy:function(){this.element.removeClass("ui-rangeslider ui-mini").find("label").show(),this._inputFirst.after(this._sliderFirst),this._inputLast.after(this._sliderLast),this._sliders.remove(),this.element.find("input").removeClass("ui-rangeslider-first ui-rangeslider-last").slider("destroy")}}),e.widget("mobile.rangeslider",e.mobile.rangeslider,e.mobile.behaviors.formReset),e(i).bind("pagecreate create",function(t){e.mobile.rangeslider.prototype.enhanceWithin(t.target,!0)})}(e),function(e){e.widget("mobile.selectmenu",e.mobile.widget,e.extend({options:{theme:null,disabled:!1,icon:"arrow-d",iconpos:"right",inline:!1,corners:!0,shadow:!0,iconshadow:!0,overlayTheme:"a",dividerTheme:"b",hidePlaceholderMenuItems:!0,closeText:"Close",nativeMenu:!0,preventFocusZoom:/iPhone|iPad|iPod/.test(navigator.platform)&&navigator.userAgent.indexOf("AppleWebKit")>-1,initSelector:"select:not( :jqmData(role='slider') )",mini:!1},_button:function(){return e("<div/>")
},_setDisabled:function(e){return this.element.attr("disabled",e),this.button.attr("aria-disabled",e),this._setOption("disabled",e)},_focusButton:function(){var e=this;setTimeout(function(){e.button.focus()},40)},_selectOptions:function(){return this.select.find("option")},_preExtension:function(){var t="";~this.element[0].className.indexOf("ui-btn-left")&&(t=" ui-btn-left"),~this.element[0].className.indexOf("ui-btn-right")&&(t=" ui-btn-right"),this.select=this.element.removeClass("ui-btn-left ui-btn-right").wrap("<div class='ui-select"+t+"'>"),this.selectID=this.select.attr("id"),this.label=e("label[for='"+this.selectID+"']").addClass("ui-select"),this.isMultiple=this.select[0].multiple,this.options.theme||(this.options.theme=e.mobile.getInheritedTheme(this.select,"c"))},_destroy:function(){var e=this.element.parents(".ui-select");e.length>0&&(e.is(".ui-btn-left, .ui-btn-right")&&this.element.addClass(e.is(".ui-btn-left")?"ui-btn-left":"ui-btn-right"),this.element.insertAfter(e),e.remove())},_create:function(){this._preExtension(),this._trigger("beforeCreate"),this.button=this._button();var i=this,n=this.options,a=n.inline||this.select.jqmData("inline"),o=n.mini||this.select.jqmData("mini"),s=n.icon?n.iconpos||this.select.jqmData("iconpos"):!1,r=(-1===this.select[0].selectedIndex?0:this.select[0].selectedIndex,this.button.insertBefore(this.select).buttonMarkup({theme:n.theme,icon:n.icon,iconpos:s,inline:a,corners:n.corners,shadow:n.shadow,iconshadow:n.iconshadow,mini:o}));this.setButtonText(),n.nativeMenu&&t.opera&&t.opera.version&&r.addClass("ui-select-nativeonly"),this.isMultiple&&(this.buttonCount=e("<span>").addClass("ui-li-count ui-btn-up-c ui-btn-corner-all").hide().appendTo(r.addClass("ui-li-has-count"))),(n.disabled||this.element.attr("disabled"))&&this.disable(),this.select.change(function(){i.refresh(),n.nativeMenu&&this.blur()}),this._handleFormReset(),this.build()},build:function(){var t=this;this.select.appendTo(t.button).bind("vmousedown",function(){t.button.addClass(e.mobile.activeBtnClass)}).bind("focus",function(){t.button.addClass(e.mobile.focusClass)}).bind("blur",function(){t.button.removeClass(e.mobile.focusClass)}).bind("focus vmouseover",function(){t.button.trigger("vmouseover")}).bind("vmousemove",function(){t.button.removeClass(e.mobile.activeBtnClass)}).bind("change blur vmouseout",function(){t.button.trigger("vmouseout").removeClass(e.mobile.activeBtnClass)}).bind("change blur",function(){t.button.removeClass("ui-btn-down-"+t.options.theme)}),t.button.bind("vmousedown",function(){t.options.preventFocusZoom&&e.mobile.zoom.disable(!0)}),t.label.bind("click focus",function(){t.options.preventFocusZoom&&e.mobile.zoom.disable(!0)}),t.select.bind("focus",function(){t.options.preventFocusZoom&&e.mobile.zoom.disable(!0)}),t.button.bind("mouseup",function(){t.options.preventFocusZoom&&setTimeout(function(){e.mobile.zoom.enable(!0)},0)}),t.select.bind("blur",function(){t.options.preventFocusZoom&&e.mobile.zoom.enable(!0)})},selected:function(){return this._selectOptions().filter(":selected")},selectedIndices:function(){var e=this;return this.selected().map(function(){return e._selectOptions().index(this)}).get()},setButtonText:function(){var t=this,n=this.selected(),a=this.placeholder,o=e(i.createElement("span"));this.button.find(".ui-btn-text").html(function(){return a=n.length?n.map(function(){return e(this).text()}).get().join(", "):t.placeholder,o.text(a).addClass(t.select.attr("class")).addClass(n.attr("class"))})},setButtonCount:function(){var e=this.selected();this.isMultiple&&this.buttonCount[e.length>1?"show":"hide"]().text(e.length)},_reset:function(){this.refresh()},refresh:function(){this.setButtonText(),this.setButtonCount()},open:e.noop,close:e.noop,disable:function(){this._setDisabled(!0),this.button.addClass("ui-disabled")},enable:function(){this._setDisabled(!1),this.button.removeClass("ui-disabled")}},e.mobile.behaviors.formReset)),e.mobile.document.bind("pagecreate create",function(t){e.mobile.selectmenu.prototype.enhanceWithin(t.target,!0)})}(e),function(e,n){function a(e,t,i,n){var a=n;return a=t>e?i+(e-t)/2:Math.min(Math.max(i,n-t/2),i+e-t)}function o(){var i=e.mobile.window;return{x:i.scrollLeft(),y:i.scrollTop(),cx:t.innerWidth||i.width(),cy:t.innerHeight||i.height()}}e.widget("mobile.popup",e.mobile.widget,{options:{theme:null,overlayTheme:null,shadow:!0,corners:!0,transition:"none",positionTo:"origin",tolerance:null,initSelector:":jqmData(role='popup')",closeLinkSelector:"a:jqmData(rel='back')",closeLinkEvents:"click.popup",navigateEvents:"navigate.popup",closeEvents:"navigate.popup pagebeforechange.popup",dismissible:!0,history:!e.mobile.browser.oldIE},_eatEventAndClose:function(e){return e.preventDefault(),e.stopImmediatePropagation(),this.options.dismissible&&this.close(),!1},_resizeScreen:function(){var e=this._ui.container.outerHeight(!0);this._ui.screen.removeAttr("style"),e>this._ui.screen.height()&&this._ui.screen.height(e)},_handleWindowKeyUp:function(t){return this._isOpen&&t.keyCode===e.mobile.keyCode.ESCAPE?this._eatEventAndClose(t):n},_expectResizeEvent:function(){var t=o();if(this._resizeData){if(t.x===this._resizeData.winCoords.x&&t.y===this._resizeData.winCoords.y&&t.cx===this._resizeData.winCoords.cx&&t.cy===this._resizeData.winCoords.cy)return!1;clearTimeout(this._resizeData.timeoutId)}return this._resizeData={timeoutId:setTimeout(e.proxy(this,"_resizeTimeout"),200),winCoords:t},!0},_resizeTimeout:function(){this._isOpen?this._expectResizeEvent()||(this._ui.container.hasClass("ui-popup-hidden")&&(this._ui.container.removeClass("ui-popup-hidden"),this.reposition({positionTo:"window"}),this._ignoreResizeEvents()),this._resizeScreen(),this._resizeData=null,this._orientationchangeInProgress=!1):(this._resizeData=null,this._orientationchangeInProgress=!1)},_ignoreResizeEvents:function(){var e=this;this._ignoreResizeTo&&clearTimeout(this._ignoreResizeTo),this._ignoreResizeTo=setTimeout(function(){e._ignoreResizeTo=0},1e3)},_handleWindowResize:function(){this._isOpen&&0===this._ignoreResizeTo&&(!this._expectResizeEvent()&&!this._orientationchangeInProgress||this._ui.container.hasClass("ui-popup-hidden")||this._ui.container.addClass("ui-popup-hidden").removeAttr("style"))},_handleWindowOrientationchange:function(){!this._orientationchangeInProgress&&this._isOpen&&0===this._ignoreResizeTo&&(this._expectResizeEvent(),this._orientationchangeInProgress=!0)},_handleDocumentFocusIn:function(t){var n,a=t.target,o=this._ui;if(this._isOpen){if(a!==o.container[0]){if(n=e(t.target),0===n.parents().filter(o.container[0]).length)return e(i.activeElement).one("focus",function(){n.blur()}),o.focusElement.focus(),t.preventDefault(),t.stopImmediatePropagation(),!1;o.focusElement[0]===o.container[0]&&(o.focusElement=n)}this._ignoreResizeEvents()}},_create:function(){var t={screen:e("<div class='ui-screen-hidden ui-popup-screen'></div>"),placeholder:e("<div style='display: none;'><!-- placeholder --></div>"),container:e("<div class='ui-popup-container ui-popup-hidden'></div>")},i=this.element.closest(".ui-page"),a=this.element.attr("id"),o=this;this.options.history=this.options.history&&e.mobile.ajaxEnabled&&e.mobile.hashListeningEnabled,0===i.length&&(i=e("body")),this.options.container=this.options.container||e.mobile.pageContainer,i.append(t.screen),t.container.insertAfter(t.screen),t.placeholder.insertAfter(this.element),a&&(t.screen.attr("id",a+"-screen"),t.container.attr("id",a+"-popup"),t.placeholder.html("<!-- placeholder for "+a+" -->")),t.container.append(this.element),t.focusElement=t.container,this.element.addClass("ui-popup"),e.extend(this,{_scrollTop:0,_page:i,_ui:t,_fallbackTransition:"",_currentTransition:!1,_prereqs:null,_isOpen:!1,_tolerance:null,_resizeData:null,_ignoreResizeTo:0,_orientationchangeInProgress:!1}),e.each(this.options,function(e,t){o.options[e]=n,o._setOption(e,t,!0)}),t.screen.bind("vclick",e.proxy(this,"_eatEventAndClose")),this._on(e.mobile.window,{orientationchange:e.proxy(this,"_handleWindowOrientationchange"),resize:e.proxy(this,"_handleWindowResize"),keyup:e.proxy(this,"_handleWindowKeyUp")}),this._on(e.mobile.document,{focusin:e.proxy(this,"_handleDocumentFocusIn")})},_applyTheme:function(e,t,i){for(var n,a=(e.attr("class")||"").split(" "),o=null,s=t+"";a.length>0;){if(o=a.pop(),n=RegExp("^ui-"+i+"-([a-z])$").exec(o),n&&n.length>1){o=n[1];break}o=null}t!==o&&(e.removeClass("ui-"+i+"-"+o),null!==t&&"none"!==t&&e.addClass("ui-"+i+"-"+s))},_setTheme:function(e){this._applyTheme(this.element,e,"body")},_setOverlayTheme:function(e){this._applyTheme(this._ui.screen,e,"overlay"),this._isOpen&&this._ui.screen.addClass("in")},_setShadow:function(e){this.element.toggleClass("ui-overlay-shadow",e)},_setCorners:function(e){this.element.toggleClass("ui-corner-all",e)},_applyTransition:function(t){this._ui.container.removeClass(this._fallbackTransition),t&&"none"!==t&&(this._fallbackTransition=e.mobile._maybeDegradeTransition(t),"none"===this._fallbackTransition&&(this._fallbackTransition=""),this._ui.container.addClass(this._fallbackTransition))},_setTransition:function(e){this._currentTransition||this._applyTransition(e)},_setTolerance:function(t){var i={t:30,r:15,b:30,l:15};if(t!==n){var a=(t+"").split(",");switch(e.each(a,function(e,t){a[e]=parseInt(t,10)}),a.length){case 1:isNaN(a[0])||(i.t=i.r=i.b=i.l=a[0]);break;case 2:isNaN(a[0])||(i.t=i.b=a[0]),isNaN(a[1])||(i.l=i.r=a[1]);break;case 4:isNaN(a[0])||(i.t=a[0]),isNaN(a[1])||(i.r=a[1]),isNaN(a[2])||(i.b=a[2]),isNaN(a[3])||(i.l=a[3]);break;default:}}this._tolerance=i},_setOption:function(t,i){var a,o="_set"+t.charAt(0).toUpperCase()+t.slice(1);this[o]!==n&&this[o](i),a=["initSelector","closeLinkSelector","closeLinkEvents","navigateEvents","closeEvents","history","container"],e.mobile.widget.prototype._setOption.apply(this,arguments),-1===e.inArray(t,a)&&this.element.attr("data-"+(e.mobile.ns||"")+t.replace(/([A-Z])/,"-$1").toLowerCase(),i)},_placementCoords:function(e){var t,n,s=o(),r={x:this._tolerance.l,y:s.y+this._tolerance.t,cx:s.cx-this._tolerance.l-this._tolerance.r,cy:s.cy-this._tolerance.t-this._tolerance.b};this._ui.container.css("max-width",r.cx),t={cx:this._ui.container.outerWidth(!0),cy:this._ui.container.outerHeight(!0)},n={x:a(r.cx,t.cx,r.x,e.x),y:a(r.cy,t.cy,r.y,e.y)},n.y=Math.max(0,n.y);var l=i.documentElement,d=i.body,c=Math.max(l.clientHeight,d.scrollHeight,d.offsetHeight,l.scrollHeight,l.offsetHeight);return n.y-=Math.min(n.y,Math.max(0,n.y+t.cy-c)),{left:n.x,top:n.y}},_createPrereqs:function(t,i,n){var a,o=this;a={screen:e.Deferred(),container:e.Deferred()},a.screen.then(function(){a===o._prereqs&&t()}),a.container.then(function(){a===o._prereqs&&i()}),e.when(a.screen,a.container).done(function(){a===o._prereqs&&(o._prereqs=null,n())}),o._prereqs=a},_animate:function(t){return this._ui.screen.removeClass(t.classToRemove).addClass(t.screenClassToAdd),t.prereqs.screen.resolve(),t.transition&&"none"!==t.transition&&(t.applyTransition&&this._applyTransition(t.transition),this._fallbackTransition)?(this._ui.container.animationComplete(e.proxy(t.prereqs.container,"resolve")).addClass(t.containerClassToAdd).removeClass(t.classToRemove),n):(this._ui.container.removeClass(t.classToRemove),t.prereqs.container.resolve(),n)},_desiredCoords:function(t){var i,n=null,a=o(),s=t.x,r=t.y,l=t.positionTo;if(l&&"origin"!==l)if("window"===l)s=a.cx/2+a.x,r=a.cy/2+a.y;else{try{n=e(l)}catch(d){n=null}n&&(n.filter(":visible"),0===n.length&&(n=null))}return n&&(i=n.offset(),s=i.left+n.outerWidth()/2,r=i.top+n.outerHeight()/2),("number"!==e.type(s)||isNaN(s))&&(s=a.cx/2+a.x),("number"!==e.type(r)||isNaN(r))&&(r=a.cy/2+a.y),{x:s,y:r}},_reposition:function(e){e={x:e.x,y:e.y,positionTo:e.positionTo},this._trigger("beforeposition",e),this._ui.container.offset(this._placementCoords(this._desiredCoords(e)))},reposition:function(e){this._isOpen&&this._reposition(e)},_openPrereqsComplete:function(){this._ui.container.addClass("ui-popup-active"),this._isOpen=!0,this._resizeScreen(),this._ui.container.attr("tabindex","0").focus(),this._ignoreResizeEvents(),this._trigger("afteropen")},_open:function(t){var i=e.extend({},this.options,t),n=function(){var e=navigator.userAgent,t=e.match(/AppleWebKit\/([0-9\.]+)/),i=!!t&&t[1],n=e.match(/Android (\d+(?:\.\d+))/),a=!!n&&n[1],o=e.indexOf("Chrome")>-1;return null!==n&&"4.0"===a&&i&&i>534.13&&!o?!0:!1}();this._createPrereqs(e.noop,e.noop,e.proxy(this,"_openPrereqsComplete")),this._currentTransition=i.transition,this._applyTransition(i.transition),this.options.theme||this._setTheme(this._page.jqmData("theme")||e.mobile.getInheritedTheme(this._page,"c")),this._ui.screen.removeClass("ui-screen-hidden"),this._ui.container.removeClass("ui-popup-hidden"),this._reposition(i),this.options.overlayTheme&&n&&this.element.closest(".ui-page").addClass("ui-popup-open"),this._animate({additionalCondition:!0,transition:i.transition,classToRemove:"",screenClassToAdd:"in",containerClassToAdd:"in",applyTransition:!1,prereqs:this._prereqs})},_closePrereqScreen:function(){this._ui.screen.removeClass("out").addClass("ui-screen-hidden")},_closePrereqContainer:function(){this._ui.container.removeClass("reverse out").addClass("ui-popup-hidden").removeAttr("style")},_closePrereqsDone:function(){this.options,this._ui.container.removeAttr("tabindex"),e.mobile.popup.active=n,this._trigger("afterclose")},_close:function(t){this._ui.container.removeClass("ui-popup-active"),this._page.removeClass("ui-popup-open"),this._isOpen=!1,this._createPrereqs(e.proxy(this,"_closePrereqScreen"),e.proxy(this,"_closePrereqContainer"),e.proxy(this,"_closePrereqsDone")),this._animate({additionalCondition:this._ui.screen.hasClass("in"),transition:t?"none":this._currentTransition,classToRemove:"in",screenClassToAdd:"out",containerClassToAdd:"reverse out",applyTransition:!0,prereqs:this._prereqs})},_unenhance:function(){this._setTheme("none"),this.element.detach().insertAfter(this._ui.placeholder).removeClass("ui-popup ui-overlay-shadow ui-corner-all"),this._ui.screen.remove(),this._ui.container.remove(),this._ui.placeholder.remove()},_destroy:function(){e.mobile.popup.active===this?(this.element.one("popupafterclose",e.proxy(this,"_unenhance")),this.close()):this._unenhance()},_closePopup:function(i,n){var a,o,s=this.options,r=!1;t.scrollTo(0,this._scrollTop),i&&"pagebeforechange"===i.type&&n&&(a="string"==typeof n.toPage?n.toPage:n.toPage.jqmData("url"),a=e.mobile.path.parseUrl(a),o=a.pathname+a.search+a.hash,this._myUrl!==e.mobile.path.makeUrlAbsolute(o)?r=!0:i.preventDefault()),s.container.unbind(s.closeEvents),this.element.undelegate(s.closeLinkSelector,s.closeLinkEvents),this._close(r)},_bindContainerClose:function(){this.options.container.one(this.options.closeEvents,e.proxy(this,"_closePopup"))},open:function(i){var a,o,s,r,l,d,c=this,h=this.options;if(!e.mobile.popup.active){if(e.mobile.popup.active=this,this._scrollTop=e.mobile.window.scrollTop(),!h.history)return c._open(i),c._bindContainerClose(),c.element.delegate(h.closeLinkSelector,h.closeLinkEvents,function(e){c.close(),e.preventDefault()}),n;if(d=e.mobile.urlHistory,o=e.mobile.dialogHashKey,s=e.mobile.activePage,r=s.is(".ui-dialog"),this._myUrl=a=d.getActive().url,l=a.indexOf(o)>-1&&!r&&d.activeIndex>0)return c._open(i),c._bindContainerClose(),n;-1!==a.indexOf(o)||r?a=e.mobile.path.parseLocation().hash+o:a+=a.indexOf("#")>-1?o:"#"+o,0===d.activeIndex&&a===d.initialDst&&(a+=o),e(t).one("beforenavigate",function(e){e.preventDefault(),c._open(i),c._bindContainerClose()}),this.urlAltered=!0,e.mobile.navigate(a,{role:"dialog"})}},close:function(){e.mobile.popup.active===this&&(this._scrollTop=e.mobile.window.scrollTop(),this.options.history&&this.urlAltered?(e.mobile.back(),this.urlAltered=!1):this._closePopup())}}),e.mobile.popup.handleLink=function(t){var i,n=t.closest(":jqmData(role='page')"),a=0===n.length?e("body"):n,o=e(e.mobile.path.parseUrl(t.attr("href")).hash,a[0]);o.data("mobile-popup")&&(i=t.offset(),o.popup("open",{x:i.left+t.outerWidth()/2,y:i.top+t.outerHeight()/2,transition:t.jqmData("transition"),positionTo:t.jqmData("position-to")})),setTimeout(function(){var i=t.parent().parent();i.hasClass("ui-li")&&(t=i.parent()),t.removeClass(e.mobile.activeBtnClass)},300)},e.mobile.document.bind("pagebeforechange",function(t,i){"popup"===i.options.role&&(e.mobile.popup.handleLink(i.options.link),t.preventDefault())}),e.mobile.document.bind("pagecreate create",function(t){e.mobile.popup.prototype.enhanceWithin(t.target,!0)})}(e),function(e,t){var n=function(n){var a,o,s,r=(n.select,n._destroy),l=n.selectID,d=l?l:(e.mobile.ns||"")+"uuid-"+n.uuid,c=d+"-listbox",h=d+"-dialog",u=n.label,p=n.select.closest(".ui-page"),m=n._selectOptions(),f=n.isMultiple=n.select[0].multiple,g=l+"-button",b=l+"-menu",v=e("<div data-"+e.mobile.ns+"role='dialog' id='"+h+"' data-"+e.mobile.ns+"theme='"+n.options.theme+"' data-"+e.mobile.ns+"overlay-theme='"+n.options.overlayTheme+"'>"+"<div data-"+e.mobile.ns+"role='header'>"+"<div class='ui-title'>"+u.getEncodedText()+"</div>"+"</div>"+"<div data-"+e.mobile.ns+"role='content'></div>"+"</div>"),_=e("<div id='"+c+"' class='ui-selectmenu'>").insertAfter(n.select).popup({theme:n.options.overlayTheme}),C=e("<ul>",{"class":"ui-selectmenu-list",id:b,role:"listbox","aria-labelledby":g}).attr("data-"+e.mobile.ns+"theme",n.options.theme).attr("data-"+e.mobile.ns+"divider-theme",n.options.dividerTheme).appendTo(_),x=e("<div>",{"class":"ui-header ui-bar-"+n.options.theme}).prependTo(_),y=e("<h1>",{"class":"ui-title"}).appendTo(x);n.isMultiple&&(s=e("<a>",{text:n.options.closeText,href:"#","class":"ui-btn-left"}).attr("data-"+e.mobile.ns+"iconpos","notext").attr("data-"+e.mobile.ns+"icon","delete").appendTo(x).buttonMarkup()),e.extend(n,{select:n.select,selectID:l,buttonId:g,menuId:b,popupID:c,dialogID:h,thisPage:p,menuPage:v,label:u,selectOptions:m,isMultiple:f,theme:n.options.theme,listbox:_,list:C,header:x,headerTitle:y,headerClose:s,menuPageContent:a,menuPageClose:o,placeholder:"",build:function(){var i=this;i.refresh(),i._origTabIndex===t&&(i._origTabIndex=null===i.select[0].getAttribute("tabindex")?!1:i.select.attr("tabindex")),i.select.attr("tabindex","-1").focus(function(){e(this).blur(),i.button.focus()}),i.button.bind("vclick keydown",function(t){i.options.disabled||i.isOpen||("vclick"===t.type||t.keyCode&&(t.keyCode===e.mobile.keyCode.ENTER||t.keyCode===e.mobile.keyCode.SPACE))&&(i._decideFormat(),"overlay"===i.menuType?i.button.attr("href","#"+i.popupID).attr("data-"+(e.mobile.ns||"")+"rel","popup"):i.button.attr("href","#"+i.dialogID).attr("data-"+(e.mobile.ns||"")+"rel","dialog"),i.isOpen=!0)}),i.list.attr("role","listbox").bind("focusin",function(t){e(t.target).attr("tabindex","0").trigger("vmouseover")}).bind("focusout",function(t){e(t.target).attr("tabindex","-1").trigger("vmouseout")}).delegate("li:not(.ui-disabled, .ui-li-divider)","click",function(t){var a=i.select[0].selectedIndex,o=i.list.find("li:not(.ui-li-divider)").index(this),s=i._selectOptions().eq(o)[0];s.selected=i.isMultiple?!s.selected:!0,i.isMultiple&&e(this).find(".ui-icon").toggleClass("ui-icon-checkbox-on",s.selected).toggleClass("ui-icon-checkbox-off",!s.selected),(i.isMultiple||a!==o)&&i.select.trigger("change"),i.isMultiple?i.list.find("li:not(.ui-li-divider)").eq(o).addClass("ui-btn-down-"+n.options.theme).find("a").first().focus():i.close(),t.preventDefault()}).keydown(function(t){var i,a,o=e(t.target),s=o.closest("li");switch(t.keyCode){case 38:return i=s.prev().not(".ui-selectmenu-placeholder"),i.is(".ui-li-divider")&&(i=i.prev()),i.length&&(o.blur().attr("tabindex","-1"),i.addClass("ui-btn-down-"+n.options.theme).find("a").first().focus()),!1;case 40:return a=s.next(),a.is(".ui-li-divider")&&(a=a.next()),a.length&&(o.blur().attr("tabindex","-1"),a.addClass("ui-btn-down-"+n.options.theme).find("a").first().focus()),!1;case 13:case 32:return o.trigger("click"),!1}}),i.menuPage.bind("pagehide",function(){e.mobile._bindPageRemove.call(i.thisPage)}),i.listbox.bind("popupafterclose",function(){i.close()}),i.isMultiple&&i.headerClose.click(function(){return"overlay"===i.menuType?(i.close(),!1):t}),i.thisPage.addDependents(this.menuPage)},_isRebuildRequired:function(){var e=this.list.find("li"),t=this._selectOptions();return t.text()!==e.text()},selected:function(){return this._selectOptions().filter(":selected:not( :jqmData(placeholder='true') )")},refresh:function(t){var i,n=this;this.element,this.isMultiple,(t||this._isRebuildRequired())&&n._buildList(),i=this.selectedIndices(),n.setButtonText(),n.setButtonCount(),n.list.find("li:not(.ui-li-divider)").removeClass(e.mobile.activeBtnClass).attr("aria-selected",!1).each(function(t){if(e.inArray(t,i)>-1){var a=e(this);a.attr("aria-selected",!0),n.isMultiple?a.find(".ui-icon").removeClass("ui-icon-checkbox-off").addClass("ui-icon-checkbox-on"):a.is(".ui-selectmenu-placeholder")?a.next().addClass(e.mobile.activeBtnClass):a.addClass(e.mobile.activeBtnClass)}})},close:function(){if(!this.options.disabled&&this.isOpen){var e=this;"page"===e.menuType?(e.menuPage.dialog("close"),e.list.appendTo(e.listbox)):e.listbox.popup("close"),e._focusButton(),e.isOpen=!1}},open:function(){this.button.click()},_decideFormat:function(){function t(){var t=i.list.find("."+e.mobile.activeBtnClass+" a");0===t.length&&(t=i.list.find("li.ui-btn:not( :jqmData(placeholder='true') ) a")),t.first().focus().closest("li").addClass("ui-btn-down-"+n.options.theme)}var i=this,a=e.mobile.window,o=i.list.parent(),s=o.outerHeight(),r=(o.outerWidth(),e("."+e.mobile.activePageClass),a.scrollTop()),l=i.button.offset().top,d=a.height();a.width(),s>d-80||!e.support.scrollTop?(i.menuPage.appendTo(e.mobile.pageContainer).page(),i.menuPageContent=v.find(".ui-content"),i.menuPageClose=v.find(".ui-header a"),i.thisPage.unbind("pagehide.remove"),0===r&&l>d&&i.thisPage.one("pagehide",function(){e(this).jqmData("lastScroll",l)}),i.menuPage.one("pageshow",function(){t()}).one("pagehide",function(){i.close()}),i.menuType="page",i.menuPageContent.append(i.list),i.menuPage.find("div .ui-title").text(i.label.text())):(i.menuType="overlay",i.listbox.one("popupafteropen",t))},_buildList:function(){var t=this,n=this.options,a=this.placeholder,o=!0,s=t.isMultiple?"checkbox-off":"false";t.list.empty().filter(".ui-listview").listview("destroy");for(var r,l=t.select.find("option"),d=l.length,c=this.select[0],h="data-"+e.mobile.ns,u=h+"option-index",p=h+"icon",m=h+"role",f=h+"placeholder",g=i.createDocumentFragment(),b=!1,v=0;d>v;v++,b=!1){var _=l[v],C=e(_),x=_.parentNode,y=C.text(),w=i.createElement("a"),T=[];if(w.setAttribute("href","#"),w.appendChild(i.createTextNode(y)),x!==c&&"optgroup"===x.nodeName.toLowerCase()){var D=x.getAttribute("label");if(D!==r){var P=i.createElement("li");P.setAttribute(m,"list-divider"),P.setAttribute("role","option"),P.setAttribute("tabindex","-1"),P.appendChild(i.createTextNode(D)),g.appendChild(P),r=D}}!o||_.getAttribute("value")&&0!==y.length&&!C.jqmData("placeholder")||(o=!1,b=!0,null===_.getAttribute(f)&&(this._removePlaceholderAttr=!0),_.setAttribute(f,!0),n.hidePlaceholderMenuItems&&T.push("ui-selectmenu-placeholder"),a!==y&&(a=t.placeholder=y));var k=i.createElement("li");_.disabled&&(T.push("ui-disabled"),k.setAttribute("aria-disabled",!0)),k.setAttribute(u,v),k.setAttribute(p,s),b&&k.setAttribute(f,!0),k.className=T.join(" "),k.setAttribute("role","option"),w.setAttribute("tabindex","-1"),k.appendChild(w),g.appendChild(k)}t.list[0].appendChild(g),this.isMultiple||a.length?this.headerTitle.text(this.placeholder):this.header.hide(),t.list.listview()},_button:function(){return e("<a>",{href:"#",role:"button",id:this.buttonId,"aria-haspopup":"true","aria-owns":this.menuId})},_destroy:function(){this.close(),this._origTabIndex!==t&&(this._origTabIndex!==!1?this.select.attr("tabindex",this._origTabIndex):this.select.removeAttr("tabindex")),this._removePlaceholderAttr&&this._selectOptions().removeAttr("data-"+e.mobile.ns+"placeholder"),this.listbox.remove(),r.apply(this,arguments)}})};e.mobile.document.bind("selectmenubeforecreate",function(t){var i=e(t.target).data("mobile-selectmenu");i.options.nativeMenu||0!==i.element.parents(":jqmData(role='popup')").length||n(i)})}(e),function(e,t){e.widget("mobile.controlgroup",e.mobile.widget,e.extend({options:{shadow:!1,corners:!0,excludeInvisible:!0,type:"vertical",mini:!1,initSelector:":jqmData(role='controlgroup')"},_create:function(){var i=this.element,n={inner:e("<div class='ui-controlgroup-controls'></div>"),legend:e("<div role='heading' class='ui-controlgroup-label'></div>")},a=i.children("legend"),o=this;i.wrapInner(n.inner),a.length&&n.legend.append(a).insertBefore(i.children(0)),i.addClass("ui-corner-all ui-controlgroup"),e.extend(this,{_initialRefresh:!0}),e.each(this.options,function(e,i){o.options[e]=t,o._setOption(e,i,!0)})},_init:function(){this.refresh()},_setOption:function(i,n){var a="_set"+i.charAt(0).toUpperCase()+i.slice(1);this[a]!==t&&this[a](n),this._super(i,n),this.element.attr("data-"+(e.mobile.ns||"")+i.replace(/([A-Z])/,"-$1").toLowerCase(),n)},_setType:function(e){this.element.removeClass("ui-controlgroup-horizontal ui-controlgroup-vertical").addClass("ui-controlgroup-"+e),this.refresh()},_setCorners:function(e){this.element.toggleClass("ui-corner-all",e)},_setShadow:function(e){this.element.toggleClass("ui-shadow",e)},_setMini:function(e){this.element.toggleClass("ui-mini",e)},container:function(){return this.element.children(".ui-controlgroup-controls")},refresh:function(){var t=this.element.find(".ui-btn").not(".ui-slider-handle"),i=this._initialRefresh;e.mobile.checkboxradio&&this.element.find(":mobile-checkboxradio").checkboxradio("refresh"),this._addFirstLastClasses(t,this.options.excludeInvisible?this._getVisibles(t,i):t,i),this._initialRefresh=!1}},e.mobile.behaviors.addFirstLastClasses)),e(function(){e.mobile.document.bind("pagecreate create",function(t){e.mobile.controlgroup.prototype.enhanceWithin(t.target,!0)})})}(e),function(e){e(i).bind("pagecreate create",function(t){e(t.target).find("a").jqmEnhanceable().not(".ui-btn, .ui-link-inherit, :jqmData(role='none'), :jqmData(role='nojs')").addClass("ui-link")})}(e),function(e,t){e.widget("mobile.fixedtoolbar",e.mobile.widget,{options:{visibleOnPageShow:!0,disablePageZoom:!0,transition:"slide",fullscreen:!1,tapToggle:!0,tapToggleBlacklist:"a, button, input, select, textarea, .ui-header-fixed, .ui-footer-fixed, .ui-popup, .ui-panel, .ui-panel-dismiss-open",hideDuringFocus:"input, textarea, select",updatePagePadding:!0,trackPersistentToolbars:!0,supportBlacklist:function(){return!e.support.fixedPosition},initSelector:":jqmData(position='fixed')"},_create:function(){var i=this,n=i.options,a=i.element,o=a.is(":jqmData(role='header')")?"header":"footer",s=a.closest(".ui-page");return n.supportBlacklist()?(i.destroy(),t):(a.addClass("ui-"+o+"-fixed"),n.fullscreen?(a.addClass("ui-"+o+"-fullscreen"),s.addClass("ui-page-"+o+"-fullscreen")):s.addClass("ui-page-"+o+"-fixed"),e.extend(this,{_thisPage:null}),i._addTransitionClass(),i._bindPageEvents(),i._bindToggleHandlers(),t)},_addTransitionClass:function(){var e=this.options.transition;e&&"none"!==e&&("slide"===e&&(e=this.element.is(".ui-header")?"slidedown":"slideup"),this.element.addClass(e))},_bindPageEvents:function(){this._thisPage=this.element.closest(".ui-page"),this._on(this._thisPage,{pagebeforeshow:"_handlePageBeforeShow",webkitAnimationStart:"_handleAnimationStart",animationstart:"_handleAnimationStart",updatelayout:"_handleAnimationStart",pageshow:"_handlePageShow",pagebeforehide:"_handlePageBeforeHide"})},_handlePageBeforeShow:function(){var t=this.options;t.disablePageZoom&&e.mobile.zoom.disable(!0),t.visibleOnPageShow||this.hide(!0)},_handleAnimationStart:function(){this.options.updatePagePadding&&this.updatePagePadding(this._thisPage)},_handlePageShow:function(){this.updatePagePadding(this._thisPage),this.options.updatePagePadding&&this._on(e.mobile.window,{throttledresize:"updatePagePadding"})},_handlePageBeforeHide:function(t,i){var n=this.options;if(n.disablePageZoom&&e.mobile.zoom.enable(!0),n.updatePagePadding&&this._off(e.mobile.window,"throttledresize"),n.trackPersistentToolbars){var a=e(".ui-footer-fixed:jqmData(id)",this._thisPage),o=e(".ui-header-fixed:jqmData(id)",this._thisPage),s=a.length&&i.nextPage&&e(".ui-footer-fixed:jqmData(id='"+a.jqmData("id")+"')",i.nextPage)||e(),r=o.length&&i.nextPage&&e(".ui-header-fixed:jqmData(id='"+o.jqmData("id")+"')",i.nextPage)||e();(s.length||r.length)&&(s.add(r).appendTo(e.mobile.pageContainer),i.nextPage.one("pageshow",function(){r.prependTo(this),s.appendTo(this)}))}},_visible:!0,updatePagePadding:function(i){var n=this.element,a=n.is(".ui-header"),o=parseFloat(n.css(a?"top":"bottom"));this.options.fullscreen||(i=i&&i.type===t&&i||this._thisPage||n.closest(".ui-page"),e(i).css("padding-"+(a?"top":"bottom"),n.outerHeight()+o))},_useTransition:function(t){var i=e.mobile.window,n=this.element,a=i.scrollTop(),o=n.height(),s=n.closest(".ui-page").height(),r=e.mobile.getScreenHeight(),l=n.is(":jqmData(role='header')")?"header":"footer";return!t&&(this.options.transition&&"none"!==this.options.transition&&("header"===l&&!this.options.fullscreen&&a>o||"footer"===l&&!this.options.fullscreen&&s-o>a+r)||this.options.fullscreen)},show:function(e){var t="ui-fixed-hidden",i=this.element;this._useTransition(e)?i.removeClass("out "+t).addClass("in").animationComplete(function(){i.removeClass("in")}):i.removeClass(t),this._visible=!0},hide:function(e){var t="ui-fixed-hidden",i=this.element,n="out"+("slide"===this.options.transition?" reverse":"");this._useTransition(e)?i.addClass(n).removeClass("in").animationComplete(function(){i.addClass(t).removeClass(n)}):i.addClass(t).removeClass(n),this._visible=!1},toggle:function(){this[this._visible?"hide":"show"]()},_bindToggleHandlers:function(){var t,i,n=this,a=n.options,o=n.element,s=!0;o.closest(".ui-page").bind("vclick",function(t){a.tapToggle&&!e(t.target).closest(a.tapToggleBlacklist).length&&n.toggle()}).bind("focusin focusout",function(o){1025>screen.width&&e(o.target).is(a.hideDuringFocus)&&!e(o.target).closest(".ui-header-fixed, .ui-footer-fixed").length&&("focusout"!==o.type||s?"focusin"===o.type&&s&&(clearTimeout(t),s=!1,i=setTimeout(function(){n.hide()},0)):(s=!0,clearTimeout(i),t=setTimeout(function(){n.show()},0)))})},_destroy:function(){var e=this.element,t=e.is(".ui-header");e.closest(".ui-page").css("padding-"+(t?"top":"bottom"),""),e.removeClass("ui-header-fixed ui-footer-fixed ui-header-fullscreen ui-footer-fullscreen in out fade slidedown slideup ui-fixed-hidden"),e.closest(".ui-page").removeClass("ui-page-header-fixed ui-page-footer-fixed ui-page-header-fullscreen ui-page-footer-fullscreen")}}),e.mobile.document.bind("pagecreate create",function(t){e(t.target).jqmData("fullscreen")&&e(e.mobile.fixedtoolbar.prototype.options.initSelector,t.target).not(":jqmData(fullscreen)").jqmData("fullscreen",!0),e.mobile.fixedtoolbar.prototype.enhanceWithin(t.target)})}(e),function(e){e.widget("mobile.fixedtoolbar",e.mobile.fixedtoolbar,{_create:function(){this._super(),this._workarounds()},_workarounds:function(){var e=navigator.userAgent,t=navigator.platform,i=e.match(/AppleWebKit\/([0-9]+)/),n=!!i&&i[1],a=null,o=this;if(t.indexOf("iPhone")>-1||t.indexOf("iPad")>-1||t.indexOf("iPod")>-1)a="ios";else{if(!(e.indexOf("Android")>-1))return;a="android"}if("ios"===a)o._bindScrollWorkaround();else{if(!("android"===a&&n&&534>n))return;o._bindScrollWorkaround(),o._bindListThumbWorkaround()}},_viewportOffset:function(){var t=this.element,i=t.is(".ui-header"),n=Math.abs(t.offset().top-e.mobile.window.scrollTop());return i||(n=Math.round(n-e.mobile.window.height()+t.outerHeight())-60),n},_bindScrollWorkaround:function(){var t=this;this._on(e.mobile.window,{scrollstop:function(){var e=t._viewportOffset();e>2&&t._visible&&t._triggerRedraw()}})},_bindListThumbWorkaround:function(){this.element.closest(".ui-page").addClass("ui-android-2x-fixed")},_triggerRedraw:function(){var t=parseFloat(e(".ui-page-active").css("padding-bottom"));
e(".ui-page-active").css("padding-bottom",t+1+"px"),setTimeout(function(){e(".ui-page-active").css("padding-bottom",t+"px")},0)},destroy:function(){this._super(),this.element.closest(".ui-page-active").removeClass("ui-android-2x-fix")}})}(e),function(e,n){e.widget("mobile.panel",e.mobile.widget,{options:{classes:{panel:"ui-panel",panelOpen:"ui-panel-open",panelClosed:"ui-panel-closed",panelFixed:"ui-panel-fixed",panelInner:"ui-panel-inner",modal:"ui-panel-dismiss",modalOpen:"ui-panel-dismiss-open",pagePanel:"ui-page-panel",pagePanelOpen:"ui-page-panel-open",contentWrap:"ui-panel-content-wrap",contentWrapOpen:"ui-panel-content-wrap-open",contentWrapClosed:"ui-panel-content-wrap-closed",contentFixedToolbar:"ui-panel-content-fixed-toolbar",contentFixedToolbarOpen:"ui-panel-content-fixed-toolbar-open",contentFixedToolbarClosed:"ui-panel-content-fixed-toolbar-closed",animate:"ui-panel-animate"},animate:!0,theme:"c",position:"left",dismissible:!0,display:"reveal",initSelector:":jqmData(role='panel')",swipeClose:!0,positionFixed:!1},_panelID:null,_closeLink:null,_page:null,_modal:null,_panelInner:null,_wrapper:null,_fixedToolbar:null,_create:function(){var t=this,i=t.element,n=i.closest(":jqmData(role='page')"),a=function(){var t=e.data(n[0],"mobilePage").options.theme,i="ui-body-"+t;return i},o=function(){var e=i.find("."+t.options.classes.panelInner);return 0===e.length&&(e=i.children().wrapAll('<div class="'+t.options.classes.panelInner+'" />').parent()),e},s=function(){var i=n.find("."+t.options.classes.contentWrap);return 0===i.length&&(i=n.children(".ui-header:not(:jqmData(position='fixed')), .ui-content:not(:jqmData(role='popup')), .ui-footer:not(:jqmData(position='fixed'))").wrapAll('<div class="'+t.options.classes.contentWrap+" "+a()+'" />').parent(),e.support.cssTransform3d&&t.options.animate&&i.addClass(t.options.classes.animate)),i},r=function(){var i=n.find("."+t.options.classes.contentFixedToolbar);return 0===i.length&&(i=n.find(".ui-header:jqmData(position='fixed'), .ui-footer:jqmData(position='fixed')").addClass(t.options.classes.contentFixedToolbar),e.support.cssTransform3d&&t.options.animate&&i.addClass(t.options.classes.animate)),i};e.extend(this,{_panelID:i.attr("id"),_closeLink:i.find(":jqmData(rel='close')"),_page:i.closest(":jqmData(role='page')"),_pageTheme:a(),_panelInner:o(),_wrapper:s(),_fixedToolbar:r()}),t._addPanelClasses(),t._wrapper.addClass(this.options.classes.contentWrapClosed),t._fixedToolbar.addClass(this.options.classes.contentFixedToolbarClosed),t._page.addClass(t.options.classes.pagePanel),e.support.cssTransform3d&&t.options.animate&&this.element.addClass(t.options.classes.animate),t._bindUpdateLayout(),t._bindCloseEvents(),t._bindLinkListeners(),t._bindPageEvents(),t.options.dismissible&&t._createModal(),t._bindSwipeEvents()},_createModal:function(){var t=this;t._modal=e("<div class='"+t.options.classes.modal+"' data-panelid='"+t._panelID+"'></div>").on("mousedown",function(){t.close()}).appendTo(this._page)},_getPosDisplayClasses:function(e){return e+"-position-"+this.options.position+" "+e+"-display-"+this.options.display},_getPanelClasses:function(){var e=this.options.classes.panel+" "+this._getPosDisplayClasses(this.options.classes.panel)+" "+this.options.classes.panelClosed;return this.options.theme&&(e+=" ui-body-"+this.options.theme),this.options.positionFixed&&(e+=" "+this.options.classes.panelFixed),e},_addPanelClasses:function(){this.element.addClass(this._getPanelClasses())},_bindCloseEvents:function(){var e=this;e._closeLink.on("click.panel",function(t){return t.preventDefault(),e.close(),!1}),e.element.on("click.panel","a:jqmData(ajax='false')",function(){e.close()})},_positionPanel:function(){var t=this,i=t._panelInner.outerHeight(),n=i>e.mobile.getScreenHeight();n||!t.options.positionFixed?(n&&(t._unfixPanel(),e.mobile.resetActivePageHeight(i)),t._scrollIntoView(i)):t._fixPanel()},_scrollIntoView:function(i){e(t).scrollTop()>i&&t.scrollTo(0,0)},_bindFixListener:function(){this._on(e(t),{throttledresize:"_positionPanel"})},_unbindFixListener:function(){this._off(e(t),"throttledresize")},_unfixPanel:function(){this.options.positionFixed&&e.support.fixedPosition&&this.element.removeClass(this.options.classes.panelFixed)},_fixPanel:function(){this.options.positionFixed&&e.support.fixedPosition&&this.element.addClass(this.options.classes.panelFixed)},_bindUpdateLayout:function(){var e=this;e.element.on("updatelayout",function(){e._open&&e._positionPanel()})},_bindLinkListeners:function(){var t=this;t._page.on("click.panel","a",function(i){if(this.href.split("#")[1]===t._panelID&&t._panelID!==n){i.preventDefault();var a=e(this);return a.hasClass("ui-link")||(a.addClass(e.mobile.activeBtnClass),t.element.one("panelopen panelclose",function(){a.removeClass(e.mobile.activeBtnClass)})),t.toggle(),!1}})},_bindSwipeEvents:function(){var e=this,t=e._modal?e.element.add(e._modal):e.element;e.options.swipeClose&&("left"===e.options.position?t.on("swipeleft.panel",function(){e.close()}):t.on("swiperight.panel",function(){e.close()}))},_bindPageEvents:function(){var e=this;e._page.on("panelbeforeopen",function(t){e._open&&t.target!==e.element[0]&&e.close()}).on("pagehide",function(){e._open&&e.close(!0)}).on("keyup.panel",function(t){27===t.keyCode&&e._open&&e.close()})},_open:!1,_contentWrapOpenClasses:null,_fixedToolbarOpenClasses:null,_modalOpenClasses:null,open:function(t){if(!this._open){var i=this,n=i.options,a=function(){i._page.off("panelclose"),i._page.jqmData("panel","open"),!t&&e.support.cssTransform3d&&n.animate?i.element.add(i._wrapper).on(i._transitionEndEvents,o):setTimeout(o,0),i.options.theme&&"overlay"!==i.options.display&&i._page.removeClass(i._pageTheme).addClass("ui-body-"+i.options.theme),i.element.removeClass(n.classes.panelClosed).addClass(n.classes.panelOpen),i._positionPanel(),i.options.theme&&"overlay"!==i.options.display&&i._wrapper.css("min-height",i._page.css("min-height")),i._contentWrapOpenClasses=i._getPosDisplayClasses(n.classes.contentWrap),i._wrapper.removeClass(n.classes.contentWrapClosed).addClass(i._contentWrapOpenClasses+" "+n.classes.contentWrapOpen),i._fixedToolbarOpenClasses=i._getPosDisplayClasses(n.classes.contentFixedToolbar),i._fixedToolbar.removeClass(n.classes.contentFixedToolbarClosed).addClass(i._fixedToolbarOpenClasses+" "+n.classes.contentFixedToolbarOpen),i._modalOpenClasses=i._getPosDisplayClasses(n.classes.modal)+" "+n.classes.modalOpen,i._modal&&i._modal.addClass(i._modalOpenClasses)},o=function(){i.element.add(i._wrapper).off(i._transitionEndEvents,o),i._page.addClass(n.classes.pagePanelOpen),i._bindFixListener(),i._trigger("open")};0>this.element.closest(".ui-page-active").length&&(t=!0),i._trigger("beforeopen"),"open"===i._page.jqmData("panel")?i._page.on("panelclose",function(){a()}):a(),i._open=!0}},close:function(t){if(this._open){var i=this.options,n=this,a=function(){!t&&e.support.cssTransform3d&&i.animate?n.element.add(n._wrapper).on(n._transitionEndEvents,o):setTimeout(o,0),n._page.removeClass(i.classes.pagePanelOpen),n.element.removeClass(i.classes.panelOpen),n._wrapper.removeClass(i.classes.contentWrapOpen),n._fixedToolbar.removeClass(i.classes.contentFixedToolbarOpen),n._modal&&n._modal.removeClass(n._modalOpenClasses)},o=function(){n.options.theme&&"overlay"!==n.options.display&&(n._page.removeClass("ui-body-"+n.options.theme).addClass(n._pageTheme),n._wrapper.css("min-height","")),n.element.add(n._wrapper).off(n._transitionEndEvents,o),n.element.addClass(i.classes.panelClosed),n._wrapper.removeClass(n._contentWrapOpenClasses).addClass(i.classes.contentWrapClosed),n._fixedToolbar.removeClass(n._fixedToolbarOpenClasses).addClass(i.classes.contentFixedToolbarClosed),n._fixPanel(),n._unbindFixListener(),e.mobile.resetActivePageHeight(),n._page.jqmRemoveData("panel"),n._trigger("close")};0>this.element.closest(".ui-page-active").length&&(t=!0),n._trigger("beforeclose"),a(),n._open=!1}},toggle:function(){this[this._open?"close":"open"]()},_transitionEndEvents:"webkitTransitionEnd oTransitionEnd otransitionend transitionend msTransitionEnd",_destroy:function(){var t=this.options.classes,i=this.options.theme,n=this.element.siblings("."+t.panel).length;n?this._open&&(this._wrapper.removeClass(t.contentWrapOpen),this._fixedToolbar.removeClass(t.contentFixedToolbarOpen),this._page.jqmRemoveData("panel"),this._page.removeClass(t.pagePanelOpen),i&&this._page.removeClass("ui-body-"+i).addClass(this._pageTheme)):(this._wrapper.children().unwrap(),this._page.find("a").unbind("panelopen panelclose"),this._page.removeClass(t.pagePanel),this._open&&(this._page.jqmRemoveData("panel"),this._page.removeClass(t.pagePanelOpen),i&&this._page.removeClass("ui-body-"+i).addClass(this._pageTheme),e.mobile.resetActivePageHeight())),this._panelInner.children().unwrap(),this.element.removeClass([this._getPanelClasses(),t.panelAnimate].join(" ")).off("swipeleft.panel swiperight.panel").off("panelbeforeopen").off("panelhide").off("keyup.panel").off("updatelayout"),this._closeLink.off("click.panel"),this._modal&&this._modal.remove(),this.element.off(this._transitionEndEvents).removeClass([t.panelUnfixed,t.panelClosed,t.panelOpen].join(" "))}}),e(i).bind("pagecreate create",function(t){e.mobile.panel.prototype.enhanceWithin(t.target)})}(e),function(e,t){e.widget("mobile.table",e.mobile.widget,{options:{classes:{table:"ui-table"},initSelector:":jqmData(role='table')"},_create:function(){var e=this;e.refresh(!0)},refresh:function(i){var n=this,a=this.element.find("thead tr");i&&this.element.addClass(this.options.classes.table),n.headers=this.element.find("tr:eq(0)").children(),n.allHeaders=n.headers.add(a.children()),a.each(function(){var o=0;e(this).children().each(function(){var s=parseInt(e(this).attr("colspan"),10),r=":nth-child("+(o+1)+")";if(e(this).jqmData("colstart",o+1),s)for(var l=0;s-1>l;l++)o++,r+=", :nth-child("+(o+1)+")";i===t&&e(this).jqmData("cells",""),e(this).jqmData("cells",n.element.find("tr").not(a.eq(0)).not(this).children(r)),o++})}),i===t&&this.element.trigger("refresh")}}),e.mobile.document.bind("pagecreate create",function(t){e.mobile.table.prototype.enhanceWithin(t.target)})}(e),function(e,t){e.mobile.table.prototype.options.mode="columntoggle",e.mobile.table.prototype.options.columnBtnTheme=null,e.mobile.table.prototype.options.columnPopupTheme=null,e.mobile.table.prototype.options.columnBtnText="Columns...",e.mobile.table.prototype.options.classes=e.extend(e.mobile.table.prototype.options.classes,{popup:"ui-table-columntoggle-popup",columnBtn:"ui-table-columntoggle-btn",priorityPrefix:"ui-table-priority-",columnToggleTable:"ui-table-columntoggle"}),e.mobile.document.delegate(":jqmData(role='table')","tablecreate refresh",function(i){var n,a,o,s,r=e(this),l=r.data("mobile-table"),d=i.type,c=l.options,h=e.mobile.ns,u=(r.attr("id")||c.classes.popup)+"-popup";"columntoggle"===c.mode&&("refresh"!==d&&(l.element.addClass(c.classes.columnToggleTable),n=e("<a href='#"+u+"' class='"+c.classes.columnBtn+"' data-"+h+"rel='popup' data-"+h+"mini='true'>"+c.columnBtnText+"</a>"),a=e("<div data-"+h+"role='popup' data-"+h+"role='fieldcontain' class='"+c.classes.popup+"' id='"+u+"'></div>"),o=e("<fieldset data-"+h+"role='controlgroup'></fieldset>")),l.headers.not("td").each(function(t){var i=e(this).jqmData("priority"),n=e(this).add(e(this).jqmData("cells"));i&&(n.addClass(c.classes.priorityPrefix+i),"refresh"!==d?e("<label><input type='checkbox' checked />"+e(this).text()+"</label>").appendTo(o).children(0).jqmData("cells",n).checkboxradio({theme:c.columnPopupTheme}):e("#"+u+" fieldset div:eq("+t+")").find("input").jqmData("cells",n))}),"refresh"!==d&&o.appendTo(a),s=o===t?e("#"+u+" fieldset"):o,"refresh"!==d&&(s.on("change","input",function(){this.checked?e(this).jqmData("cells").removeClass("ui-table-cell-hidden").addClass("ui-table-cell-visible"):e(this).jqmData("cells").removeClass("ui-table-cell-visible").addClass("ui-table-cell-hidden")}),n.insertBefore(r).buttonMarkup({theme:c.columnBtnTheme}),a.insertBefore(r).popup()),l.update=function(){s.find("input").each(function(){this.checked?(this.checked="table-cell"===e(this).jqmData("cells").eq(0).css("display"),"refresh"===d&&e(this).jqmData("cells").addClass("ui-table-cell-visible")):e(this).jqmData("cells").addClass("ui-table-cell-hidden"),e(this).checkboxradio("refresh")})},e.mobile.window.on("throttledresize",l.update),l.update())})}(e),function(e){e.mobile.table.prototype.options.mode="reflow",e.mobile.table.prototype.options.classes=e.extend(e.mobile.table.prototype.options.classes,{reflowTable:"ui-table-reflow",cellLabels:"ui-table-cell-label"}),e.mobile.document.delegate(":jqmData(role='table')","tablecreate refresh",function(t){var i=e(this),n=t.type,a=i.data("mobile-table"),o=a.options;if("reflow"===o.mode){"refresh"!==n&&a.element.addClass(o.classes.reflowTable);var s=e(a.allHeaders.get().reverse());s.each(function(){var t=e(this).jqmData("cells"),i=e(this).jqmData("colstart"),n=t.not(this).filter("thead th").length&&" ui-table-cell-label-top",a=e(this).text();if(""!==a)if(n){var s=parseInt(e(this).attr("colspan"),10),r="";s&&(r="td:nth-child("+s+"n + "+i+")"),t.filter(r).prepend("<b class='"+o.classes.cellLabels+n+"'>"+a+"</b>")}else t.prepend("<b class='"+o.classes.cellLabels+"'>"+a+"</b>")})}})}(e),function(e,t){function i(e){o=e.originalEvent,d=o.accelerationIncludingGravity,s=Math.abs(d.x),r=Math.abs(d.y),l=Math.abs(d.z),!t.orientation&&(s>7||(l>6&&8>r||8>l&&r>6)&&s>5)?c.enabled&&c.disable():c.enabled||c.enable()}e.mobile.iosorientationfixEnabled=!0;var a=navigator.userAgent;if(!(/iPhone|iPad|iPod/.test(navigator.platform)&&/OS [1-5]_[0-9_]* like Mac OS X/i.test(a)&&a.indexOf("AppleWebKit")>-1))return e.mobile.iosorientationfixEnabled=!1,n;var o,s,r,l,d,c=e.mobile.zoom;e.mobile.document.on("mobileinit",function(){e.mobile.iosorientationfixEnabled&&e.mobile.window.bind("orientationchange.iosorientationfix",c.enable).bind("devicemotion.iosorientationfix",i)})}(e,this),function(e,t){function n(){a.removeClass("ui-mobile-rendering")}var a=e("html"),o=(e("head"),e.mobile.window);e(t.document).trigger("mobileinit"),e.mobile.gradeA()&&(e.mobile.ajaxBlacklist&&(e.mobile.ajaxEnabled=!1),a.addClass("ui-mobile ui-mobile-rendering"),setTimeout(n,5e3),e.extend(e.mobile,{initializePage:function(){var t=e.mobile.path,a=e(":jqmData(role='page'), :jqmData(role='dialog')"),s=t.stripHash(t.stripQueryParams(t.parseLocation().hash)),r=i.getElementById(s);a.length||(a=e("body").wrapInner("<div data-"+e.mobile.ns+"role='page'></div>").children(0)),a.each(function(){var t=e(this);t.jqmData("url")||t.attr("data-"+e.mobile.ns+"url",t.attr("id")||location.pathname+location.search)}),e.mobile.firstPage=a.first(),e.mobile.pageContainer=e.mobile.firstPage.parent().addClass("ui-mobile-viewport"),o.trigger("pagecontainercreate"),e.mobile.showPageLoadingMsg(),n(),e.mobile.hashListeningEnabled&&e.mobile.path.isHashValid(location.hash)&&(e(r).is(':jqmData(role="page")')||e.mobile.path.isPath(s)||s===e.mobile.dialogHashKey)?e.event.special.navigate.isPushStateEnabled()?(e.mobile.navigate.history.stack=[],e.mobile.navigate(e.mobile.path.isPath(location.hash)?location.hash:location.href)):o.trigger("hashchange",[!0]):(e.mobile.path.isHashValid(location.hash)&&(e.mobile.urlHistory.initialDst=s.replace("#","")),e.event.special.navigate.isPushStateEnabled()&&e.mobile.navigate.navigator.squash(t.parseLocation().href),e.mobile.changePage(e.mobile.firstPage,{transition:"none",reverse:!0,changeHash:!1,fromHashChange:!0}))}}),e.mobile.navreadyDeferred.resolve(),e(function(){t.scrollTo(0,1),e.mobile.defaultHomeScroll=e.support.scrollTop&&1!==e.mobile.window.scrollTop()?1:0,e.mobile.autoInitializePage&&e.mobile.initializePage(),o.load(e.mobile.silentScroll),e.support.cssPointerEvents||e.mobile.document.delegate(".ui-disabled","vclick",function(e){e.preventDefault(),e.stopImmediatePropagation()})}))}(e,this)});
//@ sourceMappingURL=jquery.mobile-1.3.1.min.map
;//     Underscore.js 1.5.2
//     http://underscorejs.org
//     (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.
(function(){var n=this,t=n._,r={},e=Array.prototype,u=Object.prototype,i=Function.prototype,a=e.push,o=e.slice,c=e.concat,l=u.toString,f=u.hasOwnProperty,s=e.forEach,p=e.map,h=e.reduce,v=e.reduceRight,g=e.filter,d=e.every,m=e.some,y=e.indexOf,b=e.lastIndexOf,x=Array.isArray,w=Object.keys,_=i.bind,j=function(n){return n instanceof j?n:this instanceof j?(this._wrapped=n,void 0):new j(n)};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=j),exports._=j):n._=j,j.VERSION="1.5.2";var A=j.each=j.forEach=function(n,t,e){if(null!=n)if(s&&n.forEach===s)n.forEach(t,e);else if(n.length===+n.length){for(var u=0,i=n.length;i>u;u++)if(t.call(e,n[u],u,n)===r)return}else for(var a=j.keys(n),u=0,i=a.length;i>u;u++)if(t.call(e,n[a[u]],a[u],n)===r)return};j.map=j.collect=function(n,t,r){var e=[];return null==n?e:p&&n.map===p?n.map(t,r):(A(n,function(n,u,i){e.push(t.call(r,n,u,i))}),e)};var E="Reduce of empty array with no initial value";j.reduce=j.foldl=j.inject=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),h&&n.reduce===h)return e&&(t=j.bind(t,e)),u?n.reduce(t,r):n.reduce(t);if(A(n,function(n,i,a){u?r=t.call(e,r,n,i,a):(r=n,u=!0)}),!u)throw new TypeError(E);return r},j.reduceRight=j.foldr=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),v&&n.reduceRight===v)return e&&(t=j.bind(t,e)),u?n.reduceRight(t,r):n.reduceRight(t);var i=n.length;if(i!==+i){var a=j.keys(n);i=a.length}if(A(n,function(o,c,l){c=a?a[--i]:--i,u?r=t.call(e,r,n[c],c,l):(r=n[c],u=!0)}),!u)throw new TypeError(E);return r},j.find=j.detect=function(n,t,r){var e;return O(n,function(n,u,i){return t.call(r,n,u,i)?(e=n,!0):void 0}),e},j.filter=j.select=function(n,t,r){var e=[];return null==n?e:g&&n.filter===g?n.filter(t,r):(A(n,function(n,u,i){t.call(r,n,u,i)&&e.push(n)}),e)},j.reject=function(n,t,r){return j.filter(n,function(n,e,u){return!t.call(r,n,e,u)},r)},j.every=j.all=function(n,t,e){t||(t=j.identity);var u=!0;return null==n?u:d&&n.every===d?n.every(t,e):(A(n,function(n,i,a){return(u=u&&t.call(e,n,i,a))?void 0:r}),!!u)};var O=j.some=j.any=function(n,t,e){t||(t=j.identity);var u=!1;return null==n?u:m&&n.some===m?n.some(t,e):(A(n,function(n,i,a){return u||(u=t.call(e,n,i,a))?r:void 0}),!!u)};j.contains=j.include=function(n,t){return null==n?!1:y&&n.indexOf===y?n.indexOf(t)!=-1:O(n,function(n){return n===t})},j.invoke=function(n,t){var r=o.call(arguments,2),e=j.isFunction(t);return j.map(n,function(n){return(e?t:n[t]).apply(n,r)})},j.pluck=function(n,t){return j.map(n,function(n){return n[t]})},j.where=function(n,t,r){return j.isEmpty(t)?r?void 0:[]:j[r?"find":"filter"](n,function(n){for(var r in t)if(t[r]!==n[r])return!1;return!0})},j.findWhere=function(n,t){return j.where(n,t,!0)},j.max=function(n,t,r){if(!t&&j.isArray(n)&&n[0]===+n[0]&&n.length<65535)return Math.max.apply(Math,n);if(!t&&j.isEmpty(n))return-1/0;var e={computed:-1/0,value:-1/0};return A(n,function(n,u,i){var a=t?t.call(r,n,u,i):n;a>e.computed&&(e={value:n,computed:a})}),e.value},j.min=function(n,t,r){if(!t&&j.isArray(n)&&n[0]===+n[0]&&n.length<65535)return Math.min.apply(Math,n);if(!t&&j.isEmpty(n))return 1/0;var e={computed:1/0,value:1/0};return A(n,function(n,u,i){var a=t?t.call(r,n,u,i):n;a<e.computed&&(e={value:n,computed:a})}),e.value},j.shuffle=function(n){var t,r=0,e=[];return A(n,function(n){t=j.random(r++),e[r-1]=e[t],e[t]=n}),e},j.sample=function(n,t,r){return arguments.length<2||r?n[j.random(n.length-1)]:j.shuffle(n).slice(0,Math.max(0,t))};var k=function(n){return j.isFunction(n)?n:function(t){return t[n]}};j.sortBy=function(n,t,r){var e=k(t);return j.pluck(j.map(n,function(n,t,u){return{value:n,index:t,criteria:e.call(r,n,t,u)}}).sort(function(n,t){var r=n.criteria,e=t.criteria;if(r!==e){if(r>e||r===void 0)return 1;if(e>r||e===void 0)return-1}return n.index-t.index}),"value")};var F=function(n){return function(t,r,e){var u={},i=null==r?j.identity:k(r);return A(t,function(r,a){var o=i.call(e,r,a,t);n(u,o,r)}),u}};j.groupBy=F(function(n,t,r){(j.has(n,t)?n[t]:n[t]=[]).push(r)}),j.indexBy=F(function(n,t,r){n[t]=r}),j.countBy=F(function(n,t){j.has(n,t)?n[t]++:n[t]=1}),j.sortedIndex=function(n,t,r,e){r=null==r?j.identity:k(r);for(var u=r.call(e,t),i=0,a=n.length;a>i;){var o=i+a>>>1;r.call(e,n[o])<u?i=o+1:a=o}return i},j.toArray=function(n){return n?j.isArray(n)?o.call(n):n.length===+n.length?j.map(n,j.identity):j.values(n):[]},j.size=function(n){return null==n?0:n.length===+n.length?n.length:j.keys(n).length},j.first=j.head=j.take=function(n,t,r){return null==n?void 0:null==t||r?n[0]:o.call(n,0,t)},j.initial=function(n,t,r){return o.call(n,0,n.length-(null==t||r?1:t))},j.last=function(n,t,r){return null==n?void 0:null==t||r?n[n.length-1]:o.call(n,Math.max(n.length-t,0))},j.rest=j.tail=j.drop=function(n,t,r){return o.call(n,null==t||r?1:t)},j.compact=function(n){return j.filter(n,j.identity)};var M=function(n,t,r){return t&&j.every(n,j.isArray)?c.apply(r,n):(A(n,function(n){j.isArray(n)||j.isArguments(n)?t?a.apply(r,n):M(n,t,r):r.push(n)}),r)};j.flatten=function(n,t){return M(n,t,[])},j.without=function(n){return j.difference(n,o.call(arguments,1))},j.uniq=j.unique=function(n,t,r,e){j.isFunction(t)&&(e=r,r=t,t=!1);var u=r?j.map(n,r,e):n,i=[],a=[];return A(u,function(r,e){(t?e&&a[a.length-1]===r:j.contains(a,r))||(a.push(r),i.push(n[e]))}),i},j.union=function(){return j.uniq(j.flatten(arguments,!0))},j.intersection=function(n){var t=o.call(arguments,1);return j.filter(j.uniq(n),function(n){return j.every(t,function(t){return j.indexOf(t,n)>=0})})},j.difference=function(n){var t=c.apply(e,o.call(arguments,1));return j.filter(n,function(n){return!j.contains(t,n)})},j.zip=function(){for(var n=j.max(j.pluck(arguments,"length").concat(0)),t=new Array(n),r=0;n>r;r++)t[r]=j.pluck(arguments,""+r);return t},j.object=function(n,t){if(null==n)return{};for(var r={},e=0,u=n.length;u>e;e++)t?r[n[e]]=t[e]:r[n[e][0]]=n[e][1];return r},j.indexOf=function(n,t,r){if(null==n)return-1;var e=0,u=n.length;if(r){if("number"!=typeof r)return e=j.sortedIndex(n,t),n[e]===t?e:-1;e=0>r?Math.max(0,u+r):r}if(y&&n.indexOf===y)return n.indexOf(t,r);for(;u>e;e++)if(n[e]===t)return e;return-1},j.lastIndexOf=function(n,t,r){if(null==n)return-1;var e=null!=r;if(b&&n.lastIndexOf===b)return e?n.lastIndexOf(t,r):n.lastIndexOf(t);for(var u=e?r:n.length;u--;)if(n[u]===t)return u;return-1},j.range=function(n,t,r){arguments.length<=1&&(t=n||0,n=0),r=arguments[2]||1;for(var e=Math.max(Math.ceil((t-n)/r),0),u=0,i=new Array(e);e>u;)i[u++]=n,n+=r;return i};var R=function(){};j.bind=function(n,t){var r,e;if(_&&n.bind===_)return _.apply(n,o.call(arguments,1));if(!j.isFunction(n))throw new TypeError;return r=o.call(arguments,2),e=function(){if(!(this instanceof e))return n.apply(t,r.concat(o.call(arguments)));R.prototype=n.prototype;var u=new R;R.prototype=null;var i=n.apply(u,r.concat(o.call(arguments)));return Object(i)===i?i:u}},j.partial=function(n){var t=o.call(arguments,1);return function(){return n.apply(this,t.concat(o.call(arguments)))}},j.bindAll=function(n){var t=o.call(arguments,1);if(0===t.length)throw new Error("bindAll must be passed function names");return A(t,function(t){n[t]=j.bind(n[t],n)}),n},j.memoize=function(n,t){var r={};return t||(t=j.identity),function(){var e=t.apply(this,arguments);return j.has(r,e)?r[e]:r[e]=n.apply(this,arguments)}},j.delay=function(n,t){var r=o.call(arguments,2);return setTimeout(function(){return n.apply(null,r)},t)},j.defer=function(n){return j.delay.apply(j,[n,1].concat(o.call(arguments,1)))},j.throttle=function(n,t,r){var e,u,i,a=null,o=0;r||(r={});var c=function(){o=r.leading===!1?0:new Date,a=null,i=n.apply(e,u)};return function(){var l=new Date;o||r.leading!==!1||(o=l);var f=t-(l-o);return e=this,u=arguments,0>=f?(clearTimeout(a),a=null,o=l,i=n.apply(e,u)):a||r.trailing===!1||(a=setTimeout(c,f)),i}},j.debounce=function(n,t,r){var e,u,i,a,o;return function(){i=this,u=arguments,a=new Date;var c=function(){var l=new Date-a;t>l?e=setTimeout(c,t-l):(e=null,r||(o=n.apply(i,u)))},l=r&&!e;return e||(e=setTimeout(c,t)),l&&(o=n.apply(i,u)),o}},j.once=function(n){var t,r=!1;return function(){return r?t:(r=!0,t=n.apply(this,arguments),n=null,t)}},j.wrap=function(n,t){return function(){var r=[n];return a.apply(r,arguments),t.apply(this,r)}},j.compose=function(){var n=arguments;return function(){for(var t=arguments,r=n.length-1;r>=0;r--)t=[n[r].apply(this,t)];return t[0]}},j.after=function(n,t){return function(){return--n<1?t.apply(this,arguments):void 0}},j.keys=w||function(n){if(n!==Object(n))throw new TypeError("Invalid object");var t=[];for(var r in n)j.has(n,r)&&t.push(r);return t},j.values=function(n){for(var t=j.keys(n),r=t.length,e=new Array(r),u=0;r>u;u++)e[u]=n[t[u]];return e},j.pairs=function(n){for(var t=j.keys(n),r=t.length,e=new Array(r),u=0;r>u;u++)e[u]=[t[u],n[t[u]]];return e},j.invert=function(n){for(var t={},r=j.keys(n),e=0,u=r.length;u>e;e++)t[n[r[e]]]=r[e];return t},j.functions=j.methods=function(n){var t=[];for(var r in n)j.isFunction(n[r])&&t.push(r);return t.sort()},j.extend=function(n){return A(o.call(arguments,1),function(t){if(t)for(var r in t)n[r]=t[r]}),n},j.pick=function(n){var t={},r=c.apply(e,o.call(arguments,1));return A(r,function(r){r in n&&(t[r]=n[r])}),t},j.omit=function(n){var t={},r=c.apply(e,o.call(arguments,1));for(var u in n)j.contains(r,u)||(t[u]=n[u]);return t},j.defaults=function(n){return A(o.call(arguments,1),function(t){if(t)for(var r in t)n[r]===void 0&&(n[r]=t[r])}),n},j.clone=function(n){return j.isObject(n)?j.isArray(n)?n.slice():j.extend({},n):n},j.tap=function(n,t){return t(n),n};var S=function(n,t,r,e){if(n===t)return 0!==n||1/n==1/t;if(null==n||null==t)return n===t;n instanceof j&&(n=n._wrapped),t instanceof j&&(t=t._wrapped);var u=l.call(n);if(u!=l.call(t))return!1;switch(u){case"[object String]":return n==String(t);case"[object Number]":return n!=+n?t!=+t:0==n?1/n==1/t:n==+t;case"[object Date]":case"[object Boolean]":return+n==+t;case"[object RegExp]":return n.source==t.source&&n.global==t.global&&n.multiline==t.multiline&&n.ignoreCase==t.ignoreCase}if("object"!=typeof n||"object"!=typeof t)return!1;for(var i=r.length;i--;)if(r[i]==n)return e[i]==t;var a=n.constructor,o=t.constructor;if(a!==o&&!(j.isFunction(a)&&a instanceof a&&j.isFunction(o)&&o instanceof o))return!1;r.push(n),e.push(t);var c=0,f=!0;if("[object Array]"==u){if(c=n.length,f=c==t.length)for(;c--&&(f=S(n[c],t[c],r,e)););}else{for(var s in n)if(j.has(n,s)&&(c++,!(f=j.has(t,s)&&S(n[s],t[s],r,e))))break;if(f){for(s in t)if(j.has(t,s)&&!c--)break;f=!c}}return r.pop(),e.pop(),f};j.isEqual=function(n,t){return S(n,t,[],[])},j.isEmpty=function(n){if(null==n)return!0;if(j.isArray(n)||j.isString(n))return 0===n.length;for(var t in n)if(j.has(n,t))return!1;return!0},j.isElement=function(n){return!(!n||1!==n.nodeType)},j.isArray=x||function(n){return"[object Array]"==l.call(n)},j.isObject=function(n){return n===Object(n)},A(["Arguments","Function","String","Number","Date","RegExp"],function(n){j["is"+n]=function(t){return l.call(t)=="[object "+n+"]"}}),j.isArguments(arguments)||(j.isArguments=function(n){return!(!n||!j.has(n,"callee"))}),"function"!=typeof/./&&(j.isFunction=function(n){return"function"==typeof n}),j.isFinite=function(n){return isFinite(n)&&!isNaN(parseFloat(n))},j.isNaN=function(n){return j.isNumber(n)&&n!=+n},j.isBoolean=function(n){return n===!0||n===!1||"[object Boolean]"==l.call(n)},j.isNull=function(n){return null===n},j.isUndefined=function(n){return n===void 0},j.has=function(n,t){return f.call(n,t)},j.noConflict=function(){return n._=t,this},j.identity=function(n){return n},j.times=function(n,t,r){for(var e=Array(Math.max(0,n)),u=0;n>u;u++)e[u]=t.call(r,u);return e},j.random=function(n,t){return null==t&&(t=n,n=0),n+Math.floor(Math.random()*(t-n+1))};var I={escape:{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;"}};I.unescape=j.invert(I.escape);var T={escape:new RegExp("["+j.keys(I.escape).join("")+"]","g"),unescape:new RegExp("("+j.keys(I.unescape).join("|")+")","g")};j.each(["escape","unescape"],function(n){j[n]=function(t){return null==t?"":(""+t).replace(T[n],function(t){return I[n][t]})}}),j.result=function(n,t){if(null==n)return void 0;var r=n[t];return j.isFunction(r)?r.call(n):r},j.mixin=function(n){A(j.functions(n),function(t){var r=j[t]=n[t];j.prototype[t]=function(){var n=[this._wrapped];return a.apply(n,arguments),z.call(this,r.apply(j,n))}})};var N=0;j.uniqueId=function(n){var t=++N+"";return n?n+t:t},j.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var q=/(.)^/,B={"'":"'","\\":"\\","\r":"r","\n":"n","	":"t","\u2028":"u2028","\u2029":"u2029"},D=/\\|'|\r|\n|\t|\u2028|\u2029/g;j.template=function(n,t,r){var e;r=j.defaults({},r,j.templateSettings);var u=new RegExp([(r.escape||q).source,(r.interpolate||q).source,(r.evaluate||q).source].join("|")+"|$","g"),i=0,a="__p+='";n.replace(u,function(t,r,e,u,o){return a+=n.slice(i,o).replace(D,function(n){return"\\"+B[n]}),r&&(a+="'+\n((__t=("+r+"))==null?'':_.escape(__t))+\n'"),e&&(a+="'+\n((__t=("+e+"))==null?'':__t)+\n'"),u&&(a+="';\n"+u+"\n__p+='"),i=o+t.length,t}),a+="';\n",r.variable||(a="with(obj||{}){\n"+a+"}\n"),a="var __t,__p='',__j=Array.prototype.join,"+"print=function(){__p+=__j.call(arguments,'');};\n"+a+"return __p;\n";try{e=new Function(r.variable||"obj","_",a)}catch(o){throw o.source=a,o}if(t)return e(t,j);var c=function(n){return e.call(this,n,j)};return c.source="function("+(r.variable||"obj")+"){\n"+a+"}",c},j.chain=function(n){return j(n).chain()};var z=function(n){return this._chain?j(n).chain():n};j.mixin(j),A(["pop","push","reverse","shift","sort","splice","unshift"],function(n){var t=e[n];j.prototype[n]=function(){var r=this._wrapped;return t.apply(r,arguments),"shift"!=n&&"splice"!=n||0!==r.length||delete r[0],z.call(this,r)}}),A(["concat","join","slice"],function(n){var t=e[n];j.prototype[n]=function(){return z.call(this,t.apply(this._wrapped,arguments))}}),j.extend(j.prototype,{chain:function(){return this._chain=!0,this},value:function(){return this._wrapped}})}).call(this);
//# sourceMappingURL=underscore-min.map
;/*
    json2.js
    2011-10-19

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, regexp: true */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

var JSON;
if (!JSON) {
    JSON = {};
}

(function () {
    'use strict';

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear()     + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate())      + 'T' +
                    f(this.getUTCHours())     + ':' +
                    f(this.getUTCMinutes())   + ':' +
                    f(this.getUTCSeconds())   + 'Z'
                : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                    ? '[]'
                    : gap
                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                    : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0
                ? '{}'
                : gap
                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());

;(function(){var t=this;var e=t.Backbone;var i=[];var r=i.push;var s=i.slice;var n=i.splice;var a;if(typeof exports!=="undefined"){a=exports}else{a=t.Backbone={}}a.VERSION="1.1.0";var h=t._;if(!h&&typeof require!=="undefined")h=require("underscore");a.$=t.jQuery||t.Zepto||t.ender||t.$;a.noConflict=function(){t.Backbone=e;return this};a.emulateHTTP=false;a.emulateJSON=false;var o=a.Events={on:function(t,e,i){if(!l(this,"on",t,[e,i])||!e)return this;this._events||(this._events={});var r=this._events[t]||(this._events[t]=[]);r.push({callback:e,context:i,ctx:i||this});return this},once:function(t,e,i){if(!l(this,"once",t,[e,i])||!e)return this;var r=this;var s=h.once(function(){r.off(t,s);e.apply(this,arguments)});s._callback=e;return this.on(t,s,i)},off:function(t,e,i){var r,s,n,a,o,u,c,f;if(!this._events||!l(this,"off",t,[e,i]))return this;if(!t&&!e&&!i){this._events={};return this}a=t?[t]:h.keys(this._events);for(o=0,u=a.length;o<u;o++){t=a[o];if(n=this._events[t]){this._events[t]=r=[];if(e||i){for(c=0,f=n.length;c<f;c++){s=n[c];if(e&&e!==s.callback&&e!==s.callback._callback||i&&i!==s.context){r.push(s)}}}if(!r.length)delete this._events[t]}}return this},trigger:function(t){if(!this._events)return this;var e=s.call(arguments,1);if(!l(this,"trigger",t,e))return this;var i=this._events[t];var r=this._events.all;if(i)c(i,e);if(r)c(r,arguments);return this},stopListening:function(t,e,i){var r=this._listeningTo;if(!r)return this;var s=!e&&!i;if(!i&&typeof e==="object")i=this;if(t)(r={})[t._listenId]=t;for(var n in r){t=r[n];t.off(e,i,this);if(s||h.isEmpty(t._events))delete this._listeningTo[n]}return this}};var u=/\s+/;var l=function(t,e,i,r){if(!i)return true;if(typeof i==="object"){for(var s in i){t[e].apply(t,[s,i[s]].concat(r))}return false}if(u.test(i)){var n=i.split(u);for(var a=0,h=n.length;a<h;a++){t[e].apply(t,[n[a]].concat(r))}return false}return true};var c=function(t,e){var i,r=-1,s=t.length,n=e[0],a=e[1],h=e[2];switch(e.length){case 0:while(++r<s)(i=t[r]).callback.call(i.ctx);return;case 1:while(++r<s)(i=t[r]).callback.call(i.ctx,n);return;case 2:while(++r<s)(i=t[r]).callback.call(i.ctx,n,a);return;case 3:while(++r<s)(i=t[r]).callback.call(i.ctx,n,a,h);return;default:while(++r<s)(i=t[r]).callback.apply(i.ctx,e)}};var f={listenTo:"on",listenToOnce:"once"};h.each(f,function(t,e){o[e]=function(e,i,r){var s=this._listeningTo||(this._listeningTo={});var n=e._listenId||(e._listenId=h.uniqueId("l"));s[n]=e;if(!r&&typeof i==="object")r=this;e[t](i,r,this);return this}});o.bind=o.on;o.unbind=o.off;h.extend(a,o);var d=a.Model=function(t,e){var i=t||{};e||(e={});this.cid=h.uniqueId("c");this.attributes={};if(e.collection)this.collection=e.collection;if(e.parse)i=this.parse(i,e)||{};i=h.defaults({},i,h.result(this,"defaults"));this.set(i,e);this.changed={};this.initialize.apply(this,arguments)};h.extend(d.prototype,o,{changed:null,validationError:null,idAttribute:"id",initialize:function(){},toJSON:function(t){return h.clone(this.attributes)},sync:function(){return a.sync.apply(this,arguments)},get:function(t){return this.attributes[t]},escape:function(t){return h.escape(this.get(t))},has:function(t){return this.get(t)!=null},set:function(t,e,i){var r,s,n,a,o,u,l,c;if(t==null)return this;if(typeof t==="object"){s=t;i=e}else{(s={})[t]=e}i||(i={});if(!this._validate(s,i))return false;n=i.unset;o=i.silent;a=[];u=this._changing;this._changing=true;if(!u){this._previousAttributes=h.clone(this.attributes);this.changed={}}c=this.attributes,l=this._previousAttributes;if(this.idAttribute in s)this.id=s[this.idAttribute];for(r in s){e=s[r];if(!h.isEqual(c[r],e))a.push(r);if(!h.isEqual(l[r],e)){this.changed[r]=e}else{delete this.changed[r]}n?delete c[r]:c[r]=e}if(!o){if(a.length)this._pending=true;for(var f=0,d=a.length;f<d;f++){this.trigger("change:"+a[f],this,c[a[f]],i)}}if(u)return this;if(!o){while(this._pending){this._pending=false;this.trigger("change",this,i)}}this._pending=false;this._changing=false;return this},unset:function(t,e){return this.set(t,void 0,h.extend({},e,{unset:true}))},clear:function(t){var e={};for(var i in this.attributes)e[i]=void 0;return this.set(e,h.extend({},t,{unset:true}))},hasChanged:function(t){if(t==null)return!h.isEmpty(this.changed);return h.has(this.changed,t)},changedAttributes:function(t){if(!t)return this.hasChanged()?h.clone(this.changed):false;var e,i=false;var r=this._changing?this._previousAttributes:this.attributes;for(var s in t){if(h.isEqual(r[s],e=t[s]))continue;(i||(i={}))[s]=e}return i},previous:function(t){if(t==null||!this._previousAttributes)return null;return this._previousAttributes[t]},previousAttributes:function(){return h.clone(this._previousAttributes)},fetch:function(t){t=t?h.clone(t):{};if(t.parse===void 0)t.parse=true;var e=this;var i=t.success;t.success=function(r){if(!e.set(e.parse(r,t),t))return false;if(i)i(e,r,t);e.trigger("sync",e,r,t)};M(this,t);return this.sync("read",this,t)},save:function(t,e,i){var r,s,n,a=this.attributes;if(t==null||typeof t==="object"){r=t;i=e}else{(r={})[t]=e}i=h.extend({validate:true},i);if(r&&!i.wait){if(!this.set(r,i))return false}else{if(!this._validate(r,i))return false}if(r&&i.wait){this.attributes=h.extend({},a,r)}if(i.parse===void 0)i.parse=true;var o=this;var u=i.success;i.success=function(t){o.attributes=a;var e=o.parse(t,i);if(i.wait)e=h.extend(r||{},e);if(h.isObject(e)&&!o.set(e,i)){return false}if(u)u(o,t,i);o.trigger("sync",o,t,i)};M(this,i);s=this.isNew()?"create":i.patch?"patch":"update";if(s==="patch")i.attrs=r;n=this.sync(s,this,i);if(r&&i.wait)this.attributes=a;return n},destroy:function(t){t=t?h.clone(t):{};var e=this;var i=t.success;var r=function(){e.trigger("destroy",e,e.collection,t)};t.success=function(s){if(t.wait||e.isNew())r();if(i)i(e,s,t);if(!e.isNew())e.trigger("sync",e,s,t)};if(this.isNew()){t.success();return false}M(this,t);var s=this.sync("delete",this,t);if(!t.wait)r();return s},url:function(){var t=h.result(this,"urlRoot")||h.result(this.collection,"url")||U();if(this.isNew())return t;return t+(t.charAt(t.length-1)==="/"?"":"/")+encodeURIComponent(this.id)},parse:function(t,e){return t},clone:function(){return new this.constructor(this.attributes)},isNew:function(){return this.id==null},isValid:function(t){return this._validate({},h.extend(t||{},{validate:true}))},_validate:function(t,e){if(!e.validate||!this.validate)return true;t=h.extend({},this.attributes,t);var i=this.validationError=this.validate(t,e)||null;if(!i)return true;this.trigger("invalid",this,i,h.extend(e,{validationError:i}));return false}});var p=["keys","values","pairs","invert","pick","omit"];h.each(p,function(t){d.prototype[t]=function(){var e=s.call(arguments);e.unshift(this.attributes);return h[t].apply(h,e)}});var v=a.Collection=function(t,e){e||(e={});if(e.model)this.model=e.model;if(e.comparator!==void 0)this.comparator=e.comparator;this._reset();this.initialize.apply(this,arguments);if(t)this.reset(t,h.extend({silent:true},e))};var g={add:true,remove:true,merge:true};var m={add:true,remove:false};h.extend(v.prototype,o,{model:d,initialize:function(){},toJSON:function(t){return this.map(function(e){return e.toJSON(t)})},sync:function(){return a.sync.apply(this,arguments)},add:function(t,e){return this.set(t,h.extend({merge:false},e,m))},remove:function(t,e){var i=!h.isArray(t);t=i?[t]:h.clone(t);e||(e={});var r,s,n,a;for(r=0,s=t.length;r<s;r++){a=t[r]=this.get(t[r]);if(!a)continue;delete this._byId[a.id];delete this._byId[a.cid];n=this.indexOf(a);this.models.splice(n,1);this.length--;if(!e.silent){e.index=n;a.trigger("remove",a,this,e)}this._removeReference(a)}return i?t[0]:t},set:function(t,e){e=h.defaults({},e,g);if(e.parse)t=this.parse(t,e);var i=!h.isArray(t);t=i?t?[t]:[]:h.clone(t);var r,s,n,a,o,u,l;var c=e.at;var f=this.model;var p=this.comparator&&c==null&&e.sort!==false;var v=h.isString(this.comparator)?this.comparator:null;var m=[],y=[],_={};var w=e.add,b=e.merge,x=e.remove;var E=!p&&w&&x?[]:false;for(r=0,s=t.length;r<s;r++){o=t[r];if(o instanceof d){n=a=o}else{n=o[f.prototype.idAttribute]}if(u=this.get(n)){if(x)_[u.cid]=true;if(b){o=o===a?a.attributes:o;if(e.parse)o=u.parse(o,e);u.set(o,e);if(p&&!l&&u.hasChanged(v))l=true}t[r]=u}else if(w){a=t[r]=this._prepareModel(o,e);if(!a)continue;m.push(a);a.on("all",this._onModelEvent,this);this._byId[a.cid]=a;if(a.id!=null)this._byId[a.id]=a}if(E)E.push(u||a)}if(x){for(r=0,s=this.length;r<s;++r){if(!_[(a=this.models[r]).cid])y.push(a)}if(y.length)this.remove(y,e)}if(m.length||E&&E.length){if(p)l=true;this.length+=m.length;if(c!=null){for(r=0,s=m.length;r<s;r++){this.models.splice(c+r,0,m[r])}}else{if(E)this.models.length=0;var T=E||m;for(r=0,s=T.length;r<s;r++){this.models.push(T[r])}}}if(l)this.sort({silent:true});if(!e.silent){for(r=0,s=m.length;r<s;r++){(a=m[r]).trigger("add",a,this,e)}if(l||E&&E.length)this.trigger("sort",this,e)}return i?t[0]:t},reset:function(t,e){e||(e={});for(var i=0,r=this.models.length;i<r;i++){this._removeReference(this.models[i])}e.previousModels=this.models;this._reset();t=this.add(t,h.extend({silent:true},e));if(!e.silent)this.trigger("reset",this,e);return t},push:function(t,e){return this.add(t,h.extend({at:this.length},e))},pop:function(t){var e=this.at(this.length-1);this.remove(e,t);return e},unshift:function(t,e){return this.add(t,h.extend({at:0},e))},shift:function(t){var e=this.at(0);this.remove(e,t);return e},slice:function(){return s.apply(this.models,arguments)},get:function(t){if(t==null)return void 0;return this._byId[t.id]||this._byId[t.cid]||this._byId[t]},at:function(t){return this.models[t]},where:function(t,e){if(h.isEmpty(t))return e?void 0:[];return this[e?"find":"filter"](function(e){for(var i in t){if(t[i]!==e.get(i))return false}return true})},findWhere:function(t){return this.where(t,true)},sort:function(t){if(!this.comparator)throw new Error("Cannot sort a set without a comparator");t||(t={});if(h.isString(this.comparator)||this.comparator.length===1){this.models=this.sortBy(this.comparator,this)}else{this.models.sort(h.bind(this.comparator,this))}if(!t.silent)this.trigger("sort",this,t);return this},pluck:function(t){return h.invoke(this.models,"get",t)},fetch:function(t){t=t?h.clone(t):{};if(t.parse===void 0)t.parse=true;var e=t.success;var i=this;t.success=function(r){var s=t.reset?"reset":"set";i[s](r,t);if(e)e(i,r,t);i.trigger("sync",i,r,t)};M(this,t);return this.sync("read",this,t)},create:function(t,e){e=e?h.clone(e):{};if(!(t=this._prepareModel(t,e)))return false;if(!e.wait)this.add(t,e);var i=this;var r=e.success;e.success=function(t,e,s){if(s.wait)i.add(t,s);if(r)r(t,e,s)};t.save(null,e);return t},parse:function(t,e){return t},clone:function(){return new this.constructor(this.models)},_reset:function(){this.length=0;this.models=[];this._byId={}},_prepareModel:function(t,e){if(t instanceof d){if(!t.collection)t.collection=this;return t}e=e?h.clone(e):{};e.collection=this;var i=new this.model(t,e);if(!i.validationError)return i;this.trigger("invalid",this,i.validationError,e);return false},_removeReference:function(t){if(this===t.collection)delete t.collection;t.off("all",this._onModelEvent,this)},_onModelEvent:function(t,e,i,r){if((t==="add"||t==="remove")&&i!==this)return;if(t==="destroy")this.remove(e,r);if(e&&t==="change:"+e.idAttribute){delete this._byId[e.previous(e.idAttribute)];if(e.id!=null)this._byId[e.id]=e}this.trigger.apply(this,arguments)}});var y=["forEach","each","map","collect","reduce","foldl","inject","reduceRight","foldr","find","detect","filter","select","reject","every","all","some","any","include","contains","invoke","max","min","toArray","size","first","head","take","initial","rest","tail","drop","last","without","difference","indexOf","shuffle","lastIndexOf","isEmpty","chain"];h.each(y,function(t){v.prototype[t]=function(){var e=s.call(arguments);e.unshift(this.models);return h[t].apply(h,e)}});var _=["groupBy","countBy","sortBy"];h.each(_,function(t){v.prototype[t]=function(e,i){var r=h.isFunction(e)?e:function(t){return t.get(e)};return h[t](this.models,r,i)}});var w=a.View=function(t){this.cid=h.uniqueId("view");t||(t={});h.extend(this,h.pick(t,x));this._ensureElement();this.initialize.apply(this,arguments);this.delegateEvents()};var b=/^(\S+)\s*(.*)$/;var x=["model","collection","el","id","attributes","className","tagName","events"];h.extend(w.prototype,o,{tagName:"div",$:function(t){return this.$el.find(t)},initialize:function(){},render:function(){return this},remove:function(){this.$el.remove();this.stopListening();return this},setElement:function(t,e){if(this.$el)this.undelegateEvents();this.$el=t instanceof a.$?t:a.$(t);this.el=this.$el[0];if(e!==false)this.delegateEvents();return this},delegateEvents:function(t){if(!(t||(t=h.result(this,"events"))))return this;this.undelegateEvents();for(var e in t){var i=t[e];if(!h.isFunction(i))i=this[t[e]];if(!i)continue;var r=e.match(b);var s=r[1],n=r[2];i=h.bind(i,this);s+=".delegateEvents"+this.cid;if(n===""){this.$el.on(s,i)}else{this.$el.on(s,n,i)}}return this},undelegateEvents:function(){this.$el.off(".delegateEvents"+this.cid);return this},_ensureElement:function(){if(!this.el){var t=h.extend({},h.result(this,"attributes"));if(this.id)t.id=h.result(this,"id");if(this.className)t["class"]=h.result(this,"className");var e=a.$("<"+h.result(this,"tagName")+">").attr(t);this.setElement(e,false)}else{this.setElement(h.result(this,"el"),false)}}});a.sync=function(t,e,i){var r=T[t];h.defaults(i||(i={}),{emulateHTTP:a.emulateHTTP,emulateJSON:a.emulateJSON});var s={type:r,dataType:"json"};if(!i.url){s.url=h.result(e,"url")||U()}if(i.data==null&&e&&(t==="create"||t==="update"||t==="patch")){s.contentType="application/json";s.data=JSON.stringify(i.attrs||e.toJSON(i))}if(i.emulateJSON){s.contentType="application/x-www-form-urlencoded";s.data=s.data?{model:s.data}:{}}if(i.emulateHTTP&&(r==="PUT"||r==="DELETE"||r==="PATCH")){s.type="POST";if(i.emulateJSON)s.data._method=r;var n=i.beforeSend;i.beforeSend=function(t){t.setRequestHeader("X-HTTP-Method-Override",r);if(n)return n.apply(this,arguments)}}if(s.type!=="GET"&&!i.emulateJSON){s.processData=false}if(s.type==="PATCH"&&E){s.xhr=function(){return new ActiveXObject("Microsoft.XMLHTTP")}}var o=i.xhr=a.ajax(h.extend(s,i));e.trigger("request",e,o,i);return o};var E=typeof window!=="undefined"&&!!window.ActiveXObject&&!(window.XMLHttpRequest&&(new XMLHttpRequest).dispatchEvent);var T={create:"POST",update:"PUT",patch:"PATCH","delete":"DELETE",read:"GET"};a.ajax=function(){return a.$.ajax.apply(a.$,arguments)};var k=a.Router=function(t){t||(t={});if(t.routes)this.routes=t.routes;this._bindRoutes();this.initialize.apply(this,arguments)};var S=/\((.*?)\)/g;var $=/(\(\?)?:\w+/g;var H=/\*\w+/g;var A=/[\-{}\[\]+?.,\\\^$|#\s]/g;h.extend(k.prototype,o,{initialize:function(){},route:function(t,e,i){if(!h.isRegExp(t))t=this._routeToRegExp(t);if(h.isFunction(e)){i=e;e=""}if(!i)i=this[e];var r=this;a.history.route(t,function(s){var n=r._extractParameters(t,s);i&&i.apply(r,n);r.trigger.apply(r,["route:"+e].concat(n));r.trigger("route",e,n);a.history.trigger("route",r,e,n)});return this},navigate:function(t,e){a.history.navigate(t,e);return this},_bindRoutes:function(){if(!this.routes)return;this.routes=h.result(this,"routes");var t,e=h.keys(this.routes);while((t=e.pop())!=null){this.route(t,this.routes[t])}},_routeToRegExp:function(t){t=t.replace(A,"\\$&").replace(S,"(?:$1)?").replace($,function(t,e){return e?t:"([^/]+)"}).replace(H,"(.*?)");return new RegExp("^"+t+"$")},_extractParameters:function(t,e){var i=t.exec(e).slice(1);return h.map(i,function(t){return t?decodeURIComponent(t):null})}});var I=a.History=function(){this.handlers=[];h.bindAll(this,"checkUrl");if(typeof window!=="undefined"){this.location=window.location;this.history=window.history}};var N=/^[#\/]|\s+$/g;var O=/^\/+|\/+$/g;var P=/msie [\w.]+/;var C=/\/$/;var j=/[?#].*$/;I.started=false;h.extend(I.prototype,o,{interval:50,getHash:function(t){var e=(t||this).location.href.match(/#(.*)$/);return e?e[1]:""},getFragment:function(t,e){if(t==null){if(this._hasPushState||!this._wantsHashChange||e){t=this.location.pathname;var i=this.root.replace(C,"");if(!t.indexOf(i))t=t.slice(i.length)}else{t=this.getHash()}}return t.replace(N,"")},start:function(t){if(I.started)throw new Error("Backbone.history has already been started");I.started=true;this.options=h.extend({root:"/"},this.options,t);this.root=this.options.root;this._wantsHashChange=this.options.hashChange!==false;this._wantsPushState=!!this.options.pushState;this._hasPushState=!!(this.options.pushState&&this.history&&this.history.pushState);var e=this.getFragment();var i=document.documentMode;var r=P.exec(navigator.userAgent.toLowerCase())&&(!i||i<=7);this.root=("/"+this.root+"/").replace(O,"/");if(r&&this._wantsHashChange){this.iframe=a.$('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo("body")[0].contentWindow;this.navigate(e)}if(this._hasPushState){a.$(window).on("popstate",this.checkUrl)}else if(this._wantsHashChange&&"onhashchange"in window&&!r){a.$(window).on("hashchange",this.checkUrl)}else if(this._wantsHashChange){this._checkUrlInterval=setInterval(this.checkUrl,this.interval)}this.fragment=e;var s=this.location;var n=s.pathname.replace(/[^\/]$/,"$&/")===this.root;if(this._wantsHashChange&&this._wantsPushState){if(!this._hasPushState&&!n){this.fragment=this.getFragment(null,true);this.location.replace(this.root+this.location.search+"#"+this.fragment);return true}else if(this._hasPushState&&n&&s.hash){this.fragment=this.getHash().replace(N,"");this.history.replaceState({},document.title,this.root+this.fragment+s.search)}}if(!this.options.silent)return this.loadUrl()},stop:function(){a.$(window).off("popstate",this.checkUrl).off("hashchange",this.checkUrl);clearInterval(this._checkUrlInterval);I.started=false},route:function(t,e){this.handlers.unshift({route:t,callback:e})},checkUrl:function(t){var e=this.getFragment();if(e===this.fragment&&this.iframe){e=this.getFragment(this.getHash(this.iframe))}if(e===this.fragment)return false;if(this.iframe)this.navigate(e);this.loadUrl()},loadUrl:function(t){t=this.fragment=this.getFragment(t);return h.any(this.handlers,function(e){if(e.route.test(t)){e.callback(t);return true}})},navigate:function(t,e){if(!I.started)return false;if(!e||e===true)e={trigger:!!e};var i=this.root+(t=this.getFragment(t||""));t=t.replace(j,"");if(this.fragment===t)return;this.fragment=t;if(t===""&&i!=="/")i=i.slice(0,-1);if(this._hasPushState){this.history[e.replace?"replaceState":"pushState"]({},document.title,i)}else if(this._wantsHashChange){this._updateHash(this.location,t,e.replace);if(this.iframe&&t!==this.getFragment(this.getHash(this.iframe))){if(!e.replace)this.iframe.document.open().close();this._updateHash(this.iframe.location,t,e.replace)}}else{return this.location.assign(i)}if(e.trigger)return this.loadUrl(t)},_updateHash:function(t,e,i){if(i){var r=t.href.replace(/(javascript:|#).*$/,"");t.replace(r+"#"+e)}else{t.hash="#"+e}}});a.history=new I;var R=function(t,e){var i=this;var r;if(t&&h.has(t,"constructor")){r=t.constructor}else{r=function(){return i.apply(this,arguments)}}h.extend(r,i,e);var s=function(){this.constructor=r};s.prototype=i.prototype;r.prototype=new s;if(t)h.extend(r.prototype,t);r.__super__=i.prototype;return r};d.extend=v.extend=k.extend=w.extend=I.extend=R;var U=function(){throw new Error('A "url" property or function must be specified')};var M=function(t,e){var i=e.error;e.error=function(r){if(i)i(t,r,e);t.trigger("error",t,r,e)}}}).call(this);
//# sourceMappingURL=backbone-min.map
;//////////////////////////////////////////////////////////////////////////////////////
//
//	Copyright 2012 Piotr Walczyszyn (http://outof.me | @pwalczyszyn)
//
//	Licensed under the Apache License, Version 2.0 (the "License");
//	you may not use this file except in compliance with the License.
//	You may obtain a copy of the License at
//
//		http://www.apache.org/licenses/LICENSE-2.0
//
//	Unless required by applicable law or agreed to in writing, software
//	distributed under the License is distributed on an "AS IS" BASIS,
//	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//	See the License for the specific language governing permissions and
//	limitations under the License.
//
//////////////////////////////////////////////////////////////////////////////////////

// BackStack version 1.1.1

(function (root, factory) {
    // Set up BackStack appropriately for the environment.
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery', 'underscore', 'Backbone'], factory);
    } else {
        // Browser globals
        root.BackStack = factory((root.jQuery || root.Zepto || root.ender), root._, root.Backbone);
    }
}(this, function ($, _, Backbone) {

/**
 * almond 0.1.1 Copyright (c) 2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var defined = {},
        waiting = {},
        config = {},
        defining = {},
        aps = [].slice,
        main, req;

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {},
            nameParts, nameSegment, mapValue, foundMap, i, j, part;

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that "directory" and not name of the baseName's
                //module. For instance, baseName of "one/two/three", maps to
                //"one/two/three.js", but we want the directory, "one/two" for
                //this normalization.
                baseParts = baseParts.slice(0, baseParts.length - 1);

                name = baseParts.concat(name.split("/"));

                //start trimDots
                for (i = 0; (part = name[i]); i++) {
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            return true;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                break;
                            }
                        }
                    }
                }

                foundMap = foundMap || starMap[nameSegment];

                if (foundMap) {
                    nameParts.splice(0, i, foundMap);
                    name = nameParts.join('/');
                    break;
                }
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            return req.apply(undef, aps.call(arguments, 0).concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (waiting.hasOwnProperty(name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!defined.hasOwnProperty(name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    function makeMap(name, relName) {
        var prefix, plugin,
            index = name.indexOf('!');

        if (index !== -1) {
            prefix = normalize(name.slice(0, index), relName);
            name = name.slice(index + 1);
            plugin = callDep(prefix);

            //Normalize according
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            p: plugin
        };
    }

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    main = function (name, deps, callback, relName) {
        var args = [],
            usingExports,
            cjsModule, depName, ret, map, i;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (typeof callback === 'function') {

            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i++) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = makeRequire(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = defined[name] = {};
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = {
                        id: name,
                        uri: '',
                        exports: defined[name],
                        config: makeConfig(name)
                    };
                } else if (defined.hasOwnProperty(depName) || waiting.hasOwnProperty(depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else if (!defining[depName]) {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback.apply(defined[name], args);

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                    cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync) {
        if (typeof deps === "string") {
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 15);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        config = cfg;
        return req;
    };

    define = function (name, deps, callback) {

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        waiting[name] = [name, deps, callback];
    };

    define.amd = {
        jQuery: true
    };
}());

define("almond", function(){});

define('effects/vendorPrefix',[], function () {

    /**
     * Helper function to detect browser vendor prefix.
     * Thanks to Lea Verou: http://lea.verou.me/2009/02/find-the-vendor-prefix-of-the-current-browser/
     * I just modified it slightly as I expect it to be used in mobile/WebKit scenarios mostly.
     */
    var vendorPrefix,
        regex = /^(Moz|Webkit|Khtml|O|ms|Icab)(?=[A-Z])/,
        someScript = document.getElementsByTagName('script')[0];

    // Exception for WebKit based browsers
    if ('WebkitOpacity' in someScript.style) {
        vendorPrefix = 'Webkit';
    } else if ('KhtmlOpacity' in someScript.style) {
        vendorPrefix = 'Khtml';
    } else {
        for (var prop in someScript.style) {
            if (regex.test(prop)) {
                // test is faster than match, so it's better to perform
                // that on the lot and match only when necessary
                vendorPrefix = prop.match(regex)[0];
                break;
            }
        }
    }

    return (vendorPrefix.toLowerCase() || '');
});
define('effects/Effect',['effects/vendorPrefix'], function (vendorPrefix) {

    var Effect = function Effect(params) {

        if (params) _.extend(this, params);

        this.vendorPrefix = vendorPrefix;

        if (this.vendorPrefix == 'moz' || this.vendorPrefix == '') this.transitionEndEvent = 'transitionend';
        else if (this.vendorPrefix == 'ms') this.transitionEndEvent = 'MSTransitionEnd';
        else this.transitionEndEvent = this.vendorPrefix + 'TransitionEnd';

    };

    // Shared empty constructor function to aid in prototype-chain creation.
    var ctor = function () {
    };

    Effect.extend = function (protoProps, staticProps) {
        var child = function () {
            Effect.apply(this, arguments);
        };

        // Inherit class (static) properties from parent.
        _.extend(child, Effect);

        // Set the prototype chain to inherit from `parent`, without calling
        // `parent`'s constructor function.
        ctor.prototype = Effect.prototype;
        child.prototype = new ctor();

        // Add prototype properties (instance properties) to the subclass,
        // if supplied.
        if (protoProps) _.extend(child.prototype, protoProps);

        // Add static properties to the constructor function, if supplied.
        if (staticProps) _.extend(child, staticProps);

        // Correctly set child's `prototype.constructor`.
        child.prototype.constructor = child;

        // Set a convenience property in case the parent's prototype is needed later.
        child.__super__ = Effect.prototype;

        return child;
    };

    return Effect;
});
define('effects/SlideEffect',['effects/Effect'], function (Effect) {

    var SlideEffect = Effect.extend({

        direction:'left',

        fromViewTransitionProps:{duration:0.25, easing:'ease-out', delay:0},

        toViewTransitionProps:{duration:0.25, easing:'ease-out', delay:0},

        play:function ($fromView, $toView, callback, context) {

            var timeout,
                that = this,
                activeTransitions = 0,
                transformParams,
                transformProp = that.vendorPrefix == '' ? 'transform' :
                    ['-' + that.vendorPrefix, '-', 'transform'].join(''),
                transitionProp = that.vendorPrefix == '' ? 'transition' :
                    ['-' + that.vendorPrefix, '-', 'transition'].join('');

            var transitionEndHandler = function (event) {
                if (activeTransitions >= 0) {
                    activeTransitions--;

                    var $target = $(event.target);
                    $target.css(transformProp, '');
                    $target.css(transitionProp, '');

                    if ($toView && $toView[0] == event.target) $toView.css('left', 0);

                    if (activeTransitions == 0 && callback) {
                        if (timeout) clearTimeout(timeout);
                        callback.call(context);
                    }
                }
            };

            if ($fromView) {
                activeTransitions++;

                $fromView.one(that.transitionEndEvent, transitionEndHandler);

                $fromView.css('left', 0);
                $fromView.css(transitionProp, [transformProp, ' ',
                                               that.fromViewTransitionProps.duration, 's ',
                                               that.fromViewTransitionProps.easing, ' ',
                                               that.fromViewTransitionProps.delay, 's'].join(''));
            }

            if ($toView) {
                activeTransitions++;

                $toView.one(that.transitionEndEvent, transitionEndHandler);

                $toView.css('left', that.direction == 'left' ? context.$el.width() : -context.$el.width());
                $toView.css(transitionProp, [transformProp, ' ',
                                             that.toViewTransitionProps.duration, 's ',
                                             that.toViewTransitionProps.easing, ' ',
                                             that.toViewTransitionProps.delay, 's'].join(''));

                // Showing the view
                $toView.css('visibility', 'visible');
            }

            if ($fromView || $toView) {
                // This is a hack to force DOM reflow before transition starts
                context.$el.css('width');

                transformParams = 'translate3d(' + (that.direction == 'left' ? -context.$el.width() : context.$el.width()) + 'px, 0, 0)';
            }

            // This is a fallback for situations when TransitionEnd event doesn't get triggered
            var transDuration = Math.max(that.fromViewTransitionProps.duration, that.toViewTransitionProps.duration) +
                Math.max(that.fromViewTransitionProps.delay, that.toViewTransitionProps.delay);

            timeout = setTimeout(function () {
                if (activeTransitions > 0) {
                    activeTransitions = -1;

                    console.log('Warning ' + that.transitionEndEvent + ' didn\'t trigger in expected time!');

                    if ($toView) {
                        $toView.off(that.transitionEndEvent, transitionEndHandler);
                        $toView.css(transitionProp, '');
                        $toView.css(transformProp, '');
                        $toView.css('left', 0);
                    }

                    if ($fromView) {
                        $fromView.off(that.transitionEndEvent, transitionEndHandler);
                        $fromView.css(transitionProp, '');
                        $fromView.css(transformProp, '');
                    }

                    callback.call(context);
                }
            }, transDuration * 1.5 * 1000);

            var $views;
            if ($fromView && $toView) $views = $fromView.add($toView);
            else if ($toView) $views = $toView;
            else if ($fromView) $views = $fromView;

            if ($views) $views.css(transformProp, transformParams);
        }
    });

    return SlideEffect;
});
define('StackNavigator',['effects/SlideEffect'], function (SlideEffect) {

    /**
     * Rendering the view and setting props required by StackNavigator.
     * @private
     * @ignore
     *
     * @param {View} view View to be rendered.
     * @param {StackNavigator} stackNavigator View StackNavigator instance.
     */
    function appendView(view, stackNavigator) {

        if (!view.__backStackRendered__) {

            // Setting ref to parent StackNavigator
            view.stackNavigator = stackNavigator;

            // Setting default destructionPolicy if it's not set
            if (typeof view.destructionPolicy === 'undefined') view.destructionPolicy = 'auto';

            // Setting default styles
            view.$el.css({position:'absolute', visibility:'hidden', overflow:'hidden', width:'100%', height:'100%'});

        } else {
            // Resetting visibility to hidden
            view.$el.css({visibility:'hidden'});
        }

        // Adding view to the DOM
        stackNavigator.$el.append(view.el);

        if (!view.__backStackRendered__) {
            // Rendering the view
            view.render.call(view);

            // Setting default of __backStackRendered__ property
            view.__backStackRendered__ = true;
        }
    }

    /**
     * Creates event objects triggered by BackStack.
     * @private
     * @ignore
     *
     * @param {string} type Event type name.
     * @param {*} args Event args.
     * @param {boolean} cancelable Flag indicating if event is cancelable.
     * @return {event} The new object.
     */
    function createEvent(type, args, cancelable) {
        return _.extend({

            type:type,

            cancelable:_.isUndefined(cancelable) ? false : cancelable,

            preventDefault:function () {
                if (this.cancelable)
                    this.isDefaultPrevented = function () {
                        return true;
                    };
            },

            isDefaultPrevented:function () {
                return false;
            },

            trigger:function (target) {
                target.trigger(this.type, this);
                return this;
            }
        }, args);
    }

    /**
     * Private common push method.
     * @private
     * @ignore
     *
     * @param {object} fromViewRef Reference to from view.
     * @param {object} toViewRef Reference to to view.
     * @param {number} replaceHowMany Number of views to replace with pushed view.
     * @param {Effect} transition Transition to played during push.
     */
    function push(fromViewRef, toViewRef, replaceHowMany, transition) {

        // Rendering view if required
        appendView(toViewRef.instance, this);

        transition = transition || this.defaultPushTransition || (this.defaultPushTransition = new SlideEffect({direction:'left'}));
        transition.play(fromViewRef ? fromViewRef.instance.$el : null, toViewRef.instance.$el,
            function () { // Callback function

                var remove = replaceHowMany > 0 ? this.viewsStack.splice(this.viewsStack.length - replaceHowMany, replaceHowMany)
                    : (fromViewRef ? [fromViewRef] : null);

                _.each(remove, function (ref) {

                    // Triggering viewDeactivate event
                    createEvent('viewDeactivate', {target:ref.instance}).trigger(ref.instance);

                    if (ref.instance.destructionPolicy == 'never') { // Detaching if destructionPolicy == 'never'
                        ref.instance.$el.detach();
                    } else { // Removing if destructionPolicy == 'auto'
                        ref.instance.remove();
                        ref.instance = null;
                    }
                }, this);

                // Adding view to the stack internal array
                this.viewsStack.push(toViewRef);

                // Setting activeView property
                this.activeView = toViewRef.instance;

                // Triggering viewActivate event
                createEvent('viewActivate', {target:toViewRef.instance}).trigger(toViewRef.instance);

                // Triggering viewChanged event
                createEvent('viewChanged', {target:this}).trigger(this);

                // Popping item from actions queue
                popActionsQueue.call(this);

            }, this);
    }

    /**
     * Private common pop method.
     * @private
     * @ignore
     *
     * @param {object} fromViewRef Reference to from view.
     * @param {object} toViewRef Reference to to view.
     * @param {number} howMany Number of views to pop from the stack.
     * @param {Effect} transition Transition to played during pop.
     */
    function pop(fromViewRef, toViewRef, howMany, transition) {

        if (toViewRef) {
            // Recreating view instance if necessary
            toViewRef.instance = toViewRef.instance ? toViewRef.instance : new toViewRef.viewClass(toViewRef.options);
            // Rendering view if required
            appendView(toViewRef.instance, this);
        }

        transition = transition || this.defaultPopTransition || (this.defaultPopTransition = new SlideEffect({direction:'right'}));
        transition.play(fromViewRef.instance.$el, toViewRef ? toViewRef.instance.$el : null,
            function () { // Callback function

                // Popping views from a stack
                var remove = this.viewsStack.splice(this.viewsStack.length - howMany, howMany);
                _.each(remove, function (ref) {

                    // Triggering viewDeactivate event
                    createEvent('viewDeactivate', {target:ref.instance}).trigger(ref.instance);

                    if (ref.instance.destructionPolicy == 'never') { // Detaching if destructionPolicy == 'never'
                        ref.instance.$el.detach();
                    } else { // Removing if destructionPolicy == 'auto'
                        ref.instance.remove();
                        ref.instance = null;
                    }
                }, this);

                if (toViewRef) { // If toViewRef exists activating it

                    // Setting activeView property
                    this.activeView = toViewRef.instance;

                    // Triggering viewActivate event
                    createEvent('viewActivate', {target:toViewRef.instance}).trigger(toViewRef.instance);

                } else { // Nulling activeView property
                    this.activeView = null;
                }

                // Triggering viewChanged event
                createEvent('viewChanged', {target:this}).trigger(this);

                // Popping item from actions queue
                popActionsQueue.call(this);
            }, this);
    }

    function pushView(view, viewOptions, transition) {
        // Getting ref of the view on top of the stack
        var fromViewRef = _.last(this.viewsStack),
        // Creating new view instance if it is necessary
            toView = _.isFunction(view) ? new view(viewOptions) : view,
        // Creating new view ref
            toViewRef = {instance:toView, viewClass:toView.constructor, options:viewOptions},
        // Creating viewChanging event object and triggering it
            event = createEvent('viewChanging',
                {
                    action:'push',
                    fromViewClass:fromViewRef ? fromViewRef.viewClass : null,
                    fromView:fromViewRef ? fromViewRef.instance : null,
                    toViewClass:toViewRef.viewClass,
                    toView:toViewRef.instance
                },
                true).trigger(this);

        // Checking if event wasn't cancelled
        if (event.isDefaultPrevented()) return null;

        push.call(this, fromViewRef, toViewRef, 0, transition);
    }

    function popView(transition) {
        if (this.viewsStack.length == 0) throw new Error('Popping from an empty stack!');

        // Getting ref of the view on top of the stack
        var fromViewRef = _.last(this.viewsStack),
        // Getting ref of the view below current one
            toViewRef = this.viewsStack.length > 1 ? this.viewsStack[this.viewsStack.length - 2] : null,
        // Creating viewChanging event object and triggering it
            event = createEvent('viewChanging',
                {
                    action:'pop',
                    fromViewClass:fromViewRef.viewClass,
                    fromView:fromViewRef.instance,
                    toViewClass:toViewRef ? toViewRef.viewClass : null,
                    toView:toViewRef ? toViewRef.instance : null
                },
                true).trigger(this);

        // Checking if event wasn't cancelled
        if (event.isDefaultPrevented()) return;

        // Popping top view
        pop.call(this, fromViewRef, toViewRef, 1, transition);
    }

    function popAll(transition) {
        if (this.viewsStack.length == 0) throw new Error('Popping from an empty stack!');

        // Getting ref of the view on top of the stack
        var fromViewRef = _.last(this.viewsStack),
        // Creating viewChanging event object and triggering it
            event = createEvent('viewChanging',
                {
                    action:'popAll',
                    fromViewClass:fromViewRef.viewClass,
                    fromView:fromViewRef.instance,
                    toViewClass:null,
                    toView:null
                },
                true).trigger(this);

        // Checking if event wasn't cancelled
        if (event.isDefaultPrevented()) return;

        // Popping top view
        pop.call(this, fromViewRef, null, this.viewsStack.length, transition);
    }

    function replaceView(view, viewOptions, transition) {
        if (this.viewsStack.length == 0) throw new Error('Replacing on an empty stack!');

        // Getting ref of the view on top of the stack
        var fromViewRef = _.last(this.viewsStack),
        // Creating new view instance if it is necessary
            toView = _.isFunction(view) ? new view(viewOptions) : view,
        // Creating new view ref
            toViewRef = {instance:toView, viewClass:toView.constructor, options:viewOptions},
        // Creating viewChanging event object and triggering it
            event = createEvent('viewChanging',
                {
                    action:'replace',
                    fromViewClass:fromViewRef.viewClass,
                    fromView:fromViewRef.instance,
                    toViewClass:toViewRef.viewClass,
                    toView:toViewRef.instance
                },
                true).trigger(this);

        // Checking if event wasn't cancelled
        if (event.isDefaultPrevented()) return null;

        // Pushing new view on top
        push.call(this, fromViewRef, toViewRef, 1, transition);
    }

    function replaceAll(view, viewOptions, transition) {
        if (this.viewsStack.length == 0) throw new Error('Replacing on an empty stack!');

        // Getting ref of the view on top of the stack
        var fromViewRef = _.last(this.viewsStack),
        // Creating new view instance if it is necessary
            toView = _.isFunction(view) ? new view(viewOptions) : view,
        // Creating new view ref
            toViewRef = {instance:toView, viewClass:toView.constructor, options:viewOptions},
        // Creating viewChanging event object and triggering it
            event = createEvent('viewChanging',
                {
                    action:'replaceAll',
                    fromViewClass:fromViewRef.viewClass,
                    fromView:fromViewRef.instance,
                    toViewClass:toViewRef.viewClass,
                    toView:toViewRef.instance
                },
                true).trigger(this);

        // Checking if event wasn't cancelled
        if (event.isDefaultPrevented()) return null;

        // Pushing new view on top
        push.call(this, fromViewRef, toViewRef, this.viewsStack.length, transition);
    }

    function popActionsQueue() {
        this.actionsQueue.splice(0, 1);
        if (this.actionsQueue.length > 0) {
            var action = this.actionsQueue[0],
                args = Array.prototype.slice.call(action.args);
            switch (action.fn) {
                case 'pushView':
                    pushView.apply(this, args);
                    break;
                case 'popView':
                    popView.apply(this, args);
                    break;
                case 'popAll':
                    popAll.apply(this, args);
                    break;
                case 'replaceView':
                    replaceView.apply(this, args);
                    break;
                case 'replaceAll':
                    replaceAll.apply(this, args);
                    break;
            }
        }
    }

    var StackNavigator = Backbone.View.extend(
        /** @lends BackStack.StackNavigator */
        {
            /**
             * @name StackNavigator#viewChanging
             * @event
             * @param {Object} e
             * @param {Boolean} [e.cancelable=true]
             */

            /**
             * An array with all the view refs on the stack.
             */
            viewsStack:null,

            /**
             * View on top of the stack.
             */
            activeView:null,

            /**
             * Default push transition effect.
             */
            defaultPushTransition:null,

            /**
             * Default pop transition effect.
             */
            defaultPopTransition:null,

            /**
             * Queue of actions to be executed on the stack.
             */
            actionsQueue:null,

            /**
             * Initializes StackNavigator.
             *
             * @param {Object} options This is a Backbone.View options hash that can have popTransition and pushTransition
             * properties that can be initiated for this instance of navigator.
             *
             * @constructs
             * */
            initialize:function (options) {
                // Setting default styles
                this.$el.css({overflow:'hidden'});

                // Setting new viewsStack array
                this.viewsStack = [];

                // Setting new queue of actions
                this.actionsQueue = [];

                // Setting default pop transition
                if (options.popTransition) this.defaultPopTransition = options.popTransition;

                // Setting default push transition
                if (options.pushTransition) this.defaultPushTransition = options.pushTransition;
            },

            /**
             * Pushes new view to the stack.
             *
             * @param {Backbone.View || Backbone.ViewClass} view View class or view instance to be pushed to the stack.
             * @param {Object} viewOptions Options to be passed if view is contructed by StackNavigator.
             * @param {Effect} transition Transition effect to be played when pushing new view.
             */
            pushView:function (view, viewOptions, transition) {
                // Pushing current action to the queue
                this.actionsQueue.push({fn:'pushView', args:arguments});

                if (this.actionsQueue.length == 1) pushView.call(this, view, viewOptions, transition);
            },

            /**
             * Pops an active view from a stack and displays one below.
             *
             * @param {Effect} transition Transition effect to be played when popping new view.
             */
            popView:function (transition) {
                // Pushing current action to the queue
                this.actionsQueue.push({fn:'popView', args:arguments});

                if (this.actionsQueue.length == 1) popView.call(this, transition);
            },

            /**
             * Pops all views from a stack and leaves empty stack.
             *
             * @param {Effect} transition Transition effect to be played when popping views.
             */
            popAll:function (transition) {
                // Pushing current action to the queue
                this.actionsQueue.push({fn:'popAll', args:arguments});

                if (this.actionsQueue.length == 1) popAll.call(this, transition);
            },

            /**
             * Replaces view on top of the stack, with the one passed as a view param.
             *
             * @param {Backbone.View || Backbone.ViewClass} view View class or view instance to be pushed on top of the stack instead of current one.
             * @param {Object} viewOptions Hash with options to be passed to the view, if view param is not an instance.
             * @param {Effect} transition Transition effect to be played when replacing views.
             */
            replaceView:function (view, viewOptions, transition) {
                // Pushing current action to the queue
                this.actionsQueue.push({fn:'replaceView', args:arguments});

                if (this.actionsQueue.length == 1) replaceView.call(this, view, viewOptions, transition);
            },

            /**
             * Replaces all of the views on the stack, with the one passed as a view param.
             *
             * @param {Backbone.View || Backbone.ViewClass} view View class or view instance to be pushed on top of the stack.
             * @param {Object} viewOptions Hash with options to be passed to the view, if view param is not an instance.
             * @param {Effect} transition Transition effect to be played when replacing views.
             */
            replaceAll:function (view, viewOptions, transition) {
                // Pushing current action to the queue
                this.actionsQueue.push({fn:'replaceAll', args:arguments});

                if (this.actionsQueue.length == 1) replaceAll.call(this, view, viewOptions, transition);
            }
        });

    return StackNavigator;
});
define('effects/FadeEffect',['effects/Effect'], function (Effect) {

    var FadeEffect = Effect.extend({

        fromViewTransitionProps:{duration:0.4, easing:'linear', delay:0.1},

        toViewTransitionProps:{duration:0.4, easing:'linear', delay:0.1},

        play:function ($fromView, $toView, callback, context) {

            var that = this,
                timeout,
                activeTransitions = 0,
                transitionProp = that.vendorPrefix == '' ? 'transition'
                    : ['-' + that.vendorPrefix.toLowerCase(), '-', 'transition'].join('');

            var transitionEndHandler = function (event) {
                if (activeTransitions >= 0) {
                    activeTransitions--;

                    $(event.target).css(transitionProp, '');

                    if (activeTransitions == 0 && callback) {
                        if (timeout) clearTimeout(timeout);
                        callback.call(context);
                    }
                }
            };

            if ($fromView) {
                activeTransitions++;

                // Registering transition end handler
                $fromView.one(that.transitionEndEvent, transitionEndHandler);

                // Setting transition css props
                $fromView.css(transitionProp, ['opacity ', that.fromViewTransitionProps.duration, 's ',
                                               that.fromViewTransitionProps.easing, ' ',
                                               that.fromViewTransitionProps.delay, 's'].join(''));
            }

            if ($toView) {
                activeTransitions++;

                $toView.one(that.transitionEndEvent, transitionEndHandler);

                // Setting initial opacity
                $toView.css('opacity', 0);

                // Setting transition css props
                $toView.css(transitionProp, ['opacity ', that.toViewTransitionProps.duration, 's ',
                                             that.toViewTransitionProps.easing, ' ',
                                             that.toViewTransitionProps.delay, 's'].join(''));

                // Showing the view
                $toView.css('visibility', 'visible');
            }

            // This is a hack to force DOM reflow before transition starts
            context.$el.css('width');

            // This is a fallback for situations when TransitionEnd event doesn't get triggered
            var transDuration = Math.max(that.fromViewTransitionProps.duration, that.toViewTransitionProps.duration) +
                Math.max(that.fromViewTransitionProps.delay, that.toViewTransitionProps.delay);

            timeout = setTimeout(function () {
                if (activeTransitions > 0) {
                    activeTransitions = -1;

                    console.log('Warning ' + that.transitionEndEvent + ' didn\'t trigger in expected time!');

                    if ($toView) {
                        $toView.off(that.transitionEndEvent, transitionEndHandler);
                        $toView.css(transitionProp, '');
                    }

                    if ($fromView) {
                        $fromView.off(that.transitionEndEvent, transitionEndHandler);
                        $fromView.css(transitionProp, '');
                    }

                    callback.call(context);
                }
            }, transDuration * 1.5 * 1000);

            if ($toView) $toView.css('opacity', 1);
            if ($fromView) $fromView.css('opacity', 0);
        }
    });

    return FadeEffect;
});
define('effects/NoEffect',['effects/Effect'], function (Effect) {

    var NoEffect = Effect.extend();
    NoEffect.prototype.play = function ($fromView, $toView, callback, context) {
        if ($toView) {
            // Showing the view
            $toView.css('visibility', 'visible');
        }
        callback.call(context);
    };

    return NoEffect;
});
    return {
        StackNavigator : require('StackNavigator'),
        Effect : require('effects/Effect'),
        NoEffect : require('effects/NoEffect'),
        SlideEffect : require('effects/SlideEffect'),
        FadeEffect : require('effects/FadeEffect')
    };
}));
;/*!
 * iScroll v4.2.5 ~ Copyright (c) 2012 Matteo Spinelli, http://cubiq.org
 * Released under MIT license, http://cubiq.org/license
 */
(function(window, doc){
var m = Math,
	dummyStyle = doc.createElement('div').style,
	vendor = (function () {
		var vendors = 't,webkitT,MozT,msT,OT'.split(','),
			t,
			i = 0,
			l = vendors.length;

		for ( ; i < l; i++ ) {
			t = vendors[i] + 'ransform';
			if ( t in dummyStyle ) {
				return vendors[i].substr(0, vendors[i].length - 1);
			}
		}

		return false;
	})(),
	cssVendor = vendor ? '-' + vendor.toLowerCase() + '-' : '',

	// Style properties
	transform = prefixStyle('transform'),
	transitionProperty = prefixStyle('transitionProperty'),
	transitionDuration = prefixStyle('transitionDuration'),
	transformOrigin = prefixStyle('transformOrigin'),
	transitionTimingFunction = prefixStyle('transitionTimingFunction'),
	transitionDelay = prefixStyle('transitionDelay'),

    // Browser capabilities
	isAndroid = (/android/gi).test(navigator.appVersion),
	isIDevice = (/iphone|ipad/gi).test(navigator.appVersion),
	isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),

    has3d = prefixStyle('perspective') in dummyStyle,
    hasTouch = 'ontouchstart' in window && !isTouchPad,
    hasTransform = vendor !== false,
    hasTransitionEnd = prefixStyle('transition') in dummyStyle,

	RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize',
	START_EV = hasTouch ? 'touchstart' : 'mousedown',
	MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
	END_EV = hasTouch ? 'touchend' : 'mouseup',
	CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup',
	TRNEND_EV = (function () {
		if ( vendor === false ) return false;

		var transitionEnd = {
				''			: 'transitionend',
				'webkit'	: 'webkitTransitionEnd',
				'Moz'		: 'transitionend',
				'O'			: 'otransitionend',
				'ms'		: 'MSTransitionEnd'
			};

		return transitionEnd[vendor];
	})(),

	nextFrame = (function() {
		return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function(callback) { return setTimeout(callback, 1); };
	})(),
	cancelFrame = (function () {
		return window.cancelRequestAnimationFrame ||
			window.webkitCancelAnimationFrame ||
			window.webkitCancelRequestAnimationFrame ||
			window.mozCancelRequestAnimationFrame ||
			window.oCancelRequestAnimationFrame ||
			window.msCancelRequestAnimationFrame ||
			clearTimeout;
	})(),

	// Helpers
	translateZ = has3d ? ' translateZ(0)' : '',

	// Constructor
	iScroll = function (el, options) {
		var that = this,
			i;

		that.wrapper = typeof el == 'object' ? el : doc.getElementById(el);
		that.wrapper.style.overflow = 'hidden';
		that.scroller = that.wrapper.children[0];

		// Default options
		that.options = {
			hScroll: true,
			vScroll: true,
			x: 0,
			y: 0,
			bounce: true,
			bounceLock: false,
			momentum: true,
			lockDirection: true,
			useTransform: true,
			useTransition: false,
			topOffset: 0,
			checkDOMChanges: false,		// Experimental
			handleClick: true,

			// Scrollbar
			hScrollbar: true,
			vScrollbar: true,
			fixedScrollbar: isAndroid,
			hideScrollbar: isIDevice,
			fadeScrollbar: isIDevice && has3d,
			scrollbarClass: '',

			// Zoom
			zoom: false,
			zoomMin: 1,
			zoomMax: 4,
			doubleTapZoom: 2,
			wheelAction: 'scroll',

			// Snap
			snap: false,
			snapThreshold: 1,

			// Events
			onRefresh: null,
			onBeforeScrollStart: function (e) { e.preventDefault(); },
			onScrollStart: null,
			onBeforeScrollMove: null,
			onScrollMove: null,
			onBeforeScrollEnd: null,
			onScrollEnd: null,
			onTouchEnd: null,
			onDestroy: null,
			onZoomStart: null,
			onZoom: null,
			onZoomEnd: null
		};

		// User defined options
		for (i in options) that.options[i] = options[i];
		
		// Set starting position
		that.x = that.options.x;
		that.y = that.options.y;

		// Normalize options
		that.options.useTransform = hasTransform && that.options.useTransform;
		that.options.hScrollbar = that.options.hScroll && that.options.hScrollbar;
		that.options.vScrollbar = that.options.vScroll && that.options.vScrollbar;
		that.options.zoom = that.options.useTransform && that.options.zoom;
		that.options.useTransition = hasTransitionEnd && that.options.useTransition;

		// Helpers FIX ANDROID BUG!
		// translate3d and scale doesn't work together!
		// Ignoring 3d ONLY WHEN YOU SET that.options.zoom
		if ( that.options.zoom && isAndroid ){
			translateZ = '';
		}
		
		// Set some default styles
		that.scroller.style[transitionProperty] = that.options.useTransform ? cssVendor + 'transform' : 'top left';
		that.scroller.style[transitionDuration] = '0';
		that.scroller.style[transformOrigin] = '0 0';
		if (that.options.useTransition) that.scroller.style[transitionTimingFunction] = 'cubic-bezier(0.33,0.66,0.66,1)';
		
		if (that.options.useTransform) that.scroller.style[transform] = 'translate(' + that.x + 'px,' + that.y + 'px)' + translateZ;
		else that.scroller.style.cssText += ';position:absolute;top:' + that.y + 'px;left:' + that.x + 'px';

		if (that.options.useTransition) that.options.fixedScrollbar = true;

		that.refresh();

		that._bind(RESIZE_EV, window);
		that._bind(START_EV);
		if (!hasTouch) {
			if (that.options.wheelAction != 'none') {
				that._bind('DOMMouseScroll');
				that._bind('mousewheel');
			}
		}

		if (that.options.checkDOMChanges) that.checkDOMTime = setInterval(function () {
			that._checkDOMChanges();
		}, 500);
	};

// Prototype
iScroll.prototype = {
	enabled: true,
	x: 0,
	y: 0,
	steps: [],
	scale: 1,
	currPageX: 0, currPageY: 0,
	pagesX: [], pagesY: [],
	aniTime: null,
	wheelZoomCount: 0,
	
	handleEvent: function (e) {
		var that = this;
		switch(e.type) {
			case START_EV:
				if (!hasTouch && e.button !== 0) return;
				that._start(e);
				break;
			case MOVE_EV: that._move(e); break;
			case END_EV:
			case CANCEL_EV: that._end(e); break;
			case RESIZE_EV: that._resize(); break;
			case 'DOMMouseScroll': case 'mousewheel': that._wheel(e); break;
			case TRNEND_EV: that._transitionEnd(e); break;
		}
	},
	
	_checkDOMChanges: function () {
		if (this.moved || this.zoomed || this.animating ||
			(this.scrollerW == this.scroller.offsetWidth * this.scale && this.scrollerH == this.scroller.offsetHeight * this.scale)) return;

		this.refresh();
	},
	
	_scrollbar: function (dir) {
		var that = this,
			bar;

		if (!that[dir + 'Scrollbar']) {
			if (that[dir + 'ScrollbarWrapper']) {
				if (hasTransform) that[dir + 'ScrollbarIndicator'].style[transform] = '';
				that[dir + 'ScrollbarWrapper'].parentNode.removeChild(that[dir + 'ScrollbarWrapper']);
				that[dir + 'ScrollbarWrapper'] = null;
				that[dir + 'ScrollbarIndicator'] = null;
			}

			return;
		}

		if (!that[dir + 'ScrollbarWrapper']) {
			// Create the scrollbar wrapper
			bar = doc.createElement('div');

			if (that.options.scrollbarClass) bar.className = that.options.scrollbarClass + dir.toUpperCase();
			else bar.style.cssText = 'position:absolute;z-index:100;' + (dir == 'h' ? 'height:7px;bottom:1px;left:2px;right:' + (that.vScrollbar ? '7' : '2') + 'px' : 'width:7px;bottom:' + (that.hScrollbar ? '7' : '2') + 'px;top:2px;right:1px');

			bar.style.cssText += ';pointer-events:none;' + cssVendor + 'transition-property:opacity;' + cssVendor + 'transition-duration:' + (that.options.fadeScrollbar ? '350ms' : '0') + ';overflow:hidden;opacity:' + (that.options.hideScrollbar ? '0' : '1');

			that.wrapper.appendChild(bar);
			that[dir + 'ScrollbarWrapper'] = bar;

			// Create the scrollbar indicator
			bar = doc.createElement('div');
			if (!that.options.scrollbarClass) {
				bar.style.cssText = 'position:absolute;z-index:100;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);' + cssVendor + 'background-clip:padding-box;' + cssVendor + 'box-sizing:border-box;' + (dir == 'h' ? 'height:100%' : 'width:100%') + ';' + cssVendor + 'border-radius:3px;border-radius:3px';
			}
			bar.style.cssText += ';pointer-events:none;' + cssVendor + 'transition-property:' + cssVendor + 'transform;' + cssVendor + 'transition-timing-function:cubic-bezier(0.33,0.66,0.66,1);' + cssVendor + 'transition-duration:0;' + cssVendor + 'transform: translate(0,0)' + translateZ;
			if (that.options.useTransition) bar.style.cssText += ';' + cssVendor + 'transition-timing-function:cubic-bezier(0.33,0.66,0.66,1)';

			that[dir + 'ScrollbarWrapper'].appendChild(bar);
			that[dir + 'ScrollbarIndicator'] = bar;
		}

		if (dir == 'h') {
			that.hScrollbarSize = that.hScrollbarWrapper.clientWidth;
			that.hScrollbarIndicatorSize = m.max(m.round(that.hScrollbarSize * that.hScrollbarSize / that.scrollerW), 8);
			that.hScrollbarIndicator.style.width = that.hScrollbarIndicatorSize + 'px';
			that.hScrollbarMaxScroll = that.hScrollbarSize - that.hScrollbarIndicatorSize;
			that.hScrollbarProp = that.hScrollbarMaxScroll / that.maxScrollX;
		} else {
			that.vScrollbarSize = that.vScrollbarWrapper.clientHeight;
			that.vScrollbarIndicatorSize = m.max(m.round(that.vScrollbarSize * that.vScrollbarSize / that.scrollerH), 8);
			that.vScrollbarIndicator.style.height = that.vScrollbarIndicatorSize + 'px';
			that.vScrollbarMaxScroll = that.vScrollbarSize - that.vScrollbarIndicatorSize;
			that.vScrollbarProp = that.vScrollbarMaxScroll / that.maxScrollY;
		}

		// Reset position
		that._scrollbarPos(dir, true);
	},
	
	_resize: function () {
		var that = this;
		setTimeout(function () { that.refresh(); }, isAndroid ? 200 : 0);
	},
	
	_pos: function (x, y) {
		if (this.zoomed) return;

		x = this.hScroll ? x : 0;
		y = this.vScroll ? y : 0;

		if (this.options.useTransform) {
			this.scroller.style[transform] = 'translate(' + x + 'px,' + y + 'px) scale(' + this.scale + ')' + translateZ;
		} else {
			x = m.round(x);
			y = m.round(y);
			this.scroller.style.left = x + 'px';
			this.scroller.style.top = y + 'px';
		}

		this.x = x;
		this.y = y;

		this._scrollbarPos('h');
		this._scrollbarPos('v');
	},

	_scrollbarPos: function (dir, hidden) {
		var that = this,
			pos = dir == 'h' ? that.x : that.y,
			size;

		if (!that[dir + 'Scrollbar']) return;

		pos = that[dir + 'ScrollbarProp'] * pos;

		if (pos < 0) {
			if (!that.options.fixedScrollbar) {
				size = that[dir + 'ScrollbarIndicatorSize'] + m.round(pos * 3);
				if (size < 8) size = 8;
				that[dir + 'ScrollbarIndicator'].style[dir == 'h' ? 'width' : 'height'] = size + 'px';
			}
			pos = 0;
		} else if (pos > that[dir + 'ScrollbarMaxScroll']) {
			if (!that.options.fixedScrollbar) {
				size = that[dir + 'ScrollbarIndicatorSize'] - m.round((pos - that[dir + 'ScrollbarMaxScroll']) * 3);
				if (size < 8) size = 8;
				that[dir + 'ScrollbarIndicator'].style[dir == 'h' ? 'width' : 'height'] = size + 'px';
				pos = that[dir + 'ScrollbarMaxScroll'] + (that[dir + 'ScrollbarIndicatorSize'] - size);
			} else {
				pos = that[dir + 'ScrollbarMaxScroll'];
			}
		}

		that[dir + 'ScrollbarWrapper'].style[transitionDelay] = '0';
		that[dir + 'ScrollbarWrapper'].style.opacity = hidden && that.options.hideScrollbar ? '0' : '1';
		that[dir + 'ScrollbarIndicator'].style[transform] = 'translate(' + (dir == 'h' ? pos + 'px,0)' : '0,' + pos + 'px)') + translateZ;
	},
	
	_start: function (e) {
		var that = this,
			point = hasTouch ? e.touches[0] : e,
			matrix, x, y,
			c1, c2;

		if (!that.enabled) return;

		if (that.options.onBeforeScrollStart) that.options.onBeforeScrollStart.call(that, e);

		if (that.options.useTransition || that.options.zoom) that._transitionTime(0);

		that.moved = false;
		that.animating = false;
		that.zoomed = false;
		that.distX = 0;
		that.distY = 0;
		that.absDistX = 0;
		that.absDistY = 0;
		that.dirX = 0;
		that.dirY = 0;

		// Gesture start
		if (that.options.zoom && hasTouch && e.touches.length > 1) {
			c1 = m.abs(e.touches[0].pageX-e.touches[1].pageX);
			c2 = m.abs(e.touches[0].pageY-e.touches[1].pageY);
			that.touchesDistStart = m.sqrt(c1 * c1 + c2 * c2);

			that.originX = m.abs(e.touches[0].pageX + e.touches[1].pageX - that.wrapperOffsetLeft * 2) / 2 - that.x;
			that.originY = m.abs(e.touches[0].pageY + e.touches[1].pageY - that.wrapperOffsetTop * 2) / 2 - that.y;

			if (that.options.onZoomStart) that.options.onZoomStart.call(that, e);
		}

		if (that.options.momentum) {
			if (that.options.useTransform) {
				// Very lame general purpose alternative to CSSMatrix
				matrix = getComputedStyle(that.scroller, null)[transform].replace(/[^0-9\-.,]/g, '').split(',');
				x = +(matrix[12] || matrix[4]);
				y = +(matrix[13] || matrix[5]);
			} else {
				x = +getComputedStyle(that.scroller, null).left.replace(/[^0-9-]/g, '');
				y = +getComputedStyle(that.scroller, null).top.replace(/[^0-9-]/g, '');
			}
			
			if (x != that.x || y != that.y) {
				if (that.options.useTransition) that._unbind(TRNEND_EV);
				else cancelFrame(that.aniTime);
				that.steps = [];
				that._pos(x, y);
				if (that.options.onScrollEnd) that.options.onScrollEnd.call(that);
			}
		}

		that.absStartX = that.x;	// Needed by snap threshold
		that.absStartY = that.y;

		that.startX = that.x;
		that.startY = that.y;
		that.pointX = point.pageX;
		that.pointY = point.pageY;

		that.startTime = e.timeStamp || Date.now();

		if (that.options.onScrollStart) that.options.onScrollStart.call(that, e);

		that._bind(MOVE_EV, window);
		that._bind(END_EV, window);
		that._bind(CANCEL_EV, window);
	},
	
	_move: function (e) {
		var that = this,
			point = hasTouch ? e.touches[0] : e,
			deltaX = point.pageX - that.pointX,
			deltaY = point.pageY - that.pointY,
			newX = that.x + deltaX,
			newY = that.y + deltaY,
			c1, c2, scale,
			timestamp = e.timeStamp || Date.now();

		if (that.options.onBeforeScrollMove) that.options.onBeforeScrollMove.call(that, e);

		// Zoom
		if (that.options.zoom && hasTouch && e.touches.length > 1) {
			c1 = m.abs(e.touches[0].pageX - e.touches[1].pageX);
			c2 = m.abs(e.touches[0].pageY - e.touches[1].pageY);
			that.touchesDist = m.sqrt(c1*c1+c2*c2);

			that.zoomed = true;

			scale = 1 / that.touchesDistStart * that.touchesDist * this.scale;

			if (scale < that.options.zoomMin) scale = 0.5 * that.options.zoomMin * Math.pow(2.0, scale / that.options.zoomMin);
			else if (scale > that.options.zoomMax) scale = 2.0 * that.options.zoomMax * Math.pow(0.5, that.options.zoomMax / scale);

			that.lastScale = scale / this.scale;

			newX = this.originX - this.originX * that.lastScale + this.x;
			newY = this.originY - this.originY * that.lastScale + this.y;

			this.scroller.style[transform] = 'translate(' + newX + 'px,' + newY + 'px) scale(' + scale + ')' + translateZ;

			if (that.options.onZoom) that.options.onZoom.call(that, e);
			return;
		}

		that.pointX = point.pageX;
		that.pointY = point.pageY;

		// Slow down if outside of the boundaries
		if (newX > 0 || newX < that.maxScrollX) {
			newX = that.options.bounce ? that.x + (deltaX / 2) : newX >= 0 || that.maxScrollX >= 0 ? 0 : that.maxScrollX;
		}
		if (newY > that.minScrollY || newY < that.maxScrollY) {
			newY = that.options.bounce ? that.y + (deltaY / 2) : newY >= that.minScrollY || that.maxScrollY >= 0 ? that.minScrollY : that.maxScrollY;
		}

		that.distX += deltaX;
		that.distY += deltaY;
		that.absDistX = m.abs(that.distX);
		that.absDistY = m.abs(that.distY);

		if (that.absDistX < 6 && that.absDistY < 6) {
			return;
		}

		// Lock direction
		if (that.options.lockDirection) {
			if (that.absDistX > that.absDistY + 5) {
				newY = that.y;
				deltaY = 0;
			} else if (that.absDistY > that.absDistX + 5) {
				newX = that.x;
				deltaX = 0;
			}
		}

		that.moved = true;
		that._pos(newX, newY);
		that.dirX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
		that.dirY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

		if (timestamp - that.startTime > 300) {
			that.startTime = timestamp;
			that.startX = that.x;
			that.startY = that.y;
		}
		
		if (that.options.onScrollMove) that.options.onScrollMove.call(that, e);
	},
	
	_end: function (e) {
		if (hasTouch && e.touches.length !== 0) return;

		var that = this,
			point = hasTouch ? e.changedTouches[0] : e,
			target, ev,
			momentumX = { dist:0, time:0 },
			momentumY = { dist:0, time:0 },
			duration = (e.timeStamp || Date.now()) - that.startTime,
			newPosX = that.x,
			newPosY = that.y,
			distX, distY,
			newDuration,
			snap,
			scale;

		that._unbind(MOVE_EV, window);
		that._unbind(END_EV, window);
		that._unbind(CANCEL_EV, window);

		if (that.options.onBeforeScrollEnd) that.options.onBeforeScrollEnd.call(that, e);

		if (that.zoomed) {
			scale = that.scale * that.lastScale;
			scale = Math.max(that.options.zoomMin, scale);
			scale = Math.min(that.options.zoomMax, scale);
			that.lastScale = scale / that.scale;
			that.scale = scale;

			that.x = that.originX - that.originX * that.lastScale + that.x;
			that.y = that.originY - that.originY * that.lastScale + that.y;
			
			that.scroller.style[transitionDuration] = '200ms';
			that.scroller.style[transform] = 'translate(' + that.x + 'px,' + that.y + 'px) scale(' + that.scale + ')' + translateZ;
			
			that.zoomed = false;
			that.refresh();

			if (that.options.onZoomEnd) that.options.onZoomEnd.call(that, e);
			return;
		}

		if (!that.moved) {
			if (hasTouch) {
				if (that.doubleTapTimer && that.options.zoom) {
					// Double tapped
					clearTimeout(that.doubleTapTimer);
					that.doubleTapTimer = null;
					if (that.options.onZoomStart) that.options.onZoomStart.call(that, e);
					that.zoom(that.pointX, that.pointY, that.scale == 1 ? that.options.doubleTapZoom : 1);
					if (that.options.onZoomEnd) {
						setTimeout(function() {
							that.options.onZoomEnd.call(that, e);
						}, 200); // 200 is default zoom duration
					}
				} else if (this.options.handleClick) {
					that.doubleTapTimer = setTimeout(function () {
						that.doubleTapTimer = null;

						// Find the last touched element
						target = point.target;
						while (target.nodeType != 1) target = target.parentNode;

						if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA') {
							ev = doc.createEvent('MouseEvents');
							ev.initMouseEvent('click', true, true, e.view, 1,
								point.screenX, point.screenY, point.clientX, point.clientY,
								e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
								0, null);
							ev._fake = true;
							target.dispatchEvent(ev);
						}
					}, that.options.zoom ? 250 : 0);
				}
			}

			that._resetPos(400);

			if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
			return;
		}

		if (duration < 300 && that.options.momentum) {
			momentumX = newPosX ? that._momentum(newPosX - that.startX, duration, -that.x, that.scrollerW - that.wrapperW + that.x, that.options.bounce ? that.wrapperW : 0) : momentumX;
			momentumY = newPosY ? that._momentum(newPosY - that.startY, duration, -that.y, (that.maxScrollY < 0 ? that.scrollerH - that.wrapperH + that.y - that.minScrollY : 0), that.options.bounce ? that.wrapperH : 0) : momentumY;

			newPosX = that.x + momentumX.dist;
			newPosY = that.y + momentumY.dist;

			if ((that.x > 0 && newPosX > 0) || (that.x < that.maxScrollX && newPosX < that.maxScrollX)) momentumX = { dist:0, time:0 };
			if ((that.y > that.minScrollY && newPosY > that.minScrollY) || (that.y < that.maxScrollY && newPosY < that.maxScrollY)) momentumY = { dist:0, time:0 };
		}

		if (momentumX.dist || momentumY.dist) {
			newDuration = m.max(m.max(momentumX.time, momentumY.time), 10);

			// Do we need to snap?
			if (that.options.snap) {
				distX = newPosX - that.absStartX;
				distY = newPosY - that.absStartY;
				if (m.abs(distX) < that.options.snapThreshold && m.abs(distY) < that.options.snapThreshold) { that.scrollTo(that.absStartX, that.absStartY, 200); }
				else {
					snap = that._snap(newPosX, newPosY);
					newPosX = snap.x;
					newPosY = snap.y;
					newDuration = m.max(snap.time, newDuration);
				}
			}

			that.scrollTo(m.round(newPosX), m.round(newPosY), newDuration);

			if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
			return;
		}

		// Do we need to snap?
		if (that.options.snap) {
			distX = newPosX - that.absStartX;
			distY = newPosY - that.absStartY;
			if (m.abs(distX) < that.options.snapThreshold && m.abs(distY) < that.options.snapThreshold) that.scrollTo(that.absStartX, that.absStartY, 200);
			else {
				snap = that._snap(that.x, that.y);
				if (snap.x != that.x || snap.y != that.y) that.scrollTo(snap.x, snap.y, snap.time);
			}

			if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
			return;
		}

		that._resetPos(200);
		if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
	},
	
	_resetPos: function (time) {
		var that = this,
			resetX = that.x >= 0 ? 0 : that.x < that.maxScrollX ? that.maxScrollX : that.x,
			resetY = that.y >= that.minScrollY || that.maxScrollY > 0 ? that.minScrollY : that.y < that.maxScrollY ? that.maxScrollY : that.y;

		if (resetX == that.x && resetY == that.y) {
			if (that.moved) {
				that.moved = false;
				if (that.options.onScrollEnd) that.options.onScrollEnd.call(that);		// Execute custom code on scroll end
			}

			if (that.hScrollbar && that.options.hideScrollbar) {
				if (vendor == 'webkit') that.hScrollbarWrapper.style[transitionDelay] = '300ms';
				that.hScrollbarWrapper.style.opacity = '0';
			}
			if (that.vScrollbar && that.options.hideScrollbar) {
				if (vendor == 'webkit') that.vScrollbarWrapper.style[transitionDelay] = '300ms';
				that.vScrollbarWrapper.style.opacity = '0';
			}

			return;
		}

		that.scrollTo(resetX, resetY, time || 0);
	},

	_wheel: function (e) {
		var that = this,
			wheelDeltaX, wheelDeltaY,
			deltaX, deltaY,
			deltaScale;

		if ('wheelDeltaX' in e) {
			wheelDeltaX = e.wheelDeltaX / 12;
			wheelDeltaY = e.wheelDeltaY / 12;
		} else if('wheelDelta' in e) {
			wheelDeltaX = wheelDeltaY = e.wheelDelta / 12;
		} else if ('detail' in e) {
			wheelDeltaX = wheelDeltaY = -e.detail * 3;
		} else {
			return;
		}
		
		if (that.options.wheelAction == 'zoom') {
			deltaScale = that.scale * Math.pow(2, 1/3 * (wheelDeltaY ? wheelDeltaY / Math.abs(wheelDeltaY) : 0));
			if (deltaScale < that.options.zoomMin) deltaScale = that.options.zoomMin;
			if (deltaScale > that.options.zoomMax) deltaScale = that.options.zoomMax;
			
			if (deltaScale != that.scale) {
				if (!that.wheelZoomCount && that.options.onZoomStart) that.options.onZoomStart.call(that, e);
				that.wheelZoomCount++;
				
				that.zoom(e.pageX, e.pageY, deltaScale, 400);
				
				setTimeout(function() {
					that.wheelZoomCount--;
					if (!that.wheelZoomCount && that.options.onZoomEnd) that.options.onZoomEnd.call(that, e);
				}, 400);
			}
			
			return;
		}
		
		deltaX = that.x + wheelDeltaX;
		deltaY = that.y + wheelDeltaY;

		if (deltaX > 0) deltaX = 0;
		else if (deltaX < that.maxScrollX) deltaX = that.maxScrollX;

		if (deltaY > that.minScrollY) deltaY = that.minScrollY;
		else if (deltaY < that.maxScrollY) deltaY = that.maxScrollY;
    
		if (that.maxScrollY < 0) {
			that.scrollTo(deltaX, deltaY, 0);
		}
	},
	
	_transitionEnd: function (e) {
		var that = this;

		if (e.target != that.scroller) return;

		that._unbind(TRNEND_EV);
		
		that._startAni();
	},


	/**
	*
	* Utilities
	*
	*/
	_startAni: function () {
		var that = this,
			startX = that.x, startY = that.y,
			startTime = Date.now(),
			step, easeOut,
			animate;

		if (that.animating) return;
		
		if (!that.steps.length) {
			that._resetPos(400);
			return;
		}
		
		step = that.steps.shift();
		
		if (step.x == startX && step.y == startY) step.time = 0;

		that.animating = true;
		that.moved = true;
		
		if (that.options.useTransition) {
			that._transitionTime(step.time);
			that._pos(step.x, step.y);
			that.animating = false;
			if (step.time) that._bind(TRNEND_EV);
			else that._resetPos(0);
			return;
		}

		animate = function () {
			var now = Date.now(),
				newX, newY;

			if (now >= startTime + step.time) {
				that._pos(step.x, step.y);
				that.animating = false;
				if (that.options.onAnimationEnd) that.options.onAnimationEnd.call(that);			// Execute custom code on animation end
				that._startAni();
				return;
			}

			now = (now - startTime) / step.time - 1;
			easeOut = m.sqrt(1 - now * now);
			newX = (step.x - startX) * easeOut + startX;
			newY = (step.y - startY) * easeOut + startY;
			that._pos(newX, newY);
			if (that.animating) that.aniTime = nextFrame(animate);
		};

		animate();
	},

	_transitionTime: function (time) {
		time += 'ms';
		this.scroller.style[transitionDuration] = time;
		if (this.hScrollbar) this.hScrollbarIndicator.style[transitionDuration] = time;
		if (this.vScrollbar) this.vScrollbarIndicator.style[transitionDuration] = time;
	},

	_momentum: function (dist, time, maxDistUpper, maxDistLower, size) {
		var deceleration = 0.0006,
			speed = m.abs(dist) / time,
			newDist = (speed * speed) / (2 * deceleration),
			newTime = 0, outsideDist = 0;

		// Proportinally reduce speed if we are outside of the boundaries
		if (dist > 0 && newDist > maxDistUpper) {
			outsideDist = size / (6 / (newDist / speed * deceleration));
			maxDistUpper = maxDistUpper + outsideDist;
			speed = speed * maxDistUpper / newDist;
			newDist = maxDistUpper;
		} else if (dist < 0 && newDist > maxDistLower) {
			outsideDist = size / (6 / (newDist / speed * deceleration));
			maxDistLower = maxDistLower + outsideDist;
			speed = speed * maxDistLower / newDist;
			newDist = maxDistLower;
		}

		newDist = newDist * (dist < 0 ? -1 : 1);
		newTime = speed / deceleration;

		return { dist: newDist, time: m.round(newTime) };
	},

	_offset: function (el) {
		var left = -el.offsetLeft,
			top = -el.offsetTop;
			
		while (el = el.offsetParent) {
			left -= el.offsetLeft;
			top -= el.offsetTop;
		}
		
		if (el != this.wrapper) {
			left *= this.scale;
			top *= this.scale;
		}

		return { left: left, top: top };
	},

	_snap: function (x, y) {
		var that = this,
			i, l,
			page, time,
			sizeX, sizeY;

		// Check page X
		page = that.pagesX.length - 1;
		for (i=0, l=that.pagesX.length; i<l; i++) {
			if (x >= that.pagesX[i]) {
				page = i;
				break;
			}
		}
		if (page == that.currPageX && page > 0 && that.dirX < 0) page--;
		x = that.pagesX[page];
		sizeX = m.abs(x - that.pagesX[that.currPageX]);
		sizeX = sizeX ? m.abs(that.x - x) / sizeX * 500 : 0;
		that.currPageX = page;

		// Check page Y
		page = that.pagesY.length-1;
		for (i=0; i<page; i++) {
			if (y >= that.pagesY[i]) {
				page = i;
				break;
			}
		}
		if (page == that.currPageY && page > 0 && that.dirY < 0) page--;
		y = that.pagesY[page];
		sizeY = m.abs(y - that.pagesY[that.currPageY]);
		sizeY = sizeY ? m.abs(that.y - y) / sizeY * 500 : 0;
		that.currPageY = page;

		// Snap with constant speed (proportional duration)
		time = m.round(m.max(sizeX, sizeY)) || 200;

		return { x: x, y: y, time: time };
	},

	_bind: function (type, el, bubble) {
		(el || this.scroller).addEventListener(type, this, !!bubble);
	},

	_unbind: function (type, el, bubble) {
		(el || this.scroller).removeEventListener(type, this, !!bubble);
	},


	/**
	*
	* Public methods
	*
	*/
	destroy: function () {
		var that = this;

		that.scroller.style[transform] = '';

		// Remove the scrollbars
		that.hScrollbar = false;
		that.vScrollbar = false;
		that._scrollbar('h');
		that._scrollbar('v');

		// Remove the event listeners
		that._unbind(RESIZE_EV, window);
		that._unbind(START_EV);
		that._unbind(MOVE_EV, window);
		that._unbind(END_EV, window);
		that._unbind(CANCEL_EV, window);
		
		if (!that.options.hasTouch) {
			that._unbind('DOMMouseScroll');
			that._unbind('mousewheel');
		}
		
		if (that.options.useTransition) that._unbind(TRNEND_EV);
		
		if (that.options.checkDOMChanges) clearInterval(that.checkDOMTime);
		
		if (that.options.onDestroy) that.options.onDestroy.call(that);
	},

	refresh: function () {
		var that = this,
			offset,
			i, l,
			els,
			pos = 0,
			page = 0;

		if (that.scale < that.options.zoomMin) that.scale = that.options.zoomMin;
		that.wrapperW = that.wrapper.clientWidth || 1;
		that.wrapperH = that.wrapper.clientHeight || 1;

		that.minScrollY = -that.options.topOffset || 0;
		that.scrollerW = m.round(that.scroller.offsetWidth * that.scale);
		that.scrollerH = m.round((that.scroller.offsetHeight + that.minScrollY) * that.scale);
		that.maxScrollX = that.wrapperW - that.scrollerW;
		that.maxScrollY = that.wrapperH - that.scrollerH + that.minScrollY;
		that.dirX = 0;
		that.dirY = 0;

		if (that.options.onRefresh) that.options.onRefresh.call(that);

		that.hScroll = that.options.hScroll && that.maxScrollX < 0;
		that.vScroll = that.options.vScroll && (!that.options.bounceLock && !that.hScroll || that.scrollerH > that.wrapperH);

		that.hScrollbar = that.hScroll && that.options.hScrollbar;
		that.vScrollbar = that.vScroll && that.options.vScrollbar && that.scrollerH > that.wrapperH;

		offset = that._offset(that.wrapper);
		that.wrapperOffsetLeft = -offset.left;
		that.wrapperOffsetTop = -offset.top;

		// Prepare snap
		if (typeof that.options.snap == 'string') {
			that.pagesX = [];
			that.pagesY = [];
			els = that.scroller.querySelectorAll(that.options.snap);
			for (i=0, l=els.length; i<l; i++) {
				pos = that._offset(els[i]);
				pos.left += that.wrapperOffsetLeft;
				pos.top += that.wrapperOffsetTop;
				that.pagesX[i] = pos.left < that.maxScrollX ? that.maxScrollX : pos.left * that.scale;
				that.pagesY[i] = pos.top < that.maxScrollY ? that.maxScrollY : pos.top * that.scale;
			}
		} else if (that.options.snap) {
			that.pagesX = [];
			while (pos >= that.maxScrollX) {
				that.pagesX[page] = pos;
				pos = pos - that.wrapperW;
				page++;
			}
			if (that.maxScrollX%that.wrapperW) that.pagesX[that.pagesX.length] = that.maxScrollX - that.pagesX[that.pagesX.length-1] + that.pagesX[that.pagesX.length-1];

			pos = 0;
			page = 0;
			that.pagesY = [];
			while (pos >= that.maxScrollY) {
				that.pagesY[page] = pos;
				pos = pos - that.wrapperH;
				page++;
			}
			if (that.maxScrollY%that.wrapperH) that.pagesY[that.pagesY.length] = that.maxScrollY - that.pagesY[that.pagesY.length-1] + that.pagesY[that.pagesY.length-1];
		}

		// Prepare the scrollbars
		that._scrollbar('h');
		that._scrollbar('v');

		if (!that.zoomed) {
			that.scroller.style[transitionDuration] = '0';
			that._resetPos(400);
		}
	},

	scrollTo: function (x, y, time, relative) {
		var that = this,
			step = x,
			i, l;

		that.stop();

		if (!step.length) step = [{ x: x, y: y, time: time, relative: relative }];
		
		for (i=0, l=step.length; i<l; i++) {
			if (step[i].relative) { step[i].x = that.x - step[i].x; step[i].y = that.y - step[i].y; }
			that.steps.push({ x: step[i].x, y: step[i].y, time: step[i].time || 0 });
		}

		that._startAni();
	},

	scrollToElement: function (el, time) {
		var that = this, pos;
		el = el.nodeType ? el : that.scroller.querySelector(el);
		if (!el) return;

		pos = that._offset(el);
		pos.left += that.wrapperOffsetLeft;
		pos.top += that.wrapperOffsetTop;

		pos.left = pos.left > 0 ? 0 : pos.left < that.maxScrollX ? that.maxScrollX : pos.left;
		pos.top = pos.top > that.minScrollY ? that.minScrollY : pos.top < that.maxScrollY ? that.maxScrollY : pos.top;
		time = time === undefined ? m.max(m.abs(pos.left)*2, m.abs(pos.top)*2) : time;

		that.scrollTo(pos.left, pos.top, time);
	},

	scrollToPage: function (pageX, pageY, time) {
		var that = this, x, y;
		
		time = time === undefined ? 400 : time;

		if (that.options.onScrollStart) that.options.onScrollStart.call(that);

		if (that.options.snap) {
			pageX = pageX == 'next' ? that.currPageX+1 : pageX == 'prev' ? that.currPageX-1 : pageX;
			pageY = pageY == 'next' ? that.currPageY+1 : pageY == 'prev' ? that.currPageY-1 : pageY;

			pageX = pageX < 0 ? 0 : pageX > that.pagesX.length-1 ? that.pagesX.length-1 : pageX;
			pageY = pageY < 0 ? 0 : pageY > that.pagesY.length-1 ? that.pagesY.length-1 : pageY;

			that.currPageX = pageX;
			that.currPageY = pageY;
			x = that.pagesX[pageX];
			y = that.pagesY[pageY];
		} else {
			x = -that.wrapperW * pageX;
			y = -that.wrapperH * pageY;
			if (x < that.maxScrollX) x = that.maxScrollX;
			if (y < that.maxScrollY) y = that.maxScrollY;
		}

		that.scrollTo(x, y, time);
	},

	disable: function () {
		this.stop();
		this._resetPos(0);
		this.enabled = false;

		// If disabled after touchstart we make sure that there are no left over events
		this._unbind(MOVE_EV, window);
		this._unbind(END_EV, window);
		this._unbind(CANCEL_EV, window);
	},
	
	enable: function () {
		this.enabled = true;
	},
	
	stop: function () {
		if (this.options.useTransition) this._unbind(TRNEND_EV);
		else cancelFrame(this.aniTime);
		this.steps = [];
		this.moved = false;
		this.animating = false;
	},
	
	zoom: function (x, y, scale, time) {
		var that = this,
			relScale = scale / that.scale;

		if (!that.options.useTransform) return;

		that.zoomed = true;
		time = time === undefined ? 200 : time;
		x = x - that.wrapperOffsetLeft - that.x;
		y = y - that.wrapperOffsetTop - that.y;
		that.x = x - x * relScale + that.x;
		that.y = y - y * relScale + that.y;

		that.scale = scale;
		that.refresh();

		that.x = that.x > 0 ? 0 : that.x < that.maxScrollX ? that.maxScrollX : that.x;
		that.y = that.y > that.minScrollY ? that.minScrollY : that.y < that.maxScrollY ? that.maxScrollY : that.y;

		that.scroller.style[transitionDuration] = time + 'ms';
		that.scroller.style[transform] = 'translate(' + that.x + 'px,' + that.y + 'px) scale(' + scale + ')' + translateZ;
		that.zoomed = false;
	},
	
	isReady: function () {
		return !this.moved && !this.zoomed && !this.animating;
	}
};

function prefixStyle (style) {
	if ( vendor === '' ) return style;

	style = style.charAt(0).toUpperCase() + style.substr(1);
	return vendor + style;
}

dummyStyle = null;	// for the sake of it

if (typeof exports !== 'undefined') exports.iScroll = iScroll;
else window.iScroll = iScroll;

})(window, document);

;/*
BOHEMIANGRID OPTIONS
Options for vendor scripts
 */

$(document).ready(function() {
// Start Pull to Refresh
  var myScroll,
    pullDownEl, pullDownOffset,
    pullUpEl, pullUpOffset,
    generatedCount = 0;

  function pullDownAction () {
    setTimeout(function () {  // Simulates loading (remove from production).
      var el, li, i;
      el = document.getElementById('thelist');

      for (i=0; i<1; i++) {
        li = document.createElement('li');
        li.innerText = 'Hey! New Row! ' + (++generatedCount);
        el.insertBefore(li, el.childNodes[0]);
      }

      myScroll.refresh();   // Refresh when contents are loaded (ie: on ajax completion)
    }, 1000); // Simulates loading (remove from production).

  }

  function loaded() {
    pullDownEl = document.getElementById('pullDown');
    pullDownOffset = pullDownEl.offsetHeight;

    myScroll = new iScroll('wrapper', {
      useTransition: true,
      topOffset: pullDownOffset,
      onRefresh: function () {
        if (pullDownEl.className.match('loading')) {
          pullDownEl.className = '';
          pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
        }
      },
      onScrollMove: function () {
        if (this.y > 5 && !pullDownEl.className.match('flip')) {
          pullDownEl.className = 'flip';
          pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Release to refresh...';
          this.minScrollY = 0;
        } else if (this.y < 5 && pullDownEl.className.match('flip')) {
          pullDownEl.className = '';
          pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
          this.minScrollY = -pullDownOffset;
        }
      },
      onScrollEnd: function () {
        if (pullDownEl.className.match('flip')) {
          pullDownEl.className = 'loading';
          pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Loading...';
          pullDownAction(); // Execute custom function (ajax call?)
        }
      }
    });

    setTimeout(function () { document.getElementById('wrapper').style.left = '0'; }, 800);
  }

  document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

  document.addEventListener('DOMContentLoaded', function () { setTimeout(loaded, 200); }, false);

// End Pull to Refresh

}); // End Document Ready


;// lib/handlebars/base.js
var Handlebars = {};

Handlebars.VERSION = "1.0.beta.6";

Handlebars.helpers  = {};
Handlebars.partials = {};

Handlebars.registerHelper = function(name, fn, inverse) {
  if(inverse) { fn.not = inverse; }
  this.helpers[name] = fn;
};

Handlebars.registerPartial = function(name, str) {
  this.partials[name] = str;
};

Handlebars.registerHelper('helperMissing', function(arg) {
  if(arguments.length === 2) {
    return undefined;
  } else {
    throw new Error("Could not find property '" + arg + "'");
  }
});

var toString = Object.prototype.toString, functionType = "[object Function]";

Handlebars.registerHelper('blockHelperMissing', function(context, options) {
  var inverse = options.inverse || function() {}, fn = options.fn;


  var ret = "";
  var type = toString.call(context);

  if(type === functionType) { context = context.call(this); }

  if(context === true) {
    return fn(this);
  } else if(context === false || context == null) {
    return inverse(this);
  } else if(type === "[object Array]") {
    if(context.length > 0) {
      for(var i=0, j=context.length; i<j; i++) {
        ret = ret + fn(context[i]);
      }
    } else {
      ret = inverse(this);
    }
    return ret;
  } else {
    return fn(context);
  }
});

Handlebars.registerHelper('each', function(context, options) {
  var fn = options.fn, inverse = options.inverse;
  var ret = "";

  if(context && context.length > 0) {
    for(var i=0, j=context.length; i<j; i++) {
      ret = ret + fn(context[i]);
    }
  } else {
    ret = inverse(this);
  }
  return ret;
});

Handlebars.registerHelper('if', function(context, options) {
  var type = toString.call(context);
  if(type === functionType) { context = context.call(this); }

  if(!context || Handlebars.Utils.isEmpty(context)) {
    return options.inverse(this);
  } else {
    return options.fn(this);
  }
});

Handlebars.registerHelper('unless', function(context, options) {
  var fn = options.fn, inverse = options.inverse;
  options.fn = inverse;
  options.inverse = fn;

  return Handlebars.helpers['if'].call(this, context, options);
});

Handlebars.registerHelper('with', function(context, options) {
  return options.fn(context);
});

Handlebars.registerHelper('log', function(context) {
  Handlebars.log(context);
});
;
// lib/handlebars/utils.js
Handlebars.Exception = function(message) {
  var tmp = Error.prototype.constructor.apply(this, arguments);

  for (var p in tmp) {
    if (tmp.hasOwnProperty(p)) { this[p] = tmp[p]; }
  }

  this.message = tmp.message;
};
Handlebars.Exception.prototype = new Error;

// Build out our basic SafeString type
Handlebars.SafeString = function(string) {
  this.string = string;
};
Handlebars.SafeString.prototype.toString = function() {
  return this.string.toString();
};

(function() {
  var escape = {
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "`": "&#x60;"
  };

  var badChars = /&(?!\w+;)|[<>"'`]/g;
  var possible = /[&<>"'`]/;

  var escapeChar = function(chr) {
    return escape[chr] || "&amp;";
  };

  Handlebars.Utils = {
    escapeExpression: function(string) {
      // don't escape SafeStrings, since they're already safe
      if (string instanceof Handlebars.SafeString) {
        return string.toString();
      } else if (string == null || string === false) {
        return "";
      }

      if(!possible.test(string)) { return string; }
      return string.replace(badChars, escapeChar);
    },

    isEmpty: function(value) {
      if (typeof value === "undefined") {
        return true;
      } else if (value === null) {
        return true;
      } else if (value === false) {
        return true;
      } else if(Object.prototype.toString.call(value) === "[object Array]" && value.length === 0) {
        return true;
      } else {
        return false;
      }
    }
  };
})();;
// lib/handlebars/runtime.js
Handlebars.VM = {
  template: function(templateSpec) {
    // Just add water
    var container = {
      escapeExpression: Handlebars.Utils.escapeExpression,
      invokePartial: Handlebars.VM.invokePartial,
      programs: [],
      program: function(i, fn, data) {
        var programWrapper = this.programs[i];
        if(data) {
          return Handlebars.VM.program(fn, data);
        } else if(programWrapper) {
          return programWrapper;
        } else {
          programWrapper = this.programs[i] = Handlebars.VM.program(fn);
          return programWrapper;
        }
      },
      programWithDepth: Handlebars.VM.programWithDepth,
      noop: Handlebars.VM.noop
    };

    return function(context, options) {
      options = options || {};
      return templateSpec.call(container, Handlebars, context, options.helpers, options.partials, options.data);
    };
  },

  programWithDepth: function(fn, data, $depth) {
    var args = Array.prototype.slice.call(arguments, 2);

    return function(context, options) {
      options = options || {};

      return fn.apply(this, [context, options.data || data].concat(args));
    };
  },
  program: function(fn, data) {
    return function(context, options) {
      options = options || {};

      return fn(context, options.data || data);
    };
  },
  noop: function() { return ""; },
  invokePartial: function(partial, name, context, helpers, partials, data) {
    options = { helpers: helpers, partials: partials, data: data };

    if(partial === undefined) {
      throw new Handlebars.Exception("The partial " + name + " could not be found");
    } else if(partial instanceof Function) {
      return partial(context, options);
    } else if (!Handlebars.compile) {
      throw new Handlebars.Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
    } else {
      partials[name] = Handlebars.compile(partial);
      return partials[name](context, options);
    }
  }
};

Handlebars.template = Handlebars.VM.template;
;

;// Make it safe to do console.log() always.
(function (con) {
  var method;
  var dummy = function() {};
  var methods = ('assert,count,debug,dir,dirxml,error,exception,group,' +
     'groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,' + 
     'time,timeEnd,trace,warn').split(',');
  while (method = methods.pop()) {
    con[method] = con[method] || dummy;
  }
})(window.console = window.console || {});

;$(document).bind("mobileinit", function () {
    $.mobile.ajaxEnabled = false;
    $.mobile.linkBindingEnabled = false;
    $.mobile.hashListeningEnabled = false;
    $.mobile.pushStateEnabled = false;

    // Remove page from DOM when it's being replaced
    $('div[data-role="page"]').live('pagehide', function (event, ui) {
        $(event.currentTarget).remove();
    });
});
;/*!
 * jQuery Migrate - v1.1.1 - 2013-02-16
 * https://github.com/jquery/jquery-migrate
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors; Licensed MIT
 */
(function( jQuery, window, undefined ) {
// See http://bugs.jquery.com/ticket/13335
// "use strict";


var warnedAbout = {};

// List of warnings already given; public read only
jQuery.migrateWarnings = [];

// Set to true to prevent console output; migrateWarnings still maintained
// jQuery.migrateMute = false;

// Show a message on the console so devs know we're active
if ( !jQuery.migrateMute && window.console && console.log ) {
	console.log("JQMIGRATE: Logging is active");
}

// Set to false to disable traces that appear with warnings
if ( jQuery.migrateTrace === undefined ) {
	jQuery.migrateTrace = true;
}

// Forget any warnings we've already given; public
jQuery.migrateReset = function() {
	warnedAbout = {};
	jQuery.migrateWarnings.length = 0;
};

function migrateWarn( msg) {
	if ( !warnedAbout[ msg ] ) {
		warnedAbout[ msg ] = true;
		jQuery.migrateWarnings.push( msg );
		if ( window.console && console.warn && !jQuery.migrateMute ) {
			console.warn( "JQMIGRATE: " + msg );
			if ( jQuery.migrateTrace && console.trace ) {
				console.trace();
			}
		}
	}
}

function migrateWarnProp( obj, prop, value, msg ) {
	if ( Object.defineProperty ) {
		// On ES5 browsers (non-oldIE), warn if the code tries to get prop;
		// allow property to be overwritten in case some other plugin wants it
		try {
			Object.defineProperty( obj, prop, {
				configurable: true,
				enumerable: true,
				get: function() {
					migrateWarn( msg );
					return value;
				},
				set: function( newValue ) {
					migrateWarn( msg );
					value = newValue;
				}
			});
			return;
		} catch( err ) {
			// IE8 is a dope about Object.defineProperty, can't warn there
		}
	}

	// Non-ES5 (or broken) browser; just set the property
	jQuery._definePropertyBroken = true;
	obj[ prop ] = value;
}

if ( document.compatMode === "BackCompat" ) {
	// jQuery has never supported or tested Quirks Mode
	migrateWarn( "jQuery is not compatible with Quirks Mode" );
}


var attrFn = jQuery( "<input/>", { size: 1 } ).attr("size") && jQuery.attrFn,
	oldAttr = jQuery.attr,
	valueAttrGet = jQuery.attrHooks.value && jQuery.attrHooks.value.get ||
		function() { return null; },
	valueAttrSet = jQuery.attrHooks.value && jQuery.attrHooks.value.set ||
		function() { return undefined; },
	rnoType = /^(?:input|button)$/i,
	rnoAttrNodeType = /^[238]$/,
	rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
	ruseDefault = /^(?:checked|selected)$/i;

// jQuery.attrFn
migrateWarnProp( jQuery, "attrFn", attrFn || {}, "jQuery.attrFn is deprecated" );

jQuery.attr = function( elem, name, value, pass ) {
	var lowerName = name.toLowerCase(),
		nType = elem && elem.nodeType;

	if ( pass ) {
		// Since pass is used internally, we only warn for new jQuery
		// versions where there isn't a pass arg in the formal params
		if ( oldAttr.length < 4 ) {
			migrateWarn("jQuery.fn.attr( props, pass ) is deprecated");
		}
		if ( elem && !rnoAttrNodeType.test( nType ) &&
			(attrFn ? name in attrFn : jQuery.isFunction(jQuery.fn[name])) ) {
			return jQuery( elem )[ name ]( value );
		}
	}

	// Warn if user tries to set `type`, since it breaks on IE 6/7/8; by checking
	// for disconnected elements we don't warn on $( "<button>", { type: "button" } ).
	if ( name === "type" && value !== undefined && rnoType.test( elem.nodeName ) && elem.parentNode ) {
		migrateWarn("Can't change the 'type' of an input or button in IE 6/7/8");
	}

	// Restore boolHook for boolean property/attribute synchronization
	if ( !jQuery.attrHooks[ lowerName ] && rboolean.test( lowerName ) ) {
		jQuery.attrHooks[ lowerName ] = {
			get: function( elem, name ) {
				// Align boolean attributes with corresponding properties
				// Fall back to attribute presence where some booleans are not supported
				var attrNode,
					property = jQuery.prop( elem, name );
				return property === true || typeof property !== "boolean" &&
					( attrNode = elem.getAttributeNode(name) ) && attrNode.nodeValue !== false ?

					name.toLowerCase() :
					undefined;
			},
			set: function( elem, value, name ) {
				var propName;
				if ( value === false ) {
					// Remove boolean attributes when set to false
					jQuery.removeAttr( elem, name );
				} else {
					// value is true since we know at this point it's type boolean and not false
					// Set boolean attributes to the same name and set the DOM property
					propName = jQuery.propFix[ name ] || name;
					if ( propName in elem ) {
						// Only set the IDL specifically if it already exists on the element
						elem[ propName ] = true;
					}

					elem.setAttribute( name, name.toLowerCase() );
				}
				return name;
			}
		};

		// Warn only for attributes that can remain distinct from their properties post-1.9
		if ( ruseDefault.test( lowerName ) ) {
			migrateWarn( "jQuery.fn.attr('" + lowerName + "') may use property instead of attribute" );
		}
	}

	return oldAttr.call( jQuery, elem, name, value );
};

// attrHooks: value
jQuery.attrHooks.value = {
	get: function( elem, name ) {
		var nodeName = ( elem.nodeName || "" ).toLowerCase();
		if ( nodeName === "button" ) {
			return valueAttrGet.apply( this, arguments );
		}
		if ( nodeName !== "input" && nodeName !== "option" ) {
			migrateWarn("jQuery.fn.attr('value') no longer gets properties");
		}
		return name in elem ?
			elem.value :
			null;
	},
	set: function( elem, value ) {
		var nodeName = ( elem.nodeName || "" ).toLowerCase();
		if ( nodeName === "button" ) {
			return valueAttrSet.apply( this, arguments );
		}
		if ( nodeName !== "input" && nodeName !== "option" ) {
			migrateWarn("jQuery.fn.attr('value', val) no longer sets properties");
		}
		// Does not return so that setAttribute is also used
		elem.value = value;
	}
};


var matched, browser,
	oldInit = jQuery.fn.init,
	oldParseJSON = jQuery.parseJSON,
	// Note this does NOT include the #9521 XSS fix from 1.7!
	rquickExpr = /^(?:[^<]*(<[\w\W]+>)[^>]*|#([\w\-]*))$/;

// $(html) "looks like html" rule change
jQuery.fn.init = function( selector, context, rootjQuery ) {
	var match;

	if ( selector && typeof selector === "string" && !jQuery.isPlainObject( context ) &&
			(match = rquickExpr.exec( selector )) && match[1] ) {
		// This is an HTML string according to the "old" rules; is it still?
		if ( selector.charAt( 0 ) !== "<" ) {
			migrateWarn("$(html) HTML strings must start with '<' character");
		}
		// Now process using loose rules; let pre-1.8 play too
		if ( context && context.context ) {
			// jQuery object as context; parseHTML expects a DOM object
			context = context.context;
		}
		if ( jQuery.parseHTML ) {
			return oldInit.call( this, jQuery.parseHTML( jQuery.trim(selector), context, true ),
					context, rootjQuery );
		}
	}
	return oldInit.apply( this, arguments );
};
jQuery.fn.init.prototype = jQuery.fn;

// Let $.parseJSON(falsy_value) return null
jQuery.parseJSON = function( json ) {
	if ( !json && json !== null ) {
		migrateWarn("jQuery.parseJSON requires a valid JSON string");
		return null;
	}
	return oldParseJSON.apply( this, arguments );
};

jQuery.uaMatch = function( ua ) {
	ua = ua.toLowerCase();

	var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
		/(webkit)[ \/]([\w.]+)/.exec( ua ) ||
		/(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
		/(msie) ([\w.]+)/.exec( ua ) ||
		ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
		[];

	return {
		browser: match[ 1 ] || "",
		version: match[ 2 ] || "0"
	};
};

// Don't clobber any existing jQuery.browser in case it's different
if ( !jQuery.browser ) {
	matched = jQuery.uaMatch( navigator.userAgent );
	browser = {};

	if ( matched.browser ) {
		browser[ matched.browser ] = true;
		browser.version = matched.version;
	}

	// Chrome is Webkit, but Webkit is also Safari.
	if ( browser.chrome ) {
		browser.webkit = true;
	} else if ( browser.webkit ) {
		browser.safari = true;
	}

	jQuery.browser = browser;
}

// Warn if the code tries to get jQuery.browser
migrateWarnProp( jQuery, "browser", jQuery.browser, "jQuery.browser is deprecated" );

jQuery.sub = function() {
	function jQuerySub( selector, context ) {
		return new jQuerySub.fn.init( selector, context );
	}
	jQuery.extend( true, jQuerySub, this );
	jQuerySub.superclass = this;
	jQuerySub.fn = jQuerySub.prototype = this();
	jQuerySub.fn.constructor = jQuerySub;
	jQuerySub.sub = this.sub;
	jQuerySub.fn.init = function init( selector, context ) {
		if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
			context = jQuerySub( context );
		}

		return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
	};
	jQuerySub.fn.init.prototype = jQuerySub.fn;
	var rootjQuerySub = jQuerySub(document);
	migrateWarn( "jQuery.sub() is deprecated" );
	return jQuerySub;
};


// Ensure that $.ajax gets the new parseJSON defined in core.js
jQuery.ajaxSetup({
	converters: {
		"text json": jQuery.parseJSON
	}
});


var oldFnData = jQuery.fn.data;

jQuery.fn.data = function( name ) {
	var ret, evt,
		elem = this[0];

	// Handles 1.7 which has this behavior and 1.8 which doesn't
	if ( elem && name === "events" && arguments.length === 1 ) {
		ret = jQuery.data( elem, name );
		evt = jQuery._data( elem, name );
		if ( ( ret === undefined || ret === evt ) && evt !== undefined ) {
			migrateWarn("Use of jQuery.fn.data('events') is deprecated");
			return evt;
		}
	}
	return oldFnData.apply( this, arguments );
};


var rscriptType = /\/(java|ecma)script/i,
	oldSelf = jQuery.fn.andSelf || jQuery.fn.addBack;

jQuery.fn.andSelf = function() {
	migrateWarn("jQuery.fn.andSelf() replaced by jQuery.fn.addBack()");
	return oldSelf.apply( this, arguments );
};

// Since jQuery.clean is used internally on older versions, we only shim if it's missing
if ( !jQuery.clean ) {
	jQuery.clean = function( elems, context, fragment, scripts ) {
		// Set context per 1.8 logic
		context = context || document;
		context = !context.nodeType && context[0] || context;
		context = context.ownerDocument || context;

		migrateWarn("jQuery.clean() is deprecated");

		var i, elem, handleScript, jsTags,
			ret = [];

		jQuery.merge( ret, jQuery.buildFragment( elems, context ).childNodes );

		// Complex logic lifted directly from jQuery 1.8
		if ( fragment ) {
			// Special handling of each script element
			handleScript = function( elem ) {
				// Check if we consider it executable
				if ( !elem.type || rscriptType.test( elem.type ) ) {
					// Detach the script and store it in the scripts array (if provided) or the fragment
					// Return truthy to indicate that it has been handled
					return scripts ?
						scripts.push( elem.parentNode ? elem.parentNode.removeChild( elem ) : elem ) :
						fragment.appendChild( elem );
				}
			};

			for ( i = 0; (elem = ret[i]) != null; i++ ) {
				// Check if we're done after handling an executable script
				if ( !( jQuery.nodeName( elem, "script" ) && handleScript( elem ) ) ) {
					// Append to fragment and handle embedded scripts
					fragment.appendChild( elem );
					if ( typeof elem.getElementsByTagName !== "undefined" ) {
						// handleScript alters the DOM, so use jQuery.merge to ensure snapshot iteration
						jsTags = jQuery.grep( jQuery.merge( [], elem.getElementsByTagName("script") ), handleScript );

						// Splice the scripts into ret after their former ancestor and advance our index beyond them
						ret.splice.apply( ret, [i + 1, 0].concat( jsTags ) );
						i += jsTags.length;
					}
				}
			}
		}

		return ret;
	};
}

var eventAdd = jQuery.event.add,
	eventRemove = jQuery.event.remove,
	eventTrigger = jQuery.event.trigger,
	oldToggle = jQuery.fn.toggle,
	oldLive = jQuery.fn.live,
	oldDie = jQuery.fn.die,
	ajaxEvents = "ajaxStart|ajaxStop|ajaxSend|ajaxComplete|ajaxError|ajaxSuccess",
	rajaxEvent = new RegExp( "\\b(?:" + ajaxEvents + ")\\b" ),
	rhoverHack = /(?:^|\s)hover(\.\S+|)\b/,
	hoverHack = function( events ) {
		if ( typeof( events ) !== "string" || jQuery.event.special.hover ) {
			return events;
		}
		if ( rhoverHack.test( events ) ) {
			migrateWarn("'hover' pseudo-event is deprecated, use 'mouseenter mouseleave'");
		}
		return events && events.replace( rhoverHack, "mouseenter$1 mouseleave$1" );
	};

// Event props removed in 1.9, put them back if needed; no practical way to warn them
if ( jQuery.event.props && jQuery.event.props[ 0 ] !== "attrChange" ) {
	jQuery.event.props.unshift( "attrChange", "attrName", "relatedNode", "srcElement" );
}

// Undocumented jQuery.event.handle was "deprecated" in jQuery 1.7
if ( jQuery.event.dispatch ) {
	migrateWarnProp( jQuery.event, "handle", jQuery.event.dispatch, "jQuery.event.handle is undocumented and deprecated" );
}

// Support for 'hover' pseudo-event and ajax event warnings
jQuery.event.add = function( elem, types, handler, data, selector ){
	if ( elem !== document && rajaxEvent.test( types ) ) {
		migrateWarn( "AJAX events should be attached to document: " + types );
	}
	eventAdd.call( this, elem, hoverHack( types || "" ), handler, data, selector );
};
jQuery.event.remove = function( elem, types, handler, selector, mappedTypes ){
	eventRemove.call( this, elem, hoverHack( types ) || "", handler, selector, mappedTypes );
};

jQuery.fn.error = function() {
	var args = Array.prototype.slice.call( arguments, 0);
	migrateWarn("jQuery.fn.error() is deprecated");
	args.splice( 0, 0, "error" );
	if ( arguments.length ) {
		return this.bind.apply( this, args );
	}
	// error event should not bubble to window, although it does pre-1.7
	this.triggerHandler.apply( this, args );
	return this;
};

jQuery.fn.toggle = function( fn, fn2 ) {

	// Don't mess with animation or css toggles
	if ( !jQuery.isFunction( fn ) || !jQuery.isFunction( fn2 ) ) {
		return oldToggle.apply( this, arguments );
	}
	migrateWarn("jQuery.fn.toggle(handler, handler...) is deprecated");

	// Save reference to arguments for access in closure
	var args = arguments,
		guid = fn.guid || jQuery.guid++,
		i = 0,
		toggler = function( event ) {
			// Figure out which function to execute
			var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
			jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

			// Make sure that clicks stop
			event.preventDefault();

			// and execute the function
			return args[ lastToggle ].apply( this, arguments ) || false;
		};

	// link all the functions, so any of them can unbind this click handler
	toggler.guid = guid;
	while ( i < args.length ) {
		args[ i++ ].guid = guid;
	}

	return this.click( toggler );
};

jQuery.fn.live = function( types, data, fn ) {
	migrateWarn("jQuery.fn.live() is deprecated");
	if ( oldLive ) {
		return oldLive.apply( this, arguments );
	}
	jQuery( this.context ).on( types, this.selector, data, fn );
	return this;
};

jQuery.fn.die = function( types, fn ) {
	migrateWarn("jQuery.fn.die() is deprecated");
	if ( oldDie ) {
		return oldDie.apply( this, arguments );
	}
	jQuery( this.context ).off( types, this.selector || "**", fn );
	return this;
};

// Turn global events into document-triggered events
jQuery.event.trigger = function( event, data, elem, onlyHandlers  ){
	if ( !elem && !rajaxEvent.test( event ) ) {
		migrateWarn( "Global events are undocumented and deprecated" );
	}
	return eventTrigger.call( this,  event, data, elem || document, onlyHandlers  );
};
jQuery.each( ajaxEvents.split("|"),
	function( _, name ) {
		jQuery.event.special[ name ] = {
			setup: function() {
				var elem = this;

				// The document needs no shimming; must be !== for oldIE
				if ( elem !== document ) {
					jQuery.event.add( document, name + "." + jQuery.guid, function() {
						jQuery.event.trigger( name, null, elem, true );
					});
					jQuery._data( this, name, jQuery.guid++ );
				}
				return false;
			},
			teardown: function() {
				if ( this !== document ) {
					jQuery.event.remove( document, name + "." + jQuery._data( this, name ) );
				}
				return false;
			}
		};
	}
);


})( jQuery, window );

;/*! jQuery Mobile vGit Build: SHA1: 27e3c18acfebab2d47ee7ed37bd50fc4942c8838 <> Date: Fri Mar 22 08:50:04 2013 -0600 jquerymobile.com | jquery.org/license !*/
(function(e,t,n){typeof define=="function"&&define.amd?define(["jquery"],function(r){return n(r,e,t),r.mobile}):n(e.jQuery,e,t)})(this,document,function(e,t,n,r){(function(e,t,r){var i={};e.mobile=e.extend({},{version:"1.2.1",ns:"",subPageUrlKey:"ui-page",activePageClass:"ui-page-active",activeBtnClass:"ui-btn-active",focusClass:"ui-focus",ajaxEnabled:!0,hashListeningEnabled:!0,linkBindingEnabled:!0,defaultPageTransition:"fade",maxTransitionWidth:!1,minScrollBack:250,touchOverflowEnabled:!1,defaultDialogTransition:"pop",pageLoadErrorMessage:"Error Loading Page",pageLoadErrorMessageTheme:"e",phonegapNavigationEnabled:!1,autoInitializePage:!0,pushStateEnabled:!0,ignoreContentEnabled:!1,orientationChangeEnabled:!0,buttonMarkup:{hoverDelay:200},keyCode:{ALT:18,BACKSPACE:8,CAPS_LOCK:20,COMMA:188,COMMAND:91,COMMAND_LEFT:91,COMMAND_RIGHT:93,CONTROL:17,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,INSERT:45,LEFT:37,MENU:93,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SHIFT:16,SPACE:32,TAB:9,UP:38,WINDOWS:91},behaviors:{},silentScroll:function(r){e.type(r)!=="number"&&(r=e.mobile.defaultHomeScroll),e.event.special.scrollstart.enabled=!1,setTimeout(function(){t.scrollTo(0,r),e(n).trigger("silentscroll",{x:0,y:r})},20),setTimeout(function(){e.event.special.scrollstart.enabled=!0},150)},nsNormalizeDict:i,nsNormalize:function(t){if(!t)return;return i[t]||(i[t]=e.camelCase(e.mobile.ns+t))},getInheritedTheme:function(e,t){var n=e[0],r="",i=/ui-(bar|body|overlay)-([a-z])\b/,s,o;while(n){s=n.className||"";if(s&&(o=i.exec(s))&&(r=o[2]))break;n=n.parentNode}return r||t||"a"},closestPageData:function(e){return e.closest(':jqmData(role="page"), :jqmData(role="dialog")').data("page")},enhanceable:function(e){return this.haveParents(e,"enhance")},hijackable:function(e){return this.haveParents(e,"ajax")},haveParents:function(t,n){if(!e.mobile.ignoreContentEnabled)return t;var r=t.length,i=e(),s,o,u;for(var a=0;a<r;a++){o=t.eq(a),u=!1,s=t[a];while(s){var f=s.getAttribute?s.getAttribute("data-"+e.mobile.ns+n):"";if(f==="false"){u=!0;break}s=s.parentNode}u||(i=i.add(o))}return i},getScreenHeight:function(){return t.innerHeight||e(t).height()}},e.mobile),e.fn.jqmData=function(t,n){var i;return typeof t!="undefined"&&(t&&(t=e.mobile.nsNormalize(t)),arguments.length<2||n===r?i=this.data(t):i=this.data(t,n)),i},e.jqmData=function(t,n,r){var i;return typeof n!="undefined"&&(i=e.data(t,n?e.mobile.nsNormalize(n):n,r)),i},e.fn.jqmRemoveData=function(t){return this.removeData(e.mobile.nsNormalize(t))},e.jqmRemoveData=function(t,n){return e.removeData(t,e.mobile.nsNormalize(n))},e.fn.removeWithDependents=function(){e.removeWithDependents(this)},e.removeWithDependents=function(t){var n=e(t);(n.jqmData("dependents")||e()).remove(),n.remove()},e.fn.addDependents=function(t){e.addDependents(e(this),t)},e.addDependents=function(t,n){var r=e(t).jqmData("dependents")||e();e(t).jqmData("dependents",e.merge(r,n))},e.fn.getEncodedText=function(){return e("<div/>").text(e(this).text()).html()},e.fn.jqmEnhanceable=function(){return e.mobile.enhanceable(this)},e.fn.jqmHijackable=function(){return e.mobile.hijackable(this)};var s=e.find,o=/:jqmData\(([^)]*)\)/g;e.find=function(t,n,r,i){return t=t.replace(o,"[data-"+(e.mobile.ns||"")+"$1]"),s.call(this,t,n,r,i)},e.extend(e.find,s),e.find.matches=function(t,n){return e.find(t,null,null,n)},e.find.matchesSelector=function(t,n){return e.find(n,null,null,[t]).length>0}})(e,this),function(e,t){var n=0,r=Array.prototype.slice,i=e.cleanData;e.cleanData=function(t){for(var n=0,r;(r=t[n])!=null;n++)try{e(r).triggerHandler("remove")}catch(s){}i(t)},e.widget=function(t,n,r){var i,s,o,u,a=t.split(".")[0];t=t.split(".")[1],i=a+"-"+t,r||(r=n,n=e.Widget),e.expr[":"][i]=function(t){return!!e.data(t,i)},e[a]=e[a]||{},s=e[a][t],o=e[a][t]=function(e,t){if(!this._createWidget)return new o(e,t);arguments.length&&this._createWidget(e,t)},e.extend(o,s,{version:r.version,_proto:e.extend({},r),_childConstructors:[]}),u=new n,u.options=e.widget.extend({},u.options),e.each(r,function(t,i){e.isFunction(i)&&(r[t]=function(){var e=function(){return n.prototype[t].apply(this,arguments)},r=function(e){return n.prototype[t].apply(this,e)};return function(){var t=this._super,n=this._superApply,s;return this._super=e,this._superApply=r,s=i.apply(this,arguments),this._super=t,this._superApply=n,s}}())}),o.prototype=e.widget.extend(u,{widgetEventPrefix:t},r,{constructor:o,namespace:a,widgetName:t,widgetBaseClass:i,widgetFullName:i}),s?(e.each(s._childConstructors,function(t,n){var r=n.prototype;e.widget(r.namespace+"."+r.widgetName,o,n._proto)}),delete s._childConstructors):n._childConstructors.push(o),e.widget.bridge(t,o)},e.widget.extend=function(n){var i=r.call(arguments,1),s=0,o=i.length,u,a;for(;s<o;s++)for(u in i[s])a=i[s][u],i[s].hasOwnProperty(u)&&a!==t&&(n[u]=e.isPlainObject(a)?e.widget.extend({},n[u],a):a);return n},e.widget.bridge=function(n,i){var s=i.prototype.widgetFullName;e.fn[n]=function(o){var u=typeof o=="string",a=r.call(arguments,1),f=this;return o=!u&&a.length?e.widget.extend.apply(null,[o].concat(a)):o,u?this.each(function(){var r,i=e.data(this,s);if(!i)return e.error("cannot call methods on "+n+" prior to initialization; "+"attempted to call method '"+o+"'");if(!e.isFunction(i[o])||o.charAt(0)==="_")return e.error("no such method '"+o+"' for "+n+" widget instance");r=i[o].apply(i,a);if(r!==i&&r!==t)return f=r&&r.jquery?f.pushStack(r.get()):r,!1}):this.each(function(){var t=e.data(this,s);t?t.option(o||{})._init():new i(o,this)}),f}},e.Widget=function(e,t){},e.Widget._childConstructors=[],e.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",defaultElement:"<div>",options:{disabled:!1,create:null},_createWidget:function(t,r){r=e(r||this.defaultElement||this)[0],this.element=e(r),this.uuid=n++,this.eventNamespace="."+this.widgetName+this.uuid,this.options=e.widget.extend({},this.options,this._getCreateOptions(),t),this.bindings=e(),this.hoverable=e(),this.focusable=e(),r!==this&&(e.data(r,this.widgetName,this),e.data(r,this.widgetFullName,this),this._on({remove:"destroy"}),this.document=e(r.style?r.ownerDocument:r.document||r),this.window=e(this.document[0].defaultView||this.document[0].parentWindow)),this._create(),this._trigger("create",null,this._getCreateEventData()),this._init()},_getCreateOptions:e.noop,_getCreateEventData:e.noop,_create:e.noop,_init:e.noop,destroy:function(){this._destroy(),this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData(e.camelCase(this.widgetFullName)),this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName+"-disabled "+"ui-state-disabled"),this.bindings.unbind(this.eventNamespace),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")},_destroy:e.noop,widget:function(){return this.element},option:function(n,r){var i=n,s,o,u;if(arguments.length===0)return e.widget.extend({},this.options);if(typeof n=="string"){i={},s=n.split("."),n=s.shift();if(s.length){o=i[n]=e.widget.extend({},this.options[n]);for(u=0;u<s.length-1;u++)o[s[u]]=o[s[u]]||{},o=o[s[u]];n=s.pop();if(r===t)return o[n]===t?null:o[n];o[n]=r}else{if(r===t)return this.options[n]===t?null:this.options[n];i[n]=r}}return this._setOptions(i),this},_setOptions:function(e){var t;for(t in e)this._setOption(t,e[t]);return this},_setOption:function(e,t){return this.options[e]=t,e==="disabled"&&(this.widget().toggleClass(this.widgetFullName+"-disabled ui-state-disabled",!!t).attr("aria-disabled",t),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")),this},enable:function(){return this._setOption("disabled",!1)},disable:function(){return this._setOption("disabled",!0)},_on:function(t,n){n?(t=e(t),this.bindings=this.bindings.add(t)):(n=t,t=this.element);var r=this;e.each(n,function(n,i){function s(){if(r.options.disabled===!0||e(this).hasClass("ui-state-disabled"))return;return(typeof i=="string"?r[i]:i).apply(r,arguments)}typeof i!="string"&&(s.guid=i.guid=i.guid||s.guid||e.guid++);var o=n.match(/^(\w+)\s*(.*)$/),u=o[1]+r.eventNamespace,a=o[2];a?r.widget().delegate(a,u,s):t.bind(u,s)})},_off:function(e,t){t=(t||"").split(" ").join(this.eventNamespace+" ")+this.eventNamespace,e.unbind(t).undelegate(t)},_delay:function(e,t){function n(){return(typeof e=="string"?r[e]:e).apply(r,arguments)}var r=this;return setTimeout(n,t||0)},_hoverable:function(t){this.hoverable=this.hoverable.add(t),this._on(t,{mouseenter:function(t){e(t.currentTarget).addClass("ui-state-hover")},mouseleave:function(t){e(t.currentTarget).removeClass("ui-state-hover")}})},_focusable:function(t){this.focusable=this.focusable.add(t),this._on(t,{focusin:function(t){e(t.currentTarget).addClass("ui-state-focus")},focusout:function(t){e(t.currentTarget).removeClass("ui-state-focus")}})},_trigger:function(t,n,r){var i,s,o=this.options[t];r=r||{},n=e.Event(n),n.type=(t===this.widgetEventPrefix?t:this.widgetEventPrefix+t).toLowerCase(),n.target=this.element[0],s=n.originalEvent;if(s)for(i in s)i in n||(n[i]=s[i]);return this.element.trigger(n,r),!(e.isFunction(o)&&o.apply(this.element[0],[n].concat(r))===!1||n.isDefaultPrevented())}},e.each({show:"fadeIn",hide:"fadeOut"},function(t,n){e.Widget.prototype["_"+t]=function(r,i,s){typeof i=="string"&&(i={effect:i});var o,u=i?i===!0||typeof i=="number"?n:i.effect||n:t;i=i||{},typeof i=="number"&&(i={duration:i}),o=!e.isEmptyObject(i),i.complete=s,i.delay&&r.delay(i.delay),o&&e.effects&&(e.effects.effect[u]||e.uiBackCompat!==!1&&e.effects[u])?r[t](i):u!==t&&r[u]?r[u](i.duration,i.easing,s):r.queue(function(n){e(this)[t](),s&&s.call(r[0]),n()})}}),e.uiBackCompat!==!1&&(e.Widget.prototype._getCreateOptions=function(){return e.metadata&&e.metadata.get(this.element[0])[this.widgetName]})}(e),function(e,t){e.widget("mobile.widget",{_createWidget:function(){e.Widget.prototype._createWidget.apply(this,arguments),this._trigger("init")},_getCreateOptions:function(){var n=this.element,r={};return e.each(this.options,function(e){var i=n.jqmData(e.replace(/[A-Z]/g,function(e){return"-"+e.toLowerCase()}));i!==t&&(r[e]=i)}),r},enhanceWithin:function(t,n){this.enhance(e(this.options.initSelector,e(t)),n)},enhance:function(t,n){var r,i,s=e(t),o=this;s=e.mobile.enhanceable(s),n&&s.length&&(r=e.mobile.closestPageData(s),i=r&&r.keepNativeSelector()||"",s=s.not(i)),s[this.widgetName]()},raise:function(e){throw"Widget ["+this.widgetName+"]: "+e}})}(e),function(e,t){e.extend(e.mobile,{loadingMessageTextVisible:r,loadingMessageTheme:r,loadingMessage:r,showPageLoadingMsg:function(t,n,r){e.mobile.loading("show",t,n,r)},hidePageLoadingMsg:function(){e.mobile.loading("hide")},loading:function(){this.loaderWidget.loader.apply(this.loaderWidget,arguments)}});var n="ui-loader",i=e("html"),s=e(t);e.widget("mobile.loader",{options:{theme:"a",textVisible:!1,html:"",text:"loading"},defaultHtml:"<div class='"+n+"'>"+"<span class='ui-icon ui-icon-loading'></span>"+"<h1></h1>"+"</div>",fakeFixLoader:function(){var t=e("."+e.mobile.activeBtnClass).first();this.element.css({top:e.support.scrollTop&&s.scrollTop()+s.height()/2||t.length&&t.offset().top||100})},checkLoaderPosition:function(){var t=this.element.offset(),n=s.scrollTop(),r=e.mobile.getScreenHeight();if(t.top<n||t.top-n>r)this.element.addClass("ui-loader-fakefix"),this.fakeFixLoader(),s.unbind("scroll",this.checkLoaderPosition).bind("scroll",e.proxy(this.fakeFixLoader,this))},resetHtml:function(){this.element.html(e(this.defaultHtml).html())},show:function(t,o,u){var a,f,l,c;this.resetHtml(),e.type(t)==="object"?(c=e.extend({},this.options,t),t=c.theme||e.mobile.loadingMessageTheme):(c=this.options,t=t||e.mobile.loadingMessageTheme||c.theme),f=o||e.mobile.loadingMessage||c.text,i.addClass("ui-loading");if(e.mobile.loadingMessage!==!1||c.html)e.mobile.loadingMessageTextVisible!==r?a=e.mobile.loadingMessageTextVisible:a=c.textVisible,this.element.attr("class",n+" ui-corner-all ui-body-"+t+" ui-loader-"+(a||o||t.text?"verbose":"default")+(c.textonly||u?" ui-loader-textonly":"")),c.html?this.element.html(c.html):this.element.find("h1").text(f),this.element.appendTo(e.mobile.pageContainer),this.checkLoaderPosition(),s.bind("scroll",e.proxy(this.checkLoaderPosition,this))},hide:function(){i.removeClass("ui-loading"),e.mobile.loadingMessage&&this.element.removeClass("ui-loader-fakefix"),e(t).unbind("scroll",this.fakeFixLoader),e(t).unbind("scroll",this.checkLoaderPosition)}}),s.bind("pagecontainercreate",function(){e.mobile.loaderWidget=e.mobile.loaderWidget||e(e.mobile.loader.prototype.defaultHtml).loader()})}(e,this),function(e,t,n,r){function x(e){while(e&&typeof e.originalEvent!="undefined")e=e.originalEvent;return e}function T(t,n){var i=t.type,s,o,a,l,c,h,p,d,v;t=e.Event(t),t.type=n,s=t.originalEvent,o=e.event.props,i.search(/^(mouse|click)/)>-1&&(o=f);if(s)for(p=o.length,l;p;)l=o[--p],t[l]=s[l];i.search(/mouse(down|up)|click/)>-1&&!t.which&&(t.which=1);if(i.search(/^touch/)!==-1){a=x(s),i=a.touches,c=a.changedTouches,h=i&&i.length?i[0]:c&&c.length?c[0]:r;if(h)for(d=0,v=u.length;d<v;d++)l=u[d],t[l]=h[l]}return t}function N(t){var n={},r,s;while(t){r=e.data(t,i);for(s in r)r[s]&&(n[s]=n.hasVirtualBinding=!0);t=t.parentNode}return n}function C(t,n){var r;while(t){r=e.data(t,i);if(r&&(!n||r[n]))return t;t=t.parentNode}return null}function k(){g=!1}function L(){g=!0}function A(){E=0,v.length=0,m=!1,L()}function O(){k()}function M(){_(),c=setTimeout(function(){c=0,A()},e.vmouse.resetTimerDuration)}function _(){c&&(clearTimeout(c),c=0)}function D(t,n,r){var i;if(r&&r[t]||!r&&C(n.target,t))i=T(n,t),e(n.target).trigger(i);return i}function P(t){var n=e.data(t.target,s);if(!m&&(!E||E!==n)){var r=D("v"+t.type,t);r&&(r.isDefaultPrevented()&&t.preventDefault(),r.isPropagationStopped()&&t.stopPropagation(),r.isImmediatePropagationStopped()&&t.stopImmediatePropagation())}}function H(t){var n=x(t).touches,r,i;if(n&&n.length===1){r=t.target,i=N(r);if(i.hasVirtualBinding){E=w++,e.data(r,s,E),_(),O(),d=!1;var o=x(t).touches[0];h=o.pageX,p=o.pageY,D("vmouseover",t,i),D("vmousedown",t,i)}}}function B(e){if(g)return;d||D("vmousecancel",e,N(e.target)),d=!0,M()}function j(t){if(g)return;var n=x(t).touches[0],r=d,i=e.vmouse.moveDistanceThreshold,s=N(t.target);d=d||Math.abs(n.pageX-h)>i||Math.abs(n.pageY-p)>i,d&&!r&&D("vmousecancel",t,s),D("vmousemove",t,s),M()}function F(e){if(g)return;L();var t=N(e.target),n;D("vmouseup",e,t);if(!d){var r=D("vclick",e,t);r&&r.isDefaultPrevented()&&(n=x(e).changedTouches[0],v.push({touchID:E,x:n.clientX,y:n.clientY}),m=!0)}D("vmouseout",e,t),d=!1,M()}function I(t){var n=e.data(t,i),r;if(n)for(r in n)if(n[r])return!0;return!1}function q(){}function R(t){var n=t.substr(1);return{setup:function(r,s){I(this)||e.data(this,i,{});var o=e.data(this,i);o[t]=!0,l[t]=(l[t]||0)+1,l[t]===1&&b.bind(n,P),e(this).bind(n,q),y&&(l.touchstart=(l.touchstart||0)+1,l.touchstart===1&&b.bind("touchstart",H).bind("touchend",F).bind("touchmove",j).bind("scroll",B))},teardown:function(r,s){--l[t],l[t]||b.unbind(n,P),y&&(--l.touchstart,l.touchstart||b.unbind("touchstart",H).unbind("touchmove",j).unbind("touchend",F).unbind("scroll",B));var o=e(this),u=e.data(this,i);u&&(u[t]=!1),o.unbind(n,q),I(this)||o.removeData(i)}}}var i="virtualMouseBindings",s="virtualTouchID",o="vmouseover vmousedown vmousemove vmouseup vclick vmouseout vmousecancel".split(" "),u="clientX clientY pageX pageY screenX screenY".split(" "),a=e.event.mouseHooks?e.event.mouseHooks.props:[],f=e.event.props.concat(a),l={},c=0,h=0,p=0,d=!1,v=[],m=!1,g=!1,y="addEventListener"in n,b=e(n),w=1,E=0,S;e.vmouse={moveDistanceThreshold:10,clickDistanceThreshold:10,resetTimerDuration:1500};for(var U=0;U<o.length;U++)e.event.special[o[U]]=R(o[U]);y&&n.addEventListener("click",function(t){var n=v.length,r=t.target,i,o,u,a,f,l;if(n){i=t.clientX,o=t.clientY,S=e.vmouse.clickDistanceThreshold,u=r;while(u){for(a=0;a<n;a++){f=v[a],l=0;if(u===r&&Math.abs(f.x-i)<S&&Math.abs(f.y-o)<S||e.data(u,s)===f.touchID){t.preventDefault(),t.stopPropagation();return}}u=u.parentNode}}},!0)}(e,t,n),function(e,t){var r={touch:"ontouchend"in n};e.mobile=e.mobile||{},e.mobile.support=e.mobile.support||{},e.extend(e.support,r),e.extend(e.mobile.support,r)}(e),function(e,t,r){function f(t,n,r){var i=r.type;r.type=n,e.event.handle.call(t,r),r.type=i}e.each("touchstart touchmove touchend tap taphold swipe swipeleft swiperight scrollstart scrollstop".split(" "),function(t,n){e.fn[n]=function(e){return e?this.bind(n,e):this.trigger(n)},e.attrFn&&(e.attrFn[n]=!0)});var i=e.mobile.support.touch,s="touchmove scroll",o=i?"touchstart":"mousedown",u=i?"touchend":"mouseup",a=i?"touchmove":"mousemove";e.event.special.scrollstart={enabled:!0,setup:function(){function o(e,n){r=n,f(t,r?"scrollstart":"scrollstop",e)}var t=this,n=e(t),r,i;n.bind(s,function(t){if(!e.event.special.scrollstart.enabled)return;r||o(t,!0),clearTimeout(i),i=setTimeout(function(){o(t,!1)},50)})}},e.event.special.tap={tapholdThreshold:750,setup:function(){var t=this,r=e(t);r.bind("vmousedown",function(i){function a(){clearTimeout(u)}function l(){a(),r.unbind("vclick",c).unbind("vmouseup",a),e(n).unbind("vmousecancel",l)}function c(e){l(),s===e.target&&f(t,"tap",e)}if(i.which&&i.which!==1)return!1;var s=i.target,o=i.originalEvent,u;r.bind("vmouseup",a).bind("vclick",c),e(n).bind("vmousecancel",l),u=setTimeout(function(){f(t,"taphold",e.Event("taphold",{target:s}))},e.event.special.tap.tapholdThreshold)})}},e.event.special.swipe={scrollSupressionThreshold:30,durationThreshold:1e3,horizontalDistanceThreshold:30,verticalDistanceThreshold:75,setup:function(){var t=this,n=e(t);n.bind(o,function(t){function f(t){if(!s)return;var n=t.originalEvent.touches?t.originalEvent.touches[0]:t;o={time:(new Date).getTime(),coords:[n.pageX,n.pageY]},Math.abs(s.coords[0]-o.coords[0])>e.event.special.swipe.scrollSupressionThreshold&&t.preventDefault()}var i=t.originalEvent.touches?t.originalEvent.touches[0]:t,s={time:(new Date).getTime(),coords:[i.pageX,i.pageY],origin:e(t.target)},o;n.bind(a,f).one(u,function(t){n.unbind(a,f),s&&o&&o.time-s.time<e.event.special.swipe.durationThreshold&&Math.abs(s.coords[0]-o.coords[0])>e.event.special.swipe.horizontalDistanceThreshold&&Math.abs(s.coords[1]-o.coords[1])<e.event.special.swipe.verticalDistanceThreshold&&s.origin.trigger("swipe").trigger(s.coords[0]>o.coords[0]?"swipeleft":"swiperight"),s=o=r})})}},e.each({scrollstop:"scrollstart",taphold:"tap",swipeleft:"swipe",swiperight:"swipe"},function(t,n){e.event.special[t]={setup:function(){e(this).bind(n,e.noop)}}})}(e,this),function(e,n){e.extend(e.support,{orientation:"orientation"in t&&"onorientationchange"in t})}(e),function(e){e.event.special.throttledresize={setup:function(){e(this).bind("resize",n)},teardown:function(){e(this).unbind("resize",n)}};var t=250,n=function(){s=(new Date).getTime(),o=s-r,o>=t?(r=s,e(this).trigger("throttledresize")):(i&&clearTimeout(i),i=setTimeout(n,t-o))},r=0,i,s,o}(e),function(e,t){function d(){var e=o();e!==u&&(u=e,r.trigger(i))}var r=e(t),i="orientationchange",s,o,u,a,f,l={0:!0,180:!0};if(e.support.orientation){var c=t.innerWidth||e(t).width(),h=t.innerHeight||e(t).height(),p=50;a=c>h&&c-h>p,f=l[t.orientation];if(a&&f||!a&&!f)l={"-90":!0,90:!0}}e.event.special.orientationchange=e.extend({},e.event.special.orientationchange,{setup:function(){if(e.support.orientation&&!e.event.special.orientationchange.disabled)return!1;u=o(),r.bind("throttledresize",d)},teardown:function(){if(e.support.orientation&&!e.event.special.orientationchange.disabled)return!1;r.unbind("throttledresize",d)},add:function(e){var t=e.handler;e.handler=function(e){return e.orientation=o(),t.apply(this,arguments)}}}),e.event.special.orientationchange.orientation=o=function(){var r=!0,i=n.documentElement;return e.support.orientation?r=l[t.orientation]:r=i&&i.clientWidth/i.clientHeight<1.1,r?"portrait":"landscape"},e.fn[i]=function(e){return e?this.bind(i,e):this.trigger(i)},e.attrFn&&(e.attrFn[i]=!0)}(e,this),function(e,r){var i=e(t),s=e("html");e.mobile.media=function(){var t={},r=e("<div id='jquery-mediatest'></div>"),i=e("<body>").append(r);return function(e){if(!(e in t)){var o=n.createElement("style"),u="@media "+e+" { #jquery-mediatest { position:absolute; } }";o.type="text/css",o.styleSheet?o.styleSheet.cssText=u:o.appendChild(n.createTextNode(u)),s.prepend(i).prepend(o),t[e]=r.css("position")==="absolute",i.add(o).remove()}return t[e]}}()}(e),function(e,r){function i(e){var t=e.charAt(0).toUpperCase()+e.substr(1),n=(e+" "+u.join(t+" ")+t).split(" ");for(var i in n)if(o[n[i]]!==r)return!0}function h(e,t,r){var i=n.createElement("div"),s=function(e){return e.charAt(0).toUpperCase()+e.substr(1)},o=function(e){return"-"+e.charAt(0).toLowerCase()+e.substr(1)+"-"},a=function(n){var r=o(n)+e+": "+t+";",u=s(n),a=u+s(e);i.setAttribute("style",r),!i.style[a]||(l=!0)},f=r?[r]:u,l;for(var c=0;c<f.length;c++)a(f[c]);return!!l}function p(){var t="transform-3d";return h("perspective","10px","moz")||e.mobile.media("(-"+u.join("-"+t+"),(-")+"-"+t+"),("+t+")")}function d(){var t=location.protocol+"//"+location.host+location.pathname+"ui-dir/",n=e("head base"),r=null,i="",o,u;return n.length?i=n.attr("href"):n=r=e("<base>",{href:t}).appendTo("head"),o=e("<a href='testurl' />").prependTo(s),u=o[0].href,n[0].href=i||location.pathname,r&&r.remove(),u.indexOf(t)===0}function v(){var e=n.createElement("x"),r=n.documentElement,i=t.getComputedStyle,s;return"pointerEvents"in e.style?(e.style.pointerEvents="auto",e.style.pointerEvents="x",r.appendChild(e),s=i&&i(e,"").pointerEvents==="auto",r.removeChild(e),!!s):!1}function m(){var e=n.createElement("div");return typeof e.getBoundingClientRect!="undefined"}var s=e("<body>").prependTo("html"),o=s[0].style,u=["Webkit","Moz","O"],a="palmGetResource"in t,f=t.opera,l=t.operamini&&{}.toString.call(t.operamini)==="[object OperaMini]",c=t.blackberry&&!i("-webkit-transform");e.extend(e.mobile,{browser:{}}),e.mobile.browser.ie=function(){var e=3,t=n.createElement("div"),r=t.all||[];do t.innerHTML="<!--[if gt IE "+ ++e+"]><br><![endif]-->";while(r[0]);return e>4?e:!e}(),e.extend(e.support,{cssTransitions:"WebKitTransitionEvent"in t||h("transition","height 100ms linear")&&!f,pushState:"pushState"in history&&"replaceState"in history,mediaquery:e.mobile.media("only all"),cssPseudoElement:!!i("content"),touchOverflow:!!i("overflowScrolling"),cssTransform3d:p(),boxShadow:!!i("boxShadow")&&!c,scrollTop:("pageXOffset"in t||"scrollTop"in n.documentElement||"scrollTop"in s[0])&&!a&&!l,dynamicBaseTag:d(),cssPointerEvents:v(),boundingRect:m()}),s.remove();var g=function(){var e=t.navigator.userAgent;return e.indexOf("Nokia")>-1&&(e.indexOf("Symbian/3")>-1||e.indexOf("Series60/5")>-1)&&e.indexOf("AppleWebKit")>-1&&e.match(/(BrowserNG|NokiaBrowser)\/7\.[0-3]/)}();e.mobile.gradeA=function(){return(e.support.mediaquery||e.mobile.browser.ie&&e.mobile.browser.ie>=7)&&(e.support.boundingRect||e.fn.jquery.match(/1\.[0-7+]\.[0-9+]?/)!==null)},e.mobile.ajaxBlacklist=t.blackberry&&!t.WebKitPoint||l||g,g&&e(function(){e("head link[rel='stylesheet']").attr("rel","alternate stylesheet").attr("rel","stylesheet")}),e.support.boxShadow||e("html").addClass("ui-mobile-nosupport-boxshadow")}(e),function(e,t){e.widget("mobile.page",e.mobile.widget,{options:{theme:"c",domCache:!1,keepNativeDefault:":jqmData(role='none'), :jqmData(role='nojs')"},_create:function(){var e=this;if(e._trigger("beforecreate")===!1)return!1;e.element.attr("tabindex","0").addClass("ui-page ui-body-"+e.options.theme).bind("pagebeforehide",function(){e.removeContainerBackground()}).bind("pagebeforeshow",function(){e.setContainerBackground()})},removeContainerBackground:function(){e.mobile.pageContainer.removeClass("ui-overlay-"+e.mobile.getInheritedTheme(this.element.parent()))},setContainerBackground:function(t){this.options.theme&&e.mobile.pageContainer.addClass("ui-overlay-"+(t||this.options.theme))},keepNativeSelector:function(){var t=this.options,n=t.keepNative&&e.trim(t.keepNative);return n&&t.keepNative!==t.keepNativeDefault?[t.keepNative,t.keepNativeDefault].join(", "):t.keepNativeDefault}})}(e),function(e,t,r){function l(e){return e=e||location.href,"#"+e.replace(/^[^#]*#?(.*)$/,"$1")}var i="hashchange",s=n,o,u=e.event.special,a=s.documentMode,f="on"+i in t&&(a===r||a>7);e.fn[i]=function(e){return e?this.bind(i,e):this.trigger(i)},e.fn[i].delay=50,u[i]=e.extend(u[i],{setup:function(){if(f)return!1;e(o.start)},teardown:function(){if(f)return!1;e(o.stop)}}),o=function(){function p(){var n=l(),r=h(u);n!==u?(c(u=n,r),e(t).trigger(i)):r!==u&&(location.href=location.href.replace(/#.*/,"")+r),o=setTimeout(p,e.fn[i].delay)}var n={},o,u=l(),a=function(e){return e},c=a,h=a;return n.start=function(){o||p()},n.stop=function(){o&&clearTimeout(o),o=r},e.browser.msie&&!f&&function(){var t,r;n.start=function(){t||(r=e.fn[i].src,r=r&&r+l(),t=e('<iframe tabindex="-1" title="empty"/>').hide().one("load",function(){r||c(l()),p()}).attr("src",r||"javascript:0").insertAfter("body")[0].contentWindow,s.onpropertychange=function(){try{event.propertyName==="title"&&(t.document.title=s.title)}catch(e){}})},n.stop=a,h=function(){return l(t.location.href)},c=function(n,r){var o=t.document,u=e.fn[i].domain;n!==r&&(o.title=s.title,o.open(),u&&o.write('<script>document.domain="'+u+'"</script>'),o.close(),t.location.hash=n)}}(),n}()}(e,this),function(e,t,n){var r=function(r){return r===n&&(r=!0),function(n,i,s,o){var u=new e.Deferred,a=i?" reverse":"",f=e.mobile.urlHistory.getActive(),l=f.lastScroll||e.mobile.defaultHomeScroll,c=e.mobile.getScreenHeight(),h=e.mobile.maxTransitionWidth!==!1&&e(t).width()>e.mobile.maxTransitionWidth,p=!e.support.cssTransitions||h||!n||n==="none"||Math.max(e(t).scrollTop(),l)>e.mobile.getMaxScrollForTransition(),d=" ui-page-pre-in",v=function(){e.mobile.pageContainer.toggleClass("ui-mobile-viewport-transitioning viewport-"+n)},m=function(){e.event.special.scrollstart.enabled=!1,t.scrollTo(0,l),setTimeout(function(){e.event.special.scrollstart.enabled=!0},150)},g=function(){o.removeClass(e.mobile.activePageClass+" out in reverse "+n).height("")},y=function(){r?o.animationComplete(b):b(),o.height(c+e(t).scrollTop()).addClass(n+" out"+a)},b=function(){o&&r&&g(),w()},w=function(){s.css("z-index",-10),s.addClass(e.mobile.activePageClass+d),e.mobile.focusPage(s),s.height(c+l),m(),s.css("z-index",""),p||s.animationComplete(E),s.removeClass(d).addClass(n+" in"+a),p&&E()},E=function(){r||o&&g(),s.removeClass("out in reverse "+n).height(""),v(),e(t).scrollTop()!==l&&m(),u.resolve(n,i,s,o,!0)};return v(),o&&!p?y():b(),u.promise()}},i=r(),s=r(!1),o=function(){return e.mobile.getScreenHeight()*3};e.mobile.defaultTransitionHandler=i,e.mobile.transitionHandlers={"default":e.mobile.defaultTransitionHandler,sequential:i,simultaneous:s},e.mobile.transitionFallbacks={},e.mobile._maybeDegradeTransition=function(t){return t&&!e.support.cssTransform3d&&e.mobile.transitionFallbacks[t]&&(t=e.mobile.transitionFallbacks[t]),t},e.mobile.getMaxScrollForTransition=e.mobile.getMaxScrollForTransition||o}(e,this),function(e,r){function w(t){!!a&&(!a.closest("."+e.mobile.activePageClass).length||t)&&a.removeClass(e.mobile.activeBtnClass),a=null}function E(){h=!1,c.length>0&&e.mobile.changePage.apply(null,c.pop())}function N(t,n,r,i){n&&n.data("page")._trigger("beforehide",null,{nextPage:t}),t.data("page")._trigger("beforeshow",null,{prevPage:n||e("")}),e.mobile.hidePageLoadingMsg(),r=e.mobile._maybeDegradeTransition(r);var s=e.mobile.transitionHandlers[r||"default"]||e.mobile.defaultTransitionHandler,o=s(r,i,t,n);return o.done(function(){n&&n.data("page")._trigger("hide",null,{nextPage:t}),t.data("page")._trigger("show",null,{prevPage:n||e("")})}),o}function C(){var t=e("."+e.mobile.activePageClass),n=parseFloat(t.css("padding-top")),r=parseFloat(t.css("padding-bottom")),i=parseFloat(t.css("border-top-width")),s=parseFloat(t.css("border-bottom-width"));t.css("min-height",y()-n-r-i-s)}function k(t,n){n&&t.attr("data-"+e.mobile.ns+"role",n),t.page()}function L(e){while(e){if(typeof e.nodeName=="string"&&e.nodeName.toLowerCase()==="a")break;e=e.parentNode}return e}function A(t){var n=e(t).closest(".ui-page").jqmData("url"),r=m.hrefNoHash;if(!n||!u.isPath(n))n=r;return u.makeUrlAbsolute(n,r)}var i=e(t),s=e("html"),o=e("head"),u={urlParseRE:/^(((([^:\/#\?]+:)?(?:(\/\/)((?:(([^:@\/#\?]+)(?:\:([^:@\/#\?]+))?)@)?(([^:\/#\?\]\[]+|\[[^\/\]@#?]+\])(?:\:([0-9]+))?))?)?)?((\/?(?:[^\/\?#]+\/+)*)([^\?#]*)))?(\?[^#]+)?)(#.*)?/,getLocation:function(e){var t=e?this.parseUrl(e):location,n=this.parseUrl(e||location.href).hash;return n=n==="#"?"":n,t.protocol+"//"+t.host+t.pathname+t.search+n},parseLocation:function(){return this.parseUrl(this.getLocation())},parseUrl:function(t){if(e.type(t)==="object")return t;var n=u.urlParseRE.exec(t||"")||[];return{href:n[0]||"",hrefNoHash:n[1]||"",hrefNoSearch:n[2]||"",domain:n[3]||"",protocol:n[4]||"",doubleSlash:n[5]||"",authority:n[6]||"",username:n[8]||"",password:n[9]||"",host:n[10]||"",hostname:n[11]||"",port:n[12]||"",pathname:n[13]||"",directory:n[14]||"",filename:n[15]||"",search:n[16]||"",hash:n[17]||""}},makePathAbsolute:function(e,t){if(e&&e.charAt(0)==="/")return e;e=e||"",t=t?t.replace(/^\/|(\/[^\/]*|[^\/]+)$/g,""):"";var n=t?t.split("/"):[],r=e.split("/");for(var i=0;i<r.length;i++){var s=r[i];switch(s){case".":break;case"..":n.length&&n.pop();break;default:n.push(s)}}return"/"+n.join("/")},isSameDomain:function(e,t){return u.parseUrl(e).domain===u.parseUrl(t).domain},isRelativeUrl:function(e){return u.parseUrl(e).protocol===""},isAbsoluteUrl:function(e){return u.parseUrl(e).protocol!==""},makeUrlAbsolute:function(e,t){if(!u.isRelativeUrl(e))return e;t===r&&(t=m);var n=u.parseUrl(e),i=u.parseUrl(t),s=n.protocol||i.protocol,o=n.protocol?n.doubleSlash:n.doubleSlash||i.doubleSlash,a=n.authority||i.authority,f=n.pathname!=="",l=u.makePathAbsolute(n.pathname||i.filename,i.pathname),c=n.search||!f&&i.search||"",h=n.hash;return s+o+a+l+c+h},addSearchParams:function(t,n){var r=u.parseUrl(t),i=typeof n=="object"?e.param(n):n,s=r.search||"?";return r.hrefNoSearch+s+(s.charAt(s.length-1)!=="?"?"&":"")+i+(r.hash||"")},convertUrlToDataUrl:function(e){var n=u.parseUrl(e);return u.isEmbeddedPage(n)?n.hash.split(p)[0].replace(/^#/,""):u.isSameDomain(n,m)?n.hrefNoHash.replace(m.domain,"").split(p)[0]:t.decodeURIComponent(e)},get:function(e){return e===r&&(e=u.parseLocation().hash),u.stripHash(e).replace(/[^\/]*\.[^\/*]+$/,"")},getFilePath:function(t){var n="&"+e.mobile.subPageUrlKey;return t&&t.split(n)[0].split(p)[0]},set:function(e){location.hash=e},isPath:function(e){return/\//.test(e)},clean:function(e){return e.replace(m.domain,"")},stripHash:function(e){return e.replace(/^#/,"")},cleanHash:function(e){return u.stripHash(e.replace(/\?.*$/,"").replace(p,""))},isHashValid:function(e){return/^#[^#]+$/.test(e)},isExternal:function(e){var t=u.parseUrl(e);return t.protocol&&t.domain!==v.domain?!0:!1},hasProtocol:function(e){return/^(:?\w+:)/.test(e)},isFirstPageUrl:function(t){var n=u.parseUrl(u.makeUrlAbsolute(t,m)),i=n.hrefNoHash===v.hrefNoHash||g&&n.hrefNoHash===m.hrefNoHash,s=e.mobile.firstPage,o=s&&s[0]?s[0].id:r;return i&&(!n.hash||n.hash==="#"||o&&n.hash.replace(/^#/,"")===o)},isEmbeddedPage:function(e){var t=u.parseUrl(e);return t.protocol!==""?t.hash&&(t.hrefNoHash===v.hrefNoHash||g&&t.hrefNoHash===m.hrefNoHash):/^#/.test(t.href)},isPermittedCrossDomainRequest:function(t,n){return e.mobile.allowCrossDomainPages&&t.protocol==="file:"&&n.search(/^https?:/)!==-1}},a=null,f={stack:[],activeIndex:0,getActive:function(){return f.stack[f.activeIndex]},getPrev:function(){return f.stack[f.activeIndex-1]},getNext:function(){return f.stack[f.activeIndex+1]},addNew:function(e,t,n,r,i){f.getNext()&&f.clearForward(),f.stack.push({url:e,transition:t,title:n,pageUrl:r,role:i}),f.activeIndex=f.stack.length-1},clearForward:function(){f.stack=f.stack.slice(0,f.activeIndex+1)},directHashChange:function(t){var n,i,s,o=this.getActive();e.each(f.stack,function(e,r){decodeURIComponent(t.currentUrl)===decodeURIComponent(r.url)&&(n=e<f.activeIndex,i=!n,s=e)}),this.activeIndex=s!==r?s:this.activeIndex,n?(t.either||t.isBack)(!0):i&&(t.either||t.isForward)(!1)},ignoreNextHashChange:!1},l="[tabindex],a,button:visible,select:visible,input",c=[],h=!1,p="&ui-state=dialog",d=o.children("base"),v=u.parseLocation(),m=d.length?u.parseUrl(u.makeUrlAbsolute(d.attr("href"),v.href)):v,g=v.hrefNoHash!==m.hrefNoHash,y=e.mobile.getScreenHeight,b=e.support.dynamicBaseTag?{element:d.length?d:e("<base>",{href:m.hrefNoHash}).prependTo(o),set:function(e){b.element.attr("href",u.makeUrlAbsolute(e,m))},reset:function(){b.element.attr("href",m.hrefNoHash)}}:r;e.mobile.back=function(){var e=t.navigator;this.phonegapNavigationEnabled&&e&&e.app&&e.app.backHistory?e.app.backHistory():t.history.back()},e.mobile.focusPage=function(e){var t=e.find("[autofocus]"),n=e.find(".ui-title:eq(0)");if(t.length){t.focus();return}n.length?n.focus():e.focus()};var S=!0,x,T;x=function(){if(!S)return;var t=e.mobile.urlHistory.getActive();if(t){var n=i.scrollTop();t.lastScroll=n<e.mobile.minScrollBack?e.mobile.defaultHomeScroll:n}},T=function(){setTimeout(x,100)},i.bind(e.support.pushState?"popstate":"hashchange",function(){S=!1}),i.one(e.support.pushState?"popstate":"hashchange",function(){S=!0}),i.one("pagecontainercreate",function(){e.mobile.pageContainer.bind("pagechange",function(){S=!0,i.unbind("scrollstop",T),i.bind("scrollstop",T)})}),i.bind("scrollstop",T),e.mobile._maybeDegradeTransition=e.mobile._maybeDegradeTransition||function(e){return e},e.fn.animationComplete=function(t){return e.support.cssTransitions?e(this).one("webkitAnimationEnd animationend",t):(setTimeout(t,0),e(this))},e.mobile.path=u,e.mobile.base=b,e.mobile.urlHistory=f,e.mobile.dialogHashKey=p,e.mobile.allowCrossDomainPages=!1,e.mobile.getDocumentUrl=function(t){return t?e.extend({},v):v.href},e.mobile.getDocumentBase=function(t){return t?e.extend({},m):m.href},e.mobile._bindPageRemove=function(){var t=e(this);!t.data("page").options.domCache&&t.is(":jqmData(external-page='true')")&&t.bind("pagehide.remove",function(){var t=e(this),n=new e.Event("pageremove");t.trigger(n),n.isDefaultPrevented()||t.removeWithDependents()})},e.mobile.loadPage=function(t,n){var i=e.Deferred(),s=e.extend({},e.mobile.loadPage.defaults,n),o=null,a=null,f=function(){var t=e.mobile.activePage&&A(e.mobile.activePage);return t||m.hrefNoHash},l=u.makeUrlAbsolute(t,f());s.data&&s.type==="get"&&(l=u.addSearchParams(l,s.data),s.data=r),s.data&&s.type==="post"&&(s.reloadPage=!0);var c=u.getFilePath(l),h=u.convertUrlToDataUrl(l);s.pageContainer=s.pageContainer||e.mobile.pageContainer,o=s.pageContainer.children("[data-"+e.mobile.ns+"url='"+h+"']"),o.length===0&&h&&!u.isPath(h)&&(o=s.pageContainer.children("#"+h).attr("data-"+e.mobile.ns+"url",h).jqmData("url",h));if(o.length===0)if(e.mobile.firstPage&&u.isFirstPageUrl(c))e.mobile.firstPage.parent().length&&(o=e(e.mobile.firstPage));else if(u.isEmbeddedPage(c))return i.reject(l,n),i.promise();if(o.length){if(!s.reloadPage)return k(o,s.role),i.resolve(l,n,o),b&&!n.prefetch&&b.set(t),i.promise();a=o}var p=s.pageContainer,d=new e.Event("pagebeforeload"),g={url:t,absUrl:l,dataUrl:h,deferred:i,options:s};p.trigger(d,g);if(d.isDefaultPrevented())return i.promise();if(s.showLoadMsg)var y=setTimeout(function(){e.mobile.showPageLoadingMsg()},s.loadMsgDelay),w=function(){clearTimeout(y),e.mobile.hidePageLoadingMsg()};return b&&typeof n.prefetch=="undefined"&&b.reset(),!e.mobile.allowCrossDomainPages&&!u.isSameDomain(v,l)?i.reject(l,n):e.ajax({url:c,type:s.type,data:s.data,dataType:"html",success:function(r,f,p){var d=e("<div></div>"),v=r.match(/<title[^>]*>([^<]*)/)&&RegExp.$1,m=new RegExp("(<[^>]+\\bdata-"+e.mobile.ns+"role=[\"']?page[\"']?[^>]*>)"),y=new RegExp("\\bdata-"+e.mobile.ns+"url=[\"']?([^\"'>]*)[\"']?");m.test(r)&&RegExp.$1&&y.test(RegExp.$1)&&RegExp.$1&&(t=c=u.getFilePath(e("<div>"+RegExp.$1+"</div>").text())),b&&typeof n.prefetch=="undefined"&&b.set(c),d.get(0).innerHTML=r,o=d.find(":jqmData(role='page'), :jqmData(role='dialog')").first(),o.length||(o=e("<div data-"+e.mobile.ns+"role='page'>"+r.split(/<\/?body[^>]*>/gmi)[1]+"</div>")),v&&!o.jqmData("title")&&(~v.indexOf("&")&&(v=e("<div>"+v+"</div>").text()),o.jqmData("title",v));if(!e.support.dynamicBaseTag){var E=u.get(c);o.find("[src], link[href], a[rel='external'], :jqmData(ajax='false'), a[target]").each(function(){var t=e(this).is("[href]")?"href":e(this).is("[src]")?"src":"action",n=e(this).attr(t);n=n.replace(location.protocol+"//"+location.host+location.pathname,""),/^(\w+:|#|\/)/.test(n)||e(this).attr(t,E+n)})}o.attr("data-"+e.mobile.ns+"url",u.convertUrlToDataUrl(c)).attr("data-"+e.mobile.ns+"external-page",!0).appendTo(s.pageContainer),o.one("pagecreate",e.mobile._bindPageRemove),k(o,s.role),l.indexOf("&"+e.mobile.subPageUrlKey)>-1&&(o=s.pageContainer.children("[data-"+e.mobile.ns+"url='"+h+"']")),s.showLoadMsg&&w(),g.xhr=p,g.textStatus=f,g.page=o,s.pageContainer.trigger("pageload",g),i.resolve(l,n,o,a)},error:function(t,r,o){b&&b.set(u.get()),g.xhr=t,g.textStatus=r,g.errorThrown=o;var a=new e.Event("pageloadfailed");s.pageContainer.trigger(a,g);if(a.isDefaultPrevented())return;s.showLoadMsg&&(w(),e.mobile.showPageLoadingMsg(e.mobile.pageLoadErrorMessageTheme,e.mobile.pageLoadErrorMessage,!0),setTimeout(e.mobile.hidePageLoadingMsg,1500)),i.reject(l,n)}}),i.promise()},e.mobile.loadPage.defaults={type:"get",data:r,reloadPage:!1,role:r,showLoadMsg:!1,pageContainer:r,loadMsgDelay:50},e.mobile.changePage=function(t,i){if(h){c.unshift(arguments);return}var s=e.extend({},e.mobile.changePage.defaults,i);s.pageContainer=s.pageContainer||e.mobile.pageContainer,s.fromPage=s.fromPage||e.mobile.activePage;var o=s.pageContainer,a=new e.Event("pagebeforechange"),l={toPage:t,options:s};o.trigger(a,l);if(a.isDefaultPrevented())return;t=l.toPage,h=!0;if(typeof t=="string"){e.mobile.loadPage(t,s).done(function(t,n,r,i){h=!1,n.duplicateCachedPage=i,e.mobile.changePage(r,n)}).fail(function(e,t){w(!0),E(),s.pageContainer.trigger("pagechangefailed",l)});return}t[0]===e.mobile.firstPage[0]&&!s.dataUrl&&(s.dataUrl=v.hrefNoHash);var d=s.fromPage,m=s.dataUrl&&u.convertUrlToDataUrl(s.dataUrl)||t.jqmData("url"),g=m,y=u.getFilePath(m),b=f.getActive(),S=f.activeIndex===0,x=0,T=n.title,C=s.role==="dialog"||t.jqmData("role")==="dialog";if(d&&d[0]===t[0]&&!s.allowSamePageTransition){h=!1,o.trigger("pagechange",l),s.fromHashChange&&f.directHashChange({currentUrl:m,isBack:function(){},isForward:function(){}});return}k(t,s.role),s.fromHashChange&&f.directHashChange({currentUrl:m,isBack:function(){x=-1},isForward:function(){x=1}});try{n.activeElement&&n.activeElement.nodeName.toLowerCase()!=="body"?e(n.activeElement).blur():e("input:focus, textarea:focus, select:focus").blur()}catch(L){}var A=!1;C&&b&&(b.url&&b.url.indexOf(p)>-1&&!e.mobile.activePage.is(".ui-dialog")&&(s.changeHash=!1,A=!0),m=(b.url||"")+(A?"":p),f.activeIndex===0&&m===f.initialDst&&(m+=p)),s.changeHash!==!1&&m&&(f.ignoreNextHashChange=!0,u.set(m));var O=b?t.jqmData("title")||t.children(":jqmData(role='header')").find(".ui-title").getEncodedText():T;!!O&&T===n.title&&(T=O),t.jqmData("title")||t.jqmData("title",T),s.transition=s.transition||(x&&!S?b.transition:r)||(C?e.mobile.defaultDialogTransition:e.mobile.defaultPageTransition),x||(A&&(f.activeIndex=Math.max(0,f.activeIndex-1)),f.addNew(m,s.transition,T,g,s.role)),n.title=f.getActive().title,e.mobile.activePage=t,s.reverse=s.reverse||x<0,N(t,d,s.transition,s.reverse).done(function(n,r,i,u,a){w(),s.duplicateCachedPage&&s.duplicateCachedPage.remove(),a||e.mobile.focusPage(t),E(),o.trigger("pagechange",l)})},e.mobile.changePage.defaults={transition:r,reverse:!1,changeHash:!0,fromHashChange:!1,role:r,duplicateCachedPage:r,pageContainer:r,showLoadMsg:!0,dataUrl:r,fromPage:r,allowSamePageTransition:!1},e.mobile.navreadyDeferred=e.Deferred(),e.mobile._registerInternalEvents=function(){e(n).delegate("form","submit",function(t){var n=e(this);if(!e.mobile.ajaxEnabled||n.is(":jqmData(ajax='false')")||!n.jqmHijackable().length)return;var r=n.attr("method"),i=n.attr("target"),s=n.attr("action");s||(s=A(n),s===m.hrefNoHash&&(s=v.hrefNoSearch)),s=u.makeUrlAbsolute(s,A(n));if(u.isExternal(s)&&!u.isPermittedCrossDomainRequest(v,s)||i)return;e.mobile.changePage(s,{type:r&&r.length&&r.toLowerCase()||"get",data:n.serialize(),transition:n.jqmData("transition"),reverse:n.jqmData("direction")==="reverse",reloadPage:!0}),t.preventDefault()}),e(n).bind("vclick",function(t){if(t.which>1||!e.mobile.linkBindingEnabled)return;var n=L(t.target);if(!e(n).jqmHijackable().length)return;n&&u.parseUrl(n.getAttribute("href")||"#").hash!=="#"&&(w(!0),a=e(n).closest(".ui-btn").not(".ui-disabled"),a.addClass(e.mobile.activeBtnClass))}),e(n).bind("click",function(n){if(!e.mobile.linkBindingEnabled)return;var i=L(n.target),s=e(i),o;if(!i||n.which>1||!s.jqmHijackable().length)return;o=function(){t.setTimeout(function(){w(!0)},200)};if(s.is(":jqmData(rel='back')"))return e.mobile.back(),!1;var a=A(s),f=u.makeUrlAbsolute(s.attr("href")||"#",a);if(!e.mobile.ajaxEnabled&&!u.isEmbeddedPage(f)){o();return}if(f.search("#")!==-1){f=f.replace(/[^#]*#/,"");if(!f){n.preventDefault();return}u.isPath(f)?f=u.makeUrlAbsolute(f,a):f=u.makeUrlAbsolute("#"+f,v.hrefNoHash)}var l=s.is("[rel='external']")||s.is(":jqmData(ajax='false')")||s.is("[target]"),c=l||u.isExternal(f)&&!u.isPermittedCrossDomainRequest(v,f);if(c){o();return}var h=s.jqmData("transition"),p=s.jqmData("direction")==="reverse"||s.jqmData("back"),d=s.attr("data-"+e.mobile.ns+"rel")||r;e.mobile.changePage(f,{transition:h,reverse:p,role:d,link:s}),n.preventDefault()}),e(n).delegate(".ui-page","pageshow.prefetch",function(){var t=[];e(this).find("a:jqmData(prefetch)").each(function(){var n=e(this),r=n.attr("href");r&&e.inArray(r,t)===-1&&(t.push(r),e.mobile.loadPage(r,{role:n.attr("data-"+e.mobile.ns+"rel"),prefetch:!0}))})}),e.mobile._handleHashChange=function(n){var i=u.stripHash(n),s=e.mobile.urlHistory.stack.length===0?"none":r,o=new e.Event("navigate"),a={transition:s,changeHash:!1,fromHashChange:!0};0===f.stack.length&&(f.initialDst=i),e.mobile.pageContainer.trigger(o);if(o.isDefaultPrevented())return;if(!e.mobile.hashListeningEnabled||f.ignoreNextHashChange){f.ignoreNextHashChange=!1;return}if(f.stack.length>1&&i.indexOf(p)>-1&&f.initialDst!==i){if(!e.mobile.activePage.is(".ui-dialog")){f.directHashChange({currentUrl:i,isBack:function(){e.mobile.back()},isForward:function(){t.history.forward()}});return}f.directHashChange({currentUrl:i,either:function(t){var n=e.mobile.urlHistory.getActive();i=n.pageUrl,e.extend(a,{role:n.role,transition:n.transition,reverse:t})}})}i?(i=typeof i=="string"&&!u.isPath(i)?u.makeUrlAbsolute("#"+i,m):i,i===u.makeUrlAbsolute("#"+f.initialDst,m)&&f.stack.length&&f.stack[0].url!==f.initialDst.replace(p,"")&&(i=e.mobile.firstPage),e.mobile.changePage(i,a)):e.mobile.changePage(e.mobile.firstPage,a)},i.bind("hashchange",function(t,n){e.mobile._handleHashChange(u.parseLocation().hash)}),e(n).bind("pageshow",C),e(t).bind("throttledresize",C)},e.mobile.navreadyDeferred.done(function(){e.mobile._registerInternalEvents()})}(e),function(e,t){var i={},s=i,o=e(t),u=e.mobile.path.parseLocation(),a=e.Deferred(),f=e.Deferred();e(n).ready(e.proxy(f,"resolve")),e(n).one("mobileinit",e.proxy(a,"resolve")),e.extend(i,{initialFilePath:function(){return u.pathname+u.search}(),hashChangeTimeout:200,hashChangeEnableTimer:r,initialHref:u.hrefNoHash,state:function(){return{hash:e.mobile.path.parseLocation().hash||"#"+s.initialFilePath,title:n.title,initialHref:s.initialHref}},resetUIKeys:function(t){var n=e.mobile.dialogHashKey,r="&"+e.mobile.subPageUrlKey,i=t.indexOf(n);return i>-1?t=t.slice(0,i)+"#"+t.slice(i):t.indexOf(r)>-1&&(t=t.split(r).join("#"+r)),t},nextHashChangePrevented:function(t){e.mobile.urlHistory.ignoreNextHashChange=t,s.onHashChangeDisabled=t},onHashChange:function(t){if(s.onHashChangeDisabled)return;var r,i,o=e.mobile.path.parseLocation().hash,u=e.mobile.path.isPath(o),a=u?e.mobile.path.getLocation():e.mobile.getDocumentUrl();o=u?o.replace("#",""):o,i=s.state(),r=e.mobile.path.makeUrlAbsolute(o,a),u&&(r=s.resetUIKeys(r)),history.replaceState(i,n.title,r)},onPopState:function(t){var n=t.originalEvent.state,r,i,o;n&&(clearTimeout(s.hashChangeEnableTimer),s.nextHashChangePrevented(!1),e.mobile._handleHashChange(n.hash),s.nextHashChangePrevented(!0),s.hashChangeEnableTimer=setTimeout(function(){s.nextHashChangePrevented(!1)},s.hashChangeTimeout))},init:function(){o.bind("hashchange",s.onHashChange),o.bind("popstate",s.onPopState),location.hash===""&&history.replaceState(s.state(),n.title,e.mobile.path.getLocation())}}),e.when(f,a,e.mobile.navreadyDeferred).done(function(){e.mobile.pushStateEnabled&&e.support.pushState&&i.init()})}(e,this),function(e,t,n){e.mobile.transitionFallbacks.flip="fade"}(e,this),function(e,t,n){e.mobile.transitionFallbacks.flow="fade"}(e,this),function(e,t,n){e.mobile.transitionFallbacks.pop="fade"}(e,this),function(e,t,n){e.mobile.transitionHandlers.slide=e.mobile.transitionHandlers.simultaneous,e.mobile.transitionFallbacks.slide="fade"}(e,this),function(e,t,n){e.mobile.transitionFallbacks.slidedown="fade"}(e,this),function(e,t,n){e.mobile.transitionFallbacks.slidefade="fade"}(e,this),function(e,t,n){e.mobile.transitionFallbacks.slideup="fade"}(e,this),function(e,t,n){e.mobile.transitionFallbacks.turn="fade"}(e,this),function(e,t){e.mobile.page.prototype.options.degradeInputs={color:!1,date:!1,datetime:!1,"datetime-local":!1,email:!1,month:!1,number:!1,range:"number",search:"text",tel:!1,time:!1,url:!1,week:!1},e(n).bind("pagecreate create",function(t){var n=e.mobile.closestPageData(e(t.target)),r;if(!n)return;r=n.options,e(t.target).find("input").not(n.keepNativeSelector()).each(function(){var t=e(this),n=this.getAttribute("type"),i=r.degradeInputs[n]||"text";if(r.degradeInputs[n]){var s=e("<div>").html(t.clone()).html(),o=s.indexOf(" type=")>-1,u=o?/\s+type=["']?\w+['"]?/:/\/?>/,a=' type="'+i+'" data-'+e.mobile.ns+'type="'+n+'"'+(o?"":">");t.replaceWith(s.replace(u,a))}})})}(e),function(e,t,r){e.widget("mobile.dialog",e.mobile.widget,{options:{closeBtnText:"Close",overlayTheme:"a",initSelector:":jqmData(role='dialog')"},_create:function(){var t=this,n=this.element,r=e("<a href='#' data-"+e.mobile.ns+"icon='delete' data-"+e.mobile.ns+"iconpos='notext'>"+this.options.closeBtnText+"</a>"),i=e("<div/>",{role:"dialog","class":"ui-dialog-contain ui-corner-all ui-overlay-shadow"});n.addClass("ui-dialog ui-overlay-"+this.options.overlayTheme),n.wrapInner(i).children().find(":jqmData(role='header')").first().prepend(r).end().end().children(":first-child").addClass("ui-corner-top").end().children(":last-child").addClass("ui-corner-bottom"),r.bind("click",function(){t.close()}),n.bind("vclick submit",function(t){var n=e(t.target).closest(t.type==="vclick"?"a":"form"),r;n.length&&!n.jqmData("transition")&&(r=e.mobile.urlHistory.getActive()||{},n.attr("data-"+e.mobile.ns+"transition",r.transition||e.mobile.defaultDialogTransition).attr("data-"+e.mobile.ns+"direction","reverse"))}).bind("pagehide",function(t,n){e(this).find("."+e.mobile.activeBtnClass).not(".ui-slider-bg").removeClass(e.mobile.activeBtnClass)}).bind("pagebeforeshow",function(){t._isCloseable=!0,t.options.overlayTheme&&t.element.page("removeContainerBackground").page("setContainerBackground",t.options.overlayTheme)})},close:function(){var t;this._isCloseable&&(this._isCloseable=!1,e.mobile.hashListeningEnabled?e.mobile.back():(t=e.mobile.urlHistory.getPrev().url,e.mobile.path.isPath(t)||(t=e.mobile.path.makeUrlAbsolute("#"+t)),e.mobile.changePage(t,{changeHash:!1,fromHashChange:!0})))}}),e(n).delegate(e.mobile.dialog.prototype.options.initSelector,"pagecreate",function(){e.mobile.dialog.prototype.enhance(this)})}(e,this),function(e,t){e.mobile.page.prototype.options.backBtnText="Back",e.mobile.page.prototype.options.addBackBtn=!1,e.mobile.page.prototype.options.backBtnTheme=null,e.mobile.page.prototype.options.headerTheme="a",e.mobile.page.prototype.options.footerTheme="a",e.mobile.page.prototype.options.contentTheme=null,e(n).bind("pagecreate",function(t){var n=e(t.target),r=n.data("page").options,i=n.jqmData("role"),s=r.theme;e(":jqmData(role='header'), :jqmData(role='footer'), :jqmData(role='content')",n).jqmEnhanceable().each(function(){var t=e(this),u=t.jqmData("role"),a=t.jqmData("theme"),f=a||r.contentTheme||i==="dialog"&&s,l,c,h,p;t.addClass("ui-"+u);if(u==="header"||u==="footer"){var d=a||(u==="header"?r.headerTheme:r.footerTheme)||s;t.addClass("ui-bar-"+d).attr("role",u==="header"?"banner":"contentinfo"),u==="header"&&(l=t.children("a, button"),c=l.hasClass("ui-btn-left"),h=l.hasClass("ui-btn-right"),c=c||l.eq(0).not(".ui-btn-right").addClass("ui-btn-left").length,h=h||l.eq(1).addClass("ui-btn-right").length),r.addBackBtn&&u==="header"&&e(".ui-page").length>1&&n.jqmData("url")!==e.mobile.path.stripHash(location.hash)&&!c&&(p=e("<a href='javascript:void(0);' class='ui-btn-left' data-"+e.mobile.ns+"rel='back' data-"+e.mobile.ns+"icon='arrow-l'>"+r.backBtnText+"</a>").attr("data-"+e.mobile.ns+"theme",r.backBtnTheme||d).prependTo(t)),t.children("h1, h2, h3, h4, h5, h6").addClass("ui-title").attr({role:"heading","aria-level":"1"})}else u==="content"&&(f&&t.addClass("ui-body-"+f),t.attr("role","main"))})})}(e),function(e,t){e.fn.fieldcontain=function(e){return this.addClass("ui-field-contain ui-body ui-br").contents().filter(function(){return this.nodeType===3&&!/\S/.test(this.nodeValue)}).remove()},e(n).bind("pagecreate create",function(t){e(":jqmData(role='fieldcontain')",t.target).jqmEnhanceable().fieldcontain()})}(e),function(e,t){e.fn.grid=function(t){return this.each(function(){var n=e(this),r=e.extend({grid:null},t),i=n.children(),s={solo:1,a:2,b:3,c:4,d:5},o=r.grid,u;if(!o)if(i.length<=5)for(var a in s)s[a]===i.length&&(o=a);else o="a",n.addClass("ui-grid-duo");u=s[o],n.addClass("ui-grid-"+o),i.filter(":nth-child("+u+"n+1)").addClass("ui-block-a"),u>1&&i.filter(":nth-child("+u+"n+2)").addClass("ui-block-b"),u>2&&i.filter(":nth-child("+u+"n+3)").addClass("ui-block-c"),u>3&&i.filter(":nth-child("+u+"n+4)").addClass("ui-block-d"),u>4&&i.filter(":nth-child("+u+"n+5)").addClass("ui-block-e")})}}(e),function(e,t){e(n).bind("pagecreate create",function(t){e(":jqmData(role='nojs')",t.target).addClass("ui-nojs")})}(e),function(e,t){e.mobile.behaviors.formReset={_handleFormReset:function(){this._on(this.element.closest("form"),{reset:function(){this._delay("_reset")}})}}}(e),function(e,t){function r(e){var t;while(e){t=typeof e.className=="string"&&e.className+" ";if(t&&t.indexOf("ui-btn ")>-1&&t.indexOf("ui-disabled ")<0)break;e=e.parentNode}return e}e.fn.buttonMarkup=function(r){var s=this,o=function(t,n){f.setAttribute("data-"+e.mobile.ns+t,n),a.jqmData(t,n)};r=r&&e.type(r)==="object"?r:{};for(var u=0;u<s.length;u++){var a=s.eq(u),f=a[0],l=e.extend({},e.fn.buttonMarkup.defaults,{icon:r.icon!==t?r.icon:a.jqmData("icon"),iconpos:r.iconpos!==t?r.iconpos:a.jqmData("iconpos"),theme:r.theme!==t?r.theme:a.jqmData("theme")||e.mobile.getInheritedTheme(a,"c"),inline:r.inline!==t?r.inline:a.jqmData("inline"),shadow:r.shadow!==t?r.shadow:a.jqmData("shadow"),corners:r.corners!==t?r.corners:a.jqmData("corners"),iconshadow:r.iconshadow!==t?r.iconshadow:a.jqmData("iconshadow"),mini:r.mini!==t?r.mini:a.jqmData("mini")},r),c="ui-btn-inner",h="ui-btn-text",p,d,v,m,g,y;e.each(l,o),a.jqmData("rel")==="popup"&&a.attr("href")&&(f.setAttribute("aria-haspopup",!0),f.setAttribute("aria-owns",f.getAttribute("href"))),y=e.data(f.tagName==="INPUT"||f.tagName==="BUTTON"?f.parentNode:f,"buttonElements"),y?(f=y.outer,a=e(f),v=y.inner,m=y.text,e(y.icon).remove(),y.icon=null):(v=n.createElement(l.wrapperEls),m=n.createElement(l.wrapperEls)),g=l.icon?n.createElement("span"):null,i&&!y&&i(),l.theme||(l.theme=e.mobile.getInheritedTheme(a,"c")),p="ui-btn ui-btn-up-"+l.theme,p+=l.shadow?" ui-shadow":"",p+=l.corners?" ui-btn-corner-all":"",l.mini!==t&&(p+=l.mini===!0?" ui-mini":" ui-fullsize"),l.inline!==t&&(p+=l.inline===!0?" ui-btn-inline":" ui-btn-block"),l.icon&&(l.icon="ui-icon-"+l.icon,l.iconpos=l.iconpos||"left",d="ui-icon "+l.icon,l.iconshadow&&(d+=" ui-icon-shadow")),l.iconpos&&(p+=" ui-btn-icon-"+l.iconpos,l.iconpos==="notext"&&!a.attr("title")&&a.attr("title",a.getEncodedText())),c+=l.corners?" ui-btn-corner-all":"",l.iconpos&&l.iconpos==="notext"&&!a.attr("title")&&a.attr("title",a.getEncodedText()),y&&a.removeClass(y.bcls||""),a.removeClass("ui-link").addClass(p),v.className=c,m.className=h,y||v.appendChild(m);if(g){g.className=d;if(!y||!y.icon)g.innerHTML="&#160;",v.appendChild(g)}while(f.firstChild&&!y)m.appendChild(f.firstChild);y||f.appendChild(v),y={bcls:p,outer:f,inner:v,text:m,icon:g},e.data(f,"buttonElements",y),e.data(v,"buttonElements",y),e.data(m,"buttonElements",y),g&&e.data(g,"buttonElements",y)}return this},e.fn.buttonMarkup.defaults={corners:!0,shadow:!0,iconshadow:!0,wrapperEls:"span"};var i=function(){var t=e.mobile.buttonMarkup.hoverDelay,s,o;e(n).bind({"vmousedown vmousecancel vmouseup vmouseover vmouseout focus blur scrollstart":function(n){var i,u=e(r(n.target)),a=n.originalEvent&&/^touch/.test(n.originalEvent.type),f=n.type;if(u.length){i=u.attr("data-"+e.mobile.ns+"theme");if(f==="vmousedown")a?s=setTimeout(function(){u.removeClass("ui-btn-up-"+i).addClass("ui-btn-down-"+i)},t):u.removeClass("ui-btn-up-"+i).addClass("ui-btn-down-"+i);else if(f==="vmousecancel"||f==="vmouseup")u.removeClass("ui-btn-down-"+i).addClass("ui-btn-up-"+i);else if(f==="vmouseover"||f==="focus")a?o=setTimeout(function(){u.removeClass("ui-btn-up-"+i).addClass("ui-btn-hover-"+i)},t):u.removeClass("ui-btn-up-"+i).addClass("ui-btn-hover-"+i);else if(f==="vmouseout"||f==="blur"||f==="scrollstart")u.removeClass("ui-btn-hover-"+i+" ui-btn-down-"+i).addClass("ui-btn-up-"+i),s&&clearTimeout(s),o&&clearTimeout(o)}},"focusin focus":function(t){e(r(t.target)).addClass(e.mobile.focusClass)},"focusout blur":function(t){e(r(t.target)).removeClass(e.mobile.focusClass)}}),i=null};e(n).bind("pagecreate create",function(t){e(":jqmData(role='button'), .ui-bar > a, .ui-header > a, .ui-footer > a, .ui-bar > :jqmData(role='controlgroup') > a",t.target).jqmEnhanceable().not("button, input, .ui-btn, :jqmData(role='none'), :jqmData(role='nojs')").buttonMarkup()})}(e),function(e,t){e.widget("mobile.collapsible",e.mobile.widget,{options:{expandCueText:" click to expand contents",collapseCueText:" click to collapse contents",collapsed:!0,heading:"h1,h2,h3,h4,h5,h6,legend",theme:null,contentTheme:null,inset:!0,mini:!1,initSelector:":jqmData(role='collapsible')"},_create:function(){var n=this.element,r=this.options,i=n.addClass("ui-collapsible"),s=n.children(r.heading).first(),o=n.jqmData("collapsed-icon")||r.collapsedIcon,u=n.jqmData("expanded-icon")||r.expandedIcon,a=i.wrapInner("<div class='ui-collapsible-content'></div>").children(".ui-collapsible-content"),f=n.closest(":jqmData(role='collapsible-set')").addClass("ui-collapsible-set");s.is("legend")&&(s=e("<div role='heading'>"+s.html()+"</div>").insertBefore(s),s.next().remove()),f.length?(r.theme||(r.theme=f.jqmData("theme")||e.mobile.getInheritedTheme(f,"c")),r.contentTheme||(r.contentTheme=f.jqmData("content-theme")),r.collapsedIcon||(r.collapsedIcon=f.jqmData("collapsed-icon")),r.expandedIcon||(r.expandedIcon=f.jqmData("expanded-icon")),r.iconpos||(r.iconpos=f.jqmData("iconpos")),f.jqmData("inset")!==t?r.inset=f.jqmData("inset"):r.inset=!0,r.mini||(r.mini=f.jqmData("mini"))):r.theme||(r.theme=e.mobile.getInheritedTheme(n,"c")),!r.inset||i.addClass("ui-collapsible-inset"),a.addClass(r.contentTheme?"ui-body-"+r.contentTheme:""),o=n.jqmData("collapsed-icon")||r.collapsedIcon||"plus",u=n.jqmData("expanded-icon")||r.expandedIcon||"minus",s.insertBefore(a).addClass("ui-collapsible-heading").append("<span class='ui-collapsible-heading-status'></span>").wrapInner("<a href='#' class='ui-collapsible-heading-toggle'></a>").find("a").first().buttonMarkup({shadow:!1,corners:!1,iconpos:n.jqmData("iconpos")||r.iconpos||"left",icon:o,mini:r.mini,theme:r.theme}),!r.inset||s.find("a").first().add(".ui-btn-inner",n).addClass("ui-corner-top ui-corner-bottom"),i.bind("expand collapse",function(t){if(!t.isDefaultPrevented()){var n=e(this),l=t.type==="collapse",c=r.contentTheme;t.preventDefault(),s.toggleClass("ui-collapsible-heading-collapsed",l).find(".ui-collapsible-heading-status").text(l?r.expandCueText:r.collapseCueText).end().find(".ui-icon").toggleClass("ui-icon-"+u,!l).toggleClass("ui-icon-"+o,l||u===o).end().find("a").first().removeClass(e.mobile.activeBtnClass),n.toggleClass("ui-collapsible-collapsed",l),a.toggleClass("ui-collapsible-content-collapsed",l).attr("aria-hidden",l),c&&!!r.inset&&(!f.length||i.jqmData("collapsible-last"))&&(s.find("a").first().add(s.find(".ui-btn-inner")).toggleClass("ui-corner-bottom",l),a.toggleClass("ui-corner-bottom",!l)),a.trigger("updatelayout")}}).trigger(r.collapsed?"collapse":"expand"),s.bind("tap",function(t){s.find("a").first().addClass(e.mobile.activeBtnClass)}).bind("click",function(e){var t=s.is(".ui-collapsible-heading-collapsed")?"expand":"collapse";i.trigger(t),e.preventDefault(),e.stopPropagation()})}}),e(n).bind("pagecreate create",function(t){e.mobile.collapsible.prototype.enhanceWithin(t.target)})}(e),function(e,t){e.widget("mobile.collapsibleset",e.mobile.widget,{options:{initSelector:":jqmData(role='collapsible-set')"},_create:function(){var n=this.element.addClass("ui-collapsible-set"),r=this.options;r.theme||(r.theme=e.mobile.getInheritedTheme(n,"c")),r.contentTheme||(r.contentTheme=n.jqmData("content-theme")),n.jqmData("inset")!==t&&(r.inset=n.jqmData("inset")),r.inset=r.inset!==t?r.inset:!0,n.jqmData("collapsiblebound")||n.jqmData("collapsiblebound",!0).bind("expand collapse",function(t){var n=t.type==="collapse",i=e(t.target).closest(".ui-collapsible"),s=i.data("collapsible");i.jqmData("collapsible-last")&&!!r.inset&&(i.find(".ui-collapsible-heading").first().find("a").first().toggleClass("ui-corner-bottom",n).find(".ui-btn-inner").toggleClass("ui-corner-bottom",n),i.find(".ui-collapsible-content").toggleClass("ui-corner-bottom",!n))}).bind("expand",function(t){var n=e(t.target).closest(".ui-collapsible");n.parent().is(":jqmData(role='collapsible-set')")&&n.siblings(".ui-collapsible").trigger("collapse")})},_init:function(){var e=this.element,t=e.children(":jqmData(role='collapsible')"),n=t.filter(":jqmData(collapsed='false')");this.refresh(),n.trigger("expand")},refresh:function(){var t=this.element,n=this.options,r=t.children(":jqmData(role='collapsible')");e.mobile.collapsible.prototype.enhance(r.not(".ui-collapsible")),!n.inset||(r.each(function(){e(this).jqmRemoveData("collapsible-last").find(".ui-collapsible-heading").find("a").first().removeClass("ui-corner-top ui-corner-bottom").find(".ui-btn-inner").removeClass("ui-corner-top ui-corner-bottom")}),r.first().find("a").first().addClass("ui-corner-top").find(".ui-btn-inner").addClass("ui-corner-top"),r.last().jqmData("collapsible-last",!0).find("a").first().addClass("ui-corner-bottom").find(".ui-btn-inner").addClass("ui-corner-bottom"))}}),e(n).bind("pagecreate create",function(t){e.mobile.collapsibleset.prototype.enhanceWithin(t.target)})}(e),function(e,t){e.widget("mobile.navbar",e.mobile.widget,{options:{iconpos:"top",grid:null,initSelector:":jqmData(role='navbar')"},_create:function(){var n=this.element,r=n.find("a"),i=r.filter(":jqmData(icon)").length?this.options.iconpos:t;n.addClass("ui-navbar ui-mini").attr("role","navigation").find("ul").jqmEnhanceable().grid({grid:this.options.grid}),r.buttonMarkup({corners:!1,shadow:!1,inline:!0,iconpos:i}),n.delegate("a","vclick",function(t){e(t.target).hasClass("ui-disabled")||(r.removeClass(e.mobile.activeBtnClass),e(this).addClass(e.mobile.activeBtnClass))}),n.closest(".ui-page").bind("pagebeforeshow",function(){r.filter(".ui-state-persist").addClass(e.mobile.activeBtnClass)})}}),e(n).bind("pagecreate create",function(t){e.mobile.navbar.prototype.enhanceWithin(t.target)})}(e),function(e,t){var r={};e.widget("mobile.listview",e.mobile.widget,{options:{theme:null,countTheme:"c",headerTheme:"b",dividerTheme:"b",icon:"arrow-r",splitIcon:"arrow-r",splitTheme:"b",inset:!1,initSelector:":jqmData(role='listview')"},_create:function(){var e=this,t="";t+=e.options.inset?" ui-listview-inset ui-corner-all ui-shadow ":"",e.element.addClass(function(e,n){return n+" ui-listview "+t}),e.refresh(!0)},_removeCorners:function(e,t){var n="ui-corner-top ui-corner-tr ui-corner-tl",r="ui-corner-bottom ui-corner-br ui-corner-bl";e=e.add(e.find(".ui-btn-inner, .ui-li-link-alt, .ui-li-thumb")),t==="top"?e.removeClass(n):t==="bottom"?e.removeClass(r):e.removeClass(n+" "+r)},_refreshCorners:function(e){var t,n,r,i;t=this.element.children("li"),n=e||t.filter(":visible").length===0?t.not(".ui-screen-hidden"):t.filter(":visible"),t.filter(".ui-li-last").removeClass("ui-li-last"),this.options.inset?(this._removeCorners(t),r=n.first().addClass("ui-corner-top"),r.add(r.find(".ui-btn-inner").not(".ui-li-link-alt span:first-child")).addClass("ui-corner-top").end().find(".ui-li-link-alt, .ui-li-link-alt span:first-child").addClass("ui-corner-tr").end().find(".ui-li-thumb").not(".ui-li-icon").addClass("ui-corner-tl"),i=n.last().addClass("ui-corner-bottom ui-li-last"),i.add(i.find(".ui-btn-inner")).find(".ui-li-link-alt").addClass("ui-corner-br").end().find(".ui-li-thumb").not(".ui-li-icon").addClass("ui-corner-bl")):n.last().addClass("ui-li-last"),e||this.element.trigger("updatelayout")},_findFirstElementByTagName:function(e,t,n,r){var i={};i[n]=i[r]=!0;while(e){if(i[e.nodeName])return e;e=e[t]}return null},_getChildrenByTagName:function(t,n,r){var i=[],s={};s[n]=s[r]=!0,t=t.firstChild;while(t)s[t.nodeName]&&i.push(t),t=t.nextSibling;return e(i)},_addThumbClasses:function(t){var n,r,i=t.length;for(n=0;n<i;n++)r=e(this._findFirstElementByTagName(t[n].firstChild,"nextSibling","img","IMG")),r.length&&(r.addClass("ui-li-thumb"),e(this._findFirstElementByTagName(r[0].parentNode,"parentNode","li","LI")).addClass(r.is(".ui-li-icon")?"ui-li-has-icon":"ui-li-has-thumb"))},refresh:function(t){this.parentPage=this.element.closest(".ui-page"),this._createSubPages();var r=this.options,i=this.element,s=this,o=i.jqmData("dividertheme")||r.dividerTheme,u=i.jqmData("splittheme"),a=i.jqmData("spliticon"),f=i.jqmData("icon"),l=this._getChildrenByTagName(i[0],"li","LI"),c=!!e.nodeName(i[0],"ol"),h=!e.support.cssPseudoElement,p=i.attr("start"),d={},v,m,g,y,b,w,E,S,x,T,N,C,k,L;c&&h&&i.find(".ui-li-dec").remove(),c&&(p||p===0?h?E=parseFloat(p):(S=parseFloat(p)-1,i.css("counter-reset","listnumbering "+S)):h&&(E=1)),r.theme||(r.theme=e.mobile.getInheritedTheme(this.element,"c"));for(var A=0,O=l.length;A<O;A++){v=l.eq(A),m="ui-li";if(t||!v.hasClass("ui-li")){g=v.jqmData("theme")||r.theme,y=this._getChildrenByTagName(v[0],"a","A");var M=v.jqmData("role")==="list-divider";y.length&&!M?(N=v.jqmData("icon"),v.buttonMarkup({wrapperEls:"div",shadow:!1,corners:!1,iconpos:"right",icon:y.length>1||N===!1?!1:N||f||r.icon,theme:g}),N!==!1&&y.length===1&&v.addClass("ui-li-has-arrow"),y.first().removeClass("ui-link").addClass("ui-link-inherit"),y.length>1&&(m+=" ui-li-has-alt",b=y.last(),w=u||b.jqmData("theme")||r.splitTheme,L=b.jqmData("icon"),b.appendTo(v).attr("title",b.getEncodedText()).addClass("ui-li-link-alt").empty().buttonMarkup({shadow:!1,corners:!1,theme:g,icon:!1,iconpos:"notext"}).find(".ui-btn-inner").append(e(n.createElement("span")).buttonMarkup({shadow:!0,corners:!0,theme:w,iconpos:"notext",icon:L||N||a||r.splitIcon})))):M?(m+=" ui-li-divider ui-bar-"+o,v.attr("role","heading"),c&&(p||p===0?h?E=parseFloat(p):(x=parseFloat(p)-1,v.css("counter-reset","listnumbering "+x)):h&&(E=1))):m+=" ui-li-static ui-btn-up-"+g}c&&h&&m.indexOf("ui-li-divider")<0&&(T=m.indexOf("ui-li-static")>0?v:v.find(".ui-link-inherit"),T.addClass("ui-li-jsnumbering").prepend("<span class='ui-li-dec'>"+E++ +". </span>")),d[m]||(d[m]=[]),d[m].push(v[0])}for(m in d)e(d[m]).addClass(m).children(".ui-btn-inner").addClass(m);i.find("h1, h2, h3, h4, h5, h6").addClass("ui-li-heading").end().find("p, dl").addClass("ui-li-desc").end().find(".ui-li-aside").each(function(){var t=e(this);t.prependTo(t.parent())}).end().find(".ui-li-count").each(function(){e(this).closest("li").addClass("ui-li-has-count")}).addClass("ui-btn-up-"+(i.jqmData("counttheme")||this.options.countTheme)+" ui-btn-corner-all"),this._addThumbClasses(l),this._addThumbClasses(i.find(".ui-link-inherit")),this._refreshCorners(t),this._trigger("afterrefresh")},_idStringEscape:function(e){return e.replace(/[^a-zA-Z0-9]/g,"-")},_createSubPages:function(){var t=this.element,n=t.closest(".ui-page"),i=n.jqmData("url"),s=i||n[0][e.expando],o=t.attr("id"),u=this.options,a="data-"+e.mobile.ns,f=this,l=n.find(":jqmData(role='footer')").jqmData("id"),c;typeof r[s]=="undefined"&&(r[s]=-1),o=o||++r[s],e(t.find("li>ul, li>ol").toArray().reverse()).each(function(n){var r=this,s=e(this),f=s.attr("id")||o+"-"+n,h=s.parent(),p=e(s.prevAll().toArray().reverse()),d=p.length?p:e("<span>"+e.trim(h.contents()[0].nodeValue)+"</span>"),v=d.first().getEncodedText(),m=(i||"")+"&"+e.mobile.subPageUrlKey+"="+f,g=s.jqmData("theme")||u.theme,y=s.jqmData("counttheme")||t.jqmData("counttheme")||u.countTheme,b,w;c=!0,b=s.detach().wrap("<div "+a+"role='page' "+a+"url='"+m+"' "+a+"theme='"+g+"' "+a+"count-theme='"+y+"'><div "+a+"role='content'></div></div>").parent().before("<div "+a+"role='header' "+a+"theme='"+u.headerTheme+"'><div class='ui-title'>"+v+"</div></div>").after(l?e("<div "+a+"role='footer' "+a+"id='"+l+"'>"):"").parent().appendTo(e.mobile.pageContainer),b.page(),w=h.find("a:first"),w.length||(w=e("<a/>").html(d||v).prependTo(h.empty())),w.attr("href","#"+m)}).listview();if(c&&n.is(":jqmData(external-page='true')")&&n.data("page").options.domCache===!1){var h=function(t,r){var s=r.nextPage,o,u=new e.Event("pageremove");r.nextPage&&(o=s.jqmData("url"),o.indexOf(i+"&"+e.mobile.subPageUrlKey)!==0&&(f.childPages().remove(),n.trigger(u),u.isDefaultPrevented()||n.removeWithDependents()))};n.unbind("pagehide.remove").bind("pagehide.remove",h)}},childPages:function(){var t=this.parentPage.jqmData("url");return e(":jqmData(url^='"+t+"&"+e.mobile.subPageUrlKey+"')")}}),e(n).bind("pagecreate create",function(t){e.mobile.listview.prototype.enhanceWithin(t.target)})}(e),function(e,t){e.mobile.listview.prototype.options.autodividers=!1,e.mobile.listview.prototype.options.autodividersSelector=function(t){var n=e.trim(t.text())||null;return n?(n=n.slice(0,1).toUpperCase(),n):null},e(n).delegate("ul,ol","listviewcreate",function(){var t=e(this),r=t.data("listview");if(!r||!r.options.autodividers)return;var i=function(){t.find("li:jqmData(role='list-divider')").remove();var i=t.find("li"),s=null,o,u;for(var a=0;a<i.length;a++){o=i[a],u=r.options.autodividersSelector(e(o));if(u&&s!==u){var f=n.createElement("li");f.appendChild(n.createTextNode(u)),f.setAttribute("data-"+e.mobile.ns+"role","list-divider"),o.parentNode.insertBefore(f,o)}s=u}},s=function(){t.unbind("listviewafterrefresh",s),i(),r.refresh(),t.bind("listviewafterrefresh",s)};s()})}(e),function(e,t){e.widget("mobile.checkboxradio",e.mobile.widget,{options:{theme:null,mini:!1,initSelector:"input[type='checkbox'],input[type='radio']"},_create:function(){var r=this,i=this.element,s=this.options,o=function(e,t){return e.jqmData(t)||e.closest("form, fieldset").jqmData(t)},u=e(i).closest("label"),a=u.length?u:e(i).closest("form, fieldset, :jqmData(role='page'), :jqmData(role='dialog')").find("label").filter("[for='"+i[0].id+"']").first(),f=i[0].type,l=o(i,"mini")||s.mini,c=f+"-on",h=f+"-off",p=i.parents(":jqmData(type='horizontal')").length?t:h,d=o(i,"iconpos"),v=p?"":" "+e.mobile.activeBtnClass,m="ui-"+c+v,g="ui-"+h,y="ui-icon-"+c,b="ui-icon-"+h;if(f!=="checkbox"&&f!=="radio")return;e.extend(this,{label:a,inputtype:f,checkedClass:m,uncheckedClass:g,checkedicon:y,uncheckedicon:b}),s.theme||(s.theme=e.mobile.getInheritedTheme(this.element,"c")),a.buttonMarkup({theme:s.theme,icon:p,shadow:!1,mini:l,iconpos:d});var w=n.createElement("div");w.className="ui-"+f,i.add(a).wrapAll(w),a.bind({vmouseover:function(t){e(this).parent().is(".ui-disabled")&&t.stopPropagation()},vclick:function(e){if(i.is(":disabled")){e.preventDefault();return}return r._cacheVals(),i.prop("checked",f==="radio"&&!0||!i.prop("checked")),i.triggerHandler("click"),r._getInputSet().not(i).prop("checked",!1),r._updateAll(),!1}}),i.bind({vmousedown:function(){r._cacheVals()},vclick:function(){var t=e(this);t.is(":checked")?(t.prop("checked",!0),r._getInputSet().not(t).prop("checked",!1)):t.prop("checked",!1),r._updateAll()},focus:function(){a.addClass(e.mobile.focusClass)},blur:function(){a.removeClass(e.mobile.focusClass)}}),this._handleFormReset&&this._handleFormReset(),this.refresh()},_cacheVals:function(){this._getInputSet().each(function(){e(this).jqmData("cacheVal",this.checked)})},_getInputSet:function(){return this.inputtype==="checkbox"?this.element:this.element.closest("form, fieldset, :jqmData(role='page'), :jqmData(role='dialog')").find("input[name='"+this.element[0].name+"'][type='"+this.inputtype+"']")},_updateAll:function(){var t=this;this._getInputSet().each(function(){var n=e(this);(this.checked||t.inputtype==="checkbox")&&n.trigger("change")}).checkboxradio("refresh")},_reset:function(){this.refresh()},refresh:function(){var e=this.element[0],t=this.label,n=t.find(".ui-icon");e.checked?(t.addClass(this.checkedClass).removeClass(this.uncheckedClass),n.addClass(this.checkedicon).removeClass(this.uncheckedicon)):(t.removeClass(this.checkedClass).addClass(this.uncheckedClass),n.removeClass(this.checkedicon).addClass(this.uncheckedicon)),e.disabled?this.disable():this.enable()},disable:function(){this.element.prop("disabled",!0).parent().addClass("ui-disabled")},enable:function(){this.element.prop("disabled",!1).parent().removeClass("ui-disabled")}}),e.widget("mobile.checkboxradio",e.mobile.checkboxradio,e.mobile.behaviors.formReset),e(n).bind("pagecreate create",function(t){e.mobile.checkboxradio.prototype.enhanceWithin(t.target,!0)})}(e),function(e,t){e.widget("mobile.button",e.mobile.widget,{options:{theme:null,icon:null,iconpos:null,corners:!0,shadow:!0,iconshadow:!0,initSelector:"button, [type='button'], [type='submit'], [type='reset']"},_create:function(){var r=this.element,i,s=this.options,o,u,a=s.inline||r.jqmData("inline"),f=s.mini||r.jqmData("mini"),l="",c;if(r[0].tagName==="A"){r.hasClass("ui-btn")||r.buttonMarkup();return}this.options.theme||(this.options.theme=e.mobile.getInheritedTheme(this.element,"c")),!~r[0].className.indexOf("ui-btn-left")||(l="ui-btn-left"),!~r[0].className.indexOf("ui-btn-right")||(l="ui-btn-right");if(r.attr("type")==="submit"||r.attr("type")==="reset")l?l+=" ui-submit":l="ui-submit";e("label[for='"+r.attr("id")+"']").addClass("ui-submit"),this.button=e("<div></div>")[r.html()?"html":"text"](r.html()||r.val()).insertBefore(r).buttonMarkup({theme:s.theme,icon:s.icon,iconpos:s.iconpos,inline:a,corners:s.corners,shadow:s.shadow,iconshadow:s.iconshadow,mini:f}).addClass(l).append(r.addClass("ui-btn-hidden")),i=this.button,o=r.attr("type"),u=r.attr("name"),o!=="button"&&o!=="reset"&&u&&r.bind("vclick",function(){c===t&&(c=e("<input>",{type:"hidden",name:r.attr("name"),value:r.attr("value")}).insertBefore(r),e(n).one("submit",function(){c.remove(),c=t}))}),r.bind({focus:function(){i.addClass(e.mobile.focusClass)},blur:function(){i.removeClass(e.mobile.focusClass)}}),this.refresh()},enable:function(){return this.element.attr("disabled",!1),this.button.removeClass("ui-disabled").attr("aria-disabled",!1),this._setOption("disabled",!1)},disable:function(){return this.element.attr("disabled",!0),this.button.addClass("ui-disabled").attr("aria-disabled",!0),this._setOption("disabled",!0)},refresh:function(){var t=this.element;t.prop("disabled")?this.disable():this.enable(),e(this.button.data("buttonElements").text)[t.html()?"html":"text"](t.html()||t.val())}}),e(n).bind("pagecreate create",function(t){e.mobile.button.prototype.enhanceWithin(t.target,!0)})}(e),function(e,t){e.fn.controlgroup=function(t){function n(e,t){e.removeClass("ui-btn-corner-all ui-corner-top ui-corner-bottom ui-corner-left ui-corner-right ui-controlgroup-last ui-shadow").eq(0).addClass(t[0]).end().last().addClass(t[1]).addClass("ui-controlgroup-last")}return this.each(function(){var r=e(this),i=e.extend({direction:r.jqmData("type")||"vertical",shadow:!1,excludeInvisible:!0,mini:r.jqmData("mini")},t),s=r.children("legend"),o=r.children(".ui-controlgroup-label"),u=r.children(".ui-controlgroup-controls"),a=i.direction==="horizontal"?["ui-corner-left","ui-corner-right"]:["ui-corner-top","ui-corner-bottom"],f=r.find("input").first().attr("type");u.length&&u.contents().unwrap(),r.wrapInner("<div class='ui-controlgroup-controls'></div>"),s.length?(e("<div role='heading' class='ui-controlgroup-label'>"+s.html()+"</div>").insertBefore(r.children(0)),s.remove()):o.length&&r.prepend(o),r.addClass("ui-corner-all ui-controlgroup ui-controlgroup-"+i.direction),n(r.find(".ui-btn"+(i.excludeInvisible?":visible":"")).not(".ui-slider-handle"),a),n(r.find(".ui-btn-inner"),a),i.shadow&&r.addClass("ui-shadow"),i.mini&&r.addClass("ui-mini")})}}(e),function(e,t){e(n).bind("pagecreate create",function(t){e(t.target).find("a").jqmEnhanceable().not(".ui-btn, .ui-link-inherit, :jqmData(role='none'), :jqmData(role='nojs')").addClass("ui-link")})}(e),function(e,r){function i(e,t,n,r){var i=r;return e<t?i=n+(e-t)/2:i=Math.min(Math.max(n,r-t/2),n+e-t),i}function s(){var n=e(t);return{x:n.scrollLeft(),y:n.scrollTop(),cx:t.innerWidth||n.width(),cy:t.innerHeight||n.height()}}e.widget("mobile.popup",e.mobile.widget,{options:{theme:null,overlayTheme:null,shadow:!0,corners:!0,transition:"none",positionTo:"origin",tolerance:null,initSelector:":jqmData(role='popup')",closeLinkSelector:"a:jqmData(rel='back')",closeLinkEvents:"click.popup",navigateEvents:"navigate.popup",closeEvents:"navigate.popup pagebeforechange.popup",history:!e.mobile.browser.ie},_eatEventAndClose:function(e){return e.preventDefault(),e.stopImmediatePropagation(),this.close(),!1},_resizeScreen:function(){var e=this._ui.container.outerHeight(!0);this._ui.screen.removeAttr("style"),e>this._ui.screen.height()&&this._ui.screen.height(e)},_handleWindowKeyUp:function(t){if(this._isOpen&&t.keyCode===e.mobile.keyCode.ESCAPE)return this._eatEventAndClose(t)},_expectResizeEvent:function(){var t=s();if(this._resizeData){if(t.x===this._resizeData.winCoords.x&&t.y===this._resizeData.winCoords.y&&t.cx===this._resizeData.winCoords.cx&&t.cy===this._resizeData.winCoords.cy)return!1;clearTimeout(this._resizeData.timeoutId)}return this._resizeData={timeoutId:setTimeout(e.proxy(this,"_resizeTimeout"),200),winCoords:t},!0},_resizeTimeout:function(){this._isOpen?this._expectResizeEvent()||(this._ui.container.hasClass("ui-popup-hidden")&&(this._trigger("beforeposition"),this._ui.container.removeClass("ui-popup-hidden").offset(this._placementCoords(this._desiredCoords(r,r,"window")))),this._resizeScreen(),this._resizeData=null,this._orientationchangeInProgress=!1):(this._resizeData=null,this._orientationchangeInProgress=!1)},_handleWindowResize:function(e){this._isOpen&&(this._expectResizeEvent()||this._orientationchangeInProgress)&&!this._ui.container.hasClass("ui-popup-hidden")&&this._ui.container.addClass("ui-popup-hidden").removeAttr("style")},_handleWindowOrientationchange:function(e){!this._orientationchangeInProgress&&this._isOpen&&(this._expectResizeEvent(),this._orientationchangeInProgress=!0)},_create:function(){var n={screen:e("<div class='ui-screen-hidden ui-popup-screen'></div>"),placeholder:e("<div style='display: none;'><!-- placeholder --></div>"),container:e("<div class='ui-popup-container ui-popup-hidden'></div>")},i=this.element.closest(".ui-page"),s=this.element.attr("id"),o=this;this.options.history=this.options.history&&e.mobile.ajaxEnabled&&e.mobile.hashListeningEnabled,i.length===0&&(i=e("body")),this.options.container=this.options.container||e.mobile.pageContainer,i.append(n.screen),n.container.insertAfter(n.screen),n.placeholder.insertAfter(this.element),s&&(n.screen.attr("id",s+"-screen"),n.container.attr("id",s+"-popup"),n.placeholder.html("<!-- placeholder for "+s+" -->")),n.container.append(this.element),this.element.addClass("ui-popup"),e.extend(this,{_scrollTop:0,_page:i,_ui:n,_fallbackTransition:"",_currentTransition:!1,_prereqs:null,_isOpen:!1,_tolerance:null,_resizeData:null,_orientationchangeInProgress:!1,_globalHandlers:[{src:e(t),handler:{orientationchange:e.proxy(this,"_handleWindowOrientationchange"),resize:e.proxy(this,"_handleWindowResize"),keyup:e.proxy(this,"_handleWindowKeyUp")}}]}),e.each(this.options,function(e,t){o.options[e]=r,o._setOption(e,t,!0)}),n.screen.bind("vclick",e.proxy(this,"_eatEventAndClose")),e.each(this._globalHandlers,function(e,t){t.src.bind(t.handler)})},_applyTheme:function(e,t,n){var r=(e.attr("class")||"").split(" "),i=!0,s=null,o,u=String(t);while(r.length>0){s=r.pop(),o=(new RegExp("^ui-"+n+"-([a-z])$")).exec(s);if(o&&o.length>1){s=o[1];break}s=null}t!==s&&(e.removeClass("ui-"+n+"-"+s),t!==null&&t!=="none"&&e.addClass("ui-"+n+"-"+u))},_setTheme:function(e){this._applyTheme(this.element,e,"body")},_setOverlayTheme:function(e){this._applyTheme(this._ui.screen,e,"overlay"),this._isOpen&&this._ui.screen.addClass("in")},_setShadow:function(e){this.element.toggleClass("ui-overlay-shadow",e)},_setCorners:function(e){this.element.toggleClass("ui-corner-all",e)},_applyTransition:function(t){this._ui.container.removeClass(this._fallbackTransition),t&&t!=="none"&&(this._fallbackTransition=e.mobile._maybeDegradeTransition(t),this._fallbackTransition==="none"&&(this._fallbackTransition=""),this._ui.container.addClass(this._fallbackTransition))},_setTransition:function(e){this._currentTransition||this._applyTransition(e)},_setTolerance:function(t){var n={t:30,r:15,b:30,l:15};if(t){var r=String(t).split(",");e.each(r,function(e,t){r[e]=parseInt(t,10)});switch(r.length){case 1:isNaN(r[0])||(n.t=n.r=n.b=n.l=r[0]);break;case 2:isNaN(r[0])||(n.t=n.b=r[0]),isNaN(r[1])||(n.l=n.r=r[1]);break;case 4:isNaN(r[0])||(n.t=r[0]),isNaN(r[1])||(n.r=r[1]),isNaN(r[2])||(n.b=r[2]),isNaN(r[3])||(n.l=r[3]);break;default:}}this._tolerance=n},_setOption:function(t,n){var i,s="_set"+t.charAt(0).toUpperCase()+t.slice(1);this[s]!==r&&this[s](n),i=["initSelector","closeLinkSelector","closeLinkEvents","navigateEvents","closeEvents","history","container"],e.mobile.widget.prototype._setOption.apply(this,arguments),e.inArray(t,i)===-1&&this.element.attr("data-"+(e.mobile.ns||"")+t.replace(/([A-Z])/,"-$1").toLowerCase(),n)},_placementCoords:function(e){var t=s(),r={x:this._tolerance.l,y:t.y+this._tolerance.t,cx:t.cx-this._tolerance.l-this._tolerance.r,cy:t.cy-this._tolerance.t-this._tolerance.b},o,u;this._ui.container.css("max-width",r.cx),o={cx:this._ui.container.outerWidth(!0),cy:this._ui.container.outerHeight(!0)},u={x:i(r.cx,o.cx,r.x,e.x),y:i(r.cy,o.cy,r.y,e.y)},u.y=Math.max(0,u.y);var a=n.documentElement,f=n.body,l=Math.max(a.clientHeight,f.scrollHeight,f.offsetHeight,a.scrollHeight,a.offsetHeight);return u.y-=Math.min(u.y,Math.max(0,u.y+o.cy-l)),{left:u.x,top:u.y}},_createPrereqs:function(t,n,r){var i=this,s;s={screen:e.Deferred(),container:e.Deferred()},s.screen.then(function(){s===i._prereqs&&t()}),s.container.then(function(){s===i._prereqs&&n()}),e.when(s.screen,s.container).done(function(){s===i._prereqs&&(i._prereqs=null,r())}),i._prereqs=s},_animate:function(t){this._ui.screen.removeClass(t.classToRemove).addClass(t.screenClassToAdd),t.prereqs.screen.resolve();if(t.transition&&t.transition!=="none"){t.applyTransition&&this._applyTransition(t.transition);if(this._fallbackTransition){this._ui.container.animationComplete(e.proxy(t.prereqs.container,"resolve")).addClass(t.containerClassToAdd).removeClass(t.classToRemove);return}}this._ui.container.removeClass(t.classToRemove),t.prereqs.container.resolve()},_desiredCoords:function(t,n,r){var i=null,o,u=s();if(r&&r!=="origin")if(r==="window")t=u.cx/2+u.x,n=u.cy/2+u.y;else{try{i=e(r)}catch(a){i=null}i&&(i.filter(":visible"),i.length===0&&(i=null))}i&&(o=i.offset(),t=o.left+i.outerWidth()/2,n=o.top+i.outerHeight()/2);if(e.type(t)!=="number"||isNaN(t))t=u.cx/2+u.x;if(e.type(n)!=="number"||isNaN(n))n=u.cy/2+u.y;return{x:t,y:n}},_openPrereqsComplete:function(){var e=this;e._ui.container.addClass("ui-popup-active"),e._isOpen=!0,e._resizeScreen(),setTimeout(function(){e._ui.container.attr("tabindex","0").focus(),e._expectResizeEvent(),e._trigger("afteropen")})},_open:function(n){var r,i,s=function(){var e=t,n=navigator.userAgent,r=n.match(/AppleWebKit\/([0-9\.]+)/),i=!!r&&r[1],s=n.match(/Android (\d+(?:\.\d+))/),o=!!s&&s[1],u=n.indexOf("Chrome")>-1;return s!==null&&o==="4.0"&&i&&i>534.13&&!u?!0:!1}();n=n||{},i=n.transition||this.options.transition,this._trigger("beforeposition"),r=this._placementCoords(this._desiredCoords(n.x,n.y,n.positionTo||this.options.positionTo||"origin")),this._createPrereqs(e.noop,e.noop,e.proxy(this,"_openPrereqsComplete")),i?(this._currentTransition=i,this._applyTransition(i)):i=this.options.transition,this.options.theme||this._setTheme(this._page.jqmData("theme")||e.mobile.getInheritedTheme(this._page,"c")),this._ui.screen.removeClass("ui-screen-hidden"),this._ui.container.removeClass("ui-popup-hidden").offset(r),this.options.overlayTheme&&s&&this.element.closest(".ui-page").addClass("ui-popup-open"),this._animate({additionalCondition:!0,transition:i,classToRemove:"",screenClassToAdd:"in",containerClassToAdd:"in",applyTransition:!1,prereqs:this._prereqs})},_closePrereqScreen:function(){this._ui.screen.removeClass("out").addClass("ui-screen-hidden")},_closePrereqContainer:function(){this._ui.container.removeClass("reverse out").addClass("ui-popup-hidden").removeAttr("style")},_closePrereqsDone:function(){var t=this,n=t.options;t._ui.container.removeAttr("tabindex"),n.container.unbind(n.closeEvents),t.element.undelegate(n.closeLinkSelector,n.closeLinkEvents),e.mobile.popup.active=r,t._trigger("afterclose")},_close:function(t){this._ui.container.removeClass("ui-popup-active"),this._page.removeClass("ui-popup-open"),this._isOpen=!1,this._createPrereqs(e.proxy(this,"_closePrereqScreen"),e.proxy(this,"_closePrereqContainer"),e.proxy(this,"_closePrereqsDone")),this._animate({additionalCondition:this._ui.screen.hasClass("in"),transition:t?"none":this._currentTransition||this.options.transition,classToRemove:"in",screenClassToAdd:"out",containerClassToAdd:"reverse out",applyTransition:!0,prereqs:this._prereqs})},_unenhance:function(){var t=this;t._setTheme("none"),t.element.detach().insertAfter(t._ui.placeholder).removeClass("ui-popup ui-overlay-shadow ui-corner-all"),t._ui.screen.remove(),t._ui.container.remove(),t._ui.placeholder.remove(),e.each(t._globalHandlers,function(t,n){e.each(n.handler,function(e,t){n.src.unbind(e,t)})})},_destroy:function(){e.mobile.popup.active===this?(this.element.one("popupafterclose",e.proxy(this,"_unenhance")),this.close()):this._unenhance()},_closePopup:function(n,r){var i,s;t.scrollTo(0,this._scrollTop);if(n.type==="pagebeforechange"&&r){typeof r.toPage=="string"?i=r.toPage:i=r.toPage.jqmData("url"),i=e.mobile.path.parseUrl(i),s=i.pathname+i.search+i.hash,this._myUrl!==s?(this.options.container.unbind(this.options.closeEvents),this._close(!0)):(this.close(),n.preventDefault());return}this._close()},_bindContainerClose:function(){var t=this;t.options.container.one(t.options.closeEvents,e.proxy(t,"_closePopup"))},open:function(n){var i=this,s=this.options,o,u,a,f,l,c;if(e.mobile.popup.active)return;e.mobile.popup.active=this,this._scrollTop=e(t).scrollTop();if(!s.history){i._open(n),i._bindContainerClose(),i.element.delegate(s.closeLinkSelector,s.closeLinkEvents,function(e){return i._close(),!1});return}u=e.mobile.dialogHashKey,a=e.mobile.activePage,f=a.is(".ui-dialog"),this._myUrl=o=e.mobile.urlHistory.getActive().url,l=o.indexOf(u)>-1&&!f,c=e.mobile.urlHistory;if(l){i._open(n),i._bindContainerClose();return}o+=u,c.activeIndex===0&&o===c.initialDst&&(o+=u),s.container.one(s.navigateEvents,function(e){e.preventDefault(),i._open(n),i._bindContainerClose()}),c.ignoreNextHashChange=f,c.addNew(o,r,r,r,"dialog"),e.mobile.path.set(o)},close:function(){if(!e.mobile.popup.active)return;this._scrollTop=e(t).scrollTop(),this.options.history?e.mobile.back():this._close()}}),e.mobile.popup.handleLink=function(t){var n=t.closest(":jqmData(role='page')"),r=n.length===0?e("body"):n,i=e(e.mobile.path.parseUrl(t.attr("href")).hash,r[0]),s;i.data("popup")&&(s=t.offset(),i.popup("open",{x:s.left+t.outerWidth()/2,y:s.top+t.outerHeight()/2,transition:t.jqmData("transition"),positionTo:t.jqmData("position-to"),link:t})),setTimeout(function(){var n=t.parent().parent();n.hasClass("ui-li")&&(t=n.parent()),t.removeClass(e.mobile.activeBtnClass)},300)},e(n).bind("pagebeforechange",function(t,n){n.options.role==="popup"&&(e.mobile.popup.handleLink(n.options.link),t.preventDefault())}),e(n).bind("pagecreate create",function(t){e.mobile.popup.prototype.enhanceWithin(t.target,!0)})}(e),function(e){var t=e("meta[name=viewport]"),n=t.attr("content"),r=n+",maximum-scale=1, user-scalable=no",i=n+",maximum-scale=10, user-scalable=yes",s=/(user-scalable[\s]*=[\s]*no)|(maximum-scale[\s]*=[\s]*1)[$,\s]/.test(n);e.mobile.zoom=e.extend({},{enabled:!s,locked:!1,disable:function(n){!s&&!e.mobile.zoom.locked&&(t.attr("content",r),e.mobile.zoom.enabled=!1,e.mobile.zoom.locked=n||!1)},enable:function(n){!s&&(!e.mobile.zoom.locked||n===!0)&&(t.attr("content",i),e.mobile.zoom.enabled=!0,e.mobile.zoom.locked=!1)},restore:function(){s||(t.attr("content",n),e.mobile.zoom.enabled=!0)}})}(e),function(e,r){e.widget("mobile.textinput",e.mobile.widget,{options:{theme:null,mini:!1,preventFocusZoom:/iPhone|iPad|iPod/.test(navigator.platform)&&navigator.userAgent.indexOf("AppleWebKit")>-1,initSelector:"input[type='text'], input[type='search'], :jqmData(type='search'), input[type='number'], :jqmData(type='number'), input[type='password'], input[type='email'], input[type='url'], input[type='tel'], textarea, input[type='time'], input[type='date'], input[type='month'], input[type='week'], input[type='datetime'], input[type='datetime-local'], input[type='color'], input:not([type])",clearSearchButtonText:"clear text",disabled:!1},_create:function(){function c(){setTimeout(function(){l.toggleClass("ui-input-clear-hidden",!i.val())},0)}var r=this,i=this.element,s=this.options,o=s.theme||e.mobile.getInheritedTheme(this.element,"c"),u=" ui-body-"+o,a=s.mini?" ui-mini":"",f,l;e("label[for='"+i.attr("id")+"']").addClass("ui-input-text"),f=i.addClass("ui-input-text ui-body-"+o),typeof i[0].autocorrect!="undefined"&&!e.support.touchOverflow&&(i[0].setAttribute("autocorrect","off"),i[0].setAttribute("autocomplete","off")),i.is("[type='search'],:jqmData(type='search')")?(f=i.wrap("<div class='ui-input-search ui-shadow-inset ui-btn-corner-all ui-btn-shadow ui-icon-searchfield"+u+a+"'></div>").parent(),l=e("<a href='#' class='ui-input-clear' title='"+s.clearSearchButtonText+"'>"+s.clearSearchButtonText+"</a>").bind("click",function(e){i.val("").focus().trigger("change"),l.addClass("ui-input-clear-hidden"),e.preventDefault()}).appendTo(f).buttonMarkup({icon:"delete",iconpos:"notext",corners:!0,shadow:!0,mini:s.mini}),c(),i.bind("paste cut keyup focus change blur",c)):i.addClass("ui-corner-all ui-shadow-inset"+u+a),i.focus(function(){f.addClass(e.mobile.focusClass)}).blur(function(){f.removeClass(e.mobile.focusClass)}).bind("focus",function(){s.preventFocusZoom&&e.mobile.zoom.disable(!0)}).bind("blur",function(){s.preventFocusZoom&&e.mobile.zoom.enable(!0)});if(i.is("textarea")){var h=15,p=100,d;this._keyup=function(){var e=i[0].scrollHeight,t=i[0].clientHeight;t<e&&i.height(e+h)},i.keyup(function(){clearTimeout(d),d=setTimeout(r._keyup,p)}),this._on(e(n),{pagechange:"_keyup"}),e.trim(i.val())&&this._on(e(t),{load:"_keyup"})}i.attr("disabled")&&this.disable()},disable:function(){var e;return this.element.attr("disabled",!0).is("[type='search'], :jqmData(type='search')")?e=this.element.parent():e=this.element,e.addClass("ui-disabled"),this._setOption("disabled",!0)},enable:function(){var e;return this.element.attr("disabled",!1).is("[type='search'], :jqmData(type='search')")?e=this.element.parent():e=this.element,e.removeClass("ui-disabled"),this._setOption("disabled",!1)}}),e(n).bind("pagecreate create",function(t){e.mobile.textinput.prototype.enhanceWithin(t.target,!0)})}(e),function(e,t){e.mobile.listview.prototype.options.filter=!1,e.mobile.listview.prototype.options.filterPlaceholder="Filter items...",e.mobile.listview.prototype.options.filterTheme="c";var r=function(e,t,n){return e.toString().toLowerCase().indexOf(t)===-1};e.mobile.listview.prototype.options.filterCallback=r,e(n).delegate("ul, ol","listviewcreate",function(){var t=e(this),n=t.data("listview");if(!n.options.filter)return;var i=e("<form>",{"class":"ui-listview-filter ui-bar-"+n.options.filterTheme,role:"search"}).submit(function(e){e.preventDefault(),s.blur()}),s=e("<input>",{placeholder:n.options.filterPlaceholder}).attr("data-"+e.mobile.ns+"type","search").jqmData("lastval","").bind("keyup change",function(){var i=e(this),s=this.value.toLowerCase(),o=null,u=i.jqmData("lastval")+"",a=!1,f="",l,c=n.options.filterCallback!==r;n._trigger("beforefilter","beforefilter",{input:this}),i.jqmData("lastval",s),c||s.length<u.length||s.indexOf(u)!==0?o=t.children():o=t.children(":not(.ui-screen-hidden)");if(s){for(var h=o.length-1;h>=0;h--)l=e(o[h]),f=l.jqmData("filtertext")||l.text(),l.is("li:jqmData(role=list-divider)")?(l.toggleClass("ui-filter-hidequeue",!a),a=!1):n.options.filterCallback(f,s,l)?l.toggleClass("ui-filter-hidequeue",!0):a=!0;o.filter(":not(.ui-filter-hidequeue)").toggleClass("ui-screen-hidden",!1),o.filter(".ui-filter-hidequeue").toggleClass("ui-screen-hidden",!0).toggleClass("ui-filter-hidequeue",!1)}else o.toggleClass("ui-screen-hidden",!1);n._refreshCorners()}).appendTo(i).textinput();n.options.inset&&i.addClass("ui-listview-filter-inset"),i.bind("submit",function(){return!1}).insertBefore(t)})}(e),function(e,r){e.widget("mobile.slider",e.mobile.widget,{options:{theme:null,trackTheme:null,disabled:!1,initSelector:"input[type='range'], :jqmData(type='range'), :jqmData(role='slider')",mini:!1},_create:function(){var i=this,s=this.element,o=e.mobile.getInheritedTheme(s,"c"),u=this.options.theme||o,a=this.options.trackTheme||o,f=s[0].nodeName.toLowerCase(),l=f==="select"?"ui-slider-switch":"",c=s.attr("id"),h=e("[for='"+c+"']"),p=h.attr("id")||c+"-label",d=h.attr("id",p),v=function(){return f==="input"?parseFloat(s.val()):s[0].selectedIndex},m=f==="input"?parseFloat(s.attr("min")):0,g=f==="input"?parseFloat(s.attr("max")):s.find("option").length-1,y=t.parseFloat(s.attr("step")||1),b=this.options.inline||s.jqmData("inline")===!0?" ui-slider-inline":"",w=this.options.mini||s.jqmData("mini")?" ui-slider-mini":"",E=n.createElement("a"),S=e(E),x=n.createElement("div"),T=e(x),N=s.jqmData("highlight")&&f!=="select"?function(){var t=n.createElement("div");return t.className="ui-slider-bg "+e.mobile.activeBtnClass+" ui-btn-corner-all",e(t).prependTo(T)}():!1,C;this._type=f,E.setAttribute("href","#"),x.setAttribute("role","application"),x.className=["ui-slider ",l," ui-btn-down-",a," ui-btn-corner-all",b,w].join(""),E.className="ui-slider-handle",x.appendChild(E),S.buttonMarkup({corners:!0,theme:u,shadow:!0}).attr({role:"slider","aria-valuemin":m,"aria-valuemax":g,"aria-valuenow":v(),"aria-valuetext":v(),title:v(),"aria-labelledby":p}),e.extend(this,{slider:T,handle:S,valuebg:N,dragging:!1,beforeStart:null,userModified:!1,mouseMoved:!1});if(f==="select"){var k=n.createElement("div");k.className="ui-slider-inneroffset";for(var L=0,A=x.childNodes.length;L<A;L++)k.appendChild(x.childNodes[L]);x.appendChild(k),S.addClass("ui-slider-handle-snapping"),C=s.find("option");for(var O=0,M=C.length;O<M;O++){var _=O?"a":"b",D=O?" "+e.mobile.activeBtnClass:" ui-btn-down-"+a,P=n.createElement("div"),H=n.createElement("span");H.className=["ui-slider-label ui-slider-label-",_,D," ui-btn-corner-all"].join(""),H.setAttribute("role","img"),H.appendChild(n.createTextNode(C[O].innerHTML)),e(H).prependTo(T)}i._labels=e(".ui-slider-label",T)}d.addClass("ui-slider"),s.addClass(f==="input"?"ui-slider-input":"ui-slider-switch").change(function(){i.mouseMoved||i.refresh(v(),!0)}).keyup(function(){i.refresh(v(),!0,!0)}).blur(function(){i.refresh(v(),!0)}),this._preventDocumentDrag=function(e){if(i.dragging&&!i.options.disabled)return i.mouseMoved=!0,f==="select"&&S.removeClass("ui-slider-handle-snapping"),i.refresh(e),i.userModified=i.beforeStart!==s[0].selectedIndex,!1},this._on(e(n),{vmousemove:this._preventDocumentDrag}),s.bind("vmouseup",e.proxy(i._checkedRefresh,i)),T.bind("vmousedown",function(e){return i.options.disabled?!1:(i.dragging=!0,i.userModified=!1,i.mouseMoved=!1,f==="select"&&(i.beforeStart=s[0].selectedIndex),i.refresh(e),i._trigger("start"),!1)}).bind("vclick",!1),this._sliderMouseUp=function(){if(i.dragging)return i.dragging=!1,f==="select"&&(S.addClass("ui-slider-handle-snapping"),i.mouseMoved?i.userModified?i.refresh(i.beforeStart===0?1:0):i.refresh(i.beforeStart):i.refresh(i.beforeStart===0?1:0)),i.mouseMoved=!1,i._trigger("stop"),!1},this._on(T.add(n),{vmouseup:this._sliderMouseUp}),T.insertAfter(s),f==="select"&&this.handle.bind({focus:function(){T.addClass(e.mobile.focusClass)},blur:function(){T.removeClass(e.mobile.focusClass)}}),this.handle.bind({vmousedown:function(){e(this).focus()},vclick:!1,keydown:function(t){var n=v();if(i.options.disabled)return;switch(t.keyCode){case e.mobile.keyCode.HOME:case e.mobile.keyCode.END:case e.mobile.keyCode.PAGE_UP:case e.mobile.keyCode.PAGE_DOWN:case e.mobile.keyCode.UP:case e.mobile.keyCode.RIGHT:case e.mobile.keyCode.DOWN:case e.mobile.keyCode.LEFT:t.preventDefault(),i._keySliding||(i._keySliding=!0,e(this).addClass("ui-state-active"))}switch(t.keyCode){case e.mobile.keyCode.HOME:i.refresh(m);break;case e.mobile.keyCode.END:i.refresh(g);break;case e.mobile.keyCode.PAGE_UP:case e.mobile.keyCode.UP:case e.mobile.keyCode.RIGHT:i.refresh(n+y);break;case e.mobile.keyCode.PAGE_DOWN:case e.mobile.keyCode.DOWN:case e.mobile.keyCode.LEFT:i.refresh(n-y)}},keyup:function(t){i._keySliding&&(i._keySliding=!1,e(this).removeClass("ui-state-active"))}}),this._handleFormReset&&this._handleFormReset(),this.refresh(r,r,!0)},_checkedRefresh:function(){this.value!=this._value()&&this.refresh(this._value())},_value:function(){return this._type==="input"?parseFloat(this.element.val()):this.element[0].selectedIndex},_reset:function(){this.refresh(r,!1,!0)},refresh:function(t,n,r){(this.options.disabled||this.element.attr("disabled"))&&this.disable(),this.value=this._value();var i=this.element,s,o=i[0].nodeName.toLowerCase(),u=o==="input"?parseFloat(i.attr("min")):0,a=o==="input"?parseFloat(i.attr("max")):i.find("option").length-1,f=o==="input"&&parseFloat(i.attr("step"))>0?parseFloat(i.attr("step")):1;if(typeof t=="object"){var l=t,c=8;if(!this.dragging||l.pageX<this.slider.offset().left-c||l.pageX>this.slider.offset().left+this.slider.width()+c)return;s=Math.round((l.pageX-this.slider.offset().left)/this.slider.width()*100)}else t==null&&(t=o==="input"?parseFloat(i.val()||0):i[0].selectedIndex),s=(parseFloat(t)-u)/(a-u)*100;if(isNaN(s))return;s<0&&(s=0),s>100&&(s=100);var h=s/100*(a-u)+u,p=(h-u)%f,d=h-p;Math.abs(p)*2>=f&&(d+=p>0?f:-f),h=parseFloat(d.toFixed(5)),h<u&&(h=u),h>a&&(h=a),this.handle.css("left",s+"%"),this.handle.attr({"aria-valuenow":o==="input"?h:i.find("option").eq(h).attr("value"),"aria-valuetext":o==="input"?h:i.find("option").eq(h).getEncodedText(),title:o==="input"?h:i.find("option").eq(h).getEncodedText()}),this.valuebg&&this.valuebg.css("width",s+"%");if(this._labels){var v=this.handle.width()/this.slider.width()*100,m=s&&v+(100-v)*s/100,g=s===100?0:Math.min(v+100-m,100);this._labels.each(function(){var t=e(this).is(".ui-slider-label-a");e(this).width((t?m:g)+"%")})}if(!r){var y=!1;o==="input"?(y=i.val()!==h,i.val(h)):(y=i[0].selectedIndex!==h,i[0].selectedIndex=h),!n&&y&&i.trigger("change")}},enable:function(){return this.element.attr("disabled",!1),this.slider.removeClass("ui-disabled").attr("aria-disabled",!1),this._setOption("disabled",!1)},disable:function(){return this.element.attr("disabled",!0),this.slider.addClass("ui-disabled").attr("aria-disabled",!0),this._setOption("disabled",!0)}}),e.widget("mobile.slider",e.mobile.slider,e.mobile.behaviors.formReset),e.widget("mobile.slider",e.mobile.slider,{widgetEventPrefix:"slide"}),e(n).bind("pagecreate create",function(t){e.mobile.slider.prototype.enhanceWithin(t.target,!0)})}(e),function(e,r){e.widget("mobile.selectmenu",e.mobile.widget,{options:{theme:null,disabled:!1,icon:"arrow-d",iconpos:"right",inline:!1,corners:!0,shadow:!0,iconshadow:!0,overlayTheme:"a",hidePlaceholderMenuItems:!0,closeText:"Close",nativeMenu:!0,preventFocusZoom:/iPhone|iPad|iPod/.test(navigator.platform)&&navigator.userAgent.indexOf("AppleWebKit")>-1,initSelector:"select:not( :jqmData(role='slider') )",mini:!1},_button:function(){return e("<div/>")},_setDisabled:function(e){return this.element.attr("disabled",e),this.button.attr("aria-disabled",e),this._setOption("disabled",e)},_focusButton:function(){var e=this;setTimeout(function(){e.button.focus()},40)},_selectOptions:function(){return this.select.find("option")},_preExtension:function(){var t="";!~this.element[0].className.indexOf("ui-btn-left")||(t=" ui-btn-left"),!~this.element[0].className.indexOf("ui-btn-right")||(t=" ui-btn-right"),this.select=this.element.wrap("<div class='ui-select"+t+"'>"),this.selectID=this.select.attr("id"),this.label=e("label[for='"+this.selectID+"']").addClass("ui-select"),this.isMultiple=this.select[0].multiple,this.options.theme||(this.options.theme=e.mobile.getInheritedTheme(this.select,"c"))},_destroy:function(){var e=this.element.parents(".ui-select");e.length>0&&(this.element.insertAfter(e),e.remove())},_create:function(){this._preExtension(),this._trigger("beforeCreate"),this.button=this._button();var n=this,r=this.options,i=r.inline||this.select.jqmData("inline"),s=r.mini||this.select.jqmData("mini"),o=r.icon?r.iconpos||this.select.jqmData("iconpos"):!1,u=this.select[0].selectedIndex===-1?0:this.select[0].selectedIndex,a=this.button.insertBefore(this.select).buttonMarkup({theme:r.theme,icon:r.icon,iconpos:o,inline:i,corners:r.corners,shadow:r.shadow,iconshadow:r.iconshadow,mini:s});this.setButtonText(),r.nativeMenu&&t.opera&&t.opera.version&&a.addClass("ui-select-nativeonly"),this.isMultiple&&(this.buttonCount=e("<span>").addClass("ui-li-count ui-btn-up-c ui-btn-corner-all").hide().appendTo(a.addClass("ui-li-has-count"))),(r.disabled||this.element.attr("disabled"))&&this.disable(),this.select.change(function(){n.refresh()}),this._handleFormReset&&this._handleFormReset(),this.build()},build:function(){var t=this;this.select.appendTo(t.button).bind("vmousedown",function(){t.button.addClass(e.mobile.activeBtnClass)}).bind("focus",function(){t.button.addClass(e.mobile.focusClass)}).bind("blur",function(){t.button.removeClass(e.mobile.focusClass)}).bind("focus vmouseover",function(){t.button.trigger("vmouseover")}).bind("vmousemove",function(){t.button.removeClass(e.mobile.activeBtnClass)}).bind("change blur vmouseout",function(){t.button.trigger("vmouseout").removeClass(e.mobile.activeBtnClass)}).bind("change blur",function(){t.button.removeClass("ui-btn-down-"+t.options.theme)}),t.button.bind("vmousedown",function(){t.options.preventFocusZoom&&e.mobile.zoom.disable(!0)}),t.label.bind("click focus",function(){t.options.preventFocusZoom&&e.mobile.zoom.disable(!0)}),t.select.bind("focus",function(){t.options.preventFocusZoom&&e.mobile.zoom.disable(!0)}),t.button.bind("mouseup",function(){t.options.preventFocusZoom&&setTimeout(function(){e.mobile.zoom.enable(!0)},0)}),t.select.bind("blur",function(){t.options.preventFocusZoom&&e.mobile.zoom.enable(!0)})},selected:function(){return this._selectOptions().filter(":selected")},selectedIndices:function(){var e=this;return this.selected().map(function(){return e._selectOptions().index(this)}).get()},setButtonText:function(){var t=this,r=this.selected(),i=this.placeholder,s=e(n.createElement("span"));this.button.find(".ui-btn-text").html(function(){return r.length?i=r.map(function(){return e(this).text()}).get().join(", "):i=t.placeholder,s.text(i).addClass(t.select.attr("class")).addClass(r.attr("class"))})},setButtonCount:function(){var e=this.selected();this.isMultiple&&this.buttonCount[e.length>1?"show":"hide"]().text(e.length)},_reset:function(){this.refresh()},refresh:function(){this.setButtonText(),this.setButtonCount()},open:e.noop,close:e.noop,disable:function(){this._setDisabled(!0),this.button.addClass("ui-disabled")},enable:function(){this._setDisabled(!1),this.button.removeClass("ui-disabled")}}),e.widget("mobile.selectmenu",e.mobile.selectmenu,e.mobile.behaviors.formReset),e(n).bind("pagecreate create",function(t){e.mobile.selectmenu.prototype.enhanceWithin(t.target,!0)})}(e),function(e,r){var i=function(i){var s=i.select,o=i._destroy,u=i.selectID,a=i.label,f=i.select.closest(".ui-page"),l=i._selectOptions(),c=i.isMultiple=i.select[0].multiple,h=u+"-button",p=u+"-menu",d=e("<div data-"+e.mobile.ns+"role='dialog' data-"+e.mobile.ns+"theme='"+i.options.theme+"' data-"+e.mobile.ns+"overlay-theme='"+i.options.overlayTheme+"'>"+"<div data-"+e.mobile.ns+"role='header'>"+"<div class='ui-title'>"+a.getEncodedText()+"</div>"+"</div>"+"<div data-"+e.mobile.ns+"role='content'></div>"+"</div>"),v=e("<div>",{"class":"ui-selectmenu"}).insertAfter(i.select).popup({theme:i.options.overlayTheme}),m=e("<ul>",{"class":"ui-selectmenu-list",id:p,role:"listbox","aria-labelledby":h}).attr("data-"+e.mobile.ns+"theme",i.options.theme).appendTo(v),g=e("<div>",{"class":"ui-header ui-bar-"+i.options.theme}).prependTo(v),y=e("<h1>",{"class":"ui-title"}).appendTo(g),b,w,E;i.isMultiple&&(E=e("<a>",{text:i.options.closeText,href:"#","class":"ui-btn-left"}).attr("data-"+e.mobile.ns+"iconpos","notext").attr("data-"+e.mobile.ns+"icon","delete").appendTo(g).buttonMarkup()),e.extend(i,{select:i.select,selectID:u,buttonId:h,menuId:p,thisPage:f,menuPage:d,label:a,selectOptions:l,isMultiple:c,theme:i.options.theme,listbox:v,list:m,header:g,headerTitle:y,headerClose:E,menuPageContent:b,menuPageClose:w,placeholder:"",build:function(){var t=this;t.refresh(),t._origTabIndex===r&&(t._origTabIndex=t.select.attr("tabindex"),t._origTabIndex===r&&(t._origTabIndex=!1)),t.select.attr("tabindex","-1").focus(function(){e(this).blur(),t.button.focus()}),t.button.bind("vclick keydown",function(n){if(n.type==="vclick"||n.keyCode&&(n.keyCode===e.mobile.keyCode.ENTER||n.keyCode===e.mobile.keyCode.SPACE))t.open(),n.preventDefault()}),t.list.attr("role","listbox").bind("focusin",function(t){e(t.target).attr("tabindex","0").trigger("vmouseover")}).bind("focusout",function(t){e(t.target).attr("tabindex","-1").trigger("vmouseout")}).delegate("li:not(.ui-disabled, .ui-li-divider)","click",function(n){var r=t.select[0].selectedIndex,s=t.list.find("li:not(.ui-li-divider)").index(this),o=t._selectOptions().eq(s)[0];o.selected=t.isMultiple?!o.selected:!0,t.isMultiple&&e(this).find(".ui-icon").toggleClass("ui-icon-checkbox-on",o.selected).toggleClass("ui-icon-checkbox-off",!o.selected),(t.isMultiple||r!==s)&&t.select.trigger("change"),t.isMultiple?t.list.find("li:not(.ui-li-divider)").eq(s).addClass("ui-btn-down-"+i.options.theme).find("a").first().focus():t.close(),n.preventDefault()}).keydown(function(t){var n=e(t.target),r=n.closest("li"),s,o;switch(t.keyCode){case 38:return s=r.prev().not(".ui-selectmenu-placeholder"),s.is(".ui-li-divider")&&(s=s.prev()),s.length&&(n.blur().attr("tabindex","-1"),s.addClass("ui-btn-down-"+i.options.theme).find("a").first().focus()),!1;case 40:return o=r.next(),o.is(".ui-li-divider")&&(o=o.next()),o.length&&(n.blur().attr("tabindex","-1"),o.addClass("ui-btn-down-"+i.options.theme).find("a").first().focus()),!1;case 13:case 32:return n.trigger("click"),!1}}),t.menuPage.bind("pagehide",function(){t.list.appendTo(t.listbox),t._focusButton(),e.mobile._bindPageRemove.call(t.thisPage)}),t.listbox.bind("popupafterclose",function(e){t.close()}),t.isMultiple&&t.headerClose.click(function(){if(t.menuType==="overlay")return t.close(),!1}),t.thisPage.addDependents(this.menuPage)},_isRebuildRequired:function(){var e=this.list.find("li"),t=this._selectOptions();return t.text()!==e.text()},selected:function(){return this._selectOptions().filter(":selected:not( :jqmData(placeholder='true') )")},refresh:function(t,n){var r=this,i=this.element,s=this.isMultiple,o;(t||this._isRebuildRequired())&&r._buildList(),o=this.selectedIndices(),r.setButtonText(),r.setButtonCount(),r.list.find("li:not(.ui-li-divider)").removeClass(e.mobile.activeBtnClass).attr("aria-selected",!1).each(function(t){if(e.inArray(t,o)>-1){var n=e(this);n.attr("aria-selected",!0),r.isMultiple?n.find(".ui-icon").removeClass("ui-icon-checkbox-off").addClass("ui-icon-checkbox-on"):n.is(".ui-selectmenu-placeholder")?n.next().addClass(e.mobile.activeBtnClass):n.addClass(e.mobile.activeBtnClass)}})},close:function(){if(this.options.disabled||!this.isOpen)return;var t=this;t.menuType==="page"?e.mobile.back():(t.listbox.popup("close"),t.list.appendTo(t.listbox),t._focusButton()),t.isOpen=!1},open:function(){function p(){var t=n.list.find("."+e.mobile.activeBtnClass+" a");t.length===0&&(t=n.list.find("li.ui-btn:not( :jqmData(placeholder='true') ) a")),t.first().focus().closest("li").addClass("ui-btn-down-"+i.options.theme)}if(this.options.disabled)return;var n=this,r=e(t),s=n.list.parent(),o=s.outerHeight(),u=s.outerWidth(),a=e("."+e.mobile.activePageClass),f=r.scrollTop(),l=n.button.offset().top,c=r.height(),h=r.width();n.button.addClass(e.mobile.activeBtnClass),setTimeout(function(){n.button.removeClass(e.mobile.activeBtnClass)},300),o>c-80||!e.support.scrollTop?(n.menuPage.appendTo(e.mobile.pageContainer).page(),n.menuPageContent=d.find(".ui-content"),n.menuPageClose=d.find(".ui-header a"),n.thisPage.unbind("pagehide.remove"),f===0&&l>c&&n.thisPage.one("pagehide",function(){e(this).jqmData("lastScroll",l)}),n.menuPage.one("pageshow",function(){p(),n.isOpen=!0}).one("pagehide",function(){n.isOpen=!1}),n.menuType="page",n.menuPageContent.append(n.list),n.menuPage.find("div .ui-title").text(n.label.text()),e.mobile.changePage(n.menuPage,{transition:e.mobile.defaultDialogTransition})):(n.menuType="overlay",n.listbox.one("popupafteropen",p).popup("open",{x:n.button.offset().left+n.button.outerWidth()/2,y:n.button.offset().top+n.button.outerHeight()/2}),n.isOpen=!0)},_buildList:function(){var t=this,r=this.options,i=this.placeholder,s=!0,o=[],u=[],a=t.isMultiple?"checkbox-off":"false";t.list.empty().filter(".ui-listview").listview("destroy");var f=t.select.find("option"),l=f.length,c=this.select[0],h="data-"+e.mobile.ns,p=h+"option-index",d=h+"icon",v=h+"role",m=h+"placeholder",g=n.createDocumentFragment(),y=!1,b;for(var w=0;w<l;w++,y=!1){var E=f[w],S=e(E),x=E.parentNode,T=S.text(),N=n.createElement("a"),C=[];N.setAttribute("href","#"),N.appendChild(n.createTextNode(T));if(x!==c&&x.nodeName.toLowerCase()==="optgroup"){var k=x.getAttribute("label");if(k!==b){var L=n.createElement("li");L.setAttribute(v,"list-divider"),L.setAttribute("role","option"),L.setAttribute("tabindex","-1"),L.appendChild(n.createTextNode(k)),g.appendChild(L),b=k}}s&&(!E.getAttribute("value")||T.length===0||S.jqmData("placeholder"))&&(s=!1,y=!0,E.hasAttribute(m)||(this._removePlaceholderAttr=!0),E.setAttribute(m,!0),r.hidePlaceholderMenuItems&&C.push("ui-selectmenu-placeholder"),i!==T&&(i=t.placeholder=T));var A=n.createElement("li");E.disabled&&(C.push("ui-disabled"),A.setAttribute("aria-disabled",!0)),A.setAttribute(p,w),A.setAttribute(d,a),y&&A.setAttribute(m,!0),A.className=C.join(" "),A.setAttribute("role","option"),N.setAttribute("tabindex","-1"),A.appendChild(N),g.appendChild(A)}t.list[0].appendChild(g),!this.isMultiple&&!i.length?this.header.hide():this.headerTitle.text(this.placeholder),t.list.listview()},_button:function(){return e("<a>",{href:"#",role:"button",id:this.buttonId,"aria-haspopup":"true","aria-owns":this.menuId})},_destroy:function(){this.close(),this._origTabIndex!==r&&(this._origTabIndex!==!1?this.select.attr("tabindex",this._origTabIndex):this.select.removeAttr("tabindex")),this._removePlaceholderAttr&&this._selectOptions().removeAttr("data-"+e.mobile.ns+"placeholder"),this.listbox.remove(),o.apply(this,arguments)}})};e(n).bind("selectmenubeforecreate",function(t){var n=e(t.target).data("selectmenu");!n.options.nativeMenu&&n.element.parents(":jqmData(role='popup')").length===0&&i(n)})}(e),function(e,r){e.widget("mobile.fixedtoolbar",e.mobile.widget,{options:{visibleOnPageShow:!0,disablePageZoom:!0,transition:"slide",fullscreen:!1,tapToggle:!0,tapToggleBlacklist:"a, button, input, select, textarea, .ui-header-fixed, .ui-footer-fixed, .ui-popup",hideDuringFocus:"input, textarea, select",updatePagePadding:!0,trackPersistentToolbars:!0,supportBlacklist:function(){var e=t,n=navigator.userAgent,r=navigator.platform,i=n.match(/AppleWebKit\/([0-9]+)/),s=!!i&&i[1],o=n.match(/Fennec\/([0-9]+)/),u=!!o&&o[1],a=n.match(/Opera Mobi\/([0-9]+)/),f=!!a&&a[1];return(r.indexOf("iPhone")>-1||r.indexOf("iPad")>-1||r.indexOf("iPod")>-1)&&s&&s<534||e.operamini&&{}.toString.call(e.operamini)==="[object OperaMini]"||a&&f<7458||n.indexOf("Android")>-1&&s&&s<533||u&&u<6||"palmGetResource"in t&&s&&s<534||n.indexOf("MeeGo")>-1&&n.indexOf("NokiaBrowser/8.5.0")>-1?!0:!1},initSelector:":jqmData(position='fixed')"},_create:function(){var e=this,t=e.options,n=e.element,r=n.is(":jqmData(role='header')")?"header":"footer",i=n.closest(".ui-page");if(t.supportBlacklist()){e.destroy();return}n.addClass("ui-"+r+"-fixed"),t.fullscreen?(n.addClass("ui-"+r+"-fullscreen"),i.addClass("ui-page-"+r+"-fullscreen")):i.addClass("ui-page-"+r+"-fixed"),e._addTransitionClass(),e._bindPageEvents(),e._bindToggleHandlers()},_addTransitionClass:function(){var e=this.options.transition;e&&e!=="none"&&(e==="slide"&&(e=this.element.is(".ui-header")?"slidedown":"slideup"),this.element.addClass(e))},_bindPageEvents:function(){var n=this,r=n.options,i=n.element;i.closest(".ui-page").bind("pagebeforeshow",function(){r.disablePageZoom&&e.mobile.zoom.disable(!0),r.visibleOnPageShow||n.hide(!0)}).bind("webkitAnimationStart animationstart updatelayout",function(){var e=this;r.updatePagePadding&&n.updatePagePadding(e)}).bind("pageshow",function(){var i=this;n.updatePagePadding(i),r.updatePagePadding&&e(t).bind("throttledresize."+n.widgetName,function(){n.updatePagePadding(i)})}).bind("pagebeforehide",function(i,s){r.disablePageZoom&&e.mobile.zoom.enable(!0),r.updatePagePadding&&e(t).unbind("throttledresize."+n.widgetName);if(r.trackPersistentToolbars){var u=e(".ui-footer-fixed:jqmData(id)",this),a=e(".ui-header-fixed:jqmData(id)",this),f=u.length&&s.nextPage&&e(".ui-footer-fixed:jqmData(id='"+u.jqmData("id")+"')",s.nextPage)||e(),l=a.length&&s.nextPage&&e(".ui-header-fixed:jqmData(id='"+a.jqmData("id")+"')",s.nextPage)||e();if(f.length||l.length)f.add(l).appendTo(e.mobile.pageContainer),s.nextPage.one("pageshow",function(){f.add(l).appendTo(this)})}})},_visible:!0,updatePagePadding:function(t){var n=this.element,r=n.is(".ui-header");if(this.options.fullscreen)return;t=t||n.closest(".ui-page"),e(t).css("padding-"+(r?"top":"bottom"),n.outerHeight())},_useTransition:function(n){var r=e(t),i=this.element,s=r.scrollTop(),o=i.height(),u=i.closest(".ui-page").height(),a=e.mobile.getScreenHeight(),f=i.is(":jqmData(role='header')")?"header":"footer";return!n&&(this.options.transition&&this.options.transition!=="none"&&(f==="header"&&!this.options.fullscreen&&s>o||f==="footer"&&!this.options.fullscreen&&s+a<u-o)||this.options.fullscreen)},show:function(e){var t="ui-fixed-hidden",n=this.element;this._useTransition(e)?n.removeClass("out "+t).addClass("in"):n.removeClass(t),this._visible=!0},hide:function(e){var t="ui-fixed-hidden",n=this.element,r="out"+(this.options.transition==="slide"?" reverse":"");this._useTransition(e)?n.addClass(r).removeClass("in").animationComplete(function(){n.addClass(t).removeClass(r)}):n.addClass(t).removeClass(r),this._visible=!1},toggle:function(){this[this._visible?"hide":"show"]()},_bindToggleHandlers:function(){var t=this,n=t.options,r=t.element;r.closest(".ui-page").bind("vclick",function(r){n.tapToggle&&!e(r.target).closest(n.tapToggleBlacklist).length&&t.toggle()}).bind("focusin focusout",function(r){screen.width<500&&e(r.target).is(n.hideDuringFocus)&&!e(r.target).closest(".ui-header-fixed, .ui-footer-fixed").length&&t[r.type==="focusin"&&t._visible?"hide":"show"]()})},_destroy:function(){var e=this.element,t=e.is(".ui-header");e.closest(".ui-page").css("padding-"+(t?"top":"bottom"),""),e.removeClass("ui-header-fixed ui-footer-fixed ui-header-fullscreen ui-footer-fullscreen in out fade slidedown slideup ui-fixed-hidden"),e.closest(".ui-page").removeClass("ui-page-header-fixed ui-page-footer-fixed ui-page-header-fullscreen ui-page-footer-fullscreen")}}),e(n).bind("pagecreate create",function(t){e(t.target).jqmData("fullscreen")&&e(e.mobile.fixedtoolbar.prototype.options.initSelector,t.target).not(":jqmData(fullscreen)").jqmData("fullscreen",!0),e.mobile.fixedtoolbar.prototype.enhanceWithin(t.target)})}(e),function(e,t){function a(e){r=e.originalEvent,u=r.accelerationIncludingGravity,i=Math.abs(u.x),s=Math.abs(u.y),o=Math.abs(u.z),!t.orientation&&(i>7||(o>6&&s<8||o<8&&s>6)&&i>5)?n.enabled&&n.disable():n.enabled||n.enable()}if(!(/iPhone|iPad|iPod/.test(navigator.platform)&&navigator.userAgent.indexOf("AppleWebKit")>-1))return;var n=e.mobile.zoom,r,i,s,o,u;e(t).bind("orientationchange.iosorientationfix",n.enable).bind("devicemotion.iosorientationfix",a)}(e,this),function(e,t,r){function u(){i.removeClass("ui-mobile-rendering")}var i=e("html"),s=e("head"),o=e(t);e(t.document).trigger("mobileinit");if(!e.mobile.gradeA())return;e.mobile.ajaxBlacklist&&(e.mobile.ajaxEnabled=!1),i.addClass("ui-mobile ui-mobile-rendering"),setTimeout(u,5e3),e.extend(e.mobile,{initializePage:function(){var t=e(":jqmData(role='page'), :jqmData(role='dialog')"),r=e.mobile.path.parseLocation().hash.replace("#",""),i=n.getElementById(r);t.length||(t=e("body").wrapInner("<div data-"+e.mobile.ns+"role='page'></div>").children(0)),t.each(function(){var t=e(this);t.jqmData("url")||t.attr("data-"+e.mobile.ns+"url",t.attr("id")||location.pathname+location.search)}),e.mobile.firstPage=t.first(),e.mobile.pageContainer=t.first().parent().addClass("ui-mobile-viewport"),o.trigger("pagecontainercreate"),e.mobile.showPageLoadingMsg(),u(),!e.mobile.hashListeningEnabled||!e.mobile.path.isHashValid(location.hash)||!e(i).is(':jqmData(role="page")')&&!e.mobile.path.isPath(r)&&r!==e.mobile.dialogHashKey?(e.mobile.path.isHashValid(location.hash)&&(e.mobile.urlHistory.initialDst=r.replace("#","")),e.mobile.changePage(e.mobile.firstPage,{transition:"none",reverse:!0,changeHash:!1,fromHashChange:!0})):o.trigger("hashchange",[!0])}}),e.mobile.navreadyDeferred.resolve(),e(function(){t.scrollTo(0,1),e.mobile.defaultHomeScroll=!e.support.scrollTop||e(t).scrollTop()===1?0:1,e.fn.controlgroup&&e(n).bind("pagecreate create",function(t){e(":jqmData(role='controlgroup')",t.target).jqmEnhanceable().controlgroup({excludeInvisible:!1})}),e.mobile.autoInitializePage&&e.mobile.initializePage(),o.load(e.mobile.silentScroll),e.support.cssPointerEvents||e(n).delegate(".ui-disabled","vclick",function(e){e.preventDefault(),e.stopImmediatePropagation()})})}(e,this)});
;/*
 * Author: cargomedia.ch
 *
 * Binds 'touchstart' when binding $.on('click')
 * and triggers 'click' when 'touchend' happens without 'touchmove' inbetween.
 */
(function($) {
	if (!("ontouchstart" in window)) {
		return;
	}

	var clickbuster = {
		isLocked: false,
		delayedUnlock: null,
		onClick: function(event) {
			if (this.isLocked || !window.tapReady) {
				event.stopPropagation();
				event.preventDefault();
			}
		},
		lock: function() {
			this.isLocked = true;
			var clickbuster = this;
			this.delayedUnlock = setTimeout(function() {
				clickbuster.unlock();
			}, 2000);
		},
		unlock: function() {
			this.isLocked = false;
			if (this.delayedUnlock) {
				window.clearTimeout(this.delayedUnlock);
			}
		}
	};
	document.addEventListener('click', function(e) {
		clickbuster.onClick(e);
	}, true);





	$.event.special.click = {
		delegateType: "click",
		bindType: "click",
		setup: function(data, namespaces, eventHandle) {
			var element = this;
			var touchHandler = {
				moveThreshold: 20,  // in pixels
				handleEvent: function(e) {
					switch(e.type) {
						case 'touchstart': this.onTouchStart(e); break;
						case 'touchmove': this.onTouchMove(e); break;
						case 'touchend': this.onTouchEnd(e); break;
					}
				},
				onTouchStart: function(e) {
					e.stopPropagation();
					this.moved = false;
					this.startX = e.touches[0].clientX;
					this.startY = e.touches[0].clientY;
					element.addEventListener('touchmove', this, false);
					element.addEventListener('touchend', this, false);
				},
				onTouchMove: function(e) {
					if (Math.abs(e.touches[0].clientX - this.startX) > this.moveThreshold ||
							Math.abs(e.touches[0].clientY - this.startY) > this.moveThreshold) {
						this.moved = true;
					}
				},
				onTouchEnd: function(e) {
					element.removeEventListener('touchmove', this, false);
					element.removeEventListener('touchend', this, false);

					if (!this.moved) {
						clickbuster.unlock();

						var theEvent = document.createEvent('MouseEvents');
						theEvent.initEvent('click', true, true);
						e.target.dispatchEvent(theEvent);

						clickbuster.lock();

						e.stopPropagation();
					}
				}
			};

			element.addEventListener('touchstart', touchHandler, false);

			$(element).data('touchToClick-handler', touchHandler);

			return false;
		},
		teardown: function(namespaces) {
			var element = this;
			var touchHandler = $(element).data('touchToClick-handler');
			element.removeEventListener('touchstart', touchHandler, false);

			return false;
		}
	};
})(jQuery);

;
//@ sourceMappingURL=vendor.js.map