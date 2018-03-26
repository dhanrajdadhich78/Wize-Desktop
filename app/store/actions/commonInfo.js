import { ipcRenderer } from 'electron';

import * as actionTypes from '../actions/actionTypes';

const getCredFilesListStart = () => {
  ipcRenderer.send('credentials-files-list:scan');
  return { type: actionTypes.NET_CHECK_START };
};

const getCredFilesListSuccess = () => ({ type: actionTypes.NET_CHECK_SUCCESS });

const getCredFilesListFail = () => ({ type: actionTypes.NET_CHECK_FAIL });

// eslint-disable-next-line import/prefer-default-export
export const getCredFilesList = () => dispatch => {
  dispatch(getCredFilesListStart());
  ipcRenderer.on('credentials-files-list:get', (event, online) => (
    // online
    //   ? dispatch(getCredFilesListSuccess())
    //   : dispatch(getCredFilesListFail())
  ));
};

const ckeckInternetStart = () => {
  ipcRenderer.send('internet-connection:check');
  return { type: actionTypes.NET_CHECK_START };
};

const checkInternetSuccess = () => ({ type: actionTypes.NET_CHECK_SUCCESS });

const checkInternetFail = () => ({ type: actionTypes.NET_CHECK_FAIL });

// eslint-disable-next-line import/prefer-default-export
export const checkInternet = () => dispatch => {
  dispatch(ckeckInternetStart());
  ipcRenderer.on('internet-connection:status', (event, online) => (
    online
      ? dispatch(checkInternetSuccess())
      : dispatch(checkInternetFail())
  ));
};

// const ckeckBlockchainStart = () => ();
//
// const checkBlockchainSuccess = () => ();
//
// const checkBlockchainFail = () => ();
//
// const checkBlockchain = () => {
//
// };
