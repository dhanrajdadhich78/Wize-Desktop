/* eslint-disable object-curly-newline */
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
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { app, BrowserWindow, ipcMain, dialog } = require('electron');

const cF = require('./electron/utils/commonFunc');

const MenuBuilder = require('./menu');
const CommonListeners = require('./electron/app/common');
const Digest = require('./electron/app/digest');
const Auth = require('./electron/app/auth');
const FS = require('./electron/app/filesystem');
const FilesListeners = require('./electron/app/files');
const BlockChain = require('./electron/app/blockchain');
const GhostPad = require('./electron/app/ghost-pad');

let configFolder = `${process.cwd()}/.wizeconfig`;
if (process.platform === 'darwin') {
  configFolder = '/Applications/Wizebit.app/Contents/Resources/.wizeconfig';
} else if (process.platform === 'win32') {
  configFolder = `${process.cwd()}\\wizeconfig`;
}

//  mainWindow container
let mainWindow;
//  private key container for listeners
let cpkGlob;
//  file system container for listeners
let fsUrlGlob;

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
 * Event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
//  main listener - on app start
app.on('ready', async () => {
  //  install extensions
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    await installExtensions();
  }
  //  main window settings
  mainWindow = new BrowserWindow({
    show: false,
    width: 1048,
    height: 600,
    minWidth: 1048,
    minHeight: 600
  });
  mainWindow.on('closed', () => {
    if (cpkGlob) {
      cF.unmountFs(cpkGlob, fsUrlGlob, app.quit);
    } else {
      app.quit();
    }
  });
  mainWindow.loadURL(`file://${__dirname}/app.html`);
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.show();
    mainWindow.focus();
  });
  //  menu builder
  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();
  //  common
  CommonListeners(mainWindow, configFolder);
  //  digest
  Digest(mainWindow);
  //  file system listeners
  FS(mainWindow, cpkGlob, fsUrlGlob);
  //  auth
  Auth(mainWindow, configFolder, cpkGlob);
  //  files listeners
  FilesListeners(mainWindow);
  //  blockchain listeners
  BlockChain(mainWindow);
  //  notes listeners
  GhostPad(mainWindow);
});

// this listeners is here because of redefining cpkGlob and fsUrlGlob

//  fs mounting
ipcMain.on('fs:mount', (event, fsUrl) => {
  const origin = cpkGlob;
  const threeUrls = fsUrl.slice(0, 3);
  //  send fs url of user to main func
  fsUrlGlob = threeUrls;
  const reqAllState = [];
  const reqAllMount = [];
  // const reqAllCreate = [];
  if (threeUrls[0] === threeUrls[2]) {
    reqAllState.push(axios.get(`${threeUrls[0]}/${origin}/state`));
    reqAllMount.push(axios.post(`${threeUrls[0]}/${origin}/mount`));
    // reqAllCreate.push(axios.post(threeUrls[0], { data: { origin } }));
  } else {
    for (let i = 0; i < threeUrls.length; i += 1) {
      reqAllState.push(axios.get(`${threeUrls[i]}/${origin}/state`));
      reqAllMount.push(axios.post(`${threeUrls[i]}/${origin}/mount`));
      //  unexpected trigger on create request
      // reqAllCreate.push(axios.post(`${threeUrls[i]}`, { data: { origin }}));
    }
  }
  // // user origin create and mount requests
  // return Promise.all(reqAllMount)
  //   .then(() => mainWindow.webContents.send('fs:mounted'))
  //   .catch(({ response }) => {
  //     if (response.data.data.exitcode === 7) {
  //       return mainWindow.webContents.send('fs:mounted');
  //     }
  //     return setTimeout(() => (
  //       Promise.all(reqAllCreate)
  //         .then(() => mainWindow.webContents.send('fs:mounted'))
  //         .catch(({ response }) => {
  //           if (response.data.data.exitcode === 7) {
  //             return mainWindow.webContents.send('fs:mounted');
  //           }
  //           console.log(response.data.data);
  //         })
  //     ), 100);
  //   });

  // with status method
  return Promise.all(reqAllState)
    .then(responses => {
      //  find out what nodes are not mounted
      const reqMount = cF.cleanArray(responses.map((response, i) => (
        !response.data.mounted
          ? reqAllMount[i]
          : null
      )));
      // not created
      const urlsCreate = cF.cleanArray(responses.map((response, i) => (
        !response.data.created
          ? threeUrls[i]
          : null
      )));
      // if we have nodes to create
      if (urlsCreate.length) {
        return Promise.all(urlsCreate.map(url => (
          axios.post(url, { data: { origin } })
        )))
          .then(() => (
            Promise.all(reqMount)
              .then(() => mainWindow.webContents.send('fs:mounted'))
              .catch(({ response }) => {
                console.log(response.data);
                return dialog.showErrorBox('Error', response.data.message);
              })
          ))
          .catch(({ response }) => {
            console.log(response.data);
            return dialog.showErrorBox('Error', response.data.message);
          });
      } else
      if (!urlsCreate && reqMount.length) {
        //  only mount
        return Promise.all(reqMount)
          .then(() => mainWindow.webContents.send('fs:mounted'))
          .catch(({ response }) => {
            console.log(response.data);
            return dialog.showErrorBox('Error', response.data.message);
          });
      }
      return mainWindow.webContents.send('fs:mounted');
    })
    .catch(({ response }) => {
      console.log(response.data);
      return dialog.showErrorBox('Error', response.data.message);
    });
});
//  on auth listener
ipcMain.on('auth:start', (event, { password, filePath }) => {
  let encryptedHex;
  // eslint-disable-next-line comma-spacing
  let credFilePath = process.platform !== 'win32' ? filePath : filePath.replace(/\\/gi,'/');
  if (credFilePath.indexOf('/') < 0 || !credFilePath) {
    credFilePath = `${configFolder}/${filePath}`;
  }
  return fs.readFile(credFilePath, (err, data) => {
    if (err) {
      dialog.showErrorBox('Error', err);
    }
    encryptedHex = data;
    if (!encryptedHex) {
      return dialog.showErrorBox('Error', 'There is no credentials file');
    }
    const decrypt = cF.aesDecrypt(encryptedHex, password, 'hex');

    //  send cpk of user to main func
    cpkGlob = JSON.parse(decrypt.strData).cpk;

    // on user data decryption and mounting fs - give userData to react part
    mainWindow.webContents.send('auth:complete', decrypt.strData);
  });
});
