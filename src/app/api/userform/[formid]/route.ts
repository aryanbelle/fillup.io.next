import { NextRequest, NextResponse } from "next/server";
import CreatorForm from "@/app/models/creatorForm";
import dbConnect from "@/app/lib/dbConnect";
import { decrypt } from "@/app/lib/crypto";
import mongoose from "mongoose";

// Add export configuration to fix dynamic server usage error
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { formid: string } }
) {
  try {
    const formId = decrypt(params.formid);
    if (!mongoose.isValidObjectId(formId)) {
      return NextResponse.json({ success: false, message: "Invalid form link." }, { status: 400 });
    }

    await dbConnect();

    // Find the form by ID
    const getData = await CreatorForm.findById(formId);

    // Check if the form exists
    if (!getData) {
      return NextResponse.json(
        { success: false, message: "Form not found" },
        { status: 404 }
      );
    }

    // Extract required fields
    const { title, description, questions } = getData;
    const data = {
      title,
      description,
      isAcceptingResponses: getData.isAcceptingResponses !== false,
      questions: questions.map(({ type, text, options, isRequired }) => ({ type, text, options, isRequired })),
    };

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Error fetching form:", error);

    if (error.message === "Invalid form link." || error.message?.includes("FORM_LINK_SECRET")) {
      return NextResponse.json(
        { success: false, message: error.message === "Invalid form link." ? error.message : "Shared form links are temporarily unavailable." },
        { status: 400 }
      );
    }

    // Handle network-related errors
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
        { status: 503 }
      );
    }

    // General server error
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
