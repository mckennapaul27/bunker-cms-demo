'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { ColumnAttributes, useColumns } from '@/utils/table-colums';
import { useColumnsAndDataWithLoading } from '@/utils/hooks-js';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { ReactTable } from './ReactTable';
import styles from '../../styles/dashboard-general.module.scss';
import classNames from 'classnames';
import { FilterDropdown, FilterOptions } from './FilterDropdown';
import { UpdateModal } from './UpdateModal';
import { DeleteModal } from './DeleteModal';

export const TableWrapper = ({
    data,
    pageCount,
    totalCount,
    apiRoute,
    filterOptions,
    modelName,
    columnAttributes,
}: {
    data: {}[];
    pageCount: number;
    totalCount: number;
    apiRoute: string;
    filterOptions: FilterOptions;
    modelName: string;
    columnAttributes: ColumnAttributes;
}) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const sortingFromParams = searchParams.get('sorting');
    const globalFilterFromParams = searchParams.get('globalFilter');

    const [pagination, setPagination] = useState({
        pageIndex: Number(searchParams.get('pageIndex')) || 0,
        pageSize: Number(searchParams.get('pageSize')) || 10,
    });
    const [sorting, setSorting] = useState(
        sortingFromParams // default sorting
            ? JSON.parse(sortingFromParams)
            : [{ id: 'createdAt', desc: true }]
    );
    const [globalFilter, setGlobalFilter] = useState(
        globalFilterFromParams ? JSON.parse(globalFilterFromParams) : []
    );
    const [columnFilters, setColumnFilters] = useState([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [version, setVersion] = useState(0);
    const [status, setStatus] = useState('');
    const [rowSelection, setRowSelection] = useState([]);
    const [loading, setLoading] = useState(false);

    const updateQueryParams = async () => {
        // setLoading(true);
        const newSearchParams = new URLSearchParams({
            ...Object.fromEntries(searchParams),
            pageIndex: pagination.pageIndex.toString(),
            pageSize: pagination.pageSize.toString(),
            sorting: JSON.stringify(sorting),
            globalFilter: JSON.stringify(globalFilter),
            version: version.toString(), // add this line
        });
        const newUrl = `${pathname}?${newSearchParams.toString()}`;
        router.replace(newUrl);
        // await new Promise((resolve) => setTimeout(resolve, 500));
        // setLoading(false);
    };

    useEffect(() => {
        updateQueryParams();
    }, [pagination, sorting, globalFilter, version]);

    const updateRows = async () => {
        const _ids = Object.keys(rowSelection);
        try {
            const res = await fetch(
                apiRoute, // e.g '/api/authors'
                {
                    method: 'PUT',
                    body: JSON.stringify({
                        _ids,
                        update: { status: status },
                    }),
                }
            );
            if (res.ok) {
                setVersion((prevVersion) => prevVersion + 1); // increment version
            }
        } catch (error) {}
    };
    const deleteRows = async () => {
        const _ids = Object.keys(rowSelection);
        try {
            const res = await fetch(
                apiRoute, // e.g '/api/authors'
                {
                    method: 'DELETE',
                    body: JSON.stringify({
                        _ids,
                    }),
                }
            );
            if (res.ok) {
                setVersion((prevVersion) => prevVersion + 1); // increment version
            }
        } catch (error) {}
    };
    const defaultData = useMemo(() => [], []);

    const { tableColumns, tableData } = useColumnsAndDataWithLoading(
        useColumns(columnAttributes),
        loading, // loading
        data,
        pagination.pageSize
    );
    return (
        <div className={styles['dashboard-content-wrapper']}>
            <div
                className={classNames(styles['content-block'], styles['wide'])}
            >
                {deleteModalOpen && (
                    <DeleteModal
                        deleteModalOpen={deleteModalOpen}
                        setDeleteModalOpen={setDeleteModalOpen}
                        deleteRows={deleteRows}
                        modelName={modelName}
                    />
                )}
                {updateModalOpen && (
                    <UpdateModal
                        updateModalOpen={updateModalOpen}
                        setUpdateModalOpen={setUpdateModalOpen}
                        updateRows={updateRows}
                        status={status}
                        modelName={modelName}
                    />
                )}

                <FilterDropdown
                    filterOptions={filterOptions}
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                />
                <ReactTable
                    columns={tableColumns}
                    data={tableData || defaultData}
                    pageCount={pageCount || 0}
                    totalCount={totalCount || 0}
                    setPagination={setPagination}
                    pagination={pagination}
                    sorting={sorting}
                    setSorting={setSorting}
                    columnFilters={columnFilters}
                    setColumnFilters={setColumnFilters}
                    rowSelection={rowSelection}
                    setRowSelection={setRowSelection}
                    updateRows={updateRows}
                    setDeleteModalOpen={setDeleteModalOpen}
                    setUpdateModalOpen={setUpdateModalOpen}
                    setStatus={setStatus}
                    globalFilter={globalFilter}
                />
            </div>
        </div>
    );
};
