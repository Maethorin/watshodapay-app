'use strict';

angular.module('watshodapay.userPayments', [])
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('paymentsState', {
        cache: false,
        url: '/payments',
        templateUrl: 'templates/payments/index.html',
        controller: 'PaymentsController'
      })

      .state('createPaymentState', {
        cache: false,
        url: '/payments/create',
        templateUrl: 'templates/payments/form.html',
        controller: 'CreatePaymentController'
      })

      .state('paymentsState.all', {
        cache: false,
        url: '/all',
        views: {
          'tabAll': {
            templateUrl: 'templates/payments/all.html',
            controller: 'AllPaymentsController'
          }
        }
      })
      .state('paymentsState.expired', {
        cache: false,
        url: '/expired',
        views: {
          'tabExpired': {
            templateUrl: 'templates/payments/expired.html',
            controller: 'ExpiredController'
          }
        }
      })
      .state('paymentsState.today', {
        cache: false,
        url: '/today',
        views: {
          'tabToday': {
            templateUrl: 'templates/payments/today.html',
            controller: 'TodayController'
          }
        }
      })
      .state('paymentsState.tomorrow', {
        cache: false,
        url: '/tomorrow',
        views: {
          'tabTomorrow': {
            templateUrl: 'templates/payments/tomorrow.html',
            controller: 'TomorrowController'
          }
        }
      })
      .state('paymentsState.opened', {
        cache: false,
        url: '/opened',
        views: {
          'tabOpened': {
            templateUrl: 'templates/payments/opened.html',
            controller: 'OpenedController'
          }
        }
      })
      .state('paymentsState.payed', {
        cache: false,
        url: '/payed',
        views: {
          'tabPayed': {
            templateUrl: 'templates/payments/payed.html',
            controller: 'PayedController'
          }
        }
      })
  }])

  .controller('CreatePaymentController', ['$scope', '$state', '$ionicLoading', '$ionicPopup', 'PaymentsService', 'ErrorsService', function($scope, $state, $ionicLoading, $ionicPopup, PaymentsService, ErrorsService) {
    $scope.months = [
      {number: 1, name: 'Jan'},
      {number: 2, name: 'Fev'},
      {number: 3, name: 'Mar'},
      {number: 4, name: 'Abr'},
      {number: 5, name: 'Mai'},
      {number: 6, name: 'Jun'},
      {number: 7, name: 'Jul'},
      {number: 8, name: 'Ago'},
      {number: 9, name: 'Set'},
      {number: 10, name: 'Out'},
      {number: 11, name: 'Nov'},
      {number: 12, name: 'Dez'}
    ];
    $scope.years = [
      2016, 2017, 2018, 2019, 2020
    ];
    $scope.payment = {
      year: null,
      month: null,
      value: null,
      single: true,
      isRecurrent: false,
      debt: {
        description: null,
        expirationDay: null,
        quantity: null,
        value: null
      }
    };

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

      $scope.payment.debt.value = $scope.payment.value;

      PaymentsService.savePayment($scope.payment).then(
        function(response) {
          $ionicLoading.hide();
          showAlert(
            'Pagamento criado',
            'Seu pagamento foi criado com sucesso.',
            [{
              text: 'Ok',
              type: 'button-positive'
            }]
          );
          $state.go('paymentsState');
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

  .controller('PaymentsController', ['$scope', '$ionicLoading', 'PaymentsService', function($scope, $ionicLoading, PaymentsService) {
  }])

  .controller('AllPaymentsController', ['$scope', '$state', '$ionicLoading', '$ionicPopup', '$ionicModal', 'PaymentsService', function($scope, $state, $ionicLoading, $ionicPopup, $ionicModal, PaymentsService) {
    $scope.type = 'all';

    PaymentsService.getPayment(true).then(
      function(payments) {
        $scope.payments = payments;
      }
    );

    $scope.selectPayment = function(payment) {
      PaymentsService.selectPayment(payment, $scope);
    };

    $scope.createPayment = function() {
      $state.go('createPaymentState');
    }
  }])

  .controller('ExpiredController', ['$scope', '$ionicLoading', 'PaymentsService', function($scope, $ionicLoading, PaymentsService) {
    $scope.type = 'expired';
    PaymentsService.getPayment().then(
      function(payments) {
        $scope.payments = payments;
      }
    );

    $scope.selectPayment = function(payment) {
      PaymentsService.selectPayment(payment, $scope);
    };
  }])

  .controller('TodayController', ['$scope', '$ionicLoading', 'PaymentsService', function($scope, $ionicLoading, PaymentsService) {
    $scope.type = 'today';
    PaymentsService.getPayment().then(
      function(payments) {
        $scope.payments = payments;
      }
    );

    $scope.selectPayment = function(payment) {
      PaymentsService.selectPayment(payment, $scope);
    };
  }])

  .controller('TomorrowController', ['$scope', '$ionicLoading', 'PaymentsService', function($scope, $ionicLoading, PaymentsService) {
    $scope.type = 'tomorrow';
    PaymentsService.getPayment().then(
      function(payments) {
        $scope.payments = payments;
      }
    );

    $scope.selectPayment = function(payment) {
      PaymentsService.selectPayment(payment, $scope);
    };
  }])

  .controller('OpenedController', ['$scope', '$ionicLoading', 'PaymentsService', function($scope, $ionicLoading, PaymentsService) {
    $scope.type = 'opened';
    PaymentsService.getPayment().then(
      function(payments) {
        $scope.payments = payments;
      }
    );

    $scope.selectPayment = function(payment) {
      PaymentsService.selectPayment(payment, $scope);
    };
  }])

  .controller('PayedController', ['$scope', '$ionicLoading', 'PaymentsService', function($scope, $ionicLoading, PaymentsService) {
    $scope.type = 'payed';
    PaymentsService.getPayment().then(
      function(payments) {
        $scope.payments = payments;
      }
    );

    $scope.selectPayment = function(payment) {
      PaymentsService.selectPayment(payment, $scope);
    };
  }]);
