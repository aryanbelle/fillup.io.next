"use client";
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { usePathname } from "next/navigation";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Determine page title based on pathname
  let pageTitle = "FillUp Dashboard";
  if (pathname === "/dashboard") {
    pageTitle = "Dashboard";
  } else if (pathname === "/myforms") {
    pageTitle = "My Forms";
  } else if (pathname === "/newform") {
    pageTitle = "Create Form";
  } else if (pathname === "/ai") {
    pageTitle = "AI Form Builder";
  } else if (pathname === "/security") {
    pageTitle = "Security";
  } else if (pathname === "/settings") {
    pageTitle = "Settings";
  } else if (pathname?.includes("/myforms/form/")) {
    pageTitle = "Form Responses";
  }

  // For authenticated users, show the dashboard layout with sidebar
  return (
    <main className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
      
      {/* Main content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-72'}`}>
        {/* Top header */}
        <header className="h-16 border-b border-gray-200 flex items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-bold text-gray-600">{pageTitle}</h1>
          </div>
          <div className="flex items-center gap-4">
            {/* Search or other header elements can go here */}
          </div>
        </header>
        
        {/* Page content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </main>
  );
};

export default DashboardLayout;
