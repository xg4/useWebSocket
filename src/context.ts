import React from 'react'
import type { WS } from './ws'

export const WebSocketContext = React.createContext<WS>(null!)
