import { ID, Query } from "appwrite";
import Cookies from 'js-cookie';
import fs from "fs";
import { api } from "./config";
import { INewUser, IUser, PostsType, PostType } from "@/types";
import axios from "axios";

// ============================================================
// AUTH
// ============================================================

// ============================== SIGN UP
export async function createUserAccount(user: INewUser) {
  const response = await api.post("createUser", user);
  return response;
}

// ============================== SIGN IN
export async function signInAccount(user: { email: string; password: string }) {
  const response = await api.post("login", user);
  return response;
}
// ============================== GET ACCOUNT
export async function getAccount() {
  const response = await api.get("account");
  return response;
}

// ============================== GET USER
export async function getCurrentUser(): Promise<any> {
  const currentAccount = await getAccount();
  return currentAccount;
}

// ============================== SIGN OUT
export async function signOutAccount() {
  try {
    const sesstion = localStorage.getItem("authToken");
    const authToken = Cookies.get('authToken')
    if (sesstion || authToken) {
      localStorage.removeItem("authToken");
      Cookies.remove('authToken')
      return true;
    }
  } catch (error) {
    console.error(error);
  }
}

// ============================================================
// POSTS
// ============================================================

// ============================== CREATE POST
export async function createPost(post) {
  try {
    const uploadedFile = await uploadFile(post.file[0], Number(post.userId));

    if (!uploadedFile) throw Error;

    const fileUrl = await getFilePreview(uploadedFile.$id);
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    const tags = post.tags?.replace(/ /g, "").split(",") || [];
    const newPost = await api.post("newPost", {
      creator: post.userId,
      caption: post.caption,
      imageUrl: fileUrl.url,
      imageId: uploadedFile.$id,
      location: post.location,
      tags: tags,
    });

    if (newPost) {
      return newPost;
    }
    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }
  } catch (error) {
    console.error(error);
  }
}

// ============================== UPLOAD FILE
export async function uploadFile(file: File, userId: number) {
  try {
    let typeFile = "";

    const fileType = file.type;
    if (fileType === "image/x-icon") {
      throw new Error("ICO files are not allowed");
    } else if (fileType.startsWith("image/")) {
      typeFile = `image`;
    } else if (fileType.startsWith("video/")) {
      typeFile = `video`;
    } else if (fileType.startsWith("audio/")) {
      typeFile = `audio`;
    } else {
      throw new Error("Tipo de arquivo não suportado");
    }

    console.log(file)
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("postFile", formData)
    return response
  } catch (error) {
    console.error("Erro ao fazer upload do arquivo:", error);
    throw error;
  }
}
// export async function uploadFile(file: File, userId: number) {
//   try {
//     let typeFile = "";

//     const fileType = file.type;
//     if (fileType === "image/x-icon") {
//       throw new Error("ICO files are not allowed");
//     } else if (fileType.startsWith("image/")) {
//       typeFile = `image`;
//     } else if (fileType.startsWith("video/")) {
//       typeFile = `video`;
//     } else if (fileType.startsWith("audio/")) {
//       typeFile = `audio`;
//     } else {
//       throw new Error("Tipo de arquivo não suportado");
//     }

//     const formData = new FormData();
//     formData.append("file", file);

//     const WEB_TOKEN = import.meta.env.VITE_WEB_TOKEN_FIVE_MANAGER;
//     const WEB_URL_POST_IMAGES = import.meta.env.VITE_URL_POST_FILES;

//     const response = await axios.post(
//       `${WEB_URL_POST_IMAGES}${typeFile}`,
//       formData,
//       {
//         headers: {
//           Authorization: WEB_TOKEN,
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     );

//     const uploadedFile = {
//       url: response.data.url,
//       userId: userId,
//     };

//     const responsePost = await api.post("postFiles", uploadedFile);

//     if (responsePost) {
//       return responsePost;
//     }
//   } catch (error) {
//     console.error("Erro ao fazer upload do arquivo:", error);
//     throw error;
//   }
// }
// ============================== GET FILE URL
export async function getFilePreview(fileId: string) {
  try {
    const fileUrl = await api.post("getFile", {
      id: fileId,
    });

    if (!fileUrl.url) throw Error;
    return fileUrl.url;
  } catch (error) {
    console.error(error);
  }
}

