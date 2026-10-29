import { decrypt } from "@/app/lib/crypto";
import dbConnect from "@/app/lib/dbConnect";
// import CreatorForm from "@/app/models/CreatorForm"; // Import the CreatorForm model
import CreatorForm from "@/app/models/creatorForm";
import UserFormResponse from "@/app/models/userFormResponse";
import { currentUser } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// Add export configuration to fix dynamic server usage error
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { formid: string } }
) {
  try {
    await dbConnect();

    const url = new URL(request.url);
    const requestedPage = Number.parseInt(url.searchParams.get("page") ?? "0", 10);
    const page = Number.isFinite(requestedPage) ? Math.max(0, requestedPage) : 0;
    const limit = 10;

    const creatorId = await currentUser();
    if (!creatorId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized user" },
        { status: 401 }
      );
    }

    const decryptedFormId = decrypt(params.formid);
    if (!mongoose.isValidObjectId(decryptedFormId)) {
      return NextResponse.json({ success: false, message: "Invalid form link." }, { status: 400 });
    }

    // Check if the form exists
    const formExists = await CreatorForm.findById(decryptedFormId);
    if (!formExists) {
      return NextResponse.json(
        { success: false, message: "Form not found" },
        { status: 404 }
      );
    }
    if (formExists.creatorId !== creatorId.id) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    // Fetch the paginated results
    const [getData, total] = await Promise.all([
      UserFormResponse.find({ formId: decryptedFormId })
        .sort({ createdAt: -1 })
        .skip(page * limit)
        .limit(limit),
      UserFormResponse.countDocuments({ formId: decryptedFormId }),
    ]);

    return NextResponse.json({ success: true, data: getData, total, page, pageSize: limit }, { status: 200 });
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
        { status: 503 }
      );
    }

    // Handle any other errors
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
