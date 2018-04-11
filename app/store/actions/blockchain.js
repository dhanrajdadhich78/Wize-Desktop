import { ipcRenderer } from 'electron';

import * as actionTypes from './actionTypes';


const getBalanceStart = (address, bcNode) => {
  // console.log(address, bcNode);
  ipcRenderer.send('blockchain:wallet-check', { address, bcUrl: bcNode });
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
  ipcRenderer.on('blockchain:wallet-checked', (event, data) => {
    dispatch(getBalanceSuccess(JSON.parse(data)));
  });
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
