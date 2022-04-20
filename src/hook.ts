import React, { useContext, useEffect } from 'react'
import { WebSocketContext } from './provider'
import type { WS } from './ws'

export function useSocket() {
  const socket = useContext(WebSocketContext)

  if (!socket) {
    throw new Error('No WS set, use WebSocketContext to set one')
  }

  return socket
}

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
  const socket = useSocket()

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
