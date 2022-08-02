import {
  FaWhatsapp,
  FaDiscord,
  FaTelegramPlane,
  FaSlack,
} from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';
import Image from 'next/image';

import groupme from '@images/groupme.png';
import styles from './index.module.scss';

interface PlatformIconProps {
  platform: string;
  count?: number;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const PlatformIcon: React.FC<PlatformIconProps> = (props) => {
  const { platform, count } = props;

  let link = platform?.toLowerCase() || '';
  let iconClass = 'others';
  switch (link) {
    case 'discord':
      iconClass = 'discord';
      break;
    case 'telegram':
      iconClass = 'telegram';
      break;
    case 'whatsapp':
      iconClass = 'whatsapp';
      break;
    case 'slack':
      iconClass = 'slack';
      break;
    case 'groupme':
      iconClass = 'groupme';
      break;
    case 'custom':
      iconClass = 'custom';
      break;
  }

  function renderIcon() {
    switch (link) {
      case 'discord':
        return <FaDiscord color="white" />;
      case 'telegram':
        return <FaTelegramPlane color="white" />;
      case 'whatsapp':
        return <FaWhatsapp color="white" />;
      case 'slack':
        return <FaSlack color="white" />;
      case 'groupme':
        return <Image src={groupme} width={15} height={15} />;
      case 'custom':
        return <span>+{count}</span>;
      default:
        return <BsThreeDots color="white" />;
    }
  }

  return (
    <div className={`${styles['icon-container']} ${styles[iconClass]}`}>
      {renderIcon()}
      {link !== 'custom' && (
        <div className={styles['icon-text']}>{capitalizeFirstLetter(link)}</div>
      )}
    </div>
  );
};

export default PlatformIcon;
