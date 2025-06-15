import { Hono } from 'hono'
import { upgradeWebSocket } from 'hono/deno'


const app = new Hono().get('/ws/rooms/:roomId', upgradeWebSocket(context => {
  return {
    onMessage() {
      console.log('Message received')
    }
  }
}))

Deno.serve({ port: 3000 }, app.fetch)
