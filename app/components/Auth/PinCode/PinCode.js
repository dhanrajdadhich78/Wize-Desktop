import React, { Component } from 'react';
import PropTypes from 'prop-types';

import VertivalLineV from '../../UI/VerticalLineV/VerticalLineV';
import PincodeButton from '../../UI/PincodeButton/PincodeButton';

import css from './PinCode.css';
import commonCss from '../../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };
const buttonSwapTimer = 40;

class PinCode extends Component {
  state = {
    buttons: [
      {
        view: {
          suptitle: 'MODE A',
          title: '01',
          letters: ['x', 's']
        },
        value: 1
      },
      {
        view: {
          suptitle: 'MODE D',
          title: '02',
          letters: ['a', 'b', 'c']
        },
        value: 2
      },
      {
        view: {
          suptitle: 'MODE B',
          title: '03',
          letters: ['d', 'e', 'f']
        },
        value: 3
      },
      {
        view: {
          suptitle: 'MODE X',
          title: '04',
          letters: ['g', 'h', 'i']
        },
        value: 4
      },
      {
        view: {
          suptitle: 'MODE C',
          title: '05',
          letters: ['j', 'k', 'l']
        },
        value: 5
      },
      {
        view: {
          suptitle: 'MODE Z',
          title: '06',
          letters: ['m', 'n', 'o']
        },
        value: 6
      },
      {
        view: {
          suptitle: 'MODE Y',
          title: '07',
          letters: ['p', 'g', 'r']
        },
        value: 7
      },
      {
        view: {
          suptitle: 'MODE S',
          title: '08',
          letters: ['t', 'u', 'v']
        },
        value: 8
      },
      {
        view: {
          suptitle: 'MODE V',
          title: '09',
          letters: ['w', 'y', 'z']
        },
        value: 9
      },
      {
        view: {
          subtitle: '',
          title: '0',
          letters: []
        },
        value: 0
      }
    ],
    timer: buttonSwapTimer
  };
  componentWillMount() {
    this.setState({ buttons: this.shuffle(this.state.buttons) });
    setInterval(() => {
      if (this.state.timer) {
        this.setState({ timer: this.state.timer - 1 });
      } else {
        this.setState({ buttons: this.shuffle(this.state.buttons), timer: buttonSwapTimer });
      }
    }, 1000);
  }
  componentWillUnmount() {
    this.setState({ buttons: this.shuffle(this.state.buttons), timer: buttonSwapTimer });
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
    this.setState({ timer: buttonSwapTimer - 1 });
    this.props.buttonClick(val);
  };
  render() {
    return (
      <div className={styles.PinCode}>
        <div
          className={[
            styles.w100,
            styles.flexBetweenCenter,
            styles.TopSection
          ].join(' ')}
        >
          <div className={[styles.flex1, styles.Heading].join(' ')}>
            System identification
          </div>
          <div className={[styles.flex1, styles.Timer].join(' ')}>
            Please enter your pin
            <div>
              <span>[</span>
              {this.state.timer >= 10 ? this.state.timer : `0${this.state.timer}`}
              <span>]</span>
            </div>
          </div>
        </div>
        <div className={styles.Buttons}>
          {
            this.state.buttons.map((button, i) => {
              const buttonVar = (
                <button
                  onClick={() => this.handleButtonClick(button.value)}
                  // eslint-disable-next-line react/no-array-index-key
                  key={i}
                  className={styles.Button}
                  style={
                    this.state.timer < 1 || this.state.timer > (buttonSwapTimer - 1)
                      ? { opacity: 0, transition: `all ${Math.random()}s linear` }
                      : { transition: `all ${Math.random()}s linear` }
                  }
                >
                  <div
                    className={styles.ButtonInnerContainer}
                    style={
                      this.state.timer < 1 || this.state.timer > (buttonSwapTimer - 1)
                        ? { pointerEvents: 'none', cursor: 'default' }
                        : {}
                    }
                  >
                    <div className={styles.SupTitle}>
                      {button.view.suptitle}
                    </div>
                    <div className={styles.Title}>
                      {button.view.title}
                    </div>
                    {
                      button.view.letters
                        ? (
                          <div className={[styles.flex, styles.SubTitle].join(' ')}>
                            {button.view.letters.map((l, j) => <div key={j}>{l}</div>)}
                          </div>
                        )
                        : null
                    }
                    <div />
                  </div>
                  <div className={styles.FocusBlock}>
                    <div /><div /><div /><div />
                  </div>
                </button>
                /*
                <PincodeButton
                  value={button.value}
                  suptitle={button.view.suptitle}
                  title={button.view.title}
                  letters={button.view.letters}
                  buttonClick={val => this.handleButtonClick(val)}
                  timer={this.state.timer}
                  maxTimerVal={buttonSwapTimer - 1}
                  // transition={
                  //   (+this.state.timer < 1 || +this.state.timer > (buttonSwapTimer - 1))
                  //     ? Math.random() : 0
                  // }
                  // reRendrer={this.state.timer < 1 || this.state.timer > (buttonSwapTimer - 1)}
                />
                */
              );
              return (i + 1) !== this.state.buttons.length
                ? buttonVar
                : (
                  <div
                    className={[
                      styles.flexBetweenCenter,
                      styles.w100,
                      styles.LastButtonWrapper
                    ].join(' ')}
                    key={i}
                  >
                    <PincodeButton
                      title="Clear"
                      buttonClick={() => this.props.handleClearPassword()}
                      maxTimerVal={buttonSwapTimer - 1}
                    />
                    {buttonVar}
                    <PincodeButton
                      title="Enter"
                      buttonClick={() => this.props.handleSubmit()}
                      maxTimerVal={buttonSwapTimer - 1}
                    />
                  </div>
                );
            })
          }
        </div>
        <div className={styles.ToTheRight}>
          <VertivalLineV count={12} />
        </div>
      </div>
    );
  }
}

PinCode.propTypes = {
  buttonClick: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleClearPassword: PropTypes.func.isRequired
};

export default PinCode;
