'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './DropdownCheckboxes.module.scss';
import { useOnClickOutside } from '@/utils/hooks';
import { DeleteIcon } from 'lucide-react';

// Define a type for the object
export type DataType = {
    // could be tag, skill, technology,
    _id: string;
    name: string;
    createdAt?: string;
    metaDescription?: string;
    metaTitle?: string;
    slug?: string;
    status?: string;
    updatedAt?: string;
    __v?: number;
};

// Define the props type
type DataTypeDropdownProps = {
    allData: DataType[];
    setValue: (key: string, value: DataType[]) => void;
    existing?: DataType[] | any[];
    valueName?: string;
};

export const DropdownCheckboxes: React.FC<DataTypeDropdownProps> = ({
    allData,
    existing = [],
    setValue,
    valueName = 'tags',
}) => {
    //console.log('allData', allData);
    // console.log('existing', existing);
    // console.log('valueName', valueName);
    const ref = useRef<HTMLDivElement | null>(null);
    const [available, setAvailable] = useState<DataType[]>([]);
    const [selected, setSelected] = useState<DataType[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [newData, setNewData] = useState<DataType[] | []>(existing);

    useEffect(() => {
        //console.log('useEffect called!!');
        setAvailable(
            existing.length > 0
                ? allData.filter(
                      (item) =>
                          !existing.some(
                              (existing_item) => existing_item._id === item._id
                          )
                  )
                : allData
        );
        setSelected(
            existing.length > 0
                ? allData.filter((item) =>
                      existing.some(
                          (existing_item) => existing_item._id === item._id
                      )
                  )
                : []
        );
    }, [allData, existing.length]);

    // Sync newData with form state
    useEffect(() => {
        if (newData) {
            setValue(valueName, newData);
        }
    }, [newData, setValue, valueName]);

    const handleCheckboxChange = (item: DataType) => {
        setSelected((prevSelected) => {
            // console.log('prevSelected', prevSelected);
            // console.log('item', item);
            // return [];
            if (
                prevSelected.some(
                    (existing_item) => existing_item._id === item._id
                )
            ) {
                //console.log('item already selected');
                // make available again
                setAvailable((prevAvailableTags) => [
                    ...prevAvailableTags,
                    item,
                ]);
                // close dropdown
                setIsOpen(false);
                // set value to data (remove from selected)
                // setValue(
                //     valueName,
                //     prevSelected.filter(
                //         (existing_item) => existing_item._id !== item._id
                //     )
                // );
                setNewData(
                    prevSelected.filter(
                        (existing_item) => existing_item._id !== item._id
                    )
                );
                // remove from selected
                return prevSelected.filter(
                    (existing_item) => existing_item._id !== item._id
                );
            } else {
                // console.log('item not already selected');
                // remove from available
                setAvailable((prevAvailableTags) =>
                    prevAvailableTags.filter(
                        (existing_item) => existing_item._id !== item._id
                    )
                );
                // close dropdown
                setIsOpen(false);
                // set value to data
                //const newValue = [...prevSelected, item];
                //console.log('newValue', newValue);
                // setValue(valueName, [...prevSelected, item]);
                setNewData([...prevSelected, item]);
                // add to selected //
                return [...prevSelected, item];
            }
            // else return [];
        });
    };
    useOnClickOutside(ref, () => setIsOpen(false));
    // console.log('available', available.length);
    //console.log('selected', selected);
    return (
        <div className={styles['dropdown-checkboxes']} ref={ref}>
            <input
                className="input is-like-select"
                onFocus={() => setIsOpen(true)}
                placeholder={`Add ${valueName}`}
            />
            {isOpen && (
                <div className={styles['dropdown']}>
                    {available.length > 0 ? (
                        available.map((item) => (
                            <div
                                key={item._id}
                                className={styles['checkbox-wrapper']}
                            >
                                <input
                                    className={styles['checkbox']}
                                    type="checkbox"
                                    id={`item-${item._id}`}
                                    value={item._id}
                                    // checked={selected.includes(item._id)}
                                    // onChange={() => handleCheckboxChange(item._id)}
                                    onChange={() => handleCheckboxChange(item)}
                                />
                                <label htmlFor={`item-${item._id}`}>
                                    {item.name}
                                </label>
                            </div>
                        ))
                    ) : (
                        <p>None available {available.length}</p>
                    )}
                </div>
            )}
            {selected.length > 0 && (
                <div className={styles['selected-tags']}>
                    {selected.map((item) => (
                        <div key={item._id} className={styles['tag']}>
                            <span> {item.name}</span>
                            <span
                                className={styles['icon-wrapper']}
                                onClick={() => {
                                    setSelected((prevSelected) => {
                                        return prevSelected.filter(
                                            (existing_item) =>
                                                existing_item._id !== item._id
                                        );
                                    });
                                    setAvailable((prevAvailableTags) => [
                                        ...prevAvailableTags,
                                        item,
                                    ]);
                                    setValue(
                                        valueName,
                                        selected.filter(
                                            (existing_item) =>
                                                existing_item._id !== item._id
                                        )
                                    );
                                }}
                            >
                                <DeleteIcon />{' '}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
