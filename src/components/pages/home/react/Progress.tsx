import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "motion/react";
import { useState } from "react";

export const Progress = () => {
  const { scrollYProgress } = useScroll();
  const springY = useSpring(scrollYProgress, { damping: 20, stiffness: 100 });
  const [scrollY, setScrollY] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", setScrollY);

  return (
    <div className="fixed right-0 bottom-0 z-10 grid h-32 w-32 items-center p-2">
      <svg
        width="50"
        height="50"
        viewBox="0 0 100 100"
        className="col-start-1 row-start-1 h-full w-full"
        style={{
          transform: "rotate(-90deg)",
        }}
      >
        <circle
          cx="50"
          cy="50"
          r="30"
          pathLength="1"
          className="fill-none opacity-30"
          style={{
            strokeDashoffset: "0",
            strokeWidth: "15%",
          }}
        />
        <title>Progress</title>
        <motion.circle
          cx="50"
          cy="50"
          r="30"
          pathLength="1"
          className="indicator fill-none stroke-black"
          style={{
            strokeDashoffset: "0",
            strokeWidth: "2px",
            pathLength: springY,
          }}
        />
      </svg>
      <div className="col-start-1 row-start-1 flex items-center justify-center">
        {Math.round(scrollY * 100)}%
      </div>
    </div>
  );
};
