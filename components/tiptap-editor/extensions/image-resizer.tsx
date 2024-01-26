import Moveable from 'react-moveable';
import { type Editor as EditorClass } from '@tiptap/core';
import { useEffect, useRef, useState } from 'react';

interface CustomImageAttributes {
    src: string;
    alt?: string;
    width?: number;
    height?: number;
}

export const ImageResizer = ({ editor }: { editor: EditorClass }) => {
    const [size, setSize] = useState({ width: 0, height: 0 });

    const updateMediaSize = () => {
        const imageInfo = document.querySelector(
            '.ProseMirror-selectednode img'
        ) as HTMLImageElement;
        if (imageInfo) {
            const selection = editor.state.selection;
            editor.commands.setImage({
                src: imageInfo.src,
                alt: imageInfo.alt,
                width: Number(imageInfo.style.width.replace('px', '')),
                height: Number(imageInfo.style.height.replace('px', '')),
            } as CustomImageAttributes);
            editor.commands.setNodeSelection(selection.from);
        }
    };

    return (
        <>
            <Moveable
                target={
                    document.querySelector(
                        '.ProseMirror-selectednode img'
                    ) as any
                }
                container={null}
                origin={false}
                /* Resize event edges */
                edge={false}
                throttleDrag={0}
                /* When resize or scale, keeps a ratio of the width, height. */
                keepRatio={true}
                /* resizable*/
                /* Only one of resizable, scalable, warpable can be used. */
                resizable={true}
                throttleResize={0}
                onResize={({
                    target,
                    width,
                    height,
                    // dist,
                    delta,
                }: any) => {
                    console.log('target: ', target);
                    console.log('width: ', width);
                    console.log('height: ', height);
                    delta[0] && (target!.style.width = `${width}px`);
                    delta[1] && (target!.style.height = `${height}px`);
                    setSize({ width, height });
                }} // direction,
                // clientX,
                // clientY,

                // { target, isDrag, clientX, clientY }: any
                onResizeEnd={() => {
                    updateMediaSize();
                }}
                /* scalable */
                /* Only one of resizable, scalable, warpable can be used. */
                scalable={true}
                throttleScale={0}
                /* Set the direction of resizable */
                renderDirections={['w', 'e']}
                onScale={({
                    target,
                    // scale,
                    // dist,
                    // delta,
                    transform,
                }: any) => {
                    target!.style.transform = transform;
                }} // clientX,
                // clientY,
            />
            <div
                style={{
                    position: 'fixed',
                    width: 'fit-content',
                    top: '80px',
                    right: '75px',
                    backgroundColor: '#eaeaea',
                    color: '#000',
                    padding: '4px 12px',
                    borderRadius: '4px',
                    fontSize: '15px',
                    fontWeight: 'medium',
                    zIndex: 100,
                }}
            >
                {`W: ${size.width.toFixed(2)} px | H: ${size.height.toFixed(
                    2
                )} px`}
            </div>
        </>
    );
};
