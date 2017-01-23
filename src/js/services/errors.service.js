'use strict';

watshodapayServices.service('ErrorsService', ['$rootScope', function($rootScope) {
  return {
    userCreation: {
      setErrorMessages: function(errors) {
        var message = '';

        if (errors) {
          if (errors.cpf && _.includes(errors.cpf, "has already been taken")) {
            message += '<div>CPF já está em uso</div>';
          }

          if (errors.email && _.includes(errors.email, "has already been taken")) {
            message += '<div>email já está em uso</div>';
          }

        }

        if (_.isEmpty(message)) {
          message = '<div>Um ou mais dados estão inválidos. Por favor, corrija e tente novamente.</div>';
        }

        return message;
      }
    }
  };
}]);