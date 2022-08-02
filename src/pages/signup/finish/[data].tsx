import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';

import UserEditor from '@components/UserEditor';
import { showToast } from '@components/Toast';
import { hideLoading, showLoading } from '@components/Loading';
import { createUser } from '@store/features/user/userSlice';
import { IUserInfo, IGroupLoaction } from '@types';
import { loginMethod } from '@store/features/user/request';
import { defaultAvatar } from '@constants';
import { setRedirect, getRedirect } from '@storage/redirect';

import styles from './index.module.scss';

interface ISignupWay {
  logInMethod: string;
  uid: string;
  email?: string;
}

const FinishPersonInfo: React.FC = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [userInfo, setUserInfo] = useState<IUserInfo>();
  const [logInMethod, setLogInMethod] = useState<string>('');

  useEffect(() => {
    const data = JSON.parse((router.query.data as string) || '') as ISignupWay;
    loginMethod.Gmail;
    const user = {
      uid: data.uid,
      email: data.email,
      location: {} as IGroupLoaction,
    };
    setLogInMethod(data.logInMethod);
    setUserInfo(user);
  }, [router.query.data]);

  const save = async (user) => {
    if (!user.avatarUrl) {
      user.avatarUrl = defaultAvatar;
    }
    if (!user.bio) {
      user.bio = '';
    }
    user.logInMethod = logInMethod;

    showLoading();
    try {
      const result = await createUser(user, dispatch);
      if (result === 'success') {
        const redirect = getRedirect();
        setRedirect('/');
        router.push(redirect);
      } else {
        showToast(
          'There is an issue updating your profile. Please try again later.',
          3000
        );
      }
    } catch (error) {
      showToast(
        'There is an issue updating your profile. Please try again later.',
        3000
      );
    }

    hideLoading();
  };

  return (
    <div className={styles['Finish-sign-up']}>
      <Head>
        <title>Finish signing up</title>
      </Head>

      {userInfo && (
        <UserEditor
          isSimpleFlow
          title="Finish Signing Up"
          onSave={save}
          userInfo={userInfo}
          onClose={() => router.push('/')}
        />
      )}
    </div>
  );
};

export default FinishPersonInfo;
