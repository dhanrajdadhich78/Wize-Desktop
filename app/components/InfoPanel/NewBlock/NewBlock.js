import React from 'react';

import classes from './NewBlock.css';
import { newBlock } from '../../../assets/img/img';

const NewBlock = () => (
  <div className={classes.NewBlock}>
    <div className={classes.Left}>
      <img src={newBlock} alt="new block" />
    </div>
    <div className={classes.Right}>
      <div className={classes.Top}>
        <div>
          CREATE
        </div>
        <div>
          <span>-</span> NEW BLOCK
        </div>
      </div>
      <div className={classes.Bottom}>
        <div>
          The DSC code used to load resources
        </div>
      </div>
    </div>
  </div>
);

export default NewBlock;
