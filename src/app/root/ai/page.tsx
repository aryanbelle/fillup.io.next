"use client";

import React, { useState } from "react";
import axios from "axios";
import Box from "@cloudscape-design/components/box";
import Button from "@cloudscape-design/components/button";
import Container from "@cloudscape-design/components/container";
import FormField from "@cloudscape-design/components/form-field";
import Header from "@cloudscape-design/components/header";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Textarea from "@cloudscape-design/components/textarea";
import { useCloudscapeNotifications } from "@/app/components/CloudscapeNotifications";
import CreatorForm from "@/app/components/CreatorForm";

type GeneratedForm = {
  title: string;
  description: string;
  questions: Array<{ type: string; text: string; options: string[]; isRequired: boolean }>;
  isFile: boolean;
};

export default function AIFormBuilderPage() {
  const toast = useCloudscapeNotifications();
  const [form, setForm] = useState<GeneratedForm | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const generateForm = async () => {
    if (isLoading) return;
    if (!prompt.trim()) {
      toast.error("Describe the form you want to create.");
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await axios.post("/api/aicreatorform", { reqprompt: prompt });
      if (!data.success) {
        toast.error(data.message || "Could not generate a form.");
        return;
      }

      setForm({
        title: data.data.title || "Untitled Form",
        description: data.data.description || "Form description",
        questions: (data.data.questions || []).map((question) => ({
          type: question.type,
          text: question.text,
          options: Array.isArray(question.options) ? question.options : [],
          isRequired: Boolean(question.isRequired),
        })),
        isFile: false,
      });
      toast.success("Draft generated. Review it before creating your form.");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error generating form. Please try again.");
      console.error("Error generating form", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SpaceBetween size="l">
      <Container header={<Header variant="h2">Describe your form</Header>}>
        <SpaceBetween size="m">
          <Box color="text-body-secondary">
            Tell us who the form is for, what it should collect, and which answer types you need. You can review and edit every field before saving.
          </Box>
          <FormField label="Form requirements" description="For example: a 5-question customer feedback survey with a rating scale and one optional comment.">
            <Textarea
              value={prompt}
              onChange={({ detail }) => setPrompt(detail.value)}
              rows={5}
              placeholder="Describe the form you want to create"
            />
          </FormField>
          <Box float="right">
            <Button variant="primary" iconName="gen-ai" loading={isLoading} disabled={isLoading} onClick={generateForm}>
              Generate draft
            </Button>
          </Box>
        </SpaceBetween>
      </Container>

      {form && (
        <SpaceBetween size="m">
          <Header
            variant="h2"
            description="Review the generated draft, then create it when you’re ready."
            actions={<Button onClick={() => setForm(null)}>Start over</Button>}
          >
            Generated draft
          </Header>
          <CreatorForm
            title={form.title}
            description={form.description}
            questions={form.questions}
            isFile={form.isFile}
          />
        </SpaceBetween>
      )}
    </SpaceBetween>
  );
}
