"use client";
import { useLang } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import Link from "next/link";

export function Navbar() {
    const { t, lang, toggleLang } = useLang();

    // Função para interceptar o clique e fazer o scroll suave
    const handleScroll = (
        e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
        targetId: string,
    ) => {
        e.preventDefault(); // Previne o comportamento padrão de teleporte do link
        const element = document.getElementById(targetId);

        if (element) {
            // Pega a posição do elemento e desconta a altura da navbar para não sobrepor o título
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
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 left-0 right-0 z-50 bg-[#161410]/50 text-white backdrop-blur-md"
        >
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex flex-col min-w-fit">
                    <h1 className="text-lg font-bold">{t.nav.name}</h1>
                    <p className="text-sm text-gray-200">{t.nav.role}</p>
                </div>
                <div className="hidden md:flex gap-6 items-center font-medium">
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
                        className="ml-4 px-3 py-1.5 bg-[#000000]/40 hover:bg-[#FFD166]/60 hover:cursor-pointer rounded-full text-sm transition-colors duration-300"
                    >
                        {lang === "pt" ? "EN" : "PT"}
                    </button>
                </div>
            </div>
        </motion.nav>
    );
}
