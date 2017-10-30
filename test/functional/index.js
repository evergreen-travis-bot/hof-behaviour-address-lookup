'use strict';

const Browser = require('./lib/browser');
const App = require('./lib/app');
const assert = require('assert');
const expect = require('chai').expect;
const config = require('./config.js');

describe('Functional tests', () => {
  let browser;
  let app;

  beforeEach(() => {
    browser = Browser().url(`http://localhost:${config.port}`);
    return browser;
  });

  afterEach(() => browser.end());

  describe('default behaviour', () => {

    before(() => {
      app = App(require('./apps/default')(config)).listen(config.port);
    });

    after(() => {
      app.close();
    });

    it('redirects to the address substep on a failed lookup', () =>
      browser.url('/one')
        .$('input')
        .setValue('BN25 1XY')
        .submitForm('form')
        .getUrl()
        .then(url => {
          assert.ok(url.includes('step=address'));
        })
    );

    it('redirects to the lookup step on a successful lookup', () =>
      browser.url('/one')
        .$('input')
        .setValue('CR0 2EU')
        .submitForm('form')
        .getUrl()
        .then(url => {
          assert.ok(url.includes('step=lookup'));
        })
    );

    it('fails on an invalid postcode', () =>
      browser.url('/one')
        .$('input')
        .setValue('INVALID')
        .submitForm('form')
        .getUrl()
        .then(url => {
          assert.ok(url.includes('step=postcode'));
          assert.ok(url.includes('/one'));
        })
    );

    it('fails on a non-English postcode', () =>
      browser.url('/one')
        .$('input')
        .setValue('CH5 1AB')
        .submitForm('form')
        .getUrl()
        .then(url => {
          assert.ok(url.includes('step=postcode'));
          assert.ok(url.includes('/one'));
        })
    );

    it('redirects to next step when an address is selected', () =>
      browser.url('/one')
        .$('input')
        .setValue('CR0 2EU')
        .submitForm('form')
        .selectByIndex('select', 1)
        .submitForm('form')
        .getUrl()
        .then(url => {
          assert.ok(url.includes('/two'));
        })
    );

    it('redirects back to postcode step if change link is clicked', () =>
      browser.url('/one')
        .$('input')
        .setValue('CR0 2EU')
        .submitForm('form')
        .getUrl()
        .then(url => {
          assert.ok(url.includes('step=lookup'));
        })
        .$('.change-postcode')
        .click()
        .getUrl()
        .then(url => {
          assert.ok(url.includes('step=postcode'));
          assert.ok(url.includes('/one'));
        })
    );

    it('redirects to manual step if cant-find link is clicked', () =>
      browser.url('/one')
        .$('input')
        .setValue('CR0 2EU')
        .submitForm('form')
        .getUrl()
        .then(url => {
          assert.ok(url.includes('step=lookup'));
        })
        .$('.cant-find')
        .click()
        .getUrl()
        .then(url => {
          assert.ok(url.includes('step=manual'));
        })
    );

    it('allows user through to next step if no postcode is entered', () =>
      browser.url('/one')
        .submitForm('form')
        .getUrl()
        .then(url => {
          assert.ok(url.includes('/two'));
        })
    );

  });

  describe('required', () => {

    before(() => {
      app = App(require('./apps/required')(config)).listen(config.port);
    });

    after(() => {
      app.close();
    });

    it('throws a validaton error if no postcode is entered', () =>
      browser.url('/one')
        .submitForm('form')
        .getUrl()
        .then(url => {
          assert.ok(url.includes('step=postcode'));
          assert.ok(url.includes('/one'));
        })
    );

  });

  describe('backlink', () => {
    before(() => {
      app = App(require('./apps/backlink')(config)).listen(config.port);
    });

    after(() => {
      app.close();
    });

    it('goes back to postcode step when clicking backlink from the lookup step', () =>
      browser.url('/one')
        .submitForm('form')
        .getUrl()
        .then(url => {
          expect(url).to.include('/two');
        })
        .$('input')
        .setValue('CR0 2EU')
        .submitForm('form')
        .getUrl()
        .then(url => {
          expect(url).to.include('step=lookup');
        })
        .$('#step a')
        .click()
        .getUrl()
        // postcode step does not initially have step=postcode so this cannot be asserted
        // therefore asserting on the premise that it does not have any substep in url
        .then(url => {
          expect(url).to.equal('http://localhost:8081/two');
          expect(url).to.not.include('one');
        })
      );

    it('goes back to postcode step when clicking backlink from `cant find the address in the list`', () =>
      browser.url('/one')
        .submitForm('form')
        .getUrl()
        .then(url => {
          expect(url).to.include('/two');
        })
        .$('input')
        .setValue('CR0 2EU')
        .submitForm('form')
        .getUrl()
        .then(url => {
          expect(url).to.include('step=lookup');
        })
        .$('.link a.cant-find')
        .click()
        .getUrl()
        .then(url => {
          expect(url).to.include('step=manual');
        })
        .$('#step a')
        .click()
        .getUrl()
        // postcode step does not initially have step=postcode so this cannot be asserted
        // therefore asserting on the premise that it does not have any substep in url
        .then(url => {
          expect(url).to.equal('http://localhost:8081/two');
          expect(url).to.not.include('one');
        })
      );

    it('goes back to postcode step when clicking backlink from the manual step', () =>
      browser.url('/one')
        .submitForm('form')
        .getUrl()
        .then(url => {
          expect(url).to.include('/two');
        })
        .$('.link a')
        .click()
        .getUrl()
        .then(url => {
          expect(url).to.include('step=manual');
        })
        .$('#step a')
        .click()
        .getUrl()
        // postcode step does not initially have step=postcode so this cannot be asserted
        // therefore asserting on the premise that it does not have any substep in url
        .then(url => {
          expect(url).to.equal('http://localhost:8081/two');
          expect(url).to.not.include('one');
        })
      );

    it('goes back to postcode step when clicking backlink from the address step (i.e. failed lookup)', () =>
      browser.url('/one')
        .submitForm('form')
        .getUrl()
        .then(url => {
          expect(url).to.include('/two');
        })
        .$('input')
        .setValue('BN25 1XY')
        .submitForm('form')
        .getUrl()
        .then(url => {
          expect(url).to.include('step=address');
        })
        .$('#step a')
        .click()
        .getUrl()
        // postcode step does not initially have step=postcode so this cannot be asserted
        // therefore asserting on the premise that it does not have any substep in url
        .then(url => {
          expect(url).to.equal('http://localhost:8081/two');
          expect(url).to.not.include('one');
        })
      );
  });
});
