import React from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';

import classes from './ToggleCredFiles.css';

import RoundToggle from '../../UI/RoundToggle/RoundToggle';
import Input from '../../UI/Input/Input';

const toggleCredFiles = props => (
  <div className={classes.ToggleCredFiles}>
    <RoundToggle
      id="cred-file"
      value={props.altCredFilePath}
      onClick={() => props.handleToggleAltCredFile()}
    />
    {console.log(props.credFilePath)}
    {
      !props.altCredFilePath
        ? (
          <div>
            <Input
              id="select-cred-files"
              value={props.credFilePath}
              elementType="select"
              changed={e => props.onCredFilesSelectChange(e.target.value)}
              elementConfig={{
                type: 'select',
                options: props.credFilesArr
              }}
            />
          </div>
        )
        : (
          <div>
            <Dropzone
              onDrop={files => props.handleDropCredFile(files[0])}
            >
              <p>If you store your credentails not in a standard folder - drop it here</p>
            </Dropzone>
          </div>
        )
    }
  </div>
);

toggleCredFiles.propTypes = {
  altCredFilePath: PropTypes.bool.isRequired,
  handleToggleAltCredFile: PropTypes.func.isRequired,
  credFilePath: PropTypes.string.isRequired,
  handleDropCredFile: PropTypes.func.isRequired,
  credFilesArr: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  onCredFilesSelectChange: PropTypes.func.isRequired
};

export default toggleCredFiles;
