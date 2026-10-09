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
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('gaddvya_theme') || 'dark';
                  if (t === 'light') {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                    document.documentElement.setAttribute('data-theme', 'light');
                  } else {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                    document.documentElement.setAttribute('data-theme', 'dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-gray-950 text-white min-h-screen antialiased selection:bg-white selection:text-black">
        <VisitTracker />
        {children}
      </body>
    </html>
  );
}