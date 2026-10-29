"use client";

import Box from "@cloudscape-design/components/box";
import Button from "@cloudscape-design/components/button";
import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";

interface NoDataPlaceholderProps {
  DATA?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonAction?: () => void;
}

export default function NoDataPlaceholder({
  DATA,
  title,
  description,
  buttonText = "Create form",
  buttonAction,
}: NoDataPlaceholderProps) {
  const displayTitle = title || (DATA ? `No ${DATA} found` : "No data found");
  const displayDescription = description || (DATA
    ? `There are no ${DATA.toLowerCase()} here yet. Create one to get started.`
    : "There’s nothing here yet.");

  return (
    <Container>
      <Box textAlign="center" padding="xxl">
        <Header variant="h2">{displayTitle}</Header>
        <Box color="text-body-secondary" padding={{ top: "xs" }}>{displayDescription}</Box>
        <Box padding={{ top: "m" }}>
          {buttonAction
            ? <Button variant="primary" onClick={buttonAction}>{buttonText}</Button>
            : <Button variant="primary" href="/root/newform">{buttonText}</Button>}
        </Box>
      </Box>
    </Container>
  );
}
