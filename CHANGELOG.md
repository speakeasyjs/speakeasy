# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/) and the [Keep a Changelog template](https://github.com/olivierlacan/keep-a-changelog/blob/master/CHANGELOG.md).

## [2.0.0] - 2016-01-27

Speakeasy 2.0.0 is a major update based on a Speakeasy fork, [Passcode](https://github.com/mikepb/passcode), by [Michael Phan-Ba](https://github.com/mikepb), which also incorporates code from another Node.js HOTP/TOTP module, [notp](https://github.com/guyht/notp), by [Guy Halford-Thompson](https://github.com/guyht), with additional functionality and API compatibility changes made by [Mark Bao](https://github.com/markbao). Speakeasy is now also moving to its own GitHub organization.

Speakeasy 2.0.0 is API-compatible with Speakeasy 1.x.x, but a number of functions are renamed and deprecated for consistency. See below. Future versions of Speakeasy 2.x.x may not be API-compatible with Speakeasy 1.x.x. Deprecation notices have been added.

### Added

- Added support for SHA256 and SHA512 hashing algorithms, and general support for other hashing algorithms. Thanks, JHTWebAdmin.
- Added `verify` functions from notp, adding verification window functionality which allows for the verification of tokens across a window (e.g. in HOTP, x tokens ahead, or in TOTP, x tokens ahead or behind).
- Added `verifyDelta` functions which calculate a delta between a given token and where it was found within the window.
- Added `verify` functions which wrap `verifyDelta` to return a boolean.
- Added tests for key generator.
- Added many more tests from Passcode and notp. All the above thanks to work from mikepb, guyht, and markbao.
- Added `issuer`, `counter`, and `type` to Google Authenticator otpauth:// URL. Thanks, Vincent Lombard.
- Added the output of a Google Authenticator–compatible otpauth:// URL to the key generator.
- Added a new function, `otpuathURL()`, to output an otpauth:// URL.
- Added a new demo and a guide for how to use Speakeasy to implement two-factor authentication.
- Added code coverage testing with Istanbul.
- Now conforms to JavaScript Semistandard code style.

### API Changes

v2.0.0 does not introduce any breaking changes, but deprecates a number of functions and parameters. Backwards compatibility is maintained for v2.0.0 but may not be maintained for future versions. While we highly recommend updating to 2.x.x, please make sure to update your `package.json` to use Speakeasy at versions `^1.0.5` if you'd like to use the 1.x.x API.

- `generate_key()` is now `generateSecret()`. `generate_key()` deprecated.
- `generate_key_ascii()` is now `generateSecretASCII()`. `generate_key_ascii()` deprecated.
- `totp()` and `hotp()` now take the `key` parameter as `secret` (`key` deprecated).
- `totp()` and `hotp()` now take the `length` parameter as `digits` (`length` deprecated).
- `totp()` now takes the `initial_time` parameter as `epoch` (`initial_time` deprecated).
- `generateSecret()` no longer supports returning URLs to QR codes using `qr_codes` and `google_auth_qr` since passing the secret to a third party may be a security risk. Implement QR code generation on your own instead, such as by using a QR module like `qr-image` or `node-qrcode`.

### Changed

- Now uses native Node.js buffers for converting encodings.
- Now uses `base32.js` Node package for base32 conversions.
- Moved location of main file to `index.js`.
- Moved digesting into a separate function.
- Documentation now uses JSDoc.


### Fixed

- Double-escape otpauth:// parameters for Google Authenticator otpauth:// URL. Thanks, cgarvey.

## [1.0.5] - 2016-01-23

### Fixed

- Fixed key generator random selector overflow introduced in 1.0.4. Thanks, cmaster11.

## [1.0.4] - 2016-01-08

### Changed

- Removed ezcrypto in favor of native Node crypto. Thanks, connor4312.
- Move to a more secure key generator using `crypto.randomBytes`. Thanks, connor4312.
- Allow `generate_key` to be called with no options. Thanks, PeteJodo.

### Fixed

- Fixed zero-padding bug in hotp. Thanks, haarvardw.

## [1.0.3] - 2013-02-05

### Changed

- Add vows to devDependencies and support `npm test` in package.json. Thanks, freewill!

## [1.0.2] - 2012-10-21

### Fixed

- Remove global leaks. Thanks for the fix, mashihua.

## [1.0.1] - 2012-09-10

### Fixed

- Fixes issue where Google Chart API was being called at a deprecated URL. Thanks for the fix, sakkaku.
- Fixes issue where `generate_key`'s `symbols` option was not working, and was also causing pollution with global var. Thanks for reporting the bug, ARAtlas.

## [1.0.0] - 2011-11-03

### Added

- Initial release.

[2.0.0]: https://github.com/speakeasyjs/speakeasy/compare/v1.0.5...v2.0.0
[1.0.5]: https://github.com/speakeasyjs/speakeasy/compare/v1.0.4...v1.0.5
[1.0.4]: https://github.com/speakeasyjs/speakeasy/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/speakeasyjs/speakeasy/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/speakeasyjs/speakeasy/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/speakeasyjs/speakeasy/compare/v1.0.0...v1.0.1
[1.0.1]: https://github.com/speakeasyjs/speakeasy/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/speakeasyjs/speakeasy/compare/3de0a0f887d5146f0e90176263e8984c20ee2478...v1.0.0