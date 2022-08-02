import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AiOutlineStar, AiFillStar } from 'react-icons/ai';

import { showToast } from '@components/Toast';
import { user } from '@store/features/user/userSlice';
import {
  savePostRequest,
  removeSavedPostRequest,
} from '@store/features/post/request';
import { logEvent } from '@firebase';
import { IGroup } from '@types';

import styles from './index.module.scss';

interface SaveProps {
  group: IGroup;
}

const Save: React.FC<SaveProps> = (props) => {
  const { group } = props;
  const { authenticated } = useSelector(user);
  const [saved, setSaved] = useState(group.hasSaved);

  const handleSave = (event) => {
    event.stopPropagation();

    logEvent('save_post', { post_id: group.groupPostId });

    if (!authenticated) {
      showToast('Please log in first', 3000);
      return;
    }

    if (saved) {
      removeSavedPostRequest(group.groupPostId);
      setSaved(false);
      showToast('Post removed from saved list.', 1000);
    } else {
      savePostRequest(group.groupPostId);
      setSaved(true);
      showToast('Post saved to your saved list.', 1000);
    }
  };

  useEffect(() => {
    setSaved(group.hasSaved);
  }, [group.hasSaved]);

  return (
    <button className={styles['save']} onClick={handleSave}>
      {saved ? (
        <AiFillStar size={20} color="rgb(255, 211, 92)" />
      ) : (
        <AiOutlineStar size={20} color="#333333" />
      )}
    </button>
  );
};

export default Save;
