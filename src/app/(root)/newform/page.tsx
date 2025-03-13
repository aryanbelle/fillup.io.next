import CreatorForm from "@/app/components/CreatorForm";

const page = async () => {
  return (
    <div className="mainclass p-4 min-h-[92vh] overflow-auto flex flex-col justify-center items-center text-gray-900">
      <CreatorForm 
        title="Untitled Form"
        description="Form description"
        questions={[
          {
            type: "text",
            text: "Your question",
            options: [],
            isRequired: true,
          }
        ]}
        isFile={false}
      />
    </div>
  );
};

export default page;
