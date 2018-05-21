import React from 'react';
import PropTypes from 'prop-types';

import classes from './Deposit.css';

import Input from '../../../UI/Input/Input';

const deposit = props => (
  <div className={classes.Deposit}>
    <div className={classes.Top}>
      <h3>
        Deposit
      </h3>
      <Input
        type={props.depositPlanSelect.type}
        elementType={props.depositPlanSelect.elementType}
        value={props.depositPlanSelect.value}
        changed={val => props.handleDepositPlanChange(val)}
        elementConfig={props.depositPlanSelect.elementConfig}
      />
    </div>
    <div className={classes.Middle}>
      <input type="text" value="0xa658b225a2c34579963612eea3d61c7755ebf8c6" />
      <button>Copy</button>
      <button>Qr-code</button>
    </div>
    <div className={classes.Bottom}>
      <h3>
        Important
      </h3>
      <p>
        Send only ETH to this deposit address.Sending any other
        currency to this address may result in the loss of
        your deposit.
      </p>
    </div>
  </div>
);

deposit.propTypes = {
  depositPlanSelect: PropTypes.shape().isRequired,
  handleDepositPlanChange: PropTypes.func.isRequired
};

export default deposit;
