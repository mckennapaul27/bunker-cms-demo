'use client';

import { useEffect } from 'react';

const useConfirmBeforeLeaving = (
    shouldConfirm: boolean,
    message: string
): void => {
    useEffect(() => {
        const handleWindowClose = (event: BeforeUnloadEvent) => {
            if (!shouldConfirm) return;
            event.preventDefault();
            // Most browsers ignore the custom message and display their own default message.
            event.returnValue = message;
        };

        // Attach the event listener for browser-level actions
        window.addEventListener('beforeunload', handleWindowClose);

        // Cleanup function to remove the event listener
        return () => {
            window.removeEventListener('beforeunload', handleWindowClose);
        };
    }, [shouldConfirm, message]); // Re-run the effect if these dependencies change
};

export default useConfirmBeforeLeaving;
