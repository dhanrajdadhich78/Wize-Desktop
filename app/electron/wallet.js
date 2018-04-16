// FIXME: bitcoinjs or crypto-js - only one!
const bitcoin = require('bitcoinjs-lib');
const CryptoJS = require('crypto-js');
const bs58 = require('bs58');
// FIXME: crypto?
const crypto = require('crypto');
const cF = require('./commonFunc');

const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const version = Buffer.from([0x00], 'hex');
const addressChecksumLen = 4;

//  alt credentials generation
const newCredentials = () => {
  const keyPair = ec.genKeyPair();
  // we should use toString(16, 32) for hex values like '0x0a...' and with length 32 bytes
  const publicKey = `${keyPair.getPublic().x.toString(16, 32)}${keyPair.getPublic().y.toString(16, 32)}`;
  const address = getAddress(publicKey);
  return {
    csk: keyPair.getPrivate().toString(16, 32),
    cpk: publicKey,
    address
  };
};

//  address length > then max negth on 3 symbols
const getAddress = publicKey => {
  // FIXME: getHash to this module?
  
  const pubKeyHash = Buffer.from(cF.getHash(publicKey), 'hex');
  //console.log(pubKeyHash);

  const versionedPayload = Buffer.concat([version, pubKeyHash]);
  const checksum = checkSum(versionedPayload);
  //console.log(checksum);

  const fullPayload = Buffer.concat([versionedPayload, checksum]);
  //console.log(fullPayload);

  // bs58 is just base58 encoder/decoder, bs58check adds own checksum
  return bs58.encode(fullPayload);
};

const checkSum = payload => {
  // FIXME: bitcoinjs or crypto-js? bitcoinjs works
  //const firstHex = CryptoJS.SHA256(payload);
  //const secHex = CryptoJS.SHA256(firstHex).toString(CryptoJS.enc.Hex);
  //return Buffer.from(secHex.substr(0, addressChecksumLen), 'hex');
  
  const firstHex = bitcoin.crypto.sha256(payload);
  const secHex = bitcoin.crypto.sha256(firstHex).toString('hex');
  // we should use multiplier 2 because we work with string, not byte array
  return Buffer.from(secHex.substr(0, addressChecksumLen * 2), 'hex');
};

/**
 * ecdsa sign of data string with key
 * @param data {string}
 * @param key {string}
 * @returns {string}
 */
const ecdsaSign = (data, key) => {
  // signature
  const signObj = ec.sign(data, key, { canonical: true });
  // we should use toString(16, 32) for hex values like '0x0a...' and with length 32 bytes
  const signature = `${signObj.r.toString(16, 32)}${signObj.s.toString(16, 32)}`;
  //console.log(signature);
  return signature;
};

module.exports = {
  newCredentials,
  checkSum,
  ecdsaSign
};
