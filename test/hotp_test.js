'use strict';

/* global describe, it */

var chai = require('chai');
var assert = chai.assert;
var speakeasy = require('..');

// These tests use the information from RFC 4226's Appendix D: Test Values.
// http://tools.ietf.org/html/rfc4226#appendix-D

describe('HOTP Counter-Based Algorithm Test', function () {
  describe("normal operation with secret = '12345678901234567890' at counter 3", function () {
    it('should return correct one-time password', function () {
      var topic = speakeasy.hotp({secret: '12345678901234567890', counter: 3});
      assert.equal(topic, '969429');
    });
  });

  describe("another counter normal operation with secret = '12345678901234567890' at counter 7", function () {
    it('should return correct one-time password', function () {
      var topic = speakeasy.hotp({secret: '12345678901234567890', counter: 7});
      assert.equal(topic, '162583');
    });
  });

  describe("digits override with secret = '12345678901234567890' at counter 4 and digits = 8", function () {
    it('should return correct one-time password', function () {
      var topic = speakeasy.hotp({secret: '12345678901234567890', counter: 4, digits: 8});
      assert.equal(topic, '40338314');
    });
  });

  // Backwards compatibility - deprecated
  describe("digits override with secret = '12345678901234567890' at counter 4 and length = 8", function () {
    it('should return correct one-time password', function () {
      var topic = speakeasy.hotp({secret: '12345678901234567890', counter: 4, length: 8});
      assert.equal(topic, '40338314');
    });
  });

  describe("hexadecimal encoding with secret = '3132333435363738393031323334353637383930' as hexadecimal at counter 4", function () {
    it('should return correct one-time password', function () {
      var topic = speakeasy.hotp({secret: '3132333435363738393031323334353637383930', encoding: 'hex', counter: 4});
      assert.equal(topic, '338314');
    });
  });

  describe("base32 encoding with secret = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ' as base32 at counter 4", function () {
    it('should return correct one-time password', function () {
      var topic = speakeasy.hotp({secret: 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ', encoding: 'base32', counter: 4});
      assert.equal(topic, '338314');
    });
  });

  describe("base32 encoding with secret = '12345678901234567890' at counter 3", function () {
    it('should return correct one-time password', function () {
      var topic = speakeasy.hotp({secret: '12345678901234567890', counter: 3});
      assert.equal(topic, '969429');
    });
  });

  describe("base32 encoding with secret = 'GEZDGNBVGY3TQOJQ' as base32 at counter 1, digits = 8 and algorithm as 'sha256'", function () {
    it('should return correct one-time password', function () {
      var topic = speakeasy.hotp({secret: 'GEZDGNBVGY3TQOJQ', encoding: 'base32', counter: 1, digits: 8, algorithm: 'sha256'});
      assert.equal(topic, '46119246');
    });
  });

  describe("base32 encoding with secret = 'GEZDGNBVGY3TQOJQ' as base32 at counter 1, digits = 8 and algorithm as 'sha512'", function () {
    it('should return correct one-time password', function () {
      var topic = speakeasy.hotp({secret: 'GEZDGNBVGY3TQOJQ', encoding: 'base32', counter: 1, digits: 8, algorithm: 'sha512'});
      assert.equal(topic, '90693936');
    });
  });

  it('should throw exception if secret and key are missing in hotp', function() {
    assert.throws(function () {
      speakeasy.hotp({
        digits: 6
      }, /Speakeasy - hotp - Missing secret/);
    });
  });

  it('should throw exception if counter missing in hotp', function() {
    assert.throws(function () {
      speakeasy.hotp({
        secret: 11111
      }, /Speakeasy - hotp - Missing counter/);
    });
  });

  describe('hotp.verifyDelta() window tests', function () {

    it('should throw exception if secret is missing in verifyDelta', function() {
      assert.throws(function () {
        speakeasy.hotp.verifyDelta({
          step: 30
        }, /Speakeasy - hotp.verifyDelta - Missing secret/);
      });
    });

    it('should throw exception if token is missing in verifyDelta', function() {
      assert.throws(function () {
        speakeasy.hotp.verifyDelta({
          secret: 111111
        }, /Speakeasy - hotp.verifyDelta - Missing token/);
      });
    });

  });

  it('should not throw exception if the algorithm is not sha1, sha256, or sha512', function() {
    assert.doesNotThrow(function () {
      speakeasy.hotp({
        secret: 'GEZDGNBVGY3TQOJQ',
        encoding: 'base32',
        counter: 1,
        digits: 8,
        algorithm: 'md5'
      }, /unofficial algorithm `md5`/);
    });
  });

});
