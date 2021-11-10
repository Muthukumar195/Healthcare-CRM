const _ = require('lodash');
const CryptoJS = require("crypto-js");
var config = require("../configs/config.js");

var encrypt = (data) => {
  const keyutf = CryptoJS.enc.Utf8.parse(config.cryptoSecret);
  const iv = CryptoJS.enc.Base64.parse(config.cryptoSecret);
  if (_.isObject(data) || _.isArray(data)) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), keyutf, { iv: iv }).toString();
  }
  return CryptoJS.AES.encrypt(data, keyutf, { iv: iv }).toString();

};

var decrypt = (data) => {
  const keyutf = CryptoJS.enc.Utf8.parse(config.cryptoSecret);
  const iv = CryptoJS.enc.Base64.parse(config.cryptoSecret);
  var bytes = CryptoJS.AES.decrypt(data, keyutf, { iv: iv });
  if (isJson(bytes.toString(CryptoJS.enc.Utf8))) {
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
  }
  return bytes.toString(CryptoJS.enc.Utf8);
};

var isJson = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

var dataEncrypt = (data, options = { in: [], ex: [] }) => {
  _.forEach(data, (value, key) => {
    if (!_.isEmpty(value)) {
      if (_.isEmpty(options.in) && _.isEmpty(options.ex)) {
        data[key] = encrypt(value)
      } else if (!_.isEmpty(options.in)) {
        if (_.includes(options.in, key)) {
          data[key] = encrypt(value)
        }
      } else if (!_.isEmpty(options.ex)) {
        if (!_.includes(options.ex, key)) {
          data[key] = encrypt(value)
        }
      }
    }
  })
  return data;
}
var dataDecrypt = (data, options = { in: [], ex: [] }) => {
  _.forEach(data, (value, key) => {
    if (!_.isEmpty(value)) {
      if (_.isEmpty(options.in) && _.isEmpty(options.ex)) {
        data[key] = decrypt(value)
      } else if (!_.isEmpty(options.in)) {
        if (_.includes(options.in, key)) {
          data[key] = decrypt(value)
        }
      } else if (!_.isEmpty(options.ex)) {
        if (!_.includes(options.ex, key)) {
          data[key] = decrypt(value)
        }
      }
    }
  })
  return data;
}

var listDecryption = (list, fields) => {
  var data = [];

  _.forEach(list, (value, key) => {
    var tempVal = _.isEmpty(value['_doc']) ? value : value['_doc']
    data.push(dataDecrypt(tempVal, { in: fields }))
  })
  return data;
}
module.exports = { encrypt, decrypt, dataEncrypt, dataDecrypt, listDecryption };  
