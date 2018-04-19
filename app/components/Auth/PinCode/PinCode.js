import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classes from './PinCode.css';

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
  render() {
    return (
      <div>
        <div className={classes.Heading}>
          System identification
        </div>
        <div className={classes.Buttons}>
          {this.state.buttons.map(button => (
            <button
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
        <div>
          <form>
            <button>
              Enter
            </button>
            <input type="text" />
          </form>
          <div>
            {this.state.timer}
          </div>
        </div>
      </div>
    );
  }
}

PinCode.propTypes = {
  buttonClick: PropTypes.func.isRequired
};

export default PinCode;
