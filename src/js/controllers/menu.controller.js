angular.module('watshodapay.menu', [])
  .controller('MenuController', ['$scope', '$state', 'Login', 'AuthService', function($scope, $state, Login, AuthService) {
    $scope.logout = function() {
      Login.delete();
      AuthService.clear();
      $state.go('loginState');
    }
  }]);
