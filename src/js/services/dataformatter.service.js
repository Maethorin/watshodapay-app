'use strict';

watshodapayServices.service('DataFormatter', [function() {
  this.formatAddress = function(address, withStreet) {
    var formated = '{0}{1}, {2}. {3}-{4}'.format([
      address.number,
      address.complement ? ' {0}'.format([address.complement]) : '',
      address.district,
      address.city,
      address.state
    ]);
    if (withStreet) {
      formated = '{0}, {1}'.format([
        address.street, formated
      ]);
    }
    return formated;
  };

  this.formatPrice = function(price) {
    return price.toFixed(2).toString().replace('.', ',');
  };
}]);