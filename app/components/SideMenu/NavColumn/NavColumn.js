import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import classes from './NavColumn.css';

import NavItem from './NavItem/NavItem';

class NavColumn extends Component {
  state = {
    activeItemList: 2,
    items: [
      {
        link: '/account',
        label: 'Account'
      },
      {
        link: '/wallets',
        label: 'Wallet'
      },
      // {
      //   link: '/',
      //   label: 'Ghost [data] storage',
      //   childItems: [
      //     {
      //       link: '/',
      //       label: 'Upload files'
      //     },
      //     {
      //       link: '/file-list',
      //       label: 'Ghost files'
      //     },
      //     {
      //       link: '/ghost-pad',
      //       label: 'Ghost pad'
      //     }
      //   ]
      // },
      {
        link: '/',
        label: 'Upload files'
      },
      {
        link: '/file-list',
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
  handleToggleActiveItem = index => {
    if (this.state.items[index].childItems) {
      // eslint-disable-next-line react/prop-types
      if (this.props.history.location.pathname !== this.state.items[index].childItems[0].link) {
        // eslint-disable-next-line react/prop-types
        this.props.history.push(this.state.items[index].childItems[0].link);
      }
    }
    this.setState({
      activeItemList: this.state.activeItemList !== index
        ? index
        : (this.state.items.length + 1)
    });
  };
  render() {
    return (
      <div className={classes.NavColumn}>
        <ul>
          {
            this.state.items.map((item, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <li key={`nav-${index}`}>
                <NavItem
                  id={index}
                  link={item.link}
                  childItems={item.childItems ? item.childItems : []}
                  isActive={index === this.state.activeItemList}
                  toggleMenu={id => this.handleToggleActiveItem(id)}
                >
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
