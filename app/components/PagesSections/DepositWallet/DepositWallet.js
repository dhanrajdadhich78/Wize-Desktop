import React from 'react';
import PropTypes from 'prop-types';

import classes from './DepositWallet.css';

import Deposit from './Deposit/Deposit';
import RateCalc from './RateCalc/RateCalc';

const depositWallet = props => (
  <div className={classes.DepositWallet}>
    <Deposit
      depositPlanSelect={props.depositPlanSelect}
      handleDepositPlanChange={val => props.handleDepositPlanChange(val)}
    />
    <RateCalc
      calculator={props.calculator}
      handleCalculatorFieldChange={(val, key) => props.handleCalculatorFieldChange(val, key)}
    />
  </div>
);

depositWallet.propTypes = {
  depositPlanSelect: PropTypes.shape().isRequired,
  handleDepositPlanChange: PropTypes.func.isRequired,
  calculator: PropTypes.shape().isRequired,
  handleCalculatorFieldChange: PropTypes.func.isRequired
};

export default depositWallet;
