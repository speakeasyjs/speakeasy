# Passcode

Passcode implements one-time passcode generators as standardized by the
[Initiative for Open Authentication (OATH)][oath]. The HMAC-Based One-time
Password (HOTP) algorithm defined by [RFC 4226][rfc4226] and the Time-based 
One-time Password (TOTP) algorithm defined in [RFC 6238][rfc6238] are
supported.

Passcode is a heavily modified version of [speakeasy][] incorporating the
verification functions of [notp][].

## Install

```sh
npm install --save passcode
```

## Usage

```js
var passcode = require("passcode");
var token = passcode.hotp({
  secret: "xyzzy",
  counter: 123
});
// token = "378764"

var ok = passcode.hotp.verify({
  secret: "xyzzy",
  token: token,
  counter: 123
});
// ok = {delta: 0}
```

## Documentation

Full documentation at http://mikepb.github.io/passcode/

## License

This project incorporates code from [speakeasy][] and [notp][], both of which
are licensed under MIT. Please see the [LICENSE](LICENSE) file for the full
combined license.


[speakeasy]: http://github.com/markbao/speakeasy
[notp]: https://github.com/guyht/notp
[oath]: http://www.openauthentication.org/
[rfc4226]: https://tools.ietf.org/html/rfc4226
[rfc6238]: https://tools.ietf.org/html/rfc6238
