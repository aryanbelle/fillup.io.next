import { NextRequest, NextResponse } from "next/server";
import CreatorForm from "@/app/models/creatorForm";
import dbConnect from "@/app/lib/dbConnect";
import { decrypt } from "@/app/lib/crypto";

export async function GET(
  request: NextRequest,
  { params }: { params: { formid: string } }
) {
  try {
    await dbConnect();
    const formId = decrypt(params.formid);

    // Find the form by ID
    const getData = await CreatorForm.findById(formId);

    // Check if the form exists
    if (!getData) {
      return NextResponse.json(
        { success: false, message: "Form not found" },
        { status: 404 }
      );
    }

    // Check if the form is accepting responses
    if (!getData.isAcceptingResponses) {
      return NextResponse.json(
        { success: false, message: "No more receiving responses" },
        { status: 403 }
      );
    }

    // Extract required fields
    const { isAcceptingResponses, creatorId, title, description, questions } =
      getData;
    const data = {
      isAcceptingResponses,
      creatorId,
      title,
      description,
      questions,
    };

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Error fetching form:", error);

    // Handle network-related errors
    if (
      error.code === "ENOTFOUND" ||
      error.code === "ECONNREFUSED" ||
      error.code === "EAI_AGAIN"
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
