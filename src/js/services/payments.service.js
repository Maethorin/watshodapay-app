'use strict';

watshodapayServices.service('PaymentsService', ['$q', 'UserPayments', function($q, UserPayments) {
  this.payments = {};
  this.loaded = false;

  this.savePayment = function (payment) {
    var deferred = $q.defer();
    UserPayments.save(
      payment,
      function(response) {
        deferred.resolve(response);
      },
      function(response) {
        deferred.reject(response);
      }
    );
    return deferred.promise;
  };

  this.getPayment = function(update) {
    var deferred = $q.defer();
    var self = this;
    if (self.loaded && !update) {
      deferred.resolve(this.payments);
    }
    else {
      UserPayments.query(
        function(payments) {
          self.payments = payments;
          self.loaded = true;
          deferred.resolve(self.payments);
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