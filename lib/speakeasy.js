// # speakeasy
// ### HMAC One-Time Password module for Node.js, supporting counter-based and time-based moving factors
// 
// speakeasy makes it easy to implement HMAC one-time passwords, supporting both counter-based (HOTP)
// and time-based moving factors (TOTP). It's useful for implementing two-factor authentication.
// Google and Amazon use TOTP to generate codes for use with multi-factor authentication.
//
// speakeasy also supports base32 keys/secrets, by passing `base32` in the `encoding` option.
// This is useful since Google Authenticator, Google's two-factor authentication mobile app
// available for iPhone, Android, and BlackBerry, uses base32 keys.
//
// This module was written to follow the RFC memos on HTOP and TOTP:
//
// * HOTP (HMAC-Based One-Time Password Algorithm): [RFC 4226](http://tools.ietf.org/html/rfc4226)
// * TOTP (Time-Based One-Time Password Algorithm): [RFC 6238](http://tools.ietf.org/html/rfc6238)
//
// One other useful function that this module has is a key generator, which allows you to
// generate keys, get them back in their ASCII, hexadecimal, and base32 representations.
// In addition, it also can automatically generate QR codes for you, as well as the specialized
// QR code you can use to scan in the Google Authenticator mobile app.
//
// An overarching goal of this module, other than to make it very easy to implement the
// HOTP and TOTP algorithms, is to be extensively documented. Indeed, it is well-documented,
// with clear functions and parameter explanations.

var crypto = require('crypto'),
    ezcrypto = require('ezcrypto').Crypto,
    base32 = require('thirty-two');

var speakeasy = {}

// speakeasy.hotp(options)
//
// Calculates the one-time password given the key and a counter.
//
// options.key                  the key
//        .counter              moving factor
//        .length(=6)           length of the one-time password (default 6)
//        .encoding(='ascii')   key encoding (ascii, hex, or base32)
//
speakeasy.hotp = function(options) {
  // set vars
  var key = options.key;
  var counter = options.counter;
  var length = options.length || 6;
  var encoding = options.encoding || 'ascii';

  // preprocessing: convert to ascii if it's not
  if (encoding == 'hex') {
    key = speakeasy.hex_to_ascii(key);
  } else if (encoding == 'base32') {
    key = base32.decode(key);
  }

  // init hmac with the key
  var hmac = crypto.createHmac('sha1', new Buffer(key));
  
  // create an octet array from the counter
  var octet_array = new Array(8);

  var counter_temp = counter;

  for (var i = 0; i < 8; i++) {
    var i_from_right = 7 - i;

    // mask 255 over number to get last 8
    octet_array[i_from_right] = counter_temp & 255;

    // shift 8 and get ready to loop over the next batch of 8
    counter_temp = counter_temp >> 8;
  }

  // create a buffer from the octet array
  var counter_buffer = new Buffer(octet_array);

  // update hmac with the counter
  hmac.update(counter_buffer);

  // get the digest in hex format
  var digest = hmac.digest('hex');

  // convert the result to an array of bytes
  var digest_bytes = ezcrypto.util.hexToBytes(digest);

  // compute HOTP
  // get offset
  var offset = digest_bytes[19] & 0xf;
  
  // calculate bin_code (RFC4226 5.4)
  var bin_code = (digest_bytes[offset] & 0x7f)   << 24
                |(digest_bytes[offset+1] & 0xff) << 16
                |(digest_bytes[offset+2] & 0xff) << 8
                |(digest_bytes[offset+3] & 0xff);

  bin_code = bin_code.toString();

  // get the chars at position bin_code - length through length chars
  var sub_start = bin_code.length - length;
  var code = bin_code.substr(sub_start, length);
  
  // we now have a code with `length` number of digits, so return it
  return(code);
}

// speakeasy.totp(options)
//
// Calculates the one-time password given the key, based on the current time
// with a 30 second step (step being the number of seconds between passwords).
//
// options.key                  the key
//        .length(=6)           length of the one-time password (default 6)
//        .encoding(='ascii')   key encoding (ascii, hex, or base32)
//        .step(=30)            override the step in seconds
//        .time                 (optional) override the time to calculate with
//        .initial_time         (optional) override the initial time
//        
speakeasy.totp = function(options) {
  // set vars
  var key = options.key;
  var length = options.length || 6;
  var encoding = options.encoding || 'ascii';
  var step = options.step || 30;
  var initial_time = options.initial_time || 0; // unix epoch by default
  
  // get current time in seconds since unix epoch
  var time = parseInt(Date.now()/1000);
  
  // are we forcing a specific time?
  if (options.time) {
    // override the time
    time = options.time;
  }

  // calculate counter value
  var counter = Math.floor((time - initial_time)/ step);
  
  // pass to hotp
  var code = this.hotp({key: key, length: length, encoding: encoding, counter: counter});

  // return the code
  return(code);
}

