/* eslint-disable promise/catch-or-return,promise/always-return */
import React, { Component } from 'react';
import { connect } from 'react-redux';
// import axios from 'axios';
import html2canvas from 'html2canvas';

import classes from './BugReport.css';

import Aux from '../../hoc/Aux/Aux';
import Modal from '../../components/UI/Modal/Modal';
import Spinner from '../../components/UI/Spinner/Spinner';
import Button from '../../components/UI/Button/Button';

class BugReport extends Component {
  state = {
    image: null,
    // description: null,
    loading: false,
    error: null
  };

  createScreenShotHandler = () => {
    const input = document.getElementsByTagName('body')[0];
    html2canvas(input)
      .then(canvas => {
        this.setState({ image: canvas.toDataURL('image/png') });
      });
  };

  deleteScreenShotHandler = () => {
    this.setState({ image: null, /* description: null */ });
  };

  // submitFormHandler = (e) => {
  //   e.preventDefault();
  //   this.setState({ loading: true });
  //
  //   const data = {
  //     screenshot: this.state.image,
  //     description: this.state.description
  //   };
  //
  //   const config = {
  //     headers: {
  //       'X-ACCESS-TOKEN': this.props.token
  //     }
  //   };
  //
  //   axios.post(`${API_URL}/api/report-bug`, data, config)
  //     .then(response => {
  //       console.log(response);
  //       this.setState({ loading: false });
  //       this.deleteScreenShotHandler();
  //     })
  //     .catch(error => {
  //       console.log(error);
  //       this.setState({ error, loading: false });
  //     });
  // };

  render() {
    let modalContent = null;
    if (this.state.image) {
      modalContent = (
        <div>
          <form onSubmit={this.submitFormHandler} className={classes.ReportForm}>
            <img src={this.state.image} alt="screenshot" />
            <label htmlFor="bug-report-text">
              <span>Describe the problem</span>
              <textarea
                /* onChange={e => this.setState({description: e.target.value})} */
                cols="30"
                rows="10"
                id="bug-report-text"
              />
            </label>
            <div className={classes.ButtonWrapper}>
              <Button onClick={() => this.deleteScreenShotHandler()} >Cancel</Button>
              <Button /* onClick={e => this.submitFormHandler(e)} */>Report</Button>
            </div>
          </form>
        </div>
      );
    }
    if (this.state.loading) {
      modalContent = <Spinner />;
    }
    if (this.state.error) {
      modalContent = (
        <div>
          <h2>{this.state.error}</h2>
        </div>
      );
    }

    return (
      <Aux>
        <Modal
          show={this.state.image}
          modalClosed={() => this.deleteScreenShotHandler()}
        >
          {modalContent}
        </Modal>
        <div className={classes.ButtonContainer}>
          <button type="button" className={classes.BugReportButton} onClick={() => this.createScreenShotHandler()}>
            <i className="fa fa-camera" />
          </button>
          <span className={classes.BugReportButtonTooltip}>Report bug!</span>
        </div>
      </Aux>
    );
  }
}

const mapStateToProps = state => ({
  token: state.auth.authKey,
  isAuth: state.auth.authKey !== null,
});

export default connect(mapStateToProps)(BugReport);
