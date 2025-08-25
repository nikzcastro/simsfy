import { useLocation, useNavigate } from "react-router-dom";
import { createContext, useContext, useEffect, useState } from "react";
import { IUser } from "@/types";
import { getCurrentUser } from "@/lib/appwrite/api";
import { api } from "@/lib/appwrite/config";
import Cookies from 'js-cookie';
import { Socket } from "dgram";
import { socket } from "@/hooks/socket";

export const INITIAL_USER: IUser = {
  id: "",
  username: "",
  email: "",
  imageUrl: "",
  bio: "",
  coins: 0,
  vip: false,
  verified: false,
  bannerUrl: "",
  colections: [],
  providers: [],
  followers: [],
  following: [],
  site: "",
  Country: "",
  firstname: "",
  name: "",
  isDarkMode: false,
  theme: "dark",
  posts: [],
  file: []
};


const checkDarkMode = (): boolean => {
  return localStorage.getItem("DarkMode") === "true";
};

const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => { },
  setIsAuthenticated: () => { },
  checkAuthUser: async () => false as boolean,
  isDarkMode: checkDarkMode(),
  handleDarkMode: () => { },
  isModalLogin: false,
  setIsModalLogin: (active: boolean) => { },
  search: "",
  socketIsConnected: false,
  setSearch: (text: string) => { },
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
  socketIsConnected: boolean;
  setSearch: (text: string) => void;
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isDarkMode, SetisDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalLogin, setIsModalLogin] = useState(false);
  const [search, setSearch] = useState("");
  const [token] = useState(localStorage.getItem("authToken"));
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    socket.connect();
    function onConnect() {
      setIsConnected(true);
    }


    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("updateUser", (a, b, c) => {
      if (isAuthenticated) {
        checkAuthUser()
      }
    });
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const authToken = Cookies.get('authToken');
    if (!authToken || authToken == undefined) {
      setUser(INITIAL_STATE)
      setIsAuthenticated(false)
      localStorage.removeItem("authToken");
      if (["profile"].includes(location.pathname)) {
        navigate('/')
      }
    }
  }, [Cookies.get('authToken')])
  useEffect(() => {
    // const isDarkMode = checkDarkMode();
    // SetisDarkMode(isDarkMode);

    const authToken = Cookies.get('authToken');
    if (!authToken || authToken == undefined) {
      setUser(INITIAL_STATE)
      setIsAuthenticated(false)
      localStorage.removeItem("authToken");
      if (["profile"].includes(location.pathname)) {
        navigate('/')
      }
    }
    if (user.theme === "dark") {
      SetisDarkMode(true);
    } else {
      SetisDarkMode(false);
    }

  }, [user]);

  const handleDarkMode = () => {
    // const newDarkMode = !isDarkMode;
    // localStorage.setItem("DarkMode", newDarkMode ? "true" : "false");
    // SetisDarkMode(newDarkMode);
    let theme = "dark"
    if (user.theme == "light") {
      theme = "dark"
    } else {
      theme = "light"
    }
    api.post('updateTheme', {
      theme: theme
    })
    SetisDarkMode((prev) => !prev);
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
          providers: currentAccount.providers,
          ...currentAccount,
        });
        setIsAuthenticated(true);
        if (user.theme === "dark") {
          SetisDarkMode(true);
        } else {
          SetisDarkMode(false);
        }

        return true;
      } else {
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
    socketIsConnected: isConnected
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useUserContext = () => useContext(AuthContext);
