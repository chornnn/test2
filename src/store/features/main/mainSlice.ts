import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getHotLocationsRequest, getAllLocationsRequest, getHotGroupsRequest } from './request';

import { IGroup } from '@types';

export const getHotGroups = () => async (dispatch) => {
  const result = await getHotGroupsRequest().then((data) => {
    return data;
  });
  if (result['data']['code'] === 200) {
    const hotGroups = result['data']['data'] as IPostsGroup;

    dispatch(setHotGroups(hotGroups));
  }
}

export const getHotLocations = () => async (dispatch) => {
  const result = await getHotLocationsRequest().then((data) => {
    return data;
  });
  if (result.data['code'] === 200) {
    const hotLocations = result.data['data']['hotLocations'] as IhotLocation[];

    dispatch(setHotlocations(hotLocations));
  }
};

export const getAllLocations = () => async (dispatch) => {
  const result = await getAllLocationsRequest().then((data) => {
    return data;
  });

  if (result.data['code'] === 200) {
    const hotLocations = result.data['data']['hotLocations'];
    const allLocations = result.data['data']['allLocations'];

    dispatch(setAllLocations(allLocations));
    dispatch(setHotlocations(hotLocations));
  }
};

export interface IStateType {
  state: string;
  locations: string[];
}

interface IHomeStateType {
  hotLocations: IhotLocation[];
  allLocations: IStateType[];
  hotGroups: IGroup[];
  locationName?: string;
}

export interface IhotLocation {
  locationName: string;
  location: {
    city: string;
    state: string;
    locationName: string;
    type: string;
    locationId: string;
  };
  photoUrl: string;
  numGroups: number;
}

export interface IPostsGroup {
  hasMore: boolean;
  postList: IGroup[];
}

const initialState: IHomeStateType = {
  hotLocations: [],
  allLocations: [],
  hotGroups: [],
};

export const mainSlice = createSlice({
  name: 'main',
  initialState: initialState,
  reducers: {
    setHotlocations: (
      state: IHomeStateType,
      action: PayloadAction<IhotLocation[]>
    ) => {
      const payload = action.payload;
      state.hotLocations = payload;
    },
    setAllLocations: (
      state: IHomeStateType,
      action: PayloadAction<IStateType[]>
    ) => {
      const payload = action.payload;

      state.allLocations = payload;
    },
    setHotGroups: (
      state: IHomeStateType,
      action: PayloadAction<IPostsGroup>
    ) => {
      const payload = action.payload;
      state.hotGroups = payload.postList;
    }
    // userInfo: (state: IUserStateType, action: PayloadAction<userName>) => {

    //     const payload = action.payload;
    //     state.userInfo.firstName = payload.firstName;
    //     state.userInfo.lastName = payload.lastName;
    //     setUserInfo(payload.firstName, payload.lastName)

    // },
    // updateUserInfoSuccessOrNot: (state: IUserStateType, action: PayloadAction<boolean>) => {
    //     const payload = action.payload;
    //     state.updateSuccess = payload;
    // }
  },
  extraReducers: (builder) => { },
});

export const { setHotlocations, setAllLocations, setHotGroups } = mainSlice.actions;

export const main = (state) => state.main;

export default mainSlice.reducer;
