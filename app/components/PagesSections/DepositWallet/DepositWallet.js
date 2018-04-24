import React from 'react';

import classes from './DepositWallet.css';

import Deposit from './Deposit/Deposit';
import RateCalc from './RateCalc/RateCalc';

const depositWallet = props => (
  <div className={classes.DepositWallet}>
    <Deposit />
    <RateCalc />
  </div>
);

export default depositWallet;
