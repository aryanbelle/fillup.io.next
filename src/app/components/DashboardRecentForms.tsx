"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Box from "@cloudscape-design/components/box";
import Button from "@cloudscape-design/components/button";
import Container from "@cloudscape-design/components/container";
import Table from "@cloudscape-design/components/table";
import Header from "@cloudscape-design/components/header";
import Link from "@cloudscape-design/components/link";
import StatusIndicator from "@cloudscape-design/components/status-indicator";
import SpaceBetween from "@cloudscape-design/components/space-between";

type FormRow = {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  isAccepting: boolean;
  responseCount: number;
};

export default function DashboardRecentForms() {
  const [forms, setForms] = useState<FormRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    axios.get("/api/myforms")
      .then(({ data }) => {
        if (!cancelled && data.success) {
          const sorted = [...(data.data ?? [])].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setForms(sorted.slice(0, 5));
        }
      })
      .catch((error) => console.error("Unable to load recent forms", error))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return (
    <Container
      header={<Header variant="h2" actions={<Button href="/root/myforms">View all forms</Button>}>Recent forms</Header>}
    >
    <Table
      className="dashboard-recent-forms"
      variant="borderless"
      items={forms}
      trackBy="id"
      loading={loading}
      loadingText="Loading recent forms"
      columnDefinitions={[
        {
          id: "form",
          header: "Form",
          width: "42%",
          minWidth: 220,
          isRowHeader: true,
          cell: (form) => <SpaceBetween size="xxs"><Link href={`/root/myforms/form/${form.id}`} fontSize="inherit">{form.title}</Link><Box variant="small" color="text-body-secondary" className="form-card-description">{form.description || "No description"}</Box></SpaceBetween>,
        },
        {
          id: "status",
          header: "Status",
          width: "22%",
          minWidth: 165,
          cell: (form) => <StatusIndicator type={form.isAccepting ? "success" : "stopped"}>{form.isAccepting ? "Accepting responses" : "Closed"}</StatusIndicator>,
        },
        {
          id: "created",
          header: "Created",
          width: "19%",
          minWidth: 140,
          cell: (form) => new Date(form.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }),
        },
        {
          id: "responses",
          header: "Responses",
          width: "17%",
          minWidth: 110,
          cell: (form) => form.responseCount,
        },
      ]}
      contentDensity="compact"
      cellVerticalAlign="middle"
      wrapLines
      empty={
        <Box textAlign="center" padding={{ vertical: "l" }}>
          <Box variant="strong">No forms yet</Box>
          <Box padding={{ top: "xs" }} color="text-body-secondary">Create a form to start collecting responses.</Box>
          <Box padding={{ top: "m" }}><Button href="/root/newform" variant="primary">Create a form</Button></Box>
        </Box>
      }
    />
    </Container>
  );
}
