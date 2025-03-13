"use client";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Switch,
  Chip,
  Button,
} from "@nextui-org/react";
import CustomSnippet from "./CustomSnippet";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import NoDataPlaceholder from "./NoDataplaceholder";
import { useEffect, useState } from "react";

interface FormCardProps {
  dashboardView?: boolean;
}

const FormCard = ({ dashboardView = false }: FormCardProps) => {
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
        console.log(response, "RESPONSE ----------");
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
  
  // For dashboard view, only show the 3 most recent forms
  const displayForms = dashboardView 
    ? forms.slice().reverse().slice(0, 3) 
    : forms.slice().reverse();
  
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
    <div className={`grid grid-cols-1 ${dashboardView ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-3'} gap-6`}>
      {displayForms.length ? (
        displayForms.map((form) => (
          <div
            key={form.id}
            className="rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-200 hover:border-blue-200 bg-white"
          >
            <Card
              className="flex flex-col justify-between h-full"
              radius="sm"
              shadow="none"
            >
              <div onClick={() => handleFormClick(form.id)} className="cursor-pointer">
                <CardHeader className="bg-white p-4 border-b border-gray-100">
                  <div className="flex justify-between w-full items-center">
                    <div className="text-lg font-medium text-gray-800 truncate max-w-[70%]">{form.title}</div>
                    <Chip
                      size="sm"
                      color={form.isAccepting ? "success" : "default"}
                      variant="flat"
                      className="text-xs"
                    >
                      {form.isAccepting ? "Active" : "Inactive"}
                    </Chip>
                  </div>
                </CardHeader>
                <CardBody className="bg-gray-50 p-4">
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {form.description || "No description provided"}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <Chip size="sm" variant="flat" className="text-xs bg-blue-100 text-blue-700">
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
                  </div>
                </CardBody>
              </div>
              <CardFooter className="bg-white p-4 border-t border-gray-100 flex justify-between">
                <Button 
                  size="sm" 
                  variant="light" 
                  color="primary" 
                  onClick={() => handleFormClick(form.id)}
                >
                  View Details
                </Button>
                <CustomSnippet
                  url={`${process.env.NEXT_PUBLIC_API_URL}/form/${form.id}`}
                />
              </CardFooter>
            </Card>
          </div>
        ))
      ) : (
        <div className="col-span-full">
          <NoDataPlaceholder DATA={"Forms"} />
        </div>
      )}
      
      {dashboardView && forms.length > 3 && (
        <div className="col-span-full mt-4 flex justify-center">
          <Button 
            color="primary" 
            variant="flat" 
            onClick={() => router.push('/myforms')}
          >
            View All Forms
          </Button>
        </div>
      )}
    </div>
  );
};

export default FormCard;
