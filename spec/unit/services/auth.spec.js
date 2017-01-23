describe('Authentication', function() {
  var $rootScope, AuthService;
  beforeEach(module('watshodapay'));

  beforeEach(inject(function(_$rootScope_, _AuthService_) {
    $rootScope = _$rootScope_;
    AuthService = _AuthService_;
    localStorage.removeItem('XSRF-TOKEN');
  }));

  it('should set values in localStorage', function() {
    expect(localStorage.getItem('XSRF-TOKEN')).toBeNull();
    AuthService.update('TOKEN', 123);
    expect(localStorage.getItem('XSRF-TOKEN')).toBe('TOKEN');
  });

  it('should get values from localStorage', function() {
    localStorage.setItem('XSRF-TOKEN', 'token');
    expect(AuthService.getToken()).toBe('token');
  });

  it('should have properties for token and user_id', function() {
    AuthService.update('TOKEN');
    expect(AuthService.token).toBe('TOKEN');
  });

  it('should inform if user is logged based on token in localStorage', function() {
    expect(AuthService.userIsLogged()).toBeFalsy();
    localStorage.setItem('XSRF-TOKEN', 'TOKEN');
    expect(AuthService.userIsLogged()).toBeTruthy();
  });

  it('should set values in rootScope', function() {
    AuthService.update('TOKEN');
    expect($rootScope.userLogged).toBeTruthy();
  });
});