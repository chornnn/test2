import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  FacebookAuthProvider,
  browserSessionPersistence,
  Persistence,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';

import { getDataFromCloudFunctionByName } from '../../../firebase';
import { push } from '../../../utils';
import { changeUserInfo } from './userSlice';
import { Ilocation } from '../post/postSlice';

enum userCloudFuntionName {
  checkUserRegistration = 'checkUserRegistration',
  createUser = 'createUser',
  getUser = 'getUser',
  updateUser = 'updateUser',
  checkIfUserSocialIdAvailable = 'checkIfUserSocialIdAvailable',
  getRandomUserId = 'getRandomUserId',
}

export interface ICreateUser {
  uid: string;
  firstName: string;
  lastName: string;
  logInMethod?: loginMethod;
  avatarUrl: string;
  interests: string[];

  bio: string;
  email?: string;
  location?: Ilocation;
}

export enum loginMethod {
  Phone = 'phone',
  Gmail = 'gmail',
  Facebook = 'facebook',
}

interface IResponseData {
  data: IResponseDataProps;
}

interface IResponseDataProps {
  code: string;
  hasRegistered: boolean;
}

export const signInWithFacebookByFireBase = async (dispatch) => {
  const provider = new FacebookAuthProvider();

  provider.setCustomParameters({
    display: 'popup',
  });

  const auth = getAuth();
  // auth.setPersistence(browserLocalPersistence)
  const result = await signInWithPopup(auth, provider)
    .then((result) => {
      // The signed-in user info.
      // const user = result.user;

      return result;
      // console.log(user);
      // user.uid
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      // const credential = FacebookAuthProvider.credentialFromResult(result);
      // const accessToken = credential.accessToken;
      // const regist = await checkRegistered()

      // // 注册用户流程
      // return registered(regist, user.uid, loginMethod.Facebook, dispatch, user.email);
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      console.log(error);

      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = FacebookAuthProvider.credentialFromError(error);

      // ...
    });

  // return result;
};

/**
 * 去google页面验证登陆
 * @returns
 */
export const signInWithGoogleByFireBase = () => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  return signInWithPopup(auth, provider);
};

export const signInWithEmailAndPasswordByFireBase = (email, password) => {
  const auth = getAuth();

  return signInWithEmailAndPassword(auth, email, password);
};

export const createUserWithEmailAndPasswordByFireBase = (email, password) => {
  const auth = getAuth();

  return createUserWithEmailAndPassword(auth, email, password);
};

/**
 * all locations
 * @returns
 */
export const getUserInfo = (uid: string) => {
  const functions = getFunctions();
  const callableReturnMessage = httpsCallable(
    functions,
    userCloudFuntionName.getUser
  );

  return callableReturnMessage({ uid: uid });
};

export const getUserInfoBySocialId = (userSocialId: string) => {
  const functions = getFunctions();
  const callableReturnMessage = httpsCallable(
    functions,
    userCloudFuntionName.getUser
  );

  return callableReturnMessage({ userSocialId });
};

/**
 * all locations
 * @returns
 */
export const checkRegistered = () => {
  const functions = getFunctions();
  const callableReturnMessage = httpsCallable(
    functions,
    userCloudFuntionName.checkUserRegistration
  );

  return callableReturnMessage();
};

export const updateUserCloudFunction = (myCreateUser: ICreateUser) => {
  const functions = getFunctions();
  const callableReturnMessage = httpsCallable(
    functions,
    userCloudFuntionName.updateUser
  );

  return callableReturnMessage(myCreateUser);
};

export const createUserCloudFunction = (myCreateUser: ICreateUser) => {
  const functions = getFunctions();
  const callableReturnMessage = httpsCallable(
    functions,
    userCloudFuntionName.createUser
  );

  return callableReturnMessage(myCreateUser);
};

export const getSchools = async () => {
  const functions = getFunctions();
  const callableReturnMessage = httpsCallable(functions, 'getSchools');

  callableReturnMessage().then((datas) => {
    console.log(datas);
  });
};

export const checkIfUserSocialIdAvailable = (userId: string) => {
  const functions = getFunctions();
  const callableReturnMessage = httpsCallable(
    functions,
    userCloudFuntionName.checkIfUserSocialIdAvailable
  );

  return callableReturnMessage(userId);
};

export const getRandomUserId = (userId: string) => {
  const functions = getFunctions();
  const callableReturnMessage = httpsCallable(
    functions,
    userCloudFuntionName.getRandomUserId
  );

  return callableReturnMessage(userId);
};
