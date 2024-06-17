import { Request, Response, NextFunction } from "express"
import logger from "../utils/logger"

const errorHandler = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	logger.error("Unhandled error", { error: err.message, stack: err.stack })
	res.status(500).send({ error: err.message })
}

export default errorHandler
