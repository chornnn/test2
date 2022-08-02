import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';
import Head from 'next/head';
import type { NextPage } from 'next';
import classNames from 'classnames';
import { AiFillHome } from 'react-icons/ai';
import {
  BsPeopleFill,
  BsCaretDownFill,
  BsChevronLeft,
  BsSearch,
} from 'react-icons/bs';
import { RiDraftLine } from 'react-icons/ri';

import { AppHeader } from '@components/Headers';
import { Ad } from '@components/Ad';
import FilterModal from '@components/FilterModal';
import { showToast } from '@components/Toast';
import Tloader from '@components/ScrollLoader';
import Card from '@components/Card';
import { Card as CardPlaceholder } from '@components/Placeholder';
import { showConfirmModal } from '@components/ConfirmModal';
import { getUser, user } from '@store/features/user/userSlice';
import { getLocationRequest } from '@store/features/main/request';
import { getPostsByPage, getMoreListGroupPostsRequest } from '@store/features/post/request'

import { IGroup } from '@types';

import {
  getMoreListGroupPosts,
  Ilocation,
  posts,
} from '@store/features/post/postSlice';
import {
  setLocation as setLocalStorageLocation,
  setLocationObjectId,
} from '@storage/location';
import { getScrollPosition, setScrollPosition, setRedirect } from '@storage/redirect';
import { getUserId } from '@storage/user';
import { formatLocation } from '@utils/misc';
import { groupCategories, platforms, filters } from '@constants';

import { logEvent } from '@firebase';

import styles from './posts.module.scss';

// const pathname =
//   typeof window !== 'undefined' ? window?.location?.pathname : '';

