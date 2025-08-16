import { motion } from "motion/react";
import { FadeOutOnScroll } from "./FadeOutOnScroll";

export const Top = () => (
  <div className="sticky top-0 flex h-svh w-full flex-col items-center justify-center">
    <FadeOutOnScroll className="flex flex-col items-center justify-center">
      <div className="relative">
        <motion.div
          className="hidden flex-col items-center md:flex"
          initial={{ x: 0 }}
          animate={{
            x: -170,
            scale: 0.6,
            transition: { duration: 1, delay: 3 },
          }}
        >
          <img
            width="320"
            height="320"
            src="/images/animated_mcc.webp"
            alt="MCC Logo"
            className="h-80 w-80"
          />
        </motion.div>
        <div className="flex flex-col items-center md:hidden">
          <img
            width="320"
            height="320"
            src="/images/animated_mcc.webp"
            alt="MCC Logo"
            className="h-80 w-80"
          />
        </div>
        <motion.div
          className="font-orbitron absolute top-1/2 left-1/2 hidden translate-x-[-25%] translate-y-[-50%] flex-col text-center text-[120px] font-medium tracking-wide text-[#0066cc] md:flex"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { duration: 1, delay: 4 },
          }}
        >
          MCC
        </motion.div>
      </div>
      <motion.div
        className="flex translate-0 flex-col text-center text-xl font-bold"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: { duration: 2, delay: 2 },
        }}
      >
        マイクロコンピュータークラブ
      </motion.div>
      <div className="fixed bottom-0 p-4">
        <svg
          width="84"
          height="84"
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="animate-bounce"
        >
          <title>svg</title>
          <path
            d="M200 397L400 250V253L200 400L0 253V250L200 397Z"
            fill="black"
          />
          <path d="M199 0H201V300H199V0Z" fill="black" />
        </svg>
      </div>
    </FadeOutOnScroll>
  </div>
);
