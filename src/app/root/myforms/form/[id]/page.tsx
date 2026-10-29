"use client";

import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import Alert from "@cloudscape-design/components/alert";
import BarChart from "@cloudscape-design/components/bar-chart";
import Box from "@cloudscape-design/components/box";
import Button from "@cloudscape-design/components/button";
import ColumnLayout from "@cloudscape-design/components/column-layout";
import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";
import Input from "@cloudscape-design/components/input";
import KeyValuePairs from "@cloudscape-design/components/key-value-pairs";
import Link from "@cloudscape-design/components/link";
import Pagination from "@cloudscape-design/components/pagination";
import Select from "@cloudscape-design/components/select";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Spinner from "@cloudscape-design/components/spinner";
import Table from "@cloudscape-design/components/table";
import { useCloudscapeNotifications } from "@/app/components/CloudscapeNotifications";

type Answer = { question: string; answer: string; answer_type?: string };
type ResponseItem = {
  _id: string;
  title: string;
  description?: string;
  createdAt?: string;
  questions?: Answer[];
};
type Distribution = { label: string; count: number; percentage?: number; lower?: number | string; upper?: number | string };
type AnalyticsQuestion = {
  questionId: string;
  index: number;
  question: string;
  type: "number" | "date" | "radio" | "checkbox";
  options: string[];
  answered: number;
  skipped: number;
  valid: number;
  invalid: number;
  average?: number | null;
  min?: number | null;
  max?: number | null;
  earliest?: string | null;
  latest?: string | null;
  distribution: Distribution[];
};
type Analytics = {
  title: string;
  description: string;
  totalResponses: number;
  supportedQuestionCount: number;
  unsupportedQuestionCount: number;
  questions: AnalyticsQuestion[];
};

const sortOptions = [
  { label: "Most responses", value: "count-desc" },
  { label: "Fewest responses", value: "count-asc" },
  { label: "Value A to Z", value: "label-asc" },
  { label: "Value Z to A", value: "label-desc" },
];

function Metric({ label, value }: { label: string; value: React.ReactNode }) {
  return <Box>
    <Box color="text-body-secondary" variant="small">{label}</Box>
    <Box variant="h2">{value}</Box>
  </Box>;
}

