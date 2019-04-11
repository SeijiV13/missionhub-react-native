import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import CommentBox from '../CommentBox';
import {
  createCelebrateComment,
  resetCelebrateEditingComment,
  updateCelebrateComment,
} from '../../actions/celebrateComments';
import { celebrationItemSelector } from '../../selectors/celebration';
import { celebrateCommentsCommentSelector } from '../../selectors/celebrateComments';

import styles from './styles';

class CelebrateCommentBox extends Component {
  componentWillUnmount() {
    this.cancel();
  }

  submitComment = async (action, text) => {
    const { dispatch, event, editingComment, onAddComplete } = this.props;

    if (editingComment) {
      this.cancel();
      return dispatch(updateCelebrateComment(editingComment, text));
    }

    const results = await dispatch(createCelebrateComment(event, text));
    onAddComplete & onAddComplete();
    return results;
  };

  cancel = () => {
    this.props.dispatch(resetCelebrateEditingComment());
  };

  render() {
    return (
      <CommentBox
        placeholderTextKey={'celebrateCommentBox:placeholder'}
        onSubmit={this.submitComment}
        hideActions={true}
        editingComment={this.props.editingComment}
        onCancel={this.cancel}
        containerStyle={styles.container}
      />
    );
  }
}

CelebrateCommentBox.propTypes = {
  event: PropTypes.object.isRequired,
  editingComment: PropTypes.object,
  onAddComplete: PropTypes.func,
};

const mapStateToProps = ({ organizations, celebrateComments }, { event }) => ({
  editingComment: celebrateCommentsCommentSelector(
    { celebrateComments },
    { eventId: event.id, commentId: celebrateComments.editingCommentId },
  ),
  event:
    celebrationItemSelector(
      { organizations },
      { eventId: event.id, organizationId: event.organization.id },
    ) || event,
});

export default connect(mapStateToProps)(CelebrateCommentBox);
