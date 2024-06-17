import client from 'prom-client'
import { Request, Response, NextFunction } from 'express'

// Colleziona le metriche di default di Prometheus
const collectDefaultMetrics = client.collectDefaultMetrics
collectDefaultMetrics()

// Definisce un contatore per le richieste HTTP
const requestCounter = new client.Counter({
	name: 'api_requests_total',
	help: 'Total number of API requests',
	labelNames: ['method', 'route', 'status']
})

export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
	res.on('finish', () => {
		requestCounter.inc({ method: req.method, route: req.path, status: res.statusCode })
	})
	next()
}

export const metricsEndpoint = async (req: Request, res: Response) => {
	try {
		res.set('Content-Type', client.register.contentType)
		res.end(await client.register.metrics())
	} catch (ex) {
		res.status(500).end(ex)
	}
}
