/* eslint-disable guard-for-in,no-restricted-syntax */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import classes from './CreateTransaction.css';
import checkValidity from '../../../../utils/validation';

import Spinner from '../../../UI/Spinner/Spinner';
import Input from '../../../UI/Input/Input';
import Button from '../../../UI/Button/Button';
import Aux from '../../../../hoc/Aux/Aux';
import Modal from '../../../UI/Modal/Modal';

class CreateTransaction extends Component {
  state = {
    controls: {
      to: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'To wallet'
        },
        value: '',
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
        errorMessage: null
      },
      amount: {
        elementType: 'input',
        elementConfig: {
          type: 'number',
          placeholder: 'Amount',
          min: '0',
          pattern: '[0-9]*',
          step: '0.0001'
        },
        value: '0',
        validation: {
          required: true,
          isNumeric: true,
        },
        valid: false,
        touched: false,
        errorMessage: null
      }
    }
  };
  inputChangedHandler = (val, controlName) => {
    const updatedControls = {
      ...this.state.controls,
      [controlName]: {
        ...this.state.controls[controlName],
        value: val,
        valid: checkValidity(
          val,
          this.state.controls[controlName].validation,
          controlName
        ).isValid,
        errorMessage: checkValidity(
          val,
          this.state.controls[controlName].validation,
          controlName
        ).errorMessage,
        touched: true
      }
    };
    this.setState({ controls: updatedControls });
  };

  onSubmitForm = () => {
    this.props.handleSubmitTransaction(
      this.state.controls.to.value,
      this.state.controls.amount.value
    );
  };

  render() {
    // form
    const formElementsArray = [];
    for (const key in this.state.controls) {
      formElementsArray.push({
        id: key,
        config: this.state.controls[key]
      });
    }

    let form = (
      <form onSubmit={e => { e.preventDefault(); this.onSubmitForm(); }}>
        {
          formElementsArray.map(formElement => (
            <Input
              errorMessage={formElement.config.errorMessage}
              key={formElement.id}
              elementType={formElement.config.elementType}
              elementConfig={formElement.config.elementConfig}
              value={formElement.config.value}
              invalid={!formElement.config.valid}
              shouldValidate={formElement.config.validation.required}
              touched={formElement.config.touched}
              changed={val => this.inputChangedHandler(val, formElement.id)}
            />
          ))
        }
        <div className={classes.FormGroup} style={{ display: 'none' }}>
          <input
            id="wallet-minenow"
            type="checkbox"
            checked={this.props.minenow}
            onChange={() => this.props.handleOnMineNowCheck()}
          />
          {/* eslint-disable-next-line jsx-a11y/label-has-for */}
          <label htmlFor="wallet-minenow">Minenow</label>
        </div>
        <Button
          disabled={
            // !this.state.controls.from.valid ||
            !this.state.controls.to.valid ||
            !this.state.controls.amount.value >= 1 ||
            this.props.transactionLoading
          }
        >
          Send
        </Button>
      </form>
    );

    if (this.state.transactionLoading) {
      form = <Spinner />;
    }

    return (
      <Aux>
        <Modal
          show={this.state.error}
          modalClosed={() => this.setState({ error: null })}
        >
          {
            this.state.error
              ? (
                <div className={classes.ModalContent}>
                  <h1>{this.state.error}</h1>
                  <Button
                    onClick={() => this.setState({ error: null })}
                  >
                    Ok
                  </Button>
                </div>
              )
              : null
          }
        </Modal>

        <div>
          <div>
            {form}
          </div>
        </div>
      </Aux>
    );
  }
}

CreateTransaction.propTypes = {
  minenow: PropTypes.bool.isRequired,
  handleOnMineNowCheck: PropTypes.func.isRequired,
  handleSubmitTransaction: PropTypes.func.isRequired,
  transactionLoading: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  token: state.auth.authKey,
  isAuth: state.auth.authKey !== null,
});

export default connect(mapStateToProps)(CreateTransaction);
