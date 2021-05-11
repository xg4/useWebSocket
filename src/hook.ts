import React, { useContext, useEffect } from 'react'
import { WebSocketContext } from './context'
import type { WS } from './ws'

function useWebSocket<T extends WS>(): T

function useWebSocket<T extends WS>(
  event: string,
  listener: Function,
  deps?: React.DependencyList
): T

function useWebSocket<T extends WS>(
  event: Record<string, Function>,
  deps?: React.DependencyList
): T

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
