import { ipcRenderer } from 'electron';

import * as actionTypes from './actionTypes';
import { getDigest } from './index';

const regStart = (password) => {
  ipcRenderer.send('registration:start', password);
  return { type: actionTypes.REGISTRATION_START };
};

const regSuccess = encryptedData => ({
  type: actionTypes.REGISTRATION_SUCCESS,
  encryptedData
});

export const registration = password => dispatch => {
  dispatch(regStart(password));
  ipcRenderer.once('registration:complete', (event, encryptedData) => dispatch(regSuccess(encryptedData)));
};

const authStart = (password, filePath) => {
  ipcRenderer.send('auth:start', { password, filePath });
  return { type: actionTypes.AUTH_START };
};

export const authSuccess = userData => ({
  type: actionTypes.AUTH_SUCCESS,
  userData
});

export const auth = (password, filePath) => dispatch => {
  dispatch(authStart(password, filePath));
  ipcRenderer.once('auth:complete', (event, userData) => {
    dispatch(getDigest(JSON.parse(userData), password));
    ipcRenderer.once('fs:mounted', () => {
      dispatch(authSuccess(JSON.parse(userData)));
    });
  });
};

export const logout = () => ({
  type: actionTypes.AUTH_LOGOUT
});
