"use client";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import HomePage from "./components/HomePage";
import NavigationBar from "./components/Navbar";

export default function MainPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);

  // Show loading state while checking authentication
  if (!isLoaded) {
    return <div className="h-screen w-full flex items-center justify-center">Loading...</div>;
  }

  // If user is signed in, they will be redirected in the useEffect
  // This page will only be shown to non-authenticated users
  return (
    <>
      <NavigationBar />
      <HomePage />
    </>
  );
} 