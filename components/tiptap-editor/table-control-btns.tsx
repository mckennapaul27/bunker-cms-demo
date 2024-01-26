'use client';

import { useState } from 'react';
import { type Editor as EditorClass, type Extensions } from '@tiptap/core';
import styles from './index.module.scss';
import { DeleteIcon, PlusCircle, Trash } from 'lucide-react';

export const Buttons = ({
    editor,
    tableControlsPosition,
}: {
    editor: EditorClass | null;
    tableControlsPosition: {
        top: number;
        left: number;
        right: number;
    };
}) => {
    const [isActive, setIsActive] = useState(false);
    if (!editor) return null;
    if (!isActive) {
        return (
            <span
                className={styles['table-drag-handle']}
                style={{
                    top: `${tableControlsPosition.top}px`,
                    left: `${tableControlsPosition.left}px`,
                }}
                onClick={() => setIsActive(true)}
            ></span>
        );
    }
    return (
        <div
            className={styles['table-control-buttons']}
            style={{
                top: `${tableControlsPosition.top - 60}px`,
                left: `${tableControlsPosition.left}px`,
            }}
        >
            <span onClick={() => setIsActive(false)} className={styles['btn']}>
                <DeleteIcon className={styles['button-control-icon']} />
            </span>
            <span
                onClick={() => editor.chain().focus().addColumnBefore().run()}
                className={styles['btn']}
            >
                <PlusCircle className={styles['button-control-icon']} />
                <span>Column Before</span>
            </span>
            <span
                onClick={() => editor.chain().focus().addColumnAfter().run()}
                className={styles['btn']}
            >
                <PlusCircle className={styles['button-control-icon']} />
                <span>Column After</span>
            </span>
            <span
                onClick={() => editor.chain().focus().deleteColumn().run()}
                className={styles['btn']}
            >
                <Trash className={styles['button-control-icon']} />
                <span>Column</span>
            </span>
            <span
                onClick={() => editor.chain().focus().addRowBefore().run()}
                className={styles['btn']}
            >
                <PlusCircle className={styles['button-control-icon']} />
                <span>Row Before</span>
            </span>
            <span
                onClick={() => editor.chain().focus().addRowAfter().run()}
                className={styles['btn']}
            >
                <PlusCircle className={styles['button-control-icon']} />
                <span>Row After</span>
            </span>
            <span
                onClick={() => editor.chain().focus().deleteRow().run()}
                className={styles['btn']}
            >
                <Trash className={styles['button-control-icon']} />
                <span>Row</span>
            </span>
            <span
                onClick={() => editor.chain().focus().deleteTable().run()}
                className={styles['btn']}
            >
                <Trash className={styles['button-control-icon']} />
                <span>Table</span>
            </span>

            {/* <span
                onClick={() =>
                    editor
                        .chain()
                        .focus()
                        .insertTable({
                            rows: 3,
                            cols: 3,
                            withHeaderRow: true,
                        })
                        .run()
                }
            >
                insertTable
            </span>
            
            <span onClick={() => editor.chain().focus().mergeCells().run()}>
                mergeCells
            </span>
            <span onClick={() => editor.chain().focus().splitCell().run()}>
                splitCell
            </span>
            <span
                onClick={() =>
                    editor.chain().focus().toggleHeaderColumn().run()
                }
            >
                toggleHeaderColumn
            </span>
            <span
                onClick={() => editor.chain().focus().toggleHeaderRow().run()}
            >
                toggleHeaderRow
            </span>
            <span
                onClick={() => editor.chain().focus().toggleHeaderCell().run()}
            >
                toggleHeaderCell
            </span>
            <span onClick={() => editor.chain().focus().mergeOrSplit().run()}>
                mergeOrSplit
            </span>
            <span
                onClick={() =>
                    editor.chain().focus().setCellAttribute('colspan', 2).run()
                }
            >
                setCellAttribute
            </span>
            <span onClick={() => editor.chain().focus().fixTables().run()}>
                fixTables
            </span>
            <span onClick={() => editor.chain().focus().goToNextCell().run()}>
                goToNextCell
            </span>
            <span
                onClick={() => editor.chain().focus().goToPreviousCell().run()}
            >
                goToPreviousCell
            </span> */}
        </div>
    );
};
