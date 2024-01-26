'use client';
import { StickyHeader } from '../collections/StickyHeader';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    ProjectValues,
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
    type DataType,
    DropdownCheckboxes,
} from '../hook-form-elements/DropdownCheckboxes';
// import isEqual from 'lodash.isequal';

export const ProjectUpdate = ({
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
        url: string;
        description: string;
        mockup_image: {
            url: string | null;
            alt: string | null;
            width: number | null;
            height: number | null;
            public_id: string | null;
        };
        cover_image: {
            url: string | null;
            alt: string | null;
            width: number | null;
            height: number | null;
            public_id: string | null;
        };
        body: string;
        skills: string[];
        technologies: string[];
        status: string;
        primary_color: string;
        secondary_color: string;
        accent_color: string;
        primary_font: string;
        secondary_font: string;
        accent_font: string;
        project_type: string;
    };
    LOCAL_STORAGE_KEY: string;
}) => {
    //console.log('data:', data);
    const router = useRouter();
    const pathname = usePathname();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [publishLoading, setPublishLoading] = useState(false);
    const [skills, setSkills] = useState<any[]>([]);
    const [technologies, setTechnologies] = useState<any[]>([]);
    const [autoSave, setAutoSave] = useState(false);
    const [autoSaveTime, setAutoSaveTime] = useState('');
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
    const [body, setBody] = useState(data.body || '');
    const [version, setVersion] = useState(0);
    const [hasChanged, setHasChanged] = useState(false);
    const {
        handleSubmit,
        formState: { errors },
        watch,
        control,
        setValue,
    } = useForm<ProjectValues>({
        mode: 'onChange',
        reValidateMode: 'onChange',
        shouldUnregister: false,
        defaultValues: {
            metaTitle: data.metaTitle || '',
            metaDescription: data.metaDescription || '',
            title: data.title || '',
            slug: data.slug || '',
            description: data.description || '',
            primary_color: data.primary_color || '',
            secondary_color: data.secondary_color || '',
            accent_color: data.accent_color || '',
            primary_font: data.primary_font || '',
            secondary_font: data.secondary_font || '',
            accent_font: data.accent_font || '',
            project_type: data.project_type || '',
            url: data.url || '',
            technologies: data.technologies || [],
            skills: data.skills || [],
        },
    });

    const onSubmit: SubmitHandler<ProjectValues> = async (data) => {
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
            const res = await fetch(`/api/projects/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSubmit),
            });
            if (res.status === 200) {
                setLoading(false);
                toast(
                    (t) => (
                        <AlertSuccess
                            title={`Success`}
                            description={`Successfully updated.`}
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
            const res = await fetch(`/api/projects/${id}`, {
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
                            description={`Successfully updated`}
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
            const res = await fetch(`/api/projects/${id}`, {
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
    const disabled =
        isDisabled({ fields: watch(), errors }) || !body || !hasChanged;

    // console.log('isDisabled', isDisabled({ fields: watch(), errors }));
    //console.log('!body', !body);
    // console.log('!hasChanged', !hasChanged);
    //  console.log('disabled', disabled);

    // useEffect to check if fields have changed that calls checkForChanges function
    useEffect(() => {
        //console.log('fields have changed', haveFieldsChanged(data, watch()));
        //console.log('body has changed', hasBodyChanged(body, data.body));
        //console.log('image has changed', hasImageChanged(image, data.image));
        checkForChanges();
        // console.log('useEffect has run');
    }, [body, watch()]);

    // function to check if fields have changed
    const checkForChanges = () => {
        // console.log('haveFieldsChanged: ', haveFieldsChanged(data, watch()));
        // console.log('hasBodyChanged: ', hasBodyChanged(body, data.body));
        if (
            haveFieldsChanged(data, watch()) === true ||
            hasBodyChanged(body, data.body) === true
        ) {
            setHasChanged(true);
        } else {
            setHasChanged(false);
        }
    };
    // console.log('hasChanged:', hasChanged);
    return (
        <div>
            <StickyHeader>
                <div className={'sticky-header__collection-details'}>
                    <h1 className={styles['sticky-header__title']}>
                        Edit Project{' '}
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
                        {/* <InputController
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
                        /> */}
                        <TextAreaController
                            label="Description"
                            name="description"
                            type="text"
                            control={control}
                            errors={errors}
                            defaultValue={data.description || ''}
                            rules={{
                                required: {
                                    value: false,
                                },
                            }}
                        />
                        <InputController
                            label="URL"
                            name="url"
                            type="text"
                            control={control}
                            errors={errors}
                            defaultValue={data.url || ''}
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
                            defaultValue={data.project_type || ''}
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
                            defaultValue={data?.mockup_image?.url || ''} // from db
                            existingPublicId={
                                data?.mockup_image?.public_id || ''
                            } // from db
                            label={'Mockup Image'}
                        />
                    </div>
                    <div className={styles['content-block']}>
                        <ImageUploader
                            setImage={setCoverImage}
                            image={cover_image}
                            setError={setError}
                            defaultValue={data?.cover_image?.url || ''} // from db
                            existingPublicId={
                                data?.cover_image?.public_id || ''
                            } // from db
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
                            defaultValue={data.primary_color || ''}
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
                            defaultValue={data.secondary_color || ''}
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
                            defaultValue={data.accent_color || ''}
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
                            defaultValue={data.primary_font || ''}
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
                            defaultValue={data.secondary_font || ''}
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
                            defaultValue={data.accent_font || ''}
                            rules={{
                                required: {
                                    value: false,
                                },
                            }}
                        />
                    </div>

                    <div className={styles['content-block']}>
                        <DropdownCheckboxes
                            allData={skills}
                            existing={data.skills ? data.skills : []}
                            setValue={setValue}
                            valueName="skills"
                        />
                    </div>

                    <div className={styles['content-block']}>
                        <DropdownCheckboxes
                            allData={technologies}
                            existing={
                                data.technologies ? data.technologies : []
                            }
                            setValue={setValue}
                            valueName="technologies"
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
