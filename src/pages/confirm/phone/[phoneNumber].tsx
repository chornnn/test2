import React, { useState, useEffect, useRef } from 'react';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth';
import { useDispatch } from 'react-redux';
import Head from 'next/head'
import { useRouter } from 'next/router';

import { hideLoading, showLoading } from '@components/Loading';
import { BackHeader } from '@components/Headers';
import { showToast } from '@components/Toast';
import { registered } from '@store/features/user/userSlice';
import { checkRegistered, loginMethod } from '@store/features/user/request';
import { setRedirect, getRedirect } from '@storage/redirect';

import styles from './confirmPhone.module.scss';

declare global {
  interface Window {
    recaptchaVerifier: any;
    recaptchaWidgetId: any;
    confirmationResult: any;
  }
}

const ConfirmPhone: React.FC = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const phone = useRef('');
  const [showPhone, setShowPhone] = useState('');
  const [showCodes, setShowCodes] = useState(false);
  const [codes, setCodes] = useState(['', '', '', '', '', '']);
  const codesIndex = [0, 1, 2, 3, 4, 5];
  const numbers = useRef(0);
  const maxLength = 1;

  function phoneSignIn() {
    const phoneNumber = '+1' + phone.current;
    const appVerifier = window.recaptchaVerifier;

    const auth = getAuth();
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        setShowCodes(true);
        window.confirmationResult = confirmationResult;
        // ...
      })
      .catch((error) => {
        // Error; SMS not sent
        // ...
      });
  }

  useEffect(() => {
    const { phoneNumber } = router.query;
    if (phoneNumber) {
      phone.current = phoneNumber as string;
      setShowPhone(phoneNumber as string);
    }

    const auth = getAuth();
    window.recaptchaVerifier = new RecaptchaVerifier(
      'recaptcha-container-login',
      {
        size: 'normal',
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          phoneSignIn();
        },
        'expired-callback': () => {
          // Response expired. Ask user to solve reCAPTCHA again.
        },
      },
      auth
    );

    window.recaptchaVerifier.render().then((widgetId) => {
      window.recaptchaWidgetId = widgetId;
    });
  }, []);

  function getCode() {
    let myCode = '';
    codes.forEach((code) => {
      myCode += code;
    });
    return myCode;
  }

  useEffect(() => {
    if (numbers.current === 6) {
      const code = getCode();
      showLoading();

      window.confirmationResult
        .confirm(code)
        .then(async (result) => {
          // User signed in successfully.
          const user = result.user;
          const res = await registered(result, dispatch);

          if (res.message === 'finish') {
            const myUser = {
              uid: res.uid,
              logInMethod: res.loginMethod,
              email: res.email,
            };
            hideLoading();
            router.push('/signup/finish/' + encodeURI(JSON.stringify(myUser)));
          } else {
            const redirect = getRedirect();
            setRedirect('/');
            hideLoading();
            router.push(redirect);
          }
        })
        .catch((error) => {
          // User couldn't sign in (bad verification code?)
          // ...
          // auth / invalid - verification - code
          console.log(error);

          hideLoading();
          showToast('Invalid code, please check the code and try again.', 3000);
        });
    }
    return () => { };
  }, [numbers.current]);

  return (
    <>
      <div className="backdrop" />
      <div className="auth-container">
        <Head>
          <title>Confirm your number</title>
        </Head>

        <BackHeader title="Confirm your number" />

        <div className={styles['confirm-desc']}>
          Enter the code we sent over SMS to +1 {showPhone}
        </div>

        <div
          id="recaptcha-container-login"
          className={styles['recaptcha-container-login']}
        ></div>

        {showCodes && (
          <div className={styles['confirm-codes']}>
            {codesIndex.map((index) => {
              return (
                <input
                  key={index}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && codes[index] === '') {
                      if (index > 0) {
                        document
                          .getElementById('input-' + (index - 1))
                          ?.focus();
                      }
                    }
                  }}
                  onChange={(e) => {
                    const copyCodes = [...codes];
                    copyCodes[index] = e.target.value;
                    setCodes(copyCodes);

                    if (e.target.value) {
                      // setFocusIndex(index + 1);
                      numbers.current = numbers.current + 1;
                      document.getElementById('input-' + (index + 1))?.focus();
                    } else {
                      numbers.current = numbers.current - 1;
                    }
                  }}
                  autoFocus={index === 0}
                  value={codes[index]}
                  type="tel"
                  className={styles['confirm-code-input']}
                  id={'input-' + index}
                  maxLength={maxLength}
                />
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default ConfirmPhone;
