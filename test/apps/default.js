'use strict';

const AddressLookup = require('../../');

module.exports = {
  steps: {
    '/one': {
      behaviours: AddressLookup({
        addressKey: 'address-one',
        apiSettings: {
          hostname: 'http://localhost:8081/api/postcode-test'
        },
        validate: {
          allowedCountries: ['England']
        }
      }),
      next: '/two'
    },
    '/two': {}
  }
};
