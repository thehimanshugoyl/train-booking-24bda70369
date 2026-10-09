"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import axios from "axios";

export default function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    axios.post("/api/track", { page: pathname }).catch(() => {});
  }, [pathname]);

  return null;
}
