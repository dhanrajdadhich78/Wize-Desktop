const axios = require('axios');
const { /* app, BrowserWindow, */ ipcMain, dialog } = require('electron');
const cF = require('../utils/commonFunc');

const ghostPad = (mainWindow) => {
  ipcMain.on('get-notes:start', (event, { userData, raftNode }) => {
    const key = `${userData.cpk}_gpd`;
    return axios.get(`${raftNode}/key/${key}`)
      .then(({ data }) => {
        console.log(data[key]);
        const notes = data[key] ? cF.aesDecrypt(data[key], userData.csk).strData : [];
        console.log(notes);
        return mainWindow.webContents.send('get-notes:complete', notes);
      })
      .catch(({response}) => {
        console.log(response.data);
        return dialog.showErrorBox('Error', response.data);
      });
  });

  ipcMain.on('create-note:start', (event, { note, userData, raftNode }) => {
    // console.log('start', JSON.stringify(note), JSON.stringify(userData), raftNode);
    const key = `${userData.cpk}_gpd`;
    console.log(`${userData.cpk}_gpd`);
    return axios.get(`${raftNode}/key/${key}`)
      .then(({ data }) => (data[key] ? cF.aesDecrypt(data[key], userData.csk).strData : []))
      .then(rawData => {
        console.log('2', rawData);
        return cF.aesEncrypt([
          note,
          ...rawData
        ], userData.csk).encryptedHex;
      })
      .then(prepData => {
        console.log('3', JSON.stringify({ [key]: prepData }));
        // return axios.post(`${raftNode}/key`, { [key]: prepData });
        return new Promise((resolve, reject) => {
          setTimeout(() => (
            axios.post(`${raftNode}/key`, { [key]: prepData })
              .then(resp => resolve(resp.data))
              .catch(error => reject(error.response))
          ), 100);
        });
      })
      .then(() => mainWindow.webContents.send('create-note:complete'))
      .catch(({ response }) => {
        console.log(response.data);
        return dialog.showErrorBox('Error', response.data);
      });
  });

  ipcMain.on('delete-note:start', (event, { id, userData, raftNode }) => {
    const key = `${userData.cpk}_gpd`;
    return axios.get(`${raftNode}/key/${userData.cpk}_gpd`)
      .then(({data}) => (data[key] ? cF.aesDecrypt(data[key], userData.csk).strData : []))
      .then(data => cF.aesEncrypt(data.filter(el => el.id !== id), userData.csk).encryptedHex)
      .then(prepData => axios.post(`${raftNode}/key`, { key: prepData }))
      .then(() => mainWindow.webContents.send('delete-note:complete'))
      .catch(({response}) => {
        console.log(response.data);
        return dialog.showErrorBox('Error', response.data);
      });
  });
};

export default ghostPad;
