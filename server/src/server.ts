import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import chatRouter from './routes/chat'
import leadRouter from './routes/lead'

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const app = express()
const port = process.env.PORT ?? 3001

app.use(cors({ origin: process.env.ALLOWED_ORIGIN ?? 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/chat', chatRouter)
app.use('/api/send-lead', leadRouter)

app.listen(port, () => {
  console.warn(`Portfolio API server running on http://localhost:${port}`)
  console.warn(`GROQ_API_KEY loaded: ${process.env.GROQ_API_KEY ? 'yes' : 'NO — check server/.env'}`)
})
