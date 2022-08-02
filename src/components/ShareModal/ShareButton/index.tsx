import React, { useState } from 'react';
import {
  RedditShareButton,
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  RedditIcon,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
  TelegramIcon,
} from 'react-share';
import copy from 'copy-to-clipboard';
import { AiOutlineClose, AiOutlineLink } from 'react-icons/ai';
import { RiShareForwardLine } from 'react-icons/ri';
import { IoShareOutline } from 'react-icons/io5';

import { showToast } from '@components/Toast';
import { sharePostRequest } from '@store/features/post/request';
import { logEvent } from '@firebase';
import { IGroup } from '@types';

import styles from './index.module.scss';

interface ShareProps {
  group: IGroup;
  onClick?: () => void;
  displayShare?: boolean;
}

const source = 'https://grouphub.app';

const ShareButton: React.FC<ShareProps> = (props) => {
  const { group } = props;
  const [showModal, setShowModal] = useState(false);

  const url = `https://grouphub.app/group/${group.groupPostId}`;

  const copyLink = () => {
    copy(url);
    logEvent('copy_group_post', { post_id: group.groupPostId });
    sharePostRequest(group.groupPostId);
    setShowModal(false);
    showToast('Link copied to your clipboard and ready to share', 3000, true);
  };

  return (
    <div
      className={styles['share-container']}
      onClick={(event) => {
        event.stopPropagation()
      }}
    >
      <div
        className={styles['icon-button']}
        onClick={(event) => {
          event.stopPropagation();
          props.onClick();
          if (typeof navigator.share !== 'undefined') {
            navigator.share({
              title: group.groupName,
              text: group.groupName,
              url: url,
            });
          } else {
            setShowModal(true);
          }
        }}
      >
        <div className={styles['icon-button-image']}>
          {typeof navigator !== 'undefined' &&
            typeof navigator.share !== 'undefined' ? (
            <IoShareOutline size="15" color="#333333" />
          ) : (
            <RiShareForwardLine size="18" color="#333333" />
          )}
        </div>
        {/* <div className={styles['icon-button-title']}>{group.numShares}</div> */}
        &nbsp;Share
      </div>
      {showModal && (
        <div className={styles['share-modal-container']}>
          <div className={styles['share-modal-panel']}>
            <div className={styles['share-modal-panel-title']}>
              <div>Share</div>
              <div
                className={styles['close-icon']}
                onClick={() => setShowModal(false)}
              >
                <AiOutlineClose />
              </div>
            </div>

            <div className={styles['share-buttons']}>
              <div className={styles['share-button']}>
                <RedditShareButton url={url} title={group.groupName}>
                  <RedditIcon className={styles['share-button-icon']} />
                </RedditShareButton>
                <div>Reddit</div>
              </div>

              <div className={styles['share-button']}>
                <FacebookShareButton url={url} quote={group.groupName}>
                  <FacebookIcon className={styles['share-button-icon']} />
                </FacebookShareButton>
                <div>Facebook</div>
              </div>

              <div className={styles['share-button']}>
                <TwitterShareButton url={url} title={group.groupName}>
                  <TwitterIcon className={styles['share-button-icon']} />
                </TwitterShareButton>
                <div>Twitter</div>
              </div>
            </div>

            <div className={styles['share-buttons']}>
              <div className={styles['share-button']}>
                <LinkedinShareButton
                  url={url}
                  title={group.groupName}
                  source={source}
                >
                  <LinkedinIcon className={styles['share-button-icon']} />
                </LinkedinShareButton>
                <div>LinkedIn</div>
              </div>

              <div className={styles['share-button']}>
                <WhatsappShareButton url={url} title={group.groupName}>
                  <WhatsappIcon className={styles['share-button-icon']} />
                </WhatsappShareButton>
                <div>WhatsApp</div>
              </div>

              {/* <div className={styles['share-button']}>
                <TelegramShareButton url={url} title={group.groupName}>
                  <TelegramIcon className={styles['share-button-icon']} />
                </TelegramShareButton>
                <div>Telegram</div>
              </div> */}

              <div className={styles['share-button']} onClick={copyLink}>
                <AiOutlineLink
                  className={styles['share-button-icon-link']}
                  size={16}
                  color="white"
                />
                <div>Copy Link</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareButton;
