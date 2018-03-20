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
const { RAFT_URL, FS_URL } = require('./utils/const');

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
      // create and mount bucket
      const origin = JSON.parse(decrypt.strData).cpk;
      // axios.post(`${FS_URL}`, { data: { origin } })
      //   .then(() => {
      // // response.data
      axios.post(`${FS_URL}/${origin}/mount`)
        .then(response => console.log(response.data))
        .catch(error => console.log(error.response));
      // })
      // .catch(error => console.log(error.response.data));
      // --
      mainWindow.webContents.send('auth:complete', decrypt.strData);
    }
  });
});

ipcMain.on('file:list', (event, userData) => {
  axios.get(`${RAFT_URL}/${userData.cpk}`)
    .then((response) => {
      let filesList = [];
      if (response.data && Object.keys(response.data)) {
        const encryptedData = JSON.parse(response.data[userData.cpk]);
        // console.log(`encryptedData: ${encryptedData}`);
        const rawFileNames = Object.keys(encryptedData).map(key => {
          if (key.length > 3) {
            // console.log(`key: ${cF.aesDecrypt(key, userData.csk).strData}`);
            const name = cF.aesDecrypt(key, userData.csk).strData;
            // eslint-disable-next-line max-len
            const {size, timestamp} = JSON.parse(cF.aesDecrypt(encryptedData[key], userData.csk).strData);
            return {
              name,
              size,
              timestamp
            };
          }
        });
        filesList = cF.cleanArray(rawFileNames);
      }
      mainWindow.webContents.send('file:your-list', filesList);
    })
    .catch(error => console.log(error.response));
});

// const test = (id) => {
//   console.log(id);
//   if (id) {
//     test2();
//   }
// };
// const test2 = () => {
//   axios.post(`${FS_URL}/02870a4d229c0e46cc02f0c24aedc372335c2261f3333691e78eb7b8811695ddba/put`, { data: { name: 'suka', content: 'pzdc' } })
//     .then(response => console.log('ale'))
//     .catch(reason => console.log(reason));
// };

ipcMain.on('file:send', (event, { userData, files }) => {
  //  get Store Nodes from digest
  const digestServers = [
    `${FS_URL}`,
    `${FS_URL}`,
    `${FS_URL}`
  ];
  //  update user raft object
  const updRaft = (defaultObj, signature, shardsAddresses, { name, size, timestamp }) => {
    // console.log(`raft: ${defaultObj}`);
    //  aes name
    const filename = cF.aesEncrypt(name, userData.csk);
    //  aes file info
    const fileInfoObj = {
      size,
      timestamp,
      signature,
      shardsAddresses
    };
    const fileInfo = cF.aesEncrypt(JSON.stringify(fileInfoObj), userData.csk);
    const updateObj = defaultObj[userData.cpk]
      ? {
        ...defaultObj,
        [userData.cpk]: JSON.stringify({
          ...JSON.parse(defaultObj[userData.cpk]),
          [filename.encryptedHex]: fileInfo.encryptedHex
        })
      }
      : {
        ...defaultObj,
        [userData.cpk]: JSON.stringify({
          [filename.encryptedHex]: fileInfo.encryptedHex
        })
      };
    //  update user raft object request
    // return axios.post(`${RAFT_URL}/${userData.cpk}`, updateObj)
    //   .then(resp => console.log(resp.data))
    //   .catch(error => console.log(error.response));
    return new Promise((resolve, reject) => {
      setTimeout(() => (
        axios.post(`${RAFT_URL}/${userData.cpk}`, updateObj)
          .then(resp => resolve(resp.data))
          .catch(error => reject(error.response))
      ), 100);
    });
  };
  // ask raft about user files, then create and send shards for digest servers
  files.map(file => {
    //  create shards
    const rawShards = cF.fileCrushing(file);
    //  encrypt shards info
    const shards = rawShards.map(shard => cF.aesEncrypt(shard, userData.csk).encryptedHex);
    //  create sha256 signature
    const signature = bitcoin.crypto.sha256(Buffer.from(`${file.name}${file.size}${file.timestamp}${userData.cpk}`)).toString('hex');
    //  shards addresses array
    const shardsAddresses = digestServers.map(v => `${v}/${userData.cpk}`);
    //  shards upload requests array
    const shardsReq = digestServers.map((url, index) => {
      const data = {
        data: {
          name: `${cF.aesEncrypt(file.name, userData.csk).encryptedHex}.${index}`,
          content: shards[index]
        }
      };
      return axios.post(`${url}/${userData.cpk}/put`, data);
    });
    //  axios requests
    axios.all([
      axios.get(`${RAFT_URL}/${userData.cpk}`),
      ...shardsReq
    ])
      .then(axios.spread(res1 => {
        // when all shards are uploaded - update user raft object
        updRaft(res1.data, signature, shardsAddresses, file);
      }))
      .then(() => console.log('send is end'))
      .catch(reason => console.log(reason));
  });
});

