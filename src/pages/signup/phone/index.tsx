import React, { ChangeEvent, useRef, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { SimpleHeader } from '@components/Headers';
import TwoDesc from '@components/TwoDesc';
import CommonInput from '@components/CommonInput';
import DividedLine from '@components/DividedLine';
import SimpleButton from '@components/SimpleButton';
import { Google } from '@components/Logins';
import { showToast } from '@components/Toast';

import styles from './phone.module.scss';

function validatePhoneNumber(elementValue) {
  var phoneNumberPattern = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
  return phoneNumberPattern.test(elementValue);
}

const Phone: React.FC = (props) => {
  const router = useRouter();
  const phoneNumber = useRef('');

  return (
    <>
      <Head>
        <title> Phone Login </title>
      </Head>

      <div className="auth-container">
        <SimpleHeader />

        <TwoDesc
          title="Sign up"
          desc="Already have an acount?"
          actionDesc="Log In"
          clickEvent={() => {
            router.push('/login');
          }}
        ></TwoDesc>

        <div className={styles['form-area']}>
          <CommonInput
            type="tel"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              phoneNumber.current = e.target.value;
            }}
            placeholder="Enter your phone number"
          >
            Phone
          </CommonInput>
          <SimpleButton
            onClick={() => {
              if (phoneNumber.current === '') {
                showToast('Please Enter your phone number', 3000);
                return;
              }

              if (!validatePhoneNumber(phoneNumber.current)) {
                showToast('Please Enter vaild phone number', 3000);
                return;
              }
              router.push('/confirm/phone/' + phoneNumber.current);
            }}
            className={styles['email-continue-button-margin']}
          >
            Continue
          </SimpleButton>
        </div>

        <DividedLine
          className={styles['divided-area-margin']}
          middleText="or"
        ></DividedLine>

        <div className={styles['login-ways']}>
          <Google />
        </div>
      </div>
    </>
  );
};

export default Phone;
