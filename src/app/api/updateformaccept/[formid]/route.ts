import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import CreatorForm from "@/app/models/creatorForm";
import { decrypt } from "@/app/lib/crypto";
import { currentUser } from "@clerk/nextjs/server";
import mongoose from "mongoose";

export async function PUT(
  req: NextRequest,
  { params }: { params: { formid: string } }
) {
  try {
    const user = await currentUser();
    if (!user?.id) return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    const data = await req.json();
    const decryptFormId = decrypt(params.formid);
    if (!mongoose.isValidObjectId(decryptFormId)) return NextResponse.json({ success: false, message: "Invalid form link." }, { status: 400 });

    // Validate the data object
    if (typeof data.isAcceptingResponses !== "boolean") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid datatype for isAcceptingResponses",
        },
        { status: 400 }
      );
    }

    // Update the form in the database
    await dbConnect();
    const updatedForm = await CreatorForm.findOneAndUpdate(
      { _id: decryptFormId, creatorId: user.id },
      { isAcceptingResponses: data.isAcceptingResponses },
      { new: true, runValidators: true } // Ensures validation is run for the update
    );

    if (!updatedForm) {
      return NextResponse.json(
        { success: false, message: "Form not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: updatedForm },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating form:", error);

    if (
      error.code === "ENOTFOUND" ||
      error.code === "ECONNREFUSED" ||
      error.code === "EAI_AGAIN"
    ) {
      return NextResponse.json(
        { message: "Network error, please check your connection." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
