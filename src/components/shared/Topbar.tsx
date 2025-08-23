import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useUserContext } from "@/context/AuthContext";
import { useSignOutAccount } from "@/lib/react-query/queries";
import LogoSite from "@/public/assets/images/logo-simsfy.ico"
import DefaultUserImage from "@/public/assets/icons/user.svg"
import { motion } from "framer-motion";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import "./css/dropdown.css";
import { AccountDropdown } from "./AccountDropdown";
import { blockRouts } from "../../types";
import { useTranslation } from 'react-i18next'

const Topbar = () => {
  const { user, isAuthenticated, isModalLogin, setIsModalLogin, search, setSearch } =
    useUserContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchInput, SetsearchInput] = useState("");
  const [isDropDown, SetDropDown] = useState(false);
  const { isDarkMode, handleDarkMode } = useUserContext();
  const { i18n } = useTranslation()

  const languages = [
    { code: 'en', label: 'EN-US' },
    { code: 'pt-BR', label: 'PT-BR' },
    { code: 'pt-PT', label: 'PT-PT' },
    { code: 'fr', label: 'FR-FR' },
    { code: 'de', label: 'DE' },
    { code: 'ru', label: 'RU' }

  ]
  // const { mutate: signOut, isSuccess } = useSignOutAccount();

  // useEffect(() => {
  //   if (isSuccess) navigate(0);
  // }, [isSuccess]);

  // useEffect(() => {
  //   SetDropDown(false);
  // }, [location.pathname]);

  const handleNewUpLoad = () => {
    navigate("newPost");
  };
  const handleDropDown = () => {
    SetDropDown((prevent) => !prevent);
  };

  const handleHome = () => {
    navigate("/");
  };
  const handleSearch = () => { };
  const handleSaves = () => { };

  return (
    <>
      <section className="hidden md:flex w-full h-auto bg-gray-100 dark:bg-neutral-900 py-3 justify-between items-center px-2">
        <div className="flex justify-start items-center gap-2">
          <Link to="/" className="h-8 w-8 rounded-full flex justify-center items-center hover:cursor-pointer">
            <img
              src={LogoSite || "/placeholder.svg"}
              alt="logo"
              className="w-full h-full bg-center bg-cover rounded-full"
            />
          </Link>

          {user && isAuthenticated && (
            <Link
              to="/foryou"
              className={`w-auto px-4 h-10 bg-gray-200 hover:bg-gray-200 hover:dark:bg-neutral-800/70 ${location.pathname === "/foryou" ? "dark:bg-neutral-800 text-black dark:text-white" : " bg-transparent"
                }  rounded-full flex justify-center items-center font-semibold text-sm hover:cursor-pointer transition-all duration-500`}
            >
              <span className="select-none">For You</span>
            </Link>
          )}

          <Link
            to="/"
            className={`w-auto px-4 h-10 bg-gray-200 hover:bg-gray-200 hover:dark:bg-neutral-800/70 ${location.pathname === "/categories"
                ? "dark:bg-neutral-800 text-black dark:text-white"
                : " bg-transparent dark:text-white text-black"
              }  rounded-full flex justify-center items-center font-semibold text-sm hover:cursor-pointer transition-all duration-500`}
          >
            <span>Categories</span>
          </Link>

          <Link
            to="/"
            className={`w-auto px-4 h-10 bg-gray-200 hover:bg-gray-200 hover:dark:bg-neutral-800/70 ${location.pathname === "/collections"
                ? "dark:bg-neutral-800 text-black dark:text-white"
                : " bg-transparent dark:text-white text-black"
              }  rounded-full flex justify-center items-center font-semibold text-sm hover:cursor-pointer transition-all duration-500`}
          >
            <span>Collections</span>
          </Link>

          {/* Dropdown Button */}
          <div className="relative group">
            <div
              className={`w-10 h-10 bg-gray-200 hover:bg-gray-300 dark:bg-neutral-800 hover:dark:bg-neutral-700 
                     rounded-full flex justify-center items-center hover:cursor-pointer transition-all duration-300
                     ${location.pathname === "/members" || location.pathname === "/about"
                  ? "dark:bg-neutral-600 bg-gray-300"
                  : ""
                }`}
            >
              <div className="w-1 h-1 bg-black dark:bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-black dark:bg-white rounded-full mx-1"></div>
              <div className="w-1 h-1 bg-black dark:bg-white rounded-full"></div>
            </div>

            {/* Dropdown Menu */}
            <div className="absolute top-12 left-0 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-gray-200 dark:border-neutral-700 py-2 min-w-[120px] z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <Link
                to="/members"
                className={`block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors duration-200
                       ${location.pathname === "/members"
                    ? "bg-gray-100 dark:bg-neutral-700 text-black dark:text-white font-semibold"
                    : "text-gray-700 dark:text-gray-300"
                  }`}
              >
                Members
              </Link>
              <Link
                to="/about"
                className={`block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors duration-200
                       ${location.pathname === "/about"
                    ? "bg-gray-100 dark:bg-neutral-700 text-black dark:text-white font-semibold"
                    : "text-gray-700 dark:text-gray-300"
                  }`}
              >
                About
              </Link>
            </div>
          </div>

          {/* VIP Button */}
          <Link
            to="/vip"
            className={`
          relative w-auto px-6 h-10 rounded-full flex justify-center items-center font-semibold text-sm
          overflow-hidden transition-all duration-500 hover:cursor-pointer group
          ${location.pathname === "/vip" ? "text-white shadow-lg" : "text-white shadow-2xl shadow-amber-300/30 hover:shadow-amber-300 transform "}
        `}
          >
            {/* Glow piscante */}
            <div className="absolute inset-0 rounded-full shadow-xl shadow-amber-400 animate-pulse pointer-events-none"></div>

            {/* Fundo com gradiente dourado animado */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 
                        group-hover:bg-gradient-to-r group-hover:from-amber-400 group-hover:via-amber-200 group-hover:to-amber-400
                        transition-all duration-1000 ease-in-out"
            ></div>

            {/* Efeito de movimento do gradiente no hover */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                        -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"
            ></div>

            {/* Conteúdo do botão */}
            <span className="relative z-10 font-extrabold tracking-wide text-black">VIP</span>
          </Link>
        </div>
        {blockRouts.includes(location.pathname) ? null : (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "50vw" }}
            transition={{ duration: 0.5 }}
            className="w-[80vw] h-10 bg-gray-200 dark:bg-neutral-800 rounded-full mx-2 relative flex justify-start items-center">
            <div className="w-[45px] h-full flex justify-center items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-search">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="What you looking for?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-[90%] h-full placeholder:text-gray-400 placeholder:dark:text-neutral-500 font-medium text-sm bg-transparent outline-none focus:outline-none focus:ring-0 border-none select-none"
            />
          </motion.div>
        )}
        <div className="h-full flex justify-end items-center gap-2 ">
          <div className="relative appearance-none focus:ring-0 ring-0 outline-none focus:outline-none">
            <select
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              className="text-sm rounded-full bg-gray-200 dark:bg-neutral-800 p-2 px-3 appearance-none border-none focus:ring-0 focus:outline-none outline-none cursor-pointer hover:bg-gray-300 dark:hover:bg-neutral-700"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <button onClick={handleDarkMode} className="flex justify-center items-center h-10 w-10 cursor-pointer rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-neutral-800 dark:hover:bg-neutral-700">

            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-280q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM80-440q-17 0-28.5-11.5T40-480q0-17 11.5-28.5T80-520h80q17 0 28.5 11.5T200-480q0 17-11.5 28.5T160-440H80Zm720 0q-17 0-28.5-11.5T760-480q0-17 11.5-28.5T800-520h80q17 0 28.5 11.5T920-480q0 17-11.5 28.5T880-440h-80ZM480-760q-17 0-28.5-11.5T440-800v-80q0-17 11.5-28.5T480-920q17 0 28.5 11.5T520-880v80q0 17-11.5 28.5T480-760Zm0 720q-17 0-28.5-11.5T440-80v-80q0-17 11.5-28.5T480-200q17 0 28.5 11.5T520-160v80q0 17-11.5 28.5T480-40ZM226-678l-43-42q-12-11-11.5-28t11.5-29q12-12 29-12t28 12l42 43q11 12 11 28t-11 28q-11 12-27.5 11.5T226-678Zm494 495-42-43q-11-12-11-28.5t11-27.5q11-12 27.5-11.5T734-282l43 42q12 11 11.5 28T777-183q-12 12-29 12t-28-12Zm-42-495q-12-11-11.5-27.5T678-734l42-43q11-12 28-11.5t29 11.5q12 12 12 29t-12 28l-43 42q-12 11-28 11t-28-11ZM183-183q-12-12-12-29t12-28l43-42q12-11 28.5-11t27.5 11q12 11 11.5 27.5T282-226l-42 43q-11 12-28 11.5T183-183Z" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M680-640h-80q-17 0-28.5-11.5T560-680q0-17 11.5-28.5T600-720h80v-80q0-17 11.5-28.5T720-840q17 0 28.5 11.5T760-800v80h80q17 0 28.5 11.5T880-680q0 17-11.5 28.5T840-640h-80v80q0 17-11.5 28.5T720-520q-17 0-28.5-11.5T680-560v-80Zm54 327q-38 88-117.5 140.5T440-120q-134 0-227-93t-93-227q0-115 73.5-203T380-754q12-2 21.5 2t14.5 13q5 9 6 21.5t-4 26.5q-9 22-13.5 45t-4.5 46q0 100 70 170t170 70q11 0 21-.5t20-2.5q18-3 29.5 1t18.5 12q7 8 8.5 17.5T734-313Z" /></svg>
            )}
          </button>
          {isAuthenticated && (
            <button className="flex justify-center items-center h-10 w-10 cursor-pointer rounded-full bg-lime-300 hover:bg-lime-400 dark:bg-lime-300 dark:hover:bg-lime-400"
              onClick={handleNewUpLoad}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M417-417H229q-26 0-44.5-18.5T166-480q0-26 18.5-44.5T229-543h188v-188q0-26 18.5-44.5T480-794q26 0 44.5 18.5T543-731v188h188q26 0 44.5 18.5T794-480q0 26-18.5 44.5T731-417H543v188q0 26-18.5 44.5T480-166q-26 0-44.5-18.5T417-229v-188Z" /></svg>
            </button>
          )}
          <div className="flex justify-center items-center gap-2 p-2 rounded-full bg-gray-200 dark:bg-neutral-800">
            <div className="w-[26px] h-[26px] bg-[#D9D9D9] rounded-full hover:cursor-pointer">
              <img
                src={user.imageUrl}
                alt="logo"
                className="w-full h-full rounded-full bg-center bg-cover object-cover -scale-1 select-none"
                onErrorCapture={(e: any) => {
                  e.target.onError = null;
                  e.target.src = DefaultUserImage;
                }}
                onClick={handleDropDown}
              />
            </div>
            <div
              className={`w-[24px] h-[24px] hover:cursor-pointer   ${isDropDown ? "rotate-180" : "rotate-0"
                } transition-all duration-500`}
              onClick={handleDropDown}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-chevron-down">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>

        </div>
        {isDropDown && (
          <div className="absolute right-0 top-10 rounded-lg flex flex-col justify-start items-end p-2 select-none">
            <AccountDropdown
              isDropDown={isDropDown}
              SetDropDown={SetDropDown}
            />
          </div>
        )}

      </section>

      {/* MOBILE MENU */}
      <div className="md:hidden w-full bg-gray-100 dark:bg-neutral-900">
        <section className="w-full h-auto py-3 px-4">
          <div className="flex items-center justify-between">
            {/* Botão Menu */}
            <div
              className="w-10 h-10 rounded-full bg-gray-200 dark:bg-neutral-800 hover:bg-gray-300 dark:hover:bg-neutral-700 flex items-center justify-center transition-all duration-200 cursor-pointer"
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
                className="text-gray-700 dark:text-gray-300"
              >
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </div>

            {/* Logo Centralizada */}
            <div className="flex-1 flex justify-center">
              <Link
                to="/"
                className="w-8 h-8 rounded-full flex justify-center items-center hover:cursor-pointer">
                <img
                  src={LogoSite}
                  alt="logo"
                  className="w-full h-full bg-center bg-cover -scale-1"
                />
              </Link>
            </div>

            {/* Botão Search com Dropdown */}
            <div className="relative">
              <input type="checkbox" id="search-toggle" className="hidden peer" />
              <label
                htmlFor="search-toggle"
                className="w-10 h-10 rounded-full bg-gray-200 dark:bg-neutral-800 hover:bg-gray-300 dark:hover:bg-neutral-700 peer-checked:bg-lime-300 peer-checked:dark:bg-lime-400 flex items-center justify-center transition-all duration-200 cursor-pointer"
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
                  className="text-gray-700 dark:text-gray-300 peer-checked:text-black"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </label>

              {/* Campo de Pesquisa Dropdown */}
              <div className="absolute right-0 top-12 w-80 max-w-[90vw] opacity-0 invisible peer-checked:opacity-100 peer-checked:visible transform translate-y-2 peer-checked:translate-y-0 transition-all duration-300 ease-out z-50">
                <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl border border-gray-200 dark:border-neutral-700 p-4">
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
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
                        className="text-gray-400 dark:text-neutral-500"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="What you looking for?"
                      className="w-full h-12 pl-12 pr-4 bg-gray-100 dark:bg-neutral-700 rounded-xl border-none outline-none focus:ring-2 focus:ring-lime-300 dark:focus:ring-lime-400 placeholder:text-gray-500 dark:placeholder:text-neutral-400 text-gray-900 dark:text-white transition-all duration-200"
                    />
                  </div>

                  <div className="mt-3 space-y-2">
                    <div className="text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wide px-2">
                      Popular Searches
                    </div>
                    <div className="space-y-1">
                      <div className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 text-sm text-gray-700 dark:text-gray-300 transition-colors duration-150 cursor-pointer">
                        Design Templates
                      </div>
                      <div className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 text-sm text-gray-700 dark:text-gray-300 transition-colors duration-150 cursor-pointer">
                        UI Components
                      </div>
                      <div className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 text-sm text-gray-700 dark:text-gray-300 transition-colors duration-150 cursor-pointer">
                        Icons & Graphics
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-2 right-4 w-4 h-4 bg-white dark:bg-neutral-800 border-l border-t border-gray-200 dark:border-neutral-700 transform rotate-45"></div>
              </div>

              <label
                htmlFor="search-toggle"
                className="fixed inset-0 bg-black/30  opacity-0 invisible peer-checked:opacity-100 peer-checked:visible transition-all duration-300 cursor-pointer z-40"
              ></label>
            </div>
          </div>
        </section>
      </div>

      <section className="relaive top-0 z-50 hidden w-screen h-[10vh] px-4 justify-start items-start text-[1.2vh]">
        <div className="w-full h-full flex justify-start items-center gap-1">
          <Link
            to="/"
            className="w-[20px] h-[20px] rounded-full flex justify-center items-center hover:cursor-pointer">
            <img
              src={LogoSite}
              alt="logo"
              className="w-full h-full bg-center bg-cover -scale-1"
            />
          </Link>
          <>
            <Link
              to="/"
              className={`w-[18vw] h-[4vh] bg-[#414141] ${location.pathname === "/"
                ? "dark:bg-primary-white dark:text-white text-white"
                : " bg-transparent dark:text-white text-black"
                }  rounded-[50px] flex justify-center items-center  font-semibold hover:cursor-pointer transition-all duration-500`}>
              <span className="select-none">Home</span>
            </Link>
            <Link
              to="/Members"
              className={`w-[18vw] h-[4vh] bg-[#414141] ${location.pathname === "/members"
                ? "dark:bg-primary-white dark:text-white text-white"
                : " bg-transparent dark:text-white text-black"
                }  rounded-[50px] flex justify-center items-center  font-semibold hover:cursor-pointer transition-all duration-500`}>
              <a className="">Members</a>
            </Link>
            <Link
              to="/about"
              className={`w-[18vw] h-[4vh] bg-[#414141] ${location.pathname === "/about"
                ? "dark:bg-primary-white dark:text-white text-white"
                : " bg-transparent dark:text-white text-black"
                }  rounded-[50px] flex justify-center items-center  font-semibold hover:cursor-pointer transition-all duration-500`}>
              <a className="">About</a>
            </Link>
            <div
              className="w-[2vh] hover:cursor-pointer"
              onClick={handleDarkMode}>
              {isDarkMode ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-sun">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="m4.93 4.93 1.41 1.41" />
                  <path d="m17.66 17.66 1.41 1.41" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="m6.34 17.66-1.41 1.41" />
                  <path d="m19.07 4.93-1.41 1.41" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-moon">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              )}
            </div>
          </>
        </div>
      </section>
      <section className="fixed bottom-0 z-50 lg:hidden md:hidden sm:hidden w-full backdrop-blur-lg bg-black/40 border-t border-white/10">
        {/* Container principal com posicionamento relativo para o indicador */}
        <div className="relative flex justify-between items-center px-6 py-3">

          {/* Home Link */}
          <Link
            to="/"
            className="relative flex flex-col items-center justify-center group">
            {/* Indicador ativo */}
            <div className={`absolute -top-3 left-0 right-0 h-0.5 bg-gradient-to-r from-lime-400 to-lime-500 rounded-full transition-all duration-300 ${window.location.pathname === "/" ? "opacity-100" : "opacity-0"
              }`}></div>
            <div className={`w-10 h-10 flex justify-center items-center transition-colors ${window.location.pathname === "/" ? "text-white" : "text-white/80 group-hover:text-white"
              }`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5">
                <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              </svg>
            </div>
            <span className={`text-[10px] mt-0.5 ${window.location.pathname === "/" ? "text-white" : "text-white/70"
              }`}>Home</span>
          </Link>

          {/* Search Link */}
          <Link
            to="search"
            className="relative flex flex-col items-center justify-center group">
            {/* Indicador ativo */}
            <div className={`absolute -top-3 left-0 right-0 h-0.5 bg-gradient-to-r from-lime-400 to-lime-500 rounded-full transition-all duration-300 ${window.location.pathname.includes("/search") ? "opacity-100" : "opacity-0"
              }`}></div>
            <div className={`w-10 h-10 flex justify-center items-center transition-colors ${window.location.pathname.includes("/search") ? "text-white" : "text-white/80 group-hover:text-white"
              }`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <span className={`text-[10px] mt-0.5 ${window.location.pathname.includes("/search") ? "text-white" : "text-white/70"
              }`}>Search</span>
          </Link>

          {/* Botão de + em destaque */}
          <Link
            to="/newPost"
            className="relative flex flex-col items-center justify-center -mt-8 group">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-lime-300 to-lime-400 flex items-center justify-center shadow-lg shadow-lime-500/30 border-2 border-black/30 transform transition-transform active:scale-95">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="black"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
            <span className="text-[10px] text-white/70 mt-1">Create</span>
          </Link>

          {/* Saves Link */}
          <Link
            to="saves"
            className="relative flex flex-col items-center justify-center group">
            {/* Indicador ativo */}
            <div className={`absolute -top-3 left-0 right-0 h-0.5 bg-gradient-to-r from-lime-400 to-lime-500 rounded-full transition-all duration-300 ${window.location.pathname.includes("/saves") ? "opacity-100" : "opacity-0"
              }`}></div>
            <div className={`w-10 h-10 flex justify-center items-center transition-colors ${window.location.pathname.includes("/saves") ? "text-white" : "text-white/80 group-hover:text-white"
              }`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5">
                <path d="M20 17a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3.9a2 2 0 0 1-1.69-.9l-.81-1.2a2 2 0 0 0-1.67-.9H8a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2Z" />
                <path d="M2 8v11a2 2 0 0 0 2 2h14" />
              </svg>
            </div>
            <span className={`text-[10px] mt-0.5 ${window.location.pathname.includes("/saves") ? "text-white" : "text-white/70"
              }`}>Saves</span>
          </Link>

          {/* Profile/Login Link baseado na autenticação */}
          {isAuthenticated ? (
            <Link
              to="profile"
              className="relative flex flex-col items-center justify-center group">
              {/* Indicador ativo */}
              <div className={`absolute -top-3 left-0 right-0 h-0.5 bg-gradient-to-r from-lime-400 to-lime-500 rounded-full transition-all duration-300 ${window.location.pathname.includes("/profile") ? "opacity-100" : "opacity-0"
                }`}></div>
              <div className={`w-10 h-10 flex justify-center items-center transition-colors ${window.location.pathname.includes("/profile") ? "text-white" : "text-white/80 group-hover:text-white"
                }`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <span className={`text-[10px] mt-0.5 ${window.location.pathname.includes("/profile") ? "text-white" : "text-white/70"
                }`}>Profile</span>
            </Link>
          ) : (
            <Link
              to="login"
              className="relative flex flex-col items-center justify-center group">
              {/* Indicador ativo */}
              <div className={`absolute -top-3 left-0 right-0 h-0.5 bg-gradient-to-r from-lime-400 to-lime-500 rounded-full transition-all duration-300 ${window.location.pathname.includes("/login") ? "opacity-100" : "opacity-0"
                }`}></div>
              <div className={`w-10 h-10 flex justify-center items-center transition-colors ${window.location.pathname.includes("/login") ? "text-white" : "text-white/80 group-hover:text-white"
                }`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <span className={`text-[10px] mt-0.5 ${window.location.pathname.includes("/login") ? "text-white" : "text-white/70"
                }`}>Login</span>
            </Link>
          )}

        </div>

        {/* Área segura para dispositivos iOS */}
        <div className="h-safe-bottom bg-black/40 backdrop-blur-lg"></div>
      </section>
    </>
  );
};

export default Topbar;
