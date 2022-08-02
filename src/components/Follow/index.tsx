import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';
import { ChasingDots as Spinner } from 'better-react-spinkit';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import { BiX } from 'react-icons/bi';

import {
  Header as HeaderPlaceholder,
  Follow as FollowPlaceholder,
} from '@components/Placeholder';
import { BackHeader } from '@components/Headers';
import Tloader from '@components/ScrollLoader';
import ZoomIn from '@components/ZoomIn';
import {
  followUserRequest,
  unfollowUserRequest,
} from '@store/features/post/request';
import { getUser } from '@store/features/user/userSlice';
import {
  follows,
  getFollowers,
  changeFollowStatus,
  setFollowRequest,
  setUnFollowRequest,
} from '@store/features/follow/followSlice';
import { getUserId } from '@storage/user';
import { IUserInfo } from '@types';

import styles from './index.module.scss';

interface IFollowProps {
  onClose?: () => void;
  userInfo: IUserInfo;
  defaultActiveIndex?: number;
}

const Follow: React.FC<IFollowProps> = (props) => {
  const { onClose, userInfo, defaultActiveIndex } = props;
  const dispatch = useDispatch();
  const router = useRouter();
  const uid = useRef<string>();

  const [isUserLoading, setIsUserLoading] = useState<boolean>(true);
  const [isFollowLoading, setIsFollowLoading] = useState<boolean>(true);
  const [userName, setUserName] = useState('');
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);
  const [followerNumber, setFollowerNumber] = useState('0');
  const [followingNumber, setFollowingNumber] = useState('0');
  const [placeholderNumber, setPlaceholderNumber] = useState(4);
  const { datas } = useSelector(follows);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const classesActiveOne = classNames(styles['follow-tab-title'], {
    [styles['follow-tab-title-active']]: activeIndex === 0,
  });
  const classesActiveTwo = classNames(styles['follow-tab-title'], {
    [styles['follow-tab-title-active']]: activeIndex === 1,
  });

  useEffect(() => {
    if (userInfo) {
      setUserName(`${userInfo.firstName} ${userInfo.lastName}`);
      setFollowerNumber(userInfo.numFollowers);
      setFollowingNumber(userInfo.numFollowings);
      setIsUserLoading(false);

      if (defaultActiveIndex === 0) {
        setPlaceholderNumber(Number(userInfo.numFollowers));
      } else {
        setPlaceholderNumber(Number(userInfo.numFollowings));
      }
    }
    init();
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [refreshCounter, userInfo]);

  const init = async () => {
    if (!userInfo) {
      return;
    }

    uid.current = userInfo.uid;

    if (refreshCounter === 0) {
      await Promise.all([
        getFollowers({ uid: uid.current }, activeIndex, dispatch),
      ]);
      setIsFollowLoading(false);
    }
  };

  const followUser = async (uid: string, index) => {
    dispatch(
      setFollowRequest({
        index: index,
        status: true,
      })
    );
    const res = await followUserRequest({
      userIdToFollow: uid,
    });

    if (res['data']['code'] === 200) {
      dispatch(
        changeFollowStatus({
          status: true,
          index: index,
        })
      );

      await getUser(dispatch);
    }
    dispatch(
      setFollowRequest({
        index: index,
        status: false,
      })
    );
    setRefreshCounter(refreshCounter + 1);
  };

  const unfollowUser = async (uid: string, index) => {
    dispatch(
      setUnFollowRequest({
        index: index,
        status: true,
      })
    );
    const res = await unfollowUserRequest({
      userIdToUnfollow: uid,
    });

    if (res['data']['code'] === 200) {
      dispatch(
        changeFollowStatus({
          status: false,
          index: index,
        })
      );
      await getUser(dispatch);
    }
    dispatch(
      setUnFollowRequest({
        index: index,
        status: false,
      })
    );
    setRefreshCounter(refreshCounter + 1);
  };

  return (
    <>
      <div className={styles['backdrop']} onClick={onClose} />
      <div className={styles['follow-container']}>
        {isUserLoading ? (
          <HeaderPlaceholder />
        ) : (
          <>
            <div className={styles['mobile-header']}>
              <BackHeader title={userName} />
            </div>

            <div className={styles['desktop-header']}>
              <div className={styles['desktop-title']}>{userName}</div>
              <div className={styles['desktop-icon']} onClick={onClose}>
                <BiX />
              </div>
            </div>
          </>
        )}

        <div className={styles['follow-tab']}>
          <div className={styles['follow-tab-titles']}>
            <div
              className={classesActiveOne}
              onClick={() => {
                setActiveIndex(0);
                setIsFollowLoading(true);
                setPlaceholderNumber(Number(followerNumber));
                getFollowers(
                  { uid: uid.current },
                  0,
                  dispatch,
                  () => {
                    setIsFollowLoading(false);
                  },
                  () => {
                    setIsFollowLoading(false);
                  }
                );
              }}
            >
              {followerNumber} Followers
            </div>
            <div
              className={classesActiveTwo}
              onClick={() => {
                setActiveIndex(1);
                setIsFollowLoading(true);
                setPlaceholderNumber(Number(followingNumber));
                getFollowers(
                  { uid: uid.current },
                  1,
                  dispatch,
                  () => {
                    setIsFollowLoading(false);
                  },
                  () => {
                    setIsFollowLoading(false);
                  }
                );
              }}
            >
              {followingNumber} Following
            </div>
          </div>
          <div className={styles['follow-tab-lines']}>
            <div className={styles['follow-tab-line-container']}>
              <ZoomIn in={activeIndex === 0}>
                <div className={styles['follow-tab-line']}></div>
              </ZoomIn>
            </div>
            <div className={styles['follow-tab-line-container']}>
              <ZoomIn in={activeIndex === 1}>
                <div className={styles['follow-tab-line']}></div>
              </ZoomIn>
            </div>
          </div>
        </div>

        <div className={styles['follow-list']}>
          <Tloader
            className={styles['tloader']}
            loadMore={(resolve, reject) => {
              setTimeout(() => {
                resolve();
              }, 2000);
            }}
          >
            <div>
              {isFollowLoading
                ? Array(placeholderNumber)
                    .fill(0)
                    .map((_, index) => <FollowPlaceholder key={index} />)
                : datas.length > 0 &&
                  datas.map((data, index) => {
                    return (
                      <div
                        key={uuidv4()}
                        className={styles['follow-detail-desc-conatiner']}
                      >
                        <div className={styles['follow-detail-desc']}>
                          <div className={styles['follow-detail-image']}>
                            <Image
                              src={data.avatarUrl}
                              onClick={() => {
                                if (onClose) {
                                  onClose();
                                }
                                router.push('/user/' + data.userSocialId);
                              }}
                              layout="fill"
                            />
                          </div>
                          <div
                            className={styles['follow-detail-text']}
                            onClick={() => {
                              if (onClose) {
                                onClose();
                              }
                              router.push('/user/' + data.userSocialId);
                            }}
                          >
                            <div className={styles['follow-detail-first-line']}>
                              <div className={styles['follow-detail-user']}>
                                {data.name}
                              </div>
                            </div>
                            <div
                              className={styles['follow-detail-second-line']}
                            >
                              <div
                                className={
                                  styles['follow-detail-second-line-time']
                                }
                              >
                                {data.numFollowers} Followers
                              </div>
                              <div
                                className={
                                  styles['follow-detail-second-line-time']
                                }
                              >
                                |
                              </div>
                              <div
                                className={
                                  styles['follow-detail-second-line-time']
                                }
                              >
                                {data.numFollowings} Following
                              </div>
                            </div>
                          </div>
                          <div
                            className={styles['follow-detail-right-section']}
                          >
                            {data.followRequest ? (
                              <div className={styles['follow-main-spinner']}>
                                <Spinner
                                  fadeIn="none"
                                  name="circle"
                                  color={'black'}
                                />
                              </div>
                            ) : (
                              uid.current === getUserId() &&
                              !data.isFollowing && (
                                <div
                                  className={
                                    styles['follow-detail-social-button-follow']
                                  }
                                  onClick={() => {
                                    followUser(data.uid, index);
                                  }}
                                >
                                  Follow
                                </div>
                              )
                            )}

                            {data.unFollowRequest ? (
                              <div className={styles['follow-main-spinner']}>
                                <Spinner
                                  fadeIn="none"
                                  name="circle"
                                  color={'black'}
                                />
                              </div>
                            ) : (
                              uid.current === getUserId() &&
                              data.isFollowing && (
                                <div
                                  className={
                                    styles[
                                      'follow-detail-social-button-following'
                                    ]
                                  }
                                  onClick={async () => {
                                    unfollowUser(data.uid, index);
                                  }}
                                >
                                  Following
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
            </div>
          </Tloader>
        </div>
      </div>
    </>
  );
};

export default Follow;
