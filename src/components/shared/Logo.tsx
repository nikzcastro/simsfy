import { useEffect, useState } from "react";
import LogoDefault from "@/public/assets/images/fiveStation.png";
import LogoWhite from "@/public/assets/images/fiveStation_white.png";
import { useUserContext } from "@/context/AuthContext";

export default function Logo() {
    const { isDarkMode } = useUserContext()

    return (
        <div className="w-full flex justify-center items-center">
            <img draggable={false} src={isDarkMode ? LogoWhite : LogoDefault} alt="Logo" />
        </div>
    );
}
