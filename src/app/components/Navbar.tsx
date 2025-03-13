"use client";
import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import {
  SignInButton,
  SignOutButton,
  SignedOut,
  SignedIn,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";

export default function NavigationBar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: "📊" },
    { label: "My Forms", href: "/myforms", icon: "📝" },
    { label: "AI Form Builder", href: "/ai", icon: "🤖" },
    { label: "Settings", href: "/security", icon: "⚙️" },
    { label: "Help & Support", href: "#", icon: "❓" },
  ];

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      className="bg-white border-b border-gray-200 h-16 px-4"
      maxWidth="full"
      isBordered
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden text-gray-700"
        />
        <NavbarBrand>
          <Link href="/" className="flex items-center gap-2">
            <Image src={"/LOGO.PNG"} alt="FILLUP.IO" width={70} height={35} className="object-contain" />
            <span className="font-bold text-xl text-gray-800 hidden sm:block">FILLUP.IO</span>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <SignedIn>
        <NavbarContent className="hidden sm:flex gap-6" justify="center">
          <NavbarItem>
            <Link 
              href="/dashboard" 
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Dashboard
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link 
              href="/myforms" 
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              My Forms
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link 
              href="/ai" 
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              AI Builder
            </Link>
          </NavbarItem>
        </NavbarContent>
      </SignedIn>

      <SignedOut>
        <NavbarContent className="hidden sm:flex gap-6" justify="center">
          <NavbarItem>
            <Link 
              href="#home" 
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Home
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link 
              href="#features" 
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Features
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link 
              href="#about" 
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              About
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link 
              href="#contact" 
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Contact
            </Link>
          </NavbarItem>
        </NavbarContent>
      </SignedOut>

      <NavbarContent justify="end">
        <SignedIn>
          <NavbarItem className="flex items-center gap-4">
            <Button 
              as={Link} 
              href="/newform" 
              color="primary" 
              radius="full" 
              className="font-medium hidden sm:flex"
            >
              Create Form
            </Button>
            <UserButton afterSignOutUrl="/" />
          </NavbarItem>
        </SignedIn>
        <SignedOut>
          <NavbarItem>
            <Button 
              as={Link} 
              href="/signin" 
              color="primary" 
              variant="flat" 
              radius="full" 
              className="font-medium mr-2"
            >
              Sign In
            </Button>
            <Button 
              as={Link} 
              href="/signup" 
              color="primary" 
              radius="full" 
              className="font-medium"
            >
              Sign Up
            </Button>
          </NavbarItem>
        </SignedOut>
      </NavbarContent>

      <NavbarMenu className="bg-white pt-6 pb-6">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.label}-${index}`} className="my-2">
            <Link
              href={item.href}
              className="w-full text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-2 py-2 text-lg"
            >
              <span>{item.icon}</span> {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
        <NavbarMenuItem className="mt-6">
          <SignedIn>
            <Button 
              as={Link} 
              href="/newform" 
              color="primary" 
              radius="full" 
              className="font-medium w-full"
            >
              Create New Form
            </Button>
          </SignedIn>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
