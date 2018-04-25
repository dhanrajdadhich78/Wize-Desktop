import React from 'react';

import classes from './NewBlock.css';
import { newBlock } from '../../../assets/img/img';

const NewBlock = () => (
  <div className={classes.NewBlock}>
    <div>
      <img src={newBlock} alt="new block" height={125} />
    </div>
    <div>
      <div>
        <div>
          CREATE
        </div>
        <div>
          <span>-</span> NEW BLOCK
        </div>
      </div>
      <div>
        <div>
          The DSC code used to load resources
        </div>
      </div>
    </div>
  </div>
);

export default NewBlock;
