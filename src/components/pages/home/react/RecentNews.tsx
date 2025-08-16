import { motion } from "motion/react";
import type { ReactNode } from "react";
import { FaPlus } from "react-icons/fa6";

export const RecentNews = async ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative z-1 mx-auto mt-12 flex w-full max-w-[1200px] justify-end">
      <motion.div
        className="relative flex w-[600px] max-w-full flex-col p-8 pb-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
      >
        <motion.div
          className="absolute top-[-120px] bottom-[400px] left-0 -z-1 w-full bg-blue-600"
          style={{
            clipPath: `polygon(
            0 0, 0 calc(100% - 30px), 200px calc(100% - 30px), 230px 100%, calc(100% - 90px) 100%, 100% calc(100% - 90px), 100% 40px, calc(100% - 40px) 0
)`,
          }}
          variants={{
            hidden: {
              background: "var(--color-base-100)",
            },
            visible: {
              bottom: "0px",
              background: "var(--color-primary)",
              transition: {
                duration: 1.2,
              },
            },
          }}
        />
        <motion.h2
          className="font-orbitron mb-8 pl-4 text-4xl font-bold tracking-wide text-gray-900"
          variants={{
            visible: {
              color: "var(--color-gray-100)",
            },
          }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Recent <span className="text-yellow-500">N</span>
          ews
        </motion.h2>
        <ul className="mb-6 flex list-none flex-col gap-2 pl-6">{children}</ul>
        <a
          href="/news"
          className="font-orbitron hover:text-primary text-base-100 mr-8 flex items-center gap-2 self-end px-4 font-bold tracking-wider transition-all duration-300 hover:bg-gray-100"
        >
          <FaPlus />
          ALL NEWS
        </a>
      </motion.div>
    </div>
  );
};
