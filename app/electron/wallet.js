const cF = require('./commonFunc');
//  crypto
const bs58 = require('bs58');
const bitcoin = require('bitcoinjs-lib');
const EC = require('elliptic').ec;

const ec = new EC('secp256k1');

const version = Buffer.from([0x00], 'hex');
const addressChecksumLen = 4;

/**
 * credentials generation
 * @returns {{csk: string, cpk: string, address: string}}
 */
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

/**
 * get user address with his public key
 * @param publicKey {string}
 * @returns {string}
 */
const getAddress = publicKey => {
  // FIXME: getHash to this module?
  const pubKeyHash = Buffer.from(cF.getHash(publicKey), 'hex');
  const versionedPayload = Buffer.concat([version, pubKeyHash]);
  const checksum = checkSum(versionedPayload);
  const fullPayload = Buffer.concat([versionedPayload, checksum]);
  return validateAddress(bs58.encode(fullPayload)) ? bs58.encode(fullPayload) : null;
};

/**
 * check if address is valid
 * @param address {string}
 * @returns {bool}
 */
const validateAddress = address => {
  const fullPayload = bs58.decode(address);
  const bytesPayload = [...fullPayload];
  const actualChecksum = Buffer.from(bytesPayload.slice(bytesPayload.length - addressChecksumLen), 'hex');
  const v = bytesPayload.slice(0, 1);
  const pubKeyHash = bytesPayload.slice(1, bytesPayload.length - addressChecksumLen);
  const versionedPayload = Buffer.from([...v, ...pubKeyHash], 'hex');
  const targetChecksum = checkSum(versionedPayload);
  return Buffer.compare(actualChecksum, targetChecksum) === 0;
};

/**
 * check sum
 * @param payload {Buffer}
 * @returns {Buffer}
 */
const checkSum = payload => {
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
  return `${signObj.r.toString(16, 32)}${signObj.s.toString(16, 32)}`;
};

module.exports = {
  newCredentials,
  validateAddress,
  checkSum,
  ecdsaSign
};
