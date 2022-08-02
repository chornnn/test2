import { getFunctions, httpsCallable } from 'firebase/functions';
import { getDataFromCloudFunctionByName } from '../../../firebase';
// import { refreshInputData } from "./postSlice";

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
  createGroupPost = 'createGroupPost',
  listGroupPosts = 'listGroupPosts',
  followUser = 'followUser',
  unfollowUser = 'unfollowUser',
  getFollowings = 'getFollowings',
  getFollowers = 'getFollowers',
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
