'use client';
import { StickyHeader } from '../collections/StickyHeader';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    CategoryValues,
    isDisabled,
    haveFieldsChanged,
} from '@/utils/form-helpers';
import { type SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { AlertSuccess } from '../notifications/AlertSuccess';
import { InputController } from '../hook-form-elements/InputController';
import styles from '../../styles/dashboard-general.module.scss';
import { TextAreaController } from '../hook-form-elements/TextAreaController';
import { LoadingSpinnerInBtn } from '../elements/LoadingSpinnerInBtn';
import classNames from 'classnames';

export const CategoryUpdate = ({
    id,
    data,
}: {
    id: string;
    data: {
        metaTitle: string;
        metaDescription: string;
        name: string;
        slug: string;
        status: string;
    };
}) => {
    const router = useRouter();
    const pathname = usePathname();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [publishLoading, setPublishLoading] = useState(false);
    const [version, setVersion] = useState(0);
    const [hasChanged, setHasChanged] = useState(false);
    const {
        handleSubmit,
        formState: { errors },
        watch,
        control,
    } = useForm<CategoryValues>({
        mode: 'onChange',
        reValidateMode: 'onChange',
        shouldUnregister: false,
        defaultValues: {
            metaTitle: data?.metaTitle || '',
            metaDescription: data?.metaDescription || '',
            name: data?.name || '',
            slug: data?.slug || '',
        },
    });

    const onSubmit: SubmitHandler<CategoryValues> = async (data) => {
        setLoading(true);

        try {
            const res = await fetch(`/api/categories/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data,
                }),
            });
            if (res.status === 200) {
                const json = await res.json();
                setLoading(false);
                toast(
                    (t) => (
                        <AlertSuccess
                            title={`Success`}
                            description={`Category was successfully updated.`}
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
            const res = await fetch(`/api/categories/${id}`, {
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
                            description={`Category was successfully updated`}
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

    const disabled = isDisabled({ fields: watch(), errors }) || !hasChanged;

    useEffect(() => {
        checkForChanges();
    }, [watch()]);

    // function to check if fields have changed
    const checkForChanges = () => {
        if (haveFieldsChanged(data, watch()) === true) {
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
                        Edit Category
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
                            label="Name"
                            name="name"
                            type="text"
                            control={control}
                            errors={errors}
                            defaultValue={data.name || ''}
                            rules={{
                                required: {
                                    value: true,
                                    message: 'Name is required',
                                },
                                pattern: {
                                    value: /^[a-z\s]+$/i,
                                    message:
                                        'Name must be alphabetic characters',
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
                    </div>
                </form>
            </div>
        </div>
    );
};
