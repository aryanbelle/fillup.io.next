"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import { Button } from "@nextui-org/react";
export default function Error({
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
        <h2 className="text-3xl font-semibold mb-4 text-red-500">Oops! 😭</h2>
        <p className="text-lg mb-6">
          Something went wrong. We&apos;re working on it!
        </p>
        <Button
          className="bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => reset()}
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}
