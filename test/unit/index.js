'use strict';

const AddressLookup = require('../../');

const assert = require('assert');

describe('Unit tests', () => {

  it('throws if no addressKey is provided', () => {
    assert.throws(
      () => {
        AddressLookup({});
      }
    );
  });

});
