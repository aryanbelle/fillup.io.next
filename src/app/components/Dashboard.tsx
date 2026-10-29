"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Box from "@cloudscape-design/components/box";
import Button from "@cloudscape-design/components/button";
import ColumnLayout from "@cloudscape-design/components/column-layout";
import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";
import Link from "@cloudscape-design/components/link";
import SpaceBetween from "@cloudscape-design/components/space-between";
import { useUser } from "@clerk/nextjs";
import DashboardRecentForms from "./DashboardRecentForms";
import DashboardTemplates from "./DashboardTemplates";

type FormSummary = { isAccepting?: boolean; responseCount?: number };

export default function Dashboard() {
  const { user } = useUser();
  const [forms, setForms] = useState<FormSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/myforms")
      .then(({ data }) => {
        if (data.success) setForms(data.data ?? []);
      })
      .catch((error) => console.error("Unable to load dashboard metrics", error))
      .finally(() => setLoading(false));
  }, []);

  const activeForms = forms.filter((form) => form.isAccepting).length;
  const totalResponses = forms.reduce((total, form) => total + (form.responseCount ?? 0), 0);

  return (
    <SpaceBetween size="l">
      <Container>
        <ColumnLayout columns={2} variant="text-grid">
          <SpaceBetween size="xs">
            <Box variant="h2">Welcome{user?.firstName ? `, ${user.firstName}` : ""}</Box>
            <Box color="text-body-secondary">
              Create forms, manage responses, and keep your work organized in one place.
            </Box>
          </SpaceBetween>
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button href="/root/ai" iconName="gen-ai">Generate with AI</Button>
              <Button href="/root/newform" variant="primary" iconName="add-plus">Create form</Button>
            </SpaceBetween>
          </Box>
        </ColumnLayout>
      </Container>

      <ColumnLayout columns={4} variant="text-grid">
        <Container header={<Header variant="h2">All forms</Header>}>
          <Box variant="awsui-key-label">{loading ? "Loading…" : forms.length}</Box>
          <Box color="text-body-secondary">Forms in your workspace</Box>
        </Container>
        <Container header={<Header variant="h2">Accepting responses</Header>}>
          <Box variant="awsui-key-label">{loading ? "Loading…" : activeForms}</Box>
          <Box color="text-body-secondary">Forms currently open to responses</Box>
        </Container>
        <Container header={<Header variant="h2">Paused forms</Header>}>
          <Box variant="awsui-key-label">{loading ? "Loading…" : forms.length - activeForms}</Box>
          <Box color="text-body-secondary">Closed to new responses</Box>
        </Container>
        <Container header={<Header variant="h2">Total responses</Header>}>
          <Box variant="awsui-key-label">{loading ? "Loading…" : totalResponses}</Box>
          <Box color="text-body-secondary">Across all your forms</Box>
        </Container>
      </ColumnLayout>

      <Container
        header={
          <Header
            variant="h2"
            description="Pick a starting point and customize it to fit your needs."
            actions={<Link href="/root/myforms">Browse forms</Link>}
          >
            Start with a template
          </Header>
        }
      >
        <DashboardTemplates />
      </Container>

      <DashboardRecentForms />
    </SpaceBetween>
  );
}
