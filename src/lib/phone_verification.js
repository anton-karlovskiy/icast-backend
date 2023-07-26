
import request from 'request';
const VERSION = '0.1';

module.exports = function (apiKey, apiUrl) {
  return new PhoneVerification(apiKey, apiUrl);
};

// eslint-disable-next-line require-jsdoc
function PhoneVerification(apiKey, apiUrl) {
  this.apiKey = apiKey;
  this.apiURL = apiUrl || 'https://api.authy.com';
  this.user_agent = 'PhoneVerificationRegNode/' + VERSION + ' (node ' + process.version + ')';
  this.headers = {};

  this.init();
}

PhoneVerification.prototype.init = function () {
  this.headers = {
    'User-Agent': this.user_agent
  };
};

/**
* Verify a phone number
*
* @param {!string} phoneNumber
* @param {!string} countryCode
* @param {!string} token
* @param {!function} callback
*/
PhoneVerification.prototype.verifyPhoneToken = function (phoneNumber, countryCode, token, callback) {
  console.log('[PhoneVerification verifyPhoneToken] in verify phone');
  this._request('get', '/protected/json/phones/verification/check', {
    api_key: this.apiKey,
    verification_code: token,
    phone_number: phoneNumber,
    country_code: countryCode
  },
  callback
  );
};

/**
* Request a phone verification
*
* @param {!string} phoneNumber
* @param {!string} countryCode
* @param {!string} via
* @param {!function} callback
*/
PhoneVerification.prototype.requestPhoneVerification = function (phoneNumber, countryCode, via, callback) {
  this._request('post', '/protected/json/phones/verification/start', {
    api_key: this.apiKey,
    phone_number: phoneNumber,
    via: via,
    country_code: countryCode,
    code_length: 4
  },
  callback
  );
};

PhoneVerification.prototype._request = function (type, path, params, callback, qs) {
  qs = qs || {};
  qs['api_key'] = this.apiKey;

  const options = {
    url: this.apiURL + path,
    form: params,
    headers: this.headers,
    qs,
    json: true,
    jar: false,
    strictSSL: true
  };

  console.log('[PhoneVerification _request] options', options.url);

  const callbackCheck = function (error, res, body) {
    if (error) {
      callback(error);
    } else {
      if (res.statusCode === 200) {
        callback(null, body);
      } else {
        callback(body);
      }
    }
  };

  switch (type) {
  case 'post':
    request.post(options, callbackCheck);
    break;

  case 'get':
    request.get(options, callbackCheck);
    break;
  }
};
