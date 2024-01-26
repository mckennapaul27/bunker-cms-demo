import { Editor } from '@tiptap/core';
import { Check, ChevronDown } from 'lucide-react';
import { Dispatch, FC, SetStateAction } from 'react';
import * as Popover from '@radix-ui/react-popover';
import styles from './color-selector.module.scss';

export interface BubbleColorMenuItem {
    name: string;
    color: string;
}

interface ColorSelectorProps {
    editor: Editor;
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const TEXT_COLORS: BubbleColorMenuItem[] = [
    {
        name: 'Default',
        color: '#A8A29E',
    },
    {
        name: 'Purple',
        color: '#9333EA',
    },
    {
        name: 'Red',
        color: '#E00000',
    },
    {
        name: 'Yellow',
        color: '#EAB308',
    },
    {
        name: 'Blue',
        color: '#2563EB',
    },
    {
        name: 'Green',
        color: '#008A00',
    },
    {
        name: 'Orange',
        color: '#FFA500',
    },
    {
        name: 'Pink',
        color: '#BA4081',
    },
    {
        name: 'Gray',
        color: '#A8A29E',
    },
];

const HIGHLIGHT_COLORS: BubbleColorMenuItem[] = [
    {
        name: 'Default',
        color: '#A8A29E',
    },
    {
        name: 'Purple',
        color: '#9333EA',
    },
    {
        name: 'Red',
        color: '#E00000',
    },
    {
        name: 'Yellow',
        color: '#EAB308',
    },
    {
        name: 'Blue',
        color: '#2563EB',
    },
    {
        name: 'Green',
        color: '#008A00',
    },
    {
        name: 'Orange',
        color: '#FFA500',
    },
    {
        name: 'Pink',
        color: '#BA4081',
    },
    {
        name: 'Gray',
        color: '#A8A29E',
    },
];

export const ColorSelector: FC<ColorSelectorProps> = ({
    editor,
    isOpen,
    setIsOpen,
}) => {
    const activeColorItem = TEXT_COLORS.find(({ color }) =>
        editor.isActive('textStyle', { color })
    );

    const activeHighlightItem = HIGHLIGHT_COLORS.find(({ color }) =>
        editor.isActive('highlight', { color })
    );

    return (
        <Popover.Root open={isOpen}>
            <div className={styles['relative-full']}>
                <Popover.Trigger
                    className={styles.trigger}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span
                        className={styles['rounded-px']}
                        style={{
                            color: activeColorItem?.color,
                            backgroundColor: activeHighlightItem?.color,
                        }}
                    >
                        A
                    </span>

                    <ChevronDown className={styles['trigger-icon']} />
                </Popover.Trigger>

                <Popover.Content
                    align="start"
                    className={styles['popover-content']}
                >
                    <div className={styles['text-title']}>Color</div>
                    {TEXT_COLORS.map(({ name, color }, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                editor.commands.unsetColor();
                                name !== 'Default' &&
                                    editor
                                        .chain()
                                        .focus()
                                        .setColor(color || '')
                                        .run();
                                setIsOpen(false);
                            }}
                            className={styles['flex-center-justify-between']}
                            type="button"
                        >
                            <div className={styles['flex-center-space-x-2']}>
                                <div
                                    className={styles['rounded-border']}
                                    style={{ color }}
                                >
                                    A
                                </div>
                                <span>{name}</span>
                            </div>
                            {editor.isActive('textStyle', { color }) && (
                                <Check className={styles['icon-size']} />
                            )}
                        </button>
                    ))}

                    <div
                        className={`${styles['text-title']} ${styles['margin-top']}`}
                    >
                        Background
                    </div>

                    {HIGHLIGHT_COLORS.map(({ name, color }, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                editor.commands.unsetHighlight();
                                name !== 'Default' &&
                                    editor.commands.setHighlight({ color });
                                setIsOpen(false);
                            }}
                            className={styles['flex-center-justify-between']}
                            type="button"
                        >
                            <div className={styles['flex-center-space-x-2']}>
                                <div
                                    className={styles['rounded-border']}
                                    style={{ backgroundColor: color }}
                                >
                                    A
                                </div>
                                <span>{name}</span>
                            </div>
                            {editor.isActive('highlight', { color }) && (
                                <Check className="" />
                            )}
                        </button>
                    ))}
                </Popover.Content>
            </div>
        </Popover.Root>
    );
};
