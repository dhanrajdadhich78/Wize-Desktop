import React from 'react';
import PropTypes from 'prop-types';

import classes from './Button.css';

const button = (props) => (
  <button
    disabled={props.disabled}
    className={
      props.btnType.length === 0
        ? classes.Button
        : [classes.Button, classes[props.btnType]].join(' ')
    }
    onClick={props.onClick}
  >
    {props.children}
  </button>
);

button.propTypes = {
  children: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  btnType: PropTypes.string,
  onClick: PropTypes.func
};

button.defaultProps = {
  disabled: false,
  btnType: '',
  onClick: null
};

export default button;
