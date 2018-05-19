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

      .state('debtsState.all', {
        cache: false,
        url: '/all',
        views: {
          'tabAll': {
            templateUrl: 'templates/debts/all.html',
            controller: 'AllController'
          }
        }
      })
      .state('debtsState.expired', {
        cache: false,
        url: '/expired',
        views: {
          'tabExpired': {
            templateUrl: 'templates/debts/expired.html',
            controller: 'ExpiredController'
          }
        }
      })
      .state('debtsState.today', {
        cache: false,
        url: '/today',
        views: {
          'tabToday': {
            templateUrl: 'templates/debts/today.html',
            controller: 'TodayController'
          }
        }
      })
      .state('debtsState.tomorrow', {
        cache: false,
        url: '/tomorrow',
        views: {
          'tabTomorrow': {
            templateUrl: 'templates/debts/tomorrow.html',
            controller: 'TomorrowController'
          }
        }
      })
      .state('debtsState.opened', {
        cache: false,
        url: '/opened',
        views: {
          'tabOpened': {
            templateUrl: 'templates/debts/opened.html',
            controller: 'OpenedController'
          }
        }
      })
      .state('debtsState.payed', {
        cache: false,
        url: '/payed',
        views: {
          'tabPayed': {
            templateUrl: 'templates/debts/payed.html',
            controller: 'PayedController'
          }
        }
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
  }])

  .controller('AllController', ['$scope', '$ionicLoading', 'DebtsService', function($scope, $ionicLoading, DebtsService) {
    DebtsService.getDebt('all').then(
      function(debts) {
        $scope.debts = debts;
      }
    );
  }])

  .controller('ExpiredController', ['$scope', '$ionicLoading', 'DebtsService', function($scope, $ionicLoading, DebtsService) {
    $scope.type = 'expired';
    DebtsService.getDebt('expired').then(
      function(debts) {
        $scope.debts = debts;
      }
    );
  }])

  .controller('TodayController', ['$scope', '$ionicLoading', 'DebtsService', function($scope, $ionicLoading, DebtsService) {
    DebtsService.getDebt('today').then(
      function(debts) {
        $scope.debts = debts;
      }
    );
  }])

  .controller('TomorrowController', ['$scope', '$ionicLoading', 'DebtsService', function($scope, $ionicLoading, DebtsService) {
    DebtsService.getDebt('tomorrow').then(
      function(debts) {
        $scope.debts = debts;
      }
    );
  }])

  .controller('OpenedController', ['$scope', '$ionicLoading', 'DebtsService', function($scope, $ionicLoading, DebtsService) {
    DebtsService.getDebt('opened').then(
      function(debts) {
        $scope.debts = debts;
      }
    );
  }])

  .controller('PayedController', ['$scope', '$ionicLoading', 'DebtsService', function($scope, $ionicLoading, DebtsService) {
    DebtsService.getDebt('payed').then(
      function(debts) {
        $scope.debts = debts;
      }
    );
  }]);

