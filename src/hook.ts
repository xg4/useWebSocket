import React, { useContext, useEffect } from 'react'
import { WebSocketContext } from './context'
import type { WS } from './ws'

function useWebSocket(): WS

function useWebSocket(
  event: string,
  listener: Function,
  deps?: React.DependencyList
): WS

function useWebSocket(
  event: Record<string, Function>,
  deps?: React.DependencyList
): WS

function useWebSocket(
  event?: any,
  listener?: any,
  deps?: React.DependencyList
) {
  const socket = useContext(WebSocketContext)

  const _deps = (typeof event === 'string' ? deps : listener) ?? []

  useEffect(() => {
    if (!event) {
      return () => {}
    }
    if (typeof event === 'string') {
      socket.on(event, listener)
      return () => {
        socket.off(event, listener)
      }
    }

    for (const key in event) {
      socket.on(key, event[key])
    }
    return () => {
      for (const key in event) {
        socket.off(key, event[key])
      }
    }
  }, [event, listener, ..._deps])

  return socket
}

export { useWebSocket }
