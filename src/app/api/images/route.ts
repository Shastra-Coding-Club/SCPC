import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// POST: Upload an image
export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("image") as File;

        if (!file) {
            return NextResponse.json({ message: "Image is required" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to Cloudinary via stream
        const result = await new Promise<any>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: "core-images" },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(buffer);
        });

        return NextResponse.json({
            id: result.public_id,
            url: result.secure_url,
        }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// GET: Fetch images from Cloudinary
export async function GET() {
    try {
        const result = await cloudinary.search
            .expression("folder:core-images")
            .sort_by("created_at", "desc")
            .max_results(50)
            .execute();

        const images = result.resources.map((img: any) => ({
            id: img.public_id,
            url: img.secure_url,
        }));

        return NextResponse.json(images);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
