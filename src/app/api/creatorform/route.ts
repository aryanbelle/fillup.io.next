import dbConnect from "@/app/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import CreatorForm from "@/app/models/creatorForm";
import { randomUUID } from "crypto";

// Add export configuration to fix dynamic server usage error
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    const { id } = user ?? {};

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized user" },
        { status: 401 }
      );
    }

    const form = await req.json();
    const { isAcceptingResponses, title, description, questions } = form;

    // Validate required fields
    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof description !== "string" ||
      !description.trim() ||
      !Array.isArray(questions) ||
      questions.length === 0
    ) {
      return NextResponse.json(
        { success: false, message: "Please fill all the fields" },
        { status: 400 }
      );
    }

    const validQuestions = questions.every((question: any) =>
      question &&
      ["text", "number", "email", "radio", "checkbox", "file", "date"].includes(question.type) &&
      typeof question.text === "string" && question.text.trim() &&
      typeof question.isRequired === "boolean" &&
      Array.isArray(question.options) &&
      (["radio", "checkbox"].includes(question.type)
        ? question.options.length > 0 && question.options.every((option: unknown) => typeof option === "string" && option.trim())
        : question.options.length === 0)
    );
    if (!validQuestions) {
      return NextResponse.json({ success: false, message: "Please check each question and answer option." }, { status: 400 });
    }

    await dbConnect();

    // Create the form in the database
    await CreatorForm.create({
      isAcceptingResponses: isAcceptingResponses ?? true,
      creatorId: id,
      title,
      description,
      questions: questions.map((question: any) => ({
        questionId: randomUUID(),
        type: question.type,
        text: question.text.trim(),
        isRequired: question.isRequired,
        options: question.options.map((option: string) => option.trim()),
      })),
    } as any);

    // Respond with success
    return NextResponse.json({ success: true }, { status: 201 }); // 201 Created
  } catch (error: any) {
    console.error(error);

    if (
      error.name === "MongoServerSelectionError" &&
      /querySrv.*ENOTFOUND/i.test(error.message)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Could not resolve the MongoDB cluster address. Check that MONGODB_URI matches the current Atlas connection string.",
        },
        { status: 503 }
      );
    }

    // MongoDB and other upstream connection failures are service unavailable.
    if (
      error.code === "ENOTFOUND" ||
      error.code === "ECONNREFUSED" ||
      error.code === "EAI_AGAIN" ||
      error.name === "MongoServerSelectionError" ||
      error.name === "MongooseServerSelectionError"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Network error, please check your connection.",
        },
        { status: 503 } // 503 Service Unavailable
      );
    }

    // Handle database errors or any other unforeseen errors
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { success: false, message: "Invalid data provided." },
        { status: 422 } // 422 Unprocessable Entity
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, message: "Invalid form request." },
        { status: 400 }
      );
    }

    // Handle any other errors
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 } // 500 Internal Server Error
    );
  }
}
