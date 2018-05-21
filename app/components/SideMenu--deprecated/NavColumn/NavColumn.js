import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import classes from './NavColumn.css';

import NavItem from './NavItem/NavItem';

class NavColumn extends Component {
  state = {
    items: [
      {
        link: '/',
        label: 'Account'
      },
      {
        link: '/wallet',
        label: 'Wallet'
      },
      {
        link: '/file-upload',
        label: 'Upload files'
      },
      {
        link: '/files-list',
        label: 'Merge files'
      },
      {
        link: '/ghost-pad',
        label: 'Ghost pad'
      },
      {
        link: '/miners',
        label: 'Miners'
      }
    ]
  };
  render() {
    return (
      <div className={classes.NavColumn}>
        <ul>
          {
            this.state.items.map((item, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <li key={`nav-${index}`}>
                <NavItem link={item.link}>
                  {item.label}
                </NavItem>
              </li>
            ))
          }
        </ul>
      </div>
    );
  }
}

export default withRouter(NavColumn);
