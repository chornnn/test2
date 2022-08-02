import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IGroupLoaction, IGroup } from '@types';
import { RootState } from '../..';
import {
  deleteGroupPostRequest,
  getCommentsRequest,
  getGroupPostRequest,
  postCommentRequest,
} from './request';

interface ICreateGroup {
  groupName: string;
  platformLink: string;
  platform: string;
  description?: string;
  state?: string;
  school?: string;
}

export interface refreshInputData {
  state?: string;
  school?: string;
  postIdStartAfter?: string;
  accumulatedPopularityAfter?: string;
  dailyPopularityAfter?: string;
}

export const deleteGroupPost = async (groupId: string, dispatch?) => {
  try {
    const result = await deleteGroupPostRequest(groupId);

    if (result['data']['code'] === 200) {
      return 'success';
    } else {
      return 'fail';
    }
  } catch (error) {
    return 'fail';
  }
};

export const getGroupPost = async (groupId: string, dispatch) => {
  dispatch(loading(true));
  const result = await getGroupPostRequest(groupId);

  if (result && result['data']['code'] === 200) {
    let group = result['data']['data'] as IGroup;
    dispatch(groupDetail(group));
  }
  // dispatch(loading(true));
  // const callableReturnMessage = functions.httpsCallable('getGroupPost');
  // // console.log('callableReturnMessage');
  // // console.log(myCreateUser)
  // console.log(groupId)

  // callableReturnMessage({ 'groupId': groupId }).then((myRes) => {
  //     console.log(myRes)
  //     const myData = myRes.data;
  //     if (myData.code === 200) {
  //         // console.log(myData.data);
  //         let group = myData.data as IGroup
  //         dispatch(groupDetail(group))
  //     }
  // }).catch((e) => {

  // }).finally(() => {

  // })
};

export interface iGetComments {
  postId: string;
  commentIdStartAfter?: string; //String (the last post ID of the previous page)
  creationTimeAfter?: string;
}

export const getComments = async (
  iGetComments: iGetComments,
  dispatch,
  resolve?,
  reject?,
  isLoading?: boolean
) => {
  const result = await getCommentsRequest(iGetComments);
  console.log(result);

  if (result['data']['code'] === 200) {
    if (
      iGetComments.commentIdStartAfter === undefined ||
      iGetComments.commentIdStartAfter === ''
    ) {
      dispatch(
        loadCommentsData({
          hasMore: result['data'].data.hasMore,
          datas: result['data'].data.postList,
        })
      );
    } else {
      console.log('loadMoreCommentsData');

      dispatch(
        loadMoreCommentsData({
          hasMore: result['data'].data.hasMore,
          datas: result['data'].data.postList,
        })
      );
    }
  }
  // if (isLoading) {
  //     Taro.showLoading({
  //         title: 'Loading',
  //         mask: true
  //     })
  // }

  // console.log("getComments")
  // // dispatch(loading(true));
  // const callableReturnMessage = functions.httpsCallable('getComments');
  // // console.log('callableReturnMessage');
  // // console.log(myCreateUser)
  // console.log(iGetComments)

  // callableReturnMessage(iGetComments).then((myRes) => {
  //     console.log("getComments")
  //     console.log(myRes)

  //     const myData = myRes.data;
  //     if (myData.code === 200) {

  //         if (iGetComments.commentIdStartAfter === undefined || iGetComments.commentIdStartAfter === '') {
  //             dispatch(loadCommentsData({
  //                 hasMore: myData.data.hasMore,
  //                 datas: myData.data.postList
  //             }))
  //         } else {
  //             console.log("loadMoreCommentsData");

  //             dispatch(loadMoreCommentsData({
  //                 hasMore: myData.data.hasMore,
  //                 datas: myData.data.postList
  //             }))
  //         }

  //         if (resolve) {
  //             resolve();
  //         }

  //         // console.log(myData.data);
  //         // let group = myData.data as IGroup
  //         // dispatch(groupDetail(group))
  //     }
  // }).catch((e) => {

  //     console.log(e);
  //     if (reject) {
  //         reject();
  //     }

  // }).finally(() => {
  //     if (isLoading) {
  //         Taro.hideLoading();
  //     }

  //     // dispatch(loading(false));
  // })
};

export interface iCreatePost {
  postId: string;
  contentType: 'text';
  content: string;
}

export const postComment = async (
  iCreateGroup: iCreatePost,
  dispatch,
  iComment?: IComment,
  success?
) => {
  const result = await postCommentRequest(iCreateGroup);

  if (result['data']['code'] === 200) {
    dispatch(
      insertOneComment({
        commentOwnerId: iComment.commentOwnerId,
        commentOwnerName: iComment.commentOwnerName,
        content: iComment.content,
      })
    );
  }
  // // dispatch(loading(true));
  // const callableReturnMessage = functions.httpsCallable('postComment');
  // // console.log('callableReturnMessage');
  // // console.log(myCreateUser)
  // console.log(iCreateGroup)

  // callableReturnMessage(iCreateGroup).then((myRes) => {
  //     console.log(myRes)
  //     const myData = myRes.data;
  //     if (myData.code === 200) {
  //         // console.log(myData.data);
  //         // getComments()

  //         dispatch(insertOneComment({
  //             commentOwnerId: iComment.commentOwnerId,
  //             commentOwnerName: iComment.commentOwnerName,
  //             content: iComment.content
  //         }))
  //         if (success) {
  //             console.log("sdds");

  //             success()
  //         }

  //         Taro.showToast({
  //             title: 'comment success',
  //             duration: 2000,
  //             icon: 'none'
  //         })

  //     }
  // }).catch((e) => {

  // }).finally(() => {
  //     Taro.hideLoading();
  //     // dispatch(loading(false));
  // })
};

