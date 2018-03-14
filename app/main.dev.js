/* eslint global-require: 0, flowtype-errors/show-errors: 0 */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
const path = require('path');
const fs = require('fs');
const bitcoin = require('bitcoinjs-lib');
const bigi = require('bigi');
const bs58check = require('bs58check');
const aesjs = require('aes-js');
const pbkdf2 = require('pbkdf2');
const _ = require('lodash');
const cF = require('./electron/commonFunc');

const { app, BrowserWindow, ipcMain } = require('electron');
const MenuBuilder = require('./menu');

let mainWindow;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  require('electron-debug')();
  const p = path.join(__dirname, '..', 'app', 'node_modules');
  require('module').globalPaths.push(p);
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = [
    'REACT_DEVELOPER_TOOLS',
    'REDUX_DEVTOOLS'
  ];

  return Promise
    .all(extensions.map(name => installer.default(installer[name], forceDownload)))
    .catch(console.log);
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


app.on('ready', async () => {
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    await installExtensions();
  }
  mainWindow = new BrowserWindow({
    show: false,
    minWidth: 800,
    minHeight: 600
  });
  mainWindow.loadURL(`file://${__dirname}/app.html`);
  mainWindow.on('closed', () => app.quit());
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.show();
    mainWindow.focus();
  });
  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();
});

ipcMain.on('registration:start', (event, password) => {
  //  random sha256 hash
  const hash = bitcoin.crypto.sha256(Buffer.from(new Date().getTime().toString()));
  const d = bigi.fromBuffer(hash);
  //  generate key pair
  const keyPair = new bitcoin.ECPair(d);
  //  extract public key buffer(compressed)
  const cpkBuffer = keyPair.getPublicKeyBuffer();
  //  get readable public key
  //  to revert -> Buffer.from(publicKey, 'hex')
  const cpk = cpkBuffer.toString('hex');
  //  get private key
  const csk = bs58check.decode(keyPair.toWIF()).toString('hex');
  //  get address
  const address = keyPair.getAddress();
  //  json with credentials
  const userData = {
    csk,
    cpk,
    address
  };
  const strData = JSON.stringify(userData);
  //  save to file
  if (cF.ensureDirectoryExistence('./.wizeconfig')) {
    //  create salt
    const salt = bitcoin.crypto.sha256(Buffer.from(password)).toString('hex').substring(0, 4);
    //  create key
    const aesKey256 = pbkdf2.pbkdf2Sync(password, salt, 1, 128 / 8, 'sha256');
    const dataBytes = aesjs.utils.utf8.toBytes(strData);
    //  eslint-disable-next-line new-cap
    const aesCtr = new aesjs.ModeOfOperation.ctr(aesKey256, new aesjs.Counter(5));
    //  encrypt password
    const encryptedBytes = aesCtr.encrypt(dataBytes);
    const encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
    fs.writeFile('./.wizeconfig/credentials.bak', encryptedHex, err => {
      if (err) {
        mainWindow.webContents.send('registration:error', err);
      }
      mainWindow.webContents.send('registration:complete', strData);
    });
  }
});

ipcMain.on('auth:start', (event, { password, filePath }) => {
  let encryptedHex;
  fs.readFile('./.wizeconfig/credentials.bak', (err, data) => {
    if (!err) {
      encryptedHex = data.toString();
    } else {
      fs.readFile(filePath, (error, altData) => {
        encryptedHex = altData.toString();
      });
    }

    if (!encryptedHex) {
      mainWindow.webContents.send('auth:error', 'There is no credentials file');
    } else {
      //  create salt
      const salt = bitcoin.crypto.sha256(Buffer.from(password)).toString('hex').substring(0, 4);
      //  create key
      const aesKey256 = pbkdf2.pbkdf2Sync(password, salt, 1, 128 / 8, 'sha256');
      //  from file to bytes
      const encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);
      //  eslint-disable-next-line new-cap
      const aesCtr = new aesjs.ModeOfOperation.ctr(aesKey256, new aesjs.Counter(5));
      // decrypt...
      const decryptedBytes = aesCtr.decrypt(encryptedBytes);
      const strData = aesjs.utils.utf8.fromBytes(decryptedBytes);
      mainWindow.webContents.send('auth:complete', strData);
    }
  });
});

ipcMain.on('file:send', (event, { userData, files }) => {
  files.map(file => {
    const shards = cF.shardFile(file);
    //  create aes key
    const aesKey256 = pbkdf2.pbkdf2Sync(userData.csk, '', 1, 128 / 8, 'sha256');
    //  eslint-disable-next-line new-cap
    const aesCtr = new aesjs.ModeOfOperation.ctr(aesKey256, new aesjs.Counter(5));
    //  aes name
    const filenameDataBytes = aesjs.utils.utf8.toBytes(file.name.toString('base64'));
    const filenameEncryptedBytes = aesCtr.encrypt(filenameDataBytes);
    const filenameEncryptedHex = aesjs.utils.hex.fromBytes(filenameEncryptedBytes);
    //  raft key
    const key = bitcoin.crypto.sha256(`
      ${file.name.toString('base64')}
      ${file.size}
      ${file.timestamp}
    `).toString('base64');
    const result = {
      [key]: {
        cpk: userData.cpk,
        filename: filenameEncryptedHex,
        size: file.size,
        timestamp: file.timestamp,
        key,
        shards
      }
    };
    console.log(result);
    return result;
  });
});
