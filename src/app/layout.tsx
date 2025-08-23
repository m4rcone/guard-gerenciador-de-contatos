import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Guard",
  description: "Gerenciador de contatos",
  icons: {
    icon: "/logo-sm.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  );
}
