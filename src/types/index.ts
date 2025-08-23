export const blockRouts = ["profile", "newPost", "post"];
export const categories = [
  // "All Creations",
  "Accessories",
  "Hairstyle",
  "Clothing",
  "Shoes",
  "Makeup",
  "Genetics",
  "Pets",
  "Furniture",
  "Build Mode",
  "Lots",
  "Mods",
  "Software",
];

export type subcategoriesTypes = {
  id: number;
  name: string;
};
export type GlobalCategoriesTypes = {
  id: number;
  name: string;
  subcategories: subcategoriesTypes[];
};
export const GlobalCategories = [
  {
    id: 1,
    name: "Accessories",
    subcategories: [
      { id: 1, name: "Hats" },
      { id: 2, name: "Glasses" },
      { id: 3, name: "Necklaces" },
      { id: 4, name: "Piercings" },
      { id: 5, name: "Rings" },
      { id: 6, name: "Earrings" },
      { id: 7, name: "Bracelets" },
      { id: 9, name: "Gloves" },
      { id: 10, name: "Fingernails" },
      { id: 11, name: "Toenails" },
      { id: 12, name: "Leggings" },
      { id: 13, name: "Socks" },
      { id: 14, name: "Tail" },
      { id: 15, name: "Wings" },
      { id: 16, name: "Miscellaneous" },
    ],
  },
  {
    id: 2,
    name: "Hairstyle",
    subcategories: [
      { id: 1, name: "Short Hair" },
      { id: 2, name: "Medium Hair" },
      { id: 3, name: "Long Hair" },
      { id: 4, name: "Updo Hair" },
    ],
  },
  {
    id: 3,
    name: "Clothing",
    subcategories: [
      { id: 1, name: "T-shirts" },
      { id: 2, name: "Blouses" },
      { id: 3, name: "Jackets" },
      { id: 4, name: "Dresses" },
      { id: 5, name: "Sweaters" },
      { id: 6, name: "Sweatshirts" },
      { id: 7, name: "Brassieres" },
      { id: 8, name: "Tanks" },
      { id: 9, name: "Vests" },
      { id: 10, name: "Long Dresses" },
      { id: 11, name: "Short Dresses" },
      { id: 12, name: "Jump Suits" },
      { id: 13, name: "Sets" },
      { id: 14, name: "Costumes" },
      { id: 15, name: "Robes" },
      { id: 16, name: "Lingeries" },
      { id: 17, name: "Aprons" },
      { id: 18, name: "Swimsuits" },
      { id: 19, name: "Pants" },
      { id: 20, name: "Skirts" },
      { id: 21, name: "Shorts" },
      { id: 22, name: "Underwears" },
      { id: 23, name: "Swimwears" },
      { id: 24, name: "Miscellaneous" },
    ],
  },
  {
    id: 4,
    name: "Shoes",
    subcategories: [
      { id: 1, name: "Sneakers" },
      { id: 2, name: "Boots" },
      { id: 3, name: "High Heels" },
      { id: 4, name: "Flats" },
      { id: 5, name: "Sandals" },
      { id: 6, name: "Loafers" },
      { id: 7, name: "Slippers" },
      { id: 8, name: "Wedges" },
    ],
  },
  {
    id: 5,
    name: "Makeup",
    subcategories: [
      { id: 1, name: "Eyeshadow" },
      { id: 2, name: "Eyelashes" },
      { id: 3, name: "Eyeliner" },
      { id: 4, name: "Highlights" },
      { id: 5, name: "Countour" },
      { id: 6, name: "Blush" },
      { id: 7, name: "Face Paint" },
      { id: 8, name: "Lipstick" },
    ],
  },
  {
    id: 6,
    name: "Genetics",
    subcategories: [
      { id: 1, name: "Eyes" },
      { id: 2, name: "Eyebrows" },
      { id: 3, name: "Eye Details" },
      { id: 4, name: "Skins" },
      { id: 5, name: "Skin Details" },
      { id: 6, name: "Teeth" },
      { id: 7, name: "Sims" },
      { id: 8, name: "Presets" },
      { id: 9, name: "Sliders" },
    ],
  },
  {
    id: 7,
    name: "Pets",
    subcategories: [
      { id: 1, name: "Acessories" },
      { id: 2, name: "Clothings" },
      { id: 3, name: "Furniture" },
      { id: 4, name: "Fur" },
      { id: 5, name: "Tail" },
      { id: 6, name: "Miscellaneous" },
    ],
  },
  {
    id: 8,
    name: "Furniture",
    subcategories: [
      { id: 1, name: "Bathroom" },
      { id: 2, name: "Bedroom" },
      { id: 3, name: "Dining Room" },
      { id: 4, name: "Kid's Room" },
      { id: 5, name: "Kitchen" },
      { id: 6, name: "Living Room" },
      { id: 7, name: "Outdoor" },
      { id: 8, name: "Study" },
      { id: 9, name: "Studio" },
      { id: 10, name: "Commerce" },
      { id: 11, name: "Decoration" },
      { id: 12, name: "Miscellaneous" },
    ],
  },
  {
    id: 9,
    name: "Build Mode",
    subcategories: [
      { id: 1, name: "Collumns" },
      { id: 2, name: "Doors" },
      { id: 3, name: "Fences" },
      { id: 4, name: "Friezes and Exterior Prims" },
      { id: 5, name: "Gates" },
      { id: 6, name: "Plants" },
      { id: 7, name: "Rocks" },
      { id: 8, name: "Roof Patterns" },
      { id: 9, name: "Roof Sculptures" },
      { id: 10, name: "Spandrels" },
      { id: 11, name: "Stair Rallings" },
      { id: 12, name: "Stairs and Ladders" },
      { id: 13, name: "Terrains" },
      { id: 14, name: "Wall Patterns" },
      { id: 15, name: "Water" },
      { id: 16, name: "Windows" },
    ],
  },
  {
    id: 10,
    name: "Lots",
    subcategories: [
      { id: 1, name: "Residential" },
      { id: 2, name: "Community" },
      { id: 3, name: "Commercial" },
      { id: 4, name: "Industrial" },
      { id: 5, name: "Scenario" },
      { id: 6, name: "Park" },
    ],
  },
  {
    id: 11,
    name: "Mods",
    subcategories: [
      { id: 1, name: "Poses" },
      { id: 2, name: "Effects" },
      { id: 3, name: "Shaders" },
      { id: 4, name: "Scripts" },
      { id: 5, name: "Traits" },
      { id: 6, name: "Carrer" },
      { id: 7, name: "Miscellaneous" },
    ],
  },
  {
    id: 12,
    name: "Software",
    subcategories: [
      { id: 1, name: "Editors" },
      { id: 2, name: "Utilities" },
      { id: 3, name: "Managers" },
      { id: 4, name: "Launchers" },
      { id: 5, name: "Plugins" },
      { id: 3, name: "Graphics" },
    ],
  },
];
export const AgeCategories = [
  "Adult",
  "Teen",
  "Child",
  "Toddler",
  "Infant",
  "Newborn",
];
export const petTypes = ["Dog", "Cat", "Rabbit", "Other"];
export const excludeGenderAge = [
  "Pets",
  "Build Mode",
  "Furniture",
  "Mods",
  "Software",
  "Lots",
];
export interface ProvidersList {
    provider: "GOOGLE" | "DISCORD" | "CREDENTIAL" | "GITHUB";
    email: string;
    imageUrl: string;
    bannerUrl: string;
    bio: string;
    site: string;
    verified: string;
    vip: string;
}

