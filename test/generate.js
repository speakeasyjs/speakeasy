"use scrict";

var chai = require('chai');
var assert = chai.assert;
var speakeasy = require('..');

// These tests use the information from RFC 4226's Appendix D: Test Values.
// http://tools.ietf.org/html/rfc4226#appendix-D

describe('Generator tests', function () {

  it('Normal generation with defaults', function () {
    var secret = speakeasy.generate_key();
    assert.equal(secret.ascii.length, 32, 'Should return the correct length');
    assert.isDefined(secret.google_auth_url, 'Google Auth URL should be returned')
    assert.isUndefined(secret.qr_code_ascii, 'QR Code ASCII should not be returned')
    assert.isUndefined(secret.qr_code_hex, 'QR Code Hex should not be returned')
    assert.isUndefined(secret.qr_code_base32, 'QR Code Base 32 should not be returned')
    assert.isUndefined(secret.google_auth_qr, 'Google Auth QR should not be returned')
  });

  it('Generation with custom key length', function () {
    var secret = speakeasy.generate_key({length: 50});
    assert.equal(secret.ascii.length, 50, 'Should return the correct length');
  });

  it('Generation with symbols disabled', function () {
    var secret = speakeasy.generate_key({symbols: false});
    assert.ok(/^[a-z0-9]+$/i.test(secret.ascii), 'Should return an alphanumeric key');
  });

  it('Generation with QR URL output enabled', function () {
    var secret = speakeasy.generate_key({qr_codes: true});
    assert.isDefined(secret.qr_code_ascii, 'QR Code ASCII should be returned')
    assert.isDefined(secret.qr_code_hex, 'QR Code Hex should be returned')
    assert.isDefined(secret.qr_code_base32, 'QR Code Base 32 should be returned')
  });

  it('Generation with Google Auth URL output disabled', function () {
    var secret = speakeasy.generate_key({google_auth_url: false});
    assert.isUndefined(secret.google_auth_url, 'Google Auth URL should not be returned')
  });

  it('Generation with Google Auth QR URL output enabled', function () {
    var secret = speakeasy.generate_key({google_auth_qr: true});
    assert.isDefined(secret.google_auth_qr, 'Google Auth QR should be returned')
  });

  it('Testing generate_key_ascii with defaults', function () {
    var secret = speakeasy.generate_key_ascii();
    assert.equal(secret.length, 32, 'Should return the correct length');
    assert.ok(/^[a-z0-9]+$/i.test(secret.ascii), 'Should return an alphanumeric key');
  });

  it('Testing generate_key_ascii with custom length', function () {
    var secret = speakeasy.generate_key_ascii(20);
    assert.equal(secret.length, 20, 'Should return the correct length');
    assert.ok(/^[a-z0-9]+$/i.test(secret.ascii), 'Should return an alphanumeric key');
  });

});
