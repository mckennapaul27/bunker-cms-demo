'use client';
import React, { useEffect, useRef } from 'react';

export const StickyHeader = ({ children }: { children: React.ReactNode }) => {
    const BannerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const onScroll = () => {
            const offset = window.scrollY;
            const nav = BannerRef.current;
            if (nav) {
                if (offset > 600) {
                    nav.classList.add('sticky');
                } else {
                    nav.classList.remove('sticky');
                }
            }
        };

        window.addEventListener('scroll', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, []);
    return (
        <div ref={BannerRef} className={'sticky-header__wrapper'}>
            <div
                className={'sticky-header__banner'}
                role="navigation"
                aria-label="main navigation"
            >
                {children}
            </div>
        </div>
    );
};
