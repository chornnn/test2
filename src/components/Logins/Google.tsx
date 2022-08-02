import React from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

import { hideLoading, showLoading } from '@components/Loading';
import IconButton from '@components/IconButton';
import { googleAuth } from '@store/features/user/userSlice';
import { createUser } from '@store/features/user/userSlice';
import { ICreateUser } from '@store/features/user/request';
import { defaultAvatar } from '@constants';
import { setRedirect, getRedirect } from '@storage/redirect';

export const Google: React.FC = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const redirect = getRedirect();
  return (
    <IconButton
      name="google"
      onClick={async () => {
        showLoading();
        try {
          const res = await googleAuth(dispatch);
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
            // TODO: skip finishing up user profile for now
          } else {
            router.push(redirect);
          }
        } catch {
          hideLoading();
        } finally {
          setRedirect('/');
          hideLoading();
        }
      }}
    >
      Continue with Google
    </IconButton>
  );
};
