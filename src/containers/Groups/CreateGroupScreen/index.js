import React, { Component } from 'react';
import {
  ScrollView,
  View,
  Keyboard,
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import { Flex, Text, Input, IconButton } from '../../../components/common';
import Header from '../../../components/Header';
import theme from '../../../theme';
import CAMERA_ICON from '../../../../assets/images/cameraIcon.png';
import {
  navigateBack,
  navigatePush,
  navigateResetTab,
} from '../../../actions/navigation';
import ImagePicker from '../../../components/ImagePicker';
import {
  addNewOrganization,
  getMyCommunities,
} from '../../../actions/organizations';
import { trackActionWithoutData } from '../../../actions/analytics';
import { organizationSelector } from '../../../selectors/organizations';
import { USER_CREATED_GROUP_SCREEN } from '../GroupScreen';
import { MAIN_TABS, ACTIONS, GROUPS_TAB } from '../../../constants';
import BottomButton from '../../../components/BottomButton';

import styles from './styles';

@withTranslation('groupsCreateGroup')
class CreateGroupScreen extends Component {
  state = {
    name: '',
    imageData: null,
  };

  onChangeText = text => this.setState({ name: text });

  createCommunity = async () => {
    const { dispatch } = this.props;
    const { name, imageData } = this.state;
    Keyboard.dismiss();
    const text = (name || '').trim();
    if (!text) {
      return Promise.resolve();
    }

    const results = await dispatch(addNewOrganization(text, imageData));
    const newOrgId = results.response.id;
    // Load the list of communities
    await dispatch(getMyCommunities());
    this.getNewOrg(newOrgId);
  };

  getNewOrg = orgId => {
    const { organizations, dispatch } = this.props;
    const organization = organizationSelector({ organizations }, { orgId });

    // If for some reason the organization was not created and put in redux properly,
    // reset the user back to the communities tab
    if (!organization) {
      dispatch(navigateResetTab(MAIN_TABS, GROUPS_TAB));
    } else {
      dispatch(navigatePush(USER_CREATED_GROUP_SCREEN, { organization }));
      dispatch(trackActionWithoutData(ACTIONS.SELECT_CREATED_COMMUNITY));
    }
  };

  handleImageChange = data => this.setState({ imageData: data });

  navigateBack = () => this.props.dispatch(navigateBack());

  ref = c => (this.nameInput = c);

  renderImage() {
    const { imageData } = this.state;
    if (imageData) {
      return (
        <Image
          resizeMode="cover"
          source={{ uri: imageData.uri }}
          style={styles.image}
        />
      );
    }
    return <Image source={CAMERA_ICON} />;
  }

  render() {
    const { t } = this.props;
    const { name } = this.state;

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
          title={t('createCommunity')}
        />
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView keyboardShouldPersistTaps="handled" style={styles.flex}>
            <ImagePicker onSelectImage={this.handleImageChange}>
              <Flex align="center" justify="center" style={styles.imageWrap}>
                {this.renderImage()}
              </Flex>
            </ImagePicker>

            <KeyboardAvoidingView
              keyboardVerticalOffset={theme.buttonHeight}
              style={styles.flex}
            >
              <Flex style={styles.fieldWrap}>
                <Text style={styles.label} type="header">
                  {t('name')}
                </Text>
                <Input
                  ref={this.ref}
                  onChangeText={this.onChangeText}
                  value={name}
                  autoFocus={true}
                  autoCorrect={true}
                  selectionColor={theme.white}
                  returnKeyType="done"
                  style={styles.input}
                  blurOnSubmit={true}
                  placeholder=""
                />
              </Flex>
            </KeyboardAvoidingView>
          </ScrollView>

          <BottomButton
            disabled={!name}
            onPress={this.createCommunity}
            text={t('createCommunity')}
          />
        </SafeAreaView>
      </View>
    );
  }
}

CreateGroupScreen.propTypes = {};

const mapStateToProps = ({ organizations }, { navigation }) => ({
  ...(navigation.state.params || {}),
  organizations,
});

export default connect(mapStateToProps)(CreateGroupScreen);
export const CREATE_GROUP_SCREEN = 'nav/CREATE_GROUP_SCREEN';
