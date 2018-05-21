import React from 'react';
import PropTypes from 'prop-types';

import classes from './VerticalLineV.css';
import { arrDown } from '../../../assets/img/img';

const verticalLineV = ({ count }) => {
  const imgs = [];
  for (let i = 0; i < count; i += 1) {
    imgs.push(<img src={arrDown} key={i} alt="&#709;" />);
  }
  return (
    <div className={classes.VerticalLineV}>
      {imgs}
    </div>
  );
};

verticalLineV.propTypes = {
  count: PropTypes.number.isRequired
};

export default verticalLineV;
