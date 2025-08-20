import React, { useEffect, useState } from "react";
import { useUserContext } from "./../../context/AuthContext";
import {
  categories,
  GlobalCategories,
  GlobalCategoriesTypes,
  PostsType,
  ReceivedPost,
  subcategoriesTypes,
} from "../../types";
import { useGetRecentPosts } from "@/lib/react-query/queries";
import { useToast } from "@/components/ui";
import Background from "../../public/assets/images/c89aff2f-9fb0-4c16-adbe-49aad920588d.png";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { GridPostList, Loader } from "@/components/shared";

export default function Categories() {
  const { toast } = useToast();
  const { user, search, setSearch } = useUserContext();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null
  );
  const [arrayCategories, setArrayCategories] = useState<
    GlobalCategoriesTypes[]
  >([]);
  const [inArrayCategories, setInArrayCategories] = useState<
    subcategoriesTypes[]
  >([]);

  const { id, subid } = useParams();
  const Reactlocation = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setSelectedCategory(id);
      const filteredCategories = GlobalCategories.filter(
        (item) => item.name === id
      );
      setArrayCategories(filteredCategories ? filteredCategories : []);
      if (filteredCategories.length) {
        setInArrayCategories(filteredCategories[0].subcategories);
      }
    }
    if (subid) {
      setSelectedSubcategory(subid);
    } else {
      setSelectedSubcategory(null);
    }
  }, [id, subid]);

  const {
    data: posts,
    isLoading: isPostLoading,
    isError: isErrorPosts,
  } = useGetRecentPosts();

  if (isErrorPosts) {
    toast({ title: "Falha ao carregar posts!" });
    return null;
  }

