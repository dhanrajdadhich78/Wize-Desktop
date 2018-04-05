const CryptoJS = require('crypto-js');
const EC = require('elliptic').ec;
const bs58check = require('bs58check');
const bitcoin = require('bitcoinjs-lib');
const crypto = require('crypto');

const cF = require('./commonFunc');

const ec = new EC('p256');
const version = Buffer.from([0x00], 'hex');
const addressChecksumLen = 4;

//  alt credentials generation
const newCredentials = () => {
  const keyPair = ec.genKeyPair();
  const publicKey = `${keyPair.getPublic().x.toString('hex')}${keyPair.getPublic().y.toString('hex')}`;
  const address = getAddress(publicKey);
  return {
    address,
    publicKey,
    privateKey: keyPair.getPrivate().toString('hex')
  };
};

//  address length > then max negth on 3 symbols
const getAddress = publicKey => {
  const pubKeyHash = Buffer.from(cF.getHash(publicKey), 'hex');

  const versionedPayload = Buffer.concat([version, pubKeyHash]);
  const checksum = checkSum(versionedPayload);

  const fullPayload = Buffer.concat([versionedPayload, checksum]);

  return bs58check.encode(fullPayload).toString('hex');
};

const checkSum = payload => {
  const firstHex = CryptoJS.SHA256(payload);
  const secHex = CryptoJS.SHA256(firstHex).toString(CryptoJS.enc.Hex);
  return Buffer.from(secHex.substr(0, addressChecksumLen), 'hex');
};

/**
 * ecdsa sign of data string with key
 * @param data {string}
 * @param key {string}
 * @returns {string}
 */
const ecdsaSign = (data, key) => {
  // const shaMsg = CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
  // // signature
  // const signObj = ec.sign(shaMsg, key, { canonical: true });
  // console.log(signObj.encode('hex'));
  // return `${signObj.r.toString('hex')}${signObj.s.toString('hex')}`;
  const sign = crypto.createSign('ecdsa-with-P256');
  sign.update(data);
  return sign.sign(key);
};

module.exports = {
  newCredentials,
  checkSum,
  ecdsaSign
};
