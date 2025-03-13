import { decrypt } from "@/app/lib/crypto";
import dbConnect from "@/app/lib/dbConnect";
// import CreatorForm from "@/app/models/CreatorForm"; // Import the CreatorForm model
import CreatorForm from "@/app/models/creatorForm";
import UserFormResponse from "@/app/models/userFormResponse";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Add export configuration to fix dynamic server usage error
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { formid: string } }
) {
  try {
    await dbConnect();

    // Get page from URL query params instead of body
    const url = new URL(request.url);
    const pageParam = url.searchParams.get('page');
    const page = pageParam ? parseInt(pageParam, 10) : 0;
    const limit = 10;
    const start = page * limit;

    const creatorId = await currentUser();
    if (!creatorId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized user" },
        { status: 401 }
      );
    }

    const decryptedFormId = decrypt(params.formid);

    // Check if the form exists
    const formExists = await CreatorForm.findById(decryptedFormId);
    if (!formExists) {
      return NextResponse.json(
        { success: false, message: "Form not found" },
        { status: 404 }
      );
    }

    // Fetch the paginated results
    const getData = await UserFormResponse.find({ formId: decryptedFormId })
      .skip(start)
      .limit(limit);

    return NextResponse.json({ success: true, data: getData }, { status: 200 });
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
