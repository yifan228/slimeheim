"use client";

import Link from "next/link";
import { useState } from "react";

type NavItem = {
  icon: string;
  label: string;
  href: string;
  external?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { icon: "⌂", label: "首頁", href: "/" },
  // 未來社群連結放這裡
  // { icon: "𝕏", label: "Twitter", href: "https://x.com/...", external: true },
  // { icon: "◉", label: "itch.io", href: "https://...", external: true },
  // { icon: "⌥", label: "GitHub", href: "https://github.com/...", external: true },
  // { icon: "👤", label: "About Me", href: "/about" },
];

function IconButton({ item }: { item: NavItem }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <Link
        href={item.href}
        target={item.external ? "_blank" : undefined}
        rel={item.external ? "noopener noreferrer" : undefined}
        style={{ textDecoration: "none" }}
      >
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            width: "48px", height: "48px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "28px",
            color: hovered ? "#00ff41" : "#00ff4155",
            textShadow: hovered ? "0 0 8px #00ff41" : "none",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
        >
          {item.icon}
        </div>
      </Link>

      {/* Tooltip */}
      {hovered && (
        <div style={{
          position: "absolute", left: "52px", top: "50%", transform: "translateY(-50%)",
          background: "#111", border: "1px solid #00ff4144",
          color: "#00ff41", fontSize: "11px", fontFamily: "monospace",
          padding: "4px 10px", whiteSpace: "nowrap", zIndex: 200,
          pointerEvents: "none",
        }}>
          {item.label}
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  return (
    <aside style={{
      position: "fixed", left: 0, top: 0, bottom: 0,
      width: "48px",
      background: "#050505",
      borderRight: "1px solid #00ff4122",
      display: "flex", flexDirection: "column", alignItems: "center",
      paddingTop: "8px",
      zIndex: 100,
    }}
      className="desktop-sidebar"
    >
      {NAV_ITEMS.map(item => (
        <IconButton key={item.href} item={item} />
      ))}
    </aside>
  );
}

export function MobileMenuButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: "fixed", bottom: "20px", right: "20px", zIndex: 200,
          width: "44px", height: "44px",
          background: "#111", border: "1px solid #00ff4144",
          color: "#00ff41", fontSize: "18px", cursor: "pointer",
          fontFamily: "monospace",
        }}
      >
        {open ? "✕" : "☰"}
      </button>

      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 150, background: "#00000088" }}
          />
          <div style={{
            position: "fixed", right: 0, top: 0, bottom: 0, width: "240px",
            background: "#0a0a0a", borderLeft: "1px solid #00ff4133",
            zIndex: 160, display: "flex", flexDirection: "column",
            padding: "24px 0",
          }}>
            <div style={{ padding: "0 20px 20px", fontFamily: "'Press Start 2P', monospace", fontSize: "10px", color: "#00ff4166", borderBottom: "1px solid #00ff4122" }}>
              MENU
            </div>
            {NAV_ITEMS.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                target={item.external ? "_blank" : undefined}
                style={{ textDecoration: "none" }}
              >
                <div style={{
                  padding: "14px 20px", display: "flex", alignItems: "center", gap: "14px",
                  color: "#aaffcc", fontFamily: "monospace", fontSize: "13px",
                  borderBottom: "1px solid #00ff4111", cursor: "pointer",
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.color = "#00ff41"}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.color = "#aaffcc"}
                >
                  <span style={{ fontSize: "18px" }}>{item.icon}</span>
                  {item.label}
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  );
}
