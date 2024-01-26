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
import { signIn } from 'next-auth/react';

export const LoginForm = () => {
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
        const res = await signIn('credentials', {
            redirect: false,
            email: data.email,
            password: data.password,
        });
        if (res?.error) {
            setError('Invalid email or password');
            setLoading(false);
        } else if (res?.ok) {
            router.push('/dashboard');
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
                    <h2>Login</h2>
                </div>
                <div className={styles['form-wrapper']}>
                    <form onSubmit={handleSubmit(onSubmit)}>
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
                            {loading && <LoadingSpinnerInBtn />} Login
                        </Button>
                        {error && (
                            <span className="form-error submit-btn">
                                {error}
                            </span>
                        )}
                        <Link
                            href="/forgot-password"
                            className="link block-link"
                        >
                            Forgot password?
                        </Link>
                    </form>
                </div>
            </main>
        </div>
    );
};
