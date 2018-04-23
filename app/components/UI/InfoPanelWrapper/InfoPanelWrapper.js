import React from 'react';
import PropTypes from 'prop-types';

import classes from './InfoPanelWrapper.css';

const InfoPanelWrapper = props => (
  <div className={classes.InfoPanelWrapper}>
    <div className={classes.Plank}>
      ...
    </div>
    <div className={classes.Info}>
      {props.children}
    </div>
  </div>
);

InfoPanelWrapper.propTypes = {
  children: PropTypes.node.isRequired
};

export default InfoPanelWrapper;
