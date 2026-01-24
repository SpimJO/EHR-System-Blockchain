import { useState, useEffect, useCallback } from 'react';

interface UseApiOptions<T> {
    initialData?: T;
    autoFetch?: boolean;
}

export function useApi<T, TParams extends any[] = []>(
    apiFunction: (...args: TParams) => Promise<T>,
    options: UseApiOptions<T> = {}
) {
    const { initialData, autoFetch = false } = options;

    const [data, setData] = useState<T | undefined>(initialData);
    const [loading, setLoading] = useState(autoFetch);
    const [error, setError] = useState<Error | null>(null);

    const execute = useCallback(
        async (...args: TParams) => {
            try {
                setLoading(true);
                setError(null);
                const result = await apiFunction(...args);
                setData(result);
                return result;
            } catch (err) {
                const error = err as Error;
                setError(error);
                throw error;
            } finally {
                setLoading(false);
            }
        },
        [apiFunction]
    );

    useEffect(() => {
        if (autoFetch) {
            execute(...([] as unknown as TParams));
        }
    }, [autoFetch, execute]);

    const reset = useCallback(() => {
        setData(initialData);
        setError(null);
        setLoading(false);
    }, [initialData]);

    return {
        data,
        loading,
        error,
        execute,
        reset,
        setData,
    };
}

// Specialized hooks for common patterns
export function useFetchApi<T>(
    apiFunction: () => Promise<T>,
    dependencies: any[] = []
) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const refetch = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await apiFunction();
            setData(result);
            return result;
        } catch (err) {
            const error = err as Error;
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [apiFunction]);

    useEffect(() => {
        refetch();
    }, dependencies);

    return { data, loading, error, refetch };
}
