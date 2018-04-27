import React from 'react';
import PropTypes from 'prop-types';

import classes from './FilesTable.css';
import { fileImgBlue } from '../../../../assets/img/img';

import Spinner from '../../../UI/Spinner/Spinner';

const filesTable = props => {
  let list = <Spinner />;
  if (Array.isArray(props.files)) {
    if (props.files.length > 0) {
      list = (
        <ul className={classes.FilesList}>
          {
            props.files.map((file, index) => {
              const date = new Date(file.date);
              const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
              const day = date.getDay() < 10 ? `0${date.getDay()}` : date.getDay();
              const year = date.getFullYear();
              return (
                // eslint-disable-next-line react/no-array-index-key
                <li key={index}>
                  <span>
                    <span>{index + 1}</span>
                    <span>{file.name}</span>
                  </span>
                  <span>
                    <img src={fileImgBlue} alt="file" height={19} />
                    {parseFloat(file.size / 1048576).toFixed(2)} Mb
                  </span>
                  <span>
                    Enter pin
                  </span>
                  <span>
                    {`${month}/${day}/${year}`}
                  </span>
                  <span>
                    <span>
                      *.SYS Network EDF
                    </span>
                    <span>
                      <i className="fa fa-chevron-down" aria-hidden="true" />
                    </span>
                  </span>
                  {/* <span>0 %</span> */}
                  {/* <span>ok</span> */}
                  {/* <span> */}
                  {/* <button */}
                  {/* onClick={() => props.handleDownload(name)} */}
                  {/* > */}
                  {/* download */}
                  {/* </button> */}
                  {/* </span> */}
                  {/* <span> */}
                  {/* <button */}
                  {/* onClick={() => props.handleDelete(name)} */}
                  {/* > */}
                  {/* delete */}
                  {/* </button> */}
                  {/* </span> */}
                </li>
              );
            })
          }
        </ul>
      );
    } else {
      list = (
        <div className={classes.Empty}>
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
  files: PropTypes.arrayOf(PropTypes.shape()),
  // handleDownload: PropTypes.func.isRequired,
  // handleDelete: PropTypes.func.isRequired
};

filesTable.defaultProps = {
  files: []
};

export default filesTable;
