"use strict";

/* global describe, it */

var chai = require('chai');
var assert = chai.assert;
var speakeasy = require('..');
var url = require("url");

describe("#url", function () {

  it("should require options", function () {
    assert.throws(function () {
      speakeasy.google_auth_url();
    });
  });

  it("should validate type", function () {
    assert.throws(function () {
      speakeasy.google_auth_url({
        type: "haha",
        secret: "hello",
        label: "that",
      }, /invalid type `haha`/);
    });
  });

  it("should require secret", function () {
    assert.throws(function () {
      speakeasy.google_auth_url({
        label: "that"
      }, /missing secret/);
    });
  });

  it("should require label", function () {
    assert.throws(function () {
      speakeasy.google_auth_url({
        secret: "hello"
      }, /missing label/);
    });
  });

  it("should require counter for HOTP", function () {
    assert.throws(function () {
      speakeasy.google_auth_url({
        type: "hotp",
        secret: "hello",
        label: "that"
      }, /missing counter/);
    });
    assert.ok(speakeasy.google_auth_url({
      type: "hotp",
      secret: "hello",
      label: "that",
      counter: 0
    }));
    assert.ok(speakeasy.google_auth_url({
      type: "hotp",
      secret: "hello",
      label: "that",
      counter: 199
    }));
  });

  it("should validate algorithm", function () {
    assert.throws(function () {
      speakeasy.google_auth_url({
        secret: "hello",
        label: "that",
        algorithm: "hello"
      }, /invalid algorithm `hello`/);
    });
    assert.ok(speakeasy.google_auth_url({
      secret: "hello",
      label: "that",
      algorithm: "sha1"
    }));
    assert.ok(speakeasy.google_auth_url({
      secret: "hello",
      label: "that",
      algorithm: "sha256"
    }));
    assert.ok(speakeasy.google_auth_url({
      secret: "hello",
      label: "that",
      algorithm: "sha512"
    }));
  });

  it("should validate digits", function () {
    assert.throws(function () {
      speakeasy.google_auth_url({
        secret: "hello",
        label: "that",
        digits: "hello"
      }, /invalid digits `hello`/);
    });
    assert.throws(function () {
      speakeasy.google_auth_url({
        secret: "hello",
        label: "that",
        digits: 12
      }, /invalid digits `12`/);
    });
    assert.throws(function () {
      speakeasy.google_auth_url({
        secret: "hello",
        label: "that",
        digits: "7"
      }, /invalid digits `7`/);
    });
    assert.ok(speakeasy.google_auth_url({
      secret: "hello",
      label: "that",
      digits: 6
    }));
    assert.ok(speakeasy.google_auth_url({
      secret: "hello",
      label: "that",
      digits: 8
    }));
    assert.ok(speakeasy.google_auth_url({
      secret: "hello",
      label: "that",
      digits: "6"
    }));
    assert.ok(speakeasy.google_auth_url({
      secret: "hello",
      label: "that",
      digits: "8"
    }));
  });

  it("should validate period", function () {
    assert.throws(function () {
      speakeasy.google_auth_url({
        secret: "hello",
        label: "that",
        period: "hello"
      }, /invalid period `hello`/);
    });
    assert.ok(speakeasy.google_auth_url({
      secret: "hello",
      label: "that",
      period: 60
    }));
    assert.ok(speakeasy.google_auth_url({
      secret: "hello",
      label: "that",
      period: 121
    }));
    assert.ok(speakeasy.google_auth_url({
      secret: "hello",
      label: "that",
      period: "60"
    }));
    assert.ok(speakeasy.google_auth_url({
      secret: "hello",
      label: "that",
      period: "121"
    }));
  });

  it("should generate an URL compatible with the Google Authenticator app", function () {
    var answer = speakeasy.google_auth_url({
      secret: "JBSWY3DPEHPK3PXP",
      label: "Example:alice@google.com",
      issuer: "Example",
      encoding: "base32"
    });
    var expect = "otpauth://totp/Example:alice@google.com?secret=JBSWY3DPEHPK3PXP&issuer=Example";
    assert.deepEqual(
      url.parse(answer),
      url.parse(expect)
    );
  });

});
