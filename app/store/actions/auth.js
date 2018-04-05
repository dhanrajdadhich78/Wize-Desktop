import { ipcRenderer } from 'electron';

import * as actionTypes from './actionTypes';
import { getBallance, getDigest } from './index';

const regStart = password => {
  ipcRenderer.send('registration:start', password);
  return { type: actionTypes.REGISTRATION_START };
};

const regSuccess = userData => () => ({
  type: actionTypes.REGISTRATION_SUCCESS,
  userData
});

// export  const regFail = error => ({
//   type: actionTypes.REGISTRATION_FAIL,
//   error
// });

export const registration = (password, filePath) => dispatch => {
  dispatch(regStart(password));
  ipcRenderer.on('registration:complete', (event, userData) => {
    dispatch(regSuccess(JSON.parse(userData)));
    dispatch(auth(password, filePath));
  });
  // ipcRenderer.on('registration:error', (event, error) => dispatch(regFail(error)));
};

const authStart = (password, filePath) => {
  ipcRenderer.send('auth:start', { password, filePath });
  return { type: actionTypes.AUTH_START };
};

const authSuccess = userData => ({
  type: actionTypes.AUTH_SUCCESS,
  userData
});

// const authFail = error => ({
//   type: actionTypes.AUTH_FAIL,
//   error
// });

export const auth = (password, filePath) => dispatch => {
  dispatch(authStart(password, filePath));
  ipcRenderer.on('auth:complete', (event, userData) => {
    dispatch(authSuccess(JSON.parse(userData)));
    dispatch(getDigest(userData, password));
    dispatch(getBallance(JSON.parse(userData).address));
  });
  // ipcRenderer.on('auth:error', (event, error) => dispatch(authFail(error)));
};

export const logout = () => ({
  type: actionTypes.AUTH_LOGOUT
});
