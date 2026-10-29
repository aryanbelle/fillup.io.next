"use client";

import { useEffect } from "react";
import Alert from "@cloudscape-design/components/alert";
import Box from "@cloudscape-design/components/box";
import Button from "@cloudscape-design/components/button";
import SpaceBetween from "@cloudscape-design/components/space-between";

export default function RootError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <Box padding="xxl">
      <Alert type="error" header="This page ran into a problem">
        <SpaceBetween size="m">
          <Box>Try again. If the problem continues, return to your workspace and reopen the page.</Box>
          <Button variant="primary" onClick={reset}>Try again</Button>
        </SpaceBetween>
      </Alert>
    </Box>
  );
}
