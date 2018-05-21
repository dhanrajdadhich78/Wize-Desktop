import React from 'react';

import classes from './Data2.css';
import { fileImgLiteBlue } from '../../../assets/img/img';

const data2 = () => (
  <div className={classes.Data2}>
    <div className={classes.Top}>
      <div className={classes.SubTop}>
        <div>DATA</div>
        <div>99.99 UPTIME</div>
      </div>
      <div className={classes.SubBottom}>
        <div>
          <img src={fileImgLiteBlue} alt="file" />
        </div>
        <div>
          <div>NORMAL</div>
          <div>The SSL certificate used to load resources</div>
        </div>
      </div>
    </div>
    <div className={classes.Middle}>
      <div className={classes.SubTop}>
        <div>BLOCK</div>
        <div>GOOD</div>
      </div>
      <div className={classes.SubBottom}>
        <div>
          <img src={fileImgLiteBlue} alt="file" />
        </div>
        <div>
          <div>NORMAL</div>
          <div>The SSL certificate used to load resources</div>
        </div>
      </div>
    </div>
    <div className={classes.Bottom}>
      System identification
    </div>
  </div>
);

export default data2;
