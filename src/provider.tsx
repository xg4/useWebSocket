import React from 'react'
import { WebSocketContext } from './context'
import { WS } from './ws'

export const WebSocketProvider: React.FC<{ ws: WS }> = ({ ws, children }) => (
  <WebSocketContext.Provider value={ws}>{children}</WebSocketContext.Provider>
)
