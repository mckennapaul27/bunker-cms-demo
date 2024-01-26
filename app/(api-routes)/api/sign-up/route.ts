import User from '@/models/User';
import connectToDb from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export const POST = async (request: any) => {
    const { first_name, last_name, email, password } = await request.json();
    await connectToDb();
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return new NextResponse(
            JSON.stringify({
                msg: 'User already exists. Please login.',
            }),
            { status: 400 }
        );
    }
    const hash = await bcrypt.hash(password, 5);

    const newUser = new User({ first_name, last_name, email, password: hash });

    try {
        await newUser.save();
        return new NextResponse(
            JSON.stringify({
                msg: 'User created successfully',
            }),
            { status: 201 }
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
