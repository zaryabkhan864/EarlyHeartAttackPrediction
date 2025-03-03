import { useState, useCallback, useEffect } from 'react';

/**
 * Hook for handling async operations
 * @param {function} asyncFunction - Async function to execute
 * @param {boolean} immediate - Whether to execute immediately
 * @param {array} dependencies - Dependencies array to trigger execution
 */
const useAsync = (
    asyncFunction,
    immediate = false,
    dependencies = []
) => {
    const [status, setStatus] = useState('idle');
    const [value, setValue] = useState(null);
    const [error, setError] = useState(null);

    // Execute the async function
    const execute = useCallback(
        async (...params) => {
            setStatus('pending');
            setValue(null);
            setError(null);

            try {
                const response = await asyncFunction(...params);
                setValue(response);
                setStatus('success');
                return response;
            } catch (err) {
                setError(err);
                setStatus('error');
                throw err;
            }
        },
        [asyncFunction]
    );

    // Execute immediately when the hook mounts or dependencies change
    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, [...dependencies, immediate]);

    // Reset the state
    const reset = useCallback(() => {
        setStatus('idle');
        setValue(null);
        setError(null);
    }, []);

    return {
        execute,
        reset,
        status,
        value,
        error,
        isIdle: status === 'idle',
        isPending: status === 'pending',
        isSuccess: status === 'success',
        isError: status === 'error',
    };
};

export default useAsync;