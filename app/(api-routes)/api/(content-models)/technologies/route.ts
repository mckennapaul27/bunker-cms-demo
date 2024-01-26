import { NextRequest, NextResponse } from 'next/server';
import connectToDb from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import Technology from '@/models/Technology';
import { authOptions } from '@/utils/auth-helpers';

// The below functions are all API routes used internally by the CMS
export const GET = async (request: NextRequest) => {
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
    await connectToDb();
    try {
        const data = await Technology.find({}).sort({ name: 1 });
        return new NextResponse(
            JSON.stringify({
                data,
            }),
            { status: 200 }
        );
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
};
export const PUT = async (request: NextRequest) => {
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
    const { update, _ids } = await request.json();
    await connectToDb();
    try {
        await Technology.updateMany(
            { _id: { $in: _ids } },
            { $set: update },
            { new: true }
        );
        return new NextResponse(
            JSON.stringify({
                msg: 'Authors updated successfully',
            }),
            { status: 200 }
        );
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
};
export const POST = async (request: NextRequest) => {
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
    const new_data = await request.json();

    await connectToDb();

    try {
        const data = await Technology.create(new_data);
        return new NextResponse(
            JSON.stringify({
                data,
            }),
            { status: 201 }
        );
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
};
export const DELETE = async (request: NextRequest) => {
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
    const { _ids } = await request.json();
    await connectToDb();
    try {
        await Technology.deleteMany({ _id: { $in: _ids } });
        return new NextResponse(
            JSON.stringify({
                msg: 'Authors deleted successfully',
            }),
            { status: 200 }
        );
    } catch (error) {
        return new NextResponse(
            JSON.stringify({
                msg: error instanceof Error ? error.message : String(error),
            }),
            {
                status: 500,
            }
        );
    }
};
