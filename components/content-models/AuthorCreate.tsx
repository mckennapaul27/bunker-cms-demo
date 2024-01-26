'use client';

import { StickyHeader } from '../collections/StickyHeader';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AuthorValues, isDisabled } from '@/utils/form-helpers';
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

export const AuthorCreate = ({
    LOCAL_STORAGE_KEY,
}: {
    LOCAL_STORAGE_KEY: string;
}) => {
    const [body, setBody] = useState('');
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const qs = searchParams.get('version');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
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
    } = useForm<AuthorValues>({
        mode: 'onChange',
        reValidateMode: 'onChange',
        shouldUnregister: false,
        defaultValues: {},
    });

    const onSubmit: SubmitHandler<AuthorValues> = async (data) => {
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
                        description={'Bio is required'}
                        id={t.id}
                    />
                ),
                { duration: 300000 }
            );
            return;
        }
        try {
            const res = await fetch('/api/authors', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data,
                    image,
                    bio: body,
                }),
            });
            if (res.status === 201) {
                const json = await res.json();
                setLoading(false);
                toast(
                    (t) => (
                        <AlertSuccess
                            title={`Success`}
                            description={`Author was successfully created.`}
                            id={t.id}
                        />
                    ),
                    { duration: 300000 }
                );
                router.push(
                    `/dashboard/content-manager/author/${json.data._id}`
                );
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
                    <p>API: author</p>
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
                            label="Name"
                            name="name"
                            type="text"
                            control={control}
                            errors={errors}
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
                            rules={{
                                required: {
                                    value: true,
                                    message: 'Slug is required',
                                },
                            }}
                        />
                    </div>
                    <div className={styles['content-block']}>
                        <ImageUploader
                            setImage={setImage}
                            image={image}
                            setError={setError}
                            defaultValue={''} // from db
                            existingPublicId={''} // from db
                            label={'Profile Picture'}
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
