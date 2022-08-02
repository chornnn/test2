import React from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import { hideLoading, showLoading } from '@components/Loading';
import PostEditor from '@components/PostEditor';
import { updateGroupPost } from '@store/features/post/postSlice';
import { postDetail } from '@store/features/postDetail/postDetailSlice';

const EditPost: React.FC = (props) => {
  const router = useRouter();
  const { group } = useSelector(postDetail);

  hideLoading();

  async function updateGroup(data) {
    showLoading();
    const result = await updateGroupPost(data);
    if (result === 'success') {
      router.push('/group/' + group.groupPostId);
    }
    hideLoading();
  }

  return <PostEditor group={group} isEdit onClickSave={updateGroup} />;
};

export default EditPost;
