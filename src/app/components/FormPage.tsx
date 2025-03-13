"use client";
import { Button, Input, Spinner } from "@nextui-org/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineClipboardCheck, HiOutlineDocumentText } from "react-icons/hi";

const Form = ({ id }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    questions: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/userform/${id}`);
        if (response.data.data) {
          const _formData = response.data.data;
          setFormData({
            title: _formData.title,
            description: _formData.description,
            questions: _formData.questions.map((ques) => ({
              ...ques,
              answer: ques.type === "checkbox" || "radio" ? [] : "",
            })),
          });
        } else {
          toast.error("Failed to load form. Please try refreshing the page.");
        }
      } catch (error) {
        console.error("Error fetching form data:", error);
        toast.error("Failed to load form. Please try refreshing the page.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (index, value, isCheckbox, option) => {
    const newQuestions = [...formData.questions];
    if (isCheckbox) {
      const currentAnswers = newQuestions[index].answer || [];
      if (currentAnswers.includes(option)) {
        newQuestions[index].answer = currentAnswers.filter(
          (item) => item !== option
        );
      } else {
        newQuestions[index].answer = [...currentAnswers, option];
      }
    } else if (newQuestions[index].type === "file") {
      newQuestions[index].answer = value[0]; // Handle file upload
    } else {
      if (newQuestions[index].type === "radio") {
        newQuestions[index].answer[0] = value;
      } else {
        newQuestions[index].answer = value;
      }
    }

    const updatedFormData = { ...formData, questions: newQuestions };
    setFormData(updatedFormData);
  };

  const uploadFormResponse = async (_data) => {
    try {
      const serverFormData = {
        title: _data?.title,
        description: _data?.description,
        questions: _data?.questions.map((question) => ({
          question: question.text,
          answer: question.answer,
          answer_type: question.type,
        })),
      };
      const response = await axios.post(
        `/api/submituserform/${id}`,
        serverFormData
      );
      return response;
    } catch (error) {
      console.error("Error uploading form response:", error);
      toast.error(error.message || "Failed to submit form");
      throw error;
    }
  };

  const handleSubmit = async () => {
    try {
      const updatedQuestions = await Promise.all(
        formData.questions.map(async (que) => {
          if (que?.type === "file") {
            const _formData = new FormData();
            _formData.append("file", que.answer);
            const response = await axios.post("/api/getfile", _formData);
            if (response.data?.url) {
              return { ...que, answer: response.data.url }; // Update answer with the file URL
            } else {
              toast.error("File upload failed! Please try again.");
              throw new Error("File upload failed");
            }
          }
          return que;
        })
      );

      return { ...formData, questions: updatedQuestions };
    } catch (error) {
      console.error("Error submitting form:", error);
      throw error; // Re-throw the error so it can be caught in mainHandleSubmit
    }
  };

  async function mainHandleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    try {
      const _data = await handleSubmit(); // Wait for handleSubmit to complete
      const response = await uploadFormResponse(_data); // Pass the updated data to uploadFormResponse
      if (response?.data?.success) {
        toast.success("Form submitted successfully!");
        router.push("/dashboard");
      } else {
        toast.error(response?.data.message || "Failed to submit form");
      }
    } catch (error) {
      console.error("Error in form submission:", error);
      toast.error("Something went wrong during submission!");
    } finally {
      setSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto flex flex-col items-center justify-center p-8 min-h-[60vh]">
        <Spinner size="lg" color="primary" />
        <p className="mt-4 text-gray-600">Loading form...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-sm rounded-xl overflow-hidden">
      {/* Form Header */}
      <div className="bg-blue-50 p-6 border-b border-blue-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-600 p-2 rounded-lg">
            <HiOutlineClipboardCheck className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">{formData.title}</h1>
        </div>
        <p className="text-gray-600">{formData.description}</p>
      </div>

      {/* Form Body */}
      <form onSubmit={(event) => mainHandleSubmit(event)} className="p-6">
        <div className="space-y-6">
          {formData.questions.map((question, index) => (
            <div
              key={question._id}
              className="p-5 border border-gray-200 rounded-lg hover:border-blue-200 transition-all"
            >
              <label className="block mb-3 text-gray-800 font-medium">
                {`${index + 1}. ${question.text}`}{" "}
                {question.isRequired && <span className="text-red-500">*</span>}
              </label>
              
              {question.type === "text" && (
                <Input
                  className="w-full"
                  variant="bordered"
                  type="text"
                  required={question.isRequired}
                  value={question.answer}
                  onChange={(e) =>
                    handleInputChange(index, e.target.value, false, null)
                  }
                  placeholder="Your answer"
                />
              )}
              
              {question.type === "number" && (
                <Input
                  className="w-full"
                  variant="bordered"
                  type="number"
                  required={question.isRequired}
                  value={question.answer}
                  onChange={(e) =>
                    handleInputChange(index, e.target.value, false, null)
                  }
                  placeholder="Your answer"
                />
              )}
              
              {question.type === "date" && (
                <Input
                  className="w-full"
                  variant="bordered"
                  type="date"
                  required={question.isRequired}
                  value={question.answer}
                  onChange={(e) =>
                    handleInputChange(index, e.target.value, false, null)
                  }
                />
              )}
              
              {question.type === "file" && (
                <Input
                  className="w-full"
                  variant="bordered"
                  type="file"
                  required={question.isRequired}
                  onChange={(e) =>
                    handleInputChange(index, e.target.files, false, null)
                  }
                />
              )}
              
              {question.type === "radio" && (
                <div className="space-y-2 mt-2">
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center">
                      <input
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        type="radio"
                        id={`question_${index}_option_${oIndex}`}
                        name={`question_${index}`}
                        value={option}
                        checked={question.answer[0] === option}
                        required={question.isRequired}
                        onChange={(e) =>
                          handleInputChange(index, e.target.value, false, null)
                        }
                      />
                      <label 
                        htmlFor={`question_${index}_option_${oIndex}`}
                        className="ml-2 text-gray-700"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              )}
              
              {question.type === "checkbox" && (
                <div className="space-y-2 mt-2">
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center">
                      <input
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        type="checkbox"
                        id={`question_${index}_option_${oIndex}`}
                        name={`question_${index}`}
                        value={option}
                        checked={question.answer.includes(option)}
                        onChange={(e) =>
                          handleInputChange(index, null, true, option)
                        }
                      />
                      <label 
                        htmlFor={`question_${index}_option_${oIndex}`}
                        className="ml-2 text-gray-700"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-8">
          <Button
            type="submit"
            className="w-[20%] float-right mb-8 py-6 bg-blue-600 text-white"
            isLoading={submitting}
            size="lg"
          >
            {submitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Form;
