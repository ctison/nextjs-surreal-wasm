'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export type ReactQueryProviderProps = React.PropsWithChildren;

const queryClient = new QueryClient();

export const ReactQueryProvider: React.FC<
  Readonly<ReactQueryProviderProps>
> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
