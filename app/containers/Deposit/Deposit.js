import React, { Component } from 'react';

import classes from './Deposit.css';

import DepositWallet from '../../components/PagesSections/DepositWallet/DepositWallet';
import FilesInfoPanel from '../../components/PagesSections/FilesList/FilesInfoPanel/FilesInfoPanel';

class Deposit extends Component {
  render() {
    return (
      <div className={classes.Deposit}>
        <div className={classes.ContentWrapper}>
          <DepositWallet />
        </div>
        <FilesInfoPanel />
      </div>
    );
  }
}

export default Deposit;