interface Props {
  groups?: IGroup[];
  initialLocation?: string;
  page: number,
  hasMore: boolean,
}
const Posts: NextPage<Props> = ({ groups, initialLocation, page, hasMore }) => {
  const router = useRouter();
  const pathname = useRouter();
  const dispatch = useDispatch();
  // const [activeIndex, setActiveIndex] = useState(0);
  // const [showFilter, setShowFilter] = useState(false);
  // const [filterType, setFilterType] = useState('');
  // const [headerDismiss, setHeaderDismiss] = useState(false);
  const [location, setLocation] = useState(initialLocation);
  // const [loading, setLoading] = useState(true);
  // const [filterCategory, setFilterCategory] = useState(
  //   JSON.parse(JSON.stringify(groupCategories))
  // );
  // const [filterPlatform, setFilterPlatform] = useState(
  //   JSON.parse(JSON.stringify(platforms))
  // );
  // const [filterSort, setFilterSort] = useState(
  //   JSON.parse(JSON.stringify(filters))
  // );

  const metaDescription = `Find group social links for ${location}: Discord, GroupMe, Facebook, Instagram and others.`

  // const [requestLocation, setRequestLocation] = useState<Ilocation>();

  const { authenticated } = useSelector(user);
  // const {
  //   hasMore,
  //   datas,
  //   postIdStartAfter,
  //   creationTimeAfter,
  //   accumulatedPopularityAfter,
  //   dailyPopularityAfter,
  // } = useSelector(posts);

  // const filteredCategory = filterCategory.filter((item) => item.selected)[0]
  //   ?.title;
  // const filteredPlatform = filterPlatform.filter((item) => item.selected)[0]
  //   ?.title;
  // const filteredSort = filterSort.filter((item) => item.selected)[0]?.title;
  // const classesActiveOne = classNames(styles['posts-tab-title'], {
  //   [styles['posts-tab-title-active']]: activeIndex === 0,
  // });
  // const classesActiveTwo = classNames(styles['posts-tab-title'], {
  //   [styles['posts-tab-title-active']]: activeIndex === 1,
  // });
  // const postsSearchAreaClass = classNames(styles['posts-search-area'], {
  //   [styles['dismiss']]: headerDismiss,
  // });

  // const classesPostsTabTitles = classNames(styles['posts-tab-titles'], {
  //   [styles['disabled']]: loading,
  // });

  useEffect(() => {
    init();
  }, [router.query.location]);

  useEffect(() => {
    if (!location) {
      return;
    }
    // setLoading(true);
    // getMoreListGroupPosts(
    //   activeIndex,
    //   {
    //     orderBy: getOrderBy(),
    //     locationSocialId: location,
    //     category: filteredCategory ? filteredCategory : undefined,
    //     platform: filteredPlatform ? filteredPlatform : undefined,
    //   },
    //   dispatch,
    //   () => {
    //     setLoading(false);
    //     const scroll = getScrollPosition();
    //     if (!Number.isNaN(scroll)) {
    //       document.documentElement.scrollTop = scroll;
    //     }
    //     setScrollPosition(null);
    //   }
    // );
  }, [location])// [filteredCategory, filteredPlatform, filteredSort, location]);

  useEffect(() => {
    if (getUserId()) {
      getUser(dispatch);
    }
  }, [authenticated]);

  const getOrderBy = () => {
    let filter = 'byPopularity';
    // if (filteredSort === 'New') {
    //   filter = 'byTime';
    // }
    // if (filteredSort === 'Rising') {
    //   filter = 'byRising';
    // }
    return filter;
  };

  const init = async () => {
    console.log(groups);
    const location = router.query.location as string;
    if (!location) {
      return;
    }

    try {
      const res = (await getLocationRequest(location)) as any;
      const l = formatLocation(res?.data?.data?.location);
      setLocalStorageLocation(l);
    } catch (error) {
      console.log('failed to get location', String(error));
    }

    setLocation(location);
    setLocationObjectId(location);
    // set Hot as default filter
    // const newFilters = JSON.parse(JSON.stringify(filters));
    // newFilters[0].selected = true
    // setFilterSort(newFilters)
  };

  // const resetScrollPosition = () => {
  //   document.documentElement.scrollTop = 0;
  // };

  // const loadMore = (resolve, reject) => {
  //   getMoreListGroupPosts(
  //     activeIndex,
  //     {
  //       orderBy: getOrderBy(),
  //       postIdStartAfter,
  //       creationTimeAfter,
  //       accumulatedPopularityAfter,
  //       dailyPopularityAfter,
  //       locationSocialId: location,
  //       category: filteredCategory ? filteredCategory : undefined,
  //       platform: filteredPlatform ? filteredPlatform : undefined,
  //     },
  //     dispatch,
  //     resolve,
  //     reject
  //   );
  // };

  return (
    <div className={styles['posts']}>
      <Head>
        <title>Groups | {location}</title>
        <meta name="description" content={metaDescription} />
      </Head>

      <AppHeader location={location} showLogin showSearch showCreatePost />

      {/* className={postsSearchAreaClass}> */}
      <div className={styles['posts-search-area']}>
        <div className={styles['posts-locations']}>
          <div className={styles['posts-locations-title']}>{location}</div>
          <div
            className={styles['posts-locations-button']}
            onClick={() => {
              router.push('/');
            }}
          >
            [change]
          </div>
        </div>

        {/* <div className={styles['posts-filter-tab']}>
          <div className={styles['posts-categories']}>
            <div className={styles['posts-filter-title']}>Sort By</div>
            {filterSort.map((category) => (
              <div key={category.title} className={styles['posts-category']}>
                <input
                  type="checkbox"
                  id={category.title}
                  checked={category.selected}
                  name="category"
                  value={category.title}
                  onChange={(event) => {
                    if (!event.target.checked) {
                      return
                    }
                    const newCategory = JSON.parse(JSON.stringify(filters));
                    newCategory.forEach((item) => {
                      if (item.title === event.target.value) {
                        item.selected = event.target.checked;
                      }
                    });
                    setFilterSort(newCategory);
                  }}
                />
                <label htmlFor={category.title}>{category.title}</label>
              </div>
            ))}

            <div className={styles['posts-breaker']} />

            <div className={styles['posts-filter-title']}>Categories</div>
            <div
              className={styles['posts-category']}
              onClick={() => {
                setFilterCategory(JSON.parse(JSON.stringify(groupCategories)));
              }}
            >
              <BsChevronLeft style={{ marginRight: '4px' }} />
              <label>Clear</label>
            </div>
            {filterCategory.map((category) => (
              <div key={category.title} className={styles['posts-category']}>
                <input
                  type="checkbox"
                  id={category.title}
                  checked={category.selected}
                  name="category"
                  value={category.title}
                  onChange={(event) => {
                    const newCategory = JSON.parse(
                      JSON.stringify(groupCategories)
                    );
                    newCategory.forEach((item) => {
                      if (item.title === event.target.value) {
                        item.selected = event.target.checked;
                      }
                    });
                    setFilterCategory(newCategory);
                  }}
                />
                <label htmlFor={category.title}>{category.title}</label>
              </div>
            ))}
          </div>
        </div> */}

        <div className={styles['posts-ad']}>
          <Ad slotId="5478591187" width="100px"></Ad>
        </div>

        <div className={styles['posts-mobile-filter-tab']}>
          {/* <div
            className={`${styles['posts-mobile-filter']} ${filteredSort && styles['selected']
              }`}
            onClick={() => {
              setShowFilter(true);
              setFilterType('orderBy');
            }}
          >
            {filteredSort || 'Sort'}{' '}
            <BsCaretDownFill style={{ marginLeft: '4px' }} />
          </div>
          <div
            className={`${styles['posts-mobile-filter']} ${filteredCategory && styles['selected']
              }`}
            onClick={() => {
              setShowFilter(true);
              setFilterType('category');
            }}
          >
            {filteredCategory || 'Category'}{' '}
            <BsCaretDownFill style={{ marginLeft: '4px' }} />
          </div> */}
          <div
            className={styles['posts-search-button']}
            onClick={() => {
              router.push('/search');
            }}
          >
            <BsSearch size="20" />
          </div>
        </div>
      </div>

      <h1 className={styles['h1-tag']}>Groups and Clubs - {location.replace(/-/g, ' ')}</h1>

      {/* <Tloader
        className={styles['tloader']}
        hasMore={hasMore}
        loadMore={loadMore}
        isInitialLoading={loading}
      >
        {loading ? (
          Array(5)
            .fill(0)
            .map((_, index) => <CardPlaceholder key={index} />)
        ) : datas.length ? (
          datas.map((data, index) => {
            return (
              <Card
                onEnter={() => {
                  setScrollPosition(document.documentElement.scrollTop);
                }}
                key={uuidv4()}
                data={data}
                categoryClick={(category) => {
                  const newCategory = JSON.parse(
                    JSON.stringify(groupCategories)
                  );
                  newCategory.forEach((item) => {
                    if (item.title === category) {
                      item.selected = category;
                    }
                  });
                  setFilterCategory(newCategory);
                  resetScrollPosition();
                }}
              />
            );
          })
        ) : (
          <div className={styles['no-posts']}>
            <div className={styles['no-posts-icon']}>
              <RiDraftLine color="#A3A3A3" size={64} />
            </div>
            <div className={styles['no-posts-text']}>No posts yet</div>
            <div className={styles['no-posts-text']}>
              Be the first one to post your group!
            </div>
            <button
              className={styles['no-posts-button']}
              onClick={() => {
                if (!authenticated) {
                  logEvent('unauthenticated_create_post');
                  showConfirmModal(
                    'Please log in first to create a post',
                    () => {
                      setRedirect(pathname);
                      router.push('/login');
                    },
                    'Log in'
                  );
                  return;
                }

                router.push('/group/publish');
              }}
            >
              Post
            </button>
          </div>
        )}
      </Tloader> */}

      {groups.length !== 0 ? <div className={styles['hot-group-containers']}>
        {groups.map((group) => {
          return (
            <div className={styles['hot-group-box']} key={uuidv4()}>
              <Card
                data={group}
              />
            </div>
          );
        })}
      </div> : <div className={styles['no-posts']}>
        <div className={styles['no-posts-icon']}>
          <RiDraftLine color="#A3A3A3" size={64} />
        </div>
        <div className={styles['no-posts-text']}>No posts yet</div>
        <div className={styles['no-posts-text']}>
          Be the first one to post your group!
        </div>
        <button
          className={styles['no-posts-button']}
          onClick={() => {
            if (!authenticated) {
              logEvent('unauthenticated_create_post');
              showConfirmModal(
                'Please log in first to create a post',
                () => {
                  setRedirect(pathname);
                  router.push('/login');
                },
                'Log in'
              );
              return;
            }

            router.push('/group/publish');
          }}
        >
          Post
        </button>
      </div>}

      {location && (
        <div>
          <button
            onClick={() => router.push(`/groups/college/${location}/?pages=${page - 1}`)}
            disabled={page <= 1}
          >
            PREV
          </button>
          <button onClick={() => router.push(`/groups/college/${location}/?pages=${page + 1}`)}
            disabled={!hasMore}>
            NEXT
          </button>
        </div>)}

      {/* <FilterModal
        onClose={() => {
          setShowFilter(false);
        }}
        show={showFilter && filterType === 'category'}
        title="Filter by category"
        onApply={setFilterCategory}
        value={JSON.parse(JSON.stringify(filterCategory))}
      />

      <FilterModal
        onClose={() => {
          setShowFilter(false);
        }}
        show={showFilter && filterType === 'orderBy'}
        title="Sort By"
        onApply={setFilterSort}
        value={filterSort}
      /> */}
    </div >
  );
};

Posts.getInitialProps = async ({ query: { location, pages = 1 } }) => {

  const data = await getPostsByPage({
    "locationId": location as string,
    "page": pages as number,
  });

  const hasMore = data['data'].data.hasMore;
  const groups = data['data'].data.postList;

  const initialLocation = location as string;

  return { groups, initialLocation, page: parseInt(pages as string), hasMore };
}

export default Posts;
