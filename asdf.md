## Functions

<dl>
<dt><a href="#digest">digest(options)</a> ⇒ <code>Buffer</code></dt>
<dd><p>Digest the one-time passcode options.</p>
</dd>
<dt><a href="#hotp">hotp(options)</a> ⇒ <code>String</code></dt>
<dd><p>Generate a counter-based one-time token.</p>
</dd>
<dt><a href="#hotp․verifyDelta">hotp․verifyDelta(options)</a> ⇒ <code>Object</code></dt>
<dd><p>Verify a counter-based one-time token against the secret and return the delta.
By default, it verifies the token at the given counter value, with no leeway
(no look-ahead or look-behind). A token validated at the current counter value
will have a delta of 0.</p>
<p>You can specify a window to add more leeway to the verification process.
Setting the window param will check for the token at the given counter value
as well as <code>window</code> tokens ahead (one-sided window). See param for more info.</p>
<p><code>verifyDelta()</code> will return the delta between the counter value of the token
and the given counter value. For example, if given a counter 5 and a window
10, <code>verifyDelta()</code> will look at tokens from 5 to 15, inclusive. If it finds
it at counter position 7, it will return <code>{ delta: 2 }</code>.</p>
</dd>
<dt><a href="#hotp․verify">hotp․verify(options)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Verify a time-based one-time token against the secret and return true if it
verifies. Helper function for `hotp.verifyDelta()`` that returns a boolean
instead of an object. For more on how to use a window with this, see
<a href="hotp.verifyDelta">hotp.verifyDelta</a>.</p>
</dd>
<dt><a href="#totp">totp(options)</a> ⇒ <code>String</code></dt>
<dd><p>Generate a time-based one-time token. By default, it returns the token for
the current time.</p>
</dd>
<dt><a href="#totp․verifyDelta">totp․verifyDelta(options)</a> ⇒ <code>Object</code></dt>
<dd><p>Verify a time-based one-time token against the secret and return the delta.
By default, it verifies the token at the current time window, with no leeway
(no look-ahead or look-behind). A token validated at the current time window
will have a delta of 0.</p>
<p>You can specify a window to add more leeway to the verification process.
Setting the window param will check for the token at the given counter value
as well as <code>window</code> tokens ahead and <code>window</code> tokens behind (two-sided
window). See param for more info.</p>
<p><code>verifyDelta()</code> will return the delta between the counter value of the token
and the given counter value. For example, if given a time at counter 1000 and
a window of 5, <code>verifyDelta()</code> will look at tokens from 995 to 1005,
inclusive. In other words, if the time-step is 30 seconds, it will look at
tokens from 2.5 minutes ago to 2.5 minutes in the future, inclusive.
If it finds it at counter position 1002, it will return <code>{ delta: 2 }</code>.</p>
</dd>
<dt><a href="#totp․verify">totp․verify(options)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Verify a time-based one-time token against the secret and return true if it
verifies. Helper function for verifyDelta() that returns a boolean instead of
an object. For more on how to use a window with this, see
<a href="totp.verifyDelta">totp.verifyDelta</a>.</p>
</dd>
<dt><a href="#generateSecret">generateSecret(options)</a> ⇒ <code>Object</code> | <code><a href="#GeneratedSecret">GeneratedSecret</a></code></dt>
<dd><p>Generates a random secret with the set A-Z a-z 0-9 and symbols, of any length
(default 32). Returns the secret key in ASCII, hexadecimal, and base32 format,
along with the URL used for the QR code for Google Authenticator (an otpauth
URL). Use a QR code library to generate a QR code based on the Google
Authenticator URL to obtain a QR code you can scan into the app.</p>
</dd>
<dt><a href="#generateSecretASCII">generateSecretASCII([length], [symbols])</a> ⇒ <code>String</code></dt>
<dd><p>Generates a key of a certain length (default 32) from A-Z, a-z, 0-9, and
symbols (if requested).</p>
</dd>
<dt><a href="#otpauthURL">otpauthURL(options)</a> ⇒ <code>String</code></dt>
<dd><p>Generate an URL for use with the Google Authenticator app.</p>
<p>Authenticator considers TOTP codes valid for 30 seconds. Additionally,
the app presents 6 digits codes to the user. According to the
documentation, the period and number of digits are currently ignored by
the app.</p>
<p>To generate a suitable QR Code, pass the generated URL to a QR Code
generator, such as the <code>qr-image</code> module.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#GeneratedSecret">GeneratedSecret</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="digest"></a>
## digest(options) ⇒ <code>Buffer</code>
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
| [options.key] | <code>String</code> |  | (DEPRECATED. Use `secret` instead.)   Shared secret key |

<a name="hotp"></a>
## hotp(options) ⇒ <code>String</code>
Generate a counter-based one-time token.

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
| [options.key] | <code>String</code> |  | (DEPRECATED. Use `secret` instead.)   Shared secret key |
| [options.length] | <code>Integer</code> | <code>6</code> | (DEPRECATED. Use `digits` instead.) The   number of digits for the one-time passcode. |

<a name="hotp․verifyDelta"></a>
## hotp․verifyDelta(options) ⇒ <code>Object</code>
Verify a counter-based one-time token against the secret and return the delta.
By default, it verifies the token at the given counter value, with no leeway
(no look-ahead or look-behind). A token validated at the current counter value
will have a delta of 0.

You can specify a window to add more leeway to the verification process.
Setting the window param will check for the token at the given counter value
as well as `window` tokens ahead (one-sided window). See param for more info.

`verifyDelta()` will return the delta between the counter value of the token
and the given counter value. For example, if given a counter 5 and a window
10, `verifyDelta()` will look at tokens from 5 to 15, inclusive. If it finds
it at counter position 7, it will return `{ delta: 2 }`.

**Kind**: global function  
**Returns**: <code>Object</code> - On success, returns an object with the counter
  difference between the client and the server as the `delta` property (i.e.
  `{ delta: 0 }`).  

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
## hotp․verify(options) ⇒ <code>Boolean</code>
Verify a time-based one-time token against the secret and return true if it
verifies. Helper function for `hotp.verifyDelta()`` that returns a boolean
instead of an object. For more on how to use a window with this, see
[hotp.verifyDelta](hotp.verifyDelta).

