import { useUserContext } from "@/context/AuthContext";
import React, { useEffect, useState } from "react";
import { useSignOutAccount } from "../../lib/react-query/queries";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "@/public/assets/icons/user.svg"
interface AccountProps {
  isDropDown: boolean;
  SetDropDown: (active: boolean) => void;
}
export function AccountDropdown({ isDropDown, SetDropDown }: AccountProps) {
  const { user, isAuthenticated, isModalLogin, setIsModalLogin } =
    useUserContext();
  const navigate = useNavigate();
  const { mutateAsync: QueryLogout } = useSignOutAccount();

  const toggleDropdown = () => SetDropDown(!isDropDown);

  const handleLogin = () => {
    toggleDropdown();
    setIsModalLogin(true);
  };
  const handleLogout = () => {
    toggleDropdown();
    QueryLogout();
    window.location.reload();
  };
  const handleAbout = () => {
    toggleDropdown();
    navigate("/about");
  };
    const handleVip = () => {
    toggleDropdown();
    navigate("/vip");
  };
  const handleProfile = () => {
    toggleDropdown();
    navigate("/profile");
  };
  const handleNewUpload = () => {
    toggleDropdown();
    navigate("newPost");
  };
  return (
  <div className="relative w-full h-full z-[100]">
    {isDropDown && (
      <div
        className={`absolute right-0 mt-2 bg-white dark:bg-neutral-800 rounded-xl shadow-lg ring-1 ring-black/5 dark:ring-white/10 transform origin-top-right transition-all duration-200 ease-out ${
          !isAuthenticated ? "p-2 w-24" : "p-3 w-64"
        } z-10`}
        onClick={(e) => e.stopPropagation()}>
        
        {/* Authenticated User Information */}
        {isAuthenticated && (
          <>
            <div className="flex items-center space-x-3 px-2 py-1.5">
              <img
                src={user.imageUrl || "/placeholder.svg"}
                alt="Avatar"
                className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-neutral-700"
                onErrorCapture={(e: any) => {
                  e.target.onerror = null;
                  e.target.src = defaultAvatar;
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                  {user.username}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-neutral-600 to-transparent my-2"></div>
          </>
        )}

        {/* Menu Items */}
        <div className="flex flex-col items-center space-y-1 px-1">
          {isAuthenticated ? (
            <>
              <button
                onClick={handleProfile}
                className="w-full text-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700 hover:font-medium rounded-lg transition-all duration-150"
              >
                Profile
              </button>
              <button
                onClick={handleNewUpload}
                className="w-full text-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700 hover:font-medium rounded-lg transition-all duration-150"
              >
                New Post
              </button>
              <button
                onClick={handleNewUpload}
                className="w-full text-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700 hover:font-medium rounded-lg transition-all duration-150">
                Preferences
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700 hover:font-medium rounded-lg transition-all duration-150">
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={handleLogin}
              className="w-full text-center px-3 py-2 bg-gray-50 dark:bg-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-600 text-gray-800 dark:text-gray-100 font-medium text-sm rounded-lg transition-all duration-200 hover:shadow-sm"
            >
              Login
            </button>
          )}
        </div>
      </div>
    )}
  </div>
);
}
