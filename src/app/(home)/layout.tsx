'use client';

import { SidebarMenu } from "@/@core/view/components/layout/sidebar/sidebar";
import { AuthGuard } from "@/modules/auth/view/guards/auth_guard";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <AuthGuard>
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        {/* Botón de menú para móviles */}
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
        </button>

        {/* Overlay para cerrar el sidebar en móviles */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed md:relative inset-y-0 left-0 z-40 
            transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            md:translate-x-0
          `}
        >
          <SidebarMenu />
        </aside>

        {/* Contenido principal */}
        <main className="flex-1 overflow-y-auto md:ml-0">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
