import FormPage from "@/app/components/FormPage";
import Box from "@cloudscape-design/components/box";

export default function PublicFormPage({ params }: { params: { id: string } }) {
  return (
    <main className="public-form-page">
      <Box variant="h1">FillUp</Box>
      <FormPage id={params.id} />
    </main>
  );
}
