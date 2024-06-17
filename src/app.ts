import express from "express"
import mongoose from "mongoose"
import gameRoutes from "./routes/games"
import errorHandler from "./middleware/errorHandler"
import dotenv from "dotenv"
import { setupSwagger } from "./utils/swagger"
import logger from "./utils/logger"
import morgan from "morgan"
import { metricsMiddleware, metricsEndpoint } from "./middleware/metrics"

// Carica le variabili di ambiente dal file .env
dotenv.config()

const app = express()

// Middleware per il parsing del corpo delle richieste
app.use(express.json())

// Middleware per il logging delle richieste HTTP
app.use(
	morgan("combined", {
		stream: { write: (message) => logger.info(message.trim()) },
	}),
)

// Middleware per le metriche Prometheus
app.use(metricsMiddleware)

// Endpoint per le metriche Prometheus
app.get("/metrics", metricsEndpoint)

// Connessione al database
const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/videogames"
mongoose
	.connect(mongoUri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	} as mongoose.ConnectOptions)
	.then(() => {
		logger.info("Connected to MongoDB")
	})
	.catch((err) => {
		logger.error("Failed to connect to MongoDB", err)
		process.exit(1)
	})

// Configurazione delle route
app.use("/games", gameRoutes)

// Configurazione di Swagger
setupSwagger(app)

// Middleware per la gestione degli errori
app.use(errorHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	logger.info(`Server is running on http://localhost:${PORT}`)
})

export default app
