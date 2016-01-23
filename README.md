<img src="http://i.imgur.com/qRyNMx4.png" width="550">

[![Build Status](https://travis-ci.org/speakeasyjs/speakeasy.svg?branch=v2)](https://travis-ci.org/speakeasyjs/speakeasy)
[![NPM downloads](https://img.shields.io/npm/dt/speakeasy.svg)](https://www.npmjs.com/package/speakeasy)
[![Coverage Status](https://coveralls.io/repos/github/speakeasyjs/speakeasy/badge.svg?branch=v2)](https://coveralls.io/github/speakeasyjs/speakeasy?branch=v2)
[![NPM version](https://img.shields.io/npm/v/speakeasy.svg)](https://www.npmjs.com/package/speakeasy)

---

**Jump to** — [Install](#install) · [Demo](#demo) · [Usage](#usage) · [Documentation](#documentation) · [Contributing](#contributing) · [License](#license)

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
  token: '123456',
  window: 6
});
// Returns true if the token matches
```

#### Verifying a token and calculating a delta

A TOTP is incremented every `step` time-step seconds. By default, the time-step
is 30 seconds. You may change the time-step using the `step` option, with units
in seconds.

```js
// Verify a given token is within 3 time-steps (+/- 2 minutes) from the server
// time-step.
var tokenDelta = speakeasy.totp.verifyDelta({
  secret: base32secret,
  token: '123456',
  window: 2,
  step: 60
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

### Functions

<dl>
<dt><a href="#digest">digest(options)</a> ⇒ <code>Buffer</code></dt>
<dd><p>Digest the one-time passcode options.</p>
</dd>
<dt><a href="#hotp">hotp(options)</a> ⇒ <code>String</code></dt>
<dd><p>Generate a counter-based one-time passcode.</p>
</dd>
<dt><a href="#hotp․verifyDelta">hotp․verifyDelta(options)</a> ⇒ <code>Object</code></dt>
<dd><p>Verify a counter-based One Time passcode and return the delta.</p>
</dd>
<dt><a href="#hotp․verify">hotp․verify(options)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Verify a counter-based One Time passcode.</p>
</dd>
<dt><a href="#totp">totp(options)</a> ⇒ <code>String</code></dt>
<dd><p>Generate a time-based one-time passcode.</p>
</dd>
<dt><a href="#totp․verifyDelta">totp․verifyDelta(options)</a> ⇒ <code>Object</code></dt>
<dd><p>Verify a time-based One Time passcode and return the delta.</p>
</dd>
<dt><a href="#totp․verify">totp․verify(options)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Verify a time-based One Time passcode via strict comparison (i.e.
delta = 0).</p>
</dd>
<dt><a href="#generate_key">generate_key(options)</a> ⇒ <code>Object</code> | <code><a href="#GeneratedSecret">GeneratedSecret</a></code></dt>
<dd><p>Generates a random secret with the set A-Z a-z 0-9 and symbols, of any length
(default 32). Returns the secret key in ASCII, hexadecimal, and base32 format.</p>
</dd>
<dt><a href="#generate_key_ascii">generate_key_ascii([length], [symbols])</a> ⇒ <code>String</code></dt>
<dd><p>Generates a key of a certain length (default 32) from A-Z, a-z, 0-9, and
symbols (if requested).</p>
</dd>
<dt><a href="#google_auth_url">google_auth_url(options)</a> ⇒ <code>String</code></dt>
<dd><p>Generate an URL for use with the Google Authenticator app.</p>
<p>Authenticator considers TOTP codes valid for 30 seconds. Additionally,
the app presents 6 digits codes to the user. According to the
documentation, the period and number of digits are currently ignored by
the app.</p>
<p>To generate a suitable QR Code, pass the generated URL to a QR Code
generator, such as the <code>qr-image</code> module.</p>
</dd>
</dl>

### Typedefs

<dl>
<dt><a href="#GeneratedSecret">GeneratedSecret</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="digest"></a>
### digest(options) ⇒ <code>Buffer</code>
Digest the one-time passcode options.

**Kind**: global function  

**Returns**: <code>Buffer</code> - The one-time passcode as a buffer.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  |  |
| options.secret | <code>String</code> |  | Shared secret key |
| options.counter | <code>Integer</code> |  | Counter value |
| [options.encoding] | <code>String</code> | <code>&quot;ascii&quot;</code> | Key encoding (ascii, hex,   base32, base64). |
| [options.algorithm] | <code>String</code> | <code>&quot;sha1&quot;</code> | Hash algorithm (sha1, sha256,   sha512). |
| options.key | <code>String</code> |  | (DEPRECATED. Use `secret` instead.)   Shared secret key |

<a name="hotp"></a>
### hotp(options) ⇒ <code>String</code>
Generate a counter-based one-time passcode.

**Kind**: global function  

**Returns**: <code>String</code> - The one-time passcode.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  |  |
| options.secret | <code>String</code> |  | Shared secret key |
| options.counter | <code>Integer</code> |  | Counter value |
| [options.digest] | <code>Buffer</code> |  | Digest, automatically generated by default |
| [options.digits] | <code>Integer</code> | <code>6</code> | The number of digits for the one-time   passcode. |
| [options.encoding] | <code>String</code> | <code>&quot;ascii&quot;</code> | Key encoding (ascii, hex,   base32, base64). |
| [options.algorithm] | <code>String</code> | <code>&quot;sha1&quot;</code> | Hash algorithm (sha1, sha256,   sha512). |
| options.key | <code>String</code> |  | (DEPRECATED. Use `secret` instead.)   Shared secret key |
| [options.length] | <code>Integer</code> | <code>6</code> | (DEPRECATED. Use `digits` instead.) The   number of digits for the one-time passcode. |

<a name="hotp․verifyDelta"></a>
### hotp․verifyDelta(options) ⇒ <code>Object</code>
Verify a counter-based One Time passcode and return the delta.

**Kind**: global function  

**Returns**: <code>Object</code> - On success, returns an object with the counter
  difference between the client and the server as the `delta` property.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  |  |
| options.secret | <code>String</code> |  | Shared secret key |
| options.token | <code>String</code> |  | Passcode to validate |
| options.counter | <code>Integer</code> |  | Counter value. This should be stored by   the application and must be incremented for each request. |
| [options.digits] | <code>Integer</code> | <code>6</code> | The number of digits for the one-time   passcode. |
| [options.window] | <code>Integer</code> | <code>0</code> | The allowable margin for the counter.   The function will check "W" codes in the future against the provided   passcode, e.g. if W = 10, and C = 5, this function will check the   passcode against all One Time Passcodes between 5 and 15, inclusive. |
| [options.encoding] | <code>String</code> | <code>&quot;ascii&quot;</code> | Key encoding (ascii, hex,   base32, base64). |
| [options.algorithm] | <code>String</code> | <code>&quot;sha1&quot;</code> | Hash algorithm (sha1, sha256,   sha512). |

<a name="hotp․verify"></a>
### hotp․verify(options) ⇒ <code>Boolean</code>
Verify a counter-based One Time passcode.

**Kind**: global function  

**Returns**: <code>Boolean</code> - Returns true if the token matches within the configured
  window, false otherwise.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  |  |
| options.secret | <code>String</code> |  | Shared secret key |
| options.token | <code>String</code> |  | Passcode to validate |
| options.counter | <code>Integer</code> |  | Counter value. This should be stored by   the application and must be incremented for each request. |
| [options.digits] | <code>Integer</code> | <code>6</code> | The number of digits for the one-time   passcode. |
| [options.window] | <code>Integer</code> | <code>0</code> | The allowable margin for the counter.   The function will check "W" codes in the future against the provided   passcode, e.g. if W = 10, and C = 5, this function will check the   passcode against all One Time Passcodes between 5 and 15, inclusive. |
| [options.encoding] | <code>String</code> | <code>&quot;ascii&quot;</code> | Key encoding (ascii, hex,   base32, base64). |
| [options.algorithm] | <code>String</code> | <code>&quot;sha1&quot;</code> | Hash algorithm (sha1, sha256,   sha512). |

<a name="totp"></a>
### totp(options) ⇒ <code>String</code>
Generate a time-based one-time passcode.

**Kind**: global function  

**Returns**: <code>String</code> - The one-time passcode.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  |  |
| options.secret | <code>String</code> |  | Shared secret key |
| [options.time] | <code>Integer</code> |  | Time with which to calculate counter value.   Defaults to `Date.now()`. |
| [options.step] | <code>Integer</code> | <code>30</code> | Time step in seconds |
| [options.epoch] | <code>Integer</code> | <code>0</code> | Initial time since the UNIX epoch from   which to calculate the counter value. Defaults to 0 (no offset). |
| [options.counter] | <code>Integer</code> |  | Counter value, calculated by default. |
| [options.digits] | <code>Integer</code> | <code>6</code> | The number of digits for the one-time   passcode. |
| [options.encoding] | <code>String</code> | <code>&quot;ascii&quot;</code> | Key encoding (ascii, hex,   base32, base64). |
| [options.algorithm] | <code>String</code> | <code>&quot;sha1&quot;</code> | Hash algorithm (sha1, sha256,   sha512). |
| options.key | <code>String</code> |  | (DEPRECATED. Use `secret` instead.)   Shared secret key |
| [options.initial_time] | <code>Integer</code> | <code>0</code> | (DEPRECATED. Use `epoch` instead.)   Initial time since the UNIX epoch from which to calculate the counter   value. Defaults to 0 (no offset). |
| [options.length] | <code>Integer</code> | <code>6</code> | (DEPRECATED. Use `digits` instead.) The   number of digits for the one-time passcode. |

<a name="totp․verifyDelta"></a>
### totp․verifyDelta(options) ⇒ <code>Object</code>
Verify a time-based One Time passcode and return the delta.

**Kind**: global function  

**Returns**: <code>Object</code> - On success, returns an object with the time step
  difference between the client and the server as the `delta` property.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  |  |
| options.secret | <code>String</code> |  | Shared secret key |
| options.token | <code>String</code> |  | Passcode to validate |
| [options.time] | <code>Integer</code> |  | Time with which to calculate counter value.   Defaults to `Date.now()`. |
| [options.step] | <code>Integer</code> | <code>30</code> | Time step in seconds |
| [options.epoch] | <code>Integer</code> | <code>0</code> | Initial time since the UNIX epoch from   which to calculate the counter value. Defaults to 0 (no offset). |
| [options.counter] | <code>Integer</code> |  | Counter value, calculated by default. |
| [options.digits] | <code>Integer</code> | <code>6</code> | The number of digits for the one-time   passcode. |
| [options.window] | <code>Integer</code> | <code>0</code> | The allowable margin for the counter.   The function will check "W" codes in the future and the past against the   provided passcode, e.g. if W = 5, and C = 1000, this function will check   the passcode against all One Time Passcodes between 995 and 1005,   inclusive. |
| [options.encoding] | <code>String</code> | <code>&quot;ascii&quot;</code> | Key encoding (ascii, hex,   base32, base64). |
| [options.algorithm] | <code>String</code> | <code>&quot;sha1&quot;</code> | Hash algorithm (sha1, sha256,   sha512). |

<a name="totp․verify"></a>
### totp․verify(options) ⇒ <code>Boolean</code>
Verify a time-based One Time passcode via strict comparison (i.e.
delta = 0).

**Kind**: global function  

**Returns**: <code>Boolean</code> - Returns true if token strictly matches (delta = 0),
  false otherwise.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  |  |
| options.secret | <code>String</code> |  | Shared secret key |
| options.token | <code>String</code> |  | Passcode to validate |
| [options.time] | <code>Integer</code> |  | Time with which to calculate counter value.   Defaults to `Date.now()`. |
| [options.step] | <code>Integer</code> | <code>30</code> | Time step in seconds |
| [options.epoch] | <code>Integer</code> | <code>0</code> | Initial time since the UNIX epoch from   which to calculate the counter value. Defaults to 0 (no offset). |
| [options.counter] | <code>Integer</code> |  | Counter value, calculated by default. |
| [options.digits] | <code>Integer</code> | <code>6</code> | The number of digits for the one-time   passcode. |
| [options.window] | <code>Integer</code> | <code>0</code> | The allowable margin for the counter.   The function will check "W" codes in the future and the past against the   provided passcode, e.g. if W = 5, and C = 1000, this function will check   the passcode against all One Time Passcodes between 995 and 1005,   inclusive. |
| [options.encoding] | <code>String</code> | <code>&quot;ascii&quot;</code> | Key encoding (ascii, hex,   base32, base64). |
| [options.algorithm] | <code>String</code> | <code>&quot;sha1&quot;</code> | Hash algorithm (sha1, sha256,   sha512). |

<a name="generate_key"></a>
### generate_key(options) ⇒ <code>Object</code> &#124; <code>[GeneratedSecret](#GeneratedSecret)</code>
Generates a random secret with the set A-Z a-z 0-9 and symbols, of any length
(default 32). Returns the secret key in ASCII, hexadecimal, and base32 format.

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  |  |
| [options.length] | <code>Integer</code> | <code>32</code> | Length of the secret |
| [options.symbols] | <code>Boolean</code> | <code>false</code> | Whether to include symbols |
| [options.qr_codes] | <code>Boolean</code> | <code>false</code> | Whether to output QR code URLs |
| [options.google_auth_qr] | <code>Boolean</code> | <code>false</code> | Whether to output a Google   Authenticator otpauth:// QR code URL (returns the URL to the QR code) |
| [options.google_auth_url] | <code>Boolean</code> | <code>true</code> | Whether to output a Google   Authenticator otpauth:// URL (only returns otpauth:// URL, no QR code) |
| [options.name] | <code>String</code> |  | The name to use with Google Authenticator. |

<a name="generate_key_ascii"></a>
### generate_key_ascii([length], [symbols]) ⇒ <code>String</code>
Generates a key of a certain length (default 32) from A-Z, a-z, 0-9, and
symbols (if requested).

**Kind**: global function  

**Returns**: <code>String</code> - The generated key.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [length] | <code>Integer</code> | <code>32</code> | The length of the key. |
| [symbols] | <code>Boolean</code> | <code>false</code> | Whether to include symbols in the key. |

<a name="google_auth_url"></a>
### google_auth_url(options) ⇒ <code>String</code>
Generate an URL for use with the Google Authenticator app.

Authenticator considers TOTP codes valid for 30 seconds. Additionally,
the app presents 6 digits codes to the user. According to the
documentation, the period and number of digits are currently ignored by
the app.

To generate a suitable QR Code, pass the generated URL to a QR Code
generator, such as the `qr-image` module.

**Kind**: global function  

**Returns**: <code>String</code> - A URL suitable for use with the Google Authenticator.  

**See**: https://github.com/google/google-authenticator/wiki/Key-Uri-Format  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  |  |
| options.secret | <code>String</code> |  | Shared secret key |
| options.label | <code>String</code> |  | Used to identify the account with which   the secret key is associated, e.g. the user's email address. |
| [options.type] | <code>String</code> | <code>&quot;totp&quot;</code> | Either "hotp" or "totp". |
| [options.counter] | <code>Integer</code> |  | The initial counter value, required   for HOTP. |
| [options.issuer] | <code>String</code> |  | The provider or service with which the   secret key is associated. |
| [options.algorithm] | <code>String</code> | <code>&quot;sha1&quot;</code> | Hash algorithm (sha1, sha256,   sha512). |
| [options.digits] | <code>Integer</code> | <code>6</code> | The number of digits for the one-time   passcode. Currently ignored by Google Authenticator. |
| [options.period] | <code>Integer</code> | <code>30</code> | The length of time for which a TOTP   code will be valid, in seconds. Currently ignored by Google   Authenticator. |
| [options.encoding] | <code>String</code> |  | Key encoding (ascii, hex, base32,   base64). If the key is not encoded in Base-32, it will be reencoded. |

<a name="GeneratedSecret"></a>
### GeneratedSecret : <code>Object</code>

**Kind**: global typedef  

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| ascii | <code>String</code> | ASCII representation of the secret |
| hex | <code>String</code> | Hex representation of the secret |
| base32 | <code>String</code> | Base32 representation of the secret |
| qr_code_ascii | <code>String</code> | URL for the QR code for the ASCII secret. |
| qr_code_hex | <code>String</code> | URL for the QR code for the hex secret. |
| qr_code_base32 | <code>String</code> | URL for the QR code for the base32 secret. |
| google_auth_qr | <code>String</code> | URL for the Google Authenticator otpauth   URL's QR code. |

<a name="contributing"></a>
## Contributing

We're very happy to have your contributions in Speakeasy.

**Contributing code** — First, make sure you've added tests if adding new functionality. Then, run `npm test` to run all the tests to make sure they pass. Next, make a pull request to this repo. Thanks!

**Filing an issue** — Submit issues to the [GitHub Issues][issues] page.

**Maintainers** —

- Mark Bao ([markbao][markbao])
- Michael Phan-Ba ([mikepb][mikepb])

## License

This project incorporates code from [passcode][], which was originally a
fork of speakeasy, and [notp][], both of which are licensed under MIT.
Please see the [LICENSE](LICENSE) file for the full combined license.

Icons created by Gregor Črešnar, iconoci, and Danny Sturgess from the Noun
Project.

[issues]: https://github.com/speakeasyjs/speakeasy
[passcode]: http://github.com/mikepb/passcode
[notp]: https://github.com/guyht/notp
[oath]: http://www.openauthentication.org/
[rfc4226]: https://tools.ietf.org/html/rfc4226
[rfc6238]: https://tools.ietf.org/html/rfc6238
[markbao]: https://github.com/markbao
[mikepb]: https://github.com/mikepb