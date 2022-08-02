import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import Head from 'next/head'
import { useSelector } from 'react-redux';
import { AiFillDelete } from 'react-icons/ai';
import Image from 'next/image';

import { AppHeader, BackHeader } from '@components/Headers';
import SimpleButton from '@components/SimpleButton';
import CommonInput from '@components/CommonInput';
import AutoComplete from '@components/AutoComplete';
import { showConfirmModal } from '@components/ConfirmModal';
import SingleSelection from '@components/SingleSelection';
import CommonTextAreaAutoSize from '@components/CommonTextAreaAutoSize';
import ImageUpload from '@components/ImageUpload';
import { hideLoading, showLoading } from '@components/Loading';
import { showToast } from '@components/Toast';
import { user } from '@store/features/user/userSlice';
import { IGroupLoaction, IGroup } from '@types';
import { platforms as groupPlatforms, groupCategories } from '@constants';

import styles from './index.module.scss';
import { getLocationName } from '@storage/location';

interface EditPostProps {
  group: IGroup;
  isEdit?: boolean;
  onClickSave(group: any): Promise<any>;
}

const EditPost: React.FC<EditPostProps> = (props) => {
  const { group, onClickSave, isEdit } = props;
  const [groupName, setGroupName] = useState(group?.groupName);
  const [location, setLocation] = useState<IGroupLoaction>(group?.location);
  const [pfs, setPlatforms] = useState(
    group?.platforms || { platform_1: { platform: '', link: '' } }
  );
  const [platformId, setPlatformId] = useState(2);
  const [backgroundImage, setImage] = useState<string>(
    group?.background?.image
  );
  const [description, setDesc] = useState(group.description);
  const [category, setCategory] = useState(group.category);
  const [isAnonymous, setIsAnonymous] = useState(group.isAnonymous);

  const { authenticated, hasRegistered, userInfo } = useSelector(user);

  const locationName = group?.location?.state
    ? (group?.location?.locationName || group?.location?.city) +
    ', ' +
    group?.location?.state
    : getLocationName();
  const platformsPairs = Object.entries(pfs).sort((a, b) =>
    a[0] > b[0] ? -1 : 1
  );
  const platforms = platformsPairs.map(([key, value]) => ({
    ...value,
    id: key,
  }));

  useEffect(() => {
    setLocation(group.location);
  }, [group.location]);

  function upload(file) {
    showLoading();
    var storage = getStorage();
    const imageRef = ref(storage, 'posts/' + file.name);

    const uploadTask = uploadBytesResumable(imageRef, file);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
        console.log(error);
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        hideLoading();
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          setImage(downloadURL);
        });
      }
    );
  }

  function handleSave() {
    if (!groupName) {
      showToast('Please input a group name', 3000);
      return;
    }

    if (groupName?.length > 64) {
      showToast('Group name must be less than 64 characters', 3000);
      return;
    }

    for (let i = 0; i < platforms.length; i++) {
      const platform = platforms[i];
      if (!platform.link || !platform.platform || !platform.title) {
        showToast('Please complete all group links', 3000);
        return;
      }

      if (platform.title?.length > 64) {
        showToast('Link title must be less than 64 characters', 3000);
        return;
      }
    }

    if (!category) {
      showToast('Please select a category', 3000);
      return;
    }

    if (location === null || !location.state) {
      showToast('Please input location', 3000);
      return;
    }

    onClickSave({
      groupPostId: group.groupPostId,
      groupName,
      platforms: pfs,
      description,
      category,
      location: {
        city: location.city,
        state: location.state,
        locationName: location.locationName,
        type: location.type,
      },
      background: {
        image: backgroundImage,
      },
      isAnonymous,
    });
  }

  function addGroup() {
    const newPlatforms = JSON.parse(JSON.stringify(pfs));
    setPlatformId(platformId + 1);
    newPlatforms['platform_' + platformId] = {
      platform: '',
      link: '',
      title: '',
    };
    setPlatforms(newPlatforms);
  }

  return (
    <div className={styles['post-container']}>
      <Head>
        <title>Enter Details</title>
      </Head>
      <div className={styles['post-header-desktop']}>
        <AppHeader />
      </div>
      <div className={styles['post-header-mobile']}>
        <BackHeader title="Enter Details" />
      </div>
      <div className={styles['publish-form']}>
        <h2 className={styles['publish-title']}>
          {isEdit ? 'Edit post' : 'Create a post'}
        </h2>

        <div className={styles['items']}>
          <CommonInput
            value={groupName}
            autoFocus
            required
            className={styles['publish-item-gap']}
            placeholder="Enter the Group Name"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setGroupName(e.target.value);
            }}
          >
            Group Name
          </CommonInput>
          <SingleSelection
            required
            data={groupCategories}
            title="Category"
            selected={category}
            onSelect={setCategory}
            className={styles['publish-item-gap']}
            placeholder="Select a category"
          />
        </div>

        <AutoComplete
          required
          useDefaultFetchSuggestions
          value={locationName}
          onSelect={setLocation}
          className={styles['publish-item-gap']}
          placeholder="Enter your college"
        >
          College Name (Optional)
        </AutoComplete>

        <SimpleButton
          className={styles['add-new-button']}
          onClick={() => addGroup()}
        >
          Add Link
        </SimpleButton>

        {/* <SimpleButton
          className={styles['add-new-button']}
          onClick={() => addGroup(true)}
        >
          <div className={styles['link-tip']}>
            <span style={{ marginRight: '8px' }}>Add Custom Link</span>
            <AiOutlineExclamationCircle data-tip="React-tooltip" />
            <ReactTooltip place="top" type="dark" effect="float">
              <span>
                You can create a link with custom title.
              </span>
            </ReactTooltip>
          </div>
        </SimpleButton> */}

        {platforms.map((platform) => (
          <div className={styles['group']} key={platform.id}>
            <div className={styles['group-input']}>
              <button
                className={styles['group-delete']}
                onClick={() => {
                  showConfirmModal(
                    'Are you sure to delete this link?',
                    () => {
                      const newPlatforms = JSON.parse(JSON.stringify(pfs));
                      delete newPlatforms[platform.id];
                      setPlatforms(newPlatforms);
                    },
                    'Delete'
                  );
                }}
              >
                <AiFillDelete color="#F4505E" size={20} />
              </button>

              <SingleSelection
                required
                data={JSON.parse(JSON.stringify(groupPlatforms))}
                selected={platform.platform}
                onSelect={(value) => {
                  const newPlatforms = JSON.parse(JSON.stringify(pfs));
                  newPlatforms[platform.id].platform = value;
                  newPlatforms[platform.id].title = value;
                  setPlatforms(newPlatforms);
                }}
                className={`${styles['publish-item-gap']} ${styles['flex-1']}`}
                placeholder="Select a platform"
              />
              <CommonInput
                value={platform.link}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const newPlatforms = JSON.parse(JSON.stringify(pfs));
                  newPlatforms[platform.id].link = e.target.value;
                  setPlatforms(newPlatforms);
                }}
                required
                className={`${styles['publish-item-gap']} ${styles['flex-2']}`}
                placeholder="Enter the Group Link"
              >
                Group Link
              </CommonInput>
            </div>
            <div className={styles['group-input']}>
              <CommonInput
                value={platform.title}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const newPlatforms = JSON.parse(JSON.stringify(pfs));
                  newPlatforms[platform.id].title = e.target.value;
                  setPlatforms(newPlatforms);
                }}
                required
                className={`${styles['publish-item-gap']} ${styles['flex-2']}`}
                placeholder="Enter the link title"
              >
                Title
              </CommonInput>
            </div>
          </div>
        ))}

        <div className={styles['publish-item-gap']}>
          <div className={styles['image-desc']}>Image</div>
          <div className={styles['image-containers']}>
            {backgroundImage ? (
              <div className={styles['publish-image-container']}>
                <div className={styles['publish-image']}>
                  <Image src={backgroundImage} width={100} height={100} />
                </div>

                <button
                  className={styles['delete-image']}
                  onClick={() => {
                    setImage('');
                  }}
                >
                  <AiFillDelete color="#F4505E" size={20} />
                </button>
              </div>
            ) : (
              <ImageUpload
                onChange={(file) => {
                  if (file) {
                    upload(file);
                  }
                }}
              />
            )}
          </div>
        </div>

        <CommonTextAreaAutoSize
          value={description}
          focus={0}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setDesc(e.target.value);
          }}
          className={styles['publish-item-gap']}
          placeholder="Description imposes a limit of 800 characters."
          errorMessage="Description must be less than 800 characters"
        >
          Description
        </CommonTextAreaAutoSize>

        <label className={styles['checkbox']}>
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(event) => {
              setIsAnonymous(event.target.checked);
            }}
          />
          Post anonymously
        </label>
      </div>
      <div className={styles['publish-finish-area']}>
        <SimpleButton
          className={styles['publish-finish-area-button']}
          onClick={handleSave}
        >
          {isEdit ? 'Save' : 'Publish'}
        </SimpleButton>
      </div>
    </div>
  );
};

export default EditPost;
