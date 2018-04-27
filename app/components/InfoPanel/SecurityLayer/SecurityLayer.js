import React from 'react';

import classes from './SecurityLayer.css';
import { fileLock } from '../../../assets/img/img';

const securityLayer = () => (
  <div className={classes.SecurityLayer}>
    <h2>ADD SECURITY LAYER</h2>
    <div className={classes.Subtitle}>
      <div>
        OPTIONAL SECURITY LEVEL
      </div>
      <div>
        CRYPTYC
      </div>
    </div>
    <ul>
      <li>
        <div>
          <img src={fileLock} alt="file-lock" />
        </div>
        <div className={classes.TextBlock}>
          <div>
            2FA
          </div>
          <div />
          <div>
            security
          </div>
          <div>
            only access to administrator
          </div>
        </div>
      </li>
      <li>
        <div>
          <img src={fileLock} alt="file-lock" />
        </div>
        <div className={classes.TextBlock}>
          <div>
            PIN
          </div>
          <div />
          <div>
            security
          </div>
          <div>
            only access to administrator
          </div>
        </div>
      </li>
      <li>
        <div>
          <img src={fileLock} alt="file-lock" />
        </div>
        <div className={classes.TextBlock}>
          <div>
            VOICE
          </div>
          <div />
          <div>
            security
          </div>
          <div>
            only access to administrator
          </div>
        </div>
      </li>
      <li>
        <div>
          <img src={fileLock} alt="file-lock" />
        </div>
        <div className={classes.TextBlock}>
          <div>
            NEW KEY
          </div>
          <div />
          <div>
            security
          </div>
          <div>
            only access to administrator
          </div>
        </div>
      </li>
    </ul>
  </div>
);

export default securityLayer;
