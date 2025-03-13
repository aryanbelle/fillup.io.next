"use client";
import React from "react";
import MyCard from "./Card";
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import Sphere from "./Sphere";
import Link from "next/link";

const Templates = ({ limit = 0 }) => {
  const templates = [
    {
      server_key: "customerfeedback",
      text: "Customer Feedback",
      img: "/Customer Feedback.jpg",
      description: "Get insights from customers."
    },
    {
      server_key: "jobapplication",
      text: "Job Application",
      img: "/Job Application.jpg",
      description: "Streamline the hiring process with a customized application form."
    },
    {
      server_key: "eventregistration",
      text: "Event Registration",
      img: "/Event Registration.jpg",
      description: "Simplify event sign-ups and manage attendee information."
    },
    {
      server_key: "productsurvey",
      text: "Product Survey",
      img: "/Product Survey.jpg",
      description: "Collect valuable feedback on your products to enhance offerings."
    },
    {
      server_key: "workingfeedback",
      text: "Working Feedback",
      img: "/Working Feedback.jpg",
      description: "Monitor and improve workplace satisfaction with direct feedback."
    }
  ];
  
  // If limit is provided and greater than 0, limit the number of templates shown
  const displayTemplates = limit > 0 ? templates.slice(0, limit) : templates;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <a
        href="/newform"
        className="rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-200 hover:border-blue-200 bg-white"
      >
        <Card radius="sm" shadow="none" className="h-full">
          <CardHeader className="pb-2 pt-4 px-4 flex flex-col items-start">
            <h4 className="font-semibold text-lg text-gray-800">Blank Form</h4>
            <small className="text-sm text-gray-500 mt-1">
              Start creating from scratch
            </small>
          </CardHeader>
          <CardBody className="overflow-hidden flex justify-center items-center p-6">
            <div className="bg-gray-50 p-6 rounded-lg w-full flex justify-center items-center">
              <Image
                alt="Blank form template"
                className="object-contain"
                src="/blank-icon.png"
                height={120}
                width={120}
              />
            </div>
          </CardBody>
        </Card>
      </a>
      
      {displayTemplates.map((template) => (
        <MyCard
          key={template.server_key}
          server_key={template.server_key}
          text={template.text}
          img={template.img}
          description={template.description}
        />
      ))}
    </div>
  );
};

export default Templates;
