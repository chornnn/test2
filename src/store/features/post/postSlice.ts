import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../..';
import { IGroup } from '@types';

import {
  createGroupPostRequest,
  dislikePostRequest,
  getFollowingPostsRequest,
  getMoreListGroupPostsRequest,
  likePostRequest,
  updateGroupPostRequest,
  removeLikePostRequest,
  removeDislikePostRequest,
} from './request';

export interface Ilocation {
  lat?: number;
  lon?: number;
  locationName?: string;
  city?: string;
  state?: string;
}

interface ICreateGroup {
  groupName: string;
  platformLink: string;
  platform: string;
  description?: string;
  state?: string;
  school?: string;
  category?: string;
  images?: string[];
  location?: Ilocation;
}

export interface refreshInputData {
  state?: string;
  school?: string;
  orderBy?: string;
  category?: string;
  platform?: string;
  postIdStartAfter?: string;
  creationTimeAfter?: string;
  accumulatedPopularityAfter?: string;
  dailyPopularityAfter?: string;
  location?: Ilocation;
  locationSocialId?: string;
  isGettingAll?: boolean;
}

let request = false;

export const getMoreListGroupPosts = async (
  index: number,
  inputData: refreshInputData,
  dispatch?,
  resolve?,
  reject?
) => {
  try {
    let result;
    if (index === 0) {
      result = await getMoreListGroupPostsRequest(inputData);
    } else {
      result = await getFollowingPostsRequest(inputData);
    }

    if (result['data']['code'] === 200) {
      if (
        inputData.postIdStartAfter === undefined ||
        inputData.postIdStartAfter === ''
      ) {
        dispatch(
          listGroupPosts({
            hasMore: result['data'].data.hasMore,
            datas: result['data'].data.postList,
          })
        );
      } else {
        dispatch(
          moreListGroupPosts({
            hasMore: result['data'].data.hasMore,
            datas: result['data'].data.postList,
          })
        );
      }

      if (resolve) {
        resolve();
      }
    } else {
      if (reject) {
        reject();
      }
    }
  } catch (error) {
    if (reject) {
      reject();
    }
  }

  // dispatch(listGroupPosts())
};

export const updateGroupPost = async (data: IGroup, dispatch?) => {
  const result = await updateGroupPostRequest(data).catch((error) => {
    console.log(error);
  });

  if (result['data']['code'] === 200) {
    return 'success';
  } else {
    return 'fail';
  }
};

export const createGroupPost = async (
  myCreateGroup: ICreateGroup,
  dispatch?
) => {
  const result = await createGroupPostRequest(myCreateGroup).catch((error) => {
    console.log(error);
  });

  if (result['data']['code'] === 200) {
    return {
      status: 'success',
      id: result['data'].data.groupPostId,
    };
  } else {
    return { status: 'fail' };
  }
};

export const likeRequest = async (
  postId: string,
  index: number,
  likeStatus: boolean,
  dispatch?
) => {
  if (dispatch) {
    dispatch(
      setLikeRequest({
        likeRequest: true,
        index: index,
      })
    );

    if (likeStatus) {
      await likePostRequest(postId);
    } else {
      await removeLikePostRequest(postId);
    }

    dispatch(
      setLikeStatus({
        status: likeStatus,
        index: index,
      })
    );
    dispatch(
      setLikeRequest({
        likeRequest: false,
        index: index,
      })
    );
  }
};

export const disLikeRequest = async (
  postId: string,
  index: number,
  likeStatus: boolean,
  dispatch?
) => {
  if (dispatch) {
    dispatch(
      setDisLikeRequest({
        likeRequest: true,
        index: index,
      })
    );

    if (likeStatus) {
      await dislikePostRequest(postId);
    } else {
      await removeDislikePostRequest(postId);
    }

    dispatch(
      setDisLikeStatus({
        status: likeStatus,
        index: index,
      })
    );
    dispatch(
      setDisLikeRequest({
        likeRequest: false,
        index: index,
      })
    );
  }
};

export interface IPostsGroup {
  hasMore?: boolean;
  datas?: IGroup[];
  postIdStartAfter?: string;
  creationTimeAfter?: string;
  accumulatedPopularityAfter?: string;
  dailyPopularityAfter?: string;
  createGroupPostSuccessOrNot?: boolean;
  alterGroupPostSuccessOrNot?: boolean;
  backFromPost?: boolean;
  reloadMainPage?: boolean;
  myState?: string;
  mySchool?: string;
  myCategory?: string;
  isOneLineFilter?: boolean;
  stateFilter?: IFilter;
  schoolFilter?: IFilter;
  categoryFilter?: IFilter;
  location?: string;
  likeRquest?: boolean;
}

