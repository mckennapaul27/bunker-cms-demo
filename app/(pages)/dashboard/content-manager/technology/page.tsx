import { DashboardWrapper } from '@/components/dashboard/DashboardWrapper';
import connectToDb from '@/lib/mongodb';
import Technology from '@/models/Technology';
import { getSort } from '@/utils/table-helpers';
import { StickyHeader } from '@/components/collections/StickyHeader';
import Link from 'next/link';
import { TableWrapper } from '@/components/tables/TableWrapper';
import { technologyColumnAttributes } from '@/utils/table-colums';
import { TableEmptyState } from '@/components/tables/EmptyState';

export default async function ContentManagerPage({
    searchParams,
}: {
    searchParams: any;
}) {
    const pageIndex = searchParams.pageIndex
        ? parseInt(searchParams.pageIndex)
        : 0;
    const pageSize = searchParams.pageSize
        ? parseInt(searchParams.pageSize)
        : 10;
    const query = searchParams.globalFilter
        ? JSON.parse(searchParams.globalFilter)
        : [];
    let sort = searchParams.sorting
        ? getSort({ sorting: JSON.parse(searchParams.sorting) })
        : getSort({ sorting: [{ id: 'createdAt', desc: true }] });

    let skippage = pageSize * pageIndex;
    const queryExpressions = query.map(
        (filter: { id: string; value: string | number }) => {
            return { [filter.id]: { $regex: filter.value, $options: 'i' } };
        }
    );

    // wait 5 seconds
    // await new Promise((resolve) => setTimeout(resolve, 60000));

    await connectToDb();
    const combinedQuery =
        queryExpressions.length > 0 ? { $and: queryExpressions } : {};
    const totalCount = await Technology.countDocuments(combinedQuery);
    const totalCountWithoutQuery = await Technology.countDocuments();
    const data = await Technology.find(combinedQuery)
        .sort(sort)
        .skip(skippage)
        .limit(pageSize);

    return (
        <DashboardWrapper>
            <StickyHeader>
                <div className={'sticky-header__collection-details'}>
                    <h1>Technology</h1>
                    <p>{totalCount} entries found</p>
                </div>
                <div className={'actions'}>
                    <Link
                        href={'/dashboard/content-manager/technology/create'}
                        className="button small"
                    >
                        Create new entry
                    </Link>
                </div>
            </StickyHeader>
            {totalCountWithoutQuery > 0 ? (
                <TableWrapper
                    data={JSON.parse(JSON.stringify(data))}
                    pageCount={Math.ceil(totalCount / pageSize)}
                    totalCount={totalCount}
                    apiRoute={'/api/technologies'}
                    modelName={'Technology'}
                    filterOptions={[
                        { name: 'Name', id: 'name', isUnique: true },
                        { name: 'Slug', id: 'slug', isUnique: true },
                        { name: 'Status', id: 'status', isUnique: false },
                    ]}
                    columnAttributes={technologyColumnAttributes}
                />
            ) : (
                <TableEmptyState />
            )}
        </DashboardWrapper>
    );
}
