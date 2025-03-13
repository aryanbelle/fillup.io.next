"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Spinner } from "@nextui-org/react";
import toast from "react-hot-toast";
import NoDataPlaceholder from "@/app/components/NoDataplaceholder";
import { HiOutlineDocumentDownload } from "react-icons/hi";

const Page = ({ params }: { params: { id: String } }) => {
  const [formResponse, setFormResponse] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sheet, setSheet] = useState(null);
  const [downloadingExcel, setDownloadingExcel] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Get form responses first
        const responseData = await axios.get(`/api/getresponses/${params.id}`);
        if (responseData.data.success) {
          console.log("Form responses:", responseData.data.data);
          setFormResponse(responseData.data.data);
          
          // Only get Excel sheet URL if there are responses
          if (responseData.data.data.length > 0) {
            try {
              const sheetResponse = await axios.post(
                `/api/getresponsesinsheet/${params.id}`
              );
              if (sheetResponse.data.success) {
                setSheet(sheetResponse.data.url);
              }
            } catch (error) {
              console.error("Error fetching Excel sheet:", error);
              // Don't show error toast for Excel - it's not critical
            }
          }
        } else {
          toast.error(responseData.data.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load responses");
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [params.id]);

  const handleDownloadExcel = async () => {
    if (!sheet) return;
    
    setDownloadingExcel(true);
    try {
      window.open(sheet, '_blank');
    } catch (error) {
      console.error("Error downloading Excel:", error);
      toast.error("Failed to download Excel file");
    } finally {
      setDownloadingExcel(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center p-8">
        <Spinner size="lg" color="primary" />
        <p className="mt-4 text-gray-600">Loading responses...</p>
      </div>
    );
  }

  if (formResponse.length === 0) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center p-4">
        <NoDataPlaceholder
          title="No responses yet"
          description="Share your form to collect responses"
          buttonText="Back to Forms"
          buttonAction={() => window.history.back()}
        />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center p-4">
      <div className="w-full max-w-4xl">
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">
          {formResponse[0]?.title}
        </h2>
        <p className="mb-6 text-gray-600">
          {formResponse[0]?.description}
        </p>
        
        {sheet && (
          <Button
            onClick={handleDownloadExcel}
            color="primary"
            variant="flat"
            className="mb-6"
            startContent={<HiOutlineDocumentDownload className="h-5 w-5" />}
            isLoading={downloadingExcel}
          >
            Download Responses in Excel
          </Button>
        )}
        
        <div className="space-y-6 w-full">
          {formResponse.map((form) => (
            <div
              key={form._id}
              className="w-full p-6 bg-white shadow-sm rounded-lg border border-gray-100 hover:shadow-md transition-all"
            >
              <div className="flex flex-col gap-4">
                {form.questions && form.questions.map((response, index) => (
                  <div key={index} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <p className="font-semibold text-gray-700 mb-1">
                      {response.question}
                    </p>
                    <p className="text-gray-600">{response.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
