import Box from "@cloudscape-design/components/box";
import Button from "@cloudscape-design/components/button";
import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";
import SpaceBetween from "@cloudscape-design/components/space-between";

export default function NotFound() {
  return (
    <main className="public-form-page">
      <Container header={<Header variant="h1">Page not found</Header>}>
        <SpaceBetween size="m">
          <Box color="text-body-secondary">The link may be outdated, or the page may have moved.</Box>
          <Button href="/" variant="primary">Return to FillUp</Button>
        </SpaceBetween>
      </Container>
    </main>
  );
}
