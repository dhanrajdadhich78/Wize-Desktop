import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import axios from 'axios';

import classes from './FilesList.css';

import Spinner from '../../components/UI/Spinner/Spinner';
import Button from '../../components/UI/Button/Button';
import Aux from '../../hoc/Aux/Aux';
import Modal from '../../components/UI/Modal/Modal';
import Heading from '../../components/UI/Heading/Heading';

class FilesList extends Component {
  state = {
    files: [
      {
        name: 'Test file',
        uploadDate: ''
      },
      {
        name: 'Test file - 2',
        uploadDate: ''
      }
    ],
    // loading: false,
    // error: null,
    modalContent: null,
    // transferTo: null
  };
  //
  // componentDidMount() {
  //   this.getFilesHandler();
  // }
  //
  // getFilesHandler = () => {
  //   this.setState({ loading: true });
  //
  //   const config = {
  //     headers: {
  //       'X-ACCESS-TOKEN': this.props.token
  //     }
  //   };
  //
  //   axios.get(`${API_URL}/api/get-files-list`, config)
  //     .then(response => {
  //       this.setState({files: response.data.userFiles ? response.data.userFiles : [], loading: false}
  //       )})
  //     .catch(error => this.setState({error: error.response.data.message, loading: false}))
  // };
  //
  // downloadFileHandler = (relativePath, filename) => {
  //   // const url = window.URL.createObjectURL(new Blob([response.data]));
  //   const link = document.createElement('a');
  //   link.href = API_URL+relativePath;
  //   link.setAttribute('download', filename);
  //   document.body.appendChild(link);
  //   link.click();
  // };
  //
  // onDeleteHandler = (filename) => {
  //   // console.log(filename);
  //   this.setState({ loading: true });
  //
  //   const config = {
  //     headers: {
  //       'X-ACCESS-TOKEN': this.props.token
  //     }
  //   };
  //
  //   axios.post(`${API_URL}/api/delete-file`, { filename }, config)
  //     .then(response => {
  //       console.log(response.data.message);
  //       this.setState({ loading: false });
  //       this.getFilesHandler();
  //       this.modalCloseHandler();
  //     })
  //     .catch(error => {
  //       this.setState({
  //         error: error.response.data.message,
  //         modalContent: <p>{error.response.data.message}</p>,
  //         loading: false
  //       });
  //       this.modalCloseHandler();
  //     });
  // };
  //
  // showDeleteModalHandler = (date, name) => {
  //   this.setState({
  //     modalContent: (
  //       <div>
  //         <p>Are you sure?</p>
  //         <Button onClick={() => this.onDeleteHandler(`${date}~${name}`)}>Ok</Button>
  //       </div>
  //     )
  //   });
  // };
  //
  // onTransferHandler = (filename) => {
  //   console.log({ filename, transfer_to: this.state.transferTo });
  //   this.setState({ loading: true });
  //
  //   const config = {
  //     headers: {
  //       'X-ACCESS-TOKEN': this.props.token
  //     }
  //   };
  //
  //   axios.post(`${API_URL}/api/transfer-file`, { filename, transferTo: this.state.transferTo }, config)
  //     .then(response => {
  //       console.log(response.data.message);
  //       this.setState({ loading: false });
  //       this.getFilesHandler();
  //       this.modalCloseHandler();
  //     })
  //     .catch(error => {
  //       this.setState({
  //         error: error.response.data.message,
  //         modalContent: <p>{error.response.data.message}</p>,
  //         loading: false
  //       });
  //       this.modalCloseHandler();
  //     });
  // };
  //
  // showTransferModalHandler = (date, name) => {
  //   this.setState({
  //     modalContent: (
  //       <div>
  //         <div>
  //           <label htmlFor="transferTO">Enter public key of user, who will own this file.</label>
  //           <input
  //             type="text"
  //             id="transferTO"
  //             onChange={(e) => this.setState({ transferTo: e.target.value })}
  //           />
  //         </div>
  //         <Button onClick={() => this.onTransferHandler(`${date}~${name}`)}>Ok</Button>
  //       </div>
  //     )
  //   });
  // };
  //
  //
  // modalCloseHandler = () => {
  //   this.setState({ modalContent: null });
  // };

  render() {
    let list = <Spinner />;

    if (Array.isArray(this.state.files)) {
      if (this.state.files.length !== 0) {
        list = (
          <ul className={classes.FilesList}>
            <li>
              <span>Name</span>
              <span>Upload Date</span>
              <span>&nbsp;</span>
              <span>Actions</span>
              <span>&nbsp;</span>
            </li>
            {
              this.state.files.map((file, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <li key={index}>
                  <span>{file.name}</span>
                  <span>{new Date(file.uploadDate * 1000).toString()}</span>
                  <span>
                    <Button>
                      { /* onClick={() => this.downloadFileHandler(file.relativePath, `${file.uploadDate}~${file.name}`)}
                    > */}
                      Download
                    </Button>
                  </span>
                  <span>
                    <Button>
                      { /* onClick={() => this.showDeleteModalHandler(file.uploadDate, file.name)}
                    > */ }
                      Delete
                    </Button>
                  </span>
                  <span>
                    <Button>
                      { /* onClick={() => this.showTransferModalHandler(file.uploadDate, file.name)}
                    > */}
                      Transfer file
                    </Button>
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
      <Aux>
        <Modal
          show={this.state.modalContent}
          modalClosed={() => this.modalCloseHandler()}
        >
          { this.state.modalContent }
        </Modal>
        <div>
          <Heading fontWeight={200} fontSize={50}>Your <span>files</span> list</Heading>
          {list}
        </div>
      </Aux>
    );
  }
}

FilesList.propTypes = {
  userData: PropTypes.shape({
    csk: PropTypes.string,
    cpk: PropTypes.string,
    address: PropTypes.string
  })
};

FilesList.defaultProps = {
  userData: {
    csk: null,
    cpk: null,
    address: null
  }
};

const mapStateToProps = state => ({
  userData: state.auth.userData,
  // authError: state.auth.error
});

export default connect(mapStateToProps)(FilesList);
