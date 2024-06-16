import { Router } from "express"
import gameController from "../controllers/gameController"

const router = Router()

// Endpoint per ottenere tutti i giochi con paginazione
router.get("/", gameController.getAllGames)

// Endpoint per ottenere un gioco specifico per ID
router.get("/:id", gameController.getGameById)

// Endpoint per cercare giochi per nome
router.get("/search/:name", gameController.searchGamesByName)

export default router
