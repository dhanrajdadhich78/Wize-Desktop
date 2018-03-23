import React from 'react';
import PropTypes from 'prop-types';

import classes from './DataSpaceInfo.css';

const dataSpaceInfo = ({ dataSpace }) => (
  <div className={classes.DataSpaceInfo}>
    <h3>Data Space</h3>
    <div className={classes.InfoWrapper}>
      <div>
        <p>Total nodes</p>
        <p>{dataSpace.totalNodes}</p>
      </div>
      <div>
        <p>Space left</p>
        <p>{dataSpace.dataLeft} Mb</p>
      </div>
    </div>
  </div>
);

dataSpaceInfo.propTypes = {
  dataSpace: PropTypes.shape({
    totalNodes: PropTypes.number.isRequired,
    dataLeft: PropTypes.number.isRequired
  }).isRequired
};

export default dataSpaceInfo;
