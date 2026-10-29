import Box from "@cloudscape-design/components/box";
import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";
import Link from "@cloudscape-design/components/link";
import Templates from "@/app/api/gettemplates/[key]/templates.json";
import CreatorForm from "@/app/components/CreatorForm";

export default function TemplateFormPage({ params }: { params: { key: string } }) {
  const template = Templates.find((item) => item.key === params.key);
  if (!template) {
    return (
      <Container header={<Header variant="h2">Template not found</Header>}>
        <Box color="text-body-secondary">Choose another starting point from <Link href="/root/dashboard">your dashboard</Link>.</Box>
      </Container>
    );
  }

  return (
    <CreatorForm
      title={template.title}
      description={template.description}
      questions={template.questions.map((question) => ({
        type: question.type,
        text: question.text,
        options: question.options ?? [],
        isRequired: question.isRequired,
      }))}
      isFile={false}
    />
  );
}
