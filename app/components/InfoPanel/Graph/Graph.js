import React from 'react';

import classes from './Graph.css';
import { graph } from '../../../assets/img/img';

const Graph = () => (
  <div className={classes.Graph}>
    <div className={classes.Top}>
      <img src={graph} alt="graph" />
    </div>
    <div className={classes.Bottom}>
      Sharding data
    </div>
  </div>
);

export default Graph;
