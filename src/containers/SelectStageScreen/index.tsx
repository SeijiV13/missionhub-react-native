import React, { useState, useEffect } from 'react';
import { AnyAction } from 'redux';
import { connect } from 'react-redux-legacy';
import { View, Image } from 'react-native';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import { useNavigationState } from 'react-navigation-hooks';
import Carousel from 'react-native-snap-carousel';

import { Text, Button } from '../../components/common';
import BackButton from '../BackButton';
import LANDSCAPE from '../../../assets/images/landscapeStagesImage.png';
import UNINTERESTED from '../../../assets/images/uninterestedIcon.png';
import CURIOUS from '../../../assets/images/curiousIcon.png';
import FORGIVEN from '../../../assets/images/forgivenIcon.png';
import GROWING from '../../../assets/images/growingIcon.png';
import GUIDING from '../../../assets/images/guidingIcon.png';
import NOTSURE from '../../../assets/images/notsureIcon.png';
import { getStages } from '../../actions/stages';
import {
  selectMyStage,
  selectPersonStage,
  updateUserStage,
} from '../../actions/selectStage';
import { trackAction, trackScreenChange } from '../../actions/analytics';
import { ACTIONS } from '../../constants';
import { useAndroidBackButton } from '../../utils/hooks/useAndroidBackButton';
import { AuthState } from '../../reducers/auth';
import { Stage, StagesState } from '../../reducers/stages';
import { PeopleState } from '../../reducers/people';
import { AnalyticsState } from '../../reducers/analytics';
import {
  personSelector,
  contactAssignmentSelector,
} from '../../selectors/people';
import { localizedStageSelector } from '../../selectors/stages';
import Header from '../../components/Header';

import styles, {
  sliderWidth,
  stageWidth,
  stageMargin,
  overScrollMargin,
  getLandscapeWidth,
} from './styles';

const stageIcons = [UNINTERESTED, CURIOUS, FORGIVEN, GROWING, GUIDING, NOTSURE];

interface SelectStageScreenProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: ThunkDispatch<{ analytics: AnalyticsState }, {}, AnyAction>;
  next: (props: {
    isMe: boolean;
    personId: string;
    stage: Stage;
    isAlreadySelected: boolean;
    orgId?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) => ThunkAction<void, any, {}, never>;
  myId: string;
  firstName: string;
  contactAssignmentId?: string;
  isMe: boolean;
  stages: Stage[];
  testID?: string;
}

export interface SelectStageNavParams {
  selectedStageId?: number;
  enableBackButton: boolean;
  personId: string;
  orgId?: string;
  section: string;
  subsection: string;
  questionText?: string;
}

const SelectStageScreen = ({
  dispatch,
  next,
  myId,
  firstName,
  contactAssignmentId,
  isMe,
  stages,
}: SelectStageScreenProps) => {
  const {
    selectedStageId,
    enableBackButton = true,
    personId,
    orgId,
    questionText,
  } = useNavigationState().params as SelectStageNavParams;
  useAndroidBackButton(enableBackButton);
  const { t } = useTranslation('selectStage');
  const [scrollPosition, setScrollPosition] = useState(0);

  const startIndex = selectedStageId || 0;

  const handleSnapToItem = (index: number) => {
    if (stages[index]) {
      dispatch(trackScreenChange(['stage', stages[index].name.toLowerCase()]));
    }
  };

  useEffect(() => {
    async function loadStagesAndScrollToId() {
      const { response: newStages } = await dispatch(getStages());

      if (newStages[startIndex]) {
        dispatch(
          trackScreenChange([
            'stage',
            newStages[startIndex].name.toLowerCase(),
          ]),
        );
      }
    }

    loadStagesAndScrollToId();
  }, []);

  const setStage = async (stage: Stage, isAlreadySelected: boolean) => {
    !isAlreadySelected &&
      (await dispatch(
        isMe
          ? selectMyStage(stage.id)
          : contactAssignmentId
          ? updateUserStage(contactAssignmentId, stage.id)
          : selectPersonStage(personId, myId, stage.id, orgId),
      ));

    dispatch(
      next({
        isMe,
        personId,
        stage,
        isAlreadySelected,
        orgId,
      }),
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const action: any = isMe
      ? ACTIONS.SELF_STAGE_SELECTED
      : ACTIONS.PERSON_STAGE_SELECTED;

    dispatch(
      trackAction(action.name, {
        [action.key]: stage.id,
        [ACTIONS.STAGE_SELECTED.key]: null,
      }),
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleScroll = (e: any) =>
    setScrollPosition(e.nativeEvent.contentOffset.x);

  const renderStage = ({ item, index }: { item: Stage; index: number }) => {
    const isActive = selectedStageId === index;
    return (
      <View key={item.id} style={styles.cardWrapper}>
        <View style={styles.card}>
          <Image source={stageIcons[index]} />
          <Text header={true} style={styles.cardHeader}>
            {localizedStageSelector(item, i18next.language).name.toLowerCase()}
          </Text>
          <Text style={styles.cardText}>
            {localizedStageSelector(item, i18next.language).description}
          </Text>
        </View>
        <Button
          testID={'stageSelectButton'}
          type="primary"
          onPress={() => setStage(item, isActive)}
          text={isActive ? activeButtonText : buttonText}
        />
      </View>
    );
  };

  const leftMargin = scrollPosition / -1 - overScrollMargin;

  const buttonText = t(isMe ? 'iAmHere' : 'here').toUpperCase();
  const activeButtonText = t('stillHere').toUpperCase();
  const headerText =
    questionText ||
    t(isMe ? 'meQuestion' : 'personQuestion', { name: firstName });

  return (
    <View style={styles.backgroundWrapper}>
      <Image
        source={LANDSCAPE}
        style={[
          styles.footerImage,
          {
            left: leftMargin,
            width: getLandscapeWidth((stages || []).length),
          },
        ]}
      />
      <View style={styles.container}>
        <Header left={<BackButton />} />
        <View style={styles.content}>
          <Text style={styles.title}>{headerText}</Text>
          {stages ? (
            <Carousel
              firstItem={startIndex}
              data={stages}
              inactiveSlideOpacity={1}
              inactiveSlideScale={1}
              renderItem={renderStage}
              sliderWidth={sliderWidth + 75}
              itemWidth={stageWidth + stageMargin * 2}
              onScroll={handleScroll}
              scrollEventThrottle={5}
              onSnapToItem={handleSnapToItem}
              removeClippedSubviews={false}
              containerCustomStyle={{ height: 400, flex: 0, flexGrow: 0 }}
            />
          ) : null}
        </View>
      </View>
    </View>
  );
};

const mapStateToProps = (
  {
    auth,
    people,
    stages,
  }: { auth: AuthState; people: PeopleState; stages: StagesState },
  {
    navigation: {
      state: {
        params: { personId, orgId },
      },
    },
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
) => {
  const myId = auth.person.id;
  const person = personSelector({ people }, { personId, orgId }) || {};
  const contactAssignment =
    contactAssignmentSelector({ auth }, { person, orgId }) || {};

  return {
    myId,
    firstName: person.first_name,
    contactAssignmentId: contactAssignment.id,
    isMe: personId === myId,
    stages: stages.stages,
  };
};

export default connect(mapStateToProps)(SelectStageScreen);
export const SELECT_STAGE_SCREEN = 'nav/SELECT_STAGE';
