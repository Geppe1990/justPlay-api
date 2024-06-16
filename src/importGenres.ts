import mongoose from "mongoose"
import fs from "fs"
import csv from "csv-parser"
import Genre from "./models/Genre"

const mongoUri = "mongodb://localhost:27017/videogames"

mongoose.connect(mongoUri, {
	useNewUrlParser: true,
	useUnifiedTopology: true
} as mongoose.ConnectOptions).then(() => {
	console.log("Connected to MongoDB")
}).catch(err => {
	console.error("Failed to connect to MongoDB", err)
	process.exit(1)
})

const genresSet = new Set<{ id: number, name: string }>()

// Funzione per pulire e parse JSON
const cleanJSON = (data: string) => {
	try {
		let cleanedData = data.replace(/^\s*'\s*|\s*'\s*$/g, '"')
		cleanedData = cleanedData.replace(/'([^']+?)'\s*:/g, '"$1":')
		cleanedData = cleanedData.replace(/:\s*'([^']+?)'/g, ':"$1"')
		cleanedData = cleanedData.replace(/'([^']+?)'/g, '"$1"')
		return cleanedData
	} catch (error) {
		console.error(`Failed to clean JSON: ${data}`, error)
		return data
	}
}

const parseJSON = (data: string, fieldName: string, fallback: any = []) => {
	try {
		if (data && data.trim() !== "") {
			const correctedData = cleanJSON(data)
			return JSON.parse(correctedData)
		} else {
			return fallback
		}
	} catch (error) {
		console.error(`Failed to parse JSON of game ${fieldName} in field [${fieldName}]: ${data}`, error)
		return fallback
	}
}

fs.createReadStream("videogames_data.csv")
	.pipe(csv())
	.on("data", (data) => {
		const genres = parseJSON(data.genres, 'genres', [])
		genres.forEach((genre: { id: number, name: string }) => {
			genresSet.add(genre)
		})
	})
	.on("end", async () => {
		for (const genre of genresSet) {
			try {
				const existingGenre = await Genre.findOne({ id: genre.id })
				if (existingGenre) {
					console.log(`Genre with id ${genre.id} already exists, skipping.`)
					continue
				}

				const newGenre = new Genre({
					id: genre.id,
					name: genre.name
				})
				await newGenre.save()
				console.log(`Genre ${newGenre.name} saved successfully`)
			} catch (error) {
				console.error(`Failed to save genre ${genre.name}:`, error)
			}
		}
		console.log("Data imported successfully")
		mongoose.connection.close()
	})
