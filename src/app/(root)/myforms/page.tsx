"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardFooter, CardHeader, Button, Chip, Tooltip, Switch } from "@nextui-org/react";
import { FiPlus, FiCopy } from "react-icons/fi";
import { toast } from "react-hot-toast";
import axios from "axios";

interface Form {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
  isAccepting: boolean;
}

const MyFormsPage = () => {
  const router = useRouter();
  const [forms, setForms] = useState<Form[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copyTooltip, setCopyTooltip] = useState<string | null>(null);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await fetch("/api/forms");
        if (!response.ok) {
          throw new Error("Failed to fetch forms");
        }
        const data = await response.json();
        setForms(data);
      } catch (error) {
        console.error("Error fetching forms:", error);
        toast.error("Failed to load forms");
      } finally {
        setIsLoading(false);
      }
    };

    fetchForms();
  }, []);

  const handleFormClick = (formId: string) => {
    router.push(`/myforms/form/${formId}`);
  };

  const handleCreateForm = () => {
    router.push("/newform");
  };

  const copyFormLink = (e: React.MouseEvent, formId: string) => {
    e.stopPropagation();
    const formUrl = `${window.location.origin}/form/${formId}`;
    navigator.clipboard.writeText(formUrl);
    
    // Set the tooltip for this specific form
    setCopyTooltip(formId);
    
    // Reset tooltip after 2 seconds
    setTimeout(() => {
      setCopyTooltip(null);
    }, 2000);
    
    toast.success("Form link copied to clipboard!");
  };

  async function handleSwitchChange(value: boolean, formId: string) {
    try {
      // Use toast.promise to manage the promise lifecycle with automatic toast notifications
      await toast.promise(
        axios.put(`/api/updateformaccept/${formId}`, {
          isAcceptingResponses: value,
        }),
        {
          loading: "Updating...",
          success: "Settings saved!",
          error: "Request failed!",
        }
      );
    } catch (error) {
      router.refresh();
      toast.error("Request failed.");
    }
  }

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="w-full flex justify-center p-8">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      ) : forms.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-700 mb-2">No forms yet</h3>
          <p className="text-gray-500 mb-6">Create your first form to get started</p>
          <Button 
            color="primary" 
            startContent={<FiPlus />}
            onClick={handleCreateForm}
          >
            Create Form
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {forms.map((form) => (
            <div
              key={form.id}
              className="rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-200 hover:border-blue-200 bg-white cursor-pointer"
              onClick={() => handleFormClick(form.id)}
            >
              <Card
                className="h-full"
                radius="sm"
                shadow="none"
              >
                <div className="h-full flex flex-col">
                  <CardHeader className="pb-2 pt-4 px-4 flex flex-col items-start">
                    <div className="flex justify-between w-full items-center">
                      <h4 className="font-semibold text-lg text-gray-800 truncate max-w-[70%]">{form.title}</h4>
                      <Chip
                        size="sm"
                        color={form.isAccepting ? "success" : "default"}
                        variant="flat"
                        className="text-xs"
                      >
                        {form.isAccepting ? "Active" : "Inactive"}
                      </Chip>
                    </div>
                    <small className="text-sm text-gray-500 mt-1 line-clamp-1">
                      {form.description || "No description provided"}
                    </small>
                  </CardHeader>
                  <CardBody className="flex-grow flex items-center justify-center p-6">
                    <div className="bg-blue-50 p-6 rounded-lg w-full h-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </CardBody>
                  <CardFooter className="bg-white p-4 border-t border-gray-100 flex justify-between">
                    <div className="flex items-center gap-2">
                      <Chip size="sm" variant="flat" className="text-xs bg-gray-100 text-gray-700">
                        {new Date(form.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </Chip>
                      <Switch
                        defaultSelected={form.isAccepting}
                        onChange={() => handleSwitchChange(!form.isAccepting, form.id)}
                        size="sm"
                        color="primary"
                      />
                    </div>
                    <Tooltip content={copyTooltip === form.id ? "Copied!" : "Copy form link"}>
                      <Button 
                        isIconOnly 
                        variant="light" 
                        size="sm"
                        onClick={(e) => copyFormLink(e, form.id)}
                      >
                        <FiCopy className="text-gray-600" />
                      </Button>
                    </Tooltip>
                  </CardFooter>
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyFormsPage; 