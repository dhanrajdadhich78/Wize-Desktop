import React from 'react';
import PropTypes from 'prop-types';

import classes from './ToggleControllers.css';

import RoundToggle from '../UI/RoundToggle/RoundToggle';

const toggleControllers = props => (
  <div className={classes.ToggleControllersWrapper}>
    <div className={classes.ToggleWrapper}>
      <div>
        <RoundToggle
          id="enc-toggle"
          label="Encryption is on"
          value={props.encryption}
          onClick={() => props.toggleEncryption()}
        />
      </div>
      <div>
        <RoundToggle
          id="ds-toggle"
          label="Data Sharding is on"
          value={props.sharding}
          onClick={() => props.toggleSharding()}
        />
      </div>
      <div>
        <RoundToggle
          id="pk-toggle"
          label="Private key is on"
          value={props.filePasswording}
          onClick={() => props.toggleFilePass()}
        />
      </div>
    </div>
    <div className={classes.Disclaimer}>
      <p>Personal data encrypted with 256 SHA, RSA and AES</p>
    </div>
  </div>
);

toggleControllers.propTypes = {
  encryption: PropTypes.bool.isRequired,
  sharding: PropTypes.bool.isRequired,
  filePasswording: PropTypes.bool.isRequired,
  toggleEncryption: PropTypes.func.isRequired,
  toggleSharding: PropTypes.func.isRequired,
  toggleFilePass: PropTypes.func.isRequired
};

export default toggleControllers;
