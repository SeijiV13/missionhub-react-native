import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Alert, FlatList } from 'react-native';
import { withTranslation } from 'react-i18next';

import { celebrateCommentsSelector } from '../../selectors/celebrateComments';
import {
  reloadCelebrateComments,
  getCelebrateCommentsNextPage,
  deleteCelebrateComment,
  setCelebrateEditingComment,
  resetCelebrateEditingComment,
} from '../../actions/celebrateComments';
import { reportComment } from '../../actions/reportComments';
import LoadMore from '../../components/LoadMore';
import { showMenu, keyExtractorId, isOwner } from '../../utils/common';
import CommentItem from '../CommentItem';
import { orgPermissionSelector } from '../../selectors/people';

import styles from './styles';

@withTranslation('commentsList')
class CommentsList extends Component {
  componentDidMount() {
    const { dispatch, event } = this.props;

    dispatch(reloadCelebrateComments(event));
    dispatch(resetCelebrateEditingComment());
  }

  handleLoadMore = () => {
    const { dispatch, event } = this.props;

    dispatch(getCelebrateCommentsNextPage(event));
  };

  handleEdit = item => {
    this.props.dispatch(setCelebrateEditingComment(item.id));
  };

  alert = ({ title, message, actionText, action }) => {
    const { t } = this.props;
    Alert.alert(t(title), t(message), [
      {
        text: t('cancel'),
        style: 'cancel',
      },
      {
        text: t(actionText),
        onPress: action,
      },
    ]);
  };

  handleDelete = item => {
    const { dispatch, event } = this.props;

    this.alert({
      title: 'deletePostHeader',
      message: 'deleteAreYouSure',
      actionText: 'deletePost',
      action: () => {
        dispatch(deleteCelebrateComment(event.organization.id, event, item));
      },
    });
  };

  handleReport = item => {
    const { dispatch, event } = this.props;
    this.alert({
      title: 'reportToOwnerHeader',
      message: 'reportAreYouSure',
      actionText: 'reportPost',
      action: () => {
        dispatch(reportComment(event.organization.id, item));
      },
    });
  };

  handleLongPress = (item, componentRef) => {
    const {
      t,
      event: { organization },
      me,
    } = this.props;

    const actions = [];
    const deleteAction = {
      text: t('deletePost'),
      onPress: () => this.handleDelete(item),
      destructive: true,
    };

    if (me.id === item.person.id) {
      actions.push({
        text: t('editPost'),
        onPress: () => this.handleEdit(item),
      });
      actions.push(deleteAction);
    } else {
      const orgPermission =
        orgPermissionSelector(null, {
          person: me,
          organization,
        }) || {};
      if (isOwner(orgPermission)) {
        actions.push(deleteAction);
      } else {
        actions.push({
          text: t('reportToOwner'),
          onPress: () => this.handleReport(item),
        });
      }
    }

    showMenu(actions, componentRef);
  };

  renderItem = ({ item }) => (
    <CommentItem
      item={item}
      onLongPress={this.handleLongPress}
      organization={this.props.event.organization}
    />
  );

  render() {
    const {
      listProps,
      celebrateComments: { comments, pagination } = {},
    } = this.props;
    const { list, listContent } = styles;

    return (
      <FlatList
        data={comments}
        keyExtractor={keyExtractorId}
        renderItem={this.renderItem}
        style={list}
        contentContainerStyle={listContent}
        ListFooterComponent={
          pagination &&
          pagination.hasNextPage && <LoadMore onPress={this.handleLoadMore} />
        }
        bounces={false}
        {...listProps}
      />
    );
  }
}

CommentsList.propTypes = {
  event: PropTypes.object.isRequired,
};

const mapStateToProps = ({ auth, celebrateComments }, { event }) => ({
  me: auth.person,
  celebrateComments: celebrateCommentsSelector(
    { celebrateComments },
    { eventId: event.id },
  ),
});
export default connect(mapStateToProps)(CommentsList);
