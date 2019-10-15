import { createStackNavigator } from 'react-navigation';

import { GET_STARTED_SCREEN } from '../../containers/GetStartedScreen';

import { onboardingFlowGenerator } from './onboardingFlowGenerator';

export const GetStartedOnboardingFlowScreens = onboardingFlowGenerator({
  startScreen: GET_STARTED_SCREEN,
  startScreenEnableBack: false,
});

export const GetStartedOnboardingFlowNavigator = createStackNavigator(
  GetStartedOnboardingFlowScreens,
  {
    defaultNavigationOptions: {
      header: null,
      gesturesEnabled: true,
    },
  },
);