export default function ResponsesPage({ params }: { params: { id: string } }) {
  const toast = useCloudscapeNotifications();
  const [responses, setResponses] = useState<ResponseItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState("");
  const [selectedQuestionId, setSelectedQuestionId] = useState("");
  const [sort, setSort] = useState(sortOptions[0]);
  const [filter, setFilter] = useState("");
  const [minimum, setMinimum] = useState("");
  const [maximum, setMaximum] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchResponses() {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/getresponses/${params.id}`, { params: { page } });
        if (cancelled) return;
        if (data.success) {
          setResponses(data.data ?? []);
          setTotal(data.total ?? data.data?.length ?? 0);
        } else toast.error(data.message || "Could not load responses.");
      } catch (error: any) {
        if (!cancelled) toast.error(error.response?.data?.message || "Could not load responses.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void fetchResponses();
    return () => { cancelled = true; };
  }, [params.id, page]);

  useEffect(() => {
    let cancelled = false;
    async function fetchAnalytics() {
      setAnalyticsLoading(true);
      setAnalyticsError("");
      try {
        const { data } = await axios.get(`/api/formanalytics/${params.id}`);
        if (cancelled) return;
        if (!data.success) throw new Error(data.message || "Could not load analytics.");
        setAnalytics(data.data);
        setSelectedQuestionId((current) => current && data.data.questions.some((item: AnalyticsQuestion) => item.questionId === current)
          ? current : data.data.questions[0]?.questionId ?? "");
      } catch (error: any) {
        if (!cancelled) setAnalyticsError(error.response?.data?.message || error.message || "Could not load analytics.");
      } finally {
        if (!cancelled) setAnalyticsLoading(false);
      }
    }
    void fetchAnalytics();
    return () => { cancelled = true; };
  }, [params.id]);

  const downloadResponses = async () => {
    setDownloading(true);
    try {
      const { data } = await axios.post(`/api/getresponsesinsheet/${params.id}`, {}, { responseType: "blob" });
      const url = URL.createObjectURL(data);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "form-responses.xlsx";
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Could not download the spreadsheet.");
    } finally {
      setDownloading(false);
    }
  };

  const selectedQuestion = analytics?.questions.find((item) => item.questionId === selectedQuestionId) ?? analytics?.questions[0];
  const filteredDistribution = useMemo(() => {
    if (!selectedQuestion) return [];
    let values = selectedQuestion.distribution.filter((item) => item.label.toLowerCase().includes(filter.trim().toLowerCase()));
    if (["number", "date"].includes(selectedQuestion.type)) {
      const low = minimum.trim() ? Number(minimum) : null;
      const high = maximum.trim() ? Number(maximum) : null;
      values = values.filter((item) => {
        const lower = Number(item.lower);
        const upper = Number(item.upper);
        return (low === null || !Number.isFinite(upper) || upper >= low) && (high === null || !Number.isFinite(lower) || lower <= high);
      });
    }
    return [...values].sort((a, b) => {
      if (sort.value === "count-asc") return a.count - b.count || a.label.localeCompare(b.label);
      if (sort.value === "label-asc") return a.label.localeCompare(b.label, undefined, { numeric: true });
      if (sort.value === "label-desc") return b.label.localeCompare(a.label, undefined, { numeric: true });
      return b.count - a.count || a.label.localeCompare(b.label);
    });
  }, [selectedQuestion, filter, minimum, maximum, sort]);

  if (loading && analyticsLoading) {
    return <Box textAlign="center" padding="xxl"><Spinner size="large" /><Box padding={{ top: "m" }}>Loading responses and analytics…</Box></Box>;
  }

  const formTitle = analytics?.title || responses[0]?.title || "Form responses";
  const formDescription = analytics?.description || responses[0]?.description;
  return (
    <SpaceBetween size="l">
      <Container header={<Header variant="h1" description={formDescription} actions={<Button iconName="download" loading={downloading} onClick={downloadResponses}>Download spreadsheet</Button>}>{formTitle}</Header>}>
        <ColumnLayout columns={3} variant="text-grid">
          <Metric label="Total responses" value={analytics?.totalResponses ?? total} />
          <Metric label="Fields analysed" value={analytics?.supportedQuestionCount ?? "—"} />
          <Metric label="Supported field types" value="Number · Date · Multiple choice · Checkbox" />
        </ColumnLayout>
      </Container>

      <Container header={<Header variant="h2" description="All-time results across supported fields, independent of response pagination.">Response analytics</Header>}>
        {analyticsLoading ? <Box textAlign="center" padding="l"><Spinner /> Loading analytics…</Box> : analyticsError ?
          <Alert type="error" header="Analytics could not be loaded">{analyticsError}</Alert> : !analytics?.questions.length ?
            <Alert type="info" header="No chartable fields in this form">Analytics are available for number, date, multiple choice, and checkbox fields. Text, email, and file fields remain available in individual responses and the spreadsheet.</Alert> : (
              <SpaceBetween size="l">
                <ColumnLayout columns={4} variant="text-grid">
                  <Metric label="Answered" value={selectedQuestion?.answered ?? 0} />
                  <Metric label="Skipped" value={selectedQuestion?.skipped ?? 0} />
                  <Metric label="Valid values" value={selectedQuestion?.valid ?? 0} />
                  <Metric label="Invalid values" value={selectedQuestion?.invalid ?? 0} />
                </ColumnLayout>
                {selectedQuestion && <>
                  {(selectedQuestion.type === "number" || selectedQuestion.type === "date") && (
                    <ColumnLayout columns={3} variant="text-grid">
                      {selectedQuestion.type === "number" ? <>
                        <Metric label="Average" value={selectedQuestion.average === null ? "—" : Number(selectedQuestion.average).toLocaleString(undefined, { maximumFractionDigits: 2 })} />
                        <Metric label="Minimum" value={selectedQuestion.min ?? "—"} />
                        <Metric label="Maximum" value={selectedQuestion.max ?? "—"} />
                      </> : <>
                        <Metric label="Earliest selected date" value={selectedQuestion.earliest ? new Date(selectedQuestion.earliest).toLocaleDateString() : "—"} />
                        <Metric label="Latest selected date" value={selectedQuestion.latest ? new Date(selectedQuestion.latest).toLocaleDateString() : "—"} />
                        <Metric label="Date buckets" value={selectedQuestion.distribution.length} />
                      </>}
                    </ColumnLayout>
                  )}
                  <ColumnLayout columns={3} variant="text-grid">
                    <Select
                      selectedOption={{ label: selectedQuestion.question, value: selectedQuestion.questionId }}
                      options={analytics!.questions.map((item) => ({ label: `${item.question} (${item.type})`, value: item.questionId }))}
                      onChange={({ detail }) => { setSelectedQuestionId(detail.selectedOption.value ?? ""); setMinimum(""); setMaximum(""); setFilter(""); }}
                      selectedAriaLabel="Selected question"
                    />
                    <Select
                      selectedOption={sort}
                      options={sortOptions}
                      onChange={({ detail }) => setSort(detail.selectedOption as typeof sort)}
                      selectedAriaLabel="Selected sort order"
                    />
                    <Input value={filter} onChange={({ detail }) => setFilter(detail.value)} placeholder={selectedQuestion.type === "date" ? "Filter date buckets" : "Filter values"} type="search" />
                  </ColumnLayout>
                  {(selectedQuestion.type === "number" || selectedQuestion.type === "date") && (
                    <ColumnLayout columns={2} variant="text-grid">
                      <Input type="number" value={minimum} onChange={({ detail }) => setMinimum(detail.value)} placeholder={selectedQuestion.type === "date" ? "Start year (optional)" : "Minimum value (optional)"} />
                      <Input type="number" value={maximum} onChange={({ detail }) => setMaximum(detail.value)} placeholder={selectedQuestion.type === "date" ? "End year (optional)" : "Maximum value (optional)"} />
                    </ColumnLayout>
                  )}
                  <BarChart
                    series={[{ title: selectedQuestion.type === "checkbox" ? "Respondents selecting option" : selectedQuestion.type === "date" ? "Responses by selected date" : selectedQuestion.type === "number" ? "Responses by value range" : "Responses by option", type: "bar", data: filteredDistribution.map((item) => ({ x: item.label, y: item.count })) }]}
                    xScaleType="categorical"
                    horizontalBars
                    height={320}
                    xTitle="Responses"
                    yTitle={selectedQuestion.type === "number" ? "Number range" : selectedQuestion.type === "date" ? "Date range" : "Answer"}
                    ariaLabel={`Analytics for ${selectedQuestion.question}`}
                    empty={<Box textAlign="center" padding="l">No responses match these filters.</Box>}
                    hideFilter
                  />
                  {selectedQuestion.type === "checkbox" && <Alert type="info">Checkbox percentages use respondents who answered as the denominator. A respondent may select multiple options, so percentages can add up to more than 100%.</Alert>}
                  <Table
                    items={filteredDistribution}
                    columnDefinitions={[
                      { id: "value", header: selectedQuestion.type === "number" ? "Value range" : selectedQuestion.type === "date" ? "Selected date range" : "Option", cell: (item) => item.label, sortingField: "label" },
                      { id: "count", header: "Responses", cell: (item) => item.count, sortingField: "count" },
                      { id: "share", header: selectedQuestion.type === "checkbox" ? "% of respondents" : "% of answered", cell: (item) => `${(selectedQuestion.type === "number" || selectedQuestion.type === "date" ? (selectedQuestion.valid ? (item.count / selectedQuestion.valid) * 100 : 0) : (item.percentage ?? 0)).toFixed(1)}%` },
                    ]}
                    sortingDisabled={false}
                    empty={<Box textAlign="center" padding="l">No values match this filter.</Box>}
                    header={<Header variant="h3">Answer breakdown</Header>}
                  />
                </>}
              </SpaceBetween>
            )}
      </Container>

      <Container header={<Header variant="h2" description={`${analytics?.totalResponses ?? total} total response${(analytics?.totalResponses ?? total) === 1 ? "" : "s"} received.`} actions={<Button iconName="download" loading={downloading} onClick={downloadResponses}>Download spreadsheet</Button>}>Individual responses</Header>}>
        {loading ? <Box textAlign="center" padding="l"><Spinner /> Loading responses…</Box> : !responses.length ?
          <Box textAlign="center" padding="l"><Box variant="h3">No responses yet</Box><Box padding={{ top: "xs" }} color="text-body-secondary">Share your form to start collecting responses.</Box><Box padding={{ top: "m" }}><Link href="/root/myforms">Back to forms</Link></Box></Box> :
          <SpaceBetween size="l">
            {responses.map((response, index) => (
              <Container key={response._id} header={<Header variant="h3">Response {total - page * 10 - index}</Header>}>
                <KeyValuePairs columns={1} items={(response.questions ?? []).map((item, questionIndex) => ({
                  label: item.question || `Question ${questionIndex + 1}`,
                  value: item.answer || <Box color="text-status-inactive">No answer</Box>,
                }))} />
                {response.createdAt && <Box padding={{ top: "m" }} color="text-body-secondary">Submitted {new Date(response.createdAt).toLocaleString()}</Box>}
              </Container>
            ))}
            {total > 10 && <Pagination currentPageIndex={page + 1} pagesCount={Math.ceil(total / 10)} onChange={({ detail }) => setPage(detail.currentPageIndex - 1)} ariaLabels={{ pageLabel: (pageNumber) => `Page ${pageNumber}`, nextPageLabel: "Next page", previousPageLabel: "Previous page", paginationLabel: "Response pages" }} />}
          </SpaceBetween>}
      </Container>
    </SpaceBetween>
  );
}
