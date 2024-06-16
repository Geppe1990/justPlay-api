import { Request, Response } from "express"
import gameService from "../services/gameService"
import logger from "../utils/logger"

const buildUrl = (req: Request, page: number): string => {
	const url = new URL(`${req.protocol}://${req.get("host")}${req.baseUrl}${req.path}`)
	url.searchParams.set("page", page.toString())
	return url.toString()
}

const getAllGames = async (req: Request, res: Response) => {
	try {
		const page = parseInt(req.query.page as string) || 1
		const limit = parseInt(req.query.limit as string) || 10
		const result = await gameService.getAllGames(page, limit)

		const nextPage = page < result.totalPages ? buildUrl(req, page + 1) : null
		const prevPage = page > 1 ? buildUrl(req, page - 1) : null

		logger.info("Fetched games", { page, limit, total: result.totalGames })

		res.json({
			...result,
			next: nextPage,
			prev: prevPage
		})
	} catch (err) {
		const error = err as Error
		logger.error("Error fetching games", { error: error.message })
		res.status(500).send({ error: error.message })
	}
}

const getGameById = async (req: Request, res: Response) => {
	try {
		const game = await gameService.getGameById(Number(req.params.id))
		if (!game) {
			logger.warn("Game not found", { id: req.params.id })
			return res.status(404).send("Game not found")
		}
		logger.info("Fetched game by ID", { id: req.params.id })
		res.json(game)
	} catch (err) {
		const error = err as Error
		logger.error("Error fetching game by ID", { id: req.params.id, error: error.message })
		res.status(500).send({ error: error.message })
	}
}

const searchGamesByName = async (req: Request, res: Response) => {
	try {
		const name = req.params.name
		const games = await gameService.searchGamesByName(name)
		if (games.length === 0) {
			logger.warn("No games found with the given name", { name })
			return res.status(404).send("No games found with the given name")
		}
		logger.info("Fetched games by name", { name, count: games.length })
		res.json(games)
	} catch (err) {
		const error = err as Error
		logger.error("Error searching games by name", { name, error: error.message })
		res.status(500).send({ error: error.message })
	}
}

export default {
	getAllGames,
	getGameById,
	searchGamesByName
}
