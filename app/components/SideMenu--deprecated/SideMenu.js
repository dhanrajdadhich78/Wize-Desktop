import React from 'react';
import PropTypes from 'prop-types';

import classes from './SideMenu.css';

import InfoColumn from './InfoColumn/InfoColumn';
import NavColumn from './NavColumn/NavColumn';

const sidebarList = ({ blockChain }) => (
  <aside className={classes.SidebarList}>
    <InfoColumn blockChain={blockChain} />
    <NavColumn />
  </aside>
);

sidebarList.propTypes = {
  blockChain: PropTypes.bool.isRequired,
};

export default sidebarList;
