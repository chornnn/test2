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
import { signupByEmail, createUser } from '@store/features/user/userSlice';
import { ICreateUser } from '@store/features/user/request';
import { setRedirect, getRedirect } from '@storage/redirect';
import { defaultAvatar } from '@constants';

import styles from './signup.module.scss';

const Signup: React.FC = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const router = useRouter();
  const dispatch = useDispatch();
  const redirect = getRedirect();

  async function handleSignup() {
    if (!email) {
      showToast('Please input an email', 3000);
      return;
    }

    if (!password) {
      showToast('Please input a password', 3000);
      return;
    }

    if (confirmPassword !== password) {
      showToast('Your passwords do not match', 3000);
      return;
    }

    showLoading();
    try {
      const res = await signupByEmail(dispatch, email, password);
      if (res.message === 'finish') {
        const user = {
          uid: res.uid,
          logInMethod: res.loginMethod,
          email: res.email,
          avatarUrl: defaultAvatar,
          bio: '',
          interests: [],
        } as ICreateUser;
        await createUser(user, dispatch);
        router.push(redirect);
      }
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        showToast('Email already in use', 3000);
      } else if (error.code === 'auth/invalid-email') {
        showToast('Invalid email', 3000);
      } else if (error.code === 'auth/weak-password') {
        showToast('Password should be at least 6 characters', 3000);
      }
      hideLoading();
    } finally {
      setRedirect('/');
      hideLoading();
    }
  }

  return (
    <>
      <Head>
        <title>Sign Up</title>
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
          <CommonInput
            type="password"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setConfirmPassword(e.target.value);
            }}
            placeholder="Enter your password"
            className={styles['input-button']}
          >
            Confirm Password
          </CommonInput>
          <SimpleButton
            onClick={handleSignup}
            className={styles['confirm-button']}
          >
            Sign Up
          </SimpleButton>
        </div>

        {/* <div className={styles['login-ways']}>
          <Google />
          <IconButton
            onClick={() => {
              router.push('/login/phone');
            }}
            name="phone"
          >
            Continue with Phone
          </IconButton>
        </div> */}
        <Disclaimer />
      </div>
    </>
  );
};

export default Signup;
