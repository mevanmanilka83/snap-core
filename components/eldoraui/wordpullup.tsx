"use client";
import clsx from "clsx";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface WordPullUpProps {
  text?: string;
  className?: string;
}

export const WordPullUp: React.FC<WordPullUpProps> = ({
  text = "",
  className = "",
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2, margin: "-100px" });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { 
      y: 50,
      opacity: 0,
      filter: "blur(10px)"
    },
    show: { 
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      }
    },
  };

  return (
    <motion.h1
      ref={ref}
      variants={container}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      className={clsx(
        "text-center font-display font-bold drop-shadow-sm",
        "text-4xl md:text-5xl lg:text-6xl xl:text-7xl",
        "tracking-[-0.02em]",
        "md:leading-[4rem] lg:leading-[4.5rem] xl:leading-[5rem]",
        className,
      )}
    >
      {text.split(" ").map((word, i) => (
        <motion.span
          key={i}
          variants={item}
          style={{ display: "inline-block", paddingRight: "15px" }}
        >
          {word === "" ? <span>&nbsp;</span> : word}
        </motion.span>
      ))}
    </motion.h1>
  );
};
