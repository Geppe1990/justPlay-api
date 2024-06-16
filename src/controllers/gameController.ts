import { Request, Response } from "express"
import gameService from "../services/gameService"

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

		res.json({
			...result,
			next: nextPage,
			prev: prevPage
		})
	} catch (err) {
		console.error(err)  // Log errori
		res.status(500).send(err)
	}
}

const getGameById = async (req: Request, res: Response) => {
	try {
		const game = await gameService.getGameById(Number(req.params.id))
		if (!game) {
			return res.status(404).send("Game not found")
		}
		res.json(game)
	} catch (err) {
		res.status(500).send(err)
	}
}

const searchGamesByName = async (req: Request, res: Response) => {
	try {
		const name = req.params.name
		const games = await gameService.searchGamesByName(name)
		if (games.length === 0) {
			return res.status(404).send("No games found with the given name")
		}
		res.json(games)
	} catch (err) {
		res.status(500).send(err)
	}
}

export default {
	getAllGames,
	getGameById,
	searchGamesByName
}
