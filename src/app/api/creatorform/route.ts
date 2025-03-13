export const dynamic = 'force-dynamic';

import dbConnect from "@/app/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import CreatorForm from "@/app/models/creatorForm";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const form = await req.json();
    const { id } = await currentUser();
    const { isAcceptingResponses, title, description, questions } = form;

    // Check if user is authorized
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized user" },
        { status: 401 }
      );
    }

    // Validate required fields
    if (!title || !description || !questions) {
      return NextResponse.json(
        { success: false, message: "Please fill all the fields" },
        { status: 400 }
      );
    }

    // Create the form in the database
    const data = await CreatorForm.create({
      isAcceptingResponses,
      creatorId: id,
      title,
      description,
      questions,
    } as any);

    // Respond with success
    return NextResponse.json({ success: true }, { status: 201 }); // 201 Created
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
