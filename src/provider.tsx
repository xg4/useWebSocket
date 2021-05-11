import React from 'react'
import { WebSocketContext } from './context'
import type { WS } from './ws'

export function WebSocketProvider<T extends WS>({
  ws,
  children,
}: {
  ws: T
  children: React.ReactNode
}) {
  return (
    <WebSocketContext.Provider value={ws}>{children}</WebSocketContext.Provider>
  )
}
