import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Korarit Proyrungroj — Design PM/Ops & Lead UX Designer",
    description:
        "I craft intuitive user experiences and thoughtful product strategies.",
        };

        export default function RootLayout({
          children,
          }: Readonly<{
            children: React.ReactNode;
            }>) {
              return (
                  <html lang="en">
                        <body className="antialiased">{children}</body>
                            </html>
                              );
                              }
