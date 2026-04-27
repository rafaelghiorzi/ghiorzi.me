"use client";

import { ExperienceCard } from "@/components/ExperienceCard";
import LavaLamp from "@/components/LavaLamp";
import { Navbar } from "@/components/Navbar";
import { ProjectCard } from "@/components/ProjectCard";
import { useLang } from "@/context/LanguageContext";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Home() {
    const { t } = useLang();
    const [isReady, setIsReady] = useState(false);

    // Variants para animações de entrada de seção
    const sectionContentVariants: Variants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 1.5, ease: "easeOut" },
        },
    };

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
    const aboutRef = useRef(null);

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

    // Parallax Imagem About
    const { scrollYProgress: aboutScroll } = useScroll({
        target: aboutRef,
        offset: ["start end", "end start"],
    });
    const aboutImageY = useTransform(aboutScroll, [0, 1], ["-15%", "20%"]);

    // Parallax Experiências (Apenas coluna direita)
    const { scrollYProgress: expScroll } = useScroll({
        target: experienceRef,
        offset: ["start end", "end start"],
    });
    const expRightY = useTransform(expScroll, [0, 1], [100, -90]);

    // Helper para dividir os dados em duas colunas intercaladas
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
    const experiences = splitData(t.expData);

    return (
        <>
            {!isReady && <div className="fixed inset-0 bg-[#252526] z-999" />}
            <main
                className={`min-h-screen min-w-screen bg-[#252526] transition-opacity duration-1000 ease-in-out ${
                    isReady ? "opacity-100" : "opacity-0"
                }`}
            >
                <Navbar />

                <section
                    id="home"
                    className="flex justify-center py-10 md:py-32"
                >
                    <motion.article
                        style={{ y: isMobile ? 0 : heroY, opacity }}
                        className="flex flex-col md:flex-row justify-between w-6xl p-4"
                    >
                        {/* Mobile LavaLamp */}
                        <motion.div className="relative block md:hidden h-80 rounded-3xl max-w-xl overflow-hidden mb-8">
                            <LavaLamp setReady={setIsReady} />
                        </motion.div>
                        <motion.div className="flex flex-col py-4 max-w-md">
                            <motion.h1
                                initial={{ opacity: 0, y: 100 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 1,
                                    delay: 0.5,
                                    ease: "easeInOut",
                                }}
                                className="text-white text-4xl md:text-5xl font-bold mb-4"
                            >
                                {t.hero.title}
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: 1,
                                    duration: 1,
                                    ease: "easeInOut",
                                }}
                                className="text-gray-300/80 text-md md:text-xl font"
                            >
                                {t.hero.desc}
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{
                                    delay: 1.5,
                                    duration: 1,
                                    ease: "easeInOut",
                                }}
                                className="text-white flex flex-row gap-4 mt-4"
                            >
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
                        {/* Desktop LavaLamp */}
                        <motion.div className="relative hidden md:block rounded-3xl w-full h-100 max-w-xl overflow-hidden">
                            <LavaLamp setReady={setIsReady} />
                        </motion.div>
                    </motion.article>
                </section>

                <section
                    id="about"
                    ref={aboutRef}
                    className="flex justify-center py-10 md:py-32"
                >
                    <motion.article
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={sectionContentVariants}
                        className="flex flex-col md:flex-row md:gap-16 w-6xl p-4 items-center"
                    >
                        <div className="relative w-full md:w-1/3 h-112.5 rounded-3xl overflow-hidden shadow-2xl">
                            <motion.div
                                style={{ y: aboutImageY }}
                                initial={{ scale: 1.3 }}
                                whileInView={{ scale: 1 }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="relative w-full h-[120%]"
                            >
                                <Image
                                    src="/eu.png"
                                    alt="about profile"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    loading="eager"
                                />
                            </motion.div>
                        </div>
                        <div className="flex flex-col md:w-1/2 mt-12 md:mt-0">
                            <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">
                                {t.introduction.title}
                            </h2>
                            <p className="text-gray-300/80 text-lg leading-relaxed">
                                {t.introduction.desc}
                            </p>
                        </div>
                    </motion.article>
                </section>

                <section
                    id="projects"
                    ref={projectRef}
                    className="flex justify-center py-10 md:py-32"
                >
                    <motion.article
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                        variants={sectionContentVariants}
                        className="flex flex-col justify-center items-center w-6xl p-4"
                    >
                        <motion.div className="flex flex-col text-center max-w-xl">
                            <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">
                                {t.projects.title}
                            </h2>
                            <p className="text-gray-300/80">
                                {t.projects.desc}
                            </p>
                        </motion.div>

                        {/* Grade de projetos */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start mt-12">
                            {/* Coluna esquerda estática */}
                            <div className="flex flex-col gap-4">
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
                                className="flex flex-col gap-4"
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

                <section
                    id="experience"
                    ref={experienceRef}
                    className="flex justify-center py-10 md:py-32"
                >
                    <motion.article
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                        variants={sectionContentVariants}
                        className="flex flex-col justify-center items-center w-6xl p-4"
                    >
                        <motion.div className="flex flex-col text-center max-w-xl">
                            <motion.h1 className="text-white text-4xl md:text-5xl font-bold mb-4">
                                {t.experience.title}
                            </motion.h1>
                            <motion.p className="text-gray-300/80 text-md md:text-xl font">
                                {t.experience.desc}
                            </motion.p>
                        </motion.div>

                        {/* Grade de projetos */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start mt-12">
                            {/* Coluna esquerda estática */}
                            <div className="flex flex-col gap-4">
                                {experiences.left.map((exp, idx) => (
                                    <ExperienceCard
                                        key={`exp-l-${idx}`}
                                        role={exp.role}
                                        company={exp.company}
                                        time={exp.time}
                                        desc={exp.desc}
                                        tech={exp.tech}
                                        index={exp.originalIndex}
                                        side="left"
                                    />
                                ))}
                            </div>

                            {/* Coluna direita dinâmica */}
                            <motion.div
                                // Condição aplicada: Y estático (0) se for mobile
                                style={{ y: isMobile ? 0 : expRightY }}
                                className="flex flex-col gap-4"
                            >
                                {experiences.left.map((exp, idx) => (
                                    <ExperienceCard
                                        key={`exp-r-${idx}`}
                                        role={exp.role}
                                        company={exp.company}
                                        time={exp.time}
                                        desc={exp.desc}
                                        tech={exp.tech}
                                        index={exp.originalIndex}
                                        side="right"
                                    />
                                ))}
                            </motion.div>
                        </div>
                    </motion.article>
                </section>

                <section id="contact" className="flex justify-center">
                    <motion.article className="flex flex-col justify-center items-center w-6xl p-4">
                        <motion.h1 className="text-white text-4xl md:text-5xl font-bold mb-4">
                            {t.contact.title}
                        </motion.h1>
                        <motion.p className="text-gray-300/80 text-md md:text-xl font">
                            {t.contact.desc}
                        </motion.p>

                        <motion.div className="flex flex-row gap-10 mt-8">
                            <a href={t.contact.linkedin} target="_blank">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32"
                                    height="32"
                                    viewBox="0 0 256 256"
                                    className="fill-gray-300/80 hover:scale-110 ease-in-out duration-200 transition-all"
                                >
                                    <path d="M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24Zm0,192H40V40H216V216ZM96,112v64a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0Zm88,28v36a8,8,0,0,1-16,0V140a20,20,0,0,0-40,0v36a8,8,0,0,1-16,0V112a8,8,0,0,1,15.79-1.78A36,36,0,0,1,184,140ZM100,84A12,12,0,1,1,88,72,12,12,0,0,1,100,84Z"></path>
                                </svg>
                            </a>

                            <a href={t.contact.github} target="_blank">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32"
                                    height="32"
                                    className="fill-gray-300/80 hover:scale-110 ease-in-out duration-200 transition-all"
                                    viewBox="0 0 256 256"
                                >
                                    <path d="M208.31,75.68A59.78,59.78,0,0,0,202.93,28,8,8,0,0,0,196,24a59.75,59.75,0,0,0-48,24H124A59.75,59.75,0,0,0,76,24a8,8,0,0,0-6.93,4,59.78,59.78,0,0,0-5.38,47.68A58.14,58.14,0,0,0,56,104v8a56.06,56.06,0,0,0,48.44,55.47A39.8,39.8,0,0,0,96,192v8H72a24,24,0,0,1-24-24A40,40,0,0,0,8,136a8,8,0,0,0,0,16,24,24,0,0,1,24,24,40,40,0,0,0,40,40H96v16a8,8,0,0,0,16,0V192a24,24,0,0,1,48,0v40a8,8,0,0,0,16,0V192a39.8,39.8,0,0,0-8.44-24.53A56.06,56.06,0,0,0,216,112v-8A58.14,58.14,0,0,0,208.31,75.68ZM200,112a40,40,0,0,1-40,40H112a40,40,0,0,1-40-40v-8a41.74,41.74,0,0,1,6.9-22.48A8,8,0,0,0,80,73.83a43.81,43.81,0,0,1,.79-33.58,43.88,43.88,0,0,1,32.32,20.06A8,8,0,0,0,119.82,64h32.35a8,8,0,0,0,6.74-3.69,43.87,43.87,0,0,1,32.32-20.06A43.81,43.81,0,0,1,192,73.83a8.09,8.09,0,0,0,1,7.65A41.72,41.72,0,0,1,200,104Z"></path>
                                </svg>
                            </a>

                            <a href={t.contact.cv} target="_blank">
                                <Image
                                    src={"/looking.png"}
                                    alt="looking"
                                    width={32}
                                    height={32}
                                    className="rounded-full hover:scale-110 ease-in-out duration-200 transition-all"
                                />
                            </a>
                        </motion.div>
                    </motion.article>
                </section>

                <span className="mt-32 p-2 w-full justify-center flex text-gray-300/70">
                    {t.copyright}
                </span>
            </main>
        </>
    );
}
