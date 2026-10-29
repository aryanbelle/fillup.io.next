"use client";

import React, { useMemo, useState } from "react";
import "./cloudscape.css";
import AppLayout from "@cloudscape-design/components/app-layout";
import ContentLayout from "@cloudscape-design/components/content-layout";
import Header from "@cloudscape-design/components/header";
import SideNavigation from "@cloudscape-design/components/side-navigation";
import TopNavigation from "@cloudscape-design/components/top-navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";

const pageTitles: Array<[string, string]> = [
  ["/root/dashboard", "Dashboard"],
  ["/root/myforms/form/", "Form responses"],
  ["/root/myforms", "My forms"],
  ["/root/newform", "Create a form"],
  ["/root/ai", "AI form builder"],
  ["/root/security", "Security"],
  ["/root/settings", "Settings"],
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [navigationOpen, setNavigationOpen] = useState(true);

  const pageTitle = useMemo(
    () => pageTitles.find(([route]) => pathname?.startsWith(route))?.[1] ?? "Workspace",
    [pathname]
  );

  const navigation = [
    {
      type: "section" as const,
      text: "Workspace",
      items: [
        { type: "link" as const, text: "Dashboard", href: "/root/dashboard" },
        { type: "link" as const, text: "My forms", href: "/root/myforms" },
      ],
    },
    {
      type: "section" as const,
      text: "Create",
      items: [
        { type: "link" as const, text: "Blank form", href: "/root/newform" },
        { type: "link" as const, text: "AI form builder", href: "/root/ai" },
      ],
    },
    { type: "divider" as const },
    {
      type: "section" as const,
      text: "Account",
      items: [
        { type: "link" as const, text: "Settings", href: "/root/settings" },
        { type: "link" as const, text: "Security", href: "/root/security" },
      ],
    },
  ];

  return (
    <div className="cloudscape-workspace">
      <TopNavigation
        className="workspace-top-navigation"
        identity={{ title: "FillUp", href: "/root/dashboard" }}
        utilities={[
          {
            type: "menu-dropdown",
            text: user?.firstName || "Account",
            description: user?.primaryEmailAddress?.emailAddress,
            iconName: "user-profile",
            items: [
              { id: "settings", text: "Settings", href: "/root/settings" },
              { id: "sign-out", text: "Sign out" },
            ],
            onItemClick: ({ detail }) => {
              if (detail.id === "sign-out") void signOut({ redirectUrl: "/" });
              if (detail.id === "settings") router.push("/root/settings");
            },
          },
        ]}
      />
      <AppLayout
        className="workspace-app-layout"
        headerSelector=".workspace-top-navigation"
        disableBodyScroll
        navigation={
          <SideNavigation
            activeHref={pathname ?? undefined}
            header={{ text: "Workspace", href: "/root/dashboard" }}
            items={navigation}
          />
        }
        navigationOpen={navigationOpen}
        onNavigationChange={({ detail }) => setNavigationOpen(detail.open)}
        navigationWidth={240}
        navigationCloseBehavior="collapse"
        contentType="default"
        content={
          <ContentLayout header={<Header variant="h1">{pageTitle}</Header>}>
            <div className="workspace-page">{children}</div>
          </ContentLayout>
        }
        toolsHide
      />
    </div>
  );
}
