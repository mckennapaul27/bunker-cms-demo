'use client';
import { useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const useColumnsAndDataWithLoading = (
    columns,
    loading,
    data,
    tablePageSize
) => {
    const tableData = useMemo(
        () => (loading ? Array(tablePageSize).fill({}) : data),
        [loading, data]
    );
    const tableColumns = useMemo(
        () =>
            loading
                ? columns.map((column) => {
                      return {
                          ...column,
                          cell: () => <Skeleton />,
                      };
                  })
                : columns,
        [loading, columns]
    );
    return { tableColumns, tableData };
};
