import React, { Component } from 'react';
import {
  ScrollView,
  View,
  Keyboard,
  Image,
  KeyboardAvoidingView,
} from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import {
  Flex,
  Text,
  Input,
  IconButton,
  Button,
} from '../../../components/common';
import GroupCardItem from '../../../components/GroupCardItem';
import Header from '../../Header';
import theme from '../../../theme';
import GROUP_ICON from '../../../../assets/images/MemberContacts_light.png';
import { navigateBack } from '../../../actions/navigation';
import {
  lookupOrgCommunityCode,
  joinCommunity,
} from '../../../actions/organizations';
import { ACTIONS, ERROR_PERSON_PART_OF_ORG } from '../../../constants';
import { setScrollGroups } from '../../../actions/swipe';
import { trackActionWithoutData } from '../../../actions/analytics';

import styles from './styles';

@translate('groupsJoinGroup')
class JoinGroupScreen extends Component {
  state = {
    code: '',
    errorMessage: '',
    community: undefined,
  };

  componentDidMount() {
    // Pause before focus so that the other screen can disappear before the keyboard comes up
    setTimeout(
      () => this.codeInput && this.codeInput.focus && this.codeInput.focus(),
      350,
    );
  }

  onChangeCode = code => {
    this.setState({ code: code.toUpperCase() }, () => {
      if (code.length >= 6) {
        this.onSearch();
      }
    });
  };

  onSearch = async () => {
    const {
      codeInput,
      state: { code },
      props: { t, dispatch },
    } = this;

    codeInput.focus();

    const errorState = {
      errorMessage: t('communityNotFound'),
      community: undefined,
    };

    const text = (code || '').trim();
    if (!text || text.length < 6) {
      this.setState(errorState);
      return;
    }

    try {
      const org = await dispatch(lookupOrgCommunityCode(text));

      if (!org) {
        this.setState(errorState);
        return;
      }
      this.setState({ errorMessage: '', community: org });
    } catch (e) {
      this.setState(errorState);
      return;
    }
  };

  joinCommunity = async () => {
    const { dispatch } = this.props;
    const { community } = this.state;
    Keyboard.dismiss();

    try {
      await dispatch(joinCommunity(community.id, community.community_code));
      this.joined();
    } catch (error) {
      // If the user is already part of the organization, just continue like normal
      if (
        error &&
        error.apiError &&
        error.apiError.errors &&
        error.apiError.errors[0] &&
        error.apiError.errors[0].detail === ERROR_PERSON_PART_OF_ORG
      ) {
        this.joined();
      } else {
        throw error;
      }
    }
  };

  joined = () => {
    const { dispatch, next } = this.props;
    dispatch(trackActionWithoutData(ACTIONS.SELECT_JOINED_COMMUNITY));

    dispatch(setScrollGroups());
    dispatch(next());
  };

  navigateBack = () => this.props.dispatch(navigateBack());

  ref = c => (this.codeInput = c);

  renderStart() {
    const { t } = this.props;
    return (
      <Flex align="center" justify="center">
        <Image resizeMode="contain" source={GROUP_ICON} style={styles.image} />
        <Text style={styles.text}>{t('enterCode')}</Text>
      </Flex>
    );
  }

  renderError() {
    const { errorMessage } = this.state;
    return (
      <Flex align="center" justify="center">
        <Text style={styles.text}>{errorMessage}</Text>
      </Flex>
    );
  }

  renderGroupCard() {
    const { community } = this.state;

    return <GroupCardItem group={community} onJoin={this.joinCommunity} />;
  }

  render() {
    const { t } = this.props;
    const { code, errorMessage, community } = this.state;

    return (
      <View style={styles.container}>
        <Header
          left={
            <IconButton
              name="deleteIcon"
              type="MissionHub"
              onPress={this.navigateBack}
            />
          }
          shadow={false}
          title={t('joinCommunity')}
        />
        <ScrollView keyboardShouldPersistTaps="handled" style={styles.flex}>
          <Flex align="center" justify="end" style={styles.imageWrap}>
            {errorMessage
              ? this.renderError()
              : community
                ? this.renderGroupCard()
                : this.renderStart()}
          </Flex>
          <Flex style={styles.fieldWrap}>
            <Input
              ref={this.ref}
              style={styles.input}
              onChangeText={this.onChangeCode}
              selectionColor={theme.white}
              maxLength={6}
              value={code}
              autoFocus={false}
              blurOnSubmit={false}
            />
          </Flex>
          <KeyboardAvoidingView
            keyboardVerticalOffset={theme.buttonHeight}
            style={styles.flex}
          />
        </ScrollView>

        <Flex align="stretch" justify="end">
          <Button
            type="secondary"
            onPress={this.onSearch}
            text={t('search').toUpperCase()}
            style={styles.searchButton}
          />
        </Flex>
      </View>
    );
  }
}

JoinGroupScreen.propTypes = {
  next: PropTypes.func,
};

export default connect()(JoinGroupScreen);
export const JOIN_GROUP_SCREEN = 'nav/JOIN_GROUP_SCREEN';
