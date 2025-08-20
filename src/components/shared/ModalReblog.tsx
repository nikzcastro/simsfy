import { useUserContext } from "@/context/AuthContext";
import { api } from "@/lib/appwrite/config";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useCreatePost } from "@/lib/react-query/queries";
import { Button } from "../ui";

type ModalReblogProps = {
  isOpen: boolean;
  close: () => void;
  post: any;
};
export const ModalReblog = ({ isOpen, close, post }: ModalReblogProps) => {
  const [isModalReblog, setIsModalReblog] = useState(false);
  const [isError, setError] = useState(false);
  const { mutateAsync: createPost, isLoading: isLoadingCreate } =
    useCreatePost();
  const { user } = useUserContext();

  useEffect(() => {
    setIsModalReblog(isOpen);
  }, [isOpen]);

  const Cancel = () => {
    setIsModalReblog(false);
  };
  const Confirm = async () => {
    try {
      const response = await api.post("uploadPosts", [
        {
          id: user.id,
          title: post.title,
          description: post.description,
          images: post.images,
          category: post.category,
          gender: post.gender,
          link: post.link,
          age: post.age,
          pet: post.pet,
          status: "Published",
        },
      ]);

      if (response) {
       
        await api.post(`posts/${post.id}/reblog`)
        setTimeout(() => {
          setIsModalReblog(false);
        }, 2000);
      }
    } catch (error) {
      setError(true);

      setTimeout(() => {
        setError(false);
      }, 2000);
    }
  };
  return isModalReblog ? (
    <motion.div
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-md z-50 overflow-hidden p-4"
    >
      <motion.div
        animate={isModalReblog ? { opacity: 1 } : { opacity: 0 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md mx-auto flex flex-col justify-start items-center bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 z-50 rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/30 gap-6 p-8 overflow-hidden"
      >
        <div className="flex flex-col justify-center items-center text-center select-none gap-4">
          <div className="p-4 bg-gray-200 dark:bg-neutral-800 rounded-2xl border border-gray-200/50 dark:border-neutral-700/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="28px"
              viewBox="0 -960 960 960"
              width="28px"
              className="text-black dark:text-white"
              fill="currentcolor"
            >
              <path d="M253-479.13q0 14.87 1.72 28.67 1.72 13.81 5.58 27.68 6.14 22.08-.43 42.95-6.57 20.87-26.09 31.83-19.95 11.39-40.82 4.04-20.87-7.34-28.13-28.3-9.13-25.83-13.48-52.65-4.35-26.83-4.35-54.22 0-137.39 95.83-235.63Q338.65-813 474.35-813h7.56l-24.69-24.7q-12.7-12.69-12.42-30.82.29-18.13 12.98-30.83 12.7-12.69 30.83-12.69t30.83 12.69l101.73 101.74q15.96 15.96 15.96 37.61t-15.96 37.61L519.44-620.65q-12.7 12.69-30.83 12.69t-30.83-12.69q-12.69-12.7-12.69-31.11t12.69-31.11L481.91-707h-5.87q-92.65 0-157.84 66.54Q253-573.91 253-479.13Zm454-1.74q0-14.87-1.72-28.67-1.72-13.81-5.58-27.68-6.14-22.08.43-42.95 6.57-20.87 26.09-31.83 19.95-11.39 40.54-4.33 20.59 7.07 27.85 27.46 9.69 26.39 14.04 53.22 4.35 26.82 4.35 54.78 0 137.39-95.83 235.91-95.82 98.53-231.52 98.53h-7.56l24.13 24.13q12.69 12.69 12.69 30.82 0 18.13-12.69 30.83-12.7 12.69-31.11 12.69T440-60.65L338.26-162.39q-15.96-15.96-15.67-37.33.28-21.37 15.67-37.32l102.3-101.74q12.7-12.7 31.11-12.98 18.42-.28 31.11 12.41 12.7 12.7 12.7 31.11t-12.7 31.11l-24.69 24.69h5.87q92.65 0 157.84-66.82Q707-386.09 707-480.87Z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h1 className="font-semibold text-2xl text-gray-900 dark:text-white tracking-tight">Confirmar Reblog</h1>
            <p className="text-gray-600 dark:text-gray-400 text-md leading-relaxed max-w-sm">
              Este post será publicado no seu perfil e ficará visível para seus seguidores.
            </p>
          </div>
        </div>
        <div className="flex gap-3 justify-center items-center w-full">
          {!isLoadingCreate ? (
            <>
              <Button
                variant="destructive"
                onClick={() => Confirm()}
                className="flex-1 h-12 bg-lime-300 hover:bg-lime-400 text-black dark:text-black border-0 rounded-xl font-medium shadow-lg shadow-lime-600/25 hover:shadow-lime-600/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                Confirmar
              </Button>
              <Button
                variant="destructive"
                onClick={() => Cancel()}
                className="flex-1 h-12 bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-neutral-700 rounded-xl font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-sm"
              >
                Cancelar
              </Button>
            </>
          ) : (
            <div className="flex items-center justify-center gap-3 py-3 text-gray-600 dark:text-gray-400">
              <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="font-medium">Processando...</span>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  ) : null;
};
