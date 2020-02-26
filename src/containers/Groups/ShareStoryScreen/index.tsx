import React, { useState } from 'react';
import { View, Keyboard, ScrollView } from 'react-native';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useTranslation } from 'react-i18next';
import { useNavigationParam } from 'react-navigation-hooks';
import { useDispatch, connect } from 'react-redux';

import { ACTIONS } from '../../../constants';
import { getAnalyticsPermissionType } from '../../../utils/common';
import { Input } from '../../../components/common';
import BottomButton from '../../../components/BottomButton';
import Header from '../../../components/Header';
import BackButton from '../../BackButton';
import theme from '../../../theme';
import { Organization } from '../../../reducers/organizations';
import { AuthState } from '../../../reducers/auth';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';
import { trackActionWithoutData } from '../../../actions/analytics';
import { orgPermissionSelector } from '../../../selectors/people';

import styles from './styles';
import {
  CreateAStory,
  CreateAStoryVariables,
} from './__generated__/CreateAStory';

export const CREATE_A_STORY = gql`
  mutation CreateAStory($input: CreateStoryInput!) {
    createStory(input: $input) {
      story {
        id
      }
    }
  }
`;

const ShareStoryScreen = () => {
  useAnalytics({ screenName: ['story', 'share'] });
  const { t } = useTranslation('shareAStoryScreen');
  const { container, backButton, textInput } = styles;
  const dispatch = useDispatch();
  const [story, changeStory] = useState('');
  const onComplete: () => void = useNavigationParam('onComplete');
  const organization: Organization = useNavigationParam('organization');
  const [createStory] = useMutation<CreateAStory, CreateAStoryVariables>(
    CREATE_A_STORY,
  );

  const saveStory = async () => {
    if (!story) {
      return null;
    }
    Keyboard.dismiss();
    await createStory({
      variables: { input: { content: story, organizationId: organization.id } },
    });
    dispatch(trackActionWithoutData(ACTIONS.SHARE_STORY));

    onComplete();
  };
  return (
    <View style={container}>
      <Header left={<BackButton iconStyle={backButton} />} />
      <ScrollView style={{ flex: 1 }} contentInset={{ bottom: 90 }}>
        <Input
          testID="StoryInput"
          scrollEnabled={false}
          onChangeText={e => changeStory(e)}
          placeholder={t('inputPlaceholder')}
          value={story}
          autoFocus={true}
          autoCorrect={true}
          multiline={true}
          returnKeyType="done"
          blurOnSubmit={true}
          selectionColor={theme.secondaryColor}
          placeholderTextColor={theme.lightGrey}
          style={textInput}
        />
      </ScrollView>
      <BottomButton
        text={t('shareStory')}
        onPress={saveStory}
        testID="SaveStoryButton"
      />
    </View>
  );
};

const mapStateToProps = (
  { auth }: { auth: AuthState },
  {
    navigation: {
      state: {
        params: { organization },
      },
    },
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
) => ({
  analyticsPermissionType: getAnalyticsPermissionType(
    orgPermissionSelector({}, { person: auth.person, organization }),
  ),
});

export default connect(mapStateToProps)(ShareStoryScreen);
export const CELEBRATE_SHARE_STORY_SCREEN = 'nav/CELEBRATE_SHARE_STORY_SCREEN';
