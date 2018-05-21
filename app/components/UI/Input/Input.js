import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classes from './Input.css';

import Aux from '../../../hoc/Aux/Aux';
import Backdrop from '../../UI/Backdrop/Backdrop';

class Input extends Component {
  state = {
    show: false
  };
  render() {
    let inputElement = null;
    const inputClasses = [classes.InputElement];
    if (this.props.invalid && this.props.shouldValidate && this.props.touched) {
      inputClasses.push(classes.Invalid);
    }
    switch (this.props.elementType) {
      case 'textarea':
        inputElement = (
          <div>
            <textarea
              className={inputClasses.join(' ')}
              {...this.props.elementConfig}
              value={this.props.value}
              onChange={this.props.changed}
              id={this.props.id}
            />
          </div>
        );
        break;
      case 'select':
        inputElement = (
          <div>
            <button
              className={[...inputClasses, classes.Select].join(' ')}
              id={this.props.id}
              onClick={() => this.setState({ show: !this.state.show })}
            >
              <div>
                {this.props.value.displayValue ? this.props.value.displayValue : 'Choose one'}
              </div>
              <div className={this.state.show ? classes.Options : [classes.Options, classes.Hide].join(' ')}>
                {
                  this.props.elementConfig.options.map(option => (
                    <button
                      key={option.value}
                      onClick={() => this.props.changed(option)}
                    >
                      {option.displayValue}
                    </button>
                  ))
                }
              </div>
              <div className={classes.ArrowDown}>
                <i className="fa fa-chevron-down" aria-hidden="true" />
              </div>
            </button>
          </div>
        );
        break;
      default:
        inputElement = (
          <div>
            <div>
              <input
                className={inputClasses.join(' ')}
                value={this.props.value}
                onChange={e => this.props.changed(e.target.value)}
                id={this.props.id}
                {...this.props.elementConfig}
              />
              <div className={classes.ErrorMessage}>
                {this.props.invalid ? this.props.errorMessage : null}
              </div>
            </div>
          </div>
        );
        break;
    }
    return (
      <Aux>
        <Backdrop
          transparent
          show={this.state.show}
          clicked={() => this.setState({ show: !this.state.show })}
        />
        <div className={classes.Input}>
          {
            this.props.label && (typeof this.props.label !== 'object' || (typeof this.props.label === 'object' && this.props.label.top))
              ? (
                // eslint-disable-next-line jsx-a11y/label-has-for
                <label className={classes.Label} htmlFor={this.props.id}>
                  {
                    typeof this.props.label !== 'object'
                      ? this.props.label
                      : this.props.label.top
                  }
                </label>
              )
              : null
          }
          {inputElement}
          {
            this.props.label && typeof this.props.label === 'object' && this.props.label.bottom
              ? (
                // eslint-disable-next-line jsx-a11y/label-has-for
                <div className={[classes.Label, classes.BottomLabel].join(' ')}>
                  {this.props.label.bottom}
                </div>
              )
              : null
          }
        </div>
      </Aux>
    );
  }
}

Input.propTypes = {
  invalid: PropTypes.bool,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.shape()
  ]),
  errorMessage: PropTypes.string,
  elementConfig: PropTypes.shape({
    type: PropTypes.string,
    placeholder: PropTypes.string,
    options: PropTypes.array
  }),
  shouldValidate: PropTypes.bool,
  touched: PropTypes.bool,
  elementType: PropTypes.string.isRequired,
  changed: PropTypes.func,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.shape()
  ]),
  id: PropTypes.string
};

Input.defaultProps = {
  invalid: false,
  label: '',
  errorMessage: '',
  shouldValidate: false,
  touched: false,
  changed: () => null,
  value: '',
  id: '',
  elementConfig: {
    type: 'text'
  }
};

export default Input;
