import React, { useState, useEffect, useRef, ChangeEvent } from 'react';

import { AppHeader, BackHeader } from '@components/Headers';
import CommonInput from '@components/CommonInput';
import SimpleButton from '@components/SimpleButton';
import AutoComplete from '@components/AutoComplete';
import AvatarUpload from '@components/AvatarUpload';
import MultipleSelection from '@components/MultipleSelection';
import CommonTextAreaAutoSize from '@components/CommonTextAreaAutoSize';
import { showToast } from '@components/Toast';
import { hideLoading } from '@components/Loading';
import { getUserId } from '@storage/user';
import { setLocation as setLocalStorageLocation } from '@storage/location';
import { IGroupLoaction, IUserInfo } from '@types';
import { groupCategories } from '@constants';
import { formatLocation } from '@utils/misc';
import { useWindowSize } from '@hooks';

import styles from './index.module.scss';

interface IUserEditorProps {
  isEdit?: boolean;
  userInfo: IUserInfo;
  title?: string;
  onSave: (userInfo: IUserInfo) => void;
  onClose?: () => void;
  isSimpleFlow?: boolean;
}

const UserEditor: React.FC<IUserEditorProps> = (props) => {
  const { userInfo, isEdit = false, title, onSave, isSimpleFlow } = props;
  const [imageUrl, setImageUrl] = useState(userInfo.avatarUrl);
  const [emailValue, setEmailValue] = useState('');
  const [username, setUsername] = useState(userInfo.userName);
  const [location, setLocation] = useState<IGroupLoaction>(userInfo.location);
  const [bio, setBio] = useState(userInfo.bio);
  const [categories, setCategories] = useState(() => {
    const cates = groupCategories.map((c) => {
      if (userInfo.interests?.includes(c.title)) {
        c.selected = true;
      }
      return c;
    });
    return cates;
  });
  const { isDesktop } = useWindowSize();

  const locationName = userInfo.location?.state
    ? (userInfo.location?.locationName || userInfo.location?.city) +
      ', ' +
      userInfo.location?.state
    : '';

  const onSaveUserInfo = async () => {
    if (!username) {
      showToast('Please enter your username', 3000);
      return;
    }

    // if (!isSimpleFlow) {
    //   if (!location?.state) {
    //     showToast('Please select a location', 3000);
    //     return;
    //   }
    // }

    if (location) {
      setLocalStorageLocation(formatLocation(location));
    }

    const userData = {
      uid: userInfo.uid || getUserId(),
      avatarUrl: imageUrl,
      bio: bio,
      interests: categories.filter((c) => c.selected).map((c) => c.title),
      userName: username,
    } as any;
    (userData.location = location
      ? {
          city: location.city,
          state: location.state,
          locationName: location.locationName,
          type: location.type,
        }
      : null),
      onSave(userData);
  };

  useEffect(() => {
    return () => {
      setCategories(
        groupCategories.map((c) => {
          c.selected = false;
          return c;
        })
      );
      hideLoading();
    };
  }, []);

  return (
    <div className={styles['user-container']}>
      {isDesktop ? (
        <AppHeader showLogin={false} showLocation={isEdit} />
      ) : (
        <BackHeader title="Enter Details" />
      )}

      <div className={styles['desktop-header']}>
        <div className={styles['desktop-title']}>{title}</div>
      </div>

      <div className={styles['form']}>
        <AvatarUpload
          currentImage={imageUrl && imageUrl}
          onChange={setImageUrl}
          className={styles['avatar-upload']}
        />
        <div className={styles['items']}>
          <CommonInput
            value={username}
            required
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setUsername(e.target.value);
            }}
            className={styles['item-gap']}
            placeholder="Enter your name"
          >
            Name
          </CommonInput>
          <CommonInput
            value={userInfo.userSocialId}
            disabled
            onChange={(e: ChangeEvent<HTMLInputElement>) => {}}
            className={styles['item-gap']}
          >
            Username
          </CommonInput>
          {/* {!isSimpleFlow && (
            <CommonInput
              value={lastName}
              className={styles['item-gap']}
              placeholder="Enter Last Name"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setLastName(e.target.value);
              }}
            >
              Last Name
            </CommonInput>
          )} */}
        </div>
        {!isSimpleFlow && (
          <>
            {emailValue !== '' && (
              <CommonInput
                required
                disabled
                className={styles['item-gap']}
                defaultValue={emailValue}
              >
                Email
              </CommonInput>
            )}
            <AutoComplete
              useDefaultFetchSuggestions
              value={locationName}
              onSelect={setLocation}
              onClear={() => setLocation(null)}
              className={styles['item-gap']}
              placeholder="Enter your college"
            >
              College Name
            </AutoComplete>
            {/* <MultipleSelection
              title="Interests"
              data={categories}
              onSelect={setCategories}
              className={styles['item-gap']}
            />
            <CommonTextAreaAutoSize
              value={bio}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setBio(e.target.value);
              }}
              className={styles['item-gap']}
              placeholder="Introduce yourself."
              errorMessage="Bio must be less than 500 characters"
            >
              Bio (Maxium 500 Characters)
            </CommonTextAreaAutoSize> */}
            <div className={styles['finish-area']}>
              <SimpleButton
                onClick={onSaveUserInfo}
                className={styles['finish-area-button']}
              >
                {isEdit ? 'Save' : 'Finish'}
              </SimpleButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserEditor;
