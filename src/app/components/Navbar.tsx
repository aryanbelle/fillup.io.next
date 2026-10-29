"use client";

import React from "react";
import TopNavigation from "@cloudscape-design/components/top-navigation";
import { useAuth, useClerk, useUser } from "@clerk/nextjs";

export default function NavigationBar() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();

  const accountItems = isSignedIn
    ? [
        { id: "dashboard", text: "Dashboard", href: "/root/dashboard" },
        { id: "forms", text: "My forms", href: "/root/myforms" },
        { id: "create", text: "Create a form", href: "/root/newform" },
        { id: "sign-out", text: "Sign out" },
      ]
    : [
        { id: "sign-in", text: "Sign in", href: "/signin" },
        { id: "sign-up", text: "Create account", href: "/signup" },
      ];

  return (
    <TopNavigation
      identity={{ title: "FillUp", logo: { src: "/LOGO.png", alt: "FillUp" }, href: "/" }}
      utilities={[
        { type: "button", text: "Features", href: "#features", disableTextCollapse: true },
        { type: "button", text: "Security", href: "#security", disableTextCollapse: true },
        {
          type: "menu-dropdown",
          text: isSignedIn ? user?.firstName || "Account" : "Account",
          iconName: "user-profile",
          items: accountItems,
          onItemClick: ({ detail }) => {
            if (detail.id === "sign-out") void signOut({ redirectUrl: "/" });
          },
        },
      ]}
    />
  );
}
