import { ipcRenderer } from 'electron';

import * as actionTypes from '../actions/actionTypes';

// const getCredFilesListStart = () => dispatch => {
//   ipcRenderer.send('credentials-files-list:scan');
//   ipcRenderer.once('credentials-files-list:get', (event, credentials) => (
//     dispatch(getCredFilesListSuccess(credentials))
//   ));
//   return { type: actionTypes.GET_CRED_FILES_LIST_START };
// };
//
// const getCredFilesListSuccess = credentials => ({
//   type: actionTypes.GET_CRED_FILES_LIST_SUCCESS,
//   credentials
// });
//
// export const getCredFilesList = () => dispatch => {
//   dispatch(getCredFilesListStart());
// };

const ckeckInternetStart = () => {
  ipcRenderer.send('internet-connection:check');
  return { type: actionTypes.NET_CHECK_START };
};

const checkInternetSuccess = () => ({ type: actionTypes.NET_CHECK_SUCCESS });

const checkInternetFail = () => ({ type: actionTypes.NET_CHECK_FAIL });

// eslint-disable-next-line import/prefer-default-export
export const checkInternet = () => dispatch => {
  dispatch(ckeckInternetStart());
  ipcRenderer.once('internet-connection:status', (event, online) => (
    online
      ? dispatch(checkInternetSuccess())
      : dispatch(checkInternetFail())
  ));
};
