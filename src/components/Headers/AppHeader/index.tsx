import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { CSSTransition } from 'react-transition-group';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import {
  BiEditAlt,
  BiPlus,
  BiUser,
  BiLogOut,
  BiTrash,
  BiX,
  BiCaretDown,
} from 'react-icons/bi';
import { FaDiscord } from 'react-icons/fa';

import logoUrl from '@images/logo-group.png';
import SearchInput from '@components/SearchInput';
import { hiddenToast, showToast } from '@components/Toast';
import { hideLoading, showLoading } from '@components/Loading';
import { showConfirmModal } from '@components/ConfirmModal';
import UserInfo from '@components/UserInfo';
import SidePanel from '@components/SidePanel';
import { signOutRe, user } from '@store/features/user/userSlice';
import { getLocation, getLocationObject } from '@storage/location';
import { setRedirect } from '@storage/redirect';
import { useWindowSize } from '@hooks';
import { logEvent } from '@firebase';

import styles from './index.module.scss';

interface AppHeaderProps {
  className?: string;
  isStaticPosition?: boolean;
  showCreatePost?: boolean;
  showEditPost?: boolean;
  showLogin?: boolean;
  showLocation?: boolean;
  showSearch?: boolean;
  searchValue?: string;
  searchAutoFocus?: boolean;
  onSearchChange?: (value: string) => void;
  noBorder?: boolean;
  location?: string;
  removePost?(): void;
}

