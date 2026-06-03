"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroContent() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      className="relative z-10 text-center px-4 flex flex-col items-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.p
        variants={itemVariants}
        className="text-gold text-sm tracking-widest uppercase mb-6"
      >
        CHAIN & STRAPS
      </motion.p>
      
      <motion.h1
        variants={itemVariants}
        className="font-serif text-white text-5xl md:text-7xl lg:text-[8rem] font-extralight leading-none mb-12"
      >
        COMING<br />SOON
      </motion.h1>
      
      {/* Buttons removed for Coming Soon mode to keep it clean */}
    </motion.div>
  );
}
