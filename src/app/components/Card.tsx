"use client";
import React from "react";
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";
import { useRouter } from "next/navigation";

type Props = {
  text: string;
  img: string;
  description: string;
  server_key: string;
};

export default function MyCard(props: Props) {
  const router = useRouter();
  
  function handleDefaultForm(serverKey: string) {
    console.log("Rendering...");
    router.push(`/newform/${serverKey}`);
  }

  return (
    <div className="rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-200 hover:border-blue-200 bg-white">
      <Card radius="sm" shadow="none" className="h-full">
        <div onClick={() => handleDefaultForm(props.server_key)} className="cursor-pointer h-full flex flex-col">
          <CardHeader className="pb-2 pt-4 px-4 flex flex-col items-start">
            <h4 className="font-semibold text-lg text-gray-800">
              {props.text}
            </h4>
            <small className="text-sm text-gray-500 mt-1">
              {props.description}
            </small>
          </CardHeader>
          <CardBody className="overflow-hidden flex justify-center items-center p-4 flex-grow">
            <div className="bg-gray-50 p-3 rounded-lg w-full h-full flex justify-center items-center">
              <Image
                alt={`${props.text} template`}
                className="object-cover rounded-lg"
                src={props.img}
                width={230}
                height={150}
              />
            </div>
          </CardBody>
        </div>
      </Card>
    </div>
  );
}
