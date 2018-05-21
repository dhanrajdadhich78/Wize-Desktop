import React from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';

import classes from './ToggleCredFiles.css';

import RoundToggle from '../../UI/RoundToggle/RoundToggle';
import Input from '../../UI/Input/Input';
import Button from '../../UI/Button/Button';

const toggleCredFiles = props => {
  let dropzoneSection = (
    <div className={classes.DropzoneWrapper}>
      <Dropzone
        onDrop={files => props.handleDropCredFile(files[0])}
        multiple={false}
        accept=".bak"
      >
        <p>
          If you store your credentails not in a standard folder - drop it here.
          Or just click me.
        </p>
      </Dropzone>
    </div>
  );
  if (!props.dropzoneInput) {
    dropzoneSection = (
      <div className={classes.AltDropzoneWrapper}>
        <div>
          {props.credFilePath}
        </div>
        <Button onClick={() => props.handleReturnDropzoneInput()}>Another file</Button>
      </div>
    );
  }
  let selectSection = (
    <div className={classes.SelectSectionWrapper}>
      <Input
        id="select-cred-files"
        value={props.credFilePath}
        elementType="select"
        changed={e => props.onCredFilesSelectChange(e.target.value)}
        elementConfig={{
          type: 'select',
          options: props.credFilesArr.map(cred => ({
            value: `${cred}`,
            displayValue: cred.substring(cred.lastIndexOf('/'))
          }))
        }}
      />
    </div>
  );
  if (!props.credFilesArr[0]) {
    selectSection = (
      <div className={classes.AltSelectSectionWrapper}>
        <div>
          You don`t have any credentials files in your default directory yet.
        </div>
      </div>
    );
  }
  return (
    <div className={classes.ToggleCredFiles}>
      <RoundToggle
        id="cred-file"
        value={props.altCredFilePath}
        label="Drop credential files"
        onClick={() => props.handleToggleAltCredFile()}
      />
      {
        !props.altCredFilePath
          ? selectSection
          : dropzoneSection
      }
    </div>
  );
};

toggleCredFiles.propTypes = {
  altCredFilePath: PropTypes.bool.isRequired,
  handleToggleAltCredFile: PropTypes.func.isRequired,
  credFilePath: PropTypes.string.isRequired,
  handleDropCredFile: PropTypes.func.isRequired,
  credFilesArr: PropTypes.arrayOf(PropTypes.string).isRequired,
  onCredFilesSelectChange: PropTypes.func.isRequired,
  dropzoneInput: PropTypes.bool.isRequired,
  handleReturnDropzoneInput: PropTypes.func.isRequired
};

export default toggleCredFiles;