// speakeasy.hex_to_ascii(key)
//
// helper function to convert a hex key to ascii.
//
speakeasy.hex_to_ascii = function(str) {
  // key is a string of hex
  // convert it to an array of bytes...
  var bytes = ezcrypto.util.hexToBytes(str);

  // bytes is now an array of bytes with character codes
  // merge this down into a string
  var ascii_string = new String();

  for (var i = 0; i < bytes.length; i++) {
    ascii_string += String.fromCharCode(bytes[i]);
  }

  return ascii_string;
}

// speakeasy.ascii_to_hex(key)
//
// helper function to convert an ascii key to hex.
//
speakeasy.ascii_to_hex = function(str) {
  var hex_string = '';
  
  for (var i = 0; i < str.length; i++) {
    hex_string += str.charCodeAt(i).toString(16);
  }

  return hex_string;
}

// speakeasy.generate_key(options)
//
// Generates a random key with the set A-Z a-z 0-9 and symbols, of any length
// (default 32). Returns the key in ASCII, hexadecimal, and base32 format.
// Base32 format is used in Google Authenticator. Turn off symbols by setting
// symbols: false. Automatically generate links to QR codes of each encoding
// (using the Google Charts API) by setting qr_codes: true. Automatically
// generate a link to a special QR code for use with the Google Authenticator
// app, for which you can also specify a name.
//
// options.length(=32)              length of key
//        .symbols(=true)           include symbols in the key
//        .qr_codes(=false)         generate links to QR codes
//        .google_auth_qr(=false)   generate a link to a QR code to scan
//                                  with the Google Authenticator app.
//        .name                     (optional) add a name. no spaces.
//                                  for use with Google Authenticator
//
speakeasy.generate_key = function(options) {
  // options
  var length = options.length || 32;
  var name = options.name || "Secret Key";
  var qr_codes = options.qr_codes || false;
  var google_auth_qr = options.google_auth_qr || false;
  var symbols = true;

  // turn off symbols only when explicity told to
  if (options.symbols !== undefined && options.symbols === false) {
    symbols = false;
  }

  // generate an ascii key
  var key = this.generate_key_ascii(length, symbols);
  
  // return a SecretKey with ascii, hex, and base32
  var SecretKey = {};
  SecretKey.ascii = key;
  SecretKey.hex = this.ascii_to_hex(key);
  SecretKey.base32 = base32.encode(key).replace(/=/g,'');
  
  // generate some qr codes if requested
  if (qr_codes) {
    SecretKey.qr_code_ascii = 'https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=' + encodeURIComponent(SecretKey.ascii);
    SecretKey.qr_code_hex = 'https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=' + encodeURIComponent(SecretKey.hex);
    SecretKey.qr_code_base32 = 'https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=' + encodeURIComponent(SecretKey.base32);
  }
  
  // generate a QR code for use in Google Authenticator if requested
  // (Google Authenticator has a special style and requires base32)
  if (google_auth_qr) {
    // first, make sure that the name doesn't have spaces, since Google Authenticator doesn't like them
    name = name.replace(/ /g,'');
    SecretKey.google_auth_qr = 'https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=otpauth://totp/' + encodeURIComponent(name) + '%3Fsecret=' + encodeURIComponent(SecretKey.base32);
  }

  return SecretKey;
}

// speakeasy.generate_key_ascii(length, symbols)
//
// Generates a random key, of length `length` (default 32).
// Also choose whether you want symbols, default false.
// speakeasy.generate_key() wraps around this.
//
speakeasy.generate_key_ascii = function(length, symbols) {
  if (!length) length = 32;

  var set = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';

  if (symbols) {
    set += '!@#$%^&*()<>?/[]{},.:;';
  }
  
  var key = '';

  for(var i=0; i < length; i++) {
    key += set.charAt(Math.floor(Math.random() * set.length));
  }
  
  return key;
}

// alias, not the TV show
speakeasy.counter = speakeasy.hotp;
speakeasy.time = speakeasy.totp;

module.exports = speakeasy;
