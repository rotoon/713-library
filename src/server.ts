import 'dotenv/config'
import express from 'express'
import bookRoutes from './routes/bookRoutes'
import authorRoutes from './routes/authorRoutes'
import memberRoutes from './routes/memberRoutes'
import borrowRoutes from './routes/borrowRoutes'

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

// Routes
app.use('/books', bookRoutes)
app.use('/authors', authorRoutes)
app.use('/members', memberRoutes)
app.use('/borrows', borrowRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
})
