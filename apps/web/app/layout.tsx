import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ysis V2",
  description: "Acolhimento digital para organizar relatos sensiveis com privacidade."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