// ============================== DELETE FILE
export async function deleteFile(fileId: string) {
  try {
    await api.post("deleteFile", {
      id: fileId,
    });

    return { status: "ok" };
  } catch (error) {
    console.error(error);
  }
}

// ============================== GET POSTS
export async function searchPosts(searchTerm: string) {
  try {
    const posts = await api.post("searchPosts", {
      searchTerm: searchTerm,
    });
    if (!posts) throw Error;
    return posts;
  } catch (error) {
    console.error(error);
  }
}

export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
  try {
    const posts = await api.post("getInfinitePosts", {
      page: pageParam || 1,
      limit: 9,
    });
    if (!posts) throw Error;
    return posts;
  } catch (error) {
    console.error(error);
  }
}

// ============================== GET POST BY ID
export async function getPostById(postId?: string) {
  if (!postId) throw Error;

  try {
    const post = await api.post("getPostById", {
      id: postId,
    });
    if (!post) throw Error;
    return post;
  } catch (error) {
    console.error(error);
  }
}

// ============================== UPDATE POST
export async function updatePost(post) {
  const hasFileToUpdate = post.file.length > 0;

  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };

    if (hasFileToUpdate) {
      const uploadedFile = await uploadFile(post.file[0], Number(post.postId));
      if (!uploadedFile) throw Error;

      const fileUrl = await getFilePreview(uploadedFile.id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.id);
        throw Error;
      }
      image = {
        ...image,
        imageUrl: uploadedFile.url,
        imageId: uploadedFile.id,
      };
    }

    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    const updatedPost = await api.post("updatePost", {
      postId: post.postId,
      caption: post.caption,
      location: post.location,
      tags: tags,
      image,
    });

    // Failed to update
    if (!updatedPost) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }

      // If no new file uploaded, just throw error
      throw Error;
    }

    // Safely delete old file after successful update
    if (hasFileToUpdate) {
      await deleteFile(post.imageId);
    }

    return updatedPost;
  } catch (error) {
    console.error(error);
  }
}

// ============================== DELETE POST
export async function deletePost(postId?: string, imageId?: string) {
  if (!postId || !imageId) return;

  try {
    const statusCode = await api.post("deletePost", {
      id: postId,
      imageId: imageId,
    });
    if (!statusCode) throw Error;
    await deleteFile(imageId);
    return { status: "Ok" };
  } catch (error) {
    console.error(error);
  }
}

// ============================== LIKE / UNLIKE POST
export async function likePost(
  postId: string,
  likesArray: string[],
  userId: number
) {
  try {
    const updatedPost = await api.post("likePost", {
      id: postId,
      likesArray: likesArray,
      userId: userId,
    });
    if (!updatedPost) throw Error;
    return updatedPost;
  } catch (error) {
    console.error(error);
  }
}
export async function removeLikePost(postId: string, userId: string) {
  try {
    const updatedPost = await api.post("removeLikePost", {
      postId: postId,
      userId: userId,
    });
    if (!updatedPost) throw Error;
    return updatedPost;
  } catch (error) {
    console.error(error);
  }
}

// ============================== SAVE POST
export async function savePost(userId: string, postId: string) {
  try {
    const updatedPost = await api.post("savePost", {
      userId: userId,
      postId: postId,
    });
    // const updatedPost = await databases.createDocument(
    //   appwriteConfig.databaseId,
    //   appwriteConfig.savesCollectionId,
    //   ID.unique(),
    //   {
    //     user: userId,
    //     post: postId,
    //   }
    // );
    if (!updatedPost) throw Error;
    return updatedPost;
  } catch (error) {
    console.error(error);
  }
}
// ============================== DELETE SAVED POST
export async function deleteSavedPost(savedRecordId: string) {
  try {
    const response = await api.delete("deleteSavedPost", {
      postId: savedRecordId,
    });
    if (!response) throw Error;
    return { status: "Ok" };
  } catch (error) {
    console.error(error);
  }
}

