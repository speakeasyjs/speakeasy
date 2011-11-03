# speakeasy

HMAC One-Time Password module for Node.js, supporting counter-based and time-based moving factors (HOTP and TOTP)

## An Introduction

speakeasy makes it easy to implement HMAC one-time passwords, supporting both counter-based (HOTP) and time-based moving factors (TOTP). It's useful for implementing two-factor authentication. Google and Amazon use TOTP to generate codes for use with multi-factor authentication.

It supports the counter-based and time-based algorithms, as well as keys encoded in ASCII, hexadecimal, and base32. It also has a random key generator which can also generate QR code links.

This module was written to follow the RFC memos on HTOP and TOTP:

* HOTP (HMAC-Based One-Time Password Algorithm): [RFC 4226](http:tools.ietf.org/html/rfc4226)
* TOTP (Time-Based One-Time Password Algorithm): [RFC 6238](http:tools.ietf.org/html/rfc6238)

speakeasy's key generator allows you to generate keys, and get them back in their ASCII, hexadecimal, and base32 representations. In addition, it also can automatically generate QR codes for you.

A useful integration is that it fully supports the popular Google Authenticator app, the popular virtual multi-factor authentication app available for iPhone and iOS, Android, and BlackBerry. This module's key generator can also generate a link to the specialized QR code you can use to scan in the Google Authenticator mobile app.

An overarching goal of this module, other than to make it very easy to implement the HOTP and TOTP algorithms, is to be extensively documented. Indeed, it is well-documented, with clear functions and parameter explanations.

## Examples

```javascript
var speakeasy = require('speakeasy');

// use the time-based algorithm, TOTP.
speakeasy.totp({key: 'password'});
// => 149238

// specify a length and encoding (ascii, hex, or base32).
speakeasy.totp({key: 'OBQXG43XN5ZGI', encoding: 'base32', length: 8});
// => 33318854

// use the counter-based algorithm, HOTP.
speakeasy.hotp({key: 'password', counter: 582});
// => 139245

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
