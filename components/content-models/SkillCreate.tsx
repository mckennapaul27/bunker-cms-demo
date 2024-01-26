'use client';

import { StickyHeader } from '../collections/StickyHeader';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { SkillValues, isDisabled } from '@/utils/form-helpers';
import { type SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { AlertSuccess } from '../notifications/AlertSuccess';
import { InputController } from '../hook-form-elements/InputController';
import styles from '../../styles/dashboard-general.module.scss';
import { TextAreaController } from '../hook-form-elements/TextAreaController';
import { LoadingSpinnerInBtn } from '../elements/LoadingSpinnerInBtn';

export const SkillCreate = ({}) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const {
        handleSubmit,
        formState: { errors },
        watch,
        control,
    } = useForm<SkillValues>({
        mode: 'onChange',
        reValidateMode: 'onChange',
        shouldUnregister: false,
        defaultValues: {},
    });

    const onSubmit: SubmitHandler<SkillValues> = async (data) => {
        setLoading(true);

        try {
            const res = await fetch('/api/skills', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data,
                }),
            });
            if (res.status === 201) {
                const json = await res.json();
                setLoading(false);
                toast(
                    (t) => (
                        <AlertSuccess
                            title={`Success`}
                            description={`successfully created.`}
                            id={t.id}
                        />
                    ),
                    { duration: 300000 }
                );
                router.push(
                    `/dashboard/content-manager/skill/${json.data._id}`
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
                    <p>API: skill</p>
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
                            }}
                        />
                        {/* <InputController
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
                        /> */}
                    </div>
                </form>
            </div>
        </div>
    );
};
