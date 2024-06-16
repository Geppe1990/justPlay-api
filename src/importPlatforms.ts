import mongoose from "mongoose"
import fs from "fs"
import csv from "csv-parser"
import Platform from "./models/Platform"

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

const platformsSet = new Set<{ id: number, name: string }>()

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
		const platforms = parseJSON(data.platforms, 'platforms', [])
		platforms.forEach((platform: { id: number, name: string }) => {
			platformsSet.add(platform)
		})
	})
	.on("end", async () => {
		for (const platform of platformsSet) {
			try {
				const existingPlatform = await Platform.findOne({ id: platform.id })
				if (existingPlatform) {
					console.log(`Platform with id ${platform.id} already exists, skipping.`)
					continue
				}

				const newPlatform = new Platform({
					id: platform.id,
					name: platform.name
				})
				await newPlatform.save()
				console.log(`Platform ${newPlatform.name} saved successfully`)
			} catch (error) {
				console.error(`Failed to save platform ${platform.name}:`, error)
			}
		}
		console.log("Data imported successfully")
		mongoose.connection.close()
	})
