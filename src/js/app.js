'use strict';

var format = function(str, data) {
  return str.replace(/{([^{}]+)}/g, function(match, val) {
    var prop = data;
    val.split('.').forEach(function(key) {
      prop = prop[key];
    });

    return prop;
  });
};

String.prototype.format = function(data) {
  return format(this, data);
};

String.prototype.slugify = function() {
  function dasherize(str) {
    return str.trim().replace(/[-_\s]+/g, '-').toLowerCase();
  }

  function clearSpecial(str) {
    var from  = 'ąàáäâãåæăćčĉęèéëêĝĥìíïîĵłľńňòóöőôõðøśșşšŝťțţŭùúüűûñÿýçżźž',
      to    = 'aaaaaaaaaccceeeeeghiiiijllnnoooooooossssstttuuuuuunyyczzz';
    to = to.split('');
    return str.replace(/.{1}/g, function(c){
      var index = from.indexOf(c);
      return index === -1 ? c : to[index];
    });
  }

  return clearSpecial(dasherize(this));
};

Number.prototype.asCurrency = function() {
  return 'R$ {0}'.format([this.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+\,)/g, '$1.')]);
};


var watshodapayServices  = angular.module('watshodapay.services', []);
var watshodapayFactories  = angular.module('watshodapay.factories', []);
var watshodapayResources  = angular.module('watshodapay.resources', []);
var watshodapayDirectives  = angular.module('watshodapay.directives', []);

var watshodapay = angular.module(
  'watshodapay',
  [
    'ionic',
    'ui.router',
    'ngResource',
    'ngCordova',
    'ui.utils.masks',
    'watshodapay.services',
    'watshodapay.factories',
    'watshodapay.resources',
    'watshodapay.directives',
    'watshodapay.login',
    'watshodapay.home',
    'watshodapay.menu',
    'watshodapay.user',
    'watshodapay.userDebts',
    'watshodapay.userPayments'
  ]
);

watshodapay.constant('appConfig', {
  backendURL: '@@backendURL',
  env: '@@env',
  backgroundMode: false,
  onResume: false,
  hasCordovaPlugins: window.cordova != undefined && window.cordova.plugins != undefined
});

watshodapay.config(['$sceDelegateProvider', '$httpProvider', '$urlRouterProvider', '$ionicConfigProvider', 'appConfig', function($sceDelegateProvider, $httpProvider, $urlRouterProvider, $ionicConfigProvider, appConfig) {
  $sceDelegateProvider.resourceUrlWhitelist([
    'self',
    '{0}/**'.format([appConfig.backendURL])
  ]);

  $httpProvider.defaults.withCredentials = true;

  $urlRouterProvider.otherwise('/');

  $httpProvider.interceptors.push('updateToken');

  $ionicConfigProvider.navBar.alignTitle('center');
  $ionicConfigProvider.tabs.position('top');
  $ionicConfigProvider.views.maxCache(0);
}]);


watshodapay.run(['$ionicPlatform', '$locale', '$rootScope', '$state', 'CordovaPlugins', 'AuthService', 'Me', function ($ionicPlatform, $locale, $rootScope, $state, CordovaPlugins, AuthService, Me) {
  $locale.NUMBER_FORMATS.DECIMAL_SEP = ",";
  $locale.NUMBER_FORMATS.GROUP_SEP = ".";
  $locale.NUMBER_FORMATS.CURRENCY_SYM = "R$";

  function checkUserLoggedOnInit() {
    if (AuthService.userIsLogged()) {
      Me.get(
        function(response) {
          $rootScope.user = {
            name: response.name,
            surname: response.surname,
            emailConfirmed: response.emailConfirmed
          };
        },

        function() {
          AuthService.clear();
          $state.go('loginState');
        }
      );
    }
  }

  $ionicPlatform.ready(function () {
    CordovaPlugins.init();

    if (window.StatusBar) {
      StatusBar.styleDefault();
    }

    checkUserLoggedOnInit();

    if (!AuthService.userIsLogged()) {
      $state.go('loginState');
    }
  });

  $rootScope.$on('$ionicView.beforeEnter', function(e, data) {
    $rootScope.showMenuButton = AuthService.userIsLogged();
  });

  $rootScope.$on('$locationChangeStart', function() {
    checkUserLoggedOnInit();
    $rootScope.showMenuButton = AuthService.userIsLogged();
  });

  $ionicPlatform.on('resume', function() {
    checkUserLoggedOnInit();
  });
}]);
