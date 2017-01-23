describe('Password match directive', function() {
  var $compile, $scope, $ionicPopup, $ionicPlatform, $httpBackend;

  var meURL = "@@backendURL/me";

  beforeEach(module('watshodapay'));

  beforeEach(inject(function(_$compile_, _$rootScope_, _$httpBackend_, _$ionicPopup_) {
    $compile = _$compile_;
    $scope = _$rootScope_.$new();
    $ionicPopup = _$ionicPopup_;
    $httpBackend = _$httpBackend_;
    $httpBackend.whenGET(/\.html$/).respond('');
    $httpBackend.whenGET(meURL).respond(200, {id: 123, name: 'John', surname: 'Doe', origin: 'client', email: 'johndoe@email.com'}, {'XSRF-TOKEN': 'SERVER-TOKEN'});
  }));

  describe('password-match', function() {
    beforeEach(function() {
      var html = [
        '<form name="form" novalidate>',
        '<input type="password" ng-model="confirmPassword" name="confirmPassword" password-match />',
        '</form>'
      ].join('');
      $compile(html)($scope);
    });

    it('should have for password confirmation', function() {
      expect($scope.form.confirmPassword.$validators.passwordMatch).toBeDefined();
    });

    it('should set invalid if passwords does not match', function() {
      $scope.form.confirmPassword.$setViewValue('1222');
      $scope.user = {password: '1234'};
      expect($scope.form.confirmPassword.$validators.passwordMatch()).toBeFalsy();
    });

    it('should set invalid if passwords does not match passing to function', function() {
      $scope.user = {password: '1234'};
      expect($scope.form.confirmPassword.$validators.passwordMatch(null, '1222')).toBeFalsy();
    });

    it('should set valid if passwords match', function() {
      $scope.form.confirmPassword.$setViewValue('1234');
      $scope.user = {password: '1234'};
      expect($scope.form.confirmPassword.$validators.passwordMatch()).toBeTruthy();
    });

    it('should set valid if passwords match passing to function', function() {
      $scope.user = {password: '1234'};
      expect($scope.form.confirmPassword.$validators.passwordMatch(null, '1234')).toBeTruthy();
    });
  });
});