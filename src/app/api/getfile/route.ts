import { NextRequest, NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { Readable } from "stream";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Define a custom type that extends Blob to include the name property
interface FileWithName extends Blob {
  name: string;
}

function streamUpload(buffer: Buffer, fileName: string): Promise<cloudinary.UploadApiResponse | undefined> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      {
        folder: "fillup-files",
        resource_type: 'raw', // Use 'raw' for all types of files
        public_id: fileName, // Use the file name with extension
        use_filename: true, // Use the original filename
        unique_filename: false, // Prevent Cloudinary from changing the filename
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    Readable.from(buffer).pipe(uploadStream);
  });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as FileWithName | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    // Extract the file name and extension
    const fileName = file.name;

    // Convert the Blob to a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary with the original file name and extension
    const uploadResult = await streamUpload(buffer, fileName);

    if (!uploadResult) {
      return NextResponse.json({ success: false, error: "Failed to upload file" }, { status: 500 });
    }

    // Send the Cloudinary URL as a response
    return NextResponse.json({ success: true, url: uploadResult.secure_url }, { status: 200 });
  } catch (error: any) {
    console.error(error);

    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED' || error.code === 'EAI_AGAIN') {
      return NextResponse.json(
        { success: false, message: "Network error, please check your connection." },
        { status: 503 }
      );
    }

    return NextResponse.json({ success: false, message: "Something went wrong" }, { status: 500 });
  }
}
