import React, { Component } from 'react';
import { FlatList, View, SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { refresh } from '../../utils/common';
import Header from '../Header';
import { IconButton, RefreshControl } from '../../components/common';
import NullStateComponent from '../../components/NullStateComponent';
import ReportCommentItem from '../ReportCommentItem';
import { getReportedComments } from '../../actions/celebrateComments';
import NULL from '../../../assets/images/curiousIcon.png';
import { navigateBack } from '../../actions/navigation';

import styles from './styles';

@translate('groupsReport')
export class GroupReport extends Component {
  state = { refreshing: false };

  loadItems = () => {
    const { dispatch, organization } = this.props;
    return dispatch(getReportedComments(organization.id));
  };

  refreshItems = () => {
    refresh(this, this.loadItems);
  };

  renderItem = ({ item }) => <ReportCommentItem item={item} />;

  navigateBack = () => this.props.dispatch(navigateBack());

  renderList = () => {
    const { refreshing } = this.state;
    const { t, reportItems } = this.props;
    if (reportItems.length === 0) {
      return (
        <NullStateComponent
          imageSource={NULL}
          headerText={t('header').toUpperCase()}
          descriptionText={t('reportNull')}
        />
      );
    }
    return (
      <FlatList
        style={styles.list}
        data={reportItems}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={this.refreshItems}
          />
        }
      />
    );
  };

  render() {
    const { t } = this.props;

    return (
      <View style={styles.pageContainer}>
        <Header
          right={
            <IconButton
              name="deleteIcon"
              type="MissionHub"
              onPress={this.navigateBack}
            />
          }
          style={styles.reportHeader}
          title={t('title')}
        />
        <SafeAreaView style={{ flex: 1 }}>{this.renderList()}</SafeAreaView>
      </View>
    );
  }
}

const mapStateToProps = ({ celebrateComments }, { navigation }) => ({
  ...(navigation.state.params || {}),
  reportItems: celebrateComments.reportItems,
});

export default connect(mapStateToProps)(GroupReport);
export const GROUPS_REPORT_SCREEN = 'nav/GROUPS_REPORT_SCREEN';
