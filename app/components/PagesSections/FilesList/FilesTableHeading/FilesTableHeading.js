import React from 'react';

import classes from './FilesTableHeading.css';

const filesTableHeading = () => (
  <div className={classes.FilesTableHeading}>
    <div>FOLDER</div>
    <div>
      <i className="fa fa-chevron-down" aria-hidden="true" />
    </div>
    <div>
      <div>Personal Crypto</div>
      <div>
        Master Key Accepted
      </div>
    </div>
  </div>
);

export default filesTableHeading;
