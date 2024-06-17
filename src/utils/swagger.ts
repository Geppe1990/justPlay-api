import swaggerJsDoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"
import { Express } from "express"

const swaggerOptions = {
	swaggerDefinition: {
		openapi: "3.0.0",
		info: {
			title: "Video Games API",
			version: "1.0.0",
			description: "API for managing video games",
			contact: {
				name: "Developer",
				email: "developer@example.com",
			},
		},
		servers: [
			{
				url: "http://localhost:3000",
				description: "Local server",
			},
		],
		components: {
			schemas: {
				Game: {
					type: "object",
					required: ["id", "name"],
					properties: {
						id: {
							type: "integer",
							description: "The game ID",
						},
						name: {
							type: "string",
							description: "The name of the game",
						},
						summary: {
							type: "string",
							description: "A summary of the game",
						},
						release_dates: {
							type: "array",
							items: {
								type: "string",
								format: "date",
							},
							description: "The release dates of the game",
						},
						genres: {
							type: "array",
							items: {
								type: "string",
							},
							description: "The genres of the game",
						},
						platforms: {
							type: "array",
							items: {
								type: "string",
							},
							description:
								"The platforms the game is available on",
						},
					},
				},
			},
		},
	},
	apis: ["./src/routes/*.ts"],
}

const swaggerDocs = swaggerJsDoc(swaggerOptions)

export const setupSwagger = (app: Express) => {
	app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))
}
