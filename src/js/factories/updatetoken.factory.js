watshodapayFactories.factory('updateToken', ['AuthService', '$location', '$q', function(AuthService, $location, $q) {
  return {
    response: function(response) {
      if (response.headers('xsrf-token')) {
        AuthService.update(response.headers('xsrf-token'))
      }
      return response;
    },

    responseError: function(response) {
      if (response.status == 401) {
        AuthService.clear();
        if ($location.path().indexOf('/login') == -1) {
          $location.path("/login");
        }
      }
      return $q.reject(response);
    },

    request: function(config) {
      config.headers['XSRF-TOKEN'] = AuthService.getToken();

      return config;
    }
  };
}]);