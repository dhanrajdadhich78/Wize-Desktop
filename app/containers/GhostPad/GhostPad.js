import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AddNote from '../../components/Notes/AddNote/AddNote';
import NotesList from '../../components/Notes/NotesList/NotesList';
import WithCustomScrollbar from '../../components/UI/WithCustomScrollbar/WithCustomScrollbar';

import css from './GhostPad.css';
import commonCss from '../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

class GhostPad extends Component {
  state = {
    newNote: ''
  };
  render() {
    return (
      <div
        className={[
          styles.flexColumn,
          styles.w100,
          styles.h100,
          styles.GhostPad
        ].join(' ')}
      >
        <div className={styles.AddNoteWrapper}>
          <AddNote
            value={this.state.newNote}
            onchange={newNote => this.setState({ newNote })}
          />
        </div>
        <div className={styles.NoteListWrapper}>
          <WithCustomScrollbar>
            <NotesList
              notes={this.props.notes}
            />
          </WithCustomScrollbar>
        </div>
      </div>
    );
  }
}

GhostPad.propTypes = {
  notes: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

const mapStateToProps = state => ({
  notes: state.notes.notes
});

export default connect(mapStateToProps)(GhostPad);
