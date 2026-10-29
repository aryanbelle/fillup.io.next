import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import UserFormResponse from "@/app/models/userFormResponse";
import CreatorForm from "@/app/models/creatorForm";
import { currentUser } from "@clerk/nextjs/server";
import mongoose from "mongoose";

export async function GET(req: NextRequest, { params }: { params: { responseid: string } }) {
    try {
        const user = await currentUser();
        if (!user?.id) return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
        if (!mongoose.isValidObjectId(params.responseid)) return NextResponse.json({ success: false, message: "Response not found." }, { status: 404 });
        await dbConnect();

        // Fetch the response from the database
        const getResponse = await UserFormResponse.findById(params.responseid);

        // Check if the response exists
        if (!getResponse) {
            return NextResponse.json({ success: false, message: "Response not found" }, { status: 404 });
        }
        const form = await CreatorForm.findOne({ _id: getResponse.formId, creatorId: user.id }).select("_id");
        if (!form) return NextResponse.json({ success: false, message: "Response not found." }, { status: 404 });

        // Return the found response
        return NextResponse.json({ success: true, data: getResponse }, { status: 200 });
    } catch (error: any) {
        console.error(error);

        // Check for network-related errors
        if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED' || error.code === 'EAI_AGAIN') {
            return NextResponse.json(
                { success: false, message: "Network error, please check your connection." },
                { status: 503 }
            );
        }

        // Handle any other errors
        return NextResponse.json({ success: false, message: "Something went wrong" }, { status: 500 });
    }
}
