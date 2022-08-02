import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { FaMapMarkerAlt } from 'react-icons/fa';

import { AppHeader } from '@components/Headers';
import SaveButton from '@components/Save';
import ShareButton from '@components/Share';
import { showShareModal } from '@components/ShareModal';
import Footer from '@components/Footer';
import { showToast } from '@components/Toast';
import { hideLoading, showLoading } from '@components/Loading';
import PlatformIconButton from '@components/PlatformIconButton';
import {
  deleteGroupPost,
  getGroupPost,
  postDetail,
} from '@store/features/postDetail/postDetailSlice';
import { user, getUser } from '@store/features/user/userSlice';
import { viewPostRequest, getAllPostIds } from '@store/features/post/request';
import { wrapper } from '@store/index';
import { getPlatformIconSrc } from '@utils/misc';
import { getUserId } from '@storage/user';
import { getOrigin, removeOrigin } from '@storage/redirect';
import { IGroup } from '@types';
import { defaultAvatar } from '@constants';

import styles from './post.module.scss';

// restore social action git commit hash 33d527634f61b53e9360133430a6220098802980

export async function getStaticPaths() {
  // const res = await getAllPostIds();
  // const ids = res['data']?.data;

  const ids = [];
  const paths = ids.map((id) => ({
    params: { id },
  }));

  return { paths, fallback: 'blocking' };
}

export const getStaticProps = wrapper.getStaticProps(
  (store) =>
    async ({ params }) => {
      const id = params.id as string;
      await Promise.all([getGroupPost(id, store.dispatch)]);
      return { props: {}, revalidate: 1 };
    }
);

const PostDetail: React.FC = (props) => {
  const router = useRouter();
  const { group: agroup } = useSelector(postDetail);
  const group = agroup as IGroup;
  const { authenticated } = useSelector(user);
  const dispatch = useDispatch();

  const [iconSrc, setIconSrc] = useState(getPlatformIconSrc(group.platform));
  const [refreshCounter, setRefreshCounter] = useState(0);

  const location =
    group.location?.state === 'World Wide'
      ? 'World Wide'
      : (group.location?.locationName || group.location?.city) +
        ', ' +
        group.location?.state;
  const platformsPairs = Object.entries(group.platforms).sort();
  const platforms = platformsPairs.map(([key, value]) => ({
    ...value,
    id: key,
  }));
  const socialPlatforms = platforms.filter(
    (p) => p.platform !== 'Website' && p.platform !== 'Others'
  );
  const customPlatforms = platforms.filter(
    (p) => p.platform === 'Website' || p.platform === 'Others'
  );

  const clicks = platforms.reduce((acc, cur) => acc + (cur.numViews ?? 0), 0);

  useEffect(() => {
    console.log(group.description);
    init();
    const origin = getOrigin();
    viewPostRequest(router.query?.id as string, origin);
    removeOrigin();
    return () => {
      hideLoading();
    };
  }, [router.query.id]);

  useEffect(() => {
    setTimeout(() => {
      getGroupPost(group.groupPostId, dispatch);
    }, 500);
  }, [refreshCounter]);

  useEffect(() => {
    if (group.numViews == '0') {
      showShareModal(
        group,
        'New Group added!',
        'Do you want to share it to your friends?'
      );
    }
  }, []);

  const init = async () => {
    await getUser(dispatch);
    hideLoading();
  };

  useEffect(() => {
    const iconSrc = getPlatformIconSrc(group.platform);
    setIconSrc(iconSrc);
  }, [group]);

  const removePost = async () => {
    showLoading();
    const result = await deleteGroupPost(group.groupPostId);
    hideLoading();
    if (result == 'success') {
      router.back();
    } else {
      showToast(
        'There is an error deleting your post. Please try it later.',
        3000
      );
    }
  };

  const title = `${group.groupName} | ${location}`;

  return (
    <div className={styles['post-wrapper']}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={group.description} />
        <meta itemProp="description" content={group.description} />
        <meta property="og:description" content={group.description} />
        <meta name="twitter:description" content={group.description} />
        <meta itemProp="name" content={title} />
        <meta property="og:title" content={title} />
        <meta property="og:site_name" content={title} />
        <meta name="twitter:title" content={title} />
      </Head>

      {authenticated && (
        <AppHeader
          removePost={removePost}
          showCreatePost={group.postOwnerId !== getUserId()}
          showEditPost={
            group.postOwnerId === getUserId() ||
            getUserId() == 'qWjUphs572XwNjP4AhZ2hF5awR02'
          }
          isStaticPosition
        />
      )}

      {group.postOwnerId === getUserId() && (
        <span className={styles['post-analytics']}>
          <h5>Analytics:</h5>
          <i className={styles['post-analytics-dot1']} />
          <span>Views: {group.numViews} </span>
          <i className={styles['post-analytics-dot2']} />
          <span>Clicks: {clicks}</span>
        </span>
      )}

      <div className={styles['post-detail-container']}>
        <div className={styles['post-detail-image']}>
          <Image
            src={group?.background?.image || defaultAvatar}
            layout="fill"
            objectFit="cover"
            alt={title}
          />
        </div>

        <h1 className={styles['post-detail-title']}>{group.groupName}</h1>

        <div className={styles['post-detail-label']}>{group.category}</div>

        <div className={styles['post-metadata']}>
          {location && (
            <Link hreflang="en"
              href={`/groups${
                group?.location.objectID === undefined
                  ? ''
                  : `/college/${group?.location.objectID}`
              }`}
            >
              <a>
                <h2 className={styles['post-location']}>
                  <div className={styles['pin-image']}>
                    <FaMapMarkerAlt />
                  </div>
                  {location}
                </h2>
              </a>
            </Link>
          )}

          <div className={styles['post-actions']}>
            <SaveButton group={group} />
            <ShareButton group={group} />
          </div>
        </div>

        <div className={styles['post-detail-content']}>{group.description}</div>

        {/* <div className={styles['post-detail-images-area']}>
          {group.images &&
            group.images.length > 0 &&
            group.images.map((str, index) => {
              return (
                <div className={styles['post-detail-image']} key={index}>
                  <Image src={str} key={uuidv4()} width={105} height={105} />
                </div>
              );
            })}
        </div> */}

        <div className={styles['join-area']}>
          <div className={styles['posts-link-buttons']}>
            {socialPlatforms.map((platform, index) => (
              <PlatformIconButton
                key={index}
                platform={platform}
                groupPostId={group.groupPostId}
                source="groups"
                postOwnerUserSocialId={group.postOwnerUserSocialId}
              />
            ))}
          </div>
          {customPlatforms.map((platform, index) => (
            <PlatformIconButton
              fullWidth
              key={index}
              groupPostId={group.groupPostId}
              platform={platform}
              source="group"
              postOwnerUserSocialId={group.postOwnerUserSocialId}
            />
          ))}
        </div>
      </div>

      {!authenticated && <Footer />}
    </div>
  );
};

export default PostDetail;
