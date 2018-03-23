import React from 'react';
import PropTypes from 'prop-types';

import classes from './InfoColumn.css';

const infoColumn = ({ blockChain }) => (
  <div className={classes.InfoColumn}>
    <div className={classes.Logo}>
      Logo
    </div>
    <div
      className={!blockChain
        ? classes.BlockChainIdentificator
        : [classes.BlockChainIdentificator, classes.BlockChainActive].join(' ')
      }
    >
    {
      !blockChain
        ? (
          <div>
            <h4>wize  blockchain disconnected</h4>
            <h5>decrypted</h5>
          </div>
        )
        : (
          <div>
            <h4>wize  blockchain connected</h4>
            <h5>encrypted</h5>
          </div>
        )
    }
    </div>
  </div>
);

infoColumn.propTypes = {
  blockChain: PropTypes.bool.isRequired,
};

export default infoColumn;
