import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import CreatorForm from "@/app/models/creatorForm";
import { encrypt } from "@/app/lib/crypto";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  try {
    await dbConnect();
    const user = await currentUser();
    
    if (!user || !user.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const myForms = await CreatorForm.find({
      creatorId: user.id,
    }).sort({ updatedAt: -1 });

    const forms = myForms.map((form) => ({
      id: encrypt(form._id.toString()),
      title: form.title,
      description: form.description,
      isPublished: form.isAcceptingResponses,
      createdAt: form.createdAt,
      updatedAt: form.updatedAt || form.createdAt,
    }));

    return NextResponse.json(forms);
  } catch (error) {
    console.error("Error fetching forms:", error);
    
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
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
} 