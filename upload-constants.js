const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadConstants() {
    const constantsPath = path.join(__dirname, 'src/lib/constants.ts');
    const publicDir = path.join(__dirname, 'public');

    if (!fs.existsSync(constantsPath)) {
        console.error('constants.ts not found');
        return;
    }

    let content = fs.readFileSync(constantsPath, 'utf8');

    // Regex to find local paths assigned to constants
    // Matches: export const CONST_NAME = "/path/to/image.ext";
    const regex = /export const (\w+) = "(\/[^"]+)";/g;
    let match;
    let updated = false;

    while ((match = regex.exec(content)) !== null) {
        const constName = match[1];
        const localPath = match[2]; // e.g., "/scpc.png"
        const filePath = path.join(publicDir, localPath);

        if (fs.existsSync(filePath)) {
            console.log(`Uploading ${localPath} for ${constName}...`);
            try {
                const result = await cloudinary.uploader.upload(filePath, {
                    folder: 'scpc-assets',
                    public_id: path.basename(localPath, path.extname(localPath)),
                });

                console.log(`Uploaded! URL: ${result.secure_url}`);

                // Replace in content
                // We use a more specific replacement to avoid accidental replaces
                content = content.replace(`"${localPath}"`, `"${result.secure_url}"`);
                updated = true;
            } catch (err) {
                console.error(`Failed to upload ${localPath}:`, err.message);
            }
        } else {
            console.warn(`File not found: ${filePath}`);
        }
    }

    if (updated) {
        fs.writeFileSync(constantsPath, content, 'utf8');
        console.log('Updated src/lib/constants.ts with Cloudinary URLs');
    } else {
        console.log('No local images found to upload or update.');
    }
}

uploadConstants();
