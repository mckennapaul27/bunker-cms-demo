'use client';
import dayjs from 'dayjs';
import React, { useMemo, useState } from 'react';
import {
    FaBan,
    FaCheckCircle,
    FaCopy,
    FaDotCircle,
    FaEye,
    FaInfoCircle,
    FaPaperPlane,
    FaThumbsDown,
    FaThumbsUp,
    FaTrash,
} from 'react-icons/fa';
import { createColumnHelper } from '@tanstack/react-table';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
// import { main_url } from '@/config';
import { IndeterminateCheckbox } from './table-filters';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import styles from '../styles/dashboard-general.module.scss';
import classNames from 'classnames';

export const authorColumnAttributes = [
    {
        id: 'name',
        label: 'Name',
    },
    {
        id: 'slug',
        label: 'Slug',
        isLink: false,
        format: (value: any) => value,
        linkTo: (row: any) => `/blog/${row.original.slug}`,
    },

    {
        id: 'status',
        label: 'Status',
        format: (value: any) => {
            switch (value) {
                case 'published':
                    return (
                        <span
                            className={classNames(
                                styles['tag_status'],
                                styles['success']
                            )}
                        >
                            {value.slice(0, 1).toUpperCase() + value.slice(1)}
                        </span>
                    );
                case 'draft':
                    return (
                        <span
                            className={classNames(
                                styles['tag_status'],
                                styles['normal']
                            )}
                        >
                            Draft
                        </span>
                    );

                default:
                    return (
                        <span className={classNames(styles['table-td-status'])}>
                            Unknown status
                        </span>
                    );
            }
        },
    },
    {
        id: '_id',
        label: 'Edit',
        format: (value: any) => {
            return (
                <div className="px-1">
                    <Link
                        href={`/dashboard/content-manager/author/${value}`}
                        className="link"
                    >
                        Edit
                    </Link>
                </div>
            );
        },
    },
];
export const categoryColumnAttributes = [
    {
        id: 'name',
        label: 'Name',
    },
    {
        id: 'slug',
        label: 'Slug',
        isLink: false,
        format: (value: any) => value,
    },

    {
        id: 'status',
        label: 'Status',
        format: (value: any) => {
            switch (value) {
                case 'published':
                    return (
                        <span
                            className={classNames(
                                styles['tag_status'],
                                styles['success']
                            )}
                        >
                            {value.slice(0, 1).toUpperCase() + value.slice(1)}
                        </span>
                    );
                case 'draft':
                    return (
                        <span
                            className={classNames(
                                styles['tag_status'],
                                styles['normal']
                            )}
                        >
                            Draft
                        </span>
                    );

                default:
                    return (
                        <span className={classNames(styles['table-td-status'])}>
                            Unknown status
                        </span>
                    );
            }
        },
    },
    {
        id: '_id',
        label: 'Edit',
        format: (value: any) => {
            return (
                <div className="px-1">
                    <Link
                        href={`/dashboard/content-manager/category/${value}`}
                        className="link"
                    >
                        Edit
                    </Link>
                </div>
            );
        },
    },
];
export const tagColumnAttributes = [
    {
        id: 'name',
        label: 'Name',
    },
    {
        id: 'slug',
        label: 'Slug',
        isLink: false,
        format: (value: any) => value,
    },

    {
        id: 'status',
        label: 'Status',
        format: (value: any) => {
            switch (value) {
                case 'published':
                    return (
                        <span
                            className={classNames(
                                styles['tag_status'],
                                styles['success']
                            )}
                        >
                            {value.slice(0, 1).toUpperCase() + value.slice(1)}
                        </span>
                    );
                case 'draft':
                    return (
                        <span
                            className={classNames(
                                styles['tag_status'],
                                styles['normal']
                            )}
                        >
                            Draft
                        </span>
                    );

                default:
                    return (
                        <span className={classNames(styles['table-td-status'])}>
                            Unknown status
                        </span>
                    );
            }
        },
    },
    {
        id: '_id',
        label: 'Edit',
        format: (value: any) => {
            return (
                <div className="px-1">
                    <Link
                        href={`/dashboard/content-manager/tag/${value}`}
                        className="link"
                    >
                        Edit
                    </Link>
                </div>
            );
        },
    },
];
export const skillColumnAttributes = [
    {
        id: 'name',
        label: 'Name',
    },
    {
        id: 'slug',
        label: 'Slug',
        isLink: false,
        format: (value: any) => value,
    },

    {
        id: 'status',
        label: 'Status',
        format: (value: any) => {
            switch (value) {
                case 'published':
                    return (
                        <span
                            className={classNames(
                                styles['tag_status'],
                                styles['success']
                            )}
                        >
                            {value.slice(0, 1).toUpperCase() + value.slice(1)}
                        </span>
                    );
                case 'draft':
                    return (
                        <span
                            className={classNames(
                                styles['tag_status'],
                                styles['normal']
                            )}
                        >
                            Draft
                        </span>
                    );

                default:
                    return (
                        <span className={classNames(styles['table-td-status'])}>
                            Unknown status
                        </span>
                    );
            }
        },
    },
    {
        id: '_id',
        label: 'Edit',
        format: (value: any) => {
            return (
                <div className="px-1">
                    <Link
                        href={`/dashboard/content-manager/skill/${value}`}
                        className="link"
                    >
                        Edit
                    </Link>
                </div>
            );
        },
    },
];
export const technologyColumnAttributes = [
    {
        id: 'name',
        label: 'Name',
    },
    {
        id: 'slug',
        label: 'Slug',
        isLink: false,
        format: (value: any) => value,
    },

    {
        id: 'status',
        label: 'Status',
        format: (value: any) => {
            switch (value) {
                case 'published':
                    return (
                        <span
                            className={classNames(
                                styles['tag_status'],
                                styles['success']
                            )}
                        >
                            {value.slice(0, 1).toUpperCase() + value.slice(1)}
                        </span>
                    );
                case 'draft':
                    return (
                        <span
                            className={classNames(
                                styles['tag_status'],
                                styles['normal']
                            )}
                        >
                            Draft
                        </span>
                    );

                default:
                    return (
                        <span className={classNames(styles['table-td-status'])}>
                            Unknown status
                        </span>
                    );
            }
        },
    },
    {
        id: '_id',
        label: 'Edit',
        format: (value: any) => {
            return (
                <div className="px-1">
                    <Link
                        href={`/dashboard/content-manager/technology/${value}`}
                        className="link"
                    >
                        Edit
                    </Link>
                </div>
            );
        },
    },
];
export const projectColumnAttributes = [
    {
        id: 'title',
        label: 'Title',
    },
    {
        id: 'slug',
        label: 'Slug',
        isLink: false,
        format: (value: any) => value,
        linkTo: (row: any) => `/project/${row.original.slug}`,
    },
    // {
    //     id: 'author',
    //     label: 'Author',
    //     isLink: false,
    //     format: (value: any) => (value ? value.name : '-'),
    // },
    // {
    //     id: 'category',
    //     label: 'Category',
    //     isLink: false,
    //     format: (value: any) => (value ? value.name : '-'),
    // },

    {
        id: 'status',
        label: 'Status',
        format: (value: any) => {
            switch (value) {
                case 'published':
                    return (
                        <span
                            className={classNames(
                                styles['tag_status'],
                                styles['success']
                            )}
                        >
                            {value.slice(0, 1).toUpperCase() + value.slice(1)}
                        </span>
                    );
                case 'draft':
                    return (
                        <span
                            className={classNames(
                                styles['tag_status'],
                                styles['normal']
                            )}
                        >
                            Draft
                        </span>
                    );

                default:
                    return (
                        <span className={classNames(styles['table-td-status'])}>
                            Unknown status
                        </span>
                    );
            }
        },
    },
    {
        id: '_id',
        label: 'Edit',
        format: (value: any) => {
            return (
                <div className="px-1">
                    <Link
                        href={`/dashboard/content-manager/project/${value}`}
                        className="link"
                    >
                        Edit
                    </Link>
                </div>
            );
        },
    },
];
export const blogColumnAttributes = [
    {
        id: 'title',
        label: 'Title',
    },
    {
        id: 'slug',
        label: 'Slug',
        isLink: false,
        format: (value: any) => value,
        linkTo: (row: any) => `/blog/${row.original.slug}`,
    },
    {
        id: 'author',
        label: 'Author',
        isLink: false,
        format: (value: any) => (value ? value.name : '-'),
    },
    {
        id: 'category',
        label: 'Category',
        isLink: false,
        format: (value: any) => (value ? value.name : '-'),
    },

    {
        id: 'status',
        label: 'Status',
        format: (value: any) => {
            switch (value) {
                case 'published':
                    return (
                        <span
                            className={classNames(
                                styles['tag_status'],
                                styles['success']
                            )}
                        >
                            {value.slice(0, 1).toUpperCase() + value.slice(1)}
                        </span>
                    );
                case 'draft':
                    return (
                        <span
                            className={classNames(
                                styles['tag_status'],
                                styles['normal']
                            )}
                        >
                            Draft
                        </span>
                    );

                default:
                    return (
                        <span className={classNames(styles['table-td-status'])}>
                            Unknown status
                        </span>
                    );
            }
        },
    },
    {
        id: '_id',
        label: 'Edit',
        format: (value: any) => {
            return (
                <div className="px-1">
                    <Link
                        href={`/dashboard/content-manager/blog/${value}`}
                        className="link"
                    >
                        Edit
                    </Link>
                </div>
            );
        },
    },
];
export const pageColumnAttributes = [
    {
        id: 'slug',
        label: 'Slug',
        isLink: false,
        format: (value: any) => value,
        linkTo: (row: any) => `/${row.original.slug}`,
    },
    {
        id: 'status',
        label: 'Status',
        format: (value: any) => {
            switch (value) {
                case 'published':
                    return (
                        <span
                            className={classNames(
                                styles['tag_status'],
                                styles['success']
                            )}
                        >
                            {value.slice(0, 1).toUpperCase() + value.slice(1)}
                        </span>
                    );
                case 'draft':
                    return (
                        <span
                            className={classNames(
                                styles['tag_status'],
                                styles['normal']
                            )}
                        >
                            Draft
                        </span>
                    );

                default:
                    return (
                        <span className={classNames(styles['table-td-status'])}>
                            Unknown status
                        </span>
                    );
            }
        },
    },
    {
        id: '_id',
        label: 'Edit',
        format: (value: any) => {
            return (
                <div className="px-1">
                    <Link
                        href={`/dashboard/content-manager/page/${value}`}
                        className="link"
                    >
                        Edit
                    </Link>
                </div>
            );
        },
    },
];

