import React from 'react';

import classes from './Statistic.css';

const statistic = () => {
  let numArr = [];
  for (let i = 1; i < 31; i += 1) {
    const j = i < 10 ? `0${i}` : i;
    numArr.push((<div>{j}</div>));
  }
  return (
    <div className={classes.Statistic}>
      <div>
        <div className={classes.InfoLine}>
          DATA USED: <span>123 GB</span>
        </div>
        <div className={classes.Numline}>
          {numArr}
        </div>
      </div>
      <div>
        <div className={classes.InfoLine}>
          DATA Available: <span>453 GB</span>
        </div>
        <div className={classes.Numline}>
          {numArr.slice(6)}
        </div>
      </div>
      <div>
        <div className={classes.InfoLine}>
          NODES ONLINE: <span>954</span>
        </div>
        <div className={classes.Numline}>
          {numArr.slice(11)}
        </div>
      </div>
    </div>
  );
};

export default statistic;