const filteredPosts = posts?.filter((post: PostsType) => {
  const categoryMatch =
  !selectedCategory ||
  post.category?.toLowerCase().includes(selectedCategory.toLowerCase());
  
  const subcategoryMatch =
  !selectedSubcategory ||
  post.category?.toLowerCase().includes(selectedSubcategory.toLowerCase());
  
  const searchMatch =
  !search || post.title?.toLowerCase().includes(search.toLowerCase());

  return subcategoryMatch && searchMatch;
});



  const BackRoute = () => {
    navigate(-1);
  };
  const setInList = (categoryName: string, subcategoryName?: string) => {
    if (subcategoryName) {
      setSelectedCategory(categoryName);
      setSelectedSubcategory(subcategoryName);
      navigate(`/Categories/${categoryName}/${subcategoryName}`);
    } else {
      setSelectedCategory(categoryName);
      navigate(`/Categories/${categoryName}`);
    }
  };

  const SelectRoute = (route: string) => {
    const baseUrl = `/Categories/${id}/`;
    if (route === selectedCategory) {
      setSelectedSubcategory(null);
      navigate(`${baseUrl}`);
      return;
    }
    if (!window.location.pathname.includes(route)) {
      navigate(`${baseUrl}${route}`);
    }
  };


  return (
    <section className="w-full min-h-screen h-screen flex flex-col justify-start items-center overflow-y-auto">
  {/* Hero header with background image */}
  <div className="w-full min-h-[250px] sm:h-[297px] relative overflow-hidden">
    {/* Background image with overlay */}
    <div className="absolute inset-0 bg-black/40 z-10"></div>
    <img
      src={Background || "/placeholder.svg"}
      alt=""
      className="w-full h-full object-cover bg-center absolute inset-0"
    />
    
    {/* Header content */}
    <div className="absolute inset-0 z-20 flex flex-col gap-5 justify-center items-center text-white select-none max-w-7xl mx-auto">
      <div className="relative w-full max-w-3xl flex justify-center">
  <div 
    className="w-[36px] h-[36px] sm:w-[42px] sm:h-[42px] rounded-full  flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-1" 
    onClick={BackRoute}
  >
    <svg
      viewBox="0 0 51 51"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5 sm:w-6 sm:h-6"
    >
      <path
        d="M12.75 17L4.25 25.5L12.75 34"
        stroke="white"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.25 25.5H46.75"
        stroke="white"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
  <h1 className="text-3xl sm:text-3xl md:text-4xl truncate line-clamp-1 font-bold break-words text-shadow text-center px-5">
    {!selectedSubcategory ? selectedCategory : selectedSubcategory}
  </h1>
</div>

      {/* Subcategories - Select on mobile, pills on larger screens */}
      {!selectedSubcategory && inArrayCategories?.length > 0 && (
        <div className="w-full mt-2">
          {/* Mobile Select Dropdown */}
          <div className="md:hidden w-full max-w-xs mx-auto">
            <select 
              className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white border border-white/30 appearance-none cursor-pointer"
              onChange={(e) => SelectRoute(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>Selecione uma subcategoria</option>
              {inArrayCategories.map((list, key) => (
                <option key={key} value={list.name} className="text-black">
                  {list.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Desktop Pills */}
          <div className="hidden md:flex flex-wrap justify-center gap-2 sm:gap-3">
            {inArrayCategories.map((list, key) => (
              <div
                key={key}
                onClick={() => SelectRoute(list.name)}
                className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full font-medium text-sm hover:bg-white/30 transition-all duration-300 cursor-pointer"
              >
                {list.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>

  {/* Breadcrumbs with filter buttons */}
  <div className="w-full l p-2 py-3 sm:py-4 flex items-center justify-between">
    {/* Breadcrumbs */}
    <div className="overflow-x-auto scrollbar-hide hidden md:flex">
      <ul className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
        <li className="hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer flex items-center" onClick={() => navigate("/")}>
          Home <span className="mx-1.5">/</span>
        </li>
        <li className="hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer flex items-center" onClick={() => navigate("/")}>
          The Sims 4 <span className="mx-1.5">/</span>
        </li>
        {selectedCategory && (
          <li className="hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer flex items-center" onClick={() => SelectRoute(selectedCategory)}>
            {selectedCategory} <span className="mx-1.5">/</span>
          </li>
        )}
        {subid && <li className="font-medium text-gray-900 dark:text-white">{subid}</li>}
      </ul>
    </div>
    
    {/* Filter buttons */}
    <div className="flex items-center gap-1 ml-auto">
      <p className="text-sm text-neutral-500">Filter by</p>
      <div className="space-y-3">
            <select className="custom-select w-full h-12 px-4 rounded-xl bg-white dark:bg-neutral-800 dark:text-white text-gray-900 border-none focus:ring-0 focus:outline-none outline-none transition-colors duration-200 appearance-none">
                <option value="opcao1" disabled>Jogo</option>
                <option value="opcao2 selected">The Sims 4</option>
                <option value="opcao3">The Sims 3</option>
                <option value="opcao3">The Sims 2</option>
                <option value="opcao3">The Sims 1</option>
            </select>
      </div>
      <div className="space-y-3">
            <select defaultValue="" className="custom-select w-full h-12 px-4 rounded-xl bg-white dark:bg-neutral-800 dark:text-white text-gray-900 border-none focus:ring-0 focus:outline-none outline-none transition-colors duration-200 appearance-none">
                <option value="" disabled>Gender</option>
                <option value="opcao1">Female</option>
                <option value="opcao1">Male</option>
                <option value="opcao1">Unissex</option>
            </select>
      </div>
      <div className="space-y-3">
            <select className="custom-select w-full h-12 px-4 rounded-xl bg-white dark:bg-neutral-800 dark:text-white text-gray-900 border-none focus:ring-0 focus:outline-none outline-none transition-colors duration-200 appearance-none">
                <option value="" disabled selected>Age</option>
                <option value="opcao1">Elder</option>
                <option value="opcao2">Adult</option>
            </select>
      </div>
      <div className="space-y-3">
            <select className="custom-select w-full h-12 px-4 rounded-xl bg-white dark:bg-neutral-800 dark:text-white text-gray-900 border-none focus:ring-0 focus:outline-none outline-none transition-colors duration-200 appearance-none">
                {/* Popularity: Filtra com base no score, do mais alto pro mais baixo */}
                <option value="opcao1">Popularity</option>
                <option value="opcao2">Like</option>
                <option value="opcao3">Views</option>
                <option value="opcao3">Downloads</option>
                <option value="opcao3">Newest </option>
                <option value="opcao3">Oldest</option>
            </select>
      </div>
    </div>
  </div>

  {/* Content section */}
  <div className="w-full min-h-screen">
    {isPostLoading && !posts ? (
      <div className="w-full flex justify-center py-10">
        <Loader />
      </div>
    ) : filteredPosts?.length ? (
      <div className="min-h-screen overflow-y-auto">
         <GridPostList posts={filteredPosts} />
      </div>
    ) : (
      <div className="w-full flex justify-center items-center py-16">
        <p className="text-center text-gray-500 dark:text-gray-400 text-lg">
          Nenhum post encontrado para a categoria selecionada.
        </p>
      </div>
    )}
  </div>
</section>
  );
}