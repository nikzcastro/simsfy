import React, { useEffect, useState } from "react";
import LogoSite from "@/public/assets/images/logo-simsfy.ico"
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useSignInAccount } from "@/lib/react-query/queries";
import { useToast } from "../ui";
import { Loader } from "lucide-react";
import { useUserContext } from "../../context/AuthContext";
import googleImage from "../../public/assets/images/google.png"
interface PoppupLoginProps {
  isModalLogin: boolean;
  setIsModalLogin: (active: boolean) => void;
}
interface FormProps {
  email: string;
  password: string;
}

export default function PoppupLogin({
  isModalLogin,
  setIsModalLogin,
}: PoppupLoginProps) {
  const { toast } = useToast();
  const { user, checkAuthUser, isAuthenticated } = useUserContext();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<FormProps>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const { mutateAsync: signInAccount, isLoading } = useSignInAccount();

  useEffect(() => {
    if (isAuthenticated) {
      setIsOpen(false);
      setIsModalLogin(false);
    }
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setIsModalLogin(false);
    }, 200);
  };

  const handleCreateNewAccount = () => {
    setIsOpen(false);
    setTimeout(() => {
      setIsModalLogin(false);
    }, 200);
    navigate("register");
  };

  const handleLogin = async () => {
    const newErrors = { email: "", password: "" };

    if (!formData.email) {
      newErrors.email = "O campo de email é obrigatório.";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Por favor, insira um email válido.";
    }

    if (!formData.password) {
      newErrors.password = "O campo de senha é obrigatório.";
    }
    if (!newErrors.email && !newErrors.password) {
      const session = await signInAccount(formData);

      if (!session || session.error) {
        toast({
          title: session.error || "Falha no login. Por favor, tente novamente.",
        });
        return;
      } else {
        setFormData({
          email: "",
          password: "",
        });
        localStorage.setItem("authToken", session.refreshToken);
        setIsModalLogin(false);
        setTimeout(async () => {
          await checkAuthUser();
        }, 2000);
        window.location.reload();
      }
    } else {
      if (newErrors.email) {
        toast({ title: newErrors.email });
      } else if (newErrors.password) {
        toast({ title: newErrors.password });
      }
      setTimeout(() => {
        setErrors({ email: "", password: "" });
      }, 2000);
      return;
    }
  };

  const handleProviderLogin = (type: "google" | "discord" | "github") => {
    window.open(`${import.meta.env.VITE_BASE_URL}${type}/callback`, "_self")
    // window.open(`${import.meta.env.VITE_BASE_URL}sync/${type}/callback/${window.location.host}${window.location.pathname}`, "_self")
  };

  const handleResetPassword = () => { };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    setIsOpen(isModalLogin);
  }, [isModalLogin]);

  return !isAuthenticated ? (
    <div
      className={`w-full h-full bg-black/50 backdrop-blur-md z-50 absolute flex justify-center items-center ${isModalLogin ? "block" : "hidden"
        }`}
    >
      <motion.div
        animate={isOpen ? { scale: 1 } : { scale: 0.5 }}
        initial={{ scale: 0.5 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-4 bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="relative p-6 pb-4 border-b border-gray-200 dark:border-neutral-700">
          <button
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
            onClick={handleClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-600 dark:text-gray-400"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>

          <div className="flex flex-col items-center text-center">
            <img src={LogoSite || "/placeholder.svg"} className="w-8 h-8 mb-3" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Welcome to SIMSFY
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Sign in to your account to continue
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Github Login */}
          <button onClick={() => handleProviderLogin("github")} className="w-full h-12 bg-black hover:bg-black text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 30 30">
              <path fill="#fff" d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path>
            </svg>
            Continue with Github
          </button>
          {/* Discord Login */}
          <button onClick={() => handleProviderLogin("discord")} className="w-full h-12 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612" />
            </svg>
            Continue with Discord
          </button>
          <button onClick={() => handleProviderLogin("google")} className="w-full h-12 bg-gray-300 hover:bg-gray-300 text-black/70 font-semibold rounded-xl transition-colors flex items-center justify-center gap-3">
            <img src={googleImage} alt="" className="w-6" />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-neutral-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-neutral-900 text-gray-500 dark:text-gray-400">or</span>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-4">
            {/* Email Field */}
            <div className="relative">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-gray-300 dark:focus:ring-neutral-700 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 animate-pulse">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-gray-300 dark:focus:ring-neutral-700 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  {!showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m15 18-.722-3.25" />
                      <path d="M2 8a10.645 10.645 0 0 0 20 0" />
                      <path d="m20 15-1.726-2.05" />
                      <path d="m4 15 1.726-2.05" />
                      <path d="m9 18 .722-3.25" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1 animate-pulse">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <button
                type="button"
                onClick={handleResetPassword}
                className="text-sm text-black/50 hover:text-black/70 dark:text-white/50 dark:hover:text-white/70 font-medium transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="button"
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full h-12 bg-lime-300 hover:bg-lime-400 disabled:bg-neutral-400 text-black font-semibold rounded-xl transition-colors flex items-center justify-center"
            >
              {isLoading ? <Loader /> : "Sign In"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 space-y-4">
          {/* Terms */}
          <p className="text-xs text-gray-500 dark:text-neutral-400 text-center leading-relaxed">
            By continuing, you agree to the{" "}
            <Link to="/terms" className="text-black/80 hover:text-black/70 dark:text-white/80 dark:hover:text-white/70 font-medium">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-black/80 hover:text-black/70 dark:text-white/80 dark:hover:text-white/70 font-medium">
              Privacy Policy
            </Link>{" "}
            of <span className="font-semibold">Simsfy</span>.
          </p>

          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-neutral-700"></div>

          {/* Create Account */}
          <button
            onClick={handleCreateNewAccount}
            className="w-full h-12 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 text-gray-900 dark:text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            Don't have an account?
            <span className="font-bold">Sign up</span>
          </button>
        </div>
      </motion.div>
    </div>
  ) : null;
}
