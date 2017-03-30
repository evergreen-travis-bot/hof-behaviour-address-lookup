'use strict';

const AddressLookup = require('../../');

module.exports = {
  steps: {
    '/one': {
      behaviours: AddressLookup({
        addressKey: 'address-one',
        apiSettings: {
          authorization: process.env.POSTCODE_AUTH,
          hostname: 'http://localhost:8080/api/postcode-test'
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
