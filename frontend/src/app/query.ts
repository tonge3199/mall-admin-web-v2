import { QueryClient } from '@tanstack/react-query'

// Central place to tweak default query/mutation behaviors.
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
})
