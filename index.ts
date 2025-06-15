import { hc as honoClient } from 'hono/client'
import type { app } from './main.ts'

export const hc = honoClient<typeof app>('http://localhost:3000')
