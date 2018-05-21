const axios = require('axios');
const { ipcMain, dialog } = require('electron');

const cF = require('../utils/commonFunc');
const { DIGEST_URL } = require('../../utils/const');

const digest = mainWindow => {
  //  get network digest listener
  ipcMain.on('digest:get', (event, { userData, password }) => {
    // if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    //   const data = {
    //     bcNodes: [
    //       'http://127.0.0.1:4000',
    //       'http://127.0.0.1:4000',
    //       'http://127.0.0.1:4000'
    //     ],
    //     raftNodes: [
    //       'http://127.0.0.1:11001',
    //       'http://127.0.0.1:11001',
    //       'http://127.0.0.1:11001'
    //     ],
    //     storageNodes: [
    //       'http://127.0.0.1:13000',
    //       'http://127.0.0.1:13001',
    //       'http://127.0.0.1:13002'
    //     ],
    //     spaceleft: 0,
    //     totalNodes: 0,
    //     suspicious: 0
    //   };
    //   mainWindow.webContents.send('digest:success', data);
    // } else {
    //   const reqData = {
    //     address: userData.address,
    //     pubKey: userData.cpk,
    //     AES: cF.getHash(password)
    //   };
    //   return axios.post(`${DIGEST_URL}/hello/application`, reqData)
    //     .then(({ data }) => mainWindow.webContents.send('digest:success', data))
    //     .catch(({ response }) => {
    //       if (response.data.message === 'PrivKey is empty') {
    //         axios.post(`${DIGEST_URL}/hello/application`, {
    //           ...reqData,
    //           PrivKey: userData.csk
    //         })
    //           .then(({ data }) => mainWindow.webContents.send('digest:success', data))
    //           .catch(({ res }) => {
    //             console.log(res.data);
    //             return dialog.showErrorBox('Error', res.data.message);
    //           });
    //       } else {
    //         console.log(response.data);
    //         dialog.showErrorBox('Error', response.data.message);
    //       }
    //     });
    // }

    const reqData = {
      address: userData.address,
      pubKey: userData.cpk,
      AES: cF.getHash(password)
    };
    return axios.post(`${DIGEST_URL}/hello/application`, reqData)
      .then(({ data }) => mainWindow.webContents.send('digest:success', data))
      .catch(({ response }) => {
        if (response.data.message === 'PrivKey is empty') {
          axios.post(`${DIGEST_URL}/hello/application`, {
            ...reqData,
            PrivKey: userData.csk
          })
            .then(({ data }) => mainWindow.webContents.send('digest:success', data))
            .catch(({ res }) => {
              console.log(res.data);
              return dialog.showErrorBox('Error', res.data.message);
            });
        } else {
          console.log(response.data);
          dialog.showErrorBox('Error', response.data.message);
        }
      });
  });
};

export default digest;
