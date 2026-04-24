"use client";
import { motion } from "framer-motion";

interface ExperienceCardProps {
    role: string;
    company: string;
    time: string;
    desc: string;
    tech: string;
    index?: number;
    side?: "left" | "right";
}

export function ExperienceCard({
    role,
    company,
    time,
    desc,
    tech,
    index = 0,
    side = "left",
}: ExperienceCardProps) {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
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
            className="relative bg-[#161410]/60 rounded-4xl p-8 flex flex-col md:flex-row justify-between gap-6 shadow-xl hover:bg-[#FFD166]/20 transition-colors duration-100 group w-full"
        >
            {/* Timeline Indicator (Visible only on Desktop) */}
            <div
                className={`hidden md:block absolute top-12 w-4 h-4 rounded-full bg-[#FFD166] border-4 border-[#F3EFF5] shadow-sm z-10 transition-transform duration-300 group-hover:scale-125
          ${side === "left" ? "-right-14" : "-left-14"}`}
            />

            {/* Horizontal connecting line (Visible only on Desktop) */}
            <div
                className={`hidden md:block absolute top-14 h-px bg-[#FFD166]/20 z-0
          ${side === "left" ? "-right-12 w-12" : "-left-12 w-12"}`}
            />

            <div className="flex flex-col max-w-xl">
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
                    <h3 className="text-white text-xl font-bold">{role}</h3>
                    <div className="text-sm font-medium text-gray-400 shrink-0">
                        {time}
                    </div>
                </div>
                <span className="text-md font-medium text-gray-400 mb-4">
                    {company}
                </span>
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
        </motion.div>
    );
}
