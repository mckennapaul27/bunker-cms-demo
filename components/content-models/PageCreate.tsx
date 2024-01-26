'use client';

import { StickyHeader } from '../collections/StickyHeader';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PageValues, isDisabled } from '@/utils/form-helpers';
import { type SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { AlertSuccess } from '../notifications/AlertSuccess';
import { InputController } from '../hook-form-elements/InputController';
import styles from '../../styles/dashboard-general.module.scss';
import { TextAreaController } from '../hook-form-elements/TextAreaController';
import { TiptapEditor } from '../tiptap-editor';
import { AlertWarning } from '../notifications/AlertWarning';
import { LoadingSpinnerInBtn } from '../elements/LoadingSpinnerInBtn';

export const PageCreate = ({
    LOCAL_STORAGE_KEY,
}: {
    LOCAL_STORAGE_KEY: string;
}) => {
    const [body, setBody] = useState('');
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const {
        handleSubmit,
        formState: { errors },
        watch,
        control,
    } = useForm<PageValues>({
        mode: 'onChange',
        reValidateMode: 'onChange',
        shouldUnregister: false,
        defaultValues: {},
    });

    const onSubmit: SubmitHandler<PageValues> = async (data) => {
        console.log('data:', data);
        setLoading(true);
        console.log('data:', data);
        console.log('body:', body);
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
            const res = await fetch('/api/pages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data,
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
                            description={`Page was successfully created.`}
                            id={t.id}
                        />
                    ),
                    { duration: 300000 }
                );
                router.push(`/dashboard/content-manager/page/${json.data._id}`);
            }
        } catch (error) {
            console.log('error:', error);
        }
        setLoading(false);
    };

    const disabled = isDisabled({ fields: watch(), errors });

    return (
        <div>
            <StickyHeader>
                <div className={'sticky-header__collection-details'}>
                    <h1>Create an entry</h1>
                    <p>API: page</p>
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
