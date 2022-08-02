import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { BiX } from 'react-icons/bi';

import { IUserInfo } from '@types';
import { defaultAvatar } from '@constants';

import styles from './index.module.scss';

interface UserInfoProps {
  userInfo: IUserInfo;
  alignLeft?: boolean;
}

const UserInfo: React.FC<UserInfoProps> = (props) => {
  const { userInfo } = props;
  const [showAvatar, setShowAvatar] = useState(false);

  const router = useRouter();

  const location =
    userInfo?.location?.state &&
    (userInfo?.location?.locationName || userInfo.location?.city) +
      ', ' +
      userInfo.location?.state;

  return (
    <>
      <div className={styles['user-profile-container']}>
        <div className={styles['user-img-container']}>
          <div
            className={styles['user-img']}
            onClick={() => {
              setShowAvatar(true);
            }}
          >
            <Image
              src={userInfo.avatarUrl || defaultAvatar}
              layout="fill"
              objectFit="cover"
            />
          </div>
        </div>

        <div className={styles['user-info']}>
          <div className={styles['user-name']}>{userInfo.userName}</div>
          <div
            className={styles['user-handle']}
          >{`@${userInfo.userSocialId}`}</div>
          {location && (
            <div className={styles['user-location']}>
              <span className={styles['pin-image']}>
                <FaMapMarkerAlt />
              </span>
              {location}
            </div>
          )}
          <div className={styles['user-posts']}>
            <span className={styles['user-posts-count']}>
              {userInfo.numPosts}
            </span>
            Post{Number(userInfo.numPosts) > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {showAvatar && (
        <div className={styles['avatar-container']}>
          <div
            className={styles['close']}
            onClick={() => {
              setShowAvatar(false);
            }}
          >
            <BiX color="#e3e3e3" size={32} />
          </div>
          <div className={styles['avatar-image']}>
            <Image src={userInfo.avatarUrl} layout="fill" objectFit="cover" />
          </div>
        </div>
      )}
    </>
  );
};

export default UserInfo;
