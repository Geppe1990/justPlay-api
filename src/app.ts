import express from 'express'
import mongoose from 'mongoose'
import gameRoutes from './routes/games'
import errorHandler from './middleware/errorHandler'
import { setupSwagger } from './utils/swagger'
import logger from './utils/logger'

const app = express()

// Middleware per il parsing del corpo delle richieste
app.use(express.json())

// Connessione al database
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/videogames'
mongoose.connect(mongoUri, {
	useNewUrlParser: true,
	useUnifiedTopology: true
} as mongoose.ConnectOptions).then(() => {
	logger.info('Connected to MongoDB')
}).catch(err => {
	logger.error('Failed to connect to MongoDB', err)
	process.exit(1)
})

// Configurazione delle route
app.use('/games', gameRoutes)

// Configurazione di Swagger
setupSwagger(app)

// Middleware per la gestione degli errori
app.use(errorHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	logger.info(`Server is running on http://localhost:${PORT}`)
})

export default app
