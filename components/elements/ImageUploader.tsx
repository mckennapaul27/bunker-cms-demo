'use client';

import { PhotoIcon, TrashIcon } from '@heroicons/react/24/outline';
import React, { useState, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { sanitizeFileName } from '@/utils/image-helpers';
import { AlertSuccess } from '../notifications/AlertSuccess';
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/20/solid';
import styles from './ImageUploader.module.scss';
import classNames from 'classnames';
import { LoadingSpinnerInBtn } from './LoadingSpinnerInBtn';

export const ImageUploader = ({
    existingPublicId,
    label,
    image,
    defaultValue,
    setImage,
    setError,
}: {
    existingPublicId?: string | undefined;
    label: string;
    image: {
        url: string | null;
        alt: string;
        width: number | null;
        height: number | null;
        public_id: string | null;
    };
    defaultValue?: string | null;
    setImage: React.Dispatch<
        React.SetStateAction<{
            url: string | null;
            alt: string;
            width: number | null;
            height: number | null;
            public_id: string | null;
        }>
    >;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
    // console.log('existingPublicId:', existingPublicId);
    // console.log('image:', image);
    const [data, setData] = useState<{
        image: string | null;
    }>({
        image: defaultValue || null,
    });
    // console.log('image:', image);
    // console.log('data in ImageUploader:', data);
    const [publicId, setPublicId] = useState(''); // only used when uploaded
    const [file, setFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);

    const onChangePicture = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setError(null);
            const file =
                event.currentTarget.files && event.currentTarget.files[0];
            if (file) {
                if (file.size / 1024 / 1024 > 50) {
                    toast.error('File size too big (max 50MB)');
                } else {
                    setFile(file);
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        setData((prev) => ({
                            ...prev,
                            image: e.target?.result as string,
                        }));
                    };
                    reader.readAsDataURL(file);
                }
            }
        },
        [setData, label]
    );

    const [saving, setSaving] = useState(false);

    const saveDisabled = useMemo(() => {
        return !data.image || saving || !file;
    }, [data.image, saving]);

    const handleUpload = async () => {
        setSaving(true);
        setError(null);
        if (file) {
            try {
                const res = await fetch(
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
                );
                if (res.ok) {
                    const json = await res.json();
                    const { url, public_id, width, height } = json;
                    // console.log('json:', json);
                    setImage({
                        url,
                        alt: '',
                        width,
                        height,
                        public_id,
                    });
                    setFile(null);
                    setPublicId(public_id);
                    toast(
                        (t) => (
                            <AlertSuccess
                                title={`Success`}
                                description={`Image uploaded successfully`}
                                id={t.id}
                            />
                        ),
                        { duration: 300000 }
                    );
                } else {
                }
            } catch (error) {
                console.log('error:', error);
                // toast();
            }
        }
        setSaving(false);
    };

    return (
        <div className={styles['container']}>
            <div>
                <label className="label">{label}</label>
                <label
                    htmlFor={`image-upload-${label}`}
                    // className="group relative mt-2 flex h-72 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-300 bg-white shadow-sm transition-all hover:bg-gray-50"
                    className={styles['label-container']}
                >
                    <div
                        // className="absolute z-[5] h-full w-full rounded-md"
                        className={styles['drag-label-wrapper']}
                        onDragOver={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setDragActive(true);
                        }}
                        onDragEnter={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setDragActive(true);
                        }}
                        onDragLeave={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setDragActive(false);
                        }}
                        onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setDragActive(false);
                            setError(null);

                            const file =
                                e.dataTransfer.files && e.dataTransfer.files[0];
                            if (file) {
                                if (file.size / 1024 / 1024 > 50) {
                                    toast.error('File size too big (max 50MB)');
                                } else {
                                    setFile(file);
                                    const reader = new FileReader();
                                    reader.onload = (e) => {
                                        setData((prev) => ({
                                            ...prev,
                                            image: e.target?.result as string,
                                        }));
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }
                        }}
                    />
                    <div
                        className={classNames(
                            styles['drag-div'],
                            dragActive ? styles['drag-active'] : '',
                            data.image
                                ? styles['drag-active-opacity']
                                : styles['drag-inactive-opacity']
                        )}
                    >
                        <div className={styles['text-center']}>
                            <PhotoIcon
                                className={styles['photo-icon']}
                                aria-hidden="true"
                            />
                            <div className={styles['upload-wrapper']}>
                                <label
                                    htmlFor={`file-upload-${label}`}
                                    className={styles['upload-label']}
                                >
                                    <span>Upload a file</span>
                                    <input
                                        id={`file-upload-${label}`}
                                        name={`file-upload-${label}`}
                                        type="file"
                                        className={styles['sr-only']}
                                    />
                                </label>
                                <p
                                    style={{
                                        paddingLeft: '0.25rem',
                                    }}
                                >
                                    or drag and drop
                                </p>
                            </div>
                            <p
                                className={
                                    styles['upload-file-type-description']
                                }
                            >
                                PNG, JPG, GIF, SVG up to 10MB
                            </p>
                        </div>
                    </div>
                    {data.image ? ( // this is data from state which is a base64 string
                        <img
                            src={data.image}
                            alt="Preview"
                            className={styles['uploaded-img']}
                        />
                    ) : defaultValue ? ( // this is already uploaded image from db
                        <img
                            src={defaultValue}
                            alt="Preview"
                            className={styles['uploaded-img']}
                        />
                    ) : null}
                </label>
                <div className={styles['file-upload-input-sr-wrapper']}>
                    <input
                        // id={'image-upload'}
                        // name="image"
                        id={`image-upload-${label}`}
                        name={`image-upload-${label}`}
                        type="file"
                        accept="image/*"
                        className={styles['sr-only']}
                        onChange={onChangePicture}
                    />
                </div>
            </div>
            <p className={styles['info-text']}>
                Drag and drop or click the image to replace it
            </p>
            <div className={styles['buttons']}>
                <button
                    disabled={saveDisabled}
                    type="button"
                    onClick={handleUpload}
                    className="button small"
                >
                    {saving && <LoadingSpinnerInBtn />}{' '}
                    {saving ? (
                        <span>Saving</span>
                    ) : defaultValue ? (
                        <span>Confirm change</span>
                    ) : (
                        <span>Confirm upload</span>
                    )}
                </button>
                <span
                    className="button small danger"
                    onClick={() => {
                        setData({
                            image: null,
                        });
                        setFile(null);
                        setPublicId('');
                    }}
                >
                    <TrashIcon className={styles['icon']} />
                </span>
            </div>
            {defaultValue &&
                file && ( // only valid for edit profile page not create
                    <div
                        className={styles['cancel-upload']}
                        onClick={() => {
                            setData({
                                image: defaultValue ? defaultValue : null,
                            });
                            setFile(null);
                        }}
                    >
                        <XMarkIcon
                            className={styles['cancel-icon']}
                            aria-hidden="true"
                        />
                        <span className={styles['cancel-text']}>Cancel</span>
                    </div>
                )}
            {image.url && !file && publicId && (
                <SuccessAlertOneLine public_id={publicId} />
            )}
        </div>
    );
};

export const SuccessAlertOneLine = ({ public_id }: { public_id: string }) => {
    return (
        <div className={styles['uploaded-status']}>
            <div>
                <p>Uploaded {public_id}</p>
            </div>
            <div>
                <CheckCircleIcon
                    className={styles['success-icon']}
                    aria-hidden="true"
                />
            </div>
        </div>
    );
};
