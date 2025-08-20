import React from "react";
import { useGetHallOfFame } from "../../lib/react-query/queries";
import { useUserContext } from "../../context/AuthContext";
import { useToast } from "../../components/ui";
import { Link, useLocation } from "react-router-dom";
import { Loader } from "../../components/shared";
import Verified from "@/components/shared/Verified";
import { Crown } from "lucide-react";

export type UserType = {
  id: number;
  username: string;
  bannerUrl: string;
  imageUrl: string;
  verified: boolean;
  postCount: number;
  vip: boolean;
  posts: PostType[]; // Relacionamento com a tipagem dos posts
};
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

export default function HallFame() {
  const {
    data: getHallOffFame,
    isLoading: isLoading,
    error: updateError,
  } = useGetHallOfFame();
  const {
    isDarkMode,
    isModalLogin,
    setIsModalLogin,
    user,
    checkAuthUser,
    isLoading: isUserLoading,
  } = useUserContext();
  const { toast } = useToast();
  return (
    <div className="h-[calc(100vh)] overflow-y-auto w-full">
    <div className="grid xl:grid-cols-6 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-4 w-full p-2 pb-28">
      {Array.isArray(getHallOffFame) && getHallOffFame.length > 0 ? (
        getHallOffFame.map((post: UserType, index: number) => {
          return (
            <Link
              to={`${location.origin}/profiler/${post.username}`}
              key={index}
              className="w-full bg-white dark:bg-neutral-900 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {/* Cover photo */}
              <div
                className="w-full h-32 bg-gray-300 dark:bg-neutral-950/50"
                style={{ backgroundImage: post.coverUrl ? `url(${post.coverUrl})` : "" }}
              ></div>

              {/* Avatar - centered and overlapping the cover */}
              <div className="flex flex-col items-center -mt-16">
                <div
                  className="w-28 h-28 rounded-full border-4 bg-gray-200 dark:bg-neutral-800 border-white dark:border-neutral-900 shadow-md bg-center bg-cover"
                  style={{ backgroundImage: `url(${post.imageUrl})` }}
                ></div>
              </div>

              {/* Username with verification */}
              <div className="px-4 pt-2 pb-4">
                <h1 className="font-bold text-xl text-center flex justify-center items-center gap-1">
                  @<Verified user={post as any} />
                  {post.vip && (
                    <Crown  className="text-yellow-200 w-4 hover:text-yellow-200 hover:cursor-pointer" />
                  )}
                </h1>
                
               <div className="flex justify-center text-sm text-neutral-400 my-2">
                    <span>10 posts</span>
                    <span className="mx-2">|</span>
                    <span>2 collections</span>
                  </div>

                {/* Action buttons */}
                <div className="flex justify-center gap-2 mb-4">
                  
                  <button className="px-4 py-1.5 border border-gray-300 dark:border-neutral-700 rounded-full text-sm font-medium hover:bg-gray-50 dark:hover:bg-neutral-800">
                    Share
                  </button>
                  <button className="px-4 py-1.5 bg-lime-300 text-black rounded-full text-sm font-medium hover:bg-lime-400">
                    Follow
                  </button>
                </div>

                

                {/* Bio section */}
                <p className="text-gray-600 dark:text-neutral-600 text-sm text-center mb-3">{post.bio || "No bio available"}</p>

                {/* Links section */}
                <div className="flex justify-center gap-3 mb-4">
                  {post.links && post.links.length > 0 ? (
                    post.links.map((link, i) => (
                      <a
                        key={i}
                        href={link.url}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                      >
                        <span className="text-gray-600">🔗</span>
                      </a>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400 dark:text-neutral-400">No links available</span>
                  )}
                </div>

                {/* Badges/Insignias section */}
                <div className="border-t border-gray-300 dark:border-neutral-700 pt-3">
                  <h3 className="text-xs font-medium text-gray-500 dark:text-neutral-600 text-center mb-2">Badges</h3>
                  <div className="flex justify-center gap-2">
                    {post.badges ? (
                      post.badges.map((badge, i) => (
                        <div key={i} className="w-6 h-6 rounded-full bg-gray-200" title={badge.name}></div>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400 dark:text-neutral-400">No badges yet</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          )
        })
      ) : (
        <div className="col-span-full flex justify-center items-center p-10 text-gray-500">Nobody in hall of fame</div>
      )}
    </div>
    </div>
  )
}
