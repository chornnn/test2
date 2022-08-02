import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../..';
import { Ifollowers } from '../post/request';
import { getFollowersRequest, getFollowingsRequest } from './request';
// import { createGroupPostRequest, getMoreListGroupPostsRequest } from "./request";

export interface IFollow {
  avatarUrl: string;
  isFollowing?: boolean;
  numFollowers?: string;
  numFollowings?: string;
  name: string;
  uid: string;
  unFollowRequest?: boolean;
  followRequest?: boolean;
}

export interface IFollowsGroup {
  hasMore?: boolean;
  datas?: IFollow[];

  userIdStartAfter?: string;
}

const initialState: IFollowsGroup = {
  datas: [],
  hasMore: false,
};

interface IStatusInterface {
  status: boolean;
  index: number;
}

export const getFollowers = async (
  ifollowers: Ifollowers,
  index: number,
  dispatch?,
  resolve?,
  reject?
) => {
  try {
    let result;
    if (index === 0) {
      result = await getFollowersRequest(ifollowers);
    } else {
      result = await getFollowingsRequest(ifollowers);
    }

    if (result['data']['code'] === 200) {
      let datas;
      if (index === 0) {
        datas = result['data'].data.followerList;
      } else {
        datas = result['data'].data.followingList;

        for (let data of datas) {
          data.isFollowing = true;
        }
      }

      if (ifollowers.userIdStartAfter === undefined) {
        dispatch(
          listFollows({
            hasMore: result['data'].data.hasMore,
            datas: datas,
          })
        );
      } else {
        dispatch(
          moreListFollows({
            hasMore: result['data'].data.hasMore,
            datas: datas,
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

export const getFollowings = async (
  ifollowers: Ifollowers,
  dispatch?,
  resolve?,
  reject?
) => {
  const result = await getFollowingsRequest(ifollowers);
  console.log(result['data']);
};

interface IFilter {
  title?: string;
  index?: number;
  choice?: boolean;
}

interface IStatus {
  index: number;
  status: boolean;
}

export const followsSlice = createSlice({
  name: 'follows',
  initialState: initialState,
  reducers: {
    listFollows: (
      state: IFollowsGroup,
      action: PayloadAction<IFollowsGroup>
    ) => {
      const payload = action.payload;
      state.hasMore = payload.hasMore;
      state.datas = payload.datas;
      if (payload.datas.length != 0) {
        state.userIdStartAfter = payload.datas[payload.datas.length - 1].uid;
      }
    },
    setFollowRequest: (
      state: IFollowsGroup,
      action: PayloadAction<IStatus>
    ) => {
      const payload = action.payload;
      state.datas[payload.index].followRequest = payload.status;
    },
    setUnFollowRequest: (
      state: IFollowsGroup,
      action: PayloadAction<IStatus>
    ) => {
      const payload = action.payload;
      state.datas[payload.index].unFollowRequest = payload.status;
    },
    changeFollowStatus: (
      state: IFollowsGroup,
      action: PayloadAction<IStatusInterface>
    ) => {
      const payload = action.payload;
      state.datas[payload.index].isFollowing = payload.status;
    },
    moreListFollows: (
      state: IFollowsGroup,
      action: PayloadAction<IFollowsGroup>
    ) => {
      const payload = action.payload;
      state.hasMore = payload.hasMore;
      const myDatas = [...state.datas, ...payload.datas] as IFollow[];
      state.datas = myDatas;
      if (payload.datas.length != 0) {
        state.userIdStartAfter = payload.datas[payload.datas.length - 1].uid;
      }
    },
  },
  extraReducers: (builder) => { },
});

export const {
  listFollows,
  moreListFollows,
  changeFollowStatus,
  setFollowRequest,
  setUnFollowRequest,
} = followsSlice.actions;

export const follows = (state: RootState) => state.follows;

export default followsSlice.reducer;
