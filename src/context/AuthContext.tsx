import { useNavigate } from "react-router-dom";
import { createContext, useContext, useEffect, useState } from "react";

import { IUser } from "@/types";
import { getCurrentUser } from "@/lib/appwrite/api";

export const INITIAL_USER = {
  id: "",
  username: "",
  email: "",
  imageUrl: "",
  bio: "",
  vip: false,
  verified: false,
  bannerUrl: "",
  colections: [],
  site: "",
  Country: "",
  firstname: "",
  name: "",
};

const checkDarkMode = (): boolean => {
  return localStorage.getItem("DarkMode") === "true";
};

const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
  isDarkMode: checkDarkMode(),
  handleDarkMode: () => {},
  isModalLogin: false,
  setIsModalLogin: (active: boolean) => {},
  search: "",
  setSearch: (text: string) => {},
};

type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
  isDarkMode: boolean;
  handleDarkMode: () => void;
  isModalLogin: boolean;
  setIsModalLogin: (active: boolean) => void;
  search: string;
  setSearch: (text: string) => void;
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isDarkMode, SetisDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalLogin, setIsModalLogin] = useState(false);
  const [search, setSearch] = useState("");
  const [token] = useState(localStorage.getItem("authToken"));

  useEffect(() => {
    const isDarkMode = checkDarkMode();
    SetisDarkMode(isDarkMode);
  }, []);

  const handleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    localStorage.setItem("DarkMode", newDarkMode ? "true" : "false");
    SetisDarkMode(newDarkMode);
  };

  const checkAuthUser = async () => {
    setIsLoading(true);
    try {
      const currentAccount = await getCurrentUser();
      if (currentAccount && !currentAccount.error) {
        setUser({
          id: currentAccount.id,
          username: currentAccount.username,
          email: currentAccount.email,
          imageUrl: currentAccount.imageUrl,
          bio: currentAccount.bio,
          verified: currentAccount.verified,
          bannerUrl: currentAccount.bannerUrl,
          colections: currentAccount.colections,
          site: currentAccount.site,
          Country: currentAccount.Country,
          firstname: currentAccount.firstname,
          name: currentAccount.name,
          ...currentAccount,
        });
        setIsAuthenticated(true);
       

        return true;
      }else{
        setIsAuthenticated(false);
      }

      return false;
    } catch (error) {
      setIsAuthenticated(false);
      console.error(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const cookieFallback = localStorage.getItem("cookieFallback");
    if (
      cookieFallback === "[]" ||
      cookieFallback === null ||
      cookieFallback === undefined
    ) {
      // navigate("/sign-in");
    }

    checkAuthUser();
  }, []);

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
    isDarkMode,
    handleDarkMode,
    isModalLogin,
    setIsModalLogin,
    search,
    setSearch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useUserContext = () => useContext(AuthContext);
