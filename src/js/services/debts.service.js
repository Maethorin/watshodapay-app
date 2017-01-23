'use strict';

watshodapayServices.service('DebtsService', ['$q', 'UserDebts', function($q, UserDebts) {
  this.debts = {};
  this.loaded = false;

  this.getDebt = function(type) {
    var deferred = $q.defer();
    var self = this;
    console.log(1, self.loaded);
    if (self.loaded) {
      deferred.resolve(this.debts[type]);
    }
    else {
      UserDebts.get(
        function(debts) {
          self.debts = debts;
          self.loaded = true;
          console.log(2, self.loaded);
          deferred.resolve(self.debts[type]);
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