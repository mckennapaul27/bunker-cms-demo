import { useEffect, useRef, useState } from 'react';
import { flexRender } from '@tanstack/react-table';

// The DebouncedInput function component handles debounced input changes to optimize performance
export const DebouncedInput = ({
    value: initialValue,
    onChange,
    debounce = 500, // The debounce time default is 500ms
    type,
    style,
    placeholder,
    className,
    ...props
}: {
    value: any;
    onChange: any;
    debounce?: number;
    type?: string;
    placeholder?: string;
    className?: string;
    style?: any;
}) => {
    // A local state to hold the current value of the input field
    const [value, setValue] = useState(initialValue);
    const initialRender = useRef(true);

    // useEffect hook to update the local state whenever the initialValue prop changes
    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    // useEffect hook to implement debouncing: it delays the execution of the onChange handler to avoid frequent calls
    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
            return;
        }

        const handler = setTimeout(() => {
            if (value !== initialValue) {
                onChange(value);
            }
        }, debounce);

        return () => clearTimeout(handler);
    }, [value, initialValue, debounce]);

    return (
        <input
            {...props}
            value={value}
            onChange={(e) => setValue(e.target.value)}
        />
    );
};

export const MinMaxDebouncedInputs = ({
    minValue,
    maxValue,
    column,
    table,
    columnFilterValue,
}: {
    minValue?: number;
    maxValue?: number;
    column?: any;
    table?: any;
    columnFilterValue?: any;
}) => {
    return (
        <div
            style={{
                display: 'flex',
                marginTop: '5px',
            }}
        >
            <DebouncedInput
                type="number"
                // min={minValue}
                // max={maxValue}
                style={{ minwidth: '100px' }}
                value={columnFilterValue?.[0] ?? ''}
                placeholder={`Min`}
                className="input is-small"
                // debounce={1000}
                onChange={(value: any) => {
                    column.setFilterValue((old: any) => {
                        return [value, old?.[1]];
                    });
                }}
            />
            <div style={{ width: '5px' }}></div>
            <DebouncedInput
                type="number"
                // min={minValue}
                // max={maxValue}
                style={{ minwidth: '100px' }}
                value={columnFilterValue?.[1] ?? ''}
                placeholder={`Max`}
                className="input is-small"
                // debounce={1000}
                onChange={(value: any) => {
                    column.setFilterValue((old: any) => {
                        return [old?.[0], value];
                    });
                }}
            />
        </div>
    );
};

// The DebouncedSelectColumnFilter function component handles debounced input changes to optimize performance
export const DebouncedSelectColumnFilter = ({
    value: initialValue,
    onChange,
    debounce = 500, // The debounce time default is 500ms
    uniqueValues,
    ...props
}: {
    value: any;
    onChange: any;
    debounce?: number;
    uniqueValues: any;
}) => {
    // A local state to hold the current value of the input field
    const [value, setValue] = useState(initialValue);
    // useEffect hook to update the local state whenever the initialValue prop changes
    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);
    // useEffect hook to implement debouncing: it delays the execution of the onChange handler to avoid frequent calls
    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value);
        }, debounce);

        // Cleanup function to clear the timeout when the component is unmounted or when the value changes
        return () => clearTimeout(timeout);
    }, [value]);

    return (
        <div
            className="select is-small"
            style={{
                marginTop: '5px',
            }}
        >
            <select value={value} onChange={(e) => setValue(e.target.value)}>
                <option value="">All</option>
                {uniqueValues.map((value: any) => (
                    <option value={value} key={value}>
                        {value}
                    </option>
                ))}
            </select>
        </div>
    );
};