const Header: React.FC<AppHeaderProps> = (props) => {
  const {
    className,
    isStaticPosition,
    noBorder = false,
    showCreatePost = false,
    showEditPost = false,
    showLogin = true,
    showLocation = true,
    showSearch = false,
    searchValue = '',
    searchAutoFocus,
    onSearchChange,
    location = '',
    removePost,
  } = props;
  const [showPanel, setShowPanel] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [locationName, setLocationName] = useState('');

  const { isDesktop } = useWindowSize();
  const { authenticated, userInfo } = useSelector(user);
  const router = useRouter();
  const dispatch = useDispatch();

  const timeout = { enter: 200, exit: 400 };
  const headerContainerClass = classNames(styles['header-container'], {
    [styles['header-container--static']]: isStaticPosition,
  });
  const classes = classNames(styles['app-header'], className, {
    [styles['no-border']]: noBorder,
  });
  const pathname =
    typeof window !== 'undefined' ? window?.location?.pathname : '';
  const locationObj = getLocationObject();

  const goHome = () => {
    router.push('/');
  };

  const logoutHandler = async () => {
    setShowPanel(false);
    showLoading();
    try {
      await signOutRe(dispatch).then(() => {
        router.push('/');
      });
    } catch (error) {
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    if (showPanel) {
      document.body.style.overflow = 'hidden';
    }
    document.addEventListener('click', (e) => {
      setShowDropdown(false);
    });
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showPanel]);

  useEffect(() => {
    let Name = 'World Wide';

    if (locationObj.state !== 'World Wide') {
      Name =
        (location && location?.replaceAll('-', ' ')) ||
        (locationObj.state
          ? (locationObj.locationName || locationObj.city) +
          ', ' +
          locationObj.state
          : '');
    }
    setLocationName(Name);

  }, [location]);

  return (
    <nav className={headerContainerClass}>
      <div className={classes}>
        <div className={styles['logo-img']}>
          <Image src={logoUrl} onClick={goHome} alt="Logo" />
        </div>
        <div className={styles['logo-title']} onClick={goHome}>
          Grouphub
        </div>
        <div className={styles['middle-area']}>
          {showLocation && (
            <div className={styles['posts-locations']}>
              <div className={styles['posts-locations-title']}>
                {locationName}
              </div>
              <div
                className={styles['posts-locations-button']}
                onClick={() => {
                  router.push('/');
                }}
              >
                {locationName ? '[change]' : '[select college]'}
              </div>
            </div>
          )}
          {showSearch && (
            <div className={styles['search-input']}>
              <SearchInput
                value={searchValue}
                autoFocus={searchAutoFocus}
                onFocus={() => {
                  if (!onSearchChange) {
                    router.push('/search');
                  }
                }}
                onChange={(event) => {
                  if (onSearchChange) onSearchChange(event.target.value);
                }}
                onCancel={() => {
                  router.back();
                }}
                onClear={() => onSearchChange('')}
              />
            </div>
          )}
        </div>
        <div className={styles['right-area']}>

          {/* <a
            className={styles['discord-link']}
            href="https://discord.gg/h5hdGM3w2d"
            target="_blank"
          >

            <span className={styles['discord-link-text']}>Discord</span>
            <span className={styles['discord-link-icon']}>
              <FaDiscord color="#551a8b" size={32} />
            </span>
          </a> */}

          {showCreatePost && (
            <div
              className={styles['write-posts']}
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
              <div className={styles['write-icon']}>
                <BiPlus />
              </div>
              <div className={styles['write-text']}>Add Group</div>
            </div>
          )}

          {showEditPost && (
            <>
              <div
                className={styles['write-posts']}
                onClick={(e) => {
                  e.stopPropagation();
                  router.push('/group/edit');
                }}
              >
                <div className={styles['write-icon']}>
                  <BiEditAlt />
                </div>
                <div className={styles['write-text']}>Edit</div>
              </div>
              <div
                className={styles['delete-icon']}
                onClick={() => {
                  if (removePost) {
                    showConfirmModal(
                      'Are you sure to delete this post?',
                      removePost,
                      'Delete'
                    );
                  }
                }}
              >
                <BiTrash color="#ffffff" size={18} />
              </div>
            </>
          )}

          {!authenticated && showLogin && (
            <Link hreflang="en" href={`/login`} passHref>
              <a
                className={styles['main-sign-in']}
                onClick={() => setRedirect(pathname)}
              >
                Log in
              </a>
            </Link>
          )}

          {authenticated && showLogin && userInfo.avatarUrl && (
            <>
              <div
                className={styles['avatar']}
                onClick={() => {
                  if (isDesktop) {
                    router.push(`/user/${userInfo.userSocialId}`);
                  } else {
                    setShowPanel(true);
                  }
                }}
              >
                <Image
                  src={userInfo.avatarUrl}
                  layout="fill"
                  objectFit="cover"
                  alt="default image"
                />
              </div>
              <div
                className={styles['dropdown-arrow']}
                onClick={(event) => {
                  event.stopPropagation();
                  setShowDropdown(!showDropdown);
                }}
              >
                <BiCaretDown />
              </div>
            </>
          )}
        </div>
      </div>

      <CSSTransition
        in={showPanel}
        timeout={timeout}
        classNames={{
          enter: styles['pageSlider-enter'],
          enterActive: styles['pageSlider-enter-active'],
          enterDone: styles['pageSlider-enter-done'],
          eixt: styles['pageSlider-exit'],
          exitActive: styles['pageSlider-exit-active'],
          exitDone: styles['pageSlider-exit-done'],
        }}
        appear
        unmountOnExit
      >
        <SidePanel
          className={styles['side-panel-container']}
          onClick={() => {
            setShowPanel(false);
          }}
        >
          <div
            className={styles['side-panel']}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div
              className={styles['logout-icon']}
              onClick={() => {
                setShowPanel(false);
              }}
            >
              <BiX />
            </div>
            <UserInfo alignLeft userInfo={userInfo} />
            <div
              className={styles['view-profile']}
              onClick={() => {
                router.push(`/user/${userInfo.userSocialId}`);
              }}
            >
              <span className={styles['icon']}>
                <BiUser />
              </span>
              View Profile
            </div>
            <div
              className={styles['log-out']}
              onClick={() => {
                showConfirmModal(
                  'Are you sure you want to log out?',
                  logoutHandler,
                  'Log out'
                );
              }}
            >
              <span className={styles['icon']}>
                <BiLogOut color="#F4505E" />
              </span>
              Log out
            </div>
          </div>
        </SidePanel>
      </CSSTransition>

      {showDropdown && (
        <div className={styles['dropdown-container']}>
          <div
            className={styles['dropdown-log-out']}
            onClick={() => {
              showConfirmModal(
                'Are you sure you want to log out?',
                logoutHandler,
                'Log out'
              );
              setShowDropdown(false);
            }}
          >
            <span className={styles['icon']}>
              <BiLogOut color="#F4505E" />
            </span>
            Log out
          </div>
        </div>
      )}
    </nav>
  );
};

export const AppHeader = React.memo(Header);
