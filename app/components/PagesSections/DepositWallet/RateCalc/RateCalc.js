import React from 'react';
import PropTypes from 'prop-types';

import classes from './RateCalc.css';

import Input from '../../../UI/Input/Input';

const rateCalc = props => {
  const handler = (val, k) => props.handleCalculatorFieldChange(val, k);
  return (
    <div className={classes.RateCalc}>
      <div className={classes.Heading}>
        <h3>
          CALCULATOR
        </h3>
      </div>
      <div className={classes.FormWrapper}>
        <form>
          {
            Object.keys(props.calculator).map(k => (
              <Input
                key={k}
                elKey={k}
                type={props.calculator[k].type}
                elementType={props.calculator[k].elementType}
                value={props.calculator[k].value}
                changed={val => handler(val, k)}
                elementConfig={props.calculator[k].elementConfig}
                id={props.calculator[k].id}
                label={props.calculator[k].label}
              />
            ))
          }
        </form>
      </div>
    </div>
  );
};

rateCalc.propTypes = {
  calculator: PropTypes.shape().isRequired,
  handleCalculatorFieldChange: PropTypes.func.isRequired
};

export default rateCalc;
