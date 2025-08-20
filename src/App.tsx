import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Home } from "@/_root/pages";
import RootLayout from "./_root/RootLayout";
import { Toaster } from "@/components/ui/toaster";
import { useUserContext } from "./context/AuthContext";
import PoppupLogin from "./components/shared/PoppupLogin";
import { useEffect } from "react";
import PoppupRegister from "./components/shared/PoppupRegister";
import { useToast } from "./components/ui";
import "./globals.css";
import Profile from "./_root/pages/Profile";
import About from "./_root/pages/About";
import Vip from "./_root/pages/Vip";
import PostUpload from "./_root/pages/PostUpload";
import HallFame from "./_root/pages/HallFame";
import UserProfile from "./_root/pages/UserProfile";
import PostProfile from "./_root/pages/PostProfile";
import Terms from "./_root/pages/Terms";
import Collection from "./components/shared/Collection";
import Collections from "./_root/pages/Collections";
import Editprofile from "./_root/pages/Editprofile";
import Categories from "./_root/pages/Categories";

const App = () => {
  const { isDarkMode, isModalLogin, setIsModalLogin, checkAuthUser } =
    useUserContext();

  useEffect(() => {
    checkAuthUser();
  }, []); 

  return (
    <div className={`${isDarkMode && "dark"}`}>
      <main
        className={`w-screen h-screen flex justify-center items-start dark:text-white bg-gray-200 dark:bg-neutral-950 text-black transition-all duration-500 overflow-hidden`}>
        <PoppupLogin
          isModalLogin={isModalLogin}
          setIsModalLogin={setIsModalLogin}
        />
        <Routes>
          <Route element={<RootLayout />}>
            {/* public routes */}
            <Route path="/*" element={<Home />} />
            <Route path="/Categories/:id/:subid?" element={<Categories />}></Route>
            <Route path="/register/*" element={<PoppupRegister />}></Route>
            <Route path="/terms" element={<Terms />}></Route>
            <Route path="/about/*" element={<About />}></Route>
            <Route path="/vip/*" element={<Vip />}></Route>
            <Route path="/search/*" element={<></>}></Route>
            <Route path="/Members/" element={<HallFame />}></Route>
            <Route path="/profiler/:id/*" element={<UserProfile />}></Route>
            <Route path="/post/:id/*" element={<PostProfile />}></Route>
            {/* private routes */}
            <Route
              path="/saves/*"
              element={
                <PrivateRoutes>
                  <></>
                </PrivateRoutes>
              }></Route>
            <Route path="/collection/:id" element={<Collections />}></Route>
            <Route
              path="/profile"
              element={
                <PrivateRoutes>
                  <Profile />
                </PrivateRoutes>
              }></Route>
            <Route
              path="/profile/:id/editprofile/*"
              element={
                <PrivateRoutes>
                  <Editprofile />
                </PrivateRoutes>
              }></Route>
            <Route
              path="/newPost/*"
              element={
                <PrivateRoutes>
                  <PostUpload />
                </PrivateRoutes>
              }></Route>
          </Route>
          <Route path="*" element={<ReturnHome />}></Route>
        </Routes>

        <Toaster />
      </main>
    </div>
  );
};

const PrivateRoutes = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, setIsModalLogin, checkAuthUser } = useUserContext();
  const location = useLocation();

  useEffect(() => {
    const userAuth = async () => {
      await checkAuthUser();
    };
    userAuth();
  }, []);

  if (!isAuthenticated) {
    setIsModalLogin(true);
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
const ReturnHome = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/");
  }, []);
  return <></>;
};
export default App;
