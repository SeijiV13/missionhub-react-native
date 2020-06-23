import React from 'react';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';

import { renderWithContext } from '../../../../../testUtils';
import { ANALYTICS_PERMISSION_TYPE, ACTIONS } from '../../../../constants';
import { PostTypeEnum } from '../../../../../__generated__/globalTypes';
import { getAnalyticsPermissionType } from '../../../../utils/analytics';
import { useAnalytics } from '../../../../utils/hooks/useAnalytics';
import { trackAction } from '../../../../actions/analytics';
import { navigatePush } from '../../../../actions/navigation';
import { CREATE_POST_SCREEN } from '../../CreatePostScreen';

import CreatePostModal from '..';

jest.mock('../../../../actions/analytics');
jest.mock('../../../../actions/navigation');
jest.mock('../../../../utils/hooks/useAnalytics');
jest.mock('../../../../utils/analytics');
jest.mock('../../../../selectors/people');

const closeModal = jest.fn();
const mockCommunityId = '1';

const props = {
  communityId: mockCommunityId,
  closeModal,
  adminOrOwner: false,
};
const initialState = {
  auth: { person: { id: '1' } },
};

const trackActionResults = { type: 'track action' };
const navigatePushResults = { type: 'navigate push' };

beforeEach(() => {
  (getAnalyticsPermissionType as jest.Mock).mockReturnValue('member');
  (trackAction as jest.Mock).mockReturnValue(trackActionResults);
  (navigatePush as jest.Mock).mockReturnValue(navigatePushResults);
});

it('renders correctly', async () => {
  const { snapshot } = renderWithContext(<CreatePostModal {...props} />, {
    initialState,
  });
  await flushMicrotasksQueue();
  snapshot();
  expect(useAnalytics).toHaveBeenLastCalledWith(['post', 'choose type'], {
    screenContext: { [ANALYTICS_PERMISSION_TYPE]: 'member' },
  });
});

it('renders correctly for admin', async () => {
  (getAnalyticsPermissionType as jest.Mock).mockReturnValue('admin');
  const { snapshot } = renderWithContext(
    <CreatePostModal {...props} adminOrOwner={true} />,
    { initialState },
  );
  await flushMicrotasksQueue();
  snapshot();
  expect(useAnalytics).toHaveBeenLastCalledWith(['post', 'choose type'], {
    screenContext: { [ANALYTICS_PERMISSION_TYPE]: 'admin' },
  });
});

it('renders correctly for owner', async () => {
  (getAnalyticsPermissionType as jest.Mock).mockReturnValue('owner');
  const { snapshot } = renderWithContext(
    <CreatePostModal {...props} adminOrOwner={true} />,
    { initialState },
  );
  await flushMicrotasksQueue();
  snapshot();
  expect(useAnalytics).toHaveBeenLastCalledWith(['post', 'choose type'], {
    screenContext: { [ANALYTICS_PERMISSION_TYPE]: 'owner' },
  });
});

it('fires onPress and navigates | member', async () => {
  const { getByTestId } = renderWithContext(<CreatePostModal {...props} />, {
    initialState,
  });
  await flushMicrotasksQueue();

  fireEvent.press(getByTestId('STORYButton'));
  expect(closeModal).toHaveBeenCalledWith();
  expect(trackAction).toHaveBeenCalledWith(ACTIONS.POST_TYPE_SELECTED.name, {
    [ACTIONS.POST_TYPE_SELECTED.key]: PostTypeEnum.story,
  });
  expect(navigatePush).toHaveBeenLastCalledWith(CREATE_POST_SCREEN, {
    communityId: mockCommunityId,
    postType: PostTypeEnum.story,
  });
  expect(useAnalytics).toHaveBeenLastCalledWith(['post', 'choose type'], {
    screenContext: { [ANALYTICS_PERMISSION_TYPE]: 'member' },
  });
});

it('fires onPress and navigates | owner', async () => {
  (getAnalyticsPermissionType as jest.Mock).mockReturnValue('owner');
  const { getByTestId } = renderWithContext(
    <CreatePostModal {...props} adminOrOwner={true} />,
    { initialState },
  );
  await flushMicrotasksQueue();

  fireEvent.press(getByTestId('ANNOUNCEMENTButton'));
  expect(closeModal).toHaveBeenCalledWith();
  expect(trackAction).toHaveBeenCalledWith(ACTIONS.POST_TYPE_SELECTED.name, {
    [ACTIONS.POST_TYPE_SELECTED.key]: PostTypeEnum.announcement,
  });
  expect(navigatePush).toHaveBeenLastCalledWith(CREATE_POST_SCREEN, {
    communityId: mockCommunityId,
    postType: PostTypeEnum.announcement,
  });
  expect(useAnalytics).toHaveBeenLastCalledWith(['post', 'choose type'], {
    screenContext: { [ANALYTICS_PERMISSION_TYPE]: 'owner' },
  });
});

it('closes modal when close button is pressed', async () => {
  const { getByTestId } = renderWithContext(<CreatePostModal {...props} />, {
    initialState,
  });
  await flushMicrotasksQueue();

  fireEvent.press(getByTestId('CloseButton'));
  expect(closeModal).toHaveBeenCalledWith();
  expect(useAnalytics).toHaveBeenLastCalledWith(['post', 'choose type'], {
    screenContext: { [ANALYTICS_PERMISSION_TYPE]: 'member' },
  });
});
