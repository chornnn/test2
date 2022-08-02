import { CgWebsite } from 'react-icons/cg';
import { BsThreeDots } from 'react-icons/bs';
import { SocialIcon } from 'react-social-icons';

import { logEvent } from '@firebase';
import { IPlatform } from '@types';
import { viewLink } from '@store/features/post/request';

import styles from './index.module.scss';

interface PlatformIconProps {
  platform: IPlatform;
  groupPostId: string;
  postOwnerUserSocialId: string;
  fullWidth?: boolean;
  source?: string;
}

const PlatformIcon: React.FC<PlatformIconProps> = (props) => {
  const { platform, fullWidth, source, groupPostId } = props;

  const link = platform.platform.toLowerCase() || '';

  function handleClick(event) {
    event.stopPropagation();

    viewLink({
      postId: groupPostId,
      linkId: platform.id,
    });

    let finalLink;
    if (
      platform.link.indexOf('http://') >= 0 ||
      platform.link.indexOf('https://') >= 0
    ) {
      finalLink = platform.link;
    } else {
      finalLink = 'http://' + platform.link;
    }
    logEvent('join_group_post', {
      post_id: groupPostId,
      link_id: platform.link,
      source,
    });
    window.open(finalLink);
  }

  function renderIcon(isSmall?: boolean) {
    const size = isSmall ? '24px' : '32px';
    const svgSize = isSmall ? '10px' : '16px';

    let icon;

    switch (link) {
      case 'website':
      case 'others':
        // icon = (
        //   <div className={styles['icon']}>
        //     <CgWebsite color="white" size={svgSize} />
        //   </div>
        // );
        icon = null;
        break;
      default:
        icon = (
          <SocialIcon
            network={link}
            style={{ width: size, height: size }}
            fgColor="#fff"
          />
        );
        break;
    }

    return icon;
  }

  return (
    <div className={styles['icon-container']} onClick={handleClick}>
      {fullWidth ? (
        <div className={styles['icon-container-full-width']}>
          <div className={styles['icon-full-width']}>{renderIcon(true)}</div>
          <div className={styles['icon-text']}>
            {platform.title || platform.platform}
          </div>
        </div>
      ) : (
        renderIcon()
      )}
    </div>
  );
};

export default PlatformIcon;
