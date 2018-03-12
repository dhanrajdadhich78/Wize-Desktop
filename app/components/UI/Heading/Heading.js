import React from 'react';
import PropTypes from 'prop-types';

import classes from './Heading.css';

const heading = props => {
  let body;

  switch (props.size) {
    case 2:
      body = (
        <h2 style={{
          fontSize: props.fontSize ? props.fontSize : 'inherit',
          fontWeight: props.fontWeight ? props.fontWeight : 'inherit'
        }}
        >
          {props.children}
        </h2>
      );
      break;
    case 3:
      body = (
        <h3 style={{
          fontSize: props.fontSize ? props.fontSize : 'inherit',
          fontWeight: props.fontWeight ? props.fontWeight : 'inherit'
        }}
        >
          {props.children}
        </h3>
      );
      break;
    case 4:
      body = (
        <h4 style={{
          fontSize: props.fontSize ? props.fontSize : 'inherit',
          fontWeight: props.fontWeight ? props.fontWeight : 'inherit'
        }}
        >
          {props.children}
        </h4>
      );
      break;
    case 5:
      body = (
        <h5 style={{
          fontSize: props.fontSize ? props.fontSize : 'inherit',
          fontWeight: props.fontWeight ? props.fontWeight : 'inherit'
        }}
        >
          {props.children}
        </h5>
      );
      break;
    case 6:
      body = (
        <h6 style={{
          fontSize: props.fontSize ? props.fontSize : 'inherit',
          fontWeight: props.fontWeight ? props.fontWeight : 'inherit'
        }}
        >
          {props.children}
        </h6>
      );
      break;
    default:
      body = (
        <h1 style={{
          fontSize: props.fontSize ? props.fontSize : 'inherit',
          fontWeight: props.fontWeight ? props.fontWeight : 'inherit'
        }}
        >
          {props.children}
        </h1>
      );
      break;
  }
  return (
    <div className={classes.Heading}>
      {body}
      <div className={classes.Line} />
    </div>
  );
};

heading.propTypes = {
  children: PropTypes.string.isRequired,
  size: PropTypes.number,
  fontSize: PropTypes.number,
  fontWeight: PropTypes.number
};

heading.defaultProps = {
  size: 1,
  fontSize: null,
  fontWeight: null
};

export default heading;
