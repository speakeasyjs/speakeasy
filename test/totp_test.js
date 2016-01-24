'use strict';

/* global describe, it */

var chai = require('chai');
var assert = chai.assert;
var speakeasy = require('..');

// These tests use the test vectors from RFC 6238's Appendix B: Test Vectors
// http://tools.ietf.org/html/rfc6238#appendix-B
// They use an ASCII string of 12345678901234567890 and a time step of 30.

describe('TOTP Time-Based Algorithm Test', function () {
  describe("normal operation with secret = '12345678901234567890' at time = 59000", function () {
    it('should return correct one-time password', function () {
      var topic = speakeasy.totp({secret: '12345678901234567890', time: 59000});
      assert.equal(topic, '287082');
    });
  });

  describe("normal operation with secret = '12345678901234567890' at time = 59000 using key (deprecated)", function () {
    it('should return correct one-time password', function () {
      var topic = speakeasy.totp({key: '12345678901234567890', time: 59000});
      assert.equal(topic, '287082');
    });
  });

  describe("a different time normal operation with secret = '12345678901234567890' at time = 1111111109000", function () {
    it('should return correct one-time password', function () {
      var topic = speakeasy.totp({secret: '12345678901234567890', time: 1111111109000});
      assert.equal(topic, '081804');
    });
  });

  describe("digits parameter with secret = '12345678901234567890' at time = 1111111109000 and digits = 8", function () {
    it('should return correct one-time password', function () {
      var topic = speakeasy.totp({secret: '12345678901234567890', time: 1111111109000, digits: 8});
      assert.equal(topic, '07081804');
    });
  });

  describe("hexadecimal encoding with secret = '3132333435363738393031323334353637383930' as hexadecimal at time 1111111109", function () {
    it('should return correct one-time password', function () {
      var topic = speakeasy.totp({secret: '3132333435363738393031323334353637383930', encoding: 'hex', time: 1111111109000});
      assert.equal(topic, '081804');
    });
  });

  describe("base32 encoding with secret = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ' as base32 at time 1111111109", function () {
    it('should return correct one-time password', function () {
      var topic = speakeasy.totp({secret: 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ', encoding: 'base32', time: 1111111109000});
      assert.equal(topic, '081804');
    });
  });

  describe("a custom step with secret = '12345678901234567890' at time = 1111111109000 with step = 60", function () {
    it('should return correct one-time password', function () {
      var topic = speakeasy.totp({secret: '12345678901234567890', time: 1111111109000, step: 60});
      assert.equal(topic, '360094');
    });
  });

  describe("initial time with secret = '12345678901234567890' at time = 1111111109000 and epoch = 1111111100000", function () {
    it('should return correct one-time password', function () {
      var topic = speakeasy.totp({secret: '12345678901234567890', time: 1111111109000, epoch: 1111111100000});
      assert.equal(topic, '755224');
    });
  });

  describe("base32 encoding with secret = '1234567890' at time = 1111111109000", function () {
    it('should return correct one-time password', function () {
      var topic = speakeasy.totp({secret: '12345678901234567890', time: 1111111109000});
      assert.equal(topic, '081804');
    });
  });

  describe("base32 encoding with secret = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZA' as base32 at time = 1111111109000, digits = 8 and algorithm as 'sha256'", function () {
    it('should return correct one-time password', function () {
      var topic = speakeasy.totp({secret: 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZA', encoding: 'base32', time: 1111111109000, digits: 8, algorithm: 'sha256'});
      assert.equal(topic, '68084774');
    });
  });

  describe("base32 encoding with secret = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZDGNA' as base32 at time = 1111111109000, digits = 8 and algorithm as 'sha512'", function () {
    it('should return correct one-time password', function () {
      var topic = speakeasy.totp({secret: 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQGEZDGNA', encoding: 'base32', time: 1111111109000, digits: 8, algorithm: 'sha512'});
      assert.equal(topic, '25091201');
    });
  });

  describe("normal operation with secret = '12345678901234567890' with overridden counter 3", function () {
    it('should return correct one-time password', function () {
      var topic = speakeasy.totp({secret: '12345678901234567890', counter: 3});
      assert.equal(topic, '969429');
    });
  });

  describe("normal operation with secret = '12345678901234567890' with overridden counter 3", function () {
    it('should return correct one-time password', function () {
      var topic = speakeasy.totp({secret: '12345678901234567890', counter: 3});
      assert.equal(topic, '969429');
    });
  });
});
