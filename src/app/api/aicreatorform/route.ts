import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    let model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const reqprompt = await req.json();
    console.log(reqprompt);
    const formprompt = reqprompt.reqprompt;

    console.log(formprompt);

    const prompt = `${formprompt} using this JSON schema "{
            title: {
              type: String,
              required: true,
            },
            description: {
              type: String,
              required: true,
            },
            questions: [
              {
                _id: false,
                type: {
                  type: String,
                  required: true,
                },
                isRequired: {
                  type: Boolean,
                  required: true,
                },
                text: {
                  type: String, // only text and number.
                  required: true,
                },
                options: [
                  {
                    type: String, // only radio and checkbox.
                    required: true,
                  },
                ],
              },
            ],
          }" , with high accuracy`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    console.log("Raw response:", text);

    const data = JSON.parse(text);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.log("Error:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
