watshodapayResources.factory('UserDebts', ['$resource', 'appConfig', function($resource, appConfig) {
  return $resource(
      '{0}/me/debts/:id'.format([appConfig.backendURL]),
      null,
      {
        update: {method: 'PUT'}
      }
  );
}]);