import mongoose from "mongoose"
import fs from "fs"
import csv from "csv-parser"
import Game from "./models/Game"
import Platform from "./models/Platform"
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

const results: any[] = []

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
	.on("data", (data) => results.push(data))
	.on("end", async () => {
		for (const game of results) {
			try {
				const existingGame = await Game.findOne({ id: game.id })
				if (existingGame) {
					console.log(`Game with id ${game.id} already exists, skipping.`)
					continue
				}

				const platformNames = parseJSON(game.platforms, 'platforms', [])
				const platformIds = []
				for (const platformName of platformNames) {
					const platform = await Platform.findOne({ name: platformName.name })
					if (platform) {
						platformIds.push(platform._id)
					} else {
						console.error(`Platform ${platformName.name} not found`)
					}
				}

				const genreNames = parseJSON(game.genres, 'genres', [])
				const genreIds = []
				for (const genreName of genreNames) {
					const genre = await Genre.findOne({ name: genreName.name })
					if (genre) {
						genreIds.push(genre._id)
					} else {
						console.error(`Genre ${genreName.name} not found`)
					}
				}

				const newGame = new Game({
					id: game.id,
					name: game.name,
					summary: game.summary,
					release_dates: parseJSON(game.release_dates, 'release_dates', []),
					genres: genreIds,
					platforms: platformIds
				})
				await newGame.save()
				console.log(`Game ${newGame.name} saved successfully`)
			} catch (error) {
				console.error(`Failed to save game ${game.name}:`, error)
			}
		}
		console.log("Data imported successfully")
		mongoose.connection.close()
	})
