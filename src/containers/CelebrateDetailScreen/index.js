import React, { Component } from 'react';
import {
  Image,
  View,
  SafeAreaView,
  StatusBar,
  findNodeHandle,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/default
import ParallaxScrollView from 'react-native-parallax-scroll-view';

import CommentLikeComponent from '../CommentLikeComponent';
import { celebrationItemSelector } from '../../selectors/celebration';
import { organizationSelector } from '../../selectors/organizations';
import CelebrateItem from '../../components/CelebrateItem';
import CommentsList from '../CommentsList';
import BackButton from '../BackButton';
import CelebrateCommentBox from '../../components/CelebrateCommentBox';
import theme from '../../theme';
import Header from '../../components/Header';
import ItemHeaderText from '../../components/ItemHeaderText';
import TRAILS1 from '../../../assets/images/Trailss.png';
import TRAILS2 from '../../../assets/images/TrailGrey.png';
import { refresh, keyboardShow } from '../../utils/common';
import { reloadCelebrateComments } from '../../actions/celebrateComments';
import { RefreshControl } from '../../components/common';
import { celebrateCommentsSelector } from '../../selectors/celebrateComments';

import styles from './styles';

class CelebrateDetailScreen extends Component {
  state = { refreshing: false, scrollViewHeight: 0 };

  componentDidMount() {
    this.keyboardShowListener = keyboardShow(this.keyboardShow);
  }

  componentWillUnmount() {
    this.keyboardShowListener.remove();
  }

  keyboardShow = () => {
    this.scrollToFocusedRef();
  };

  scrollToEnd = () => {
    this.list.getScrollResponder().scrollToEnd();
  };

  scrollToComponent(view) {
    const { parallaxHeaderHeight, headerHeight } = theme;
    const scrollResponder = this.list.getScrollResponder();
    // Need to wrap in set timeout to let the keyboard come up before running all calculations
    setTimeout(() => {
      // https://facebook.github.io/react-native/docs/direct-manipulation.html#measurelayoutrelativetonativenode-onsuccess-onfail
      view.measureLayout(
        findNodeHandle(scrollResponder.getInnerViewNode()),
        // eslint-disable-next-line max-params
        (fx, fy, width, height) => {
          // Need to at least scroll down to show the condensed sticky header
          const minScroll = parallaxHeaderHeight - headerHeight;
          const scrollTo = Math.max(minScroll, fy - height - headerHeight);
          scrollResponder.scrollTo({ y: scrollTo });
        },
        // Error calculating the layout, just scroll to end
        () => this.scrollToEnd(),
      );
    }, 1);
  }

  getCommentRefs() {
    return this.commentsList
      .getWrappedInstance()
      .getWrappedInstance()
      .getItemRefs();
  }

  scrollToFocusedRef = () => {
    const {
      celebrateComments: { comments },
      editingCommentId: editId,
    } = this.props;
    const commentsLength = comments.length;
    if (commentsLength > 0) {
      const lastId = (comments[commentsLength - 1] || {}).id;
      // Don't bother calculating anything if there's a few comments and we're scrolling to the last one
      if (commentsLength > 3 && (!editId || editId === lastId)) {
        // Need to wrap in set timeout to let the keyboard dismiss or come up before scrolling
        setTimeout(() => this.scrollToEnd(), 1);
        return;
      }

      // Get the comment refs from the <CommentsList> component wrappen in 'connect' and '@translate'
      const refs = this.getCommentRefs();

      // Get the comment that we want to focus on
      const focusCommentRef = editId ? refs[editId] : refs[lastId];

      if (focusCommentRef) {
        this.scrollToComponent(focusCommentRef.getWrappedInstance().view);
      }
    }
  };

  addComplete = () => {
    this.scrollToFocusedRef();
  };

  onContentSizeChange = (contentWidth, contentHeight) => {
    this.setState({ scrollViewHeight: contentHeight });
  };

  refreshComments = () => {
    const { dispatch, event } = this.props;

    return dispatch(reloadCelebrateComments(event));
  };

  handleRefresh = () => refresh(this, this.refreshComments);

  renderBackButton = () => {
    const { backButtonStyle } = styles;

    return <BackButton iconStyle={backButtonStyle} customIcon="deleteIcon" />;
  };

  renderForeground = () => {
    const { event, organization } = this.props;
    const { cardStyle } = styles;

    return (
      <CelebrateItem
        event={event}
        organization={organization}
        cardStyle={cardStyle}
        rightCorner={this.renderBackButton()}
        namePressable={true}
      />
    );
  };

  renderStickyHeader = () => {
    const { event } = this.props;
    const { subject_person_name } = event;
    const { headerStyle, leftHeaderItemStyle, rightHeaderItemStyle } = styles;

    return (
      <Header
        shadow={false}
        left={
          <ItemHeaderText
            text={subject_person_name}
            style={leftHeaderItemStyle}
          />
        }
        right={
          <View style={rightHeaderItemStyle}>
            <CommentLikeComponent event={event} />
            {this.renderBackButton()}
          </View>
        }
        style={headerStyle}
      />
    );
  };

  listRef = c => (this.list = c);
  commentsListRef = c => (this.commentsList = c);

  render() {
    const { event } = this.props;
    const { container } = styles;
    const {
      white,
      grey,
      parallaxHeaderHeight,
      headerHeight,
      statusBar: { darkContent },
    } = theme;

    return (
      <SafeAreaView style={container}>
        <StatusBar {...darkContent} />
        <ParallaxScrollView
          ref={this.listRef}
          backgroundColor={white}
          contentBackgroundColor={grey}
          parallaxHeaderHeight={parallaxHeaderHeight}
          renderForeground={this.renderForeground}
          stickyHeaderHeight={headerHeight}
          renderStickyHeader={this.renderStickyHeader}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.handleRefresh}
            />
          }
          onContentSizeChange={this.onContentSizeChange}
        >
          <View style={styles.scrollContent}>
            <Image source={TRAILS1} style={styles.trailsTop} />
            <Image source={TRAILS2} style={styles.trailsBottom} />
            <CommentsList
              ref={this.commentsListRef}
              event={event}
              organizationId={event.organization.id}
            />
          </View>
        </ParallaxScrollView>
        <CelebrateCommentBox event={event} onAddComplete={this.addComplete} />
      </SafeAreaView>
    );
  }
}

CelebrateDetailScreen.propTypes = {
  event: PropTypes.object.isRequired,
};

const mapStateToProps = (
  { organizations, celebrateComments },
  {
    navigation: {
      state: {
        params: { event },
      },
    },
  },
) => ({
  event:
    celebrationItemSelector(
      { organizations },
      { eventId: event.id, organizationId: event.organization.id },
    ) || event,
  organization: organizationSelector(
    { organizations },
    { orgId: event.organization.id },
  ),
  celebrateComments: celebrateCommentsSelector(
    { celebrateComments },
    { eventId: event.id },
  ),
  editingCommentId: celebrateComments.editingCommentId,
});
export default connect(mapStateToProps)(CelebrateDetailScreen);
export const CELEBRATE_DETAIL_SCREEN = 'nav/CELEBRATE_DETAIL_SCREEN';
