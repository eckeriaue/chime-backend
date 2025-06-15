import { Hono } from 'hono'
import { upgradeWebSocket } from 'hono/deno'

const rooms = new Map()

const app = new Hono()
  .get('/', (c) => c.html('<h1>server is ok</h1>'))
  .get('/ws/rooms/:roomId', upgradeWebSocket(context => {
    return {
      onOpen(event, ws) {

      },
      onMessage() {
        console.log('Message received')
      }
    }
  })
  )

Deno.serve({ port: 3000 }, app.fetch)
