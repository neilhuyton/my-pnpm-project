import { createTRPCReact } from '@trpc/react-query';
import { QueryClient } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';

export const trpc = createTRPCReact({
  unstable_overrides: {
    useMutation: {
      async onMutate() {
        // Optional: Handle mutation context if needed
      },
    },
  },
});

export const queryClient = new QueryClient();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: '/.netlify/functions/trpc',
    }),
  ],
});