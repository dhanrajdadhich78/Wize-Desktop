const _ = require('lodash');
const axios = require('axios');
const bitcoin = require('bitcoinjs-lib');
const cF = require('../utils/commonFunc');
const { ipcMain, dialog } = require('electron');

const filesListeners = mainWindow => {
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
      .catch(error => dialog.showErrorBox('Error', error.response.data))
  ));
  //  send files listener
  ipcMain.on('file:send', (event, { userData, files, digestServers, raftNode }) => {
    const threeUrls = digestServers.slice(0, 3);
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
          axios.post(raftNode, updateObj)
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
          const shardsAddresses = threeUrls.map(v => `${v}/${userData.cpk}`);
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
      .then(reqsArray => {
        return reqsArray.map((res, i) => (
          setTimeout(() => {
            const reqs = res.requests.map(({url, data}) => axios.post(url, data));
            return Promise.all([
              axios.get(`${raftNode}/${userData.cpk}`),
              ...reqs
            ])
              .then(results => updRaft(results[0].data, res.filename, res.fileInfo))
              .catch(reason => {
                console.log(reason.response);
                dialog.showErrorBox('Error', reason.response.data);
              });
          }, ((i + 1) * 1000))
        ));
      })
      .catch(error => dialog.showErrorBox('Error', error.response.data));
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
              .catch(error => dialog.showErrorBox('Error', error.response.data))
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
      .catch(error => dialog.showErrorBox('Error', error.response.data))
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
              .catch(error => dialog.showErrorBox('Error', error.response.data))
          ), 100)
        ))
          .then(uObj => new Promise((resolve, reject) => (
            setTimeout(() => (
              axios.post(`${raftNode}/${userData.cpk}`, uObj)
                .then(() => resolve(mainWindow.webContents.send('file:removed')))
                .catch(error => reject(error.response))
            ), 100)
          )))
          .catch(error => dialog.showErrorBox('Error', error.response.data));
      })
      .catch(error => dialog.showErrorBox('Error', error.response.data))
  ));
};

export default filesListeners;
