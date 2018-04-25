import React, { Component } from 'react';

import classes from './Deposit.css';

import DepositWallet from '../../components/PagesSections/DepositWallet/DepositWallet';
import InfoPanel from '../../components/InfoPanel/InfoPanel';

class Deposit extends Component {
  state = {
    depositPlanSelect: {
      elementType: 'select',
      id: 'dp-select',
      value: '',
      elementConfig: {
        type: 'select',
        options: [
          {
            value: 'ghost-gst1',
            displayValue: 'GHOST GST + 30% BONUS'
          },
          {
            value: 'ghost-gst2',
            displayValue: 'GHOST GST + 31% BONUS'
          },
          {
            value: 'ghost-gst3',
            displayValue: 'GHOST GST + 32% BONUS'
          }
        ]
      }
    },
    calculator: {
      data: {
        elementType: 'text',
        label: {
          top: 'DATA',
          bottom: '1GB - 0.90c'
        },
        id: 'calc-data',
        value: 0,
        elementConfig: {
          type: 'text',
          min: '0',
          pattern: '[0-9]*',
          step: '0.0001'
        }
      },
      price: {
        elementType: 'text',
        label: {
          top: 'PRICE',
          bottom: 'MARKET PRICE - $20'
        },
        id: 'calc-price',
        value: 0,
        elementConfig: {
          type: 'text',
          min: '0',
          pattern: '[0-9]*',
          step: '0.0001'
        }
      },
      credit: {
        elementType: 'text',
        label: {
          top: 'CREDIT',
          bottom: '30% - BONUS'
        },
        id: 'calc-credit',
        value: 0,
        elementConfig: {
          type: 'text',
          min: '0',
          pattern: '[0-9]*',
          step: '0.0001'
        }
      },
    }
  };
  handleDepositPlanChange = value => this.setState({
    depositPlanSelect: {
      ...this.state.depositPlanSelect,
      value
    }
  });
  handleCalculatorFieldChange = (value, key) => {
    this.setState({
      calculator: {
        ...this.state.calculator,
        [key]: {
          ...this.state.calculator[key],
          value
        }
      }
    });
  };
  render() {
    return (
      <div className={classes.Deposit}>
        <div className={classes.ContentWrapper}>
          <DepositWallet
            depositPlanSelect={this.state.depositPlanSelect}
            handleDepositPlanChange={val => this.handleDepositPlanChange(val)}
            calculator={this.state.calculator}
            handleCalculatorFieldChange={(val, key) => this.handleCalculatorFieldChange(val, key)}
          />
        </div>
        <InfoPanel />
      </div>
    );
  }
}

export default Deposit;
