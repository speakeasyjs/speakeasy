'use strict';

/* global describe, it */

var chai = require('chai');
var assert = chai.assert;
var speakeasy = require('..');

/*

   This section provides test values that can be used for the HOTP time-
   based variant algorithm interoperability test.

   The test token shared secret uses the ASCII string value
   "12345678901234567890".  With Time Step X = 30, and the Unix epoch as
   the initial value to count time steps, where T0 = 0, the TOTP
   algorithm will display the following values for specified modes and
   timestamps.

  +-------------+--------------+------------------+----------+--------+
  |  Time (sec) |   UTC Time   | Value of T (hex) |   TOTP   |  Mode  |
  +-------------+--------------+------------------+----------+--------+
  |      59     |  1970-01-01  | 0000000000000001 | 94287082 |  SHA1  |
  |             |   00:00:59   |                  |          |        |
  |      59     |  1970-01-01  | 0000000000000001 | 46119246 | SHA256 |
  |             |   00:00:59   |                  |          |        |
  |      59     |  1970-01-01  | 0000000000000001 | 90693936 | SHA512 |
  |             |   00:00:59   |                  |          |        |
  |  1111111109 |  2005-03-18  | 00000000023523EC | 07081804 |  SHA1  |
  |             |   01:58:29   |                  |          |        |
  |  1111111109 |  2005-03-18  | 00000000023523EC | 68084774 | SHA256 |
  |             |   01:58:29   |                  |          |        |
  |  1111111109 |  2005-03-18  | 00000000023523EC | 25091201 | SHA512 |
  |             |   01:58:29   |                  |          |        |
  |  1111111111 |  2005-03-18  | 00000000023523ED | 14050471 |  SHA1  |
  |             |   01:58:31   |                  |          |        |
  |  1111111111 |  2005-03-18  | 00000000023523ED | 67062674 | SHA256 |
  |             |   01:58:31   |                  |          |        |
  |  1111111111 |  2005-03-18  | 00000000023523ED | 99943326 | SHA512 |
  |             |   01:58:31   |                  |          |        |
  |  1234567890 |  2009-02-13  | 000000000273EF07 | 89005924 |  SHA1  |
  |             |   23:31:30   |                  |          |        |
  |  1234567890 |  2009-02-13  | 000000000273EF07 | 91819424 | SHA256 |
  |             |   23:31:30   |                  |          |        |
  |  1234567890 |  2009-02-13  | 000000000273EF07 | 93441116 | SHA512 |
  |             |   23:31:30   |                  |          |        |
  |  2000000000 |  2033-05-18  | 0000000003F940AA | 69279037 |  SHA1  |
  |             |   03:33:20   |                  |          |        |
  |  2000000000 |  2033-05-18  | 0000000003F940AA | 90698825 | SHA256 |
  |             |   03:33:20   |                  |          |        |
  |  2000000000 |  2033-05-18  | 0000000003F940AA | 38618901 | SHA512 |
  |             |   03:33:20   |                  |          |        |
  | 20000000000 |  2603-10-11  | 0000000027BC86AA | 65353130 |  SHA1  |
  |             |   11:33:20   |                  |          |        |
  | 20000000000 |  2603-10-11  | 0000000027BC86AA | 77737706 | SHA256 |
  |             |   11:33:20   |                  |          |        |
  | 20000000000 |  2603-10-11  | 0000000027BC86AA | 47863826 | SHA512 |
  |             |   11:33:20   |                  |          |        |
  +-------------+--------------+------------------+----------+--------+

                            Table 1: TOTP Table

*/

