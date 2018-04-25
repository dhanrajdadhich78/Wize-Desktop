import React from 'react';

import classes from './Data.css';
import { fileImgLiteBlue } from '../../../assets/img/img';

const data = () => (
  <div className={classes.Data}>
    <div className={classes.Top}>
      <div>
        <img src={fileImgLiteBlue} alt="file" />
      </div>
      <div>
        <div>
          <div>
            TIME STAMP
          </div>
          <div>
            Mining: DR. 0345/D
          </div>
        </div>
      </div>
      <div>
        34%
      </div>
    </div>
    <div className={classes.Bottom}>
      <div>
        <div>
          HASH
        </div>
        <div>
          <div>
            <img src={fileImgLiteBlue} alt="file" />
          </div>
          <div>
            <div>
              Layot D3
            </div>
            <div>
              The SSL certificate used to load resources
            </div>
          </div>
        </div>
        <div>
          System identification
        </div>
      </div>
      <div>
        <p><span>_</span> WIZE</p>
        <p>PROTOCOL</p>
      </div>
    </div>
  </div>
);

export default data;
