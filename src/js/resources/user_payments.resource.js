watshodapayResources.factory('UserPayments', ['$resource', 'appConfig', function($resource, appConfig) {
  return $resource(
      '{0}/me/payments/:id'.format([appConfig.backendURL]),
      null,
      {
        update: {method: 'PUT'}
      }
  );
}]);