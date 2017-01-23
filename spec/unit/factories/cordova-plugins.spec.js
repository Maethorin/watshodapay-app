describe('CordovaPlugins', function() {
  var CordovaPlugins;

  beforeEach(module('watshodapay'));

  beforeEach(inject(function(_CordovaPlugins_) {
    CordovaPlugins = _CordovaPlugins_;
  }));

  it('should have initialization method', function() {
    expect(CordovaPlugins.init).toBeDefined();
  });

  it('should do nothing if cordova is not present', function() {
    expect(CordovaPlugins.init()).toBe(false);
    expect(CordovaPlugins.plugins).not.toBeDefined();
  });

  it('should do nothing if cordova.plugins is not present', function() {
    window.cordova = {};
    expect(CordovaPlugins.init()).toBe(false);
    expect(CordovaPlugins.plugins).not.toBeDefined();
    delete window.cordova;
  });

  describe('when initializing', function() {
    beforeEach(function() {
      window.cordova = {
        plugins: {}
      };
    });

    afterEach(function() {
      delete window.cordova;
    });

    it('should be possible to tell if has plugin', function() {
      window.cordova.plugins.SomePlugin = {};
      CordovaPlugins.init();
      expect(CordovaPlugins.hasPlugin('SomePlugin')).toBe(true);
    });

    it('should be possible to tell if it dont has plugin', function() {
      CordovaPlugins.init();
      expect(CordovaPlugins.hasPlugin('SomePlugin')).toBe(false);
    });

    it('should hide keyboard accessory', function() {
      window.cordova.plugins.Keyboard = {
        hideKeyboardAccessoryBar: function(value) {}
      };
      spyOn(window.cordova.plugins.Keyboard, 'hideKeyboardAccessoryBar');
      CordovaPlugins.init();
      expect(window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar).toHaveBeenCalledWith(true);
    });
  });
});