const CryptoJS = require('crypto-js');
//const bs58check = require('bs58check');
const bs58 = require('bs58');
const bigi = require('bigi');
const reverse = require("buffer-reverse")
//const bitcoin = require('bitcoinjs-lib');
const crypto = require('crypto');
const cF = require('./commonFunc');

const EC = require('elliptic').ec;
const ec = new EC('p256');

const version = Buffer.from([0x00], 'hex');
const addressChecksumLen = 4;

//  alt credentials generation
const newCredentials = () => {
  const keyPair = ec.genKeyPair();
  const publicKey = `${keyPair.getPublic().x.toString('hex')}${keyPair.getPublic().y.toString('hex')}`;
  const address = getAddress(publicKey);
  return {
    csk: keyPair.getPrivate().toString('hex'),
    cpk: publicKey,
    address
  };
};

//  address length > then max negth on 3 symbols
const getAddress = publicKey => {
  const pubKeyHash = Buffer.from(cF.getHash(publicKey), 'hex');

  const versionedPayload = Buffer.concat([version, pubKeyHash]);
  const checksum = checkSum(versionedPayload);

  const fullPayload = Buffer.concat([versionedPayload, checksum]);

  //const test = base58encode(fullPayload).toString();
  //console.log(test);

  return bs58.encode(fullPayload);
};

const checkSum = payload => {
  const firstHex = CryptoJS.SHA256(payload);
  const secHex = CryptoJS.SHA256(firstHex).toString(CryptoJS.enc.Hex);
  return Buffer.from(secHex.substr(0, addressChecksumLen), 'hex');
};

const b58Alphabet = Buffer.from('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz', 'ascii');

const base58encode = inputBuffer => {
  var result = '';
  var x = bigi.fromBuffer(inputBuffer);
  const base = bigi.fromHex('3A');
  const zero = bigi.fromHex('00');

  while (!x.equals(zero)) {
    var arrRes = x.divideAndRemainder(base);
    x = arrRes[0];
    //console.log("int:   " + arrRes[1].intValue());
    //console.log("value: " + b58Alphabet[arrRes[1].intValue()]);
    //console.log("char:  " + ascii(b58Alphabet[arrRes[1].intValue()]));
    result += ascii(b58Alphabet[arrRes[1].intValue()]);
    console.log(result);
  }

  if (inputBuffer[0] === 0) {
    result += ascii(b58Alphabet[0]);
    console.log(result);
  }

  const result_reverse = reverse(Buffer.from(result, 'ascii'));

  return result_reverse.toString('ascii');  
}

const ascii = a => {
  return String.fromCharCode(a);
}

/**
 * ecdsa sign of data string with key
 * @param data {string}
 * @param key {string}
 * @returns {string}
 */
const ecdsaSign = (data, key) => {
  // const shaMsg = CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
  // signature
  const signObj = ec.sign(shaMsg, key, { canonical: true });
  console.log(signObj);
  console.log(signObj.encode('hex'));
  const signature = `${signObj.r.toString('hex')}${signObj.s.toString('hex')}`;
  return signature;
  
  // node.js crypto
  //const sign = crypto.createSign('ecdsa-with-P256');
  //sign.update(data);
  //return sign.sign(key);
};

module.exports = {
  newCredentials,
  checkSum,
  ecdsaSign
};
