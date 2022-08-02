import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';

import { hideLoading, showLoading } from '@components/Loading';
import PostEditor from '@components/PostEditor';
import { createGroupPost, Ilocation } from '@store/features/post/postSlice';
import { checkRegistered, loginMethod } from '@store/features/user/request';
import { getLocation, getLocationObject } from '@storage/location';
import { search } from '@search';
import { IGroupLoaction, IGroup } from '@types';
import { logEvent } from '@firebase';

import styles from '../styles/index.module.scss';

const PublishPost: React.FC = (props) => {
  const router = useRouter();
  const [location, setLocation] = useState<IGroupLoaction>(
    {} as IGroupLoaction
  );
  const group = { location } as IGroup;

  useEffect(() => {
    setLocation(getLocationObject());
  }, []);

  const createPost = async (data) => {
    showLoading();
    logEvent('create_post', {
      platform: navigator.userAgent,
    });
    const result = await createGroupPost(data);
    if (result.status === 'success') {
      router.push('/group/' + result.id);
    }
  };

  return <PostEditor group={group} onClickSave={createPost} />;
};

export default PublishPost;
