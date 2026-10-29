import CreatorForm from "@/app/components/CreatorForm";

const page = async () => {
  return (
    <div className="form-builder-page">
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
