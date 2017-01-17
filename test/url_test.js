'use strict';

/* global describe, it */

var chai = require('chai');
var assert = chai.assert;
var speakeasy = require('..');
var url = require('url');

describe('#url', function () {
  it('should require options', function () {
    assert.throws(function () {
      speakeasy.otpauthURL();
    });
  });

  it('should validate type', function () {
    assert.throws(function () {
      speakeasy.otpauthURL({
        type: 'haha',
        secret: 'hello',
        label: 'that'
      }, /invalid type `haha`/);
    });
  });

  it('should require secret', function () {
    assert.throws(function () {
      speakeasy.otpauthURL({
        label: 'that'
      }, /missing secret/);
    });
  });

  it('should require label', function () {
    assert.throws(function () {
      speakeasy.otpauthURL({
        secret: 'hello'
      }, /missing label/);
    });
  });

  it('should require counter for HOTP', function () {
    assert.throws(function () {
      speakeasy.otpauthURL({
        type: 'hotp',
        secret: 'hello',
        label: 'that'
      }, /missing counter/);
    });
    assert.ok(speakeasy.otpauthURL({
      type: 'hotp',
      secret: 'hello',
      label: 'that',
      counter: 0
    }));
    assert.ok(speakeasy.otpauthURL({
      type: 'hotp',
      secret: 'hello',
      label: 'that',
      counter: 199
    }));
  });

  it('should validate algorithm', function () {
    assert.doesNotThrow(function () {
      speakeasy.otpauthURL({
        secret: 'hello',
        label: 'that',
        algorithm: 'hello'
      }, /invalid algorithm `hello`/);
    });
    assert.ok(speakeasy.otpauthURL({
      secret: 'hello',
      label: 'that',
      algorithm: 'sha1'
    }));
    assert.ok(speakeasy.otpauthURL({
      secret: 'hello',
      label: 'that',
      algorithm: 'sha256'
    }));
    assert.ok(speakeasy.otpauthURL({
      secret: 'hello',
      label: 'that',
      algorithm: 'sha512'
    }));
  });

  it('should validate digits', function () {
    assert.throws(function () {
      speakeasy.otpauthURL({
        secret: 'hello',
        label: 'that',
        digits: 'hello'
      }, /invalid digits `hello`/);
    });
    // Non-6 and non-8 digits should not throw, but should have a warn message
    assert.doesNotThrow(function () {
      speakeasy.otpauthURL({
        secret: 'hello',
        label: 'that',
        digits: 12
      }, /invalid digits `12`/);
    });
    assert.doesNotThrow(function () {
      speakeasy.otpauthURL({
        secret: 'hello',
        label: 'that',
        digits: '7'
      }, /invalid digits `7`/);
    });
    assert.ok(speakeasy.otpauthURL({
      secret: 'hello',
      label: 'that',
      digits: 6
    }));
    assert.ok(speakeasy.otpauthURL({
      secret: 'hello',
      label: 'that',
      digits: 8
    }));
    assert.ok(speakeasy.otpauthURL({
      secret: 'hello',
      label: 'that',
      digits: '6'
    }));
    assert.ok(speakeasy.otpauthURL({
      secret: 'hello',
      label: 'that',
      digits: '8'
    }));
  });

  it('should validate period', function () {
    assert.throws(function () {
      speakeasy.otpauthURL({
        secret: 'hello',
        label: 'that',
        period: 'hello'
      }, /invalid period `hello`/);
    });
    assert.ok(speakeasy.otpauthURL({
      secret: 'hello',
      label: 'that',
      period: 60
    }));
    assert.ok(speakeasy.otpauthURL({
      secret: 'hello',
      label: 'that',
      period: 121
    }));
    assert.ok(speakeasy.otpauthURL({
      secret: 'hello',
      label: 'that',
      period: '60'
    }));
    assert.ok(speakeasy.otpauthURL({
      secret: 'hello',
      label: 'that',
      period: '121'
    }));
  });

  it('should generate an URL compatible with the Google Authenticator app', function () {
    var answer = speakeasy.otpauthURL({
      secret: 'JBSWY3DPEHPK3PXP',
      label: 'Example:alice@google.com',
      issuer: 'Example',
      encoding: 'base32'
    });
    var expect = 'otpauth://totp/Example%3Aalice%40google.com?secret=JBSWY3DPEHPK3PXP&issuer=Example&algorithm=SHA1&digits=6&period=30';
    assert.deepEqual(
      url.parse(answer),
      url.parse(expect)
    );
  });

  it('should generate an URL compatible with the Google Authenticator app and convert an ASCII-encoded string', function () {
    var answer = speakeasy.otpauthURL({
      secret: 'MKiNHTvmfQ',
      label: 'Example:alice@google.com',
      issuer: 'Example'
    });
    var expect = 'otpauth://totp/Example%3Aalice%40google.com?secret=JVFWSTSIKR3G2ZSR&issuer=Example&algorithm=SHA1&digits=6&period=30';
    assert.deepEqual(
      url.parse(answer),
      url.parse(expect)
    );
  });

  it('should generate an hotp URL compatible with the Google Authenticator app for non-zero counter', function () {
    var answer = speakeasy.otpauthURL({
      secret: 'JBSWY3DPEHPK3PXP',
      label: 'Example:alice@google.com',
      issuer: 'Example',
      encoding: 'base32',
      type: 'hotp',
      counter: 199
    });
    var expect = 'otpauth://hotp/Example%3Aalice%40google.com?secret=JBSWY3DPEHPK3PXP&issuer=Example&counter=199&algorithm=SHA1&digits=6&period=30';
    assert.deepEqual(
      url.parse(answer),
      url.parse(expect)
    );
  });

  it('should generate an hotp URL compatible with the Google Authenticator app for zero counter', function () {
    var answer = speakeasy.otpauthURL({
      secret: 'JBSWY3DPEHPK3PXP',
      label: 'Example:alice@google.com',
      issuer: 'Example',
      encoding: 'base32',
      type: 'hotp',
      counter: 0
    });
    var expect = 'otpauth://hotp/Example%3Aalice%40google.com?secret=JBSWY3DPEHPK3PXP&issuer=Example&counter=0&algorithm=SHA1&digits=6&period=30';
    assert.deepEqual(
      url.parse(answer),
      url.parse(expect)
    );
  });
  
  it('should generate an totp URL compatible with the Google Authenticator app for sha512 algorithm', function () {
    var answer = speakeasy.otpauthURL({
      secret: 'JBSWY3DPEHPK3PXP',
      label: 'Example:alice@google.com',
      issuer: 'Example',
      encoding: 'base32',
      algorithm: 'sha512'
    });
    var expect = 'otpauth://totp/Example%3Aalice%40google.com?secret=JBSWY3DPEHPK3PXP&issuer=Example&algorithm=SHA512&digits=6&period=30';
    assert.deepEqual(
      url.parse(answer),
      url.parse(expect)
    );
  }) ;
  
  it('should generate an totp URL compatible with the Google Authenticator app for sha256 algorithm', function () {
    var answer = speakeasy.otpauthURL({
      secret: 'JBSWY3DPEHPK3PXP',
      label: 'Example:alice@google.com',
      issuer: 'Example',
      encoding: 'base32',
      algorithm: 'sha256'
    });
    var expect = 'otpauth://totp/Example%3Aalice%40google.com?secret=JBSWY3DPEHPK3PXP&issuer=Example&algorithm=SHA256&digits=6&period=30';
    assert.deepEqual(
      url.parse(answer),
      url.parse(expect)
    );
  });
  
  it('should generate an totp URL compatible with the Google Authenticator app for 8 digits', function () {
    var answer = speakeasy.otpauthURL({
      secret: 'JBSWY3DPEHPK3PXP',
      label: 'Example:alice@google.com',
      issuer: 'Example',
      encoding: 'base32',
      digits: 8
    });
    var expect = 'otpauth://totp/Example%3Aalice%40google.com?secret=JBSWY3DPEHPK3PXP&issuer=Example&algorithm=SHA1&digits=8&period=30';
    assert.deepEqual(
      url.parse(answer),
      url.parse(expect)
    );
  });
  
  it('should generate an totp URL compatible with the Google Authenticator app for period of 60', function () {
    var answer = speakeasy.otpauthURL({
      secret: 'JBSWY3DPEHPK3PXP',
      label: 'Example:alice@google.com',
      issuer: 'Example',
      encoding: 'base32',
      period: '60'
    });
    var expect = 'otpauth://totp/Example%3Aalice%40google.com?secret=JBSWY3DPEHPK3PXP&issuer=Example&algorithm=SHA1&digits=6&period=60';
    assert.deepEqual(
      url.parse(answer),
      url.parse(expect)
    );
  });
});