const initialState: IPostsGroup = {
  datas: [],
  isOneLineFilter: true,
  myState: 'All State',
  mySchool: 'All School',
  myCategory: 'All Categories',
  location: '',
  stateFilter: {
    title: 'All State',
    index: 0,
    choice: false,
  },
  schoolFilter: {
    title: 'All School',
    index: 0,
    choice: false,
  },
  categoryFilter: {
    title: 'All Categories',
    index: 0,
    choice: false,
  },
};

interface IFilter {
  title?: string;
  index?: number;
  choice?: boolean;
}

interface ILikeInterface {
  likeRequest: boolean;
  index: number;
}

interface ILikeStatusInterface {
  status: boolean;
  index: number;
}

interface IStatusInterface {
  status: boolean;
  index: number;
}

export const postsSlice = createSlice({
  name: 'posts',
  initialState: initialState,
  reducers: {
    listGroupPosts: (
      state: IPostsGroup,
      action: PayloadAction<IPostsGroup>
    ) => {
      const payload = action.payload;
      state.hasMore = payload.hasMore;
      state.datas = payload.datas;
      if (payload.datas.length != 0) {
        state.postIdStartAfter =
          payload.datas[payload.datas.length - 1].groupPostId;
        state.creationTimeAfter =
          payload.datas[payload.datas.length - 1].creationTime;
        state.accumulatedPopularityAfter =
          payload.datas[payload.datas.length - 1].numViews;
        state.dailyPopularityAfter =
          payload.datas[payload.datas.length - 1].numSaves;
      }
    },

    chanegFollowRequest: (
      state: IPostsGroup,
      action: PayloadAction<IStatusInterface>
    ) => {
      const payload = action.payload;
      state.datas[payload.index].followRequest = payload.status;
    },
    changeFollowStatus: (
      state: IPostsGroup,
      action: PayloadAction<IStatusInterface>
    ) => {
      const payload = action.payload;
      state.datas[payload.index].isFollowingPostOwner = payload.status;
    },
    moreListGroupPosts: (
      state: IPostsGroup,
      action: PayloadAction<IPostsGroup>
    ) => {
      const payload = action.payload;
      state.hasMore = payload.hasMore;
      const myDatas = [...state.datas, ...payload.datas] as IGroup[];
      state.datas = myDatas;
      if (payload.datas.length != 0) {
        state.postIdStartAfter = myDatas[myDatas.length - 1].groupPostId;
        state.creationTimeAfter = myDatas[myDatas.length - 1].creationTime;
      }
    },
    updateCreateGroupPostSuccessOrNot: (
      state: IPostsGroup,
      action: PayloadAction<boolean>
    ) => {
      const payload = action.payload;
      state.createGroupPostSuccessOrNot = payload;
    },
    setDisLikeStatus: (
      state: IPostsGroup,
      action: PayloadAction<ILikeStatusInterface>
    ) => {
      const payload = action.payload;
      state.datas[payload.index].hasDisliked = payload.status;

      if (payload.status) {
        if (state.datas[payload.index].hasLiked) {
          state.datas[payload.index].hasLiked = !payload.status;
          state.datas[payload.index].numLikes = (
            parseInt(state.datas[payload.index].numLikes) - 1
          ).toString();
        }

        state.datas[payload.index].numDislikes = (
          parseInt(state.datas[payload.index].numDislikes) + 1
        ).toString();
      } else {
        state.datas[payload.index].numDislikes = (
          parseInt(state.datas[payload.index].numDislikes) - 1
        ).toString();
      }
    },
    setLikeStatus: (
      state: IPostsGroup,
      action: PayloadAction<ILikeStatusInterface>
    ) => {
      const payload = action.payload;
      state.datas[payload.index].hasLiked = payload.status;
      if (payload.status) {
        if (state.datas[payload.index].hasDisliked) {
          state.datas[payload.index].hasDisliked = !payload.status;
          state.datas[payload.index].numDislikes = (
            parseInt(state.datas[payload.index].numDislikes) - 1
          ).toString();
        }

        state.datas[payload.index].numLikes = (
          parseInt(state.datas[payload.index].numLikes) + 1
        ).toString();
      } else {
        state.datas[payload.index].numLikes = (
          parseInt(state.datas[payload.index].numLikes) - 1
        ).toString();
      }
    },
    setLikeRequest: (
      state: IPostsGroup,
      action: PayloadAction<ILikeInterface>
    ) => {
      const payload = action.payload;
      state.datas[payload.index].likeRequest = payload.likeRequest;
    },

    setDisLikeRequest: (
      state: IPostsGroup,
      action: PayloadAction<ILikeInterface>
    ) => {
      const payload = action.payload;
      state.datas[payload.index].disLikeRequest = payload.likeRequest;
    },

    setShareRequest: (
      state: IPostsGroup,
      action: PayloadAction<ILikeInterface>
    ) => {
      const payload = action.payload;
      state.datas[payload.index].disLikeRequest = payload.likeRequest;
    },

    alterCreateGroupPostSuccessOrNot: (
      state: IPostsGroup,
      action: PayloadAction<boolean>
    ) => {
      const payload = action.payload;
      state.alterGroupPostSuccessOrNot = payload;
    },

    reload: (state: IPostsGroup) => {
      state.datas = [...state.datas];
    },
    clearReload: (state: IPostsGroup) => {
      // const copyDatas = [...state.datas];
      state.datas = [];
      // state.datas = copyDatas;
    },
    setIsOneLineFilter: (
      state: IPostsGroup,
      action: PayloadAction<boolean>
    ) => {
      const payload = action.payload;
      state.isOneLineFilter = payload;
    },

    setBackFromPost: (state: IPostsGroup, action: PayloadAction<boolean>) => {
      const payload = action.payload;
      state.backFromPost = payload;
    },
    setReloadMainPage: (state: IPostsGroup, action: PayloadAction<boolean>) => {
      const payload = action.payload;
      state.reloadMainPage = payload;
    },

    stateChange: (state: IPostsGroup, action: PayloadAction<string>) => {
      const payload = action.payload;
      state.myState = payload;
    },
    locationChange: (state: IPostsGroup, action: PayloadAction<string>) => {
      const payload = action.payload;
      state.location = payload;
    },
    // changeLikeRequest: (state: IPostsGroup,action:PayloadAction<B>)
    stateFilterChange: (state: IPostsGroup, action: PayloadAction<IFilter>) => {
      const payload = action.payload;
      state.stateFilter = payload;
    },

    stateFilterChoiceChange: (
      state: IPostsGroup,
      action: PayloadAction<boolean>
    ) => {
      const payload = action.payload;
      state.stateFilter.choice = payload;
    },
    stateFilterIndexChange: (
      state: IPostsGroup,
      action: PayloadAction<number>
    ) => {
      const payload = action.payload;
      state.stateFilter.index = payload;
    },
    stateFilterTitleChange: (
      state: IPostsGroup,
      action: PayloadAction<string>
    ) => {
      const payload = action.payload;
      state.stateFilter.title = payload;
    },

    categoryFilterChoiceChange: (
      state: IPostsGroup,
      action: PayloadAction<boolean>
    ) => {
      const payload = action.payload;
      state.categoryFilter.choice = payload;
    },
    categoryFilterIndexChange: (
      state: IPostsGroup,
      action: PayloadAction<number>
    ) => {
      const payload = action.payload;
      state.categoryFilter.index = payload;
    },
    categoryFilterTitleChange: (
      state: IPostsGroup,
      action: PayloadAction<string>
    ) => {
      const payload = action.payload;
      state.categoryFilter.title = payload;
    },
    schoolFilterChoiceChange: (
      state: IPostsGroup,
      action: PayloadAction<boolean>
    ) => {
      const payload = action.payload;
      state.schoolFilter.choice = payload;
    },
    schoolFilterIndexChange: (
      state: IPostsGroup,
      action: PayloadAction<number>
    ) => {
      const payload = action.payload;
      state.schoolFilter.index = payload;
    },
    schoolFilterTitleChange: (
      state: IPostsGroup,
      action: PayloadAction<string>
    ) => {
      const payload = action.payload;
      state.schoolFilter.title = payload;
    },
    schoolChange: (state: IPostsGroup, action: PayloadAction<string>) => {
      const payload = action.payload;
      state.mySchool = payload;
    },
    categoryChange: (state: IPostsGroup, action: PayloadAction<string>) => {
      const payload = action.payload;
      state.myCategory = payload;
    },
  },
  extraReducers: (builder) => { },
});

export const {
  chanegFollowRequest,
  locationChange,
  listGroupPosts,
  moreListGroupPosts,
  updateCreateGroupPostSuccessOrNot,
  setBackFromPost,
  setReloadMainPage,
  reload,
  stateChange,
  schoolChange,
  categoryChange,
  clearReload,
  setIsOneLineFilter,
  stateFilterChange,
  stateFilterChoiceChange,
  stateFilterIndexChange,
  stateFilterTitleChange,
  schoolFilterChoiceChange,
  schoolFilterIndexChange,
  schoolFilterTitleChange,
  categoryFilterChoiceChange,
  categoryFilterIndexChange,
  categoryFilterTitleChange,
  alterCreateGroupPostSuccessOrNot,
  setLikeRequest,
  setDisLikeRequest,
  setLikeStatus,
  setDisLikeStatus,
  changeFollowStatus,
} = postsSlice.actions;

export const posts = (state: RootState) => state.posts;

export default postsSlice.reducer;
