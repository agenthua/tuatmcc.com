import { motion } from "motion/react";
import { FaPlus } from "react-icons/fa6";

export const SlideIn = () => {
  return (
    <motion.div
      className="flex w-full py-4"
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.8,
      }}
    >
      <motion.div
        className="bg-primary flex h-full w-[700px] max-w-full flex-col justify-center p-[1px]"
        variants={{
          visible: {
            backgroundPosition: "0% 0%",
            transition: {
              duration: 1.2,
            },
          },
        }}
        style={{
          clipPath: `polygon(
			0 0,
			0 calc(100% - 20px),
			20px 100%,
			100% 100%,
			100% 80px,
			calc(100% - 80px) 0,
			calc(100% - 150px) 0,
			calc(100% - 160px) 10px,
			calc(100% - 220px) 10px,
			calc(100% - 230px) 0
		)`,
          backgroundPosition: "100% 100%",
          backgroundSize: "200% 200%",
          backgroundImage:
            "linear-gradient(to bottom right, var(--color-mcc-2) 50%, var(--color-gray-100) 50%)",
        }}
      >
        <div
          className="bg-base-100 flex h-full w-full flex-col justify-center p-8 py-8 pr-12"
          style={{
            clipPath: `polygon(
			0 0,
			0 calc(100% - 19px),
			19px 100%,
			100% 100%,
			100% 79px,
			calc(100% - 79px) 0,
			calc(100% - 148px) 0,
			calc(100% - 158px) 10px,
			calc(100% - 220px) 10px,
			calc(100% - 230px) 0
		)`,
          }}
        >
          <motion.h3
            className="font-orbitron mb-2 text-xl font-bold tracking-wider"
            variants={{
              hidden: {
                opacity: 0,
                x: 50,
              },
              visible: {
                opacity: 1,
                x: 0,
                transition: {
                  delay: 0.2,
                  duration: 1,
                },
              },
            }}
          >
            Hello, World!
          </motion.h3>
          <motion.h2
            className="font-orbitron mb-4 text-4xl font-bold tracking-wider"
            variants={{
              hidden: {
                opacity: 0,
                x: 50,
              },
              visible: {
                opacity: 1,
                x: 0,
                transition: {
                  delay: 0.5,
                  duration: 1,
                },
              },
            }}
          >
            We are
            <span className="text-[#0066cc]"> MCC </span>!
          </motion.h2>
          <p className="mb-6 text-lg">
            マイクロコンピュータクラブ (通称MCC)は、
            <br />
            東京農工大学のプログラミングサークルです。
            講習会や合宿を開催したり、競プロやWeb開発、ゲーム制作等を行っています。
          </p>
          <a
            href="/about"
            className="font-orbitron mr-8 flex items-center gap-2 self-start px-4 font-bold tracking-wider text-blue-600 transition-all duration-300 hover:bg-blue-600 hover:text-gray-100"
          >
            <FaPlus /> MORE ABOUT US
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
};
