import React from 'react';

import classes from './ProgressBar.css';
import { fileImg } from '../../../assets/img/img';

const progressBar = () => (
  <div className={classes.ProgressBar}>
    <div className={classes.HeadingWrapper}>
      <div>
        Merge Block_ ready
      </div>
      <div>
        WIZE BLOCK
      </div>
    </div>
    <div className={classes.ProgressBarWrapper}>
      <div />
    </div>
    <div className={classes.NameWrapper}>
      Files: Block. 0345/X
    </div>
    <div className={classes.InfoWrapper}>
      <div>
        <img src={fileImg} alt="file" />
      </div>
      <div>
        <div>
          HASH SIZE Mb
        </div>
        <div>
          28783345.04
        </div>
        <div>
          only access to administrator
        </div>
      </div>
    </div>
  </div>
);

export default progressBar;
