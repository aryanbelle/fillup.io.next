"use client";

import React from "react";
import Box from "@cloudscape-design/components/box";
import Button from "@cloudscape-design/components/button";
import ColumnLayout from "@cloudscape-design/components/column-layout";
import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";
import Icon from "@cloudscape-design/components/icon";
import Link from "@cloudscape-design/components/link";
import SpaceBetween from "@cloudscape-design/components/space-between";

const features = [
  {
    title: "Start with AI",
    description: "Describe what you need and get an editable form draft in seconds.",
    icon: "gen-ai",
  },
  {
    title: "Build with confidence",
    description: "Combine text, choice, date, number, email, and file upload questions.",
    icon: "edit",
  },
  {
    title: "Keep responses organized",
    description: "Share a public link, pause responses when needed, and review submissions in one workspace.",
    icon: "view-full",
  },
] as const;

export default function HomePage() {
  return (
    <main className="landing-page">
      <section id="home" className="landing-hero">
        <div className="landing-hero-inner">
          <SpaceBetween size="l">
            <Box variant="small" color="text-status-info">A simpler way to collect information</Box>
            <Header
              variant="h1"
              description="Create clear forms, share them in a click, and keep every response together."
            >
              Better forms start here.
            </Header>
            <SpaceBetween direction="horizontal" size="xs">
              <Button href="/signup" variant="primary">Get started</Button>
              <Button href="#features">Explore features</Button>
            </SpaceBetween>
            <Box variant="small" color="text-body-secondary">Free to get started · No coding required</Box>
          </SpaceBetween>


        </div>
      </section>

      <section id="features" className="landing-section">
        <div className="landing-section-inner">
          <SpaceBetween size="l">
            <Header
              variant="h2"
              description="Everything you need to ask better questions and make responses useful."
            >
              Made for the whole form workflow
            </Header>
            <ColumnLayout columns={3} variant="text-grid">
              {features.map((feature) => (
                <Container key={feature.title} className="landing-feature-card">
                <SpaceBetween size="s">
                    <Icon name={feature.icon} size="medium" variant="normal" />
                    <Box variant="awsui-key-label">{feature.title}</Box>
                    <Box color="text-body-secondary">{feature.description}</Box>
                  </SpaceBetween>
                </Container>
              ))}
            </ColumnLayout>
          </SpaceBetween>
        </div>
      </section>

      <section id="security" className="landing-section landing-security-section">
        <div className="landing-section-inner">
          <Container
            header={
              <Header
                variant="h2"
                description="You decide when a form is open and who receives its public link."
                actions={<Button href="/root/security">Security settings</Button>}
              >
                Stay in control of responses
              </Header>
            }
          >
            <Box color="text-body-secondary">
              Pause response collection at any time. Your forms and submissions stay organized in your workspace.
            </Box>
          </Container>
        </div>
      </section>

      <section id="about" className="landing-section">
        <div className="landing-section-inner">
          <Container
            header={
              <Header
                variant="h2"
                description="Start with a blank form or use AI to shape your first draft."
                actions={<Button href="/signup" variant="primary">Create your first form</Button>}
              >
                Ready to collect better answers?
              </Header>
            }
          >
            <Link href="/signin">Already have an account? Sign in</Link>
          </Container>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <Box variant="strong">FillUp</Box>
          <Box variant="small">© {new Date().getFullYear()} FillUp. Forms made straightforward.</Box>
          <Link href="mailto:aryanbelle692@gmail.com">Contact</Link>
        </div>
      </footer>
    </main>
  );
}
