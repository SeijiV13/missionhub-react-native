import React, { useRef, useState } from 'react';
import { connect } from 'react-redux';
import { SafeAreaView, View, Keyboard, TextInput, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { AnyAction } from 'redux';

import { Text, Flex, Input } from '../../components/common';
import BottomButton from '../../components/BottomButton';
import { createMyPerson, createPerson } from '../../actions/onboarding';
import TosPrivacy from '../../components/TosPrivacy';
import { AuthState } from '../../reducers/auth';
import { PeopleState } from '../../reducers/people';
import { updatePerson } from '../../actions/person';
import BackButton from '../BackButton';
import Header from '../../components/Header';
import { useLogoutOnBack } from '../../utils/hooks/useLogoutOnBack';
import { prompt } from '../../utils/prompt';
import { logout } from '../../actions/auth/auth';
import { navigateBack } from '../../actions/navigation';
import { useAndroidBackButton } from '../../utils/hooks/useAndroidBackButton';
import { trackActionWithoutData } from '../../actions/analytics';
import { ACTIONS } from '../../constants';
import { personSelector } from '../../selectors/people';
import { OnboardingState } from '../../reducers/onboarding';

import styles from './styles';

interface SetupScreenProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: ThunkDispatch<{}, {}, any>;
  next: (props: {
    skip?: boolean;
    personId?: string;
  }) => ThunkAction<unknown, {}, {}, AnyAction>;
  isMe: boolean;
  personId?: string;
  loadedFirstName?: string;
  loadedLastName?: string;
}

const SetupScreen = ({
  dispatch,
  next,
  isMe,
  personId,
  loadedFirstName = '',
  loadedLastName = '',
}: SetupScreenProps) => {
  const { t } = useTranslation('onboardingCreatePerson');
  const [firstName, setFirstName] = useState(loadedFirstName);
  const [lastName, setLastName] = useState(loadedLastName);
  const [isLoading, setIsLoading] = useState(false);
  const lastNameRef = useRef<TextInput>(null);


  const handleBack = useLogoutOnBack(true, !!personId);

  const saveAndNavigateNext = async () => {
    Keyboard.dismiss();
    if (!firstName) {
      return;
    }
    try {
      setIsLoading(true);
      if (personId) {
        await dispatch(
          updatePerson({
            id: personId,
            firstName,
            lastName,
          }),
        );
        dispatch(next({ personId }));
      } else if (isMe) {
        const { id }: { id: string } = (await dispatch(
          createMyPerson(firstName, lastName),
        )) as any;
        dispatch(next({ personId: id }));
      } else {
        const {
          response: { id },
        }: { response: { id: string } } = (await dispatch(
          createPerson(firstName, lastName),
        )) as any;
        dispatch(trackActionWithoutData(ACTIONS.PERSON_ADDED));
        dispatch(next({ personId: id }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onFirstNameSubmitEditing = () =>
    lastNameRef.current && lastNameRef.current.focus();

  return (
    <SafeAreaView style={styles.container}>
      <Header left={<BackButton customNavigate={handleBack} />} />
      <Flex value={2} justify="end" align="center">
        {isMe ? (
          <Text header={true} style={styles.header}>
            {t('namePrompt')}
          </Text>
        ) : (
          <>
            <View style={{ flex: 1 }} />
            <View style={styles.imageWrap}>
              <Image
                source={require('../../../assets/images/add_someone.png')}
              />
            </View>
          </>
        )}
      </Flex>

      <View style={styles.inputWrap}>
        <View>
          <Text style={styles.label}>
            {t('profileLabels.firstNameRequired')}
          </Text>
          <Input
            onChangeText={(firstName: string) => setFirstName(firstName)}
            value={firstName}
            autoFocus={true}
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={onFirstNameSubmitEditing}
            placeholder={t('profileLabels.firstName')}
            placeholderTextColor="white"
            testID="InputFirstName"
          />
        </View>

        <View style={{ paddingVertical: 30 }}>
          <Input
            ref={lastNameRef}
            onChangeText={(lastName: string) => setLastName(lastName)}
            value={lastName}
            returnKeyType="done"
            placeholder={t('profileLabels.lastName')}
            placeholderTextColor="white"
            blurOnSubmit={true}
            onSubmitEditing={saveAndNavigateNext}
            testID="InputLastName"
          />
        </View>
        <TosPrivacy trial={true} />
      </View>
      <BottomButton
        testID="SaveBottomButton"
        disabled={isLoading}
        onPress={saveAndNavigateNext}
        text={t('next')}
      />
    </SafeAreaView>
  );
};
const mapStateToProps = (
  {
    auth,
    onboarding: { personId },
    people,
  }: { auth: AuthState; onboarding: OnboardingState; people: PeopleState },
  {
    isMe,
  }: {
    isMe: boolean;
  },
) => ({
  isMe,
  ...(isMe
    ? {
        loadedFirstName: auth.person.first_name,
        loadedLastName: auth.person.last_name,
        personId: auth.person.id,
      }
    : {
        loadedFirstName: (personSelector({ people }, { personId }) || {})
          .first_name,
        loadedLastName: (personSelector({ people }, { personId }) || {})
          .last_name,
        personId,
      }),
});
export default connect(mapStateToProps)(SetupScreen);
export const SETUP_SCREEN = 'nav/SETUP';
