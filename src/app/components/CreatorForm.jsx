"use client";
import React, { useEffect, useState } from "react";
import "./form.css";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

// Remove TypeScript interfaces
// Define default values for the form
const defaultFormValues = {
  title: "Untitled Form",
  description: "Form description",
  questions: [
    {
      type: "text",
      text: "Your question",
      options: [],
      isRequired: true,
    }
  ],
  isFile: false
};

const CreatorForm = (props = defaultFormValues) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: props.title || defaultFormValues.title,
    description: props.description || defaultFormValues.description,
    questions: Array.isArray(props.questions) ? [...props.questions] : [...defaultFormValues.questions],
    isFile: props.isFile || defaultFormValues.isFile,
  });
  
  console.log(props, "Params.....///////");
  
  const handleSendData = async (event) => {
    setLoading(true);
    try {
      event.preventDefault();
      console.log("Sending...");
      const response = await axios.post("/api/creatorform", form);
      console.log(response, "RESPONSE FORM BACKEND");
      if (response.data?.success) {
        toast.success("Form created!");
        router.push(`/#recents`);
      } else {
        toast.error("Request failed, try again");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Request failed, try again");
    }
  };

  useEffect(() => {
    if (props.props) {
      setForm({ ...props.props });
    }
  }, []);

  const addQuestion = () => {
    setForm({
      ...form,
      questions: [
        ...form.questions,
        {
          type: "text",
          text: "Your question",
          options: [],
          isRequired: true,
        },
      ],
    });
  };

  const handleSwitchChange = (index, _bool) => {
    const newQuestions = form.questions.map((question, i) => {
      if (i === index) {
        return { ...question, isRequired: _bool };
      }
      return question;
    });
    setForm({ ...form, questions: newQuestions });
  };

  const handleInputChange = (index, event) => {
    const newQuestions = form.questions.map((question, i) => {
      if (i === index) {
        return { ...question, text: event.target.value };
      }
      return question;
    });
    setForm({ ...form, questions: newQuestions });
  };

  const handleTypeChange = (index, type) => {
    if (type !== "file") {
      const newQuestions = form.questions.map((question, i) => {
        if (i === index) {
          return {
            ...question,
            type,
            options: type === "text" ? [] : question.options.length ? question.options : ["Option 1"],
          };
        }
        return question;
      });
      setForm({ ...form, questions: newQuestions });
    } else {
      // If file type is selected, replace all questions with a single file upload question
      setForm({
        ...form,
        questions: [
          {
            type: "file",
            text: "Upload your file",
            options: [],
            isRequired: true,
          },
        ],
        isFile: true,
      });
    }
  };

  const handleOptionChange = (qIndex, oIndex, event) => {
    const newQuestions = form.questions.map((question, i) => {
      if (i === qIndex) {
        const newOptions = [...question.options];
        newOptions[oIndex] = event.target.value;
        return { ...question, options: newOptions };
      }
      return question;
    });
    setForm({ ...form, questions: newQuestions });
  };

  const addOption = (qIndex) => {
    const newQuestions = form.questions.map((question, i) => {
      if (i === qIndex) {
        return {
          ...question,
          options: [...question.options, `Option ${question.options.length + 1}`],
        };
      }
      return question;
    });
    setForm({ ...form, questions: newQuestions });
  };

  const deleteQuestion = (index) => {
    if (form.questions[index].type === "file") {
      setForm({
        ...form,
        questions: [
          {
            type: "text",
            text: "Your question",
            options: [],
            isRequired: true,
          },
        ],
        isFile: false,
      });
    } else {
      const newQuestions = form.questions.filter((_, i) => i !== index);
      setForm({ ...form, questions: newQuestions.length ? newQuestions : [...defaultFormValues.questions] });
    }
  };

  const deleteOption = (qIndex, oIndex) => {
    const newQuestions = form.questions.map((question, i) => {
      if (i === qIndex) {
        const newOptions = question.options.filter((_, j) => j !== oIndex);
        return { ...question, options: newOptions.length ? newOptions : ["Option 1"] };
      }
      return question;
    });
    setForm({ ...form, questions: newQuestions });
  };

  // Get icon and color based on question type
  const getTypeIcon = (type) => {
    switch(type) {
      case 'text':
        return { icon: 'text_fields', color: 'text-blue-500' };
      case 'radio':
        return { icon: 'radio_button_checked', color: 'text-green-500' };
      case 'checkbox':
        return {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          ),
          color: "bg-blue-100"
        };
      case 'number':
        return {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
          ),
          color: "bg-green-100"
        };
      case 'email':
        return {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          ),
          color: "bg-purple-100"
        };
      case 'radio':
        return {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          color: "bg-amber-100"
        };
      case 'checkbox':
        return {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          ),
          color: "bg-indigo-100"
        };
      case 'file':
        return {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          ),
          color: "bg-red-100"
        };
      default:
        return {
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
          ),
          color: "bg-gray-100"
        };
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={(event) => handleSendData(event)}>
        {/* Form Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
          <div className="mb-4">
            <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Enter form title"
              className="w-full text-2xl font-bold outline-none text-gray-800 border-0 border-b border-gray-200 focus:border-blue-500 focus:ring-0 px-0 py-2"
              />
            </div>
          <div>
            <textarea
                value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Enter form description"
              rows={2}
              className="w-full text-sm text-gray-600 outline-none border-0 border-b border-gray-200 focus:border-blue-500 focus:ring-0 px-0 py-2 resize-none"
              />
            </div>
        </div>

        {/* Questions Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Questions ({form.questions.length})</h2>
          </div>

          {/* Questions List */}
          <div className="space-y-6">
            {form.questions.map((question, qIndex) => {
              const typeInfo = getTypeIcon(question.type);
              
              return (
              <div
                key={qIndex}
                  className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:border-blue-200 transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-medium text-sm">
                        {qIndex + 1}
                      </div>
                      <div className={`${typeInfo.color} p-2 rounded-md flex items-center gap-1`}>
                        {typeInfo.icon}
                        <span className="text-sm font-medium capitalize">{question.type}</span>
                      </div>
                      {question.isRequired && (
                        <div className="bg-red-50 text-red-600 text-xs font-medium px-2 py-1 rounded-md">
                          Required
                        </div>
                      )}
                </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Required</span>
                        <div 
                          className={`relative w-10 h-5 rounded-full cursor-pointer transition-colors ${question.isRequired ? 'bg-blue-600' : 'bg-gray-300'}`}
                          onClick={() => handleSwitchChange(qIndex, question.isRequired)}
                        >
                          <div 
                            className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${question.isRequired ? 'translate-x-5' : 'translate-x-0.5'}`}
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteQuestion(qIndex)}
                        className="group p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 relative"
                        title="Delete question"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                        <span className="absolute -top-1 -right-1 scale-0 group-hover:scale-100 transition-transform origin-center bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Question Text */}
                  <div className="mb-4">
                    <input
                      type="text"
                      value={question.text}
                      onChange={(e) => handleInputChange(qIndex, e)}
                      placeholder="Enter your question"
                      className="w-full px-3 py-2 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                  {/* Question Type Selector */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
                    <div className="relative">
                      <select
                        value={question.type}
                        onChange={(e) => handleTypeChange(qIndex, e.target.value)}
                        className="w-full px-3 py-2 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                      >
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="email">Email</option>
                        <option value="radio">Radio (Multiple Choice)</option>
                        <option value="checkbox">Checkbox (Multiple Selection)</option>
                        <option value="file">File Upload</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Options for radio and checkbox */}
                  {(question.type === "radio" || question.type === "checkbox") && (
                    <div className="mt-4 pl-4 border-l-2 border-blue-200">
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-medium text-gray-700">Options</label>
                        <button
                          type="button"
                          onClick={() => addOption(qIndex)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                          </svg>
                          <span>Add Option</span>
                        </button>
                      </div>
                      <div className="space-y-2">
                        {question.options.map((option, oIndex) => (
                          <div key={oIndex} className="flex items-center gap-2">
                            {question.type === "radio" ? (
                              <div className="relative w-5 h-5 flex-shrink-0">
                                <div className="absolute inset-0 w-5 h-5 rounded-full border-2 border-blue-500"></div>
                                <div className="absolute inset-0 w-5 h-5 flex items-center justify-center">
                                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm"></div>
                                </div>
                                <div className="absolute inset-0 w-5 h-5 rounded-full animate-ping bg-blue-400 opacity-20"></div>
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-md border-2 border-blue-500 flex items-center justify-center flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => handleOptionChange(qIndex, oIndex, e)}
                              placeholder={`Option ${oIndex + 1}`}
                              className="flex-1 px-3 py-2 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                              type="button"
                              onClick={() => deleteOption(qIndex, oIndex)}
                              className="group p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              title="Delete option"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 6L6 18"></path>
                                <path d="M6 6l12 12"></path>
                              </svg>
                            </button>
                      </div>
                    ))}
                      </div>
                  </div>
                )}
              </div>
              );
            })}

            {/* Interactive Add Question Card */}
            <div 
                onClick={addQuestion}
              className="group bg-white rounded-xl shadow-sm p-6 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[180px] hover:bg-blue-50/30"
            >
              <div className="w-14 h-14 rounded-full bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center mb-3 transition-all group-hover:scale-110 group-hover:rotate-12">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-700 group-hover:text-blue-700 transition-colors">Add New Question</h3>
              <p className="text-sm text-gray-500 text-center mt-1 max-w-xs">Click here to add a new question to your form</p>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Cancel</span>
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              null
            )}
            <span className="font-medium">{loading ? 'Creating...' : 'Create Form'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatorForm;
