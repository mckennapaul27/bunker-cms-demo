'use client';
import { StickyHeader } from '../collections/StickyHeader';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    BlogValues,
    hasBodyChanged,
    hasImageChanged,
    haveFieldsChanged,
    isDisabled,
} from '@/utils/form-helpers';
import { type SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { AlertSuccess } from '../notifications/AlertSuccess';
import { InputController } from '../hook-form-elements/InputController';
import styles from '../../styles/dashboard-general.module.scss';
import { TextAreaController } from '../hook-form-elements/TextAreaController';
import { TiptapEditor } from '../tiptap-editor';
import { ImageUploader } from '../elements/ImageUploader';
import { LoadingSpinnerInBtn } from '../elements/LoadingSpinnerInBtn';
import { AlertWarning } from '../notifications/AlertWarning';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { SelectController } from '../hook-form-elements/SelectController';
import {
    DropdownCheckboxes,
    type DataType,
} from '../hook-form-elements/DropdownCheckboxes';
// import isEqual from 'lodash.isequal';

export const BlogUpdate = ({
    id,
    data,
    LOCAL_STORAGE_KEY,
}: {
    id: string;
    data: {
        metaTitle: string;
        metaDescription: string;
        title: string;
        slug: string;
        description: string;
        image: {
            url: string | null;
            alt: string | null;
            width: number | null;
            height: number | null;
            public_id: string | null;
        };
        body: string;
        tags: string[];
        author: {
            name: string;
            author_id: string;
        };
        category: {
            name: string;
            category_id: string;
        };
        status: string;
    };
    LOCAL_STORAGE_KEY: string;
}) => {
    //console.log('data:', data);
    const router = useRouter();
    const pathname = usePathname();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [publishLoading, setPublishLoading] = useState(false);
    const [authors, setAuthors] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [tags, setTags] = useState<any[]>([]);
    const [autoSave, setAutoSave] = useState(false);
    const [autoSaveTime, setAutoSaveTime] = useState('');
    const [image, setImage] = useState<{
        url: string | null;
        alt: string;
        width: number | null;
        height: number | null;
        public_id: string | null;
    }>({
        url: data?.image?.url || null,
        alt: data?.image?.alt || '',
        width: data?.image?.width || null,
        height: data?.image?.height || null,
        public_id: data?.image?.public_id || null,
    });
    const [body, setBody] = useState(data.body || '');
    const [version, setVersion] = useState(0);
    const [hasChanged, setHasChanged] = useState(false);
    const {
        handleSubmit,
        formState: { errors },
        watch,
        control,
        setValue,
    } = useForm<BlogValues>({
        mode: 'onChange',
        reValidateMode: 'onChange',
        shouldUnregister: false,
        defaultValues: {
            metaTitle: data.metaTitle || '',
            metaDescription: data.metaDescription || '',
            title: data.title || '',
            slug: data.slug || '',
            description: data.description || '',
            tags: data.tags || [],
            // author: data.author || '',
            // category: data.category || '',
        },
    });

    const onSubmit: SubmitHandler<BlogValues> = async (data) => {
        setLoading(true);
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
        //  console.log('submitted data:', data);
        try {
            const res = await fetch(`/api/blogs/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data,
                    image,
                    body: body,
                }),
            });
            if (res.status === 200) {
                setLoading(false);
                toast(
                    (t) => (
                        <AlertSuccess
                            title={`Success`}
                            description={`Blog was successfully updated.`}
                            id={t.id}
                        />
                    ),
                    { duration: 300000 }
                );
                setVersion(version + 1);
                checkForChanges();
                router.replace(pathname + `?version=${version + 1}`);
            }
        } catch (error) {
            console.log('error:', error);
        }
        setLoading(false);
    };
    const changeStatus = async (status: string) => {
        setPublishLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        try {
            const res = await fetch(`/api/blogs/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: status,
                }),
            });
            const json = await res.json();
            if (res.status === 200) {
                setPublishLoading(false);
                toast(
                    (t) => (
                        <AlertSuccess
                            title={`Success`}
                            description={`Blog was successfully updated`}
                            id={t.id}
                        />
                    ),
                    { duration: 300000 }
                );
                setVersion(version + 1);
                router.replace(pathname + `?version=${version + 1}`);
            }
        } catch (error) {
            console.log('error:', error);
        }
        setPublishLoading(false);
    };
    const autoSaveBody = async (body: string) => {
        try {
            const res = await fetch(`/api/blogs/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    body: body,
                }),
            });
            if (res.status === 200) {
                const timeNow = dayjs().format('HH:mm:ss');
                setAutoSave(true);
                setAutoSaveTime(timeNow);
                // setVersion(version + 1);
                // router.replace(pathname + `?version=${version + 1}`);
            }
        } catch (error) {
            console.log('error:', error);
        }
    };
    useEffect(() => {
        fetchBlogAuthors();
        fetchBlogCategories();
        fetchBlogTags();
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
    const fetchBlogCategories = async () => {
        try {
            const res = await fetch('/api/categories', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (res.status === 200) {
                const json = await res.json();
                setCategories(json.data);
            }
        } catch (error) {
            console.log('error:', error);
        }
    };
    const fetchBlogTags = async () => {
        try {
            const res = await fetch('/api/tags', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (res.status === 200) {
                const json = await res.json();
                setTags(
                    json.data.map((a: DataType) => ({
                        name: a.name,
                        _id: a._id,
                    }))
                );
            }
        } catch (error) {
            console.log('error:', error);
        }
    };
    const disabled =
        isDisabled({ fields: watch(), errors }) ||
        !image.url ||
        !body ||
        !hasChanged;

    // useEffect to check if fields have changed that calls checkForChanges function
    useEffect(() => {
        //console.log('fields have changed', haveFieldsChanged(data, watch()));
        //console.log('body has changed', hasBodyChanged(body, data.body));
        //console.log('image has changed', hasImageChanged(image, data.image));
        checkForChanges();
    }, [body, image, watch()]);

    // function to check if fields have changed
    const checkForChanges = () => {
        if (
            haveFieldsChanged(data, watch()) === true ||
            hasBodyChanged(body, data.body) === true ||
            hasImageChanged(image, data.image) === true
        ) {
            setHasChanged(true);
        } else {
            setHasChanged(false);
        }
    };
    console.log('fields:', watch());
    return (
        <div>
            <StickyHeader>
                <div className={'sticky-header__collection-details'}>
                    <h1 className={styles['sticky-header__title']}>
                        Edit Blog
                        <span
                            className={classNames(
                                styles['tag_status'],
                                data.status === 'published'
                                    ? styles['success']
                                    : styles['normal']
                            )}
                        >
                            {data.status}
                        </span>
                    </h1>
                    <p>ID: {id}</p>
                </div>
                <div className={'sticky-header__buttons'}>
                    {autoSave && autoSaveTime !== '' && (
                        <p className="sticky-header__autosave">
                            Autosaved: {autoSaveTime}
                        </p>
                    )}
                    <button
                        className="button inverted small"
                        onClick={() =>
                            changeStatus(
                                data.status === 'draft' ? 'published' : 'draft'
                            )
                        }
                    >
                        {publishLoading && <LoadingSpinnerInBtn />}{' '}
                        {data.status === 'draft' ? 'Publish' : 'Unpublish'}
                    </button>
                    <button
                        className="button small"
                        onClick={handleSubmit(onSubmit)}
                        disabled={disabled}
                        type="submit"
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
                            defaultValue={data.metaTitle || ''}
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
                            defaultValue={data.metaDescription || ''}
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
                            defaultValue={data.title || ''}
                            rules={{
                                required: {
                                    value: true,
                                    message: 'Name is required',
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
                            defaultValue={data.slug || ''}
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
                            defaultValue={data.description || ''}
                            rules={{
                                required: {
                                    value: true,
                                    message: 'Meta description is required',
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
                            defaultValue={data.author?.author_id || ''}
                        />
                    </div>
                    <div className={styles['content-block']}>
                        <SelectController
                            label="Category"
                            name="category"
                            type="text"
                            control={control}
                            errors={errors}
                            rules={{
                                required: {
                                    value: false,
                                    message: 'Category is required',
                                },
                            }}
                            options={categories}
                            defaultValue={data.category?.category_id || ''}
                        />
                    </div>
                    <div className={styles['content-block']}>
                        <DropdownCheckboxes
                            allData={tags}
                            existing={data.tags ? data.tags : []}
                            setValue={setValue}
                        />
                    </div>
                    <div className={styles['content-block']}>
                        <ImageUploader
                            setImage={setImage}
                            image={image}
                            setError={setError}
                            defaultValue={data?.image?.url || ''} // from db
                            existingPublicId={data?.image?.public_id || ''} // from db
                            label={'Cover Image'}
                        />
                    </div>

                    <TiptapEditor
                        storageKey={LOCAL_STORAGE_KEY}
                        defaultContent={JSON.parse(data.body) || ''}
                        setBody={setBody}
                        autoSaveBody={autoSaveBody}
                        formDisabled={disabled}
                    />
                </form>
            </div>
        </div>
    );
};
