import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import UserFormResponse from "@/app/models/userFormResponse";

export async function GET(req: NextRequest, { params }: { params: { responseid: string } }) {
    try {
        await dbConnect();

        // Fetch the response from the database
        const getResponse = await UserFormResponse.findById(params.responseid);

        // Check if the response exists
        if (!getResponse) {
            return NextResponse.json({ success: false, message: "Response not found" }, { status: 404 });
        }

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
