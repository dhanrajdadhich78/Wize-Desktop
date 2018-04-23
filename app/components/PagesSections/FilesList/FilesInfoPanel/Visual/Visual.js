import React from 'react';

import classes from './Visual.css';
import { fileImgBlue, graph } from '../../../../../assets/img/img';

const visual = () => (
  <div className={classes.Visual}>
    <div>
      <div>
        <div>
          <img src={fileImgBlue} alt="file" />
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
          <div>
            34%
          </div>
        </div>
      </div>
      <div>
        <div>
          <div>
            HASH
          </div>
          <div>
            <div>
              <img src={fileImgBlue} alt="file" />
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
          WIZE PROTOCOL
        </div>
      </div>
    </div>
    <div>
      <div>
        <img src={graph} alt="graph" />
      </div>
      <div>
        Sharding data
      </div>
    </div>
  </div>
);

export default visual;
