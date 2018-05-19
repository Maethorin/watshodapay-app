'use strict';

watshodapayServices.service('DebtsService', ['$q', 'UserDebts', function($q, UserDebts) {
  this.debts = {};
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
}]);