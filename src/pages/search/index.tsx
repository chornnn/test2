import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';
import Head from 'next/head';
import classNames from 'classnames';
import Image from 'next/image';
import { FaMapMarkerAlt, FaUserFriends, FaCopy } from 'react-icons/fa';

import { AppHeader } from '@components/Headers';
import SearchInput from '@components/SearchInput';
import { showToast } from '@components/Toast';
import Tloader from '@components/ScrollLoader';
import Card from '@components/Card';
import {
  Card as CardPlaceholder,
  Follow as FollowPlaceholder,
} from '@components/Placeholder';
import { user, getUser } from '@store/features/user/userSlice';
import {
  chanegFollowRequest,
  changeFollowStatus,
} from '@store/features/post/postSlice';
import {
  followUserRequest,
  unfollowUserRequest,
  sharePostRequest,
} from '@store/features/post/request';
import { getLocationIdRequest } from '@store/features/main/request';
import { getUserId } from '@storage/user';
import { logEvent } from '@firebase';
import { useDebounce } from '@hooks';
import { searchPosts, searchUsers } from '@search';
import { getLocationObjectId, getLocationObject } from '@storage/location';
import { defaultAvatar } from '@constants';

import styles from './index.module.scss';

const Search: React.FC = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState(router.query.query as string);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [maxPage, setMaxPage] = useState(1);
  const [posts, setPosts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [locationObjectId, setLocationObjectId] = useState('');

  const { authenticated, userInfo } = useSelector(user);
  const debouncedValue = useDebounce(searchText, 500);

  const classesActiveOne = classNames(styles['posts-tab-title'], {
    [styles['posts-tab-title-active']]: activeIndex === 0,
  });
  const classesActiveTwo = classNames(styles['posts-tab-title'], {
    [styles['posts-tab-title-active']]: activeIndex === 1,
  });
  const classesPostsTabTitles = classNames(styles['posts-tab-titles'], {
    [styles['disabled']]: loading,
  });

  const init = async () => {
    let locationObjectId = getLocationObjectId();
    if (!locationObjectId) {
      const res = (await getLocationIdRequest(getLocationObject())) as any;
      locationObjectId = res?.data?.locationId;
    }
    setLocationObjectId(locationObjectId);
  };

  useEffect(() => {
    if (router.isReady === true) {
      setSearchText(router.query.query as string);
    }
  }, [router.isReady]);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (debouncedValue) {
      logEvent('search', { value: debouncedValue });
      if (activeIndex === 0) {
        let schoolFilter = `locationId:${locationObjectId}`;
        if (router.query.college as string != null) {
          schoolFilter = `locationId:${router.query.college as string}`;
        }
        if (schoolFilter == 'locationId:world-wide') {
          schoolFilter = null;
        }
        searchPosts(debouncedValue, {
          page,
          facetFilters: schoolFilter
        }).then(({ hits, nbPages }) => {
          hits.forEach((post) => {
            post['groupPostId'] = post.objectID;
          });
          if (page === 0) {
            setPosts(hits);
          } else {
            setPosts([...posts, ...hits]);
          }
          setLoading(false);
          setMaxPage(nbPages);
        });
      } else {
        searchUsers(debouncedValue, {
          page,
        }).then(({ hits, nbPages }) => {
          hits.forEach((user) => {
            user['uid'] = user.objectID;
          });
          if (page === 0) {
            setUsers(hits);
          } else {
            setUsers([...users, ...hits]);
          }
          setLoading(false);
          setMaxPage(nbPages);
        });
      }
    }
  }, [debouncedValue, activeIndex, page]);

  const loadMore = (resolve) => {
    setPage(page + 1);
    resolve();
  };

  const renderPosts = () => {
    return loading ? (
      <Tloader className={styles['tloader']}>
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <CardPlaceholder key={index} />
          ))}
      </Tloader>
    ) : posts.length > 0 ? (
      <Tloader
        className={styles['tloader']}
        loadMore={loadMore}
        hasMore={page < maxPage - 1}
      >
        {posts.map((data, index) => {
          return (
            <Card
              followRequest={data.followRequest}
              followEvent={async () => {
                if (!authenticated) {
                  showToast('Please log in first', 3000);
                  return;
                }

                dispatch(chanegFollowRequest({ status: true, index: index }));
                const res = await followUserRequest({
                  userIdToFollow: data.postOwnerId,
                });
                if (res['data']['code'] === 200) {
                  dispatch(
                    changeFollowStatus({
                      status: true,
                      index: index,
                    })
                  );
                }

                dispatch(chanegFollowRequest({ status: false, index: index }));
              }}
              showFollow={data.postOwnerId !== getUserId()}
              key={uuidv4()}
              data={data}
            />
          );
        })}
      </Tloader>
    ) : (
      <div className={styles['no-content']}>
        There are no posts mathching your search.
      </div>
    );
  };

  const toggleFollow = async (isFollowing, userId, index) => {
    if (isFollowing) {
      await unfollowUserRequest({ userIdToUnfollow: userId });
    } else {
      await followUserRequest({ userIdToFollow: userId });
    }
    getUser(dispatch);
  };

  const renderUsers = () => {
    return loading ? (
      <Tloader className={styles['tloader']}>
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <FollowPlaceholder key={index} />
          ))}
      </Tloader>
    ) : users.length > 0 ? (
      <Tloader
        className={styles['tloader']}
        loadMore={loadMore}
        hasMore={page < maxPage - 1}
      >
        {users.map((data, index) => {
          return (
            <div
              key={uuidv4()}
              className={styles['user-container']}
              onClick={() => {
                router.push('/user/' + data.userSocialId);
              }}
            >
              <div className={styles['user-image']}>
                <Image
                  src={data.avatarUrl || defaultAvatar}
                  onClick={() => {
                    router.push('/user/' + data.userSocialId);
                  }}
                  layout="fill"
                />
              </div>
              <div className={styles['user-info']}>
                <div className={styles['user-name']}>
                  {data.firstName} {data.lastName}
                </div>
                <div
                  className={styles['user-handle']}
                >{`@${data.userSocialId}`}</div>
                {data?.location?.state && (
                  <div className={styles['user-location']}>
                    <FaMapMarkerAlt />
                    {(data?.location?.locationName || data.location?.city) +
                      ', ' +
                      data.location?.state}
                  </div>
                )}
              </div>
              {/* {userInfo.followingUserIdList?.includes(data.objectID) ? (
                <div
                  className={styles['following-button']}
                  onClick={(event) => {
                    event.stopPropagation();
                    event.preventDefault();
                    toggleFollow(true, data.objectID, index);
                  }}
                >
                  Following
                </div>
              ) : (
                <div
                  className={styles['follow-button']}
                  onClick={(event) => {
                    event.stopPropagation();
                    event.preventDefault();
                    toggleFollow(false, data.objectID, index);
                  }}
                >
                  Follow
                </div>
              )} */}
            </div>
          );
        })}
      </Tloader>
    ) : (
      <div className={styles['no-content']}>
        There are no users mathching your search.
      </div>
    );
  };

  return (
    <div className={styles['search']}>
      <Head>
        <title>Search</title>
      </Head>

      <AppHeader
        showLogin
        showCreatePost
        className={styles['search-header']}
        showSearch
        searchAutoFocus
        searchValue={searchText}
        onSearchChange={setSearchText}
      />

      <div className={styles['posts-search-input']}>
        <SearchInput
          autoFocus
          value={searchText}
          onChange={(event) => {
            setSearchText(event.target.value);
          }}
          onCancel={() => {
            router.back();
          }}
          onClear={() => setSearchText('')}
        />
      </div>

      {debouncedValue && (
        <>
          <div className={styles['posts-tab']}>
            <div className={classesPostsTabTitles}>
              <div
                className={classesActiveOne}
                onClick={() => {
                  setActiveIndex(0);
                  setLoading(true);
                }}
              >
                <div className={styles['posts-tab-title-icon']}>
                  <FaCopy color={activeIndex === 0 ? '#FFD35C' : '#D2D2D2'} />
                </div>
                <div>Posts</div>
              </div>
              {/* <div
                className={classesActiveTwo}
                onClick={() => {
                  setActiveIndex(1);
                  setLoading(true);
                }}
              >
                <div className={styles['posts-tab-title-icon']}>
                  <FaUserFriends
                    color={activeIndex === 1 ? '#FFD35C' : '#D2D2D2'}
                  />
                </div>
                <div>Users</div>
              </div> */}
            </div>
            <div className={styles['posts-tab-lines']}>
              <div className={styles['posts-tab-line-container']}>
                {activeIndex === 0 && (
                  <div className={styles['posts-tab-line']}></div>
                )}
              </div>
              <div className={styles['posts-tab-line-container']}>
                {activeIndex === 1 && (
                  <div className={styles['posts-tab-line']}></div>
                )}
              </div>
            </div>
          </div>
          <div className={styles['search-content']}>
            {activeIndex ? renderUsers() : renderPosts()}
          </div>
        </>
      )}
    </div>
  );
};

export default Search;
