import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Image from 'next/image';

import { AppHeader } from '@components/Headers';
import AutoComplete from '@components/AutoComplete';
import DividedLine from '@components/DividedLine';
import FireUrl from '@images/Fire.png';
import {
  getAllLocations,
  IhotLocation,
  IStateType,
  main,
} from '@store/features/main/mainSlice';
import { setLocation } from '@storage/location';
import { wrapper } from '@store/index';
import { formatLocation } from '@utils/misc';

export const getStaticProps = wrapper.getStaticProps((store) => async () => {
  // await Promise.all([store.dispatch(getAllLocations())]);

  return { props: {} };
});

import styles from './locations.module.scss';

const Locations: React.FC = (props) => {
  const router = useRouter();
  const { allLocations, hotLocations } = useSelector(main);

  return (
    <div className={styles['all-locations']}>
      <AppHeader />
      <AutoComplete
        onSelect={(data) => {
          const location = formatLocation(data);
          setLocation(location);
          router.push('/groups/college/' + encodeURI(location));
        }}
        useDefaultFetchSuggestions
        className={styles['App-location']}
      />

      <div className={styles['hot-container']}>
        <div className={styles['hot-header']}>
          <div className={styles['hot-header-image']}>
            <Image src={FireUrl} />
          </div>
          <div>Hot Location</div>
        </div>
        <div className={styles['hot-areas']}>
          {hotLocations.map((hotLocation: IhotLocation) => {
            return (
              <div
                key={hotLocation.locationName}
                className={styles['hot-area']}
                onClick={() => {
                  const location = formatLocation(hotLocation.location);
                  setLocation(location);
                  router.push('/groups/college/' + encodeURI(location));
                }}
              >
                {(hotLocation.location.locationName ||
                  hotLocation.location.city) +
                  ', ' +
                  hotLocation.location.state}
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles['states']}>
        {allLocations.map((stateData: IStateType) => {
          return (
            <div className={styles['state-container']}>
              <DividedLine
                className={styles['locations-dividedLine']}
                middleText={stateData.state}
              ></DividedLine>

              <div className={styles['hot-areas']}>
                {stateData.locations.map((location: string) => {
                  return (
                    <div
                      key={location}
                      className={styles['hot-area']}
                      onClick={() => {
                        setLocation(stateData.state + ', ' + location);

                        router.push(
                          '/groups/college/' +
                          encodeURI(stateData.state + ', ' + location)
                        );
                      }}
                    >
                      {location}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Locations;
