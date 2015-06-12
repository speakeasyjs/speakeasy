"use scrict";

var assert = require('assert');
var speakeasy = require('..');

// These tests use the information from RFC 4226's Appendix D: Test Values.
// http://tools.ietf.org/html/rfc4226#appendix-D

describe('HOTP Counter-Based Algorithm Test', function () {

  describe('normal operation with key = \'12345678901234567890\' at counter 3', function () {
    it('should return correct one-time password', function() {
      var topic = speakeasy.hotp({key: '12345678901234567890', counter: 3});
      assert.equal(topic, '969429');
    });
  });

  describe('another counter normal operation with key = \'12345678901234567890\' at counter 7', function () {
    it('should return correct one-time password', function() {
      var topic = speakeasy.hotp({key: '12345678901234567890', counter: 7});
      assert.equal(topic, '162583');
    });
  });

  describe('length override with key = \'12345678901234567890\' at counter 4 and length = 8', function () {
    it('should return correct one-time password', function() {
      var topic = speakeasy.hotp({key: '12345678901234567890', counter: 4, length: 8});
      assert.equal(topic, '40338314');
    });
  });

  describe('hexadecimal encoding with key = \'3132333435363738393031323334353637383930\' as hexadecimal at counter 4', function () {
    it('should return correct one-time password', function() {
      var topic = speakeasy.hotp({key: '3132333435363738393031323334353637383930', encoding: 'hex', counter: 4});
      assert.equal(topic, '338314');
    });
  });

  describe('base32 encoding with key = \'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ\' as base32 at counter 4', function () {
    it('should return correct one-time password', function() {
      var topic = speakeasy.hotp({key: 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ', encoding: 'base32', counter: 4});
      assert.equal(topic, '338314');
    });
  });

  describe('base32 encoding with key = \'1234567890\' at counter 3', function () {
    it('should return correct one-time password', function() {
      var topic = speakeasy.hotp({key: '1234567890', counter: 3});
      assert.equal(topic, '969429');
    });
  });

  describe('base32 encoding with key = \'GEZDGNBVGY3TQOJQ\' as base32 at counter 1, length = 8 and algorithm as \'sha256\'', function () {
    it('should return correct one-time password', function() {
      var topic = speakeasy.hotp({key: 'GEZDGNBVGY3TQOJQ', encoding: 'base32', counter: 1, length: 8, algorithm: 'sha256'});
      assert.equal(topic, '46119246');
    });
  });

  describe('base32 encoding with key = \'GEZDGNBVGY3TQOJQ\' as base32 at counter 1, length = 8 and algorithm as \'sha512\'', function () {
    it('should return correct one-time password', function() {
      var topic = speakeasy.hotp({key: 'GEZDGNBVGY3TQOJQ', encoding: 'base32', counter: 1, length: 8, algorithm: 'sha512'});
      assert.equal(topic, '90693936');
    });
  });

});
