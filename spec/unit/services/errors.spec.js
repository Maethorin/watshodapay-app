describe('ErrorsService', function() {
  var $rootScope, ErrorsService, errors;
  beforeEach(module('watshodapay'));

  beforeEach(inject(function(_$rootScope_, _ErrorsService_) {
    $rootScope = _$rootScope_;
    ErrorsService = _ErrorsService_;
  }));

  it('should show generic message when there is no errors obj', function() {
    errors = undefined;

    expect(ErrorsService.userCreation.setErrorMessages(errors)).toBe('<div>Um ou mais dados estão inválidos. Por favor, corrija e tente novamente.</div>');
  });

  it('should set message as CPF já está em uso when cpf has error', function() {
    errors = {
      cpf: ['has already been taken']
    };

    expect(ErrorsService.userCreation.setErrorMessages(errors)).toBe('<div>CPF já está em uso</div>');
  });

  it('should set message as email já está em uso when email has error', function() {
    errors = {
      email: ['has already been taken']
    };

    expect(ErrorsService.userCreation.setErrorMessages(errors)).toBe('<div>email já está em uso</div>');
  });

  it('should combine CPF and email errors when they exist together', function() {
    errors = {
      email: ['has already been taken'],
      cpf: ['has already been taken']
    };

    expect(ErrorsService.userCreation.setErrorMessages(errors)).toBe('<div>CPF já está em uso</div><div>email já está em uso</div>');
  });
});