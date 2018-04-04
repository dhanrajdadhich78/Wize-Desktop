import React from 'react';
import PropTypes from 'prop-types';

import classes from './FilesTable.css';

import Spinner from '../../../UI/Spinner/Spinner';

const filesTable = props => {
  let list = <Spinner />;

  if (Array.isArray(props.files)) {
    if (props.files.length > 0) {
      list = (
        <ul className={classes.FilesList}>
          <li>
            <span>Ghost files</span>
            <span>Decryption</span>
            <span>Access</span>
            <span>Merge data</span>
            <span>Delete</span>
          </li>
          {
            props.files.map(({ name }, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <li key={index}>
                <span>{name}</span>
                <span>0 %</span>
                <span>ok</span>
                <span>
                  <button
                    onClick={() => props.handleDownload(name)}
                  >
                    download
                  </button>
                </span>
                <span>
                  <button
                    onClick={() => props.handleDelete(name)}
                  >
                    delete
                  </button>
                </span>
              </li>
            ))
          }
        </ul>
      );
    } else {
      list = (
        <div>
          <h2>You don&apos;t have any files yet.</h2>
        </div>
      );
    }
  }
  return (
    <div className={classes.FilesTable}>
      {list}
    </div>
  );
};

filesTable.propTypes = {
  files: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  handleDownload: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired
};

export default filesTable;
