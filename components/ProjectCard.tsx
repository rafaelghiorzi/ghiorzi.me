"use client";
import { motion } from "framer-motion";
import Image from "next/image";

interface ProjectCardProps {
  title: string;
  desc: string;
  img: string;
  tech: string;
}

export function ProjectCard({ title, desc, img, tech }: ProjectCardProps) {
  return (
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
      className="bg-[#F3EFF5]/60 rounded-4xl p-8 flex flex-col justify-between gap-6 shadow-xl hover:bg-[#F15025]/20 transition-colors duration-100"
    >
      <div className="flex flex-col max-w-xl">
        <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
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
      <div className="relative w-full rounded-3xl h-64 mt-4 bg-amber-50 overflow-hidden">
        <Image
          src={img}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
        />
      </div>
    </motion.div>
  );
}
