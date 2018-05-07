/* eslint-disable object-curly-newline */
const axios = require('axios');
const { ipcMain, dialog } = require('electron');

const wallet = require('../utils/wallet');

const bc = mainWindow => {
  //  on blockchain wallet check listener
  ipcMain.on('blockchain:wallet-check', (event, { address, bcNode }) => (
    setTimeout(() => axios.get(`${bcNode}/wallet/${address}`)
      .then(({ data }) => (
        // mainWindow.webContents.send('blockchain:wallet-checked', JSON.stringify(data))
        event.sender.send('blockchain:wallet-checked', JSON.stringify(data))
      ))
      .catch(error => dialog.showErrorBox('Error', error.response.data)), 100)
  ));
  //  on create prepare and create transaction listener
  ipcMain.on('transaction:create', (event, { userData, to, amount, minenow, bcNode }) => {
    // work version
    // TODO: to replace pubkey with pubkeyhash
    if (!wallet.validateAddress(to)) {
      mainWindow.webContents.send('transaction:done');
      dialog.showErrorBox('Error', 'Entered address is not valid');
      return;
    }
    const prepData = {
      from: userData.address,
      to,
      amount: parseInt(amount, 10),
      pubkey: userData.cpk
    };
    return setTimeout(() => (
      axios.post(`${bcNode}/prepare`, prepData)
        .then(({ data }) => {
          const signatures = data.hashes.map(transactionHash => (
            wallet.ecdsaSign(transactionHash, userData.csk)
          ));
          return {
            // from: userData.address,
            txid: data.txid,
            minenow,
            signatures
          };
        })
        .then(sendData => {
          const prom = new Promise((resolve, reject) => {
            setTimeout(() => (
              axios.post(`${bcNode}/sign`, sendData)
                .then(resp => resolve(resp.data))
                .catch(error => reject(error.response))
            ), 100);
          });
          return prom
            .then(d => console.log(d))
            .catch(error => dialog.showErrorBox('Error', error.response.data));
        })
        .then(() => mainWindow.webContents.send('transaction:done'))
        .catch(error => dialog.showErrorBox('Error', error.response.data))
    ), 100);
  });
};

export default bc;