**Kind**: global function  
**Returns**: <code>Boolean</code> - Returns true if the token matches within the given
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
## totp(options) ⇒ <code>String</code>
Generate a time-based one-time token. By default, it returns the token for
the current time.

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
| [options.key] | <code>String</code> |  | (DEPRECATED. Use `secret` instead.)   Shared secret key |
| [options.initial_time] | <code>Integer</code> | <code>0</code> | (DEPRECATED. Use `epoch` instead.)   Initial time since the UNIX epoch from which to calculate the counter   value. Defaults to 0 (no offset). |
| [options.length] | <code>Integer</code> | <code>6</code> | (DEPRECATED. Use `digits` instead.) The   number of digits for the one-time passcode. |

<a name="totp․verifyDelta"></a>
## totp․verifyDelta(options) ⇒ <code>Object</code>
Verify a time-based one-time token against the secret and return the delta.
By default, it verifies the token at the current time window, with no leeway
(no look-ahead or look-behind). A token validated at the current time window
will have a delta of 0.

You can specify a window to add more leeway to the verification process.
Setting the window param will check for the token at the given counter value
as well as `window` tokens ahead and `window` tokens behind (two-sided
window). See param for more info.

`verifyDelta()` will return the delta between the counter value of the token
and the given counter value. For example, if given a time at counter 1000 and
a window of 5, `verifyDelta()` will look at tokens from 995 to 1005,
inclusive. In other words, if the time-step is 30 seconds, it will look at
tokens from 2.5 minutes ago to 2.5 minutes in the future, inclusive.
If it finds it at counter position 1002, it will return `{ delta: 2 }`.

**Kind**: global function  
**Returns**: <code>Object</code> - On success, returns an object with the time step
  difference between the client and the server as the `delta` property (e.g.
  `{ delta: 0 }`).  

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
## totp․verify(options) ⇒ <code>Boolean</code>
Verify a time-based one-time token against the secret and return true if it
verifies. Helper function for verifyDelta() that returns a boolean instead of
an object. For more on how to use a window with this, see
[totp.verifyDelta](totp.verifyDelta).

**Kind**: global function  
**Returns**: <code>Boolean</code> - Returns true if the token matches within the given
  window, false otherwise.  

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

<a name="generateSecret"></a>
## generateSecret(options) ⇒ <code>Object</code> &#124; <code>[GeneratedSecret](#GeneratedSecret)</code>
Generates a random secret with the set A-Z a-z 0-9 and symbols, of any length
(default 32). Returns the secret key in ASCII, hexadecimal, and base32 format,
along with the URL used for the QR code for Google Authenticator (an otpauth
URL). Use a QR code library to generate a QR code based on the Google
Authenticator URL to obtain a QR code you can scan into the app.

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  |  |
| [options.length] | <code>Integer</code> | <code>32</code> | Length of the secret |
| [options.symbols] | <code>Boolean</code> | <code>false</code> | Whether to include symbols |
| [options.otpauth_url] | <code>Boolean</code> | <code>true</code> | Whether to output a Google   Authenticator-compatible otpauth:// URL (only returns otpauth:// URL, no   QR code) |
| [options.name] | <code>String</code> |  | The name to use with Google Authenticator. |
| [options.qr_codes] | <code>Boolean</code> | <code>false</code> | (DEPRECATED. Do not use to prevent   leaking of secret to a third party. Use your own QR code implementation.)   Output QR code URLs for the token. |
| [options.google_auth_qr] | <code>Boolean</code> | <code>false</code> | (DEPRECATED. Do not use to   prevent leaking of secret to a third party. Use your own QR code   implementation.) Output a Google Authenticator otpauth:// QR code URL. |

<a name="generateSecretASCII"></a>
## generateSecretASCII([length], [symbols]) ⇒ <code>String</code>
Generates a key of a certain length (default 32) from A-Z, a-z, 0-9, and
symbols (if requested).

**Kind**: global function  
**Returns**: <code>String</code> - The generated key.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [length] | <code>Integer</code> | <code>32</code> | The length of the key. |
| [symbols] | <code>Boolean</code> | <code>false</code> | Whether to include symbols in the key. |

<a name="otpauthURL"></a>
## otpauthURL(options) ⇒ <code>String</code>
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
## GeneratedSecret : <code>Object</code>
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
| otpauth_url | <code>String</code> | Google Authenticator-compatible otpauth URL. |

