import React from 'react';

import classes from './InfoPanel.css';

import InfoPanelWrapper from '../UI/InfoPanelWrapper/InfoPanelWrapper';
import MergeBlock from './MergeBlock/MergeBlock';
import Visual from './Visual/Visual';

const infoPanel = () => (
  <div className={classes.InfoPanel}>
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

export default infoPanel;
