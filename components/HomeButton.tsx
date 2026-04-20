"use client";

import Link from "next/link";
import { useState } from "react";

export default function HomeButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <Link href="/" style={{ textDecoration: "none" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          fontFamily: "monospace",
          fontSize: "36px",
          color: hovered ? "#00ff41" : "#00ff4166",
          textShadow: hovered ? "0 0 8px #00ff41" : "none",
          cursor: "pointer",
          transition: "all 0.15s",
          userSelect: "none",
        }}
        title="回首頁"
      >
        ⌂
      </div>
    </Link>
  );
}
