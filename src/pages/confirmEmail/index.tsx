import React, { useState, useEffect, useRef } from 'react';
import {
  getAuth,
  isSignInWithEmailLink,
  signInWithEmailLink,
  sendSignInLinkToEmail,
} from 'firebase/auth';
import Head from 'next/head';
import ArrowLeft from '@images/ArrowLeft.png';
import { useRouter } from 'next/router';
import { setInterval } from 'timers';

import styles from './email.module.scss';

const ConfirmEmail: React.FC = (props) => {
  const router = useRouter();
  const [codes, setCodes] = useState(['', '', '', '', '', '']);
  const codesIndex = [0, 1, 2, 3, 4, 5];
  const numbers = useRef(0);
  const maxLength = 1;

  useEffect(() => {
    const auth = getAuth();
    const email = 'maxlimaoxuan@gmail.com';

    const actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be in the authorized domains list in the Firebase Console.
      url: 'http://localhost:3000/confirm/email',
      // This must be true.
      handleCodeInApp: true,
    };

    if (isSignInWithEmailLink(auth, window.location.href)) {
      checkStatus();
    } else {
      sendSignInLinkToEmail(auth, email, actionCodeSettings)
        .then(() => {
          // The link was successfully sent. Inform the user.
          // Save the email locally so you don't need to ask the user for it again
          // if they open the link on the same device.
          window.localStorage.setItem('emailForSignIn', email);

          setInterval(() => {
            // checkStatus();
          }, 3000);
          // setTimeout(() => {
          //     console.log("sss");

          // }, 5000);
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;

          // ...
        });
    }
  }, []);

  function checkStatus() {
    const auth = getAuth();

    // Additional state parameters can also be passed via URL.
    // This can be used to continue the user's intended action before triggering
    // the sign-in operation.
    // Get the email if available. This should be available if the user completes
    // the flow on the same device where they started it.
    let email = window.localStorage.getItem('emailForSignIn');

    console.log(email);

    if (!email) {
      // User opened the link on a different device. To prevent session fixation
      // attacks, ask the user to provide the associated email again. For example:
      email = window.prompt('Please provide your email for confirmation');
    }
    // The client SDK will parse the code from the link for you.
    signInWithEmailLink(auth, email, window.location.href)
      .then((result) => {
        // Clear email from storage.
        window.localStorage.removeItem('emailForSignIn');
        console.log(result);

        // You can access the new user via result.user
        // Additional user info profile not available via:
        // result.additionalUserInfo.profile == null
        // You can check if the user is new or existing:
        // result.additionalUserInfo.isNewUser
      })
      .catch((error) => {
        // Some error occurred, you can inspect the code: error.code
        // Common errors could be invalid email and invalid or expired OTPs.
      });
  }

  return (
    <div className={styles['Confirm']}>
      <Head>
        <title>Confirm Email</title>
      </Head>

      <div className={styles['header-back']}>
        <img
          onClick={() => {
            router.back();
          }}
          src={ArrowLeft}
          className={styles['header-back-image']}
        />
        <div className={styles['header-back-title']}>Confirm your email</div>
      </div>

      <div className={styles['confirm-desc']}>
        To complete the verification, please check the email we’ve sent to
        123dh@gmail.com
      </div>
    </div>
  );
};

export default ConfirmEmail;
