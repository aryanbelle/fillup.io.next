"use client";

import React from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import Box from "@cloudscape-design/components/box";
import Button from "@cloudscape-design/components/button";
import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";
import KeyValuePairs from "@cloudscape-design/components/key-value-pairs";
import Link from "@cloudscape-design/components/link";
import SpaceBetween from "@cloudscape-design/components/space-between";
import StatusIndicator from "@cloudscape-design/components/status-indicator";

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const { openUserProfile } = useClerk();
  const primaryEmail = user?.primaryEmailAddress?.emailAddress ?? "Not available";
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Not set";

  return (
    <SpaceBetween size="l">
      <Container header={<Header variant="h2">Account profile</Header>}>
        <SpaceBetween size="m">
          <Box color="text-body-secondary">
            Your sign-in details and personal information are managed securely by your account provider.
          </Box>
          <KeyValuePairs
            columns={2}
            items={[
              { label: "Name", value: isLoaded ? fullName : "Loading…" },
              { label: "Email address", value: isLoaded ? primaryEmail : "Loading…" },
              { label: "Account", value: <StatusIndicator type="success">Connected</StatusIndicator> },
            ]}
          />
          <Box>
            <Button onClick={() => openUserProfile()}>Manage account</Button>
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Workspace preferences</Header>}>
        <Box color="text-body-secondary">
          Forms and response collection are managed from <Link href="/root/myforms">My forms</Link>. Use the status control on any form to pause or resume responses.
        </Box>
      </Container>
    </SpaceBetween>
  );
}
