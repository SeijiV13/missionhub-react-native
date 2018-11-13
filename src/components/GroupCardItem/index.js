import React, { Component } from 'react';
import { Image } from 'react-native';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import { Text, Flex, Card, Button } from '../common';
import DEFAULT_MISSIONHUB_IMAGE from '../../../assets/images/impactBackground.png';
// TODO: Need the correct default image for user created communities
import DEFAULT_USER_COMMUNITY_IMAGE from '../../../assets/images/impactBackground.png';

import styles from './styles';

@translate('groupItem')
export default class GroupCardItem extends Component {
  handlePress = () => {
    const { onPress, group } = this.props;
    onPress(group);
  };
  handleJoin = () => {
    const { onJoin, group } = this.props;
    onJoin(group);
  };

  render() {
    const { t, group, onPress, onJoin } = this.props;
    const isUserCreated = group.user_created;
    const owner = group.owner;
    const { contactsCount = 0, unassignedCount = 0, membersCount = 0 } =
      group.contactReport || {};
    // TODO: Need to pull this info from the contactReport once the API supports it
    // const membersCount = 100;
    let source;
    if (group.community_photo_url) {
      source = { url: group.community_photo_url };
    } else if (isUserCreated) {
      source = DEFAULT_USER_COMMUNITY_IMAGE;
    } else {
      source = DEFAULT_MISSIONHUB_IMAGE;
    }

    return (
      <Card
        onPress={onPress ? this.handlePress : undefined}
        style={styles.card}
      >
        <Image source={source} resizeMode="cover" style={styles.image} />
        <Flex justify="center" direction="row" style={styles.infoWrap}>
          <Flex value={1}>
            <Text style={styles.groupName}>{group.name.toUpperCase()}</Text>
            <Text style={styles.groupNumber}>
              {onJoin
                ? `${t('numMembers', { number: membersCount })}  ·  ${t(
                    'owner',
                    {
                      name: owner,
                    },
                  )}`
                : isUserCreated
                  ? '' /*t('numMembers', { number: membersCount })*/
                  : `${t('numContacts', { number: contactsCount })}   ·   ${t(
                      'numUnassigned',
                      { number: unassignedCount },
                    )}`}
            </Text>
          </Flex>
          {onJoin ? (
            <Flex direction="column" justify="center">
              <Button
                type="transparent"
                style={[styles.joinButton]}
                buttonTextStyle={styles.joinButtonText}
                text={t('join').toUpperCase()}
                onPress={this.handleJoin}
              />
            </Flex>
          ) : null}
        </Flex>
      </Card>
    );
  }
}

GroupCardItem.propTypes = {
  group: PropTypes.shape({
    name: PropTypes.string.isRequired,
    owner: PropTypes.string,
    contactReport: PropTypes.object.isRequired,
    user_created: PropTypes.bool,
  }).isRequired,
  onPress: PropTypes.func,
  onJoin: PropTypes.func,
};
