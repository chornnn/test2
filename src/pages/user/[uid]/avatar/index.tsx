import React from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { BiX } from 'react-icons/bi';
import Image from 'next/image';

import { user } from '@store/features/user/userSlice';

import styles from './index.module.scss';

const UserAvatar: React.FC = (props) => {
  const { userInfo } = useSelector(user);

  const router = useRouter();

  return (
    <div className={styles['avatar-container']}>
      <div
        className={styles['close']}
        onClick={() => {
          router.back();
        }}
      >
        <BiX color="#e3e3e3" size={32} />
      </div>
      <div className={styles['avatar-image']}>
        <Image src={userInfo.avatarUrl} layout="fill" objectFit="cover" />
      </div>
    </div>
  );
};

export default UserAvatar;
