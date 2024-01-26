import { toast } from 'sonner';
import { EditorState, Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet, EditorView } from '@tiptap/pm/view';
import { sanitizeFileName } from '@/utils/image-helpers';

const uploadKey = new PluginKey('upload-image');

interface ImageObject {
    url: string;
    public_id: string;
    width: number;
    height: number;
}

type UploadResult = ImageObject | File;

export const UploadImagesPlugin = () =>
    new Plugin({
        key: uploadKey,
        state: {
            init() {
                return DecorationSet.empty;
            },
            apply(tr, set) {
                set = set.map(tr.mapping, tr.doc);
                // See if the transaction adds or removes any placeholders
                const action = tr.getMeta(this as any);
                if (action && action.add) {
                    const { id, pos, src } = action.add;

                    const placeholder = document.createElement('div');
                    placeholder.setAttribute('class', 'img-placeholder');
                    const image = document.createElement('img');
                    // image.setAttribute(
                    //     'class',
                    //     'opacity-40 rounded-lg border border-stone-200'
                    // );
                    image.src = src;
                    placeholder.appendChild(image);
                    const deco = Decoration.widget(pos + 1, placeholder, {
                        id,
                    });
                    set = set.add(tr.doc, [deco]);
                } else if (action && action.remove) {
                    set = set.remove(
                        set.find(
                            null as any,
                            null as any,
                            (spec) => spec.id == action.remove.id
                        )
                    );
                }
                return set;
            },
        },
        props: {
            decorations(state) {
                return this.getState(state);
            },
        },
    });

function findPlaceholder(state: EditorState, id: {}) {
    const decos = uploadKey.getState(state);
    const found = decos.find(null, null, (spec: any) => spec.id == id);
    return found.length ? found[0].from : null;
}

export function startImageUpload(file: File, view: EditorView, pos: number) {
    // check if the file is an image
    console.log('file in startImageUpload:', file);
    if (!file.type.includes('image/')) {
        toast.error('File type not supported.');
        return;

        // check if the file size is less than 20MB
    } else if (file.size / 1024 / 1024 > 20) {
        toast.error('File size too big (max 20MB).');
        return;
    }

    // A fresh object to act as the ID for this upload
    const id = {};

    // Replace the selection with a placeholder
    const tr = view.state.tr;
    if (!tr.selection.empty) tr.deleteSelection();

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        tr.setMeta(uploadKey, {
            add: {
                id,
                pos,
                src: reader.result,
            },
        });
        view.dispatch(tr);
    };

    handleImageUpload(file).then((uploadResult: UploadResult) => {
        const { schema } = view.state;
        // Check the type of uploadResult
        if ('url' in uploadResult) {
            let pos = findPlaceholder(view.state, id);
            // If the content around the placeholder has been deleted, drop
            // the image
            if (pos == null) return;

            // Otherwise, insert it at the placeholder's position, and remove
            // the placeholder
            const node = schema.nodes.image.create({
                src: uploadResult.url,
                alt: '',
                title: '',
                width: uploadResult.width,
                height: uploadResult.height,
                public_id: uploadResult.public_id,
            });
            const transaction = view.state.tr
                .replaceWith(pos, pos, node)
                .setMeta(uploadKey, { remove: { id } });
            view.dispatch(transaction);
        } else {
            return;
        }
    });
}

// using cloudinary
export const handleImageUpload = (file: File): Promise<UploadResult> => {
    // upload to Cloudinary
    return new Promise((resolve) => {
        toast.promise(
            fetch(
                `/api/upload/cloudinary?public_id=${sanitizeFileName(
                    file.name
                )}`,
                {
                    method: 'POST',
                    headers: {
                        'content-type':
                            file?.type || 'application/octet-stream',
                    },
                    body: file,
                }
            ).then(async (res) => {
                // Successfully uploaded image
                if (res.ok) {
                    // const { url } = (await res.json()) as BlobResult;
                    const json = await res.json();
                    const { url, public_id, width, height } = json;
                    // preload the image
                    let image = new Image(width, height);
                    image.src = url;
                    image.onload = () => {
                        // resolve(url);
                        resolve({ url, public_id, width, height });
                    };

                    // window.alert('Image uploaded successfully.');
                    // No blob store configured
                } else if (res.status === 401) {
                    console.log(
                        'file in handleImageUpload after /api/upload/cloudinary:',
                        file
                    );
                    resolve(file);

                    throw new Error(
                        '`BLOB_READ_WRITE_TOKEN` environment variable not found, reading image locally instead.'
                    );
                    // Unknown error
                } else {
                    throw new Error(`Error uploading image. Please try again.`);
                }
            }),
            {
                loading: 'Uploading image...',
                success: 'Image uploaded successfully.',
                error: (e) => e.message,
            }
        );
    });
};
