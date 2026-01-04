import { useState, useEffect } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useAuth } from './AuthContext';

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_IOS_CLIENT_ID = '666039553778-uqddgsm5ucejn90e0cba0i1nu4k9b3uf.apps.googleusercontent.com';
const GOOGLE_WEB_CLIENT_ID = '666039553778-qmqtguui6kq0nnmlr7pg855913gojqu7.apps.googleusercontent.com';

export const useGoogleAuth = () => {
  const { signIn } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    webClientId: GOOGLE_WEB_CLIENT_ID,
  });

  useEffect(() => {
    handleAuthResponse();
  }, [response]);

  const handleAuthResponse = async () => {
    if (response?.type === 'success') {
      setIsSigningIn(true);
      setError(null);

      try {
        const { authentication } = response;

        // Fetch user info using the access token
        const userInfoResponse = await fetch(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: { Authorization: `Bearer ${authentication.accessToken}` },
          }
        );

        if (!userInfoResponse.ok) {
          throw new Error('Failed to fetch user info');
        }

        const userInfo = await userInfoResponse.json();

        await signIn({
          id: userInfo.sub,
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
          accessToken: authentication.accessToken,
        });

        console.log('Successfully signed in:', userInfo.email);
      } catch (err) {
        setError(err.message || 'Failed to complete sign in');
        console.error('Google Sign-In error:', err);
      } finally {
        setIsSigningIn(false);
      }
    } else if (response?.type === 'cancel') {
      setError('Sign in was cancelled');
    } else if (response?.type === 'error') {
      setError(response.error?.message || 'Sign in failed');
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      await promptAsync();
    } catch (err) {
      setError(err.message || 'Failed to start sign in');
      console.error('Failed to start Google Sign-In:', err);
    }
  };

  return {
    handleGoogleSignIn,
    isSigningIn,
    error,
    isReady: !!request,
  };
};