export interface IPostsGroup {
  group: IGroup;
  loading?: boolean;
  loadingComment?: boolean;
  comments?: ICommentList;
  likeStatus?: boolean;
  dislikeStatus?: boolean;
}

export interface IComment {
  commentId?: string;
  commentOwnerId?: string;
  commentOwnerName?: string;
  content?: string;
  contentType?: string;
  creationTime?: string;
  numLikes?: string;
  numReplies?: string;
}
export interface ICommentList {
  datas?: IComment[];
  hasMore?: boolean;
  commentIdStartAfter?: string;
  creationTimeAfter?: string;
}

const initialState: IPostsGroup = {
  group: {} as IGroup,
  comments: {
    datas: [],
  },
  loading: true,
  loadingComment: true,
};

export const postsSlice = createSlice({
  name: 'post-detail',
  initialState: initialState,
  reducers: {
    groupDetail: (state: IPostsGroup, action: PayloadAction<IGroup>) => {
      const payload = action.payload;
      // console.log(payload);
      state.group = payload;
      state.loading = false;
    },
    loading: (state: IPostsGroup, action: PayloadAction<boolean>) => {
      const payload = action.payload;
      state.loading = payload;
      state.loadingComment = payload;
    },
    setLikeStatus: (state: IPostsGroup, action: PayloadAction<boolean>) => {
      const payload = action.payload;
      state.likeStatus = payload;
    },
    setDisLikeStatus: (state: IPostsGroup, action: PayloadAction<boolean>) => {
      const payload = action.payload;
      state.dislikeStatus = payload;
    },
    ////请求后，本地做记数出来
    changeLike: (state: IPostsGroup, action: PayloadAction<IGroup>) => {
      const payload = action.payload;
      state.group.hasLiked = payload.hasLiked;

      let likeNuber = Number(payload.numLikes);
      // 点赞数大于0 且 有dislike dislike 要改变
      if (likeNuber > 0 && state.group.hasDisliked) {
        state.group.hasDisliked = false;
        let disNumber = Number(state.group.numDislikes) - 1;
        if (disNumber < 0) {
          disNumber = 0;
        }
        state.group.numDislikes = String(disNumber);
      }
      let number = Number(state.group.numLikes) + likeNuber;
      if (number < 0) {
        number = 0;
      }
      state.group.numLikes = String(number);
    },
    //请求后，本地做记数出来
    changeDislike: (state: IPostsGroup, action: PayloadAction<IGroup>) => {
      const payload = action.payload;
      state.group.hasDisliked = payload.hasDisliked;
      let dislikesNumber = Number(payload.numDislikes);

      // 点踩大于0 且 hasLiked hasLiked 要改变
      if (dislikesNumber > 0 && state.group.hasLiked) {
        state.group.hasLiked = false;
        let likeNumber = Number(state.group.numLikes) - 1;
        if (likeNumber < 0) {
          likeNumber = 0;
        }
        state.group.numLikes = String(likeNumber);
      }
      let number = Number(state.group.numDislikes) + dislikesNumber;

      if (number < 0) {
        number = 0;
      }

      state.group.numDislikes = String(number);
    },
    loadCommentsData: (
      state: IPostsGroup,
      action: PayloadAction<ICommentList>
    ) => {
      const payload = action.payload;
      state.comments.datas = [];
      state.comments.hasMore = payload.hasMore;
      state.comments.datas = payload.datas;
      if (payload.datas.length != 0) {
        state.comments.commentIdStartAfter =
          payload.datas[payload.datas.length - 1].commentId;
        state.comments.creationTimeAfter =
          payload.datas[payload.datas.length - 1].creationTime;
      }

      state.loadingComment = false;
    },
    loadMoreCommentsData: (
      state: IPostsGroup,
      action: PayloadAction<ICommentList>
    ) => {
      const payload = action.payload;

      state.comments.hasMore = payload.hasMore;

      const myDatas = [...state.comments.datas, ...payload.datas] as IComment[];
      // console.log(myDatas)
      state.comments.datas = myDatas;
      if (payload.datas.length != 0) {
        state.comments.commentIdStartAfter =
          payload.datas[payload.datas.length - 1].commentId;
        state.comments.creationTimeAfter =
          payload.datas[payload.datas.length - 1].creationTime;
      }
    },
    insertOneComment: (state: IPostsGroup, action: PayloadAction<IComment>) => {
      const payload = action.payload;
      const myDatas = [payload, ...state.comments.datas] as IComment[];

      state.comments.datas = myDatas;
    },

    // clear: (state: IPostsGroup) =>{
    //     state.group = {}
    // }
  },
  extraReducers: (builder) => {},
});

export const {
  groupDetail,
  loading,
  changeLike,
  changeDislike,
  loadCommentsData,
  loadMoreCommentsData,
  insertOneComment,
  setLikeStatus,
  setDisLikeStatus,
} = postsSlice.actions;

export const postDetail = (state: RootState) => state.postDetail;

export default postsSlice.reducer;
