"use client";
import React from "react";
import { Card, CardHeader, CardBody, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface DashboardTemplatesProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}

const DashboardTemplates: React.FC<DashboardTemplatesProps> = ({ isModalOpen, setIsModalOpen }) => {
  const router = useRouter();
  
  const templates = [
    {
      server_key: "customerfeedback",
      text: "Customer Feedback",
      description: "Get insights from customers.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      color: "bg-blue-50"
    },
    {
      server_key: "jobapplication",
      text: "Job Application",
      description: "Streamline the hiring process with a customized application form.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color: "bg-green-50"
    },
    {
      server_key: "eventregistration",
      text: "Event Registration",
      description: "Simplify event sign-ups and manage attendee information.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: "bg-purple-50"
    },
    {
      server_key: "productsurvey",
      text: "Product Survey",
      description: "Collect valuable feedback on your products to enhance offerings.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: "bg-amber-50"
    },
    {
      server_key: "workingfeedback",
      text: "Working Feedback",
      description: "Monitor and improve workplace satisfaction with direct feedback.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
        </svg>
      ),
      color: "bg-red-50"
    },
    {
      server_key: "contactform",
      text: "Contact Form",
      description: "Create a simple contact form for your website or application.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color: "bg-indigo-50"
    }
  ];
  
  // Display only first 3 templates on dashboard
  const displayTemplates = templates.slice(0, 3);
  
  function handleDefaultForm(serverKey: string) {
    console.log("Rendering...");
    router.push(`/newform/${serverKey}`);
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div 
          className="rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-200 hover:border-blue-200 bg-white cursor-pointer"
          onClick={() => router.push('/newform')}
        >
          <Card radius="sm" shadow="none" className="h-full">
            <div className="h-full flex flex-col">
              <CardHeader className="pb-2 pt-4 px-4 flex flex-col items-start">
                <h4 className="font-semibold text-lg text-gray-800">Blank Form</h4>
                <small className="text-sm text-gray-500 mt-1">
                  Start creating from scratch
                </small>
              </CardHeader>
              <CardBody className="flex-grow flex items-center justify-center p-6">
                <div className="bg-gray-50 p-6 rounded-lg w-full h-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              </CardBody>
            </div>
          </Card>
        </div>
        
        {displayTemplates.map((template) => (
          <div 
            key={template.server_key}
            className="rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-200 hover:border-blue-200 bg-white cursor-pointer"
            onClick={() => handleDefaultForm(template.server_key)}
          >
            <Card radius="sm" shadow="none" className="h-full">
              <div className="h-full flex flex-col">
                <CardHeader className="pb-2 pt-4 px-4 flex flex-col items-start">
                  <h4 className="font-semibold text-lg text-gray-800">
                    {template.text}
                  </h4>
                  <small className="text-sm text-gray-500 mt-1">
                    {template.description}
                  </small>
                </CardHeader>
                <CardBody className="flex-grow flex items-center justify-center p-6">
                  <div className={`${template.color} p-6 rounded-lg w-full h-full flex items-center justify-center`}>
                    {template.icon}
                  </div>
                </CardBody>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Modal for all templates */}
      <Modal 
        isOpen={isModalOpen} 
        onOpenChange={setIsModalOpen}
        size="5xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-xl font-bold">All Form Templates</h2>
                <p className="text-sm text-gray-500">Select a template to start creating your form</p>
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
                  <div 
                    className="rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-200 hover:border-blue-200 bg-white cursor-pointer"
                    onClick={() => {
                      router.push('/newform');
                      onClose();
                    }}
                  >
                    <Card radius="sm" shadow="none" className="h-full">
                      <div className="h-full flex flex-col">
                        <CardHeader className="pb-2 pt-4 px-4 flex flex-col items-start">
                          <h4 className="font-semibold text-lg text-gray-800">Blank Form</h4>
                          <small className="text-sm text-gray-500 mt-1">
                            Start creating from scratch
                          </small>
                        </CardHeader>
                        <CardBody className="flex-grow flex items-center justify-center p-6">
                          <div className="bg-gray-50 p-6 rounded-lg w-full h-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                            </svg>
                          </div>
                        </CardBody>
                      </div>
                    </Card>
                  </div>
                  
                  {templates.map((template) => (
                    <div 
                      key={template.server_key}
                      className="rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-200 hover:border-blue-200 bg-white cursor-pointer"
                      onClick={() => {
                        handleDefaultForm(template.server_key);
                        onClose();
                      }}
                    >
                      <Card radius="sm" shadow="none" className="h-full">
                        <div className="h-full flex flex-col">
                          <CardHeader className="pb-2 pt-4 px-4 flex flex-col items-start">
                            <h4 className="font-semibold text-lg text-gray-800">
                              {template.text}
                            </h4>
                            <small className="text-sm text-gray-500 mt-1">
                              {template.description}
                            </small>
                          </CardHeader>
                          <CardBody className="flex-grow flex items-center justify-center p-6">
                            <div className={`${template.color} p-6 rounded-lg w-full h-full flex items-center justify-center`}>
                              {template.icon}
                            </div>
                          </CardBody>
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={() => {
                  router.push('/newform');
                  onClose();
                }}>
                  Create Blank Form
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default DashboardTemplates; 