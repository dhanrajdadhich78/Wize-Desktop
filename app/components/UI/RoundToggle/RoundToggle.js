import React from 'react';
import PropTypes from 'prop-types';

import classes from './RoundToggle.css';

const roundToggle = props => (
  <label className={classes.RoundToggle} htmlFor={props.id}>
    <input
      type="checkbox"
      value={props.value}
      onChange={() => props.onClick()}
      id={props.id}
    />
    <span />
    {
      !props.label.length
        ? null
        : (
          <div>{props.label}</div>
        )
    }
  </label>
);

roundToggle.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};

roundToggle.defaultProps = {
  label: ''
};

export default roundToggle;
