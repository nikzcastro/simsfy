import React, { useCallback } from "react";
import { useGetHallOfFame } from "../../lib/react-query/queries";
import { useUserContext } from "../../context/AuthContext";
import { useToast } from "../../components/ui";
import { Link, useLocation } from "react-router-dom";
import { Loader } from "../../components/shared";
import Verified from "@/components/shared/Verified";
import { Crown } from "lucide-react";
import Logo from "@/public/assets/images/logo-simsfy.png"
import { checkIsFollow, copyTextToClipboard } from "@/hooks/clip";
import { api } from "@/lib/appwrite/config";

export type UserType = {
  id: number;
  username: string;
  bannerUrl: string;
  imageUrl: string;
  verified: boolean;
  postCount: number;
  vip: boolean;
  posts: PostType[];
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
  const { user: MyUser, checkAuthUser } = useUserContext();
  const {
    data: getHallOffFame,
    isLoading: isLoading,
    error: updateError,
    refetch,
  } = useGetHallOfFame();
  const { toast } = useToast();

  const handleFollow = useCallback(async (user) => {
    try {
      const response = await api.post("follow", { followedId: user.id });
      if (response) {
        // toast({ title: "Now following " + user.username })
        checkAuthUser()
        // refetch()
      }
    } catch (error) {
      // toast({ title: "Error following user." })
    }
  }, [toast, refetch]);

  const handleUnFollow = useCallback(async (user) => {
    try {
      const response = await api.post("unfollow", { followedId: user.id });
      if (response) {
        // toast({ title: "Unfollowed " + user.username })
        checkAuthUser()
        // refetch();
      }
    } catch (error) {
      // toast({ title: "Error unfollowing user " })
    }
  }, [toast, refetch]);


  const isFollowed = useCallback((userId: number, followers: { id: number; followedId: number; followerId: number }[]) => {
    if (userId && Array.isArray(followers)) {
      const follow = followers.find((follower) => follower.followedId === userId);
      if (follow !== undefined) {
        return follow;
      }
    }
    return false;
  }, [MyUser, getHallOffFame])



    const handleShare = (user) => {
      copyTextToClipboard(`${location.origin}/profiler/${user.username}  `);
      toast({ title: "Link Cópiado!" });
    };
  
  return (
    <div className="h-[calc(100vh)] overflow-y-auto w-full select-none">
      <div className="flex flex-wrap justify-center items-center gap-4 w-full p-2 pb-28 ">
        {Array.isArray(getHallOffFame) && getHallOffFame.length > 0 ? (
          getHallOffFame.map((user: any, index: number) => {
            return user && MyUser && user.id !== MyUser.id && (
              <div
                key={index}
                className="w-[300px] bg-white dark:bg-neutral-900 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <Link
                  draggable={false}
                  to={`${location.origin}/profiler/${user.username}`}
                  className="w-full"
                >
                  {/* Cover photo */}
                  <div
                    className="w-full h-32 bg-gray-300 dark:bg-neutral-950/50 bg-cover"
                    style={{ backgroundImage: user.bannerUrl ? `url(${user.bannerUrl})` : `url(${Logo})` }}
                  ></div>
                </Link>

                <div className="flex flex-col items-center -mt-16">
                  <div
                    className="w-28 h-28 rounded-full border-4 bg-gray-200 dark:bg-neutral-800 border-white dark:border-neutral-900 shadow-md bg-center bg-cover"
                    style={{ backgroundImage: user.imageUrl ? `url(${user.imageUrl})` : `url(${Logo})` }}
                  ></div>
                </div>

                {/* Username with verification */}
                <div className="px-4 pt-2 pb-4">
                  <Link draggable={false} to={`${location.origin}/profiler/${user.username}`} className="font-bold text-xl text-center flex justify-center items-center gap-1">
                    @<Verified user={user as any} />
                    {user.vip && (
                      <Crown className="text-yellow-200 w-4 hover:text-yellow-200 hover:cursor-pointer" />
                    )}
                  </Link>

                  <div className="flex justify-center text-sm text-neutral-400 my-2">
                    <span>{user.posts.length} posts</span>
                    <span className="mx-2">|</span>
                    <span>{user.colections.length} collections</span>
                  </div>

                  <div className="flex justify-center gap-2 mb-4">
                    <button onClick={() => handleShare(user)} className="px-4 py-1.5 border border-gray-300 dark:border-neutral-700 rounded-full text-sm font-medium hover:bg-gray-50 dark:hover:bg-neutral-800">
                      Share
                    </button>

                    {MyUser && (
                      <>
                        {isFollowed(user.id, MyUser.following) ? (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleUnFollow(user);
                            }}
                            className="px-4 py-1.5 bg-lime-300 text-black rounded-full text-sm font-medium hover:bg-lime-400"
                          >
                            UnFollow
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleFollow(user);
                            }}
                            className="px-4 py-1.5 bg-lime-300 text-black rounded-full text-sm font-medium hover:bg-lime-400"
                          >
                            Follow
                          </button>
                        )}
                      </>
                    )}
                  </div>

                  {/* Bio section */}
                  <p className="text-gray-600 dark:text-neutral-600 text-sm text-center mb-3">{user.bio || "No bio available"}</p>

                  {/* Links section */}
                  <div className="flex justify-center gap-3 mb-4">
                    {user.links && user.links.length > 0 ? (
                      user.links.map((link, i) => (
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
                      {user.badges ? (
                        user.badges.map((badge, i) => (
                          <div key={i} className="w-6 h-6 rounded-full bg-gray-200" title={badge.name}></div>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400 dark:text-neutral-400">No badges yet</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full flex justify-center items-center p-10 text-gray-500">Nobody in hall of fame</div>
        )}
      </div>
    </div>
  );
}
