import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
// import CreatorForm from "@/app/models/CreatorForm";
import CreatorForm from "@/app/models/creatorForm";
import { encrypt } from "@/app/lib/crypto";
import { currentUser } from "@clerk/nextjs/server";

// Add export configuration to fix dynamic server usage error
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const current_user = await currentUser();
    if (!current_user.id) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized user",
      });
    }

    let my_forms = await CreatorForm.find({
      creatorId: current_user.id,
    });
    console.log(my_forms, "MYFORMS...");
    const forms = my_forms.map((form) => {
      return {
        id: encrypt(form._id.toString()),
        title: form.title,
        description: form.description,
        isAccepting: form.isAcceptingResponses,
        createdAt: form.createdAt,
      };
    });

    return NextResponse.json({ success: true, data: forms });
  } catch (error: any) {
    console.log(error);
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
    return NextResponse.json({ success: 500, message: "Something went wrong" });
  }
}
