import { Outlet, useLocation } from "react-router-dom";

import Topbar from "@/components/shared/Topbar";
import Bottombar from "@/components/shared/Bottombar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Loader } from "@/components/shared";

const RootLayout = () => {
  const [updateRout, setUpdateRout] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setUpdateRout(false);
    setTimeout(() => {
      setUpdateRout(true);
    }, 1000);
  }, [location.pathname]);

  return (
    <div className="w-full h-full md:flex lg:justify-start lg:items-center lg:mt-0 flex-col overflow-hidden">
      <Topbar />
      {updateRout ? (
        <motion.div
          animate={updateRout ? { opacity: 1 } : { opacity: 0 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full h-full">
          <Outlet />
        </motion.div>
      ) : (
        <div className="w-full h-full flex justify-center items-center text-dark dark:text-white">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default RootLayout;
