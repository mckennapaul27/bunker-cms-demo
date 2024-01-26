import { BubbleMenu, BubbleMenuProps, isNodeSelection } from '@tiptap/react';
import { FC, useState } from 'react';
import {
    BoldIcon,
    ItalicIcon,
    UnderlineIcon,
    StrikethroughIcon,
    CodeIcon,
} from 'lucide-react';
import { NodeSelector } from './node-selector';
import { ColorSelector } from './color-selector';
import { LinkSelector } from './link-selector';
import styles from './index.module.scss';
import { Editor } from '@tiptap/core';

export interface BubbleMenuItem {
    name: string;
    isActive: () => boolean;
    command: () => void;
    icon: typeof BoldIcon;
}

type EditorBubbleMenuProps = Omit<BubbleMenuProps, 'children'> & {
    editor: Editor;
};

export const EditorBubbleMenu: FC<EditorBubbleMenuProps> = (props) => {
    const items: BubbleMenuItem[] = [
        {
            name: 'bold',
            isActive: () => props.editor.isActive('bold'),
            command: () => props.editor.chain().focus().toggleBold().run(),
            icon: BoldIcon,
        },
        {
            name: 'italic',
            isActive: () => props.editor.isActive('italic'),
            command: () => props.editor.chain().focus().toggleItalic().run(),
            icon: ItalicIcon,
        },
        {
            name: 'underline',
            isActive: () => props.editor.isActive('underline'),
            command: () => props.editor.chain().focus().toggleUnderline().run(),
            icon: UnderlineIcon,
        },
        {
            name: 'strike',
            isActive: () => props.editor.isActive('strike'),
            command: () => props.editor.chain().focus().toggleStrike().run(),
            icon: StrikethroughIcon,
        },
        {
            name: 'code',
            isActive: () => props.editor.isActive('code'),
            command: () => props.editor.chain().focus().toggleCode().run(),
            icon: CodeIcon,
        },
    ];

    const bubbleMenuProps: EditorBubbleMenuProps = {
        ...props,
        shouldShow: ({ state, editor }) => {
            const { selection } = state;
            const { empty } = selection;
            // don't show bubble menu if:
            // - the selected node is an image
            // - the selection is empty
            // - the selection is a node selection (for drag handles)
            if (
                editor.isActive('image') ||
                empty ||
                isNodeSelection(selection)
            ) {
                return false;
            }
            return true;
        },
        tippyOptions: {
            moveTransition: 'transform 0.15s ease-out',
            onHidden: () => {
                setIsNodeSelectorOpen(false);
                setIsColorSelectorOpen(false);
                setIsLinkSelectorOpen(false);
            },
        },
    };

    const [isNodeSelectorOpen, setIsNodeSelectorOpen] = useState(false);
    const [isColorSelectorOpen, setIsColorSelectorOpen] = useState(false);
    const [isLinkSelectorOpen, setIsLinkSelectorOpen] = useState(false);

    return (
        <BubbleMenu {...bubbleMenuProps} className={styles.bubbleMenu}>
            <NodeSelector
                editor={props.editor}
                isOpen={isNodeSelectorOpen}
                setIsOpen={() => {
                    setIsNodeSelectorOpen(!isNodeSelectorOpen);
                    setIsColorSelectorOpen(false);
                    setIsLinkSelectorOpen(false);
                }}
            />
            <LinkSelector
                editor={props.editor}
                isOpen={isLinkSelectorOpen}
                setIsOpen={() => {
                    setIsLinkSelectorOpen(!isLinkSelectorOpen);
                    setIsColorSelectorOpen(false);
                    setIsNodeSelectorOpen(false);
                }}
            />
            <div className={styles.flex}>
                {items.map((item, index) => (
                    <span
                        key={index}
                        onClick={item.command}
                        className={styles.button}
                    >
                        <item.icon
                            className={`${styles.icon} ${
                                item.isActive() ? styles.iconActive : ''
                            }`}
                        />
                    </span>
                ))}
            </div>
            <ColorSelector
                editor={props.editor}
                isOpen={isColorSelectorOpen}
                setIsOpen={() => {
                    setIsColorSelectorOpen(!isColorSelectorOpen);
                    setIsNodeSelectorOpen(false);
                    setIsLinkSelectorOpen(false);
                }}
            />
        </BubbleMenu>
    );
};
