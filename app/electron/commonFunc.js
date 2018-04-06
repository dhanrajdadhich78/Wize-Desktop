/* eslint-disable max-len,no-plusplus */
const fs = require('fs');
const bitcoin = require('bitcoinjs-lib');
const aesjs = require('aes-js');
const pbkdf2 = require('pbkdf2');
const CryptoJS = require('crypto-js');
const SHA256 = require('crypto-js/sha256');
const ripemd160 = require('crypto-js/ripemd160');
const axios = require('axios');

const { FS_URL } = require('../utils/const');

/**
 * unmount fs buket
 * @param cpk {string}
 * @param funcAfter {function}
 */
const unmountFs = (cpk, funcAfter = null) => (
  axios.post(`${FS_URL}/${cpk}/unmount`)
    .catch(error => {
      console.log(error);
      if (funcAfter) {
        funcAfter();
      }
    })
);

/**
 * convert string to bytes array
 * @param string {string}
 * @returns {Array}
 */
const stringToBytes = string => {
  const result = [];
  for (let i = 0; i < string.length; i++) {
    result.push(string.charCodeAt(i));
  }
  return result;
};

/**
 * clean array from null values
 * @param actual {Array}
 * @returns {Array}
 */
const cleanArray = actual => {
  const newArray = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
};

/**
 * check does folder exist
 * @param filePath {string}
 * @returns {bool}
 */
const ensureDirectoryExistence = filePath => {
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath);
    ensureDirectoryExistence(filePath);
  }
  return true;
};

/**
 * AES encryption of data
 * @param data {string}
 * @param password {string}
 * @param stringStandard {string}
 * @param aesJsCounter {number}
 * @returns {{salt: string, aesKey, dataBytes: *, aesCtr: ModeOfOperationCTR, encryptedBytes: *|PromiseLike<ArrayBuffer>, encryptedHex: *}}
 */
const aesEncrypt = (data, password, stringStandard = 'base64', aesJsCounter = 5) => {
  //  create salt
  const salt = bitcoin.crypto.sha256(Buffer.from(password))
    .toString(stringStandard).substring(0, 4);
  //  create key
  const aesKey = pbkdf2.pbkdf2Sync(password, salt, 1, 128 / 8, 'sha256');
  const dataBytes = aesjs.utils.utf8.toBytes(data);
  //  eslint-disable-next-line new-cap
  const aesCtr = new aesjs.ModeOfOperation.ctr(aesKey, new aesjs.Counter(aesJsCounter));
  //  encrypt password
  const encryptedBytes = aesCtr.encrypt(dataBytes);
  const encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
  return {
    salt,
    aesKey,
    dataBytes,
    aesCtr,
    encryptedBytes,
    encryptedHex
  };
};

/**
 * AES decryption of data
 * @param encryptedHex {string}
 * @param password {string}
 * @param stringStandard {string}
 * @param aesJsCounter {number}
 * @returns {{salt: string, aesKey, encryptedBytes: *, aesCtr: ModeOfOperationCTR, decryptedBytes: *|PromiseLike<ArrayBuffer>, strData: *}}
 */
const aesDecrypt = (encryptedHex, password, stringStandard = 'base64', aesJsCounter = 5) => {
  //  create salt
  const salt = bitcoin.crypto.sha256(Buffer.from(password))
    .toString(stringStandard).substring(0, 4);
  //  create key
  const aesKey = pbkdf2.pbkdf2Sync(password, salt, 1, 128 / 8, 'sha256');
  //  from file to bytes
  const encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex.toString());
  //  eslint-disable-next-line new-cap
  const aesCtr = new aesjs.ModeOfOperation.ctr(aesKey, new aesjs.Counter(aesJsCounter));
  // decrypt...
  const decryptedBytes = aesCtr.decrypt(encryptedBytes);
  const strData = aesjs.utils.utf8.fromBytes(decryptedBytes);
  return {
    salt,
    aesKey,
    encryptedBytes,
    aesCtr,
    decryptedBytes,
    strData
  };
};

/**
 * file crushing for n parts
 * @param file {object}
 * @param shardsNumber {number}
 * @returns {Array}
 */
const fileCrushing = (file, shardsNumber = 3) => {
  // console.log(file.name, shardsNumber);
  const fileLength = file.data.length;
  const pieceSize = Math.floor((fileLength - (file.size % shardsNumber)) / shardsNumber);
  const resultArray = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i <= shardsNumber - 1; i++) {
    let zeroPoint = pieceSize * i;
    const endPoint = pieceSize * (i + 1);
    if (i === shardsNumber - 1) {
      zeroPoint = (2 * pieceSize);
      resultArray.push(file.data.substring(zeroPoint));
      break;
    }
    resultArray.push(file.data.substring(zeroPoint, endPoint));
  }
  return resultArray;
};

/**
 * get hash from string
 * @param string {string}
 * @returns {string}
 */
const getHash = string => {
  // const publicSHA256 = bitcoin.crypto.sha256(string);
  const publicSHA256 = SHA256(string);
  return ripemd160(publicSHA256).toString(CryptoJS.enc.Hex);
};

module.exports = {
  unmountFs,
  stringToBytes,
  cleanArray,
  ensureDirectoryExistence,
  aesEncrypt,
  aesDecrypt,
  fileCrushing,
  getHash
};
