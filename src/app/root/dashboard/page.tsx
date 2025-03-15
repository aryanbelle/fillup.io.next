import Dashboard from "@/app/components/Dashboard";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await currentUser();

  // If user is not signed in, redirect to the main page
  if (!user) {
    redirect("/");
  }

  // If user is signed in, show the dashboard
  return <Dashboard />;
}
