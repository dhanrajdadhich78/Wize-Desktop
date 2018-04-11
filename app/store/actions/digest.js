import { ipcRenderer } from 'electron';

import * as actionTypes from './actionTypes';

import { getBalance } from './index';

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
  ipcRenderer.on('digest:success', (event, data) => {
    dispatch(getDigestSuccess(data));
    const fsNodes = data.storageNodes.map(item => `http://${item}:13000/buckets`);
    const bcNode = `http://${data.bcNodes[0]}:4000`;
    dispatch(getBalance(userData.address, bcNode));
    ipcRenderer.send('fs:mount', fsNodes);
  });
};
