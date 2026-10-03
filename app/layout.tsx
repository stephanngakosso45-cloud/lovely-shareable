import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LOVELY — Crée une surprise inoubliable",
  description: "Crée gratuitement une surprise numérique personnalisée.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}