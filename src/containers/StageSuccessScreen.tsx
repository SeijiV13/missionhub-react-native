import React from 'react';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux-legacy';
import { useDispatch } from 'react-redux';
import { ThunkAction } from 'redux-thunk';
import { AnyAction } from 'redux';

import { navigateBack } from '../actions/navigation';
import { AuthState } from '../reducers/auth';
import { Stage, StagesState } from '../reducers/stages';
import { stageSelector, localizedStageSelector } from '../selectors/stages';
import { useAnalytics } from '../utils/hooks/useAnalytics';
import { RootState } from '../reducers';

import IconMessageScreen from './IconMessageScreen';

type SelectedStage = { self_followup_description?: string } | undefined;

interface StageSuccessScreenProps {
  next: (props?: {
    selectedStage: SelectedStage;
  }) => ThunkAction<void, RootState, never, AnyAction>; // TODO: make next
  firstName?: string;
  stage?: Stage;
}

const StageSuccessScreen = ({
  next,
  firstName,
  stage,
}: StageSuccessScreenProps) => {
  useAnalytics(['onboarding', 'stage confirmation'], { sectionType: true });
  const dispatch = useDispatch();
  const { t } = useTranslation('stageSuccess');

  const handleNavigateToStep = () => dispatch(next());
  const back = () => dispatch(navigateBack());

  // Build out message
  let message =
    localizedStageSelector(stage, i18next.language).self_followup_description ||
    t('backupMessage');
  message = message.replace('<<user>>', firstName ? firstName : t('friend'));
  return (
    <IconMessageScreen
      testID="IconMessageScreen"
      mainText={message}
      buttonText={t('chooseSteps')}
      onComplete={handleNavigateToStep}
      iconPath={require('../../assets/images/pathFinder.png')}
      onBack={back}
    />
  );
};

const mapStateToProps = ({
  auth,
  stages,
}: {
  auth: AuthState;
  stages: StagesState;
}) => ({
  firstName: auth.person.first_name,
  stage: stageSelector(
    { stages },
    { stageId: auth.person.user.pathway_stage_id },
  ),
});

export default connect(mapStateToProps)(StageSuccessScreen);
export const STAGE_SUCCESS_SCREEN = 'nav/STAGE_SUCCESS';
