import React, { useEffect, useState } from "react";
import LogoSite from "@/public/assets/images/logo-simsfy.ico"
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCreateUserAccount } from "@/lib/react-query/queries"; // Novo hook para registro
import { useToast } from "../ui";
import { Loader } from "lucide-react";
import { useUserContext } from "../../context/AuthContext";
import GoogleLogin from "react-google-login";

interface PoppupRegisterProps {
  isModalRegister: boolean;
  setIsModalRegister: (active: boolean) => void;
}
interface FormProps {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export default function PoppupRegister() {
  const { toast } = useToast();
  const { isDarkMode, isModalLogin, setIsModalLogin, isAuthenticated } =
    useUserContext();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [formData, setFormData] = useState<FormProps>({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const { mutateAsync: signInAccount, isLoading } = useCreateUserAccount();
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    if (isAuthenticated) {
      setIsOpen(false);
      setIsModalLogin(false);
    }
  }, []);

  const handleGoolgeLogin = () => {};

  const handleRegister = async () => {
    const newErrors = {
      email: "",
      password: "",
      confirmPassword: "",
      username: "",
    };
    if (!formData.email) {
      newErrors.email = "O campo de email é obrigatório.";
      toast({ title: newErrors.email });
      return;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Por favor, insira um email válido.";
      toast({ title: newErrors.email });
      return;
    }

    if (!formData.password) {
      newErrors.password = "O campo de senha é obrigatório.";
      toast({ title: newErrors.password });
      return;
    } else if (formData.password.length < 4) {
      newErrors.password = "A senha deve ter pelo menos 4 caracteres.";
      toast({ title: newErrors.password });
      return;
    }
    if (!formData.username) {
      newErrors.username = "O campo de username é obrigatório.";
      toast({ title: newErrors.username });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem.";

      toast({ title: newErrors.confirmPassword });
      return;
    }

    if (!newErrors.email && !newErrors.password && !newErrors.confirmPassword) {
      const session = await signInAccount(formData);
      if (!session || session.error) {
        toast({
          title:
            session.error || "Falha no registro. Por favor, tente novamente.",
        });
        return;
      } else {
        setFormData({
          email: "",
          password: "",
          confirmPassword: "",
          username: "",
        });
        toast({ title: "Registro realizado com sucesso!" });
        setIsModalLogin(true);
        navigate("/");
      }
    } else {
      Object.values(newErrors).forEach((error) => {
        if (error) toast({ title: error });
        toast({ title: error });
      });
      setErrors(newErrors);
      return;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleSuccess = (response) => {
    console.log("handleGoogleSuccess", response);
  };
  const handleGoogleError = () => {
    console.log("handleGoogleError");
  };
  const handleGoogleFailure = (response) => {
    console.log("handleGoogleFailure", response);
  };

  return (
    <div className="w-full bg-gray-200 dark:bg-neutral-950 pt-6 z-50 flex justify-center items-center overflow-hidden">
  <motion.div className="w-full max-w-md mx-4 rounded-3xl overflow-hidden" >
    {/* Header */}
    <div className="relative p-6 pb-4 border-b border-gray-200 dark:border-neutral-700">
      <button
        className="absolute hidden top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
        onClick={() => navigate("/")}
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
        <img src={LogoSite || "/placeholder.svg"} className="w-8 h-8 mb-3 hidden md:flex" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Create your SIMSFY account
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Join our community and start sharing
        </p>
      </div>
    </div>

    {/* Content */}
    <div className="p-6">
      <form className="space-y-4">
        {/* Username Field */}
        <div className="relative">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Username
          </label>
          <input
            name="username"
            type="text"
            value={formData.username}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-gray-300 dark:focus:ring-neutral-800 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
            placeholder="Choose a username"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1 animate-pulse">
              {errors.username}
            </p>
          )}
        </div>

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
            className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-gray-300 dark:focus:ring-neutral-800 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
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
              className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-gray-300 dark:focus:ring-neutral-800 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
              placeholder="Create a password"
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
          
          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="w-full mt-2">
              <div className="flex items-center gap-1">
                <div className={`h-1 flex-1 rounded-full ${formData.password.length > 8 ? 'bg-lime-500' : 'bg-gray-300 dark:bg-neutral-700'}`}></div>
                <div className={`h-1 flex-1 rounded-full ${/[A-Z]/.test(formData.password) ? 'bg-lime-500' : 'bg-gray-300 dark:bg-neutral-700'}`}></div>
                <div className={`h-1 flex-1 rounded-full ${/[0-9]/.test(formData.password) ? 'bg-lime-500' : 'bg-gray-300 dark:bg-neutral-700'}`}></div>
                <div className={`h-1 flex-1 rounded-full ${/[^A-Za-z0-9]/.test(formData.password) ? 'bg-lime-500' : 'bg-gray-300 dark:bg-neutral-700'}`}></div>
              </div>
              <div className="flex justify-between text-xs mt-1 text-gray-500 dark:text-gray-400">
                <span>8+ chars</span>
                <span>Uppercase</span>
                <span>Number</span>
                <span>Symbol</span>
              </div>
            </div>
          )}
          
          {errors.password && (
            <p className="text-red-500 text-sm mt-1 animate-pulse">
              {errors.password}
            </p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="relative">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-gray-300 dark:focus:ring-neutral-800 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
              placeholder="Confirm your password"
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
          
          {/* Password Match Indicator */}
          {formData.confirmPassword && (
            <div className="w-full mt-2">
              {formData.password === formData.confirmPassword ? (
                <p className="text-sm text-lime-500 flex items-center gap-1">
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
          
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1 animate-pulse">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Register Button */}
        <button
          type="button"
          onClick={handleRegister}
          disabled={isLoading}
          className="w-full h-12 bg-lime-300 hover:bg-lime-300 disabled:bg-neutral-400 text-black font-semibold rounded-xl transition-colors flex items-center justify-center mt-6"
        >
          {isLoading ? <Loader /> : "Create Account"}
        </button>
      </form>
    </div>

    {/* Footer */}
    <div className="p-6 pt-0 space-y-4">
      {/* Terms */}
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center leading-relaxed">
            By creating an account, you agree to our{" "}
            <a href="/terms" className="text-black/80 hover:text-black/70 dark:text-white/80 dark:hover:text-white/70 font-medium">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-black/80 hover:text-black/70 dark:text-white/80 dark:hover:text-white/70 font-medium">
              Privacy Policy
            </a>.
        </p>


      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-neutral-700"></div>

      {/* Login Link */}
      <div className="w-full h-12 bg-gray-100 dark:bg-neutral-800 disabled:bg-neutral-400 text-black font-semibold rounded-xl transition-colors flex items-center justify-center mt-6">
        <span className="text-gray-600 dark:text-gray-400 text-sm">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-black hover:text-black/70 dark:text-white dark:hover:text-white/70 font-medium transition-colors"
          >
            Sign in
          </button>
        </span>
      </div>
    </div>
  </motion.div>
</div>
  );
}
