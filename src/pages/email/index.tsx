import React from 'react';
import { useRouter } from 'next/router';

import Head from 'next/head'
import googleIcon from '@images/google-icon.png';
import facebookIcon from '@images/Facebook.png';
import phoneIcon from '@images/phone.png';
import IconButton from '@components/IconButton';
import TwoDesc from '@components/TwoDesc';
import CommonInput from '@components/CommonInput';
import DividedLine from '@components/DividedLine';
import SimpleButton from '@components/SimpleButton';

import styles from './email.module.scss';

const Email: React.FC = (props) => {
  const router = useRouter();

  return (
    <div className={styles['Login']}>
      <Head>
        <title> Email</title>
      </Head>

      <TwoDesc
        title="Log in"
        desc="New to Grouphub?"
        actionDesc="Sign up"
        clickEvent={() => {
          router.push('/signup');
        }}
      ></TwoDesc>

      <div className={styles['form-area']}>
        <CommonInput placeholder="Enter your email address">Email</CommonInput>
        <SimpleButton
          onClick={() => {
            router.push('/confirm/email');
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
        <IconButton name="google"> Continue with Google</IconButton>
        <IconButton name="facebook">Continue with Facebook</IconButton>

        <IconButton
          onClick={() => {
            router.push('/phone');
          }}
          name="phone"
        >
          Continue with Phone
        </IconButton>
      </div>
    </div>
  );
};

export default Email;
