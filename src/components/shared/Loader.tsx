import LoaderIcon from "@/public/assets/icons/loader.svg";
import clsx from "clsx";

const Loader = ({ className }: { className?: string }) => (
  <div className="flex-center">
    <img
      src={LoaderIcon}
      alt="loader"
      width={40}
      height={40}
      className={clsx("animate-spin", className)} // Adiciona a classe personalizada sem sobrescrever
    />
  </div>
);

export default Loader;
