'use client';

import { surrealdbWasmEngines } from '@surrealdb/wasm';
import { useMutation } from '@tanstack/react-query';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Surreal } from 'surrealdb';

export type SurrealProviderState = {
  /** The Surreal instance */
  client: Surreal;
  /** Whether the connection is pending */
  isConnecting: boolean;
  /** Whether the connection was successfully established */
  isSuccess: boolean;
  /** Whether the connection rejected in an error */
  isError: boolean;
  /** The connection error, if present */
  error: unknown;
  /** Connect to the Surreal instance */
  connect: () => Promise<true>;
  /** Close the Surreal instance */
  close: () => Promise<true>;
};

export const SurrealContext = createContext<SurrealProviderState | undefined>(
  undefined,
);

export type SurrealProviderProps = React.PropsWithChildren<{
  client?: Surreal;
  endpoint: string;
  params?: Parameters<Surreal['connect']>[1];
  autoConnect?: boolean;
}>;

export const ClientSideSurrealProvider: React.FC<
  Readonly<SurrealProviderProps>
> = ({ children, client, endpoint, params, autoConnect = true }) => {
  const [surrealInstance] = useState(
    () =>
      client ??
      new Surreal({
        engines: surrealdbWasmEngines(),
      }),
  );

  const {
    mutateAsync: connectMutation,
    isPending,
    isSuccess,
    isError,
    error,
    reset,
  } = useMutation({
    mutationFn: () => surrealInstance.connect(endpoint, params),
  });

  const connect = useCallback(() => connectMutation(), [connectMutation]);

  // Wrap close() in a stable callback
  const close = useCallback(() => surrealInstance.close(), [surrealInstance]);

  // Auto-connect on mount (if enabled) and cleanup on unmount
  useEffect(() => {
    if (autoConnect) {
      void connect();
    }

    return () => {
      reset();
      void surrealInstance.close();
    };
  }, [autoConnect, connect, reset, surrealInstance]);

  // Memoize the context value
  const value: SurrealProviderState = useMemo(
    () => ({
      client: surrealInstance,
      isConnecting: isPending,
      isSuccess,
      isError,
      error,
      connect,
      close,
    }),
    [surrealInstance, isPending, isSuccess, isError, error, connect, close],
  );

  return (
    <SurrealContext.Provider value={value}>{children}</SurrealContext.Provider>
  );
};
