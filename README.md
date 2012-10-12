# speakeasy

## Easy two-factor authentication for node.js. Calculate time-based or counter-based one-time passwords. Supports the Google Authenticator mobile app.

Uses the HMAC One-Time Password algorithms, supporting counter-based and time-based moving factors (HOTP and TOTP).

## An Introduction

speakeasy makes it easy to implement HMAC one-time passwords (for example, for use in two-factor authentication), supporting both counter-based (HOTP) and time-based moving factors (TOTP). It's useful for implementing two-factor authentication. Google and Amazon use TOTP to generate codes for use with multi-factor authentication.

It supports the counter-based and time-based algorithms, as well as keys encoded in ASCII, hexadecimal, and base32. It also has a random key generator which can also generate QR code links.

This module was written to follow the RFC memos on HOTP and TOTP:

* HOTP (HMAC-Based One-Time Password Algorithm): [RFC 4226](http:tools.ietf.org/html/rfc4226)
* TOTP (Time-Based One-Time Password Algorithm): [RFC 6238](http:tools.ietf.org/html/rfc6238)

speakeasy's key generator allows you to generate keys, and get them back in their ASCII, hexadecimal, and base32 representations. In addition, it also can automatically generate QR codes for you.

A useful integration is that it fully supports the popular Google Authenticator app, the virtual multi-factor authentication app available for iPhone and iOS, Android, and BlackBerry. This module's key generator can also generate a link to the specialized QR code you can use to scan in the Google Authenticator mobile app.

An overarching goal of this module, other than to make it very easy to implement the HOTP and TOTP algorithms, is to be extensively documented. Indeed, it is well-documented, with clear functions and parameter explanations.

## Install

```
npm install speakeasy
```

## Example (with Google Authenticator)

```javascript
// generate a key and get a QR code you can scan with the Google Authenticator app
speakeasy.generate_key({length: 20, google_auth_qr: true});
// => { ascii: 'V?9f6.Cq1&<H?<nxe.XJ',
//      base32: 'KY7TSZRWFZBXCMJGHRED6PDOPBSS4WCK', ... (truncated) 
//      google_auth_qr: 'https://www.google.com/chart?chs=166x166&chld=L|0&cht=qr&chl=otpauth://totp/SecretKey%3Fsecret=KY7TSZRWFZBXCMJGHRED6PDOPBSS4WCK' }
```

You'll get this QR code. If you don't already have it, get [Google Authenticator](http://www.google.com/support/accounts/bin/answer.py?answer=1066447).

![](http://i.imgur.com/INZnk.png)

```
// specify a length and encoding (ascii, hex, or base32).
speakeasy.time({key: 'KY7TSZRWFZBXCMJGHRED6PDOPBSS4WCK', encoding: 'base32'}); // see the base32 result above
// => try this in your REPL and it should match the number on your phone
```

## Manual

### speakeasy.hotp(options) | speakeasy.counter(options)

Calculate the one-time password using the counter-based algorithm, HOTP. Specify the key and counter, and receive the one-time password for that counter position. You can also specify a password length, as well as the encoding (ASCII, hexadecimal, or base32) for convenience. Returns the one-time password as a string.

Written to follow [RFC 4226](http://tools.ietf.org/html/rfc4226). Calculated with: `HOTP(K,C) = Truncate(HMAC-SHA-1(K,C))`

#### Options

* `key`: the secret key in ASCII, hexadecimal, or base32 format. `K` in the algorithm.
* `counter`: the counter position (moving factor). `C` in the algorithm.
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

* `key`: the secret key in ASCII, hexadecimal, or base32 format. `K` in the algorithm.
* `step` (default `30`): the time step, in seconds, between new passwords (moving factor). `X` in the algorithm.
* `time` (default current time): the time to calculate the TOTP from, by default the current time. If you're doing something clever with TOTP, you may override this (see *Techniques* below). `T` in the algorithm.
* `initial_time` (default `0`): the starting time where we calculate the TOTP from. Usually, this is set to the UNIX epoch at 0. `T0` in the algorithm.
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

## Running the tests

You'll need to have `vows` installed. If you don't have vows, `npm install -g vows`

To run the tests, run this in the module root directory: `vows --spec test/*`

## Issues and patches

If you're having an issue, I'm quite sorry that you came across it. Please submit issues to the [GitHub Issues page](https://github.com/markbao/speakeasy/issues).

To submit a patch, please first make sure the tests pass, and then make a pull request detailing your changes. Thank you!
