import { useToast } from "@/components/ui/use-toast";
import { GridPostList, Loader } from "@/components/shared";
import { useGetRecentPosts } from "@/lib/react-query/queries";
import { useEffect, useRef, useState } from "react";
import { categories, PostsType, ReceivedPost } from "../../types";
import "./homess.css";
import { useTranslation } from 'react-i18next'

import { useUserContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "@/lib/appwrite/config";
const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
    const { t, i18n } = useTranslation()
  const {
    user,
    isAuthenticated,
    isModalLogin,
    setIsModalLogin,
    search,
    setSearch,
  } = useUserContext();
  const {
    data: dataPosts,
    isLoading: isPostLoading,
    isError: isErrorPosts,
    refetch: refetchPosts,
  } = useGetRecentPosts();

  const underlineRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [page, setPage] = useState(1)
  const [posts, setPosts] = useState<PostsType[]>([]);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
      setPosts(dataPosts || [])
  },[dataPosts])

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

const fetchPosts = async (pageNumber: number) => {
  try {
    const limitPerPage = 24;

    const response = await api.post("getRecentPosts", {
      limit: pageNumber * limitPerPage,
    });

    const data = response;

    if (!Array.isArray(data) || data.length === 0) {
      setHasMore(false);
      return;
    }

    setPosts((prev) => {
      const existingIds = new Set(prev.map((post) => post.id));
      const newPosts = data.filter((post) => !existingIds.has(post.id));
      return [...prev, ...newPosts];
    });

  } catch (error) {
    console.error("Erro ao buscar posts", error);
  }
};



  const filteredPosts = posts?.filter((post: PostsType) => {
    const categoryMatch =
      !selectedCategory ||
      selectedCategory === "Clothing" ||
      post.category?.toLowerCase().includes(selectedCategory.toLowerCase());
    const searchMatch =
      !search || post.title?.toLowerCase().includes(search.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const refreshPage = async () => {
      await refetchPosts();
  };

  const handleCategoryHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (underlineRef.current) {
      const { offsetLeft, offsetWidth } = e.currentTarget;
      underlineRef.current.style.left = `${offsetLeft}px`;
      underlineRef.current.style.width = `${offsetWidth}px`;
    }
  };
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };
  if (isErrorPosts) {
    return (
      <div className="flex flex-1">
        <div className="home-container">
          <p className="body-medium text-light-1">
            Algo deu errado ao carregar os posts.
          </p>
        </div>
      </div>
    );
  }

  return (
<div className="w-full">
    
    {/* Div interna com altura fixa e scroll */}
    <div className="w-full h-screen overflow-y-auto dark:scrollbarCategory_black scrollbarCategory_white">
      
      <div className="flex flex-col lg:justify-start justify-center items-center">
        
       <div className="flex items-center justify-start w-full min-h-[10vh] lg:min-h-0 p-2 my-2 gap-1 overflow-x-auto overflow-y-hidden cursor-pointer relative dark:scrollbarCategory_black scrollbarCategory_white">
          {categories.map((category) => (
            <h1
              key={category}
              onClick={(e) => {
                navigate(`/Categories/${category}`);
              }}
              className={`w-full py-3 bg-gray-100 dark:bg-neutral-900 text-black dark:text-white dark:hover:text-black text-sm lg:min-w-[100px] min-w-[100px] text-center font-bold rounded-full relative  flex justify-center items-center transition duration-1000 dark:hover:bg-lime-300 hover:bg-lime-300 ${selectedCategory === category
                ? "text-black dark:text-white"
                : "font-normal text-[#000000]"
                }`}>
              {category}
            </h1>
          ))}
        </div>

        <div className="max-w-6xl px-3 mt-24 mb-24 text-center">
          <h2 className="text-5xl font-semibold text-black dark:text-neutral-300"> The brand new hub to <span className="text-black dark:text-white">find</span>, <span className="text-black dark:text-white">save</span>, <span className="text-black dark:text-white">download,</span> and <span className="text-black dark:text-white">share</span> resources for The Sims. </h2>
          <h3 className="text-gray-500 dark:text-neutral-400 font-light text-3xl mb-8">Get freemium features and host unlimited files — all for free.</h3>
          <a href="https://simsfy.com/register" className="py-3 px-6  bg-lime-300 hover:bg-lime-400 text-black rounded-full">Create an Account</a>
          <p className=" mt-5 text-sm text-gray-500 dark:text-neutral-300">IT'S <span className="font-bold">FREE*</span> </p>
        </div>

        <div className="w-full flex justify-center items-start gap-4 pb-10">
          {isPostLoading && !posts ? (
            <Loader />
          ) : filteredPosts?.length ? (
            <>
              <GridPostList posts={filteredPosts} refreshPage={refreshPage} hasMore={hasMore} page={page} setPage={setPage} />
            </>
          ) : (
            <div className="w-full flex justify-center items-center py-20">
              <p className="text-center text-gray-500 dark:text-gray-400">
                Nenhum post encontrado para a categoria selecionada.
              </p>
            </div>
          )}
        </div>
        
      </div>
    </div>
  </div>
  );
};

export default Home;
