import connectToDb from '@/lib/mongodb';
import Category from '@/models/Category';
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

const allowedOrigins = [
    'https://www.ewalletbooster.com',
    'https://www.volumekings.com',
];
// https://github.com/vercel/next.js/discussions/49869
// The below functions are all API routes used externally which are called from the frontend and need API authentication

export const GET = async (request: NextRequest) => {
    // https://next-auth.js.org/tutorials/securing-pages-and-api-routes
    const headersList = headers();
    const authorization = headersList.get('authorization');
    const searchParams = request.nextUrl.searchParams;
    console.log('searchParams:', searchParams);
    const select = request.nextUrl.searchParams.get('select');
    const filters = JSON.parse(
        request.nextUrl.searchParams.get('filters') ?? '[]'
    );
    // Parse the filters as a JavaScript array
    console.log('filters:', filters);
    const query: { [key: string]: string } = {}; // Specify the type for query

    for (const filter of filters) {
        query[filter.field] = filter.value;
    }
    console.log('query:', query);
    // console.log('select:', select);
    // Authorization can be passed as 'Authorization' or 'authorization'
    //console.log({ headersList, authorization });
    await connectToDb();
    // use query strings to filter, sort, query, paginate etc.
    if (process.env.PUBLIC_API_KEY !== authorization) {
        return new NextResponse(
            JSON.stringify({
                msg: 'Unauthorized. You need to be provide a valid API key.',
            }),
            {
                status: 401,
            }
        );
    }

    try {
        const data = await Category.find({})
            .select(select ? select : '')
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
