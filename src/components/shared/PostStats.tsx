import { Models } from "appwrite";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { checkIsLiked } from "@/lib/utils";
import {
  useLikePost,
  useSavePost,
  useDeleteSavedPost,
  useGetCurrentUser,
  useRemoveLikePost, // Nome corrigido
} from "@/lib/react-query/queries";
import { useUserContext } from "@/context/AuthContext";
type PostStatsProps = {
  post: Models.Document;
  userId: string;
};

const PostStats = ({ post, userId }: PostStatsProps) => {
  const location = useLocation();
  const { user } = useUserContext();
  const [likes, setLikes] = useState<string[]>([]);
  const [saves, setSaves] = useState<any[]>([]);

  const { mutate: likePost } = useLikePost();
  const { mutate: savePost } = useSavePost();
  const { mutate: removeLike } = useRemoveLikePost();
  const { mutate: deleteSavePost } = useDeleteSavedPost();
  const { data: currentUser } = useGetCurrentUser();
  const savedPostRecord = currentUser?.save?.find(
    (record: Models.Document) => record.post?.$id === post.$id
  );

  useEffect(() => {
    setLikes(post.likes);
  }, [post, userId, post.likes]);

  // useEffect(() => { 
  //   setSaves(user.save);
  // }, [post, userId, user.save]);


  const isLiked = checkIsLiked(likes, userId);
  const isSaved = saves.some((save) => String(save.$id) === String(post.$id));
  const handleLikePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();

    let likesArray = [...likes];
    if (isLiked) {
      likesArray = likesArray.filter((id) => id !== userId);
      removeLike({ postId: String(post.$id), userId: String(userId) });
    } else {
      likesArray.push(userId);
      likePost({ postId: post.$id, likesArray, userId: Number(userId) });
    }
    setLikes(likesArray);
  };

  const handleSavePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();

    if (isSaved) {
      // setIsSaved(false);
      deleteSavePost(post.$id);
    } else {
      savePost({ userId, postId: post.$id });
      // setIsSaved(true);
    }
  };

  const containerStyles = location.pathname.startsWith("/profile")
    ? "w-full"
    : "";

  return (
    <div className={`flex justify-between items-center z-20 ${containerStyles}`}>
      <div className="flex gap-2 mr-5">
        <img
             src={`${
              isLiked ? "/assets/icons/liked.svg" : "/assets/icons/like.svg"
            }`}
          alt="like"
          width={20}
          height={20}
          onClick={handleLikePost}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>

      <div className="flex gap-2">
        <img
          src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
          alt="save"
          width={20}
          height={20}
          className="cursor-pointer"
          onClick={handleSavePost}
        />
      </div>
    </div>
  );
};

export default PostStats;
