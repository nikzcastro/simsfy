import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { CollectionsProps } from "../../types";
import noImage from "../../public/assets/icons/user.svg";
import { api } from "../../lib/appwrite/config";
import { useUserContext } from "../../context/AuthContext";
import { useToast } from "../ui";
interface Collection {
  showModal: boolean;
  postId: string;
  colections: CollectionsProps[];
  close: (actiove: boolean) => void;
  addToCollection?: (colectionName: string) => void;
  createNewCollection?: () => void;
}

export default function Collection({
  showModal,
  postId,
  colections,
  close,
  addToCollection,
  createNewCollection,
}: Collection) {
  const { user } = useUserContext();
  const { toast } = useToast();
  const [colectionSelected, setColectionSelected] =
    useState<CollectionsProps | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenNewCollection, setIsOpenNewCollection] = useState(false);
  const [MyCollections, SetMycollections] = useState<CollectionsProps[]>([]);
  const [formDataNewColectin, setFormDataNewColectin] = useState({
    name: "",
    description: "",
    private: false,
  });

  useEffect(() => {
    setIsOpen(showModal);
  }, []);
  const onCloseModal = () => {
    setIsOpen(false);
    setTimeout(() => {
      close(false);
    }, 1000);
  };
  const handleAddToCollection = async () => {
    if (colectionSelected) {
      try {
        await api.post("addPostToCollection", {
          postId: postId,
          collectionName: colectionSelected.name,
        });

        setTimeout(() => {
          fatchMyCollections();
          location.reload();
        }, 1000);
      } catch (error) {
        toast({ title: error });
        fatchMyCollections();
      }
    }
  };

  const handleSaveCreateCollection = async () => {
    try {
      const response = await api.post("createCollection", {
        name: formDataNewColectin.name,
        description: formDataNewColectin.description,
        private: formDataNewColectin.private,
        userId: user.id,
      });
      if (response) {
        SetMycollections(response || []);
        setFormDataNewColectin({
          description: "",
          name: "",
          private: false,
        });
      }
    } catch (error) {
      SetMycollections((provider) => provider);
    }
    setIsOpen((provider) => !provider);
    setIsOpenNewCollection((provider) => !provider);
  };

  const fatchMyCollections = async () => {
    try {
      const response = await api.get(`collections?userId=${user.id}`);
      if (response) {
        SetMycollections(response);
      }
    } catch (error) {
      toast({ title: error });
      SetMycollections((provider) => provider);
    }
  };

  useEffect(() => {
    fatchMyCollections();
  }, [showModal, isOpenNewCollection]);

  return (
    <div className="w-full h-screen fixed flex justify-center items-center overflow-hidden z-50">
      <section className="fixed inset-0 flex justify-center items-center z-50 select-none overflow-hidden p-4 bg-black/40 backdrop-blur-md">
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          className="w-full max-w-md rounded-3xl shadow-2xl bg-white/95 dark:bg-neutral-950/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 p-6 flex flex-col justify-start items-center gap-4"
        >
          <div className="w-full flex justify-between items-center mb-2">
            <div className="w-8"></div>
            <h1 className="font-semibold text-xl text-black dark:text-white">My Collections</h1>
            <div
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-gray-700 dark:text-gray-300 transition-colors duration-200 cursor-pointer"
              onClick={onCloseModal}
            >
              <svg width="20" height="20" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12.0208 21.9203L21.9202 12.0209"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12.0208 12.0208L21.9202 21.9203"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <div className="w-full h-48 flex flex-col justify-start items-start gap-1 p-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
            {MyCollections.map((collection, index) => (
              <div
                onClick={() => setColectionSelected(collection)}
                className={`w-full flex justify-between items-center p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-800/60 transition-all focus:border-transparent outline-none border-none duration-200 cursor-pointer ${
                  colectionSelected === collection
                    ? "bg-blue-50 dark:bg-neutral-900/20 border border-blue-200/50 dark:border-blue-800/30"
                    : ""
                }`}
                key={index}
              >
                <div className="flex gap-3 justify-center items-center">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-neutral-900/30 dark:to-indigo-900/30 flex items-center justify-center overflow-hidden">
                    <img
                      src={noImage || "/placeholder.svg"}
                      alt={collection.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-medium text-neutral-900 dark:text-gray-200">{collection.name}</span>
                </div>
                <div className="flex justify-center items-center">
                  {!collection.private ? (
                    <div className="p-2 rounded-full bg-gray-100 dark:bg-neutral-900">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-gray-500 dark:text-gray-400"
                      >
                        <g clipPath="url(#clip0_2091_238)">
                          <path
                            d="M7.99992 14.6666C11.6818 14.6666 14.6666 11.6819 14.6666 7.99998C14.6666 4.31808 11.6818 1.33331 7.99992 1.33331C4.31802 1.33331 1.33325 4.31808 1.33325 7.99998C1.33325 11.6819 4.31802 14.6666 7.99992 14.6666Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M7.99992 1.33331C6.28807 3.13075 5.33325 5.51781 5.33325 7.99998C5.33325 10.4822 6.28807 12.8692 7.99992 14.6666C9.71176 12.8692 10.6666 10.4822 10.6666 7.99998C10.6666 5.51781 9.71176 3.13075 7.99992 1.33331Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M1.33325 8H14.6666"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_2091_238">
                            <rect width="16" height="16" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                  ) : (
                    <div className="p-2 rounded-full bg-gray-100 dark:bg-neutral-900">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-gray-500 dark:text-gray-400"
                      >
                        <path
                          d="M12.6667 7.33331H3.33333C2.59695 7.33331 2 7.93027 2 8.66665V13.3333C2 14.0697 2.59695 14.6666 3.33333 14.6666H12.6667C13.403 14.6666 14 14.0697 14 13.3333V8.66665C14 7.93027 13.403 7.33331 12.6667 7.33331Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4.66675 7.33331V4.66665C4.66675 3.78259 5.01794 2.93475 5.64306 2.30962C6.26818 1.6845 7.11603 1.33331 8.00008 1.33331C8.88414 1.33331 9.73198 1.6845 10.3571 2.30962C10.9822 2.93475 11.3334 3.78259 11.3334 4.66665V7.33331"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="w-full pt-4 flex flex-col justify-end items-center gap-3 border-t border-gray-200 dark:border-neutral-900">
            <Button
              onClick={() => {
                if (colectionSelected) {
                  handleAddToCollection()
                }
              }}
              variant="destructive"
              className={`w-full h-12 rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                colectionSelected
                  ? "bg-lime-300 hover:lime-400 text-black dark:text-black shadow-lime-600/25 hover:shadow-lime-600/40"
                  : "bg-gray-300 dark:bg-neutral-800 text-black dark:black cursor-not-allowed"
              } font-medium`}
            >
              Add to Collection
            </Button>
            <Button
              className="w-full h-12 bg-gray-100 hover:bg-gray-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-900 dark:text-gray-200 rounded-xl flex gap-3 justify-center items-center transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-sm"
              onClick={() => {
                setIsOpen(false)
                setIsOpenNewCollection(true)
              }}
            >
              <div className="flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="20px"
                  viewBox="0 -960 960 960"
                  width="20px"
                  fill="currentColor"
                >
                  <path d="M412-412H154v-136h258v-259h136v259h258v136H548v258H412v-258Z" />
                </svg>
              </div>
              <span>Create a New Collection</span>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Create New Collection Modal */}
      <motion.section
        className={`fixed inset-0 flex justify-center items-center z-50 select-none overflow-hidden p-4 bg-black/40 backdrop-blur-md ${!isOpenNewCollection && "hidden"}`}
      >
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          className="w-full max-w-md rounded-3xl shadow-2xl bg-white/95 dark:bg-neutral-950 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden flex flex-col"
        >
          <div className="w-full flex justify-between items-center p-6 border-b border-gray-200 dark:border-neutral-900">
            <div
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-gray-700 dark:text-gray-300 transition-colors duration-200 cursor-pointer"
              onClick={() => {
                setIsOpen(true)
                setIsOpenNewCollection(false)
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M15 18L9 12L15 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="font-semibold text-xl text-black dark:text-white">Create a New Collection</h1>
            <div className="w-8"></div>
          </div>

          <form className="w-full flex-1 flex flex-col gap-6 p-6">
            <div className="w-full flex gap-2 flex-col">
              <label htmlFor="collection-name" className="text-sm font-medium text-gray-700 dark:text-gray-300 pl-2">
                Name
              </label>
              <input
                id="collection-name"
                value={formDataNewColectin.name}
                onChange={(e) =>
                  setFormDataNewColectin({
                    ...formDataNewColectin,
                    name: e.target.value,
                  })
                }
                type="text"
                placeholder="Give a name to this collection"
                className="w-full h-12 text-base bg-gray-100 dark:bg-neutral-900 text-black dark:text-white rounded-xl focus:ring-2 focus:ring-gray-300 dark:focus:ring-neutral-700 focus:border-transparent border-none outline-none px-4 transition-all duration-200"
              />
            </div>

            <div className="w-full flex gap-2 flex-col">
              <label htmlFor="collection-desc" className="text-sm font-medium text-gray-700 dark:text-gray-300 pl-2">
                Description (Optional)
              </label>
              <textarea
                id="collection-desc"
                value={formDataNewColectin.description}
                onChange={(e) =>
                  setFormDataNewColectin({
                    ...formDataNewColectin,
                    description: e.target.value,
                  })
                }
                placeholder="Write a description"
                className="w-full min-h-[100px] text-base bg-gray-100 dark:bg-neutral-900 text-black dark:text-white rounded-xl focus:ring-2 focus:ring-gray-300 dark:focus:ring-neutral-700 focus:border-transparent border-none outline-none p-4 transition-all duration-200 resize-none"
              />
            </div>

            <div className="w-full flex items-center gap-3">
              <div className="relative flex items-center">
                <input
                  id="private-checkbox"
                  checked={formDataNewColectin.private}
                  onChange={(e) =>
                    setFormDataNewColectin({
                      ...formDataNewColectin,
                      private: e.target.checked,
                    })
                  }
                  type="checkbox"
                  className="w-5 h-5 text-blue-600 bg-gray-100 dark:bg-neutral-800 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                />
              </div>
              <label
                htmlFor="private-checkbox"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
              >
                Make this collection private
              </label>
            </div>
          </form>

          <div className="w-full mt-auto">
            <Button
              variant="destructive"
              className="w-full h-16 flex gap-3 justify-center items-center rounded-none bg-lime-300 hover:bg-lime-400 text-black dark:text-black shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all duration-300"
              onClick={() => handleSaveCreateCollection()}
            >
              <div className="flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="currentColor"
                >
                  <path d="M412-412H154v-136h258v-259h136v259h258v136H548v258H412v-258Z" />
                </svg>
              </div>
              <span className="font-medium">Save New Collection</span>
            </Button>
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
}
