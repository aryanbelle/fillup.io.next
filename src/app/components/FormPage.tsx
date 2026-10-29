"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useCloudscapeNotifications } from "./CloudscapeNotifications";
import Alert from "@cloudscape-design/components/alert";
import Box from "@cloudscape-design/components/box";
import Button from "@cloudscape-design/components/button";
import Checkbox from "@cloudscape-design/components/checkbox";
import Container from "@cloudscape-design/components/container";
import DatePicker from "@cloudscape-design/components/date-picker";
import FileUpload from "@cloudscape-design/components/file-upload";
import FormField from "@cloudscape-design/components/form-field";
import Header from "@cloudscape-design/components/header";
import Input from "@cloudscape-design/components/input";
import RadioGroup from "@cloudscape-design/components/radio-group";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Spinner from "@cloudscape-design/components/spinner";
import Textarea from "@cloudscape-design/components/textarea";

type Question = {
  _id?: string;
  type: string;
  text: string;
  options: string[];
  isRequired: boolean;
  answer: string | string[] | File | null;
};

export default function FormPage({ id }: { id: string }) {
  const toast = useCloudscapeNotifications();
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loadError, setLoadError] = useState("");
  const submissionInFlight = useRef(false);
  const [formData, setFormData] = useState({ title: "", description: "", isAcceptingResponses: true, questions: [] as Question[] });

  useEffect(() => {
    let cancelled = false;
    axios.get(`/api/userform/${encodeURIComponent(id)}`)
      .then(({ data }) => {
        if (!data.data || cancelled) return;
        setFormData({
          title: data.data.title,
          description: data.data.description,
          isAcceptingResponses: data.data.isAcceptingResponses !== false,
          questions: data.data.questions.map((question) => ({
            ...question,
            answer: question.type === "checkbox" ? [] : "",
          })),
        });
      })
      .catch((error) => {
        console.error("Error fetching form data", error);
        const message = error.response?.data?.message || "Could not load the form. Check the link and try again.";
        setLoadError(message);
        toast.error(message);
      })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  const setAnswer = (index: number, answer: Question["answer"]) => {
    setFormData((current) => ({
      ...current,
      questions: current.questions.map((question, questionIndex) => questionIndex === index ? { ...question, answer } : question),
    }));
  };

  const submitResponse = async () => {
    if (submissionInFlight.current) return;
    const missingRequired = formData.questions.some((question) => {
      if (!question.isRequired) return false;
      if (Array.isArray(question.answer)) return question.answer.length === 0;
      return !question.answer;
    });
    if (missingRequired) {
      toast.error("Please answer all required questions.");
      return;
    }

    submissionInFlight.current = true;
    setSubmitting(true);
    try {
      const questions = await Promise.all(formData.questions.map(async (question) => {
        if (question.type !== "file" || !question.answer) return question;
        const body = new FormData();
        body.append("file", question.answer as File);
        const { data } = await axios.post("/api/getfile", body);
        if (!data.url) throw new Error("File upload failed");
        return { ...question, answer: data.url };
      }));

      const payload = {
        title: formData.title,
        description: formData.description,
        questions: questions.map((question) => ({
          question: question.text,
          answer: question.answer,
          answer_type: question.type,
        })),
      };
      const { data } = await axios.post(`/api/submituserform/${encodeURIComponent(id)}`, payload);
      if (!data.success) throw new Error(data.message || "Could not submit your response.");
      toast.success("Response submitted.");
      setSubmitted(true);
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "Could not submit your response.");
    } finally {
      submissionInFlight.current = false;
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return <Box textAlign="center" padding="xxl"><Spinner size="large" /><Box padding={{ top: "m" }}>Loading form…</Box></Box>;
  }

  if (!formData.questions.length) {
    return <Alert type="error" header="This form is unavailable">{loadError || "The form may have been deleted or is no longer accepting responses."}</Alert>;
  }

  if (submitted) {
    return <Container><Alert type="success" header="Thank you for your response">Your response has been recorded.</Alert></Container>;
  }

  if (!formData.isAcceptingResponses) {
    return (
      <Container header={<Header variant="h1" description={formData.description}>{formData.title}</Header>}>
        <Alert type="warning" header="This form is closed">The form is available to view, but it is not currently accepting responses.</Alert>
      </Container>
    );
  }

  return (
    <Container header={<Header variant="h1" description={formData.description}>{formData.title}</Header>}>
      <form onSubmit={(event) => { event.preventDefault(); void submitResponse(); }}>
        <SpaceBetween size="l">
          {formData.questions.map((question, index) => (
            <FormField
              key={question._id ?? index}
              label={`${index + 1}. ${question.text}`}
              constraintText={question.isRequired ? "Required" : "Optional"}
            >
              {question.type === "text" && (
                <Textarea value={String(question.answer ?? "")} onChange={({ detail }) => setAnswer(index, detail.value)} rows={3} />
              )}
              {["number", "email"].includes(question.type) && (
                <Input
                  type={question.type as "number" | "email"}
                  value={String(question.answer ?? "")}
                  onChange={({ detail }) => setAnswer(index, detail.value)}
                />
              )}
              {question.type === "date" && (
                <DatePicker
                  value={String(question.answer ?? "")}
                  onChange={({ detail }) => setAnswer(index, detail.value)}
                  placeholder="YYYY/MM/DD"
                />
              )}
              {question.type === "file" && (
                <FileUpload
                  value={typeof File !== "undefined" && question.answer instanceof File ? [question.answer] : []}
                  accept="*"
                  ariaRequired={question.isRequired}
                  showFileSize
                  i18nStrings={{
                    uploadButtonText: () => "Choose a file",
                    dropzoneText: () => "Drop a file here or choose a file to upload",
                    removeFileAriaLabel: (_index, fileName) => `Remove ${fileName}`,
                  }}
                  onChange={({ detail }) => setAnswer(index, detail.value[0] ?? null)}
                  constraintText="Select a file or drag it into the area above."
                />
              )}
              {question.type === "radio" && (
                <RadioGroup
                  value={String(question.answer ?? "")}
                  items={question.options.map((option) => ({ value: option, label: option }))}
                  onChange={({ detail }) => setAnswer(index, detail.value)}
                  ariaRequired={question.isRequired}
                />
              )}
              {question.type === "checkbox" && (
                <SpaceBetween size="xs">
                  {question.options.map((option) => {
                    const selected = Array.isArray(question.answer) && question.answer.includes(option);
                    return (
                      <Checkbox
                        key={option}
                        checked={selected}
                        onChange={() => {
                          const current = Array.isArray(question.answer) ? question.answer : [];
                          setAnswer(index, selected ? current.filter((value) => value !== option) : [...current, option]);
                        }}
                      >
                        {option}
                      </Checkbox>
                    );
                  })}
                </SpaceBetween>
              )}
            </FormField>
          ))}
          <Box float="right">
            <Button variant="primary" onClick={() => void submitResponse()} loading={submitting} disabled={submitting}>
              Submit response
            </Button>
          </Box>
        </SpaceBetween>
      </form>
    </Container>
  );
}
