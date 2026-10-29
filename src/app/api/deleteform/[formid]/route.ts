import { decrypt } from "@/app/lib/crypto";
import dbConnect from "@/app/lib/dbConnect";
import CreatorForm from "@/app/models/creatorForm";
import userFormResponse from "@/app/models/userFormResponse";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

// Add export configuration to fix dynamic server usage error
export const dynamic = 'force-dynamic';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { formid: string } }
) {
  try {
    await dbConnect();
    const user = await currentUser();

    // Check if user is authorized
    if (!user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized user" },
        { status: 401 }
      );
    }

    // Delete the form
    const formId = decrypt(params.formid);
    if (!mongoose.isValidObjectId(formId)) {
      return NextResponse.json({ success: false, message: "Invalid form link." }, { status: 400 });
    }
    const form = await CreatorForm.findOneAndDelete({ _id: formId, creatorId: user.id });

    // If form is not found, return 404
    if (!form) {
      return NextResponse.json(
        { success: false, message: "Form not found" },
        { status: 404 }
      );
    }

    // Delete associated user responses
    await userFormResponse.deleteMany({ formId: form._id });

    return NextResponse.json(
      { success: true, message: "Form deleted" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);

    // Check for network-related errors
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

    // Handle any other errors
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 } // 500 Internal Server Error
    );
  }
}
