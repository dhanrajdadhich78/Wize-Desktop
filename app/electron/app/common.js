const fs = require('fs');
const isOnline = require('is-online');
const { ipcMain } = require('electron');

const cF = require('../utils/commonFunc');

const common = (mainWindow, configFolder) => {
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
};

export default common;
