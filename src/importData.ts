import mongoose, { Types } from "mongoose"
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

fs.createReadStream("debug.csv")
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
				const platformIds: Types.ObjectId[] = []
				for (const platformName of platformNames) {
					let platform = await Platform.findOne({ id: platformName.id })
					if (!platform) {
						platform = new Platform({ id: platformName.id, name: platformName.name })
						await platform.save()
						console.log(`Platform ${platform.name} created successfully`)
					}
					platformIds.push(platform._id as Types.ObjectId)  // Cast a Types.ObjectId
				}

				const genreNames = parseJSON(game.genres, 'genres', [])
				const genreIds: Types.ObjectId[] = []
				for (const genreName of genreNames) {
					let genre = await Genre.findOne({ id: genreName.id })
					if (!genre) {
						genre = new Genre({ id: genreName.id, name: genreName.name })
						await genre.save()
						console.log(`Genre ${genre.name} created successfully`)
					}
					genreIds.push(genre._id as Types.ObjectId)  // Cast a Types.ObjectId
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
