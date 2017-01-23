'use strict';

watshodapayFactories.factory('CordovaPlugins', [function() {
  return {
    init: function() {
      if (window.cordova == undefined || window.cordova.plugins == undefined) {
        return false;
      }

      this.plugins = window.cordova.plugins;

      if (this.hasPlugin('Keyboard')) {
        this.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
    },

    hasPlugin: function(name) {
      return this.plugins.hasOwnProperty(name);
    }
  }
}]);
