describe('User', function() {
  var $controller, $httpBackend, $rootScope, $scope, $state, $compile, $ionicLoading, User, userData, AuthService, ErrorsService, $ionicPopup;

  var usersURL = "@@backendURL/clients";
  var meURL = "@@backendURL/me";

  beforeEach(module('watshodapay'));

  beforeEach(inject(function(_$rootScope_, _$controller_, _$state_, _$httpBackend_, _$compile_, _$ionicLoading_, _User_, _AuthService_, _ErrorsService_, _$ionicPopup_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $state = _$state_;
    $scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    $httpBackend.whenGET(/\.html$/).respond('');
    $httpBackend.whenGET(meURL).respond(200, {id: 123, name: 'John', surname: 'Doe', origin: 'client', email: 'johndoe@email.com'}, {'XSRF-TOKEN': 'SERVER-TOKEN'});
    $compile = _$compile_;
    $ionicPopup = _$ionicPopup_;
    AuthService = _AuthService_;
    ErrorsService = _ErrorsService_;
    $ionicLoading = _$ionicLoading_;
    User = _User_;
    userData = {
      surname: null,
      password: null,
      name: null,
      email: null,
      cpf: null,
      phone: null
    };
  }));

  describe('resource', function() {
    it('should call api users url', function() {
      $httpBackend.expect("POST", usersURL).respond(200, JSON.stringify({id: 123}), {'XSRF-TOKEN': 'SERVER-TOKEN'});
      var user = User.save();
      $httpBackend.flush();
      expect(user).toBeTruthy();
    });

    it('should use constructor', function() {
      var postData = {name: 'User Name', surname: 'User surname'};
      $httpBackend.expect("POST", usersURL, postData).respond(200, JSON.stringify({id: 123}), {'XSRF-TOKEN': 'SERVER-TOKEN'});
      var userResource = User.createNew(postData);
      var user = userResource.$save();
      $httpBackend.flush();
      expect(user).toBeTruthy();
    });
  });

  describe("create", function() {

    function loadController() {
      $controller(
        'CreateUserController',
        {
          $scope: $scope,
          $rootScope: $rootScope,
          $ionicPopup: $ionicPopup,
          User: User,
          AuthService: AuthService
        }
      );
    }

    beforeEach(function() {
      loadController();
    });

    it('should have route for create user', function() {
      expect($state.href('createUserState')).toEqual('#/user/create');
    });

    describe('with route configured', function() {
      var state;

      beforeEach(function() {
        state = $state.get('createUserState');
      });

      it('should have an url', function() {
        expect(state.url).toEqual('/user/create');
      });

      it('should have a template', function() {
        expect(state.templateUrl).toEqual('templates/user/form.html');
      });

      it('should have a controller', function() {
        expect(state.controller).toEqual('CreateUserController');
      });
    });

    describe('initializing the controller', function() {

      it('should define user model', function() {
        expect($scope.user).toEqual(userData);
      });

      it('should define submitForm function', function() {
        expect($scope.submitForm).toBeDefined();
      });
    });

    describe('sending data', function() {
      var formUser;

      beforeEach(function() {
        formUser = {
          $invalid: true
        }
        spyOn($ionicPopup, 'alert');
        spyOn($ionicLoading, 'show');
        spyOn(User, 'createNew').and.callThrough();
        spyOn($ionicLoading, 'hide');
      });

      it('should popup if invalid data', function() {
        spyOn(User.prototype, '$save').and.returnValue({then: function() {}});
        $scope.submitForm(formUser);

        expect($ionicPopup.alert).toHaveBeenCalledWith({
          title: 'Dados faltando ou inválidos',
          template: 'Um ou mais dados obrigatórios não foram preenchidos corretamente. Por favor, corrija e tente novamente.',
          buttons: [ { text: 'Ok', type: 'button-negative' } ]
        });
        expect(User.prototype.$save).not.toHaveBeenCalled();
      });

      it('should send data if validation is ok', function() {
        spyOn(User.prototype, '$save').and.returnValue({then: function() {}});
        formUser.$invalid = false;
        $scope.submitForm(formUser);
        expect($ionicLoading.show).toHaveBeenCalledWith({ template: 'Salvando...' });
        expect($ionicPopup.alert).not.toHaveBeenCalled();
        expect(User.createNew).toHaveBeenCalledWith(userData);
        expect(User.prototype.$save).toHaveBeenCalled();
      });

      it('should show popup with success feedback if client data is ok', function() {
        $httpBackend.expect("POST", usersURL).respond(200, JSON.stringify({id: 123}), {'XSRF-TOKEN': 'SERVER-TOKEN'});
        formUser.$invalid = false;

        $scope.submitForm(formUser);
        $httpBackend.flush();
        expect($ionicLoading.show).toHaveBeenCalled();
        expect($ionicPopup.alert).toHaveBeenCalledWith({
          title: 'Cadastro confirmado',
          template: 'Seu cadastro foi realizado com sucesso.',
          buttons: [ { text: 'Ok', type: 'button-positive' }]
        });
      });

      it('should show popup with invalid data if http status was 400', function() {
        $httpBackend.expect("POST", usersURL).respond(400, JSON.stringify({errors: {}}), {});
        formUser.$invalid = false;
        $scope.submitForm(formUser);
        $httpBackend.flush();
        expect($ionicLoading.show).toHaveBeenCalled();
        expect($ionicPopup.alert).toHaveBeenCalledWith({
          title: 'Dados inválidos',
          template: '<div>Um ou mais dados estão inválidos. Por favor, corrija e tente novamente.</div>',
          buttons: [ { text: 'Ok', type: 'button-negative' } ]
        });
      });

      it('should call ErrorsService when http status was 400', function() {
        $httpBackend.expect("POST", usersURL).respond(400, JSON.stringify({errors: {}}), {});
        spyOn(ErrorsService.userCreation, 'setErrorMessages');
        formUser.$invalid = false;
        $scope.submitForm(formUser);
        $httpBackend.flush();
        expect(ErrorsService.userCreation.setErrorMessages).toHaveBeenCalled();
      });
    })
  });
});