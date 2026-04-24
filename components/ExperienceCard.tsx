"use client";
import { motion } from "framer-motion";

interface ExperienceCardProps {
  role: string;
  company: string;
  time: string;
  desc: string;
  tech: string;
}

export function ExperienceCard({
  role,
  company,
  time,
  desc,
  tech,
}: ExperienceCardProps) {
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
      className="bg-[#F3EFF5]/60 rounded-4xl p-8 flex flex-col md:flex-row justify-between gap-6 shadow-xl hover:bg-[#F15025]/20 transition-colors duration-100"
    >
      <div className="flex flex-col max-w-xl">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">{role}</h3>
          <div className="text-sm font-medium text-gray-400 shrink-0">
            {time}
          </div>
        </div>
        <span className="text-md font-medium text-gray-500 mb-4">
          {company}
        </span>
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
    </motion.div>
  );
}
