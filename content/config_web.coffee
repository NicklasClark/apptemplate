exports.config =
  # See docs at http://brunch.readthedocs.org/en/latest/config.html.
  buildTarget: 'Web'
  paths:
    public: 'public_web'
  files:
    javascripts:
      defaultExtension: 'js'
      joinTo:
        'javascripts/app.js': /^app/
        'javascripts/vendor.js': /^vendor/
      order:
        before: ['vendor/scripts/cordova/cordova-2.4.0.js',
          'vendor/scripts/cordova/plugins/ChildBrowser.js',
          'vendor/scripts/cordova/plugins/Filepicker.js',
          'vendor/scripts/cordova/plugins/KnowItAllBrowser.js',
          'vendor/scripts/jquery-1.7.2.min.js',
          'vendor/scripts/jquery.mobile-1.1.1.min.js'
          'vendor/scripts/underscore-1.3.3.js',
          'vendor/scripts/backbone/json2.js',
          'vendor/scripts/backbone/backbone-0.9.10.js',
          'vendor/scripts/backbone/backstack.js',
          'vendor/scripts/backbone/sha512.js',
          'vendor/scripts/jquery.royalslider.min.js'

        ]

    stylesheets:
      defaultExtension: 'styl'
      joinTo: 'stylesheets/app.css'
      order:
        before: ['vendor/styles/normalize.css','vendor/styles/jquerymobileanimations.css', 'vendor/styles/royalslider.css']
        after: ['vendor/styles/helpers.css']

    templates:
      defaultExtension: 'hbs'
      joinTo: 'javascripts/app.js'
