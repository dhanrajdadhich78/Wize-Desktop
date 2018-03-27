import { ipcRenderer } from 'electron';

import * as actionTypes from './actionTypes';


const getBallanceStart = address => {
  ipcRenderer.send('blockchain:wallet-check', address);
  return {
    type: actionTypes.GET_BALLANCE_START
  };
};

const getBallanceSuccess = data => ({
  type: actionTypes.GET_BALLANCE_SUCCESS,
  ballance: data.credit,
  success: data.success
});

// const getBallanceFail = () => ();

// eslint-disable-next-line import/prefer-default-export
export const getBallance = address => dispatch => {
  dispatch(getBallanceStart(address));
  ipcRenderer.on('blockchain:wallet-checked', (event, data) => dispatch(getBallanceSuccess(JSON.parse(data))));
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
