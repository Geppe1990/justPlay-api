import { Router, Request } from "express"
import Game from "../models/Game"
import Genre from "../models/Genre"  // Importa il modello Genre
import Platform from "../models/Platform"  // Importa il modello Platform

const router = Router()

// Funzione per costruire l'URL completo
const buildUrl = (req: Request, page: number): string => {
	const url = new URL(`${req.protocol}://${req.get("host")}${req.baseUrl}${req.path}`)
	url.searchParams.set("page", page.toString())
	return url.toString()
}

// Endpoint per ottenere tutti i giochi con paginazione
router.get("/", async (req, res) => {
	try {
		const page = parseInt(req.query.page as string) || 1
		const limit = parseInt(req.query.limit as string) || 10
		const skip = (page - 1) * limit

		const totalGames = await Game.countDocuments()
		console.log(`Total games: ${totalGames}`)  // Log totale dei giochi

		// Trova i giochi e popola i riferimenti
		const games = await Game.find().skip(skip).limit(limit).populate('genres').populate('platforms')
		console.log(`Fetched games: ${games.length}`)  // Log giochi recuperati

		const totalPages = Math.ceil(totalGames / limit)
		const nextPage = page < totalPages ? buildUrl(req, page + 1) : null
		const prevPage = page > 1 ? buildUrl(req, page - 1) : null

		res.json({
			page,
			limit,
			totalPages,
			totalGames,
			next: nextPage,
			prev: prevPage,
			games
		})
	} catch (err) {
		console.error(err)  // Log errori
		res.status(500).send(err)
	}
})

// Endpoint per ottenere un gioco specifico per ID
router.get("/:id", async (req, res) => {
	try {
		const game = await Game.findOne({ id: Number(req.params.id) }).populate('genres').populate('platforms')
		if (!game) {
			return res.status(404).send("Game not found")
		}
		res.json(game)
	} catch (err) {
		res.status(500).send(err)
	}
})

// Endpoint per cercare giochi per nome
router.get("/search/:name", async (req, res) => {
	try {
		const name = req.params.name
		const games = await Game.find({ name: new RegExp(name, "i") }).populate('genres').populate('platforms')
		if (games.length === 0) {
			return res.status(404).send("No games found with the given name")
		}
		res.json(games)
	} catch (err) {
		res.status(500).send(err)
	}
})

export default router
