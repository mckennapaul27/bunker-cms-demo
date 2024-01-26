'use client';
import Image from 'next/image';
import styles from './Forms.module.scss';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { FormValues, isDisabled } from '@/utils/form-helpers';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { InputController } from './InputController';
import { Button } from '../elements/Button';
import { LoadingSpinnerInBtn } from '../elements/LoadingSpinnerInBtn';
import Link from 'next/link';

export const SignUpForm = () => {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const {
        handleSubmit,
        formState: { errors },
        watch,
        control,
    } = useForm<FormValues>({
        mode: 'onChange',
        reValidateMode: 'onChange',
        shouldUnregister: false,
        defaultValues: {},
    });

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setLoading(true);
        try {
            const res = await fetch('/api/sign-up', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    first_name: data.first_name,
                    last_name: data.last_name,
                    email: data.email,
                    password: data.password,
                }),
            });
            console.log('password', data.password);
            if (res.status === 400) {
                const json = await res.json();
                setError(json.msg);
                setLoading(false);
            } else if (res.status === 201) {
                router.push('/login');
            } else if (res.status === 500) {
                setError('Something went wrong. Please try again later.');
            }
        } catch (error) {
            console.error(error);
            setError('Something went wrong. Please try again later.');
        }
    };
    const disabled = isDisabled({ fields: watch(), errors });
    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <div className={styles['logo-area']}>
                    <Image
                        src={'/logos/bunkercms-logo.svg'}
                        width={147}
                        height={33}
                        alt={'BunkerCMS Logo'}
                    />
                    <h2>Register</h2>
                </div>
                <div className={styles['form-wrapper']}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <InputController
                            name="first_name"
                            label="First Name"
                            control={control}
                            errors={errors}
                            type="text"
                            rules={{
                                required: {
                                    value: true,
                                    message: 'First name is required',
                                },
                                pattern: {
                                    value: /^[a-z\s]+$/i,
                                    message:
                                        'First name must be alphabetic characters',
                                },
                            }}
                        />
                        <InputController
                            name="last_name"
                            label="Last Name"
                            control={control}
                            errors={errors}
                            type="text"
                            rules={{
                                required: {
                                    value: true,
                                    message: 'Last name is required',
                                },
                                pattern: {
                                    value: /^[a-z\s]+$/i,
                                    message:
                                        'Last name must be alphabetic characters',
                                },
                            }}
                        />
                        <InputController
                            name="email"
                            label="Email"
                            control={control}
                            errors={errors}
                            type="email"
                            rules={{
                                required: {
                                    value: true,
                                    message: 'Email is required',
                                },
                                pattern: {
                                    value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i,
                                    message:
                                        'Please enter a valid email address',
                                },
                            }}
                        />
                        <InputController
                            name="password"
                            label="Password"
                            control={control}
                            errors={errors}
                            type="password"
                            rules={{
                                required: {
                                    value: true,
                                    message: 'Password is required',
                                },
                                minLength: {
                                    value: 8,
                                    message:
                                        'Password must be at least 8 characters',
                                },
                            }}
                        />
                        <Button type="submit" disabled={disabled}>
                            {loading && <LoadingSpinnerInBtn />} Register
                        </Button>
                        {error && (
                            <span className="form-error submit-btn">
                                {error}
                            </span>
                        )}
                        <Link href="/login" className="link block-link">
                            Already have an account? Login
                        </Link>
                    </form>
                </div>
            </main>
        </div>
    );
};
