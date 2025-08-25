import { Loader } from "@/components/shared";
import { Button, useToast } from "@/components/ui";
import { useUserContext } from "@/context/AuthContext";
import { copyTextToClipboard, formatPostImages } from "@/hooks/clip";
import { api } from "@/lib/appwrite/config";
import { useCreatePost, useGetPostId } from "@/lib/react-query/queries";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Collection from "../../components/shared/Collection";
import DefaultCard from "@/public/assets/images/notfoundImage.png";
import { isLiked } from "@/lib/validation";
import { likesType } from "@/types";
import { ModalReblog } from "@/components/shared/ModalReblog";


type User = {
  id: number;
  username: string;
  imageUrl: string;
  verified: boolean;
  bannerUrl: string;
};

type Creator = {
  id: number;
  username: string;
  imageUrl: string;
  verified: boolean;
  bannerUrl: string;
};

type Post = {
  id: string;
  title: string;
  description: string;
  images: string;
  category: string;
  gender: string;
  link: string;
  age: string;
  pet: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  verified: string;
  user: User;
  creator: Creator;
  likes: likesType[]
};

export async function getPostId(postId: any) {
  const post = await api.post("getPostById", {
    postId: postId,
  });

  return post;
}

export default function PostProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState("");
  const { mutateAsync: createPost, isLoading: isLoadingCreate } =
    useCreatePost();
  // const { data: getPostById, isLoading, isError, error } = useGetPostId(id);

  const [saveInColection, setSaveInColection] = useState<boolean>(false);
  const { toast } = useToast();
  const {
    user,
    isAuthenticated,
    isModalLogin,
    setIsModalLogin,
    search,
    setSearch,
    checkAuthUser,
  } = useUserContext();
  const [isModalReblog, setIsModalReblog] = useState(false);

  const fetchPost = async () => {
    api.post(`posts/${id}/view`)
    try {
      setIsLoadingPage(true);
      const data = await getPostId(id);
      setPost(data);
    } catch (err) {
      setError(err);
      toast({ title: "Erro ao carregar os dados" });
    } finally {
      setIsLoadingPage(false);
    }
  };
  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }


    fetchPost();

  }, []);

  const Download = async () => {
    if (post.link) {
      window.open(post.link, "_blank");
      await api.post(`posts/${post.id}/download`)
    }
  };

  const handleLikedPost = async () => {
    if (post) {
      if (!isAuthenticated) {
        // navigate('/');
        setIsModalLogin(true);
        return;
      }
      try {
        const response = await api.post(`posts/like`, {
          postId: post.id,
          userId: user.id,
        })
        if (response && response.success && response.message) {
          toast({ title: response.message })
          setTimeout(() => {
            fetchPost();
          }, 1000);
        }
      } catch (error) {
        toast({ title: error.error })
      }

    }
  };
  const Share = async () => {
    if (post) {
      copyTextToClipboard(`${location.origin}/post/${id}`);
      toast({ title: `Copied: ${location.origin}/post/${id}` });
      await api.post(`posts/${post.id}/shared`)
    }
  };

  const Save = () => {
    if (post) {
      if (!isAuthenticated) {
        // navigate('/');
        setIsModalLogin(true);
        return;
      }

      setSaveInColection(true);
    }
  };
  const Remove = async () => {
    if (post) {
      if (!isAuthenticated) {
        setIsModalLogin(true);
        return;
      }
      await api.post("removePostFromCollection", {
        postId: post.id,
      });
      location.reload();
    }
  };

  const isPostInColection = () => {
    return user.colections.some((colection: any) => {
      return colection.posts.some((postItem: any) => postItem.id === post.id);
    });
  };

  const handleReblog = async (post: Post) => {
    setIsModalReblog((provider) => !provider);
  };


  if (isLoadingPage) {
    return (
      <div className="w-full h-full flex justify-center items-center dark:text-white text-black">
        <Loader className="lg:flex md:flex sm:flex hidden justify-center items-center" />
        <h1 className="w-full flex justify-center items-center text-center lg:hidden sm:hidden md:hidden dark:text-black text-white">
          Loading...
        </h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex justify-center items-center dark:text-white text-black">
        <h1 className="text-red-500">Erro ao carregar os dados: {error}</h1>
      </div>
    );
  }



  const imagesArray = formatPostImages(post?.images);
  const displayImages = imagesArray.slice(0, 5);

  return (
    <>
      <ModalReblog
        isOpen={isModalReblog}
        close={() => setIsModalReblog(false)}
        post={post}
      />
      <div className="w-full h-full flex justify-center items-start overflow-y-auto mt-5 mb-5">
        {saveInColection && (
          <Collection
            colections={user?.colections}
            postId={id}
            showModal={saveInColection}
            close={() => {
              checkAuthUser();
              setSaveInColection(false);
            }}
          />
        )}
        <motion.div

          className="w-[92%] sm:w-[80%] md:w-[90%] lg:w-[70%] mb-32 overflow-hidden bg-white dark:bg-neutral-900 rounded-3xl border border-gray-100 dark:border-neutral-800"
        >
          {/* Container principal com flex em desktop */}
          <div className="flex flex-col lg:flex-row">
            {/* Container da imagem - aspect ratio 4/3 fixo - MAIOR */}
            <div className="w-full lg:w-[60%] flex-shrink-0 relative group">
              <div className={`w-full aspect-[4/3] relative overflow-hidden rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none grid gap-1
  ${displayImages.length === 1 ? "grid-cols-1" : ""}
  ${displayImages.length === 2 ? "grid-cols-2" : ""}
  ${displayImages.length === 3 ? "grid-cols-3" : ""}
  ${displayImages.length === 4 ? "grid-cols-2 grid-rows-2" : ""}
  ${displayImages.length === 5 ? "grid-cols-3 grid-rows-2" : ""}
`}>
                {displayImages.map((img, index) => (
                  <img
                    key={index}
                    src={img || "/placeholder.svg"}
                    alt={`Post by ${post?.creator.username}`}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105
        ${displayImages.length === 5 && index === 4 ? "col-span-2 row-span-2" : ""}`}
                    onErrorCapture={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                ))}

                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>

            {/* Container do conteúdo - MENOR */}
            <div className="w-full lg:w-[40%] flex flex-col lg:aspect-[4/3]">
              {/* Header com botões de ação - fixo */}
              <div className="p-4 border-b border-gray-100 dark:border-neutral-800 flex-shrink-0 bg-gray-50/50 dark:bg-neutral-800/30">
                <div className="w-full flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <button
                      className={`flex justify-center items-center h-11 w-11 ${isLiked(post?.likes, post?.id, Number(user.id))
                        ? "bg-red text-white shadow-lg shadow-red-500/25"
                        : "bg-white dark:bg-neutral-800 text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500"
                        } cursor-pointer rounded-full transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-neutral-700`}
                      onClick={handleLikedPost}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="18px"
                        viewBox="0 -960 960 960"
                        width="18px"
                        fill="currentColor"
                      >
                        <path d="M479-117q-23 0-45-8.5T394-151l-71-65q-104-94-190.5-193T46-634q0-109 72-182t181-73q51 0 97 18t83 53q37-35 83-53t97-18q109 0 182.5 73T915-634q0 126-87.5 225.5T634-214l-69 64q-18 17-40.5 25t-45.5 8Z" />
                      </svg>
                    </button>

                    <button
                      className="flex justify-center items-center h-11 w-11 cursor-pointer rounded-full bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700 text-gray-600 dark:text-gray-300 transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-neutral-700"
                      onClick={() => handleReblog(post)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="18px"
                        viewBox="0 -960 960 960"
                        width="18px"
                        fill="currentColor"
                      >
                        <path d="M263-480q0 14 1.5 26.5T269-428q7 26 0 51t-30 39q-23 14-48 6t-34-32q-10-28-15-57t-5-59q0-140 98-241.5T470-823h8l-16-16q-14-14-13.5-33t14.5-33q14-14 33-14t33 14l100 100q19 19 19 45t-19 45L529-615q-14 14-33 14t-33-14q-14-14-14-33.5t14-33.5l15-15h-5q-87 0-148.5 63.5T263-480Zm434 0q0-14-1.5-26.5T691-532q-7-26 0-51t30-39q23-14 47.5-6.5T802-598q11 29 16 58t5 60q0 140-98 242T490-136h-8l15 15q14 14 14 33t-14 33q-14 14-33.5 14T430-55L330-155q-19-19-18.5-44.5T330-244l101-100q14-14 33.5-14.5T498-345q14 14 14 33.5T498-278l-16 16h5q87 0 148.5-64T697-480Z" />
                      </svg>
                    </button>

                    <button
                      className="flex justify-center items-center h-11 w-11 cursor-pointer rounded-full bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700 text-gray-600 dark:text-gray-300 transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-neutral-700"
                      onClick={Share}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="18px"
                        viewBox="0 -960 960 960"
                        width="18px"
                        fill="currentColor"
                      >
                        <path d="M197.83-84.65q-46.93 0-80.06-33.12-33.12-33.13-33.12-80.06v-564.34q0-46.93 33.12-80.06 33.13-33.12 80.06-33.12h241.71q23.68 0 40.13 16.46 16.46 16.46 16.46 40.01 0 23.55-16.46 40.13-16.45 16.58-40.13 16.58H197.83v564.34h564.34v-241.71q0-23.68 16.63-40.13 16.62-16.46 39.96-16.46 23.67 0 40.13 16.46 16.46 16.45 16.46 40.13v241.71q0 46.93-33.12 80.06-33.13 33.12-80.06 33.12H197.83Zm564.34-598.74L432.04-353.26q-15.95 15.96-39.14 15.84-23.19-.12-39.4-16.08-15.96-16.21-15.96-39.52 0-23.31 15.96-39.26l329.89-329.89h-50.67q-23.34 0-39.97-16.63-16.62-16.62-16.62-39.96 0-23.67 16.62-40.13 16.63-16.46 39.97-16.46h186.04q23.67 0 40.13 16.46t16.46 40.13v186.04q0 23.34-16.46 39.97-16.46 16.62-40.01 16.62-23.55 0-40.13-16.62-16.58-16.63-16.58-39.97v-50.67Z" />
                      </svg>
                    </button>

                    <button className="flex justify-center items-center h-11 w-11 cursor-pointer rounded-full bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700 text-gray-600 dark:text-gray-300 transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-neutral-700">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="18px"
                        viewBox="0 -960 960 960"
                        width="18px"
                        fill="currentColor"
                      >
                        <path d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z" />
                      </svg>
                    </button>
                  </div>

                  <button
                    className="flex justify-center items-center h-11 w-11 cursor-pointer rounded-full bg-lime-300 hover:bg-lime-400 text-white transition-all duration-300 hover:scale-105 shadow-lg shadow-green-500/25"
                    onClick={Save}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="18px"
                      viewBox="0 -960 960 960"
                      width="18px"
                      fill="#000000"
                    >
                      <path d="m480-219.09-151.61 64.66q-53 22.08-100.3-9.05-47.31-31.13-47.31-88.26v-501.48q0-44.3 30.85-75.15 30.85-30.85 75.15-30.85h386.44q44.3 0 75.15 30.85 30.85 30.85 30.85 75.15v501.48q0 57.13-47.31 88.26-47.3 31.13-100.3 9.05L480-219.09Z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Conteúdo scrollável - ocupa o espaço restante */}
              <div className="flex-1 mb-2 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-neutral-600 scrollbar-track-transparent">
                <div className="text-black dark:text-white">
                  {/* Título */}
                  <div className="text-xl font-bold mb-3 leading-tight line-clamp-2 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    {post.title}
                  </div>

                  {/* Creator info */}
                  <div className="flex items-center gap-1 mb-4">
                    <div className="w-8 h-8 rounded-full bg-lime-300 flex items-center justify-center text-black font-bold text-sm">
                      {post.creator.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">@{post.creator.username}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="w-full flex items-center gap-1 mb-4 overflow-x-auto pb-1">
                    {post.category
                      ?.split(/[|>]/)
                      .map((tag) => tag.trim())
                      .filter((tag, index, self) => self.indexOf(tag) === index)
                      .slice(0, 3)
                      .map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 transition-all duration-300 hover:cursor-pointer px-2 py-1 rounded-full text-sm font-medium text-black dark:text-white whitespace-nowrap"
                        >
                          #{tag}
                        </span>
                      ))}
                  </div>

                  {/* Informações adicionais */}
                  <div className="space-y-4  mb-3">
                    <div className="bg-gray-50 dark:bg-neutral-800/50 rounded-xl p-4 border border-gray-100 dark:border-neutral-700">
                      <span className="font-bold block text-md text-gray-900 dark:text-white">Informations</span>

                      <div className="space-y-3">
                        <div>
                          <span className="font-medium text-sm text-gray-700 dark:text-gray-300 block mb-2">Description:</span>
                          <div className="bg-white dark:bg-neutral-700 p-3 rounded-lg border border-gray-200 dark:border-neutral-600">
                            <span className="font-normal text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                              {post.description}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm text-gray-700 dark:text-gray-300">Age:</span>
                          <span className="font-medium text-sm text-gray-900 dark:text-white bg-white dark:bg-neutral-700 px-2 py-1 rounded-md border border-gray-200 dark:border-neutral-600">
                            {post.age || "N/A"}
                          </span>
                        </div>
                        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-neutral-600 to-transparent"></div>

                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm text-gray-700 dark:text-gray-300">Gender:</span>
                          <span className="font-medium text-sm text-gray-900 dark:text-white bg-white dark:bg-neutral-700 px-2 py-1 rounded-md border border-gray-200 dark:border-neutral-600">
                            {post.gender || "N/A"}
                          </span>
                        </div>
                        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-neutral-600 to-transparent"></div>

                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm text-gray-700 dark:text-gray-300">Updated:</span>
                          <span className="font-medium text-sm text-gray-900 dark:text-white bg-white dark:bg-neutral-700 px-2 py-1 rounded-md border border-gray-200 dark:border-neutral-600">
                            {post.updatedAt || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Estatísticas do Post */}
                  <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-800/30 dark:to-neutral-900/50 rounded-xl border border-gray-200 dark:border-neutral-700 shadow-sm">
                    <span className="font-bold mb-4 block text-md text-gray-900 dark:text-white">Statistics</span>


                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 auto-rows-fr">
                      <div className="bg-white dark:bg-neutral-800 rounded-lg p-3 border border-gray-100 dark:border-neutral-700 shadow-sm min-w-0">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-6 h-6 bg-gray-100 dark:bg-neutral-700 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-3 h-3 text-gray-500 dark:text-neutral-300" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                              </div>
                              <span className="text-sm font-medium text-gray-600 dark:text-neutral-400 truncate">Likes</span>
                            </div>
                            <span className="text-md font-bold text-gray-900 dark:text-white flex-shrink-0">50</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-6 h-6 bg-gray-100 dark:bg-neutral-700 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-3 h-3 text-gray-500 dark:text-neutral-300" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                              </div>
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate">Reblogs</span>
                            </div>
                            <span className="text-md font-bold text-gray-900 dark:text-white flex-shrink-0">50</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-neutral-800 rounded-lg p-3 border border-gray-100 dark:border-neutral-700 shadow-sm min-w-0">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-6 h-6 bg-gray-100 dark:bg-neutral-700 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-3 h-3 text-gray-500 dark:text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </div>
                              <span className="text-sm font-medium text-gray-600 dark:text-neutral-400 truncate">Views</span>
                            </div>
                            <span className="text-md font-bold text-black dark:text-white flex-shrink-0">1.2k</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-6 h-6 bg-gray-100 dark:bg-neutral-700 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 text-gray-500 dark:text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3" />
                                </svg>
                              </div>
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate">Downloads</span>
                            </div>
                            <span className="text-md font-bold text-gray-900 dark:text-white flex-shrink-0">89</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-neutral-800 rounded-lg p-3 border border-gray-100 dark:border-neutral-700 shadow-sm min-w-0">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-6 h-6 bg-gray-100 dark:bg-neutral-700 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-3 h-3 text-gray-500 dark:text-neutral-300" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                </svg>
                              </div>
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate">Saved</span>
                            </div>
                            <span className="text-md font-bold text-gray-900 dark:text-white flex-shrink-0">23</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-6 h-6 bg-gray-100 dark:bg-neutral-700 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-3 h-3 text-gray-500 dark:text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                              </div>
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate">Shares</span>
                            </div>
                            <span className="text-md font-bold text-gray-900 dark:text-white flex-shrink-0">12</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 p-4 border-t border-gray-100 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-800/30">
                <button
                  className="w-full h-11 bg-lime-300 hover:bg-lime-400 rounded-full flex justify-center items-center text-md font-bold text-white transition-all duration-300 hover:scale-[1.02] shadow-lg"
                  onClick={Download}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    fill="#000000"
                  >
                    <path d="M480-47.28q-90 0-168.74-34-78.74-34-137.36-92.62-58.62-58.62-92.62-137.36-34-78.74-34-168.74 0-111.61 52.85-206.55 52.85-94.95 143.26-154.67 19.24-12.71 41.46-6.45 22.22 6.26 33.17 26.5 10.72 19.47 5.08 40.81-5.64 21.34-24.12 34.06-65.65 46-103.88 115.7-38.23 69.71-38.23 150.6 0 134.8 94.16 228.97Q345.2-156.87 480-156.87t228.97-94.16Q803.13-345.2 803.13-480q0-80.89-38.23-150.6-38.23-69.7-103.88-115.7-18.48-12.72-24.12-34.06-5.64-21.34 5.08-40.81 10.95-20.24 33.29-26.5 22.34-6.26 41.58 6.69 90.41 59.72 143.14 154.66 52.73 94.95 52.73 206.32 0 90-34 168.74-34 78.74-92.62 137.36-58.62 58.62-137.36 92.62-78.74 34-168.74 34Zm-56.59-464.33v-340.04q0-23.44 16.58-40.01 16.58-16.58 40.01-16.58t40.01 16.58q16.58 16.57 16.58 40.01v340.04l49.54-49.54q16.2-16.2 39.63-16.08 23.44.12 39.39 16.08 16.2 15.95 16.2 39.39 0 23.43-16.2 39.63L519.63-336.85q-16.96 17.2-39.63 17.2t-39.63-17.2L294.85-482.13q-16.2-16.2-16.08-39.63.12-23.44 16.08-39.39 15.95-16.2 39.39-16.2 23.43 0 39.63 16.2l49.54 49.54Z" />
                  </svg>
                  <span className="ml-2 text-black">Download</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
