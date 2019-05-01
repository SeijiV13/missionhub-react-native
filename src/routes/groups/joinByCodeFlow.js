import { createStackNavigator } from 'react-navigation';

import { navigateReset } from '../../actions/navigation';
import JoinGroupScreen, {
  JOIN_GROUP_SCREEN,
} from '../../containers/Groups/JoinGroupScreen';
import { buildTrackedScreen, wrapNextAction } from '../helpers';
import { buildTrackingObj } from '../../utils/common';
import { MAIN_TABS, NOTIFICATION_PROMPT_TYPES } from '../../constants';
import { showNotificationPrompt } from '../../actions/notifications';
import { joinCommunity } from '../../actions/organizations';
import { setScrollGroups } from '../../actions/swipe';

export const JoinByCodeFlowScreens = {
  [JOIN_GROUP_SCREEN]: buildTrackedScreen(
    wrapNextAction(JoinGroupScreen, ({ community }) => async dispatch => {
      await dispatch(joinCommunity(community.id, community.community_code));
      await dispatch(
        showNotificationPrompt(NOTIFICATION_PROMPT_TYPES.JOIN_COMMUNITY, true),
      );
      dispatch(setScrollGroups(community.id));
      dispatch(navigateReset(MAIN_TABS, { startTab: 'groups' }));
    }),
    buildTrackingObj('communities : join', 'communities', 'join'),
    { gesturesEnabled: true },
  ),
};
export const JoinByCodeFlowNavigator = createStackNavigator(
  JoinByCodeFlowScreens,
  {
    navigationOptions: {
      header: null,
    },
  },
);
