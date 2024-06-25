import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import styles from "./layout.module.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Chat App",
  description: "A chat app built with Next.js, Clerk, and Supabase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className={styles.main}>
          <h1 className={styles.title}>My Chat App</h1>
          <div className={styles.container}>{children}</div>
        </main>
        <footer className={styles.footer}></footer>
      </body>
    </html>
  );
}
