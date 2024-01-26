export const getQuery = ({ filtering }: { filtering: any[] }) => {
    if (!filtering || !filtering.length) return {};
    return filtering.reduce((acc, f) => {
        const filterQuery = { [f.id]: f.value };
        Object.assign(acc, filterQuery);
        return acc;
    }, {});
};
export const getSort = ({ sorting }: { sorting: any[] }) => {
    console.log('sorting in getSort:', sorting);
    return sorting.reduce((acc, s) => {
        const sortQuery = { [s.id]: s.desc ? -1 : 1 };
        Object.assign(acc, sortQuery);
        return acc;
    }, {});
};

export const generateRegex = (filterType: string, filterText: string) => {
    switch (filterType) {
        case 'equals':
            return `^${filterText}$`;
        case 'contains':
            return `.*${filterText}.*`;
        case 'starts-with':
            return `^${filterText}.*`;
        case 'ends-with':
            return `.*${filterText}$`;
        default:
            return '';
    }
};
