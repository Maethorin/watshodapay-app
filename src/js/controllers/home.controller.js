'use strict';

angular.module('watshodapay.home', [])
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('homeState', {
      cache: false,
      url: '/',
      templateUrl: 'templates/home.html',
      controller: 'HomeController'
    });
  }])

  .controller('HomeController', ['$scope', '$ionicLoading', 'UserDebts', function($scope, $ionicLoading, UserDebts) {
  }]);

