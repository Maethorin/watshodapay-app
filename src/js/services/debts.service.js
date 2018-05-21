'use strict';

watshodapayServices.service('DebtsService', ['$q', 'UserDebts', function($q, UserDebts) {
  var self = this;

  this.debts = [];
  this.loaded = false;

  this.saveDebt = function (debt) {
    var deferred = $q.defer();
    UserDebts.save(
      debt,
      function(response) {
        deferred.resolve(response);
      },
      function(response) {
        deferred.reject(response);
      }
    );
    return deferred.promise;
  };

  this.updateDebt = function(debt) {
    var deferred = $q.defer();
    UserDebts.update(
      {id: debt.id},
      debt,
      function(response) {
        deferred.resolve(response);
      },
      function(response) {
        deferred.reject(response);
      }
    );
    return deferred.promise;
  };

  this.getDebt = function() {
    var deferred = $q.defer();
    var self = this;
    if (self.loaded) {
      deferred.resolve(this.debts);
    }
    else {
      UserDebts.query(
        function(debts) {
          self.debts = debts;
          self.loaded = true;
          deferred.resolve(self.debts);
        },
        function(response) {
          self.loaded = false;
          deferred.reject();
        }
      );
    }
    return deferred.promise;
  };

  this.selectDebt = function(debt, $scope) {
    $scope.selectedDebt = _.cloneDeep(debt);

    var popupDebt = $ionicPopup.show({
      templateUrl: 'templates/debts/update-debt.html',
      title: 'Editar débito',
      scope: $scope,
      buttons: [
        {
          text: 'Cancelar',
          type: 'button-negative'
        },
        {
          text: 'Salvar',
          type: 'button-positive',
          onTap: function(e) {
            e.preventDefault();
            self.updateDebt(
              {
                id: debt.id,
                value: $scope.selectedDebt.value
              }
            ).then(
              function() {
                debt.value = $scope.selectedDebt.value;
                popupDebt.close();
              },

              function(error) {
                $ionicPopup.alert({
                  title: 'ERRO',
                  template: 'O Débito não foi atualizado.',
                  buttons: [{
                    text: 'Ok',
                    type: 'button-negative'
                  }]
                });
              }
            );
          }
        }
      ]
    });
  }
}]);