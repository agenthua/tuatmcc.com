import { motion, useScroll } from "motion/react";
import { useCallback, useState } from "react";

export const WireframeImage = () => {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  scrollY.updateAndNotify = useCallback((y: number) => {
    if (y > innerHeight * 1.5) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, []);

  return (
    <motion.div
      className="fixed top-0 h-dvh w-full"
      initial={{ opacity: 0 }}
      animate={{
        opacity: visible ? 1 : 0,
      }}
      transition={{ duration: 0.5 }}
    >
      <img
        src="/images/untitled.png"
        alt="Untitled"
        className="h-full w-full object-cover opacity-60 dark:hidden"
      />
    </motion.div>
  );
};
