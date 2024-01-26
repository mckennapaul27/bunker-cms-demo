import { getUrlFromString } from '../lib/utils';
import { Editor } from '@tiptap/core';
import { Check, Trash } from 'lucide-react';
import {
    Dispatch,
    FC,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from 'react';
import styles from './link-selector.module.scss';
import classNames from 'classnames';

interface LinkSelectorProps {
    editor: Editor;
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const LinkSelector: FC<LinkSelectorProps> = ({
    editor,
    isOpen,
    setIsOpen,
}) => {
    const [inputValue, setInputValue] = useState('');
    // const isOpen = true;
    const inputRef = useRef<HTMLInputElement>(null);

    // Autofocus on input by default
    useEffect(() => {
        inputRef.current && inputRef.current?.focus();
    });

    // console.log('input value', inputValue);

    return (
        <div className={styles['relative']}>
            <span
                className={styles.button}
                onClick={() => {
                    setIsOpen(!isOpen);
                }}
            >
                <span className={styles['text-base']}>↗</span>
                <span
                    className={classNames(styles['underline-decoration'], {
                        [styles['text-blue-500']]: editor.isActive('link'),
                    })}
                >
                    Link
                </span>
            </span>
            {isOpen && (
                <div className={styles['fixed-top-full']}>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Paste link"
                        className={classNames(styles.flex_1, 'input small')}
                        defaultValue={editor.getAttributes('link').href || ''}
                        style={{
                            marginBottom: '0',
                        }}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                        }}
                    />

                    {editor.getAttributes('link').href ? (
                        <>
                            <span
                                className={styles.button_red_600}
                                onClick={() => {
                                    editor.chain().focus().unsetLink().run();
                                    setIsOpen(false);
                                }}
                            >
                                <Trash className={styles.icon_size} />
                            </span>
                            <span
                                className={styles.button_stone_600}
                                onClick={(e) => {
                                    //const url = getUrlFromString(inputValue);
                                    // url &&
                                    editor
                                        .chain()
                                        .focus()
                                        .setLink({ href: inputValue })
                                        .run();
                                    setIsOpen(false);
                                }}
                            >
                                <Check className={styles.icon_size} />
                            </span>
                        </>
                    ) : (
                        <span
                            className={styles.button_stone_600}
                            onClick={(e) => {
                                //const url = getUrlFromString(inputValue);
                                // url &&
                                editor
                                    .chain()
                                    .focus()
                                    .setLink({ href: inputValue })
                                    .run();
                                setIsOpen(false);
                            }}
                        >
                            <Check className={styles.icon_size} />
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};
