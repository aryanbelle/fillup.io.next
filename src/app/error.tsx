"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@nextui-org/react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong!</h1>
        <p className="text-gray-600 mb-6">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            color="primary"
            onClick={reset}
            className="font-medium"
          >
            Try again
          </Button>
          <Button
            as={Link}
            href="/"
            variant="flat"
            className="font-medium"
          >
            Go to Home
          </Button>
        </div>
      </div>
    </div>
  );
} 