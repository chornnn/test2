import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics, logEvent as firebaseLogEvent } from 'firebase/analytics';
import { getFunctions, httpsCallable } from 'firebase/functions';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_APP_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_APP_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_APP_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_APP_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_APP_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics();
}

auth.onAuthStateChanged((user) => {
  if (typeof window !== 'undefined') {
    if (user) {
      // store the user on local storage
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      // removes the user from local storage on logOut
      localStorage.removeItem('user');
    }
  }
});

export const logEvent = (eventName, params?) => {
  firebaseLogEvent(analytics, eventName, params);
};

export const getDataFromCloudFunctionByName = (functionName: string) => {
  const functions = getFunctions();
  const callableReturnMessage = httpsCallable(functions, functionName);

  return callableReturnMessage();
};

export default app;
export { auth };
