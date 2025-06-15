"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const Container = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "relative group/card hover:z-10 transition-all duration-300",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const Sparkles = () => {
  const [mounted, setMounted] = useState(false);
  const [sparkles, setSparkles] = useState<Array<{ id: number; top: string; left: string }>>([]);

  useEffect(() => {
    setMounted(true);
    const generateSparkles = () => {
      const newSparkles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`
      }));
      setSparkles(newSparkles);
    };
    generateSparkles();
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {sparkles.map((sparkle) => (
        <motion.span
          key={sparkle.id}
          animate={{
            top: `calc(${sparkle.top} + ${Math.random() * 10 - 5}px)`,
            left: `calc(${sparkle.left} + ${Math.random() * 10 - 5}px)`,
            opacity: [0, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: Math.random() * 2
          }}
          className="inline-block bg-black dark:bg-white"
          style={{
            position: "absolute",
            width: "2px",
            height: "2px",
            borderRadius: "50%",
            zIndex: 1
          }}
        />
      ))}
    </div>
  );
};

const CardSkeleton = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => {
  return (
    <Card className="border bg-card/50 backdrop-blur-sm hover:shadow-md transition-all relative z-20 h-full">
      <CardContent className="flex-1">
        <div className="relative h-40 flex items-center justify-center">
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative z-10"
          >
            {icon}
          </motion.div>
          <div className="absolute inset-0">
            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-primary/50 to-transparent" />
            <Sparkles />
          </div>
        </div>
        <CardHeader>
          <CardTitle className="text-sm sm:text-base">{title}</CardTitle>
          <p className="text-muted-foreground text-xs sm:text-sm">{description}</p>
        </CardHeader>
      </CardContent>
    </Card>
  );
};

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    icon: React.ReactNode
    title: string
    description: string
    link?: string
  }[]
  className?: string
}) => {
  return (
    <div className={cn("grid", className)}>
      {items.map((item, idx) => (
        <Container key={idx}>
          <CardSkeleton {...item} />
        </Container>
      ))}
    </div>
  );
};

export const HoverCard = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-4 overflow-hidden bg-black border border-transparent dark:border-white/[0.2] group-hover:border-slate-700 relative z-20",
        className
      )}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export const HoverCardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={cn("text-zinc-100 font-bold tracking-wide mt-4", className)}>
      {children}
    </h4>
  );
};

export const HoverCardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "mt-8 text-zinc-400 tracking-wide leading-relaxed text-sm",
        className
      )}
    >
      {children}
    </p>
  );
};