export const SimpleInputFilter = ({
    column,
    table,
}: {
    column: any;
    table: any;
}) => {
    const firstValue = table
        .getPreFilteredRowModel()
        .flatRows[0]?.getValue(column.id);
    const columnFilterValue = column.getFilterValue();

    const minMaxColumnIds = [
        'keyword_id.search_volume',
        'keyword_id.keyword_difficulty',
        'keyword_id.cpc',
        'keyword_id.low_top_of_page_bid',
        'keyword_id.high_top_of_page_bid',
        'serp.rank_group',
        'serp.rank_absolute',
        'serp.etv',
        'serp.se_results_count',
        'serp.estimated_paid_traffic_cost',
        'keyword_id.avg_backlinks_info.backlinks',
        'keyword_id.avg_backlinks_info.dofollow',
        'keyword_id.avg_backlinks_info.referring_pages',
        'keyword_id.avg_backlinks_info.referring_domains',
        'keyword_id.avg_backlinks_info.referring_main_domains',
        'keyword_id.avg_backlinks_info.rank',
        'keyword_id.avg_backlinks_info.main_domain_rank',
        'keyword_id.competition',
        'page.backlinks_info.backlinks',
        'page.backlinks_info.dofollow',
        'page.backlinks_info.referring_pages',
        'page.backlinks_info.referring_domains',
        'page.backlinks_info.referring_main_domains',
    ];
    // const minMaxFields = {
    //     'serp.rank_group': {
    //         minField: 'minRankGroup',
    //         maxField: 'maxRankGroup',
    //     },
    //     'keyword_id.search_volume': {
    //         minField: 'minSearchVol',
    //         maxField: 'maxSearchVol',
    //     },
    //     'keyword_id.keyword_difficulty': {
    //         minField: 'minKeywordDifficulty',
    //         maxField: 'maxKeywordDifficulty',
    //     },
    //     'keyword_id.cpc': {
    //         minField: 'minCPC',
    //         maxField: 'maxCPC',
    //     },
    // };
    if (
        minMaxColumnIds.includes(column.id)
        //  && table.getState().usefulValues
    ) {
        // const maxField = minMaxFields[column.id].maxField;
        // const minField = minMaxFields[column.id].minField;
        // const minValue = table.getState().usefulValues[minField];
        // const maxValue = table.getState().usefulValues[maxField];
        // if (minValue && maxValue)
        return (
            <MinMaxDebouncedInputs
                table={table}
                // minValue={minValue}
                // maxValue={maxValue}
                column={column}
                columnFilterValue={columnFilterValue}
            />
        );
    }
    const selectColumnIds = [
        'keyword_id.competition_level',
        'keyword_id.search_intent_info.main_intent',
        'serp.se_type',
        'company_website',
        'serp.type',
    ];
    const selectFields: {
        'keyword_id.competition_level': string;
        'keyword_id.search_intent_info.main_intent': string;
        'serp.se_type': string;
        company_website: string;
        'serp.type': string;
    } = {
        'keyword_id.competition_level': 'competitionLevels',
        'keyword_id.search_intent_info.main_intent': 'searchIntent',
        'serp.se_type': 'seTypes',
        company_website: 'companyWebsites',
        'serp.type': 'serpTypes',
    };

    if (selectColumnIds.includes(column.id) && table.getState().usefulValues) {
        const fieldName = selectFields[column.id as keyof typeof selectFields];
        const uniqueValues = table.getState().usefulValues[fieldName];
        if (uniqueValues && uniqueValues.length > 0) {
            return (
                <DebouncedSelectColumnFilter
                    value={columnFilterValue ?? ''}
                    onChange={(value: any) => column.setFilterValue(value)}
                    uniqueValues={uniqueValues}
                />
            );
        }
    }

    return (
        <DebouncedInput
            className="input is-small"
            style={{
                marginTop: '5px',
            }}
            onChange={(value: any) => column.setFilterValue(value)}
            value={columnFilterValue ?? ''}
            placeholder="Search..."
        />
    );
};

export const IndeterminateCheckbox = ({
    indeterminate,
    className = '',
    isHeader,
    ...rest
}: {
    isHeader: boolean;
    indeterminate: boolean;
    className?: string;
    [key: string]: any;
}) => {
    const ref = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (typeof indeterminate === 'boolean' && ref.current) {
            ref.current.indeterminate = !rest.checked && indeterminate;
        }
    }, [ref, indeterminate, rest.checked]);

    return (
        <input
            type="checkbox"
            ref={ref}
            style={
                isHeader
                    ? {
                          top: '50%',
                          transform: 'translateY(-50%)',
                      }
                    : {
                          top: '50%',
                          transform: 'translateY(-50%)',
                      }
            }
            className={
                isHeader
                    ? 'absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600'
                    : 'absolute left-4 top-1/2  h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600'
            }
            {...rest}
        />
    );
};
