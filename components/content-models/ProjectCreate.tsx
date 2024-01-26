'use client';

import { StickyHeader } from '../collections/StickyHeader';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BlogValues, ProjectValues, isDisabled } from '@/utils/form-helpers';
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
import {
    type DataType,
    DropdownCheckboxes,
} from '../hook-form-elements/DropdownCheckboxes';

export const ProjectCreate = ({
    LOCAL_STORAGE_KEY,
}: {
    LOCAL_STORAGE_KEY: string;
}) => {
    const [body, setBody] = useState('');
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [skills, setSkills] = useState<any[]>([]);
    const [technologies, setTechnologies] = useState<any[]>([]);
    const [mockup_image, setMockupImage] = useState<{
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
    const [cover_image, setCoverImage] = useState<{
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
        setValue,
        control,
    } = useForm<ProjectValues>({
        mode: 'onChange',
        reValidateMode: 'onChange',
        shouldUnregister: false,
        defaultValues: {
            primary_color: '',
            secondary_color: '',
            accent_color: '',
            primary_font: '',
            secondary_font: '',
            accent_font: '',
            project_type: '',
            skills: [],
            technologies: [],
        },
    });

    const onSubmit: SubmitHandler<ProjectValues> = async (data) => {
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
        const newData: {
            cover_image?: {
                url: string | null;
                alt: string;
                width: number | null;
                height: number | null;
                public_id: string | null;
            };
            mockup_image?: {
                url: string | null;
                alt: string;
                width: number | null;
                height: number | null;
                public_id: string | null;
            };
        } = {};
        if (cover_image.public_id) {
            newData.cover_image = cover_image;
        }
        if (mockup_image.public_id) {
            newData.mockup_image = mockup_image;
        }
        const dataToSubmit = {
            ...data,
            body,
            ...newData,
        };
        try {
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSubmit),
            });
            if (res.status === 201) {
                const json = await res.json();
                console.log('json:', json);
                setLoading(false);
                toast(
                    (t) => (
                        <AlertSuccess
                            title={`Success`}
                            description={`Project was successfully created.`}
                            id={t.id}
                        />
                    ),
                    { duration: 300000 }
                );
                router.push(
                    `/dashboard/content-manager/project/${json.data._id}`
                );
            }
        } catch (error) {
            console.log('error:', error);
        }
        setLoading(false);
    };
    useEffect(() => {
        fetchSkills();
        fetchTechnologies();
    }, []);
    const fetchSkills = async () => {
        try {
            const res = await fetch('/api/skills', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (res.status === 200) {
                const json = await res.json();
                setSkills(
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
    const fetchTechnologies = async () => {
        try {
            const res = await fetch('/api/technologies', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (res.status === 200) {
                const json = await res.json();
                setTechnologies(
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
    const disabled = isDisabled({ fields: watch(), errors });

    // console.log('authors:', authors);
    console.log('fields: ', watch());

    return (
        <div>
            <StickyHeader>
                <div className={'sticky-header__collection-details'}>
                    <h1>Create an entry</h1>
                    <p>API: project</p>
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
                        <InputController
                            label="URL"
                            name="url"
                            type="text"
                            control={control}
                            errors={errors}
                            rules={{
                                required: {
                                    value: true,
                                    message: 'URL is required',
                                },
                            }}
                        />
                        <InputController
                            label="Project Type (e.g 'local business', 'ecommerce')"
                            name="project_type"
                            type="text"
                            control={control}
                            errors={errors}
                            rules={{
                                required: {
                                    value: true,
                                    message: 'Project Type is required',
                                },
                            }}
                        />
                    </div>
                    <div className={styles['content-block']}>
                        <ImageUploader
                            setImage={setMockupImage}
                            image={mockup_image}
                            setError={setError}
                            defaultValue={''} // from db
                            existingPublicId={''} // from db
                            label={'Mockup Image'}
                        />
                    </div>
                    <div className={styles['content-block']}>
                        <ImageUploader
                            setImage={setCoverImage}
                            image={cover_image}
                            setError={setError}
                            defaultValue={''} // from db
                            existingPublicId={''} // from db
                            label={'Cover Image'}
                        />
                    </div>
                    <div className={styles['content-block']}>
                        <InputController
                            label="Primary Color"
                            name="primary_color"
                            type="text"
                            control={control}
                            errors={errors}
                            rules={{
                                required: {
                                    value: false,
                                },
                            }}
                        />
                        <InputController
                            label="Secondary Color"
                            name="secondary_color"
                            type="text"
                            control={control}
                            errors={errors}
                            rules={{
                                required: {
                                    value: false,
                                },
                            }}
                        />
                        <InputController
                            label="Accent Color"
                            name="accent_color"
                            type="text"
                            control={control}
                            errors={errors}
                            rules={{
                                required: {
                                    value: false,
                                },
                            }}
                        />
                        <InputController
                            label="Primary Font"
                            name="primary_font"
                            type="text"
                            control={control}
                            errors={errors}
                            rules={{
                                required: {
                                    value: false,
                                },
                            }}
                        />
                        <InputController
                            label="Secondary Font"
                            name="secondary_font"
                            type="text"
                            control={control}
                            errors={errors}
                            rules={{
                                required: {
                                    value: false,
                                },
                            }}
                        />
                        <InputController
                            label="Accent Font"
                            name="accent_font"
                            type="text"
                            control={control}
                            errors={errors}
                            rules={{
                                required: {
                                    value: false,
                                },
                            }}
                        />
                    </div>

                    {skills.length > 0 && (
                        <div className={styles['content-block']}>
                            <DropdownCheckboxes
                                allData={skills}
                                setValue={setValue}
                                valueName="skills"
                            />
                        </div>
                    )}
                    {technologies.length > 0 && (
                        <div className={styles['content-block']}>
                            <DropdownCheckboxes
                                allData={technologies}
                                setValue={setValue}
                                valueName="technologies"
                            />
                        </div>
                    )}

                    <TiptapEditor
                        storageKey={LOCAL_STORAGE_KEY}
                        setBody={setBody}
                    />
                </form>
            </div>
        </div>
    );
};
