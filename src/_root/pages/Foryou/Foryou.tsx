import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { api } from "@/lib/appwrite/config";
import { checkIsFollow, copyTextToClipboard, formatPostImages } from "@/hooks/clip";
import Logo from "@/public/assets/images/logo-simsfy.png";
import { Loader } from "@/components/shared";
import { useToast } from "@/components/ui";
import { useUserContext } from "@/context/AuthContext";

export type PostType = {
  id: string;
  title: string;
  images: string;
  description: string;
  category: string;
  gender: string;
  link: string;
  age: string;
  pet: string;
};

export default function ForYou() {
  const { user: MyUser, checkAuthUser, isAuthenticated } = useUserContext();
  const { toast } = useToast();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate()

  const fetchPosts = useCallback(async () => {
    if (!MyUser) return;

    setIsLoading(true);
    try {
      const postsPromises = await api.get(`foryou`);

      console.log({ postsPromises })

      const allPosts = await Promise.all(postsPromises);
      const flattenedPosts = allPosts.flat();

      setPosts(flattenedPosts);
    } catch (error) {
      console.error(error);
      toast({ title: "Erro ao buscar posts.", type: "background" });
    } finally {
      setIsLoading(false);
    }
  }, [MyUser, toast]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleShare = (post) => {
    copyTextToClipboard(`${location.origin}/posts/${post.id}`);
    toast({ title: "Link Copiado!" });
  };


  useEffect(() => {
    if (!MyUser || !isAuthenticated) {
      navigate('/')
    }
  }, [MyUser, isAuthenticated])



  return (
    <div className="h-[calc(100vh)] overflow-y-auto w-full select-none">
      <div className="flex flex-wrap justify-center items-center gap-4 w-full p-2 pb-28 ">
        {isLoading ? (
          <Loader />
        ) : posts.length > 0 ? (
          posts.map((post: PostType, index: number) => {
            const imagesArray = formatPostImages(post?.images);
            const displayImages = imagesArray.slice(0, 5); // máximo 5

            return (
              <div
                key={index}
                className="w-[300px] bg-white dark:bg-neutral-900 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <Link draggable={false} to={`${location.origin}/post/${post.id}`} className="w-full relative">
                  <div
                    className={`w-full aspect-[4/3] relative overflow-hidden grid gap-1
              ${displayImages.length === 1 ? "grid-cols-1" : ""}
              ${displayImages.length === 2 ? "grid-cols-2" : ""}
              ${displayImages.length === 3 ? "grid-cols-3" : ""}
              ${displayImages.length === 4 ? "grid-cols-2 grid-rows-2" : ""}
              ${displayImages.length === 5 ? "grid-cols-3 grid-rows-2" : ""}
            `}
                  >
                    {displayImages.map((img, imgIndex) => (
                      <img
                        key={imgIndex}
                        src={img || Logo}
                        alt={`${post.title}`}
                        loading="lazy"
                        onErrorCapture={(e) => {
                          e.currentTarget.src = Logo;
                          e.currentTarget.onerror = null;
                        }}
                        className={`w-full h-full object-cover transition-transform duration-700 hover:scale-105
                  ${displayImages.length === 5 && imgIndex === 4 ? "col-span-2 row-span-2" : ""}`}
                      />
                    ))}
                  </div>
                </Link>

                <div className="px-4 pt-2 pb-4">
                  <h1 className="font-bold text-xl text-center">{post.title}</h1>
                  <p className="text-sm text-center text-gray-600 dark:text-neutral-600 mb-3">
                    {post.description}
                  </p>

                  <div className="flex justify-center gap-2 mb-4">
                    <button
                      onClick={() => handleShare(post)}
                      className="px-4 py-1.5 border border-gray-300 dark:border-neutral-700 rounded-full text-sm font-medium hover:bg-gray-50 dark:hover:bg-neutral-800"
                    >
                      Share
                    </button>
                  </div>

                  {/* Additional post information */}
                  <div className="flex justify-center text-sm text-neutral-400 my-2">
                    <span>{post.category}</span>
                    <span className="mx-2">|</span>
                    <span>{post.gender}</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center w-full py-6 text-gray-500 dark:text-neutral-500">No posts found.</p>
        )}

      </div>
    </div>
  );
}
