import { ipcRenderer } from 'electron';

import * as actionTypes from './actionTypes';


const getDigestStart = (userData, password) => {
  ipcRenderer.send('digest:get', { userData, password });
  return {
    type: actionTypes.GET_DIGEST_START
  };
};

const getDigestSuccess = digestInfo => ({
  type: actionTypes.GET_DIGEST_SUCCESS,
  digestInfo
});

// const getDigestFail = () => ();

// eslint-disable-next-line import/prefer-default-export
export const getDigest = (userData, password) => dispatch => {
  dispatch(getDigestStart(userData, password));
  ipcRenderer.on('digest:success', (event, data) => dispatch(getDigestSuccess(data)));
};
