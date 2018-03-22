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
    width: 1048,
    height: 600,
    minWidth: 800,
    minHeight: 458
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
      axios.post(`${FS_URL}`, { data: { origin } })
        .then(() => (
          axios.post(`${FS_URL}/${origin}/mount`)
            .then(response => console.log(response.data))
            .catch(error => console.log(error.response))
        ))
        .catch(error => {
          if (error.response.status === 500) {
            return axios.post(`${FS_URL}/${origin}/mount`)
              .then(response => console.log(response.data))
              .catch(e => console.log(e.response));
          }
          console.log(error.response);
        });
      // --
      mainWindow.webContents.send('auth:complete', decrypt.strData);
    }
  });
});

ipcMain.on('file:list', (event, userData) => {
  axios.get(`${RAFT_URL}/${userData.cpk}`)
    .then((response) => {
      let filesList = [];
      // eslint-disable-next-line promise/always-return
      if (response.data && Object.keys(response.data)) {
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
          return null;
        });
        filesList = cF.cleanArray(rawFileNames);
      }
      mainWindow.webContents.send('file:your-list', filesList);
    })
    .catch(error => console.log(error.response));
});

ipcMain.on('file:send', (event, { userData, files }) => {
  //  get Store Nodes from digest
  const digestServers = [
    `${FS_URL}`,
    `${FS_URL}`,
    `${FS_URL}`
  ];
  // //  update user raft object
  // const updRaft = (defaultObj, signature, shardsAddresses, { name, size, timestamp }) => {
  //   // console.log(`raft: ${defaultObj}`);
  //   //  aes name
  //   const filename = cF.aesEncrypt(name, userData.csk);
  //   //  aes file info
  //   const fileInfoObj = {
  //     size,
  //     timestamp,
  //     signature,
  //     shardsAddresses
  //   };
  //   const fileInfo = cF.aesEncrypt(JSON.stringify(fileInfoObj), userData.csk);
  //   const updateObj = defaultObj[userData.cpk]
  //     ? {
  //       ...defaultObj,
  //       [userData.cpk]: JSON.stringify({
  //         ...JSON.parse(defaultObj[userData.cpk]),
  //         [filename.encryptedHex]: fileInfo.encryptedHex
  //       })
  //     }
  //     : {
  //       ...defaultObj,
  //       [userData.cpk]: JSON.stringify({
  //         [filename.encryptedHex]: fileInfo.encryptedHex
  //       })
  //     };
  //   //  update user raft object request
  //   // return axios.post(`${RAFT_URL}/${userData.cpk}`, updateObj)
  //   //   .then(resp => console.log(resp.data))
  //   //   .catch(error => console.log(error.response));
  //   return new Promise((resolve, reject) => {
  //     setTimeout(() => (
  //       axios.post(`${RAFT_URL}/${userData.cpk}`, updateObj)
  //         .then(resp => resolve(resp.data))
  //         .catch(error => reject(error.response))
  //     ), 100);
  //   });
  // };
  // // ask raft about user files, then create and send shards for digest servers
  // files.map(file => {
  //   //  create shards
  //   const rawShards = cF.fileCrushing(file);
  //   //  encrypt shards info
  //   const shards = rawShards.map(shard => cF.aesEncrypt(shard, userData.csk).encryptedHex);
  //   //  create sha256 signature
  // eslint-disable-next-line max-len
  //   const signature = bitcoin.crypto.sha256(Buffer.from(`${file.name}${file.size}${file.timestamp}${userData.cpk}`)).toString('hex');
  //   //  shards addresses array
  //   const shardsAddresses = digestServers.map(v => `${v}/${userData.cpk}`);
  //   //  shards upload requests array
  //   const shardsReq = digestServers.map((url, index) => {
  //     const data = {
  //       data: {
  //         name: `${cF.aesEncrypt(file.name, userData.csk).encryptedHex}.${index}`,
  //         content: shards[index]
  //       }
  //     };
  //     return axios.post(`${url}/${userData.cpk}/put`, data);
  //   });
  //   //  axios requests
  //   axios.all([
  //     axios.get(`${RAFT_URL}/${userData.cpk}`),
  //     ...shardsReq
  //   ])
  //     .then(axios.spread(res1 => {
  //       // when all shards are uploaded - update user raft object
  //       updRaft(res1.data, signature, shardsAddresses, file);
  //     }))
  //     .then(() => console.log('send is end'))
  //     .catch(reason => console.log(reason));
  // });
  // eslint-disable-next-line no-trailing-spaces

  //  async way
  const updRaft = (defaultObj, filename, fileInfo) => {
    const updateObj = defaultObj[userData.cpk]
      ? {
        ...defaultObj,
        [userData.cpk]: JSON.stringify({
          ...JSON.parse(defaultObj[userData.cpk]),
          [filename]: fileInfo
        })
      }
      : {
        ...defaultObj,
        [userData.cpk]: JSON.stringify({
          [filename]: fileInfo
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
  const filesPromise = _.map(files, file => new Promise(resolve => {
    const rawShards = cF.fileCrushing(file);
    const shards = rawShards.map(shard => cF.aesEncrypt(shard, userData.csk).encryptedHex);
    resolve({ file, shards });
  }));
  Promise.all(filesPromise)
    .then(results => (
      results.map(({ file, shards }) => {
        //  create sha256 signature
        const signature = bitcoin.crypto.sha256(Buffer.from(`${file.name}${file.size}${file.timestamp}${userData.cpk}`)).toString('hex');
        //  shards addresses array
        const shardsAddresses = digestServers.map(v => `${v}/${userData.cpk}`);
        const filename = file.name;
        //  aes info
        const fileInfo = {
          size: file.size,
          timestamp: file.timestamp,
          signature,
          shardsAddresses
        };
        return {
          filename,
          fileInfo,
          shards,
          shardsAddresses
        };
      })
    ))
    .then(resultsArray => (
      resultsArray.map(fileCred => {
        const requests = fileCred.shardsAddresses.map((url, index) => {
          const data = {
            data: {
              name: `${cF.aesEncrypt(fileCred.filename, userData.csk).encryptedHex}.${index}`,
              content: fileCred.shards[index]
            }
          };
          return { url: `${url}/put`, data };
        });
        //  aes name
        const filename = cF.aesEncrypt(fileCred.filename, userData.csk).encryptedHex;
        //  aes info
        const fileInfo = cF.aesEncrypt(JSON.stringify(fileCred.fileInfo), userData.csk)
          .encryptedHex;
        return {
          requests,
          filename,
          fileInfo
        };
      })
    ))
    .then(reqsArray => (
      reqsArray.map((res, i) => (
        setTimeout(() => {
          const reqs = res.requests.map(({ url, data }) => axios.post(url, data));
          return axios.all([
            axios.get(`${RAFT_URL}/${userData.cpk}`),
            ...reqs
          ])
            .then(axios.spread(res1 => {
              // when all shards are uploaded - update user raft object
              updRaft(res1.data, res.filename, res.fileInfo);
            }))
            .catch(reason => console.log(reason));
        }, ((i + 1) * 1000))
      ))
    ))
    .catch(error => console.log(error));
});

ipcMain.on('file:compile', (event, { userData, filename }) => {
  axios.get(`${RAFT_URL}/${userData.cpk}`)
    .then(response => {
      const fileList = {
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
      return new Promise(resolve => (
        setTimeout(() => (
          axios.all(shardsReq)
            .then(ress => resolve(ress))
            .catch(error => console.log(error))
        ), 100)
      ));
    })
    .then(responses => {
      const shards = responses.map(res => cF.aesDecrypt(res.data, userData.csk).strData);
      const base64File = shards.join('');
      // eslint-disable-next-line promise/always-return
      if (base64File) {
        mainWindow.webContents.send('file:receive', base64File);
      }
    })
    .catch(error => console.log(error));
});

ipcMain.on('file:delete', (event, { userData, filename }) => {
  axios.get(`${RAFT_URL}/${userData.cpk}`)
    //  user raft object
    // eslint-disable-next-line promise/always-return
    .then(response => {
      let updateObj = {
        ...response.data
      };
      //  aes name
      const encName = cF.aesEncrypt(filename, userData.csk).encryptedHex;
      const userObj = JSON.parse(updateObj[userData.cpk]);
      const decData = JSON.parse(cF.aesDecrypt(userObj[encName], userData.csk).strData);
      const removeReqs = decData.shardsAddresses.map((req, i) => axios.delete(`${req}/files/${encName}.${i}`));
      return new Promise(resolve => (
        setTimeout(() => (
          axios.all(removeReqs)
            .then(() => {
              delete userObj[encName];
              updateObj = {
                ...updateObj,
                [userData.cpk]: JSON.stringify(userObj)
              };
              return updateObj;
            })
            .then(uObj => resolve(uObj))
            .catch(error => console.log(error))
        ), 100)
      ))
        .then(uObj => new Promise((resolve, reject) => (
          setTimeout(() => (
            axios.post(`${RAFT_URL}/${userData.cpk}`, uObj)
              .then(() => resolve(mainWindow.webContents.send('file:deleted')))
              .catch(error => reject(error.response))
          ), 100)
        )))
        .catch(error => console.log(error));
    })
    .catch(error => console.log(error));
});

ipcMain.on('file:transfer', (event, { userData, filename, to }) => {
  console.log(filename, to);
  // //  user raft object
  // let updateObj = {};
  // axios.get(`${RAFT_URL}/${userData.cpk}`)
  // // eslint-disable-next-line promise/always-return
  //   .then(response => {
  //     updateObj = {
  //       ...updateObj,
  //       ...response.data
  //     };
  //   })
  //   .catch(error => console.log(error));
});
