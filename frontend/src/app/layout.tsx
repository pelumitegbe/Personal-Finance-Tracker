"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import "./globals.css";
// import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AuthContextProvider from "./context";
import { queryClient } from "./react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Finance Tracker",
//   description: "Track your personal finances",
// };

export default function RootLayout({ children }: { children: JSX.Element }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <ToastContainer />
          <AuthContextProvider>{children}</AuthContextProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
