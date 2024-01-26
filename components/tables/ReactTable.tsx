'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    getFilteredRowModel,
} from '@tanstack/react-table';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { usePrevious } from '@/utils/hooks';
import isEqual from 'lodash/isEqual';
import styles from './Table.module.scss';
import pagStyles from './Pagination.module.scss';

export const ReactTable = ({
    columns,
    data,
    pageCount,
    totalCount,
    setPagination,
    pagination,
    setSorting,
    sorting,
    columnFilters,
    setColumnFilters,
    rowSelection,
    setRowSelection,
    setDeleteModalOpen,
    setUpdateModalOpen,
    setStatus,
    globalFilter,
}: {
    columns: any;
    data: any;
    pageCount: number;
    totalCount: number;
    setPagination: any;
    pagination: any;
    setSorting: any;
    sorting: any;
    columnFilters: any;
    setColumnFilters: any;
    rowSelection: any;
    setRowSelection: any;
    updateRows: any;
    setDeleteModalOpen: any;
    setUpdateModalOpen: any;
    setStatus: any;
    globalFilter: any;
}) => {
    const getRowId = useCallback((p: { _id: string }) => {
        return p._id;
    }, []);

    const table = useReactTable({
        data,
        columns,
        pageCount,
        state: {
            pagination,
            sorting,
            columnFilters,
            rowSelection,
        },
        getRowId: getRowId, // this is needed for row selection to work
        enableRowSelection: true, //enable row selection for all rows
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
        debugTable: true,
    });

    const [hasMounted, setHasMounted] = useState(false);
    const prevSorting = usePrevious(sorting);
    const prevColumnFilters = usePrevious(columnFilters);
    const prevGlobalFilter = usePrevious(globalFilter);
    const prevPagination = usePrevious(pagination);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        if (hasMounted) {
            if (
                !isEqual(prevSorting, sorting) ||
                !isEqual(prevColumnFilters, columnFilters) ||
                !isEqual(prevGlobalFilter, globalFilter) ||
                !isEqual(prevPagination, pagination)
            ) {
                table.setPageIndex(0);
            }
        }
    }, [hasMounted, sorting, columnFilters, globalFilter, pagination.pageSize]);

    return (
        <div className={styles['table-overall-wrapper']}>
            <div>
                <div className={styles['']}>
                    <div className={styles['table-container']}>
                        {Object.keys(rowSelection).length > 0 && (
                            <div className={styles['row-selection-btns']}>
                                <button
                                    className="button inverted x-small"
                                    onClick={() => {
                                        setUpdateModalOpen(true);
                                        setStatus('published');
                                    }}
                                >
                                    Publish
                                </button>
                                <button
                                    className="button inverted x-small"
                                    onClick={() => {
                                        setUpdateModalOpen(true);
                                        setStatus('draft');
                                    }}
                                >
                                    Unpublish
                                </button>
                                <button
                                    type="button"
                                    className="button x-small danger"
                                    onClick={() => setDeleteModalOpen(true)}
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                        <table className={styles['table']}>
                            <thead>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map(
                                            (header, index) => (
                                                <SortableColumnHeader
                                                    key={header.id}
                                                    header={header}
                                                    table={table}
                                                    index={index}
                                                />
                                            )
                                        )}
                                    </tr>
                                ))}
                            </thead>
                            <tbody className={styles['table-body']}>
                                {table.getRowModel().rows.map((row) => (
                                    <tr
                                        key={row.id}
                                        className={
                                            rowSelection[row.id]
                                                ? styles['row-selected']
                                                : undefined
                                        }
                                    >
                                        {row
                                            .getVisibleCells()
                                            .map((cell, index) => {
                                                if (index === 0) {
                                                    return (
                                                        <td
                                                            key={cell.id}
                                                            className={
                                                                styles[
                                                                    'index-0'
                                                                ]
                                                            }
                                                        >
                                                            {rowSelection[
                                                                cell.row.id
                                                            ] && (
                                                                <div
                                                                    className={
                                                                        styles[
                                                                            'row-selection-indicator'
                                                                        ]
                                                                    }
                                                                />
                                                            )}
                                                            {flexRender(
                                                                cell.column
                                                                    .columnDef
                                                                    .cell,
                                                                cell.getContext()
                                                            )}
                                                        </td>
                                                    );
                                                } else if (index === 1) {
                                                    return (
                                                        <td
                                                            key={cell.id}
                                                            className={
                                                                styles[
                                                                    'index-1'
                                                                ]
                                                            }
                                                        >
                                                            {flexRender(
                                                                cell.column
                                                                    .columnDef
                                                                    .cell,
                                                                cell.getContext()
                                                            )}
                                                        </td>
                                                    );
                                                } else
                                                    return (
                                                        <td key={cell.id}>
                                                            {flexRender(
                                                                cell.column
                                                                    .columnDef
                                                                    .cell,
                                                                cell.getContext()
                                                            )}
                                                        </td>
                                                    );
                                            })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className={pagStyles['pagination-container']}>
                <div className={pagStyles['pagesize-controls']}>
                    <div className={pagStyles['select-wrapper']}>
                        <select
                            className="select small"
                            defaultValue={pagination.pageSize}
                            onChange={(e) =>
                                setPagination(
                                    (prev: {
                                        pageIndex: number;
                                        pageSize: number;
                                    }) => {
                                        return {
                                            ...prev,
                                            pageSize: Number(e.target.value),
                                        };
                                    }
                                )
                            }
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                        </select>
                    </div>
                    <p className={pagStyles['results-text']}>
                        Showing{' '}
                        <span>
                            {pagination.pageSize * pagination.pageIndex + 1}
                        </span>{' '}
                        to{' '}
                        <span>
                            {pagination.pageSize * (pagination.pageIndex + 1) >
                            totalCount
                                ? totalCount
                                : pagination.pageSize *
                                  (pagination.pageIndex + 1)}
                        </span>{' '}
                        of <span>{totalCount}</span> results
                    </p>
                </div>
                <div className={pagStyles['pagination-controls']}>
                    <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

const SortableColumnHeader = ({
    header,
    table,
    index,
}: {
    index: number;
    header: any;
    table: any;
}) => {
    if (index === 0) {
        return (
            <th scope="col" className={styles['index-0']}>
                {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                )}
            </th>
        );
    }
    return (
        <th
            scope="col"
            className={index === 1 ? styles['index-1'] : styles['index-other']}
        >
            {header.isPlaceholder ? null : (
                <a
                    className={styles['column-header-link']}
                    {...{
                        style: {
                            cursor: index !== 0 ? 'pointer' : '',
                        },
                        onClick: header.column.getToggleSortingHandler(),
                    }}
                >
                    {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                    )}
                    <span className={styles['sorting-span']}>
                        {header.column.getIsSorted() === 'asc' ? (
                            <ChevronUpIcon className={styles['sort-icon']} />
                        ) : header.column.getIsSorted() === 'desc' ? (
                            <ChevronDownIcon className={styles['sort-icon']} />
                        ) : null}
                    </span>
                </a>
            )}
        </th>
    );
};
