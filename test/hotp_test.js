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

  describe("base32 encoding with secret = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZA' as base32 at counter 1, digits = 8 and algorithm as 'sha256'", function () {
    it('should return correct one-time password', function () {
      var topic = speakeasy.hotp({secret: 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZA', encoding: 'base32', counter: 1, digits: 8, algorithm: 'sha256'});
      assert.equal(topic, '46119246');
    });
  });

  describe("base32 encoding with secret = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZDGNA' as base32 at counter 1, digits = 8 and algorithm as 'sha512'", function () {
    it('should return correct one-time password', function () {
      var topic = speakeasy.hotp({secret: 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZDGNA', encoding: 'base32', counter: 1, digits: 8, algorithm: 'sha512'});
      assert.equal(topic, '90693936');
    });
  });

  describe('hotp.verifyDelta()', function () {
    var secret = 'rNONHRni6BAk7y2TiKrv';
    it('should get current TOTP value', function () {
      this.token = speakeasy.totp({secret: secret, counter: 1});
      assert.equal(this.token, '314097');
    });
    it('should get delta with varying window lengths', function () {
      var delta;

      delta = speakeasy.totp.verifyDelta({
        secret: secret, token: '314097', counter: 1, window: 0
      });
      assert.isObject(delta); assert.strictEqual(delta.delta, 0);

      delta = speakeasy.totp.verifyDelta({
        secret: secret, token: '314097', counter: 1, window: 2
      });
      assert.isObject(delta); assert.strictEqual(delta.delta, 0);

      delta = speakeasy.totp.verifyDelta({
        secret: secret, token: '314097', counter: 1, window: 3
      });
      assert.isObject(delta); assert.strictEqual(delta.delta, 0);
    });
  });
});
