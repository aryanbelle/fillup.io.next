"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { 
  HiOutlineHome,
  HiOutlineDocumentDuplicate,
  HiOutlineDocumentAdd,
  HiOutlineLightningBolt,
  HiOutlineCog,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineClipboardCheck,
  HiOutlineUserCircle
} from "react-icons/hi";

// Helper function to conditionally join class names
const cn = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ');
};

interface SidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, toggleSidebar }) => {
  const pathname = usePathname();
  const { user } = useUser();

  const menuItems = [
    {
      id: "dashboard",
      name: "Dashboard",
      href: "/dashboard",
      icon: HiOutlineHome,
    },
    {
      id: "myforms",
      name: "My Forms",
      href: "/myforms",
      icon: HiOutlineDocumentDuplicate,
    },
    {
      id: "newform",
      name: "Create Form",
      href: "/newform",
      icon: HiOutlineDocumentAdd,
    },
    {
      id: "ai",
      name: "AI Builder",
      href: "/ai",
      icon: HiOutlineLightningBolt,
    },
  ];

  const userItems = [
    {
      id: "settings",
      name: "Settings",
      href: "/settings",
      icon: HiOutlineCog,
    }
  ];

  return (
    <aside 
      className={`h-screen bg-white border-r border-gray-100 flex flex-col transition-all duration-300 ${
        collapsed ? "w-20" : "w-72"
      } fixed left-0 top-0 z-10 shadow-sm overflow-y-auto`}
    >
      {/* Logo and App Name */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl shadow-sm flex-shrink-0">
            <HiOutlineClipboardCheck className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div className="select-none pointer-events-none">
              <h1 className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-500 tracking-tight">
                Fill<span className="text-blue-700">Up</span>
              </h1>
            </div>
          )}
        </Link>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-all duration-200"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <HiOutlineChevronRight className="h-5 w-5" />
          ) : (
            <HiOutlineChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Main Navigation */}
      <div className="px-4 py-6">
        {!collapsed && (
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3">
            Main Menu
          </p>
        )}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all relative group",
                  isActive 
                    ? "bg-blue-50 text-blue-600 font-medium" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full" />
                )}
                <div className={cn(
                  "p-1.5 rounded-lg transition-colors",
                  isActive 
                    ? "bg-blue-100 text-blue-600" 
                    : "text-gray-500 group-hover:text-blue-500 group-hover:bg-blue-50"
                )}>
                  <Icon className="h-5 w-5 flex-shrink-0" />
                </div>
                {!collapsed && (
                  <span>{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Section */}
      <div className="mt-auto px-4 py-6 border-t border-gray-100">
        {!collapsed && (
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3">
            User
          </p>
        )}
        <nav className="space-y-1.5">
          {userItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all relative group",
                  isActive 
                    ? "bg-blue-50 text-blue-600 font-medium" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full" />
                )}
                <div className={cn(
                  "p-1.5 rounded-lg transition-colors",
                  isActive 
                    ? "bg-blue-100 text-blue-600" 
                    : "text-gray-500 group-hover:text-blue-500 group-hover:bg-blue-50"
                )}>
                  <Icon className="h-5 w-5 flex-shrink-0" />
                </div>
                {!collapsed && (
                  <span>{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>
        
        {/* User Profile Preview */}
        <div className="mt-6 p-3 rounded-xl bg-blue-50 border border-blue-100">
          <div className="flex items-center gap-3">
            <UserButton 
              afterSignOutUrl="/" 
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10 rounded-full border-2 border-white shadow-sm"
                }
              }}
            />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate">{user?.firstName || 'User'}</p>
                <p className="text-xs text-gray-500 truncate">Account Settings</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar; 