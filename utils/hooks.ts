'use client';
import React, { useEffect, useRef, useState } from 'react';
import 'react-loading-skeleton/dist/skeleton.css';

export const useOnClickOutside = (
    ref: React.RefObject<HTMLElement>,
    handler: (event: MouseEvent | TouchEvent) => void
) => {
    useEffect(() => {
        const mousedownListener = (event: MouseEvent) => {
            if (!ref.current || ref.current.contains(event.target as Node)) {
                return;
            }
            handler(event);
        };

        const touchstartListener = (event: TouchEvent) => {
            if (!ref.current || ref.current.contains(event.target as Node)) {
                return;
            }
            handler(event);
        };

        document.addEventListener(
            'mousedown',
            mousedownListener as EventListener,
            {
                passive: true as any, // Use a type assertion to any here
            }
        );
        document.addEventListener(
            'touchstart',
            touchstartListener as EventListener,
            {
                passive: true as any, // Use a type assertion to any here
            }
        );

        return () => {
            document.removeEventListener(
                'mousedown',
                mousedownListener as EventListener
            );
            document.removeEventListener(
                'touchstart',
                touchstartListener as EventListener
            );
        };
    }, [ref, handler]);
};

export const useLocalStorage = <T>(
    key: string,
    initialValue: T
): [T, (valueOrUpdater: T | ((val: T) => T)) => void] => {
    const [storedValue, setStoredValue] = useState<T>(initialValue);

    useEffect(() => {
        try {
            const item = localStorage.getItem(key);
            if (item) {
                setStoredValue(JSON.parse(item));
            }
        } catch (error) {}
    }, [key]);

    const setValue = (valueOrUpdater: T | ((val: T) => T)): void => {
        // Determine the new value
        const newValue =
            typeof valueOrUpdater === 'function'
                ? (valueOrUpdater as (val: T) => T)(storedValue)
                : valueOrUpdater;

        try {
            setStoredValue(newValue);
            localStorage.setItem(key, JSON.stringify(newValue));
        } catch (error) {}
    };

    return [storedValue, setValue];
};

export const usePrevious = (value: any) => {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
};
