import StarterKit from '@tiptap/starter-kit';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import TiptapLink from '@tiptap/extension-link';
import TiptapImage from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import TiptapUnderline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Markdown } from 'tiptap-markdown';
import Highlight from '@tiptap/extension-highlight';
import SlashCommand from './slash-command';
import { InputRule } from '@tiptap/core';
import { UploadImagesPlugin } from '../plugins/upload-images';
import CustomKeymap from './custom-keymap';
import DragAndDrop from './drag-and-drop';

import styles from './extensions.module.scss';
import {
    NodeViewWrapper,
    NodeViewWrapperProps,
    ReactNodeViewRenderer,
} from '@tiptap/react';

function ImageNode(props: NodeViewWrapperProps) {
    const { src, alt, width, height } = props.node.attrs;

    const onEditAlt = (newAlt: string) => {
        props.updateAttributes({ alt: newAlt });
    };
    const handleClick = (event: React.MouseEvent<HTMLInputElement>) => {
        event.stopPropagation(); // Prevents ProseMirror from taking focus
    };
    const imageInfo = document.querySelector(
        '.ProseMirror-selectednode img'
    ) as HTMLImageElement;

    return (
        <NodeViewWrapper className="relative-img">
            <img
                src={src}
                alt={alt}
                // width={width} height={height} // don't set width and height here, it will override the resizeable
            />
            <div className="absolute-input">
                <label className="label">Alt</label>
                <input
                    className="input small"
                    type="text"
                    value={alt || ''}
                    onChange={(e) => onEditAlt(e.target.value)}
                    onClick={handleClick} // Added click handler
                    placeholder="Enter alt text"
                />
            </div>
        </NodeViewWrapper>
    );
}

export const defaultExtensions = [
    StarterKit.configure({
        bulletList: {
            HTMLAttributes: {
                class: styles['list-disc-outside'],
            },
        },
        orderedList: {
            HTMLAttributes: {
                class: styles['list-decimal-outside'],
            },
        },
        listItem: {
            HTMLAttributes: {
                class: styles['list-item'],
            },
        },
        blockquote: {
            HTMLAttributes: {
                class: styles.blockquote,
            },
        },
        codeBlock: {
            HTMLAttributes: {
                class: styles['code-block'],
            },
        },
        code: {
            HTMLAttributes: {
                class: styles['inline-code'],
                spellcheck: 'false',
            },
        },
        horizontalRule: false,
        dropcursor: {
            color: '#DBEAFE',
            width: 4,
        },

        gapcursor: false,
    }),
    // patch to fix horizontal rule bug: https://github.com/ueberdosis/tiptap/pull/3859#issuecomment-1536799740
    HorizontalRule.extend({
        addInputRules() {
            return [
                new InputRule({
                    find: /^(?:---|—-|___\s|\*\*\*\s)$/,
                    handler: ({ state, range }) => {
                        const attributes = {};

                        const { tr } = state;
                        const start = range.from;
                        let end = range.to;

                        tr.insert(
                            start - 1,
                            this.type.create(attributes)
                        ).delete(tr.mapping.map(start), tr.mapping.map(end));
                    },
                }),
            ];
        },
    }).configure({
        HTMLAttributes: {
            class: styles['horizontal-rule'],
        },
    }),
    TiptapLink.configure({
        HTMLAttributes: {
            class: styles.link,
        },
    }),

    TiptapImage.extend({
        addNodeView() {
            return ReactNodeViewRenderer(ImageNode);
        },
        addProseMirrorPlugins() {
            return [UploadImagesPlugin()];
        },
        addAttributes() {
            return {
                ...this.parent?.(),
                width: {
                    default: null,
                },
                height: {
                    default: null,
                },
                public_id: {
                    default: null,
                },
            };
        },
        // addNodeView() {
        //     return () => {
        //         const container = document.createElement('div');

        //         container.addEventListener('click', (event) => {
        //             alert('clicked on the container');
        //         });

        //         const content = document.createElement('div');
        //         container.append(content);

        //         return {
        //             dom: container,
        //             contentDOM: content,
        //         };
        //     };
        // },
    }).configure({
        allowBase64: true,
        HTMLAttributes: {
            class: styles.image,
        },
    }),
    Placeholder.configure({
        placeholder: ({ node }) => {
            if (node.type.name === 'heading') {
                return `Heading ${node.attrs.level}`;
            }
            return "Press '/' for commands...";
        },
        includeChildren: true,
    }),
    SlashCommand,
    TiptapUnderline,
    TextStyle,
    Color,
    Highlight.configure({
        multicolor: true,
    }),
    Markdown.configure({
        html: false,
        transformCopiedText: true,
        transformPastedText: true,
    }),
    CustomKeymap,
    DragAndDrop,
];
