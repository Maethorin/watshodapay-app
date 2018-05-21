'use strict';

watshodapayServices.service('PaymentsService', ['$q', '$ionicPopup', 'UserPayments', function($q, $ionicPopup, UserPayments) {
  var self = this;

  this.payments = [];
  this.loaded = false;

  this.savePayment = function(payment) {
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

  this.updatePayment = function(payment) {
    var deferred = $q.defer();
    UserPayments.update(
      {id: payment.id},
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

  this.selectPayment = function(payment, $scope) {
    $scope.selectedPayment = _.cloneDeep(payment);

    var popupPayment = $ionicPopup.show({
      templateUrl: 'templates/payments/update-payment.html',
      title: 'Editar pagamento',
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
            self.updatePayment(
              {
                id: payment.id,
                value: $scope.selectedPayment.value,
                isPayed: $scope.selectedPayment.isPayed,
                paymentInfo: $scope.selectedPayment.paymentInfo
              }
            ).then(
              function() {
                payment.value = $scope.selectedPayment.value;
                payment.isPayed = $scope.selectedPayment.isPayed;
                payment.paymentInfo = $scope.selectedPayment.paymentInfo;
                payment.status = $scope.selectedPayment.isPayed ? 'payed' : payment.status;
                popupPayment.close();
              },

              function(error) {
                $ionicPopup.alert({
                  title: 'ERRO',
                  template: 'O Pagamento não foi atualizado.',
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