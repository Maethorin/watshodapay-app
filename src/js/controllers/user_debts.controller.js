'use strict';

angular.module('watshodapay.userDebts', [])
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('debtsState', {
        cache: false,
        url: '/debts',
        templateUrl: 'templates/debts/index.html',
        controller: 'DebtsController'
      })

      .state('createDebtState', {
        cache: false,
        url: '/debts/create',
        templateUrl: 'templates/debts/form.html',
        controller: 'CreateDebtController'
      })
  }])

  .controller('CreateDebtController', ['$scope', '$state', '$ionicLoading', '$ionicPopup', 'DebtsService', 'ErrorsService', function($scope, $state, $ionicLoading, $ionicPopup, DebtsService, ErrorsService) {
    $scope.debt = {};

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

      function showAlert(title, message, buttons) {
        $ionicPopup.alert({
          title: title,
          template: message,
          buttons: buttons
        });
      }

      DebtsService.saveDebt($scope.debt).then(
        function(response) {
          $ionicLoading.hide();
          showAlert(
            'Débito registrado',
            'Seu débito foi registrado com sucesso.',
            [{
              text: 'Ok',
              type: 'button-positive'
            }]
          );
          $state.go('debtsState');
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
  }])

  .controller('DebtsController', ['$scope', '$ionicLoading', 'DebtsService', function($scope, $ionicLoading, DebtsService) {
    DebtsService.getDebt().then(
      function(debts) {
        $scope.debts = debts;
      }
    );
  }]);
