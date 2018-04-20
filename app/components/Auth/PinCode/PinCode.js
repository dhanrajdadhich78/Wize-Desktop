import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classes from './PinCode.css';

import VertivalLineV from '../../UI/VerticalLineV/VerticalLineV';

class PinCode extends Component {
  state = {
    buttons: [
      {
        view: {
          suptitle: 'MODE A',
          title: '01',
          subtitle: 'SUBTITLE'
        },
        value: 1
      },
      {
        view: {
          suptitle: 'MODE A',
          title: '02',
          subtitle: 'SUBTITLE'
        },
        value: 2
      },
      {
        view: {
          suptitle: 'MODE A',
          title: '03',
          subtitle: 'SUBTITLE'
        },
        value: 3
      },
      {
        view: {
          suptitle: 'MODE A',
          title: '04',
          subtitle: 'SUBTITLE'
        },
        value: 4
      },
      {
        view: {
          suptitle: 'MODE A',
          title: '05',
          subtitle: 'SUBTITLE'
        },
        value: 5
      },
      {
        view: {
          suptitle: 'MODE A',
          title: '06',
          subtitle: 'SUBTITLE'
        },
        value: 6
      },
      {
        view: {
          suptitle: 'MODE A',
          title: '07',
          subtitle: 'SUBTITLE'
        },
        value: 7
      },
      {
        view: {
          suptitle: 'MODE A',
          title: '08',
          subtitle: 'SUBTITLE'
        },
        value: 8
      },
      {
        view: {
          suptitle: 'MODE A',
          title: '09',
          subtitle: 'SUBTITLE'
        },
        value: 9
      },
    ],
    timer: 60
  };
  componentWillMount() {
    this.setState({ buttons: this.shuffle(this.state.buttons) });
    setInterval(() => {
      if (this.state.timer) {
        this.setState({ timer: this.state.timer - 1 });
      } else {
        this.setState({ buttons: this.shuffle(this.state.buttons), timer: 60 });
      }
    }, 1000);
  }
  componentWillUnmount() {
    this.setState({ buttons: this.shuffle(this.state.buttons), timer: 60 });
    clearInterval();
  }
  shuffle = array => {
    const updatedArray = [...array];
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;
    // While there remain elements to shuffle...
    while (currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = updatedArray[currentIndex];
      updatedArray[currentIndex] = updatedArray[randomIndex];
      updatedArray[randomIndex] = temporaryValue;
    }

    return updatedArray;
  };
  handleButtonClick = val => {
    this.setState({ timer: 59 });
    this.props.buttonClick(val);
  };
  render() {
    return (
      <div className={classes.PinCode}>
        <div className={classes.Heading}>
          System identification
        </div>
        <div className={classes.Buttons}>
          {this.state.buttons.map((button, i) => (
            <button
              onClick={() => this.handleButtonClick(button.value)}
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              className={classes.Button}
              style={
                this.state.timer < 1 || this.state.timer > 59
                  ? { opacity: 0, transition: `all ${Math.random()}s linear` }
                  : { transition: `all ${Math.random()}s linear` }
              }
            >
              <div
                className={classes.ButtonInnerContainer}
                style={
                  this.state.timer < 1 || this.state.timer > 59
                    ? { pointerEvents: 'none', cursor: 'default' }
                    : {}
                }
              >
                <div>
                  {button.view.suptitle}
                </div>
                <div>
                  {button.view.title}
                </div>
                <div>
                  {button.view.subtitle}
                </div>
                <div />
              </div>
              <div className={classes.FocusBlock}>
                <div /><div /><div /><div />
              </div>
            </button>
          ))}
        </div>
        <form
          className={classes.FormLine}
          onSubmit={e => { e.preventDefault(); this.props.handleSubmit(); }}
        >
          <button tabIndex={-1}>
            <div>Enter</div>
            <div>
              <div /><div /><div /><div />
            </div>
          </button>
          <div className={classes.InputBlock}>
            <div>
              Please enter you pin
            </div>
            <input
              type="password"
              value={this.props.password}
              tabIndex={-1}
            />
          </div>
          <div className={classes.Timer}>
            <span>[</span>
            {this.state.timer >= 10 ? this.state.timer : `0${this.state.timer}`}
            <span>]</span>
          </div>
        </form>
        <div className={classes.ToTheRight}>
          <VertivalLineV count={12} />
        </div>
      </div>
    );
  }
}

PinCode.propTypes = {
  password: PropTypes.PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  buttonClick: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
};

PinCode.defaultProps = {
  password: ''
};

export default PinCode;
