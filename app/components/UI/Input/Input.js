import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classes from './Input.css';
import Aux from '../../../hoc/Aux/Aux';
import Backdrop from '../../UI/Backdrop/Backdrop';

class Input extends Component {
  state = {
    datepickerShow: false
  };

  render() {
    let inputElement = null;
    const inputClasses = [classes.InputElement];

    if (this.props.invalid && this.props.shouldValidate && this.props.touched) {
      inputClasses.push(classes.Invalid);
    }
    switch (this.props.elementType) {
      case 'input':
        inputElement = (
          <div>
            <input
              className={inputClasses.join(' ')}
              {...this.props.elementConfig}
              value={this.props.value}
              onChange={this.props.changed}
              id={this.props.id}
            />
            <div className={classes.ErrorMessage}>
              {this.props.invalid ? this.props.errorMessage : null}
            </div>
          </div>
        );
        break;
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
            <select
              className={inputClasses.join(' ')}
              value={this.props.value}
              onChange={this.props.changed}
              id={this.props.id}
            >
              {this.props.elementConfig.options.map(option => (
                <option
                  key={option.value}
                  value={option.value}
                  // selected={option.value === this.props.value}
                >
                  {option.displayValue}
                </option>
              ))}
            </select>
            <div className={classes.ErrorMessage}>
              {this.props.invalid ? this.props.errorMessage : null}
            </div>
          </div>
        );
        break;
      default:
        inputElement = (
          <div>
            <input
              className={inputClasses.join(' ')}
              {...this.props.elementConfig}
              value={this.props.value}
              onChange={this.props.changed}
              id={this.props.id}
            />
            <div className={classes.ErrorMessage}>
              {this.props.invalid ? this.props.errorMessage : null}
            </div>
          </div>
        );
        break;
    }

    return (
      <Aux>
        <Backdrop transparent show={this.state.datepickerShow} clicked={this.showDatepicker} />
        <div className={classes.Input}>
          {
            this.props.label.length === 0
              ? null
              : (
                // eslint-disable-next-line jsx-a11y/label-has-for
                <label className={classes.Label} htmlFor={this.props.id}>
                  {this.props.label}
                </label>
              )
          }
          {inputElement}
        </div>
      </Aux>
    );
  }
}

Input.propTypes = {
  invalid: PropTypes.bool,
  label: PropTypes.string,
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
  value: PropTypes.string,
  id: PropTypes.string
};

Input.defaultProps = {
  invalid: false,
  label: '',
  errorMessage: '',
  shouldValidate: false,
  touched: false,
  changed: null,
  value: '',
  id: '',
  elementConfig: {
    type: 'text'
  }
};

export default Input;
