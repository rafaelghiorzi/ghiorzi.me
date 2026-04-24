"use client";
import { motion } from "framer-motion";
import Image from "next/image";

interface ProjectCardProps {
    title: string;
    desc: string;
    img: string;
    tech: string;
    link?: string;
    index?: number;
}

export function ProjectCard({
    title,
    desc,
    img,
    tech,
    link,
    index = 0,
}: ProjectCardProps) {
    const cardContent = (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={{
                hidden: { opacity: 0, y: 50 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                        duration: 0.6,
                        ease: "easeOut",
                        delay: index * 0.1,
                    },
                },
            }}
            whileHover={{
                y: -8,
                transition: { duration: 0.1 },
            }}
            // Lógica de cursor e hover original mantida
            className={`bg-[#161410]/60 rounded-4xl p-8 flex flex-col justify-between gap-6 shadow-xl hover:bg-[#FFD166]/20 transition-colors duration-100 group ${
                link ? "cursor-pointer" : ""
            }`}
        >
            <div className="flex flex-col max-w-xl">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    {/* Aparece apenas no hover se houver link */}
                    {link && (
                        <span className="text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            VER MAIS →
                        </span>
                    )}
                </div>
                <p className="text-gray-100 mb-4">{desc}</p>
                <div className="flex gap-2 flex-wrap mt-auto">
                    {tech.split(", ").map((t, idx) => (
                        <span
                            key={idx}
                            className="bg-white px-3 py-1 rounded-full text-xs font-medium text-black shadow-sm"
                        >
                            {t}
                        </span>
                    ))}
                </div>
            </div>
            {img && img.trim() !== "" ? (
                <div className="relative w-full rounded-3xl h-80 mt-4 overflow-hidden">
                    <Image
                        src={img}
                        alt={title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                    />
                </div>
            ) : null}
        </motion.div>
    );

    // Renderiza como link se a prop existir, senão renderiza apenas o card
    return link ? (
        <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full"
        >
            {cardContent}
        </a>
    ) : (
        cardContent
    );
}
