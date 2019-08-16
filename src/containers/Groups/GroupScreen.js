import React, { Component } from 'react';
import { connect } from 'react-redux';
import i18next from 'i18next';

import Header from '../../components/Header/index';
import { navigatePush, navigateToMainTabs } from '../../actions/navigation';
import { refreshCommunity } from '../../actions/organizations';
import { generateSwipeTabMenuNavigator } from '../../components/SwipeTabMenu/index';
import ImpactView from '../ImpactView';
import IconButton from '../../components/IconButton';
import { ADD_PERSON_THEN_COMMUNITY_MEMBERS_FLOW } from '../../routes/constants';
import { organizationSelector } from '../../selectors/organizations';
import { buildTrackingObj, disableBack } from '../../utils/common';
import { GLOBAL_COMMUNITY_ID, GROUPS_TAB } from '../../constants';

import GroupCelebrate from './GroupCelebrate';
import Members from './Members';
import Contacts from './Contacts';
import Surveys from './Surveys';
import GroupChallenges from './GroupChallenges';
import { GROUP_PROFILE } from './GroupProfile';

class GroupScreen extends Component {
  componentDidMount() {
    disableBack.add();

    const { dispatch, orgId } = this.props;
    dispatch(refreshCommunity(orgId));
  }

  componentWillUnmount() {
    disableBack.remove();
  }

  handleAddContact = () => {
    const { dispatch, organization } = this.props;

    dispatch(
      navigatePush(ADD_PERSON_THEN_COMMUNITY_MEMBERS_FLOW, {
        organization: organization.id ? organization : undefined,
      }),
    );
  };

  handleProfile = () => {
    const { dispatch, organization } = this.props;

    dispatch(navigatePush(GROUP_PROFILE, { organization }));
  };

  back = () => {
    this.props.dispatch(navigateToMainTabs(GROUPS_TAB));
  };

  renderAddContactIcon() {
    const { organization } = this.props;

    if (organization.id === GLOBAL_COMMUNITY_ID) {
      return null;
    }

    return !organization.user_created ? (
      <IconButton
        name="addContactIcon"
        type="MissionHub"
        size={24}
        onPress={this.handleAddContact}
      />
    ) : (
      <IconButton
        name="moreIcon"
        type="MissionHub"
        onPress={this.handleProfile}
      />
    );
  }

  render() {
    const { organization } = this.props;
    console.log(organization);
    return (
      <Header
        left={
          <IconButton
            name="homeIcon"
            type="MissionHub"
            size={24}
            onPress={this.back}
          />
        }
        shadow={false}
        title={organization.name}
        right={this.renderAddContactIcon()}
      />
    );
  }
}

const mapStateToProps = ({ organizations }, { orgId, initialTab }) => {
  console.log(orgId);
  return {
    orgId,
    organization: organizationSelector({ organizations }, { orgId }),
    initialTab,
  };
};

export const connectedGroupScreen = connect(mapStateToProps)(GroupScreen);

const GROUP_CELEBRATE = 'nav/GROUP_CELEBRATE';
export const GROUP_CHALLENGES = 'nav/GROUP_CHALLENGES';
export const GROUP_MEMBERS = 'nav/GROUP_MEMBERS';
const GROUP_IMPACT = 'nav/GROUP_IMPACT';
const GROUP_CONTACTS = 'nav/GROUP_CONTACTS';
const GROUP_SURVEYS = 'nav/GROUP_SURVEYS';

export const CRU_TABS = [
  {
    name: i18next.t('groupTabs:celebrate'),
    navigationAction: GROUP_CELEBRATE,
    component: ({
      navigation: {
        state: {
          params: { organization },
        },
      },
    }) => <GroupCelebrate organization={organization} />,
  },
  {
    name: i18next.t('groupTabs:challenges'),
    navigationAction: GROUP_CHALLENGES,
    component: ({
      navigation: {
        state: {
          params: { organization },
        },
      },
    }) => <GroupChallenges organization={organization} />,
  },
  {
    name: i18next.t('groupTabs:members'),
    navigationAction: GROUP_MEMBERS,
    component: ({
      navigation: {
        state: {
          params: { organization },
        },
      },
    }) => <Members organization={organization} />,
  },
  {
    name: i18next.t('groupTabs:impact'),
    navigationAction: GROUP_IMPACT,
    component: ({
      navigation: {
        state: {
          params: { organization },
        },
      },
    }) => <ImpactView organization={organization} />,
  },
  {
    name: i18next.t('groupTabs:contacts'),
    navigationAction: GROUP_CONTACTS,
    component: ({
      navigation: {
        state: {
          params: { organization },
        },
      },
    }) => <Contacts organization={organization} />,
  },
  {
    name: i18next.t('groupTabs:surveys'),
    navigationAction: GROUP_SURVEYS,
    component: ({
      navigation: {
        state: {
          params: { organization },
        },
      },
    }) => <Surveys organization={organization} />,
  },
];
export const USER_CREATED_TABS = CRU_TABS.slice(0, 4);
export const GLOBAL_TABS = [CRU_TABS[0], CRU_TABS[1], CRU_TABS[3]];

export const groupScreenTabNavigator = generateSwipeTabMenuNavigator(
  CRU_TABS,
  connectedGroupScreen,
);
export const userCreatedScreenTabNavigator = generateSwipeTabMenuNavigator(
  USER_CREATED_TABS,
  connectedGroupScreen,
);
export const globalScreenTabNavigator = generateSwipeTabMenuNavigator(
  GLOBAL_TABS,
  connectedGroupScreen,
);

export const GROUP_SCREEN = 'nav/GROUP_SCREEN';
export const USER_CREATED_GROUP_SCREEN = 'nav/USER_CREATED_GROUP_SCREEN';
export const GLOBAL_GROUP_SCREEN = 'nav/GLOBAL_GROUP_SCREEN';

export function getScreenForOrg(orgId, user_created) {
  return orgId === GLOBAL_COMMUNITY_ID
    ? GLOBAL_GROUP_SCREEN
    : user_created
    ? USER_CREATED_GROUP_SCREEN
    : GROUP_SCREEN;
}

export const GROUP_TABS = {
  [GROUP_CELEBRATE]: {
    tracking: buildTrackingObj(
      'communities : celebration',
      'communities',
      'celebration',
    ),
  },
  [GROUP_CHALLENGES]: {
    tracking: buildTrackingObj(
      'communities : challenges',
      'communities',
      'challenges',
    ),
  },
  [GROUP_MEMBERS]: {
    tracking: buildTrackingObj(
      'communities : members',
      'communities',
      'members',
    ),
  },
  [GROUP_IMPACT]: {
    tracking: buildTrackingObj(
      'communities : our impact',
      'communities',
      'our impact',
    ),
  },
  [GROUP_CONTACTS]: {
    tracking: buildTrackingObj(
      'communities : contacts',
      'communities',
      'contacts',
    ),
  },
  [GROUP_SURVEYS]: {
    tracking: buildTrackingObj(
      'communities : surveys',
      'communities',
      'surveys',
    ),
  },
};
