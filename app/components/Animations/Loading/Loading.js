import React from 'react';

import classes from './Loading.css';

import { ghost2, polygon2 } from '../../../assets/img/img';

const Loading = () => (
  <div className={classes.GhostWrapper}>
    <img
      className={classes.Ghost}
      src={ghost2}
      alt="ghost"
    />
    <div className={classes.AllPolygons}>
      <div className={classes.TopPolygons}>
        <img
          className={[classes.Polygon, classes.First].join(' ')}
          src={polygon2}
          alt="polygon"
        />
        <img
          className={[classes.Polygon, classes.Second].join(' ')}
          src={polygon2}
          alt="polygon"
        />
      </div>
      <div className={classes.BottomPolygon}>
        <img
          className={[classes.Polygon, classes.Third].join(' ')}
          src={polygon2}
          alt="polygon"
        />
      </div>
    </div>
  </div>
);

export default Loading;
