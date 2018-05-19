'use strict';

angular.module('watshodapay.login', [])
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('loginState', {
        cache: false,
        url: '/login',
        templateUrl: 'templates/login/form.html',
        controller: 'LoginController'
      });
  }])
  .controller('LoginController', ['$scope', '$rootScope', '$state', '$ionicPopup', '$ionicLoading', '$ionicHistory', 'Login', 'AuthService', function($scope, $rootScope, $state, $ionicPopup, $ionicLoading, $ionicHistory, Login, AuthService) {
    $ionicLoading.hide();
    $scope.user = {
      username: null,
      password: null
    };

    function showErrorPopUp() {
      $ionicPopup.alert({
        title: 'Login falhou',
        template: 'Não foi possível fazer login com os dados informados',
        buttons: [{
          text: 'Ok',
          type: 'button-negative'
        }]
      });
    }

    $scope.login = function() {
      if (!$scope.user.username || !$scope.user.password) {
        showErrorPopUp();
        return false;
      }

      $ionicLoading.show({
        template: 'Autenticando...'
      });

      var login = new Login($scope.user);
      login.$save().then(
        function(response) {
          AuthService.update(response.headers['XSRF-TOKEN']);
          $ionicLoading.hide();
          $state.go('homeState');
        },
        function() {
          $ionicLoading.hide();
          showErrorPopUp();
        }
      );
    };
  }]);
