import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/src/store/StoreProvider";
import { Toaster } from "@/src/components/ui/toaster";

export const metadata: Metadata = {
  title: "MediStore  - Your Trusted Online Medicine Shop",
  description:
    "Quality medical supplies, healthcare products, and pharmacy services for your well-being",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-background text-foreground">
        <StoreProvider>
          {children}
          <Toaster  />
        </StoreProvider>
      </body>
    </html>
  );
}
