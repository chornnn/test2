import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { HYDRATE, createWrapper } from 'next-redux-wrapper';

import userReducer from './features/user/userSlice';
import mainReducer from './features/main/mainSlice';
import postReducer from './features/post/postSlice';
import postDetailReducer from './features/postDetail/postDetailSlice';
import followReducer from './features/follow/followSlice';
import userFollowReducer from './features/userPosts/userSlice';

const combinedReducer = combineReducers({
  user: userReducer,
  main: mainReducer,
  posts: postReducer,
  postDetail: postDetailReducer,
  follows: followReducer,
  userPosts: userFollowReducer,
});

const reducer = (state, action) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state, // use previous state
      ...action.payload, // apply delta from hydration
    };
    if (state.user['authenticated']) {
      nextState.user = state.user;
    }
    return nextState;
  } else {
    return combinedReducer(state, action);
  }
};

const makeStore = () => {
  return configureStore({ reducer });
};

export const wrapper = createWrapper(makeStore);

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
