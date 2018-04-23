import React from 'react';
import PropTypes from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars';

const withCustomScrollbar = props => (
  <Scrollbars>
    {props.children}
  </Scrollbars>
);

withCustomScrollbar.propTypes = {
  children: PropTypes.node.isRequired
};

export default withCustomScrollbar;