ipcMain.on('file:compile', (event, { userData, filename }) => {
  let fileList = {};
  axios.get(`${RAFT_URL}/${userData.cpk}`)
    .then(response => {
      fileList = {
        ...fileList,
        ...JSON.parse(response.data[userData.cpk])
      };
      const pointer = cF.aesEncrypt(filename, userData.csk);
      const encryptedData = fileList[pointer.encryptedHex];
      const decryptedData = cF.aesDecrypt(encryptedData, userData.csk);
      const fileDataObj = JSON.parse(decryptedData.strData);
      const shardsReq = fileDataObj.shardsAddresses.map((shardAddress, index) => {
        const fname = cF.aesEncrypt(filename, userData.csk).encryptedHex;
        return axios.get(`${shardAddress}/files/${fname}.${index}`);
      });
      return new Promise(resolve => {
        setTimeout(() => (
          axios.all(shardsReq)
            .then(ress => resolve(ress))
            .catch(error => console.log(error))
        ), 100);
      });
    })
    .then(responses => {
      const shards = responses.map(({ data }) => cF.aesDecrypt(data, userData.csk).strData);
      const base64File = shards.join('');
      console.log(base64File);
      mainWindow.webContents.send('file:receive', base64File);
    })
    .catch(error => console.log(error));
});

ipcMain.on('file:delete', (event, { userData, filename }) => {
  // console.log(userData.cpk, filename);
  //  user raft object
  let updateObj = {};
  axios.get(`${RAFT_URL}/${userData.cpk}`)
  // eslint-disable-next-line promise/always-return
    .then(response => {
      updateObj = {
        ...updateObj,
        ...response.data
      };
      //  aes name
      const encName = cF.aesEncrypt(filename, userData.csk).encryptedHex;
      // console.log(JSON.stringify(updateObj));
      const userString = JSON.parse(updateObj[userData.cpk]);
      // console.log(userString);
      Object.keys(userString).map(key => {
        if (userString[key] > 3) {
          const decryptedKey = cF.aesDecrypt(userString[key], userData.csk).strData;
          console.log(decryptedKey);
        }
      });
      console.log('======');
      delete userString[encName];
      // console.log(JSON.stringify(updateObj));
      Object.keys(userString).map(key => {
        if (userString[key] > 3) {
          const decryptedKey = cF.aesDecrypt(userString[key], userData.csk).strData;
          console.log(decryptedKey);
        }
      });
    })
    .catch(error => console.log(error));
});

ipcMain.on('file:transfer', (event, { userData, filename }) => {
  console.log(userData.cpk, filename);
  //  user raft object
  let updateObj = {};
  axios.get(`${RAFT_URL}/${userData.cpk}`)
  // eslint-disable-next-line promise/always-return
    .then(response => {
      updateObj = {
        ...updateObj,
        ...response.data
      };
    })
    .catch(error => console.log(error));
});
