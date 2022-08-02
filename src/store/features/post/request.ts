import { getFunctions, httpsCallable } from 'firebase/functions';
import { getDataFromCloudFunctionByName } from '../../../firebase';
import { refreshInputData } from './postSlice';
import { IGroup } from '@types';

const NormalErrorStatus = 400;
const NormalErrorStatus_MESSAGE = 'error';

export interface ICreateGroup {
  groupName: string;
  platformLink: string;
  platform: string;
  description?: string;
  state?: string;
  school?: string;
  category?: string;
}

enum postCloudFuntionName {
  updateGroupPost = 'updateGroupPost',
  createGroupPost = 'createGroupPost',
  listGroupPosts = 'listGroupPosts',
  getUserPosts = 'getUserPosts',
  followUser = 'followUser',
  unfollowUser = 'unfollowUser',
  getFollowings = 'getFollowings',
  getFollowers = 'getFollowers',
  reverseGeocoding = 'reverseGeocoding',
  likePost = 'likePost',
  sharePost = 'sharePost',
  removePostLike = 'removePostLike',
  removePostDislike = 'removePostDislike',
  dislikePost = 'dislikePost',
  getFollowingPosts = 'getFollowingPosts',
  viewPost = 'viewPost',
  savePost = 'savePost',
  getSavedPosts = 'getSavedPosts',
  removeSavedPost = 'removeSavedPost',
  getAllPostIds = 'getAllPostIds',
  viewLink = 'viewLink',
  getPostsByPage = 'getPostsByPage',
}

export interface IfollowUser {
  userIdToFollow: string;
}

export interface IunfollowUser {
  userIdToUnfollow: string;
}

export interface Ifollowers {
  uid: string;
  userIdStartAfter?: string;
}

export interface IPagination {
  locationId: string,
  page: number,
}
/**
 *
 * @returns
 */
export const getFollowingPostsRequest = (inputData: refreshInputData) => {
  const functions = getFunctions();
  const callableReturnMessage = httpsCallable(
    functions,
    postCloudFuntionName.getFollowingPosts
  );

  return callableReturnMessage(inputData).catch((error) => {
    console.log(error);
  });
};

export const likePostRequest = (postId: string) => {
  const functions = getFunctions();

  const callableReturnMessage = httpsCallable(
    functions,
    postCloudFuntionName.likePost
  );

  return callableReturnMessage({ postId: postId }).catch((error) => {
    console.log(error);
  });
};

export const sharePostRequest = (postId: string) => {
  const functions = getFunctions();

  const callableReturnMessage = httpsCallable(
    functions,
    postCloudFuntionName.sharePost
  );

  return callableReturnMessage({ postId: postId }).catch((error) => {
    console.log(error);
  });
};

export const viewPostRequest = async (postId: string, origin?: string) => {
  const functions = getFunctions();

  const callableReturnMessage = httpsCallable(
    functions,
    postCloudFuntionName.viewPost
  );

  return callableReturnMessage({ postId, origin }).catch((error) => {
    console.log(error);
  });
};

export const removeLikePostRequest = (postId: string) => {
  const functions = getFunctions();

  const callableReturnMessage = httpsCallable(
    functions,
    postCloudFuntionName.removePostLike
  );

  return callableReturnMessage({ postId: postId }).catch((error) => {
    console.log(error);
  });
};

export const dislikePostRequest = (postId: string) => {
  const functions = getFunctions();

  const callableReturnMessage = httpsCallable(
    functions,
    postCloudFuntionName.dislikePost
  );

  return callableReturnMessage({ postId: postId }).catch((error) => {
    console.log(error);
  });
};

export const removeDislikePostRequest = (postId: string) => {
  const functions = getFunctions();

  const callableReturnMessage = httpsCallable(
    functions,
    postCloudFuntionName.removePostDislike
  );

  return callableReturnMessage({ postId: postId }).catch((error) => {
    console.log(error);
  });
};

export const getFollowersRequest = (ifollowers: Ifollowers) => {
  const functions = getFunctions();

  const callableReturnMessage = httpsCallable(
    functions,
    postCloudFuntionName.getFollowers
  );

  return callableReturnMessage(ifollowers).catch((error) => {
    console.log(error);
  });
};

export const getFollowingsRequest = (ifollowers: Ifollowers) => {
  const functions = getFunctions();
  const callableReturnMessage = httpsCallable(
    functions,
    postCloudFuntionName.getFollowings
  );

  return callableReturnMessage(ifollowers).catch((error) => {
    console.log(error);
  });
};

/**
 *
 * @returns
 */
