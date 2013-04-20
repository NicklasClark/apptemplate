(function() {

var cordovaRef = window.PhoneGap || window.Cordova || window.cordova; // old to new fallbacks

function KnowItAllBrowser() {}

KnowItAllBrowser.prototype = {
  _eventHandler: function(event) {
    // TODO
    console.log('KnowItAllBrowser._eventHandler');
  },
  close: function(eventname) {
    cordovaRef.exec(null, null, 'KnowItAllBrowser', 'close', []);
  },
  addEventListener: function(eventname, f) {
    // TODO
    console.log('KnowItAllBrowser.addEventListener');
  },
  removeEventListener: function(eventname, f) {
    // TODO
    console.log('KnowItAllBrowser.removeEventListener');
  },
};

KnowItAllBrowser.prototype.open = function(strUrl, strTitle) {
  var cb = function(eventname) {
    this._eventHandler(eventname);
  }
  cordovaRef.exec(cb, null, 'KnowItAllBrowser', 'open', [strUrl, strTitle]);
};

cordovaRef.addConstructor(function() {
  if (!window.plugins) window.plugins = {};
  window.plugins.knowitallbrowser = new KnowItAllBrowser();
});

})();