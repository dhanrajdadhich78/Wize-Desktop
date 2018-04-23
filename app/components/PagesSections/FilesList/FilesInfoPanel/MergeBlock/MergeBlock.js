import React from 'react';

import classes from './MergeBlock.css';
import { fileImg } from '../../../../../assets/img/img';

const mergeBlock = () => {
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
    <div className={classes.MergeBlock}>
      <div>
        <div className={classes.HeadingWrapper}>
          <div>
            Merge Block_ ready
          </div>
          <div>
            WIZE BLOCK
          </div>
        </div>
        <div className={classes.ProgressBarWrapper}>
          <div />
        </div>
        <div className={classes.NameWrapper}>
          Files: Block. 0345/X
        </div>
        <div className={classes.InfoWrapper}>
          <div>
            <img src={fileImg} alt="file" />
          </div>
          <div>
            <div>
              HASH SIZE Mb
            </div>
            <div>
              28783345.04
            </div>
            <div>
              only access to administrator
            </div>
          </div>
        </div>
      </div>
      <nav>
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
    </div>
  );
};

export default mergeBlock;
