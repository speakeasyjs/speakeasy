'use strict';

/* global describe, it */

var chai = require('chai');
var assert = chai.assert;
var speakeasy = require('..');

/*

   The following test data uses the ASCII string
   "12345678901234567890" for the secret:

   Secret = 0x3132333435363738393031323334353637383930

   Table 1 details for each count, the intermediate HMAC value.

   Count    Hexadecimal HMAC-SHA-1(secret, count)
   0        cc93cf18508d94934c64b65d8ba7667fb7cde4b0
   1        75a48a19d4cbe100644e8ac1397eea747a2d33ab
   2        0bacb7fa082fef30782211938bc1c5e70416ff44
   3        66c28227d03a2d5529262ff016a1e6ef76557ece
   4        a904c900a64b35909874b33e61c5938a8e15ed1c
   5        a37e783d7b7233c083d4f62926c7a25f238d0316
   6        bc9cd28561042c83f219324d3c607256c03272ae
   7        a4fb960c0bc06e1eabb804e5b397cdc4b45596fa
   8        1b3c89f65e6c9e883012052823443f048b4332db
   9        1637409809a679dc698207310c8c7fc07290d9e5

   Table 2 details for each count the truncated values (both in
   hexadecimal and decimal) and then the HOTP value.

                     Truncated
   Count    Hexadecimal    Decimal        HOTP
   0        4c93cf18       1284755224     755224
   1        41397eea       1094287082     287082
   2         82fef30        137359152     359152
   3        66ef7655       1726969429     969429
   4        61c5938a       1640338314     338314
   5        33c083d4        868254676     254676
   6        7256c032       1918287922     287922
   7         4e5b397         82162583     162583
   8        2823443f        673399871     399871
   9        2679dc69        645520489     520489

*/

describe('RFC 4226 test values', function () {
  describe('intermediate HMAC values', function () {
    [
      'cc93cf18508d94934c64b65d8ba7667fb7cde4b0',
      '75a48a19d4cbe100644e8ac1397eea747a2d33ab',
      '0bacb7fa082fef30782211938bc1c5e70416ff44',
      '66c28227d03a2d5529262ff016a1e6ef76557ece',
      'a904c900a64b35909874b33e61c5938a8e15ed1c',
      'a37e783d7b7233c083d4f62926c7a25f238d0316',
      'bc9cd28561042c83f219324d3c607256c03272ae',
      'a4fb960c0bc06e1eabb804e5b397cdc4b45596fa',
      '1b3c89f65e6c9e883012052823443f048b4332db',
      '1637409809a679dc698207310c8c7fc07290d9e5'
    ].forEach(function (expect, count) {
      it('should match for counter = ' + count, function () {
        var hash = speakeasy.digest({
          secret: '12345678901234567890',
          counter: count
        }).toString('hex');
        assert.equal(hash, expect);
      });
    });
  });

  describe('HOTP values', function () {
    [
      '755224',
      '287082',
      '359152',
      '969429',
      '338314',
      '254676',
      '287922',
      '162583',
      '399871',
      '520489'
    ].forEach(function (expect, count) {
      it('should match for count = ' + count, function () {
        var code = speakeasy.hotp({
          secret: '12345678901234567890',
          counter: count
        });
        assert.equal(code, expect);
      });
    });
  });
});
