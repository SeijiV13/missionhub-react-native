import 'react-native';
import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import * as common from '../../../utils/common';
import { trackActionWithoutData } from '../../../actions/analytics';
import { ACTIONS } from '../../../constants';

import WelcomeScreen from '..';

const next = jest.fn(() => () => {});

jest.mock('react-native-device-info');
jest.mock('../../../actions/analytics');
jest.mock('../../../components/BottomButton', () => 'BottomButton');
jest.mock('../../../components/common', () => ({
  Flex: 'Flex',
  Text: 'Text',
  Button: 'Button',
}));

// @ts-ignore
common.disableBack = { add: jest.fn(), remove: jest.fn() };

(trackActionWithoutData as jest.Mock).mockReturnValue({
  type: 'tracked action without data',
});

describe('WelcomeScreen', () => {
  const allowSignInVariantConfig = {
    navParams: { allowSignIn: true },
  };

  it('should render correctly', () => {
    renderWithContext(<WelcomeScreen next={next} />).snapshot();
  });

  it('should render correctly with sign in button', () => {
    renderWithContext(
      <WelcomeScreen next={next} />,
      allowSignInVariantConfig,
    ).snapshot();
  });

  it('getStarted btn should call next', () => {
    const { getByTestId } = renderWithContext(<WelcomeScreen next={next} />);
    fireEvent.press(getByTestId('get-started'));

    expect(common.disableBack.remove).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith({ signin: false });
  });

  it('tryItNow btn should call next', () => {
    const { getByTestId } = renderWithContext(
      <WelcomeScreen next={next} />,
      allowSignInVariantConfig,
    );
    fireEvent.press(getByTestId('get-started-sign-in-variant'));

    expect(common.disableBack.remove).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith({ signin: false });
  });

  it('signIn btn should call next with signIn = true', () => {
    const { getByTestId } = renderWithContext(
      <WelcomeScreen next={next} />,
      allowSignInVariantConfig,
    );
    fireEvent.press(getByTestId('sign-in'));

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith({ signin: true });
  });

  it('should fire analytics event on mount', () => {
    renderWithContext(<WelcomeScreen next={next} />);

    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.ONBOARDING_STARTED,
    );
  });

  it('should clean up back handler on unmount', () => {
    renderWithContext(<WelcomeScreen next={next} />).unmount();

    expect(common.disableBack.remove).toHaveBeenCalledTimes(1);
  });
});
