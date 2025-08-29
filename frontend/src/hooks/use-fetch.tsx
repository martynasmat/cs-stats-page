import { useCallback, useEffect, useState } from "preact/hooks";

type UseFetchProps<TData> = {
    fn: () => Promise<TData>;
};

export function useFetch<TData = unknown, TError = unknown>({
    fn,
}: UseFetchProps<TData>) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<TError | undefined>();
    const [data, setData] = useState<TData | undefined>();
    const fetchFn = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await fn();
            setData(data);
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFn();
    }, []);

    return {
        isLoading,
        error,
        data,
        refetch: fetchFn,
    };
}
