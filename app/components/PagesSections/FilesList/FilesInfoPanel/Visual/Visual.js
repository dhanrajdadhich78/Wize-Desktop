import React from 'react';

import classes from './Visual.css';
import { fileImgLiteBlue, graph } from '../../../../../assets/img/img';

const visual = () => (
  <div className={classes.Visual}>
    <div className={classes.Left}>
      <div className={classes.TopLeft}>
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
      <div className={classes.BottomLeft}>
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
    <div className={classes.Right}>
      <div className={classes.TopRight}>
        <img src={graph} alt="graph" />
      </div>
      <div className={classes.BottomRight}>
        Sharding data
      </div>
    </div>
  </div>
);

export default visual;
