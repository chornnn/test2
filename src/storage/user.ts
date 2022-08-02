import { IUserInfo } from '@types';
import { localStorage } from './util';

export enum userStatus {
  up = '1',
  off = '0',
}

export enum registCode {
  regist = '1',
}

export const getUserId = () => {
  const uid = localStorage.getItem('userId');
  if (!uid) {
    return '';
  }
  return uid;
};

export const getUserSocialId = () => {
  const userSocialId = localStorage.getItem('userSocialId');
  if (!userSocialId) {
    return '';
  }
  return userSocialId;
};

export const getNumFollowers = () => {
  const numFollowers = localStorage.getItem('numFollowers');
  if (!numFollowers) {
    return '';
  }
  return numFollowers;
};

export const getNumFollowings = () => {
  const numFollowings = localStorage.getItem('numFollowings');
  if (!numFollowings) {
    return '';
  }
  return numFollowings;
};

export const setUserId = (uid: string) => {
  localStorage.setItem('userId', uid);
};

export const setUserInfo = (userInfo: IUserInfo) => {
  localStorage.setItem('firstName', userInfo.firstName);
  localStorage.setItem('lastName', userInfo.lastName);
  localStorage.setItem('bio', userInfo.bio);
  localStorage.setItem('avatar', userInfo.avatarUrl);
  localStorage.setItem('userSocialId', userInfo.userSocialId);
  localStorage.setItem('numFollowers', userInfo.numFollowers);
  localStorage.setItem('numFollowings', userInfo.numFollowings);
  localStorage.setItem('numPosts', userInfo.numPosts);
  localStorage.setItem('isAuthenticated', userStatus.up);
};
export const getNumPosts = () => {
  const numPosts = localStorage.getItem('numPosts');

  if (!numPosts) {
    return '0';
  }

  return numPosts;
};

export const getBio = () => {
  const bio = localStorage.getItem('bio');

  if (!bio) {
    return '';
  }

  return bio;
};

export const getAvatar = () => {
  const avatar = localStorage.getItem('avatar');

  if (!avatar) {
    return '';
  }

  return avatar;
};

export const getLastName = () => {
  const lastName = localStorage.getItem('lastName');

  if (!lastName) {
    return '';
  }

  return lastName;
};

export const getFirstName = () => {
  const firstName = localStorage.getItem('firstName');
  if (!firstName) {
    return '';
  }
  return firstName;
};

export const getAuthenticationStatus = () => {
  const status = localStorage.getItem('isAuthenticated');

  if (status === userStatus.up) {
    return true;
  }
  return false;
};

export const setAuthenticationStatus = (status: userStatus) => {
  localStorage.setItem('isAuthenticated', status);
};

export const setRegistered = (status: registCode) => {
  localStorage.setItem('hasRegistered', status);
};

export const getRegistered = () => {
  const code = localStorage.getItem('hasRegistered');
  if (code === registCode.regist) {
    return true;
  }
  return false;
};
