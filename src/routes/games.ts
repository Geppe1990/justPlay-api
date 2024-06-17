import { Router } from "express"
import gameController from "../controllers/gameController"

const router = Router()

/**
 * @swagger
 * /games:
 *   get:
 *     summary: Retrieve a list of games
 *     description: Retrieve a paginated list of games.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number to retrieve.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: The number of items to retrieve per page.
 *     responses:
 *       200:
 *         description: A list of games.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 totalGames:
 *                   type: integer
 *                 next:
 *                   type: string
 *                   nullable: true
 *                 prev:
 *                   type: string
 *                   nullable: true
 *                 games:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Game'
 */
router.get("/", gameController.getAllGames)

/**
 * @swagger
 * /games/{id}:
 *   get:
 *     summary: Retrieve a game by ID
 *     description: Retrieve a game by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The game ID.
 *     responses:
 *       200:
 *         description: A game object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       404:
 *         description: Game not found.
 */
router.get("/:id", gameController.getGameById)

/**
 * @swagger
 * /games/search/{name}:
 *   get:
 *     summary: Search games by name
 *     description: Search for games by name.
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the game.
 *     responses:
 *       200:
 *         description: A list of games matching the search criteria.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Game'
 *       404:
 *         description: No games found with the given name.
 */
router.get("/search/:name", gameController.searchGamesByName)

export default router
