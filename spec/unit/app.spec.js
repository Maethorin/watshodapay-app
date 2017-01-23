describe('General functions', function() {
  describe('format string', function() {
    it('should format string with array', function () {
      expect(format("String {0} be {1}", ["to", "formatted"])).toBe("String to be formatted")
    });
    it('should format string with object', function () {
      expect(format("String {to} be {formatted}", {to: "to", formatted:"formatted"})).toBe("String to be formatted")
    });
    it('should format string in prototype', function () {
      expect("String {0} be {1}".format(["to", "formatted"])).toBe("String to be formatted")
    })
  });

  describe('slugify string', function() {
    it('should slugify with spaces', function() {
      expect('with spaces'.slugify()).toEqual('with-spaces');
    });

    it('should slugify always with lower case', function() {
      expect('with UPPERCASE'.slugify()).toEqual('with-uppercase');
    });

    it('should slugify with special chars', function() {
      expect('with spéçiãl char'.slugify()).toEqual('with-special-char');
    });
  });
});

describe('App common', function() {
  var appConfig, AuthService, updateToken, $location, $rootScope, $httpBackend, $state;
  var meURL = '@@backendURL/me';
  var userMe = {id: 123, name: 'John', surname: 'Doe', origin: 'client', email: 'johndoe@email.com', emailConfirmed: false};
  var headers = {'XSRF-TOKEN': 'SERVER-TOKEN'};

  beforeEach(module('watshodapay'));

  beforeEach(inject(function(_appConfig_, _AuthService_, _updateToken_, _$location_, _$rootScope_, _$httpBackend_, _$state_) {
    appConfig = _appConfig_;
    AuthService = _AuthService_;
    updateToken = _updateToken_;
    $location = _$location_;
    $rootScope = _$rootScope_;
    $httpBackend = _$httpBackend_;
    $state = _$state_;
    spyOn($state, 'go');
    $httpBackend.whenGET(/\.html$/).respond('');
  }));

  describe('running', function() {

    describe('menu button', function() {
      it('should define showMenuButton to false if in loginState', function() {
        spyOn(AuthService, 'userIsLogged').and.returnValue(false);
        $rootScope.$broadcast('$ionicView.beforeEnter', {stateName: 'loginState'});
        expect($rootScope.showMenuButton).toBeDefined();
        expect($rootScope.showMenuButton).toBeFalsy();
      });

      it('should define showMenuButton to false if in createUserState', function() {
        spyOn(AuthService, 'userIsLogged').and.returnValue(false);
        $rootScope.$broadcast('$ionicView.beforeEnter', {stateName: 'createUserState'});
        expect($rootScope.showMenuButton).toBeDefined();
        expect($rootScope.showMenuButton).toBeFalsy();
      });

      it('should define showMenuButton to true if any other state', function() {
        spyOn(AuthService, 'userIsLogged').and.returnValue(true);

        $rootScope.$broadcast('$ionicView.beforeEnter', {stateName: 'whatEverState'});
        expect($rootScope.showMenuButton).toBeDefined();
        expect($rootScope.showMenuButton).toBeTruthy();
      });
    });

    describe('logged redirects rules', function() {
      describe('locationChangeStart', function() {
        it('should have user object on rootScope', function() {
          $httpBackend.whenGET(meURL).respond(200, userMe, headers);
          spyOn(AuthService, 'userIsLogged').and.returnValue(true);

          $rootScope.$broadcast('$locationChangeStart', {stateName: 'newOrderState'});

          $httpBackend.flush();
          expect($rootScope.user).toEqual({ name: 'John', surname: 'Doe', emailConfirmed: false });
        });

        it('should send to login page if user is not logged in', function() {
          $httpBackend.whenGET(meURL).respond(401, {});
          spyOn(AuthService, 'userIsLogged').and.returnValue(true);

          $rootScope.$broadcast('$locationChangeStart', {stateName: 'newOrderState'});

          $httpBackend.flush();
          expect($state.go).toHaveBeenCalledWith('loginState');
        });

        it('should clear cache of user if not logged in', function() {
          $httpBackend.whenGET(meURL).respond(401, {});
          spyOn(AuthService, 'userIsLogged').and.returnValue(true);
          spyOn(AuthService, 'clear');

          $rootScope.$broadcast('$locationChangeStart', {stateName: 'newOrderState'});

          $httpBackend.flush();
          expect(AuthService.clear).toHaveBeenCalled();
        });
      });

      describe('on resume', function() {
        it('should have user object on rootScope', function() {
          $httpBackend.whenGET(meURL).respond(200, userMe, headers);
          spyOn(AuthService, 'userIsLogged').and.returnValue(true);

          $rootScope.$broadcast('onResume', {stateName: 'newOrderState'});

          $httpBackend.flush();
          expect($rootScope.user).toEqual({ name: 'John', surname: 'Doe', emailConfirmed: false });
        });

        it('should send to login page if user is not logged in', function() {
          $httpBackend.whenGET(meURL).respond(401, {});
          spyOn(AuthService, 'userIsLogged').and.returnValue(true);

          $rootScope.$broadcast('onResume', {stateName: 'newOrderState'});

          $httpBackend.flush();
          expect($state.go).toHaveBeenCalledWith('loginState');
        });

        it('should clear cache of user if not logged in', function() {
          $httpBackend.whenGET(meURL).respond(401, {});
          spyOn(AuthService, 'userIsLogged').and.returnValue(true);
          spyOn(AuthService, 'clear');

          $rootScope.$broadcast('onResume', {stateName: 'newOrderState'});

          $httpBackend.flush();
          expect(AuthService.clear).toHaveBeenCalled();
        });
      });
    });
  });

  describe('configuration', function () {
    it('should get the value of setBackendURL', function () {
      expect(appConfig.backendURL).toBe('@@backendURL');
    });

    it('should set env', function () {
      expect(appConfig.env).toBe('@@env');
    });

    it('should have property to define backgroundMode', function () {
      expect(appConfig.backgroundMode).toBe(false);
    });

    it('should have property to define on resume', function () {
      expect(appConfig.onResume).toBeDefined();
    });

    it('should define if had cordova plugins', function () {
      expect(appConfig.hasCordovaPlugins).toBe(false);
    });
  });

  describe('updating token', function () {
    it('should update AuthService if there is a XSRF-TOKEN in response header', function () {
      spyOn(AuthService, 'update');

      var response = {
        headers: function() {
          return {
            'xsrf-token': 'TOOOOOKEEEN'
          }
        }
      };

      updateToken.response(response);
      expect(AuthService.update).toHaveBeenCalledWith({'xsrf-token': 'TOOOOOKEEEN'})
    });

    it('should clear AuthService data if response status code is 401', function () {
      spyOn(AuthService, 'clear');
      spyOn($location, 'path').and.returnValue('/login');

      var response = {
        status: 401
      };

      updateToken.responseError(response);
      expect(AuthService.clear).toHaveBeenCalled()
    });

    it('should redirect to login if get a 401 response status code and are not in login page', function () {
      spyOn($location, 'path').and.returnValue('/elsewhere');

      var response = {
        status: 401
      };

      updateToken.responseError(response);
      expect($location.path.calls.argsFor(1)).toEqual(['/login'])
    });

    it('should add XSRF-TOKEN in request header', function () {
      spyOn(AuthService, 'getToken').and.returnValue('TOOOOKEEEEN');

      var config = {
        url: 'something/with/watshodapay',
        headers: {}
      };

      updateToken.request(config);
      expect(config.headers['XSRF-TOKEN']).toBe('TOOOOKEEEEN')
    });
  });
});
