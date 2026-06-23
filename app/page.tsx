"use client";

import { ExperienceCard } from "@/components/ExperienceCard";
import LavaLamp from "@/components/LavaLamp";
import { Navbar } from "@/components/Navbar";
import { ProjectCard } from "@/components/ProjectCard";
import { useLang } from "@/context/LanguageContext";
import {
    motion,
    useScroll,
    useSpring,
    useTransform,
    Variants,
} from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// Curva de easing suave (easeOutExpo) reutilizada em todas as entradas
const EASE = [0.22, 1, 0.36, 1] as const;
// Config padrão das molas que suavizam o parallax
const SPRING = { stiffness: 90, damping: 28, mass: 0.4 } as const;

// Pequeno traço de destaque sob os títulos de seção
function Accent() {
    return (
        <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
            className="h-0.5 w-16 bg-[#FFD166] rounded-full mx-auto mt-4 origin-center"
        />
    );
}

export default function Home() {
    const { t } = useLang();

    // Variants para animações de entrada de seção
    const sectionContentVariants: Variants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 1.1, ease: EASE },
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

    // Barra de progresso de leitura (topo da página)
    const { scrollY, scrollYProgress } = useScroll();
    const progressScaleX = useSpring(scrollYProgress, {
        stiffness: 120,
        damping: 30,
        restDelta: 0.001,
    });

    // Setup para o Parallax do Hero (suavizado por mola)
    const heroY = useSpring(useTransform(scrollY, [0, 400], [0, 150]), SPRING);
    const opacity = useTransform(scrollY, [0, 700], [1, 0]);

    // Parallax Projetos (Apenas coluna direita)
    const { scrollYProgress: projectScroll } = useScroll({
        target: projectRef,
        offset: ["start end", "end start"],
    });
    const projectRightY = useSpring(
        useTransform(projectScroll, [0, 1], [150, -150]),
        SPRING,
    );

    // Parallax do visual da seção About
    const { scrollYProgress: aboutScroll } = useScroll({
        target: aboutRef,
        offset: ["start end", "end start"],
    });
    const aboutVisualY = useSpring(
        useTransform(aboutScroll, [0, 1], ["-12%", "12%"]),
        SPRING,
    );

    // Parallax Experiências (Apenas coluna direita)
    const { scrollYProgress: expScroll } = useScroll({
        target: experienceRef,
        offset: ["start end", "end start"],
    });
    const expRightY = useSpring(
        useTransform(expScroll, [0, 1], [100, -90]),
        SPRING,
    );

    // Helper para dividir os dados em duas colunas intercaladas
    const splitData = <T,>(data: T[]) => {
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
        <main className="relative min-h-screen bg-[#252526] overflow-x-clip">
            {/* Barra de progresso de leitura */}
            <motion.div
                style={{ scaleX: progressScaleX }}
                className="fixed top-0 left-0 right-0 h-0.5 bg-[#FFD166] origin-left z-[60]"
            />

            {/* Brilho ambiente sutil para dar profundidade ao fundo */}
            <div
                aria-hidden
                className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(60%_45%_at_50%_0%,rgba(255,209,102,0.06),transparent_70%)]"
            />

            <Navbar />

            <div className="relative z-10">
                <section
                    id="home"
                    className="flex justify-center py-4 md:py-32"
                >
                    <motion.article
                        style={{ y: isMobile ? 0 : heroY, opacity }}
                        className="flex flex-col md:flex-row justify-between items-center w-6xl p-4 gap-8 md:gap-12"
                    >
                        {/* Foto — vem primeiro no mobile, à direita no desktop */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.2, ease: EASE }}
                            className="relative w-full max-w-xs md:max-w-md md:w-1/2 aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 order-first md:order-last"
                        >
                            <Image
                                src="/eu.png"
                                alt="Rafael Ghiorzi"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 40vw"
                                loading="eager"
                                fetchPriority="high"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e1e]/50 via-transparent to-transparent" />
                        </motion.div>

                        {/* Texto */}
                        <motion.div className="flex flex-col py-4 max-w-md md:order-first">
                            <motion.h1
                                initial={{ opacity: 0, y: 60 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 1,
                                    delay: 0.4,
                                    ease: EASE,
                                }}
                                className="text-white text-4xl md:text-5xl font-bold mb-4"
                            >
                                {t.hero.title}
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: 0.7,
                                    duration: 1,
                                    ease: EASE,
                                }}
                                className="text-gray-300/80 text-md md:text-xl font"
                            >
                                {t.hero.desc}
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{
                                    delay: 1,
                                    duration: 1,
                                    ease: EASE,
                                }}
                                className="text-white flex flex-row gap-4 mt-6"
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
                        {/* Lâmpada de lava — agora ancorada na seção sobre mim */}
                        <motion.div
                            style={{ y: isMobile ? 0 : aboutVisualY }}
                            className="relative w-full md:w-1/3 h-80 md:h-112.5 rounded-3xl overflow-hidden shadow-2xl bg-[#1e1e1e]/40 ring-1 ring-white/10"
                        >
                            <LavaLamp />
                        </motion.div>
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
                            <Accent />
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
                            <motion.h2 className="text-white text-4xl md:text-5xl font-bold mb-4">
                                {t.experience.title}
                            </motion.h2>
                            <motion.p className="text-gray-300/80 text-md md:text-xl font">
                                {t.experience.desc}
                            </motion.p>
                            <Accent />
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
                                {experiences.right.map((exp, idx) => (
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
                        <motion.h2 className="text-white text-4xl md:text-5xl font-bold mb-4">
                            {t.contact.title}
                        </motion.h2>
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
                                    className="fill-gray-300/80 hover:fill-[#FFD166] hover:scale-110 ease-in-out duration-200 transition-all"
                                >
                                    <path d="M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24Zm0,192H40V40H216V216ZM96,112v64a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0Zm88,28v36a8,8,0,0,1-16,0V140a20,20,0,0,0-40,0v36a8,8,0,0,1-16,0V112a8,8,0,0,1,15.79-1.78A36,36,0,0,1,184,140ZM100,84A12,12,0,1,1,88,72,12,12,0,0,1,100,84Z"></path>
                                </svg>
                            </a>

                            <a href={t.contact.github} target="_blank">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32"
                                    height="32"
                                    className="fill-gray-300/80 hover:fill-[#FFD166] hover:scale-110 ease-in-out duration-200 transition-all"
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
            </div>
        </main>
    );
}
