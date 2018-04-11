import { ipcRenderer } from 'electron';

import * as actionTypes from './actionTypes';


const getBalanceStart = (address, bcNode) => dispatch => {
  ipcRenderer.send('blockchain:wallet-check', { address, bcNode });
  ipcRenderer.once('blockchain:wallet-checked', (event, data) => {
    console.log(data);
    dispatch(getBalanceSuccess(JSON.parse(data)));
    ipcRenderer.removeAllListeners('blockchain:wallet-check');
  });
  return {
    type: actionTypes.GET_BALANCE_START
  };
};

const getBalanceSuccess = data => ({
  type: actionTypes.GET_BALANCE_SUCCESS,
  balance: data.credit,
  success: data.success
});

// const getBalanceFail = () => ();

// eslint-disable-next-line import/prefer-default-export
export const getBalance = (address, bcNode) => dispatch => {
  dispatch(getBalanceStart(address, bcNode));
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
