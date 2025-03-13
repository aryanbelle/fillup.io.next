"use client";
import CreatorForm from "@/app/components/CreatorForm";
import React, { useState } from "react";
import axios from "axios";
import { Button, Input, Spinner } from "@nextui-org/react";
import { HiOutlineLightningBolt, HiOutlineSparkles } from "react-icons/hi";
import toast from "react-hot-toast";

// Rename the file to .jsx to bypass TypeScript errors
const Page = () => {
  const [form, setForm] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await axios.post("/api/aicreatorform", {
        reqprompt: prompt,
      });

      if (response.data.success) {
        // Create a form object
        const formData = {
          title: response.data.data.title || "Untitled Form",
          description: response.data.data.description || "Form description",
          questions: response.data.data.questions || [
            {
              type: "text",
              text: "Your question",
              options: [],
              isRequired: true,
            },
          ],
          isFile: false,
        };
        
        setForm(formData);
        toast.success("Form generated successfully!");
      } else {
        toast.error(response.data.message || "Failed to generate form");
        console.error("Failed to fetch data:", response.data);
      }
    } catch (error) {
      toast.error("Error generating form. Please try again.");
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-blue-600 p-2 rounded-lg">
              <HiOutlineSparkles className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">AI Form Builder</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Describe the form you want to create, and our AI will generate it for you. Be specific about the questions and options you need.
          </p>
        </div>

        {/* Prompt Input */}
        {!form && (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 mb-8">
            <div className="space-y-6">
              <div>
                <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                  Describe your form
                </label>
                <div className="flex gap-4">
                  <Input
                    id="prompt"
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="E.g., Create a customer feedback form with 5 questions about our service quality"
                    className="flex-1"
                    size="lg"
                    variant="bordered"
                  />
                  <Button
                    isLoading={isLoading}
                    onClick={fetchData}
                    color="primary"
                    className="px-6"
                    size="lg"
                    startContent={!isLoading && <HiOutlineLightningBolt className="h-5 w-5" />}
                  >
                    {isLoading ? "Generating..." : "Generate"}
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="text-sm font-medium text-blue-800 mb-2">Tips for better results:</h3>
                <ul className="text-sm text-blue-700 space-y-1 list-disc pl-5">
                  <li>Be specific about the type of form (survey, registration, feedback, etc.)</li>
                  <li>Mention how many questions you need</li>
                  <li>Specify if you need multiple choice, checkboxes, or text fields</li>
                  <li>Include details about your target audience</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center p-12">
            <Spinner size="lg" color="primary" />
            <p className="mt-4 text-gray-600">Generating your form with AI...</p>
          </div>
        )}

        {/* Generated Form */}
        {form && !isLoading && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Generated Form</h2>
              <Button 
                color="primary" 
                variant="light"
                onClick={() => setForm(null)}
              >
                Create Another
              </Button>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              {form && (
                <CreatorForm
                  title={form.title}
                  description={form.description}
                  questions={form.questions.map((que) => ({
                    type: que.type,
                    text: que.text,
                    options: Array.isArray(que.options) ? que.options : [],
                    isRequired: que.isRequired,
                  }))}
                  isFile={form.isFile}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
