import React, { useEffect, useState } from "react";
import { Button, Form, Input, Label, useToast } from "../../components/ui";
import DefaultImage from "../../public/assets/icons/user.svg";
import { useUserContext } from "../../context/AuthContext";
import { IUser } from "../../types";
import {
  useRemoveBanner,
  useUpdateBanner,
  useUpdateProfileImage,
  useUpdateUser,
} from "../../lib/react-query/queries";
import { Loader } from "../../components/shared";
import { api } from "../../lib/appwrite/config";
import { Eye } from "lucide-react";
import { motion } from "framer-motion";

export default function Editprofile() {
  const [page, setPage] = useState<"delete" | "edit" | "email">("edit");
  const { user, isLoading: isUserLoading, checkAuthUser } = useUserContext();
  const [userS, setUser] = useState<IUser>(user);
  const [imageInput, setImageInput] = useState<string>("");
  const [BannerImage, setBannerImage] = useState<string>("");
  const [ProfileImage, setProfileImage] = useState<string>("");
  const { toast } = useToast();
  const {
    mutateAsync: updateUser,
    isLoading: isUpdating,
    error: updateError,
  } = useUpdateUser();
  const [isEditing, setIsEditing] = useState(false);
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
  const [name, setName] = useState("");
  const [firstName, setFirstName] = useState("");
  useEffect(() => {
    setUser(user);
  }, [user, page]);
  const handleInputChange = (field: keyof IUser, value: string) => {
    setUser((prev) => ({ ...prev, [field]: value }));
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
        location.reload();
      }, 2000);
    } else {
      console.log("No file selected.");
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
        location.reload();
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

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    await updateUser({
      ...user,
      id: userS.id,
      email: user.email,
      verified: user.verified,
      bio: userS.bio,
      username: userS.username,
      colections: userS.colections,
      site: userS.site,
      Country: userS.Country,
      firstname: userS.firstname,
      name: userS.name,
    });
    location.reload();
    setTimeout(async () => {
      await checkAuthUser();
    }, 2000);
  };

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailPasswordUpdate = async (e) => {
    e.preventDefault();
    const response = await api.put("updateEmail", {
      userId: user.id,
      email: user.email,
      currentPassword,
      newPassword,
      confirmNewPassword,
    });
    if (response.error) {
      toast({ title: response.error });
      return;
    }
    if (response) {
      toast({ title: "Email updated successfully" });
      setTimeout(() => {
        location.reload();
      }, 3000);
    }
  };

  const handleConfirmDelete = async () => {
    await api.post("deleteUser", { userId: user.id });
  };
  const handleCancelDelete = () => {
    setPage("edit");
  };

  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const toggleOptions = () => {
    setIsOptionsOpen((prev) => !prev);
  };

  return (
    <div className="w-full h-full flex flex-col md:flex-row justify-between items-start select-none dark:text-white text-black">
      <div className="hidden lg:flex lg:w-80 lg:min-h-screen  bg-white dark:bg-neutral-800 border-r border-gray-200 dark:border-neutral-700 p-6">
        <div className="w-full pt-20">
          <button
          onClick={() => setPage("edit")}
          className={`group flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 ${
            page === "edit"
              ? "bg-lime-300 text-black shadow-lg"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
          <span className="font-medium">Edit Profile</span>
          {page === "edit" && (
            <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
          )}
        </button>
          <button
          onClick={() => setPage("email")}
          className={`group flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 ${
            page === "email"
              ? "bg-lime-300 text-black shadow-lg"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
          <span className="font-medium">Security</span>
          {page === "email" && (
            <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
          )}
        </button>
          <button
          onClick={() => setPage("delete")}
          className={`group flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 ${
            page === "delete"
              ? "bg-red-600 text-white shadow-lg"
              : "text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
          <span className="font-medium">Delete Account</span>
          {page === "delete" && (
            <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
          )}
        </button>
        </div>
      </div>
      <motion.div
        initial={{ width: "0%"}}
        animate={{ width: isOptionsOpen ? "100%" : "0%" }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className="lg:hidden absolute">
        {/* Ícone do menu */}
        <div onClick={toggleOptions} className="cursor-pointer p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-menu">
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </div>

        {/* Dropdown de opções */}
        {isOptionsOpen && (
          <div className="bg-[#1D1D1D]/80 p-4 rounded-lg mt-2 flex flex-col text-black">
            <Button
              variant="destructive"
              onClick={() => setPage("edit")}
              className={`hover:bg-[#1D1D1D] hover:dark:bg-[#3b3b3b] ${page === "edit" ? "lg:bg-[#1D1D1D] dark:bg-[#3b3b3b]" : ""} hover:transition-all hover:duration-300 rounded-lg p-3`}>
              Edit Profile
            </Button>
            <Button
              variant="destructive"
              onClick={() => setPage("email")}
              className={`hover:bg-[#1D1D1D] hover:dark:bg-[#3b3b3b] ${page === "email" ? "lg:bg-[#1D1D1D] dark:bg-[#3b3b3b]" : ""} hover:transition-all hover:duration-300 rounded-lg p-3`}>
              Email and Password
            </Button>
            <Button
              variant="destructive"
              onClick={() => setPage("delete")}
              className={`hover:bg-[#1D1D1D] hover:dark:bg-[#3b3b3b] ${page === "delete" ? "lg:bg-[#1D1D1D] dark:bg-[#3b3b3b]" : ""} hover:transition-all hover:duration-300 p-3`}>
              Delete Account
            </Button>
          </div>
        )}
      </motion.div>
      {page === "delete" && (
        <div className="w-full h-full flex justify-center items-start">
          <div className="w-full h-full bg-black/50 fixed inset-0 flex justify-center items-center z-50 lg:p-0 p-4">
            <div className="w-md  lg:w-[400px] bg-white dark:bg-[#1D1D1D] text-black dark:text-white rounded-lg p-6 shadow-lg flex flex-col gap-2">
              <h2 className="text-lg font-bold text-center">
                Confirm Account Deletion
              </h2>
              <p className="text-center">
                Are you sure you want to delete your account? This action is
                irreversible.
              </p>
              <div className="flex justify-between items-center gap-2">
                <Button
                  variant="destructive"
                  onClick={handleConfirmDelete}
                  className="flex-1 bg-red hover:bg-red-600 text-white rounded-lg py-2 px-4 text-center">
                  Confirm
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleCancelDelete}
                  className="flex-1 bg-gray-600 dark:bg-green-700 dark:text-white hover:bg-green-400 dark:hover:bg-green-600 rounded-lg py-2 px-4 text-center">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {page === "edit" && (
          <div className="w-full h-full flex flex-col justify-start items-center gap-10 text-black dark:text-white p-4 sm:p-6 lg:p-10 overflow-auto pb-[15vh] bg-gray-50 dark:bg-neutral-900">
      {/* Header */}
      <div className="w-full md:w-1/2 text-center ">
      <h1 className="text-2xl md:text-3xl font-bold mb-4">Edit Profile</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Keep your personal information private. The information you add here is visible to anyone who can view your profile.
      </p>
    </div>

  <form className="flex flex-col w-full md:w-1/2 justify-center items-start gap-8 pb-20">
    {/* Banner Section */}
    <div className="flex flex-col gap-3 w-full">
      <label className="font-semibold text-gray-900 dark:text-white">Banner Image</label>
      <div className="relative group w-full">
        <div className="w-full h-48 bg-gray-100 dark:bg-neutral-800 rounded-2xl overflow-hidden relative">
          <img
            src={userS.bannerUrl || "/placeholder.svg"}
            alt="Banner"
            className="w-full h-full object-cover"
            onError={(e: any) => {
              e.target.src = DefaultImage;
            }}
          />
          
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer"
            onClick={openFileSelector}
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Profile Picture Section */}
    <div className="flex flex-col w-full gap-3">
      <label className="font-semibold text-gray-900 dark:text-white">Profile Picture</label>
      <div className="flex justify-center items-center">
        <div className="relative group">
          <div className="w-28 h-28 bg-gray-100 dark:bg-neutral-800 rounded-full overflow-hidden">
            <img
              src={userS.imageUrl || "/placeholder.svg"}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e: any) => {
                e.target.src = DefaultImage;
              }}
            />
          </div>
          
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer rounded-full"
            onClick={openFileSelectorImage}
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
              <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Name Fields */}
    <div className="flex flex-col w-full gap-3">
      <label className="font-semibold text-gray-900 dark:text-white">First and Last Name</label>
      <div className="flex lg:flex-row flex-col justify-center items-center gap-4">
        <input
          type="text"
          placeholder="First name"
          className="w-full h-12 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white border border-gray-200 dark:border-neutral-700 focus:ring-2 focus:ring-gray-300 dark:focus:ring-neutral-700 outline-none focus:border-transparent rounded-xl px-4 transition-all duration-200"
          value={userS.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
        />
        <input
          type="text"
          placeholder="Last name"
          className="w-full h-12 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white border border-gray-200 dark:border-neutral-700 focus:ring-2 focus:ring-gray-300 dark:focus:ring-neutral-700 outline-none focus:border-transparent rounded-xl px-4 transition-all duration-200"
          value={userS.firstname}
          onChange={(e) => handleInputChange("firstname", e.target.value)}
        />
      </div>
    </div>

    {/* Bio Field */}
    <div className="flex flex-col gap-3 w-full">
      <label className="font-semibold text-gray-900 dark:text-white">Bio</label>
      <div className="relative">
        <textarea
          placeholder="Tell us about yourself..."
          rows={4}
          className="w-full bg-white dark:bg-neutral-800 text-gray-900 dark:text-white border border-gray-200 dark:border-neutral-700 focus:ring-2 focus:ring-gray-300 dark:focus:ring-neutral-700 outline-none focus:border-transparent rounded-xl px-4 py-3 resize-none transition-all duration-200"
          value={userS.bio}
          onChange={(e) => handleInputChange("bio", e.target.value)}
        />
        <div className="absolute bottom-3 right-3 text-xs text-gray-400">
          {userS.bio?.length || 0}/160
        </div>
      </div>
    </div>

    {/* Website Field */}
    <div className="flex flex-col gap-3 w-full">
      <label className="font-semibold text-gray-900 dark:text-white">Website</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
          </svg>
        </div>
        <input
          type="url"
          placeholder="https://yourwebsite.com"
          className="w-full h-12 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white border border-gray-200 dark:border-neutral-700 focus:ring-2 focus:ring-gray-300 dark:focus:ring-neutral-700 outline-none focus:border-transparent rounded-xl pl-12 pr-4 transition-all duration-200"
          value={userS.site}
          onChange={(e) => handleInputChange("site", e.target.value)}
        />
      </div>
    </div>

    {/* Username and Country */}
    <div className="flex flex-col gap-3 w-full">
      <div className="flex lg:flex-row flex-col justify-center items-center gap-4">
        <div className="flex flex-col justify-center items-start gap-2 w-full">
          <label className="font-semibold text-gray-900 dark:text-white">Username</label>
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-gray-400">@</span>
            </div>
            <input
              type="text"
              placeholder="username"
              className="w-full h-12 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white border border-gray-200 dark:border-neutral-700 focus:ring-2 focus:ring-gray-300 dark:focus:ring-neutral-700 outline-none focus:border-transparent rounded-xl pl-8 pr-4 transition-all duration-200"
              value={userS.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col justify-center items-start gap-2 w-full">
          <label className="font-semibold text-gray-900 dark:text-white">Country</label>
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Your country"
              className="w-full h-12 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white border border-gray-200 dark:border-neutral-700 focus:ring-2 focus:ring-gray-300 dark:focus:ring-neutral-700 outline-none focus:border-transparent rounded-xl pl-12 pr-4 transition-all duration-200"
              value={userS.Country}
              onChange={(e) => handleInputChange("Country", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>

    {/* Save Button */}
    {user !== userS && (
      <button
        type="button"
        onClick={handleSaveChanges}
        disabled={isUpdating}
        className="w-full h-12 bg-lime-300 hover:bg-lime-400 text-black font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] disabled:hover:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
      >
        {isUpdating ? (
          <div className="flex items-center justify-center gap-2">
            <Loader />
            <span>Saving Changes...</span>
          </div>
        ) : (
          "Save Changes"
        )}
      </button>
    )}
  </form>
</div>
      )}
      {page === "email" && (
        <div className="w-full min-h-screen flex flex-col justify-start items-center gap-10 text-black dark:text-white p-4 sm:p-6 lg:p-10 overflow-y-auto pb-32 bg-gray-50 dark:bg-neutral-900">
  {/* Header */}
  <div className="w-full md:w-1/2 text-center">
    <h1 className="text-2xl md:text-3xl font-bold mb-4">Security Settings</h1>
    <p className="text-gray-600 dark:text-gray-400">
      Change your account email and password here. Keep your account secure with a strong password.
    </p>
  </div>

  <form className="flex flex-col w-full md:w-1/2 justify-center items-start gap-8 mb-20">
    {/* Email Field */}
    <div className="flex flex-col gap-3 w-full">
      <label className="font-semibold text-gray-900 dark:text-white">Email Address</label>
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
        </div>
        <input
          type="email"
          placeholder="Your email address"
          className="w-full h-12 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white border border-gray-200 dark:border-neutral-700 focus:ring-2 focus:ring-gray-300 dark:focus:ring-neutral-700 outline-none focus:border-transparent rounded-xl pl-12 pr-4 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          value={user.email}
          disabled
        />
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
          <span className="px-2 py-1 bg-gray-100 dark:bg-neutral-700 text-gray-500 dark:text-gray-400 text-xs rounded-md">
            Verified
          </span>
        </div>
      </div>
    </div>

    {/* Current Password Field */}
    <div className="flex flex-col gap-3 w-full">
      <label className="font-semibold text-gray-900 dark:text-white">Current Password</label>
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
        </div>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter your current password"
          className="w-full h-12 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white border border-gray-200 dark:border-neutral-700 focus:ring-2 focus:ring-gray-300 dark:focus:ring-neutral-700 outline-none focus:border-transparent rounded-xl pl-12 pr-12 transition-all duration-200"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
          )}
        </button>
      </div>
    </div>

    {/* New Password Field */}
    <div className="flex flex-col gap-3 w-full">
      <label className="font-semibold text-gray-900 dark:text-white">New Password</label>
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
          </svg>
        </div>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter your new password"
          className="w-full h-12 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white border border-gray-200 dark:border-neutral-700 focus:ring-2 focus:ring-gray-300 dark:focus:ring-neutral-700 outline-none focus:border-transparent rounded-xl pl-12 pr-12 transition-all duration-200"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
          )}
        </button>
      </div>
      
      {/* Password Strength Indicator */}
      {newPassword && (
        <div className="w-full">
          <div className="flex items-center gap-2">
            <div className={`h-1 flex-1 rounded-full ${newPassword.length > 8 ? 'bg-green-500' : 'bg-gray-300 dark:bg-neutral-700'}`}></div>
            <div className={`h-1 flex-1 rounded-full ${/[A-Z]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-300 dark:bg-neutral-700'}`}></div>
            <div className={`h-1 flex-1 rounded-full ${/[0-9]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-300 dark:bg-neutral-700'}`}></div>
            <div className={`h-1 flex-1 rounded-full ${/[^A-Za-z0-9]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-300 dark:bg-neutral-700'}`}></div>
          </div>
          <div className="flex justify-between text-xs mt-1 text-gray-500 dark:text-gray-400">
            <span>8+ chars</span>
            <span>Uppercase</span>
            <span>Number</span>
            <span>Symbol</span>
          </div>
        </div>
      )}
    </div>

    {/* Confirm New Password Field */}
    <div className="flex flex-col gap-3 w-full">
      <label className="font-semibold text-gray-900 dark:text-white">Confirm New Password</label>
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
        </div>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Confirm your new password"
          className={`w-full h-12 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white border ${
            confirmNewPassword && newPassword !== confirmNewPassword 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-gray-200 dark:border-neutral-700 focus:ring-gray-300 dark:focus:ring-neutral-700 outline-none'
          } focus:border-transparent rounded-xl pl-12 pr-12 transition-all duration-200`}
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
          )}
        </button>
      </div>
      
      {/* Password Match Indicator */}
      {confirmNewPassword && (
        <div className="w-full">
          {newPassword === confirmNewPassword ? (
            <p className="text-sm text-green-500 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
              </svg>
              Passwords match
            </p>
          ) : (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              Passwords don't match
            </p>
          )}
        </div>
      )}
    </div>

    {/* Update Button */}
    <button
      type="button"
      onClick={handleEmailPasswordUpdate}
      disabled={isUpdating}
      className="w-full h-12 bg-lime-300 hover:bg-lime-400 text-black font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] disabled:hover:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl mt-4"
    >
      {isUpdating ? (
        <div className="flex items-center justify-center gap-2">
          <Loader />
          <span>Updating...</span>
        </div>
      ) : (
        "Update Password"
      )}
    </button>
    
    {/* Scroll Behavior Script */}
    <script dangerouslySetInnerHTML={{
      __html: `
        document.querySelectorAll('input, textarea').forEach(input => {
          input.addEventListener('focus', () => {
            setTimeout(() => {
              input.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
          });
        });
      `
    }} />
  </form>
</div>
      )}

      {/* <div className="w-full h-full bg-green-500/40 flex justify-center items-start"></div> */}
    </div>
  );
}
