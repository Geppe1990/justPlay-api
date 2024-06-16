import { Request, Response } from "express"
import Game from "../models/Game"

// Funzione per costruire l'URL completo
const buildUrl = (req: Request, page: number): string => {
	const url = new URL(`${req.protocol}://${req.get("host")}${req.baseUrl}${req.path}`)
	url.searchParams.set("page", page.toString())
	return url.toString()
}

const getAllGames = async (page: number, limit: number) => {
	const skip = (page - 1) * limit
	const totalGames = await Game.countDocuments()
	const games = await Game.find().skip(skip).limit(limit).populate('genres').populate('platforms')
	const totalPages = Math.ceil(totalGames / limit)
	return {
		page,
		limit,
		totalPages,
		totalGames,
		games
	}
}

const getGameById = async (id: number) => {
	return Game.findOne({ id }).populate('genres').populate('platforms')
}

const searchGamesByName = async (name: string) => {
	return Game.find({ name: new RegExp(name, "i") }).populate('genres').populate('platforms')
}

export default {
	getAllGames,
	getGameById,
	searchGamesByName
}
