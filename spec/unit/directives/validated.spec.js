describe('Password match directive', function() {
  var $compile, $scope, $ionicPopup, $ionicPlatform, $httpBackend;

  var meURL = "@@backendURL/me";

  beforeEach(module('watshodapay'));

  beforeEach(inject(function(_$compile_, _$rootScope_, _$httpBackend_, _$ionicPopup_) {
    $compile = _$compile_;
    $scope = _$rootScope_.$new();
    $ionicPopup = _$ionicPopup_;
    $httpBackend = _$httpBackend_;
    $httpBackend.whenGET(/\.html$/).respond('');
    $httpBackend.whenGET(meURL).respond(200, {id: 123, name: 'John', surname: 'Doe', origin: 'client', email: 'johndoe@email.com'}, {'XSRF-TOKEN': 'SERVER-TOKEN'});
  }));

  describe('validate', function() {
    var htmlWithInput, htmlWithTextArea;
    describe('with input field', function() {
      beforeEach(function() {
        htmlWithInput = [
          '<form name="oneForm" novalidate>',
          '<label class="item item-input" validated>',
          '<input type="text" required ng-model="oneModel" name="oneName">',
          '</label>',
          '</form>'
        ].join('');
      });

      it('should set watcher for field valid state', function() {
        spyOn($scope, '$watch');
        $compile(htmlWithInput)($scope);
        expect($scope.$watch).toHaveBeenCalled();
      });

      it('should set has-error if field is in invalid state', function() {
        var element = $compile(htmlWithInput)($scope);
        var inputCtrl = $scope.oneForm.oneName;
        inputCtrl.$setViewValue(null);
        inputCtrl.$setValidity('required', false);
        expect(element.find('label').hasClass('has-error')).toBeTruthy();
        expect(element.find('label').hasClass('has-success')).toBeFalsy();
      });

      it('should set has-success if field is in valid state', function() {
        var element = $compile(htmlWithInput)($scope);
        var inputCtrl = $scope.oneForm.oneName;
        inputCtrl.$setViewValue('AAA');
        inputCtrl.$setValidity('required', true);
        expect(element.find('label').hasClass('has-error')).toBeFalsy();
        expect(element.find('label').hasClass('has-success')).toBeTruthy();
      });
    });

    describe('with textarea field', function() {
      beforeEach(function() {
        htmlWithTextArea = [
          '<form name="oneForm" novalidate>',
          '<label class="item item-input" validated>',
          '<textarea required ng-model="oneModel" name="oneName"></textarea>',
          '</label>',
          '</form>'
        ].join('');
      });

      it('should set watcher for field valid state', function() {
        spyOn($scope, '$watch');
        $compile(htmlWithTextArea)($scope);
        expect($scope.$watch).toHaveBeenCalled();
      });

      it('should set has-error if field is in invalid state', function() {
        var element = $compile(htmlWithTextArea)($scope);
        var inputCtrl = $scope.oneForm.oneName;
        inputCtrl.$setViewValue(null);
        inputCtrl.$setValidity('required', false);
        expect(element.find('label').hasClass('has-error')).toBeTruthy();
        expect(element.find('label').hasClass('has-success')).toBeFalsy();
      });

      it('should set has-success if field is in valid state', function() {
        var element = $compile(htmlWithTextArea)($scope);
        var inputCtrl = $scope.oneForm.oneName;
        inputCtrl.$setViewValue('AAA');
        inputCtrl.$setValidity('required', true);
        expect(element.find('label').hasClass('has-error')).toBeFalsy();
        expect(element.find('label').hasClass('has-success')).toBeTruthy();
      });
    });
  });
});