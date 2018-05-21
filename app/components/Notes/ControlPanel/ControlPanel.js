import React from 'react';
import PropTypes from 'prop-types';

import css from './ControlPanel.css';
import commonCss from '../../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

const ControlPanel = props => (
  <div
    className={[
      styles.flexBetweenCenter,
      styles.ControlPanel
    ].join(' ')}
  >
    <button
      type="button"
      onClick={() => props.addNote()}
    >
      + add
    </button>
    <input
      type="password"
      className={styles.h100}
      value={props.pinCode}
      placeholder="ENTER PIN"
    />
  </div>
);

ControlPanel.propTypes = {
  addNote: PropTypes.func.isRequired,
  pinCode: PropTypes.string
};

ControlPanel.defaultProps = {
  pinCode: ''
};

export default ControlPanel;
