import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import { showToast } from '@components/Toast';
import UserEditor from '@components/UserEditor';
import { hideLoading, showLoading } from '@components/Loading';
import { updateUser, user } from '@store/features/user/userSlice';

const EditPersonInfo: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { userInfo } = useSelector(user);

  const update = async (user) => {
    showLoading();
    const result = await updateUser(user, dispatch);
    if (result === 'success') {
      router.back();
    } else {
      showToast(
        'There is an issue updating your profile. Please try again later.',
        3000
      );
    }

    hideLoading();
  };

  return (
    <>
      <Head>
        <title>Edit Profile</title>
      </Head>
      <UserEditor title="Edit Profile" onSave={update} userInfo={userInfo} />
    </>
  );
};

export default EditPersonInfo;
