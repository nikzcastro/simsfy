import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { api } from "@/lib/appwrite/config";
import { checkIsFollow, copyTextToClipboard } from "@/hooks/clip";
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
  const { user: MyUser, checkAuthUser,isAuthenticated } = useUserContext();
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
  },[MyUser, isAuthenticated])
  return (
    <div className="h-[calc(100vh)] overflow-y-auto w-full select-none">
      <div className="flex flex-wrap justify-center items-center gap-4 w-full p-2 pb-28 ">
        {isLoading ? (
          <Loader />
        ) : posts.length > 0 ? (
          posts.map((post: PostType, index: number) => (
            <div
              key={index}
              className="w-[300px] bg-white dark:bg-neutral-900 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <Link draggable={false} to={`${location.origin}/posts/${post.id}`} className="w-full">
                <div
                  className="w-full h-32 bg-gray-300 dark:bg-neutral-950/50 bg-cover"
                  style={{ backgroundImage: post.images ? `url(${post.images})` : `url(${Logo})` }}
                ></div>
              </Link>

              <div className="px-4 pt-2 pb-4">
                <h1 className="font-bold text-xl text-center">{post.title}</h1>
                <p className="text-sm text-center text-gray-600 dark:text-neutral-600 mb-3">{post.description}</p>

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
          ))
        ) : (
          <div className="col-span-full flex justify-center items-center p-10 text-gray-500">No posts available</div>
        )}
      </div>
    </div>
  );
}
