import React, { useEffect, useState } from "react";
import { CollectionsProps, IUser } from "../../types";
import noImage from "../../public/assets/icons/user.svg";
import { useUserContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import DefaultCard from "@/public/assets/images/DefaultCard.png";
export default function GridCollections({
  collections,
  user,
}: {
  collections: CollectionsProps[];
  user: IUser;
}) {
  // const { user } = useUserContext();

  return (
    <div className="w-full h-full grid  grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 p-2 mb-20">
      {collections.map((collection: CollectionsProps, index: number) => {
        return (
          <Link
            to={`/collection/${collection.id}`}
            key={index}
            className={`${collection.private && String(collection?.creator?.id) !== String(user.id) ? "hidden" : "flex"} gap-1 flex-col justify-center items-start rounded-lg hover:cursor-pointer`}>
            <div className="w-full aspect-[4/3] bg-[#030303]/20 dark:bg-[#3c3a3a]/20 rounded-[28px] relative">
              {collection.posts.length <= 0 ? (
                <div className="w-full h-full relative flex justify-center items-center">
                  <img
                    src={noImage}
                    onErrorCapture={(e) => {
                      e.currentTarget.src = DefaultCard;
                      e.currentTarget.onerror = null;
                    }}
                    alt=""
                    className="w-full h-full absolute object-cover hover:cursor-pointer hover:scale-[1.01] hover:transition-all hover:duration-700"
                  />
                </div>
              ) : collection.posts.length === 1 ? (
                <div className="w-full h-full relative flex justify-center items-center hover:scale-[1.01]">
                        <img
                          src={collection.posts[0].images}
                          onErrorCapture={(e) => {
                            e.currentTarget.src = DefaultCard;
                            e.currentTarget.onerror = null;
                          }}
                          alt=""
                          className="w-full h-full absolute object-cover rounded-3xl hover:cursor-pointer hover:transition-all hover:duration-700"
                        />
                      </div>
              ) : collection.posts.length === 2 ? (
                <div className="w-full h-full flex justify-between items-center rounded-3xl overflow-hidden hover:scale-[1.01]">
                  <img
                    src={collection.posts[0].images}
                    onErrorCapture={(e) => {
                      e.currentTarget.src = DefaultCard;
                      e.currentTarget.onerror = null;
                    }}
                    alt=""
                    className="w-1/2 h-full object-cover hover:cursor-pointer hover:transition-all hover:duration-700"
                  />
                  <img
                    src={collection.posts[1].images}
                    onErrorCapture={(e) => {
                      e.currentTarget.src = DefaultCard;
                      e.currentTarget.onerror = null;
                    }}
                    alt=""
                    className="w-1/2 h-full object-cover hover:cursor-pointer hover:transition-all hover:duration-700"
                  />
                </div>

              ) : collection.posts.length >= 3 ? (
                <div className="w-full h-full relative flex justify-between items-center rounded-3xl overflow-hidden hover:scale-[1.01]">
                  <div className="min-w-[50%] relative h-full flex flex-col justify-center items-center">
                    <img
                      src={collection.posts[0].images}
                      onErrorCapture={(e) => {
                        e.currentTarget.src = DefaultCard;
                        e.currentTarget.onerror = null;
                      }}
                      alt=""
                      className="w-full h-full absolute object-cover rounded-sm hover:cursor-pointer hover:transition-all hover:duration-700"
                    />
                  </div>
                  <div className="h-full  relative flex flex-col justify-center items-center">
                   
                    <img
                      src={collection.posts[1].images}
                      onErrorCapture={(e) => {
                        e.currentTarget.src = DefaultCard;
                        e.currentTarget.onerror = null;
                      }}
                      alt=""
                      className="w-full aspect-[4/3] object-cover rounded-sm hover:cursor-pointer hover:transition-all hover:duration-700"
                    />
                    <img
                      src={collection.posts[2].images}
                      onErrorCapture={(e) => {
                        e.currentTarget.src = DefaultCard;
                        e.currentTarget.onerror = null;
                      }}
                      alt=""
                      className="w-full aspect-[4/3] object-cover rounded-sm hover:cursor-pointer hover:transition-all hover:duration-700"
                    />
                  
                </div>
                </div>
              ) : null}
            </div>
            <div className="w-full pl-5 mb-3 pt-1 text-black dark:text-white flex justify-start items-start flex-col">
              <h1 className="font-bold line-clamp-1 text-md">{collection.name}</h1>
              <span className="text-xs font-medium dark:text-white/40 text-black/40">
                {`${collection.posts.length} Creation(s) Saved`}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