export type IUser = {
  id?: string;
  email?: string;
  bannerUrl?: string;
  imageUrl?: string;
  name?: string;
  firstname?: string;
  username?: string;
  site?: string;
  vip?: boolean;
  verified?: boolean;
  bio?: string;
  Country?: string;
  providers?: ProvidersList[];
  file?: File[];
  colections?: CollectionsProps[];
  followers?: any[];
  following?: any[];
  isDarkMode?: boolean;
  theme?: string;
  posts?: {
    id: string;
    content: string;
    imageUrl: string;
    imageId: string;
    createdAt: string;
    likes: likesType[];
  }[];
};
export type INewUser = {
  email?: string;
  username?: string;
  password?: string;
};
export type likesType = {
  id: string;
  userId: string;
  postId: string;
  createdAt: string;
};
export type PostType = {
  id: string | number;
  status?: "Published" | "Pending" | "Rejected";
  title: string;
  game: string;
  description: string;
  category: string;
  gender: any | string;
  link: string;
  age: any;
  pet: string;
  images: string | any[];
  likes?: likesType[];
};

export type ReceivedPost = {
  images: string;
  createdAt: string;
  updatedAt: string;
  age: any;
  category: string;
  description: string;
  gender: any | string;
  id: string;
  link: string;
  pet: string;
  title: string;
  userId: number;
  likes?: likesType[];
  creator: {
    bannerUrl: string;
    imageUrl: string;
    username: string;
    verified: boolean;
    vip: boolean;
  };
};

export interface PostsType {
  creator: {
    id: number;
    bannerUrl: string;
    imageUrl: string;
    username: string;
    verified: boolean;
    vip: boolean;
  };
  id: string | number;
  title: string;
  description: string;
  category: string;
  gender: any | string;
  link: string;
  age: any;
  pet: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  images: string;
  likes?: likesType[];
  verified: "Pending" | "Published" | "Rejected";
}

export interface CollectionsProps {
  creator?: {
    id: number;
    bannerUrl: string;
    imageUrl: string;
    username: string;
    verified: boolean;
    vip: boolean;
  };
  id?: string;
  bannerUrl?: string;
  description: string;
  private: boolean;
  name: string;
  posts: PostsType[];
}
