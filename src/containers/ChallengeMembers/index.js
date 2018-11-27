import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Flex } from '../../components/common';
import GroupMemberItem from '../../components/GroupMemberItem';
import { navToPersonScreen } from '../../actions/person';
import { organizationSelector } from '../../selectors/organizations';
import {
  communityChallengeSelector,
  acceptedChallengesSelector,
} from '../../selectors/challenges';

import styles from './styles';

class ChallengeMembers extends Component {
  handleSelect = person => {
    const { dispatch, organization } = this.props;
    dispatch(navToPersonScreen(person, organization));
  };

  keyExtractor = i => i.id;

  renderItem = ({ item }) => {
    const { organization } = this.props;
    return (
      <GroupMemberItem
        isUserCreatedOrg={organization.user_created}
        person={item.person}
        onSelect={this.handleSelect}
      />
    );
  };

  render() {
    const { members } = this.props;
    return (
      <Flex value={1}>
        <FlatList
          data={members}
          keyExtractor={this.keyExtractor}
          style={styles.flatList}
          renderItem={this.renderItem}
        />
      </Flex>
    );
  }
}

ChallengeMembers.propTypes = {
  members: PropTypes.array.isRequired,
  organization: PropTypes.object.isRequired,
};

export const mapStateToProps = (
  { organizations },
  { challengeId, orgId, completed },
) => {
  const selectorOrg = organizationSelector({ organizations }, { orgId });

  const selectorChallenge = communityChallengeSelector(
    { organizations },
    { orgId, challengeId },
  );

  const acceptedChallenges = selectorChallenge.accepted_community_challenges;
  const selectorAcceptedChallenges = acceptedChallengesSelector({
    acceptedChallenges,
  });

  return {
    members: completed
      ? selectorAcceptedChallenges.completed
      : selectorAcceptedChallenges.joined,
    organization: selectorOrg,
  };
};

export default connect(mapStateToProps)(ChallengeMembers);
