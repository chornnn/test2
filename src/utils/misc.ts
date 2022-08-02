import Whatsapp from '@images/whatsapp-icon.png';
import Discord from '@images/discordIcon.png';
import GroupMe from '@images/groupmeIcon.png';
import TelegramIcon from '@images/telegramIcon.png';
import OtherIcon from '@images/other-icon.png';
import SlackIcon from '@images/slack-icon.png';

export const getPlatformIconSrc = (platform?: string) => {
  platform = platform?.toLowerCase() || '';
  let iconSrc = OtherIcon;

  if (platform === 'discord') {
    iconSrc = Discord;
  } else if (platform === 'groupme') {
    iconSrc = GroupMe;
  } else if (platform === 'others') {
    iconSrc = OtherIcon;
  } else if (platform === 'telegram') {
    iconSrc = TelegramIcon;
  } else if (platform === 'whatsapp') {
    iconSrc = Whatsapp;
  } else if (platform === 'slack') {
    iconSrc = SlackIcon;
  }
  return iconSrc;
};

export const formatLocation = (location) => {
  const formatted =
    location.state +
    ', ' +
    location.city +
    ', ' +
    (location.locationName || '');
  return formatted;
};
