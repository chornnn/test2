import React, { useState, ChangeEvent } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';

import TwoDesc from '@components/TwoDesc';
import CommonInput from '@components/CommonInput';
import SimpleButton from '@components/SimpleButton';
import Disclaimer from '@components/Disclaimer';
import { SimpleHeader } from '@components/Headers';
import { showToast } from '@components/Toast';
import { hideLoading, showLoading } from '@components/Loading';
import { setRedirect, getRedirect } from '@storage/redirect';
import { loginByEmail } from '@store/features/user/userSlice';

import styles from './login.module.scss';

const Login: React.FC = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();
  const dispatch = useDispatch();
  const redirect = getRedirect();

  async function handleLogin() {
    if (!email) {
      showToast('Please input an email', 3000);
      return;
    }

    if (!password) {
      showToast('Please input a password', 3000);
      return;
    }

    showLoading();
    try {
      const res = await loginByEmail(dispatch, email, password);
      if (res.message == 'success') {
        router.push(redirect);
      }
    } catch {
      hideLoading();
      showToast('Invalid email or password', 3000);
    } finally {
      setRedirect('/');
      hideLoading();
    }
  }

  return (
    <>
      <Head>
        <title>Log in</title>
      </Head>

      <div className="auth-container">
        <SimpleHeader />

        <TwoDesc
          title="Log in"
          desc="New to Grouphub?"
          actionDesc="Sign up"
          clickEvent={() => {
            router.push('/signup');
          }}
        />

        <div className={styles['form-area']}>
          <CommonInput
            type="email"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setEmail(e.target.value);
            }}
            placeholder="Enter your email"
            className={styles['input-button']}
          >
            Email
          </CommonInput>
          <CommonInput
            type="password"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setPassword(e.target.value);
            }}
            placeholder="Enter your password"
            className={styles['input-button']}
          >
            Password
          </CommonInput>
          <SimpleButton
            onClick={handleLogin}
            className={styles['confirm-button']}
          >
            Log In
          </SimpleButton>
        </div>

        <Disclaimer />
      </div>
    </>
  );
};

export default Login;
