import React from 'react';
import PropTypes from 'prop-types';

import classes from './InfoPanel.css';

import InfoPanelWrapper from '../UI/InfoPanelWrapper/InfoPanelWrapper';
import ProgressBar from './ProgressBar/ProgressBar';
import NavMenu from './NavMenu/NavMenu';
import Data from './Data/Data';
import Graph from './Graph/Graph';

const infoPanel = props => {
  const getBlock = name => {
    let block;
    switch (name) {
      case 'ProgressBar': block = <ProgressBar key={Math.random()} />; break;
      case 'NavMenu': block = <NavMenu key={Math.random()} />; break;
      case 'Data': block = <Data key={Math.random()} />; break;
      case 'Graph': block = <Graph key={Math.random()} />; break;
      default:
        block = (
          <div key={Math.random()}>
            Placeholder
          </div>
        );
        return;
    }
    return block;
  };
  const leftColumn = (
    <div className={classes.LeftColumn}>
      {props.leftColumn.map(block => getBlock(block))}
    </div>
  );
  const rightColumn = (
    <div className={classes.RightColumn}>
      {props.rightColumn.map(block => getBlock(block))}
    </div>
  );
  return (
    <div className={classes.InfoPanel}>
      <InfoPanelWrapper>
        <div className={classes.InnerWrapper}>
          {leftColumn}
          {rightColumn}
        </div>
      </InfoPanelWrapper>
    </div>
  );
};

infoPanel.propTypes = {
  leftColumn: PropTypes.arrayOf(PropTypes.string),
  rightColumn: PropTypes.arrayOf(PropTypes.string)
};

infoPanel.defaultProps = {
  leftColumn: [
    'ProgressBar',
    'NavMenu'
  ],
  rightColumn: [
    'Data',
    'Graph'
  ]
};

export default infoPanel;
