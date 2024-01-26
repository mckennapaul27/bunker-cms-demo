'use client';

import { useEffect, useState } from 'react';
import { useEditor, EditorContent, JSONContent } from '@tiptap/react';
import { defaultEditorProps } from './props';
import { defaultExtensions } from './extensions';
import useLocalStorage from './lib/use-local-storage';
import { useDebouncedCallback } from 'use-debounce';
import { defaultEditorContent } from './default-content';
import { EditorBubbleMenu } from './bubble-menu';
import { ImageResizer } from './extensions/image-resizer';
import { EditorProps } from '@tiptap/pm/view';
import { type Editor as EditorClass, type Extensions } from '@tiptap/core';
import styles from './index.module.scss';
import Table from '@tiptap/extension-table';
import { TableSelectionPlugin } from './plugins/table-selection';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { Buttons } from './table-control-btns';

export const TiptapEditor = ({
    defaultContent,
    extensions = [],
    editorProps = {},
    customUpdateFunction = () => {},
    setBody,
    onDebouncedUpdate = () => {},
    debounceDuration = 5000,
    storageKey = 'default__content',
    disableLocalStorage = false,
    formDisabled,
    autoSaveBody,
}: {
    defaultContent?: JSONContent | string;
    extensions?: Extensions;
    editorProps?: EditorProps;
    customUpdateFunction?: (editor?: EditorClass) => void | Promise<void>;
    setBody: (body: string) => void | Promise<void>;
    onDebouncedUpdate?: (editor?: EditorClass) => void | Promise<void>;
    debounceDuration?: number;
    storageKey?: string;
    disableLocalStorage?: boolean;
    formDisabled?: boolean;
    autoSaveBody?: (body: string) => void | Promise<void>;
}) => {
    const [content, setContent] = useLocalStorage(storageKey, defaultContent);
    const [hydrated, setHydrated] = useState(false);
    const [isInTable, setIsInTable] = useState(false);
    const [tableControlsPosition, setTableControlsPosition] = useState({
        top: 0,
        left: 0,
        right: 0,
    });

    const debouncedUpdates = useDebouncedCallback(async ({ editor }) => {
        const json = editor.getJSON();
        onDebouncedUpdate(editor);

        if (!disableLocalStorage) {
            // console.log('json:', json);
            console.log('debouncedUpdates has been called');
            // console.log('json in debouncedUpdates: ', json);
            // setContent(json);
            // setBody(JSON.stringify(json));
            // commented out below as it was saving the body without other fields which was causing issues
            // formDisabled === false &&
            //     autoSaveBody &&
            //     autoSaveBody(JSON.stringify(json));
        }
    }, debounceDuration);

    const updateTableControlsPosition = () => {
        const selection = document.getSelection();
        if (selection && selection.rangeCount > 0) {
            let range = selection.getRangeAt(0);
            let rect;

            if (range.collapsed) {
                let parentCell = range.startContainer;
                while (
                    parentCell &&
                    parentCell.nodeName !== 'TD' &&
                    parentCell.nodeName !== 'TH' &&
                    parentCell.parentNode
                ) {
                    parentCell = parentCell.parentNode;
                }
                if (parentCell instanceof HTMLElement) {
                    //  console.log('parentCell:', parentCell);
                    rect = parentCell.getBoundingClientRect();
                }
            } else {
                rect = range.getBoundingClientRect();
            }

            if (rect) {
                setTableControlsPosition({
                    top: rect.top + window.scrollY,
                    left: rect.left + window.scrollX,
                    right: rect.right + window.scrollX,
                });
            }
        }
    };

    const tableExtension = [
        Table.extend({
            addProseMirrorPlugins() {
                return [
                    TableSelectionPlugin(
                        setIsInTable,
                        updateTableControlsPosition
                    ),
                ];
            },
        }).configure({
            // resizable: true,
            allowTableNodeSelection: true,
            HTMLAttributes: {
                // class: 't',
            },
        }),
        TableRow,
        TableCell,
        TableHeader,
    ];

    const editor = useEditor({
        extensions: [...defaultExtensions, ...extensions, ...tableExtension], // probably don't need 'extensions' here as anything we need should be in defaultExtensions
        editorProps: {
            ...defaultEditorProps, // probably don't need 'editorProps' here as anything we need should be in defaultEditorProps
            ...editorProps,
            //
        },
        onUpdate: (e) => {
            //// console.log('e:', e);
            console.log('onUpdate has been called');
            customUpdateFunction(e.editor); // custom function which is passed in as a prop. Could be used to manually set value from a prop function like setBody or something
            debouncedUpdates(e); // just sets JSON in local storage but debounced
            const json = e.editor.getJSON();
            setBody(JSON.stringify(json));
        },
        // autofocus: 'end',
    });

    useEffect(() => {
        if (!editor || hydrated) return;

        // const value = disableLocalStorage ? defaultContent : content;
        const value = defaultContent;

        if (value) {
            editor.commands.setContent(value);
            setHydrated(true);
        }
    }, [
        editor,
        defaultContent,
        //  content,
        hydrated,
        disableLocalStorage,
    ]);

    return (
        <>
            <div
                onClick={() => {
                    editor?.chain().focus().run();
                }}
                className={styles['editor-wrapper']}
            >
                <label className="label">Body</label>
                {editor && <EditorBubbleMenu editor={editor} />}
                {editor?.isActive('image') && (
                    <>
                        <ImageResizer editor={editor} />
                        <p style={{}}>Cunt</p>
                    </>
                )}

                {isInTable && (
                    <Buttons
                        editor={editor}
                        tableControlsPosition={tableControlsPosition}
                    />
                )}
                <div className={styles['editor-container']}>
                    <EditorContent editor={editor} />
                </div>
            </div>
        </>
    );
};
