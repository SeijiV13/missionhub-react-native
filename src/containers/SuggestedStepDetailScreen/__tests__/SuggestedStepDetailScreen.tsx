import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { ANALYTICS_SECTION_TYPE } from '../../../constants';
import { addStep } from '../../../actions/steps';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';

import SuggestedStepDetailScreen from '..';

jest.mock('../../../actions/steps');
jest.mock('../../../utils/hooks/useAnalytics');

const step = {
  body: 'do this step',
  description_markdown: 'some markdown',
};
const personId = '423325';
const orgId = '880124';

const nextResponse = { type: 'next' };
const addStepResponse = { type: 'add step' };

const next = jest.fn();

const initialState = { onboarding: { currentlyOnboarding: false } };

beforeEach(() => {
  next.mockReturnValue(nextResponse);
  ((addStep as unknown) as jest.Mock).mockReturnValue(addStepResponse);
});

it('renders correctly', () => {
  renderWithContext(<SuggestedStepDetailScreen next={next} />, {
    initialState,
    navParams: { step, personId, orgId },
  }).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(['step detail', 'add step'], {
    screenContext: { [ANALYTICS_SECTION_TYPE]: '' },
  });
});

it('renders correctly in oboarding', () => {
  renderWithContext(<SuggestedStepDetailScreen next={next} />, {
    initialState: { onboarding: { currentlyOnboarding: true } },
    navParams: { step, personId, orgId },
  }).snapshot();

  expect(useAnalytics).toHaveBeenCalledWith(['step detail', 'add step'], {
    screenContext: { [ANALYTICS_SECTION_TYPE]: 'onboarding' },
  });
});

describe('bottomButtonProps', () => {
  it('adds step', () => {
    const { getByTestId, store } = renderWithContext(
      <SuggestedStepDetailScreen next={next} />,
      {
        initialState,
        navParams: { step, personId, orgId },
      },
    );

    fireEvent.press(getByTestId('bottomButton'));

    expect(addStep).toHaveBeenCalledWith(step, personId, orgId);
    expect(next).toHaveBeenCalledWith({ personId, orgId });
    expect(store.getActions()).toEqual([addStepResponse, nextResponse]);
  });
});
