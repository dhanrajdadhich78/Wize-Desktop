import React, { Component } from 'react';

import classes from './Ghost.css';

import { ghost, polygon } from '../../../assets/img/img';

class Ghost extends Component {
  render() {
    return (
      <div className={classes.GhostWrapper}>
        <img
          className={classes.Ghost}
          src={ghost}
          alt="ghost"
        />
        <div className={classes.AllPolygons}>
          <div className={classes.TopPolygons}>
            <img
              className={[classes.Polygon, classes.First].join(' ')}
              src={polygon}
              alt="polygon"
            />
            <img
              className={[classes.Polygon, classes.Second].join(' ')}
              src={polygon}
              alt="polygon"
            />
          </div>
          <div className={classes.BottomPolygon}>
            <img
              className={[classes.Polygon, classes.Third].join(' ')}
              src={polygon}
              alt="polygon"
            />
          </div>
        </div>


      </div>
    );
  }
}

export default Ghost;
