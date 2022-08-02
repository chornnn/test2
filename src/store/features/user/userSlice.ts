import {
  updateCurrentUser,
  UserCredential,
  getAuth,
  signOut,
} from '@firebase/auth';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IUserInfo } from '@types';
import { RootState } from '../..';

import {
  getAuthenticationStatus,
  getAvatar,
  getBio,
  getFirstName,
  getLastName,
  getNumFollowers,
  getNumFollowings,
  getNumPosts,
  getRegistered,
  getUserId,
  getUserSocialId,
  setAuthenticationStatus,
  setUserId,
  setUserInfo,
  userStatus,
} from '../../../storage/user';
import {
  checkRegistered,
  createUserCloudFunction,
  getUserInfo,
  getUserInfoBySocialId,
  ICreateUser,
  signInWithGoogleByFireBase,
  signInWithEmailAndPasswordByFireBase,
  createUserWithEmailAndPasswordByFireBase,
  updateUserCloudFunction,
} from './request';
interface ISignInProps {
  uid: string;
  authenticated: boolean;
}

interface IRouterChange {
  url: string;
  params: string;
}

interface IUserStateType {
  userInfo: IUserInfo;
  otherUserInfo?: IUserInfo;
  authenticated: boolean;
  hasRegistered: boolean;
  updateSuccess?: boolean;
  routerChange?: IRouterChange;
}

const initialState: IUserStateType = {
  userInfo: {
    uid: getUserId(),
    firstName: getFirstName(),
    lastName: getLastName(),
    bio: getBio(),
    avatarUrl: getAvatar(),
    userSocialId: getUserSocialId(),
    numFollowers: getNumFollowers(),
    numFollowings: getNumFollowings(),
    numPosts: getNumPosts(),
    followingUserIdList: [],
  },
  authenticated: getAuthenticationStatus(),
  hasRegistered: getRegistered(),
};

interface IResponseData {
  data: IResponseDataProps;
}

interface IResponseDataProps {
  code: string;
  hasRegistered: boolean;
}

export const updateUser = async (myCreateUser: ICreateUser, dispatch) => {
  const result = await updateUserCloudFunction(myCreateUser);

  try {
    if (result.data['code'] === 200) {
      await getUser(dispatch);
      return 'success';
    }
  } catch (error) {
    return 'fail';
  }

  return 'fail';
};

export const createUser = async (myCreateUser: ICreateUser, dispatch) => {
  const result = await createUserCloudFunction(myCreateUser);

  if (result.data['code'] === 200) {
    dispatch(
      changeUserInfo({
        uid: myCreateUser.uid,
        authenticated: true,
      })
    );
    return 'success';
  }

  return 'fail';
};

export const getUser = async (dispatch) => {
  try {
    const result = await getUserInfo(getUserId());
    const user = result.data['data'] as IUserInfo;
    dispatch(userInfo(user));
  } catch (error) {}
};

export const getOtherUser = async (userId: string, dispatch) => {
  const result = await getUserInfo(userId);
  const user = result.data['data'] as IUserInfo;
  dispatch(otherUserInfo(user));
};

export const getUserBySocialId = async (dispatch) => {
  try {
    const result = await getUserInfoBySocialId(getUserSocialId());
    const user = result.data['data'] as IUserInfo;
    dispatch(userInfo(user));
  } catch (error) {}
};

export const getOtherUserBySocialId = async (
  userSocialId: string,
  dispatch
) => {
  const result = await getUserInfoBySocialId(userSocialId);
  const user = result.data['data'] as IUserInfo;
  dispatch(otherUserInfo(user));
};

const auth = getAuth();
export function signOutRe(dispatch) {
  const signOutEvent = new Promise((resolve, reject) => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        localStorage.clear();
        sessionStorage.clear();
        dispatch(
          changeUserInfo({
            uid: '',
            authenticated: false,
          })
        );
        resolve({});
      })
      .catch((error) => {
        // An error happened.
        reject();
      });
  });
  return signOutEvent;
}

export const clearOther = (dispatch) => {
  dispatch(otherUserInfo(null));
};

export const signupByEmail = async (dispatch, email, password) => {
  const result = await createUserWithEmailAndPasswordByFireBase(
    email,
    password
  ).then((data: UserCredential) => {
    return data;
  });

  return await registered(result, dispatch);
};

export const loginByEmail = async (dispatch, email, password) => {
  const result = await signInWithEmailAndPasswordByFireBase(
    email,
    password
  ).then((data: UserCredential) => {
    return data;
  });

  return await registered(result, dispatch);
};

export const googleAuth = async (dispatch) => {
  const result = await signInWithGoogleByFireBase().then(
    (data: UserCredential) => {
      return data;
    }
  );

  return await registered(result, dispatch);
};

export const registered = async (result, dispatch) => {
  const user = result.user;
  const uid = user.uid;
  const email = user.email;
  const firstName = user.displayName?.split(' ')?.[0] || '';

  try {
    const registered = await checkRegistered().then(
      (registered: IResponseData) => {
        return registered;
      }
    );

    if (registered.data.hasRegistered) {
      dispatch(
        changeUserInfo({
          uid: uid,
          authenticated: true,
        })
      );
      let data = {
        message: 'success',
        uid: uid,
        loginMethod: 'gmail',
        email: email,
        firstName,
      };
      return data;
    } else {
      let data = {
        message: 'finish',
        uid,
        loginMethod: 'gmail',
        email,
        firstName,
      };

      return data;
    }
  } catch (error) {
    alert(error.message);
    let data = {
      message: 'error',
      uid,
      loginMethod: 'gmail',
      email,
      firstName,
    };

    return data;
  }
};

export const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    changeUserInfo: (
      state: IUserStateType,
      action: PayloadAction<ISignInProps>
    ) => {
      const payload = action.payload;
      state.userInfo.uid = payload.uid;
      state.authenticated = payload.authenticated;
      setUserId(payload.uid);

      payload.authenticated
        ? setAuthenticationStatus(userStatus.up)
        : setAuthenticationStatus(userStatus.off);
    },
    userInfo: (state: IUserStateType, action: PayloadAction<IUserInfo>) => {
      const payload = action.payload;
      state.userInfo = payload;
      setUserInfo(payload);
    },
    otherUserInfo: (
      state: IUserStateType,
      action: PayloadAction<IUserInfo>
    ) => {
      const payload = action.payload;
      state.otherUserInfo = payload;
    },
  },
  extraReducers: (builder) => {},
});

export const { changeUserInfo, userInfo, otherUserInfo } = userSlice.actions;

export const user = (state: RootState) => state.user;

export default userSlice.reducer;
