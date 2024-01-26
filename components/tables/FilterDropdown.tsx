'use client';

import { generateRegex } from '@/utils/table-helpers';
import React, { useState } from 'react';
import { useRef } from 'react';
import {
    AdjustmentsHorizontalIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import styles from './FilterDropdown.module.scss';
import { useOnClickOutside } from '@/utils/hooks';

export type GlobalFilter = {
    id: string;
    value: string;
    filterText: string;
    filterType: string;
};

export type FilterOptions = { name: string; id: string; isUnique?: boolean }[];

export type FilterDropdownProps = {
    filterOptions: FilterOptions;
    globalFilter: GlobalFilter[];
    setGlobalFilter: (prevFilters: GlobalFilter[]) => void;
};

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
    filterOptions,
    globalFilter,
    setGlobalFilter,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<{
        id: string;
        filterType: string;
        filterText: string;
    }>({
        id: '',
        filterType: '',
        filterText: '',
    });
    const ref = useRef<HTMLDivElement | null>(null);

    useOnClickOutside(ref, () => setIsOpen(false));

    const handleInputChange = (
        event:
            | React.ChangeEvent<HTMLSelectElement>
            | React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = event.target;
        setSelectedFilter((prevFilter) => ({ ...prevFilter, [name]: value }));
    };

    const handleAddFilterClick = () => {
        const { id, filterType, filterText } = selectedFilter;
        const regexValue = generateRegex(filterType, filterText);
        const newFilter: GlobalFilter = {
            id,
            filterText,
            filterType,
            value: regexValue,
        };

        const newFilters = [...globalFilter, newFilter];
        setGlobalFilter(newFilters);
        setSelectedFilter({ id: '', filterText: '', filterType: '' });
        setIsOpen(false);
    };

    const handleRemoveItemFromGlobalFilter = (filter: GlobalFilter) => {
        const newFilters = globalFilter.filter((f) => f.id !== filter.id);
        setGlobalFilter(newFilters);
    };

    return (
        <div ref={ref} className={styles['filter-dropdown-root']}>
            <div className={styles['wrapper']}>
                <div>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="button small inverted"
                    >
                        Filters
                        <AdjustmentsHorizontalIcon
                            className={styles['icon']}
                            aria-hidden="true"
                        />
                    </button>
                </div>
                <div className={styles['active-filters']}>
                    {globalFilter.map((filter, i) => {
                        return (
                            <button
                                key={`${filter.id}-${i}`}
                                className="tag small inverted"
                                onClick={() =>
                                    handleRemoveItemFromGlobalFilter(filter)
                                }
                            >
                                {filter.id} {filter.filterType}{' '}
                                <span className="tag-filter-text">
                                    {' '}
                                    {filter.filterText}
                                </span>
                                <span className="tag-svg-wrapper">
                                    <XMarkIcon />
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {isOpen && (
                <div
                    // className="origin-top-right absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                    className={styles['dropdown']}
                >
                    <div>
                        <select
                            id="id-of-field"
                            name="id"
                            // className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            className="select small"
                            onChange={handleInputChange}
                        >
                            <option value="">Select</option>
                            {filterOptions.map((option) => (
                                <option value={option.id} key={option.id}>
                                    {option.name}
                                </option>
                            ))}
                        </select>
                        <select
                            id="filter-type"
                            name="filterType"
                            // className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            className="select small"
                            onChange={handleInputChange}
                        >
                            <option value="">Select</option>
                            <option value="equals">equals</option>
                            <option value="contains">contains</option>
                            <option value="starts-with">starts with</option>
                            <option value="ends-with">ends with</option>
                        </select>
                        <input
                            type="text"
                            name="filterText"
                            id="filter-text"
                            className="input small"
                            onChange={handleInputChange}
                        />
                        <button
                            className="button small"
                            onClick={handleAddFilterClick}
                        >
                            Add Filter
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
