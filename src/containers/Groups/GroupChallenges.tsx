import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux-legacy';
import { withTranslation } from 'react-i18next';

import ChallengeFeed from '../ChallengeFeed';
import {
  getGroupChallengeFeed,
  reloadGroupChallengeFeed,
  createChallenge,
} from '../../actions/challenges';
import BottomButton from '../../components/BottomButton';
import { organizationSelector } from '../../selectors/organizations';
import { refresh, isAdminOrOwner } from '../../utils/common';
import { getAnalyticsPermissionType } from '../../utils/analytics';
import { ANALYTICS_PERMISSION_TYPE } from '../../constants';
import { challengesSelector } from '../../selectors/challenges';
import { navigatePush, navigateBack } from '../../actions/navigation';
import { refreshCommunity } from '../../actions/organizations';
import { ADD_CHALLENGE_SCREEN } from '../AddChallengeScreen';
import { orgPermissionSelector } from '../../selectors/people';
import Analytics from '../Analytics';

import styles from './styles';

// @ts-ignore
@withTranslation('groupsChallenge')
class GroupChallenges extends Component {
  state = { refreshing: false };

  componentDidMount() {
    this.loadItems();
  }

  loadItems = () => {
    // @ts-ignore
    const { dispatch, organization } = this.props;
    dispatch(getGroupChallengeFeed(organization.id));
  };

  reloadItems = () => {
    // @ts-ignore
    const { dispatch, organization } = this.props;
    dispatch(refreshCommunity(organization.id));
    return dispatch(reloadGroupChallengeFeed(organization.id));
  };

  refreshItems = () => {
    refresh(this, this.reloadItems);
  };

  // @ts-ignore
  createChallenge = challenge => {
    // @ts-ignore
    const { dispatch, organization } = this.props;
    dispatch(createChallenge(challenge, organization.id));
  };

  create = () => {
    // @ts-ignore
    const { dispatch, organization } = this.props;
    dispatch(
      navigatePush(ADD_CHALLENGE_SCREEN, {
        organization,
        // @ts-ignore
        onComplete: challenge => {
          this.createChallenge(challenge);
          dispatch(navigateBack());
        },
      }),
    );
  };

  render() {
    const { refreshing } = this.state;
    const {
      // @ts-ignore
      t,
      // @ts-ignore
      challengeItems,
      // @ts-ignore
      organization,
      // @ts-ignore
      myOrgPermissions,
      // @ts-ignore
      analyticsPermissionType,
    } = this.props;

    const canCreate = isAdminOrOwner(myOrgPermissions);

    return (
      // @ts-ignore
      <View flex={1}>
        <Analytics
          screenName={['community', 'challenges']}
          screenContext={{
            [ANALYTICS_PERMISSION_TYPE]: analyticsPermissionType,
          }}
        />
        <View style={styles.cardList}>
          <ChallengeFeed
            // @ts-ignore
            organization={organization}
            items={challengeItems}
            loadMoreItemsCallback={this.loadItems}
            refreshCallback={this.refreshItems}
            refreshing={refreshing}
            extraPadding={canCreate}
          />
        </View>
        {canCreate ? (
          <BottomButton onPress={this.create} text={t('create')} />
        ) : null}
      </View>
    );
  }
}

// @ts-ignore
const mapStateToProps = ({ auth, organizations }, { orgId = 'personal' }) => {
  const organization = organizationSelector({ organizations }, { orgId });

  return {
    organization,
    // @ts-ignore
    challengeItems: challengesSelector({
      challengeItems: organization.challengeItems || [],
    }),
    pagination: organization.challengePagination || {},
    myOrgPermissions: orgPermissionSelector(
      {},
      {
        person: auth.person,
        organization,
      },
    ),
    analyticsPermissionType: getAnalyticsPermissionType(auth, organization),
  };
};

export default connect(mapStateToProps)(GroupChallenges);
