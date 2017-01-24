watshodapayDirectives.directive('formatDate', [function() {
  return {
    require: '?ngModel',
    link: function (scope, elem, attrs, ctrl) {
      if (!ctrl) return;

      ctrl.$formatters.unshift(function(a) {
        if (!ctrl.$modelValue) {
          return 'Escolha uma data';
        }
        return moment(ctrl.$modelValue).format('DD/MM/YYYY');
      });


      ctrl.$parsers.unshift(function(viewValue) {
        if (!viewValue) {
          return null;
        }
        return moment(viewValue).format('DD/MM/YYYY');
      });
    }
  };
}]);