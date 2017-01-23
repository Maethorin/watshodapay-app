'use strict';

watshodapayServices.service('AuthService', ['$rootScope', function($rootScope) {
    this.token = null;

    this.update = function(token) {
      if (token) {
        localStorage.setItem('XSRF-TOKEN', token);
      }

      this.token = localStorage.getItem('XSRF-TOKEN');
      $rootScope.userLogged = this.userIsLogged();
    };

    this.userIsLogged = function() {
      return localStorage.getItem('XSRF-TOKEN') != null;
    };

    this.clear = function() {
      localStorage.removeItem('XSRF-TOKEN');
      this.update();
    };

    this.getToken = function() {
      return localStorage.getItem('XSRF-TOKEN')
    }
  }]);