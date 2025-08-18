import excludeBottomCenter from "@assets/og/exclude-bottom-center.svg?inline";
import excludeTopRight from "@assets/og/exclude-top-right.svg?inline";
import horizontalSlash from "@assets/og/horizontal-slash.svg?inline";
import wordmarkLogo from "@assets/wordmark-logo.svg?inline";
import type { FC } from "react";

type Props = {
  title: string;
};

type Variant = "primary" | "secondary";

const colorVariants: Record<Variant, { fg: string }> = {
  primary: {
    fg: "#155dfc", // blue-600
  },
  secondary: {
    fg: "#f97316", // orange-600
  },
};

export const OgImage: FC<Props> = ({ title }) => {
  const { fg } = colorVariants.primary;

  return (
    <div
      style={{
        alignItems: "center",
        background: "#f3f4f6", // gray-100
        display: "flex",
        height: "630px",
        justifyContent: "center",
        position: "relative",
        width: "1200px",
      }}
    >
      <div
        style={{
          borderBottom: `4px solid ${fg}`, // blue-600
          display: "flex",
          flexDirection: "column",
          height: "440px",
          justifyContent: "space-between",
          padding: "8px 0",
          width: "976px",
        }}
      >
        <h1
          style={{
            WebkitLineClamp: 3,
            fontSize: "64px",
            fontWeight: "bold",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </h1>
        <div
          style={{
            alignItems: "flex-end",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <img alt="" src={horizontalSlash} style={{ width: "256px" }} />
          <img alt="" src={wordmarkLogo} style={{ width: "300px" }} />
        </div>
      </div>

      <img
        src={excludeBottomCenter}
        alt=""
        style={{
          bottom: 0,
          left: "50%",
          position: "absolute",
          transform: "translateX(-50%)",
          width: "400px",
        }}
      />
      <img
        src={excludeTopRight}
        alt=""
        style={{ position: "absolute", top: 0, right: 0, width: "400px" }}
      />
    </div>
  );
};
