watshodapayResources.factory('Me', ['$resource', 'appConfig', function($resource, appConfig) {
  return $resource(
    '{0}/me'.format([appConfig.backendURL]),
    null,
    {
      save: {
        method: 'POST',
        transformResponse: function (data, headersGetter) {
          data = JSON.parse(data);

          data.headers = {
            'XSRF-TOKEN': headersGetter('XSRF-TOKEN')
          };

          return data
        }
      }
    }
  );
}]);