import React from 'react'
import type { WS } from './ws'

export const WebSocketContext = React.createContext<WS | undefined>(undefined)

interface WebSocketProviderProps<T> {
  ws: T
  children: React.ReactNode
}

export function WebSocketProvider<T extends WS>({
  ws,
  children,
}: WebSocketProviderProps<T>) {
  React.useEffect(() => {
    ws.connect()
    return () => {
      ws.disconnect()
    }
  }, [ws])

  return (
    <WebSocketContext.Provider value={ws}>{children}</WebSocketContext.Provider>
  )
}
