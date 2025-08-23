import React, { useEffect, useState } from "react";
import Verified from "../../components/shared/Verified";
import { useUserContext } from "../../context/AuthContext";
import userImg from "@/public/assets/icons/user.svg";
import Logo from "@/public/assets/images/logo-simsfy.ico";

import {
  useGetPostById,
  useGetUserPosts,
  useRemoveBanner,
  useUpdateBanner,
  useUpdateProfileImage,
  useUpdateUser,
} from "../../lib/react-query/queries";
import { Crown, Loader, PlusIcon, LockIcon } from "lucide-react";
import { IUser, PostsType, ProvidersList } from "../../types";
import { useToast } from "@/components/ui";
import { copyTextToClipboard } from "@/hooks/clip";
import { GridPostList } from "@/components/shared";
import { motion } from "framer-motion";
import GridCollections from "../../components/shared/GridCollections";
import { Link } from "react-router-dom";
import { VerifiedIcon } from "lucide-react";
import googleImage from "../../public/assets/images/google.png"
import clsx from "clsx";
import ModalSyncAccout from "@/components/forms/ModalSyncAccout";

export default function Profile() {
  const { user, isLoading: isUserLoading, checkAuthUser } = useUserContext();
  const [userS, setUser] = useState<IUser>(user);
  const [isEditing, setIsEditing] = useState(false);
  const [modalSyncAccout, setModalSyncAccout] = useState(false);
  const [imageInput, setImageInput] = useState<string>("");
  const [BannerImage, setBannerImage] = useState<string>("");
  const [ProfileImage, setProfileImage] = useState<string>("");
  const [pageType, setPageType] = useState<"Posts" | "Collections">("Posts");
  const [MyPosts, setMyPosts] = useState<PostsType[]>([]);
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
    useGetUserPosts();
  const { toast } = useToast();

  useEffect(() => {
    const fetchPosts = async () => {
      const allposts = await updateMyposts({
        userId: String(user.id),
        atatus: "all",
      });

      if (allposts) {
        setMyPosts(allposts as PostsType[]);
      } else {
        if (allposts.error) {
          toast({ title: allposts.error });
          setMyPosts([]);
        }
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    setBannerImage(user.bannerUrl || "");
    setProfileImage(user.imageUrl || "");
  }, []);
  const handleInputChange = (field: keyof IUser, value: string) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        if (event.target?.result) {
          setImageInput(event.target.result.toString());
          setUser((prev) => ({
            ...prev,
            imageUrl: event.target.result.toString(),
          }));
        }
      };
      fileReader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSaveChanges = async () => {
    setIsEditing(false);
    try {
      await updateUser({
        id: userS.id,
        email: user.email,
        verified: user.verified,
        bio: userS.bio,
        username: userS.username,
        imageUrl: userS.imageUrl,
        bannerUrl: userS.bannerUrl,
        colections: userS.colections,
      });
      setTimeout(async () => {
        await checkAuthUser();
      }, 2000);
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
    }
  };

  const handleUpdateBanner = async (file: File) => {
    if (file) {
      const isUpdated = await updateBanner({
        file: file,
        userId: Number(user.id),
      });
      if (isUpdateBannerError) {
        setBannerImage("");
      }

      if (isUpdated.error) {
        toast({ title: isUpdated.error });
      }
      setTimeout(async () => {
        await checkAuthUser();
      }, 2000);
    } else {
      console.log("No file selected.");
    }
  };

  const openFileSelector = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/png, image/jpeg, image/gif";
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      const blobUrl = URL.createObjectURL(file);
      setBannerImage(blobUrl);
      handleUpdateBanner(file);
    };
    input.click();
  };
  const openFileSelectorImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/png, image/jpeg, image/gif";
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      handleUpdateImage(file);
      const blobUrl = URL.createObjectURL(file);
      setProfileImage(blobUrl);
    };
    input.click();
  };

  const handleUpdateImage = async (file: File) => {
    if (file) {
      const isUpdated = await updateProfileImage({
        file: file,
        userId: Number(user.id),
      });

      if (!isUpdated || isUpdated.error || isUpdateProfileImageError) {
        setProfileImage("");
      }
      if (isUpdated.error) {
        toast({ title: isUpdated.error });
      }
      setTimeout(async () => {
        await checkAuthUser();
      }, 2000);
    } else {
      console.log("No file selected.");
    }
  };

  const handleRemoveBannerImage = () => {
    removeBanner();
    setBannerImage("");
    setTimeout(async () => {
      await checkAuthUser();
    }, 2000);
  };

  const handleShare = () => {
    copyTextToClipboard(`${location.origin}/profiler/${user.username}  `);
    toast({ title: "Link Cópiado!" });
  };

  const handleOpenModalSyncAccout = () => {
    setModalSyncAccout((prev) => !prev)
  }

  return (
    <div className="w-full h-full relative overflow-y-auto scrollbar bg-gray-50 dark:bg-neutral-900">
      <ModalSyncAccout user={user} open={modalSyncAccout} onClose={() => setModalSyncAccout(false)}/>
      {isUpdating ? (
        <div className="flex justify-center items-center min-h-screen w-full">
          <Loader />
        </div>
      ) : (
        <div className="w-full">
          {/* Header Section with Banner and Avatar */}
          <div className="relative">
            {/* Banner */}
            <div className="relative w-full h-64 sm:h-72 md:h-80 overflow-hidden bg-black select-none">
              {BannerImage && (
                <img
                  src={BannerImage || "/placeholder.svg"}
                  alt="Profile Banner"
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              )}

              {/* Banner Edit Button */}
              <button
                onClick={openFileSelector}
                className="absolute top-4 right-4 w-10 h-10 bg-black/20 backdrop-blur-sm hover:bg-black/30 rounded-full flex items-center justify-center transition-all duration-200 group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-white group-hover:scale-110 transition-transform"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </button>

              {/* Action Buttons - Desktop Only */}
            </div>

            {/* Avatar e Botões de Ação */}
            <div className="relative flex justify-center items-center">
              {/* Avatar */}
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 z-10">
                <div className="relative">
                  <img
                    src={ProfileImage || imageInput || user.imageUrl || userImg}
                    alt={user.username}
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white dark:border-neutral-800 shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onClick={openFileSelectorImage}
                    onError={(e: any) => {
                      e.target.src = userImg
                    }}
                    draggable={false}
                  />
                  {/* Avatar Edit Indicator */}
                  <div className="absolute bottom-3 right-3 w-5 h-5 bg-lime-300 rounded-full flex items-center justify-center shadow-lg transition-colors cursor-pointer"></div>
                </div>
              </div>

              {/* Botões de Ação - Desktop */}
              <div className="absolute -bottom-8 right-4 sm:right-8 md:right-12 hidden md:flex gap-3">
                {/* <Link
                  to={`/profiler/${user.id}/editprofile`}
                  className="hidden h-11 items-center justify-center rounded-full bg-lime-300 hover:bg-lime-400 px-5 text-md font-medium text-black shadow-lg transition-all hover:from-black hover:to-gray-800 hover:shadow-xl dark:from-gray-800 dark:to-gray-900 dark:hover:from-gray-700 dark:hover:to-gray-800 sm:flex md:h-12 md:px-6">
                  Follow
                </Link> */}
                <button onClick={handleShare}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition-all hover:bg-gray-50 hover:shadow-xl dark:bg-neutral-800 dark:hover:bg-neutral-700 md:h-12 md:w-12"
                  aria-label="Share collection"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentcolor"><path d="M274.96-249.7q-95.94 0-163.13-67.17-67.18-67.18-67.18-163.11t67.18-163.13q67.19-67.19 163.13-67.19h111.67q23.67 0 40.13 16.57 16.46 16.58 16.46 40.01 0 23.44-16.46 40.01-16.46 16.58-40.13 16.58H274.96q-49.05 0-83.09 34.16-34.04 34.17-34.04 82.97t34.04 82.97q34.04 34.16 83.09 34.16h111.67q23.67 0 40.13 16.58 16.46 16.57 16.46 40.01 0 23.43-16.46 40.01-16.46 16.57-40.13 16.57H274.96Zm78.93-178.06q-22.09 0-37.55-15.45-15.45-15.46-15.45-37.55 0-22.34 15.33-37.67 15.34-15.33 37.67-15.33h252.22q22.09 0 37.55 15.33 15.45 15.33 15.45 37.67 0 22.09-15.33 37.55-15.34 15.45-37.67 15.45H353.89ZM573.37-249.7q-23.67 0-40.13-16.57-16.46-16.58-16.46-40.01 0-23.44 16.46-40.01 16.46-16.58 40.13-16.58h111.67q49.05 0 83.09-34.16 34.04-34.17 34.04-82.97t-34.04-82.97q-34.04-34.16-83.09-34.16H573.37q-23.67 0-40.13-16.58-16.46-16.57-16.46-40.01 0-23.43 16.46-40.01 16.46-16.57 40.13-16.57h111.67q95.94 0 163.13 67.17 67.18 67.18 67.18 163.11t-67.18 163.13q-67.19 67.19-163.13 67.19H573.37Z" /></svg>
                </button>
                {/* Edit Button - smaller on mobile */}
                <button
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-lg transition-all hover:bg-gray-50 hover:shadow-xl dark:bg-neutral-800 dark:hover:bg-neutral-700 md:h-12 md:w-12"
                  aria-label="Like collection"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentcolor"><path d="M480.12-149q-34.55 0-59.13-24.55-24.58-24.56-24.58-59.04 0-34.58 24.56-59.2 24.55-24.62 59.03-24.62 34.67 0 59.13 24.59 24.46 24.6 24.46 59.13 0 34.54-24.46 59.11Q514.67-149 480.12-149Zm0-247.41q-34.55 0-59.13-24.56-24.58-24.55-24.58-59.03 0-34.67 24.56-59.13 24.55-24.46 59.03-24.46 34.67 0 59.13 24.46t24.46 59.01q0 34.55-24.46 59.13-24.46 24.58-59.01 24.58Zm0-247.18q-34.55 0-59.13-24.64-24.58-24.64-24.58-59.25t24.56-59.06Q445.52-811 480-811q34.67 0 59.13 24.46 24.46 24.45 24.46 59.06t-24.46 59.25q-24.46 24.64-59.01 24.64Z" /></svg>
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
                  {user?.name} {user?.firstname}
                </h1>
                {user?.verified && <VerifiedIcon />}
                {user?.vip && <Crown className="text-yellow-200 w-6 hover:text-yellow-200 hover:cursor-pointer" />}

              </div>
              <div className="flex justify-center items-center gap-2 flex-col">
                {/* Username */}
                <div className="text-gray-500 dark:text-neutral-500 font-medium">@{user?.username}</div>
                <div className="flex justify-center items-center gap-2 select-none" draggable={false}>
                  {user && user.providers && Array.isArray(user.providers) && user.providers.some((provider) => provider && provider.provider === 'GITHUB') && (
                    <div draggable={false}>
                      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 30 30">
                        <path fill="#fff" d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path>
                      </svg>
                    </div>
                  )}
                  {user && user.providers && Array.isArray(user.providers) && user.providers.some((provider) => provider && provider.provider === 'DISCORD') && (
                    <div draggable={false}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612" />
                      </svg>
                    </div>
                  )}
                  {user && user.providers && Array.isArray(user.providers) && user.providers.some((provider) => provider && provider.provider === 'GOOGLE') && (
                    <div draggable={false}>
                      <img draggable={false} src={googleImage} alt="Google" className="w-6" />
                    </div>
                  )}
                  {user && user.providers && Array.isArray(user.providers) && user.providers.some((provider) => provider && provider.provider === 'CREDENTIAL') && (
                    <div draggable={false}>
                      <LockIcon />
                    </div>
                  )}
                  <PlusIcon onClick={handleOpenModalSyncAccout} className="hover:cursor-pointer" />
                </div>
              </div>
              {/* Bio Section */}
              {user?.bio && (
                <div className="mx-4 sm:mx-6 md:mx-8 mb-2">
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
                <button
                  onClick={handleShare}
                  className="px-5 sm:px-6 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-gray-700 dark:text-gray-300 font-medium rounded-full transition-all duration-200 hover:scale-105"
                >
                  <span className="flex items-center gap-1">
                    Share
                  </span>
                </button>

                {/* <Link
                  to={`/profiler/${user.id}/editprofile`}
                  className="px-5 sm:px-6 py-2.5 bg-lime-300 hover:bg-lime-400 text-black font-medium rounded-full transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <span className="flex items-center gap-1">
                    Follow
                  </span>
                </Link> */}
              </div>

              {/* Stats Section */}
              <div className="flex justify-center items-center mt-4 mb-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 w-full lg:w-1/3 gap-1 rounded-xl overflow-hidden border border-gray-200 dark:border-neutral-700">
                  <div className="bg-white dark:bg-neutral-800 p-4 text-center border-r border-b sm:border-b-0 border-gray-200 dark:border-neutral-700">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Following</div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      {user ? user.following.length : 0}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-neutral-800 p-4 text-center border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-neutral-700">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Followers</div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      {user ? user.followers.length : 0}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-neutral-800 p-4 text-center border-r border-gray-200 dark:border-neutral-700">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Posts</div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      {MyPosts.length}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-neutral-800 p-4 text-center">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Collections</div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      {user ? user.colections.length : 0}
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
              MyPosts.length > 0 ? (
                <div className="w-full">
                  <GridPostList posts={MyPosts} />
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
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No posts yet</h3>
                  <p className="text-gray-500 dark:text-gray-400">Share your first post to get started!</p>
                </div>
              )
            ) : (
              <div className="w-full">
                <GridCollections collections={user.colections} user={user} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
