import React from "react";
import CreatorForm from "@/app/components/CreatorForm";
import axios from "axios";

const Page = async ({ params }: { params: { key: string } }) => {
  let data;
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/gettemplates/${params.key}`
    );

    if (response.data.success) {
      data = { ...response.data.data, isFile: false };
    } else {
      throw new Error("Something Went wrong!");
    }

    return (
      <div className="flex flex-col items-center gap-6 p-6 max-w-3xl mx-auto">
        <div className="w-full bg-white p-6 shadow-md rounded-lg">
          <CreatorForm
            title={data.title}
            description={data.description}
            questions={data.questions.map((que) => ({
              type: que.type,
              text: que.text,
              options: [...(que?.options || [])],
              isRequired: que.isRequired,
            }))}
            isFile={false}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching template:", error);
    return (
      <div className="flex flex-col w-full p-6">
        <h2 className="text-3xl font-semibold text-red-500">
          Failed to load templates
        </h2>
      </div>
    );
  }
};

export default Page;
