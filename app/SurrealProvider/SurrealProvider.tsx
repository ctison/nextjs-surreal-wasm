'use client'

import { useContext } from 'react'
import {
  // ClientSideSurrealProvider,
  SurrealContext,
  type SurrealProviderProps,
} from './ClientSideSurrealProvider'
import dynamic from 'next/dynamic'

const ClientSideSurrealProvider = dynamic(
  () =>
    import('./ClientSideSurrealProvider').then(
      (mod) => mod.ClientSideSurrealProvider
    ),
  {
    ssr: false,
  }
)

export const SurrealProvider: React.FC<Readonly<SurrealProviderProps>> = ({
  children,
  ...props
}) => {
  return (
    <ClientSideSurrealProvider {...props}>{children}</ClientSideSurrealProvider>
  )
}

export const useSurreal = () => {
  const ctx = useContext(SurrealContext)
  if (ctx === undefined) {
    throw new Error('useSurreal must be used within a SurrealProvider')
  }
  return ctx
}

export const useSurrealClient = () => {
  const { client } = useSurreal()
  return client
}
