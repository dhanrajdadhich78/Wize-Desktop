import { ipcRenderer } from 'electron';

import * as actionTypes from './actionTypes';

export const regStart = password => {
  ipcRenderer.send('registration:start', password);
  return { type: actionTypes.REGISTRATION_START };
};

export const regSuccess = userData => ({
  type: actionTypes.REGISTRATION_SUCCESS,
  userData
});

export const regFail = error => ({
  type: actionTypes.REGISTRATION_FAIL,
  error
});

export const registration = password => dispatch => {
  dispatch(regStart(password));
  ipcRenderer.on('registration:complete', (event, userData) => dispatch(regSuccess(JSON.parse(userData))));
  ipcRenderer.on('registration:error', (event, error) => dispatch(regFail(error)));
};

export const authStart = (password, filePath) => {
  ipcRenderer.send('auth:start', { password, filePath });
  return { type: actionTypes.AUTH_START };
};

export const authSuccess = userData => ({
  type: actionTypes.AUTH_SUCCESS,
  userData
});

export const authFail = error => ({
  type: actionTypes.AUTH_FAIL,
  error
});

export const auth = (password, filePath = null) => dispatch => {
  console.log('auth', password, filePath);
  dispatch(authStart(password, filePath));
  ipcRenderer.on('auth:complete', (event, userData) => dispatch(authSuccess(JSON.parse(userData))));
  ipcRenderer.on('auth:error', (event, error) => dispatch(authFail(error)));
};
