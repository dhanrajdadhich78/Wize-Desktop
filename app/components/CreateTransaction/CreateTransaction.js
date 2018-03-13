import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';

import classes from './CreateTransaction.css';
import checkValidity from '../../utils/validation';
// import {API_URL} from "../../utils/const";

import Spinner from '../../components/UI/Spinner/Spinner';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Aux from '../../hoc/Aux/Aux';
import Modal from '../../components/UI/Modal/Modal';

class CreateTransaction extends Component {
  state = {
    loading: null,
    // error : null,
    controls: {
      from: {
        elementType: 'select',
        elementConfig: {
          type: 'text',
          placeholder: 'From wallet',
          options: []
        },
        // value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        errorMessage: null
      },
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
          pattern: '[0-9]*'
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
  componentWillMount() {
    const options = [];
    // eslint-disable-next-line no-return-assign
    this.props.walletsList.map(wallet => options[options.length] = {
      value: wallet.address,
      displayValue: wallet.address
    });
    this.setState({
      controls: {
        ...this.state.controls,
        from: {
          ...this.state.controls.from,
          elementConfig: {
            ...this.state.controls.from.elementConfig,
            options
          }
        }
      }
    });
  }
  inputChangedHandler = (event, controlName) => {
    const updatedControls = {
      ...this.state.controls,
      [controlName]: {
        ...this.state.controls[controlName],
        value: event.target.value,
        valid: checkValidity(event.target.value, this.state.controls[controlName].validation, controlName).isValid,
        errorMessage: checkValidity(event.target.value, this.state.controls[controlName].validation, controlName).errorMessage,
        touched: true
      }
    };
    this.setState({ controls: updatedControls });
  };

  onSubmitForm = () => {
    // this.setState({loading: true});
    //
    // const config = {
    //   headers: {
    //     'X-ACCESS-TOKEN': this.props.token
    //   }
    // };
    //
    // const data = {
    //   from: this.state.controls.from.value,
    //   to: this.state.controls.to.value,
    //   amount: this.state.controls.amount.value
    // };
    //
    // axios.post(`${API_URL}/api/transaction/create`, data, config)
    //   .then(response => {
    //     this.setState({ loading: false });
    //   })
    //   .catch(error => this.setState({ error: error.response.data.message, loading: false }));
    console.log('submit');
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
      <form onSubmit={this.onSubmitForm}>
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
              changed={event => this.inputChangedHandler(event, formElement.id)}
            />
          ))
        }
        <Button
          disabled={
            !this.state.controls.from.valid ||
            !this.state.controls.to.valid ||
            !this.state.controls.amount.value >= 1
          }
        >
          Send
        </Button>
      </form>
    );

    if (this.state.loading) {
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
                  <Button onClick={() => this.setState({ error: null })}>Ok</Button>
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
  walletsList: PropTypes.arrayOf.isRequired
};

const mapStateToProps = state => ({
  token: state.auth.authKey,
  isAuth: state.auth.authKey !== null,
});

export default connect(mapStateToProps)(CreateTransaction);