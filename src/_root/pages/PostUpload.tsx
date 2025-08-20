import React, { useEffect, useState } from "react";
import {
  AgeCategories,
  categories,
  excludeGenderAge,
  GlobalCategories,
  petTypes,
  PostType,
} from "../../types";
import Papa from "papaparse";
import { useUserContext } from "../../context/AuthContext";
import { useUpdateUser, useUpLoadPosts } from "../../lib/react-query/queries";
import { Loader } from "../../components/shared";
import { useToast } from "../../components/ui";
import { uploadFile } from "@/lib/appwrite/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Select from "@/components/shared/Select";
import SelectCategories from "@/components/shared/SelectCategories";
import { format } from "path";

export default function PostUpload() {
  const { user, isLoading: isUserLoading, checkAuthUser } = useUserContext();
  const [posts, setPosts] = useState([]);
  const [images, setImages] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PostType>({
    id: 0,
    title: "",
    description: "",
    game: "The Sims 4",
    category: "All Creations",
    gender: "Male",
    link: "",
    age: "Adult",
    pet: "",
    images: "",
    status: "Published",
  });
  const {
    mutateAsync: updatePosts,
    isLoading: isUpdating,
    error: updateError,
  } = useUpLoadPosts();
  const { toast } = useToast();

  useEffect(() => {
    setFormData({
      ...formData,
      id: Number(user.id),
    });
  }, []);

  const handleImageUpload = async (event) => {
    const files = event.target.files;
    if (files) {
      const newImages = await Promise.all(
        Array.from(files).map(async (file: File) => {
          const response = await uploadFile(file, Number(user.id));
          return response.url;
        })
      );
      setFormData({ ...formData, images: newImages });
      setImages((prevImages) => [...prevImages, ...newImages]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleInputChangeGame = (data) => {
    const { name, value } = data;
    setFormData({ ...formData, [name]: value });
  };

  const handleGenderChange = (e) => {
    const value = e.target.value;
    const updatedGender = formData.gender.split("/");
    const newGender = updatedGender.includes(value)
      ? updatedGender.filter((item) => item !== value)
      : [...updatedGender, value];

    setFormData({
      ...formData,
      gender: newGender.join("/"),
    });
  };

  const handleAgeChange = (e) => {
    const value = e.target.value;
    const updatedGender = formData.age.split("/");
    const newGender = updatedGender.includes(value)
      ? updatedGender.filter((item) => item !== value)
      : [...updatedGender, value];

    setFormData({
      ...formData,
      age: newGender.join("/"),
    });
  };

  // const handleGenderChange = (e) => {
  //   setFormData({ ...formData, gender: e.target.value });
  // };

  // const handleAgeChange = (e) => {
  //   setFormData({ ...formData, age: e.target.value });
  // };

  const handleSubmit = async () => {
    const sucess = (await updatePosts(posts)) as any;
    if (!sucess || sucess.error) {
      toast({ title: sucess.error || (updateError as any) });
      return;
    } else {
      toast({ title: "Postagem Concluida !" });
    }

    // navigate("/");
  };
  const addPost = () => {
    setPosts((prevPosts) => [...prevPosts, { ...formData, images }]);
    // setFormData({
    //   id: user.id,
    //   title: "",
    //   description: "",
    //   category: "All Creations",
    //   gender: "Male",
    //   game: "The Sims 4",
    //   link: "",
    //   age: "Adult",
    //   pet: "",
    //   images: "",
    //   status: "Published",
    // });
    setImages([]);
  };

  const handleCSVUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (result) => {
          const newPosts = result.data.map((data) => {
            return {
              id: user.id,
              title: data.post_title || "",
              description: data.post_content || "",
              category: data.post_cat || "All Creations",
              gender: data.Gender || "",
              link: data.post_url || "",
              age: data.Age || "",
              pet: "",
              images:
                typeof data.images === "string"
                  ? data.images
                  : typeof data.images !== "string"
                    ? data.images[0]
                    : [],
            };
          });
          setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        },
        error: (error) => {
          console.error("Erro ao processar o CSV:", error);
        },
      });
    }
  };

  const generateImageGrid = () => {
  return (
    <div className="w-full">
      {/* Layout Desktop - md e acima */}
      <div className="hidden  md:block space-y-4">
        {/* Primeira imagem - Grande */}
        <div className="w-full ">
          <div
            key={0}
            className="relative group w-full aspect-[4/3] overflow-hidden rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 transition-all hover:shadow-md"
          >
            {images[0] ? (
              <>
                <img
                  src={images[0] || "/placeholder.svg"}
                  alt="Preview 1"
                  className="w-full h-full object-cover bg-center rounded-xl"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => handleRemoveImage(0)}
                    className="p-2 bg-red rounded-full hover:bg-red/80 transition-all"
                    aria-label="Remover imagem"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <span className="absolute top-2 left-2 text-xs font-medium bg-lime-300 text-black px-2 py-1 rounded-full">
                  Principal
                </span>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-neutral-900">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-400 mb-2"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
                <span className="text-sm font-medium text-gray-500 text-center">Imagem Principal</span>
              </div>
            )}
            <span className="absolute bottom-2 right-2 text-xs font-medium bg-black/60 text-white px-1.5 py-0.5 rounded-full">
              1
            </span>
          </div>
        </div>

        {/* Outras 4 imagens - Pequenas */}
        <div className="w-full">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Imagens Adicionais ({images.slice(1, 5).filter(Boolean).length}/4)
          </h4>
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className="relative group w-full aspect-[4/3] overflow-hidden rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 transition-all hover:shadow-md"
              >
                {images[index] ? (
                  <>
                    <img
                      src={images[index] || "/placeholder.svg"}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover bg-center rounded-xl"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="p-2 bg-red rounded-full hover:bg-red/90 transition-all"
                        aria-label="Remover imagem"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-neutral-900">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-400 mb-1"
                    >
                      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                      <circle cx="9" cy="9" r="2" />
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                    </svg>
                    
                  </div>
                )}
                <span className="absolute bottom-1 right-1 text-xs font-medium bg-black/60 text-white px-1.5 py-0.5 rounded-full">
                  {index + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Layout Mobile - md para baixo */}
      <div className="block md:hidden">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Imagens ({images.filter(Boolean).length}/5)
        </h4>
        <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-neutral-600 scrollbar-track-transparent">
          {[0, 1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className="relative group flex-shrink-0 w-32 aspect-[4/3] overflow-hidden rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 transition-all hover:shadow-md"
            >
              {images[index] ? (
                <>
                  <img
                    src={images[index] || "/placeholder.svg"}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover bg-center rounded-xl"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="p-1 bg-red rounded-full hover:bg-red-80 transition-all"
                      aria-label="Remover imagem"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  {index === 0 && (
                    <span className="absolute top-1 left-1 text-xs font-medium bg-lime-300 text-black px-1 py-0.5 rounded">
                      P
                    </span>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-neutral-900">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-400"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                </div>
              )}
              <span className="absolute bottom-0.5 right-0.5 text-xs font-medium bg-black/60 text-white px-1 py-0.5 rounded">
                {index + 1}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Deslize para ver todas as imagens • A primeira é a principal
        </p>
      </div>
    </div>
  );
};

  const handleClose = () => {
    navigate("/");
  };

  const categoriesOptions = () => {
    const Table = [];
    if (GlobalCategories) {
      GlobalCategories.map((categorie) => {
        Table.push({
          name: categorie.name,
          subcategorie: categorie.subcategories,
        });
      });
    }
    return Table;
  };

  return (
    <div className="w-full relative pt-2 flex justify-center items-center select-none overflow-hidden">
      <motion.div className="w-full  max-w-7xl h-[90vh] rounded-3xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="w-full flex justify-between items-center p-4 border-b border-gray-200 dark:border-neutral-700 flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Criar Nova Postagem</h2>
          <button
            onClick={handleClose}
            className="xs:block md:hidden p-2 hover:bg-gray-100 dark:hover:bg-neutral-900 rounded-full transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="text-gray-600 dark:text-gray-400"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Main Content - Two Columns */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          {/* Left Column - Image Upload */}
          <div className="w-full lg:w-1/2 p-6 border-r border-gray-200 dark:border-neutral-700 flex flex-col">
  {/* Header com título e botão lado a lado */}
  <div className="flex items-center justify-between mb-4 flex-shrink-0">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
      Upload de Imagens
    </h3>
    
    <input
      type="file"
      accept="image/png, image/jpeg, image/gif"
      multiple
      onChange={handleImageUpload}
      className="hidden"
      id="image-upload"
    />
    <label 
      htmlFor="image-upload" 
      className="w-10 h-10 bg-lime-300 hover:bg-lime-400 text-black rounded-full cursor-pointer transition-all duration-500 hover:scale-110 flex items-center justify-center group shadow-lg hover:shadow-xl"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="group-hover:scale-110 transition-transform"
      >
        <path d="M5 12h14" />
        <path d="M12 5v14" />
      </svg>
    </label>
  </div>

  {/* Image Grid Preview */}
  <div className="flex-1 overflow-y-auto">
    <div className="w-full flex justify-center items-center gap-1">{generateImageGrid()}</div>
  </div>
</div>

          {/* Right Column - Form with Scroll */}
          <div className="w-full lg:w-1/2 flex flex-col overflow-hidden">
            <div className="p-6 pb-0 flex-shrink-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Informações da Postagem</h3>
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-neutral-600 scrollbar-track-transparent">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-gray-300 dark:focus:ring-neutral-700 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                  placeholder="Adicione um título"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Descrição
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-gray-300 dark:focus:ring-neutral-700 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white resize-none"
                  placeholder="Adicione uma descrição"
                />
              </div>

              {/* Game and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="game" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Jogo
                  </label>
                  <Select
                    id="game"
                    name="game"
                    subActive={false}
                    value={formData.game}
                    onChange={handleInputChangeGame}
                    options={["The Sims 1", "The Sims 2", "The Sims 3", "The Sims 4"]}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-gray-300 dark:focus:ring-neutral-700 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Categoria
                  </label>
                  <SelectCategories
                    id="category"
                    name="category"
                    subActive={true}
                    value={formData.category}
                    onChange={handleInputChangeGame}
                    options={categoriesOptions()}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-gray-300 dark:focus:ring-neutral-700 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Gender and Age (conditional) */}
              {!excludeGenderAge.includes(formData.category) && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Gênero</label>
                    <div className="flex gap-6">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="gender"
                          value="Male"
                          checked={formData.gender.includes("Male")}
                          onChange={handleGenderChange}
                          className="w-4 h-4 text-lime-300 bg-gray-100 border-gray-300 rounded focus:ring-gray-300 dark:focus:ring-neutral-700 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">Masculino</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="gender"
                          value="Female"
                          checked={formData.gender.includes("Female")}
                          onChange={handleGenderChange}
                          className="w-4 h-4 text-lime-300 bg-gray-100 border-gray-300 rounded focus:ring-gray-300 dark:focus:ring-neutral-700 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">Feminino</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Idade</label>
                    <div className="flex flex-wrap gap-4">
                      {AgeCategories.map((ageOption) => (
                        <label key={ageOption} className="flex items-center">
                          <input
                            type="checkbox"
                            name="age"
                            value={ageOption}
                            checked={formData.age.includes(ageOption)}
                            onChange={handleAgeChange}
                            className="w-4 h-4 text-lime-300 bg-gray-100 border-gray-300 rounded focus:ring-gray-300 dark:focus:ring-neutral-700 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <span className="ml-2 text-gray-700 dark:text-gray-300">{ageOption}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Pet Type (conditional) */}
              {(formData.category === "Pets" ||
                formData.category.includes("Pet") ||
                GlobalCategories.some((categorie) =>
                  categorie.subcategories.some(
                    (sub) =>
                      sub.name === "Pets" &&
                      categorie.subcategories.some((subCategory) => subCategory.name === formData.category),
                  ),
                )) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Tipo de Pet</label>
                  <div className="flex flex-wrap gap-4">
                    {petTypes.map((petType) => (
                      <label key={petType} className="flex items-center">
                        <input
                          type="radio"
                          name="age"
                          value={petType}
                          checked={formData.age === petType}
                          onChange={handleAgeChange}
                          className="w-4 h-4 text-lime-300 bg-gray-100 border-gray-300 focus:ring-gray-300 dark:focus:ring-neutral-700 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">{petType}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Link */}
              <div>
                <label htmlFor="link" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Link para a postagem original
                </label>
                <input
                  type="text"
                  id="link"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-gray-300 dark:focus:ring-neutral-700 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                  placeholder="Cole a URL aqui, ex: mymod.com/mycreation"
                />
              </div>

              {/* CSV Upload */}
              <div>
                <label htmlFor="csv-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Importar CSV
                </label>
                <input
                  type="file"
                  id="csv-upload"
                  accept=".csv"
                  onChange={handleCSVUpload}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-gray-300 dark:focus:ring-neutral-700 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-lime-400 hover:file:bg-blue-100"
                />
              </div>

              {/* Add Post Button */}
              <button
                onClick={addPost}
                className="w-full py-3 bg-gray-300  dark:bg-neutral-900 hover:bg-gray-400  dark:hover:bg-neutral-900 text-black/60 dark:text-white font-semibold rounded-xl transition-colors"
              >
                Adicionar Postagem
              </button>

              {/* Posts Added */}
              {posts.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Posts Adicionados</h4>
                  <div className="space-y-3">
                    {posts.map((post, index) => (
                      <div key={index} className="bg-gray-50 dark:bg-neutral-900 p-4 rounded-xl">
                        <h5 className="font-semibold text-gray-900 dark:text-white">{post.title}</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{post.description}</p>
                        <div className="flex gap-2 mt-3">
                          {Array.isArray(post.images) ? (
                            post.images.map((image, i) => (
                              <img
                                key={i}
                                src={image || "/placeholder.svg"}
                                alt={`Post ${index} Image ${i}`}
                                className="w-12 h-12 object-cover rounded-lg"
                              />
                            ))
                          ) : (
                            <img
                              src={post?.images || "/placeholder.svg"}
                              alt={`Post ${index} Image`}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions - Fixed at bottom */}
            <div className="p-6 pt-4 border-t border-gray-200 dark:border-neutral-700 flex-shrink-0">
              <button
                onClick={handleSubmit}
                disabled={isUpdating}
                className="w-full py-4 bg-lime-300 hover:bg-lime-400 disabled:bg-blue-400 text-black font-semibold rounded-xl transition-colors flex items-center justify-center"
              >
                {isUpdating ? <Loader /> : "Enviar Postagem"}
              </button>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                Ao enviar uma postagem você concorda com nossa{" "}
                <a href="/about" className="text-lime-300 hover:text-lime-400">
                  Política
                </a>{" "}
                e{" "}
                <a href="/about" className="text-lime-300 hover:text-lime-400">
                  Termos de Serviço
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
