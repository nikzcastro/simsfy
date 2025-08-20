import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";

import { QUERY_KEYS } from "@/lib/react-query/queryKeys";
import {
  createUserAccount,
  signInAccount,
  getCurrentUser,
  signOutAccount,
  getUsers,
  createPost,
  getPostById,
  updatePost,
  getUserPosts,
  deletePost,
  likePost,
  getUserById,
  updateUser,
  getRecentPosts,
  getInfinitePosts,
  searchPosts,
  savePost,
  deleteSavedPost,
  removeLikePost,
  uploadPosts,
  getHallOffFame,
  updateBanner,
  updateProfileImage,
  removeBanner,
  getPostId,
  getUserPostsByUsername,
  getUserCollectionsByUsername,
  getCollectionById,
} from "@/lib/appwrite/api";
import { INewUser, IUser, PostsType, PostType } from "@/types";
import { UserType } from "../../_root/pages/HallFame";

// ============================================================
// AUTH QUERIES
// ============================================================


export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
  });
};
export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) => signInAccount(user),
  });
};

export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: signOutAccount,
  });
};

// ============================================================
// POST QUERIES
// ============================================================

export const useGetPosts = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
    queryFn: getInfinitePosts as any,
    getNextPageParam: (lastPage: any, allPages: any[]) => {
      const totalPosts = allPages.reduce((acc, page) => acc + page.length, 0);
      return totalPosts / 9 + 1;
    },
  });
};

export const useSearchPosts = (searchTerm: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
    queryFn: () => searchPosts(searchTerm),
    enabled: !!searchTerm,
  });
};

export const useGetHallOfFame = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_HALL_OF_FAME],
    queryFn: getHallOffFame,
  });
};
export const useGetRecentPosts = () => {
  return useQuery<PostsType[]>({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: getRecentPosts,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: any) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

export const useGetPostById = (postId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId,
  });
};
export const useGetPostId = (id: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['GET_POST_BY_ID', id], // Garantindo a chave correta da consulta
    queryFn: () => getPostId(id), // Função que faz a requisição
    onSuccess: (data) => {
      queryClient.invalidateQueries(['GET_POST_BY_ID', id]);
    },
    enabled: !!id, // Garante que a consulta só será feita se `id` existir
  });
};

// export const useGetUserPosts = () => {
//   return useQuery({
//     mutationFn: (userId: number) => getUserPosts(userId),

//   });
// };

// export const useGetUserPosts = () => {
//   return useQuery<PostsType[]>({
//     queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
//     queryFn: (userId:) => getUserPosts(userId),
//   });
// };
export const useGetUserPosts = () => {
  return useMutation({
    mutationFn: ({ userId, atatus }: any) => getUserPosts(userId, atatus),
  });

};
export const useGetUserPostsByUsername = () => {
  return useMutation({
    mutationFn: ({ username, atatus }: any) => getUserPostsByUsername(username, atatus),
  });
};

export const useGetUserCollections = () => {
  return useMutation({
    mutationFn: ({ userId }: { userId : number}) => getUserCollectionsByUsername(userId),
  });
};
export const useGetCollections = () => {
  return useMutation({
    mutationFn: ({ id }: { id : string}) => getCollectionById(id),
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: any) => updatePost(post),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
      });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, imageId }: { postId?: string; imageId: string }) =>
      deletePost(postId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      postId,
      likesArray,
      userId,
    }: {
      postId: string;
      likesArray: string[];
      userId: number
    }) => likePost(postId, likesArray, userId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data.id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};
export const useRemoveLikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      postId,
      userId,
    }: {
      postId: string;
      userId: string;
    }) => removeLikePost(postId, userId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data.id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useSavePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, postId }: { userId: string; postId: string }) =>
      savePost(userId, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useDeleteSavedPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

// ============================================================
// USER QUERIES
// ============================================================

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: getCurrentUser,
  });
};

export const useGetUsers = (limit?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USERS],
    queryFn: () => getUsers(limit),
  });
};

export const useGetUserById = (userId: number) => {
  return useQuery<any>({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: IUser) => updateUser(user),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id],
      });
    },
  });
};

export const useUpdateBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, userId }: { file: File; userId: number }) =>
      updateBanner(file, userId),
    onSuccess: (data) => {
      queryClient.invalidateQueries([QUERY_KEYS.UPDATE_BANNER]);
    },
  });
};

export const useUpdateProfileImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, userId }: { file: File; userId: number }) =>
      updateProfileImage(file, userId),
    onSuccess: (data) => {
      queryClient.invalidateQueries([QUERY_KEYS.UPDATE_PROFILE_IMAGE]);
    },
  });
};
export const useRemoveBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      removeBanner(),
    onSuccess: (data) => {
      queryClient.invalidateQueries([QUERY_KEYS.REMOVE_BANNER]);
    },
  });
};




export const useUpLoadPosts = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (Data: PostType[]) =>
      uploadPosts(Data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SET_USER_POSTS],
      });
    },
  });
};