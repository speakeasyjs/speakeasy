<img src="http://i.imgur.com/qRyNMx4.png" width="550">

[![Build Status](https://travis-ci.org/speakeasyjs/speakeasy.svg?branch=v2)](https://travis-ci.org/speakeasyjs/speakeasy)
[![NPM downloads](https://img.shields.io/npm/dt/speakeasy.svg)](https://www.npmjs.com/package/speakeasy)
[![NPM version](https://img.shields.io/npm/v/speakeasy.svg)](https://www.npmjs.com/package/speakeasy)

---

**Jump to** — [Install](#install) · [Demo](#demo) · [Usage](#usage) · [Documentation](#documentation) · [Quick Reference](#quick-reference) · [License](#license)

---

Speakeasy is a one-time passcode generator, suitable for use in two-factor
authentication, that supports Google Authenticator and other two-factor apps.

It includes robust support for custom token lengths, authentication windows,
and other features, and includes helpers like a secret key generator.

Speakeasy implements one-time passcode generators as standardized by the
[Initiative for Open Authentication (OATH)][oath]. The HMAC-Based One-Time
Password (HOTP) algorithm defined by [RFC 4226][rfc4226] and the Time-Based
One-time Password (TOTP) algorithm defined in [RFC 6238][rfc6238] are
supported.

<a name="install"></a>
## Install

```sh
npm install --save speakeasy
```

<a name="demo"></a>
## Demo

This demo uses the `generate_key` method of Speakeasy to generate a secret key,
displays a Google Authenticator–compatible QR code which you can scan into your
phone's two-factor app, and shows the token, which you can verify with your
phone. Includes sample code. https://sedemo-mktb.rhcloud.com/

<a href="https://sedemo-mktb.rhcloud.com/"><img src="http://i.imgur.com/gPwPP4u.png" height="43"></a>

<a name="usage"></a>
## Usage

```js
var speakeasy = require("speakeasy");
```

#### Generating a key

```js
// Generate a secret key.
var secret = speakeasy.generate_key({length: 20});
// Access using secret.ascii, secret.hex, or secret.base32.
```

#### Getting a time-based token for the current time

```js
// Generate a time-based token based on the base-32 key.
// HOTP (counter-based tokens) can also be used if `totp` is replaced by
// `hotp` (i.e. speakeasy.hotp()) and a `counter` is given in the options.
var token = speakeasy.totp({
  secret: base32secret
});

// Returns token for the secret at the current time
// Compare this to user input
```

#### Verifying a token

```js
// Verify a given token
var tokenValidates = speakeasy.totp.verify({
  secret: base32secret,
  token: '123456'
});
// Returns true if the token matches
```

#### Verifying a token and calculating a delta
```js
// Verify a given token and check nearby tokens
var tokenDelta = speakeasy.totp.verifyDelta({
  secret: base32secret,
  token: '123456'
});
// Returns {delta: 0} where the delta is the time step difference
// between the given token and the current time
```

#### Calculating a counter-based token

```js
var token = speakeasy.hotp({
  secret: base32secret,
  counter: 123
});

var tokenValidates = speakeasy.hotp.verify({
  secret: secret.base32,
  token: token,
  counter: 123
});
```

<a name="documentation"></a>
## Documentation

A quick reference can be found below. Full API documentation (in JSDoc format)
is available at http://speakeasyjs.github.io/speakeasy/

<a href="http://speakeasyjs.github.io/speakeasy/"><img src="http://i.imgur.com/hD9w41T.png" height="43"></a>


<a name="quick-reference"></a>
## Quick Reference

TODO: Update

### speakeasy.hotp(options) | speakeasy.counter(options)

Calculate the one-time password using the counter-based algorithm, HOTP. Specify the key and counter, and receive the one-time password for that counter position. You can also specify a password length, as well as the encoding (ASCII, hexadecimal, or base32) for convenience. Returns the one-time password as a string.

Written to follow [RFC 4226](http://tools.ietf.org/html/rfc4226). Calculated with: `HOTP(K,C) = Truncate(HMAC-SHA-1(K,C))`

#### Options

* `secret`: the secret key in ASCII, hexadecimal, or base32 format.
* `counter`: the counter position (moving factor).
* `length` (default `6`): the length of the resulting one-time password.
* `encoding` (default `ascii`): the encoding of the `key`. Can be `'ascii'`, `'hex'`, or `'base32'`. The key will automatically be converted to ASCII.

#### Example

```javascript
// normal use.
speakeasy.hotp({key: 'secret', counter: 582});
// => 246642

// use a custom length.
speakeasy.hotp({key: 'secret', counter: 582, length: 8});
// => 67246642

// use a custom encoding.
speakeasy.hotp({key: 'AJFIEJGEHIFIU7148SF', counter: 147, encoding: 'base32'});
// => 974955
```

### speakeasy.totp(options) | speakeasy.time(options)

Calculate the one-time password using the time-based algorithm, TOTP. Specify the key, and receive the one-time password for that time. By default, the time step is 30 seconds, so there is a new password every 30 seconds. However, you may override the time step. You may also override the time you want to calculate the time from. You can also specify a password length, as well as the encoding (ASCII, hexadecimal, or base32) for convenience. Returns the one-time password as a string.

Written to follow [RFC 6238](http://tools.ietf.org/html/rfc6238). Calculated with: `C = ((T - T0) / X); HOTP(K,C) = Truncate(HMAC-SHA-1(K,C))`

#### Options

* `secret`: the secret key in ASCII, hexadecimal, or base32 format.
* `step` (default `30`): the time step, in seconds, between new passwords (moving factor).
* `time` (default current time): the time to calculate the TOTP from, by default the current time. If you're doing something clever with TOTP, you may override this (see *Techniques* below).
* `initial_time` (default `0`): the starting time where we calculate the TOTP from. Usually, this is set to the UNIX epoch at 0.
* `length` (default `6`): the length of the resulting one-time password.
* `encoding` (default `ascii`): the encoding of the `key`. Can be `'ascii'`, `'hex'`, or `'base32'`. The key will automatically be converted to ASCII.

#### Example

```javascript
// normal use.
speakeasy.totp({key: 'secret'});

// use a custom time step.
speakeasy.totp({key: 'secret', step: 60});

// use a custom time.
speakeasy.totp({key: 'secret', time: 159183717});
// => 558014

// use a initial time.
speakeasy.totp({key: 'secret', initial_time: 4182881485});
// => 670417
```

#### Techniques

You can implement a double-authentication scheme, where you ask the user to input the one-time password once, wait until the next 30-second refresh, and then input the one-time password again. In this case, you can calculate the second (later) input by calculating TOTP as usual, then also verify the first (earlier) input by taking the current epoch time in seconds and subtracting 30 seconds to get to the previous step (for example: `time1 = (parseInt(new Date()/1000) - 30)`)

### speakeasy.generate_key(options)

Generate a random secret key. It will return the key in ASCII, hexadecimal, and base32 formats. You can specify the length, whether or not to use symbols, and ask it (nicely) to generate URLs for QR codes. Returns an object with the ASCII, hex, and base32 representations of the secret key, plus any QR codes you can optionally ask for.

#### Options

* `length` (default `32`): the length of the generated secret key.
* `symbols` (default `true`): include symbols in the key? if not, the key will be alphanumeric, {A-Z, a-z, 0-9}
* `qr_codes` (default `false`): generate links to QR codes for each encoding (ASCII, hexadecimal, and base32). It uses the Google Charts API and they are served over HTTPS. A future version might allow for QR code generation client-side for security.
* `google_auth_qr` (default `false`): generate a link to a QR code that you can scan using the Google Authenticator app. The contents of the QR code are in this format: `otpauth://totp/[KEY NAME]?secret=[KEY SECRET, BASE 32]`.
* `name` (optional): specify a name when you are using `google_auth_qr`, which will show up as the label after scanning. `[KEY NAME]` in the previous line.

#### Examples

```javascript
// generate a key
speakeasy.generate_key({length: 20, symbols: true});
// => { ascii: 'km^A?n&sOPJW.iCKPHKU', hex: '6b6d5e413f6e26734f504a572e69434b50484b55', base32: 'NNWV4QJ7NYTHGT2QJJLS42KDJNIEQS2V' }

// generate a key and request QR code links
speakeasy.generate_key({length: 20, qr_codes: true});
// => { ascii: 'eV:JQ1NedJkKn&]6^i>s', ... (truncated)
//      qr_code_ascii: 'https://www.google.com/chart?chs=166x166&chld=L|0&cht=qr&chl=eV%3AJQ1NedJkKn%26%5D6%5Ei%3Es',
//      qr_code_hex: 'https://www.google.com/chart?chs=166x166&chld=L|0&cht=qr&chl=65563a4a51314e65644a6b4b6e265d365e693e73',
//      qr_code_base32: 'https://www.google.com/chart?chs=166x166&chld=L|0&cht=qr&chl=MVLDUSSRGFHGKZCKNNFW4JS5GZPGSPTT' }

// generate a key and get a QR code you can scan with the Google Authenticator app
speakeasy.generate_key({length: 20, google_auth_qr: true});
// => { ascii: 'V?9f6.Cq1&<H?<nxe.XJ', ... (truncated)
//      google_auth_qr: 'https://www.google.com/chart?chs=166x166&chld=L|0&cht=qr&chl=otpauth://totp/SecretKey%3Fsecret=KY7TSZRWFZBXCMJGHRED6PDOPBSS4WCK' }
```

## License

This project incorporates code from [passcode][], which was originally a
fork of speakeasy, and [notp][], both of which are licensed under MIT.
Please see the [LICENSE](LICENSE) file for the full combined license.

Icons created by Gregor Črešnar, iconoci, and Danny Sturgess from the Noun
Project.

[passcode]: http://github.com/mikepb/passcode
[notp]: https://github.com/guyht/notp
[oath]: http://www.openauthentication.org/
[rfc4226]: https://tools.ietf.org/html/rfc4226
[rfc6238]: https://tools.ietf.org/html/rfc6238
