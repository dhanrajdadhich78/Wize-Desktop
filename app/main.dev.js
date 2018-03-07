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
import { app, BrowserWindow, ipcMain } from 'electron';
import MenuBuilder from './menu';

const bitcoin = require('bitcoinjs-lib');
const bigi = require('bigi');
const bs58check = require('bs58check');

let mainWindow;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  require('electron-debug')();
  const path = require('path');
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
    width: 800,
    height: 600
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
  console.log(password);
  //  random sha256 hash
  const hash = bitcoin.crypto.sha256(Buffer.from(new Date().getTime().toString()));
  const d = bigi.fromBuffer(hash);
  //  generate keypair
  const keyPair = new bitcoin.ECPair(d);
  //  extract public key buffer(compressed)
  const cpkBuffer = keyPair.getPublicKeyBuffer();
  //  get readable public key
  //  to revert -> Buffer.from(publicKey, 'hex')
  const cpk = cpkBuffer.toString('hex');
  //  get private key
  const csk = bs58check.decode(keyPair.toWIF()).toString('hex');
  //  get adress
  const address = keyPair.getAddress();

  const userData = {
    csk,
    cpk,
    address
  };

  mainWindow.webContents.send('registration:complete', JSON.stringify(userData));
});
