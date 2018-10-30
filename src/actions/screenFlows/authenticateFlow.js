import { LOGIN_SCREEN } from '../../containers/LoginScreen';
import { LOGIN_OPTIONS_SCREEN } from '../../containers/LoginOptionsScreen';
import { KEY_LOGIN_SCREEN } from '../../containers/KeyLoginScreen';
import { SCREEN_FLOW_INITIAL_SCREEN } from '../../constants';
import { SignInFlow } from './signInFlow';
import { RegisterFlow } from './registerFlow';

export const AuthenticateFlow = 'AUTHENTICATE_FLOW';

export const AuthenticateFlowConfig = () => ({
  [SCREEN_FLOW_INITIAL_SCREEN]: LOGIN_SCREEN,
  [LOGIN_SCREEN]: {
    onNext: ({ signIn }) =>
      signIn ? { flow: SignInFlow } : { flow: RegisterFlow },
  },
});
