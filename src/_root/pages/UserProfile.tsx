import { useNavigate, useParams } from "react-router-dom";
import React, { useCallback, useEffect, useState } from "react";
import Verified from "../../components/shared/Verified";
import { useUserContext } from "../../context/AuthContext";
import userImg from "@/public/assets/icons/user.svg";
import Logo from "@/public/assets/images/logo-simsfy.ico";
import {
  useGetPostById,
  useGetUserCollections,
  useGetUserPosts,
  useGetUserPostsByUsername,
  useRemoveBanner,
  useUpdateBanner,
  useUpdateProfileImage,
  useUpdateUser,
} from "../../lib/react-query/queries";
// import Loader from "../../public/assets/icons/loader.svg"
import { CollectionsProps, IUser, PostsType } from "../../types";
import { useToast } from "@/components/ui";
import { copyTextToClipboard } from "@/hooks/clip";
import { GridPostList } from "@/components/shared";
import { Crown, Loader, VerifiedIcon } from "lucide-react";
import { motion } from "framer-motion";
import GridCollections from "@/components/shared/GridCollections";
import { api } from "@/lib/appwrite/config";

export default function UserProfile() {
  const { user: MyUser, checkAuthUser } = useUserContext()
  const { id } = useParams();
  const navigate = useNavigate();
  const [pageType, setPageType] = useState<"Posts" | "Collections">("Posts");
  const [user, setUser] = useState<IUser | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [imageInput, setImageInput] = useState<string>("");
  const [BannerImage, setBannerImage] = useState<string>("");
  const [ProfileImage, setProfileImage] = useState<string>("");
  const [UserPosts, setUserPosts] = useState<PostsType[]>([]);
  const [UserCollections, setMyCollections] = useState<CollectionsProps[]>([]);
  const {
    mutateAsync: updateUser,
    isLoading: isUpdating,
    error: updateError,
  } = useUpdateUser();
  const {
    mutateAsync: updateBanner,
    isLoading: isUpdateBannerLoading,
    error: isUpdateBannerError,
  } = useUpdateBanner();
  const {
    mutateAsync: updateProfileImage,
    isLoading: isUpdateProfileImageLoading,
    error: isUpdateProfileImageError,
  } = useUpdateProfileImage();
  const { mutateAsync: removeBanner } = useRemoveBanner();
  const { mutateAsync: updateMyposts, isLoading: isLoadingCreate } =
    useGetUserPostsByUsername();
  const { mutateAsync: getCollections, isLoading: isLoadingGetColections } =
    useGetUserCollections();
  const { toast } = useToast();
  const fetchPosts = async () => {
    const allposts = await updateMyposts({
      username: String(id),
    });

    const newUser = allposts.posts.filter((post) => post.user.username === id);
    if (allposts.creator) {
      setUser(allposts.creator);
      setBannerImage(allposts.creator.bannerUrl);
      setProfileImage(allposts.creator.imageUrl);
    }
    if (allposts.posts) {
      setUserPosts(allposts.posts as PostsType[]);
    } else {
      if (allposts.error) {
        toast({ title: allposts.error });
        setUserPosts([]);
      }
    }
    if (allposts.creator) {
      const allCollections = await getCollections({
        userId: Number(allposts.creator.id),
      });
      setMyCollections(allCollections);
    }
  };
  useEffect(() => {
    fetchPosts();
  }, []);



  const isFollowed = useCallback((userId: number, followers: { id: number; followedId: number; followerId: number }[]) => {
    if (userId && Array.isArray(followers)) {
      const follow = followers.find((follower) => follower.followedId === userId);
      if (follow !== undefined) {
        return follow;
      }
    }
    return false;
  }, [MyUser])




  const handleFollow = useCallback(async (user) => {
    try {
      const response = await api.post("follow", { followedId: user.id });
      if (response) {
        // toast({ title: "Now following " + user.username })
        checkAuthUser()
        fetchPosts()
      }
    } catch (error) {
      // toast({ title: "Error following user." })
    }
  }, [toast]);

  const handleUnFollow = useCallback(async (user) => {
    try {
      const response = await api.post("unfollow", { followedId: user.id });
      if (response) {
        // toast({ title: "Unfollowed " + user.username })
        checkAuthUser()
        fetchPosts()
      }
    } catch (error) {
      // toast({ title: "Error unfollowing user " })
    }
  }, [toast]);


  if (!user) {
    return (
      <div className="w-screen h-screen flex justify-center items-center bg-white">
        <Loader />
      </div>
    );
  }

  return user && (
    <div className="w-full h-full relative overflow-y-auto scrollbar bg-gray-50 dark:bg-neutral-900">
      {isUpdating ? (           
        <div className="flex justify-center items-center min-h-screen w-full">
          <Loader />
        </div>
      ) : (
        <div className="w-full">
          {/* Header Section with Banner and Avatar */}
          <div className="relative">
            {/* Banner */}
            <div className="relative w-full h-64 sm:h-72 md:h-80 overflow-hidden bg-[#D7D7D7] dark:bg-neutral-800">
              {BannerImage ? (
                <>
                  <img
                    src={BannerImage || "/placeholder.svg"}
                    alt="Profile Banner"
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </>
              ) : (
                <span className="absolute text-black right-2 bottom-2 font-bold text-[1.5vh] uppercase">
                  1920x250
                </span>
              )}
            </div>

            {/* Avatar e Botões de Ação */}
            <div className="relative flex justify-center items-center">
              {/* Avatar */}
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 z-10">
                <div className="relative">
                  <img
                    src={ProfileImage || "/placeholder.svg"}
                    alt={user.username}
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white dark:border-neutral-800 shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onError={(e: any) => {
                      e.target.src = userImg;
                    }}
                    draggable={false}
                  />
                </div>
              </div>

              {/* Botões de Ação - Desktop */}
              <div className="absolute -bottom-8 right-4 sm:right-8 md:right-12 hidden md:flex gap-3">
                {MyUser && (
                  <>
                    {isFollowed(Number(user.id), MyUser.following) ? (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleUnFollow(user);
                        }}
                        className="hidden h-11 items-center justify-center rounded-full bg-lime-300 hover:bg-lime-400 px-5 text-md font-medium text-black shadow-lg transition-all hover:shadow-xl sm:flex md:h-12 md:px-6"
                      >
                        UnFollow
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleFollow(user);
                        }}
                        className="hidden h-11 items-center justify-center rounded-full bg-lime-300 hover:bg-lime-400 px-5 text-md font-medium text-black shadow-lg transition-all hover:shadow-xl sm:flex md:h-12 md:px-6"
                      >
                        Follow
                      </button>
                    )}
                  </>
                )}
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition-all hover:bg-gray-50 hover:shadow-xl dark:bg-neutral-800 dark:hover:bg-neutral-700 md:h-12 md:w-12"
                  aria-label="Share profile"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                    <path d="M274.96-249.7q-95.94 0-163.13-67.17-67.18-67.18-67.18-163.11t67.18-163.13q67.19-67.19 163.13-67.19h111.67q23.67 0 40.13 16.57 16.46 16.58 16.46 40.01 0 23.44-16.46 40.01-16.46 16.58-40.13 16.58H274.96q-49.05 0-83.09 34.16-34.04 34.17-34.04 82.97t34.04 82.97q34.04 34.16 83.09 34.16h111.67q23.67 0 40.13 16.58 16.46 16.57 16.46 40.01 0 23.43-16.46 40.01-16.46 16.57-40.13 16.57H274.96Zm78.93-178.06q-22.09 0-37.55-15.45-15.45-15.46-15.45-37.55 0-22.34 15.33-37.67 15.34-15.33 37.67-15.33h252.22q22.09 0 37.55 15.33 15.45 15.33 15.45 37.67 0 22.09-15.33 37.55-15.34 15.45-37.67 15.45H353.89ZM573.37-249.7q-23.67 0-40.13-16.57-16.46-16.58-16.46-40.01 0-23.44 16.46-40.01 16.46-16.58 40.13-16.58h111.67q49.05 0 83.09-34.16 34.04-34.17 34.04-82.97t-34.04-82.97q-34.04-34.16-83.09-34.16H573.37q-23.67 0-40.13-16.58-16.46-16.57-16.46-40.01 0-23.43 16.46-40.01 16.46-16.57 40.13-16.57h111.67q95.94 0 163.13 67.17 67.18 67.18 67.18 163.11t-67.18 163.13q-67.19 67.19-163.13 67.19H573.37Z" />
                  </svg>
                </button>
                <button
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-lg transition-all hover:bg-gray-50 hover:shadow-xl dark:bg-neutral-800 dark:hover:bg-neutral-700 md:h-12 md:w-12"
                  aria-label="More options"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                    <path d="M480.12-149q-34.55 0-59.13-24.55-24.58-24.56-24.58-59.04 0-34.58 24.56-59.2 24.55-24.62 59.03-24.62 34.67 0 59.13 24.59 24.46 24.6 24.46 59.13 0 34.54-24.46 59.11Q514.67-149 480.12-149Zm0-247.41q-34.55 0-59.13-24.56-24.58-24.55-24.58-59.03 0-34.67 24.56-59.13 24.55-24.46 59.03-24.46 34.67 0 59.13 24.46t24.46 59.01q0 34.55-24.46 59.13-24.46 24.58-59.01 24.58Zm0-247.18q-34.55 0-59.13-24.64-24.58-24.64-24.58-59.25t24.56-59.06Q445.52-811 480-811q34.67 0 59.13 24.46 24.46 24.45 24.46 59.06t-24.46 59.25q-24.46 24.64-59.01 24.64Z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="pt-20 pb-2 px-4 sm:px-6 md:px-8">
            <div className="text-center">
              {/* Name and Verification */}
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {user.name || user.firstname
                    ? `${user.name} ${user.firstname}`
                    : user.username}
                </h1>
                {user.verified && (
                  <VerifiedIcon className="text-blue-600 w-6 hover:text-blue-500 hover:cursor-pointer" />
                )}
                {user.vip && (
                  <Crown className="text-yellow-200 w-6 hover:text-yellow-200 hover:cursor-pointer" />
                )}
              </div>

              {/* Username */}
              <div className="flex justify-center items-center gap-2 text-gray-500 dark:text-neutral-500 font-medium">
                @{user.username}
              </div>

              {/* Bio Section */}
              {user?.bio && (
                <div className="mx-4 sm:mx-6 md:mx-8 mb-2 ">
                  <div className="text-center max-w-3xl mx-auto">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{user.bio}</p>
                  </div>
                </div>
              )}

              {/* Website */}
              {user?.site && (
                <a
                  href={user.site.startsWith("http") ? user.site : `https://${user.site}`}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-flex items-center justify-center w-10 h-10 bg-gray-200 dark:bg-neutral-800 hover:bg-gray-300 dark:hover:bg-neutral-700 rounded-full transition-all duration-200 hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentcolor"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-7-.5-14.5T799-507q-5 29-27 48t-52 19h-80q-33 0-56.5-23.5T560-520v-40H400v-80q0-33 23.5-56.5T480-720h40q0-23 12.5-40.5T563-789q-20-5-40.5-8t-42.5-3q-134 0-227 93t-93 227h200q66 0 113 47t47 113v40H400v110q20 5 39.5 7.5T480-160Z" /></svg>
                </a>
              )}

              {/* Action Buttons - Mobile Only */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-4 md:hidden">
                <button className="px-5 sm:px-6 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-gray-700 dark:text-gray-300 font-medium rounded-full transition-all duration-200 hover:scale-105">
                  <span className="flex items-center gap-1">Share</span>
                </button>

                <button className="px-5 sm:px-6 py-2.5 bg-lime-300 hover:bg-lime-400 text-black font-medium rounded-full transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl">
                  <span className="flex items-center gap-1">Follow</span>
                </button>
              </div>

              {/* Stats Section */}
              <div className="flex justify-center items-center mt-4 mb-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 w-full lg:w-1/3 gap-1 rounded-xl overflow-hidden border border-gray-200 dark:border-neutral-700">
                  <div className="bg-white dark:bg-neutral-800 p-4 text-center border-r border-b sm:border-b-0 border-gray-200 dark:border-neutral-700">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Following</div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      {user.following.length}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-neutral-800 p-4 text-center border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-neutral-700">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Followers</div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      {user.followers.length}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-neutral-800 p-4 text-center border-r border-gray-200 dark:border-neutral-700">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Posts</div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      {UserPosts.length}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-neutral-800 p-4 text-center">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Collections</div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      {UserCollections.length}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-t border-b border-gray-200 dark:border-neutral-700">
            <div className="flex justify-center gap-8 px-4">
              <button onClick={() => setPageType("Posts")} className="relative py-4 px-2">
                <span
                  className={`font-semibold transition-colors ${pageType === "Posts"
                    ? "text-lime-700 dark:text-lime-300"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                >
                  Posts
                </span>
                {pageType === "Posts" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-lime-300 dark:bg-lime-300 rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </button>

              <button onClick={() => setPageType("Collections")} className="relative py-4 px-2">
                <span
                  className={`font-semibold transition-colors ${pageType === "Collections"
                    ? "text-lime-700 dark:text-lime-300"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                >
                  Collections
                </span>
                {pageType === "Collections" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-lime-300 dark:bg-lime-300 rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </button>
            </div>
          </div>

          {/* Content Section */}
          <div className="w-full">
            {pageType === "Posts" ? (
            UserPosts.length > 0 ? (
                <div className="w-full">
                  <GridPostList posts={UserPosts} />
                </div>
              ) : (
                <div className="text-center py-16 w-full">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Nenhum Post Encontrado</h3>
                </div>
              )
            ) : (
              <div className="w-full">
                <GridCollections user={user} collections={UserCollections} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
