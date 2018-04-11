/* eslint-disable promise/catch-or-return,object-curly-newline */
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
const _ = require('lodash');
const axios = require('axios');
const isOnline = require('is-online');

const cF = require('./electron/commonFunc');
const { DIGEST_URL, BLOCKCHAIN_URL } = require('./utils/const');
const { app, BrowserWindow, ipcMain } = require('electron');
const MenuBuilder = require('./menu');

const configFolder = process.platform !== 'win32' ? `${process.cwd()}/.wizeconfig` : `${process.cwd()}\\wizeconfig`;

let mainWindow;
let cpkGlob;

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
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    await installExtensions();
  }
  mainWindow = new BrowserWindow({
    show: false,
    width: 1048,
    height: 600,
    minWidth: 1048,
    minHeight: 600
  });
  mainWindow.on('closed', () => {
    if (cpkGlob) {
      cF.unmountFs(cpkGlob, app.quit);
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
  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();
});
// listener, that unmounts fs
ipcMain.on('fs:unmount', () => (cpkGlob ? cF.unmountFs(cpkGlob) : null));
//  listener, that check if user internet connection is available
ipcMain.on('internet-connection:check', () => (
  isOnline()
    .then(online => mainWindow.webContents.send('internet-connection:status', online))
));
//  listener, that scan default credential folder on users machine
ipcMain.on('credentials-files-list:scan', () => {
  if (cF.ensureDirectoryExistence(configFolder)) {
    const files = fs.readdirSync(configFolder);
    const credFiles = files.map(file => (
      !file.indexOf('credentials')
        ? file
        : null
    ));
    const credentials = cF.cleanArray(credFiles);
    return mainWindow.webContents.send('credentials-files-list:get', credentials);
  }

  return false;
});
//  on credentials generate listener
ipcMain.on('registration:start', (event, password) => (
  setTimeout(() => axios.post(`${BLOCKCHAIN_URL}/wallet/new`, {})
    .then(({ data }) => ({
      address: data.address,
      cpk: data.pubkey,
      csk: data.privkey
    }))
    .then(userData => {
      const strData = JSON.stringify(userData);
      //  save to file
      // eslint-disable-next-line promise/always-return
      if (cF.ensureDirectoryExistence(configFolder)) {
        const aes = cF.aesEncrypt(strData, password, 'hex');
        const files = fs.readdirSync(configFolder);
        const credFiles = files.map(file => (
          !file.indexOf('credentials')
            ? file
            : null
        ));
        const credArr = cF.cleanArray(credFiles);
        fs.writeFile(`${configFolder}/credentials-${credArr.length}.bak`, aes.encryptedHex, err => {
          if (err) {
            throw new Error(err);
          }
          mainWindow.webContents.send('registration:complete', strData);
        });
      }
    })
    .catch(error => { throw new Error(error); }), 100)
));
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
      throw new Error(err);
    }
    encryptedHex = data;
    if (!encryptedHex) {
      throw new Error('There is no credentials file');
    } else {
      const decrypt = cF.aesDecrypt(encryptedHex, password, 'hex');
      //  remember cpk of user
      cpkGlob = JSON.parse(decrypt.strData).cpk;
      // on user data decryption and mounting fs - give userData to react part
      mainWindow.webContents.send('auth:complete', decrypt.strData);
    }
  });
});
ipcMain.on('fs:mount', (event, fsUrl) => {
  const origin = cpkGlob;
  let reqs = [];
  let reqs2 = [];
  if (fsUrl[0] === fsUrl[2]) {
    reqs = [
      axios.post(fsUrl[0], { data: { origin } })
    ];
    reqs2 = [
      axios.post(`${fsUrl[0]}/${origin}/mount`, { data: { origin } })
    ];
  } else {
    reqs = fsUrl.map(url => axios.post(url, { data: { origin } }));
    reqs2 = fsUrl.map(url => axios.post(`${url}/${origin}/mount`, { data: { origin } }));
  }
  // user origin create and mount requests
  return setTimeout(() => axios.all(reqs)
    .then(() => (setTimeout(() => axios.all(reqs2)
      .then(() => mainWindow.webContents.send('fs:mounted'))
      .catch(error => console.log(error.response)), 100)
    ))
    .catch(error => {
      if (error.response.status === 500) {
        return setTimeout(() => axios.all(reqs2)
          .then(() => mainWindow.webContents.send('fs:mounted'))
          .catch(err => {
            if (err.response.status === 500) {
              mainWindow.webContents.send('fs:mounted');
            } else {
              console.log(err.response.message);
            }
          }), 100);
      }
      console.log(error.response);
    }), 100);
});
//  get network digest listener
ipcMain.on('digest:get', (event, { userData, password }) => {
  const reqData = {
    data: {
      address: userData.address,
      pubKey: userData.cpk,
      AES: cF.getHash(password)
    }
  };
  return axios.post(`${DIGEST_URL}/hello/application`, reqData)
    .then(({ data }) => mainWindow.webContents.send('digest:success', data))
    .catch(err => { throw new Error(err); });
});
//  get my files list listener
ipcMain.on('file:list', (event, { userData, raftNode }) => (
  axios.get(`${raftNode}/${userData.cpk}`)
    .then((response) => {
      let filesList = [];
      // eslint-disable-next-line promise/always-return
      if (response.data[userData.cpk].length && Object.keys(response.data)) {
        const encryptedData = JSON.parse(response.data[userData.cpk]);
        const rawFileNames = Object.keys(encryptedData).map(key => {
          if (key.length > 3) {
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
    .catch(error => { throw new Error(error); })
));
//  send files listener
ipcMain.on('file:send', (event, { userData, files, digestServers, raftNode }) => {
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
    return new Promise((resolve, reject) => {
      setTimeout(() => (
        axios.post(`${raftNode}/${userData.cpk}`, updateObj)
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
  return Promise.all(filesPromise)
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
            axios.get(`${raftNode}/${userData.cpk}`),
            ...reqs
          ])
            .then(axios.spread(res1 => {
              // when all shards are uploaded - update user raft object
              updRaft(res1.data, res.filename, res.fileInfo);
            }))
            .catch(reason => { throw new Error(reason); });
        }, ((i + 1) * 1000))
      ))
    ))
    .catch(error => { throw new Error(error); });
});
//  on file download listener
ipcMain.on('file:compile', (event, { userData, filename, raftNode }) => (
  axios.get(`${raftNode}/${userData.cpk}`)
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
            .catch(error => { throw new Error(error); })
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
    .catch(error => { throw new Error(error); })
));
//  on file remove listener
ipcMain.on('file:remove', (event, { userData, filename, raftNode }) => (
  axios.get(`${raftNode}/${userData.cpk}`)
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
            .catch(error => { throw new Error(error); })
        ), 100)
      ))
        .then(uObj => new Promise((resolve, reject) => (
          setTimeout(() => (
            axios.post(`${raftNode}/${userData.cpk}`, uObj)
              .then(() => resolve(mainWindow.webContents.send('file:removed')))
              .catch(error => reject(error.response))
          ), 100)
        )))
        .catch(error => { throw new Error(error); });
    })
    .catch(error => { throw new Error(error); })
));
//  on blockchain wallet check listener
ipcMain.on('blockchain:wallet-check', (event, { address, bcNode }) => (
  setTimeout(() => axios.get(`${bcNode}/wallet/${address}`)
    .then(({ data }) => (
      // mainWindow.webContents.send('blockchain:wallet-checked', JSON.stringify(data))
      event.sender.send('blockchain:wallet-checked', JSON.stringify(data))
    ))
    .catch(error => {
      throw new Error(error.respose.data);
    }), 100)
));
//  on create prepare and create transaction listener
ipcMain.on('transaction:create', (event, { userData, to, amount, minenow, bcNode }) => {
  const prepData = {
    from: userData.address,
    to,
    amount: parseInt(amount, 10),
    minenow
  };

  return setTimeout(() => (
    axios.post(`${bcNode}/send`, prepData)
      .then(() => mainWindow.webContents.send('transaction:done'))
      .catch(error => { throw new Error(error); })
  ), 100);
});
