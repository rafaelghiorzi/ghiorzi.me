"use client";
import { useLang } from "@/context/LanguageContext";
import Link from "next/link";

export function Navbar() {
    const { t, lang, toggleLang } = useLang();

    const handleScroll = (
        e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
        targetId: string,
    ) => {
        e.preventDefault();
        const element = document.getElementById(targetId);

        if (element) {
            const navHeight = 80;
            const elementPosition =
                element.getBoundingClientRect().top + window.scrollY;

            window.scrollTo({
                top: elementPosition - navHeight,
                behavior: "smooth",
            });
        }
    };

    return (
        <nav className="sticky flex justify-between items-center bg-[#111111] text-white w-full py-6 px-6 z-50">
            <div>
                <p className="text-sm text-white">{t.nav.name}</p>
                <p className="text-xs text-gray-300/80">{t.nav.role}</p>
            </div>
            <div className="hidden md:flex gap-4 items-center">
                <Link
                    href="#home"
                    onClick={(e) => handleScroll(e, "home")}
                    className="hover:text-[#FFD166]/80 transition-colors"
                >
                    {t.nav.hero}
                </Link>
                <Link
                    href="#projects"
                    onClick={(e) => handleScroll(e, "projects")}
                    className="hover:text-[#FFD166]/80 transition-colors"
                >
                    {t.nav.projects}
                </Link>
                <Link
                    href="#experience"
                    onClick={(e) => handleScroll(e, "experience")}
                    className="hover:text-[#FFD166]/80 transition-colors"
                >
                    {t.nav.exp}
                </Link>
                <Link
                    href="#contact"
                    onClick={(e) => handleScroll(e, "contact")}
                    className="hover:text-[#FFD166]/80 transition-colors"
                >
                    {t.nav.contact}
                </Link>
                <button
                    onClick={toggleLang}
                    className="p-2 font-medium rounded-sm hover:bg-[#FFD166]/60 hover:cursor-pointer transition-colors duration-300"
                >
                    {lang === "pt" ? "EN" : "PT"}
                </button>
            </div>
            <button
                onClick={toggleLang}
                className="block md:hidden p-2 font-medium rounded-sm hover:bg-[#FFD166]/60 hover:cursor-pointer transition-colors duration-300"
            >
                {lang === "pt" ? "EN" : "PT"}
            </button>
        </nav>
    );
}
