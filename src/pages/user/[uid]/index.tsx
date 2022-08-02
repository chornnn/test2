import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';
import { useSwipeable } from 'react-swipeable';
import { RiDraftLine } from 'react-icons/ri';
import { CSSTransition } from 'react-transition-group';

import { AppHeader } from '@components/Headers';
import UserInfo from '@components/UserInfo';
import Follow from '@components/Follow';
import Card from '@components/Card';
import {
  User as UserPlaceholder,
  Card as CardPlaceholder,
} from '@components/Placeholder';
import Tloader from '@components/ScrollLoader';
import { showToast } from '@components/Toast';
import { hideLoading, showLoading } from '@components/Loading';
import {
  getOtherUser,
  getUser,
  getOtherUserBySocialId,
  user,
  updateUser,
  clearOther,
} from '@store/features/user/userSlice';
import {
  clear,
  getUserMoreListGroupPosts,
  getUserSavedGroupPosts,
  userPosts,
  disLikeRequest,
  likeRequest,
} from '@store/features/userPosts/userSlice';
import { getUserSocialId, getUserId } from '@storage/user';
import { useWindowSize } from '@hooks';

import styles from './userProfile.module.scss';

const UserProfile: React.FC = (props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [headerDismiss, setHeaderDismiss] = useState(false);
  const { hasMore, datas, postIdStartAfter, creationTimeAfter } =
    useSelector(userPosts);
  const { authenticated, hasRegistered, otherUserInfo, userInfo } =
    useSelector(user);
  const socialId = useRef<string>();
  const [isOtherUser, setIsOtherUser] = useState<boolean>();
  const [currentUserInfo, setCurrentUserInfo] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshCounter, setRefreshCounter] = useState(0);

  const { isDesktop } = useWindowSize();
  const dispatch = useDispatch();
  const router = useRouter();

  const classesActiveOne = classNames(styles['my-user-prof-tab-title'], {
    [styles['my-user-prof-tab-title-active']]: activeIndex === 0,
  });
  const classesActiveTwo = classNames(styles['my-user-prof-tab-title'], {
    [styles['my-user-prof-tab-title-active']]: activeIndex === 1,
  });

  const refresh = (resolve, reject) => {
    getUserMoreListGroupPosts(
      {
        postOwnerId: currentUserInfo.uid,
      },
      dispatch,
      resolve,
      reject
    );
  };

  const loadMore = (resolve, reject) => {
    getUserMoreListGroupPosts(
      {
        postOwnerId: currentUserInfo.uid,
        postIdStartAfter: postIdStartAfter,
        creationTimeAfter: creationTimeAfter,
      },
      dispatch,
      resolve,
      reject
    );
  };

  const loadSavedMore = (resolve, reject) => {
    getUserSavedGroupPosts(
      {
        postIdStartAfter: postIdStartAfter,
        creationTimeAfter: creationTimeAfter,
      },
      dispatch,
      resolve,
      reject
    );
  };

  const handlers = useSwipeable({
    delta: 0,
    onSwipedDown: () => setHeaderDismiss(false),
    onSwipedUp: () => setHeaderDismiss(true),
    onSwiping: (SwipeEventData) => {
      if (SwipeEventData.deltaY > 0) {
        setHeaderDismiss(false);
      } else {
        setHeaderDismiss(true);
      }
    },
    trackTouch: true,
  });

  useEffect(() => {
    if (activeIndex === 0 && currentUserInfo && currentUserInfo.uid) {
      dispatch(clear());
      getUserMoreListGroupPosts(
        {
          postOwnerId: currentUserInfo.uid,
          postIdStartAfter: postIdStartAfter,
          creationTimeAfter: creationTimeAfter,
        },
        dispatch
      );
    } else if (activeIndex === 1) {
      dispatch(clear());
      getUserSavedGroupPosts(
        {
          // postIdStartAfter: postIdStartAfter,
          // creationTimeAfter: creationTimeAfter,
        },
        dispatch
      );
    }
  }, [activeIndex]);

  useEffect(() => {
    setCurrentUserInfo(null);
    init();
    return () => {
      dispatch(clear());
      clearOther(dispatch);
      setIsLoading(true);
    };
  }, [router.query.uid]);

  const init = async () => {
    socialId.current = router.query.uid as string;
    if (!socialId.current) {
      return;
    }
    const userSocialId = userInfo?.userSocialId || getUserSocialId();

    if (userSocialId !== socialId.current) {
      setIsOtherUser(true);
      await Promise.all([
        getOtherUserBySocialId(socialId.current, dispatch),
        getUser(dispatch),
      ]);
    } else {
      setIsOtherUser(false);
      await Promise.all([getUser(dispatch)]);
    }
  };

  useEffect(() => {
    if (isOtherUser && otherUserInfo) {
      setCurrentUserInfo(otherUserInfo);
      getUserMoreListGroupPosts(
        {
          postOwnerId: otherUserInfo.uid,
        },
        dispatch,
        () => setIsLoading(false)
      );
    } else if (isOtherUser === false && userInfo) {
      setCurrentUserInfo(userInfo);
      getUserMoreListGroupPosts(
        {
          postOwnerId: userInfo.uid,
        },
        dispatch,
        () => setIsLoading(false)
      );
    }
  }, [otherUserInfo, userInfo]);

  useEffect(() => {
    if (!refreshCounter) {
      return;
    }
    setTimeout(() => {
      getUserMoreListGroupPosts(
        {
          postOwnerId: currentUserInfo.uid,
        },
        dispatch,
        () => setIsLoading(false)
      );
    }, 500);
  }, [refreshCounter]);

  const updateUserInfo = async (userInfo) => {
    showLoading();
    const result = await updateUser(userInfo, dispatch);
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
    <div className={styles['my-container']}>
      <AppHeader
        showLogin
        showCreatePost
        showLocation={isDesktop}
        showSearch={isDesktop}
      ></AppHeader>

      <div className={styles['my-user-prof']}>
        {currentUserInfo ? (
          <>
            <div className={styles['my-user-prof-header']}>
              <UserInfo userInfo={currentUserInfo} />

              {!isOtherUser && (
                <div
                  className={styles['profile-button-container']}
                  onClick={() => {
                    router.push(`/user/edit`);
                  }}
                >
                  <div className={styles['profile-button']}>Edit Profile</div>
                </div>
              )}
            </div>

            <div className={styles['my-user-prof-tab']}>
              <div className={styles['my-user-prof-tab-titles']}>
                <div
                  className={classesActiveOne}
                  onClick={() => {
                    setActiveIndex(0);
                  }}
                >
                  Posts
                </div>
                {!isOtherUser && currentUserInfo && (
                  <div
                    className={classesActiveTwo}
                    onClick={() => {
                      setActiveIndex(1);
                    }}
                  >
                    Saved
                  </div>
                )}
              </div>
              <div className={styles['my-user-prof-tab-lines']}>
                <div className={styles['my-user-prof-tab-line-container']}>
                  <CSSTransition
                    in={activeIndex === 0}
                    timeout={300}
                    classNames="zoom-in-top"
                    appear
                    unmountOnExit
                  >
                    <div className={styles['my-user-prof-tab-line']}></div>
                  </CSSTransition>
                </div>
                <div className={styles['my-user-prof-tab-line-container']}>
                  <CSSTransition
                    in={activeIndex === 1}
                    timeout={300}
                    classNames="zoom-in-top"
                    appear
                    unmountOnExit
                  >
                    <div className={styles['my-user-prof-tab-line']}></div>
                  </CSSTransition>
                </div>
              </div>
            </div>
          </>
        ) : (
          <UserPlaceholder />
        )}
      </div>

      <Tloader
        className={styles['tloader']}
        hasMore={hasMore}
        loadMore={activeIndex === 0 ? loadMore : loadSavedMore}
        isInitialLoading={isLoading}
      >
        {isLoading ? (
          Array(3)
            .fill(0)
            .map((_, index) => <CardPlaceholder key={index} />)
        ) : datas.length ? (
          datas.map((data, index) => {
            return (
              <Card
                showFollow={false}
                disLikeRequest={data.disLikeRequest}
                disLikeRquestEvent={async (e: React.MouseEvent) => {
                  e.stopPropagation();
                  if (!authenticated) {
                    showToast('Please log in first', 3000);
                    return;
                  }

                  disLikeRequest(
                    data.groupPostId,
                    index,
                    !data.hasDisliked,
                    dispatch
                  );
                }}
                likeRquestEvent={async (e: React.MouseEvent) => {
                  e.stopPropagation();
                  if (!authenticated) {
                    showToast('Please log in first', 3000);
                    return;
                  }

                  likeRequest(
                    data.groupPostId,
                    index,
                    !data.hasLiked,
                    dispatch
                  );
                }}
                key={uuidv4()}
                likeRquest={data.likeRequest}
                data={data}
              />
            );
          })
        ) : (
          <div className={styles['no-posts']}>
            <div className={styles['no-posts-icon']}>
              <RiDraftLine color="#A3A3A3" size={64} />
            </div>
            <div className={styles['no-posts-text']}>
              Er...there is no posts yet
            </div>
          </div>
        )}
      </Tloader>
    </div>
  );
};

export default UserProfile;
