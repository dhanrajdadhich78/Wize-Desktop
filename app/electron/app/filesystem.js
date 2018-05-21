/* eslint-disable indent */
const { ipcMain } = require('electron');
const cF = require('../utils/commonFunc');

const filesystem = (mainWindow, cpkGlob, fsUrlGlob) => {
  //  listener, that unmounts fs
  ipcMain.on('fs:unmount', () => (cpkGlob ? cF.unmountFs(cpkGlob, fsUrlGlob) : null));
  // //  fs mounting
  // ipcMain.on('fs:mount', (event, fsUrl) => {
  //   const origin = cpkGlob;
  //   const threeUrls = fsUrl.slice(0, 3);
  //   //  send fs url of user to main func
  //   fsUrlGlob = threeUrls;
  //   let reqs = [];
  //   let reqs2 = [];
  //   if (threeUrls[0] === threeUrls[2]) {
  //     reqs = [
  //       axios.post(threeUrls[0], { data: { origin } })
  //     ];
  //     reqs2 = [
  //       axios.post(`${threeUrls[0]}/${origin}/mount`, { data: { origin } })
  //     ];
  //   } else {
  //     reqs = threeUrls.map(url => axios.post(url, { data: { origin } }));
  //     reqs2 = threeUrls.map(url => axios.post(`${url}/${origin}/mount`, { data: { origin } }));
  //   }
  //   // user origin create and mount requests
  //   setTimeout(() => axios.all(reqs)
  //     .then(() => (setTimeout(() => axios.all(reqs2)
  //       // .then(() => mainWindow.webContents.send('fs:mounted'))
  //         .catch(error => console.log(error.response)), 100)
  //     ))
  //     .catch(error => {
  //       if (error.response.status === 500) {
  //         return setTimeout(() => axios.all(reqs2)
  //         // .then(() => mainWindow.webContents.send('fs:mounted'))
  //           .catch(err => {
  //             if (err.response.status === 500) {
  //               // mainWindow.webContents.send('fs:mounted');
  //             } else {
  //               console.log(err.response.message);
  //             }
  //           }), 100);
  //       }
  //       console.log(error.response);
  //     }), 100);
  //
  //   mainWindow.webContents.send('fs:mounted');
  // });
};

export default filesystem;
