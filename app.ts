import { Hono } from 'hono'
import { upgradeWebSocket } from 'hono/deno'

const rooms = new Map()

export const app = new Hono()
  .get('/', (c) => c.html('<h1>server is ok</h1>'))
  .get('/ws/rooms/:roomId', upgradeWebSocket(context => {
    const roomId = context.req.param('roomId')
    return {
      onOpen(event, ws) {
        rooms.set(roomId, ws)
      },
      onMessage(event, ws) {
        console.info(event)
        rooms.get(roomId)
        console.log('Message received')
      },
      onClose(event, ws) {
        rooms.delete(roomId)
      }
    }
  })
  )
