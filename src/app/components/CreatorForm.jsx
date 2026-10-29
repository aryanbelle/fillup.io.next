"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useCloudscapeNotifications } from "./CloudscapeNotifications";
import { useRouter } from "next/navigation";
import Box from "@cloudscape-design/components/box";
import Button from "@cloudscape-design/components/button";
import Container from "@cloudscape-design/components/container";
import ColumnLayout from "@cloudscape-design/components/column-layout";
import FormField from "@cloudscape-design/components/form-field";
import Header from "@cloudscape-design/components/header";
import Alert from "@cloudscape-design/components/alert";
import Input from "@cloudscape-design/components/input";
import Select from "@cloudscape-design/components/select";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Spinner from "@cloudscape-design/components/spinner";
import Textarea from "@cloudscape-design/components/textarea";
import Toggle from "@cloudscape-design/components/toggle";

const defaultQuestion = () => ({
  type: "text",
  text: "",
  options: [],
  isRequired: true,
});

const questionTypes = [
  { label: "Short answer", value: "text" },
  { label: "Number", value: "number" },
  { label: "Email", value: "email" },
  { label: "Date", value: "date" },
  { label: "Multiple choice", value: "radio" },
  { label: "Checkboxes", value: "checkbox" },
  { label: "File upload", value: "file" },
];

const defaultFormValues = {
  title: "Untitled Form",
  description: "Form description",
  questions: [defaultQuestion()],
  isFile: false,
};

function suggestQuestionField(text) {
  const value = text.trim().toLowerCase();
  if (!value) return null;
  if (/\b(e-?mail|email address)\b/.test(value)) {
    return { type: "email", label: "Email", reason: "This question asks for an email address." };
  }
  if (/\b(date|when|birthday|birth date|deadline|appointment)\b/.test(value)) {
    return { type: "date", label: "Date", reason: "This question appears to ask for a date." };
  }
  if (/\b(upload|attach|attachment|resume|cv|document|photo|image|file)\b/.test(value)) {
    return { type: "file", label: "File upload", reason: "This question appears to ask for a file." };
  }
  if (/\b(satisfaction|satisfied|rate|rating|recommend|experience)\b/.test(value)) {
    return {
      type: "radio",
      label: "Multiple choice",
      reason: "A rating scale makes this answer easier to compare.",
      options: ["Very dissatisfied", "Dissatisfied", "Neutral", "Satisfied", "Very satisfied"],
    };
  }
  if (/\b(yes or no|yes\/no|do you|have you|would you|is it|are you)\b/.test(value)) {
    return { type: "radio", label: "Multiple choice", reason: "A yes/no choice fits this question.", options: ["Yes", "No"] };
  }
  if (/\b(choose|select|which|category|department|preferred)\b/.test(value)) {
    return { type: "radio", label: "Multiple choice", reason: "This wording suggests a fixed set of choices.", options: ["Option 1", "Option 2"] };
  }
  return null;
}

