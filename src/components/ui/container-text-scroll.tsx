"use client";
import React, { useRef } from "react";
import { useScroll, useTransform, motion, type MotionValue } from "framer-motion";

export const ContainerTextScroll = ({
  titleComponent,
  children,
}: {
  titleComponent?: React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const rotate        = useTransform(scrollYProgress, [0, 1], [-20, 0]);
  const scale         = useTransform(scrollYProgress, [0, 1], isMobile ? [0.8, 1] : [0.9, 1]);
  const translateY    = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const titleY        = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const titleScale    = useTransform(scrollYProgress, [0, 1], [0.8, 1]);

  return (
    <div
      ref={containerRef}
      className="h-[60rem] md:h-[80rem] flex items-center justify-center relative p-2 md:p-20"
      style={{ perspective: '1000px' }}
    >
      <motion.div
        style={{ translateY }}
        className="relative w-full max-w-5xl flex flex-col items-center justify-center"
      >
        <Card rotate={rotate} scale={scale}>
          {children}
          {titleComponent && (
            <motion.div
              style={{ translateY: titleY, scale: titleScale }}
              className="absolute inset-0 flex items-center justify-center text-center px-4 pointer-events-none"
            >
              <div className="text-white">{titleComponent}</div>
            </motion.div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export const Card = ({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  children: React.ReactNode;
}) => (
  <motion.div
    style={{
      rotateX: rotate,
      scale,
      boxShadow:
        "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
    }}
    className="relative h-[30rem] md:h-[40rem] w-full border border-[#ffd89b22] rounded-[24px] shadow-2xl overflow-hidden"
  >
    <div className="h-full w-full rounded-[22px] overflow-hidden bg-black">
      {children}
    </div>
  </motion.div>
);
