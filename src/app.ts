import express from "express"
import mongoose from "mongoose"
import gameRoutes from "./routes/games"

const app = express()
const PORT = 3000

app.use(express.json())

const mongoUri = "mongodb://localhost:27017/videogames"

mongoose
	.connect(mongoUri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	} as mongoose.ConnectOptions)
	.then(() => {
		console.log("Connected to MongoDB")
	})
	.catch((err) => {
		console.error("Failed to connect to MongoDB", err)
	})

app.use("/games", gameRoutes)

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`)
})
