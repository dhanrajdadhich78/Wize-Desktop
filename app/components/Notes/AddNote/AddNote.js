import React, { Component } from 'react';
import PropTypes from 'prop-types';

import css from './AddNote.css';
import commonCss from '../../../assets/css/common.css';

// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

class AddNote extends Component {
  state = {
    input: false
  };
  render() {
    return (
      <div
        className={[
          styles.w100,
          styles.h100
        ].join(' ')}
      >
        {
          !this.state.input
            ? (
              <div
                className={[
                  styles.w100,
                  styles.h100,
                ].join(' ')}
              >
                <button
                  type="button"
                  className={[
                    styles.flexAllCenter,
                    styles.h100,
                    styles.Button
                  ].join(' ')}
                  onClick={() => this.setState({ input: !this.state.input })}
                >
                  +
                </button>
              </div>
            )
            : (
              <div
                className={[
                  styles.w100,
                  styles.h100,
                  styles.flexBetweenCenter
                ].join(' ')}
              >
                <input
                  type="text"
                  className={[
                    styles.flexAllCenter,
                    styles.h100,
                    styles.Input
                  ].join(' ')}
                  value={this.props.value}
                  onChange={e => this.props.onchange(e.target.value)}
                />
                <button
                  type="button"
                  className={[
                    styles.flexAllCenter,
                    styles.h100,
                    styles.Button
                  ].join(' ')}
                  onClick={() => this.setState({ input: !this.state.input })}
                >
                  add
                </button>
                <button
                  type="button"
                  className={[
                    styles.flexAllCenter,
                    styles.h100,
                    styles.Button
                  ].join(' ')}
                  onClick={() => this.setState({ input: !this.state.input })}
                >
                  -
                </button>
              </div>
            )
        }
      </div>
    );
  }
}

AddNote.propTypes = {
  value: PropTypes.string.isRequired,
  onchange: PropTypes.func.isRequired
};

export default AddNote;
