import { NextRequest, NextResponse } from "next/server";
import Templates from './templates.json';

export async function GET(req: NextRequest, { params }: { params: { key: string } }) {
    try {
        // Find the template by key
        const form = Templates.find(template => template.key === params.key);

        // Check if form exists
        if (!form) {
            return NextResponse.json(
                { success: false, message: "Template not found" },
                { status: 404 }
            );
        }

        // Return success response with the form data
        return NextResponse.json({ success: true, data: form });
    } catch (error: any) {
        console.error("Error during POST request:", error);

        // Check for network-related errors
        if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED' || error.code === 'EAI_AGAIN') {
            return NextResponse.json(
                { message: "Network error, please check your connection." },
                { status: 503 }
            );
        }

        // Handle any other errors
        return NextResponse.json({ success: false, message: "Something went wrong" }, { status: 500 });
    }
}
