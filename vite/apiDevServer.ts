import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin, ViteDevServer } from 'vite'

// Serves api/*.ts in `npm run dev` the way Vercel runs them: each file's default export is a
// { fetch(Request): Response } handler. Vite loads the handler fresh on every request, so edits to
// the API apply without a restart. Server-only env vars (no VITE_ prefix) come from .env.local and
// stay on the server; Vite only exposes VITE_ variables to the browser bundle.

interface FetchHandler {
  fetch(request: Request): Promise<Response>
}

async function readBody(req: IncomingMessage): Promise<Buffer | undefined> {
  if (req.method === 'GET' || req.method === 'HEAD') return undefined
  const chunks: Buffer[] = []
  for await (const chunk of req) chunks.push(chunk as Buffer)
  return Buffer.concat(chunks)
}

async function handle(server: ViteDevServer, req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`)
  const name = url.pathname.replace(/^\/api\//, '').replace(/\/$/, '')
  if (!/^[a-z0-9-]+$/.test(name)) {
    res.statusCode = 404
    res.end()
    return
  }

  const module = (await server.ssrLoadModule(`/api/${name}.ts`)) as { default: FetchHandler }
  const headers = new Headers()
  for (const [key, value] of Object.entries(req.headers)) {
    if (typeof value === 'string') headers.set(key, value)
    else if (Array.isArray(value)) value.forEach(v => headers.append(key, v))
  }
  headers.set('x-forwarded-for', req.socket.remoteAddress ?? '127.0.0.1')

  const response = await module.default.fetch(
    new Request(url, { method: req.method, headers, body: await readBody(req) })
  )

  res.statusCode = response.status
  response.headers.forEach((value, key) => {
    if (key !== 'set-cookie') res.setHeader(key, value)
  })
  const cookies = response.headers.getSetCookie()
  if (cookies.length) res.setHeader('set-cookie', cookies)
  res.flushHeaders()

  if (!response.body) {
    res.end()
    return
  }
  // Pass the stream through chunk by chunk so server-sent events arrive as they're written
  for await (const chunk of response.body) res.write(chunk)
  res.end()
}

export function apiDevServer(env: Record<string, string>): Plugin {
  return {
    name: 'api-dev-server',
    apply: 'serve',
    configureServer(server) {
      Object.assign(process.env, env)
      server.middlewares.use('/api', (req, res) => {
        // Connect strips the mount path; restore it so the handler sees the real URL
        req.url = `/api${req.url ?? ''}`
        handle(server, req, res).catch(error => {
          server.config.logger.error(`[api] ${error instanceof Error ? error.stack : error}`)
          if (!res.headersSent) res.statusCode = 500
          res.end()
        })
      })
    },
  }
}