export default function CreatorForm(props = defaultFormValues) {
  const router = useRouter();
  const toast = useCloudscapeNotifications();
  const [loading, setLoading] = useState(false);
  const [showAllErrors, setShowAllErrors] = useState(false);
  const [touchedFields, setTouchedFields] = useState(() => new Set());
  const submissionInFlight = useRef(false);
  const [form, setForm] = useState({
    title: props.title || defaultFormValues.title,
    description: props.description || defaultFormValues.description,
    questions: Array.isArray(props.questions) && props.questions.length
      ? props.questions.map((question) => ({ ...question, options: question.options ?? [] }))
      : [defaultQuestion()],
    isFile: Boolean(props.isFile),
  });
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [suggestionError, setSuggestionError] = useState("");
  const [dismissedSuggestionSignature, setDismissedSuggestionSignature] = useState("");
  const suggestionRequest = useRef(0);

  useEffect(() => {
    if (props.props) {
      setForm({ ...props.props });
    }
  }, [props.props]);

  const suggestionContext = useMemo(() => ({
    title: form.title.trim(),
    description: form.description.trim(),
    questions: form.questions
      .filter((question) => question.text.trim())
      .map((question) => ({ text: question.text.trim(), type: question.type, options: question.options ?? [] })),
  }), [form]);
  const suggestionSignature = JSON.stringify(suggestionContext);
  const readyForSuggestion = suggestionContext.title.length >= 3
    && suggestionContext.description.length >= 3
    && suggestionContext.questions.length > 0;

  useEffect(() => {
    if (!readyForSuggestion || dismissedSuggestionSignature === suggestionSignature) {
      setSuggestionLoading(false);
      setAiSuggestion(null);
      setSuggestionError("");
      return undefined;
    }

    const controller = new AbortController();
    const requestId = ++suggestionRequest.current;
    let active = true;
    setAiSuggestion(null);
    setSuggestionError("");
    setSuggestionLoading(true);

    const timer = window.setTimeout(async () => {
      try {
        const { data } = await axios.post("/api/aisuggestion", suggestionContext, { signal: controller.signal });
        if (active && requestId === suggestionRequest.current) {
          setAiSuggestion(data.success && data.data ? { ...data.data, signature: suggestionSignature } : null);
        }
      } catch (error) {
        if (active && !axios.isCancel(error)) {
          setAiSuggestion(null);
          setSuggestionError(error.response?.data?.message || "AI suggestions are temporarily unavailable.");
        }
      } finally {
        if (active && requestId === suggestionRequest.current) setSuggestionLoading(false);
      }
    }, 1100);

    return () => {
      active = false;
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [readyForSuggestion, dismissedSuggestionSignature, suggestionContext, suggestionSignature]);

  const validation = useMemo(() => {
    const title = !form.title.trim()
      ? "Enter a form title."
      : form.title.trim().length > 100 ? "Use 100 characters or fewer." : "";
    const description = !form.description.trim()
      ? "Enter a form description."
      : form.description.trim().length > 500 ? "Use 500 characters or fewer." : "";
    const questions = form.questions.map((question) => {
      const text = !question.text.trim()
        ? "Enter a question."
        : question.text.trim().length > 200 ? "Use 200 characters or fewer." : "";
      const optionErrors = question.options.map((option, index) => {
        if (!option.trim()) return "Enter an option label.";
        if (question.options.some((other, otherIndex) => otherIndex !== index && other.trim().toLowerCase() === option.trim().toLowerCase())) {
          return "Option labels must be unique.";
        }
        return "";
      });
      const choiceError = ["radio", "checkbox"].includes(question.type)
        ? question.options.length < 2 ? "Add at least two answer options." : optionErrors.some(Boolean) ? "Complete each option and remove duplicates." : ""
        : "";
      return { text, optionErrors, choiceError };
    });
    return { title, description, questions };
  }, [form]);

  const showError = (key) => showAllErrors || touchedFields.has(key);
  const markTouched = (key) => setTouchedFields((current) => new Set(current).add(key));

  const updateQuestion = (index, changes) => {
    setForm((current) => ({
      ...current,
      questions: current.questions.map((question, itemIndex) =>
        itemIndex === index ? { ...question, ...changes } : question
      ),
    }));
  };

  const handleTypeChange = (index, type) => {
    if (type === "file") {
      setForm((current) => ({
        ...current,
        isFile: true,
        questions: current.questions.map((question, itemIndex) => itemIndex === index
          ? { ...question, type, text: question.text || "Upload your file", options: [] }
          : question),
      }));
      return;
    }

    setForm((current) => ({
      ...current,
      questions: current.questions.map((question, itemIndex) => itemIndex === index
        ? { ...question, type, options: ["radio", "checkbox"].includes(type) ? (question.options.length ? question.options : ["Option 1"]) : [] }
        : question),
      isFile: current.questions.some((question, itemIndex) => itemIndex === index ? false : question.type === "file"),
    }));
  };

  const addQuestion = () => setForm((current) => ({
    ...current,
    questions: [...current.questions, defaultQuestion()],
  }));

  const deleteQuestion = (index) => setForm((current) => {
    const questions = current.questions.filter((_, itemIndex) => itemIndex !== index);
    return {
      ...current,
      isFile: questions.some((question) => question.type === "file"),
      questions: questions.length ? questions : [defaultQuestion()],
    };
  });

  const addOption = (questionIndex) => {
    const question = form.questions[questionIndex];
    updateQuestion(questionIndex, { options: [...question.options, `Option ${question.options.length + 1}`] });
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    const options = form.questions[questionIndex].options.map((option, index) => index === optionIndex ? value : option);
    updateQuestion(questionIndex, { options });
  };

  const deleteOption = (questionIndex, optionIndex) => {
    const options = form.questions[questionIndex].options.filter((_, index) => index !== optionIndex);
    updateQuestion(questionIndex, { options: options.length ? options : ["Option 1"] });
  };

  const acceptAiSuggestion = () => {
    if (!aiSuggestion) return;
    setForm((current) => ({
      ...current,
      isFile: current.isFile || aiSuggestion.type === "file",
      questions: [...current.questions, {
        type: aiSuggestion.type,
        text: aiSuggestion.text,
        options: aiSuggestion.options ?? [],
        isRequired: Boolean(aiSuggestion.isRequired),
      }],
    }));
    setAiSuggestion(null);
  };

  const handleSendData = async () => {
    if (submissionInFlight.current) return;
    setShowAllErrors(true);
    const hasErrors = Boolean(validation.title || validation.description || validation.questions.some((question) =>
      question.text || question.choiceError
    ));
    if (hasErrors) {
      toast.error("Review the highlighted fields before creating your form.");
      return;
    }

    submissionInFlight.current = true;
    setLoading(true);
    try {
      const response = await axios.post("/api/creatorform", form);
      if (response.data?.success) {
        toast.success("Form created.");
        router.push("/root/dashboard#recents");
      } else {
        toast.error(response.data?.message || "Could not create the form.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not create the form. Please try again.");
    } finally {
      submissionInFlight.current = false;
      setLoading(false);
    }
  };

  const requiredQuestions = form.questions.filter((question) => question.isRequired).length;
  const estimatedMinutes = Math.max(1, Math.ceil(form.questions.length * 0.4));

  return (
    <div>
      <SpaceBetween size="l">
        <Container header={<Header variant="h2">Form details</Header>}>
          <SpaceBetween size="m">
            <FormField label="Form title" constraintText="Use a short, clear name that respondents will recognize." errorText={showError("title") ? validation.title : undefined}>
              <Input value={form.title} invalid={showError("title") && Boolean(validation.title)} onBlur={() => markTouched("title")} onChange={({ detail }) => { markTouched("title"); setForm((current) => ({ ...current, title: detail.value })); }} placeholder="For example, Customer feedback" />
            </FormField>
            <FormField label="Description" constraintText="Let respondents know why you’re collecting this information." errorText={showError("description") ? validation.description : undefined}>
              <Textarea value={form.description} invalid={showError("description") && Boolean(validation.description)} onBlur={() => markTouched("description")} onChange={({ detail }) => { markTouched("description"); setForm((current) => ({ ...current, description: detail.value })); }} rows={3} placeholder="Add a short introduction" />
            </FormField>
          </SpaceBetween>
        </Container>

        <Container header={<Header variant="h2">Live form insights</Header>}>
          <ColumnLayout columns={3} variant="text-grid">
            <div><Box variant="awsui-key-label">Questions</Box><Box variant="h2">{form.questions.length}</Box></div>
            <div><Box variant="awsui-key-label">Required</Box><Box variant="h2">{requiredQuestions}</Box></div>
            <div><Box variant="awsui-key-label">Estimated completion</Box><Box variant="h2">{estimatedMinutes} min</Box></div>
          </ColumnLayout>
        </Container>

        <Container
          header={
            <Header variant="h2" counter={`(${form.questions.length})`} description="Complete a question and pause to get an AI suggestion for the next field." actions={
              <Button onClick={addQuestion} iconName="add-plus">Add question</Button>
            }>
              Questions
            </Header>
          }
        >
          <SpaceBetween size="l">
            {form.questions.map((question, questionIndex) => (
              <Container
                key={questionIndex}
                header={
                  <Header
                    variant="h3"
                    description={`Question ${questionIndex + 1}`}
                    actions={form.questions.length > 1 ? <Button variant="icon" iconName="remove" ariaLabel={`Delete question ${questionIndex + 1}`} onClick={() => deleteQuestion(questionIndex)} /> : undefined}
                  >
                    {question.text || "New question"}
                  </Header>
                }
              >
                <SpaceBetween size="m">
                  <FormField label="Question" errorText={showError(`question-${questionIndex}`) ? validation.questions[questionIndex].text : undefined}>
                    <Input value={question.text} invalid={showError(`question-${questionIndex}`) && Boolean(validation.questions[questionIndex].text)} onBlur={() => markTouched(`question-${questionIndex}`)} onChange={({ detail }) => { markTouched(`question-${questionIndex}`); updateQuestion(questionIndex, { text: detail.value }); }} placeholder="Enter your question" />
                  </FormField>

                  {(() => {
                    const suggestion = suggestQuestionField(question.text);
                    return suggestion && suggestion.type !== question.type ? (
                      <Alert
                        type="info"
                        header={`Suggested answer type: ${suggestion.label}`}
                        action={<Button onClick={() => setForm((current) => ({
                          ...current,
                          isFile: suggestion.type === "file" || current.questions.some((item, index) => index !== questionIndex && item.type === "file"),
                          questions: current.questions.map((item, index) => index === questionIndex
                            ? { ...item, type: suggestion.type, options: suggestion.options ?? [] }
                            : item),
                        }))}>Apply suggestion</Button>}
                      >
                        {suggestion.reason}
                      </Alert>
                    ) : null;
                  })()}
                  <FormField label="Answer type">
                    <Select
                      selectedOption={questionTypes.find((option) => option.value === question.type) ?? questionTypes[0]}
                      options={questionTypes}
                      onChange={({ detail }) => handleTypeChange(questionIndex, detail.selectedOption.value)}
                    />
                  </FormField>

                  {["radio", "checkbox"].includes(question.type) && (
                    <FormField label="Answer options" description="Add the choices respondents can select." errorText={showError(`options-${questionIndex}`) ? validation.questions[questionIndex].choiceError : undefined}>
                      <SpaceBetween size="xs">
                        {question.options.map((option, optionIndex) => (
                          <SpaceBetween key={optionIndex} direction="horizontal" size="xs" alignItems="center">
                            <div className="option-marker" aria-hidden="true">{question.type === "radio" ? "○" : "□"}</div>
                            <Input value={option} invalid={showError(`option-${questionIndex}-${optionIndex}`) && Boolean(validation.questions[questionIndex].optionErrors[optionIndex])} onBlur={() => markTouched(`option-${questionIndex}-${optionIndex}`)} onChange={({ detail }) => { markTouched(`option-${questionIndex}-${optionIndex}`); markTouched(`options-${questionIndex}`); updateOption(questionIndex, optionIndex, detail.value); }} placeholder={`Option ${optionIndex + 1}`} />
                            <Button variant="icon" iconName="remove" ariaLabel={`Remove option ${optionIndex + 1}`} onClick={() => deleteOption(questionIndex, optionIndex)} />
                          </SpaceBetween>
                        ))}
                        <Button variant="link" iconName="add-plus" onClick={() => addOption(questionIndex)}>Add option</Button>
                      </SpaceBetween>
                    </FormField>
                  )}

                  <Toggle checked={Boolean(question.isRequired)} onChange={({ detail }) => updateQuestion(questionIndex, { isRequired: detail.checked })}>
                    Require an answer
                  </Toggle>
                </SpaceBetween>
              </Container>
            ))}
            {suggestionLoading && (
              <Box color="text-body-secondary">
                <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                  <Spinner size="normal" />
                  <span>Thinking of a useful next question…</span>
                </SpaceBetween>
              </Box>
            )}
            {aiSuggestion && (
              <Alert
                type="info"
                header="AI suggestion · Next field"
                dismissible
                onDismiss={() => {
                  setDismissedSuggestionSignature(aiSuggestion.signature);
                  setAiSuggestion(null);
                }}
                action={<Button variant="primary" onClick={acceptAiSuggestion}>Add to form</Button>}
              >
                <SpaceBetween size="xs">
                  <Box variant="strong">{aiSuggestion.text}</Box>
                  <Box color="text-body-secondary">
                    {questionTypes.find((item) => item.value === aiSuggestion.type)?.label ?? "Short answer"}
                    {aiSuggestion.options?.length ? ` · ${aiSuggestion.options.join(" · ")}` : ""}
                  </Box>
                  {aiSuggestion.reason && <Box>{aiSuggestion.reason}</Box>}
                </SpaceBetween>
              </Alert>
            )}
            {suggestionError && (
              <Alert type="warning" dismissible onDismiss={() => setSuggestionError("")}>{suggestionError}</Alert>
            )}
          </SpaceBetween>
        </Container>

        <Container>
          <SpaceBetween direction="horizontal" size="xs">
            <Button onClick={() => router.push("/root/dashboard")}>Cancel</Button>
            <Box float="right">
              <Button variant="primary" onClick={() => void handleSendData()} loading={loading} disabled={loading} iconName="check">
                Create form
              </Button>
            </Box>
          </SpaceBetween>
        </Container>
      </SpaceBetween>
    </div>
  );
}
