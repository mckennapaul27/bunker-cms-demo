'use client';

import { StickyHeader } from '../collections/StickyHeader';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BlogValues, isDisabled } from '@/utils/form-helpers';
import { type SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { AlertSuccess } from '../notifications/AlertSuccess';
import { InputController } from '../hook-form-elements/InputController';
import styles from '../../styles/dashboard-general.module.scss';
import { TextAreaController } from '../hook-form-elements/TextAreaController';
import { TiptapEditor } from '../tiptap-editor';
import { ImageUploader } from '../elements/ImageUploader';
import { AlertWarning } from '../notifications/AlertWarning';
import { LoadingSpinnerInBtn } from '../elements/LoadingSpinnerInBtn';
import { SelectController } from '../hook-form-elements/SelectController';

export const BlogCreate = ({
    LOCAL_STORAGE_KEY,
}: {
    LOCAL_STORAGE_KEY: string;
}) => {
    const [body, setBody] = useState('');
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [authors, setAuthors] = useState<any[]>([]);
    const [image, setImage] = useState<{
        url: string | null;
        alt: string;
        width: number | null;
        height: number | null;
        public_id: string | null;
    }>({
        url: null,
        alt: '',
        width: null,
        height: null,
        public_id: null,
    });
    const {
        handleSubmit,
        formState: { errors },
        watch,
        control,
    } = useForm<BlogValues>({
        mode: 'onChange',
        reValidateMode: 'onChange',
        shouldUnregister: false,
        defaultValues: {},
    });

    const onSubmit: SubmitHandler<BlogValues> = async (data) => {
        console.log('data:', data);
        setLoading(true);
        console.log('data:', data);
        console.log('body:', body);
        console.log('image:', image);
        if (!image.url) {
            setLoading(false);
            toast(
                (t) => (
                    <AlertWarning
                        title={`Warning`}
                        description={
                            "Image is required (don't forget to click 'Confirm upload') "
                        }
                        id={t.id}
                    />
                ),
                { duration: 300000 }
            );
            return;
        }
        if (!body) {
            setLoading(false);
            toast(
                (t) => (
                    <AlertWarning
                        title={`Warning`}
                        description={'Body is required'}
                        id={t.id}
                    />
                ),
                { duration: 300000 }
            );
            return;
        }
        try {
            const res = await fetch('/api/blogs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data,
                    image,
                    body: body,
                }),
            });
            if (res.status === 201) {
                const json = await res.json();
                console.log('json:', json);
                setLoading(false);
                toast(
                    (t) => (
                        <AlertSuccess
                            title={`Success`}
                            description={`Blog was successfully created.`}
                            id={t.id}
                        />
                    ),
                    { duration: 300000 }
                );
                router.push(`/dashboard/content-manager/blog/${json.data._id}`);
            }
        } catch (error) {
            console.log('error:', error);
        }
        setLoading(false);
    };
    useEffect(() => {
        fetchBlogAuthors();
    }, []);
    const fetchBlogAuthors = async () => {
        try {
            const res = await fetch('/api/authors', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (res.status === 200) {
                const json = await res.json();
                setAuthors(json.data);
            }
        } catch (error) {
            console.log('error:', error);
        }
    };
    const disabled = isDisabled({ fields: watch(), errors });

    // console.log('authors:', authors);
    //console.log('fields: ', watch());

    return (
        <div>
            <StickyHeader>
                <div className={'sticky-header__collection-details'}>
                    <h1>Create an entry</h1>
                    <p>API: blog</p>
                </div>
                <div className={'sticky-header__buttons'}>
                    <button
                        className="button small"
                        onClick={handleSubmit(onSubmit)}
                        disabled={disabled}
                    >
                        {loading && <LoadingSpinnerInBtn />} Save
                    </button>
                </div>
            </StickyHeader>
            <div className={styles['dashboard-content-wrapper']}>
                <form>
                    <div className={styles['content-block']}>
                        <InputController
                            label="Meta Title"
                            name="metaTitle"
                            type="text"
                            control={control}
                            errors={errors}
                            rules={{
                                required: {
                                    value: true,
                                    message: 'Meta title is required',
                                },
                            }}
                        />
                        <TextAreaController
                            label="Meta Description"
                            name="metaDescription"
                            type="text"
                            control={control}
                            errors={errors}
                            rules={{
                                required: {
                                    value: true,
                                    message: 'Meta description is required',
                                },
                            }}
                        />
                    </div>
                    <div className={styles['content-block']}>
                        <InputController
                            label="Title"
                            name="title"
                            type="text"
                            control={control}
                            errors={errors}
                            rules={{
                                required: {
                                    value: true,
                                    message: 'Title is required',
                                },
                                pattern: {
                                    message: 'Title must be a string',
                                },
                            }}
                        />
                        <InputController
                            label="Slug"
                            name="slug"
                            type="text"
                            control={control}
                            errors={errors}
                            rules={{
                                required: {
                                    value: true,
                                    message: 'Slug is required',
                                },
                            }}
                        />
                        <TextAreaController
                            label="Description"
                            name="description"
                            type="text"
                            control={control}
                            errors={errors}
                            rules={{
                                required: {
                                    value: false,
                                    message: 'Description is required',
                                },
                            }}
                        />
                    </div>
                    <div className={styles['content-block']}>
                        <SelectController
                            label="Author"
                            name="author"
                            type="text"
                            control={control}
                            errors={errors}
                            rules={{
                                required: {
                                    value: false,
                                    message: 'Author is required',
                                },
                            }}
                            options={authors}
                            defaultValue={''}
                        />
                    </div>
                    <div className={styles['content-block']}>
                        <ImageUploader
                            setImage={setImage}
                            image={image}
                            setError={setError}
                            defaultValue={''} // from db
                            existingPublicId={''} // from db
                            label={'Cover Image'}
                        />
                    </div>

                    <TiptapEditor
                        storageKey={LOCAL_STORAGE_KEY}
                        setBody={setBody}
                    />
                </form>
            </div>
        </div>
    );
};
