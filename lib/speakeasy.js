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

var crypto = require('crypto'),
    ezcrypto = require('ezcrypto').Crypto,
    base32 = require('base32');

speakeasy = {}

// speakeasy.hotp(options)
// calculates the one-time password given the key and a counter
// options.key                  the key
//        .counter              moving factor
//        .length(=6)           moving 
//        .encoding(='ascii')   key encoding (ascii, hex, or base32)
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
    
  }

  // init hmac with the key
  var hmac = crypto.createHmac('sha1', new Buffer(key));
  
  // create an octet array from the counter
  var octet_array = new Array(8);

  var counter_temp = counter;

  for (i = 0; i < 8; i++) {
    i_from_right = 7 - i;

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

  console.log(digest);

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

// speakeasy.hex_to_ascii(key)
// helper function to convert a hex key to ascii.
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

module.exports = speakeasy;
