import { redirect } from "next/navigation";

export default function LegacyFormPage({ params }: { params: { id: string } }) {
  redirect(`/form/${params.id}`);
}
