describe('MenuController', function() {
  var menuController, $controller, $rootScope, $scope, AuthService;

  beforeEach(module('watshodapay'));

  beforeEach(inject(function(_$rootScope_, _$controller_, _AuthService_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    AuthService = _AuthService_;
    AuthService.update('TOKEN', 'User Test');
  }));

  function loadController() {
    $controller(
      'MenuController',
      {
        $scope: $scope,
        AuthService: AuthService
      }
    );
  }

  beforeEach(function() {
    loadController();
  });

  describe('initializing the controller', function() {
    it('should be able to logout user', function() {
      expect(AuthService.userIsLogged()).toBeTruthy();
      $scope.logout();
      expect(AuthService.userIsLogged()).toBeFalsy();
    });
  });
});