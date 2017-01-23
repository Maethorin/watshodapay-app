watshodapayDirectives.directive('passwordMatch', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$validators.passwordMatch = function(modelValue, viewValue) {
        if (scope.user) {
          return scope.user.password == (viewValue || ctrl.$viewValue);
        }
      };
    }
  };
});