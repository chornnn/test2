import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { BsKey, BsThreeDots } from 'react-icons/bs';
import { FaRegTrashAlt, FaEdit, FaMapMarkerAlt } from 'react-icons/fa';

import ShareButton from '@components/Share';
import SaveButton from '@components/Save';
import PlatformIcon from '@components/PlatformIcon';
import PlatformIconButton from '@components/PlatformIconButton';
import { showToast } from '@components/Toast';
import { hideLoading, showLoading } from '@components/Loading';
import { showConfirmModal } from '@components/ConfirmModal';
import { IGroup } from '@types';
import { getDateDiff } from '@utils/time';
import { getUserId } from '@storage/user';
import {
  getGroupPost,
  deleteGroupPost,
} from '@store/features/postDetail/postDetailSlice';
import { setOrigin } from '@storage/redirect';
import { logEvent } from '@firebase';
import { defaultGroupImage } from '@constants';

import styles from './index.module.scss';

interface BaseTextProps {
  className?: string;
  data: IGroup;
  likeRquest?: boolean;
  disLikeRequest?: boolean;
  likeRquestEvent?: (e: React.MouseEvent) => void;
  disLikeRquestEvent?: (e: React.MouseEvent) => void;
  showFollow?: boolean;
  followEvent?: () => void;
  categoryClick?: (category: string) => void;
  followRequest?: boolean;
  onEnter?: () => void;
}

const Card: React.FC<BaseTextProps> = (props) => {
  const { categoryClick, data, onEnter } = props;

  const [showDropdown, setShowDropdown] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const location =
    data.location?.state === 'World Wide' ? 'World Wide' :
      ((data.location?.locationName || data.location?.city) +
        ', ' +
        data.location?.state);
  const platformsPairs = Object.entries(data.platforms || {}).sort();
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

  const removePost = async () => {
    showLoading();
    const result = await deleteGroupPost(data.groupPostId);
    hideLoading();
    if (result !== 'success') {
      showToast(
        'There is an error deleting your post. Please try it later.',
        3000
      );
    } else {
      router.reload();
    }
  };

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  useEffect(() => {
    document.addEventListener('click', closeDropdown);
    return () => {
      document.removeEventListener('click', closeDropdown);
    };
  }, []);

  return (
    <Link hreflang="en" href={`/group/${data.groupPostId}`} passHref>
      <a target="_blank">
        <div
          className={styles['posts-card']}
        // onClick={() => {
        //   showLoading();
        //   setOrigin('explore');
        //   onEnter && onEnter();
        // }}
        >
          <div className={styles['posts-card-header']}>
            <div className={styles['left-section']}>
              <Image
                src={data?.background?.image || defaultGroupImage}
                layout="fill"
                objectFit="cover"
                alt={data.groupName}
              />
            </div>

            <div className={styles['mid-section']}>
              {/* <div className={styles['posts-title']}>{data.groupName}</div> */}
              <a href={`/group/${data.groupPostId}`} className={styles['posts-title']} name={`/group/${data.groupPostId}`} ></a>
              <div className={styles['post-labels']}>
                <div
                  className={styles['post-label']}
                  onClick={(event) => {
                    if (categoryClick) {
                      categoryClick(data.category);
                    }
                    event.stopPropagation();
                    event.preventDefault();
                  }}
                >
                  {data.category}
                </div>
              </div>
            </div>

            <div className={styles['right-section']}>
              {data.postOwnerId === getUserId() && (
                <div
                  className={styles['dropdown']}
                  onClick={(event) => {
                    setShowDropdown(!showDropdown);
                    event.stopPropagation();
                    event.preventDefault();
                  }}
                >
                  <BsThreeDots />
                  {showDropdown && (
                    <div className={styles['dropdown-content']}>
                      <div
                        className={styles['dropdown-item']}
                        onClick={async (event) => {
                          await getGroupPost(data.groupPostId, dispatch);
                          router.push('/group/edit');
                          event.stopPropagation();
                          event.preventDefault();
                        }}
                      >
                        <div className={styles['dropdown-icon']}>
                          <FaEdit />
                        </div>
                        <div className={styles['dropdown-text']}>Edit</div>
                      </div>
                      <div
                        className={styles['dropdown-item']}
                        onClick={(event) => {
                          showConfirmModal(
                            'Are you sure to delete this post?',
                            removePost,
                            'Delete'
                          );
                          event.stopPropagation();
                          event.preventDefault();
                        }}
                      >
                        <div className={styles['dropdown-icon']}>
                          <FaRegTrashAlt color="#F4505E" />
                        </div>
                        <div className={styles['dropdown-text-delete']}>Delete</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className={styles['posts-description']}>{data.description}</div>

          {location && (
            <div className={styles['posts-location']}>
              <div className={styles['pin-image']}>
                <FaMapMarkerAlt />
              </div>
              {location}
            </div>
          )}

          <div className={styles['post-owner-info']}>
            {/* <div className={styles['post-desc-image']}>
          <Image
            src={data.postOwnerAvatarUrl || defaultAvatar}
            layout="fill"
            objectFit="cover"
            onClick={(e) => {
              e.stopPropagation();
              router.push('/user/' + data.postOwnerUserSocialId);
            }}
          />
        </div> */}
            <div
              className={styles['post-desc-user']}
              onClick={(event) => {
                if (!data.isAnonymous) {
                  router.push('/user/' + data.postOwnerUserSocialId);
                  event.stopPropagation();
                  event.preventDefault();
                }
              }}
            >
              {data.isAnonymous ? 'Anonymous user' : data.postOwnerUserSocialId} •{' '}
              {getDateDiff(data.creationTime)}
            </div>
          </div>

          <div className={styles['posts-actions']}>
            <div className={styles['posts-link-buttons']}>
              {socialPlatforms.map((platform, index) => (
                <PlatformIconButton
                  key={index}
                  platform={platform}
                  groupPostId={data.groupPostId}
                  source="groups"
                  postOwnerUserSocialId={data.postOwnerUserSocialId}
                />
              ))}
              {customPlatforms.length > 0 && (
                <PlatformIcon platform="custom" count={customPlatforms.length} />
              )}
            </div>

            <div className={styles['posts-action-buttons']}>
              <SaveButton group={data} />

              <ShareButton group={data} />
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default React.memo(Card);
