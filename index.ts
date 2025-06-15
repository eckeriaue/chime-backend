import { hc as honoClient } from 'hono/client'
import type { app } from './app.ts'

export const hc = honoClient<typeof app>('http://localhost:3000')
