import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import classes from './Layout.css';

import Aux from '../Aux/Aux';
import SideMenu from '../../components/SideMenu/SideMenu';
// import BugReport from '../../containers/BugReport/BugReport';
import ToggleControllers from '../../components/ToggleControllers/ToggleControllers';

class Layout extends Component {
  state = {
    encryption: false,
    twoFA: false,
    keyLogin: false,
    accessRole: false,
  };
  render() {
    return (
      <Aux>
        <div className={classes.Layout}>
          <main>
            <SideMenu
              blockChain={this.props.bcNodes.length >= 3}
              toggleMenu={() => this.setState({ menuClosed: !this.state.menuClosed })}
            />
            <article>
              <ToggleControllers
                encryption={this.state.encryption}
                twoFA={this.state.twoFA}
                keyLogin={this.state.keyLogin}
                accessRole={this.state.accessRole}
                toggleEncryption={() => this.setState({ encryption: !this.state.encryption })}
                toggle2fa={() => this.setState({ twoFA: !this.state.twoFA })}
                toggleKeyLogin={() => this.setState({ keyLogin: !this.state.keyLogin })}
                toggleAccessRole={() => this.setState({ accessRole: !this.state.accessRole })}
                bcNodes={this.props.bcNodes}
              />
              <div className={classes.MainContent}>
                { this.props.children }
              </div>
            </article>
          </main>
          {/* <BugReport /> */}
        </div>
      </Aux>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.element.isRequired,
  bcNodes: PropTypes.arrayOf(PropTypes.string),
};

Layout.defaultProps = {
  bcNodes: []
};

const mapStateToProps = state => ({
  bcNodes: state.digest.digestInfo.bcNodes
});

export default connect(mapStateToProps)(Layout);
