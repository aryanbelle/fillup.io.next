"use client";

import { useEffect } from "react";
import Alert from "@cloudscape-design/components/alert";
import Box from "@cloudscape-design/components/box";
import Button from "@cloudscape-design/components/button";
import SpaceBetween from "@cloudscape-design/components/space-between";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <main className="public-form-page">
      <Alert type="error" header="Something went wrong">
        <SpaceBetween size="m">
          <Box>The page couldn’t be loaded. Try again.</Box>
          <Button variant="primary" onClick={reset}>Try again</Button>
        </SpaceBetween>
      </Alert>
    </main>
  );
}
