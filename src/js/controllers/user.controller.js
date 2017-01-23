'use strict';

angular.module('watshodapay.user', [])
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
        .state('createUserState', {
          cache: false,
          url: '/user/create',
          templateUrl: 'templates/user/form.html',
          controller: 'CreateUserController'
        });
  }])

  .controller('CreateUserController', ['$scope', '$rootScope', '$state', '$ionicPopup', '$ionicLoading', 'AuthService', 'User', 'ErrorsService', function($scope, $rootScope, $state, $ionicPopup, $ionicLoading, AuthService, User, ErrorsService) {
    $scope.pageTitle = 'Cadastro';
    $scope.user = {
      name: null,
      surname: null,
      password: null,
      email: null,
      cpf: null,
      phone: null
    };

    function showAlert(title, message, buttons) {
      $ionicPopup.alert({
        title: title,
        template: message,
        buttons: buttons
      });
    }

    $scope.submitForm = function(form) {
      if (form.$invalid) {
        angular.forEach(form.$error, function (field) {
          angular.forEach(field, function(errorField){
            errorField.$setDirty();
          })
        });

        showAlert(
          'Dados faltando ou inválidos',
          'Um ou mais dados obrigatórios não foram preenchidos corretamente. Por favor, corrija e tente novamente.',
          [{
            text: 'Ok',
            type: 'button-negative'
          }]
        );
        return false;
      }

      $ionicLoading.show({
        template: 'Salvando...'
      });

      var user = User.createNew($scope.user);
      user.$save().then(
        function(response) {
          $ionicLoading.hide();
          showAlert(
            'Cadastro confirmado',
            'Seu cadastro foi realizado com sucesso.',
            [{
              text: 'Ok',
              type: 'button-positive'
            }]
          );

          AuthService.update(response.headers['XSRF-TOKEN']);
        },

        function(response) {
          var errors = response.data.errors;

          var message = ErrorsService.userCreation.setErrorMessages(errors);

          $ionicLoading.hide();

          showAlert(
            'Dados inválidos',
            message,
            [{
              text: 'Ok',
              type: 'button-negative'
            }]
          );
        }
      );
    };
  }]);