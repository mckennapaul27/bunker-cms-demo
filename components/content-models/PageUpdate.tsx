'use client';
import { StickyHeader } from '../collections/StickyHeader';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    PageValues,
    isDisabled,
    hasBodyChanged,
    haveFieldsChanged,
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

export const PageUpdate = ({
    id,
    data,
    LOCAL_STORAGE_KEY,
}: {
    id: string;
    data: {
        metaTitle: string;
        metaDescription: string;
        slug: string;
        body: string;
        status: string;
    };
    LOCAL_STORAGE_KEY: string;
}) => {
    const router = useRouter();
    const pathname = usePathname();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [publishLoading, setPublishLoading] = useState(false);
    const [autoSave, setAutoSave] = useState(false);
    const [autoSaveTime, setAutoSaveTime] = useState('');
    const [body, setBody] = useState(data.body || '');
    const [version, setVersion] = useState(0);
    const [hasChanged, setHasChanged] = useState(false);
    const {
        handleSubmit,
        formState: { errors },
        watch,
        control,
        setValue,
    } = useForm<PageValues>({
        mode: 'onChange',
        reValidateMode: 'onChange',
        shouldUnregister: false,
        defaultValues: {
            metaTitle: data.metaTitle || '',
            metaDescription: data.metaDescription || '',
            slug: data.slug || '',
        },
    });

    const onSubmit: SubmitHandler<PageValues> = async (data) => {
        setLoading(true);

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
            const res = await fetch(`/api/pages/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data,
                    body: body,
                }),
            });
            if (res.status === 200) {
                setLoading(false);
                toast(
                    (t) => (
                        <AlertSuccess
                            title={`Success`}
                            description={`Page was successfully updated.`}
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
            const res = await fetch(`/api/pages/${id}`, {
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
                            description={`Page was successfully updated`}
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
            const res = await fetch(`/api/pages/${id}`, {
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
            }
        } catch (error) {
            console.log('error:', error);
        }
    };
    const disabled =
        isDisabled({ fields: watch(), errors }) || !body || !hasChanged;
    useEffect(() => {
        checkForChanges();
    }, [body, watch()]);

    // function to check if fields have changed
    const checkForChanges = () => {
        if (
            haveFieldsChanged(data, watch()) === true ||
            hasBodyChanged(body, data.body) === true
        ) {
            setHasChanged(true);
        } else {
            setHasChanged(false);
        }
    };
    return (
        <div>
            <StickyHeader>
                <div className={'sticky-header__collection-details'}>
                    <h1 className={styles['sticky-header__title']}>
                        Edit Page
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
