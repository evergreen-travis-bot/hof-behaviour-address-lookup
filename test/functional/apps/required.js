'use strict';

const AddressLookup = require('../../../');

module.exports = config => ({
  steps: {
    '/one': {
      behaviours: AddressLookup({
        addressKey: 'address-one',
        required: true,
        apiSettings: {
          hostname: `http://localhost:${config.port}/api/postcode-test`
        },
        validate: {
          allowedCountries: ['England']
        }
      }),
      next: '/two'
    },
    '/two': {}
  }
});
