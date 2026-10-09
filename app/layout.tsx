import type { Metadata } from "next";
import VisitTracker from "@/components/VisitTracker";
import "./globals.css";

export const metadata: Metadata = {
  title: "GADDVYA — Pan-India Railway Booking & PNR Status",
  description:
    "Official Indian Railways booking portal powered by GADDVYA. Search 25,571 daily trains, select coach berths, verify citizen accounts with mobile/email OTP, and track 10-digit PNR status.",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-950 text-white min-h-screen antialiased selection:bg-blue-600 selection:text-white">
        <VisitTracker />
        {children}
      </body>
    </html>
  );
}