describe('RFC 6238 test vector', function () {
  [{
    time: 59,
    date: new Date('1970-01-01T00:00:59Z'),
    counter: 0x01,
    code: '94287082',
    algorithm: 'SHA1'
  }, {
    time: 59,
    date: new Date('1970-01-01T00:00:59Z'),
    counter: 0x01,
    code: '46119246',
    algorithm: 'SHA256'
  }, {
    time: 59,
    date: new Date('1970-01-01T00:00:59Z'),
    counter: 0x01,
    code: '90693936',
    algorithm: 'SHA512'
  }, {
    time: 1111111109,
    date: new Date('2005-03-18T01:58:29Z'),
    counter: 0x023523EC,
    code: '07081804',
    algorithm: 'SHA1'
  }, {
    time: 1111111109,
    date: new Date('2005-03-18T01:58:29Z'),
    counter: 0x023523EC,
    code: '68084774',
    algorithm: 'SHA256'
  }, {
    time: 1111111109,
    date: new Date('2005-03-18T01:58:29Z'),
    counter: 0x023523EC,
    code: '25091201',
    algorithm: 'SHA512'
  }, {
    time: 1111111111,
    date: new Date('2005-03-18T01:58:31Z'),
    counter: 0x023523ED,
    code: '14050471',
    algorithm: 'SHA1'
  }, {
    time: 1111111111,
    date: new Date('2005-03-18T01:58:31Z'),
    counter: 0x023523ED,
    code: '67062674',
    algorithm: 'SHA256'
  }, {
    time: 1111111111,
    date: new Date('2005-03-18T01:58:31Z'),
    counter: 0x023523ED,
    code: '99943326',
    algorithm: 'SHA512'
  }, {
    time: 1234567890,
    date: new Date('2009-02-13T23:31:30Z'),
    counter: 0x0273EF07,
    code: '89005924',
    algorithm: 'SHA1'
  }, {
    time: 1234567890,
    date: new Date('2009-02-13T23:31:30Z'),
    counter: 0x0273EF07,
    code: '91819424',
    algorithm: 'SHA256'
  }, {
    time: 1234567890,
    date: new Date('2009-02-13T23:31:30Z'),
    counter: 0x0273EF07,
    code: '93441116',
    algorithm: 'SHA512'
  }, {
    time: 2000000000,
    date: new Date('2033-05-18T03:33:20Z'),
    counter: 0x03F940AA,
    code: '69279037',
    algorithm: 'SHA1'
  }, {
    time: 2000000000,
    date: new Date('2033-05-18T03:33:20Z'),
    counter: 0x03F940AA,
    code: '90698825',
    algorithm: 'SHA256'
  }, {
    time: 2000000000,
    date: new Date('2033-05-18T03:33:20Z'),
    counter: 0x03F940AA,
    code: '38618901',
    algorithm: 'SHA512'
  }, {
    time: 20000000000,
    date: new Date('2603-10-11T11:33:20Z'),
    counter: 0x27BC86AA,
    code: '65353130',
    algorithm: 'SHA1'
  }, {
    time: 20000000000,
    date: new Date('2603-10-11T11:33:20Z'),
    counter: 0x27BC86AA,
    code: '77737706',
    algorithm: 'SHA256'
  }, {
    time: 20000000000,
    date: new Date('2603-10-11T11:33:20Z'),
    counter: 0x27BC86AA,
    code: '47863826',
    algorithm: 'SHA512'
  }].forEach(function (subject) {
    var key = new Buffer('12345678901234567890');
    var nbytes, i;

    it('should calculate counter value for time ' + subject.time, function () {
      var counter = speakeasy._counter({
        time: subject.time
      });
      assert.equal(counter, subject.counter);
    });

    it('should calculate counter value for date ' + subject.date, function () {
      var counter = speakeasy._counter({
        time: Math.floor(subject.date / 1000)
      });
      assert.equal(counter, subject.counter);
    });

    it('should generate TOTP code for time ' + subject.time + ' and algorithm ' + subject.algorithm, function () {
      var counter = speakeasy.totp({
        secret: key,
        time: subject.time,
        algorithm: subject.algorithm,
        digits: 8
      });
      assert.equal(counter, subject.code);
    });
  });
});
