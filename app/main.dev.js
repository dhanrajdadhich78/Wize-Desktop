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
const _ = require('lodash');
const axios = require('axios');

const cF = require('./electron/commonFunc');
const { RAFT_URL, /* FS_URL */ } = require('./utils/const');

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
    const aes = cF.aesEncrypt(strData, password, 'hex');
    fs.writeFile('./.wizeconfig/credentials.bak', aes.encryptedHex, err => {
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
      encryptedHex = data;
    } else {
      fs.readFile(filePath, (error, altData) => {
        encryptedHex = altData;
      });
    }

    if (!encryptedHex) {
      mainWindow.webContents.send('auth:error', 'There is no credentials file');
    } else {
      const decrypt = cF.aesDecrypt(encryptedHex, password, 'hex');
      // // create and mount bucket
      // const origin = JSON.parse(decrypt.strData).cpk;
      // axios.post(`${FS_URL}`, { data: { origin } })
      //   .then(() => {
      //     // response.data
      //     axios.post(`${FS_URL}/${origin}/mount`)
      //       .then(response => console.log(response.data))
      //       .catch(error => console.log(error.response));
      //   })
      //   .catch(error => console.log(error.response));
      // // --
      mainWindow.webContents.send('auth:complete', decrypt.strData);
    }
  });
});

ipcMain.on('file:list', (event, userData) => {
  axios.get(`${RAFT_URL}/${userData.cpk}`)
    .then((response) => {
      const encryptedData = JSON.parse(response.data[userData.cpk]);
      // console.log(`encryptedData: ${encryptedData}`);
      const rawFileNames = Object.keys(encryptedData).map(key => {
        if (key.length > 3) {
          // console.log(`key: ${cF.aesDecrypt(key, userData.csk).strData}`);
          const name = cF.aesDecrypt(key, userData.csk).strData;
          // eslint-disable-next-line max-len
          const { size, timestamp } = JSON.parse(cF.aesDecrypt(encryptedData[key], userData.csk).strData);
          return {
            name,
            size,
            timestamp
          };
        }
      });
      const filesList = cF.cleanArray(rawFileNames);
      mainWindow.webContents.send('file:your-list', filesList);
    })
    .catch(error => console.log(error.response));
});

ipcMain.on('file:send', (event, { userData, files }) => {
  //  get Store Nodes from digest
  const digestServers = [
    './.wizeconfig/testpieces/',
    './.wizeconfig/testpieces/',
    './.wizeconfig/testpieces/'
  ];
  //  user raft object
  let updateObj = {};
  axios.get(`${RAFT_URL}/${userData.cpk}`)
    // eslint-disable-next-line promise/always-return
    .then(response => {
      updateObj = {
        ...updateObj,
        ...response.data
      };
      //  loop through files
      const promises = _.map(files, file => new Promise(resolve => {
        const rawShards = cF.fileCrushing(file);
        const shards = rawShards.map(shard => cF.aesEncrypt(shard, userData.csk).encryptedHex);
        resolve({ file, shards });
      }));
      Promise.all(promises)
        // eslint-disable-next-line promise/always-return
        .then(results => {
          // eslint-disable-next-line array-callback-return
          results.map(({ file, shards }) => {
            const signature = bitcoin.crypto.sha256(Buffer.from(`
                ${file.name}
                ${file.size}
                ${file.timestamp}
                ${userData.cpk}
            `)).toString('hex');
            //  write into servers
            const servers = _.map(shards, (shard, index) => (new Promise(resolve => {
              // const formdata = new FormData();
              // formdata.append();
              // axios.post(`${FS_URL}/${origin}/putfile`, formdata)
              //   .then(() => resolve(`${digestServers[index]}${signature}.${index}`))
              //   .catch(error => console.log(error.response));
              fs.writeFile(`${digestServers[index]}${signature}.${index}`, shard, err => {
                if (err) {
                  console.log(err);
                }
                resolve(`${digestServers[index]}${signature}.${index}`);
              });
            })));
            Promise.all(servers)
              // eslint-disable-next-line promise/always-return
              .then(pathForShards => {
                //  aes name
                const filename = cF.aesEncrypt(file.name, userData.csk);
                //  aes file info
                const fileInfoObj = {
                  size: file.size,
                  timestamp: file.timestamp,
                  signature,
                  pathForShards
                };
                const fileInfo = cF.aesEncrypt(JSON.stringify(fileInfoObj), userData.csk);
                updateObj = {
                  ...updateObj,
                  [userData.cpk]: JSON.stringify({
                    ...JSON.parse(updateObj[userData.cpk]),
                    [filename.encryptedHex]: fileInfo.encryptedHex
                  })
                };
                // to the Raft Store
                axios.post(`${RAFT_URL}`, updateObj)
                  .then(response => console.log(response.data))
                  .catch(error => console.log(error.response));
                // console.log(updateObj);
                // fs.writeFile(`./.wizeconfig/${userData.cpk}`, JSON.stringify(updateObj), err => {
                //   if (err) {
                //     console.log(err);
                //   }
                // });
              })
              .catch(reason => console.log(reason));
          });
        })
        .catch(reason => console.log(reason));
    })
    .catch(error => {
      console.log(error);
    });
});

ipcMain.on('file:compile', (event, { userData, filename }) => {
  let fileList = {};
  axios.get(`${RAFT_URL}/${userData.cpk}`)
    // eslint-disable-next-line promise/always-return
    .then(response => {
      fileList = {
        ...fileList,
        ...JSON.parse(response.data[userData.cpk])
      };
      const pointer = cF.aesEncrypt(filename, userData.csk);
      const encryptedData = fileList[pointer.encryptedHex];
      const decryptedData = cF.aesDecrypt(encryptedData, userData.csk);
      const fileDataObj = JSON.parse(decryptedData.strData);
      const shards = fileDataObj.pathForShards.map(shardPath => (
        cF.aesDecrypt(fs.readFileSync(shardPath), userData.csk).strData
      ));
      const base64File = shards.join('');
      mainWindow.webContents.send('file:receive', base64File);
    })
    .catch(error => console.log(error.response));
});

ipcMain.on('file:delete', (event, { userData, filename }) => {
  console.log(userData.cpk, filename);
});

ipcMain.on('file:transfer', (event, { userData, filename }) => {
  console.log(userData.cpk, filename);
});