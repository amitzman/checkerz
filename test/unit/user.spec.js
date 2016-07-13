/* eslint-disable no-unused-expressions, no-underscore-dangle, func-names */

const expect = require('chai').expect;
const sinon = require('sinon');
const User = require('../../dst/models/user');

describe('User', () => {
  describe('constructor', () => {
    it('should create a user', done => {
      const u = new User({
        name: 'Billy',
      });
      u.validate(err => {
        expect(err).to.be.undefined;
        expect(u.name).to.equal('Billy');
        done();
      });
    });
    it('should NOT create a user -- missing name', done => {
      const u = new User({});
      u.validate(err => {
        expect(err).to.be.ok;
        done();
      });
    });
  });
});
