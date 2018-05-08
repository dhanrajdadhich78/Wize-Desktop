import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import uuidv4 from 'uuid/v4';

import * as actions from '../../store/actions/index';

import ControlPanel from '../../components/Notes/ControlPanel/ControlPanel';
import NotesPanel from '../../components/Notes/NotesPanel/NotesPanel';

import css from './GhostPad.css';
import commonCss from '../../assets/css/common.css';
// global classes names starts with lowercase letter: styles.class
// and component classes - uppercase: styles.Class
const styles = { ...commonCss, ...css };

class GhostPad extends Component {
  state = {
    pinCode: '',
    notes: [],
    selectedNote: {}
  };
  componentWillMount() {
    this.setState({
      notes: [...this.props.notes],
      selectedNote: this.props.notes[0]
    });
  }
  handleAddNote = () => {
    const newNote = {
      id: uuidv4(),
      date: +new Date() / 1000,
      title: 'Untitled',
      text: ''
    };
    this.setState({
      notes: [
        newNote,
        ...this.state.notes
      ],
      selectedNote: newNote
    });
  };
  handleSelectNote = id => (
    this.setState({
      pinCode: '',
      selectedNote: this.state.notes.find(el => el.id === id)
    })
  );
  handleEditNote = text => (
    this.setState({
      selectedNote: {
        ...this.state.selectedNote,
        title: text.match(/\n/) ? text.substr(0, text.match(/\n/).index) : text,
        text
      },
      notes: [
        {
          ...this.state.notes.find(el => el.id === this.state.selectedNote.id),
          title: text.match(/\n/) ? text.substr(0, text.match(/\n/).index) : text
        },
        ...this.state.notes.filter(el => el.id !== this.state.selectedNote.id)
      ]
    })
  );
  handleSaveNotesList = () => {
    const updNotes = [
      this.state.selectedNote,
      ...this.state.notes.filter(el => el.id !== this.state.selectedNote.id)
    ];
    this.props.editNotesList(updNotes, this.props.userData, this.props.raftNode);
  };
  render() {
    // console.log((this.state.selectedNote && this.state.selectedNote.text
    // ? (this.state.selectedNote.text.match(/\n/g) || [])
    // : []).length);
    return (
      <div
        className={[
          styles.flexColumn,
          styles.w100,
          styles.h100,
          styles.GhostPad
        ].join(' ')}
      >
        <div>
          <ControlPanel
            pinCode={this.state.pinCode}
            addNote={() => this.handleAddNote()}
          />
        </div>
        <div className={styles.flexColumn}>
          <NotesPanel
            notes={this.state.notes}
            selectNote={id => this.handleSelectNote(id)}
            handleEditNote={val => this.handleEditNote(val)}
            selectedNote={this.state.selectedNote}
            saveNotesList={() => this.handleSaveNotesList()}
          />
        </div>
      </div>
    );
  }
}

GhostPad.propTypes = {
  notes: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  editNotesList: PropTypes.func.isRequired,
  // deleteNote: PropTypes.func.isRequired,
  userData: PropTypes.shape().isRequired,
  raftNode: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  notes: state.notes.notes,
  userData: state.auth.userData,
  raftNode: state.digest.digestInfo.raftNodes[0]
});

const mapDispatchToProps = dispatch => ({
  editNotesList: (notes, userData, raftNode) => (
    dispatch(actions.editNotesList(notes, userData, raftNode))
  ),
  deleteNote: (id, userData, raftNode) => dispatch(actions.deleteNote(id, userData, raftNode))
});

export default connect(mapStateToProps, mapDispatchToProps)(GhostPad);
