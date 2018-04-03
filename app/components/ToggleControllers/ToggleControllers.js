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
          label={`Encryption is ${props.encryption ? 'on' : 'off'}`}
          value={props.encryption}
          onClick={() => props.toggleEncryption()}
        />
      </div>
      <div>
        <RoundToggle
          id="2fa-toggle"
          label={`2FA is ${props.twoFA ? 'on' : 'off'}`}
          value={props.twoFA}
          onClick={() => props.toggle2fa()}
        />
      </div>
      <div>
        <RoundToggle
          id="key-login-toggle"
          label={`Key login is ${props.keyLogin ? 'on' : 'off'}`}
          value={props.keyLogin}
          onClick={() => props.toggleKeyLogin()}
        />
      </div>
      <div>
        <RoundToggle
          id="access-role-toggle"
          label={`Access role is ${props.accessRole ? 'on' : 'off'}`}
          value={props.accessRole}
          onClick={() => props.toggleAccessRole()}
        />
      </div>
    </div>
    <div className={classes.Disclaimer}>
      <p>
        Personal data encrypted with 256 SHA,
        RSA and fully decentralazed using WizeBit Blockchain Network.
        <span> [ {props.bcNodes.length} Nodes ]</span>
      </p>
    </div>
  </div>
);

toggleControllers.propTypes = {
  encryption: PropTypes.bool.isRequired,
  twoFA: PropTypes.bool.isRequired,
  keyLogin: PropTypes.bool.isRequired,
  accessRole: PropTypes.bool.isRequired,
  toggleEncryption: PropTypes.func.isRequired,
  toggle2fa: PropTypes.func.isRequired,
  toggleKeyLogin: PropTypes.func.isRequired,
  toggleAccessRole: PropTypes.func.isRequired,
  bcNodes: PropTypes.arrayOf(PropTypes.string)
};

toggleControllers.defaultProps = {
  bcNodes: []
};

export default toggleControllers;
