"use client";

import Cards from "@cloudscape-design/components/cards";
import Button from "@cloudscape-design/components/button";
import Link from "@cloudscape-design/components/link";
import React from "react";

const templates = [
  { key: "blank", title: "Blank form", description: "Build a form from scratch." },
  { key: "customerfeedback", title: "Customer feedback", description: "Collect useful feedback from your customers." },
  { key: "jobapplication", title: "Job application", description: "Gather candidate details and experience." },
  { key: "eventregistration", title: "Event registration", description: "Manage sign-ups and attendee information." },
];

export default function DashboardTemplates() {
  return (
    <Cards
      items={templates}
      trackBy="key"
      cardsPerRow={[{ cards: 1 }, { minWidth: 540, cards: 2 }, { minWidth: 1100, cards: 4 }]}
      cardDefinition={{
        header: (item) => (
          <Link href={item.key === "blank" ? "/root/newform" : `/root/newform/${item.key}`} fontSize="inherit">
            {item.title}
          </Link>
        ),
        sections: [
          { id: "description", content: (item) => item.description },
          {
            id: "action",
            content: (item) => (
              <Button href={item.key === "blank" ? "/root/newform" : `/root/newform/${item.key}`}>
                Use template
              </Button>
            ),
          },
        ],
      }}
    />
  );
}
