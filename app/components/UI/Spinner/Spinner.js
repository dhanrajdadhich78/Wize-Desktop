import React from 'react';
import PropTypes from 'prop-types';

import classes from './Spinner.css';

const spinner = ({ height }) => (
  <div className={classes.SpinnerWrapper} style={{ height }}>
    <div className={classes.Loader}>Loading...</div>
  </div>
);

spinner.propTypes = {
  height: PropTypes.string || PropTypes.number
};

spinner.defaultProps = {
  height: '100vh'
};

export default spinner;
