"use client";
// components/AILoading.js

import Link from "next/link";
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import Image from "next/image";

const Sphere = () => {
  return (
    <div>
      <div className="flex flex-wrap max-w-xs h-full justify-center rounded-lg cursor-pointer transition-transform transform hover:scale-105 duration-300 bg-white">
        <Card radius="none" isBlurred={true} className="">
          <div>
            <CardHeader className="pb-0 pt-3 px-4 flex flex-col items-start">
              <h4 className="font-semibold text-lg text-gray-800">AI</h4>
              <small className="text-sm text-gray-500 mt-1">
                Start creating forms with help of AI
              </small>
            </CardHeader>
            <CardBody className="overflow-hidden flex justify-center items-center py-3">
              <Link href="/ai" className="">
                <Image width={180} height={180} alt="AI" src="/AI.jpg" />
              </Link>
            </CardBody>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Sphere;