export const followUserRequest = (iflollowUser: IfollowUser) => {
  const functions = getFunctions();
  const callableReturnMessage = httpsCallable(
    functions,
    postCloudFuntionName.followUser
  );

  return callableReturnMessage(iflollowUser).catch((error) => {
    console.log(error);
  });
};

export interface ILocation {
  latitude: number;
  longitude: number;
}

/**
 *
 * @returns
 */
export const reverseGeocodingRequest = (location: ILocation) => {
  const functions = getFunctions();
  const callableReturnMessage = httpsCallable(
    functions,
    postCloudFuntionName.reverseGeocoding
  );

  return callableReturnMessage(location).catch((error) => {
    console.log(error);
  });
};

/**
 *
 * @returns
 */
export const unfollowUserRequest = (iunfollowUser: IunfollowUser) => {
  const functions = getFunctions();
  const callableReturnMessage = httpsCallable(
    functions,
    postCloudFuntionName.unfollowUser
  );

  return callableReturnMessage(iunfollowUser).catch((error) => {
    console.log(error);
    return {
      data: {
        code: NormalErrorStatus,
        message: NormalErrorStatus_MESSAGE,
      },
    };
  });
};

interface IResult {
  data: {
    code: number;
    data: unknown;
  };
}

export interface refreshUserInputData {
  state?: string;
  school?: string;
  orderBy?: string;
  postIdStartAfter?: string;
  accumulatedPopularityAfter?: string;
  dailyPopularityAfter?: string;
  postOwnerId?: string;
  creationTimeAfter?: string;
}

export const getUserMoreListGroupPostsRequest = (
  inputData: refreshUserInputData
) => {
  const functions = getFunctions();
  const callableReturnMessage = httpsCallable(
    functions,
    postCloudFuntionName.getUserPosts
  );

  return callableReturnMessage(inputData).catch((error) => {
    console.log(error);
  });
};

/**
 *
 * @returns
 */
export const getMoreListGroupPostsRequest = (inputData: refreshInputData) => {
  const functions = getFunctions();
  const callableReturnMessage = httpsCallable(
    functions,
    postCloudFuntionName.listGroupPosts
  );

  return callableReturnMessage(inputData).catch((error) => {
    // console.log(error);
    // let result: IResult;
    // result.data.code = 500;
    // // // result.data.data. = {};
    // return result
  });
};

/**
 * all locations
 * @returns
 */
export const createGroupPostRequest = (myCreateGroup: ICreateGroup) => {
  const functions = getFunctions();
  const callableReturnMessage = httpsCallable(
    functions,
    postCloudFuntionName.createGroupPost
  );

  return callableReturnMessage(myCreateGroup);
};

/**
 * all locations
 * @returns
 */
export const updateGroupPostRequest = (data: IGroup) => {
  const functions = getFunctions();
  const callableReturnMessage = httpsCallable(
    functions,
    postCloudFuntionName.updateGroupPost
  );

  return callableReturnMessage(data);
};

export const savePostRequest = (postId: string) => {
  const functions = getFunctions();

  const callableReturnMessage = httpsCallable(
    functions,
    postCloudFuntionName.savePost
  );

  return callableReturnMessage({ postId: postId }).catch((error) => {
    console.log(error);
  });
};

export const removeSavedPostRequest = (postId: string) => {
  const functions = getFunctions();

  const callableReturnMessage = httpsCallable(
    functions,
    postCloudFuntionName.removeSavedPost
  );

  return callableReturnMessage({ postId: postId }).catch((error) => {
    console.log(error);
  });
};

export const getSavedPostsRequest = (inputData: refreshUserInputData) => {
  const functions = getFunctions();
  const callableReturnMessage = httpsCallable(
    functions,
    postCloudFuntionName.getSavedPosts
  );

  return callableReturnMessage(inputData).catch((error) => {
    console.log(error);
  });
};

export const getAllPostIds = () => {
  const functions = getFunctions();

  const callableReturnMessage = httpsCallable(
    functions,
    postCloudFuntionName.getAllPostIds
  );

  return callableReturnMessage().catch((error) => {
    console.log(error);
  });
};

export const viewLink = (payload) => {
  const functions = getFunctions();

  const callableReturnMessage = httpsCallable(
    functions,
    postCloudFuntionName.viewLink
  );

  return callableReturnMessage(payload).catch((error) => {
    console.log(error);
  });
};

export const getPostsByPage = (inputData: IPagination) => {
  const functions = getFunctions();

  const callableReturnMessage = httpsCallable(
    functions,
    postCloudFuntionName.getPostsByPage
  );

  return callableReturnMessage(inputData).catch((error) => {
    console.log(error);
  });
};