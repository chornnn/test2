import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../..';
import { IPostsGroup, refreshInputData } from '../post/postSlice';
import {
  getUserMoreListGroupPostsRequest,
  getSavedPostsRequest,
  refreshUserInputData,
  likePostRequest,
  dislikePostRequest,
  removeLikePostRequest,
  removeDislikePostRequest,
  savePostRequest,
} from '../post/request';
import { IGroup } from '@types';

interface ILikeInterface {
  likeRequest: boolean;
  index: number;
}

interface ILikeStatusInterface {
  status: boolean;
  index: number;
}

export interface IUserPostsGroup {
  hasMore?: boolean;
  datas?: IGroup[];
  postIdStartAfter?: string;
  accumulatedPopularityAfter?: string;
  dailyPopularityAfter?: string;
  creationTimeAfter?: string;
  createGroupPostSuccessOrNot?: boolean;
  alterGroupPostSuccessOrNot?: boolean;
  backFromPost?: boolean;
  reloadMainPage?: boolean;
  myState?: string;
  mySchool?: string;
  myCategory?: string;
  isOneLineFilter?: boolean;
  location?: string;
  likeRquest?: boolean;
}

const initialState: IUserPostsGroup = {
  datas: [],
  location: '',
};

export const getUserMoreListGroupPosts = async (
  inputData: refreshUserInputData,
  dispatch?,
  resolve?,
  reject?
) => {
  try {
    let result = await getUserMoreListGroupPostsRequest(inputData);
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
};

export const getUserSavedGroupPosts = async (
  inputData: refreshUserInputData,
  dispatch?,
  resolve?,
  reject?
) => {
  try {
    let result = await getSavedPostsRequest(inputData);
    if (result['data']['code'] === 200) {
      if (
        inputData.postIdStartAfter === undefined ||
        inputData.postIdStartAfter === ''
      ) {
        dispatch(
          listSavedGroupPosts({
            hasMore: result['data'].data.hasMore,
            datas: result['data'].data.postList,
          })
        );
      } else {
        dispatch(
          moreSavedGroupPosts({
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
};

export const likeRequest = async (
  postId: string,
  index: number,
  likeStatus: boolean,
  dispatch?
) => {
  if (dispatch) {
    console.log(setLikeRequest);
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

export const userPostsSlice = createSlice({
  name: 'userPosts',
  initialState: initialState,
  reducers: {
    listGroupPosts: (
      state: IUserPostsGroup,
      action: PayloadAction<IUserPostsGroup>
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
    moreListGroupPosts: (
      state: IUserPostsGroup,
      action: PayloadAction<IUserPostsGroup>
    ) => {
      const payload = action.payload;
      state.hasMore = payload.hasMore;
      const myDatas = [...state.datas, ...payload.datas] as IGroup[];
      state.datas = myDatas;
      if (payload.datas.length != 0) {
        state.postIdStartAfter = myDatas[myDatas.length - 1].groupPostId;
        state.creationTimeAfter = myDatas[myDatas.length - 1].creationTime;
        state.accumulatedPopularityAfter = myDatas[myDatas.length - 1].numViews;
        state.dailyPopularityAfter = myDatas[myDatas.length - 1].numSaves;
      }
    },
    listSavedGroupPosts: (
      state: IUserPostsGroup,
      action: PayloadAction<IUserPostsGroup>
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
    moreSavedGroupPosts: (
      state: IUserPostsGroup,
      action: PayloadAction<IUserPostsGroup>
    ) => {
      const payload = action.payload;
      state.hasMore = payload.hasMore;
      const myDatas = [...state.datas, ...payload.datas] as IGroup[];
      state.datas = myDatas;
      if (payload.datas.length != 0) {
        state.postIdStartAfter = myDatas[myDatas.length - 1].groupPostId;
        state.creationTimeAfter = myDatas[myDatas.length - 1].creationTime;
        state.accumulatedPopularityAfter = myDatas[myDatas.length - 1].numViews;
        state.dailyPopularityAfter = myDatas[myDatas.length - 1].numSaves;
      }
    },
    clear: (state: IUserPostsGroup) => {
      state.datas = [];
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
  },
  extraReducers: (builder) => {},
});

export const {
  listGroupPosts,
  moreListGroupPosts,
  listSavedGroupPosts,
  moreSavedGroupPosts,
  clear,
  setLikeRequest,
  setDisLikeRequest,
  setLikeStatus,
  setDisLikeStatus,
} = userPostsSlice.actions;

export const userPosts = (state: RootState) => state.userPosts;

export default userPostsSlice.reducer;
