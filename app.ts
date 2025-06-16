import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { upgradeWebSocket } from 'hono/deno'

const rooms = new Map()

export const app = new Hono()
  .use('/rooms/*', cors({ origin: '*' }))
  .get('/rooms', (c) => c.json([...rooms.values()]))
  .get('/', (c) => c.html('<h1>server is ok</h1>'))
  .post('/rooms/create', async context => {
    const { roomName, roomPassword, roomUid } = await context.req.json()
    rooms.set(roomUid, { roomName, roomPassword, roomUid, ws: null })
    context.status(201)
    return context.json({ status: 'ok' })
  })
  .get('/ws/rooms/:roomId', upgradeWebSocket(context => {
    const roomId = context.req.param('roomId')
    return {
      onOpen(event, ws) {
        rooms.set(roomId, { ws })
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
