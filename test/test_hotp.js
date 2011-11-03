var vows = require('vows'),
    assert = require('assert');

var speakeasy = require('../lib/speakeasy');

// These tests use the information from RFC 4226's Appendix D: Test Values.
// http://tools.ietf.org/html/rfc4226#appendix-D

vows.describe('HOTP Counter-Based Algorithm Test').addBatch({
  'Test normal operation with key = \'12345678901234567890\' at counter 3': {
    topic: function() {
      return speakeasy.hotp({key: '12345678901234567890', counter: 3});
    },
    
    'correct one-time password returned': function(topic) {
      assert.equal(topic, '969429');
    }
  },

  'Test another counter normal operation with key = \'12345678901234567890\' at counter 7': {
    topic: function() {
      return speakeasy.hotp({key: '12345678901234567890', counter: 7});
    },
    
    'correct one-time password returned': function(topic) {
      assert.equal(topic, '162583');
    }
  },

  'Test length override with key = \'12345678901234567890\' at counter 4 and length = 8': {
    topic: function() {
      return speakeasy.hotp({key: '12345678901234567890', counter: 4, length: 8});
    },
    
    'correct one-time password returned': function(topic) {
      assert.equal(topic, '40338314');
    }
  },

  'Test hexadecimal encoding with key = \'3132333435363738393031323334353637383930\' as hexadecimal at counter 4': {
    topic: function() {
      return speakeasy.hotp({key: '3132333435363738393031323334353637383930', encoding: 'hex', counter: 4});
    },
    
    'correct one-time password returned': function(topic) {
      assert.equal(topic, '338314');
    }
  },

  'Test base32 encoding with key = \'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ\' as base32 at counter 4': {
    topic: function() {
      return speakeasy.hotp({key: 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ', encoding: 'base32', counter: 4});
    },
    
    'correct one-time password returned': function(topic) {
      assert.equal(topic, '338314');
    }
  },
}).exportTo(module);
