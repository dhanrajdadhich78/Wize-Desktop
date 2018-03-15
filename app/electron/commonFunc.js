/* eslint-disable max-len */
const fs = require('fs');
const bitcoin = require('bitcoinjs-lib');
const bigi = require('bigi');
const bs58check = require('bs58check');
const aesjs = require('aes-js');
const pbkdf2 = require('pbkdf2');

/**
 * check does folder exist
 * @param filePath
 * @returns {number}
 */
const ensureDirectoryExistence = filePath => {
  if (fs.existsSync(filePath)) {
    return 1;
  }
  fs.mkdirSync(filePath);
  ensureDirectoryExistence(filePath);
};

/**
 * AES encryption of data
 * @param data
 * @param password
 * @param stringStandard
 * @param aesJsCounter
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
 * @param encryptedHex
 * @param password
 * @param stringStandard
 * @param aesJsCounter
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
 * @param file
 * @param shardsNumber
 * @returns {Array}
 */
const fileCrushing = (file, shardsNumber = 3) => {
  // console.log(file.name, shardsNumber);
  const fileLength = file.data.length;
  const pieceSize = Math.floor((fileLength - (file.size % shardsNumber)) / shardsNumber);
  const rest = fileLength % shardsNumber;
  const resultArray = [];
  for (let i = 0; i <= shardsNumber - 1; i++) {
    let zeroPoint = pieceSize * i;
    const endPoint = pieceSize * (i + 1);
    if (i === shardsNumber - 1) {
      zeroPoint = (fileLength - (pieceSize + rest));
      resultArray.push(file.data.substring(zeroPoint));
      // console.log(zeroPoint);
      // console.log(file.data.substring(zeroPoint));
      break;
    }
    resultArray.push(file.data.substring(zeroPoint, endPoint));
    // console.log(zeroPoint);
    // console.log(file.data.substring(zeroPoint, endPoint));
    // console.log(endPoint);
  }
  // resultArray.map(shard => { console.log(zeroPoint); console.log(shard); return console.log(endPoint); });
  // console.log(file.size, rest, pieceSize);
  return resultArray;
};

module.exports = {
  ensureDirectoryExistence,
  aesEncrypt,
  aesDecrypt,
  fileCrushing
};
