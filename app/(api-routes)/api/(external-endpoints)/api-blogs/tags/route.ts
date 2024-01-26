import connectToDb from '@/lib/mongodb';
import Blog from '@/models/Blog';
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import qs from 'qs';
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;

const allowedOrigins = [
    'https://www.ewalletbooster.com',
    'https://www.volumekings.com',
];
// https://github.com/vercel/next.js/discussions/49869
// The below functions are all API routes used externally which are called from the frontend and need API authentication

export const GET = async (request: NextRequest) => {
    // https://next-auth.js.org/tutorials/securing-pages-and-api-routes
    const headersList = headers();
    // console.log('headersList:', headersList);
    const authorization = headersList.get('authorization');
    // Authorization can be passed as 'Authorization' or 'authorization'
    // console.log('authorization:', authorization);
    const searchParams = request.nextUrl.searchParams;
    console.log('searchParams:', searchParams);

    // Use qs to parse the entire query string
    const queryObject = qs.parse(searchParams.toString());
    console.log('queryObject (api-blogs/tags):', queryObject);

    const filters = queryObject.filters as { tags?: any };
    let tags = filters ? filters.tags : [];
    if (tags) {
        tags = tags.map((tag: any) => new ObjectId(tag));
    }
    const selectFields = queryObject.select;

    console.log('selectFields:', selectFields);
    console.log('filters:', JSON.stringify(filters, null, 2));
    console.log('tags:', tags);

    // use query strings to filter, sort, query, paginate etc.
    if (!authorization)
        return new NextResponse(
            JSON.stringify({
                msg: 'Unauthorized. No authorization header provided.',
            }),
            {
                status: 401,
            }
        );
    if (process.env.PUBLIC_API_KEY !== authorization)
        return new NextResponse(
            JSON.stringify({
                msg: 'Unauthorized. You need to be provide a valid API key.',
            }),
            {
                status: 401,
            }
        );
    await connectToDb();
    try {
        const data = await Blog.find({ 'tags._id': { $in: [tags] } })
            .select(selectFields as any)
            .sort({ slug: 1 });
        return new NextResponse(
            JSON.stringify({
                data: data,
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
