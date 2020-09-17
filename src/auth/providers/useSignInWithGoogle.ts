import { useCallback, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-community/google-signin';

import {
  setAuthToken,
  getAnonymousUid,
  deleteAnonymousUid,
} from '../authStore';
import { AuthError } from '../constants';
import { rollbar } from '../../utils/rollbar.config';

import { SIGN_IN_WITH_GOOGLE_MUTATION } from './queries';
import {
  SignInWithGoogle,
  SignInWithGoogleVariables,
} from './__generated__/SignInWithGoogle';

export const webClientId =
  '208966923006-psifsd9u6ia0bc5bbt8racvdqqrb4u05.apps.googleusercontent.com';

export const useSignInWithGoogle = () => {
  const [providerAuthInProgress, setProviderAuthInProgress] = useState(false);
  const [error, setError] = useState(AuthError.None);

  const [apiSignInWithGoogle, { loading }] = useMutation<
    SignInWithGoogle,
    SignInWithGoogleVariables
  >(SIGN_IN_WITH_GOOGLE_MUTATION, { context: { public: true } });

  const performSignIn = useCallback(async () => {
    GoogleSignin.configure({
      webClientId,
      offlineAccess: true,
    });

    const ERROR_NO_AUTH_CODE = "Google authorization code doesn't exist";

    try {
      const { serverAuthCode } = await GoogleSignin.signInSilently();
      if (!serverAuthCode) {
        throw { code: ERROR_NO_AUTH_CODE };
      }
      return serverAuthCode;
    } catch (error) {
      if (
        error.code === ERROR_NO_AUTH_CODE ||
        error.code === statusCodes.SIGN_IN_REQUIRED
      ) {
        try {
          await GoogleSignin.hasPlayServices({
            showPlayServicesUpdateDialog: true,
          });
          const { serverAuthCode } = await GoogleSignin.signIn();
          if (!serverAuthCode) {
            throw new Error(ERROR_NO_AUTH_CODE);
          }
          return serverAuthCode;
        } catch (error) {
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            throw AuthError.None;
          } else if (error.code === statusCodes.IN_PROGRESS) {
            throw AuthError.None;
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            throw AuthError.None;
          } else {
            throw error;
          }
        }
      } else {
        throw error;
      }
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setError(AuthError.None);
    setProviderAuthInProgress(true);

    try {
      const serverAuthCode = await performSignIn();

      const anonymousUid = await getAnonymousUid();
      const { data } = await apiSignInWithGoogle({
        variables: { authorizationCode: serverAuthCode, anonymousUid },
      });

      if (data?.loginWithGoogle?.token) {
        await setAuthToken(data.loginWithGoogle.token);
        await deleteAnonymousUid();
      } else {
        throw new Error('apiSignInWithGoogle did not return an access token');
      }
    } catch (error) {
      if (error === AuthError.None) {
        throw AuthError.None;
      } else {
        setError(AuthError.Unknown);
        rollbar.error(error);
        throw AuthError.Unknown;
      }
    } finally {
      setProviderAuthInProgress(false);
    }
  }, []);

  return {
    signInWithGoogle: signInWithGoogle,
    loading: providerAuthInProgress || loading,
    error: error,
  };
};
