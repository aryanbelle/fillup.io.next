"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Box from "@cloudscape-design/components/box";
import Button from "@cloudscape-design/components/button";
import Cards from "@cloudscape-design/components/cards";
import Header from "@cloudscape-design/components/header";
import Link from "@cloudscape-design/components/link";
import Modal from "@cloudscape-design/components/modal";
import SpaceBetween from "@cloudscape-design/components/space-between";
import TextFilter from "@cloudscape-design/components/text-filter";
import Toggle from "@cloudscape-design/components/toggle";
import { useCloudscapeNotifications } from "@/app/components/CloudscapeNotifications";

type FormRow = {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
  isAccepting: boolean;
};

export default function MyFormsPage() {
  const toast = useCloudscapeNotifications();
  const [forms, setForms] = useState<FormRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteringText, setFilteringText] = useState("");
  const [updatingForms, setUpdatingForms] = useState<Set<string>>(() => new Set());
  const [formToDelete, setFormToDelete] = useState<FormRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    axios.get("/api/myforms")
      .then(({ data }) => {
        if (!cancelled && data.success) setForms(data.data ?? []);
        else if (!cancelled) toast.error(data.message || "Could not load your forms.");
      })
      .catch((error) => {
        if (!cancelled) toast.error(error.response?.data?.message || "Could not load your forms.");
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const visibleForms = useMemo(() => {
    const query = filteringText.trim().toLowerCase();
    return [...forms]
      .filter((form) => !query || `${form.title} ${form.description ?? ""}`.toLowerCase().includes(query))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [forms, filteringText]);

  const updateStatus = async (form: FormRow, isAccepting: boolean) => {
    if (updatingForms.has(form.id)) return;
    setUpdatingForms((current) => new Set(current).add(form.id));
    setForms((current) => current.map((item) => item.id === form.id ? { ...item, isAccepting } : item));
    try {
      await axios.put(`/api/updateformaccept/${form.id}`, { isAcceptingResponses: isAccepting });
      toast.success(isAccepting ? "Form is accepting responses." : "Form responses are paused.");
    } catch (error: any) {
      setForms((current) => current.map((item) => item.id === form.id ? { ...item, isAccepting: form.isAccepting } : item));
      toast.error(error.response?.data?.message || "Could not update form status.");
    } finally {
      setUpdatingForms((current) => {
        const next = new Set(current);
        next.delete(form.id);
        return next;
      });
    }
  };

  const copyLink = async (formId: string) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/form/${encodeURIComponent(formId)}`);
      toast.success("Form link copied.");
    } catch {
      toast.error("Could not copy the form link.");
    }
  };

  const deleteForm = async () => {
    if (!formToDelete || deleting) return;
    setDeleting(true);
    try {
      await axios.delete(`/api/deleteform/${formToDelete.id}`);
      setForms((current) => current.filter((form) => form.id !== formToDelete.id));
      toast.success("Form and its responses deleted.");
      setFormToDelete(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Could not delete this form.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Cards
        variant="container"
        className="my-forms-cards"
        header={
          <Header
            variant="h2"
            counter={`(${forms.length})`}
            description="Manage your forms, response collection, and sharing links."
            actions={<Button href="/root/newform" variant="primary" iconName="add-plus">Create form</Button>}
          >
            Your forms
          </Header>
        }
        filter={
          <TextFilter
            filteringText={filteringText}
            filteringPlaceholder="Search by form name or description"
            filteringAriaLabel="Search your forms"
            onChange={({ detail }) => setFilteringText(detail.filteringText)}
          />
        }
        items={visibleForms}
        trackBy="id"
        loading={loading}
        loadingText="Loading your forms"
        cardsPerRow={[{ cards: 1 }, { minWidth: 640, cards: 2 }, { minWidth: 1180, cards: 3 }]}
        cardDefinition={{
          header: (form) => <Link href={`/root/myforms/form/${form.id}`} fontSize="inherit">{form.title}</Link>,
          sections: [
            {
              id: "description",
              content: (form) => (
                <Box className="form-card-description" color="text-body-secondary">
                  {form.description || "No description provided."}
                </Box>
              ),
            },
            {
              id: "status",
              header: "Response collection",
              content: (form) => (
                <Toggle checked={form.isAccepting} disabled={updatingForms.has(form.id)} onChange={({ detail }) => updateStatus(form, detail.checked)}>
                  {form.isAccepting ? "Accepting responses" : "Paused"}
                </Toggle>
              ),
            },
            {
              id: "dates",
              content: (form) => (
                <SpaceBetween size="xxs">
                  <Box variant="small" color="text-body-secondary">
                    Created {new Date(form.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                  </Box>
                  <Box variant="small" color="text-body-secondary">
                    Updated {new Date(form.updatedAt ?? form.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                  </Box>
                </SpaceBetween>
              ),
            },
            {
              id: "actions",
              content: (form) => (
                <SpaceBetween direction="horizontal" size="xs">
                  <Button href={`/root/myforms/form/${form.id}`}>Responses</Button>
                  <Button iconName="copy" onClick={() => void copyLink(form.id)}>Copy link</Button>
                  <Button variant="icon" iconName="remove" ariaLabel={`Delete ${form.title}`} onClick={() => setFormToDelete(form)} />
                </SpaceBetween>
              ),
            },
          ],
        }}
        empty={
          <Box textAlign="center" padding={{ vertical: "xxl" }}>
            <Box variant="h3">{filteringText ? "No matching forms" : "No forms yet"}</Box>
            <Box padding={{ top: "xs" }} color="text-body-secondary">
              {filteringText ? "Try another search." : "Create your first form to start collecting responses."}
            </Box>
            {!filteringText && <Box padding={{ top: "m" }}><Button href="/root/newform" variant="primary">Create a form</Button></Box>}
          </Box>
        }
      />

      <Modal
        visible={Boolean(formToDelete)}
        onDismiss={() => { if (!deleting) setFormToDelete(null); }}
        header="Delete form?"
        closeAriaLabel="Close dialog"
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button disabled={deleting} onClick={() => setFormToDelete(null)}>Cancel</Button>
              <Button variant="primary" loading={deleting} onClick={() => void deleteForm()}>Delete form</Button>
            </SpaceBetween>
          </Box>
        }
      >
        Deleting “{formToDelete?.title}” also permanently deletes its responses. This action cannot be undone.
      </Modal>
    </>
  );
}
