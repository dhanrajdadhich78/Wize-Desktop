import React from 'react';

import classes from './FilesInfoPanel.css';

import InfoPanelWrapper from '../../../UI/InfoPanelWrapper/InfoPanelWrapper';
import MergeBlock from './MergeBlock/MergeBlock';
import Visual from './Visual/Visual';

const filesInfoPanel = () => (
  <div className={classes.FilesInfoPanel}>
    <InfoPanelWrapper>
      <div className={classes.InnerWrapper}>
        <div>
          <MergeBlock />
        </div>
        <div>
          <Visual />
        </div>
      </div>
    </InfoPanelWrapper>
  </div>
);

export default filesInfoPanel;
