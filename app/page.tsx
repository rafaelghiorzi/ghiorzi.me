"use client";

import { Navbar } from "@/components/Navbar";
import { ProjectCard } from "@/components/ProjectCard";
import { useLang } from "@/context/LanguageContext";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Home() {
    const { t } = useLang();

    // Controle do parallax no mobile
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Verifica na montagem inicial
        handleResize();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Referências para observar o scroll individual de cada seção
    const projectRef = useRef(null);
    const experienceRef = useRef(null);

    // Setup para o Parallax do Hero
    const { scrollY } = useScroll();
    const heroY = useTransform(scrollY, [0, 400], [0, 150]);
    const opacity = useTransform(scrollY, [0, 1000], [1, 0]);

    // Parallax Projetos (Apenas coluna direita)
    const { scrollYProgress: projectScroll } = useScroll({
        target: projectRef,
        offset: ["start end", "end start"],
    });
    const projectRightY = useTransform(projectScroll, [0, 1], [150, -150]);

    const splitData = (data: any[]) => {
        const withIndex = data.map((item, i) => ({
            ...item,
            originalIndex: i,
        }));
        const left = withIndex.filter((_, i) => i % 2 === 0);
        const right = withIndex.filter((_, i) => i % 2 !== 0);
        return { left, right };
    };

    const projects = splitData(t.projectsData);

    return (
        <main className="h-screen w-screen">
            <Navbar />

            <section id="home" className="flex justify-center bg-black">
                <motion.article className="flex flex-col md:flex-row justify-between w-5xl p-8">
                    <motion.div className="relative block md:hidden rounded-3xl max-w-xl h-50 w-40 bg overflow-hidden mb-8">
                        <Image
                            src="/eu.png"
                            alt="perfil"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                        />
                    </motion.div>
                    <motion.div className="flex flex-col py-4 max-w-md">
                        <motion.h1 className="text-white text-4xl md:text-5xl font-bold mb-4">
                            {t.hero.title}
                        </motion.h1>
                        <motion.p className="text-gray-300/80 text-md md:text-xl font">
                            {t.hero.desc}
                        </motion.p>
                        <motion.div className="text-white flex flex-row gap-4 mt-4">
                            <a
                                className="hover:underline hover:text-[#FFD166] transition-all duration-200"
                                href={t.contact.linkedin}
                                target="_blank"
                            >
                                Linkedin
                            </a>
                            <a
                                className="hover:underline hover:text-[#FFD166] transition-all duration-200"
                                href={t.contact.github}
                                target="_blank"
                            >
                                GitHub
                            </a>
                        </motion.div>
                    </motion.div>
                    <motion.div className="relative hidden md:block rounded-3xl max-w-xl h-120 w-80 bg overflow-hidden">
                        <Image
                            src="/eu.png"
                            alt="perfil"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                        />
                    </motion.div>
                </motion.article>
            </section>

            <section id="about" className="flex justify-center bg-gray-500">
                <motion.article className="flex flex-col w-5xl p-8">
                    <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">
                        {t.introduction.title}
                    </h2>
                    <p className="text-gray-300/80">{t.introduction.desc}</p>
                </motion.article>
            </section>

            <section
                id="projects"
                ref={projectRef}
                className="flex justify-center bg-black"
            >
                <motion.article className="flex flex-col justify-center items-center w-5xl p-8">
                    <motion.div className="flex flex-col text-center max-w-xl">
                        <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">
                            {t.projects.title}
                        </h2>
                        <p className="text-gray-300/80">{t.projects.desc}</p>
                    </motion.div>

                    {/* Grade de projetos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mt-12">
                        {/* Coluna esquerda estática */}
                        <div className="flex flex-col gap-8">
                            {projects.left.map((proj, idx) => (
                                <ProjectCard
                                    key={`proj-l-${idx}`}
                                    title={proj.title}
                                    desc={proj.desc}
                                    img={proj.img}
                                    tech={proj.tech}
                                    link={proj.link}
                                    index={proj.originalIndex}
                                />
                            ))}
                        </div>

                        {/* Coluna direita dinâmica */}
                        <motion.div
                            // Condição aplicada: Y estático (0) se for mobile
                            style={{ y: isMobile ? 0 : projectRightY }}
                            className="flex flex-col gap-8"
                        >
                            {projects.right.map((proj, idx) => (
                                <ProjectCard
                                    key={`proj-r-${idx}`}
                                    title={proj.title}
                                    desc={proj.desc}
                                    img={proj.img}
                                    tech={proj.tech}
                                    link={proj.link}
                                    index={proj.originalIndex}
                                />
                            ))}
                        </motion.div>
                    </div>
                </motion.article>
            </section>
        </main>
    );
}
