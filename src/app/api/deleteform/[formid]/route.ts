import { decrypt } from "@/app/lib/crypto";
import dbConnect from "@/app/lib/dbConnect";
import CreatorForm from "@/app/models/creatorForm";
import userFormResponse from "@/app/models/userFormResponse";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { formid: string } }
) {
  try {
    await dbConnect();
    // const creatorID = await currentUser();
    const creatorID = "user_2jpufxLkYhVKDyKb6ZPwBlDba06";

    // Check if user is authorized
    if (!creatorID) {
      return NextResponse.json(
        { success: false, message: "Unauthorized user" },
        { status: 401 }
      );
    }

    // Delete the form
    const form = await CreatorForm.findByIdAndDelete(params.formid);

    // If form is not found, return 404
    if (!form) {
      return NextResponse.json(
        { success: false, message: "Form not found" },
        { status: 404 }
      );
    }

    // Delete associated user responses
    await userFormResponse.deleteMany({ formId: params.formid });

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
