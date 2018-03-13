import React from 'react';
import PropTypes from 'prop-types';

import classes from './SideMenu.css';

import NavItem from './NavItem/NavItem';

const sidebarList = props => {
  const items = [
    {
      link: '/',
      icon: 'fa-files-o',
      label: 'Files List'
    },
    {
      link: '/upload-files',
      icon: 'fa-cloud-upload',
      label: 'Upload Files'
    },
    {
      link: '/wallets',
      icon: 'fa-credit-card',
      label: 'Wallets'
    },
    // {
    //   link: '/wallets-list',
    //   icon: 'fa-list-alt',
    //   label: 'Wallets List'
    // },
    // {
    //   link: '/wallet-check',
    //   icon: 'fa-check',
    //   label: 'Wallet Check'
    // },
    // {
    //   link: '/transaction-create',
    //   icon: 'fa-money',
    //   label: 'New Transaction'
    // }
  ];

  return (
    <aside className={classes.SidebarList} style={props.menuClosed ? null : { right: 0 }}>
      <ul>
        {
          items.map((item, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <li key={`nav-${index}`}>
              <NavItem
                id={index}
                link={item.link}
                toggleMenu={() => props.toggleMenu()}
              >
                <i className={`fa ${item.icon}`} />
                {item.label}
              </NavItem>
            </li>
          ))
        }
      </ul>
    </aside>
  );
};

sidebarList.propTypes = {
  menuClosed: PropTypes.bool.isRequired,
  toggleMenu: PropTypes.func.isRequired
};

export default sidebarList;
