import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Supported image extensions
const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".JPG", ".PNG", ".JPEG"];

// GET: Fetch images from the public folder
export async function GET() {
    try {
        const publicDir = path.join(process.cwd(), "public");

        if (!fs.existsSync(publicDir)) {
            return NextResponse.json({ error: "Public directory not found" }, { status: 404 });
        }

        const files = fs.readdirSync(publicDir);

        const images = files
            .filter((file) => {
                const ext = path.extname(file);
                return IMAGE_EXTENSIONS.includes(ext);
            })
            .map((file) => ({
                id: path.basename(file, path.extname(file)),
                url: `/${file}`,
                filename: file,
            }));

        return NextResponse.json(images);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST: Upload an image to the public folder
export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("image") as File;

        if (!file) {
            return NextResponse.json({ message: "Image is required" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const publicDir = path.join(process.cwd(), "public");
        const filename = file.name;
        const filePath = path.join(publicDir, filename);

        // Ensure public directory exists
        if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir, { recursive: true });
        }

        // Write file to public folder
        fs.writeFileSync(filePath, buffer);

        return NextResponse.json({
            id: path.basename(filename, path.extname(filename)),
            url: `/${filename}`,
            filename: filename,
        }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
