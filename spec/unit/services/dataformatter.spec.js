
describe('DataFormatter', function() {
  var DataFormatter, orders;

  beforeEach(module('watshodapay'));

  beforeEach(inject(function(_DataFormatter_) {
    DataFormatter = _DataFormatter_;
  }));

  describe('formating price', function() {
    it('should format price with no cents', function() {
      expect(DataFormatter.formatPrice(45)).toBe('45,00');
    });

    it('should change . to ,', function() {
      expect(DataFormatter.formatPrice(49.99)).toBe('49,99');
    });
  });

  describe('formating address', function() {
    var address;
    beforeEach(function() {
      address = {
        id: 123,
        street: 'Street',
        number: 'Number',
        complement: 'Complement',
        district: 'District',
        city: 'City',
        state: 'State',
        zipCode: '123123123'
      };
    });

    it('should format address with street', function() {
      expect(DataFormatter.formatAddress(address, 'street')).toBe('Street, Number Complement, District. City-State');
    });

    it('should format address without street', function() {
      expect(DataFormatter.formatAddress(address)).toBe('Number Complement, District. City-State');
    });

    it('should format correct if no complement', function() {
      address.complement = null;
      expect(DataFormatter.formatAddress(address)).toBe('Number, District. City-State');
    });
  });
});