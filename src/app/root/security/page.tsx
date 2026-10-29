"use client";

import React from "react";
import { useClerk } from "@clerk/nextjs";
import Alert from "@cloudscape-design/components/alert";
import Button from "@cloudscape-design/components/button";
import ColumnLayout from "@cloudscape-design/components/column-layout";
import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";
import SpaceBetween from "@cloudscape-design/components/space-between";

export default function SecurityPage() {
  const { openUserProfile } = useClerk();

  return (
    <SpaceBetween size="l">
      <Alert type="info" header="Keep form links and account credentials private">
        Anyone with a public form link can submit a response. Share links only with the people you intend to reach, and manage access to your account through your sign-in provider.
      </Alert>

      <ColumnLayout columns={2} variant="text-grid">
        <Container header={<Header variant="h2">Account security</Header>}>
          <SpaceBetween size="m">
            <div>Manage your profile, sign-in methods, and available security options through your account provider.</div>
            <Button onClick={() => openUserProfile()}>Open account security</Button>
          </SpaceBetween>
        </Container>

        <Container header={<Header variant="h2">Response access</Header>}>
          <SpaceBetween size="m">
            <div>Pause a form at any time to stop collecting new responses. Existing responses remain available in your workspace.</div>
            <Button href="/root/myforms">Manage forms</Button>
          </SpaceBetween>
        </Container>
      </ColumnLayout>
    </SpaceBetween>
  );
}
