import { getFunctions, httpsCallable } from 'firebase/functions';
import { iCreatePost, iGetComments } from './postDetailSlice';

enum postDetailCloudFuntionName {
  getGroupPost = 'getGroupPost',
  getComments = 'getComments',
  postComment = 'postComment',
  deleteGroupPost = 'deleteGroupPost',
}

/**
 *getGroupPostRequest
 * @returns
 */
export const getCommentsRequest = (iGetComments: iGetComments) => {
  const functions = getFunctions();
  const callableReturnMessage = httpsCallable(
    functions,
    postDetailCloudFuntionName.getComments
  );

  return callableReturnMessage(iGetComments).catch((error) => {
    console.log(error);
  });
};

/**
 *getGroupPostRequest
 * @returns
 */
export const getGroupPostRequest = (groupId: string) => {
  const functions = getFunctions();
  const callableReturnMessage = httpsCallable(
    functions,
    postDetailCloudFuntionName.getGroupPost
  );

  return callableReturnMessage({ groupId: groupId }).catch((error) => {
    console.log(error);
  });
};

/**
 *removePostLike
 * @returns
 */
export const deleteGroupPostRequest = (groupId: string) => {
  const functions = getFunctions();
  const callableReturnMessage = httpsCallable(
    functions,
    postDetailCloudFuntionName.deleteGroupPost
  );

  return callableReturnMessage({ groupPostId: groupId }).catch((error) => {
    console.log(error);
  });
};

export const postCommentRequest = (iCreateGroup: iCreatePost) => {
  const functions = getFunctions();
  const callableReturnMessage = httpsCallable(
    functions,
    postDetailCloudFuntionName.postComment
  );

  return callableReturnMessage(iCreateGroup).catch((error) => {
    console.log(error);
  });
};
