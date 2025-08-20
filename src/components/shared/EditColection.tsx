import React, { useState } from "react";
import { CollectionsProps } from "../../types";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { api } from "../../lib/appwrite/config";
import { useToast } from "../ui";

type EditProps = {
  isOpen: boolean;
  close: () => void;
  colection: CollectionsProps;
};
export default function EditColection({ isOpen, close, colection }: EditProps) {
  const { toast } = useToast();
  const [formDataNewColectin, setFormDataNewColectin] = useState({
    name: colection?.name,
    description: colection?.description,
    private: colection?.private,
  });

  const handleUpdateCollection = async () => {
    try {
      const response = await api.post("updateCollection", {
        name: formDataNewColectin.name,
        description: formDataNewColectin.description,
        private: formDataNewColectin.private,
        collectionId: colection?.id,
      });
      if (response.error) {
        toast({ title: response.error });
        return;
      }
      if (response) {
        console.log(response);
        close();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return isOpen ? (
    <div className="absolute z-[50] flex justify-center items-center w-full h-full">
      <motion.section
        animate={
          isOpen
            ? { opacity: 1, scale: 1, display: "block" }
            : { opacity: 0, scale: 0.5, display: "none" }
        }
        initial={{ opacity: 0, scale: 0.5, display: "none" }}
        transition={{ duraction: 1 }}
        className="flex justify-center items-start z-50 select-none lg:overflow-hidden ">
        <div className="w-[362px] h-[380px] rounded-[28px] shadow-lg bg-white text-black p-0 flex flex-col justify-start items-center">
          <div className="w-full flex justify-between items-center  p-4">
            <div
              className="hover:cursor-pointer hover:text-gray-800"
              onClick={() => close()}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M15 18L9 12L15 6"
                  stroke="black"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <h1 className="font-bold col-span-2">Update a Collection</h1>
            <div className="ml-12"></div>
          </div>
          <form className="w-full h-full flex flex-col gap-4 justify-center items-center p-4">
            <div className="w-full flex gap-4 flex-col justify-start items-start">
              <label htmlFor="" className="text-[10px] pl-2">
                Name
              </label>
              <input
                value={formDataNewColectin.name}
                onChange={(e) =>
                  setFormDataNewColectin({
                    ...formDataNewColectin,
                    name: e.target.value,
                  })
                }
                type="text"
                placeholder="Give a name to this collection"
                className="w-full h-[50px] text-[10px] bg-[#E6E6E6] border border-gray-300 outline-none rounded-[50px] p-4"
              />
            </div>
            <div className="w-full flex gap-4 flex-col justify-start items-start">
              <label htmlFor="" className="text-[10px] pl-2">
                Description (Optional)
              </label>
              <textarea
                value={formDataNewColectin.description}
                onChange={(e) =>
                  setFormDataNewColectin({
                    ...formDataNewColectin,
                    description: e.target.value,
                  })
                }
                placeholder="Write a description"
                className="w-full h-[50px] max-h-[80px] text-[10px] bg-[#E6E6E6] border border-gray-300 outline-none rounded-[20px] p-3"
              />
            </div>
            <div className="w-full flex justify-start items-center gap-4">
              <input
                checked={formDataNewColectin.private}
                onChange={(e) =>
                  setFormDataNewColectin({
                    ...formDataNewColectin,
                    private: e.target.checked,
                  })
                }
                type="checkbox"
                name=""
                id=""
                className="bg-[#D9D9D9] rounded-[2px] w-[12px] h-[12px]"
              />
              <span>Private this collection</span>
            </div>
          </form>
          <div className="w-full h-full flex justify-end items-end gap-2 ">
            <Button
              variant="destructive"
              className="w-full h-[50px] flex gap-4 justify-center items-center  rounded-b-[28px] p-8 bg-[#C2EA45] hover:bg-[#677f21]"
              onClick={() => handleUpdateCollection()}>
              <span className="text-black font-bold">Update Collection</span>
            </Button>
          </div>
        </div>
      </motion.section>
    </div>
  ) : null;
}