// ============================== GET USER'S POST
export async function getUserPosts(userId: any, atatus: any) {
  const post = await api.post("getUserPosts", {
    userId: Number(userId),
    atatus: atatus,
  });
  return post;
}
export async function getUserPostsByUsername(username: string, atatus: any) {
  const post = await api.post("getUserPostsByUsername", {
    username: username,
    atatus: atatus,
  });
  return post;
}
// ============================== GET POST :id
export async function getUserCollectionsByUsername(userId: number) {
  const post = await api.post("collections", {
    userId: userId,
  });
  return post;
}
// ============================== POST :id
export async function getCollectionById(id: string) {
  const post = await api.post("getCollectionById", {
    id: id,
  });
  return post;
}

// ============================== GET POST :id
export async function getPostId(postId: any) {
  const post = await api.post("getPostById", {
    postId: postId,
  });
  return post;
}
// ============================================================
// USER
// ============================================================

// ============================== GET USERS
export async function getUsers(limit?: number) {
  const queries = await api.post("getUsers", {
    limit: limit,
  });
  const Table: any[] = queries;

  try {
    if (!Table) throw Error;

    return Table;
  } catch (error) {
    console.error(error);
  }
}

// ============================== GET USER BY ID
export async function getUserById(userId: number) {
  try {
    const user = await api.post("getUserById", { id: userId });
    if (!user) throw Error;

    return user;
  } catch (error) {
    console.error(error);
  }
}
// ============================== POST USER
export async function uploadPosts(Data: PostType[]) {
  const response = await api.post("uploadPosts", Data);
  return response;
}
// ============================== GET POPULAR POSTS (BY HIGHEST LIKE COUNT)
export async function getRecentPosts() {
  const posts = await api.post("getRecentPosts", {
    limit: 24,
  });
  return posts;
}
export async function getHallOffFame() {
  const posts = await api.get("hallOfFame");
  return posts;
}
export async function updateProfileImage(file: File, userId: number) {
  const uploadedFile = await uploadFile(file, userId);
  if (!uploadedFile) throw Error;
  const posts = await api.post("updateProfileImage", {
    imageUrl: uploadedFile.url,
  });
  return posts;
}
export async function updateBanner(file: File, userId: number) {
  const uploadedFile = await uploadFile(file, userId);
  if (!uploadedFile) throw Error;

  const posts = await api.post("updateBanner", {
    imageUrl: uploadedFile.url,
  });
  return posts;
}
export async function handleUpdateBannerCollection(
  file: File,
  userId: number,
  colectionId: string
) {
  const uploadedFile = await uploadFile(file, userId);
  if (!uploadedFile) throw Error;

  const posts = await api.post("updateBannerColection", {
    bannerUrl: uploadedFile.url,
    collectionId: colectionId,
  });
  return posts;
}
export async function updateBannerColection(
  file: File,
  userId: number,
  colectionId: string
) {
  const uploadedFile = await uploadFile(file, userId);
  if (!uploadedFile) throw Error;

  const posts = await api.post("updateBannerColection", {
    bannerUrl: uploadedFile.url,
    collectionId: colectionId,
  });
  return posts;
}
export async function removeBannerCollection(
  userId: string,
  colectionId: string
) {

  const posts = await api.post("remuveBannerColection", {
    userId,
    collectionId: colectionId,
  });
  return posts;
}


export async function removeBanner() {
  const posts = await api.post("removeBanner");
  return posts;
}

// ============================== UPDATE USER
export async function updateUser(user: IUser) {
  const updatedUser = await api.post("updateUser", {
    id: user.id,
    username: user.username,
    bio: user.bio,
    imageUrl: user.imageUrl,
    email: user.email,
    verified: user.verified,
    bannerUrl: user.bannerUrl,
    colections: user.colections,
    site: user.site,
    Country: user.Country,
    firstname: user.firstname,
    name: user.name,
  });
  return updatedUser;
}

async function fetchBlobFromUrl(url: string): Promise<File | null> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error("Failed to fetch the URL:", url);
      return null;
    }

    const blob = await response.blob();

    // Converte Blob para File
    const file = new File([blob], "uploaded-image.jpg", { type: blob.type });
    return file;
  } catch (error) {
    console.error("Error converting URL to Blob:", error);
    return null;
  }
}
