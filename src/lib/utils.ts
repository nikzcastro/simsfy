import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export function formatDateString(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("en-US", options);

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${formattedDate} at ${time}`;
}

// 
export const multiFormatDateString = (timestamp: string = ""): string => {

  
  if (!timestamp) return "Just now";

  // Ajusta o formato de timestamp para ISO 8601 (YYYY-MM-DDTHH:mm:ss)
  const formattedTimestamp = timestamp.replace(" ", "T");

  const date: Date = new Date(formattedTimestamp); // ISO 8601 é suportado
  if (isNaN(date.getTime())) return "Just now";

  const now: Date = new Date();

  // Converta as datas para UTC
  const diff: number = now.getTime() - date.getTime();
  const diffInSeconds: number = diff / 1000;
  const diffInMinutes: number = diffInSeconds / 60;
  const diffInHours: number = diffInMinutes / 60;
  const diffInDays: number = diffInHours / 24;

  if (diff < 0) return "less than 1 hour";

  if (diffInMinutes < 60) {
    return `${Math.floor(diffInMinutes)} minutes ago`; 
  }

  switch (true) {
    case Math.floor(diffInDays) >= 30:
      return date.toISOString().split("T")[0];
    case Math.floor(diffInDays) === 1:
      return `1 day ago`;
    case Math.floor(diffInDays) > 1:
      return `${Math.floor(diffInDays)} days ago`;
    case Math.floor(diffInHours) >= 1:
      return `${Math.floor(diffInHours)} hours ago`;
    default:
      return "less than 1 hour";
  }
};





export const checkIsLiked = (likeList: string[], userId: string) => {
  return likeList.includes(userId);
};