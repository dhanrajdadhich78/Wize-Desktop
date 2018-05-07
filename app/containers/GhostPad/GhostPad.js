import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import uuidv4 from 'uuid/v4';

import * as actions from '../../store/actions/index';

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
  handleCreateNote = () => {
    const note = {
      id: uuidv4(),
      date: Math.floor(Date.now() / 1000),
      text: this.state.newNote
    };
    this.setState({ newNote: '' });
    return this.props.createNote(note, this.props.userData, this.props.raftNode);
  };
  handleDeleteNote = id => this.props.deleteNote(id, this.props.userData, this.props.raftNode);
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
            createNote={() => this.handleCreateNote()}
          />
        </div>
        <div className={styles.NoteListWrapper}>
          <WithCustomScrollbar>
            <NotesList
              notes={this.props.notes}
              deleteNote={id => this.handleDeleteNote(id)}
            />
          </WithCustomScrollbar>
        </div>
      </div>
    );
  }
}

GhostPad.propTypes = {
  notes: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  createNote: PropTypes.func.isRequired,
  deleteNote: PropTypes.func.isRequired,
  userData: PropTypes.shape().isRequired,
  raftNode: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  notes: state.notes.notes,
  userData: state.auth.userData,
  raftNode: state.digest.digestInfo.raftNodes[0]
});

const mapDispatchToProps = dispatch => ({
  createNote: (note, userData, raftNode) => dispatch(actions.createNote(note, userData, raftNode)),
  deleteNote: (id, userData, raftNode) => dispatch(actions.deleteNote(id, userData, raftNode))
});

export default connect(mapStateToProps, mapDispatchToProps)(GhostPad);
