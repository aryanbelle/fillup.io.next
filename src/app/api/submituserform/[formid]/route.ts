import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/app/lib/dbConnect";
import CreatorForm from "@/app/models/creatorForm";
import UserFormResponse from "@/app/models/userFormResponse";
import { decrypt } from "@/app/lib/crypto";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, { params }: { params: { formid: string } }) {
  try {
    const formId = decrypt(params.formid);
    if (!mongoose.isValidObjectId(formId)) {
      return NextResponse.json({ success: false, message: "Invalid form link." }, { status: 400 });
    }

    const body = await req.json();
    if (!Array.isArray(body.questions)) {
      return NextResponse.json({ success: false, message: "Invalid response data." }, { status: 400 });
    }

    await dbConnect();
    const form = await CreatorForm.findById(formId).lean();
    if (!form) return NextResponse.json({ success: false, message: "Form not found." }, { status: 404 });
    if (!form.isAcceptingResponses) {
      return NextResponse.json({ success: false, message: "This form is no longer accepting responses." }, { status: 403 });
    }
    if (body.title !== form.title || body.description !== form.description || body.questions.length !== form.questions.length) {
      return NextResponse.json({ success: false, message: "The response does not match this form." }, { status: 400 });
    }

    const questions = [];
    for (let index = 0; index < form.questions.length; index += 1) {
      const definition = form.questions[index];
      const answer = body.questions[index]?.answer;
      if (body.questions[index]?.question !== definition.text || body.questions[index]?.answer_type !== definition.type) {
        return NextResponse.json({ success: false, message: "The response does not match this form." }, { status: 400 });
      }

      const values = Array.isArray(answer) ? answer : [answer];
      const hasAnswer = values.some((value) => typeof value === "string" && value.trim().length > 0);
      if (definition.isRequired && !hasAnswer) {
        return NextResponse.json({ success: false, message: "Please answer all required questions." }, { status: 400 });
      }
      if (hasAnswer && ["radio", "checkbox"].includes(definition.type) &&
        values.some((value) => typeof value !== "string" || !definition.options.includes(value))) {
        return NextResponse.json({ success: false, message: "Choose from the listed answer options." }, { status: 400 });
      }
      if (definition.type === "radio" && values.filter(Boolean).length > 1) {
        return NextResponse.json({ success: false, message: "Choose only one option." }, { status: 400 });
      }

      const rawAnswer = Array.isArray(answer) ? answer.join(", ") : (answer ?? "");
      const storedAnswer: Record<string, unknown> = {
        question: definition.text,
        questionId: definition.questionId ?? `legacy-${index}`,
        questionIndex: index,
        answer: rawAnswer,
        answer_type: definition.type,
      };
      if (hasAnswer && definition.type === "checkbox") {
        storedAnswer.answerValues = Array.from(new Set(values.filter((value): value is string => typeof value === "string").map((value) => value.trim())));
      }
      if (hasAnswer && definition.type === "number") {
        const numeric = Number(String(values[0]).trim());
        if (!Number.isFinite(numeric)) {
          return NextResponse.json({ success: false, message: "Enter a valid number." }, { status: 400 });
        }
        storedAnswer.answerNumber = numeric;
      }
      if (hasAnswer && definition.type === "date") {
        const dateText = String(values[0]).trim();
        const normalizedDate = dateText.replaceAll("/", "-");
        if (!/^\d{4}-\d{2}-\d{2}$/.test(normalizedDate)) {
          return NextResponse.json({ success: false, message: "Enter a valid date." }, { status: 400 });
        }
        const [year, month, day] = normalizedDate.split("-").map(Number);
        const date = new Date(Date.UTC(year, month - 1, day));
        if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
          return NextResponse.json({ success: false, message: "Enter a valid date." }, { status: 400 });
        }
        storedAnswer.answerDate = date;
      }

      questions.push(storedAnswer);
    }

    const response = await UserFormResponse.create({
      userId: randomUUID(),
      formId,
      title: form.title,
      description: form.description,
      questions,
    });
    return NextResponse.json({ success: true, data: response }, { status: 201 });
  } catch (error: any) {
    console.error("Error processing form submission:", error);
    if (["ENOTFOUND", "ECONNREFUSED", "EAI_AGAIN"].includes(error.code) ||
      ["MongoServerSelectionError", "MongooseServerSelectionError"].includes(error.name)) {
      return NextResponse.json({ success: false, message: "The service is temporarily unavailable. Please try again." }, { status: 503 });
    }
    if (error instanceof SyntaxError) return NextResponse.json({ success: false, message: "Invalid response data." }, { status: 400 });
    return NextResponse.json({ success: false, message: "Could not submit your response." }, { status: 500 });
  }
}
