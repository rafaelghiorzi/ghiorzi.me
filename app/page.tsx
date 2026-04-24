"use client";
import { ExperienceCard } from "@/components/ExperienceCard";
import LavaLampBackground from "@/components/LavaLampBackground";
import { Navbar } from "@/components/Navbar";
import { ProjectCard } from "@/components/ProjectCard";
import { useLang } from "@/context/LanguageContext";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Home() {
    const { t } = useLang();

    // Controle para desativar parallax no mobile (< 768px)
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

    /* LÓGICA DO PARALLAX:
     A coluna esquerda não terá animação de Y (ficará parada em y=0).
     A coluna direita vai de y=150 (mais baixa) até y=-150 (mais alta).
     Exatamente no meio da tela (scroll 0.5), a direita estará no y=0,
     encontrando-se perfeitamente com a coluna da esquerda.
    */

    // Parallax Projetos (Apenas coluna direita)
    const { scrollYProgress: projectScroll } = useScroll({
        target: projectRef,
        offset: ["start end", "end start"],
    });
    const projectRightY = useTransform(projectScroll, [0, 1], [150, -150]);

    // Parallax Experiências (Apenas coluna direita)
    const { scrollYProgress: expScroll } = useScroll({
        target: experienceRef,
        offset: ["start end", "end start"],
    });
    const expRightY = useTransform(expScroll, [0, 1], [150, -150]);

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
        <main className="min-h-screen w-full font-sans text-white selection:bg-[#e5f5ff] selection:text-black overflow-hidden">
            <LavaLampBackground baseColor="#4400ff" hotColor="#00aaff" />
            <Navbar />

            {/* HERO SECTION */}
            <section
                id="home"
                className="min-h-screen flex items-center px-6 max-w-full md:max-w-[80%] mx-auto"
            >
                <motion.div
                    // Condição aplicada: Y estático (0) se for mobile
                    style={{ y: isMobile ? 100 : heroY, opacity }}
                    className="bg-[#161410]/60 rounded-[3rem] p-10 md:p-20 flex flex-col md:flex-row gap-4 items-center justify-around w-full shadow-2xl"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                            duration: 0.8,
                            delay: 0.4,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="relative h-80 w-full mb-8 rounded-3xl block md:hidden mt-4 overflow-hidden"
                    >
                        <Image
                            src="/eu.png"
                            alt="perfil"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                        />
                    </motion.div>
                    <motion.div className="max-w-3xl flex flex-col">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.8,
                                delay: 0.2,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            className="text-4xl md:text-5xl font-extrabold text-[#FFD166] tracking-tight w-full leading-[1.1]"
                        >
                            {t.hero.title}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.8,
                                delay: 0.4,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            className="mt-8 text-xl md:text-2xl max-w-2xl leading-relaxed"
                        >
                            {t.hero.desc}
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.8,
                                delay: 0.2,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            className="flex flex-row gap-8 mt-4"
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
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                            duration: 0.8,
                            delay: 0.4,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="relative rounded-3xl max-w-xl hidden md:block md:w-1/2 h-140 w-80 translate-y-32 bg-amber-50 overflow-hidden"
                    >
                        <Image
                            src="/eu.png"
                            alt="perfil"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                        />
                    </motion.div>
                </motion.div>
            </section>

            {/* INTRODUCTION SECTION */}
            <section
                id="about"
                className="p-10 pt-32 md:pt-10 md:p-20 py-24 px-6 mx-auto max-w-[80%] "
            >
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{
                        duration: 0.8,
                        delay: 0.2,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                >
                    <h2 className="text-4xl font-bold text-[#FFD166]/80 mb-8">
                        {t.introduction.title}
                    </h2>
                </motion.div>
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{
                        duration: 0.8,
                        delay: 0.4,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    className="text-xl md:text-2xl leading-relaxed whitespace-pre-line"
                >
                    {t.introduction.desc}
                </motion.p>
            </section>

            {/* PROJECTS SECTION */}
            <section
                id="projects"
                ref={projectRef}
                className="pb-24 pt-20 md:pt-64 px-6 max-w-6xl mx-auto"
            >
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="mb-12"
                >
                    <h2 className="text-4xl font-bold text-[#FFD166]/80 mb-4">
                        {t.projects.title}
                    </h2>
                    <p className="text-xl">{t.projects.desc}</p>
                </motion.div>

                {/* Grade de Projetos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    {/* Coluna Esquerda - Estática */}
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

                    {/* Coluna Direita - Começa baixa, sobe rápido (alcança a esquerda) */}
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
            </section>

            {/* EXPERIENCE SECTION */}
            <section
                id="experience"
                ref={experienceRef}
                className="pb-32 pt-20 md:pt-64 px-6 max-w-6xl mx-auto mb-20"
            >
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="mb-12"
                >
                    <h2 className="text-4xl font-bold text-[#FFD166]/80 mb-4">
                        {t.experience.title}
                    </h2>
                    <p className="text-xl">{t.experience.desc}</p>
                </motion.div>

                {/* Grade de Experiências - Layout de Timeline */}
                <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-start">
                    {/* Linha Vertical da Timeline (Apenas Desktop) */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-0.75 bg-linear-to-b from-[#FFD166]/50 via-[#FFD166]/10 to-transparent hidden md:block -translate-x-1/2" />

                    {/* Coluna Esquerda - Estática */}
                    <div className="flex flex-col gap-16 md:gap-32">
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

                    {/* Coluna Direita - Começa baixa, sobe rápido (alcança a esquerda) */}
                    <motion.div
                        // Condição aplicada: Y estático (0) se for mobile
                        style={{ y: isMobile ? 0 : expRightY }}
                        className="flex flex-col gap-16 md:gap-32 md:mt-48"
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
            </section>

            {/* CONTACT SECTION */}
            <section
                id="contact"
                className="py-32 px-6 flex flex-col items-center justify-center"
            >
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                        duration: 0.8,
                        delay: 0.2,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    className="text-5xl md:text-5xl font-extrabold text-[#FFD166]/80 tracking-tight max-w-3xl leading-[1.1]"
                >
                    {t.contact.title}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                        duration: 0.8,
                        delay: 0.4,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    className="mt-8 mx-auto text-center text-xl md:text-2xl max-w-4xl leading-relaxed"
                >
                    {t.contact.desc}
                </motion.p>
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                        duration: 0.8,
                        delay: 0.4,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    className="mt-4 max-w-2xl flex flex-row justify-center gap-12 w-full"
                >
                    <a href={t.contact.linkedin} target="_blank">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            fill="#000000"
                            viewBox="0 0 256 256"
                        >
                            <path
                                className="fill-white"
                                d="M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24Zm0,192H40V40H216V216ZM96,112v64a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0Zm88,28v36a8,8,0,0,1-16,0V140a20,20,0,0,0-40,0v36a8,8,0,0,1-16,0V112a8,8,0,0,1,15.79-1.78A36,36,0,0,1,184,140ZM100,84A12,12,0,1,1,88,72,12,12,0,0,1,100,84Z"
                            ></path>
                        </svg>
                    </a>

                    <a href={t.contact.github} target="_blank">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            fill="#fff"
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
                            className="rounded-full"
                        />
                    </a>
                </motion.p>
            </section>

            <p className="mt-32 mb-4 flex w-full text-[#FFD166]/60 justify-center">
                {t.copyright}
            </p>
        </main>
    );
}
