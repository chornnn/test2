export interface IGroupLoaction {
  lat?: number;
  lon?: number;
  locationName?: string;
  objectID?: string;
  city?: string;
  state?: string;
  type?: string;
}

export interface IPlatform {
  platform: string;
  link: string;
  isCustom?: boolean;
  title?: string;
  id?: string;
  numViews?: number;
}

export interface IGroup {
  postOwnerId?: string;
  postOwnerName?: string;
  groupPostId?: string;
  creationTime?: string;
  numComments?: string;
  groupName?: string;
  platformLink?: string;
  platform?: string;
  platforms?: {
    [key: string]: IPlatform;
  };
  isActive?: boolean;
  description?: string;
  numViews?: string;
  numShares?: string;
  numSaves?: string;
  category?: string;
  state?: string;
  school?: string;
  hasDisliked?: boolean;
  hasLiked?: boolean;
  numLikes?: string;
  numDislikes?: string;
  images?: string[];
  postOwnerAvatarUrl?: string;
  postOwnerUserSocialId?: string;
  isFollowingPostOwner?: boolean;
  location?: IGroupLoaction;
  followRequest?: boolean;
  likeRequest?: boolean;
  disLikeRequest?: boolean;
  hasSaved?: boolean;
  background?: {
    image?: string;
  };
  isAnonymous?: boolean;
}

export interface IUserInfo {
  uid?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  bio?: string;
  userSocialId?: string;
  userName?: string;
  numFollowers?: string;
  numFollowings?: string;
  numPosts?: string;
  followingUserIdList?: string[];
  location?: IGroupLoaction;
  interests?: string[];
}

export interface Selection {
  title: string;
  selected: boolean;
}
