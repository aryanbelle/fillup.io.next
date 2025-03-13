import Dashboard from "@/app/components/Dashboard";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await currentUser();

  if (user) {
    return <Dashboard />;
  } else {
    redirect("/");
  }
}
