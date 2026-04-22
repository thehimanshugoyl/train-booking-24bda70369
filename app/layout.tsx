"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import axios from "axios";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    axios.post("/api/track", { page: pathname }).catch(() => {});
  }, [pathname]);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}