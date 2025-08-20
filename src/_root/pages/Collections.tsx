import React, { useEffect, useState } from "react";
import { useUserContext } from "../../context/AuthContext";
import { Link, useParams } from "react-router-dom";
import { GridPostList, Loader } from "../../components/shared";
import { useToast } from "../../components/ui";
import { updateBanner, updateBannerColection, handleUpdateBannerCollection, removeBannerCollection } from "../../lib/appwrite/api";
import EditColection from "../../components/shared/EditColection";
import { CollectionsProps, IUser } from "@/types";
import { useGetCollections } from "@/lib/react-query/queries";


export default function Collections() {
  const { id } = useParams();
  const { checkAuthUser, user: MyUser } = useUserContext();
  const [bannerImage, setBannerImage] = useState("");
  const [MyCollections, setMyCollections] = useState<CollectionsProps | null>(
    null
  );
  const { toast } = useToast();
  const [user, setUser] = useState<IUser | null>(null);
  const {
    mutateAsync: getCollections,
    isLoading: isUpdating,
    error: updateError,
  } = useGetCollections();

  const fatchCollections = async () => {
    const allCollections = await getCollections({
      id: id,
    });
    if (allCollections) {
      setMyCollections(allCollections);
    }
  };
  useEffect(() => {
    fatchCollections();
  }, [id]);

  const handleUpdateBanner = async (file: File) => {
    if (file) {
      const isUpdated = await updateBannerColection(file, Number(user.id), id);
      if (!isUpdated) {
        setBannerImage("");
      }

      if (isUpdated.error) {
        toast({ title: isUpdated.error });
      }
      setTimeout(async () => {
        toast({ title: "Banner atualizado com sucesso!" });
        await checkAuthUser();
      }, 2000);
    } else {
      console.log("No file selected.");
    }
  };

  const openFileSelector = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/png, image/jpeg, image/gif";
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      const blobUrl = URL.createObjectURL(file);
      setBannerImage(blobUrl);
      handleUpdateBanner(file);
    };
    input.click();
  };

  // const collection = user.colections.find((collection) => collection.id === id);

  const [isOpenEditColection, setIsOpenEditColection] =
    useState<boolean>(false);
  const handleUpdateCollection = () => {
    setIsOpenEditColection(!isOpenEditColection);
  };


  const openFileSelectorCollection = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/png, image/jpeg, image/gif";
    input.onchange =  async (event: any)  =>  {
      const file = event.target.files[0];
      const blobUrl = URL.createObjectURL(file);
      setBannerImage(blobUrl);
      await updateBannerColection(file, Number(MyUser.id), id)
      fatchCollections()
    };
    input.click();
  };


  
  if (!MyCollections) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  
 return (
  <>
    <EditColection
      isOpen={isOpenEditColection}
      close={() => {
        setIsOpenEditColection(false);
        location.reload();
      }}
      colection={MyCollections}
    />
    
    {/* Main container with proper overflow settings */}
    <div className="flex h-screen w-full flex-col items-stretch justify-start overflow-y-auto">
      {/* Banner Section with appropriate aspect ratio */}
      <div className="relative w-full bg-gray-200 dark:bg-neutral-800">
        {MyUser?.id === user?.id && (
          <div
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg transition-all hover:bg-white hover:cursor-pointer hover:shadow-xl md:right-5 md:top-5 md:h-12 md:w-12"
            onClick={openFileSelector}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="md:h-24 md:w-24"
            >
              <path
                d="M16 5H22"
                stroke="#404040"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19 2V8"
                stroke="#404040"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 11.5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H12.5"
                stroke="#404040"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 15L17.914 11.914C17.5389 11.5391 17.0303 11.3284 16.5 11.3284C15.9697 11.3284 15.4611 11.5391 15.086 11.914L6 21"
                stroke="#404040"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 11C10.1046 11 11 10.1046 11 9C11 7.89543 10.1046 7 9 7C7.89543 7 7 7.89543 7 9C7 10.1046 7.89543 11 9 11Z"
                stroke="#404040"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}

        <div className="relative aspect-[3/1] w-full overflow-hidden sm:aspect-[4/1] md:aspect-[5/1]">
        {MyCollections?.creator?.id.toString() === MyUser?.id.toString() && (
          <div className="absolute top-4 right-4  flex justify-center items-center gap-4">
              <button
                onClick={openFileSelectorCollection}
                className="w-10 h-10 bg-black/20 backdrop-blur-sm hover:bg-black/30 rounded-full flex items-center justify-center transition-all duration-200 group"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-white group-hover:scale-110 transition-transform"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    >
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </button>
              <button
                onClick={async () => {
                  await removeBannerCollection(MyUser.id.toString(), id)
                  await fatchCollections()
                }}
                className="w-10 h-10 bg-black/20 backdrop-blur-sm hover:bg-black/30 rounded-full flex items-center justify-center transition-all duration-200 group"
                >
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-trash-icon lucide-trash"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>
            )}
          <img
            src={MyCollections.bannerUrl ? MyCollections.bannerUrl : MyCollections.posts.length > 0 ? MyCollections.posts[0].images : "/placeholder.svg"}
            alt="Collection banner"
            className="h-full w-full object-cover"
          />
          <div className="absolute bottom-0 h-16 w-full bg-gradient-to-t from-black/50 to-transparent md:h-24"></div>
        </div>
      </div>
      
      {/* Action buttons positioned with better mobile support */}
      <div className="relative z-10 w-full px-4 md:px-8">
        <div className="float-right flex -translate-y-1/2 gap-2">
          {/* Like Button - smaller on mobile */}
          <button 
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-lg transition-all hover:bg-gray-50 hover:shadow-xl dark:bg-neutral-800 dark:hover:bg-neutral-700 md:h-12 md:w-12"
            aria-label="Like collection"
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e3e3e3"><path d="M479.76-139.83q-16.15 0-32.44-5.83-16.3-5.84-28.97-18.27l-69.48-63.48Q243.35-323.7 157.61-420.03 71.87-516.37 71.87-634q0-97.59 65.15-162.98 65.15-65.39 162.74-65.39 52.52 0 99.28 21.42 46.76 21.43 80.72 59.47 33.96-38.04 80.72-59.47 46.76-21.42 99.28-21.42 97.59 0 163.1 65.39 65.51 65.39 65.51 162.98 0 117.63-85.6 214.47-85.6 96.83-193.12 193.36l-68.24 62.47q-12.67 12.44-29.08 18.16-16.42 5.71-32.57 5.71Z"/></svg>
          </button>
          
          {/* Follow Button - hidden on mobile, shown on tablet+ */}
          <button className="hidden h-11 items-center justify-center rounded-full bg-lime-300 hover:bg-lime-400 px-5 text-md font-medium text-black shadow-lg transition-all hover:from-black hover:to-gray-800 hover:shadow-xl dark:from-gray-800 dark:to-gray-900 dark:hover:from-gray-700 dark:hover:to-gray-800 sm:flex md:h-12 md:px-6">
            Follow Collection
          </button>
          
          {/* Share Button - smaller on mobile */}
          <button 
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition-all hover:bg-gray-50 hover:shadow-xl dark:bg-neutral-800 dark:hover:bg-neutral-700 md:h-12 md:w-12"
            aria-label="Share collection"
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M274.96-249.7q-95.94 0-163.13-67.17-67.18-67.18-67.18-163.11t67.18-163.13q67.19-67.19 163.13-67.19h111.67q23.67 0 40.13 16.57 16.46 16.58 16.46 40.01 0 23.44-16.46 40.01-16.46 16.58-40.13 16.58H274.96q-49.05 0-83.09 34.16-34.04 34.17-34.04 82.97t34.04 82.97q34.04 34.16 83.09 34.16h111.67q23.67 0 40.13 16.58 16.46 16.57 16.46 40.01 0 23.43-16.46 40.01-16.46 16.57-40.13 16.57H274.96Zm78.93-178.06q-22.09 0-37.55-15.45-15.45-15.46-15.45-37.55 0-22.34 15.33-37.67 15.34-15.33 37.67-15.33h252.22q22.09 0 37.55 15.33 15.45 15.33 15.45 37.67 0 22.09-15.33 37.55-15.34 15.45-37.67 15.45H353.89ZM573.37-249.7q-23.67 0-40.13-16.57-16.46-16.58-16.46-40.01 0-23.44 16.46-40.01 16.46-16.58 40.13-16.58h111.67q49.05 0 83.09-34.16 34.04-34.17 34.04-82.97t-34.04-82.97q-34.04-34.16-83.09-34.16H573.37q-23.67 0-40.13-16.58-16.46-16.57-16.46-40.01 0-23.43 16.46-40.01 16.46-16.57 40.13-16.57h111.67q95.94 0 163.13 67.17 67.18 67.18 67.18 163.11t-67.18 163.13q-67.19 67.19-163.13 67.19H573.37Z"/></svg>
          </button>

          {/* Share Button - smaller on mobile */}
          <button 
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition-all hover:bg-gray-50 hover:shadow-xl dark:bg-neutral-800 dark:hover:bg-neutral-700 md:h-12 md:w-12"
            aria-label="Share collection"
          >
<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M479.96-106.41q-39.68 0-67.54-28.08-27.85-28.08-27.85-67.52 0-39.63 27.99-67.69 28-28.06 67.48-28.06 39.68 0 67.54 28.16 27.85 28.15 27.85 67.69t-27.98 67.52q-27.98 27.98-67.49 27.98Zm0-278.16q-39.68 0-67.54-27.99-27.85-28-27.85-67.48 0-39.68 27.99-67.54 28-27.85 67.48-27.85 39.68 0 67.54 27.98 27.85 27.98 27.85 67.49 0 39.68-27.98 67.54-27.98 27.85-67.49 27.85Zm0-277.67q-39.68 0-67.54-28.21-27.85-28.2-27.85-67.81t27.99-67.47q28-27.86 67.48-27.86 39.68 0 67.54 27.99 27.85 27.98 27.85 67.54 0 39.66-27.98 67.74t-67.49 28.08Z"/></svg>          </button>
        </div>
      </div>
      
      {/* Collection Details Section with improved layout and mobile spacing */}
      <div className="relative flex h-auto w-full flex-col items-center justify-start mb-4 -translate-y-4">
        {/* Action Buttons with enhanced styling - Only for collection owner */}
        <div className="absolute right-4 top-0 flex items-center justify-center gap-3 md:right-5 md:top-5">
          {MyUser?.id === user?.id && (
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 shadow-md transition-all hover:bg-black hover:cursor-pointer hover:shadow-lg dark:bg-gray-800 dark:hover:bg-gray-700 md:h-11 md:w-11"
              onClick={handleUpdateCollection}
              aria-label="Edit collection"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="md:h-5 md:w-5"
              >
                <g clipPath="url(#clip0_2096_1180)">
                  <path
                    d="M17.645 5.67667C18.0856 5.23619 18.3332 4.63873 18.3333 4.01571C18.3333 3.3927 18.0859 2.79518 17.6454 2.35459C17.205 1.91399 16.6075 1.66643 15.9845 1.66635C15.3615 1.66627 14.764 1.91369 14.3234 2.35417L3.20169 13.4783C3.00821 13.6713 2.86512 13.9088 2.78503 14.17L1.68419 17.7967C1.66266 17.8687 1.66103 17.9453 1.67949 18.0182C1.69794 18.0911 1.73579 18.1577 1.78902 18.2108C1.84225 18.264 1.90888 18.3017 1.98183 18.3201C2.05477 18.3384 2.13133 18.3367 2.20336 18.315L5.83086 17.215C6.09183 17.1356 6.32934 16.9934 6.52253 16.8008L17.645 5.67667Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12.5 4.16666L15.8333 7.49999"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_2096_1180">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
          )}
        </div>

        {/* Collection Info with improved typography and spacing */}
        <div className="flex w-full max-w-3xl flex-col items-center justify-center gap-3">
          {/* Collection Title */}
          <h1 className="text-center text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
            {MyCollections.name}
          </h1>
          
          {/* Collection Description */}
          {MyCollections.description && (
            <p className="w-full text-center text-sm leading-relaxed text-gray-700 dark:text-gray-300 sm:text-base md:w-4/5 lg:w-3/5">
              {MyCollections.description}
            </p>
          )}
          
          {/* Creator Info */}
          <div className="mt-1 flex items-center justify-center gap-2 text-gray-800 dark:text-gray-200 md:mt-2">
            <span className="text-xs font-medium sm:text-sm">by</span>
            <div className="flex items-center">
              <img
                src={MyCollections.creator?.imageUrl || "/placeholder.svg"}
                alt={MyCollections.creator?.username || "creator"}
                className="h-6 w-6 rounded-full border-2 border-white bg-gray-200 object-cover shadow-sm dark:border-gray-800 sm:h-7 sm:w-7 md:h-8 md:w-8"
              />
              <span className="ml-1.5 text-sm font-medium hover:underline sm:ml-2 sm:text-base">
                @<Link to={`/profiler/${MyCollections.creator.username}`}>{MyCollections.creator?.username}</Link>
              </span>
            </div>
          </div>
          
          {/* Mobile Follow Button */}
          <button className="mt-2 flex h-11 items-center justify-center rounded-full bg-lime-300 hover:bg-lime-400 px-5 text-md font-medium text-black shadow-md transition-all hover:from-black hover:to-gray-800 hover:shadow-lg dark:from-gray-800 dark:to-gray-900 dark:hover:from-gray-700 dark:hover:to-gray-800 sm:hidden sm:text-sm">
            Follow Collection
          </button>
        </div>

        {/* Post Count with improved styling */}
        <div className="mt-4 flex items-center justify-center rounded-full bg-gray-100 px-3 py-1 dark:bg-neutral-800/50 sm:mt-5 sm:px-4 sm:py-1.5 md:mt-6">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300 sm:text-sm">
            {MyCollections.posts ? MyCollections.posts.length : 0} Posts
          </span>
        </div>
      </div>
      
      {/* Posts Grid with improved spacing */}
      <div className="w-full">
        <GridPostList posts={MyCollections.posts ? MyCollections.posts : []} />
      </div>
    </div>
  </>
);
}
