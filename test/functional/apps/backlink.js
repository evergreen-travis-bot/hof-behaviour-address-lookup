'use strict';

const AddressLookup = require('../../../');

module.exports = config => ({
  steps: {
    '/one': {
      next: '/two'
    },
    '/two': {
      behaviours: AddressLookup({
        addressKey: 'address-one',
        apiSettings: {
          hostname: `http://localhost:${config.port}/api/postcode-test`
        },
        validate: {
          allowedCountries: ['England']
        }
      }),
    }
  }
});
