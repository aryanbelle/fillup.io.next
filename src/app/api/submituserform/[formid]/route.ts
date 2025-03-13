import dbConnect from "@/app/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import UserFormResponse from "@/app/models/userFormResponse";
import CreatorForm from "@/app/models/creatorForm";
import { decrypt } from "@/app/lib/crypto";

// Add export configuration to fix dynamic server usage error
export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: { formid: string } }
): Promise<NextResponse> {
  function isSubset(arr1, arr2) {
    return arr2.every((element) => arr1.includes(element));
  }

  try {
    await dbConnect();
    const form = await req.json();
    const formId = decrypt(params.formid);
    console.log(form, "FRONT END DATAAAAAAAAAAAAAAAAA");
    // Replace this with actual user authentication
    const { id } = await currentUser();
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized user",
        },
        { status: 401 }
      );
    }

    const { title, description, questions } = form;

    const creatorForm = await CreatorForm.findById(formId);
    if (!creatorForm) {
      return NextResponse.json(
        {
          success: false,
          message: "Form not found",
        },
        { status: 404 }
      );
    }
    if (!creatorForm.isAcceptingResponses) {
      return NextResponse.json(
        {
          success: false,
          message: "No more recieving responses",
        },
        { status: 403 }
      );
    }

    if (
      creatorForm.title !== title ||
      creatorForm.description !== description
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Incorrect title or description",
        },
        { status: 400 }
      );
    }

    if (!title || !description || !questions) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        { status: 400 }
      );
    }

    if (questions.length > creatorForm.questions.length) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid number of questions attempted",
        },
        { status: 400 }
      );
    }

    for (let i = 0; i < creatorForm.questions.length; i++) {
      if (creatorForm.questions[i].isRequired) {
        if (questions[i].answer === "" || questions[i].answer.length === 0) {
          return NextResponse.json(
            {
              success: false,
              message: "All required fields must be filled",
            },
            { status: 400 }
          );
        }
      }
      if (questions[i].question !== creatorForm.questions[i].text) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid question",
          },
          { status: 400 }
        );
      }
      if (questions[i].answer_type !== creatorForm.questions[i].type) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid answer type",
          },
          { status: 400 }
        );
      }
      if (questions[i].answer_type === "checkbox") {
        console.log(questions[i].answer);
        const result = isSubset(
          creatorForm.questions[i].options,
          questions[i].answer
        );
        questions[i].answer = questions[i].answer.join(",");
        if (!result) {
          return NextResponse.json(
            {
              success: false,
              message: "Invalid answer options for checkbox",
            },
            { status: 400 }
          );
        }
      }

      if (questions[i].answer_type === "radio") {
        if (questions[i].answer.length > 1) {
          return NextResponse.json(
            {
              success: false,
              message: "Multiple options selected in radio type",
            },
            { status: 400 }
          );
        }
        const result = isSubset(
          creatorForm.questions[i].options,
          questions[i].answer
        );
        questions[i].answer = questions[i].answer[0];
        if (!result) {
          return NextResponse.json(
            {
              success: false,
              message: "Selected option does not match radio options",
            },
            { status: 400 }
          );
        }
      }
    }

    const data = await UserFormResponse.create({
      userId: id,
      formId,
      title,
      description,
      questions,
    } as any);
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    console.error("Error processing form submission:", error);

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
    if (error.code === 11000) {
      return NextResponse.json({
        success: false,
        message: "The response was already submitted",
      });
    }
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
