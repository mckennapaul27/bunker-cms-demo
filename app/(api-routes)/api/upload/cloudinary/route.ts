import { NextRequest, NextResponse } from 'next/server';

import { v2 as cloudinary } from 'cloudinary';
import { streamToBuffer } from '@/utils/image-helpers';

cloudinary.config({
    secure: true,
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

interface UploadOptions {
    use_filename: boolean;
    unique_filename: boolean;
    overwrite: boolean;
    folder: string | undefined;
    public_id?: string; // Note that public_id is optional
}

const options: UploadOptions = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
    folder: process.env.CLOUDINARY_FOLDER,
};

// export const runtime = 'edge';

export async function POST(req: NextRequest) {
    const file = req.body || '';
    const searchParams = req.nextUrl.searchParams;
    const public_id = searchParams.get('public_id');
    if (public_id) options.public_id = public_id;
    try {
        if (file instanceof ReadableStream) {
            // Convert the ReadableStream to a Buffer
            const dataUri = await streamToBuffer(file);
            const result = await cloudinary.uploader.upload(dataUri, options);
            // console.log(result);
            return new NextResponse(
                JSON.stringify({
                    url: result.secure_url,
                    public_id: result.public_id,
                    width: result.width,
                    height: result.height,
                }),
                { status: 201 }
            );
        }
    } catch (error) {
        console.log(error);
        return new NextResponse(
            JSON.stringify({
                msg: error instanceof Error ? error.message : String(error),
            }),
            {
                status: 500,
            }
        );
    }
}
