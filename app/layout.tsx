import { ReactNode } from "react";
import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { esES } from "@clerk/localizations";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eduvoice.ai",
  description: "Real-time AI Teaching Platform",
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{ variables: { colorPrimary: "#4007a2" } }}
      localization={esES}
    >
      <html lang="es">
        <body className={`${bricolage.variable} antialiased`}>
          <Navbar />
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