export type ColumnAttributes = {
    id: string;
    label: string;
    format?: (value: any) => any;
    isLink?: boolean;
    linkTo?: (row: any) => string;
}[];
export const useColumns = (columnAttributes: ColumnAttributes) => {
    const columnHelper = createColumnHelper();
    const columns = columnAttributes.map(
        ({ id, label, format, isLink, linkTo }) => {
            return columnHelper.accessor(
                (row) => {
                    return id
                        .split('.')
                        .reduce((obj, key) => obj?.[key], row as any);
                },
                {
                    id,
                    header: () => <span>{label}</span>,
                    cell: (info) => {
                        const value = info.getValue();
                        return (
                            <div>
                                <span>{format ? format(value) : value}</span>
                            </div>
                        );
                    },
                    footer: (props) => props.column.id,
                }
            );
        }
    );
    return useMemo(
        () => [
            ...[
                {
                    id: 'select',
                    header: ({ table }: { table: any }) => (
                        <IndeterminateCheckbox
                            {...{
                                checked: table.getIsAllRowsSelected(),
                                indeterminate: table.getIsSomeRowsSelected(),
                                onChange:
                                    table.getToggleAllRowsSelectedHandler(),
                                isHeader: true,
                            }}
                        />
                    ),
                    cell: ({ row }: { row: any }) => (
                        <IndeterminateCheckbox
                            {...{
                                checked: row.getIsSelected(),
                                disabled: !row.getCanSelect(),
                                indeterminate: row.getIsSomeSelected(),
                                onChange: row.getToggleSelectedHandler(),
                                isHeader: false,
                            }}
                        />
                    ),
                },
            ],
            ...columns,
        ],
        []
    );
};
