import { Editor } from '@tiptap/core';
import {
    Check,
    ChevronDown,
    Heading1,
    Heading2,
    Heading3,
    TextQuote,
    ListOrdered,
    TextIcon,
    Code,
    CheckSquare,
} from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';
import { Dispatch, FC, SetStateAction } from 'react';
import { BubbleMenuItem } from '.';
import styles from './node-selector.module.scss';

interface NodeSelectorProps {
    editor: Editor;
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const NodeSelector: FC<NodeSelectorProps> = ({
    editor,
    isOpen,
    setIsOpen,
}) => {
    const items: BubbleMenuItem[] = [
        {
            name: 'Text',
            icon: TextIcon,
            command: () =>
                editor
                    .chain()
                    .focus()
                    .toggleNode('paragraph', 'paragraph')
                    .run(),
            // I feel like there has to be a more efficient way to do this – feel free to PR if you know how!
            isActive: () =>
                editor.isActive('paragraph') &&
                !editor.isActive('bulletList') &&
                !editor.isActive('orderedList'),
        },
        {
            name: 'Heading 1',
            icon: Heading1,
            command: () =>
                editor.chain().focus().toggleHeading({ level: 1 }).run(),
            isActive: () => editor.isActive('heading', { level: 1 }),
        },
        {
            name: 'Heading 2',
            icon: Heading2,
            command: () =>
                editor.chain().focus().toggleHeading({ level: 2 }).run(),
            isActive: () => editor.isActive('heading', { level: 2 }),
        },
        {
            name: 'Heading 3',
            icon: Heading3,
            command: () =>
                editor.chain().focus().toggleHeading({ level: 3 }).run(),
            isActive: () => editor.isActive('heading', { level: 3 }),
        },
        // {
        //     name: 'To-do List',
        //     icon: CheckSquare,
        //     command: () => editor.chain().focus().toggleTaskList().run(),
        //     isActive: () => editor.isActive('taskItem'),
        // },
        {
            name: 'Bullet List',
            icon: ListOrdered,
            command: () => editor.chain().focus().toggleBulletList().run(),
            isActive: () => editor.isActive('bulletList'),
        },
        {
            name: 'Numbered List',
            icon: ListOrdered,
            command: () => editor.chain().focus().toggleOrderedList().run(),
            isActive: () => editor.isActive('orderedList'),
        },
        {
            name: 'Quote',
            icon: TextQuote,
            command: () =>
                editor
                    .chain()
                    .focus()
                    .toggleNode('paragraph', 'paragraph')
                    .toggleBlockquote()
                    .run(),
            isActive: () => editor.isActive('blockquote'),
        },
        {
            name: 'Code',
            icon: Code,
            command: () => editor.chain().focus().toggleCodeBlock().run(),
            isActive: () => editor.isActive('codeBlock'),
        },
    ];

    const activeItem = items.filter((item) => item.isActive()).pop() ?? {
        name: 'Multiple',
    };

    return (
        <Popover.Root open={isOpen}>
            <div className={styles['relative']}>
                <Popover.Trigger
                    className={styles['trigger-button']}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span>{activeItem?.name}</span>
                    <ChevronDown className="h-4 w-4" />
                </Popover.Trigger>

                <Popover.Content
                    align="start"
                    className={styles['popover-content']}
                >
                    {items.map((item, index) => (
                        <span
                            key={index}
                            onClick={() => {
                                item.command();
                                setIsOpen(false);
                            }}
                            className={styles['button']}
                        >
                            <div className={styles['flex-center-space-X2']}>
                                <div className={styles.icon}>
                                    {' '}
                                    <item.icon />
                                </div>
                                <span>{item.name}</span>
                            </div>
                            {activeItem.name === item.name && (
                                <Check className={styles['icon-check']} />
                            )}
                        </span>
                    ))}
                </Popover.Content>
            </div>
        </Popover.Root>
    );
};
