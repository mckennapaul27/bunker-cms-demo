import { DashboardWrapper } from '@/components/dashboard/DashboardWrapper';
import connectToDb from '@/lib/mongodb';
import { getSort } from '@/utils/table-helpers';
import { StickyHeader } from '@/components/collections/StickyHeader';
import Link from 'next/link';
import { TableWrapper } from '@/components/tables/TableWrapper';
import { pageColumnAttributes } from '@/utils/table-colums';
import Page from '@/models/Page';
import { EmptyState } from '@/components/loading/EmptyState';
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

    await connectToDb();
    const combinedQuery =
        queryExpressions.length > 0 ? { $and: queryExpressions } : {};
    const totalCount = await Page.countDocuments(combinedQuery);
    const totalCountWithoutQuery = await Page.countDocuments();
    const data = await Page.find(combinedQuery)
        .sort(sort)
        .skip(skippage)
        .limit(pageSize);

    return (
        <DashboardWrapper>
            <StickyHeader>
                <div className={'sticky-header__collection-details'}>
                    <h1>Page</h1>
                    <p>{totalCount} entries found</p>
                </div>
                <div className={'actions'}>
                    <Link
                        href={'/dashboard/content-manager/page/create'}
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
                    apiRoute={'/api/pages'}
                    modelName={'Page'}
                    filterOptions={[
                        { name: 'Slug', id: 'slug', isUnique: true },
                        { name: 'Status', id: 'status', isUnique: false },
                    ]}
                    columnAttributes={pageColumnAttributes}
                />
            ) : (
                <EmptyState name={'Page'} />
            )}
        </DashboardWrapper>
    );
}
