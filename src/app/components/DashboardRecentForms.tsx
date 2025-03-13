"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Switch,
  Chip,
  Button,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import NoDataPlaceholder from "./NoDataplaceholder";
import Link from "next/link";

const DashboardRecentForms = () => {
  const router = useRouter();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  
  function handleFormClick(id: String) {
    router.push(`myforms/form/${id}`);
  }

  async function handleSwitchChange(value: boolean, formId: string) {
    try {
      // Use toast.promise to manage the promise lifecycle with automatic toast notifications
      const response = await toast.promise(
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

  useEffect(() => {
    async function fetchForms() {
      setLoading(true);
      try {
        const response = await axios.get("/api/myforms");
        if (response.data.success) {
          setForms([...response.data.data]);
        }
      } catch (error) {
        console.error("Error fetching forms:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchForms();
  }, []);
  
  // Show only the 3 most recent forms on the dashboard
  const recentForms = forms.slice().reverse().slice(0, 4);
  
  if (loading) {
    return (
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
    );
  }
  
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {recentForms.length ? (
          recentForms.map((form) => (
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
                        onChange={(eve) =>
                          handleSwitchChange(!form.isAccepting, form.id)
                        }
                        size="sm"
                        color="primary"
                      />
                    </div>
                  </CardFooter>
                </div>
              </Card>
            </div>
          ))
        ) : (
          <div className="col-span-full">
            <NoDataPlaceholder DATA={"Forms"} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardRecentForms; 