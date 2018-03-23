import React from 'react';
import PropTypes from 'prop-types';

import classes from './NetworkHealthInfo.css';

const networkHealthInfo = ({ networkHealth }) => (
  <div className={classes.NetworkHealthInfo}>
    <h3>Network Health</h3>
    <div className={classes.InfoCols}>
      <div className={classes.InfoOne}>
        <span>{networkHealth.suspicious}</span>
        <h3>Suspicious</h3>
      </div>
      <div className={classes.InfoTwo}>
        <span>{networkHealth.total}</span>
        <h3>Total</h3>
      </div>
      <div className={classes.InfoThree}>
        <span>
          {parseFloat(100 - ((networkHealth.suspicious / networkHealth.total) * 100)).toFixed(2)}%
        </span>
        <h3>Healthiness</h3>
      </div>
    </div>
  </div>
);

networkHealthInfo.propTypes = {
  networkHealth: PropTypes.shape({
    suspicious: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired
  }).isRequired
};

export default networkHealthInfo;
