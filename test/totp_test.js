'use strict';

/* global describe, it */

var chai = require('chai');
var assert = chai.assert;
var speakeasy = require('..');

// These tests use the test vectors from RFC 6238's Appendix B: Test Vectors
// http://tools.ietf.org/html/rfc6238#appendix-B
// They use an ASCII string of 12345678901234567890 and a time step of 30.

describe('TOTP Time-Based Algorithm Test', function () {
  describe("normal operation with secret = '12345678901234567890' at time = 59", function () {
    it('should return correct one-time password', function () {
      var topic = speakeasy.totp({secret: '12345678901234567890', time: 59});
      assert.equal(topic, '287082');
    });
  });

  describe("normal operation with secret = '12345678901234567890' at time = 59 using key (deprecated)", function () {
    it('should return correct one-time password', function () {
      var topic = speakeasy.totp({key: '12345678901234567890', time: 59});
      assert.equal(topic, '287082');
    });
  });

  describe("a different time normal operation with secret = '12345678901234567890' at time = 1111111109", function () {
    it('should return correct one-time password', function () {
      var topic = speakeasy.totp({secret: '12345678901234567890', time: 1111111109});
      assert.equal(topic, '081804');
    });
  });

  describe("digits parameter with secret = '12345678901234567890' at time = 1111111109 and digits = 8", function () {
    it('should return correct one-time password', function () {
      var topic = speakeasy.totp({secret: '12345678901234567890', time: 1111111109, digits: 8});
      assert.equal(topic, '07081804');
    });
  });

  describe("hexadecimal encoding with secret = '3132333435363738393031323334353637383930' as hexadecimal at time 1111111109", function () {
    it('should return correct one-time password', function () {
      var topic = speakeasy.totp({secret: '3132333435363738393031323334353637383930', encoding: 'hex', time: 1111111109});
      assert.equal(topic, '081804');
    });
  });

  describe("base32 encoding with secret = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ' as base32 at time 1111111109", function () {
    it('should return correct one-time password', function () {
      var topic = speakeasy.totp({secret: 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ', encoding: 'base32', time: 1111111109});
      assert.equal(topic, '081804');
    });
  });

  describe("a custom step with secret = '12345678901234567890' at time = 1111111109 with step = 60", function () {
    it('should return correct one-time password', function () {
      var topic = speakeasy.totp({secret: '12345678901234567890', time: 1111111109, step: 60});
      assert.equal(topic, '360094');
    });
  });

  describe("initial time with secret = '12345678901234567890' at time = 1111111109 and epoch = 1111111100", function () {
    it('should return correct one-time password', function () {
      var topic = speakeasy.totp({secret: '12345678901234567890', time: 1111111109, epoch: 1111111100});
      assert.equal(topic, '755224');
    });
  });

  // Backwards compatibility - deprecated
  describe("initial time with secret = '12345678901234567890' at time = 1111111109 and initial_time = 1111111100", function () {
    it('should return correct one-time password', function () {
      var topic = speakeasy.totp({secret: '12345678901234567890', time: 1111111109, initial_time: 1111111100});
      assert.equal(topic, '755224');
    });
  });

  describe("base32 encoding with secret = '1234567890' at time = 1111111109", function () {
    it('should return correct one-time password', function () {
      var topic = speakeasy.totp({secret: '12345678901234567890', time: 1111111109});
      assert.equal(topic, '081804');
    });
  });

  describe("base32 encoding with secret = 'GEZDGNBVGY3TQOJQ' as base32 at time = 1111111109, digits = 8 and algorithm as 'sha256'", function () {
    it('should return correct one-time password', function () {
      var topic = speakeasy.totp({secret: 'GEZDGNBVGY3TQOJQ', encoding: 'base32', time: 1111111109, digits: 8, algorithm: 'sha256'});
      assert.equal(topic, '68084774');
    });
  });

  describe("base32 encoding with secret = 'GEZDGNBVGY3TQOJQ' as base32 at time = 1111111109, digits = 8 and algorithm as 'sha512'", function () {
    it('should return correct one-time password', function () {
      var topic = speakeasy.totp({secret: 'GEZDGNBVGY3TQOJQ', encoding: 'base32', time: 1111111109, digits: 8, algorithm: 'sha512'});
      assert.equal(topic, '25091201');
    });
  });

  describe("normal operation with secret = '12345678901234567890' with overridden counter 3", function () {
    it('should return correct one-time password', function () {
      var topic = speakeasy.totp({secret: '12345678901234567890', counter: 3});
      assert.equal(topic, '969429');
    });
  });

  it('should throw exception if secret and key are missing in totp', function() {
    assert.throws(function () {
      speakeasy.totp({
        digits: 6
      }, /Speakeasy - totp - Missing secret/);
    });
  });

  describe("normal operation with secret = '12345678901234567890' with overridden counter 3", function () {
    it('should return correct one-time password', function () {
      var topic = speakeasy.totp({secret: '12345678901234567890', counter: 3});
      assert.equal(topic, '969429');
    });
  });

  describe('totp.verifyDelta() window tests', function () {
    var secret = 'rNONHRni6BAk7y2TiKrv';
    it('should get current TOTP value', function () {
      this.token = speakeasy.totp({secret: secret, counter: 1});
      assert.equal(this.token, '314097');
    });

    it('should get TOTP value at counter 3', function () {
      this.token = speakeasy.totp({secret: secret, counter: 3});
      assert.equal(this.token, '663640');
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

    it('should get delta when the item is not at specified counter but within window', function () {
      // Use token at counter 3, initial counter 1, and a window of 2
      var delta = speakeasy.totp.verifyDelta({
        secret: secret, token: '663640', counter: 1, window: 2
      });
      assert.isObject(delta); assert.strictEqual(delta.delta, 2);
    });

    it('should not get delta when the item is not at specified counter and not within window', function () {
      // Use token at counter 3, initial counter 1, and a window of 1
      var delta = speakeasy.totp.verifyDelta({
        secret: secret, token: '663640', counter: 1, window: 1
      });
      assert.isUndefined(delta);
    });

    it('should support negative delta values when token is on the negative side of the window', function () {
      // Use token at counter 1, initial counter 3, and a window of 2
      var delta = speakeasy.totp.verifyDelta({
        secret: secret, token: '314097', counter: 3, window: 2
      });
      assert.isObject(delta); assert.strictEqual(delta.delta, -2);
    });

    it('should support negative delta values when token is on the negative side of the window using time input', function () {
      // Use token at counter 1, initial counter 3, and a window of 2
      var delta = speakeasy.totp.verifyDelta({
        secret: secret, token: '625175', time: 1453854005, window: 2
      });
      assert.isObject(delta); assert.strictEqual(delta.delta, -2);
    });

    it('should throw exception if secret is missing in verifyDelta', function() {
      assert.throws(function () {
        speakeasy.totp.verifyDelta({
          step: 30
        }, /Speakeasy - totp.verifyDelta - Missing secret/);
      });
    });

    it('should throw exception if token is missing in verifyDelta', function() {
      assert.throws(function () {
        speakeasy.totp.verifyDelta({
          secret: 111111
        }, /Speakeasy - totp.verifyDelta - Missing token/);
      });
    });

  });

  it('should not throw exception if the algorithm is not sha1, sha256, or sha512', function() {
    assert.doesNotThrow(function () {
      speakeasy.totp({
        secret: 'GEZDGNBVGY3TQOJQ',
        encoding: 'base32',
        time: 1111111109,
        digits: 8,
        algorithm: 'md5'
      }, /unofficial algorithm `md5`/);
    });
  });

});
