import EventEmitter from 'events'

export interface Options {
  reconnectLimit?: number
  reconnectInterval?: number
}

export enum ReadyState {
  Connecting = WebSocket.CONNECTING,
  Open = WebSocket.OPEN,
  Closing = WebSocket.CLOSING,
  Closed = WebSocket.CLOSED,
}

export class WS extends EventEmitter {
  private ws!: WebSocket

  private reconnectTimes: number

  private reconnectLimit: number

  private reconnectInterval: number

  private reconnectTimer?: NodeJS.Timeout

  readyState: ReadyState

  constructor(private url: string, options: Options = {}) {
    super()

    const { reconnectLimit = 3, reconnectInterval = 3 * 1000 } = options

    this.readyState = ReadyState.Closed
    this.reconnectTimes = 0
    this.reconnectInterval = reconnectInterval
    this.reconnectLimit = reconnectLimit

    this._connect()
  }

  reconnect() {
    if (
      this.reconnectTimes < this.reconnectLimit &&
      this.ws.readyState !== ReadyState.Open
    ) {
      this.reconnectTimer && clearTimeout(this.reconnectTimer)
      this.reconnectTimer = setTimeout(() => {
        this._connect()
        this.reconnectTimes += 1
      }, this.reconnectInterval)
    }
  }

  private setReadyState(state: ReadyState) {
    this.readyState = state
    this.emit('stateChange', state)
  }

  send(
    message: string | ArrayBuffer | SharedArrayBuffer | Blob | ArrayBufferView
  ) {
    if (this.readyState === ReadyState.Open) {
      this.ws.send(message)
    } else {
      throw new Error('websocket disconnected')
    }
  }

  connect() {
    this.reconnectTimes = 0
    this._connect()
  }

  disconnect() {
    this.reconnectTimer && clearTimeout(this.reconnectTimer)

    this.reconnectTimes = this.reconnectLimit
    this.ws.close()
  }

  private _connect() {
    this.reconnectTimer && clearTimeout(this.reconnectTimer)
    this.ws && this.ws.close()

    this.ws = new WebSocket(this.url)
    this.ws.onerror = (event) => {
      this.reconnect()
      this.emit('error', event)
      this.setReadyState(this.ws.readyState || ReadyState.Closed)
    }
    this.ws.onopen = (event) => {
      this.emit('open', event)
      this.reconnectTimes = 0
      this.setReadyState(this.ws.readyState || ReadyState.Closed)
    }
    this.ws.onmessage = (event) => {
      this.emit('message', event)
    }
    this.ws.onclose = (event) => {
      this.reconnect()
      this.emit('close', event)
      this.setReadyState(this.ws.readyState || ReadyState.Closed)
    }
  }
}
