import { NextRequest, NextResponse } from 'next/server';
import connectToDb from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/auth-helpers';
import Page from '@/models/Page';

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
    await connectToDb();
    try {
        const data = await Page.findByIdAndUpdate(id, update, {
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
