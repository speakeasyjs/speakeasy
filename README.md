<img src="http://i.imgur.com/qRyNMx4.png" width="550">

[![Build Status](https://travis-ci.org/speakeasyjs/speakeasy.svg?branch=v2)](https://travis-ci.org/speakeasyjs/speakeasy)
[![NPM downloads](https://img.shields.io/npm/dt/speakeasy.svg)](https://www.npmjs.com/package/speakeasy)
[![NPM version](https://img.shields.io/npm/v/speakeasy.svg)](https://www.npmjs.com/package/speakeasy)

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

## Install

```sh
npm install --save speakeasy
```

## Demo

This demo uses the `generate_key` method of Speakeasy to generate a secret key,
displays a Google Authenticator–compatible QR code which you can scan into your
phone's two-factor app, and shows the token, which you can verify with your
phone. Includes sample code.

<a href="https://sedemo-mktb.rhcloud.com/"><img src="http://i.imgur.com/HN11GTW.png" width="191"></a>

## Usage

```js
var speakeasy = require("speakeasy");
var token = speakeasy.hotp({
  secret: "xyzzy",
  counter: 123
});
// token = "378764"

var ok = speakeasy.hotp.verify({
  secret: "xyzzy",
  token: token,
  counter: 123
});
// ok = {delta: 0}
```

## Documentation

Full documentation at http://speakeasyjs.github.io/speakeasy/

## License

This project incorporates code from [passcode][], which was originally a
fork of speakeasy, and [notp][], both of which are licensed under MIT.
Please see the [LICENSE](LICENSE) file for the full combined license.

Icon created by Gregor Črešnar from the Noun Project.

[passcode]: http://github.com/mikepb/passcode
[notp]: https://github.com/guyht/notp
[oath]: http://www.openauthentication.org/
[rfc4226]: https://tools.ietf.org/html/rfc4226
[rfc6238]: https://tools.ietf.org/html/rfc6238
