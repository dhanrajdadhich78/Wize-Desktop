import React from 'react';

import classes from './NavMenu.css';

const navMenu = () => {
  const fileList = [
    {
      label: 'Blocks'
    },
    {
      label: 'Nodes'
    },
    {
      label: 'Master Nodes'
    },
    {
      label: 'Data Node'
    },
    {
      label: 'Mining'
    }
  ];
  return (
    <nav className={classes.NavMenu}>
      <ul>
        {
          fileList.map((item, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <li key={index}>
              <a href="#">
                {item.label}
              </a>
            </li>
          ))
        }
      </ul>
    </nav>
  );
};

export default navMenu;
