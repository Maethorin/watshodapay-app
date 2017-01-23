watshodapayDirectives.directive('validated', [function() {
      return {
        restrict: 'AEC',
        require: '^form',
        link: function(scope, element, attrs, form) {
          angular.forEach(element[0].querySelectorAll("input, textarea"), function(input) {
            var attributes = input.attributes;
            var field = form[attributes.name.value];
            if (field) {
              scope.$watch(
                function() {
                  return field.$valid;
                },
                function(newValue, oldValue) {
                  if (newValue) {
                    element.addClass('has-success');
                    element.removeClass('has-error');
                  }
                  else {
                    element.addClass('has-error');
                    element.removeClass('has-success');
                  }
                }
              );
            }
          });
        }
      }
    }]);