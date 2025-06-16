import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { upgradeWebSocket } from 'hono/deno'

const rooms = new Map()

export const app = new Hono()
  .get('/', (c) => c.html('<h1>server is ok</h1>'))
  .use('/api/rooms/*', cors({ origin: '*' }))
  .get('/api/rooms', (c) => c.json([...rooms.values()]))

  .get('/api/rooms/:roomId/users', (c) => {
    const roomId = c.req.param('roomId')
    const room = rooms.get(roomId)
    if (!room) return c.json({ error: 'Room not found' }, 404)
    return c.json(room.users)
  })

  .post('/api/rooms/create', async context => {
    const { roomName, roomPassword, roomUid } = await context.req.json()
    rooms.set(roomUid, { roomName, roomPassword, roomUid, users: [] })
    context.status(201)
    return context.json({ status: 'ok' })
  })
  .get('/ws/rooms/:roomId', upgradeWebSocket(context => {
    const roomId = context.req.param('roomId')
    return {
      onOpen(event, ws) {
      },
      onMessage(event, ws) {
        const { action, userName } = JSON.parse(event.data.toString())
        if (action === 'enter') {
          rooms.get(roomId).users.push({ userName })
          ws.send(JSON.stringify({ action: 'connect', userName }))
        }
      },
      onClose(event, ws) {
        rooms.delete(roomId)
      }
    }
  })
  )
