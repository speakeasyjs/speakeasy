var vows = require('vows'),
    assert = require('assert');

var speakeasy = require('../lib/speakeasy');

// These tests use the test vectors from RFC 6238's Appendix B: Test Vectors
// http://tools.ietf.org/html/rfc6238#appendix-B
// They use an ASCII string of 12345678901234567890 and a time step of 30.

vows.describe('TOTP Time-Based Algorithm Test').addBatch({
  'Test normal operation with key = \'12345678901234567890\' at time = 59': {
    topic: function() {
      return speakeasy.totp({key: '12345678901234567890', time: 59});
    },
    
    'correct one-time password returned': function(topic) {
      assert.equal(topic, '287082');
    }
  },

  'Test a different time normal operation with key = \'12345678901234567890\' at time = 1111111109': {
    topic: function() {
      return speakeasy.totp({key: '12345678901234567890', time: 1111111109});
    },
    
    'correct one-time password returned': function(topic) {
      assert.equal(topic, '081804');
    }
  },

  'Test length parameter with key = \'12345678901234567890\' at time = 1111111109 and length = 8': {
    topic: function() {
      return speakeasy.totp({key: '12345678901234567890', time: 1111111109, length: 8});
    },
    
    'correct one-time password returned': function(topic) {
      assert.equal(topic, '07081804');
    }
  },

  'Test hexadecimal encoding with key = \'3132333435363738393031323334353637383930\' as hexadecimal at time 1111111109': {
    topic: function() {
      return speakeasy.totp({key: '3132333435363738393031323334353637383930', encoding: 'hex', time: 1111111109});
    },
    
    'correct one-time password returned': function(topic) {
      assert.equal(topic, '081804');
    }
  },

  'Test base32 encoding with key = \'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ\' as base32 at time 1111111109': {
    topic: function() {
      return speakeasy.totp({key: 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ', encoding: 'base32', time: 1111111109});
    },
    
    'correct one-time password returned': function(topic) {
      assert.equal(topic, '081804');
    }
  },

  'Test a custom step with key = \'12345678901234567890\' at time = 1111111109 with step = 60': {
    topic: function() {
      return speakeasy.totp({key: '12345678901234567890', time: 1111111109, step: 60});
    },
    
    'correct one-time password returned': function(topic) {
      assert.equal(topic, '360094');
    }
  },

  'Test initial time with key = \'12345678901234567890\' at time = 1111111109 and initial time = 1111111100': {
    topic: function() {
      return speakeasy.totp({key: '12345678901234567890', time: 1111111109, initial_time: 1111111100});
    },
    
    'correct one-time password returned': function(topic) {
      assert.equal(topic, '755224');
    }
  },
}).exportTo(module);
