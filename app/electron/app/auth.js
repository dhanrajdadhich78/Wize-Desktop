/* eslint-disable max-len */
const { ipcMain } = require('electron');

const cF = require('../utils/commonFunc');
const wallet = require('../utils/wallet');


const auth = mainWindow => {
  //  on credentials generate listener
  ipcMain.on('registration:start', (event, password) => {
    //  create user data with wallet service
    const userData = wallet.newCredentials();
    const strData = JSON.stringify(userData);
    const encryptedData = cF.aesEncrypt(strData, password, 'hex').encryptedHex;
    return mainWindow.webContents.send('registration:complete', encryptedData);
    //  save to file
    // if (cF.ensureDirectoryExistence(configFolder)) {
    //   const aes = cF.aesEncrypt(strData, password, 'hex');
    //   fs.readdir(configFolder, (error, files) => {
    //     if (error) {
    //       dialog.showErrorBox('Error', error);
    //     }
    //     const credFiles = files.map(file => (
    //       !file.indexOf('credentials')
    //         ? file
    //         : null
    //     ));
    //     const credArr = cF.cleanArray(credFiles);
    //     fs.writeFile(`${configFolder}/credentials-${credArr.length}.bak`, aes.encryptedHex, err => {
    //       if (err) {
    //         dialog.showErrorBox('Error', err);
    //       }
    //       mainWindow.webContents.send('registration:complete', strData);
    //     });
    //   });
    // }
  });

  // //  on auth listener
  // ipcMain.on('auth:start', (event, { password, filePath }) => {
  //   let encryptedHex;
  //   // eslint-disable-next-line comma-spacing
  //   let credFilePath = process.platform !== 'win32' ? filePath : filePath.replace(/\\/gi,'/');
  //   if (credFilePath.indexOf('/') < 0 || !credFilePath) {
  //     credFilePath = `${configFolder}/${filePath}`;
  //   }
  //   return fs.readFile(credFilePath, (err, data) => {
  //     if (err) {
  //       dialog.showErrorBox('Error', err);
  //     }
  //     encryptedHex = data;
  //     if (!encryptedHex) {
  //       dialog.showErrorBox('Error', 'There is no credentials file');
  //       return;
  //     }
  //     const decrypt = cF.aesDecrypt(encryptedHex, password, 'hex');
  //
  //     //  send cpk of user to main func
  //     cpkGlob = JSON.parse(decrypt.strData).cpk;
  //
  //     // on user data decryption and mounting fs - give userData to react part
  //     mainWindow.webContents.send('auth:complete', decrypt.strData);
  //   });
  // });

  // decrypt credentials with password
  ipcMain.on('credentials:decrypt', (event, { string, password }) => {
    const credentials = cF.aesDecrypt(string, password, 'hex').strData;
    return mainWindow.webContents.send('credentials:decrypt-complete', credentials);
  });
};

export default auth;
