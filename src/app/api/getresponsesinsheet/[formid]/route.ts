import dbConnect from "@/app/lib/dbConnect";
import CreatorForm from "@/app/models/creatorForm";
import UserFormResponse from "@/app/models/userFormResponse";
import { decrypt } from "@/app/lib/crypto";
import { currentUser } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export const dynamic = "force-dynamic";

export async function POST(_request: Request, { params }: { params: { formid: string } }) {
  try {
    const user = await currentUser();
    if (!user?.id) return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });

    const formId = decrypt(params.formid);
    if (!mongoose.isValidObjectId(formId)) return NextResponse.json({ success: false, message: "Invalid form link." }, { status: 400 });
    await dbConnect();

    const form = await CreatorForm.findOne({ _id: formId, creatorId: user.id }).lean();
    if (!form) return NextResponse.json({ success: false, message: "Form not found." }, { status: 404 });
    const responses = await UserFormResponse.find({ formId }).sort({ createdAt: 1 }).lean();

    const rows = responses.map((response, index) => {
      const row: Record<string, string | number> = { Response: index + 1, Submitted: response.createdAt?.toISOString() ?? "" };
      response.questions.forEach((answer, questionIndex) => {
        row[`Question ${questionIndex + 1}`] = answer.question;
        row[`Answer ${questionIndex + 1}`] = answer.answer ?? "";
      });
      return row;
    });
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Responses");
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
    const safeTitle = form.title.replace(/[^a-z0-9-_]+/gi, "-").replace(/^-|-$/g, "").slice(0, 80) || "form";

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${safeTitle}-responses.xlsx"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error: any) {
    console.error("Error exporting responses:", error);
    if (["ENOTFOUND", "ECONNREFUSED", "EAI_AGAIN"].includes(error.code) ||
      ["MongoServerSelectionError", "MongooseServerSelectionError"].includes(error.name)) {
      return NextResponse.json({ success: false, message: "The service is temporarily unavailable. Please try again." }, { status: 503 });
    }
    return NextResponse.json({ success: false, message: "Could not export responses." }, { status: 500 });
  }
}
