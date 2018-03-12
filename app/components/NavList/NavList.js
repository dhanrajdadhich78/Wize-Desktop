import React from 'react';

import classes from './NavList.css';

import NavItem from './NavItem/NavItem';

const sidebarList = () => {
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
      link: '/wallets-list',
      icon: 'fa-list-alt',
      label: 'Wallets List'
    },
    {
      link: '/wallet-check',
      icon: 'fa-check',
      label: 'Wallet Check'
    },
    {
      link: '/transaction-create',
      icon: 'fa-money',
      label: 'New Transaction'
    }
  ];

  return (
    <aside className={classes.SidebarList}>
      <ul>
        {
          items.map((item, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <li key={`nav-${index}`}>
              <NavItem
                id={index}
                link={item.link}
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

export default sidebarList;
