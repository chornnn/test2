import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import Image from 'next/image';
import { useRouter } from 'next/router';
import type { NextPage } from 'next';
import { v4 as uuidv4 } from 'uuid';

import Card from '@components/Card';
import SimpleButton from '@components/SimpleButton';
import SearchBar from '@components/SearchBar';
import { Ad } from '@components/Ad';
import { AppHeader } from '@components/Headers';

import {
  getHotLocations,
  getHotGroups,
  IhotLocation,
  main,
} from '@store/features/main/mainSlice';



import { getUser } from '@store/features/user/userSlice';
import { wrapper } from '@store/index';
import { setLocation, setLocationObjectId, getLocationObjectId } from '@storage/location';
import { formatLocation } from '@utils/misc';

import styles from './index.module.scss';

export const getStaticProps = wrapper.getStaticProps((store) => async () => {
  await Promise.all([store.dispatch(getHotLocations())]);
  await Promise.all([store.dispatch(getHotGroups())]);

  return { props: {}, revalidate: 1 };
});

const ReadMore = ({ children }) => {
  const text = children;
  const [isReadMore, setIsReadMore] = useState(true);
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };
  return (
    <div>
      <div className={styles['hot-containers']}>{isReadMore ? text.slice(0, 10) : text}</div>
      <div onClick={toggleReadMore} className={styles['read-or-hide']}>
        {isReadMore ? 'Show more' : ' Show less'}
      </div>
    </div>
  );
};

const IndexPage: NextPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { hotLocations, hotGroups } = useSelector(main);
  const [searchText, setSearchText] = useState('');
  const keyWords = ['Gaming', 'Anime', 'Music', 'Art', 'Crypto', 'LGBTQ', 'Esports', 'Movies', 'Sports'];

  useEffect(() => {
    getUser(dispatch);
    setLocation("World Wide");
    setLocationObjectId("world-wide");
  }, []);

  return (
    <>
      <Head>
        <title>Grouphub | Student Group List: Discord, Groupme, Facebook, Instagram, etc.</title>
        <meta name="description" content="Find and list student groups. Grouphub compiles group chat links on various platforms: Discord, GroupMe, WhatsApp and Telegram. A simple way to share group chat links with friends and followers." />
      </Head>

      <AppHeader showLocation={false} showSearch={false} noBorder showCreatePost={true} />
      <div className={styles.app}>
        <div className={styles['app-desc']}>
          <div>
            <h1 className={styles['desc-title']}>Student Groups on: Discord, GroupMe, Facebook, Instagram, etc.</h1>
            <h2 className={styles['desc-subtitle']}>
              Grouphub is a place where you can list/find student groups.
            </h2>
          </div>
        </div>

        {/*<div className={styles['app-hero']} /> */}

        <SearchBar
          onChange={(event) => {
            setSearchText(event.target.value);
          }}
          onSelect={(data) => {
            const location = formatLocation(data);
            setLocation(location);
            setLocationObjectId(data.objectID);
          }}
          onClick={() => {
            if (searchText === '' && getLocationObjectId() == 'world-wide') {
              return;
            }
            if (searchText !== '') {
              router.push({
                pathname: '/search/',
                query: {
                  college: getLocationObjectId(),
                  query: searchText
                }
              });
            } else {
              router.push('/groups/college/' + getLocationObjectId());
            }
          }} />

        <div className={styles['hot-keywords-container']}>
          {keyWords.map((keyWord) => {
            return (
              <div className={styles['hot-keywords-box']} key={uuidv4()}>
                <SimpleButton
                  className={styles['hot-keywords-button']}
                  onClick={() => {
                    router.push({
                      pathname: '/search/',
                      query: {
                        college: getLocationObjectId(),
                        query: keyWord
                      }
                    });
                  }}
                >
                  {keyWord.toUpperCase()}
                </SimpleButton>
              </div>
            );
          })}
        </div>

        { /*<Ad slotId="9045628658" width="50%" /> */}

        <div className={styles['hot-locations']}>
          <div className={styles['hot-locations-header']}>
            <div className={styles['hot-locations-header-title']}>
              Explore hot colleges
            </div>
            {/* <div
            className={styles['hot-locations-header-view-all']}
            onClick={() => {
              router.push('/locations');
            }}
          >
            View all
          </div> */}
          </div>

          <Link hreflang="en" href={`/groups/college`} passHref>
            <a
            >
              Hot Colleges
            </a>
          </Link>

          <div className={styles['hot-containers']}>
            <ReadMore>
              {hotLocations.map((hotLocation: IhotLocation, index) => {
                return (
                  <Link hreflang="en" href={`/groups/college/${hotLocation.location.locationId}`} passHref>
                    <a className={styles['hot-location']} target="_blank">
                      <div
                        key={index}
                        onClick={() => {
                          const location = formatLocation(hotLocation.location);
                          setLocation(location);
                        }}
                      >
                        <div className={styles['hot-location-image']}>
                          <Image
                            priority
                            src={hotLocation.photoUrl}
                            layout="fill"
                            objectFit="cover"
                            alt={(hotLocation.location.locationName ||
                              hotLocation.location.city) +
                              ', ' +
                              hotLocation.location.state}
                          />
                        </div>
                        <div className={styles['hot-location-title']}>
                          {(hotLocation.location.locationName ||
                            hotLocation.location.city) +
                            ', ' +
                            hotLocation.location.state}
                        </div>
                        <div className={styles['hot-location-number']}>
                          {hotLocation.numGroups}
                        </div>
                      </div>
                    </a>
                  </Link>
                );
              })}
            </ReadMore>
          </div>

          <div className={styles['hot-group-word']}>
            Explore Groups
          </div>

          <Link hreflang="en" href={`/group`} passHref>
            <a
            >
              All Groups
            </a>
          </Link>

          <div className={styles['hot-group-containers']}>
            {hotGroups.map((hotGroup) => {
              return (
                <div className={styles['hot-group-box']} key={uuidv4()}>
                  <Card
                    data={hotGroup}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default IndexPage;
