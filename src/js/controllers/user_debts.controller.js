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

  .controller('DebtsController', ['$scope', '$ionicLoading', 'DebtsService', function($scope, $ionicLoading, DebtsService) {
    // $ionicLoading.show({
    //   template: 'Consultando débitos'
    // });
    console.log(1)
    // DebtsService.getDebt();
    console.log(2)
    // $scope.debts = DebtsService.all;
  }])

  .controller('AllController', ['$scope', '$ionicLoading', 'DebtsService', function($scope, $ionicLoading, DebtsService) {
    console.log(3)
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

