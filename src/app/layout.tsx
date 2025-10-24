'use client';

import "./globals.css";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <div className="flex h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                  <Topbar />
                  <main className="flex-1 overflow-y-auto p-6">{children}</main>
                </div>
              </div>
          <ReactQueryDevtools initialIsOpen={false} />
          <Toaster />
        </QueryClientProvider>
      </body>
    </html>
  );
}
