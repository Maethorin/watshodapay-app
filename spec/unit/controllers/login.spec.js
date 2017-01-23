describe('Login', function() {
  var $controller, $rootScope, $scope, $state, $httpBackend, $ionicLoading, $ionicPopup, Login, AuthService;

  var loginUrl = "@@backendURL/login";

  beforeEach(module('watshodapay'));

  beforeEach(inject(function(_$rootScope_, _$controller_, _$state_, _$httpBackend_, _$ionicLoading_, _$ionicPopup_, _Login_, _AuthService_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $state = _$state_;
    $httpBackend = _$httpBackend_;
    $httpBackend.whenGET(/\.html$/).respond('');
    $ionicLoading = _$ionicLoading_;
    $ionicPopup = _$ionicPopup_;
    AuthService = _AuthService_;
    $scope = $rootScope.$new();
    Login = _Login_;
    loginController = $controller(
        'LoginController',
        {
          $scope: $scope,
          $state: $state,
          $ionicPopup: $ionicPopup,
          Login: Login
        }
    );
    localStorage.removeItem('XSRF-TOKEN');
  }));

  it('should have route for login', function() {
    expect($state.href('loginState')).toEqual('#/login');
  });

  describe('route configured', function() {
    var state;
    beforeEach(function() {
      state = $state.get('loginState');
    });
    it('should have an url', function() {
      expect(state.url).toEqual('/login');
    });
    it('should have a template', function() {
      expect(state.templateUrl).toEqual('templates/login/form.html');
    });
    it('should have a controller', function() {
      expect(state.controller).toEqual('LoginController');
    });
  });

  describe('resource', function() {
    it('should call api login url', function() {
      $httpBackend.expect("POST", loginUrl).respond(200, JSON.stringify({id: 123}));
      var user = Login.save();
      $httpBackend.flush();
      expect(user).toBeTruthy();
    });
  });

  describe('initializing the controller', function() {
    it('should defined to not show the menu', function() {
      expect($scope.showMenu).toBeFalsy();
    });
    it('should define user model', function() {
      expect($scope.user).toEqual({username: null, password: null, origin: 'client'});
    });
    it('should define login function', function() {
      expect($scope.login).toBeDefined();
    });
  });

  describe('sending', function() {
    beforeEach(function() {
      spyOn($ionicPopup, 'alert');
      spyOn($ionicLoading, 'show');
      spyOn($ionicLoading, 'hide');
    });

    it('should send only if data is ok', function() {
      spyOn(Login.prototype, '$save').and.returnValue({then: function() {}});

      $scope.login();
      expect($ionicPopup.alert).toHaveBeenCalled();
      expect(Login.prototype.$save).not.toHaveBeenCalled();
    });

    it('should send if data is ok', function() {
      spyOn(Login.prototype, '$save').and.returnValue({then: function() {}});

      $scope.user = {
        username: 'username@email.com',
        password: '****',
        origin: 'client'
      };

      $scope.login();
      expect($ionicLoading.show).toHaveBeenCalledWith({ template: 'Autenticando...' });
      expect(Login.prototype.$save).toHaveBeenCalled();
    });

    it('should show popup if login fail', function() {
      $scope.user = {
        username: 'username@email.com',
        password: '****',
        origin: 'client'
      };

      $httpBackend.expect("POST", loginUrl).respond(400, JSON.stringify({}));
      $scope.login();
      $httpBackend.flush();
      expect($ionicLoading.hide).toHaveBeenCalled();
      expect($ionicPopup.alert).toHaveBeenCalled();
    });

    it('should update authentication if success', function() {
      $scope.user = {
        username: 'username@email.com',
        password: '****',
        origin: 'client'
      };

      $httpBackend.expect("POST", loginUrl).respond(200, JSON.stringify({id: 123}), {'XSRF-TOKEN': 'SERVER-TOKEN'});
      $scope.login();
      $httpBackend.flush();
      expect(AuthService.token).toBe('SERVER-TOKEN');
    });
  });
});
