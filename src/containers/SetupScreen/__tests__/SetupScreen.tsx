import { Keyboard } from 'react-native';
import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { updatePerson } from '../../../actions/person';
import { useLogoutOnBack } from '../../../utils/hooks/useLogoutOnBack';
import { createMyPerson } from '../../../actions/onboarding';

import SetupScreen from '..';

const mockState = { profile: {}, auth: { person: {} } };
const nextResult = { type: 'testNext' };
const next = jest.fn().mockReturnValue(nextResult);
const back = jest.fn();

const firstName = 'TestFname';
const lastName = 'TestLname';

jest.mock('../../../actions/api');
jest.mock('../../../actions/onboardingProfile');
jest.mock('../../../actions/person');
jest.mock('../../../utils/hooks/useLogoutOnBack');
Keyboard.dismiss = jest.fn();

beforeEach(() => {
  (createMyPerson as jest.Mock).mockReturnValue({
    type: 'createMyPerson',
  });
  (updatePerson as jest.Mock).mockReturnValue({ type: 'updatePerson' });
  (useLogoutOnBack as jest.Mock).mockReturnValue(back);
});

it('renders correctly', () => {
  renderWithContext(<SetupScreen next={next} isMe={false} />, {
    initialState: mockState,
  }).snapshot();
});

describe('setup screen methods', () => {
  const { getByTestId } = renderWithContext(
    <SetupScreen next={next} isMe={false} />,
    {
      initialState: mockState,
    },
  );

  it('calls first name changed', () => {
    fireEvent(getByTestId('InputFirstName'), 'onChangeText', firstName);
    throw 'TODO';
  });

  it('calls last name changed', () => {
    fireEvent(getByTestId('InputLastName'), 'onChangeText', lastName);
    throw 'TODO';
  });
});

describe('saveAndGoToGetStarted', () => {
  const { getByTestId } = renderWithContext(
    <SetupScreen next={next} isMe={false} />,
    {
      initialState: { profile: { firstName }, auth: { person: {} } },
    },
  );
  it('creates person and calls next', async () => {
    await fireEvent.press(getByTestId('SaveBottomButton'));

    expect(createMyPerson).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('calls last name submit', async () => {
    await fireEvent(getByTestId('InputLastName'), 'onSubmitEditing');

    expect(createMyPerson).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
});

describe('saveAndGoToGetStarted with person id', () => {
  const personId = '1';
  it('updates person and calls next', async () => {
    const { getByTestId } = renderWithContext(
      <SetupScreen next={next} isMe={false} />,
      {
        initialState: {
          profile: { firstName },
          auth: { person: { id: personId } },
        },
      },
    );
    await fireEvent.press(getByTestId('SaveBottomButton'));

    expect(updatePerson).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('calls callback from useLogoutOnBack', () => {
    const { getByTestId } = renderWithContext(
      <SetupScreen next={next} isMe={false} />,
      {
        initialState: {
          profile: { firstName },
          auth: { person: { id: personId } },
        },
      },
    );

    // With the "id" set, press the back button
    fireEvent(getByTestId('BackButton'), 'customNavigate');

    expect(useLogoutOnBack).toHaveBeenCalledWith(true, true);
    expect(back).toHaveBeenCalledWith();
  });
});

describe('saveAndGoToGetStarted without first name', () => {
  it('does nothing if first name is not entered', async () => {
    const { getByTestId } = renderWithContext(
      <SetupScreen next={next} isMe={false} />,
      {
        initialState: mockState,
      },
    );
    await fireEvent.press(getByTestId('SaveBottomButton'));

    expect(next).not.toHaveBeenCalled();
  });
});

describe('calls back without creating a person', () => {
  it('calls callback from useLogoutOnBack', () => {
    const { getByTestId } = renderWithContext(
      <SetupScreen next={next} isMe={false} />,
      {
        initialState: mockState,
      },
    );

    fireEvent(getByTestId('BackButton'), 'customNavigate');

    expect(useLogoutOnBack).toHaveBeenCalledWith(true, false);
    expect(back).toHaveBeenCalledWith();
  });
});
