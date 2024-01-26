'use client';
import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
    Bars3Icon,
    CalendarIcon,
    ChartPieIcon,
    DocumentDuplicateIcon,
    FolderIcon,
    HomeIcon,
    UsersIcon,
    XMarkIcon,
    PhotoIcon,
    Cog8ToothIcon,
    DocumentTextIcon,
    ArrowLeftOnRectangleIcon,
    // Conte
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import styles from './DashboardSideBanner.module.scss';
import classNames from 'classnames';
import { collection_models } from '@/models/models';

const navigation = [
    {
        name: 'Content Manager',
        href: '#',
        icon: DocumentTextIcon,
        current: true,
    },
    // { name: 'Media', href: '#', icon: PhotoIcon, current: false },
    // { name: 'Users', href: '#', icon: UsersIcon, current: false },
    // {
    //     name: 'Settings',
    //     href: '/dashboard/settings',
    //     icon: Cog8ToothIcon,
    //     current: false,
    // },
    { name: 'Logout', href: null, icon: ArrowLeftOnRectangleIcon },
];

export const DashboardSideBanner = ({}) => {
    const router = useRouter();
    //console.log('router', router);
    return (
        <div className={styles['nav-wrapper']}>
            <nav className={styles['sidebanner-wrapper']}>
                <ul role="list" className={styles['navlist']}>
                    <Image
                        src={'/logos/bunker-cms-placeholder-logo.svg'}
                        width={32}
                        height={32}
                        alt={'BunkerCMS Logo'}
                        className={styles['logo']}
                    />
                    {navigation.map((item) => {
                        if (item.href) {
                            return (
                                <li key={item.name}>
                                    <a
                                        href={item.href}
                                        className={
                                            item.current
                                                ? classNames(
                                                      styles['current'],
                                                      styles['link']
                                                  )
                                                : styles['link']
                                        }
                                    >
                                        <item.icon
                                            className={styles['icon']}
                                            aria-hidden="true"
                                        />
                                    </a>
                                </li>
                            );
                        } else {
                            return (
                                <li key={item.name}>
                                    <a
                                        className={
                                            item.current
                                                ? classNames(
                                                      styles['current'],
                                                      styles['link']
                                                  )
                                                : styles['link']
                                        }
                                        onClick={() => signOut()}
                                    >
                                        <item.icon
                                            className={styles['icon']}
                                            aria-hidden="true"
                                        />
                                    </a>
                                </li>
                            );
                        }
                    })}
                </ul>
            </nav>
            <nav className={styles['content-manager-wrapper']}>
                <div className={styles['content-manager-menu']}>
                    <h2>Content Manager</h2>
                    <p>collection types</p>
                    <ul className={styles['collection-list']}>
                        {collection_models.map((collection) => {
                            return (
                                <li
                                    key={collection.name}
                                    className={styles['list-item']}
                                >
                                    <Link
                                        href={collection.slug}
                                        className={styles['list-item-link']}
                                    >
                                        {collection.name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </nav>
        </div>
    );
};
