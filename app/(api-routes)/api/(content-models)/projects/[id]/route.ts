import { NextRequest, NextResponse } from 'next/server';
import connectToDb from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/auth-helpers';
import Project from '@/models/Project';
import { formatAuthor, formatCategory } from '@/utils/db-model-helpers';

export const PUT = async (
    request: NextRequest,
    { params }: { params: { id: string } }
) => {
    const { id } = params;
    const session = await getServerSession(authOptions);
    if (!session) {
        return new NextResponse(
            JSON.stringify({
                msg: 'You must be logged in.',
            }),
            {
                status: 401,
            }
        );
    }
    let update = await request.json();
    // if (update.author && update.author !== '') {
    //     const author = await formatAuthor(update.author);
    //     if (author) {
    //         update.author = author;
    //     } else {
    //         delete update.author;
    //     }
    // }
    // if (update.category && update.category !== '') {
    //     const category = await formatCategory(update.category);
    //     if (category) {
    //         update.category = category;
    //     } else {
    //         delete update.category;
    //     }
    // }
    // console.log('update: ', update);
    await connectToDb();
    try {
        const data = await Project.findByIdAndUpdate(id, update, {
            new: true,
        });
        return new NextResponse(
            JSON.stringify({
                data,
            }),
            { status: 200 }
        );
    } catch (error: any) {
        console.log(error);
        return new NextResponse(error, {
            status: 500,
        });
    }
};
