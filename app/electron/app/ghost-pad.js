const axios = require('axios');
const { ipcMain, dialog } = require('electron');
const cF = require('../utils/commonFunc');

const ghostPad = mainWindow => {
  ipcMain.on('get-notes:start', (event, { userData, raftNode }) => {
    const key = `${userData.cpk}_gpd`;
    return axios.get(`${raftNode}/key/${key}`)
      .then(({ data }) => {
        const notes = data[key] ? JSON.parse(cF.aesDecrypt(data[key], userData.csk).strData) : [];
        return mainWindow.webContents.send('get-notes:complete', notes);
      })
      .catch(({ response }) => {
        console.log(response.data);
        return dialog.showErrorBox('Error', response.data);
      });
  });

  ipcMain.on('create-note:start', (event, { note, userData, raftNode }) => {
    const key = `${userData.cpk}_gpd`;
    return axios.get(`${raftNode}/key/${key}`)
      .then(({ data }) => (
        data[key]
          ? cF.aesDecrypt(data[key], userData.csk).strData
          : JSON.stringify([])
      ))
      .then(rawData => (
        cF.aesEncrypt(JSON.stringify([
          note,
          ...JSON.parse(rawData)
        ]), userData.csk).encryptedHex
      ))
      .then(prepData => (
        new Promise((resolve, reject) => {
          setTimeout(() => (
            axios.post(`${raftNode}/key`, { [key]: prepData })
              .then(resp => resolve(resp.data))
              .catch(error => reject(error.response.data))
          ), 100);
        })
      ))
      .then(() => mainWindow.webContents.send('create-note:complete'))
      .catch(({ response }) => {
        console.log(response.data);
        return dialog.showErrorBox('Error', response.data);
      });
  });

  ipcMain.on('delete-note:start', (event, { id, userData, raftNode }) => {
    const key = `${userData.cpk}_gpd`;
    return axios.get(`${raftNode}/key/${key}`)
      .then(({ data }) => (
        data[key]
          ? cF.aesDecrypt(data[key], userData.csk).strData
          : JSON.stringify([])
      ))
      .then(rawData => {
        const filteredData = JSON.parse(rawData).filter(el => el.id !== id);
        const strData = JSON.stringify(filteredData);
        return cF.aesEncrypt(strData, userData.csk).encryptedHex;
      })
      .then(prepData => (
        new Promise((resolve, reject) => {
          setTimeout(() => (
            axios.post(`${raftNode}/key`, { [key]: prepData })
              .then(resp => resolve(resp.data))
              .catch(error => reject(error.response.data))
          ), 100);
        })
      ))
      .then(() => mainWindow.webContents.send('delete-note:complete'))
      .catch(({ response }) => {
        console.log(response.data);
        return dialog.showErrorBox('Error', response.data);
      });
  });
};

export default ghostPad;
