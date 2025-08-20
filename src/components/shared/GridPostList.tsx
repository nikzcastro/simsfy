import { Link } from "react-router-dom";
import DefaultCard from "@/public/assets/images/notfoundImage.png";
import { useUserContext } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { likesType, PostsType } from "@/types";
import { VerifiedIcon, Crown  } from "lucide-react";
import { copyTextToClipboard } from "@/hooks/clip";
import { useEffect, useRef, useState } from "react";
import { toast } from "../ui/use-toast";
import { api } from "@/lib/appwrite/config";
import { ModalReblog } from "./ModalReblog";
import Collection from "./Collection";
import clsx from "clsx";
import { isLiked } from "@/lib/validation";
import { useGetRecentPosts } from "@/lib/react-query/queries";


type GridPostListProps = {
  posts: PostsType[];
  showUser?: boolean;
  showStats?: boolean;
  refreshPage?: () => void;
  hasMore?: boolean;
  page?: number;
  setPage?: (value: number | ((prev: number) => number)) => void;
};

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


const GridPostList = ({
  posts: asAllPosts,
  showUser = true,
  showStats = true,
  page,
  setPage,
  hasMore,
  refreshPage,
}: GridPostListProps) => {
  const [posts, setAllPosts] = useState<PostsType[]>([])
  const { user, isAuthenticated, setIsModalLogin, checkAuthUser } = useUserContext();
  const firstColumn = posts.filter((_, index) => index % 3 === 0);
  const secondColumn = posts.filter((_, index) => index % 3 === 1);
  const thirdColumn = posts.filter((_, index) => index % 3 === 2);
  const [post, setSelectedPost] = useState<PostsType | null>(null)
  const [saveInColection, setSaveInColection] = useState<boolean>(false);
  const [isModalReblog, setIsModalReblog] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const bottomRef = useRef(null);
  const {
    data: dataPosts,
    isLoading: isPostLoading,
    isError: isErrorPosts,
    refetch: refetchPosts,
  } = useGetRecentPosts();


  useEffect(() => {
    setAllPosts(asAllPosts)
  },[asAllPosts])


    useEffect(() => {
    if (!user?.vip || !hasMore) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { rootMargin: "300px" }
    );

    if (bottomRef.current) {
      observerRef.current.observe(bottomRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [user?.vip, hasMore, setPage]);




  const Download = async (post: PostsType) => {
    if (post.link) {
      window.open(post.link, "_blank");
      await api.post(`posts/${post.id}/download`)
    }
  };

    const handleLikedPost = async (post: PostsType) => {
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
              refreshPage()
              setAllPosts(dataPosts)
            }, 1000);
          }
        } catch (error) {
          toast({ title: error.error })
        } finally {
          refreshPage()
        }
  
      }
    };
    const Share = async (post: PostsType) => {
      if (post) {
        copyTextToClipboard(`${location.origin}/post/${post.id}`);
        toast({ title: `Copied: ${location.origin}/post/${post.id}` });
        await api.post(`posts/${post.id}/shared`)
      }
    };
  
    const Save = (post: PostsType) => {
      if (post) {
        if (!isAuthenticated) {
          // navigate('/');
          setIsModalLogin(true);
          return;
        }
  
        setSaveInColection(true);
      }
    };

    
  const handleReblog = async () => {
    setIsModalReblog((provider) => !provider);
  };

  const renderPost = (post: PostsType, i: number) => {
  return (
    <motion.div
      key={i}
      data-grid-item="true"
      className="item relative rounded-3xl overflow-hidden group">
        {/* Imagem com camada de efeito */}
        <div className="relative w-full overflow-hidden rounded-3xl">
          <Link to={`/post/${post.id}`} className="block w-full z-10">
            <div className="absolute inset-0 z-10 transition-all duration-300 group-hover:bg-black/40 group-hover:backdrop-blur-sm" />
            <img
              src={`${post.images}`}
              alt={`${post.title}`}
              loading="lazy"
              onErrorCapture={(e) => {
                e.currentTarget.src = DefaultCard;
                e.currentTarget.onerror = null;
              }}
              className="aspect-[4/3] mainpicture w-full object-cover bg-gray-200 rounded-3xl"
            />
        </Link>

        <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
          {/* REBLOG */}
          <div className="absolute top-2 left-2 pointer-events-auto">
            <button onClick={() => {
              setSelectedPost(post);
              handleReblog();
            }} className="h-12 w-12 flex justify-center items-center text-black dark:text-white rounded-full hover:bg-neutral-900/50 dark:hover:bg-neutral-700">
              <svg xmlns="http://www.w3.org/2000/svg" height="26px" viewBox="0 -960 960 960" width="26px" fill="#FFFFFF"><path d="M263-480q0 14 1.5 26.5T269-428q7 26 0 51t-30 39q-23 14-48 6t-34-32q-10-28-15-57t-5-59q0-140 98-241.5T470-823h8l-16-16q-14-14-13.5-33t14.5-33q14-14 33-14t33 14l100 100q19 19 19 45t-19 45L529-615q-14 14-33 14t-33-14q-14-14-14-33.5t14-33.5l15-15h-5q-87 0-148.5 63.5T263-480Zm434 0q0-14-1.5-26.5T691-532q-7-26 0-51t30-39q23-14 47.5-6.5T802-598q11 29 16 58t5 60q0 140-98 242T490-136h-8l15 15q14 14 14 33t-14 33q-14 14-33.5 14T430-55L330-155q-19-19-18.5-44.5T330-244l101-100q14-14 33.5-14.5T498-345q14 14 14 33.5T498-278l-16 16h5q87 0 148.5-64T697-480Z"/></svg>
            </button>
          </div>
          {/* LIKE */}
          <div className="absolute top-2 right-2 pointer-events-auto">
            <button onClick={async () => { 
              await handleLikedPost(post)              
             }} className={clsx(`${isLiked(post.likes, post.id.toString(), Number(user.id)) ? "bg-red text-white shadow-lg shadow-red-500/25" : "hover:bg-neutral-900/50 dark:hover:bg-neutral-700" }`,"h-12 w-12 flex justify-center items-center text-black dark:text-white rounded-full ")}>
              <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="#FFFFFF"><path d="M479-117q-23 0-45-8.5T394-151l-71-65q-104-94-190.5-193T46-634q0-109 72-182t181-73q51 0 97 18t83 53q37-35 83-53t97-18q109 0 182.5 73T915-634q0 126-87.5 225.5T634-214l-69 64q-18 17-40.5 25t-45.5 8Z"/></svg>
            </button>
          </div>
          {/* COMPARTILHAR LINK */}
          <div className="absolute bottom-2 left-2 pointer-events-auto">
            <button onClick={() => { Share(post) }} className="h-12 w-12 flex justify-center items-center text-black dark:text-white rounded-full hover:bg-neutral-900/50 dark:hover:bg-neutral-700">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M197.83-84.65q-46.93 0-80.06-33.12-33.12-33.13-33.12-80.06v-564.34q0-46.93 33.12-80.06 33.13-33.12 80.06-33.12h241.71q23.68 0 40.13 16.46 16.46 16.46 16.46 40.01 0 23.55-16.46 40.13-16.45 16.58-40.13 16.58H197.83v564.34h564.34v-241.71q0-23.68 16.63-40.13 16.62-16.46 39.96-16.46 23.67 0 40.13 16.46 16.46 16.45 16.46 40.13v241.71q0 46.93-33.12 80.06-33.13 33.12-80.06 33.12H197.83Zm564.34-598.74L432.04-353.26q-15.95 15.96-39.14 15.84-23.19-.12-39.4-16.08-15.96-16.21-15.96-39.52 0-23.31 15.96-39.26l329.89-329.89h-50.67q-23.34 0-39.97-16.63-16.62-16.62-16.62-39.96 0-23.67 16.62-40.13 16.63-16.46 39.97-16.46h186.04q23.67 0 40.13 16.46t16.46 40.13v186.04q0 23.34-16.46 39.97-16.46 16.62-40.01 16.62-23.55 0-40.13-16.62-16.58-16.63-16.58-39.97v-50.67Z"/></svg>
            </button>
          </div>
          {/* COLEÇÃO */}
          <div className="absolute bottom-2 right-2 pointer-events-auto">
            <button onClick={() => {  setSelectedPost(post); Save(post) }} className="h-12 w-12 flex justify-center items-center text-black dark:text-white rounded-full hover:bg-neutral-900/50 dark:hover:bg-neutral-700">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="m480-219.09-151.61 64.66q-53 22.08-100.3-9.05-47.31-31.13-47.31-88.26v-501.48q0-44.3 30.85-75.15 30.85-30.85 75.15-30.85h386.44q44.3 0 75.15 30.85 30.85 30.85 30.85 75.15v501.48q0 57.13-47.31 88.26-47.3 31.13-100.3 9.05L480-219.09Z"/></svg>
            </button>
          </div>
          {/* DOWNLOAD */}
          {user.vip && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
              <button onClick={() => {
                Download(post)
              }} className="h-12 w-12 flex justify-center items-center bg-lime-300 hover:bg-lime-400 text-black rounded-full transition-all duration-500 hover:scale-110 hover:bg-lose-400">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentcolor"><path d="M416-393v-357.02q0-27.29 18.29-45.64Q452.58-814 479.79-814 506-814 525-795.66q19 18.35 19 45.64V-393l133.21-133.21Q696-545 723-546t46.48 19q19.52 19 19.02 46t-20.32 45.81L525.09-191.4q-9.41 8.4-21.22 13.9-11.81 5.5-24.03 5.5-13.21 0-25.03-5.5Q443-183 434-191L191-435q-21-20-20.5-46t21.02-45q19.48-20 46.15-20 26.66 0 45.33 20l133 133Z"/></svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CRIADOR */}
      <Link
      to={`/profile/${post?.creator?.username}`}
      className="w-full mt-3 gap-2 flex justify-start items-center hover:cursor-pointer z-[30] pl-3">
      {/* Circle added next to username */}
      <div className="w-5 h-5 rounded-full flex-shrink-0">
        <img src={post?.creator.imageUrl} alt="" className="w-5 h-5 rounded-lg object-cover" />
      </div>

        
      <span className="dark:text-white text-black font-medium text-xs">
        @<Link to={`/profiler/${post?.creator?.username}`}>{post?.creator?.username}</Link>
      </span>
      <div className="flex justify-center items-center gap-2">
        {post?.creator.verified && (
          <VerifiedIcon className="w-5 h-5 text-blue-300 hover:cursor-pointer" />
        )}
        {post?.creator.vip && (
           <Crown  className="w-4 h-4 text-amber-200 hover:cursor-pointer" />
        )}
      </div>
      {/* <div className="w-5 h-5 rounded-full bg-gradient-to-br from-lime-400 to-green-500 flex-shrink-0"></div> */}
    </Link>
    </motion.div>
   );
};

  return (
    <div className="w-screen flex flex-col justify-center items-center">
      <ModalReblog
        isOpen={isModalReblog}
        close={() => setIsModalReblog(false)}
        post={post}
      />
      {saveInColection && (
            <Collection
              colections={user?.colections}
              postId={post.id.toString()}
              showModal={saveInColection}
              close={() => {
                checkAuthUser();
                setSaveInColection(false);
              }}
            />
          )}
      <div
        // className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 overflow-auto dark:scrollbarCategory_white scrollbarCategory_black"
        className="w-full gap-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 p-2 justify-start items-start overflow-auto dark:scrollbarCategory_white scrollbarCategory_black"
        // className="m-2 columns-2 sm:columns-3 lg:columns-5 xl:columns-6 gap-2 overflow-auto dark:scrollbarCategory_white scrollbarCategory_black"
        role="list">
        {posts.map(renderPost)}
        <div ref={bottomRef} className="h-1" />
        {/* {firstColumn.map(renderPost)}
      {secondColumn.map(renderPost)}
      {thirdColumn.map(renderPost)} */}
      </div>
      {!user?.vip && hasMore && (
      <div className="w-screen flex items-center justify-center mb-32">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="bg-gray-300 hover:bg-gray-400/40 font-medium dark:bg-neutral-900 dark:hover:bg-neutral-800 border-none text-black dark:text-white px-6 py-3 rounded-full"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default GridPostList;
