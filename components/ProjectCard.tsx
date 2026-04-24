"use client";
import { motion } from "framer-motion";
import Image from "next/image";

interface ProjectCardProps {
  title: string;
  desc: string;
  img: string;
  tech: string;
  link?: string;
}

export function ProjectCard({
  title,
  desc,
  img,
  tech,
  link,
}: ProjectCardProps) {
  const cardContent = (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: "easeOut" },
        },
      }}
      whileHover={{
        y: -8,
        transition: { duration: 0.1 },
      }}
      // Lógica de cursor e hover original mantida
      className={`bg-[#F3EFF5]/60 rounded-4xl p-8 flex flex-col justify-between gap-6 shadow-xl hover:bg-[#F15025]/20 transition-colors duration-100 group ${
        link ? "cursor-pointer" : ""
      }`}
    >
      <div className="flex flex-col max-w-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          {/* Aparece apenas no hover se houver link */}
          {link && (
            <span className="text-[#F15025] text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              VER MAIS →
            </span>
          )}
        </div>
        <p className="text-gray-600 mb-4">{desc}</p>
        <div className="flex gap-2 flex-wrap mt-auto">
          {tech.split(", ").map((t, idx) => (
            <span
              key={idx}
              className="bg-white px-3 py-1 rounded-full text-xs font-medium text-gray-700 shadow-sm"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
      {img && img.trim() !== "" ? (
        <div className="relative w-full rounded-3xl h-100 mt-4 overflow-hidden">
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
