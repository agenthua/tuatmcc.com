import { motion } from "motion/react";
import { FaGithub, FaXTwitter } from "react-icons/fa6";

export const Footer = () => {
  return (
    <motion.div
      className="flex w-full flex-col justify-between"
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.6,
      }}
    >
      <div className="relative flex flex-col items-center justify-center py-24">
        <motion.p
          className="mx-auto mb-4 w-[640px] max-w-full p-4 text-xl leading-8 font-bold"
          variants={{
            hidden: {
              opacity: 0,
              y: 40,
            },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 1,
              },
            },
          }}
        >
          技術を探求する部員が集結するMCC。
          <br />
          プログラミング、グラフィックデザイン、ハードウェアなど、
          <br />
          様々な興味を持つ部員たちが交流を重ね、 新しい視野を開拓する。 <br />
          それが東京農工大学マイクロコンピュータークラブです。
        </motion.p>
      </div>
      <footer className="relative flex flex-col items-center justify-center gap-8">
        <img
          src="/images/wordmark-logo.svg"
          alt="MCC Logo"
          width={240}
          height={240}
        />
        <ul className="flex items-center justify-center px-4 py-12 md:px-12">
          <a
            href="https://x.com/tuatmcc"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-4 flex items-center justify-center gap-2"
          >
            <FaXTwitter className="h-6 w-6" />
            MCC
          </a>
          <a
            href="https://x.com/tuatkyopro"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-4 flex items-center justify-center gap-2"
          >
            <FaXTwitter className="h-6 w-6" /> 競プロ
          </a>
          <a
            href="https://github.com/tuatmcc"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-4 flex items-center justify-center gap-2"
          >
            <FaGithub className="h-6 w-6" /> GitHub
          </a>
        </ul>
        <p className="flex h-24 w-full items-center justify-center bg-gray-800 text-sm text-gray-500 md:hidden">
          ©2023 東京農工大学マイクロコンピュータークラブ
        </p>
        <p
          className="hidden h-24 w-full items-center justify-center bg-gray-800 text-sm text-gray-500 md:flex"
          style={{
            clipPath: `polygon(
              0 30px,
              0 100%,
              100% 100%,
              100% 30px,
              calc(100% - 30px) 60px,
              calc(50% + 240px) 60px,
              calc(50% + 180px) 0,
              calc(50% - 180px) 0,
              calc(50% - 240px) 60px,
              30px 60px
)`,
          }}
        >
          ©2023 東京農工大学マイクロコンピュータークラブ
        </p>
      </footer>
    </motion.div>
  );
};
